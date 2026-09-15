import Link from "next/link";
import { FooterNav } from "@/components/layout/footer-nav";
import { FooterSubscribe } from "@/components/layout/footer-subscribe";
import { BRAND_LINKS } from "@/lib/brand";
import { SITE_BRAND } from "@/lib/site";

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M2.3 11.4 21 3.2c.6-.3 1.2.3.9.9l-8.2 18.7c-.3.6-1.1.5-1.3-.2l-2.6-8.2-8.2-2.6c-.7-.2-.8-1-.3-1.2Z" />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M19.1 4.9A10 10 0 0 0 3.2 16.7L2 22l5.4-1.2A10 10 0 0 0 19.1 4.9Zm-7.1 15.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.7.7-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.2-2.8-.2-.4 0-.5.2-.7l.4-.5c.1-.1.1-.3 0-.5L9 8.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 2-.2 3.5.9 1.6 2.1 3 4.6 4.1 2.3 1 2.6.7 3.1.6.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.2-.3-.2-.5-.3Z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M14.2 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3A19 19 0 0 0 14.5 5c-2.3 0-3.8 1.4-3.8 4v1.9H8.2v2.8h2.5V21h3.5Z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10A2.2 2.2 0 0 0 19.2 17V7A2.2 2.2 0 0 0 17 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.55-3.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95Z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M6.5 9.3H4V20h2.5V9.3ZM5.2 4A1.5 1.5 0 1 0 5.2 7a1.5 1.5 0 0 0 0-3ZM20 20h-2.5v-5.2c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H11V9.3h2.4v1.5h.1c.3-.6 1.2-1.6 3.2-1.6 3.4 0 4 2.2 4 5.1V20Z" />
    </svg>
  );
}

const SOCIALS = [
  { href: BRAND_LINKS.contacto, label: "Contacto", Icon: IconSend, featured: true },
  { href: BRAND_LINKS.contacto, label: "WhatsApp", Icon: IconWhatsapp, featured: false },
  { href: BRAND_LINKS.facebook, label: "Facebook", Icon: IconFacebook, featured: false },
  { href: BRAND_LINKS.instagram, label: "Instagram", Icon: IconInstagram, featured: false },
  { href: BRAND_LINKS.linkedin, label: "LinkedIn", Icon: IconLinkedin, featured: false },
] as const;

const ROW_A = "01010010101001010100101010010101001010100101010010101001";
const ROW_B = "10101101010110101011010101101010110101011010101101010110";

export function Footer() {
  return (
    <footer className="relative mt-auto bg-landing-canvas">
      {/* Dos lóbulos negros bajos — el canvas se ve en la V del centro */}
      <div className="flex" aria-hidden>
        <div className="h-11 flex-1 rounded-tr-[3.5rem] bg-black sm:h-12 sm:rounded-tr-[5rem] md:h-14 md:rounded-tr-[6.5rem]" />
        <div className="w-7 shrink-0 sm:w-10 md:w-14" />
        <div className="h-11 flex-1 rounded-tl-[3.5rem] bg-black sm:h-12 sm:rounded-tl-[5rem] md:h-14 md:rounded-tl-[6.5rem]" />
      </div>

      <div className="-mt-px bg-black text-white">
        <div className="dst-container grid grid-cols-1 gap-6 py-6 sm:grid-cols-3 sm:items-start sm:gap-8 sm:py-7">
          <div>
            <Link href="/" className="inline-flex items-end gap-1.5" aria-label={SITE_BRAND}>
              <span className="h-8 w-2.5 rounded-[2px] bg-white" />
              <span className="h-8 w-2.5 rounded-[2px] border-2 border-white" />
            </Link>
            <p className="mt-4 max-w-[14rem] text-[0.75rem] leading-[1.5] text-white/40">
              Herramientas para un negocio moderno. Presencia, contacto y operación, con criterio
              de estudio.
            </p>
          </div>

          <div>
            <p className="text-[0.92rem] font-medium text-white">Acceso rápido</p>
            <div className="mt-3">
              <FooterNav />
            </div>
          </div>

          <div>
            <p className="max-w-[22rem] text-[0.84rem] leading-snug text-white">
              Para conocer las últimas noticias y actualizaciones, ingresa tu correo y te
              contactamos.
            </p>
            <FooterSubscribe />
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-[0.82rem] text-white/75">Contáctanos :</span>
              <div className="flex items-center gap-2">
                {SOCIALS.map((social) => {
                  const Icon = social.Icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={social.label}
                      className={
                        social.featured
                          ? "inline-flex size-7 items-center justify-center rounded-full bg-[#7c5cff] text-white"
                          : "inline-flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70"
                      }
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden" aria-hidden>
          {[ROW_A, ROW_B].map((pattern, row) => (
            <div key={row} className="flex">
              {[...pattern].map((cell, index) => (
                <span
                  key={`${row}-${index}`}
                  className="size-4 shrink-0 sm:size-5"
                  style={{
                    backgroundColor:
                      cell === "1" ? "#fff" : cell === "2" ? "#ebe8f2" : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
