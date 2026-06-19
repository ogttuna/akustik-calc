import {
  REQUESTED_OUTPUT_IDS,
  type FloorRole,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import type { WorkbenchV2StudyMode } from "../workbench-rebuild/workbench-v2-project-snapshot";

export type ReportAssistantLayerStackDraftMode = WorkbenchV2StudyMode | "unknown";

export type ReportAssistantLayerStackDraftSource =
  | "common_preset"
  | "current_workbench_stack"
  | "project_assembly"
  | "user_instruction"
  | "user_preset";

export type ReportAssistantLayerStackDraftLayerRole =
  | FloorRole
  | "cavity"
  | "core"
  | "finish"
  | "resilient_layer"
  | "side_a"
  | "side_b"
  | "slab"
  | "unknown";

export type ReportAssistantLayerStackDraftMissingInputCategory =
  | "layer_stack"
  | "material"
  | "physical_input"
  | "role"
  | "target_output"
  | "thickness"
  | "topology"
  | "unsupported";

export type ReportAssistantLayerStackDraftPhysicalInputKey =
  | "dynamic_stiffness"
  | "field_lab_context"
  | "load_basis"
  | "room_volume"
  | "target_metric_basis"
  | "wall_cavity_depth"
  | "wall_leaf_mapping"
  | "wall_support_spacing"
  | "wall_support_topology";

export type ReportAssistantLayerStackDraftWallTopology = {
  leafMapping: "explicit" | "inferred" | "missing" | "not_required";
  supportSpacingMm?: number;
  supportTopology?: "direct_fixed" | "independent_frames" | "resilient_channel" | "single_shared_stud" | "twin_frame" | "unknown";
  topology: "double_leaf_framed" | "single_leaf" | "unknown";
};

export type ReportAssistantLayerStackDraftFloorImpact = {
  dynamicStiffnessMNm3?: number;
  fieldLabContext?: "field" | "lab" | "unknown";
  loadBasisKgM2?: number;
  receivingRoomVolumeM3?: number;
  requiredPhysicalInputs: readonly ReportAssistantLayerStackDraftPhysicalInputKey[];
  targetMetricBasis?: "astm" | "iso" | "unknown";
};

export type ReportAssistantLayerStackDraftLayer = {
  id: string;
  materialId?: string;
  materialName?: string;
  originalPhrase: string;
  role: ReportAssistantLayerStackDraftLayerRole;
  thicknessMm?: number;
};

export type ReportAssistantLayerStackDraftLastCalculatorPreview = {
  routeStatus: "needs_input" | "ready" | "unsupported";
  snapshotSignature: string;
};

export type ReportAssistantLayerStackDraft = {
  assumptions: readonly string[];
  contextSignature: string;
  customMaterials: readonly MaterialDefinition[];
  draftId: string;
  floorImpactDraft?: ReportAssistantLayerStackDraftFloorImpact;
  lastCalculatorPreview?: ReportAssistantLayerStackDraftLastCalculatorPreview;
  layers: readonly ReportAssistantLayerStackDraftLayer[];
  mode: ReportAssistantLayerStackDraftMode;
  originalPhrases: readonly string[];
  requestedOutputs: readonly RequestedOutputId[];
  source: ReportAssistantLayerStackDraftSource;
  sourceInstruction: string;
  wallTopologyDraft?: ReportAssistantLayerStackDraftWallTopology;
  warnings: readonly string[];
};

export type ReportAssistantLayerStackDraftMissingInput = {
  category: ReportAssistantLayerStackDraftMissingInputCategory;
  code: string;
  layerId?: string;
  message: string;
  physicalInput?: ReportAssistantLayerStackDraftPhysicalInputKey;
  question: string;
};

export type ReportAssistantLayerStackDraftValidation = {
  clarifyingQuestions: readonly string[];
  missingInputs: readonly ReportAssistantLayerStackDraftMissingInput[];
  ok: boolean;
  status: "needs_input" | "ready";
};

const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "LIIC",
  "LIR",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A"
]);

