export type DiagnosticAnswerValue = "yes" | "no" | "partial";

export type DiagnosticQuestion = {
  id: string;
  text: string;
  strength: string;
  opportunity: string;
  recommendation: string;
};

export const DIAGNOSTIC_QUESTIONS: readonly DiagnosticQuestion[] = [
  {
    id: "website",
    text: "¿Tu negocio tiene página web?",
    strength: "Ya cuentas con una página web como punto de partida digital.",
    opportunity: "Todavía no tienes una página web propia.",
    recommendation:
      "Una web clara, rápida y con un CTA de contacto suele ser el canal más creíble para convertir visitas en clientes.",
  },
  {
    id: "instagram",
    text: "¿Tu negocio tiene Instagram?",
    strength: "Tu negocio ya está presente en Instagram.",
    opportunity: "Aún no usas Instagram como canal de negocio.",
    recommendation:
      "Un perfil de Instagram ordenado, con bio comercial y contenido útil, puede captar clientes todos los días.",
  },
  {
    id: "whatsapp-business",
    text: "¿Tienes WhatsApp Business?",
    strength: "Ya usas WhatsApp Business para atender clientes.",
    opportunity: "Todavía no tienes WhatsApp Business configurado.",
    recommendation:
      "WhatsApp Business con mensaje de bienvenida, catálogo y un enlace único reduce fricción al primer contacto.",
  },
  {
    id: "google-business",
    text: "¿Tienes Google Business Profile?",
    strength: "Tu negocio es visible en Google Maps y búsquedas locales.",
    opportunity: "Aún no estás en Google Business Profile.",
    recommendation:
      "Reclama tu ficha de Google, agrega fotos, horario y un botón de WhatsApp o web para aparecer cuando te busquen cerca.",
  },
  {
    id: "online-catalog",
    text: "¿Tus clientes pueden consultar tus productos/servicios online?",
    strength: "Tus clientes ya pueden consultar tu oferta en línea.",
    opportunity: "Tus productos o servicios aún no se consultan con facilidad online.",
    recommendation:
      "Publica un catálogo, menú o lista de servicios que se pueda abrir desde el celular sin pedir información extra.",
  },
  {
    id: "digital-menu",
    text: "¿Tienes un catálogo o menú digital?",
    strength: "Ya tienes un catálogo o menú digital.",
    opportunity: "Todavía dependes de PDFs, fotos sueltas o explicaciones verbales.",
    recommendation:
      "Un menú digital actualizable y con precios claros acelera pedidos y reduce mensajes repetitivos.",
  },
  {
    id: "digital-payments",
    text: "¿Aceptas pagos digitales?",
    strength: "Ya aceptas pagos digitales.",
    opportunity: "El cobro todavía depende demasiado del efectivo o transferencias manuales.",
    recommendation:
      "Ofrece al menos una vía digital (transferencia con instrucciones claras, pasarela o botón de pago) para no perder ventas.",
  },
  {
    id: "crm",
    text: "¿Tienes algún sistema para gestionar clientes?",
    strength: "Ya registras y das seguimiento a tus clientes.",
    opportunity: "La relación con clientes todavía vive en chats sueltos o memoria.",
    recommendation:
      "Aunque sea una hoja o un CRM simple, registra nombre, canal y último contacto para dar seguimiento.",
  },
  {
    id: "sales-control",
    text: "¿Controlas digitalmente tus ventas?",
    strength: "Ya controlas tus ventas de forma digital.",
    opportunity: "Aún no tienes un registro digital de ventas.",
    recommendation:
      "Llevar ventas en un sistema o planilla te permite ver qué se mueve, cuándo y cuánto estás dejando de cobrar.",
  },
  {
    id: "automations",
    text: "¿Utilizas automatizaciones?",
    strength: "Ya usas automatizaciones para ahorrar tiempo operativo.",
    opportunity: "Todavía haces a mano tareas que se pueden automatizar.",
    recommendation:
      "Empieza por respuestas automáticas, recordatorios y un enlace único de contacto. Luego puedes conectar sistemas más completos.",
  },
];

export const DIAGNOSTIC_SCORE_VALUES: Record<DiagnosticAnswerValue, number> = {
  yes: 1,
  partial: 0.5,
  no: 0,
};

export const DIAGNOSTIC_ANSWER_LABELS: Record<DiagnosticAnswerValue, string> = {
  yes: "Sí",
  partial: "Parcialmente",
  no: "No",
};
