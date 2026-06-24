import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING
} from "./british-gypsum-exact-lab-field-building-adapter";
import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_OWNER_PLAN_2026-06-23.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_landed_runtime_scope_basis_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall British Gypsum exact lab calculated lab companion coverage refresh";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const SINGLE_RW_OUTPUT = ["Rw"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALIAS_OUTPUTS = ["R'w", "DnT,w", "STC"] as const satisfies readonly RequestedOutputId[];
const BUILDING_ALIAS_OUTPUTS = ["R'w", "DnT,A", "DnT,A,k", "STC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CASES = [
  {
    c: -0.6,
    ctr: -5.4,
    id: "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "one_side",
    rw: 55,
    stc: 55
  },
  {
    c: -0.6,
    ctr: -5.4,
    id: "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "both_sides",
    rw: 58,
    stc: 58
  }
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function officialRow(id: string): WallTimberLightweightOfficialSourceRow {
  const row = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
    (entry): entry is WallTimberLightweightOfficialSourceRow =>
      entry.kind === "official_row" && entry.id === id
  );

  if (!row) {
    throw new Error(`Missing official source row ${id}`);
  }

  return row;
}

function baseContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...row.airborneContext,
    airtightness: "good",
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    panelHeightMm: 2500,
    panelWidthMm: 4000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 40,
    resilientBarSideCount,
    sourceRoomVolumeM3: 42,
    studSpacingMm: 600,
    studType: "resilient_stud"
  };
}

function fieldContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...baseContext(row, resilientBarSideCount),
    contextMode: "field_between_rooms"
  };
}

function buildingContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...baseContext(row, resilientBarSideCount),
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "single_conservative_path",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_cross_junction",
    junctionCouplingLengthM: 3.2
  };
}

function calculateBritishGypsum(
  testCase: (typeof CASES)[number],
  targetOutputs: readonly RequestedOutputId[],
  airborneContext: AirborneContext
) {
  const row = officialRow(testCase.id);

  return calculateAssembly(row.layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousOwner: {
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    reProbedCandidateId: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall British Gypsum exact lab calculated lab companion coverage refresh", () => {
  it("lands the no-runtime refresh and selects a runtime-first rerank", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      reProbedCandidateId: "wall.british_gypsum_exact_lab_calculated_lab_companion_owner",
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it.each(CASES)(
    "$id re-probes calculated STC/C/Ctr beside exact Rw without moving runtime values",
    (testCase) => {
      const row = officialRow(testCase.id);
      const result = calculateBritishGypsum(
        testCase,
        MIXED_LAB_OUTPUTS,
        baseContext(row, testCase.resilientBarSideCount)
      );

      expect(result.supportedTargetOutputs).toEqual([...MIXED_LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject({
        estimatedCDb: testCase.c,
        estimatedCtrDb: testCase.ctr,
        estimatedRwDb: testCase.rw,
        estimatedStc: testCase.stc
      });
      expect(result.ratings.iso717).toMatchObject({
        C: testCase.c,
        Ctr: testCase.ctr,
        Rw: testCase.rw
      });
      expect(result.airborneBasis).toMatchObject({
        calculationStandard: "engine_double_leaf_cavity",
        curveBasis: "calculated_frequency_curve",
        exactSourceId: testCase.id,
        kind: "airborne_physics_prediction",
        method: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction",
        ratingStandard: "ISO 717-1",
        toleranceClass: "uncalibrated_prediction"
      });
      expect(result.airborneBasis?.requiredInputs).toEqual(
        expect.arrayContaining([
          "exactBritishGypsumSourceRow:Rw",
          "calculatedTransmissionLossCurve",
          "ISO717-1 C/Ctr rating adapter",
          "ASTM E413 STC rating adapter"
        ])
      );
      expect(result.airborneCandidateResolution).toMatchObject({
        runtimeValueMovement: false,
        selectedCandidateId: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
      expect(
        result.airborneCandidateResolution?.candidates.find(
          (candidate: { id: string }) =>
            candidate.id ===
            POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID
        )
      ).toMatchObject({
        metricIds: [...MIXED_LAB_OUTPUTS],
        outputIds: [...MIXED_LAB_OUTPUTS],
        rejectionReasons: [],
        selected: true
      });
      expect(result.warnings).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);
      expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: STC, C, Ctr");
    }
  );

  it("keeps single-output Rw on the measured exact source route", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const result = calculateBritishGypsum(
      testCase,
      SINGLE_RW_OUTPUT,
      baseContext(row, testCase.resilientBarSideCount)
    );

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwDb).toBe(testCase.rw);
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: testCase.id,
      kind: "airborne_measured_exact",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(result.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);
  });

  it("keeps field/building aliases, impact metrics, and legacy auto outside the calculated lab companion refresh", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const field = calculateBritishGypsum(
      testCase,
      FIELD_ALIAS_OUTPUTS,
      fieldContext(row, testCase.resilientBarSideCount)
    );
    const building = calculateBritishGypsum(
      testCase,
      BUILDING_ALIAS_OUTPUTS,
      buildingContext(row, testCase.resilientBarSideCount)
    );
    const impact = calculateBritishGypsum(
      testCase,
      IMPACT_OUTPUTS,
      baseContext(row, testCase.resilientBarSideCount)
    );
    const legacyAuto = calculateBritishGypsum(testCase, MIXED_LAB_OUTPUTS, {
      ...baseContext(row, testCase.resilientBarSideCount),
      resilientBarSideCount: "auto"
    });

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    });
    expect(field.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);

    expect(building.supportedTargetOutputs).toEqual(["R'w", "DnT,A", "DnT,A,k"]);
    expect(building.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(building.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(building.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
    expect(building.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);

    expect(legacyAuto.airborneBasis?.exactSourceId).not.toBe(testCase.id);
    expect(legacyAuto.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
    expect(legacyAuto.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING);
  });

  it("keeps docs and current-gate runner aligned with the landed refresh and selected rerank", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
