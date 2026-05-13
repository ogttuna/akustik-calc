import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  AirborneResultBasisSchema
} from "@dynecho/shared";
import type {
  AirborneCandidate,
  AirborneCandidateResolution,
  AirborneResultBasis,
  AssemblyRatings,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import { anchorCurveToMetric } from "./dynamic-airborne-helpers";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL
} from "./gate-ay-advanced-wall-runtime-constants";
import { clamp, ksRound1, log10Safe } from "./math";

export {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL
} from "./gate-ay-advanced-wall-runtime-constants";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE =
  "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS =
  "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_landed_selected_input_surface_gate_az";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION =
  "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-az-advanced-wall-source-absent-solver-input-surface-contract.test.ts";

const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE =
  "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_plan";

const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS =
  "gate_ax_personal_use_mvp_advanced_wall_source_absent_solver_contract_landed_no_runtime_selected_runtime_corridor_gate_ay";

const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION =
  "gate_ay_personal_use_mvp_advanced_wall_source_absent_solver_runtime_corridor_plan";

const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ay-advanced-wall-source-absent-solver-runtime-corridor-contract.test.ts";

export type GateAYAdvancedWallPhysicalFieldId =
  | "absorberCoverageRatio"
  | "absorberFlowResistivityPaSM2"
  | "absorberThicknessMm"
  | "cavityDepthMm"
  | "cavitySealState"
  | "cavitySequence"
  | "directTransmissionCurveOwner"
  | "duplicateOwnershipGuard"
  | "exactSourcePrecedenceCheck"
  | "fieldBuildingAdapterBoundary"
  | "frameDepthMm"
  | "frameLineCouplingStiffnessMNPerM3"
  | "frameMaterialClass"
  | "frameSpacingMm"
  | "frequencyBandSet"
  | "hostWallAreaM2"
  | "iso717RwCAdapterOwner"
  | "leafGrouping"
  | "leafSequence"
  | "mechanicalBridgeAreaRatio"
  | "openingAreaM2"
  | "openingElementRw"
  | "openingIntent"
  | "openingOrigin"
  | "openingRatingBasis"
  | "openingSealLeakageClass"
  | "openingSubElementIds"
  | "outputBasis"
  | "panelBendingStiffnessNm"
  | "panelCriticalFrequencyHz"
  | "panelLayerOwnership"
  | "panelLossFactor"
  | "panelMaterialClass"
  | "panelSurfaceMassKgM2"
  | "panelThicknessMm"
  | "resilientConnectionStiffnessMNPerM3"
  | "resilientConnectionType"
  | "sourceAbsentErrorBudgetOwner"
  | "splitLayerGuard"
  | "stcAdapterOwner"
  | "wallSolverIntent";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly Extract<
  RequestedOutputId,
  "C" | "Ctr" | "Rw" | "STC"
>[];

const FIELD_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w", "DnT,A", "DnT,A,k", "Dn,w", "Dn,A"]);

const DEFAULT_FREQUENCIES_HZ = [
  100,
  125,
  160,
  200,
  250,
  315,
  400,
  500,
  630,
  800,
  1000,
  1250,
  1600,
  2000,
  2500,
  3150
] as const;

const RUNTIME_REQUIRED_BOOLEAN_FIELDS = [
  "directTransmissionCurveOwner",
  "duplicateOwnershipGuard",
  "exactSourcePrecedenceCheck",
  "fieldBuildingAdapterBoundary",
  "iso717RwCAdapterOwner",
  "sourceAbsentErrorBudgetOwner",
  "splitLayerGuard",
  "stcAdapterOwner"
] as const satisfies readonly GateAYAdvancedWallPhysicalFieldId[];

const GATE_AY_REQUIRED_PHYSICAL_FIELDS = [
  "wallSolverIntent",
  "outputBasis",
  "frequencyBandSet",
  "fieldBuildingAdapterBoundary",
  "exactSourcePrecedenceCheck",
  "leafGrouping",
  "leafSequence",
  "panelLayerOwnership",
  "cavitySequence",
  "cavityDepthMm",
  "panelMaterialClass",
  "panelThicknessMm",
  "panelSurfaceMassKgM2",
  "panelBendingStiffnessNm",
  "panelLossFactor",
  "panelCriticalFrequencyHz",
  "absorberThicknessMm",
  "absorberCoverageRatio",
  "absorberFlowResistivityPaSM2",
  "cavitySealState",
  "frameMaterialClass",
  "frameSpacingMm",
  "frameDepthMm",
  "frameLineCouplingStiffnessMNPerM3",
  "resilientConnectionType",
  "resilientConnectionStiffnessMNPerM3",
  "mechanicalBridgeAreaRatio",
  "openingIntent",
  "hostWallAreaM2",
  "openingSubElementIds",
  "openingAreaM2",
  "openingElementRw",
  "openingRatingBasis",
  "openingSealLeakageClass",
  "openingOrigin",
  "directTransmissionCurveOwner",
  "iso717RwCAdapterOwner",
  "stcAdapterOwner",
  "duplicateOwnershipGuard",
  "splitLayerGuard",
  "sourceAbsentErrorBudgetOwner"
] as const satisfies readonly GateAYAdvancedWallPhysicalFieldId[];

export type GateAYAdvancedWallPanelMaterialClass =
  | "cement_board"
  | "engineered_timber"
  | "gypsum_board"
  | "masonry_lining"
  | "wood_board";

