"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/tools/result-card";
import { ScoreRing } from "@/components/tools/score-ring";
import { StepProgress } from "@/components/tools/step-progress";
import { BRAND_LINKS } from "@/lib/brand";
import {
  DIAGNOSTIC_ANSWER_LABELS,
  DIAGNOSTIC_QUESTIONS,
  type DiagnosticAnswerValue,
} from "@/lib/tools/diagnostico/questions";
import {
  isDiagnosticComplete,
  scoreDiagnostic,
  type DiagnosticAnswers,
  type DiagnosticResult,
} from "@/lib/tools/diagnostico/scoring";
import { recommendedToolsFor } from "@/lib/tools/cross-links";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const OPTIONS: DiagnosticAnswerValue[] = ["yes", "partial", "no"];

export function DiagnosticQuiz() {
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const answeredCount = Object.keys(answers).length;

  function submit() {
    if (!isDiagnosticComplete(answers)) {
      toast.error("Responde todas las preguntas para ver tu resultado.");
      return;
    }
    const next = scoreDiagnostic(answers);
    setResult(next);
    trackEvent("result_generated", { toolId: "diagnostico-digital", score: next.score });
    trackEvent("tool_completed", { toolId: "diagnostico-digital" });
  }

  if (result) {
    return <DiagnosticResults result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div>
      <StepProgress current={answeredCount} total={DIAGNOSTIC_QUESTIONS.length} label={`${answeredCount} de ${DIAGNOSTIC_QUESTIONS.length} respondidas`} />
      <ol className="space-y-4">
        {DIAGNOSTIC_QUESTIONS.map((question, index) => (
          <li key={question.id} className="rounded-2xl border border-border bg-white p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Pregunta {index + 1}
            </p>
            <p className="mt-2 text-base font-medium text-foreground">{question.text}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {OPTIONS.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: option }))
                    }
                    className={cn(
                      "inline-flex h-11 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40",
                    )}
                  >
                    {DIAGNOSTIC_ANSWER_LABELS[option]}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6">
        <Button type="button" onClick={submit} className="h-11 cursor-pointer rounded-full px-6 font-semibold">
          Ver diagnóstico
        </Button>
      </div>
    </div>
  );
}

function DiagnosticResults({
  result,
  onReset,
}: {
  result: DiagnosticResult;
  onReset: () => void;
}) {
  const recommended = recommendedToolsFor("diagnostico-digital");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-6">
          <ScoreRing score={result.score} label={result.levelLabel} />
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Resultado
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Tu negocio está {result.score}% digitalizado.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Nivel: <span className="font-medium text-foreground">{result.levelLabel}</span>. Este
            puntaje resume presencia web, captación, operación y automatización.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ResultCard title="Fortalezas">
          <List items={result.strengths} empty="Aún no hay fortalezas claras. Es un buen momento para construir la base." />
        </ResultCard>
        <ResultCard title="Oportunidades">
          <List items={result.opportunities} empty="No hay brechas evidentes en este cuestionario." />
        </ResultCard>
        <ResultCard title="Recomendaciones">
          <List items={result.recommendations} empty="Mantén el ritmo y profundiza en automatización y medición." />
        </ResultCard>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="text-base font-semibold">Herramientas recomendadas</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {recommended.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-border p-4 transition-colors duration-200 hover:border-primary/40"
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="text-lg font-semibold tracking-tight">
          ¿Quieres llevar tu negocio al siguiente nivel?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Dev Studio puede ayudarte a implementar las mejoras con una solución a medida.
        </p>
        <a
          href={BRAND_LINKS.contacto}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("CTA_clicked", { toolId: "diagnostico-digital" })}
          className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
        >
          Hablar con Dev Studio
        </a>
      </div>

      <Button type="button" variant="outline" onClick={onReset} className="h-11 cursor-pointer rounded-full px-5">
        Repetir diagnóstico
      </Button>
    </div>
  );
}

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p>{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="pl-3">
          {item}
        </li>
      ))}
    </ul>
  );
}
