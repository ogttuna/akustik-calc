import {
  REQUESTED_OUTPUT_IDS,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraftFloorImpact,
  type ReportAssistantLayerStackDraftLayer,
  type ReportAssistantLayerStackDraftLayerRole,
  type ReportAssistantLayerStackDraftMissingInput,
  type ReportAssistantLayerStackDraftPhysicalInputKey,
  type ReportAssistantLayerStackDraftValidation,
  type ReportAssistantLayerStackDraftWallTopology
} from "./report-assistant-layer-stack-draft";

export type ReportAssistantLayerStackDraftContinuationAnswerBase = {
  contextSignature: string;
  draftId: string;
};

export type ReportAssistantLayerStackDraftContinuationAnswer =
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "floor_impact_dynamic_stiffness";
      dynamicStiffnessMNm3: number;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "floor_impact_field_context";
      fieldLabContext: "field" | "lab";
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "floor_impact_load_basis";
      loadBasisKgM2: number;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "floor_impact_room_volume";
      receivingRoomVolumeM3: number;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "floor_impact_target_metric_basis";
      targetMetricBasis: "astm" | "iso";
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "layer_material";
      layerId: string;
      materialId: string;
      materialName?: string;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "layer_role";
      layerId: string;
      role: Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown">;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "layer_thickness";
      layerId: string;
      thicknessMm: number;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "target_outputs";
      requestedOutputs: readonly RequestedOutputId[];
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "wall_topology";
      wallTopologyDraft: ReportAssistantLayerStackDraftWallTopology;
    })
  | (ReportAssistantLayerStackDraftContinuationAnswerBase & {
      kind: "wall_support_spacing";
      supportSpacingMm: number;
    });

export type ReportAssistantLayerStackDraftContinuationResult =
  | {
      appliedAnswerKinds: readonly ReportAssistantLayerStackDraftContinuationAnswer["kind"][];
      draft: ReportAssistantLayerStackDraft;
      ok: true;
      status: "needs_input" | "ready";
      validation: ReportAssistantLayerStackDraftValidation;
    }
  | {
      draft: ReportAssistantLayerStackDraft;
      errors: readonly string[];
      ok: false;
      status: "draft_mismatch" | "invalid_answer" | "stale";
      validation: ReportAssistantLayerStackDraftValidation;
    };

export type ReportAssistantLayerStackDraftContinuationRequest = {
  answers: readonly ReportAssistantLayerStackDraftContinuationAnswer[];
  currentContextSignature?: string;
  draft: ReportAssistantLayerStackDraft;
};

export type ReportAssistantLayerStackDraftContinuationPayloadParseResult =
  | {
      ok: true;
      request: ReportAssistantLayerStackDraftContinuationRequest;
    }
  | {
      errors: readonly string[];
      ok: false;
    };