function uniqueQuestions(inputs: readonly ReportAssistantLayerStackDraftMissingInput[]): string[] {
  return [...new Set(inputs.map((input) => input.question))];
}

function isPositiveNumber(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isRequestedOutputId(value: unknown): value is RequestedOutputId {
  return typeof value === "string" && REQUESTED_OUTPUT_ID_SET.has(value);
}

function missingInput(input: ReportAssistantLayerStackDraftMissingInput): ReportAssistantLayerStackDraftMissingInput {
  return input;
}

function collectLayerInputs(draft: ReportAssistantLayerStackDraft, missingInputs: ReportAssistantLayerStackDraftMissingInput[]): void {
  if (draft.layers.length === 0) {
    missingInputs.push(missingInput({
      category: "layer_stack",
      code: "assistant_layer_stack_empty",
      message: "Layer stack draft has no layers.",
      question: "Describe the layer stack with material, role, and mm thickness for each layer."
    }));
    return;
  }

  for (const [index, layer] of draft.layers.entries()) {
    const label = layer.originalPhrase || `layer ${index + 1}`;

    if (!layer.materialId) {
      missingInputs.push(missingInput({
        category: "material",
        code: "assistant_layer_material_missing",
        layerId: layer.id,
        message: `Layer ${index + 1} has no normalized material id.`,
        question: `Which material should be used for "${label}"?`
      }));
    }

    if (!isPositiveNumber(layer.thicknessMm)) {
      missingInputs.push(missingInput({
        category: "thickness",
        code: "assistant_layer_thickness_missing",
        layerId: layer.id,
        message: `Layer ${index + 1} has no positive thickness in mm.`,
        question: `What is the mm thickness for "${label}"?`
      }));
    }

    if (layer.role === "unknown") {
      missingInputs.push(missingInput({
        category: "role",
        code: "assistant_layer_role_missing",
        layerId: layer.id,
        message: `Layer ${index + 1} has no calculator role.`,
        question: `What role should "${label}" use in the stack?`
      }));
    }
  }
}

function collectTargetOutputInputs(draft: ReportAssistantLayerStackDraft, missingInputs: ReportAssistantLayerStackDraftMissingInput[]): void {
  if (draft.requestedOutputs.length === 0) {
    missingInputs.push(missingInput({
      category: "target_output",
      code: "assistant_target_outputs_missing",
      message: "Layer stack draft has no requested acoustic outputs.",
      question: "Which outputs should be calculated? Example: Rw, STC, DnT,w, Ln,w."
    }));
    return;
  }

  for (const output of draft.requestedOutputs) {
    if (!isRequestedOutputId(output)) {
      missingInputs.push(missingInput({
        category: "target_output",
        code: "assistant_target_output_unsupported",
        message: `Unsupported target output "${String(output)}".`,
        question: `Choose a supported target output instead of "${String(output)}".`
      }));
    }
  }
}

function collectWallTopologyInputs(draft: ReportAssistantLayerStackDraft, missingInputs: ReportAssistantLayerStackDraftMissingInput[]): void {
  if (draft.mode !== "wall") {
    return;
  }

  const topology = draft.wallTopologyDraft;
  if (!topology || topology.topology === "unknown") {
    missingInputs.push(missingInput({
      category: "topology",
      code: "assistant_wall_topology_missing",
      message: "Wall draft has no wall topology.",
      physicalInput: "wall_support_topology",
      question: "Is this wall single-leaf, double-leaf framed, resilient-channel, or another supported topology?"
    }));
    return;
  }

  if (topology.topology === "double_leaf_framed" && topology.leafMapping === "missing") {
    missingInputs.push(missingInput({
      category: "topology",
      code: "assistant_wall_leaf_mapping_missing",
      message: "Double-leaf wall draft has no explicit side/cavity layer mapping.",
      physicalInput: "wall_leaf_mapping",
      question: "Which layers are side A, cavity, and side B for the double-leaf wall?"
    }));
  }

  if (
    topology.topology === "double_leaf_framed" &&
    topology.supportTopology !== undefined &&
    topology.supportTopology !== "unknown" &&
    topology.supportTopology !== "direct_fixed" &&
    !isPositiveNumber(topology.supportSpacingMm)
  ) {
    missingInputs.push(missingInput({
      category: "physical_input",
      code: "assistant_wall_support_spacing_missing",
      message: "Double-leaf framed wall draft has no support spacing.",
      physicalInput: "wall_support_spacing",
      question: "What stud/support spacing in mm should the framed wall route use?"
    }));
  }
}

function hasImpactOutput(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => IMPACT_OUTPUTS.has(output));
}

