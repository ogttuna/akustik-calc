import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS,
  getPostV1GateCEBlockedNonGoals,
  rankPostV1GateCENumericCoverageCandidates,
  summarizePostV1GateCENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ce";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
} as const satisfies AirborneContext;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const EPS_SCREED_HYBRID_VARIANT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 43 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const SINGLE_OUTPUT_PROBES = [
  "Rw",
  "C",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function repoFileExists(path: string): boolean {
  return existsSync(join(REPO_ROOT, path));
}

describe("post-V1 next numeric coverage gap Gate CE", () => {
  it("lands a no-runtime executable rerank after Gate CD and selects target-output independence sweep Gate CF", () => {
    const summary = summarizePostV1GateCENumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE,
      noRuntimeValueMovement: true,
      planDocPath: "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
      previousGateCD: {
        landedGate: "post_v1_floor_open_box_target_output_independence_gate_cd_plan",
        selectionStatus:
          "post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce"
      },
      selectedCandidateId: "target_output_independence_sweep",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS,
      sourceOfTruthPath: "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
    });
    expect(summary.candidateCount).toBe(8);
    expect(summary.blockedNonGoalIds).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_report_storage_auth_work"
    ]);
  });

  it("ranks all high-ROI plan candidates and chooses the lowest-risk scope/correctness mover", () => {
    const candidates = rankPostV1GateCENumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(selected?.id).toBe("target_output_independence_sweep");
    expect(selected?.sourceRowsRequiredForSelection).toBe(false);
    expect(selected?.passesCalculatorAdvancementTest).toBe(true);
    expect(selected?.coverageCounters).toMatchObject({
      newCalculableLayerTemplates: [0, 4],
      newCalculableRequestShapes: [20, 60],
      newMetricBasisOwners: [0, 0],
      surfaceParityRequired: false
    });
    expect(selected?.targetMetrics).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "Ln,w",
      "DeltaLw",
      "CI",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);

    expect(selected?.score).toBeGreaterThan(byId.get("floor.common_floating_covering_expansion")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("field_building.direct_flanking_adapters")?.score ?? 0);
    expect(byId.get("floor.astm_iic_aiic_owner_expansion_beyond_exact_bands")).toMatchObject({
      selected: false,
      sourceRowsRequiredForSelection: true,
      wrongNumberRiskReduction: 0.96
    });
    expect(byId.get("input_surface.selected_route_physical_fields")).toMatchObject({
      selected: false,
      sliceKind: "input_surface_unlock"
    });
  });

  it("blocks non-calculator work and requires future runtime gates to report coverage counters", () => {
    expect(getPostV1GateCEBlockedNonGoals()).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_report_storage_auth_work"
    ]);

    for (const candidate of rankPostV1GateCENumericCoverageCandidates()) {
      expect(candidate.passesCalculatorAdvancementTest, candidate.id).toBe(true);
      expect(candidate.coverageCounters, candidate.id).toEqual(
        expect.objectContaining({
          accuracyOnlyTemplates: expect.any(Array),
          newCalculableLayerTemplates: expect.any(Array),
          newCalculableRequestShapes: expect.any(Array),
          newMetricBasisOwners: expect.any(Array),
          requiredPhysicalInputFields: expect.any(Array),
          surfaceParityRequired: expect.any(Boolean),
          wrongAliasOrFallbackBlocks: expect.any(Array)
        })
      );
    }
  });

  it("keeps Gate CD runtime pins executable while Gate CE itself moves no values", () => {
    for (const output of SINGLE_OUTPUT_PROBES) {
      const result = calculateAssembly(EPS_SCREED_HYBRID_VARIANT, {
        airborneContext: BUILDING_CONTEXT,
        calculator: "dynamic",
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: [output]
      });

      expect(result.supportedTargetOutputs, output).toEqual([output]);
      expect(result.unsupportedTargetOutputs, output).toEqual([]);
    }
  });

  it("keeps docs and current-gate runner aligned with Gate CE selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS);
      expect(contents, path).toContain("target_output_independence_sweep");
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE);
    }

    expect(repoFileExists("packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce.ts")).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts");
  });
});