export type GateAYAdvancedWallCavitySealState = "average" | "leaky" | "sealed";

export type GateAYAdvancedWallFrameMaterialClass = "light_steel" | "timber" | "mixed";

export type GateAYAdvancedWallResilientConnectionType =
  | "direct_fixed"
  | "independent_frame"
  | "none"
  | "resilient_channel";

export type GateAYAdvancedWallOpeningIntent = "none" | "present";

export type GateAYAdvancedWallOutputBasis = "building_prediction" | "element_lab" | "field_between_rooms";

export type GateAYAdvancedWallPanelInput = {
  bendingStiffnessNm?: number;
  criticalFrequencyHz?: number;
  id?: string;
  layerIds?: readonly string[];
  leafId?: string;
  lossFactor?: number;
  materialClass?: GateAYAdvancedWallPanelMaterialClass;
  sequence?: number;
  surfaceMassKgM2?: number;
  thicknessMm?: number;
};

export type GateAYAdvancedWallCavityInput = {
  absorberCoverageRatio?: number;
  absorberFlowResistivityPaSM2?: number;
  absorberThicknessMm?: number;
  depthMm?: number;
  id?: string;
  sealState?: GateAYAdvancedWallCavitySealState;
  sequence?: number;
};

export type GateAYAdvancedWallFrameCouplingInput = {
  depthMm?: number;
  frameMaterialClass?: GateAYAdvancedWallFrameMaterialClass;
  lineCouplingStiffnessMNPerM3?: number;
  mechanicalBridgeAreaRatio?: number;
  resilientConnectionStiffnessMNPerM3?: number;
  resilientConnectionType?: GateAYAdvancedWallResilientConnectionType;
  spacingMm?: number;
};

export type GateAYAdvancedWallOpeningInput = {
  areaM2?: number;
  count?: number;
  elementRwDb?: number;
  id?: string;
  origin?: "catalogued" | "measured";
  ratingBasis?: "measured_lab" | "rw_single_number";
  sealLeakageClass?: "average" | "leaky" | "open_gap" | "sealed";
};

export type GateAYAdvancedWallRuntimeInput = {
  directTransmissionCurveOwner?: true;
  duplicateOwnershipGuard?: true;
  exactSourcePrecedenceApplied?: boolean;
  exactSourcePrecedenceCheck?: true;
  existingOwnedDelegateRoute?: "triple_leaf_two_cavity_frequency_solver" | null;
  fieldBuildingAdapterBoundary?: true;
  frameCoupling?: GateAYAdvancedWallFrameCouplingInput;
  frequencyBandSet?: "third_octave_100_3150";
  hostWallAreaM2?: number;
  iso717RwCAdapterOwner?: true;
  openingIntent?: GateAYAdvancedWallOpeningIntent;
  openings?: readonly GateAYAdvancedWallOpeningInput[];
  outputBasis?: GateAYAdvancedWallOutputBasis;
  panels?: readonly GateAYAdvancedWallPanelInput[];
  cavities?: readonly GateAYAdvancedWallCavityInput[];
  sourceAbsentErrorBudgetOwner?: true;
  splitLayerGuard?: true;
  stcAdapterOwner?: true;
  targetOutputs?: readonly RequestedOutputId[];
  wallSolverIntent?: "advanced_source_absent_wall";
};

export type GateAYAdvancedWallRuntimeStatus =
  | "delegated_to_existing_owned_route"
  | "exact_source_precedence"
  | "invalid_topology"
  | "needs_input"
  | "runtime_corridor_promoted"
  | "unsupported_boundary";

export type GateAYAdvancedWallErrorBudget = {
  estimate: number;
  max: number;
  metricId: Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">;
  min: number;
  notMeasuredEvidence: true;
  origin: "source_absent_formula_error_budget";
  terms: readonly string[];
  toleranceDb: number;
};

export type GateAYAdvancedWallRuntimeMetrics = {
  C: number;
  Ctr: number;
  Rw: number;
  STC: number;
};

export type GateAYAdvancedWallRuntimeResult = {
  airborneCandidateResolution: AirborneCandidateResolution | null;
  basis: AirborneResultBasis | null;
  curve: TransmissionLossCurve | null;
  errorBudgets: readonly GateAYAdvancedWallErrorBudget[];
  missingPhysicalInputs: readonly GateAYAdvancedWallPhysicalFieldId[];
  metrics: GateAYAdvancedWallRuntimeMetrics | null;
  ratings: AssemblyRatings | null;
  status: GateAYAdvancedWallRuntimeStatus;
  supportedTargetOutputs: readonly RequestedOutputId[];
  supportLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL;
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warning: string | null;
};

export type GateAYAdvancedWallRuntimeCorridorContract = {
  activeRuntimeResult: GateAYAdvancedWallRuntimeResult;
  exactSourcePrecedenceResult: GateAYAdvancedWallRuntimeResult;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE;
  numericRuntimeBehaviorChange: true;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE;
  previousSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION;
  previousSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS;
  runtimeMethod: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  targetOutputsOwned: typeof WALL_LAB_OUTPUTS;
};

