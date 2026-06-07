import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS,
  POST_V1_GATE_EA_COUNTERS
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EB_PLAN_DOC_PATH,
  POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS,
  rankPostV1GateEBNumericCoverageCandidates,
  summarizePostV1GateEBNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-eb";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const HEAVY_CONCRETE_COMBINED_ASTM_ALIAS_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function visibleHeavyConcreteCombinedLowerTreatmentStack(
  materialId: "acoustic_hanger_ceiling" | "furring_channel" | "resilient_channel" | "resilient_stud_ceiling"
): readonly LayerInput[] {
  return [
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
    { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
    { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 80 },
    { floorRole: "ceiling_cavity", materialId, thicknessMm: 120 }
  ] as const satisfies readonly LayerInput[];
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("post-V1 next numeric coverage gap Gate EB", () => {
  it("lands the no-runtime Gate EB rerank after Gate EA and selects the resilient-channel lower-treatment owner proof", () => {
    const summary = summarizePostV1GateEBNumericCoverageGap();

    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS).toBe(
      "post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_landed_runtime_selected_next_numeric_coverage_gap_gate_eb"
    );
    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE
    );
    expect(POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EB_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EB_PLAN_DOC_PATH,
      previousGateEA: {
        counters: POST_V1_GATE_EA_COUNTERS,
        landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS
    });
    expect(POST_V1_GATE_EB_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
  });

  it("selects resilient-channel lower-treatment owner proof over already-capable, unsafe, or non-goal candidates", () => {
    const candidates = rankPostV1GateEBNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EB_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EB_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE,
      sliceKind: "runtime_owner_contract",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.heavy_concrete_combined_furring_channel_runtime_already_live")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(byId.get("floor.open_web_or_hollow_core_lower_treatment_delta_lw_boundary")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_wrong_metric_derivation"
    });
    expect(byId.get("floor.pliteq_or_knauf_same_source_delta_lw_lower_treatment_boundary")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_wrong_metric_derivation"
    });
    expect(byId.get("broad_source_row_crawl")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
    expect(byId.get("confidence_wording_or_frontend_polish")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("records the resilient-channel layer stack as the no-runtime gap delegated to EC/ED", () => {
    expect(POST_V1_GATE_EB_NO_RUNTIME_COUNTERS).toMatchObject({
      estimatedNextOwnerLedgers: 1,
      estimatedFollowingNewCalculableLayerTemplatesIfGateECProvesOwner: 1,
      estimatedFollowingNewCalculableRequestShapesIfGateECProvesOwner: 4,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0
    });
    expect(POST_V1_GATE_EB_SELECTED_CANDIDATE_ID).toBe(
      "floor.heavy_concrete_combined_resilient_channel_lower_treatment_owner_gap"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION).toBe(
      "post_v1_floor_heavy_concrete_combined_resilient_channel_lower_treatment_owner_gate_ec_plan"
    );
  });

  it("keeps the already-owned furring and published lower-treatment corridors live while EB moves no values", () => {
    const furring = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("furring_channel"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: HEAVY_CONCRETE_COMBINED_ASTM_ALIAS_OUTPUTS
      }
    );
    const acousticHanger = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("acoustic_hanger_ceiling"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS
      }
    );
    const resilientStud = calculateAssembly(
      visibleHeavyConcreteCombinedLowerTreatmentStack("resilient_stud_ceiling"),
      {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS
      }
    );

    expect(furring.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(furring.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(furring.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(furring.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });

    expect(acousticHanger.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
    expect(resilientStud.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    });
  });

  it("keeps same-source lower-treatment DeltaLw guesses blocked instead of crossing metric-owner lanes", () => {
    for (const id of ["floor-open-web-200-exact", "floor-hollow-core-vinyl", "floor-knauf-concrete"] as const) {
      const testCase = generatedCase(id);
      const result = calculateAssembly(testCase.rows, {
        targetOutputs: POST_V1_GATE_EB_SELECTED_TARGET_OUTPUTS
      });

      expect(resultSnapshot(result), id).toMatchObject({
        supportedTargetOutputs: ["Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      });
      expect(result.impact?.LnW, id).toBeTypeOf("number");
      expect(result.impact?.DeltaLw, id).toBeUndefined();
    }
  });

  it("keeps EB/EC current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EB_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EB_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts");
  });
});
