import {
  REQUESTED_OUTPUT_IDS,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraftLayerRole,
  type ReportAssistantLayerStackDraftMissingInput,
  type ReportAssistantLayerStackDraftWallTopology,
  type ReportAssistantLayerStackDraftValidation
} from "./report-assistant-layer-stack-draft";
import type {
  ReportAssistantLayerStackDraftContinuationAnswer,
  ReportAssistantLayerStackDraftContinuationRequest
} from "./report-assistant-layer-stack-draft-continuation";

export type ReportAssistantLayerStackDraftEditorState = {
  assistantContextSignature?: string;
  draft: ReportAssistantLayerStackDraft;
  validation: ReportAssistantLayerStackDraftValidation;
};

export type ReportAssistantLayerStackDraftEditorContinuationBuildResult =
  | {
      draftContinuation: ReportAssistantLayerStackDraftContinuationRequest;
      ok: true;
      summary: string;
    }
  | {
      errors: readonly string[];
      ok: false;
      questions: readonly string[];
    };

const KNOWN_DRAFT_MATERIAL_ALIASES: readonly {
  aliases: readonly string[];
  materialId: string;
  materialName: string;
}[] = [
  {
    aliases: ["acoustic gypsum board", "acoustic plasterboard", "soundbloc", "diamant board"],
    materialId: "acoustic_gypsum_board",
    materialName: "Acoustic Gypsum Board"
  },
  {
    aliases: ["gypsum board", "gypsum", "plasterboard", "drywall", "alcipan", "gkb"],
    materialId: "gypsum_board",
    materialName: "Gypsum Board"
  },
  {
    aliases: ["high density rockwool", "high density mineral wool", "dense rockwool"],
    materialId: "high_density_rockwool",
    materialName: "High Density Rockwool"
  },
  {
    aliases: ["rock wool", "rockwool", "mineral wool", "stone wool", "tas yunu", "tasyunu"],
    materialId: "rockwool",
    materialName: "Rockwool"
  },
  {
    aliases: ["glass wool", "glasswool", "glass fiber", "glass fibre", "cam yunu", "camyunu"],
    materialId: "glasswool_board",
    materialName: "Glasswool Board"
  },
  {
    aliases: ["lightweight concrete", "light concrete", "hafif beton"],
    materialId: "lightweight_concrete",
    materialName: "Lightweight Concrete"
  },
  {
    aliases: ["heavy concrete", "dense concrete", "agir beton"],
    materialId: "heavy_concrete",
    materialName: "Heavy Concrete"
  },
  {
    aliases: ["concrete", "beton"],
    materialId: "concrete",
    materialName: "Concrete"
  },
  {
    aliases: ["aac", "autoclaved aerated concrete", "ytong", "gazbeton"],
    materialId: "aac",
    materialName: "AAC"
  },
  {
    aliases: ["solid brick", "fired clay brick", "tugla", "brick"],
    materialId: "solid_brick",
    materialName: "Solid Brick"
  },
  {
    aliases: ["hollow brick", "perforated brick", "delikli tugla"],
    materialId: "hollow_brick",
    materialName: "Hollow Brick"
  },
  {
    aliases: ["cement board", "cementitious board"],
    materialId: "cement_board",
    materialName: "Cement Board"
  },
  {
    aliases: ["osb"],
    materialId: "osb",
    materialName: "OSB"
  },
  {
    aliases: ["plywood", "kontrplak"],
    materialId: "plywood",
    materialName: "Plywood"
  }
];

const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDraftAnswerText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9'+,.-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function normalizeCompactToken(value: string): string {
  return normalizeDraftAnswerText(value).replace(/[^a-z0-9]+/gu, "");
}

function readPositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function missingInputsForCode(
  validation: ReportAssistantLayerStackDraftValidation,
  code: string
): ReportAssistantLayerStackDraftMissingInput[] {
  return validation.missingInputs.filter((input) => input.code === code);
}

function exactlyOneLayerMissingInput(
  validation: ReportAssistantLayerStackDraftValidation,
  code: string
): ReportAssistantLayerStackDraftMissingInput | null {
  const matches = missingInputsForCode(validation, code);
  return matches.length === 1 && matches[0]?.layerId ? matches[0] : null;
}

function matchKnownDraftMaterial(instruction: string): {
  materialId: string;
  materialName: string;
} | null {
  const normalized = normalizeDraftAnswerText(instruction);
  const aliasEntries = KNOWN_DRAFT_MATERIAL_ALIASES.flatMap((material) =>
    material.aliases.map((alias) => ({
      alias: normalizeDraftAnswerText(alias),
      materialId: material.materialId,
      materialName: material.materialName
    }))
  ).sort((left, right) => right.alias.length - left.alias.length);

  return aliasEntries.find((entry) => normalized.includes(entry.alias)) ?? null;
}