export const GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT = {
  cavities: [
    {
      absorberCoverageRatio: 0.85,
      absorberFlowResistivityPaSM2: 10500,
      absorberThicknessMm: 50,
      depthMm: 70,
      id: "cavity-a",
      sealState: "sealed",
      sequence: 1
    },
    {
      absorberCoverageRatio: 0.65,
      absorberFlowResistivityPaSM2: 8200,
      absorberThicknessMm: 40,
      depthMm: 55,
      id: "cavity-b",
      sealState: "average",
      sequence: 2
    }
  ],
  directTransmissionCurveOwner: true,
  duplicateOwnershipGuard: true,
  exactSourcePrecedenceCheck: true,
  fieldBuildingAdapterBoundary: true,
  frameCoupling: {
    depthMm: 70,
    frameMaterialClass: "light_steel",
    lineCouplingStiffnessMNPerM3: 1.8,
    mechanicalBridgeAreaRatio: 0.018,
    resilientConnectionStiffnessMNPerM3: 0.9,
    resilientConnectionType: "resilient_channel",
    spacingMm: 600
  },
  frequencyBandSet: "third_octave_100_3150",
  iso717RwCAdapterOwner: true,
  openingIntent: "none",
  outputBasis: "element_lab",
  panels: [
    {
      bendingStiffnessNm: 86,
      criticalFrequencyHz: 2300,
      id: "panel-a",
      layerIds: ["a-gypsum-1", "a-gypsum-2"],
      leafId: "leaf-a",
      lossFactor: 0.05,
      materialClass: "gypsum_board",
      sequence: 1,
      surfaceMassKgM2: 21.6,
      thicknessMm: 25
    },
    {
      bendingStiffnessNm: 240,
      criticalFrequencyHz: 1250,
      id: "panel-core",
      layerIds: ["core-engineered-timber"],
      leafId: "leaf-core",
      lossFactor: 0.035,
      materialClass: "engineered_timber",
      sequence: 2,
      surfaceMassKgM2: 16.5,
      thicknessMm: 36
    },
    {
      bendingStiffnessNm: 118,
      criticalFrequencyHz: 1750,
      id: "panel-b",
      layerIds: ["b-gypsum", "b-cement-board"],
      leafId: "leaf-b",
      lossFactor: 0.045,
      materialClass: "cement_board",
      sequence: 3,
      surfaceMassKgM2: 24,
      thicknessMm: 30
    }
  ],
  sourceAbsentErrorBudgetOwner: true,
  splitLayerGuard: true,
  stcAdapterOwner: true,
  targetOutputs: WALL_LAB_OUTPUTS,
  wallSolverIntent: "advanced_source_absent_wall"
} as const satisfies GateAYAdvancedWallRuntimeInput;

