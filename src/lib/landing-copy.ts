/** Textos de la landing promocional — español neutro LatAm */
export const lp = {
  nav: [
    { label: "Qué medimos", href: "#que-medimos" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "El reporte", href: "#reporte" },
    { label: "Recursos", href: "#recursos" },
  ],
  navSecondary: { label: "Ver un ejemplo", href: "#reporte" },
  navCta: { label: "Empezar gratis", href: "/diagnostico" },

  /** Paneles desplegables del header (hover en desktop) */
  navMenus: {
    measure: {
      label: "Qué medimos",
      href: "#que-medimos",
      featured: {
        title: "5 pilares de madurez",
        desc: "Presencia, rendimiento, captación, operación y datos — puntaje determinístico de 0 a 100.",
        cta: "Ver el marco completo",
        href: "#que-medimos",
      },
      groups: [
        {
          heading: "Pilares",
          items: [
            { title: "Presencia", desc: "Sitio, dominio e HTTPS", href: "#que-medimos" },
            { title: "Rendimiento", desc: "Velocidad móvil y LCP", href: "#que-medimos" },
            { title: "Captación", desc: "Formularios, WhatsApp y OG", href: "#que-medimos" },
          ],
        },
        {
          heading: "También medimos",
          items: [
            { title: "Operación", desc: "Canales, registro y equipo", href: "#que-medimos" },
            { title: "Datos", desc: "Analytics y reportabilidad", href: "#que-medimos" },
            { title: "Señales reales", desc: "Evidencia, no opinión", href: "#reporte" },
          ],
        },
      ],
    },
    how: {
      label: "Cómo funciona",
      href: "#como-funciona",
      featured: {
        title: "De respuestas a reporte",
        desc: "Cuatro pasos cortos, análisis en segundos y una URL permanente con hallazgos accionables.",
        cta: "Ver el flujo",
        href: "#como-funciona",
      },
      groups: [
        {
          heading: "Pasos",
          items: [
            { title: "01 · Operación", desc: "Perfil y carga administrativa", href: "#como-funciona" },
            { title: "02 · Presencia", desc: "Sitio y canales digitales", href: "#como-funciona" },
            { title: "03 · Captación", desc: "Fricciones y contacto", href: "#como-funciona" },
          ],
        },
        {
          heading: "Entrega",
          items: [
            { title: "04 · Datos", desc: "Correo para enviar el reporte", href: "#como-funciona" },
            { title: "URL única", desc: "Enlace permanente del informe", href: "#reporte" },
            { title: "Sin tarjeta", desc: "Gratis desde el primer uso", href: "/diagnostico" },
          ],
        },
      ],
    },
    report: {
      label: "El reporte",
      href: "#reporte",
      featured: {
        title: "Dashboard en vivo",
        desc: "Puntaje global, pilares, matriz de señales, hallazgos y sistemas recomendados.",
        cta: "Ver un ejemplo",
        href: "#reporte",
      },
      groups: [
        {
          heading: "Incluye",
          items: [
            { title: "Puntaje 0–100", desc: "Cálculo determinístico", href: "#reporte" },
            { title: "Hallazgos priorizados", desc: "Por impacto en el negocio", href: "#reporte" },
            { title: "Quick win", desc: "Una acción para esta semana", href: "#reporte" },
          ],
        },
        {
          heading: "Exportar",
          items: [
            { title: "PDF descargable", desc: "Listo para compartir", href: "#reporte" },
            { title: "Enlace permanente", desc: "No caduca", href: "#reporte" },
            { title: "Privacidad", desc: "Contacto nunca va a la IA", href: "/privacidad" },
          ],
        },
      ],
    },
  },

  hero: {
    titleTop: "Conoce la madurez digital",
    titleBottom: "de tu negocio en 2 minutos",
    subtitle:
      "Medimos presencia web, rendimiento móvil, captación, operación y datos. Recibes un reporte con puntaje, hallazgos priorizados y una acción concreta para esta semana.",
    ctaPrimary: { label: "Empezar diagnóstico — gratis", href: "/diagnostico" },
    ctaSecondary: { label: "Ver un reporte de ejemplo", href: "#reporte" },
    floatA: { value: "2 min", label: "Tiempo promedio para completarlo" },
    floatB: { value: "0–100", label: "Puntaje determinístico" },
    floatC: {
      title: "Comparte el reporte con un enlace",
      cta: "Copiar enlace",
    },
    floatD: { title: "Quick win de la semana", value: "Activar captación por formulario" },
  },

  industries: [
    "Restaurantes",
    "Gimnasios",
    "Clínicas",
    "Distribuidoras",
    "Retail",
    "Servicios",
    "Talleres",
    "Hoteles",
  ],

  features: {
    title: "Un diagnóstico diseñado",
    titleAccent: "para hacerte crecer",
    subtitle:
      "Datos técnicos reales, criterios fijos y una lectura ejecutiva que cualquiera en tu equipo puede accionar.",
    big: {
      badge: "Diagnóstico guiado",
      title: "Cuatro pasos, cero fricción",
      desc: "Respondes sobre operación, presencia digital, captación y datos de contacto. El progreso se guarda en tu navegador: puedes retomarlo cuando quieras.",
      cta: "Iniciar diagnóstico",
      tag: { value: "4", label: "pasos cortos" },
      steps: ["Operación", "Presencia", "Captación", "Datos"],
    },
    yellow: {
      badge: "Análisis técnico",
      title: "Medimos tu sitio, no lo suponemos",
      desc: "Si tienes sitio web, evaluamos velocidad móvil, LCP, SEO y accesibilidad con Google PageSpeed. Las señales llegan al reporte como evidencia, no como opinión.",
      cta: "Qué medimos",
      metrics: [
        { label: "LCP móvil", value: "4.2 s" },
        { label: "SEO", value: "78" },
        { label: "Accesibilidad", value: "91" },
      ],
    },
    lilac: {
      badge: "Entregable",
      title: "Un reporte vivo, no un PDF genérico",
      desc: "Recibes una URL única con puntaje global, cinco pilares, matriz de señales y sistemas recomendados. Exportable a PDF cuando lo necesites.",
      cta: "Ver el reporte",
      chips: ["Puntaje global", "5 pilares", "Señales medidas", "Quick win"],
    },
  },

  benchmarks: {
    badge: "Cómo se calcula",
    title: "Criterios fijos,",
    titleAccent: "resultados comparables",
    subtitle:
      "El puntaje es determinístico: los mismos datos producen siempre el mismo resultado. La IA redacta la lectura, nunca el número.",
    stats: [
      { value: "100", label: "Puntos repartidos entre cinco pilares" },
      { value: "13+", label: "Señales verificables por diagnóstico" },
      { value: "5", label: "Hallazgos priorizados por impacto" },
      { value: "0", label: "Datos de contacto enviados a la IA" },
    ],
  },

  results: {
    badge: "Casos de uso",
    title: "Patrones que vemos",
    titleAccent: "todos los días",
    cards: [
      {
        tag: "Sin sitio web",
        quote:
          "Toda la captación pasa por WhatsApp manual. Cuando el equipo se satura, los pedidos se pierden en la conversación.",
        source: "Restaurantes y comercios de barrio",
      },
      {
        tag: "Operación en Excel",
        quote:
          "El registro de ventas vive en hojas de cálculo distintas. Nadie puede responder cuánto se vendió la semana pasada sin recalcular.",
        source: "Distribuidoras y mayoristas",
      },
      {
        tag: "Sitio lento en móvil",
        quote:
          "La página tarda más de cuatro segundos en cargar. El cliente se va antes de ver la carta o el catálogo.",
        source: "Retail y servicios profesionales",
      },
    ],
    panel: {
      title: "Lo que devuelve el reporte",
      rows: [
        { value: "41/100", label: "Puntaje global del negocio" },
        { value: "47 h", label: "Horas administrativas al mes" },
        { value: "3", label: "Hallazgos críticos priorizados" },
      ],
    },
  },

  resources: {
    title: "Preguntas antes de empezar",
    subtitle: "Lo que suelen preguntarnos los dueños de negocio antes del primer diagnóstico.",
    items: [
      {
        tag: "Tiempo",
        title: "¿Cuánto tarda el diagnóstico?",
        desc: "Menos de 2 minutos. Cuatro pantallas cortas y el reporte se genera al instante en una URL propia.",
      },
      {
        tag: "Costo",
        title: "¿Es realmente gratis?",
        desc: "Sí. No pedimos tarjeta. El reporte completo es gratuito; la conversación comercial es opcional y viene después.",
      },
      {
        tag: "Privacidad",
        title: "¿Qué pasa con mis datos?",
        desc: "Nombre, correo y WhatsApp se guardan de forma segura y nunca se envían al motor de IA que redacta la narrativa.",
      },
    ],
    link: { label: "Leer la política de privacidad", href: "/privacidad" },
  },

  finalCta: {
    title: "Descubre el puntaje de tu negocio hoy",
    subtitle: "Gratis, sin tarjeta y con reporte al instante.",
    cta: { label: "Empezar diagnóstico gratis", href: "/diagnostico" },
    note: "2 minutos · sin tarjeta · reporte permanente",
  },

  footer: {
    tagline:
      "Diagnóstico digital para dueños de negocio en LatAm. Claridad primero; la conversación comercial, después.",
    websiteLabel: "devstuddio.netlify.app",
    columns: {
      product: {
        title: "Producto",
        links: [
          { href: "#que-medimos", label: "Qué medimos" },
          { href: "#como-funciona", label: "Cómo funciona" },
          { href: "#reporte", label: "El reporte" },
          { href: "/diagnostico", label: "Empezar diagnóstico" },
        ],
      },
      company: {
        title: "DevStudio",
        links: [
          { href: "https://devstuddio.netlify.app/", label: "Sitio oficial", external: true },
          { href: "#recursos", label: "Preguntas frecuentes" },
          { href: "/privacidad", label: "Privacidad" },
        ],
      },
    },
    copyright: "© DevStudio. Todos los derechos reservados.",
  },
} as const;
