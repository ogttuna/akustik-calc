import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cv";
import {
  POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CW_COUNTERS,
  POST_V1_GATE_CW_VALUE_PINS,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_LABEL,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS,
  summarizePostV1WallLocalSubstitutionBuildingAdapterGateCW
} from "./post-v1-wall-local-substitution-building-adapter-gate-cw";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const LOCAL_ROCKWOOL_MLV_PLASTER_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LOCAL_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
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

const LOCAL_FIELD_CONTEXT: AirborneContext = {
  ...LOCAL_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...LOCAL_FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  sourceRoomVolumeM3: 50
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall local-substitution building adapter Gate CW", () => {
  it("lands the Gate CV selected runtime slice and selects the next numeric coverage gap", () => {
    const summary = summarizePostV1WallLocalSubstitutionBuildingAdapterGateCW();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CV_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_CW_COUNTERS,
      landedGate: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_CW_VALUE_PINS
    });
  });

  it("calculates local-substitution building outputs from the owned lab curve plus explicit building context", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnADb: POST_V1_GATE_CW_VALUE_PINS.building.metrics["Dn,A"],
      estimatedDnTADb: POST_V1_GATE_CW_VALUE_PINS.building.metrics["DnT,A"],
      estimatedDnTwDb: POST_V1_GATE_CW_VALUE_PINS.building.metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CW_VALUE_PINS.building.metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CW_VALUE_PINS.building.metrics["R'w"]
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      errorBudgetDb: POST_V1_GATE_CW_VALUE_PINS.building.errorBudgetDb,
      family: "multileaf_multicavity",
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "local-substitution building prediction uses the local-substitution calculated transmission-loss curve as the direct separating-element anchor",
        "R'w, Dn,w, Dn,A, DnT,w, and DnT,A are calculated from explicit building_prediction geometry, room, flanking, and junction context, not copied from lab Rw/STC or field R'w",
        "building-prediction output is computed only from explicit building_prediction context"
      ])
    );
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "buildingPredictionOutputBasis",
        "flankingJunctionClass",
        "conservativeFlankingAssumption",
        "junctionCouplingLengthM",
        "BroadAccuracyLocalSubstitutionBuildingAdapter:local_substitution_lab_curve_anchor",
        "BroadAccuracyLocalSubstitutionBuildingAdapter:building_RwPrime_Dn_DnT_adapter_owner"
      ])
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_WARNING,
        "Local substitution building prediction carries a +/-11 dB source-absent error budget for R'w, Dn, and DnT outputs."
      ])
    );
    expect(result.dynamicAirborneTrace?.notes).toEqual(
      expect.arrayContaining([
        "Building R'w, Dn,w, Dn,A, DnT,w, and DnT,A are calculated from the local-substitution lab curve plus explicit building flanking, junction, and room context."
      ])
    );
  });

  it("preserves required physical input gates instead of guessing building context", () => {
    for (
      const [field, missingContext] of [
        [
          "buildingPredictionOutputBasis",
          {
            ...COMPLETE_BUILDING_CONTEXT,
            buildingPredictionOutputBasis: undefined
          }
        ],
        [
          "flankingJunctionClass",
          {
            ...COMPLETE_BUILDING_CONTEXT,
            flankingJunctionClass: undefined
          }
        ],
        [
          "junctionCouplingLengthM",
          {
            ...COMPLETE_BUILDING_CONTEXT,
            junctionCouplingLengthM: undefined
          }
        ]
      ] as const
    ) {
      const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
        airborneContext: missingContext,
        calculator: "dynamic",
        targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS
      });

      expect(result.supportedTargetOutputs, field).toEqual([]);
      expect(result.unsupportedTargetOutputs, field).toEqual([...POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS]);
      expect(result.airborneCandidateResolution, field).toMatchObject({
        selectedCandidateId: "candidate_dynamic_needs_input",
        selectedOrigin: "needs_input"
      });
      expect(result.airborneBasis, field).toMatchObject({
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        missingPhysicalInputs: [field],
        origin: "needs_input"
      });
      expect(result.airborneBasis?.method, field).not.toBe(
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD
      );
    }
  });

  it("keeps lab and field local-substitution owners separate from the building adapter", () => {
    const lab = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[]
    });
    const field = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[]
    });

    expect(lab.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(lab.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    });

    expect(field.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwPrimeDb: 51
    });
    expect(field.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    });

    expect(lab.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD
    );
    expect(field.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD
    );
  });

  it("keeps exact field/building source precedence above the source-absent building adapter", () => {
    const runtime = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS
    });
    const exactBuildingOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      layers: LOCAL_ROCKWOOL_MLV_PLASTER_STACK,
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
          id: "broad_accuracy_local_substitution_exact_building_row",
          label: "Broad accuracy local substitution exact building row",
          metricLabel: "R'w",
          metricValue: 52,
          sourceMode: "field"
        }
      },
      targetOutputs: POST_V1_GATE_CW_BUILDING_TARGET_OUTPUTS
    });

    expect(exactBuildingOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactBuildingOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "broad_accuracy_local_substitution_exact_building_row",
      origin: "measured_exact_full_stack"
    });
    expect(exactBuildingOverride.resolution.rejectedCandidateIds).toContain(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with Gate CW selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("local-substitution");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts");
  });
});
