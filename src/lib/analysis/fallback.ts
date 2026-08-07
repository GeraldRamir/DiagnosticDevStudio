import type {
  HoursResult,
  NarrativeFinding,
  NarrativeResult,
  ScoringResult,
  Signal,
  SoftwareRecommendations,
} from "./types";

type Block = {
  title: string;
  whatWeFound: string;
  whyItMatters: string;
  severity: NarrativeFinding["severity"];
  pillar: string;
};

type TemplateContext = {
  signals: Signal[];
  scores: ScoringResult;
  hours: HoursResult;
};

function fill(template: string, ctx: TemplateContext, signal: Signal): string {
  const perf = ctx.signals.find((s) => s.id === "rendimiento.performance");
  const lcp = ctx.signals.find((s) => s.id === "rendimiento.lcp");

  return template
    .replaceAll("{evidence}", signal.evidence)
    .replaceAll("{horasMes}", String(ctx.hours.horasMes))
    .replaceAll("{automatizable}", String(ctx.hours.automatizable))
    .replaceAll("{globalScore}", String(ctx.scores.globalScore))
    .replaceAll("{scoreLabel}", ctx.scores.scoreLabel)
    .replaceAll("{presencia}", String(ctx.scores.pillars.presencia.score))
    .replaceAll("{presenciaMax}", String(ctx.scores.pillars.presencia.max))
    .replaceAll("{rendimiento}", String(ctx.scores.pillars.rendimiento.score))
    .replaceAll("{captacion}", String(ctx.scores.pillars.captacion.score))
    .replaceAll("{operacion}", String(ctx.scores.pillars.operacion.score))
    .replaceAll("{datos}", String(ctx.scores.pillars.datos.score))
    .replaceAll("{perfEvidence}", perf?.evidence ?? "velocidad no medida")
    .replaceAll("{lcpEvidence}", lcp?.evidence ?? "tiempo de carga no medido");
}