function parseThicknessMm(instruction: string): number | null {
  const match = /(\d+(?:[.,]\d+)?)\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b/iu.exec(instruction);
  return match?.[1] ? readPositiveNumber(match[1]) : null;
}

function parseRole(instruction: string): Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown"> | null {
  const normalized = normalizeDraftAnswerText(instruction);
  const rolePatterns: readonly {
    patterns: readonly RegExp[];
    role: Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown">;
  }[] = [
    {
      patterns: [/\bbase\s*structure\b/u, /\bbase\b/u, /\bstructural\s*slab\b/u],
      role: "base_structure"
    },
    {
      patterns: [/\bfloating\s*screed\b/u, /\bscreed\b/u, /\bsap\b/u],
      role: "floating_screed"
    },
    {
      patterns: [/\bfloor\s*covering\b/u, /\bfinish\s*floor\b/u, /\bfinish\b/u, /\bkaplama\b/u],
      role: "floor_covering"
    },
    {
      patterns: [/\bceiling\s*board\b/u, /\btavan\s*levha\b/u],
      role: "ceiling_board"
    },
    {
      patterns: [/\bceiling\s*cavity\b/u, /\btavan\s*bosluk\b/u],
      role: "ceiling_cavity"
    },
    {
      patterns: [/\bceiling\s*fill\b/u, /\btavan\s*dolgu\b/u],
      role: "ceiling_fill"
    },
    {
      patterns: [/\bupper\s*fill\b/u, /\bfill\b/u],
      role: "upper_fill"
    },
    {
      patterns: [/\bside\s*a\b/u, /\bleaf\s*a\b/u, /\bdis\s*yaprak\b/u],
      role: "side_a"
    },
    {
      patterns: [/\bside\s*b\b/u, /\bleaf\s*b\b/u, /\bic\s*yaprak\b/u],
      role: "side_b"
    },
    {
      patterns: [/\bcavity\b/u, /\bair\s*gap\b/u, /\bbosluk\b/u],
      role: "cavity"
    },
    {
      patterns: [/\bcore\b/u, /\bstructural\b/u, /\btasiyici\b/u],
      role: "core"
    },
    {
      patterns: [/\bwall\s*finish\b/u],
      role: "finish"
    },
    {
      patterns: [/\bresilient\b/u, /\bresilient\s*layer\b/u],
      role: "resilient_layer"
    },
    {
      patterns: [/\bslab\b/u, /\bdoseme\b/u],
      role: "slab"
    }
  ];

  return rolePatterns.find((entry) => entry.patterns.some((pattern) => pattern.test(normalized)))?.role ?? null;
}

function outputMentioned(instruction: string, outputId: RequestedOutputId): boolean {
  const normalized = normalizeDraftAnswerText(instruction);
  const compact = normalizeCompactToken(instruction);
  const compactOutput = normalizeCompactToken(outputId);

  if (outputId === "C") {
    return /\bc\b/iu.test(normalized);
  }

  if (outputId === "CI") {
    return /\bci\b/iu.test(normalized);
  }

  if (outputId === "R'w") {
    return /\br\s*'\s*w\b/iu.test(instruction);
  }

  return compactOutput.length > 1 && compact.includes(compactOutput);
}

function parseRequestedOutputs(instruction: string): RequestedOutputId[] {
  return REQUESTED_OUTPUT_IDS.filter((outputId): outputId is RequestedOutputId =>
    REQUESTED_OUTPUT_ID_SET.has(outputId) && outputMentioned(instruction, outputId)
  );
}

function parseDynamicStiffness(instruction: string): number | null {
  const match = /(\d+(?:[.,]\d+)?)\s*(?:mn\s*\/?\s*m(?:3|\^3)|mnm3)\b/iu.exec(instruction);
  return match?.[1] ? readPositiveNumber(match[1]) : null;
}

function parseLoadBasis(instruction: string): number | null {
  const match = /(\d+(?:[.,]\d+)?)\s*(?:kg\s*\/?\s*m(?:2|\^2)|kgm2)\b/iu.exec(instruction);
  return match?.[1] ? readPositiveNumber(match[1]) : null;
}

function parseRoomVolume(instruction: string): number | null {
  const match = /(\d+(?:[.,]\d+)?)\s*(?:m(?:3|\^3)|metre\s*kup|meter\s*cubed)\b/iu.exec(instruction);
  return match?.[1] ? readPositiveNumber(match[1]) : null;
}

