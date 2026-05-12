import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
  GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ae";
import {
  GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN
} from "./calculator-personal-use-mvp-coverage-sprint-gate-af";
import {
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
} from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_STATUS =
  "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj";

const GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_PLAN =
  "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan";
const GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_STATUS =
  "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak";
const GATE_AJ_SELECTED_NEXT_ACTION =
  "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan";
const GATE_AJ_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts";

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AJ = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_PLAN,
  matrixRows: 40,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus: GATE_AI_OPENING_LEAK_STC_SURFACE_PARITY_STATUS,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: GATE_AJ_SELECTED_NEXT_ACTION,
  selectedNextFile: GATE_AJ_SELECTED_NEXT_FILE,
  selectionStatus: GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: false
} as const;

const REQUIRED_GATE_AJ_REVALIDATION_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts",
  "apps/web/features/workbench/opening-leak-composite-surface.ts",
  "apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts",
  "apps/web/features/workbench/opening-leak-composite-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/airborne-field-context-surface-parity.test.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.test.ts",
  "apps/web/features/workbench/airborne-building-prediction-boundary.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AJ_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_CONTINUITY_TESTS = [
  "calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts",
  "calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AJ_HANDOFF.md"
] as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const COMPLETE_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
};

const HIGH_LEAKAGE_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 16,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    },
    {
      areaM2: 0.2,
      count: 2,
      elementRwDb: 25,
      id: "duct-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "leaky"
    }
  ]
};

