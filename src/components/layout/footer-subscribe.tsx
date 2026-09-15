"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function FooterSubscribe() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = email.trim();
    if (!next) return;
    router.push(`/contacto?email=${encodeURIComponent(next)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex max-w-[26rem] overflow-hidden rounded-full bg-white"
    >
      <label htmlFor="footer-email" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="footer-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Ingresa tu correo"
        className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-[0.84rem] text-[#16161c] outline-none placeholder:text-[#16161c]/40"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1 bg-[#c8eb4a] px-5 text-[0.84rem] font-semibold text-[#111] transition-colors hover:bg-[#d4f25c]"
      >
        Suscribirse
        <ArrowUpRight className="size-3.5" strokeWidth={2.4} aria-hidden />
      </button>
    </form>
  );
}