function uniqueFields(
  fields: readonly GateAYAdvancedWallPhysicalFieldId[]
): GateAYAdvancedWallPhysicalFieldId[] {
  return [...new Set(fields)];
}

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteRatio(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

function requestedOutputs(input: GateAYAdvancedWallRuntimeInput): RequestedOutputId[] {
  return input.targetOutputs && input.targetOutputs.length > 0 ? [...input.targetOutputs] : [...WALL_LAB_OUTPUTS];
}

function allowedLabOutput(output: RequestedOutputId): output is Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC"> {
  return WALL_LAB_OUTPUTS.includes(output as Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">);
}

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

function hasDuplicateNumbers(values: readonly number[]): boolean {
  return new Set(values).size !== values.length;
}

function sortedPanels(input: GateAYAdvancedWallRuntimeInput): GateAYAdvancedWallPanelInput[] {
  return [...(input.panels ?? [])].sort((left, right) => (left.sequence ?? 0) - (right.sequence ?? 0));
}

function sortedCavities(input: GateAYAdvancedWallRuntimeInput): GateAYAdvancedWallCavityInput[] {
  return [...(input.cavities ?? [])].sort((left, right) => (left.sequence ?? 0) - (right.sequence ?? 0));
}

function collectMissingPhysicalInputs(
  input: GateAYAdvancedWallRuntimeInput
): GateAYAdvancedWallPhysicalFieldId[] {
  const missing: GateAYAdvancedWallPhysicalFieldId[] = [];

  if (input.wallSolverIntent !== "advanced_source_absent_wall") {
    missing.push("wallSolverIntent");
  }

  if (input.outputBasis !== "element_lab") {
    missing.push("outputBasis");
  }

  if (input.frequencyBandSet !== "third_octave_100_3150") {
    missing.push("frequencyBandSet");
  }

  for (const field of RUNTIME_REQUIRED_BOOLEAN_FIELDS) {
    if (input[field] !== true) {
      missing.push(field);
    }
  }

  const panels = input.panels ?? [];
  if (panels.length < 2) {
    missing.push("leafGrouping", "leafSequence", "panelLayerOwnership");
  }

  for (const panel of panels) {
    if (!panel.id || !panel.leafId) {
      missing.push("leafGrouping");
    }
    if (!finitePositive(panel.sequence)) {
      missing.push("leafSequence");
    }
    if (!Array.isArray(panel.layerIds) || panel.layerIds.length === 0) {
      missing.push("panelLayerOwnership");
    }
    if (!panel.materialClass) {
      missing.push("panelMaterialClass");
    }
    if (!finitePositive(panel.thicknessMm)) {
      missing.push("panelThicknessMm");
    }
    if (!finitePositive(panel.surfaceMassKgM2)) {
      missing.push("panelSurfaceMassKgM2");
    }
    if (!finitePositive(panel.bendingStiffnessNm)) {
      missing.push("panelBendingStiffnessNm");
    }
    if (!finitePositive(panel.lossFactor)) {
      missing.push("panelLossFactor");
    }
    if (!finitePositive(panel.criticalFrequencyHz)) {
      missing.push("panelCriticalFrequencyHz");
    }
  }

  const cavities = input.cavities ?? [];
  if (cavities.length !== Math.max(0, panels.length - 1)) {
    missing.push("cavitySequence");
  }

  for (const cavity of cavities) {
    if (!cavity.id || !finitePositive(cavity.sequence)) {
      missing.push("cavitySequence");
    }
    if (!finitePositive(cavity.depthMm)) {
      missing.push("cavityDepthMm");
    }
    if (!finitePositive(cavity.absorberThicknessMm)) {
      missing.push("absorberThicknessMm");
    }
    if (!finiteRatio(cavity.absorberCoverageRatio)) {
      missing.push("absorberCoverageRatio");
    }
    if (!finitePositive(cavity.absorberFlowResistivityPaSM2)) {
      missing.push("absorberFlowResistivityPaSM2");
    }
    if (!cavity.sealState) {
      missing.push("cavitySealState");
    }
  }

  const frame = input.frameCoupling;
  if (!frame?.frameMaterialClass) {
    missing.push("frameMaterialClass");
  }
  if (!finitePositive(frame?.spacingMm)) {
    missing.push("frameSpacingMm");
  }
  if (!finitePositive(frame?.depthMm)) {
    missing.push("frameDepthMm");
  }
  if (!finitePositive(frame?.lineCouplingStiffnessMNPerM3)) {
    missing.push("frameLineCouplingStiffnessMNPerM3");
  }
  if (!frame?.resilientConnectionType) {
    missing.push("resilientConnectionType");
  }
  if (!finitePositive(frame?.resilientConnectionStiffnessMNPerM3)) {
    missing.push("resilientConnectionStiffnessMNPerM3");
  }
  if (!finiteRatio(frame?.mechanicalBridgeAreaRatio)) {
    missing.push("mechanicalBridgeAreaRatio");
  }

  if (!input.openingIntent) {
    missing.push("openingIntent");
  } else if (input.openingIntent === "present") {
    if (!finitePositive(input.hostWallAreaM2)) {
      missing.push("hostWallAreaM2");
    }
    if (!input.openings || input.openings.length === 0) {
      missing.push("openingSubElementIds");
    }

    for (const opening of input.openings ?? []) {
      if (!opening.id) {
        missing.push("openingSubElementIds");
      }
      if (!finitePositive(opening.areaM2) || !finitePositive(opening.count)) {
        missing.push("openingAreaM2");
      }
      if (!finitePositive(opening.elementRwDb)) {
        missing.push("openingElementRw");
      }
      if (!opening.ratingBasis) {
        missing.push("openingRatingBasis");
      }
      if (!opening.sealLeakageClass) {
        missing.push("openingSealLeakageClass");
      }
      if (!opening.origin) {
        missing.push("openingOrigin");
      }
    }
  }

  return uniqueFields(missing);
}

function collectInvalidTopologyFields(
  input: GateAYAdvancedWallRuntimeInput
): GateAYAdvancedWallPhysicalFieldId[] {
  const invalid: GateAYAdvancedWallPhysicalFieldId[] = [];
  const panels = input.panels ?? [];
  const cavities = input.cavities ?? [];
  const panelIds = panels.map((panel) => panel.id).filter((id): id is string => Boolean(id));
  const leafIds = panels.map((panel) => panel.leafId).filter((id): id is string => Boolean(id));
  const panelSequences = panels.map((panel) => panel.sequence).filter((value): value is number => finitePositive(value));
  const cavityIds = cavities.map((cavity) => cavity.id).filter((id): id is string => Boolean(id));
  const cavitySequences = cavities.map((cavity) => cavity.sequence).filter((value): value is number => finitePositive(value));
  const allLayerIds = panels.flatMap((panel) => [...(panel.layerIds ?? [])]);
  const openingIds = (input.openings ?? []).map((opening) => opening.id).filter((id): id is string => Boolean(id));

  if (hasDuplicates(panelIds) || hasDuplicates(leafIds) || hasDuplicateNumbers(panelSequences)) {
    invalid.push("leafGrouping", "leafSequence", "duplicateOwnershipGuard");
  }

  if (hasDuplicates(cavityIds) || hasDuplicateNumbers(cavitySequences)) {
    invalid.push("cavitySequence", "duplicateOwnershipGuard");
  }

  if (panels.length > 0 && cavities.length > 0 && cavities.length !== panels.length - 1) {
    invalid.push("cavitySequence");
  }

  if (allLayerIds.length > 0 && hasDuplicates(allLayerIds)) {
    invalid.push("panelLayerOwnership", "splitLayerGuard");
  }

  if (openingIds.length > 0 && hasDuplicates(openingIds)) {
    invalid.push("openingSubElementIds", "duplicateOwnershipGuard");
  }

  return uniqueFields(invalid);
}

function buildNeedsInputBasis(
  missingPhysicalInputs: readonly GateAYAdvancedWallPhysicalFieldId[]
): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Gate AY advanced wall runtime is blocked until every Gate AX physical owner field is explicit.",
      "No flat-list auto grouping or high-confidence guess is used for incomplete N-layer wall input."
    ],
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    method: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
    missingPhysicalInputs: [...missingPhysicalInputs],
    origin: "needs_input",
    requiredInputs: GATE_AY_REQUIRED_PHYSICAL_FIELDS
  });
}