function parseWallSupportSpacing(instruction: string): number | null {
  const normalized = normalizeDraftAnswerText(instruction);
  if (!/\b(?:aks|spacing|stud|support|aralik)\b/u.test(normalized)) {
    return null;
  }

  const match = /(\d+(?:[.,]\d+)?)\s*(?:mm|millimeters?|millimetres?|milimetre|milimeter)\b/iu.exec(instruction);
  return match?.[1] ? readPositiveNumber(match[1]) : null;
}

function parseWallTopology(instruction: string): ReportAssistantLayerStackDraftWallTopology | null {
  const normalized = normalizeDraftAnswerText(instruction);

  if (/\b(?:single\s*leaf|single\s*wythe|tek\s*yaprak)\b/u.test(normalized)) {
    return {
      leafMapping: "not_required",
      topology: "single_leaf"
    };
  }

  if (/\b(?:double\s*leaf|cift\s*yaprak|independent\s*frame|twin\s*frame|resilient\s*channel)\b/u.test(normalized)) {
    return {
      leafMapping: "inferred",
      ...(normalized.includes("resilient channel")
        ? { supportTopology: "resilient_channel" as const }
        : normalized.includes("twin frame") || normalized.includes("independent frame")
          ? { supportTopology: "independent_frames" as const }
          : {}),
      topology: "double_leaf_framed"
    };
  }

  return null;
}

function readLayerStackDraftState(value: unknown): Omit<ReportAssistantLayerStackDraftEditorState, "assistantContextSignature"> | null {
  if (!isRecord(value) || !isRecord(value.draft) || !isRecord(value.validation)) {
    return null;
  }

  const draft = value.draft as Partial<ReportAssistantLayerStackDraft>;
  const validation = value.validation as Partial<ReportAssistantLayerStackDraftValidation>;

  if (
    typeof draft.draftId !== "string" ||
    typeof draft.contextSignature !== "string" ||
    typeof draft.sourceInstruction !== "string" ||
    !Array.isArray(draft.layers) ||
    !Array.isArray(draft.requestedOutputs) ||
    !Array.isArray(draft.assumptions) ||
    !Array.isArray(draft.customMaterials) ||
    !Array.isArray(draft.originalPhrases) ||
    !Array.isArray(draft.warnings) ||
    typeof validation.ok !== "boolean" ||
    !Array.isArray(validation.missingInputs) ||
    !Array.isArray(validation.clarifyingQuestions) ||
    (validation.status !== "needs_input" && validation.status !== "ready")
  ) {
    return null;
  }

  return {
    draft: draft as ReportAssistantLayerStackDraft,
    validation: validation as ReportAssistantLayerStackDraftValidation
  };
}

export function getReportAssistantLayerStackDraftEditorStateFromQueryPayload(
  payload: unknown,
  assistantContextSignature?: string
): ReportAssistantLayerStackDraftEditorState | null {
  if (!isRecord(payload)) {
    return null;
  }

  const topLevelState = readLayerStackDraftState(payload.layerStackDraft);
  if (topLevelState) {
    return {
      ...topLevelState,
      ...(assistantContextSignature ? { assistantContextSignature } : {})
    };
  }

  const calculatorPreview = isRecord(payload.calculatorPreview) ? payload.calculatorPreview : null;
  const preview = calculatorPreview && isRecord(calculatorPreview.preview) ? calculatorPreview.preview : null;
  const nestedState = preview ? readLayerStackDraftState(preview.layerStackDraft) : null;

  return nestedState
    ? {
        ...nestedState,
        ...(assistantContextSignature ? { assistantContextSignature } : {})
      }
    : null;
}

