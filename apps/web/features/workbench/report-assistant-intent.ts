import type {
  ReportAssistantContext,
  ReportAssistantMetric
} from "./report-assistant-context";
import { resolveReportAssistantInstructionMetric } from "./report-assistant-instruction";

export type ReportAssistantInstructionIntent = "explain" | "patch" | "research";

export type ReportAssistantInstructionIntentClass =
  | "challenge_or_retry"
  | "explain_metric_trace"
  | "log_review_finding"
  | "propose_report_patch"
  | "research_assembly_alternatives"
  | "research_metric_plausibility";

export type ReportAssistantInstructionIntentDecision = {
  intent: ReportAssistantInstructionIntent;
  intentClass: ReportAssistantInstructionIntentClass;
  metric?: ReportAssistantMetric;
  reason:
    | "assembly_alternative_research"
    | "challenge_or_retry"
    | "context_explanation"
    | "explicit_edit"
    | "explicit_research"
    | "general_context_question"
    | "log_review_finding"
    | "metric_question"
    | "metric_review"
    | "single_metric_question";
};

export type ReportAssistantFollowUpPatchInstruction = {
  instruction: string;
  metric: ReportAssistantMetric;
};

function normalizeIntentText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function hasNumericDbValue(value: string): boolean {
  return /(?:^|[^\d])([+-]?\d+(?:[.,]\d+)?)\s*(?:db)?(?:$|[^\d])/iu.test(value);
}

function hasSpecificDbRecommendation(value: string): boolean {
  return /(?:^|[^\d])\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+(?:[.,]\d+)?)?\s*db(?:$|[^\d])/iu.test(value);
}

function parseDbValues(value: string): number[] {
  return [...value.matchAll(/(?:^|[^\d])([+-]?\d+(?:[.,]\d+)?)\s*db(?:$|[^\d])/giu)]
    .map((match) => Number(match[1]?.replace(",", ".")))
    .filter((entry) => Number.isFinite(entry));
}

function hasExplicitPatchVerb(value: string): boolean {
  return /(?:=|\b(?:set|replace|target|make|adjust|change|lower|reduce|decrease|raise|increase|weaken|improve|ayarla|yap|olsun|degistir|dusur|azalt|artir|yukselt|iyilestir|kotu|daha\s+iyi|daha\s+kotu)\b)/iu.test(value);
}

function hasFollowUpPatchSignal(value: string): boolean {
  return /\b(?:tamam|ok|okay|o\s+zaman|hadi|uygula|apply|yap|degistir|dusur|azalt|artir|yukselt|lower|reduce|decrease|raise|increase|set)\b/iu.test(value);
}

function hasAlternativeRecommendation(value: string): boolean {
  return /\b(?:veya|ya\s+da|or|either|koru\w*|sabit|maintain|keep)\b/iu.test(value);
}

function getDirectionalIntent(value: string): "down" | "up" | null {
  if (/\b(?:dusur\w*|azalt\w*|lower|reduce|decrease|down)\b/iu.test(value)) {
    return "down";
  }

  if (/\b(?:artir\w*|yukselt\w*|raise|increase|up)\b/iu.test(value)) {
    return "up";
  }

  return null;
}

function getRecommendationDirection(input: {
  metric: ReportAssistantMetric;
  recommendation: string;
}): "down" | "up" | null {
  const lexicalDirection = getDirectionalIntent(input.recommendation);
  if (lexicalDirection) {
    return lexicalDirection;
  }

  if (typeof input.metric.numericDb !== "number") {
    return null;
  }

  const targetValues = parseDbValues(input.recommendation).filter((value) => value >= 15);
  if (targetValues.length === 0) {
    return null;
  }

  const averageTarget = targetValues.reduce((sum, value) => sum + value, 0) / targetValues.length;
  if (averageTarget > input.metric.numericDb + 0.25) {
    return "up";
  }

  if (averageTarget < input.metric.numericDb - 0.25) {
    return "down";
  }

  return null;
}

