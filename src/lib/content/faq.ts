export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  title: string;
  items: FaqItem[];
};

export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    title: "Empezar",
    items: [
      {
        question: "¿Necesito crear una cuenta para usar las herramientas?",
        answer:
          "No. Todas las herramientas se usan directamente desde el navegador, sin registro ni contraseña. Entras, la usas y te llevas el resultado.",
      },
      {
        question: "¿Tienen costo?",
        answer:
          "No. Son gratuitas. Dev Studio las publica como una forma de mostrar cómo trabaja; si después necesitas algo a medida, ahí sí hay un servicio de por medio.",
      },
      {
        question: "¿Por dónde empiezo si no sé qué necesito?",
        answer:
          "Por el Diagnóstico Digital. Son unas preguntas cortas y al final te dice en qué punto está tu negocio y qué conviene atacar primero.",
      },
      {
        question: "¿Funcionan desde el celular?",
        answer:
          "Sí. Están pensadas para usarse desde el celular, que es donde la mayoría de los negocios pequeños trabajan el día a día.",
      },
    ],
  },
  {
    title: "Tus datos",
    items: [
      {
        question: "¿Qué pasa con la información que escribo?",
        answer:
          "Varias herramientas trabajan solo en tu navegador y no envían nada. Cuando una sí necesita guardar información para generarte un resultado, se te indica en la propia herramienta. El detalle completo está en la política de privacidad.",
      },
      {
        question: "¿Puedo pedir que borren mis datos?",
        answer:
          "Sí. La página de eliminación de datos explica cómo solicitarlo y qué se elimina.",
      },
      {
        question: "¿Comparten mi información con terceros para publicidad?",
        answer: "No. La información que entras se usa para generar tu resultado, no para venderla.",
      },
    ],
  },
  {
    title: "Uso y resultados",
    items: [
      {
        question: "¿Puedo usar los resultados para mi negocio y mis clientes?",
        answer:
          "Sí. Lo que generas —enlaces, códigos, menús, reportes— es tuyo y puedes usarlo comercialmente.",
      },
      {
        question: "¿Qué tan exactos son los diagnósticos y análisis?",
        answer:
          "Son una guía, no una auditoría. Se basan en la información que tú entregas y en criterios de buenas prácticas; sirven para priorizar, no para sustituir el criterio de alguien que conozca tu negocio.",
      },
      {
        question: "Encontré un error o algo no carga, ¿qué hago?",
        answer:
          "Escríbenos por el canal que prefieras desde la página de contacto, contándonos qué herramienta era y qué pasó. Es la forma más rápida de que se corrija.",
      },
    ],
  },
];
