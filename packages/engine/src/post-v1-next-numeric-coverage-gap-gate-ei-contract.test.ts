import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { EstimateRequestSchema, ImpactOnlyRequestSchema } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS,
  POST_V1_GATE_EH_COUNTERS,
  POST_V1_GATE_EH_OWNER_ID
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh";
import {
  POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EI_PLAN_DOC_PATH,
  POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EI_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS,
  rankPostV1GateEINumericCoverageCandidates,
  summarizePostV1GateEINumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ei";

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
  POST_V1_GATE_EI_PLAN_DOC_PATH
] as const;

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "Gate EI ASTM E492 lab exact source",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "Gate EI ASTM E1007 field exact source",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EI", () => {
  it("lands after Gate EH and selects the ASTM exact-band input surface Gate EJ", () => {
    const summary = summarizePostV1GateEINumericCoverageGap();

    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS).toBe(
      "post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_landed_no_runtime_selected_next_numeric_coverage_gap_gate_ei"
    );
    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE
    );
    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EI_PLAN_DOC_PATH,
      previousGateEH: {
        counters: POST_V1_GATE_EH_COUNTERS,
        landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
        ownerId: POST_V1_GATE_EH_OWNER_ID,
        selectedNextAction: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
    });
  });

  it("proves the selected input-surface candidate is backed by live engine and API schema owner paths", () => {
    expect(
      EstimateRequestSchema.safeParse({
        exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
        layers: FLOOR_STACK,
        targetOutputs: AIIC_OUTPUTS
      }).success
    ).toBe(true);
    expect(
      ImpactOnlyRequestSchema.safeParse({
        exactImpactSource: ASTM_LAB_IIC_SOURCE,
        targetOutputs: IIC_OUTPUTS
      }).success
    ).toBe(true);

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
    expect(lab.supportedTargetOutputs).toEqual(["IIC"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(field.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(field.supportedTargetOutputs).toEqual(["AIIC"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("runs two ROI iterations and ranks the surface scope above closed or unsafe alternatives", () => {
    const candidates = rankPostV1GateEINumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EI_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EI_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
      requiresFutureFrontendOrSharedSurfaceWork: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
      sliceKind: "input_surface_scope_expansion",
      targetMetrics: POST_V1_GATE_EI_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.open_web_open_box_field_building_already_live")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);
    expect(byId.get("floor.closed_floor_formula_route_repeats")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("wall.held_aac_or_grouped_multicavity_already_live")).toMatchObject({
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

  it("keeps Gate EI no-runtime and records why Gate EJ is a separate surface slice", () => {
    const workbenchBandImport = readRepoFile("apps/web/features/workbench/impact-band-import.ts");

    expect(workbenchBandImport).toContain("standardMethod?: string | null");
    expect(workbenchBandImport).toContain("detectImpactBandStandardMethod");
    expect(workbenchBandImport).toContain("defaultImpactBandStandardMethod(input.labOrField)");
    expect(POST_V1_GATE_EI_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate EI and Gate EJ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EI_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EJ");
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
      "src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts");
  });
});
