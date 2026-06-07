import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
  computeAstmE989ImpactRating
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS,
  POST_V1_GATE_EF_COUNTERS
} from "./post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef";
import {
  POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EG_PLAN_DOC_PATH,
  POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EG_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS,
  rankPostV1GateEGNumericCoverageCandidates,
  summarizePostV1GateEGNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-eg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EG_PLAN_DOC_PATH
] as const;

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "Gate EG ASTM E492 lab source with complete one-third-octave bands",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "Gate EG ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EG", () => {
  it("lands after Gate EF and selects the ASTM exact-band input owner Gate EH", () => {
    const summary = summarizePostV1GateEGNumericCoverageGap();

    expect(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS).toBe(
      "post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_eg"
    );
    expect(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE
    );
    expect(POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EG_PLAN_DOC_PATH,
      previousGateEF: {
        counters: POST_V1_GATE_EF_COUNTERS,
        landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EG_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
    });
  });

  it("proves the exact ASTM E492/E1007 owner already calculates only when ASTM bands are supplied", () => {
    expect(computeAstmE989ImpactRating(ASTM_LAB_IIC_SOURCE.frequenciesHz, ASTM_LAB_IIC_SOURCE.levelsDb)).toMatchObject({
      contourLevelAt500HzDb: 60,
      rating: 50
    });

    const lab = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });
    const field = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });

    expect(lab.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"]
    });
    expect(field.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"]
    });
  });

  it("ranks ASTM exact-band input ownership above already-live and wrong-metric alternatives", () => {
    const candidates = rankPostV1GateEGNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EG_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
      requiresFutureInputSurfaceImplementation: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
      sliceKind: "input_owner_gap",
      targetMetrics: POST_V1_GATE_EG_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.open_web_field_building_companion_already_live")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.open_box_finished_package_field_building_already_live")?.score ?? 0);
    expect(byId.get("floor.open_web_field_building_companion_already_live")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });
    expect(byId.get("floor.open_box_finished_package_field_building_already_live")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });
    expect(byId.get("floor.astm_iic_aiic_formula_alias_from_iso_rejected")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_wrong_metric_alias"
    });
    expect(byId.get("floor.lower_treatment_delta_lw_cross_family_derivation_rejected")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_wrong_metric_derivation"
    });
    expect(byId.get("broad_source_row_crawl")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("pins the current input-surface evidence without touching frontend implementation", () => {
    const estimateSchema = readRepoFile("packages/shared/src/api/estimate.ts");
    const impactOnlySchema = readRepoFile("packages/shared/src/api/impact-only.ts");
    const exactImpactDomain = readRepoFile("packages/shared/src/domain/exact-impact-source.ts");
    const workbenchBandImport = readRepoFile("apps/web/features/workbench/impact-band-import.ts");

    expect(estimateSchema).toContain("exactImpactSource: ExactImpactSourceSchema.optional()");
    expect(impactOnlySchema).toContain("exactImpactSource: ExactImpactSourceSchema.optional()");
    expect(exactImpactDomain).toContain("standardMethod: z.string().min(1).optional()");
    expect(workbenchBandImport).toContain("detectImpactBandStandardMethod");
    expect(workbenchBandImport).toContain("defaultImpactBandStandardMethod(input.labOrField)");
    expect(POST_V1_GATE_EG_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EG closeout and Gate EH selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EG_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("ASTM E492/E1007");
      expect(contents, path).toContain("IIC");
      expect(contents, path).toContain("AIIC");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-composite-panel-suspended-ceiling-only-route-boundary-gate-ef-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts");
  });
});
