import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AcousticInputFieldIdSchema,
  AcousticInputRouteFamilySchema,
  RequestedOutputSchema
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_ACTION,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_FILE,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS,
  buildPostV1IndustryGradeGoldenScenarioMatrixV1
} from "./post-v1-industry-grade-golden-scenario-matrix-v1";
import {
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN,
  POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS
} from "./post-v1-route-input-family-first-class-surface-v1";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_FILE =
  "packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts";
const CURRENT_PLAN_DOC =
  "docs/calculator/POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN_2026-06-30.md";

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  CURRENT_PLAN_DOC,
  POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function countBy<T extends string>(
  values: readonly T[]
): Record<T, number> {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

describe("post-V1 industry-grade golden scenario matrix V1", () => {
  it("lands the bounded matrix without runtime movement and selects the route-required input question engine", () => {
    const matrix = buildPostV1IndustryGradeGoldenScenarioMatrixV1();

    expect(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN).toBe(
      "post_v1_industry_grade_golden_scenario_matrix_v1_plan"
    );
    expect(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS).toBe(
      "post_v1_industry_grade_golden_scenario_matrix_v1_landed_no_runtime_selected_post_v1_route_required_input_question_engine_v1"
    );
    expect(matrix.previousAction).toBe(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN);
    expect(matrix.previousStatus).toBe(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS);
    expect(matrix.selectedCandidateId).toBe(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID);
    expect(matrix.selectedNext).toEqual({
      action: "post_v1_route_required_input_question_engine_v1_plan",
      file: "packages/engine/src/post-v1-route-required-input-question-engine-v1-contract.test.ts",
      label: "post-V1 route-required input question engine V1",
      plan: "docs/calculator/POST_V1_ROUTE_REQUIRED_INPUT_QUESTION_ENGINE_V1_PLAN_2026-06-30.md"
    });
    expect(matrix.runtimeValueMovement).toBe(false);
    expect(matrix.counters).toMatchObject({
      goldenScenarioRows: 40,
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      rankedGapLedgerRows: 8,
      requiredPhysicalInputsCaptured: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      selectedNextValueOrBoundaryOwner: 1,
      sourceRowsImported: 0
    });
  });

  it("keeps the 40-row calculator matrix representative and schema-valid", () => {
    const { scenarioRows } = buildPostV1IndustryGradeGoldenScenarioMatrixV1();
    const ids = scenarioRows.map((row) => row.id);
    const statusCounts = countBy(scenarioRows.map((row) => row.status));

    expect(scenarioRows).toHaveLength(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS.goldenScenarioRows);
    expect(new Set(ids).size).toBe(scenarioRows.length);
    expect(statusCounts).toEqual({
      calculable: 14,
      needs_input: 17,
      unsupported: 9
    });
    expect(new Set(scenarioRows.map((row) => row.route))).toEqual(
      new Set(["wall", "floor", "ceiling", "roof", "opening", "facade"])
    );
    expect(new Set(scenarioRows.map((row) => row.family))).toEqual(
      new Set([
        "wall_airborne",
        "floor_impact",
        "ceiling_airborne",
        "roof_airborne",
        "opening_facade",
        "oitc",
        "field_building",
        "metric_boundary"
      ])
    );

    for (const row of scenarioRows) {
      expect(row.runtimeValueMovement, row.id).toBe(false);
      expect(row.targetOutputs.length, row.id).toBeGreaterThan(0);
      expect(row.notes.length, row.id).toBeGreaterThan(0);
      expect(row.protects.length, row.id).toBeGreaterThan(0);
      for (const output of row.targetOutputs) {
        expect(RequestedOutputSchema.parse(output), row.id).toBe(output);
      }
      for (const field of row.missingPhysicalInputs) {
        expect(AcousticInputFieldIdSchema.parse(field), row.id).toBe(field);
      }
      for (const routeFamily of row.routeFamilies) {
        expect(AcousticInputRouteFamilySchema.parse(routeFamily), row.id).toBe(routeFamily);
      }
    }
  });

  it("binds high-ROI gap rows to typed route-input blockers and protected aliases", () => {
    const rows = new Map(
      buildPostV1IndustryGradeGoldenScenarioMatrixV1().scenarioRows.map((row) => [row.id, row])
    );

    expect(rows.get("roof.airborne_missing_roof_mounting_and_mass")).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining([
        "routeIntent",
        "roofOrCeilingMountingContext",
        "frequencyBandSet",
        "surfaceMassKgM2",
        "cavityDepthMm"
      ]),
      status: "needs_input"
    });
    expect(rows.get("facade.oitc_complete_outdoor_indoor_curve_route")).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["opening_facade_outdoor_indoor_oitc"],
      status: "calculable",
      unsupportedOutputs: []
    });
    expect(rows.get("facade.oitc_missing_e1332_80_4000_band_basis")).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["frequencyBandSet"]),
      status: "needs_input"
    });
    expect(rows.get("field_building.missing_rt60_or_normalization_basis")).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["receivingRoomRt60S"]),
      status: "needs_input"
    });
    expect(rows.get("floor.iso_lnw_delta_lw_to_iic_aiic_alias_blocked")).toMatchObject({
      status: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(rows.get("astm.aiic_from_lab_source_missing_field_context")).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["impactFieldContext"]),
      status: "needs_input"
    });
    expect(rows.get("source_row.proximity_substitution_without_boundary_blocked")).toMatchObject({
      status: "unsupported",
      protects: ["no source-row proximity substitution"]
    });
  });

  it("uses the ranked gap ledger to pick one calculator-aligned next owner", () => {
    const matrix = buildPostV1IndustryGradeGoldenScenarioMatrixV1();
    const selectedRows = matrix.rankedGapLedgerRows.filter((row) => row.selected);
    const needsInputIds = matrix.scenarioRows
      .filter((row) => row.status === "needs_input")
      .map((row) => row.id);

    expect(matrix.rankedGapLedgerRows).toHaveLength(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_COUNTERS.rankedGapLedgerRows);
    expect(matrix.rankedGapLedgerRows.map((row) => row.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(selectedRows).toEqual([
      expect.objectContaining({
        expectedNextMovement: {
          newCalculableRequestShapes: 0,
          newCalculableTargetOutputs: 0,
          requiredPhysicalInputsCaptured: 9,
          runtimeValuesMoved: 0
        },
        gapType: "input_surface_owner",
        id: "post_v1_route_required_input_question_engine_v1",
        label: POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL,
        scenarioIds: needsInputIds
      })
    ]);
    expect(selectedRows[0]?.rejectedWrongPaths).toEqual(
      expect.arrayContaining([
        "broad source crawl",
        "cosmetic UI polish",
        "confidence-label loop",
        "metric aliasing"
      ])
    );
    expect(matrix.rankedGapLedgerRows[1]?.id).toBe("post_v1_roof_airborne_formula_owner_after_input_surface_v1");
    expect(matrix.rankedGapLedgerRows[2]?.id).toBe(
      "post_v1_wall_triple_leaf_multicavity_runtime_promotion_after_holdout_v1"
    );
  });

  it("keeps docs and current gate synchronized with the landed matrix and selected next", () => {
    for (const path of [
      CURRENT_FILE,
      CURRENT_PLAN_DOC,
      POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN);
      expect(content, path).toContain(POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_STATUS);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_FILE);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("goldenScenarioRows: 40");
      expect(content, path).toContain("rankedGapLedgerRows: 8");
      expect(content, path).toContain("selectedNextValueOrBoundaryOwner: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(CURRENT_FILE.replace("packages/engine/", ""));
  });
});
