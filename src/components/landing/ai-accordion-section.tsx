"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const SLIDES = copy.landing.doodi.motor.slides;
const AUTO_MS = 4500;

const CARD_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

function getRelativeIndex(index: number, active: number, total: number) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function getCardMotion(relative: number, reduceMotion: boolean) {
  const hidden = Math.abs(relative) > 2;

  if (hidden) {
    return {
      x: relative > 0 ? 480 : -480,
      scale: 0.65,
      rotateY: relative > 0 ? -42 : 42,
      zIndex: 0,
      opacity: 0,
    };
  }

  if (relative === 0) {
    return {
      x: 0,
      scale: 1,
      rotateY: 0,
      zIndex: 30,
      opacity: 1,
    };
  }

  if (relative === -1) {
    return {
      x: reduceMotion ? -220 : -270,
      scale: 0.86,
      rotateY: 34,
      zIndex: 20,
      opacity: 0.68,
    };
  }

  if (relative === 1) {
    return {
      x: reduceMotion ? 220 : 270,
      scale: 0.86,
      rotateY: -34,
      zIndex: 20,
      opacity: 0.68,
    };
  }

  return {
    x: relative < 0 ? -400 : 400,
    scale: 0.74,
    rotateY: relative < 0 ? 42 : -42,
    zIndex: 10,
    opacity: 0.35,
  };
}

type CoverflowCardProps = {
  slide: (typeof SLIDES)[number];
  index: number;
  active: number;
  total: number;
  reduceMotion: boolean;
};

const CoverflowCard = memo(function CoverflowCard({
  slide,
  index,
  active,
  total,
  reduceMotion,
}: CoverflowCardProps) {
  const relative = getRelativeIndex(index, active, total);
  const motionValues = getCardMotion(relative, reduceMotion);
  const isCenter = relative === 0;
  const isVisible = Math.abs(relative) <= 2;

  return (
    <motion.div
      aria-hidden={!isCenter}
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-[min(420px,58vw)] w-[min(260px,72vw)] -translate-x-1/2 will-change-transform",
        !isVisible && "invisible",
      )}
      initial={false}
      animate={motionValues}
      transition={CARD_TRANSITION}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className={cn(
          "ds-glass-card relative h-full w-full overflow-hidden rounded-[1.35rem] border-2 border-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.14)]",
          isCenter && "shadow-[0_32px_72px_rgba(168,85,247,0.18)]",
        )}
      >
        {isVisible ? (
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="260px"
            quality={70}
            className="object-cover object-center"
            priority={index <= 2}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-14 pt-16 text-center">
          <p className="text-[1.0625rem] font-semibold tracking-tight text-white">
            {slide.name}
          </p>
          <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/75">
            {slide.role}
          </p>
        </div>

        <div
          className="absolute -bottom-5 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/90 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          aria-hidden
        >
          <Quote className="size-4 fill-[#0a0a0a] text-[#0a0a0a]" strokeWidth={0} />
        </div>
      </div>
    </motion.div>
  );
});

export function AiAccordionSection() {
  const { title } = copy.landing.doodi.motor;
  const total = SLIDES.length;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, AUTO_MS);

    return () => window.clearInterval(timer);
  }, [total, reduceMotion]);

  const activeSlide = SLIDES[active];

  return (
    <section
      id="como-funciona"
      className="relative w-full overflow-hidden px-[clamp(1.25rem,4vw,4rem)] py-14 md:py-20"
      style={{ background: "var(--landing-shell)" }}
    >
      <div
        className="pointer-events-none absolute left-[12%] top-[18%] size-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0) 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[12%] right-[10%] size-64 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,0.18) 0%, rgba(251,146,60,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[100rem]">
        <BlurFade className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--landing-text)]">
            {title}
          </h2>
        </BlurFade>

        <BlurFade delay={0.08} className="relative mt-10 md:mt-12">
          <div
            className="ds-coverflow-stage relative mx-auto h-[min(460px,62vw)] max-w-5xl"
            aria-live="polite"
            aria-atomic="true"
          >
            {SLIDES.map((slide, index) => (
              <CoverflowCard
                key={slide.name}
                slide={slide}
                index={index}
                active={active}
                total={total}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-2" aria-hidden>
            {SLIDES.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === active
                    ? "w-7 bg-gradient-to-r from-[#a855f7] to-[#fb923c]"
                    : "w-1.5 bg-black/10",
                )}
              />
            ))}
          </div>
        </BlurFade>

        <div className="mx-auto mt-10 max-w-2xl text-center md:mt-12">
          <motion.div
            key={activeSlide.name}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.35 }}
          >
            <h3 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold tracking-[-0.02em] text-[color:var(--landing-text)]">
              {activeSlide.headline}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-[color:var(--landing-muted)]">
              {activeSlide.quote}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
