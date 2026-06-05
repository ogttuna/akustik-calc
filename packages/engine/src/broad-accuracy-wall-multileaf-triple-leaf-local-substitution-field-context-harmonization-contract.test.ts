import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextHarmonizationContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
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

describe("broad accuracy wall triple-leaf local substitution field-context harmonization", () => {
  it("lands the selected field-context harmonization gate and selects surface parity next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextHarmonizationContract();

    expect(contract).toEqual({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE,
      previousCoverageRefresh: {
        landedGate:
          BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_LANDED_GATE,
        selectedNextAction:
          BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
        selectedNextFile:
          BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
        selectionStatus:
          BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_COVERAGE_REFRESH_SELECTION_STATUS
      },
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS,
      supportedRuntimeOutputs: ["R'w", "DnT,w"]
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates complete local-substitution field outputs from the lab spectrum anchor", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwDb: 51,
      estimatedRwPrimeDb: 51
    });
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      errorBudgetDb: 10,
      family: "multileaf_multicavity",
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "local-substitution field context uses the local-substitution lab transmission-loss curve as the direct separating-element anchor",
        "R'w and DnT,w are calculated from explicit field_between_rooms geometry and reverberation context, not copied from lab Rw or STC",
        "base lab-family method remains broad_accuracy_wall_triple_leaf_local_substitution_source_absent_rw_runtime_corridor"
      ])
    );
    expect(result.airborneBasis?.assumptions.join("\n")).not.toContain(
      "STC, C, Ctr, field, and building outputs remain unsupported"
    );
    expect(result.airborneBasis?.missingSourceEvidence).toEqual(
      expect.arrayContaining(["source_owned_same_stack_local_substitution_field_holdout_absent"])
    );
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S",
        "BroadAccuracyLocalSubstitutionFieldContextHarmonization:local_substitution_lab_curve_anchor",
        "BroadAccuracyLocalSubstitutionFieldContextHarmonization:field_RwPrime_DnTw_adapter_owner"
      ])
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
        "Local substitution field context carries a +/-10 dB source-absent error budget for R'w and DnT,w."
      ])
    );
    expect(result.dynamicAirborneTrace?.notes).toEqual(
      expect.arrayContaining([
        "Field R'w and DnT,w are harmonized from the local-substitution lab curve plus explicit receiving-room context; building prediction remains blocked."
      ])
    );
  });

  it("keeps the element-lab spectrum adapter values and candidate unchanged", () => {
    const lab = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(lab.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    });
  });

  it("keeps missing field inputs and lab-context field requests out of the field runtime while routing building requests separately", () => {
    const missingRt60 = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...LOCAL_FIELD_CONTEXT,
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const labContextFieldRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const building = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });

    expect(missingRt60.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(missingRt60.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );

    expect(labContextFieldRequest.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(labContextFieldRequest.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(labContextFieldRequest.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );

    expect(building.supportedTargetOutputs).toEqual(FIELD_OUTPUTS);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(building.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );
  });

  it("keeps exact field source precedence above the source-absent field harmonization candidate", () => {
    const runtime = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const exactFieldOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: LOCAL_FIELD_CONTEXT,
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
          id: "broad_accuracy_local_substitution_exact_field_row",
          label: "Broad accuracy local substitution exact field row",
          metricLabel: "R'w",
          metricValue: 52,
          sourceMode: "field"
        }
      },
      targetOutputs: FIELD_OUTPUTS
    });

    expect(exactFieldOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactFieldOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "broad_accuracy_local_substitution_exact_field_row",
      origin: "measured_exact_full_stack"
    });
    expect(exactFieldOverride.resolution.rejectedCandidateIds).toContain(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and the current-gate runner aligned with the landed field-context gate", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts"
    );

    for (const path of DOC_ALIGNMENT_SURFACES) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_LANDED_GATE
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTION_STATUS
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_ACTION
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_HARMONIZATION_SELECTED_NEXT_FILE
      );
      expect(text, path).toContain("R'w 51");
      expect(text, path).toContain("DnT,w 53");
      expect(text, path).toContain("+/-10 dB");
      expect(text, path).toContain("direct-fixed");
      expect(text, path).toContain("open-box");
    }
  });
});