const BLOCKS: Record<string, Block> = {
  "presencia.has_website": {
    title: "Sin sitio web propio",
    whatWeFound:
      "El negocio no tiene sitio web. Presencia quedó en {presencia}/{presenciaMax}.",
    whyItMatters:
      "Quien busca en Google o pide un enlace formal no tiene un lugar estable para conocerte y decidir.",
    severity: "alta",
    pillar: "Presencia",
  },
  "presencia.no_site_cap": {
    title: "Presencia digital limitada",
    whatWeFound:
      "Sin sitio web, el pilar Presencia no puede superar 6/25. Hoy está en {presencia}/{presenciaMax}.",
    whyItMatters:
      "La captación depende de redes o referencias, difíciles de medir y de escalar.",
    severity: "alta",
    pillar: "Presencia",
  },
  "presencia.reachable": {
    title: "El sitio no responde",
    whatWeFound: "{evidence}. Eso ya es un hallazgo del diagnóstico.",
    whyItMatters:
      "Si el visitante no puede abrir el sitio, cada intento de contacto se pierde antes de empezar.",
    severity: "alta",
    pillar: "Presencia",
  },
  "presencia.own_domain": {
    title: "Dominio no profesional",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Un subdominio gratuito transmite provisionalidad y debilita la confianza frente a proveedores o clientes nuevos.",
    severity: "media",
    pillar: "Presencia",
  },
  "presencia.https": {
    title: "Conexión no segura",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Navegadores marcan el sitio como no seguro; eso frena formularios y pedidos.",
    severity: "alta",
    pillar: "Presencia",
  },
  "presencia.indexable": {
    title: "Señales básicas de búsqueda incompletas",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Sin título y descripción claros, el negocio aparece peor (o no aparece) cuando alguien te busca.",
    severity: "media",
    pillar: "Presencia",
  },
  "rendimiento.performance": {
    title: "Velocidad móvil baja",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "En celular, cada segundo de espera aumenta el abandono antes de ver el menú, precios o el botón de contacto.",
    severity: "alta",
    pillar: "Rendimiento",
  },
  "rendimiento.lcp": {
    title: "Contenido principal tarda en aparecer",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Si lo importante tarda, el visitante asume que el negocio no está listo o no es confiable.",
    severity: "alta",
    pillar: "Rendimiento",
  },
  "rendimiento.viewport": {
    title: "No adaptado a celular",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "La mayoría llega desde el teléfono; una vista rota corta la conversión al instante.",
    severity: "alta",
    pillar: "Rendimiento",
  },
  "rendimiento.na": {
    title: "Rendimiento no medible",
    whatWeFound:
      "Sin sitio web no hay métricas de velocidad. Esos puntos se redistribuyeron a Captación y Operación.",
    whyItMatters:
      "No se puede optimizar lo que no existe: primero hace falta un canal digital medible.",
    severity: "media",
    pillar: "Rendimiento",
  },
  "captacion.instagram": {
    title: "Instagram no analizado",
    whatWeFound: "{evidence}",
    whyItMatters:
      "Sin perfil medible pierdes visibilidad en un canal clave de descubrimiento local.",
    severity: "baja",
    pillar: "Captación",
  },
  "captacion.ig_followers": {
    title: "Base de seguidores limitada",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Poca audiencia reduce el alcance orgánico y la prueba social ante nuevos clientes.",
    severity: "media",
    pillar: "Captación",
  },
  "captacion.ig_activity": {
    title: "Poca actividad en Instagram",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Perfiles con pocas publicaciones transmiten inactividad y pierden confianza.",
    severity: "media",
    pillar: "Captación",
  },
  "captacion.ig_bio_link": {
    title: "Sin link en biografía",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Sin enlace en bio, el tráfico de Instagram no llega a WhatsApp, web ni catálogo.",
    severity: "media",
    pillar: "Captación",
  },
  "captacion.ig_private": {
    title: "Cuenta privada",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Las cuentas privadas limitan el descubrimiento por hashtags y recomendaciones.",
    severity: "baja",
    pillar: "Captación",
  },
  "captacion.whatsapp": {
    title: "Sin enlace directo a WhatsApp",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "El cliente tiene que copiar el número o buscarte; cada paso extra reduce mensajes recibidos.",
    severity: "alta",
    pillar: "Captación",
  },
  "captacion.form": {
    title: "Sin formulario de contacto claro",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Quien no usa WhatsApp no tiene un camino simple para dejar sus datos.",
    severity: "media",
    pillar: "Captación",
  },
  "captacion.og": {
    title: "Vista previa pobre al compartir",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Cuando alguien reparte tu enlace, se ve incompleto y genera menos clics.",
    severity: "media",
    pillar: "Captación",
  },
  "captacion.cta": {
    title: "Falta un llamado a la acción claro",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "El visitante no sabe qué hacer después de mirar: pedir, reservar o escribir.",
    severity: "alta",
    pillar: "Captación",
  },
  "captacion.no_site_cta": {
    title: "Captación dependiente de canales frágiles",
    whatWeFound: "{evidence}. Captación: {captacion} puntos.",
    whyItMatters:
      "Sin un lugar propio para convertir, el crecimiento depende de algoritmos y memoria de clientes.",
    severity: "alta",
    pillar: "Captación",
  },
  "captacion.orders_whatsapp": {
    title: "Pedidos solo por chat",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Funciona al inicio, pero no escala: se mezclan ventas, dudas y seguimiento en un solo hilo.",
    severity: "media",
    pillar: "Captación",
  },
  "operacion.order_channel": {
    title: "Pedidos en canales manuales",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Cada pedido depende de que alguien lea, anote y confirme; crecen los errores cuando hay pico de demanda.",
    severity: "alta",
    pillar: "Operación",
  },
  "operacion.record_keeping": {
    title: "Registro débil de clientes y ventas",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Sin un registro confiable no sabes quién compró, qué falta cobrar o qué producto se mueve.",
    severity: "alta",
    pillar: "Operación",
  },
  "operacion.team_vs_manual": {
    title: "Equipo pequeño con carga administrativa alta",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Las horas se van en tareas repetitivas en lugar de atender clientes o vender.",
    severity: "alta",
    pillar: "Operación",
  },
  "operacion.hours_lost": {
    title: "Muchas horas administrativas al mes",
    whatWeFound:
      "Estimamos ~{horasMes} h/mes en admin; ~{automatizable} h podrían automatizarse.",
    whyItMatters:
      "Ese tiempo no aparece en la factura, pero sí en el cansancio del dueño y en ventas no hechas.",
    severity: "alta",
    pillar: "Operación",
  },
  "datos.analytics": {
    title: "Sin medición de visitas",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "No puedes saber qué páginas convierten ni de dónde vienen los clientes.",
    severity: "media",
    pillar: "Datos",
  },
  "datos.registro": {
    title: "Datos de negocio dispersos o ausentes",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Sin datos ordenados, las decisiones se toman a ojo y se repiten los mismos cuellos de botella.",
    severity: "media",
    pillar: "Datos",
  },
  "datos.reportabilidad": {
    title: "Difícil generar reportes confiables",
    whatWeFound: "{evidence}.",
    whyItMatters:
      "Cerrar el mes o responder “¿cómo vamos?” toma horas en lugar de minutos.",
    severity: "baja",
    pillar: "Datos",
  },
};

const SEVERITY_RANK: Record<NarrativeFinding["severity"], number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

function defaultBlock(signal: Signal): Block {
  return {
    title: signal.label.slice(0, 60),
    whatWeFound: signal.evidence,
    whyItMatters:
      "Este punto reduce la capacidad del negocio de captar o operar con claridad.",
    severity: signal.status === "fail" ? "alta" : "media",
    pillar:
      signal.pillar === "captacion"
        ? "Captación"
        : signal.pillar.charAt(0).toUpperCase() + signal.pillar.slice(1),
  };
}

/** Bloques disponibles por signal.id — útil para validar cobertura en tests. */
export const FALLBACK_BLOCK_IDS = Object.keys(BLOCKS);