const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const BUILDING_CONTEXT_WITH_OPENING: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const OPENING_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGETS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const POST_GATE_AJ_NEXT_LANE_CANDIDATES = [
  {
    blockedBy: "Gate W/AA matrix rows predate the now-visible Gate AH STC surface",
    id: "coverage_matrix_refresh_after_opening_leak_stc",
    reason:
      "refresh the executable MVP matrix with the landed STC adapter surface before choosing another runtime lane",
    selected: true
  },
  {
    blockedBy: "Gate N/O/P still lack executable direct, flanking, junction, and normalization owners",
    id: "airborne_building_prediction_runtime_promotion",
    reason: "would risk lab/field/building aliasing immediately after an opening/STC adapter change",
    selected: false
  },
  {
    blockedBy: "ASTM impact support must be separately owned and must not alias ISO Ln,w/DeltaLw",
    id: "astm_iic_aiic_rating_adapter",
    reason: "lower ROI than refreshing the active wall/floor matrix after a user-visible STC route landed",
    selected: false
  },
  {
    blockedBy: "active plan requires calculator-first blockers, not broad source-library drift",
    id: "broad_source_catalog_crawl",
    reason: "no current Gate AJ regression requires new source rows",
    selected: false
  }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(rows: readonly PersonalUseMvpCoverageScenarioRow[], id: string): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing scenario row ${id}`);
  }

  return row;
}

function values(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin: PersonalUseMvpCoverageMetricValuePin) => [
    pin.metric,
    pin.value
  ]));
}

describe("Personal-Use MVP Coverage Sprint Gate AJ post opening/leak STC surface revalidation", () => {
  it("lands Gate AJ as no-runtime revalidation and selects the post-STC matrix refresh next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AJ).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan",
      matrixRows: 40,
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj",
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ak_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_stc_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ak-coverage-matrix-refresh-after-opening-leak-stc-contract.test.ts",
      selectionStatus:
        "gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_ak",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_AJ_REVALIDATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate S and Gate AH opening/leak lab Rw and STC pins unchanged", () => {
    const complete = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const highLeakage = calculateAssembly(HOST_WALL, {
      airborneContext: HIGH_LEAKAGE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const stcOnlyTarget = calculateAssembly(HOST_WALL, {
      airborneContext: COMPLETE_OPENING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });

    expect(complete.metrics).toMatchObject({
      estimatedRwDb: 38.2,
      estimatedStc: 39
    });
    expect(complete.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(complete.ratingAdapterBasisSet).toEqual([
      expect.objectContaining({
        adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        inputBasis: "airborne_transmission_loss_curve",
        metricId: "STC",
        ratingStandard: "ASTM E413",
        sourceMetricIds: ["Rw"]
      })
    ]);
    expect(complete.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(complete.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(complete.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);

    expect(highLeakage.metrics).toMatchObject({ estimatedRwDb: 33.7, estimatedStc: 34 });
    expect(highLeakage.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(highLeakage.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(highLeakage.ratingAdapterBasisSet?.[0]).toMatchObject({
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      ratingStandard: "ASTM E413"
    });

    expect(stcOnlyTarget.metrics).toMatchObject({ estimatedRwDb: 38.2, estimatedStc: 39 });
    expect(stcOnlyTarget.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnlyTarget.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps missing, duplicate, source-absent, STC-only basis, field, and building requests outside the lab STC adapter", () => {
    const missingOpeningRw = calculateAssembly(HOST_WALL, {
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1.8,
            count: 1,
            id: "partial-door",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const duplicateOpening = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: [
          {
            areaM2: 1.8,
            count: 1,
            elementRwDb: 32,
            id: "door-01",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          },
          {
            areaM2: 1.8,
            count: 1,
            elementRwDb: 32,
            id: "door-01",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const sourceAbsentOpening = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "source-absent-door",
          origin: "source_absent"
        }))
      },
      calculator: "dynamic",
      targetOutputs: OPENING_TARGETS
    });
    const stcOpeningBasis = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "stc-only-door",
          ratingBasis: "stc_single_number"
        }))
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const field = calculateAssembly(HOST_WALL, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_TARGETS
    });
    const buildingAlias = calculateAssembly(HOST_WALL, {
      airborneContext: BUILDING_CONTEXT_WITH_OPENING,
      calculator: "dynamic",
      targetOutputs: ["STC", "R'w", "DnT,w"]
    });

    expect(missingOpeningRw.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingElementRwDb"],
      origin: "needs_input"
    });
    expect(missingOpeningRw.ratingAdapterBasisSet).toBeUndefined();
    expect(missingOpeningRw.supportedTargetOutputs).toEqual([]);

    for (const [result, blockedReason] of [
      [duplicateOpening, "duplicateOpeningId"],
      [sourceAbsentOpening, "sourceAbsentOpeningValueBudgetOwner"],
      [stcOpeningBasis, "STC-only opening ratings cannot be aliased"]
    ] as const) {
      expect(result.airborneBasis?.origin, blockedReason).toBe("unsupported");
      expect(result.airborneBasis?.errorBudgetDb, blockedReason).toBeUndefined();
      expect(result.ratingAdapterBasisSet, blockedReason).toBeUndefined();
      expect(result.supportedTargetOutputs, blockedReason).toEqual([]);
      expect(result.warnings.join("\n"), blockedReason).toContain(blockedReason);
    }

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(field.ratingAdapterBasisSet).toBeUndefined();

    expect(buildingAlias.supportedTargetOutputs).toEqual([]);
    expect(buildingAlias.unsupportedTargetOutputs).toEqual(["STC", "R'w", "DnT,w"]);
    expect(buildingAlias.metrics.estimatedStc).not.toBe(39);
    expect(buildingAlias.metrics.estimatedRwPrimeDb).toBeUndefined();
    expect(buildingAlias.metrics.estimatedDnTwDb).toBeUndefined();
    expect(buildingAlias.ratingAdapterBasisSet).toBeUndefined();
    expect(buildingAlias.warnings.join("\n")).toContain(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
    expect(buildingAlias.warnings.join("\n")).not.toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps adjacent wall-family runtime pins stable after the opening/leak STC surface", () => {
    const flatRuntime = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const tripleLeafRuntime = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(flatRuntime.metrics).toMatchObject(GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS);
    expect(flatRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
      origin: "family_physics_prediction"
    });

    expect(tripleLeafRuntime.metrics).toMatchObject(GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.metrics);
    expect(tripleLeafRuntime.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.errorBudgetDb,
      method: GATE_AF_PROTECTED_GATE_G_GROUPED_TRIPLE_LEAF_PIN.method,
      origin: "family_physics_prediction"
    });
  });

  it("keeps the 40-row coverage matrix gap-free and preserves opening supported versus unsupported outputs", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateAA(rows);
    const openingComplete = byId(rows, "wall.opening_leak_composite.lab");
    const openingTwo = byId(rows, "wall.opening_leak_two_openings.lab");
    const openingStc = byId(rows, "wall.opening_leak_stc_target.lab");
    const duplicateOpening = byId(rows, "wall.opening_leak_duplicate_id.refused");
    const buildingOpening = byId(rows, "wall.opening_leak_composite_building_boundary.unsupported");

    expect(summary).toMatchObject({
      gapFreeAfterGateAA: true,
      remainingCoverageGapRowIds: [],
      rowCount: 40
    });

    expect(openingComplete.runtime).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      errorBudgetDb: 6,
      origin: "family_physics_prediction",
      supportedTargetOutputs: ["Rw", "STC"],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(values(openingComplete)).toEqual({ Rw: 38.2, STC: 39 });
    expect(values(openingTwo)).toEqual({ Rw: 33.7, STC: 34 });
    expect(openingStc.runtime).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      supportedTargetOutputs: ["STC"],
      unsupportedTargetOutputs: []
    });
    expect(values(openingStc)).toEqual({ STC: 39 });

    for (const row of [duplicateOpening, buildingOpening]) {
      expect(row.runtime.supportedTargetOutputs).toEqual([]);
      expect(row.runtime.valuePins).toEqual([]);
      expect(row.runtime.errorBudgetDb).toBeNull();
    }
  });

  it("selects the STC-aware matrix refresh ahead of runtime promotion and source crawling", () => {
    expect(POST_GATE_AJ_NEXT_LANE_CANDIDATES.filter((candidate) => candidate.selected)).toEqual([
      {
        blockedBy: "Gate W/AA matrix rows predate the now-visible Gate AH STC surface",
        id: "coverage_matrix_refresh_after_opening_leak_stc",
        reason:
          "refresh the executable MVP matrix with the landed STC adapter surface before choosing another runtime lane",
        selected: true
      }
    ]);
    expect(POST_GATE_AJ_NEXT_LANE_CANDIDATES.find((candidate) => candidate.id === "broad_source_catalog_crawl"))
      .toMatchObject({
        selected: false
      });
  });

  it("keeps docs and the current-gate runner aligned with Gate AJ closeout and Gate AK selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_PLAN);
      expect(content, path).toContain(GATE_AJ_POST_OPENING_LEAK_STC_SURFACE_REVALIDATION_STATUS);
      expect(content, path).toContain(GATE_AJ_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(GATE_AJ_SELECTED_NEXT_FILE);
      expect(content, path).toContain("STC-aware matrix refresh");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/opening-leak-composite-surface-parity.test.ts");
    expect(runner).toContain("features/workbench/opening-leak-composite-input-surface-acceptance.test.ts");
    expect(runner).toContain("features/workbench/airborne-building-prediction-boundary.test.ts");
    for (const testFile of REQUIRED_CONTINUITY_TESTS) {
      expect(runner).toContain(testFile);
    }

    expect(readRepoFile("docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md"))
      .toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS);
  });
});
