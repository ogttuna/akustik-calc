import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS,
  rankPostV1GateBLNumericCoverageCandidates,
  summarizePostV1GateBLNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bl";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BL_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

const RAW_OPEN_BOX_220 = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const FIELD_OUTPUTS = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "IIC"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BL", () => {
  it("lands a no-runtime rerank after Gate BK and selects open-box raw-bare field companion runtime", () => {
    const summary = summarizePostV1GateBLNumericCoverageGap();

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBK: {
        landedGate: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan",
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE,
        selectionStatus: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl"
      },
      selectedCandidateId: "floor.open_box_timber_raw_bare.field_companion_runtime_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS,
      targetMetricsForSelectedSlice: ["L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(summary.selectedAcceptancePins).toEqual([
      {
        carrier: "open_box_timber_raw_bare_220",
        ci50_2500Db: 3.4,
        fieldKDb: 2,
        lPrimeNT50Db: 94.1,
        lPrimeNTwDb: 90.7,
        lPrimeNWDb: 93.1,
        lnWDb: 91.1,
        receivingRoomVolumeM3: 55
      },
      {
        carrier: "open_box_timber_raw_bare_370",
        ci50_2500Db: 3.1,
        fieldKDb: 2,
        lPrimeNT50Db: 90.9,
        lPrimeNTwDb: 87.8,
        lPrimeNWDb: 90.2,
        lnWDb: 88.2,
        receivingRoomVolumeM3: 55
      }
    ]);
  });

  it("ranks calculator runtime coverage above source crawling, finite examples, wording, and generic surfaces", () => {
    const candidates = rankPostV1GateBLNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.open_box_timber_raw_bare.field_companion_runtime_gap",
      "floor.raw_bare_open_web.building_prediction_owner_gap",
      "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
    expect(selected).toMatchObject({
      id: "floor.open_box_timber_raw_bare.field_companion_runtime_gap",
      score: 2.2,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(
      candidates
        .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
        .map((candidate) => candidate.id)
    ).toEqual([
      "broad_source_row_crawl",
      "finite_scenario_pack",
      "confidence_wording_or_low_confidence_surface",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("records the selected open-box gap evidence while Gate BK open-web pins stay live", () => {
    const summary = summarizePostV1GateBLNumericCoverageGap();
    const openWeb = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(summary.evidence.openBoxCurrentGap).toEqual({
      currentSupportedOutputs: ["Ln,w"],
      currentUnsupportedOutputs: ["L'n,w", "L'nT,w", "L'nT,50", "IIC"],
      existingLabBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      existingLabPins: {
        ci50_2500Db: 3.4,
        ciDb: -0.9,
        lnWDb: 91.1,
        lnWPlusCiDb: 90.2
      }
    });

    expect(openWeb.impact).toMatchObject({
      CI50_2500: 5.2,
      LPrimeNT50: 100.8,
      LPrimeNTw: 95.6,
      LPrimeNW: 98,
      LnW: 96
    });
    expect(openWeb.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(openWeb.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps docs and current-gate runner aligned with Gate BL selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.open_box_timber_raw_bare.field_companion_runtime_gap");
      expect(contents, path).toContain("L'nT,w 90.7");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bl-contract.test.ts");
  });
});