export function generateSoftwareRecommendations(
  signals: Signal[],
  scores: ScoringResult,
  hours: HoursResult,
): SoftwareRecommendations {
  const items: SoftwareRecommendations["items"] = [];

  const orderChannel = signals.find((s) => s.id === "operacion.order_channel");
  const recordKeeping = signals.find((s) => s.id === "operacion.record_keeping");
  const hasWebsite = signals.find((s) => s.id === "presencia.website");
  const analytics = signals.find((s) => s.id === "datos.analytics");

  if (orderChannel?.status !== "ok") {
    items.push({
      category: "CRM / Pedidos",
      recommendation: "Sistema centralizado de pedidos (idealmente integrado con WhatsApp)",
      why: "Los pedidos llegan por canales manuales y eso genera errores y retrabajo en picos de demanda.",
    });
  }

  if (recordKeeping?.status !== "ok") {
    items.push({
      category: "Facturación e inventario",
      recommendation: "Software de facturación con control de stock y reportes",
      why: "El registro actual (papel o Excel) no escala y dificulta saber márgenes y existencias en tiempo real.",
    });
  }

  if (hasWebsite?.status !== "ok") {
    items.push({
      category: "Presencia digital",
      recommendation: "Sitio web o landing con catálogo, contacto y pedidos",
      why: "Sin un canal propio medible, dependes solo de redes y pierdes captación orgánica.",
    });
  }

  if (analytics?.status !== "ok") {
    items.push({
      category: "Analítica",
      recommendation: "Panel de métricas de ventas, tráfico y conversión",
      why: "Sin datos centralizados, las decisiones se toman a ciegas.",
    });
  }

  if (items.length < 2) {
    items.push({
      category: "Automatización operativa",
      recommendation: "Herramientas de flujos para tareas repetitivas (recordatorios, confirmaciones, reportes)",
      why: `Hay ~${hours.automatizable} h/mes recuperables si reduces trabajo manual repetitivo.`,
    });
  }

  const summary =
    scores.globalScore <= 59
      ? "Prioriza ordenar pedidos y datos antes de crecer: una base operativa clara evita perder ventas."
      : "Tu stack ideal combina captación digital, registro confiable y visibilidad de métricas para escalar con control.";

  return { summary, items: items.slice(0, 4) };
}

/**
 * Narrativa determinística: selecciona las 5 peores señales y rellena plantillas.
 * Mismo contrato que la respuesta de Gemini.
 */
export function generateFallbackNarrative(
  signals: Signal[],
  scores: ScoringResult,
  hours: HoursResult,
): NarrativeResult {
  const ctx: TemplateContext = { signals, scores, hours };

  const candidates = signals
    .filter((s) => s.status === "fail" || s.status === "warn")
    .sort((a, b) => {
      const statusRank =
        (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1);
      if (statusRank !== 0) return statusRank;
      return b.weight - a.weight;
    });

  const selected =
    candidates.length > 0 ? candidates.slice(0, 5) : signals.slice(0, 5);

  const findings: NarrativeFinding[] = selected.map((signal) => {
    const block = BLOCKS[signal.id] ?? defaultBlock(signal);
    return {
      title: fill(block.title, ctx, signal).slice(0, 60),
      severity: block.severity,
      whatWeFound: fill(block.whatWeFound, ctx, signal),
      whyItMatters: fill(block.whyItMatters, ctx, signal),
      pillar: block.pillar,
    };
  });

  while (findings.length < 5) {
    findings.push({
      title: "Oportunidad de orden operativo",
      severity: "baja",
      whatWeFound: `Puntaje global ${scores.globalScore}/100 (${scores.scoreLabel}).`,
      whyItMatters:
        "Hay margen para documentar procesos y reducir fricción semanal.",
      pillar: "Operación",
    });
  }

  findings.sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  );

  const top = findings[0];
  const headline =
    scores.globalScore <= 39
      ? "El negocio opera con fricción alta y captación frágil"
      : scores.globalScore <= 59
        ? "Hay bases, pero varios huecos frenan el crecimiento"
        : scores.globalScore <= 79
          ? "Funciona, con oportunidades claras de orden y captación"
          : "Base sólida, con ajustes puntuales para ganar eficiencia";

  const summary = `El diagnóstico ubica al negocio en ${scores.globalScore}/100 (${scores.scoreLabel}). Destaca: ${top?.title ?? "revisar operación"}. Estimamos ~${hours.horasMes} horas administrativas al mes, de las cuales ~${hours.automatizable} podrían automatizarse.`;

  const quickWin =
    top?.pillar === "Captación"
      ? "Esta semana: publica un enlace directo de WhatsApp en tu perfil y en cualquier página donde te encuentren."
      : top?.pillar === "Presencia"
        ? "Esta semana: verifica que tu enlace público abra en celular y muestre nombre, qué ofreces y cómo contactarte."
        : top?.pillar === "Rendimiento"
          ? "Esta semana: abre tu sitio en celular con datos móviles y anota qué tarda más de 3 segundos en verse."
          : "Esta semana: lista las 3 tareas administrativas que más repites y anota cuántas veces las haces.";

  return {
    headline,
    summary,
    findings: findings.slice(0, 5),
    quickWin,
    softwareRecommendations: generateSoftwareRecommendations(signals, scores, hours),
  };
}
