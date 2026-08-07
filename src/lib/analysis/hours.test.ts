import { describe, expect, it } from "vitest";
import { calculateHoursLost } from "./hours";

describe("calculateHoursLost", () => {
  it("calcula base * multiplicador * 4.33 de forma determinística", () => {
    const result = calculateHoursLost({
      weeklyHoursOnAdmin: "5_10",
      recordKeeping: "excel",
      orderChannel: ["whatsapp"],
    });

    // base 7.5, +0.15 excel, +0.20 whatsapp sin sistema => 1.35
    // 7.5 * 1.35 * 4.33 = 43.84125 → 43.8
    expect(result.desglose.baseWeekly).toBe(7.5);
    expect(result.desglose.multiplicador).toBe(1.35);
    expect(result.horasMes).toBe(43.8);
    expect(result.automatizable).toBe(24.1);
  });

  it("aplica factor de papel y llamada", () => {
    const result = calculateHoursLost({
      weeklyHoursOnAdmin: "menos_5",
      recordKeeping: "papel",
      orderChannel: ["llamada", "persona"],
    });

    // base 2.5, +0.30 papel, +0.10 llamada => 1.4
    // 2.5 * 1.4 * 4.33 = 15.155 → 15.2
    expect(result.desglose.multiplicador).toBe(1.4);
    expect(result.horasMes).toBe(15.2);
  });

  it("no suma whatsapp si ya hay sistema", () => {
    const result = calculateHoursLost({
      weeklyHoursOnAdmin: "10_20",
      recordKeeping: "software",
      orderChannel: ["whatsapp", "sistema"],
    });

    expect(result.desglose.multiplicador).toBe(1);
    expect(result.horasMes).toBe(65);
  });

  it("mismos inputs producen el mismo resultado", () => {
    const input = {
      weeklyHoursOnAdmin: "mas_20" as const,
      recordKeeping: "papel" as const,
      orderChannel: ["whatsapp", "llamada"] as const,
    };
    const a = calculateHoursLost({
      ...input,
      orderChannel: [...input.orderChannel],
    });
    const b = calculateHoursLost({
      ...input,
      orderChannel: [...input.orderChannel],
    });
    expect(a).toEqual(b);
  });
});