function floorImpactValuePresent(
  floorImpact: ReportAssistantLayerStackDraftFloorImpact | undefined,
  key: ReportAssistantLayerStackDraftPhysicalInputKey
): boolean {
  if (!floorImpact) {
    return false;
  }

  switch (key) {
    case "dynamic_stiffness":
      return isPositiveNumber(floorImpact.dynamicStiffnessMNm3);
    case "field_lab_context":
      return floorImpact.fieldLabContext === "field" || floorImpact.fieldLabContext === "lab";
    case "load_basis":
      return isPositiveNumber(floorImpact.loadBasisKgM2);
    case "room_volume":
      return isPositiveNumber(floorImpact.receivingRoomVolumeM3);
    case "target_metric_basis":
      return floorImpact.targetMetricBasis === "astm" || floorImpact.targetMetricBasis === "iso";
    case "wall_cavity_depth":
    case "wall_leaf_mapping":
    case "wall_support_spacing":
    case "wall_support_topology":
      return true;
  }
}

function floorImpactQuestion(key: ReportAssistantLayerStackDraftPhysicalInputKey): string {
  switch (key) {
    case "dynamic_stiffness":
      return "What is the resilient layer dynamic stiffness in MN/m3?";
    case "field_lab_context":
      return "Is this impact request for lab or field context?";
    case "load_basis":
      return "What load basis in kg/m2 should the floor impact route use?";
    case "room_volume":
      return "What receiving room volume should the field impact route use?";
    case "target_metric_basis":
      return "Which metric basis applies here: ISO or ASTM?";
    case "wall_cavity_depth":
    case "wall_leaf_mapping":
    case "wall_support_spacing":
    case "wall_support_topology":
      return "Provide the missing wall physical input before calculator preview.";
  }
}

function collectFloorImpactInputs(draft: ReportAssistantLayerStackDraft, missingInputs: ReportAssistantLayerStackDraftMissingInput[]): void {
  if (draft.mode !== "floor" || !hasImpactOutput(draft.requestedOutputs)) {
    return;
  }

  const requiredInputs = draft.floorImpactDraft?.requiredPhysicalInputs ?? ["dynamic_stiffness", "load_basis", "target_metric_basis"];

  for (const key of requiredInputs) {
    if (floorImpactValuePresent(draft.floorImpactDraft, key)) {
      continue;
    }

    missingInputs.push(missingInput({
      category: "physical_input",
      code: `assistant_floor_impact_${key}_missing`,
      message: `Floor/impact draft is missing ${key}.`,
      physicalInput: key,
      question: floorImpactQuestion(key)
    }));
  }
}

export function validateReportAssistantLayerStackDraft(
  draft: ReportAssistantLayerStackDraft
): ReportAssistantLayerStackDraftValidation {
  const missingInputs: ReportAssistantLayerStackDraftMissingInput[] = [];

  collectLayerInputs(draft, missingInputs);
  collectTargetOutputInputs(draft, missingInputs);
  collectWallTopologyInputs(draft, missingInputs);
  collectFloorImpactInputs(draft, missingInputs);

  return {
    clarifyingQuestions: uniqueQuestions(missingInputs),
    missingInputs,
    ok: missingInputs.length === 0,
    status: missingInputs.length === 0 ? "ready" : "needs_input"
  };
}

export function isReportAssistantLayerStackDraftReady(draft: ReportAssistantLayerStackDraft): boolean {
  return validateReportAssistantLayerStackDraft(draft).ok;
}