export function buildReportAssistantLayerStackDraftEditorContinuation(input: {
  assistantContextSignature?: string;
  instruction: string;
  state: ReportAssistantLayerStackDraftEditorState;
}): ReportAssistantLayerStackDraftEditorContinuationBuildResult {
  if (
    input.state.assistantContextSignature &&
    input.assistantContextSignature &&
    input.state.assistantContextSignature !== input.assistantContextSignature
  ) {
    return {
      errors: ["Active layer-stack draft belongs to an older assistant context."],
      ok: false,
      questions: ["Restart the layer-stack draft from the current report context."]
    };
  }

  const validation = validateReportAssistantLayerStackDraft(input.state.draft);
  if (validation.ok) {
    return {
      errors: ["Active layer-stack draft has no unresolved inputs."],
      ok: false,
      questions: []
    };
  }

  const answerBase = {
    contextSignature: input.state.draft.contextSignature,
    draftId: input.state.draft.draftId
  };
  const answers: ReportAssistantLayerStackDraftContinuationAnswer[] = [];

  const materialInput = exactlyOneLayerMissingInput(validation, "assistant_layer_material_missing");
  const material = materialInput ? matchKnownDraftMaterial(input.instruction) : null;
  if (materialInput?.layerId && material) {
    answers.push({
      ...answerBase,
      kind: "layer_material",
      layerId: materialInput.layerId,
      materialId: material.materialId,
      materialName: material.materialName
    });
  }

  const thicknessInput = exactlyOneLayerMissingInput(validation, "assistant_layer_thickness_missing");
  const thicknessMm = thicknessInput ? parseThicknessMm(input.instruction) : null;
  if (thicknessInput?.layerId && thicknessMm) {
    answers.push({
      ...answerBase,
      kind: "layer_thickness",
      layerId: thicknessInput.layerId,
      thicknessMm
    });
  }

  const roleInput = exactlyOneLayerMissingInput(validation, "assistant_layer_role_missing");
  const role = roleInput ? parseRole(input.instruction) : null;
  if (roleInput?.layerId && role) {
    answers.push({
      ...answerBase,
      kind: "layer_role",
      layerId: roleInput.layerId,
      role
    });
  }

  if (missingInputsForCode(validation, "assistant_target_outputs_missing").length > 0) {
    const requestedOutputs = parseRequestedOutputs(input.instruction);
    if (requestedOutputs.length > 0) {
      answers.push({
        ...answerBase,
        kind: "target_outputs",
        requestedOutputs
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_floor_impact_dynamic_stiffness_missing").length > 0) {
    const dynamicStiffnessMNm3 = parseDynamicStiffness(input.instruction);
    if (dynamicStiffnessMNm3) {
      answers.push({
        ...answerBase,
        dynamicStiffnessMNm3,
        kind: "floor_impact_dynamic_stiffness"
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_floor_impact_load_basis_missing").length > 0) {
    const loadBasisKgM2 = parseLoadBasis(input.instruction);
    if (loadBasisKgM2) {
      answers.push({
        ...answerBase,
        kind: "floor_impact_load_basis",
        loadBasisKgM2
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_floor_impact_target_metric_basis_missing").length > 0) {
    const normalized = normalizeDraftAnswerText(input.instruction);
    if (/\biso\b/u.test(normalized) || /\bastm\b/u.test(normalized)) {
      answers.push({
        ...answerBase,
        kind: "floor_impact_target_metric_basis",
        targetMetricBasis: /\bastm\b/u.test(normalized) ? "astm" : "iso"
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_floor_impact_field_lab_context_missing").length > 0) {
    const normalized = normalizeDraftAnswerText(input.instruction);
    if (/\b(?:field|saha)\b/u.test(normalized) || /\b(?:lab|laboratuvar)\b/u.test(normalized)) {
      answers.push({
        ...answerBase,
        fieldLabContext: /\b(?:field|saha)\b/u.test(normalized) ? "field" : "lab",
        kind: "floor_impact_field_context"
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_floor_impact_room_volume_missing").length > 0) {
    const receivingRoomVolumeM3 = parseRoomVolume(input.instruction);
    if (receivingRoomVolumeM3) {
      answers.push({
        ...answerBase,
        kind: "floor_impact_room_volume",
        receivingRoomVolumeM3
      });
    }
  }

  if (
    missingInputsForCode(validation, "assistant_wall_topology_missing").length > 0 ||
    missingInputsForCode(validation, "assistant_wall_leaf_mapping_missing").length > 0
  ) {
    const wallTopologyDraft = parseWallTopology(input.instruction);
    if (wallTopologyDraft) {
      answers.push({
        ...answerBase,
        kind: "wall_topology",
        wallTopologyDraft
      });
    }
  }

  if (missingInputsForCode(validation, "assistant_wall_support_spacing_missing").length > 0) {
    const supportSpacingMm = parseWallSupportSpacing(input.instruction);
    if (supportSpacingMm) {
      answers.push({
        ...answerBase,
        kind: "wall_support_spacing",
        supportSpacingMm
      });
    }
  }

  if (answers.length === 0) {
    return {
      errors: ["No safe structured draft answer could be extracted from the message."],
      ok: false,
      questions: validation.clarifyingQuestions
    };
  }

  return {
    draftContinuation: {
      answers,
      currentContextSignature: input.state.draft.contextSignature,
      draft: input.state.draft
    },
    ok: true,
    summary: `Structured draft continuation prepared with ${answers.length} answer${answers.length === 1 ? "" : "s"}.`
  };
}
