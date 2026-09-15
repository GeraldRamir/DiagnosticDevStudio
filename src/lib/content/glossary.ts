export type GlossaryTerm = {
  term: string;
  group: "Presencia" | "Captación" | "Operación" | "Medición";
  definition: string;
  /** Por qué le importa a un negocio pequeño. */
  why: string;
};

export const GLOSSARY: readonly GlossaryTerm[] = [
  {
    term: "Presencia digital",
    group: "Presencia",
    definition:
      "El conjunto de lugares donde un cliente puede encontrarte en internet: perfil social, sitio web, fichas de mapas y canales de contacto.",
    why: "Si alguien te busca y no encuentra nada actualizado, asume que ya no operas.",
  },
  {
    term: "Bio",
    group: "Presencia",
    definition:
      "El texto corto del perfil de una red social. Explica quién eres, qué ofreces y qué debe hacer quien te visita.",
    why: "Es lo único que lee alguien que llega por primera vez a tu perfil.",
  },
  {
    term: "Enlace directo",
    group: "Captación",
    definition:
      "Una dirección que abre una acción concreta, como un chat de WhatsApp con el mensaje ya escrito.",
    why: "Cada paso que le quitas al cliente aumenta la cantidad de mensajes que recibes.",
  },
  {
    term: "Código QR",
    group: "Captación",
    definition:
      "Un cuadro de puntos que, al escanearse con la cámara, lleva a una dirección digital.",
    why: "Conecta lo físico (mesa, vitrina, factura) con tu menú, catálogo o chat.",
  },
  {
    term: "Llamado a la acción",
    group: "Captación",
    definition:
      "La instrucción concreta que le das al visitante: escríbenos, reserva, ve el menú, pide ahora.",
    why: "Sin una instrucción clara, la mayoría de las visitas no hacen nada.",
  },
  {
    term: "Embudo",
    group: "Captación",
    definition:
      "El camino que recorre una persona desde que te descubre hasta que compra, con menos gente en cada paso.",
    why: "Te permite ver en qué punto exacto se están perdiendo los clientes.",
  },
  {
    term: "Conversión",
    group: "Medición",
    definition:
      "Que alguien complete la acción que buscabas: escribirte, reservar, comprar o dejar sus datos.",
    why: "Es la medida que importa; el alcance sin conversión no paga la renta.",
  },
  {
    term: "Tasa de conversión",
    group: "Medición",
    definition:
      "El porcentaje de visitantes que completan la acción. Si de 100 visitas te escriben 4, tu tasa es 4%.",
    why: "Sube más rápido arreglando el perfil que consiguiendo más visitas.",
  },
  {
    term: "Alcance",
    group: "Medición",
    definition: "La cantidad de personas distintas que vieron una publicación o un perfil.",
    why: "Es el punto de partida, no el resultado: mucha gente viendo y nadie escribiendo es una señal.",
  },
  {
    term: "Interacción",
    group: "Medición",
    definition:
      "Las acciones que hacen las personas sobre tu contenido: guardar, comentar, compartir, responder.",
    why: "Guardados y mensajes predicen ventas mucho mejor que los me gusta.",
  },
  {
    term: "Menú digital",
    group: "Operación",
    definition:
      "Una versión de tu carta que vive en internet y se abre desde el celular, normalmente con un QR.",
    why: "Cambias precios el mismo día, sin reimprimir nada.",
  },
  {
    term: "Catálogo",
    group: "Operación",
    definition:
      "El listado ordenado de lo que vendes, con precio y descripción, listo para compartir.",
    why: "Evita repetir precios uno por uno en cada conversación.",
  },
  {
    term: "Automatización",
    group: "Operación",
    definition:
      "Hacer que una tarea repetitiva ocurra sola: un mensaje de bienvenida, un recordatorio, un registro.",
    why: "Libera tu tiempo para lo que sí necesita una persona: vender y atender.",
  },
  {
    term: "Digitalización",
    group: "Operación",
    definition:
      "Pasar procesos del papel o la memoria a herramientas digitales que puedas consultar y compartir.",
    why: "Reduce errores y te deja ver cómo va el negocio sin tener que estar presente.",
  },
  {
    term: "Diagnóstico digital",
    group: "Medición",
    definition:
      "Una evaluación de en qué punto está tu negocio en presencia, captación y operación.",
    why: "Sirve para decidir qué arreglar primero en vez de intentarlo todo a la vez.",
  },
  {
    term: "Dato de contacto",
    group: "Captación",
    definition:
      "La forma que deja un interesado para que lo vuelvas a buscar: teléfono, correo o usuario.",
    why: "Es lo único que te queda de una visita que todavía no compró.",
  },
];

export const GLOSSARY_GROUPS = [
  "Presencia",
  "Captación",
  "Operación",
  "Medición",
] as const;
