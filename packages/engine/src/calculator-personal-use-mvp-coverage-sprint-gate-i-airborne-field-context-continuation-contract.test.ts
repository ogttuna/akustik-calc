import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_I = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
  runtimeOriginPromotion: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
  selectionStatus:
    "gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_I_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts",
  "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_I_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const WALL_BUILDING_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  contextMode: "building_prediction",
  junctionQuality: "good"
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const SIMPLE_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const GROUPED_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const GROUPED_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  wallTopology: GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate I airborne field-context continuation", () => {
  it("records the bounded Gate I decision and keeps required surfaces present", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_I).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
      runtimeOriginPromotion: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
      selectionStatus:
        "gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_I_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete field context for owned lined massive and CLT lab-family routes without relabelling lab values", () => {
    const lined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const clt = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(lined.metrics).toMatchObject({
      estimatedDnTwDb: 59,
      estimatedRwDb: 58,
      estimatedRwPrimeDb: 58
    });
    expect(lined.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(lined.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(lined.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.partitionAreaM2_or_panelWidthHeight",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S",
        "fieldMetricAdapter:R'w/DnT,w"
      ])
    );
    expect(lined.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

    expect(clt.metrics).toMatchObject({
      estimatedDnTwDb: 41,
      estimatedRwDb: 40,
      estimatedRwPrimeDb: 40
    });
    expect(clt.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(clt.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(clt.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
  });

  it("keeps grouped triple-leaf field continuation on the owned family route with a field-specific basis", () => {
    const grouped = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(grouped.metrics).toMatchObject({
      estimatedDnTwDb: 51,
      estimatedRwDb: 50,
      estimatedRwPrimeDb: 50
    });
    expect(grouped.dynamicAirborneTrace?.selectedMethod).toBe("triple_leaf_two_cavity_frequency_solver");
    expect(grouped.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(grouped.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("keeps missing field context, building prediction, and lab outputs outside the Gate I runtime lane", () => {
    const missingContext = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const lab = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(missingContext.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);

    expect(building.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(building.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(lab.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(lab.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  });

  it("keeps exact field source precedence above the Gate I family adapter", () => {
    const runtime = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const exactFieldOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_i_rights_safe_exact_lined_massive_field_row",
          label: "Gate I exact lined massive field row",
          metricLabel: "R'w",
          metricValue: 57,
          sourceMode: "field"
        }
      },
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(exactFieldOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactFieldOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_i_rights_safe_exact_lined_massive_field_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps route-input assessment, docs, and current-gate runner aligned with Gate I closeout", () => {
    const completeFieldAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: SIMPLE_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const missingRt60Assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: {
        ...WALL_FIELD_CONTEXT,
        receivingRoomRt60S: undefined
      },
      layers: SIMPLE_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(completeFieldAssessment).toMatchObject({
      missingPhysicalInputs: [],
      outputBasis: "field_apparent",
      routeFamilies: ["field_apparent_output_context"],
      status: "complete"
    });
    expect(missingRt60Assessment).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      outputBasis: "field_apparent",
      status: "needs_input"
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_I.selectionStatus);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_I.selectedNextFile);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_I.selectedNextAction);
    }
  });
});
