import type { ToolId } from "@/types/tools";

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  /** Minutos de lectura aproximados. */
  minutes: number;
  level: "Básico" | "Intermedio";
  steps: { title: string; body: string }[];
  checklist: string[];
  toolId: ToolId;
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "primera-semana-en-internet",
    title: "Cómo poner tu negocio en internet en una semana",
    summary:
      "Un orden de trabajo para pasar de no tener presencia digital a que un cliente pueda encontrarte, entenderte y escribirte.",
    minutes: 6,
    level: "Básico",
    toolId: "diagnostico-digital",
    steps: [
      {
        title: "Día 1 — Define en una frase qué vendes y a quién",
        body: "Antes de abrir cuentas, escribe una frase que diga qué ofreces, para quién y dónde operas. Esa frase va a repetirse en tu perfil, en tu mensaje de WhatsApp y en tu menú. Si no la tienes clara, cada canal dirá algo distinto y el cliente se pierde.",
      },
      {
        title: "Día 2 — Reúne lo mínimo indispensable",
        body: "Necesitas cuatro cosas: un logo o una foto reconocible, tres fotos reales de tu producto o local, tu horario y tu forma de contacto. No hace falta una sesión profesional; una cámara de celular con buena luz natural resuelve.",
      },
      {
        title: "Día 3 — Abre el canal donde ya están tus clientes",
        body: "No abras cinco redes a la vez. Elige la que tus clientes ya usan y trabájala bien. Para la mayoría de negocios locales, eso es Instagram para mostrar y WhatsApp para vender.",
      },
      {
        title: "Día 4 — Haz que te puedan escribir en un toque",
        body: "Un número escrito en una publicación obliga al cliente a copiarlo y buscarte. Un enlace directo abre el chat con el mensaje ya escrito. Esa diferencia es la que se nota en la cantidad de conversaciones que recibes.",
      },
      {
        title: "Día 5 — Conecta el mundo físico con el digital",
        body: "Un código QR en la puerta, en la mesa, en la factura o en la bolsa lleva a quien ya está contigo hacia tu catálogo o tu chat. Es el puente más barato entre lo que ya tienes y lo digital.",
      },
      {
        title: "Días 6 y 7 — Mide y corrige",
        body: "Revisa cuántas personas te escribieron y por qué canal. Lo que no se mide se repite igual. Con dos o tres datos ya puedes decidir dónde poner tu esfuerzo la semana siguiente.",
      },
    ],
    checklist: [
      "Una frase clara de qué vendes y a quién",
      "Tres fotos reales y un horario visible",
      "Un canal de contacto directo, sin fricción",
      "Un QR que conecte tu local con tu canal digital",
    ],
  },
  {
    slug: "whatsapp-que-vende",
    title: "Cómo convertir WhatsApp en tu canal de ventas",
    summary:
      "WhatsApp ya es donde te escriben tus clientes. La diferencia entre responder y vender está en cómo preparas la conversación.",
    minutes: 5,
    level: "Básico",
    toolId: "whatsapp-generator",
    steps: [
      {
        title: "Quita la fricción de iniciar la conversación",
        body: "Un enlace directo con mensaje precargado hace que el cliente solo tenga que pulsar enviar. Reduce el esfuerzo del primer paso, que es donde más gente abandona.",
      },
      {
        title: "Escribe un mensaje inicial que te dé contexto",
        body: 'En vez de "Hola", precarga algo como "Hola, quiero información sobre…". Así sabes desde el primer segundo qué necesita el cliente y respondes sin ir y venir.',
      },
      {
        title: "Prepara respuestas para las tres preguntas de siempre",
        body: "Precio, horario y ubicación concentran la mayoría de los mensajes. Tener esas respuestas escritas y listas te ahorra tiempo y evita que respondas distinto cada vez.",
      },
      {
        title: "Define un tiempo de respuesta y cúmplelo",
        body: "No necesitas responder al instante; necesitas responder cuando dijiste que ibas a responder. Si tardas más de un día, la venta normalmente ya se fue a otro lado.",
      },
      {
        title: "Lleva el enlace a todas partes",
        body: "Perfil de Instagram, firma de correo, tarjeta, QR en el mostrador. El mismo enlace en todos lados: menos explicaciones y más conversaciones.",
      },
    ],
    checklist: [
      "Enlace directo con mensaje precargado",
      "Respuestas listas para precio, horario y ubicación",
      "Un tiempo de respuesta declarado y realista",
      "El enlace publicado en todos tus canales",
    ],
  },
  {
    slug: "instagram-que-convierte",
    title: "Instagram que convierte: perfil, contenido y respuesta",
    summary:
      "Seguidores no es lo mismo que clientes. Este es el orden en que conviene arreglar un perfil de negocio.",
    minutes: 6,
    level: "Intermedio",
    toolId: "instagram-analyzer",
    steps: [
      {
        title: "Arregla primero la bio, no el contenido",
        body: "La bio es lo único que ve alguien que llega por primera vez. Debe decir qué haces, para quién y qué debe hacer la persona ahora. Si la bio no convierte, publicar más no lo arregla.",
      },
      {
        title: "Un solo destino en el enlace",
        body: "Cuando el perfil ofrece cinco caminos, el visitante no elige ninguno. Deja un destino principal: tu chat, tu menú o tu catálogo.",
      },
      {
        title: "Las tres primeras publicaciones son tu vitrina",
        body: "Quien entra a tu perfil mira la primera fila y decide. Asegúrate de que ahí se vea qué vendes, a qué precio aproximado y cómo se compra.",
      },
      {
        title: "Publica menos, pero responde siempre",
        body: "Un perfil que responde mensajes y comentarios en el día convierte más que uno que publica a diario y deja la bandeja llena. La conversación es donde ocurre la venta.",
      },
      {
        title: "Guarda lo que funcione en destacadas",
        body: "Precios, ubicación, testimonios y proceso de compra en destacadas responden solas las preguntas repetidas y te quitan trabajo.",
      },
    ],
    checklist: [
      "Bio con oferta, público y siguiente paso",
      "Un único enlace, con un destino claro",
      "Primera fila del perfil que muestre producto y precio",
      "Destacadas con precios, ubicación y proceso",
    ],
  },
  {
    slug: "del-menu-impreso-al-digital",
    title: "Del menú impreso al menú digital con QR",
    summary:
      "Cambiar precios sin reimprimir, mostrar fotos reales y actualizar en minutos. Lo que hay que preparar antes de imprimir el código.",
    minutes: 5,
    level: "Básico",
    toolId: "menu-digital",
    steps: [
      {
        title: "Ordena el menú antes de digitalizarlo",
        body: "Un menú digital desordenado es peor que uno impreso. Agrupa por categorías reales, pon primero lo que más vendes y deja fuera lo que casi nadie pide.",
      },
      {
        title: "Escribe precios claros y sin sorpresas",
        body: "Si hay variaciones por tamaño o acompañamiento, dilas en el propio producto. Cada duda que no resuelve el menú termina siendo una pregunta al personal.",
      },
      {
        title: "Usa fotos solo si son buenas",
        body: "Una foto real y bien iluminada vende. Una foto oscura o vieja resta. Si no tienes buenas fotos de todo, es mejor un menú sin fotos que uno a medias.",
      },
      {
        title: "Coloca el QR donde ya mira el cliente",
        body: "Mesa, mostrador, vitrina y bolsa de delivery. Acompáñalo de una línea corta que diga qué va a encontrar: 'Escanea para ver el menú y precios'.",
      },
      {
        title: "Actualiza el día que cambien los precios",
        body: "La ventaja del menú digital es esa. Si lo dejas desactualizado, pierdes la única razón por la que dejaste el papel.",
      },
    ],
    checklist: [
      "Categorías ordenadas por lo que más vendes",
      "Precios con sus variaciones explicadas",
      "Fotos reales o ninguna foto",
      "QR visible en mesa, mostrador y delivery",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
