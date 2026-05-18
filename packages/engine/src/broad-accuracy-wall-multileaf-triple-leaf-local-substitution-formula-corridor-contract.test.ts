import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract,
  evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";
import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD } from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts",
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
      cavity1LayerIndices: input.cavity1,
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: input.cavity2,
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: input.internal,
      sideALeafLayerIndices: input.sideA,
      sideBLeafLayerIndices: input.sideB,
      supportTopology: input.supportTopology,
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall multileaf triple-leaf local substitution formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects runtime corridor next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.previousMapping).toEqual({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS
    });
    expect(contract.metricBoundaries).toEqual({
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersMissing: true
    });
    expect(contract.candidateFormulaRows).toHaveLength(2);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes both candidate formula rows with separate budgets and no proposed runtime value", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.candidateId)).toEqual([
      "generic_gypsum_glasswool_source_like_rw_formula",
      "local_rockwool_mlv_plaster_custom_stack_rw_formula"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designCorridorRwDb)).toEqual([49.3, 52.8]);
    expect(contract.candidateFormulaRows.map((row) => row.proposedRuntimeRwDb)).toEqual([null, null]);
    expect(contract.candidateFormulaRows.map((row) => row.toleranceBudget?.totalBudgetDb)).toEqual([
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB,
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB
    ]);
    expect(contract.candidateFormulaRows.every((row) => row.exactMeasuredRowsRemainPrecedence)).toBe(true);
    expect(contract.candidateFormulaRows.every((row) => row.noRuntimeValueMovement)).toBe(true);
  });

  it("defines a generic gypsum/glasswool Rw formula corridor that the later runtime gate now consumes", () => {
    const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: SOURCE_LIKE_CONTEXT,
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const liveResult = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation).toMatchObject({
      affectedFormulaOutputs: ["Rw"],
      blockedFormulaOutputs: ["STC", "C", "Ctr"],
      candidateId: "generic_gypsum_glasswool_source_like_rw_formula",
      designCorridorRwDb: 49.3,
      mappingDecisionId: "generic_gypsum_glasswool_source_like",
      noRuntimeValueMovement: true,
      proposedRuntimeRwDb: null,
      runtimePromotionAllowedInGate: false,
      status: "formula_corridor_defined_runtime_gate_required"
    });
    expect(evaluation.toleranceBudget).toMatchObject({
      metricId: "Rw",
      notMeasuredEvidence: true,
      toleranceDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB,
      totalBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB
    });
    expect(evaluation.formulaTerms.map((term) => term.termId)).toEqual([
      "board_leaf_surface_mass_and_stiffness_substitution",
      "porous_absorber_flow_resistivity_substitution",
      "cavity_depth_and_support_substitution"
    ]);
    expect(evaluation.formulaTerms.map((term) => term.owner)).toEqual(
      expect.arrayContaining([
        "genericGypsumBoardToTypeCSurfaceMassAndStiffnessOwner",
        "glasswoolBoardToNrcBattFlowResistivityOwner",
        "cavityDepthAndSupportCorrectionOwner"
      ])
    );
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD);
    expect(liveResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(liveResult.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );
  });

  it("defines the Rockwool/MLV/plaster formula corridor with a larger source-absent budget now consumed by runtime", () => {
    const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      layers: LOCAL_ROCKWOOL_MLV_PLASTER_STACK,
      targetOutputs: ["Rw"]
    });
    const liveResult = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation).toMatchObject({
      affectedFormulaOutputs: ["Rw"],
      blockedFormulaOutputs: [],
      candidateId: "local_rockwool_mlv_plaster_custom_stack_rw_formula",
      designCorridorRwDb: 52.8,
      mappingDecisionId: "local_rockwool_mlv_plaster_custom_stack",
      noRuntimeValueMovement: true,
      proposedRuntimeRwDb: null,
      runtimePromotionAllowedInGate: false,
      status: "formula_corridor_defined_runtime_gate_required"
    });
    expect(evaluation.toleranceBudget).toMatchObject({
      metricId: "Rw",
      notMeasuredEvidence: true,
      toleranceDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB,
      totalBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB
    });
    expect(evaluation.formulaTerms.map((term) => term.owner)).toEqual(
      expect.arrayContaining([
        "rockwoolToGlassFiberFlowResistivityDensityOwner",
        "mlvLimpMassPositionCorrectionOwner",
        "gypsumPlasterFinishMassDampingCorrectionOwner",
        "shortCavityDepthCorrectionOwner"
      ])
    );
    expect(evaluation.formulaTerms.map((term) => term.correctionDb)).toEqual([3, 0.2, -1.1, 1.2, 0.4]);
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD);
    expect(liveResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
  });

  it("keeps source controls, topology boundaries, field/building aliases, and metric adapters closed", () => {
    const sourceControl = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: SOURCE_LIKE_CONTEXT,
      layers: NRC_SOURCE_LIKE_STACK,
      targetOutputs: ["Rw"]
    });
    const duplicateGrouping = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: {
        ...SOURCE_LIKE_CONTEXT,
        wallTopology: {
          ...SOURCE_LIKE_CONTEXT.wallTopology,
          sideALeafLayerIndices: [0, 1]
        }
      },
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK,
      targetOutputs: ["Rw"]
    });
    const fieldAlias = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: {
        ...SOURCE_LIKE_CONTEXT,
        contextMode: "field_between_rooms"
      },
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK,
      targetOutputs: ["R'w", "DnT,w"]
    });
    const stcOnly = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
      airborneContext: SOURCE_LIKE_CONTEXT,
      layers: GENERIC_GYPSUM_GLASSWOOL_STACK,
      targetOutputs: ["STC"]
    });
    const sourceResult = calculateAssembly(NRC_SOURCE_LIKE_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(sourceControl).toMatchObject({
      candidateId: null,
      designCorridorRwDb: null,
      mappingDecisionId: "nrc_type_c_glass_fiber_control",
      status: "owned_control_no_substitution_formula_needed",
      toleranceBudget: null
    });
    expect(sourceResult.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(sourceResult.metrics.estimatedRwDb).toBe(49);

    expect(duplicateGrouping).toMatchObject({
      candidateId: null,
      designCorridorRwDb: null,
      mappingDecisionId: "duplicate_or_out_of_range_grouping_boundary",
      status: "blocked_input_contract",
      toleranceBudget: null
    });
    expect(duplicateGrouping.mappingSnapshot.topologyBlockers).toContain("duplicate_layer_group_indices");

    expect(fieldAlias).toMatchObject({
      affectedFormulaOutputs: [],
      blockedFormulaOutputs: ["R'w", "DnT,w"],
      candidateId: null,
      designCorridorRwDb: null,
      mappingDecisionId: "field_or_building_basis_boundary",
      status: "blocked_basis_alias",
      toleranceBudget: null
    });

    expect(stcOnly).toMatchObject({
      affectedFormulaOutputs: [],
      blockedFormulaOutputs: ["STC"],
      candidateId: null,
      designCorridorRwDb: null,
      mappingDecisionId: "generic_gypsum_glasswool_source_like",
      status: "blocked_metric_adapter_missing",
      toleranceBudget: null
    });
  });

  it("keeps docs and current-gate runner aligned with the formula corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("runtime corridor");
      expect(normalizedContent, path).toContain("52.8");
      expect(normalizedContent, path).toContain("49.3");
      expect(normalizedContent, path).toContain("no-runtime");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor");
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts"
    );
  });
});
