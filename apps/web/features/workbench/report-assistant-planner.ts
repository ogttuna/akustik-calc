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
  return /\b(?:apply|archive|delete|download|export|reset)\b/u.test(normalized) ||
    /\b(?:arsivle|disari aktar|indir|sil|uygula|sifirla)\b/u.test(normalized);
}

function hasCalculatorIntent(normalized: string): boolean {
  return /\b(?:aiic|calculator|calculate|dnt|duvar|estimate|hesapla|hesaplat|iic|katman|layer|ln|predict|rw|stack|stc|wall)\b/u
    .test(normalized);
}

function hasLayerStackEvidence(normalized: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*mm\b/u.test(normalized);
}

function hasResearchIntent(normalized: string): boolean {
  return /\b(?:ara|arastir|compare|internet|kaynak|plausibility|research|source|verify)\b/u.test(normalized);
}

function hasAlternativeIntent(normalized: string): boolean {
  return /\b(?:alternative|alternatif|assembly|combination|karsilastir|kombinasyon|malzeme|material)\b/u.test(normalized);
}

function hasProjectReadIntent(normalized: string): boolean {
  return /\b(?:assembly|assemblies|context|history|list|project|proje|report|reports|rapor|revision|revisions|revizyon|workspace)\b/u
    .test(normalized);
}

function hasPatchIntent(normalized: string): boolean {
  return /\b(?:adjust|append|change|duzelt|edit|note|revise|set|update|write)\b/u.test(normalized) ||
    /\b(?:degistir|duzenle|guncelle|not ekle|revize|yaz)\b/u.test(normalized);
}

function actionCapabilityForInput(input: ReportAssistantPlannerInput, normalized: string): string | null {
  const wantsPreset = /\b(?:preset|sablon|template)\b/u.test(normalized);
  const wantsAssembly = /\b(?:assembly|combination|kombinasyon|stack)\b/u.test(normalized);
  const wantsRestore = /\b(?:geri yukle|restore|rollback)\b/u.test(normalized);
  const wantsCreate = /\b(?:create|new|olustur|yeni)\b/u.test(normalized);
  const wantsSave = /\b(?:kaydet|persist|sakla|save)\b/u.test(normalized);
  const wantsReportRevision = /\b(?:project report|rapor|report|revise|revision|revizyon)\b/u.test(normalized);

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
    if (!input.hasProjectContext && actionCapabilityName !== "create_user_preset_from_current_stack") {
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
      usedSignals: ["mutation_intent", "confirmation_required"]
    });
  }

  if (hasResearchIntent(normalized)) {
    const targetCapability = hasAlternativeIntent(normalized)
      ? "report_assistant_assembly_alternatives_route"
      : "report_assistant_plausibility_route";

    return candidateDecision({
      confidence: "medium",
      input,
      mode: "research_review",
      targetCapability,
      usedSignals: ["research_intent"]
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
        ...(input.selectedOutputs && input.selectedOutputs.length > 0 ? ["target_outputs_present"] : [])
      ]
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
