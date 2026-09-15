import Link from "next/link";
import { Compass, LineChart, ShieldCheck } from "lucide-react";
import { HelpNotchedPanel } from "@/components/ayuda/help-notched-panel";

const TOPICS = [
  {
    id: "empezar",
    icon: Compass,
    title: "Empezar",
    body: "Cuentas, costos, primer paso y uso desde el celular.",
    href: "#empezar",
  },
  {
    id: "datos",
    icon: ShieldCheck,
    title: "Tus datos",
    body: "Privacidad, eliminación y uso de la información.",
    href: "#datos",
  },
  {
    id: "resultados",
    icon: LineChart,
    title: "Resultados",
    body: "Exactitud, uso comercial y qué hacer si algo falla.",
    href: "#resultados",
  },
] as const;

export function HelpTopics() {
  return (
    <section className="dst-container pb-10 md:pb-14">
      <HelpNotchedPanel
        tab={
          <span className="text-[0.72rem] font-semibold tracking-[0.12em] text-[#9aa0a6] uppercase">
            Temas
          </span>
        }
      >
        <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-3 lg:gap-6 lg:px-14 lg:py-12">
          {TOPICS.map(({ id, icon: Icon, title, body, href }) => (
            <Link
              key={id}
              href={href}
              className="group rounded-[1.5rem] border border-transparent bg-[#fafaf8] px-5 py-5 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-black/[0.06] hover:bg-white"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white text-[#16161c] shadow-[0_8px_20px_rgba(22,22,28,0.06)]">
                <Icon className="size-5" strokeWidth={1.8} aria-hidden />
              </span>
              <h2 className="mt-4 text-[1.05rem] font-semibold tracking-[-0.02em] text-[#16161c]">
                {title}
              </h2>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-[#6b716f]">{body}</p>
              <span className="mt-4 inline-flex text-[0.82rem] font-semibold text-[#16161c] transition-transform duration-200 group-hover:translate-x-0.5">
                Ver preguntas →
              </span>
            </Link>
          ))}
        </div>
      </HelpNotchedPanel>
    </section>
  );
}
