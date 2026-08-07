import type {
  HoursResult,
  OrderChannel,
  RecordKeeping,
  WeeklyHours,
} from "./types";

const WEEKLY_MIDPOINTS: Record<WeeklyHours, number> = {
  menos_5: 2.5,
  "5_10": 7.5,
  "10_20": 15,
  mas_20: 25,
};

const SEMANAS_MES = 4.33;
const AUTOMATIZABLE_RATIO = 0.55;

export type HoursInput = {
  weeklyHoursOnAdmin: WeeklyHours;
  recordKeeping: RecordKeeping;
  orderChannel: OrderChannel[];
};

/**
 * Estima horas administrativas perdidas al mes de forma conservadora y transparente.
 * Nunca inventa cifras de dinero — solo horas.
 */
export function calculateHoursLost(input: HoursInput): HoursResult {
  const baseWeekly = WEEKLY_MIDPOINTS[input.weeklyHoursOnAdmin];
  const factores: HoursResult["desglose"]["factores"] = [
    {
      id: "base",
      label: "Punto medio de horas semanales declaradas",
      value: 1,
    },
  ];

  let multiplicador = 1.0;

  if (input.recordKeeping === "papel") {
    multiplicador += 0.3;
    factores.push({
      id: "papel",
      label: "Registro en papel (+30%)",
      value: 0.3,
    });
  } else if (input.recordKeeping === "excel") {
    multiplicador += 0.15;
    factores.push({
      id: "excel",
      label: "Registro en Excel/Sheets (+15%)",
      value: 0.15,
    });
  }

  const hasWhatsApp = input.orderChannel.includes("whatsapp");
  const hasSistema = input.orderChannel.includes("sistema");
  if (hasWhatsApp && !hasSistema) {
    multiplicador += 0.2;
    factores.push({
      id: "whatsapp_sin_sistema",
      label: "Pedidos por WhatsApp sin sistema (+20%)",
      value: 0.2,
    });
  }

  if (input.orderChannel.includes("llamada")) {
    multiplicador += 0.1;
    factores.push({
      id: "llamada",
      label: "Canal telefónico (+10%)",
      value: 0.1,
    });
  }

  const horasMes = round1(baseWeekly * multiplicador * SEMANAS_MES);
  const automatizable = round1(horasMes * AUTOMATIZABLE_RATIO);

  return {
    horasMes,
    automatizable,
    desglose: {
      baseWeekly,
      multiplicador: round2(multiplicador),
      factores,
      semanasMes: SEMANAS_MES,
    },
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
