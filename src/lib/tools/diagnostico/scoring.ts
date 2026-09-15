import {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_SCORE_VALUES,
  type DiagnosticAnswerValue,
  type DiagnosticQuestion,
} from "@/lib/tools/diagnostico/questions";

export type DiagnosticAnswers = Record<string, DiagnosticAnswerValue>;

export type DiagnosticLevel = "inicial" | "en-desarrollo" | "avanzado" | "muy-avanzado";

export type DiagnosticResult = {
  score: number;
  level: DiagnosticLevel;
  levelLabel: string;
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
  answeredCount: number;
  total: number;
};

export function getDiagnosticLevel(score: number): {
  level: DiagnosticLevel;
  label: string;
} {
  if (score <= 30) return { level: "inicial", label: "Inicial" };
  if (score <= 60) return { level: "en-desarrollo", label: "En desarrollo" };
  if (score <= 80) return { level: "avanzado", label: "Avanzado" };
  return { level: "muy-avanzado", label: "Muy avanzado" };
}

export function scoreDiagnostic(
  answers: DiagnosticAnswers,
  questions: readonly DiagnosticQuestion[] = DIAGNOSTIC_QUESTIONS,
): DiagnosticResult {
  const answered = questions.filter((question) => answers[question.id]);
  const raw =
    answered.reduce((sum, question) => {
      const value = answers[question.id];
      return sum + (value ? DIAGNOSTIC_SCORE_VALUES[value] : 0);
    }, 0) / questions.length;

  const score = Math.round(raw * 100);
  const { level, label } = getDiagnosticLevel(score);

  const strengths: string[] = [];
  const opportunities: string[] = [];
  const recommendations: string[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;
    if (answer === "yes") {
      strengths.push(question.strength);
    } else {
      opportunities.push(question.opportunity);
      recommendations.push(question.recommendation);
    }
  }

  return {
    score,
    level,
    levelLabel: label,
    strengths,
    opportunities,
    recommendations,
    answeredCount: answered.length,
    total: questions.length,
  };
}

export function isDiagnosticComplete(answers: DiagnosticAnswers): boolean {
  return DIAGNOSTIC_QUESTIONS.every((question) => Boolean(answers[question.id]));
}
