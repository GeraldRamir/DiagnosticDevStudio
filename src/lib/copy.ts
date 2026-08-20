/** Textos de interfaz centralizados — español neutro LatAm */
export const copy = {
  landing: {
    nav: {
      howItWorks: "Cómo funciona",
      whatWeMeasure: "Qué medimos",
      industries: "Industrias",
      report: "El reporte",
      cases: "Casos de uso",
      faq: "FAQ",
      privacy: "Privacidad",
      badge: "Gratis",
    },
    headerDropdown: {
      tagline: "Herramienta de medición para dueños de negocio en LatAm",
      pillars: [
        { name: "Presencia", desc: "Sitio, dominio, HTTPS" },
        { name: "Rendimiento", desc: "Velocidad móvil, LCP" },
        { name: "Captación", desc: "WhatsApp, formularios, OG" },
        { name: "Operación", desc: "Canales, registro, equipo" },
        { name: "Datos", desc: "Analytics y reportabilidad" },
      ],
      featured: {
        pillars: {
          label: "Destacado",
          title: "5 pilares de medición",
          desc: "Presencia, rendimiento, captación, operación y datos — puntaje de 0 a 100.",
          cta: "Ver qué medimos",
          href: "#que-medimos",
        },
        industries: {
          label: "Destacado",
          title: "6+ industrias",
          desc: "Restaurantes, gimnasios, clínicas, distribuidoras, retail y servicios.",
          cta: "Explorar industrias",
          href: "#industrias",
        },
        cases: {
          label: "Destacado",
          title: "Casos reales",
          desc: "Patrones que vemos en negocios de LatAm sin importar el tamaño.",
          cta: "Ver ejemplos",
          href: "#casos",
        },
      },
      visitLabel: "Explorar",
      citiesLabel: "Verticales",
      industries: [
        "Restaurantes",
        "Gimnasios y centros deportivos",
        "Clínicas y consultorios",
        "Distribuidoras",
        "Tiendas y retail",
        "Servicios profesionales",
      ],
      cases: [
        { title: "Sin sitio web", desc: "Captación solo por WhatsApp" },
        { title: "Operación manual", desc: "Pedidos y registro en Excel" },
        { title: "Sitio lento", desc: "Pérdida de clientes en móvil" },
      ],
      more: [
        { href: "#faq", label: "FAQ" },
        { href: "/privacidad", label: "Privacidad" },
      ],
      stats: [
        { value: "2 min", label: "Para completar" },
        { value: "5", label: "Hallazgos clave" },
        { value: "100", label: "Puntos medidos" },
      ],
      steps: [
        "Respondes 4 pasos cortos",
        "Analizamos tu negocio en segundos",
        "Recibes reporte con URL única",
      ],
    },
    heroGradient: "Diagnóstico digital",
    heroTitle: "para tu negocio en tiempo real",
    heroDescription:
      "Diagnóstico DevStudio analiza presencia web, operación y captación de tu negocio, y te entrega un reporte con hallazgos concretos — sin notas manuales ni suposiciones.",
    ctaPrimary: "Diagnóstico gratis en 2 min",
    ctaSecondary: "Ver un ejemplo",
    bullets: [
      "2 minutos para completar",
      "Sin tarjeta de crédito",
      "Reporte al instante",
    ] as const,
    banner: {
      promo:
        "Disfruta el diagnóstico completo gratis durante tus primeros 3 meses",
      countdown: "21 días restantes",
      link: "Empezar prueba de 14 días",
      logos: [
        { id: "shells" as const, name: "SHELLS", lowercase: false },
        { id: "smartfinder" as const, name: "SmartFinder", lowercase: false },
        { id: "zoomerr" as const, name: "Zoomerr", lowercase: false },
        { id: "kontrastr" as const, name: "kontrastr", lowercase: true },
        {
          id: "wavesmarathon" as const,
          name: "WAVESMARATHON",
          lowercase: false,
        },
      ],
    },
    rating: "Puntaje en vivo",
    mockupTitle: "Reporte de madurez",
    ai: {
      badge: "Motor de IA",
      title: "Una IA que diagnostica tu negocio en segundos",
      subtitle:
        "Combina datos técnicos reales con inteligencia artificial para traducir métricas complejas en hallazgos que puedes actuar hoy.",
      features: [
        {
          title: "Análisis técnico automático",
          desc: "Si tienes sitio web, medimos velocidad, SEO y señales móviles con Google PageSpeed.",
        },
        {
          title: "IA que redacta, no inventa",
          desc: "Gemini transforma los datos ya medidos en un reporte claro — el puntaje es determinístico.",
        },
        {
          title: "Privacidad desde el diseño",
          desc: "Tu nombre, correo y teléfono nunca se envían al motor de IA. Solo lo necesario para redactar.",
        },
      ],
      feed: [
        "Recibiendo respuestas del negocio…",
        "Escaneando presencia digital…",
        "Midiendo velocidad móvil (LCP)…",
        "Evaluando captación y operación…",
        "Calculando puntaje de madurez…",
        "Generando 5 hallazgos con IA…",
        "Reporte listo — URL única generada",
      ],
    },
    pillars: {
      eyebrow: "Qué medimos",
      title: "5 pilares que definen tu madurez digital",
      subtitle:
        "Cada pilar se puntúa de 0 a 100. El resultado global es determinístico: mismos datos, mismo resultado.",
    },
    report: {
      eyebrow: "El reporte",
      title: "Un dashboard claro, no un PDF genérico",
      subtitle:
        "Recibes una URL única con puntaje, hallazgos priorizados, horas perdidas al mes y una acción concreta para esta semana.",
      cta: "Ver un ejemplo",
      mockup: {
        business: "Restaurante La Esquina",
        meta: "Restaurante · México",
        headline:
          "Tu operación depende demasiado de WhatsApp manual",
        kpis: [
          { value: "41", label: "Puntaje global", suffix: "/100" },
          { value: "47", label: "Horas perdidas", suffix: "hrs/mes" },
          { value: "3", label: "Críticos", suffix: "" },
          { value: "P34", label: "vs industria", suffix: "" },
        ],
        findings: [
          { severity: "critical", title: "Sin formulario de captación", desc: "El 100% de leads depende de WhatsApp manual." },
          { severity: "warn", title: "Sitio lento en móvil", desc: "LCP de 4.2s — pierdes clientes antes de ver el menú." },
          { severity: "good", title: "Dominio con HTTPS", desc: "Tu sitio transmite confianza básica." },
        ],
      },
    },
    howItWorks: {
      eyebrow: "Cómo funciona",
      title: "De respuestas a reporte en 3 pasos",
      subtitle: "Menos de 2 minutos. Sin tarjeta. Sin llamadas de venta dentro del reporte.",
      steps: [
        {
          num: "01",
          title: "Respondes 4 pasos",
          desc: "Operación, presencia digital, captación y datos básicos de tu negocio.",
        },
        {
          num: "02",
          title: "La IA analiza en segundos",
          desc: "Motor determinístico + redacción con Gemini. Si tienes sitio, medimos señales técnicas reales.",
        },
        {
          num: "03",
          title: "Recibes tu reporte",
          desc: "URL única con puntaje, hallazgos, horas perdidas y quick win accionable.",
        },
      ],
    },
    industries: {
      eyebrow: "Industrias",
      title: "Diseñado para negocios de LatAm",
      subtitle: "El diagnóstico se adapta a tu vertical — restaurantes, gimnasios, clínicas y más.",
    },
    cases: {
      eyebrow: "Casos de uso",
      title: "Patrones que vemos todos los días",
      subtitle: "No importa el tamaño: estos son los escenarios más comunes que diagnosticamos.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Cuánto tarda el diagnóstico?",
          a: "Menos de 2 minutos. Respondes 4 pantallas cortas y el reporte se genera al instante.",
        },
        {
          q: "¿Es realmente gratis?",
          a: "Sí. No pedimos tarjeta. El reporte es gratis; la conversación comercial es opcional y viene después.",
        },
        {
          q: "¿Qué analizan exactamente?",
          a: "Tu operación declarada y, si tienes sitio web, señales técnicas reales medidas con Google PageSpeed: velocidad, SEO, accesibilidad y adaptación a móvil.",
        },
        {
          q: "¿Qué pasa con mis datos?",
          a: "Tu nombre, correo, teléfono y el nombre del negocio nunca se envían al motor de IA. Puedes ver el detalle en la política de privacidad.",
        },
        {
          q: "¿Para quién está pensado?",
          a: "Dueños de restaurantes, gimnasios, clínicas, distribuidoras, tiendas y servicios profesionales en LatAm.",
        },
      ],
    },
    cta: {
      title: "Descubre el puntaje de tu negocio",
      subtitle: "Diagnóstico gratis en 2 minutos. Reporte al instante con hallazgos que puedes actuar hoy.",
      button: "Empezar diagnóstico gratis",
    },
    doodi: {
      bento: {
        title: "Medición estructurada de tu operación digital",
        subtitle:
          "Evaluamos presencia, captación y procesos con criterios definidos. El detalle cuantitativo se entrega en el reporte — aquí solo el marco de trabajo.",
        meta: ["2 min estimados", "5 dimensiones", "Sin tarjeta"] as const,
        card1: {
          label: "Entrada",
          title: "Formulario de 4 pasos",
          desc: "Operación, presencia web, captación y datos básicos.",
          detail: "Progreso guardado en el navegador",
          steps: ["Operación", "Presencia", "Captación", "Datos"] as const,
        },
        card2: {
          label: "Entregable",
          title: "Reporte con URL única",
          link: "Ver estructura del reporte",
          desc: "Documento persistente con hallazgos priorizados y recomendación accionable.",
          detail: "Enlace permanente · exportable a PDF",
          includes: ["Puntaje global", "5 hallazgos", "Quick win"] as const,
        },
        card3: {
          label: "Marco",
          title: "Cinco dimensiones",
          desc: "Cada eje se evalúa de forma independiente con criterios fijos.",
          detail: "Ponderación determinística · 0–100",
          tags: ["Presencia", "Rendimiento", "Captación", "Operación", "Datos"] as const,
        },
        card4: {
          label: "Salida",
          title: "Redacción asistida",
          desc: "Los hallazgos se elaboran a partir de datos ya calculados.",
          detail: "El puntaje no depende del texto generado",
        },
        card5: {
          title: "Acceso sin costo",
          desc: "Diagnóstico y reporte completos · Dueños de negocio en LatAm",
          cta: "Iniciar diagnóstico",
        },
      },
      motor: {
        title: "Conoce nuestro motor de diagnóstico con IA",
        slides: [
          {
            name: "PageSpeed Engine",
            role: "Análisis técnico",
            headline: "Análisis técnico automático",
            quote:
              "Si tienes sitio web, medimos velocidad, SEO y señales móviles con Google PageSpeed en segundos.",
            image:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop",
          },
          {
            name: "Gemini Redactor",
            role: "IA que redacta",
            headline: "IA que redacta, no inventa",
            quote:
              "Gemini transforma los datos ya medidos en hallazgos claros. El puntaje es determinístico: mismos datos, mismo resultado.",
            image:
              "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop",
          },
          {
            name: "Pilar Score",
            role: "5 dimensiones",
            headline: "5 pilares de madurez digital",
            quote:
              "Presencia, rendimiento, captación, operación y datos — cada uno con puntaje de 0 a 100 y detalle expandible.",
            image:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop",
          },
          {
            name: "Industry Fit",
            role: "Por vertical",
            headline: "Adaptado a tu industria",
            quote:
              "Restaurantes, gimnasios, clínicas, distribuidoras, retail y servicios. El diagnóstico habla tu idioma.",
            image:
              "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=800&fit=crop",
          },
          {
            name: "Privacy Shield",
            role: "Privacidad",
            headline: "Privacidad desde el diseño",
            quote:
              "Tu nombre, correo y teléfono nunca se envían al motor de IA. Solo viaja lo necesario para redactar.",
            image:
              "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=800&fit=crop",
          },
        ],
      },
      stats: [
        { value: "2", unit: "min", title: "Para completar", desc: "4 pasos cortos. Sin tarjeta de crédito." },
        { value: "5", unit: "", title: "Pilares medidos", desc: "Presencia, rendimiento, captación, operación y datos." },
        { value: "100", unit: "", title: "Puntos de análisis", desc: "Puntaje global determinístico de 0 a 100." },
      ],
      highlight: {
        title: "Diagnóstico completo gratis para tu negocio",
        desc: "Recibe una URL única con puntaje, hallazgos priorizados, horas perdidas al mes y una acción concreta para esta semana.",
        cta: "Empezar diagnóstico gratis",
      },
      faqSection: {
        title: "Controla la madurez digital de tu negocio con claridad",
        cta: "Ver más FAQs",
      },
      faqChart: {
        title: "Engagement",
        users: "321",
        usersLabel: "negocios diagnosticados",
      },
    },
    footer: {
      tagline: "Diagnóstico digital para dueños de negocio en LatAm. Claridad primero; la conversación comercial, después.",
      watermark: "DEVSTUDIO",
      columns: {
        pages: {
          title: "Páginas",
          links: [
            { href: "/", label: "Inicio" },
            { href: "/diagnostico", label: "Diagnóstico" },
            { href: "#que-medimos", label: "Qué medimos" },
            { href: "#como-funciona", label: "Cómo funciona" },
            { href: "#recursos", label: "Preguntas" },
          ],
        },
        utility: {
          title: "Legal",
          links: [
            { href: "/privacidad", label: "Privacidad" },
            { href: "#recursos", label: "Preguntas frecuentes" },
            { href: "#", label: "Términos de servicio" },
          ],
        },
        social: {
          title: "Redes",
          links: [
            { href: "https://instagram.com", label: "Instagram", external: true },
            { href: "https://linkedin.com", label: "LinkedIn", external: true },
            { href: "https://x.com", label: "X", external: true },
          ],
        },
      },
      copyright: "© Todos los derechos reservados.",
      product: "Producto",
      company: "Empresa",
      legal: "Legal",
      links: {
        diagnostico: "Diagnóstico gratis",
        report: "Qué analizamos",
        about: "Nosotros",
        faq: "Preguntas frecuentes",
        privacy: "Privacidad",
        contact: "Contacto",
      },
    },
  },
  liveSamples: [
    { industry: "Distribuidora", country: "Rep. Dominicana", score: 41 },
    { industry: "Gimnasio", country: "México", score: 58 },
    { industry: "Restaurante", country: "Colombia", score: 33 },
    { industry: "Clínica", country: "Chile", score: 67 },
  ] as const,
  form: {
    progress: (step: number, total: number) => `Paso ${step} de ${total}`,
    back: "Volver al inicio",
    title: "Diagnóstico de madurez digital",
    subtitle:
      "Complete el cuestionario en cuatro secciones. Sus respuestas alimentan el análisis técnico y el reporte de hallazgos.",
    idPrefix: "DIAG",
    lastSaved: "Último guardado",
    saveDraft: "Guardar borrador",
    next: "Siguiente sección",
    prev: "Sección anterior",
    submit: "Generar diagnóstico",
    sidebar: {
      title: "Progreso del diagnóstico",
      reference: "Referencia",
      completion: "Completado",
      privacyNote:
        "Los datos de contacto se almacenan de forma segura y no se envían al motor de IA.",
    },
    steps: [
      {
        id: "operacion",
        label: "Operación",
        description: "Perfil operativo del negocio, equipo y registro de actividad.",
      },
      {
        id: "presencia",
        label: "Presencia digital",
        description: "Sitio web, dominio y presencia en canales digitales.",
      },
      {
        id: "captacion",
        label: "Captación",
        description: "Canales de contacto y principales fricciones operativas.",
      },
      {
        id: "datos",
        label: "Datos de contacto",
        description: "Información para entregar el reporte y dar seguimiento.",
      },
    ] as const,
    fields: {
      businessName: { label: "Nombre del negocio", placeholder: "Ej. Restaurante La Esquina" },
      industry: { label: "Industria", placeholder: "Selecciona tu industria" },
      country: { label: "País", placeholder: "Selecciona tu país" },
      teamSize: { label: "Tamaño del equipo", placeholder: "Selecciona" },
      weeklyHoursOnAdmin: { label: "Horas semanales en tareas admin", placeholder: "Selecciona" },
      recordKeeping: { label: "Cómo registras pedidos/ventas", placeholder: "Selecciona" },
      hasWebsite: { label: "¿Tienes sitio web?", placeholder: "Selecciona" },
      websiteUrl: { label: "URL del sitio web", placeholder: "https://tunegocio.com" },
      instagramHandle: {
        label: "Instagram",
        placeholder: "@tunegocio",
        connect: "Conectar cuenta (opcional — insights reales)",
        connected: "Conectado @{username}",
        hint: "Con el @ medimos datos públicos del perfil (seguidores, posts, actividad reciente). Conectar la cuenta es opcional y añade alcance e impresiones reales.",
        error:
          "No se pudo conectar Instagram. Puedes continuar solo con el @usuario. Si quieres conectar, verifica el Instagram App ID y la redirect URI en Meta.",
      },
      orderChannel: { label: "Canales de pedidos / contacto", hint: "Selecciona todos los que apliquen" },
      biggestTimeWaster: {
        label: "Mayor pérdida de tiempo",
        placeholder: "Ej. Responder WhatsApp uno por uno",
      },
      fullName: { label: "Nombre completo", placeholder: "Tu nombre" },
      email: { label: "Correo electrónico", placeholder: "tu@email.com" },
      whatsapp: { label: "WhatsApp", placeholder: "+52 55 1234 5678" },
      consent: {
        label: "Acepto el procesamiento de datos para generar mi diagnóstico",
        hint: "Tu nombre, correo y teléfono no se envían al motor de IA.",
      },
    },
  },
  report: {
    scoreLabels: {
      critical: "Crítico",
      fragile: "Frágil",
      functional: "Funcional",
      solid: "Sólido",
    } as const,
  },
} as const;