function hasQuestionSignal(value: string): boolean {
  return /[?？]/u.test(value) ||
    /\b(?:mi|mu|midir|mudur|sence|acaba|dogru|uygun|mantikli|makul|normal|fazla|az|dusuk|yuksek|plausible|reasonable|correct|valid|right|wrong|too\s+high|too\s+low|does\s+this|is\s+this|should\s+this)\b/iu.test(value);
}

function hasExplicitResearchSignal(value: string): boolean {
  return /\b(?:arastir|internet|kaynak|referans|reference|source|search|research|google|web|karsilastir|compare|incele|analiz|analyze|degerlendir|evaluate|review|kontrol|check|yorumla|comment|bak)\b/iu.test(value);
}

function hasTraceExplanationSignal(value: string): boolean {
  return /\b(?:nasil|hangi|neden|niye|formul|formula|lane|kulvar|rota|route|candidate|aday|trace|iz|method|metot|yontem|secildi|selected|chosen|kullanildi|calculated|calculation|hesaplandi|hesaplama|why|how)\b/iu.test(value);
}

function hasAssemblyAlternativeSignal(value: string): boolean {
  const hasAssemblyTerm = /\b(?:assembly\w*|build\s*up|duvar\w*|doseme\w*|floor\w*|katman\w*|layer\w*|malzeme\w*|material\w*|sistem\w*|system\w*|wall\w*|zemin\w*)\b/iu.test(value);
  const hasAlternativeTerm = /\b(?:alternatif\w*|alternative\w*|degistir\w*|daha\s+iyi|daha\s+makul|improve\w*|iyilestir\w*|oner\w*|replace\w*|substitute\w*|yerine)\b/iu.test(value);

  return hasAssemblyTerm && hasAlternativeTerm;
}

function hasChallengeOrRetrySignal(value: string): boolean {
  return /\b(?:again|bence\s+yanlis|bir\s+daha|dikkate\s+al|emin\s+misin|hakli\s+degilsin|kaynag\w*\s+dikkate|recheck|retry|tekrar|yaniliyorsun|yanlis|yeniden)\b/iu.test(value);
}

function hasReviewFindingSignal(value: string): boolean {
  return /\b(?:bulgu|finding|inceleme\s+kaydi|kaydet|log|review\s+queue)\b/iu.test(value);
}

function getSoleMetric(context: ReportAssistantContext): ReportAssistantMetric | undefined {
  return context.metrics.length === 1 ? context.metrics[0] : undefined;
}

export function classifyReportAssistantInstructionIntent(input: {
  context: ReportAssistantContext;
  instruction: string;
}): ReportAssistantInstructionIntentDecision {
  const instruction = input.instruction.trim();
  const normalized = normalizeIntentText(instruction);
  const metricResolution = resolveReportAssistantInstructionMetric({
    context: input.context,
    instruction
  });
  const metric = metricResolution.metric;
  const soleMetric = getSoleMetric(input.context);
  const hasQuestion = hasQuestionSignal(normalized);
  const hasResearch = hasExplicitResearchSignal(normalized);
  const hasExplanation = hasTraceExplanationSignal(normalized);
  const hasPatch = hasNumericDbValue(normalized) && hasExplicitPatchVerb(normalized);
  const hasAssemblyAlternative = hasAssemblyAlternativeSignal(normalized);
  const hasChallengeOrRetry = hasChallengeOrRetrySignal(normalized);
  const hasReviewFinding = hasReviewFindingSignal(normalized);

  if (hasReviewFinding) {
    return {
      intent: "research",
      intentClass: "log_review_finding",
      metric: metric ?? soleMetric,
      reason: "log_review_finding"
    };
  }

  if (hasResearch || hasChallengeOrRetry || hasAssemblyAlternative) {
    return {
      intent: "research",
      intentClass: hasAssemblyAlternative
        ? "research_assembly_alternatives"
        : hasChallengeOrRetry
          ? "challenge_or_retry"
          : "research_metric_plausibility",
      metric: metric ?? soleMetric,
      reason: hasAssemblyAlternative
        ? "assembly_alternative_research"
        : hasChallengeOrRetry
          ? "challenge_or_retry"
          : "explicit_research"
    };
  }

  if (hasExplanation) {
    return {
      intent: "explain",
      intentClass: "explain_metric_trace",
      metric: metric ?? soleMetric,
      reason: "context_explanation"
    };
  }

  if (hasQuestion) {
    if (!metric && !soleMetric) {
      return {
        intent: "explain",
        intentClass: "explain_metric_trace",
        reason: "general_context_question"
      };
    }

    return {
      intent: "research",
      intentClass: "research_metric_plausibility",
      metric: metric ?? soleMetric,
      reason: metric || soleMetric ? "metric_question" : "single_metric_question"
    };
  }

  if (hasPatch) {
    return {
      intent: "patch",
      intentClass: "propose_report_patch",
      metric: metric ?? soleMetric,
      reason: "explicit_edit"
    };
  }

  if (!metric && !soleMetric) {
    return {
      intent: "explain",
      intentClass: "explain_metric_trace",
      reason: "general_context_question"
    };
  }

  return {
    intent: "research",
    intentClass: "research_metric_plausibility",
    metric: metric ?? soleMetric,
    reason: metric || soleMetric ? "metric_review" : "single_metric_question"
  };
}

