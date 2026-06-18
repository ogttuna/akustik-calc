export type ReportAssistantEditorRequestMode = "action_proposal" | "patch_proposal" | "read_only_query";

function normalizeInstruction(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function hasCalculatorPreviewIntent(normalized: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*mm\b/u.test(normalized) &&
    /\b(?:aiic|calculat\w*|calculator\w*|dn|dnt|duvar|estimate|hesapl\w*|iic|katman\w*|layer|layers|ln|predict|rw|stack|stc|wall)\b/u
      .test(normalized);
}

export function classifyReportAssistantEditorRequest(instruction: string): ReportAssistantEditorRequestMode {
  const normalized = normalizeInstruction(instruction);
  const hasActionIntent =
    /\b(?:apply|archive|create|delete|download|export|persist|restore|save|update|write)\b/u.test(normalized) ||
    /\b(?:arsivle|disari aktar|geri yukle|guncelle|indir|kaydet|olustur|sakla|sil|uygula|yaz)\b/u
      .test(normalized);

  if (hasActionIntent) {
    return "action_proposal";
  }

  if (hasCalculatorPreviewIntent(normalized)) {
    return "read_only_query";
  }

  const hasQuestionIntent =
    normalized.endsWith("?") ||
    /\b(?:compare|comparison|diff|difference|explain|history|how|preset|presets|project|query|report|revision|template|templates|what|when|where|which|why)\b/u
      .test(normalized) ||
    /\b(?:hangi|karsilastir|ne|neden|nasil|presetler|proje|rapor|revizyon|sablon|sablonlar|tarihce)\b/u
      .test(normalized);

  return hasQuestionIntent ? "read_only_query" : "patch_proposal";
}