const DRAFT_MODES = new Set<ReportAssistantLayerStackDraft["mode"]>(["floor", "unknown", "wall"]);
const DRAFT_SOURCES = new Set<ReportAssistantLayerStackDraft["source"]>([
  "common_preset",
  "current_workbench_stack",
  "project_assembly",
  "user_instruction",
  "user_preset"
]);
const LAYER_ROLES = new Set<ReportAssistantLayerStackDraftLayerRole>([
  "base_structure",
  "cavity",
  "ceiling_board",
  "ceiling_cavity",
  "ceiling_fill",
  "core",
  "finish",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "side_a",
  "side_b",
  "slab",
  "upper_fill",
  "unknown"
]);
const CONTINUATION_LAYER_ROLES = new Set<Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown">>([
  "base_structure",
  "cavity",
  "ceiling_board",
  "ceiling_cavity",
  "ceiling_fill",
  "core",
  "finish",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "side_a",
  "side_b",
  "slab",
  "upper_fill"
]);
const REQUESTED_OUTPUT_SET = new Set<string>(REQUESTED_OUTPUT_IDS);
const PHYSICAL_INPUT_KEYS = new Set<ReportAssistantLayerStackDraftPhysicalInputKey>([
  "dynamic_stiffness",
  "field_lab_context",
  "load_basis",
  "room_volume",
  "target_metric_basis",
  "wall_cavity_depth",
  "wall_leaf_mapping",
  "wall_support_spacing",
  "wall_support_topology"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function readRequestedOutputs(value: unknown): RequestedOutputId[] {
  return Array.isArray(value)
    ? Array.from(new Set(value.filter((entry): entry is RequestedOutputId =>
        typeof entry === "string" && REQUESTED_OUTPUT_SET.has(entry)
      )))
    : [];
}

function readPositiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function parseLayer(value: unknown, errors: string[]): ReportAssistantLayerStackDraftLayer | null {
  if (!isRecord(value)) {
    errors.push("Draft layer must be an object.");
    return null;
  }

  const id = readNonEmptyString(value.id);
  const originalPhrase = typeof value.originalPhrase === "string" ? value.originalPhrase : null;
  const role = typeof value.role === "string" && LAYER_ROLES.has(value.role as ReportAssistantLayerStackDraftLayerRole)
    ? value.role as ReportAssistantLayerStackDraftLayerRole
    : null;

  if (!id || originalPhrase === null || !role) {
    errors.push("Draft layer requires id, originalPhrase, and a supported role.");
    return null;
  }

  return {
    id,
    ...(typeof value.materialId === "string" && value.materialId.trim().length > 0 ? { materialId: value.materialId.trim() } : {}),
    ...(typeof value.materialName === "string" && value.materialName.trim().length > 0 ? { materialName: value.materialName.trim() } : {}),
    originalPhrase,
    role,
    ...(readPositiveNumber(value.thicknessMm) ? { thicknessMm: readPositiveNumber(value.thicknessMm) } : {})
  };
}

function parseWallTopology(value: unknown): ReportAssistantLayerStackDraft["wallTopologyDraft"] {
  if (!isRecord(value)) {
    return undefined;
  }

  const topology = value.topology === "double_leaf_framed" || value.topology === "single_leaf" || value.topology === "unknown"
    ? value.topology
    : "unknown";
  const leafMapping =
    value.leafMapping === "explicit" ||
    value.leafMapping === "inferred" ||
    value.leafMapping === "missing" ||
    value.leafMapping === "not_required"
      ? value.leafMapping
      : "missing";
  const supportTopology =
    value.supportTopology === "direct_fixed" ||
    value.supportTopology === "independent_frames" ||
    value.supportTopology === "resilient_channel" ||
    value.supportTopology === "single_shared_stud" ||
    value.supportTopology === "twin_frame" ||
    value.supportTopology === "unknown"
      ? value.supportTopology
      : undefined;

  return {
    leafMapping,
    ...(readPositiveNumber(value.supportSpacingMm) ? { supportSpacingMm: readPositiveNumber(value.supportSpacingMm) } : {}),
    ...(supportTopology ? { supportTopology } : {}),
    topology
  };
}

function parseFloorImpact(value: unknown): ReportAssistantLayerStackDraft["floorImpactDraft"] {
  if (!isRecord(value)) {
    return undefined;
  }

  const requiredPhysicalInputs = Array.isArray(value.requiredPhysicalInputs)
    ? value.requiredPhysicalInputs.filter((entry): entry is ReportAssistantLayerStackDraftPhysicalInputKey =>
        typeof entry === "string" && PHYSICAL_INPUT_KEYS.has(entry as ReportAssistantLayerStackDraftPhysicalInputKey)
      )
    : [];

  return {
    ...(readPositiveNumber(value.dynamicStiffnessMNm3) ? { dynamicStiffnessMNm3: readPositiveNumber(value.dynamicStiffnessMNm3) } : {}),
    ...(value.fieldLabContext === "field" || value.fieldLabContext === "lab" || value.fieldLabContext === "unknown"
      ? { fieldLabContext: value.fieldLabContext }
      : {}),
    ...(readPositiveNumber(value.loadBasisKgM2) ? { loadBasisKgM2: readPositiveNumber(value.loadBasisKgM2) } : {}),
    ...(readPositiveNumber(value.receivingRoomVolumeM3) ? { receivingRoomVolumeM3: readPositiveNumber(value.receivingRoomVolumeM3) } : {}),
    requiredPhysicalInputs,
    ...(value.targetMetricBasis === "astm" || value.targetMetricBasis === "iso" || value.targetMetricBasis === "unknown"
      ? { targetMetricBasis: value.targetMetricBasis }
      : {})
  };
}

function parseDraft(value: unknown, errors: string[]): ReportAssistantLayerStackDraft | null {
  if (!isRecord(value)) {
    errors.push("draftContinuation.draft must be an object.");
    return null;
  }

  const draftId = readNonEmptyString(value.draftId);
  const contextSignature = readNonEmptyString(value.contextSignature);
  const mode = typeof value.mode === "string" && DRAFT_MODES.has(value.mode as ReportAssistantLayerStackDraft["mode"])
    ? value.mode as ReportAssistantLayerStackDraft["mode"]
    : null;
  const source = typeof value.source === "string" && DRAFT_SOURCES.has(value.source as ReportAssistantLayerStackDraft["source"])
    ? value.source as ReportAssistantLayerStackDraft["source"]
    : null;
  const sourceInstruction = typeof value.sourceInstruction === "string" ? value.sourceInstruction : null;
  const layers = Array.isArray(value.layers)
    ? value.layers.map((entry) => parseLayer(entry, errors)).filter((entry): entry is ReportAssistantLayerStackDraftLayer => entry !== null)
    : [];

  if (!draftId || !contextSignature || !mode || !source || sourceInstruction === null || !Array.isArray(value.layers)) {
    errors.push("draftContinuation.draft requires draftId, contextSignature, mode, source, sourceInstruction, and layers.");
    return null;
  }

  return {
    assumptions: readStringArray(value.assumptions),
    contextSignature,
    customMaterials: Array.isArray(value.customMaterials) ? value.customMaterials as MaterialDefinition[] : [],
    draftId,
    ...(parseFloorImpact(value.floorImpactDraft) ? { floorImpactDraft: parseFloorImpact(value.floorImpactDraft) } : {}),
    layers,
    mode,
    originalPhrases: readStringArray(value.originalPhrases),
    requestedOutputs: readRequestedOutputs(value.requestedOutputs),
    source,
    sourceInstruction,
    ...(parseWallTopology(value.wallTopologyDraft) ? { wallTopologyDraft: parseWallTopology(value.wallTopologyDraft) } : {}),
    warnings: readStringArray(value.warnings)
  };
}

function parseAnswer(value: unknown, errors: string[]): ReportAssistantLayerStackDraftContinuationAnswer | null {
  if (!isRecord(value)) {
    errors.push("Draft continuation answer must be an object.");
    return null;
  }

  const draftId = readNonEmptyString(value.draftId);
  const contextSignature = readNonEmptyString(value.contextSignature);
  const kind = typeof value.kind === "string" ? value.kind : null;
  if (!draftId || !contextSignature || !kind) {
    errors.push("Draft continuation answer requires draftId, contextSignature, and kind.");
    return null;
  }
  const base = { contextSignature, draftId };

  switch (kind) {
    case "floor_impact_dynamic_stiffness":
      return readPositiveNumber(value.dynamicStiffnessMNm3)
        ? { ...base, dynamicStiffnessMNm3: readPositiveNumber(value.dynamicStiffnessMNm3)!, kind }
        : null;
    case "floor_impact_field_context":
      return value.fieldLabContext === "field" || value.fieldLabContext === "lab"
        ? { ...base, fieldLabContext: value.fieldLabContext, kind }
        : null;
    case "floor_impact_load_basis":
      return readPositiveNumber(value.loadBasisKgM2)
        ? { ...base, kind, loadBasisKgM2: readPositiveNumber(value.loadBasisKgM2)! }
        : null;
    case "floor_impact_room_volume":
      return readPositiveNumber(value.receivingRoomVolumeM3)
        ? { ...base, kind, receivingRoomVolumeM3: readPositiveNumber(value.receivingRoomVolumeM3)! }
        : null;
    case "floor_impact_target_metric_basis":
      return value.targetMetricBasis === "astm" || value.targetMetricBasis === "iso"
        ? { ...base, kind, targetMetricBasis: value.targetMetricBasis }
        : null;
    case "layer_material": {
      const layerId = readNonEmptyString(value.layerId);
      const materialId = readNonEmptyString(value.materialId);
      return layerId && materialId
        ? { ...base, kind, layerId, materialId, ...(readNonEmptyString(value.materialName) ? { materialName: readNonEmptyString(value.materialName)! } : {}) }
        : null;
    }
    case "layer_role": {
      const layerId = readNonEmptyString(value.layerId);
      const role = typeof value.role === "string" && CONTINUATION_LAYER_ROLES.has(value.role as Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown">)
        ? value.role as Exclude<ReportAssistantLayerStackDraftLayerRole, "unknown">
        : null;
      return layerId && role ? { ...base, kind, layerId, role } : null;
    }
    case "layer_thickness": {
      const layerId = readNonEmptyString(value.layerId);
      const thicknessMm = readPositiveNumber(value.thicknessMm);
      return layerId && thicknessMm ? { ...base, kind, layerId, thicknessMm } : null;
    }
    case "target_outputs": {
      const requestedOutputs = readRequestedOutputs(value.requestedOutputs);
      return requestedOutputs.length ? { ...base, kind, requestedOutputs } : null;
    }
    case "wall_topology": {
      const wallTopologyDraft = parseWallTopology(value.wallTopologyDraft);
      return wallTopologyDraft ? { ...base, kind, wallTopologyDraft } : null;
    }
    case "wall_support_spacing": {
      const supportSpacingMm = readPositiveNumber(value.supportSpacingMm);
      return supportSpacingMm ? { ...base, kind, supportSpacingMm } : null;
    }
    default:
      errors.push(`Unsupported draft continuation answer kind: ${kind}.`);
      return null;
  }
}

export function parseReportAssistantLayerStackDraftContinuationPayload(
  value: unknown
): ReportAssistantLayerStackDraftContinuationPayloadParseResult {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return {
      errors: ["draftContinuation must be an object."],
      ok: false
    };
  }

  const draft = parseDraft(value.draft, errors);
  const answers = Array.isArray(value.answers)
    ? value.answers.map((entry) => parseAnswer(entry, errors)).filter((entry): entry is ReportAssistantLayerStackDraftContinuationAnswer => entry !== null)
    : [];
  if (!Array.isArray(value.answers)) {
    errors.push("draftContinuation.answers must be an array.");
  }
  if (!draft || errors.length > 0) {
    return {
      errors: errors.length ? errors : ["draftContinuation payload could not be parsed."],
      ok: false
    };
  }

  return {
    ok: true,
    request: {
      answers,
      ...(typeof value.currentContextSignature === "string" ? { currentContextSignature: value.currentContextSignature } : {}),
      draft
    }
  };
}

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function floorImpactKeyForAnswer(
  answer: ReportAssistantLayerStackDraftContinuationAnswer
): ReportAssistantLayerStackDraftPhysicalInputKey | null {
  switch (answer.kind) {
    case "floor_impact_dynamic_stiffness":
      return "dynamic_stiffness";
    case "floor_impact_field_context":
      return "field_lab_context";
    case "floor_impact_load_basis":
      return "load_basis";
    case "floor_impact_room_volume":
      return "room_volume";
    case "floor_impact_target_metric_basis":
      return "target_metric_basis";
    case "layer_material":
    case "layer_role":
    case "layer_thickness":
    case "target_outputs":
    case "wall_topology":
    case "wall_support_spacing":
      return null;
  }
}

function answerMatchesMissingInput(
  answer: ReportAssistantLayerStackDraftContinuationAnswer,
  missingInput: ReportAssistantLayerStackDraftMissingInput
): boolean {
  switch (answer.kind) {
    case "layer_material":
      return missingInput.code === "assistant_layer_material_missing" && missingInput.layerId === answer.layerId;
    case "layer_role":
      return missingInput.code === "assistant_layer_role_missing" && missingInput.layerId === answer.layerId;
    case "layer_thickness":
      return missingInput.code === "assistant_layer_thickness_missing" && missingInput.layerId === answer.layerId;
    case "target_outputs":
      return missingInput.code === "assistant_target_outputs_missing";
    case "wall_topology":
      return missingInput.code === "assistant_wall_topology_missing" || missingInput.code === "assistant_wall_leaf_mapping_missing";
    case "wall_support_spacing":
      return missingInput.code === "assistant_wall_support_spacing_missing";
    case "floor_impact_dynamic_stiffness":
    case "floor_impact_field_context":
    case "floor_impact_load_basis":
    case "floor_impact_room_volume":
    case "floor_impact_target_metric_basis":
      return missingInput.category === "physical_input" && missingInput.physicalInput === floorImpactKeyForAnswer(answer);
  }
}

function answerTargetsMissingInput(
  answer: ReportAssistantLayerStackDraftContinuationAnswer,
  validation: ReportAssistantLayerStackDraftValidation,
  answerBatch: readonly ReportAssistantLayerStackDraftContinuationAnswer[]
): boolean {
  if (validation.missingInputs.some((missingInput) => answerMatchesMissingInput(answer, missingInput))) {
    return true;
  }

  return answer.kind === "wall_support_spacing" &&
    validation.missingInputs.some((missingInput) =>
      missingInput.code === "assistant_wall_topology_missing" ||
      missingInput.code === "assistant_wall_leaf_mapping_missing"
    ) &&
    answerBatch.some((entry) =>
      entry.kind === "wall_topology" &&
      entry.wallTopologyDraft.topology === "double_leaf_framed" &&
      entry.wallTopologyDraft.supportTopology !== undefined &&
      entry.wallTopologyDraft.supportTopology !== "unknown" &&
      entry.wallTopologyDraft.supportTopology !== "direct_fixed"
    );
}

function validateAnswerShape(answer: ReportAssistantLayerStackDraftContinuationAnswer): string | null {
  switch (answer.kind) {
    case "floor_impact_dynamic_stiffness":
      return isPositiveNumber(answer.dynamicStiffnessMNm3) ? null : "Dynamic stiffness must be a positive number.";
    case "floor_impact_load_basis":
      return isPositiveNumber(answer.loadBasisKgM2) ? null : "Load basis must be a positive number.";
    case "floor_impact_room_volume":
      return isPositiveNumber(answer.receivingRoomVolumeM3) ? null : "Receiving room volume must be a positive number.";
    case "layer_material":
      return answer.materialId.trim().length > 0 ? null : "Layer material id cannot be empty.";
    case "layer_role":
      return null;
    case "layer_thickness":
      return isPositiveNumber(answer.thicknessMm) ? null : "Layer thickness must be a positive number.";
    case "target_outputs":
      return answer.requestedOutputs.length > 0 ? null : "Target outputs answer must include at least one output.";
    case "floor_impact_field_context":
    case "floor_impact_target_metric_basis":
    case "wall_topology":
      return null;
    case "wall_support_spacing":
      return isPositiveNumber(answer.supportSpacingMm) ? null : "Wall support spacing must be a positive number.";
  }
}

function mergeWallTopology(
  draft: ReportAssistantLayerStackDraft,
  update: Partial<ReportAssistantLayerStackDraftWallTopology>
): ReportAssistantLayerStackDraft {
  const previous = draft.wallTopologyDraft ?? {
    leafMapping: "missing" as const,
    topology: "unknown" as const
  };

  return {
    ...draft,
    wallTopologyDraft: {
      ...previous,
      ...update
    }
  };
}

function updateLayer(
  draft: ReportAssistantLayerStackDraft,
  layerId: string,
  update: (layer: ReportAssistantLayerStackDraftLayer) => ReportAssistantLayerStackDraftLayer
): ReportAssistantLayerStackDraft {
  return {
    ...draft,
    layers: draft.layers.map((layer) => layer.id === layerId ? update(layer) : layer)
  };
}

function mergeFloorImpact(
  draft: ReportAssistantLayerStackDraft,
  update: Partial<ReportAssistantLayerStackDraftFloorImpact>
): ReportAssistantLayerStackDraft {
  const previous = draft.floorImpactDraft ?? {
    requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"]
  };

  return {
    ...draft,
    floorImpactDraft: {
      ...previous,
      ...update,
      requiredPhysicalInputs: previous.requiredPhysicalInputs
    }
  };
}

function applyContinuationAnswer(
  draft: ReportAssistantLayerStackDraft,
  answer: ReportAssistantLayerStackDraftContinuationAnswer
): ReportAssistantLayerStackDraft {
  switch (answer.kind) {
    case "floor_impact_dynamic_stiffness":
      return mergeFloorImpact(draft, { dynamicStiffnessMNm3: answer.dynamicStiffnessMNm3 });
    case "floor_impact_field_context":
      return mergeFloorImpact(draft, { fieldLabContext: answer.fieldLabContext });
    case "floor_impact_load_basis":
      return mergeFloorImpact(draft, { loadBasisKgM2: answer.loadBasisKgM2 });
    case "floor_impact_room_volume":
      return mergeFloorImpact(draft, { receivingRoomVolumeM3: answer.receivingRoomVolumeM3 });
    case "floor_impact_target_metric_basis":
      return mergeFloorImpact(draft, { targetMetricBasis: answer.targetMetricBasis });
    case "layer_material":
      return updateLayer(draft, answer.layerId, (layer) => ({
        ...layer,
        materialId: answer.materialId,
        ...(answer.materialName ? { materialName: answer.materialName } : {})
      }));
    case "layer_role":
      return updateLayer(draft, answer.layerId, (layer) => ({
        ...layer,
        role: answer.role
      }));
    case "layer_thickness":
      return updateLayer(draft, answer.layerId, (layer) => ({
        ...layer,
        thicknessMm: answer.thicknessMm
      }));
    case "target_outputs":
      return {
        ...draft,
        requestedOutputs: [...answer.requestedOutputs]
      };
    case "wall_topology":
      return mergeWallTopology(draft, answer.wallTopologyDraft);
    case "wall_support_spacing":
      return mergeWallTopology(draft, { supportSpacingMm: answer.supportSpacingMm });
  }
}

function answerLayerExists(
  draft: ReportAssistantLayerStackDraft,
  answer: ReportAssistantLayerStackDraftContinuationAnswer
): boolean {
  return !("layerId" in answer) || draft.layers.some((layer) => layer.id === answer.layerId);
}

export function mergeReportAssistantLayerStackDraftContinuation(input: {
  answers: readonly ReportAssistantLayerStackDraftContinuationAnswer[];
  currentContextSignature?: string;
  draft: ReportAssistantLayerStackDraft;
}): ReportAssistantLayerStackDraftContinuationResult {
  const initialValidation = validateReportAssistantLayerStackDraft(input.draft);

  if (input.answers.length === 0) {
    return {
      draft: input.draft,
      errors: ["At least one structured draft continuation answer is required."],
      ok: false,
      status: "invalid_answer",
      validation: initialValidation
    };
  }

  if (input.currentContextSignature !== undefined && input.currentContextSignature !== input.draft.contextSignature) {
    return {
      draft: input.draft,
      errors: ["Draft context signature is stale; restart or revalidate the draft before merging answers."],
      ok: false,
      status: "stale",
      validation: initialValidation
    };
  }

  const errors: string[] = [];

  for (const answer of input.answers) {
    if (answer.draftId !== input.draft.draftId) {
      errors.push(`Answer draftId "${answer.draftId}" does not match active draft "${input.draft.draftId}".`);
      continue;
    }

    if (answer.contextSignature !== input.draft.contextSignature) {
      errors.push("Answer context signature is stale for the active draft.");
      continue;
    }

    if (!answerLayerExists(input.draft, answer)) {
      errors.push(`Answer targets an unknown layer id.`);
      continue;
    }

    const shapeError = validateAnswerShape(answer);
    if (shapeError) {
      errors.push(shapeError);
      continue;
    }

    if (!answerTargetsMissingInput(answer, initialValidation, input.answers)) {
      errors.push(`Answer kind "${answer.kind}" does not match any unresolved draft input.`);
    }
  }

  if (errors.length > 0) {
    return {
      draft: input.draft,
      errors,
      ok: false,
      status: errors.some((error) => error.includes("stale")) ? "stale" : "invalid_answer",
      validation: initialValidation
    };
  }

  const nextDraft = input.answers.reduce(applyContinuationAnswer, input.draft);
  const nextValidation = validateReportAssistantLayerStackDraft(nextDraft);

  return {
    appliedAnswerKinds: input.answers.map((answer) => answer.kind),
    draft: nextDraft,
    ok: true,
    status: nextValidation.status,
    validation: nextValidation
  };
}
