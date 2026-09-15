import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Pasamos de coordinar pedidos por chat a un panel donde vemos todo en tiempo real.",
    name: "Operación retail",
    company: "Greenrush",
  },
  {
    quote:
      "La web y el sistema de reservas nos dieron una imagen profesional sin contratar un equipo grande.",
    name: "Servicios",
    company: "GR Transfer",
  },
  {
    quote:
      "El menú digital y los QR redujeron las preguntas repetidas en mostrador.",
    name: "Food & beverage",
    company: "Wirbetz",
  },
] as const;

export function AboutTestimonials() {
  return (
    <section className="bg-[#f5f2ea] py-14 md:py-20">
      <div className="dst-container">
        <h2 className="text-center text-[1.85rem] font-bold tracking-[-0.02em] text-[#16161c] sm:text-[2.15rem]">
          Por qué confían en Dev Studio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.95rem] text-[#5c6358]">
          Resultados que vemos en proyectos reales — sin retratos, solo lo que importa.
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.company}
              className="flex gap-4 rounded-[1.35rem] border-2 border-[#16161c]/10 bg-white p-5 sm:p-6"
            >
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#16161c]/10 bg-[#ecf6e3]">
                <Quote className="size-5 text-[#3d7a1f]" strokeWidth={1.8} aria-hidden />
              </span>
              <div>
                <p className="text-[0.9rem] leading-relaxed text-[#16161c]">{item.quote}</p>
                <p className="mt-4 text-sm font-bold text-[#16161c]">{item.company}</p>
                <p className="text-[0.78rem] text-[#9aa0a6]">{item.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
