"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader, type UploadedImage } from "@/components/tools/file-uploader";
import { ResultCard } from "@/components/tools/result-card";
import { ScoreCard } from "@/components/tools/score-card";
import { StepProgress } from "@/components/tools/step-progress";
import {
  EMPTY_CHECKLIST,
  INSTAGRAM_CHECKLIST,
  INSTAGRAM_GOALS,
  instagramAnalyzerService,
  type InstagramAnalyzerInput,
  type InstagramAnalyzerResult,
  type InstagramChecklist,
  type InstagramGoal,
} from "@/lib/tools/instagram/instagramAnalyzerService";
import { recommendedToolsFor } from "@/lib/tools/cross-links";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { sanitizePlainText } from "@/lib/utils/sanitize";
import { trackEvent } from "@/lib/tracking";
import { SectionSwitch } from "@/components/ui/section-switch";
import { cn } from "@/lib/utils";

const STEPS = 4;

export function InstagramWizard() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [goal, setGoal] = useState<InstagramGoal | "">("");
  const [currentBio, setCurrentBio] = useState("");
  const [profileImages, setProfileImages] = useState<UploadedImage[]>([]);
  const [postImages, setPostImages] = useState<UploadedImage[]>([]);
  const [checklist, setChecklist] = useState<InstagramChecklist>(EMPTY_CHECKLIST);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstagramAnalyzerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("tool_opened", { toolId: "instagram-analyzer" });
  }, []);

  function validateStep(): boolean {
    if (step === 1 && !username.trim()) {
      setError("Ingresa el usuario de Instagram.");
      return false;
    }
    if (step === 2 && (!businessName.trim() || !businessType.trim() || !city.trim() || !goal)) {
      setError("Completa los datos del negocio y el objetivo.");
      return false;
    }
    setError(null);
    return true;
  }

  async function analyze() {
    setLoading(true);
    setError(null);
    const input: InstagramAnalyzerInput = {
      username: sanitizePlainText(username, 40),
      businessName: sanitizePlainText(businessName, 80),
      businessType: sanitizePlainText(businessType, 60),
      city: sanitizePlainText(city, 60),
      goal,
      currentBio,
      profileImages: profileImages.length,
      postImages: postImages.length,
      checklist,
    };
    try {
      const next = await instagramAnalyzerService.analyze(input);
      setResult(next);
      trackEvent("result_generated", { toolId: "instagram-analyzer", score: next.total });
      trackEvent("tool_completed", { toolId: "instagram-analyzer" });
    } catch {
      setError("No se pudo generar el análisis.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return <InstagramResults result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <StepProgress current={step} total={STEPS} />

      <SectionSwitch sectionKey={step}>
      {step === 1 ? (
        <section>
          <h2 className="text-lg font-semibold">¿Cuál es tu cuenta de Instagram?</h2>
          <Label htmlFor="ig-user" className="mt-4">
            Usuario
          </Label>
          <Input
            id="ig-user"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="@tu_negocio"
            className="mt-2 h-11"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            No pedimos contraseña ni nos conectamos a tu cuenta.
          </p>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Cuéntanos sobre tu negocio</h2>
          <div>
            <Label htmlFor="biz-name">Nombre del negocio</Label>
            <Input id="biz-name" value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="biz-type">Tipo de negocio</Label>
            <Input id="biz-type" value={businessType} onChange={(event) => setBusinessType(event.target.value)} className="mt-2 h-11" placeholder="Restaurante, clínica, tienda…" />
          </div>
          <div>
            <Label htmlFor="biz-city">Ciudad</Label>
            <Input id="biz-city" value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <p className="text-sm font-medium">Objetivo principal</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {INSTAGRAM_GOALS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  className={cn(
                    "h-11 cursor-pointer rounded-full border px-4 text-left text-sm font-medium transition-colors duration-200",
                    goal === item.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Capturas del perfil y publicaciones</h2>
          <FileUploader label="Capturas del perfil" files={profileImages} onChange={setProfileImages} maxFiles={3} />
          <FileUploader label="Capturas de publicaciones (opcional)" files={postImages} onChange={setPostImages} maxFiles={6} />
          <div>
            <Label htmlFor="bio">Bio actual (opcional)</Label>
            <Textarea id="bio" value={currentBio} onChange={(event) => setCurrentBio(event.target.value)} className="mt-2" maxLength={220} />
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section>
          <h2 className="text-lg font-semibold">Formulario de análisis</h2>
          <ul className="mt-4 space-y-2">
            {INSTAGRAM_CHECKLIST.map((item) => (
              <li key={item.key}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2">
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={(event) =>
                      setChecklist((current) => ({ ...current, [item.key]: event.target.checked }))
                    }
                    className="size-4 accent-[var(--brand)]"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      </SectionSwitch>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)} className="h-11 cursor-pointer rounded-full px-5">
            Atrás
          </Button>
        ) : null}
        {step < STEPS ? (
          <Button
            type="button"
            onClick={() => {
              if (validateStep()) setStep((value) => value + 1);
            }}
            className="h-11 cursor-pointer rounded-full px-5 font-semibold"
          >
            Continuar
          </Button>
        ) : (
          <Button type="button" disabled={loading} onClick={() => void analyze()} className="h-11 cursor-pointer rounded-full px-5 font-semibold">
            {loading ? "Analizando…" : "Generar análisis"}
          </Button>
        )}
      </div>
    </div>
  );
}

function InstagramResults({
  result,
  onReset,
}: {
  result: InstagramAnalyzerResult;
  onReset: () => void;
}) {
  const recommended = recommendedToolsFor("instagram-analyzer");

  async function copyBio() {
    const ok = await copyToClipboard(result.suggestedBio);
    if (ok) toast.success("Bio copiada");
    else toast.error("No se pudo copiar la bio");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Resultado
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Tu Instagram obtuvo {result.total}/100
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {result.categories.map((category) => (
          <ScoreCard key={category.id} label={category.label} score={category.score} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ResultCard title="Fortalezas">
          <ItemList items={result.strengths} />
        </ResultCard>
        <ResultCard title="Oportunidades">
          <ItemList items={result.opportunities} />
        </ResultCard>
        <ResultCard title="Recomendaciones">
          <ItemList items={result.recommendations} />
        </ResultCard>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard title="Bio actual">
          {result.currentBio ? <p className="whitespace-pre-wrap">{result.currentBio}</p> : <p>No proporcionaste una bio.</p>}
          {result.bioNeedsWork ? (
            <p className="mt-3 font-medium text-foreground">Tu bio podría mejorar</p>
          ) : null}
        </ResultCard>
        <ResultCard title="Propuesta de bio">
          <p className="whitespace-pre-wrap text-foreground">{result.suggestedBio}</p>
          <Button type="button" onClick={() => void copyBio()} className="mt-4 h-11 cursor-pointer rounded-full px-5">
            Copiar bio
          </Button>
        </ResultCard>
      </div>
      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="text-base font-semibold">Siguiente paso</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {recommended.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-xl border border-border p-4 transition-colors duration-200 hover:border-primary/40">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button type="button" variant="outline" onClick={onReset} className="h-11 cursor-pointer rounded-full px-5">
        Nuevo análisis
      </Button>
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
