import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingContract,
  evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-local-material-mapping.ts",
  "packages/engine/src/dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated.ts",
  "packages/catalogs/src/materials/seed-materials.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
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

const NRC_SOURCE_LIKE_STACK: readonly LayerInput[] = [
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
  { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
  { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 }
];

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

const SOURCE_LIKE_CONTEXT: AirborneContext = buildContext({
  cavity1: [1],
  cavity1DepthMm: 92.1,
  cavity2: [3],
  cavity2DepthMm: 92.1,
  internal: [2],
  sideA: [0],
  sideB: [4],
  supportTopology: "independent_frames"
});

const LOCAL_ROCKWOOL_CONTEXT: AirborneContext = buildContext({
  cavity1: [3],
  cavity1DepthMm: 50,
  cavity2: [5],
  cavity2DepthMm: 50,
  internal: [4],
  sideA: [0, 1, 2],
  sideB: [6, 7, 8],
  supportTopology: "independent_frames"
});

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
  supportTopology: NonNullable<NonNullable<AirborneContext["wallTopology"]>["supportTopology"]>;
}): AirborneContext {
  return {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: input.cavity1DepthMm,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [...input.cavity1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [...input.cavity2],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [...input.internal],
      sideALeafLayerIndices: [...input.sideA],
      sideBLeafLayerIndices: [...input.sideB],
      supportTopology: input.supportTopology,
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall multileaf triple-leaf local substitution mapping contract", () => {
  it("lands the no-runtime local substitution mapping and selects formula corridor next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS
    });
    expect(contract.previousCoverageRefresh).toEqual({
      landedGate: "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan",
      selectedNextAction: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts",
      selectionStatus:
        "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes control, candidate, input-boundary, and basis-boundary rows without supported-coverage inflation", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: ["field_or_building_basis_boundary"],
      formulaCandidateRowIds: [
        "generic_gypsum_glasswool_source_like",
        "local_rockwool_mlv_plaster_custom_stack"
      ],
      inputBoundaryRowIds: ["duplicate_or_out_of_range_grouping_boundary", "partial_grouped_topology_boundary"],
      noRuntimeValueMovement: true,
      ownedControlRowIds: ["nrc_type_c_glass_fiber_control"],
      rowCount: 6,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL
    });
    expect(contract.mappingRows.find((row) => row.decisionId === "generic_gypsum_glasswool_source_like")).toMatchObject({
      requiredFormulaOwners: [
        "genericGypsumBoardToTypeCSurfaceMassAndStiffnessOwner",
        "glasswoolBoardToNrcBattFlowResistivityOwner",
        "cavityDepthAndFillCorrectionOwner",
        "supportTopologyEquivalenceOwner",
        "sourceAbsentSubstitutionUncertaintyBudgetOwner"
      ],
      status: "formula_corridor_candidate",
      supportedRuntimeNow: false
    });
  });

  it("treats generic gypsum/glasswool as a formula-corridor candidate while keeping live runtime uncalibrated", () => {
    const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
      airborneContext: SOURCE_LIKE_CONTEXT,
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK
    });
    const liveResult = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(evaluation).toMatchObject({
      decisionId: "generic_gypsum_glasswool_source_like",
      formulaCorridorCandidate: true,
      materialIds: ["glasswool_board", "gypsum_board"],
      noRuntimeValueMovement: true,
      status: "formula_corridor_candidate"
    });
    expect(evaluation.requiredFormulaOwners).toEqual(
      expect.arrayContaining([
        "genericGypsumBoardToTypeCSurfaceMassAndStiffnessOwner",
        "glasswoolBoardToNrcBattFlowResistivityOwner",
        "sourceAbsentSubstitutionUncertaintyBudgetOwner"
      ])
    );
    expect(liveResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(liveResult.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );
  });

  it("treats local Rockwool/MLV/plaster as a richer formula-corridor candidate and preserves the older Gate G4 block", () => {
    const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      layers: LOCAL_ROCKWOOL_MLV_PLASTER_STACK
    });
    const liveResult = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation).toMatchObject({
      decisionId: "local_rockwool_mlv_plaster_custom_stack",
      formulaCorridorCandidate: true,
      materialIds: ["gypsum_board", "gypsum_plaster", "mlv", "rockwool"],
      noRuntimeValueMovement: true,
      status: "formula_corridor_candidate"
    });
    expect(evaluation.requiredFormulaOwners).toEqual(
      expect.arrayContaining([
        "rockwoolToGlassFiberFlowResistivityDensityOwner",
        "mlvLimpMassPositionCorrectionOwner",
        "gypsumPlasterFinishMassDampingCorrectionOwner",
        "shortCavityDepthCorrectionOwner"
      ])
    );
    expect(evaluation.wallTripleLeafGateG4Snapshot).toMatchObject({
      localMappingOwned: false,
      runtimeEligibleNow: false,
      runtimeImportReadyNow: false
    });
    expect(evaluation.wallTripleLeafGateG4Snapshot?.blockers).toEqual(
      expect.arrayContaining([
        "local_rockwool_to_nrc_glass_fiber_batt_mapping_not_owned",
        "local_mlv_absent_from_nrc_source_family",
        "local_gypsum_plaster_absent_from_nrc_source_family"
      ])
    );
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD);
    expect(liveResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
  });

  it("preserves NRC calibrated control and rejects hostile grouped topology without selecting local substitution", () => {
    const controlEvaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
      airborneContext: SOURCE_LIKE_CONTEXT,
      layers: NRC_SOURCE_LIKE_STACK
    });
    const controlResult = calculateAssembly(NRC_SOURCE_LIKE_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateEvaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
      airborneContext: {
        ...SOURCE_LIKE_CONTEXT,
        wallTopology: {
          ...SOURCE_LIKE_CONTEXT.wallTopology,
          sideALeafLayerIndices: [0, 1]
        }
      },
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK
    });
    const fieldEvaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
      airborneContext: {
        ...SOURCE_LIKE_CONTEXT,
        contextMode: "field_between_rooms"
      },
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK
    });

    expect(controlEvaluation).toMatchObject({
      decisionId: "nrc_type_c_glass_fiber_control",
      formulaCorridorCandidate: false,
      status: "owned_control"
    });
    expect(controlResult.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(controlResult.metrics.estimatedRwDb).toBe(49);

    expect(duplicateEvaluation).toMatchObject({
      decisionId: "duplicate_or_out_of_range_grouping_boundary",
      formulaCorridorCandidate: false,
      status: "input_boundary"
    });
    expect(duplicateEvaluation.topologyBlockers).toContain("duplicate_layer_group_indices");

    expect(fieldEvaluation).toMatchObject({
      decisionId: "field_or_building_basis_boundary",
      formulaCorridorCandidate: false,
      status: "basis_boundary"
    });
  });

  it("keeps docs and the current-gate runner aligned with the local substitution mapping closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS);
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("local substitution");
      expect(normalizedContent, path).toContain("formula corridor");
      expect(normalizedContent, path).toContain("rockwool");
      expect(normalizedContent, path).toContain("glasswool");
      expect(normalizedContent, path).toContain("no-runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts");
  });
});
