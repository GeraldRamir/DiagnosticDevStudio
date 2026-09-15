import Link from "next/link";
import { Camera, CreditCard, Globe, MapPin, QrCode, Share2 } from "lucide-react";
import { BRAND_LINKS } from "@/lib/brand";

const USES = [
  { label: "Instagram", Icon: Camera },
  { label: "Facebook", Icon: Share2 },
  { label: "Página web", Icon: Globe },
  { label: "Google Business", Icon: MapPin },
  { label: "Flyers y tarjetas", Icon: CreditCard },
  { label: "Códigos QR", Icon: QrCode },
] as const;

export function WhatsappGuide() {
  return (
    <div className="bg-[#f7f6f4]">
      <section id="como-funciona" className="dst-container scroll-mt-24 py-16 md:py-20">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-[#6b716f] uppercase">
          ¿Qué es un Link de WhatsApp?
        </p>
        <h2 className="mt-3 max-w-[18ch] font-inter text-[2.1rem] leading-[1.05] font-semibold tracking-[-0.045em] text-[#16161c] sm:text-[2.7rem]">
          Un clic abre la conversación. Sin guardar el número.
        </h2>
        <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-[#6b716f]">
          Es un enlace que permite que una persona abra una conversación contigo directamente en
          WhatsApp sin tener que guardar tu número.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USES.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-[1.35rem] bg-white px-4 py-4 text-sm font-medium text-[#16161c]"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#90BF53]/15 text-[#3d7a1f]">
                <item.Icon className="size-4" strokeWidth={1.8} aria-hidden />
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="dst-container pb-16 md:pb-20">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.8rem] bg-[#16161c] p-6 text-white sm:p-8">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
              Ejemplo
            </p>
            <h3 className="mt-3 font-inter text-[1.7rem] leading-tight font-semibold tracking-[-0.04em]">
              Número + mensaje, listo para enviar
            </h3>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-white/40">Número</dt>
                <dd className="mt-1 font-medium">+1 809 555 1234</dd>
              </div>
              <div>
                <dt className="text-white/40">Mensaje</dt>
                <dd className="mt-1 font-medium">Hola, quiero información sobre sus servicios.</dd>
              </div>
            </dl>
          </article>
          <article className="rounded-[1.8rem] bg-white p-6 sm:p-8">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-[#6b716f] uppercase">
              Resultado
            </p>
            <h3 className="mt-3 font-inter text-[1.7rem] leading-tight font-semibold tracking-[-0.04em] text-[#16161c]">
              WhatsApp se abre con el texto escrito
            </h3>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-[#6b716f]">
              Al hacer clic, WhatsApp se abrirá con el mensaje listo para enviar. El cliente solo
              pulsa enviar.
            </p>
            <p className="mt-6 font-mono text-sm text-[#16161c]">wa.me/18095551234?…</p>
          </article>
        </div>
      </section>

      <section className="dst-container pb-20 md:pb-28">
        <div className="rounded-[2rem] bg-white px-6 py-10 sm:px-10">
          <h2 className="max-w-[16ch] font-inter text-[1.7rem] leading-tight font-semibold tracking-[-0.04em] text-[#16161c] sm:text-[2rem]">
            ¿Quieres llevar WhatsApp más allá?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b716f]">
            Dev Studio puede ayudarte a crear páginas web, sistemas y automatizaciones para conectar
            mejor tu negocio con tus clientes.
          </p>
          <Link
            href={BRAND_LINKS.website}
            className="mt-6 inline-flex h-11 items-center rounded-full border border-[#16161c]/12 px-5 text-sm font-semibold text-[#16161c] transition-colors hover:border-[#16161c]/30"
          >
            Conocer Dev Studio
          </Link>
        </div>
      </section>
    </div>
  );
}
