"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnalyzingOverlay } from "@/components/diagnostico/analyzing-overlay";
import { FormStepSidebar } from "@/components/diagnostico/form-step-sidebar";
import type { SubmitDiagnosticResult } from "@/lib/submit-diagnostic.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  COUNTRIES,
  HAS_WEBSITE_OPTIONS,
  INDUSTRIES,
  ORDER_CHANNEL_OPTIONS,
  RECORD_KEEPING_OPTIONS,
  TEAM_SIZE_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
} from "@/lib/form-options";
import {
  defaultFormValues,
  DRAFT_STORAGE_KEY,
  diagnosticFormSchema,
  FORM_STEPS,
  STEP_FIELDS,
  type DiagnosticFormValues,
  type StoredDraft,
} from "@/lib/form-schema";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const FIELD =
  "h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-[border-color,box-shadow] focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/8";
const LABEL = "text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]";

function createFormId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function loadDraft(): StoredDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDraft;
  } catch {
    return null;
  }
}

function FormSelect({
  id,
  label,
  error,
  options,
  placeholder,
  ...props
}: React.ComponentProps<"select"> & {
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={LABEL}>
        {label}
      </Label>
      <select
        id={id}
        className={cn(FIELD, error && "border-red-500 focus:border-red-500 focus:ring-red-500/10")}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function FormInput({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={LABEL}>
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          FIELD,
          "focus-visible:border-[#0f172a] focus-visible:ring-[#0f172a]/8",
          error && "border-red-500",
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function DiagnosticFormInner({ backHref = "/" }: { backHref?: string }) {
  const router = useRouter();
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formId, setFormId] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const stepRef = useRef(step);

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(diagnosticFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const values = useWatch({ control }) as DiagnosticFormValues;

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft.values);
      setStep(Math.min(draft.step, FORM_STEPS.length - 1));
      setFormId(draft.formId);
      setLastSaved(draft.savedAt);
      stepRef.current = draft.step;
      return;
    }
    setFormId(createFormId());
  }, [form]);

  const displayFormId = formId || "······";

  const saveDraft = useCallback(() => {
    if (!formId) return;
    const payload: StoredDraft = {
      values: getValues(),
      step,
      formId,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    setLastSaved(payload.savedAt);
    toast.success("Borrador guardado correctamente");
  }, [formId, getValues, step]);

  useEffect(() => {
    if (!formId) return;
    const timer = window.setTimeout(() => {
      const payload: StoredDraft = {
        values: getValues(),
        step,
        formId,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      setLastSaved(payload.savedAt);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [values, step, formId, getValues]);

  const stepId = FORM_STEPS[step];
  const stepMeta = copy.form.steps[step];
  const f = copy.form.fields;
  const hasWebsite = values?.hasWebsite ?? "no";

  const goToStep = (next: number) => {
    setDirection(next > stepRef.current ? 1 : -1);
    stepRef.current = next;
    setStep(next);
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[stepId];
    const valid = await trigger(fields);
    if (!valid) return;
    goToStep(Math.min(step + 1, FORM_STEPS.length - 1));
  };

  const goPrev = () => goToStep(Math.max(step - 1, 0));

  const onSubmit = async (formValues: DiagnosticFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/diagnostic/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(formValues),
      });
      const result = (await response.json()) as SubmitDiagnosticResult;

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push(`/reporte/${result.slug}`);
    } catch {
      toast.error("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = step === FORM_STEPS.length - 1;
  const savedLabel = useMemo(() => {
    if (!lastSaved) return null;
    return new Date(lastSaved).toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastSaved]);

  const stepVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 28 : -28 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -20 : 20 }),
      };

  return (
    <>
      <AnimatePresence>{submitting ? <AnalyzingOverlay /> : null}</AnimatePresence>

      <div className="mx-auto w-full max-w-6xl">
      <header className="mb-8 border-b border-[#e2e8f0] pb-6">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#64748b] transition-colors hover:text-[#0f172a]"
        >
          <ArrowLeft className="size-3.5" />
          {copy.form.back}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-[1.75rem]">
          {copy.form.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b]">
          {copy.form.subtitle}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <FormStepSidebar
              step={step}
              formId={displayFormId}
              businessName={values?.businessName}
              onStepClick={goToStep}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              {copy.form.progress(step + 1, 4)}
            </p>
            <p className="font-mono text-xs text-[#475569]">
              {copy.form.idPrefix}-{displayFormId}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
            <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-5 sm:px-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                Sección {step + 1} de 4
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#0f172a]">{stepMeta.label}</h2>
              <p className="mt-1 text-sm text-[#64748b]">{stepMeta.description}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="relative min-h-[280px] px-4 py-6 sm:px-8 sm:py-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={stepId}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: reduceMotion ? 0.15 : 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="space-y-6"
                  >
                    {stepId === "operacion" ? (
                      <>
                        <FormInput
                          id={`${baseId}-business`}
                          label={f.businessName.label}
                          placeholder={f.businessName.placeholder}
                          error={errors.businessName?.message}
                          {...register("businessName")}
                        />
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormSelect
                            id={`${baseId}-industry`}
                            label={f.industry.label}
                            placeholder={f.industry.placeholder}
                            options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
                            error={errors.industry?.message}
                            {...register("industry")}
                          />
                          <FormSelect
                            id={`${baseId}-country`}
                            label={f.country.label}
                            placeholder={f.country.placeholder}
                            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                            error={errors.country?.message}
                            {...register("country")}
                          />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormSelect
                            id={`${baseId}-team`}
                            label={f.teamSize.label}
                            options={TEAM_SIZE_OPTIONS}
                            error={errors.teamSize?.message}
                            {...register("teamSize")}
                          />
                          <FormSelect
                            id={`${baseId}-hours`}
                            label={f.weeklyHoursOnAdmin.label}
                            options={WEEKLY_HOURS_OPTIONS}
                            error={errors.weeklyHoursOnAdmin?.message}
                            {...register("weeklyHoursOnAdmin")}
                          />
                        </div>
                        <FormSelect
                          id={`${baseId}-record`}
                          label={f.recordKeeping.label}
                          options={RECORD_KEEPING_OPTIONS}
                          error={errors.recordKeeping?.message}
                          {...register("recordKeeping")}
                        />
                      </>
                    ) : null}

                    {stepId === "presencia" ? (
                      <>
                        <FormSelect
                          id={`${baseId}-website`}
                          label={f.hasWebsite.label}
                          options={HAS_WEBSITE_OPTIONS}
                          error={errors.hasWebsite?.message}
                          {...register("hasWebsite")}
                        />
                        <AnimatePresence mode="wait">
                          {hasWebsite === "yes" ? (
                            <motion.div
                              key="url"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28 }}
                            >
                              <FormInput
                                id={`${baseId}-url`}
                                label={f.websiteUrl.label}
                                placeholder={f.websiteUrl.placeholder}
                                error={errors.websiteUrl?.message}
                                {...register("websiteUrl")}
                              />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </>
                    ) : null}

                    {stepId === "captacion" ? (
                      <>
                        <div className="space-y-3">
                          <div>
                            <Label className={LABEL}>{f.orderChannel.label}</Label>
                            <p className="mt-1 text-xs text-[#64748b]">{f.orderChannel.hint}</p>
                          </div>
                          <div className="divide-y divide-[#e2e8f0] rounded-md border border-[#e2e8f0]">
                            {ORDER_CHANNEL_OPTIONS.map((opt) => {
                              const selected = values?.orderChannel?.includes(
                                opt.value as DiagnosticFormValues["orderChannel"][number],
                              );
                              return (
                                <label
                                  key={opt.value}
                                  className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-[#f8fafc]"
                                >
                                  <span className="text-sm font-medium text-[#334155]">
                                    {opt.label}
                                  </span>
                                  <Checkbox
                                    checked={selected}
                                    onCheckedChange={(checked) => {
                                      const current = getValues("orderChannel");
                                      if (checked) {
                                        setValue(
                                          "orderChannel",
                                          [...current, opt.value] as DiagnosticFormValues["orderChannel"],
                                          { shouldValidate: true },
                                        );
                                      } else {
                                        setValue(
                                          "orderChannel",
                                          current.filter((c) => c !== opt.value),
                                          { shouldValidate: true },
                                        );
                                      }
                                    }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                          {errors.orderChannel?.message ? (
                            <p className="text-xs text-red-600">{errors.orderChannel.message}</p>
                          ) : null}
                        </div>
                        <FormInput
                          id={`${baseId}-waste`}
                          label={f.biggestTimeWaster.label}
                          placeholder={f.biggestTimeWaster.placeholder}
                          error={errors.biggestTimeWaster?.message}
                          {...register("biggestTimeWaster")}
                        />
                      </>
                    ) : null}

                    {stepId === "datos" ? (
                      <>
                        <FormInput
                          id={`${baseId}-name`}
                          label={f.fullName.label}
                          placeholder={f.fullName.placeholder}
                          error={errors.fullName?.message}
                          {...register("fullName")}
                        />
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormInput
                            id={`${baseId}-email`}
                            label={f.email.label}
                            placeholder={f.email.placeholder}
                            type="email"
                            error={errors.email?.message}
                            {...register("email")}
                          />
                          <FormInput
                            id={`${baseId}-wa`}
                            label={f.whatsapp.label}
                            placeholder={f.whatsapp.placeholder}
                            error={errors.whatsapp?.message}
                            {...register("whatsapp")}
                          />
                        </div>
                        <label className="flex items-start gap-3 rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-4">
                          <Checkbox
                            checked={values?.consent}
                            onCheckedChange={(checked) =>
                              setValue("consent", checked === true, { shouldValidate: true })
                            }
                            className="mt-0.5"
                          />
                          <div>
                            <span className="text-sm font-medium text-[#334155]">
                              {f.consent.label}
                            </span>
                            <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                              {f.consent.hint}
                            </p>
                            {errors.consent?.message ? (
                              <p className="mt-1 text-xs text-red-600">{errors.consent.message}</p>
                            ) : null}
                          </div>
                        </label>
                      </>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b]">
                  {savedLabel ? (
                    <span>
                      {copy.form.lastSaved}: {savedLabel}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="font-medium text-[#475569] underline-offset-2 hover:text-[#0f172a] hover:underline"
                  >
                    {copy.form.saveDraft}
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goPrev}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-[#cbd5e1] bg-white px-4 text-sm font-medium text-[#334155] transition-colors hover:bg-[#f8fafc]"
                    >
                      <ArrowLeft className="size-4" />
                      {copy.form.prev}
                    </button>
                  ) : null}
                  {isLastStep ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#0f172a] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b] disabled:opacity-60"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                      {copy.form.submit}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#0f172a] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]"
                    >
                      {copy.form.next}
                      <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
