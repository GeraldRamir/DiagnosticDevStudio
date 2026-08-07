export type SubmitDiagnosticResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };
