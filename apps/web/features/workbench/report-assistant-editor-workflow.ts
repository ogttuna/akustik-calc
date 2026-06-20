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

function hasSourceReviewIntent(normalized: string): boolean {
  const hasMetricOrValue =
    /\b(?:aiic|c|ci|ctr|deger\w*|delta\s*lw|dn|dna|dnt|iic|ln|lnw|rw|stc|value)\b/u.test(normalized);
  const hasResearchOrReview =
    /\b(?:ara|arastir|compare|dogru|dusuk|fazla|high|internet|karsilastir|kaynak|kontrol|low|makul|mantikli|normal|plausibility|plausible|reasonable|research|review|sensible|source|too high|too low|verify|yanlis|yuksek)\b/u
      .test(normalized);
  const asksBeforeApply =
    /\b(?:ask me|bana sor|confirm|editleyim mi|onay|onayla|onaylarsam|sor|uygulayayim mi|uygulayayım mı|yazayim mi|yazayım mı)\b/u
      .test(normalized);
  const bypassesCalculator =
    /\b(?:calculator(?:'?[a-z]*)?\s+(?:wrong|ignore|yanlis)|hesab[ia]?\s+bosver|hesap\s+yanlis|ignore\s+(?:the\s+)?calculator|calculator\s+yerine)\b/u
      .test(normalized);

  return hasMetricOrValue && (hasResearchOrReview || asksBeforeApply || bypassesCalculator);
}

export function classifyReportAssistantEditorRequest(instruction: string): ReportAssistantEditorRequestMode {
  const normalized = normalizeInstruction(instruction);

  if (hasSourceReviewIntent(normalized)) {
    return "read_only_query";
  }

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