function buildUnsupportedBasis(reason: string): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      reason,
      "Gate AY owns only element-lab wall Rw/STC/C/Ctr; field and building adapters need separate owners."
    ],
    curveBasis: "no_curve",
    kind: "airborne_unsupported",
    method: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: GATE_AY_REQUIRED_PHYSICAL_FIELDS
  });
}

function buildRuntimeBasis(curve: TransmissionLossCurve): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Gate AY promotes complete Gate AX owner input to a bounded element-lab source-absent wall prediction.",
      "The direct curve combines panel surface mass, stiffness/loss/coincidence, explicit air cavities, absorber damping, and frame/coupling penalties.",
      "Exact same-stack source rows and existing owned family delegates keep precedence outside this corridor.",
      "Rw, STC, C, and Ctr are separate rating-adapter outputs from the calculated curve; STC is not aliased from Rw."
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 8,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "gate_ay_advanced_wall_third_octave_direct_curve",
      frequenciesHz: [...curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    measurementStandard: "none",
    method: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "same-family source-owned N-layer wall holdout curves for Gate AY runtime calibration"
    ],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: GATE_AY_REQUIRED_PHYSICAL_FIELDS,
    toleranceClass: "uncalibrated_prediction"
  });
}

function panelMaterialDampingCredit(materialClass: GateAYAdvancedWallPanelMaterialClass | undefined): number {
  switch (materialClass) {
    case "engineered_timber":
      return 0.8;
    case "wood_board":
      return 0.5;
    case "masonry_lining":
      return 0.4;
    case "cement_board":
      return 0.3;
    case "gypsum_board":
    default:
      return 0.2;
  }
}

function sealPenalty(sealState: GateAYAdvancedWallCavitySealState | undefined): number {
  switch (sealState) {
    case "sealed":
      return 0;
    case "average":
      return 1.2;
    case "leaky":
      return 3.5;
    default:
      return 2;
  }
}

function resilientCredit(frame: GateAYAdvancedWallFrameCouplingInput): number {
  if (frame.resilientConnectionType === "resilient_channel") {
    return clamp(1.8 + (2.2 / Math.max(frame.resilientConnectionStiffnessMNPerM3 ?? 1, 0.2)), 1, 4);
  }

  if (frame.resilientConnectionType === "independent_frame") {
    return 4;
  }

  return 0;
}

function frameBridgePenalty(frame: GateAYAdvancedWallFrameCouplingInput): number {
  const bridgeArea = frame.mechanicalBridgeAreaRatio ?? 0;
  const coupling = frame.lineCouplingStiffnessMNPerM3 ?? 0;
  const spacingFactor = 600 / Math.max(frame.spacingMm ?? 600, 200);

  return clamp((bridgeArea * 26) + (coupling * 0.42 * spacingFactor) - resilientCredit(frame), 0, 9);
}

function cavityIsolationCredit(cavity: GateAYAdvancedWallCavityInput): number {
  const depthCredit = 3.3 + (4.8 * log10Safe((cavity.depthMm ?? 1) / 50));
  const absorberCredit = (cavity.absorberCoverageRatio ?? 0) * clamp(
    1.4 + ((cavity.absorberThicknessMm ?? 0) / 38) + (1.7 * log10Safe((cavity.absorberFlowResistivityPaSM2 ?? 1) / 5000)),
    0,
    5.2
  );

  return clamp(depthCredit + absorberCredit - sealPenalty(cavity.sealState), 0.5, 9.5);
}

function targetRwDb(input: {
  cavities: readonly GateAYAdvancedWallCavityInput[];
  frame: GateAYAdvancedWallFrameCouplingInput;
  panels: readonly GateAYAdvancedWallPanelInput[];
}): number {
  const totalMass = input.panels.reduce((sum, panel) => sum + (panel.surfaceMassKgM2 ?? 0), 0);
  const panelDampingCredit = input.panels.reduce(
    (sum, panel) => sum + panelMaterialDampingCredit(panel.materialClass) + clamp((panel.lossFactor ?? 0) * 8, 0, 1.1),
    0
  ) / Math.max(input.panels.length, 1);
  const cavityCredit = input.cavities.reduce((sum, cavity) => sum + cavityIsolationCredit(cavity), 0);
  const leafCountCredit = clamp((input.panels.length - 2) * 1.4, 0, 4.2);
  const target = (20 * log10Safe(totalMass)) + 16 + cavityCredit + panelDampingCredit + leafCountCredit - frameBridgePenalty(input.frame);

  return ksRound1(clamp(target, 25, 78));
}

function massAirMassResonanceHz(input: {
  cavities: readonly GateAYAdvancedWallCavityInput[];
  panels: readonly GateAYAdvancedWallPanelInput[];
}): number {
  const lightestLeafMass = input.panels.reduce(
    (min, panel) => Math.min(min, panel.surfaceMassKgM2 ?? Number.POSITIVE_INFINITY),
    Number.POSITIVE_INFINITY
  );
  const totalDepthM = input.cavities.reduce((sum, cavity) => sum + ((cavity.depthMm ?? 0) / 1000), 0);
  const safeMass = Number.isFinite(lightestLeafMass) ? Math.max(lightestLeafMass, 4) : 4;

  return clamp(115 / Math.sqrt(Math.max(totalDepthM, 0.035) * safeMass), 55, 170);
}

