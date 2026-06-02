import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
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

const GENERIC_GYPSUM_GLASSWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

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

const GENERIC_CONTEXT: AirborneContext = buildContext({
  cavity1: [1],
  cavity1DepthMm: 92.1,
  cavity2: [3],
  cavity2DepthMm: 92.1,
  internal: [2],
  sideA: [0],
  sideB: [4]
});

const LOCAL_CONTEXT: AirborneContext = buildContext({
  cavity1: [3],
  cavity1DepthMm: 50,
  cavity2: [5],
  cavity2DepthMm: 50,
  internal: [4],
  sideA: [0, 1, 2],
  sideB: [6, 7, 8]
});

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildContext(input: {
  cavity1: readonly number[];
  cavity1DepthMm: number;
  cavity2: readonly number[];
  cavity2DepthMm: number;
  internal: readonly number[];
  sideA: readonly number[];
  sideB: readonly number[];
}): AirborneContext {
  return {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: input.cavity1DepthMm,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: input.cavity1,
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: input.cavity2,
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: input.internal,
      sideALeafLayerIndices: input.sideA,
      sideBLeafLayerIndices: input.sideB,
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
}

function buildNrcAssemblyB(): { context: AirborneContext; layers: readonly LayerInput[] } {
  return {
    context: buildContext({
      cavity1: [1],
      cavity1DepthMm: 92.1,
      cavity2: [3],
      cavity2DepthMm: 92.1,
      internal: [2],
      sideA: [0],
      sideB: [4]
    }),
    layers: [
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
      { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
      { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
      { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 }
    ]
  };
}

describe("broad accuracy wall triple-leaf local substitution lab spectrum adapter contract", () => {
  it("lands the adapter from the coverage refresh and selects surface parity next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS,
      supportedRuntimeOutputs: ["STC", "C", "Ctr"]
    });
    expect(contract.previousCoverageRefresh).toEqual({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.ratingAdapterBasisIds).toEqual([
      "astm_e413_stc_from_airborne_transmission_loss_curve",
      "iso_717_1_c_from_airborne_transmission_loss_curve",
      "iso_717_1_ctr_from_airborne_transmission_loss_curve"
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes generic gypsum/glasswool lab STC/C/Ctr from the calculated local-substitution curve without moving Rw", () => {
    const result = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: GENERIC_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 50,
      estimatedStc: 61
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY
    });
    expect(result.airborneCandidateSet?.some((candidate) =>
      candidate.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
    )).toBe(false);
    expect(result.ratingAdapterBasisSet?.map((basis) => basis.metricId)).toEqual(["STC", "C", "Ctr"]);
    expect(result.ratingAdapterBasisSet?.map((basis) => basis.ratingStandard)).toEqual([
      "ASTM E413",
      "ISO 717-1",
      "ISO 717-1"
    ]);
    expect(result.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);
    expect(result.warnings.join("\n")).not.toContain("source-absent error budget for Rw only");
  });

  it("promotes local Rockwool/MLV/plaster lab spectrum metrics while preserving the Rw 53 parent corridor", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions.join("\n")).toContain(
      "STC is rated with ASTM E413 and C/Ctr are rated as ISO 717-1 spectrum-adaptation terms"
    );
    expect(result.airborneBasis?.assumptions.join("\n")).toContain(
      "field and building outputs remain unsupported until separately owned context adapters exist"
    );
    expect(result.dynamicAirborneTrace?.notes.join("\n")).toContain(
      "Formula design corridor Rw 52.8 with live ISO-rounded Rw 53"
    );
  });

  it("supports STC-only requests through the adapter instead of copying Rw or demanding C/Ctr", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(result.metrics.estimatedRwDb).toBe(53);
    expect(result.metrics.estimatedStc).toBe(64);
    expect(result.supportedTargetOutputs).toEqual(["STC"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.ratingAdapterBasisSet).toHaveLength(1);
    expect(result.ratingAdapterBasisSet?.[0]).toMatchObject({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      metricId: "STC",
      ratingStandard: "ASTM E413"
    });
  });

  it("keeps calibrated controls, field/building requests, and hostile topology out of the lab adapter", () => {
    const nrc = buildNrcAssemblyB();
    const calibrated = calculateAssembly(nrc.layers, {
      airborneContext: nrc.context,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const mixedFieldRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_OUTPUTS
    });
    const completeField = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });
    const buildingRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...LOCAL_CONTEXT,
        contextMode: "building_prediction"
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const flat = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const duplicate = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: {
        ...LOCAL_CONTEXT,
        wallTopology: {
          ...LOCAL_CONTEXT.wallTopology,
          sideALeafLayerIndices: [0, 1, 2, 3]
        }
      },
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(calibrated.metrics).toMatchObject({
      estimatedCDb: 1.4,
      estimatedCtrDb: -7.4,
      estimatedRwDb: 49,
      estimatedStc: 60
    });
    expect(calibrated.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      origin: "calibrated_family_physics"
    });
    expect(calibrated.airborneCandidateResolution?.selectedCandidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );

    expect(mixedFieldRequest.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(mixedFieldRequest.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(mixedFieldRequest.airborneBasis?.origin).toBe("needs_input");
    expect(mixedFieldRequest.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);

    expect(completeField.metrics).toMatchObject({
      estimatedDnTwDb: 53,
      estimatedRwPrimeDb: 51
    });
    expect(completeField.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(completeField.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);

    expect(buildingRequest.supportedTargetOutputs).toEqual([]);
    expect(buildingRequest.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(buildingRequest.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD
    );

    expect(flat.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(flat.supportedTargetOutputs).toEqual([]);
    expect(flat.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(duplicate.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(duplicate.airborneBasis?.missingPhysicalInputs).toEqual(["leafGrouping"]);
    expect(duplicate.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs, exports, and the current-gate runner aligned with the lab spectrum adapter", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("stc");
      expect(normalizedContent, path).toContain("ctr");
      expect(normalizedContent, path).toContain("rw 53");
      expect(normalizedContent, path).toContain("field");
      expect(normalizedContent, path).toContain("building");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter");
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts"
    );
  });
});
