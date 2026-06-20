import {
  REPORT_ASSISTANT_CAPABILITY_REGISTRY,
  type ReportAssistantCapabilityContract
} from "./report-assistant-capabilities";

export type ReportAssistantPlannerMode =
  | "action_proposal"
  | "calculator_preview"
  | "patch_proposal"
  | "project_read"
  | "research_review"
  | "unsupported";

export type ReportAssistantPlannerConfidence = "high" | "low" | "medium";

export type ReportAssistantPlannerDecision = {
  allowedTools: readonly string[];
  clarifyingQuestions: readonly string[];
  confidence: ReportAssistantPlannerConfidence;
  mode: ReportAssistantPlannerMode;
  rejectionReason?: string;
  requiresClarification: boolean;
  targetCapability: string | null;
  usedSignals: readonly string[];
};

export type ReportAssistantPlannerInput = {
  allowedCapabilityNames?: readonly string[];
  documentSignature?: string;
  hasProjectContext?: boolean;
  hasReportContext?: boolean;
  instruction: string;
  selectedOutputs?: readonly string[];
  sourceStackAvailable?: boolean;
};

const CAPABILITY_BY_NAME = new Map(REPORT_ASSISTANT_CAPABILITY_REGISTRY.map((capability) => [capability.name, capability]));

const DEFAULT_ALLOWED_CAPABILITY_NAMES = new Set(REPORT_ASSISTANT_CAPABILITY_REGISTRY.map((capability) => capability.name));