function buildDirectCurve(input: {
  cavities: readonly GateAYAdvancedWallCavityInput[];
  frame: GateAYAdvancedWallFrameCouplingInput;
  frequenciesHz: readonly number[];
  panels: readonly GateAYAdvancedWallPanelInput[];
}): TransmissionLossCurve {
  const totalMass = input.panels.reduce((sum, panel) => sum + (panel.surfaceMassKgM2 ?? 0), 0);
  const targetRw = targetRwDb(input);
  const baseCurve = buildCalibratedMassLawCurve(Math.max(totalMass, 1), targetRw, input.frequenciesHz);
  const resonanceHz = massAirMassResonanceHz(input);
  const averageCoverage = input.cavities.reduce((sum, cavity) => sum + (cavity.absorberCoverageRatio ?? 0), 0) /
    Math.max(input.cavities.length, 1);
  const bridgePenalty = frameBridgePenalty(input.frame);
  const rawCurve: TransmissionLossCurve = {
    frequenciesHz: [...baseCurve.frequenciesHz],
    transmissionLossDb: baseCurve.transmissionLossDb.map((value, index) => {
      const frequency = baseCurve.frequenciesHz[index] ?? 100;
      const resonanceDistance = Math.abs(Math.log2(Math.max(frequency, 1) / resonanceHz));
      const resonanceNotchDb = Math.max(0, 3.6 * (1 - (resonanceDistance / 1.25)));
      const coincidenceNotchDb = input.panels.reduce((sum, panel) => {
        const criticalFrequencyHz = Math.max(panel.criticalFrequencyHz ?? 2000, 100);
        const distance = Math.abs(Math.log2(Math.max(frequency, 1) / criticalFrequencyHz));
        return sum + Math.max(0, 1.3 * (1 - (distance / 0.9)));
      }, 0) / Math.max(input.panels.length, 1);
      const absorberMidHighLiftDb = frequency >= 400
        ? clamp(Math.log2(frequency / 400) * averageCoverage * 0.85, 0, 2.8)
        : 0;
      const bridgeHighFrequencyPenaltyDb = frequency >= 630
        ? clamp(Math.log2(frequency / 500) * bridgePenalty * 0.22, 0, 2.6)
        : 0;

      return clamp(value - resonanceNotchDb - coincidenceNotchDb - bridgeHighFrequencyPenaltyDb + absorberMidHighLiftDb, 0, 95);
    })
  };

  return anchorCurveToMetric(rawCurve, targetRw).curve;
}

function openingLeakPenaltyDb(opening: GateAYAdvancedWallOpeningInput): number {
  switch (opening.sealLeakageClass) {
    case "sealed":
      return 0;
    case "average":
      return 2;
    case "leaky":
      return 5;
    case "open_gap":
      return 12;
    default:
      return 4;
  }
}

function applyOpeningsToCurve(input: {
  curve: TransmissionLossCurve;
  hostWallAreaM2: number;
  openings: readonly GateAYAdvancedWallOpeningInput[];
}): TransmissionLossCurve {
  const openingAreaM2 = input.openings.reduce(
    (sum, opening) => sum + ((opening.areaM2 ?? 0) * (opening.count ?? 1)),
    0
  );
  const wallOnlyAreaM2 = Math.max(input.hostWallAreaM2 - openingAreaM2, 0.01);

  return {
    frequenciesHz: [...input.curve.frequenciesHz],
    transmissionLossDb: input.curve.transmissionLossDb.map((wallTlDb) => {
      const wallTransmission = wallOnlyAreaM2 * Math.pow(10, -wallTlDb / 10);
      const openingTransmission = input.openings.reduce((sum, opening) => {
        const area = (opening.areaM2 ?? 0) * (opening.count ?? 1);
        const effectiveRw = Math.max((opening.elementRwDb ?? 0) - openingLeakPenaltyDb(opening), 0);

        return sum + (area * Math.pow(10, -effectiveRw / 10));
      }, 0);
      const tau = (wallTransmission + openingTransmission) / Math.max(input.hostWallAreaM2, 0.01);

      return clamp(-10 * log10Safe(tau), 0, 95);
    })
  };
}

function buildMeasuredExactCandidate(outputs: readonly RequestedOutputId[]): AirborneCandidate {
  const basis: AirborneResultBasis = {
    assumptions: ["Exact source promotion waits for a same-stack lab source row with topology and metric-basis ownership."],
    curveBasis: "no_curve",
    family: "multileaf_multicavity",
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["same_stack_advanced_wall_lab_source_row_absent"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["exactFullStackSource", "metricBasisOwner", "topologyOwner"],
    toleranceClass: "exact_source"
  };

  return {
    basis,
    id: "candidate_blocked_gate_ay_advanced_wall_exact_source",
    metricIds: [...outputs],
    origin: "measured_exact_full_stack",
    outputIds: [...outputs],
    rejectionReasons: [
      {
        code: "missing_source_evidence",
        detail:
          "Exact full-stack promotion is blocked until a rights-safe same-stack lab source row matches the advanced wall topology and metric basis."
      }
    ],
    selected: false
  };
}

function buildCalibratedCandidate(outputs: readonly RequestedOutputId[]): AirborneCandidate {
  const basis: AirborneResultBasis = {
    assumptions: ["Calibration waits for same-family N-layer wall holdout curves and paired negatives."],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 4,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_gate_ay_advanced_wall_direct_curve_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["advanced_wall_calibration_holdout_curves_absent"],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "pairedNegativeBoundarySetId"],
    toleranceClass: "calibrated_prediction"
  };

  return {
    basis,
    id: "candidate_calibrated_gate_ay_advanced_wall_family",
    metricIds: [...outputs],
    origin: "calibrated_family_physics",
    outputIds: [...outputs],
    rejectionReasons: [
      {
        code: "missing_source_evidence",
        detail:
          "Calibrated promotion waits for source-owned same-family holdout curves and paired negative boundaries."
      }
    ],
    selected: false
  };
}

