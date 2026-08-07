import type {
  DiagnosticInput,
  HoursResult,
  PillarId,
  PillarScore,
  PillarScores,
  ScoreLabel,
  ScoringResult,
  Signal,
  TechnicalMetrics,
  InstagramMetrics,
} from "./types";

export type ScoringInput = {
  form: Pick<
    DiagnosticInput,
    | "hasWebsite"
    | "websiteUrl"
    | "instagramHandle"
    | "orderChannel"
    | "recordKeeping"
    | "weeklyHoursOnAdmin"
    | "teamSize"
    | "biggestTimeWaster"
  >;
  technical: TechnicalMetrics | null;
  instagram?: InstagramMetrics | null;
  hours: HoursResult;
};

const PILLAR_MAX: Record<PillarId, number> = {
  presencia: 25,
  rendimiento: 20,
  captacion: 20,
  operacion: 25,
  datos: 10,
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function sumWeights(
  signals: Signal[],
  statuses: Signal["status"][],
): number {
  return signals
    .filter((s) => statuses.includes(s.status))
    .reduce((acc, s) => acc + s.weight, 0);
}

function scoreFromSignals(signals: Signal[], max: number): number {
  const okWeight = sumWeights(signals, ["ok"]);
  const warnWeight = sumWeights(signals, ["warn"]);
  const totalWeight = signals.reduce((acc, s) => acc + s.weight, 0) || 1;
  const ratio = (okWeight + warnWeight * 0.5) / totalWeight;
  return Math.round(clamp(ratio * max, 0, max));
}

function labelForScore(score: number): ScoreLabel {
  if (score <= 39) return "Crítico";
  if (score <= 59) return "Frágil";
  if (score <= 79) return "Funcional";
  return "Sólido";
}

function buildPresencia(
  form: ScoringInput["form"],
  technical: TechnicalMetrics | null,
): PillarScore {
  const signals: Signal[] = [];
  const hasSite = form.hasWebsite === "yes";

  signals.push({
    id: "presencia.has_website",
    label: "Tiene sitio web",
    status: hasSite ? "ok" : form.hasWebsite === "social_only" ? "warn" : "fail",
    weight: 8,
    evidence: hasSite
      ? "Declaró tener sitio web"
      : form.hasWebsite === "social_only"
        ? "Solo redes sociales"
        : "Sin sitio web",
    pillar: "presencia",
  });

  if (hasSite && technical) {
    signals.push({
      id: "presencia.reachable",
      label: "Sitio responde",
      status: technical.reachable ? "ok" : "fail",
      weight: 5,
      evidence: technical.reachable
        ? `HTTP ${technical.httpStatus ?? "OK"}`
        : (technical.error ?? "No respondió"),
      pillar: "presencia",
    });

    signals.push({
      id: "presencia.own_domain",
      label: "Dominio propio",
      status:
        technical.isOwnDomain === true
          ? "ok"
          : technical.freeHostSubdomain
            ? "fail"
            : "warn",
      weight: 4,
      evidence:
        technical.isOwnDomain === true
          ? "Dominio propio detectado"
          : technical.freeHostSubdomain
            ? "Subdominio gratuito detectado"
            : "No se pudo confirmar dominio propio",
      pillar: "presencia",
    });

    signals.push({
      id: "presencia.https",
      label: "HTTPS activo",
      status: technical.isHttps === true ? "ok" : "fail",
      weight: 4,
      evidence:
        technical.isHttps === true
          ? "Conexión segura"
          : "Sin HTTPS o no medible",
      pillar: "presencia",
    });

    signals.push({
      id: "presencia.indexable",
      label: "Señal de indexación básica",
      status:
        technical.hasTitle && technical.hasMetaDescription
          ? "ok"
          : technical.hasTitle || technical.hasMetaDescription
            ? "warn"
            : "fail",
      weight: 4,
      evidence:
        technical.hasTitle && technical.hasMetaDescription
          ? "Title y descripción presentes"
          : "Faltan title y/o meta description",
      pillar: "presencia",
    });
  } else if (!hasSite) {
    signals.push({
      id: "presencia.no_site_cap",
      label: "Tope sin sitio web",
      status: "fail",
      weight: 17,
      evidence: "Sin sitio web el pilar Presencia queda limitado",
      pillar: "presencia",
    });
  }

  let score = scoreFromSignals(signals, PILLAR_MAX.presencia);
  if (!hasSite) {
    score = Math.min(score, 6);
  }

  return { score, max: PILLAR_MAX.presencia, signals };
}

function buildRendimiento(
  form: ScoringInput["form"],
  technical: TechnicalMetrics | null,
): PillarScore | null {
  if (form.hasWebsite !== "yes") {
    return null;
  }

  const signals: Signal[] = [];
  const t = technical;

  const perf = t?.performanceScore;
  signals.push({
    id: "rendimiento.performance",
    label: "Puntaje de velocidad (móvil)",
    status:
      perf == null
        ? "warn"
        : perf >= 0.7
          ? "ok"
          : perf >= 0.5
            ? "warn"
            : "fail",
    weight: 8,
    evidence:
      perf == null
        ? "No se pudo medir con PageSpeed"
        : `Performance ${(perf * 100).toFixed(0)}/100`,
    pillar: "rendimiento",
  });

  const lcp = t?.lcpSeconds;
  signals.push({
    id: "rendimiento.lcp",
    label: "Tiempo de carga del contenido principal",
    status:
      lcp == null ? "warn" : lcp <= 2.5 ? "ok" : lcp <= 4 ? "warn" : "fail",
    weight: 6,
    evidence:
      lcp == null
        ? "LCP no medido"
        : `Contenido principal en ${lcp.toFixed(1)} s`,
    pillar: "rendimiento",
  });

  signals.push({
    id: "rendimiento.viewport",
    label: "Adaptado a celular",
    status:
      t?.hasViewport === true
        ? "ok"
        : t?.hasViewport === false
          ? "fail"
          : "warn",
    weight: 6,
    evidence:
      t?.hasViewport === true
        ? "Viewport móvil detectado"
        : t?.hasViewport === false
          ? "Sin viewport móvil"
          : "Viewport no verificado",
    pillar: "rendimiento",
  });

  return {
    score: scoreFromSignals(signals, PILLAR_MAX.rendimiento),
    max: PILLAR_MAX.rendimiento,
    signals,
  };
}

function buildCaptacion(
  form: ScoringInput["form"],
  technical: TechnicalMetrics | null,
  instagram: InstagramMetrics | null,
): PillarScore {
  const signals: Signal[] = [];
  const hasSite = form.hasWebsite === "yes";
  const handle = form.instagramHandle?.trim();

  if (handle && instagram?.found) {
    signals.push({
      id: "captacion.instagram",
      label: "Perfil de Instagram activo",
      status: "ok",
      weight: 3,
      evidence: `@${instagram.username} · ${instagram.followers?.toLocaleString("es") ?? "?"} seguidores · ${instagram.posts ?? "?"} posts`,
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.ig_followers",
      label: "Base de seguidores",
      status:
        instagram.followers != null && instagram.followers >= 500
          ? "ok"
          : instagram.followers != null && instagram.followers >= 100
            ? "warn"
            : "fail",
      weight: 4,
      evidence:
        instagram.followers != null
          ? `${instagram.followers.toLocaleString("es")} seguidores medidos`
          : "Seguidores no disponibles",
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.ig_activity",
      label: "Actividad de publicaciones",
      status:
        instagram.posts != null && instagram.posts >= 12
          ? "ok"
          : instagram.posts != null && instagram.posts >= 3
            ? "warn"
            : "fail",
      weight: 3,
      evidence:
        instagram.posts != null
          ? `${instagram.posts} publicaciones en el perfil`
          : "Publicaciones no disponibles",
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.ig_bio_link",
      label: "Link en biografía",
      status: instagram.externalUrl ? "ok" : "warn",
      weight: 3,
      evidence: instagram.externalUrl
        ? `Link detectado: ${instagram.externalUrl}`
        : "Sin enlace externo en la biografía",
      pillar: "captacion",
    });

    if (instagram.isPrivate) {
      signals.push({
        id: "captacion.ig_private",
        label: "Cuenta privada",
        status: "warn",
        weight: 2,
        evidence: "Perfil privado — limita descubrimiento orgánico",
        pillar: "captacion",
      });
    }
  } else if (handle) {
    signals.push({
      id: "captacion.instagram",
      label: "Instagram declarado",
      status: "warn",
      weight: 3,
      evidence:
        instagram?.error ??
        `Handle @${handle.replace(/^@+/, "")} — perfil no accesible para análisis`,
      pillar: "captacion",
    });
  } else {
    signals.push({
      id: "captacion.instagram",
      label: "Instagram no declarado",
      status: "warn",
      weight: 3,
      evidence: "Sin handle de Instagram en el formulario",
      pillar: "captacion",
    });
  }

  if (hasSite && technical) {
    signals.push({
      id: "captacion.whatsapp",
      label: "Enlace a WhatsApp en el sitio",
      status: technical.hasWhatsAppLink === true ? "ok" : "fail",
      weight: 5,
      evidence:
        technical.hasWhatsAppLink === true
          ? "Se detectó enlace a WhatsApp"
          : "No se detectó enlace a WhatsApp",
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.form",
      label: "Formulario de contacto",
      status: technical.hasContactForm === true ? "ok" : "warn",
      weight: 4,
      evidence:
        technical.hasContactForm === true
          ? "Formulario con email/teléfono detectado"
          : "Sin formulario de contacto claro",
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.og",
      label: "Vista previa en redes (Open Graph)",
      status:
        technical.hasOgTitle && technical.hasOgImage
          ? "ok"
          : technical.hasOgTitle || technical.hasOgImage
            ? "warn"
            : "fail",
      weight: 4,
      evidence:
        technical.hasOgTitle && technical.hasOgImage
          ? "og:title y og:image presentes"
          : "Faltan datos Open Graph",
      pillar: "captacion",
    });

    signals.push({
      id: "captacion.cta",
      label: "Canal de captación digital",
      status:
        technical.hasWhatsAppLink || technical.hasContactForm ? "ok" : "fail",
      weight: 4,
      evidence:
        technical.hasWhatsAppLink || technical.hasContactForm
          ? "Hay al menos un CTA de contacto"
          : "Sin CTA de contacto detectable",
      pillar: "captacion",
    });
  } else {
    signals.push({
      id: "captacion.no_site_cta",
      label: "Captación sin sitio propio",
      status: form.hasWebsite === "social_only" ? "warn" : "fail",
      weight: 12,
      evidence:
        form.hasWebsite === "social_only"
          ? "Depende solo de redes sociales"
          : "Sin canal web de captación",
      pillar: "captacion",
    });

    if (form.orderChannel.includes("whatsapp")) {
      signals.push({
        id: "captacion.orders_whatsapp",
        label: "Pedidos por WhatsApp",
        status: "warn",
        weight: 5,
        evidence: "WhatsApp es canal de pedidos (sin sitio medible)",
        pillar: "captacion",
      });
    }
  }

  return {
    score: scoreFromSignals(signals, PILLAR_MAX.captacion),
    max: PILLAR_MAX.captacion,
    signals,
  };
}

function buildOperacion(
  form: ScoringInput["form"],
  hours: HoursResult,
): PillarScore {
  const signals: Signal[] = [];
  const hasSistema = form.orderChannel.includes("sistema");
  const channels = form.orderChannel.length;

  signals.push({
    id: "operacion.order_channel",
    label: "Canal de pedidos",
    status: hasSistema ? "ok" : channels >= 2 ? "warn" : "fail",
    weight: 7,
    evidence: hasSistema
      ? "Usa sistema/software para pedidos"
      : `Canales manuales: ${form.orderChannel.join(", ") || "ninguno"}`,
    pillar: "operacion",
  });

  signals.push({
    id: "operacion.record_keeping",
    label: "Registro de clientes/ventas",
    status:
      form.recordKeeping === "software"
        ? "ok"
        : form.recordKeeping === "excel"
          ? "warn"
          : "fail",
    weight: 7,
    evidence: `Registro: ${form.recordKeeping}`,
    pillar: "operacion",
  });

  const heavyAdmin =
    form.weeklyHoursOnAdmin === "10_20" ||
    form.weeklyHoursOnAdmin === "mas_20";
  const smallTeam = form.teamSize === "solo" || form.teamSize === "2_5";

  signals.push({
    id: "operacion.team_vs_manual",
    label: "Equipo vs. carga manual",
    status: heavyAdmin && smallTeam ? "fail" : heavyAdmin ? "warn" : "ok",
    weight: 6,
    evidence: `${form.teamSize} / ${form.weeklyHoursOnAdmin} h admin/semana`,
    pillar: "operacion",
  });

  signals.push({
    id: "operacion.hours_lost",
    label: "Horas administrativas estimadas",
    status:
      hours.horasMes >= 60 ? "fail" : hours.horasMes >= 35 ? "warn" : "ok",
    weight: 5,
    evidence: `~${hours.horasMes} h/mes; ~${hours.automatizable} h potencialmente automatizables`,
    pillar: "operacion",
  });

  return {
    score: scoreFromSignals(signals, PILLAR_MAX.operacion),
    max: PILLAR_MAX.operacion,
    signals,
  };
}

function buildDatos(
  form: ScoringInput["form"],
  technical: TechnicalMetrics | null,
): PillarScore {
  const signals: Signal[] = [];

  signals.push({
    id: "datos.analytics",
    label: "Analytics / pixel",
    status:
      form.hasWebsite === "yes"
        ? technical?.hasAnalytics === true
          ? "ok"
          : "fail"
        : "warn",
    weight: 4,
    evidence:
      technical?.hasAnalytics === true
        ? "Se detectó Analytics o Meta Pixel"
        : form.hasWebsite === "yes"
          ? "Sin Analytics/Pixel detectable"
          : "Sin sitio para medir analytics",
    pillar: "datos",
  });

  signals.push({
    id: "datos.registro",
    label: "Calidad del registro",
    status:
      form.recordKeeping === "software"
        ? "ok"
        : form.recordKeeping === "excel"
          ? "warn"
          : "fail",
    weight: 4,
    evidence: `Tipo de registro: ${form.recordKeeping}`,
    pillar: "datos",
  });

  signals.push({
    id: "datos.reportabilidad",
    label: "Capacidad de reportar",
    status:
      form.recordKeeping === "software"
        ? "ok"
        : form.recordKeeping === "excel"
          ? "warn"
          : "fail",
    weight: 2,
    evidence:
      form.recordKeeping === "software" || form.recordKeeping === "excel"
        ? "Puede exportar o consultar datos con esfuerzo"
        : "Difícil generar reportes confiables",
    pillar: "datos",
  });

  return {
    score: scoreFromSignals(signals, PILLAR_MAX.datos),
    max: PILLAR_MAX.datos,
    signals,
  };
}

/**
 * Calcula puntaje determinístico por pilares.
 * Sin sitio: Presencia ≤ 6/25; Rendimiento no aplica y se redistribuye
 * proporcionalmente entre Captación y Operación.
 */
export function calculateScores(input: ScoringInput): ScoringResult {
  const presencia = buildPresencia(input.form, input.technical);
  const rendimientoRaw = buildRendimiento(input.form, input.technical);
  const captacionBase = buildCaptacion(input.form, input.technical, input.instagram ?? null);
  const operacionBase = buildOperacion(input.form, input.hours);
  const datos = buildDatos(input.form, input.technical);

  let rendimiento: PillarScore;
  let captacion = captacionBase;
  let operacion = operacionBase;
  let rendimientoRedistributed = false;

  if (!rendimientoRaw) {
    rendimientoRedistributed = true;
    const redistributed = PILLAR_MAX.rendimiento;
    const captShare = PILLAR_MAX.captacion;
    const operShare = PILLAR_MAX.operacion;
    const total = captShare + operShare;
    const captBonus = Math.round((redistributed * captShare) / total);
    const operBonus = redistributed - captBonus;

    const captRatio = captacionBase.score / captacionBase.max;
    const operRatio = operacionBase.score / operacionBase.max;

    captacion = {
      ...captacionBase,
      max: captacionBase.max + captBonus,
      score: Math.round(captRatio * (captacionBase.max + captBonus)),
      redistributed: true,
    };
    operacion = {
      ...operacionBase,
      max: operacionBase.max + operBonus,
      score: Math.round(operRatio * (operacionBase.max + operBonus)),
      redistributed: true,
    };
    rendimiento = {
      score: 0,
      max: 0,
      signals: [
        {
          id: "rendimiento.na",
          label: "Rendimiento no aplica",
          status: "warn",
          weight: 0,
          evidence:
            "Sin sitio web: 20 puntos redistribuidos a Captación y Operación",
          pillar: "rendimiento",
        },
      ],
      redistributed: true,
    };
  } else {
    rendimiento = rendimientoRaw;
  }

  const pillars: PillarScores = {
    presencia,
    rendimiento,
    captacion,
    operacion,
    datos,
  };

  const globalScore = clamp(
    presencia.score +
      rendimiento.score +
      captacion.score +
      operacion.score +
      datos.score,
    0,
    100,
  );

  const signals = Object.values(pillars).flatMap((p) => p.signals);

  return {
    globalScore,
    scoreLabel: labelForScore(globalScore),
    pillars,
    signals,
    rendimientoRedistributed,
  };
}