export function buildReportAssistantFollowUpPatchInstruction(input: {
  instruction: string;
  previousMetric?: ReportAssistantMetric;
  previousRecommendationText?: string;
}): ReportAssistantFollowUpPatchInstruction | null {
  const instruction = input.instruction.trim();
  const recommendation = input.previousRecommendationText?.trim();
  if (!input.previousMetric || !recommendation) {
    return null;
  }

  const normalizedInstruction = normalizeIntentText(instruction);
  const normalizedRecommendation = normalizeIntentText(recommendation);
  if (!hasFollowUpPatchSignal(normalizedInstruction) || hasQuestionSignal(normalizedInstruction)) {
    return null;
  }

  if (!hasSpecificDbRecommendation(normalizedRecommendation)) {
    return null;
  }

  const userDirection = getDirectionalIntent(normalizedInstruction);
  const recommendationLexicalDirection = getDirectionalIntent(normalizedRecommendation);
  const recommendationDirection = getRecommendationDirection({
    metric: input.previousMetric,
    recommendation: normalizedRecommendation
  });
  if (!userDirection && !hasNumericDbValue(normalizedInstruction) && hasAlternativeRecommendation(normalizedRecommendation)) {
    return null;
  }

  if (
    userDirection &&
    !hasNumericDbValue(normalizedInstruction) &&
    hasAlternativeRecommendation(normalizedRecommendation) &&
    !recommendationLexicalDirection
  ) {
    return null;
  }

  if (userDirection && recommendationDirection && userDirection !== recommendationDirection) {
    return null;
  }

  return {
    instruction: [
      `User follow-up: ${instruction}`,
      `Previous assistant recommendation for ${input.previousMetric.label}: ${recommendation}`,
      `Create a guarded report-only patch proposal for ${input.previousMetric.label} only if the recommendation contains a specific dB movement or target value.`,
      "Do not apply the patch. Do not invent unrelated values."
    ].join("\n"),
    metric: input.previousMetric
  };
}

export function shouldRequestExplicitFollowUpPatchTarget(input: {
  instruction: string;
  previousMetric?: ReportAssistantMetric;
  previousRecommendationText?: string;
}): boolean {
  if (!input.previousMetric) {
    return false;
  }

  const instruction = input.instruction.trim();
  const normalizedInstruction = normalizeIntentText(instruction);
  if (
    !hasFollowUpPatchSignal(normalizedInstruction) ||
    hasQuestionSignal(normalizedInstruction) ||
    hasNumericDbValue(normalizedInstruction)
  ) {
    return false;
  }

  return buildReportAssistantFollowUpPatchInstruction(input) === null;
}