function buildScreeningCandidate(outputs: readonly RequestedOutputId[]): AirborneCandidate {
  const basis: AirborneResultBasis = {
    assumptions: ["Screening remains available as a lower-precedence diagnostic lane for incomplete or ambiguous N-layer walls."],
    calculationStandard: "engine_screening",
    curveBasis: "screening_mass_law_curve",
    errorBudgetDb: 10,
    family: "multileaf_multicavity",
    kind: "airborne_screening",
    method: "screening_mass_law_curve_seed_v3",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "screening_fallback",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["layers"],
    toleranceClass: "screening_fallback"
  };

  return {
    basis,
    id: "candidate_gate_ay_advanced_wall_screening_fallback",
    metricIds: [...outputs],
    origin: "screening_fallback",
    outputIds: [...outputs],
    rejectionReasons: [
      {
        code: "lower_precedence_than_selected",
        detail: `Candidate loses to ${PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID} under model-first airborne precedence.`
      }
    ],
    selected: false
  };
}

function buildCandidateResolution(input: {
  basis: AirborneResultBasis;
  outputs: readonly RequestedOutputId[];
}): AirborneCandidateResolution {
  const selectedCandidate: AirborneCandidate = {
    basis: input.basis,
    id: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
    metricIds: [...input.outputs],
    origin: "family_physics_prediction",
    outputIds: [...input.outputs],
    rejectionReasons: [],
    selected: true
  };
  const candidates = [
    buildMeasuredExactCandidate(input.outputs),
    buildCalibratedCandidate(input.outputs),
    selectedCandidate,
    buildScreeningCandidate(input.outputs)
  ];
  const rejectedCandidateIds = candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id);

  return AirborneCandidateResolutionSchema.parse({
    candidatePrecedence: [...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE],
    candidates,
    deterministicTieBreakers: [
      "origin_precedence",
      "input_completeness_status",
      "family_confidence_class",
      "error_budget_db",
      "source_evidence_completeness",
      "stable_candidate_id"
    ],
    id: "resolver_gate_ay_advanced_wall_runtime_corridor",
    inputCompletenessIds: ["gate_ax_advanced_wall_complete_owner_set"],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: [
      "iso_717_1_rw_c_ctr_from_gate_ay_direct_curve",
      "astm_e413_stc_from_gate_ay_direct_curve"
    ],
    rejectedCandidateIds,
    runtimeValueMovement: true,
    selectedBasis: input.basis,
    selectedCandidateId: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
}

function buildErrorBudgets(metrics: GateAYAdvancedWallRuntimeMetrics): GateAYAdvancedWallErrorBudget[] {
  return [
    {
      estimate: metrics.Rw,
      max: metrics.Rw + 8,
      metricId: "Rw",
      min: metrics.Rw - 8,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      terms: [
        "advanced_wall_holdout_absence",
        "panel_dynamic_property_precision",
        "cavity_absorber_transfer_simplification",
        "frame_coupling_simplification"
      ],
      toleranceDb: 8
    },
    {
      estimate: metrics.STC,
      max: metrics.STC + 8,
      metricId: "STC",
      min: metrics.STC - 8,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      terms: [
        "stc_adapter_from_calculated_curve",
        "advanced_wall_holdout_absence",
        "opening_leak_boundary_if_present"
      ],
      toleranceDb: 8
    },
    {
      estimate: metrics.C,
      max: ksRound1(metrics.C + 3),
      metricId: "C",
      min: ksRound1(metrics.C - 3),
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      terms: [
        "iso717_spectrum_adapter_from_calculated_curve",
        "coincidence_region_simplification"
      ],
      toleranceDb: 3
    },
    {
      estimate: metrics.Ctr,
      max: ksRound1(metrics.Ctr + 3),
      metricId: "Ctr",
      min: ksRound1(metrics.Ctr - 3),
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      terms: [
        "iso717_traffic_spectrum_adapter_from_calculated_curve",
        "low_frequency_mass_air_mass_simplification"
      ],
      toleranceDb: 3
    }
  ];
}

function emptyResult(input: {
  basis: AirborneResultBasis | null;
  missingPhysicalInputs?: readonly GateAYAdvancedWallPhysicalFieldId[];
  status: GateAYAdvancedWallRuntimeStatus;
  unsupportedTargetOutputs?: readonly RequestedOutputId[];
  warning: string | null;
}): GateAYAdvancedWallRuntimeResult {
  return {
    airborneCandidateResolution: null,
    basis: input.basis,
    curve: null,
    errorBudgets: [],
    missingPhysicalInputs: input.missingPhysicalInputs ?? [],
    metrics: null,
    ratings: null,
    status: input.status,
    supportedTargetOutputs: [],
    supportLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL,
    unsupportedTargetOutputs: input.unsupportedTargetOutputs ?? [],
    warning: input.warning
  };
}

export function calculateGateAYAdvancedWallRuntimeCorridor(
  input: GateAYAdvancedWallRuntimeInput
): GateAYAdvancedWallRuntimeResult {
  const outputs = requestedOutputs(input);

  if (input.exactSourcePrecedenceApplied) {
    return emptyResult({
      basis: null,
      status: "exact_source_precedence",
      warning: "Gate AY runtime is bypassed because exact same-stack lab source precedence is already selected."
    });
  }

  if (input.existingOwnedDelegateRoute === "triple_leaf_two_cavity_frequency_solver") {
    return emptyResult({
      basis: null,
      status: "delegated_to_existing_owned_route",
      warning: "Gate AY runtime is bypassed because the existing triple-leaf two-cavity solver already owns this grouped route."
    });
  }

  if (input.outputBasis && input.outputBasis !== "element_lab") {
    return emptyResult({
      basis: buildUnsupportedBasis("Advanced wall runtime was requested outside element-lab output basis."),
      missingPhysicalInputs: ["fieldBuildingAdapterBoundary"],
      status: "unsupported_boundary",
      unsupportedTargetOutputs: outputs,
      warning: "Gate AY does not alias lab Rw/STC/C/Ctr to field or building outputs."
    });
  }

  if (outputs.some((output) => FIELD_BUILDING_OUTPUTS.has(output)) || outputs.some((output) => !allowedLabOutput(output))) {
    return emptyResult({
      basis: buildUnsupportedBasis("Advanced wall runtime target outputs include metrics outside the Gate AY element-lab wall set."),
      missingPhysicalInputs: ["fieldBuildingAdapterBoundary"],
      status: "unsupported_boundary",
      unsupportedTargetOutputs: outputs.filter((output) => !allowedLabOutput(output)),
      warning: "Gate AY supports only element-lab Rw/STC/C/Ctr; requested field, building, impact, or ASTM/IIC metrics need their own adapter."
    });
  }

  const missingPhysicalInputs = collectMissingPhysicalInputs(input);
  if (missingPhysicalInputs.length > 0) {
    return emptyResult({
      basis: buildNeedsInputBasis(missingPhysicalInputs),
      missingPhysicalInputs,
      status: "needs_input",
      warning: `Gate AY runtime is waiting for ${missingPhysicalInputs.join(", ")} before promoting the advanced wall direct-curve corridor.`
    });
  }

  const invalidTopologyFields = collectInvalidTopologyFields(input);
  if (invalidTopologyFields.length > 0) {
    return emptyResult({
      basis: buildNeedsInputBasis(invalidTopologyFields),
      missingPhysicalInputs: invalidTopologyFields,
      status: "invalid_topology",
      warning: `Gate AY runtime refused hostile or ambiguous topology ownership: ${invalidTopologyFields.join(", ")}.`
    });
  }

  const panels = sortedPanels(input);
  const cavities = sortedCavities(input);
  const frame = input.frameCoupling ?? {};
  const baseCurve = buildDirectCurve({
    cavities,
    frame,
    frequenciesHz: DEFAULT_FREQUENCIES_HZ,
    panels
  });
  const curve = input.openingIntent === "present" && finitePositive(input.hostWallAreaM2)
    ? applyOpeningsToCurve({
        curve: baseCurve,
        hostWallAreaM2: input.hostWallAreaM2,
        openings: input.openings ?? []
      })
    : baseCurve;
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  const metrics: GateAYAdvancedWallRuntimeMetrics = {
    C: ratings.iso717.C,
    Ctr: ratings.iso717.Ctr,
    Rw: ratings.iso717.Rw,
    STC: ratings.astmE413.STC
  };
  const basis = buildRuntimeBasis(curve);
  const airborneCandidateResolution = buildCandidateResolution({
    basis,
    outputs
  });

  return {
    airborneCandidateResolution,
    basis,
    curve,
    errorBudgets: buildErrorBudgets(metrics),
    missingPhysicalInputs: [],
    metrics,
    ratings,
    status: "runtime_corridor_promoted",
    supportedTargetOutputs: outputs,
    supportLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SUPPORT_LABEL,
    unsupportedTargetOutputs: [],
    warning: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING
  };
}

export function buildPersonalUseMvpCoverageSprintGateAYRuntimeCorridorContract():
  GateAYAdvancedWallRuntimeCorridorContract {
  if (PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE) {
    throw new Error("Gate AY can only land after Gate AX selects the advanced wall runtime corridor.");
  }

  return {
    activeRuntimeResult: calculateGateAYAdvancedWallRuntimeCorridor(GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT),
    exactSourcePrecedenceResult: calculateGateAYAdvancedWallRuntimeCorridor({
      ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
      exactSourcePrecedenceApplied: true
    }),
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
    numericRuntimeBehaviorChange: true,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_LANDED_GATE,
    previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_ACTION,
    previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTED_NEXT_FILE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AX_SELECTION_STATUS,
    runtimeMethod: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputsOwned: WALL_LAB_OUTPUTS
  };
}
