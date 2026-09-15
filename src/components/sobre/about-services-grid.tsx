import {
  Bot,
  Globe,
  LayoutDashboard,
  ShoppingBag,
  Smartphone,
  Workflow,
} from "lucide-react";

const SERVICES = [
  { icon: Globe, title: "Webs & landing", role: "Presencia que convierte" },
  { icon: ShoppingBag, title: "E-commerce", role: "Tiendas y catálogos" },
  { icon: Smartphone, title: "Apps móviles", role: "iOS y Android" },
  { icon: LayoutDashboard, title: "Paneles admin", role: "Operación centralizada" },
  { icon: Workflow, title: "Automatización", role: "Menos tareas manuales" },
  { icon: Bot, title: "Integraciones", role: "Pagos, WhatsApp, APIs" },
] as const;

export function AboutServicesGrid() {
  return (
    <section className="relative overflow-x-clip bg-[#e9edf5] py-14 md:py-20">
      <svg
        className="pointer-events-none absolute top-16 left-[8%] hidden h-40 w-40 text-[#16161c]/15 lg:block"
        viewBox="0 0 160 160"
        fill="none"
        aria-hidden
      >
        <path d="M20 140 L80 20 L140 100" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="80" cy="20" r="4" fill="currentColor" />
      </svg>

      <div className="dst-container">
        <h2 className="max-w-[14ch] text-[1.85rem] font-bold tracking-[-0.02em] text-[#16161c] sm:text-[2.15rem]">
          Lo que construimos
        </h2>
        <p className="mt-3 max-w-lg text-[0.95rem] text-[#5c6358]">
          Especialidades del estudio — sin fotos de stock, solo lo que entregamos en producción.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, role }) => (
            <li
              key={title}
              className="rounded-[1.35rem] border-2 border-[#16161c]/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex h-[7.5rem] items-center justify-center rounded-xl border border-[#16161c]/10 bg-[#f3f1f8]">
                <Icon className="size-10 text-[#16161c]" strokeWidth={1.4} aria-hidden />
              </div>
              <p className="mt-4 text-[1rem] font-bold text-[#16161c]">{title}</p>
              <p className="mt-1 text-[0.82rem] text-[#5c6358]">{role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
