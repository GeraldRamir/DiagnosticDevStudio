import { Layers, Target } from "lucide-react";

export function AboutMission() {
  return (
    <section className="bg-[#ecf6e3] py-14 md:py-20">
      <div className="dst-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="overflow-hidden rounded-[1.75rem] border-2 border-[#16161c] bg-white p-8 sm:p-10">
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-[#f3f1f8] p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#90BF53]/20">
                    <Layers className="size-5 text-[#3d7a1f]" strokeWidth={1.8} aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-[#9aa0a6] uppercase">
                      Stack
                    </p>
                    <p className="text-sm font-semibold text-[#16161c]">Web · App · SaaS · QR</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["UX", "API", "Cloud"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-[#16161c]/10 bg-white py-2 text-center text-xs font-semibold text-[#16161c]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="h-24 rounded-xl bg-[linear-gradient(135deg,#f3f1f8_0%,#e9edf5_100%)]" />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-[1.65rem] font-bold tracking-[-0.02em] text-[#16161c] sm:text-[1.85rem]">
              Nuestra misión
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#5c6358]">
              Acercar el software profesional a negocios que no tienen un equipo técnico interno.
              Cada proyecto busca resolver operaciones reales: vender, coordinar, medir y crecer sin
              fricción.
            </p>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-[1.65rem] font-bold tracking-[-0.02em] text-[#16161c] sm:text-[1.85rem]">
              <Target className="size-6 text-[#90BF53]" strokeWidth={1.8} aria-hidden />
              Nuestro valor
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#5c6358]">
              Claridad antes que código. Entendemos tu negocio, proponemos lo mínimo viable y
              entregamos algo que tu equipo puede usar el mismo día — no un prototipo que muere en
              un PDF.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