function normalizePlannerInstruction(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function capabilityAllowed(input: ReportAssistantPlannerInput, capabilityName: string): boolean {
  if (!CAPABILITY_BY_NAME.has(capabilityName)) {
    return false;
  }

  const allowed = input.allowedCapabilityNames;
  if (allowed === undefined) {
    return DEFAULT_ALLOWED_CAPABILITY_NAMES.has(capabilityName);
  }

  return allowed.includes(capabilityName);
}

function candidateDecision(input: {
  allowedTools?: readonly string[];
  clarifyingQuestions?: readonly string[];
  confidence?: ReportAssistantPlannerConfidence;
  input: ReportAssistantPlannerInput;
  mode: ReportAssistantPlannerMode;
  rejectionReason?: string;
  requiresClarification?: boolean;
  targetCapability: string | null;
  usedSignals: readonly string[];
}): ReportAssistantPlannerDecision {
  const allowedTools = (input.allowedTools ?? (input.targetCapability ? [input.targetCapability] : []))
    .filter((capabilityName) => capabilityAllowed(input.input, capabilityName));
  const targetCapability =
    input.targetCapability && capabilityAllowed(input.input, input.targetCapability)
      ? input.targetCapability
      : null;

  if (input.targetCapability && !targetCapability) {
    return {
      allowedTools,
      clarifyingQuestions: [],
      confidence: "high",
      mode: "unsupported",
      rejectionReason: `Capability "${input.targetCapability}" is not in the host allowlist.`,
      requiresClarification: false,
      targetCapability: null,
      usedSignals: [...input.usedSignals, "capability_not_allowed"]
    };
  }

  return {
    allowedTools,
    clarifyingQuestions: input.clarifyingQuestions ?? [],
    confidence: input.confidence ?? "medium",
    mode: input.mode,
    ...(input.rejectionReason ? { rejectionReason: input.rejectionReason } : {}),
    requiresClarification: input.requiresClarification ?? false,
    targetCapability,
    usedSignals: input.usedSignals
  };
}

function hasPromptInjectionSignal(normalized: string): boolean {
  return /\b(?:developer message|ignore (?:all |the |previous )?instructions|jailbreak|reveal (?:the )?(?:system|developer)|secret prompt|system prompt)\b/u
    .test(normalized) ||
    /\b(?:butun talimatlari yok say|onceki talimatlari yok say|sistem prompt|sistem talimati|gizli prompt|developer mesaj)\b/u
      .test(normalized);
}

function hasUnsupportedSideEffectIntent(normalized: string): boolean {
  return /\b(?:archive|delete|reset)\b/u.test(normalized) ||
    /\b(?:arsivle|sil|sifirla)\b/u.test(normalized);
}

function hasExportDownloadIntent(normalized: string): boolean {
  return /\b(?:download|export)\b/u.test(normalized) ||
    /\b(?:disa aktar|disari aktar|indir)\b/u.test(normalized);
}

function hasCalculatorIntent(normalized: string): boolean {
  return /\b(?:aiic|artir|azalt|calculator|calculate|combination\w*|degistir|dnt|duvar\w*|estimate|hesapla|hesaplat|iic|kalinli(?:k|g)\w*|katman\w*|kombinasyon\w*|layer\w*|ln|move|predict|reorder|rw|stack|stc|tasi|thickness(?:es)?|wall|yer\w*)\b/u
    .test(normalized);
}

function hasLayerStackEvidence(normalized: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*mm\b/u.test(normalized);
}

function hasWallCandidateComparisonIntent(normalized: string): boolean {
  return hasLayerStackEvidence(normalized) &&
    /\b(?:compare|comparison|karsilastir|karsilastirma|karşılaştır|kiyasla|kıyasla|vs)\b/u.test(normalized) &&
    /\b(?:c|ctr|dn|dnt|duvar|rw|stc|wall)\b/u.test(normalized) &&
    !/\b(?:aiic|ceiling|doseme|döşeme|floor|iic|impact|ln|slab|tavan)\b/u.test(normalized);
}

function hasResearchIntent(normalized: string): boolean {
  return /\b(?:alternatif|alternatives?|ara|arastir|compare|comparison|dogru mu|internet|karsilastir|karsilastirma|kaynak|kiyasla|kontrol|kurcala|plausibility|research|source|verify)\b/u
    .test(normalized);
}

function hasMetricReference(normalized: string): boolean {
  return /\b(?:aiic|c|ci|ctr|delta\s*lw|dn|dna|dnt|iic|ln|lnw|rw|stc)\b/u.test(normalized);
}

function hasValuePlausibilityIntent(normalized: string): boolean {
  return /\b(?:az|deger\w*|dogru|dusuk|fazla|high|low|makul|mantikli|normal|plausible|reasonable|sensible|suspicious|too high|too low|wrong|yanlis|yuksek)\b/u
    .test(normalized);
}

function hasReviewBeforeApplySignal(normalized: string): boolean {
  return /\b(?:approve|ask me|bana sor|confirm|editleyeyim mi|editleyim mi|onay|onayla|onaylarsam|sor|uygulayayim mi|uygulayayım mı|yazayim mi|yazayım mı)\b/u
    .test(normalized);
}

function hasCalculatorOverrideReviewSignal(normalized: string): boolean {
  return /\b(?:calculator(?:'?[a-z]*)?\s+(?:wrong|ignore|yanlis)|hesab[ia]?\s+bosver|hesap\s+yanlis|ignore\s+(?:the\s+)?calculator|calculator\s+yerine)\b/u
    .test(normalized);
}

function hasDirectCurrentCalculatorValueSetSignal(normalized: string): boolean {
  return hasMetricReference(normalized) &&
    /\b\d+(?:[.,]\d+)?\s*(?:db)?\b/u.test(normalized) &&
    /\b(?:apply|ayarla|change|degistir|dogru\s+cevap|editle|make|must\s+be|olmali|olmasi\s+gerek|olsun|replace|set|should\s+be|target|uygula|yap|yaz)\b/u.test(normalized);
}

function hasCurrentValueReviewIntent(input: ReportAssistantPlannerInput, normalized: string): boolean {
  const hasMetricContext = Boolean(input.selectedOutputs && input.selectedOutputs.length > 0) || hasMetricReference(normalized);

  return hasMetricContext && (
    hasResearchIntent(normalized) ||
    hasCalculatorOverrideReviewSignal(normalized) ||
    (input.sourceStackAvailable === true && hasDirectCurrentCalculatorValueSetSignal(normalized)) ||
    (
      hasValuePlausibilityIntent(normalized) &&
      (input.sourceStackAvailable === true || hasReviewBeforeApplySignal(normalized))
    )
  );
}

function hasAlternativeIntent(normalized: string): boolean {
  return /\b(?:alternative|alternatives|alternatif|assembly|combination|karsilastir|karsilastirma|kiyasla|kombinasyon|malzeme|material)\b/u
    .test(normalized);
}

function hasProjectReadIntent(normalized: string): boolean {
  return /\b(?:assembly|assemblies|context|history|list|project|proje|report|reports|rapor|revision|revisions|revizyon|workspace)\b/u
    .test(normalized);
}

function hasPatchIntent(normalized: string): boolean {
  return /\b(?:adjust|append|change|duzelt|edit|note|revise|set|update|write)\b/u.test(normalized) ||
    /\b(?:degistir|duzenle|guncelle|not ekle|revize|yaz)\b/u.test(normalized);
}

function hasReportTextPatchIntent(normalized: string): boolean {
  return hasPatchIntent(normalized) &&
    /\b(?:aciklama\w*|comment\w*|metin|note|not|ozet|rapor|report|summary|text)\b/u.test(normalized);
}

function actionCapabilityForInput(input: ReportAssistantPlannerInput, normalized: string): string | null {
  const wantsPreset = /\b(?:preset|sablon|template)\b/u.test(normalized);
  const wantsAssembly = /\b(?:assembly|combination|kombinasyon|stack)\b/u.test(normalized);
  const wantsRestore = /\b(?:geri yukle|restore|rollback)\b/u.test(normalized);
  const wantsCreate = /\b(?:create|new|olustur|yeni)\b/u.test(normalized);
  const wantsSave = /\b(?:kaydet|persist|sakla|save)\b/u.test(normalized);
  const wantsReportRevision = /\b(?:project report|rapor|report|revise|revision|revizyon)\b/u.test(normalized);

  if (hasExportDownloadIntent(normalized)) {
    return "export_current_report_snapshot_as_pdf";
  }

  if (wantsRestore && wantsReportRevision) {
    return "restore_report_revision_as_new_draft";
  }

  if ((wantsCreate || wantsSave) && wantsPreset) {
    return "create_user_preset_from_current_stack";
  }

  if (wantsSave && wantsAssembly) {
    return "save_current_stack_as_project_assembly";
  }

  if (wantsSave && wantsReportRevision && input.hasReportContext) {
    return "save_project_report_revision_from_current_draft";
  }

  if ((wantsCreate || wantsSave) && wantsReportRevision) {
    return "create_project_report_from_current_draft";
  }

  return null;
}

function missingCalculatorQuestions(input: ReportAssistantPlannerInput, normalized: string): string[] {
  const questions: string[] = [];

  if (!hasLayerStackEvidence(normalized) && !input.sourceStackAvailable) {
    questions.push("Katman dizilimini malzeme, rol ve mm kalınlıklarıyla ver.");
  }

  if (!input.selectedOutputs || input.selectedOutputs.length === 0) {
    questions.push("Hangi hedef çıktıları istiyorsun? Örnek: Rw, STC, DnT,w, Ln,w.");
  }

  return questions;
}

export function getReportAssistantPlannerCapability(
  capabilityName: string
): ReportAssistantCapabilityContract | undefined {
  return CAPABILITY_BY_NAME.get(capabilityName);
}

export function planReportAssistantRequest(input: ReportAssistantPlannerInput): ReportAssistantPlannerDecision {
  const normalized = normalizePlannerInstruction(input.instruction);

  if (hasPromptInjectionSignal(normalized)) {
    return candidateDecision({
      confidence: "high",
      input,
      mode: "unsupported",
      rejectionReason: "Prompt-injection wording cannot unlock capabilities or override assistant policy.",
      targetCapability: null,
      usedSignals: ["prompt_injection_signal"]
    });
  }

  if (hasUnsupportedSideEffectIntent(normalized)) {
    return candidateDecision({
      confidence: "high",
      input,
      mode: "unsupported",
      rejectionReason: "Unsupported side-effecting actions must stay outside report assistant planning.",
      targetCapability: null,
      usedSignals: ["unsupported_side_effect_intent"]
    });
  }

  const actionCapabilityName = actionCapabilityForInput(input, normalized);
  if (actionCapabilityName) {
    const questions: string[] = [];
    if (
      !input.hasProjectContext &&
      actionCapabilityName !== "create_user_preset_from_current_stack" &&
      actionCapabilityName !== "export_current_report_snapshot_as_pdf"
    ) {
      questions.push("Bu işlem için proje bağlamı gerekli; önce project/workbench kaynağını aç.");
    }
    if (!input.sourceStackAvailable && actionCapabilityName === "save_current_stack_as_project_assembly") {
      questions.push("Kaydedilecek kaynak katman kombinasyonu mevcut değil.");
    }

    return candidateDecision({
      allowedTools: [actionCapabilityName],
      clarifyingQuestions: questions,
      confidence: questions.length > 0 ? "medium" : "high",
      input,
      mode: "action_proposal",
      requiresClarification: questions.length > 0,
      targetCapability: actionCapabilityName,
      usedSignals:
        actionCapabilityName === "export_current_report_snapshot_as_pdf"
          ? ["export_download_intent", "confirmation_required"]
          : ["mutation_intent", "confirmation_required"]
    });
  }

  if (hasWallCandidateComparisonIntent(normalized)) {
    return candidateDecision({
      allowedTools: ["report_assistant_wall_candidate_comparison_preview"],
      confidence: "high",
      input,
      mode: "calculator_preview",
      requiresClarification: false,
      targetCapability: "report_assistant_wall_candidate_comparison_preview",
      usedSignals: [
        "wall_candidate_comparison_intent",
        "layer_stack_evidence",
        ...(input.selectedOutputs && input.selectedOutputs.length > 0 ? ["target_outputs_present"] : [])
      ]
    });
  }

  if (hasReportTextPatchIntent(normalized)) {
    return candidateDecision({
      confidence: "medium",
      input,
      mode: "patch_proposal",
      targetCapability: "report_assistant_patch_route",
      usedSignals: ["patch_intent", "preview_only"]
    });
  }

  const currentValueReviewIntent = !hasAlternativeIntent(normalized) && hasCurrentValueReviewIntent(input, normalized);
  if (currentValueReviewIntent || hasResearchIntent(normalized)) {
    const targetCapability = hasAlternativeIntent(normalized)
      ? "report_assistant_assembly_alternatives_route"
      : "report_assistant_plausibility_route";

    return candidateDecision({
      confidence: currentValueReviewIntent ? "high" : "medium",
      input,
      mode: "research_review",
      targetCapability,
      usedSignals: [
        "research_intent",
        ...(currentValueReviewIntent ? ["current_calculator_value_review_intent"] : []),
        ...(hasReviewBeforeApplySignal(normalized) ? ["confirmation_before_report_override"] : []),
        ...(hasCalculatorOverrideReviewSignal(normalized) || hasDirectCurrentCalculatorValueSetSignal(normalized)
          ? ["calculator_override_blocked"]
          : [])
      ]
    });
  }

  if (hasCalculatorIntent(normalized)) {
    const questions = missingCalculatorQuestions(input, normalized);
    return candidateDecision({
      allowedTools: ["preview_described_layer_configuration"],
      clarifyingQuestions: questions,
      confidence: questions.length > 0 ? "medium" : "high",
      input,
      mode: "calculator_preview",
      requiresClarification: questions.length > 0,
      targetCapability: "preview_described_layer_configuration",
      usedSignals: [
        "calculator_intent",
        ...(hasLayerStackEvidence(normalized) ? ["layer_stack_evidence"] : []),
        ...(input.sourceStackAvailable ? ["source_stack_available"] : []),
        ...(input.selectedOutputs && input.selectedOutputs.length > 0 ? ["target_outputs_present"] : [])
      ]
    });
  }

  if (hasPatchIntent(normalized)) {
    return candidateDecision({
      confidence: "medium",
      input,
      mode: "patch_proposal",
      targetCapability: "report_assistant_patch_route",
      usedSignals: ["patch_intent", "preview_only"]
    });
  }

  if (hasProjectReadIntent(normalized)) {
    return candidateDecision({
      confidence: input.hasProjectContext ? "high" : "medium",
      input,
      mode: "project_read",
      requiresClarification: !input.hasProjectContext,
      clarifyingQuestions: input.hasProjectContext ? [] : ["Proje okuma için önce proje bağlamı gerekli."],
      targetCapability: "report_assistant_project_read_route",
      usedSignals: ["project_read_intent"]
    });
  }

  return candidateDecision({
    confidence: "low",
    input,
    mode: "unsupported",
    rejectionReason: "No supported report-assistant capability matched the request.",
    targetCapability: null,
    usedSignals: ["no_supported_intent"]
  });
}
