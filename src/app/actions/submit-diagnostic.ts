"use server";

import { processDiagnosticSubmission } from "@/lib/submit-diagnostic";
import type { SubmitDiagnosticResult } from "@/lib/submit-diagnostic.types";

export type { SubmitDiagnosticResult };

export async function submitDiagnostic(
  raw: unknown,
): Promise<SubmitDiagnosticResult> {
  return processDiagnosticSubmission(raw);
}
