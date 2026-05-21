import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LANDED_GATE = "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan";
const SELECTION_STATUS =
  "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner";
const SELECTED_NEXT_ACTION = "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts";
const SELECTED_NEXT_LABEL = "floor helper-only timber/open-web impact stack owner";

const PREVIOUS_GATE = "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan";
const PREVIOUS_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh";
const PREVIOUS_CONTRACT =
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts";

const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const LAB_IMPACT_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const BUILDING_PREDICTION_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  sourceRoomVolumeM3: 55,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  flankingJunctionClass: "rigid_cross_junction",
  conservativeFlankingAssumption: "multi_path_conservative",
  junctionCouplingLengthM: 4,
  buildingPredictionOutputBasis: "apparent_and_standardized"
} as const satisfies AirborneContext;

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const EXACT_FL23_OPEN_WEB = [
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_TIMBER = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

type MatrixRow = {
  readonly basisBoundary: "element_lab" | "field_between_rooms" | "building_prediction" | "rating_alias";
  readonly currentPosture: "supported" | "weak_estimate" | "needs_input" | "unsupported";
  readonly expectedPosture: "stay_pinned" | "stay_blocked" | "needs_owner" | "selected_next_owner";
  readonly failureClass: string;
  readonly family: string;
  readonly id: string;
  readonly requestedMetrics: readonly RequestedOutputId[];
  readonly sourceCrawlRequired: boolean;
};

type RankedLane = {
  readonly basisRiskPenalty: number;
  readonly familySolverReadiness: number;
  readonly id: string;
  readonly metricCriticality: number;
  readonly physicalInputSurfaceReadiness: number;
  readonly selectedNext: boolean;
  readonly sourceCrawlPenalty: number;
  readonly userFrequency: number;
};

const MATRIX_ROWS = [
  {
    basisBoundary: "field_between_rooms",
    currentPosture: "supported",
    expectedPosture: "stay_pinned",
    failureClass: "none",
    family: "open_web_exact",
    id: "floor.open_web_exact_field_context.stable",
    requestedMetrics: FIELD_OUTPUTS,
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "field_between_rooms",
    currentPosture: "supported",
    expectedPosture: "stay_pinned",
    failureClass: "none",
    family: "open_web_direct_fixed",
    id: "floor.open_web_direct_fixed_field_context.stable",
    requestedMetrics: FIELD_OUTPUTS,
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "field_between_rooms",
    currentPosture: "supported",
    expectedPosture: "stay_pinned",
    failureClass: "none",
    family: "open_web_supported_band",
    id: "floor.open_web_supported_band_field_context.stable",
    requestedMetrics: FIELD_OUTPUTS,
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "field_between_rooms",
    currentPosture: "unsupported",
    expectedPosture: "stay_blocked",
    failureClass: "raw_bare_lab_impact_cannot_transfer_to_field",
    family: "open_web_raw_bare",
    id: "floor.open_web_raw_bare_field_transfer.blocked",
    requestedMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "building_prediction",
    currentPosture: "unsupported",
    expectedPosture: "stay_blocked",
    failureClass: "iso_12354_flanking_and_room_owner_missing",
    family: "open_web_field_building",
    id: "floor.open_web_building_prediction.blocked",
    requestedMetrics: BUILDING_OUTPUTS,
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "rating_alias",
    currentPosture: "unsupported",
    expectedPosture: "stay_blocked",
    failureClass: "astm_iic_aiic_rating_basis_owner_missing",
    family: "open_web_field_building",
    id: "floor.open_web_astm_iic_alias.blocked",
    requestedMetrics: ASTM_OUTPUTS,
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "element_lab",
    currentPosture: "needs_input",
    expectedPosture: "selected_next_owner",
    failureClass: "source_absent_floor_impact_solver_missing",
    family: "helper_only_timber_open_web",
    id: "floor.helper_only_timber_open_web_impact_stack_owner.next",
    requestedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "element_lab",
    currentPosture: "weak_estimate",
    expectedPosture: "needs_owner",
    failureClass: "weak_family_general_estimate_needs_named_helper_only_owner",
    family: "helper_only_open_web",
    id: "floor.open_web_lower_treatment_only.weak_estimate_followup",
    requestedMetrics: ["Ln,w", "CI", "Ln,w+CI"],
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "element_lab",
    currentPosture: "unsupported",
    expectedPosture: "needs_owner",
    failureClass: "wet_open_box_deferred_impact_owner_missing",
    family: "tuas_wet_open_box",
    id: "floor.tuas_wet_open_box_deferred_impact.followup",
    requestedMetrics: ["Ln,w", "CI", "Ln,w+CI"],
    sourceCrawlRequired: false
  },
  {
    basisBoundary: "element_lab",
    currentPosture: "needs_input",
    expectedPosture: "needs_owner",
    failureClass: "floor_cover_floating_package_transfer_owner_missing",
    family: "floor_cover_floating_package",
    id: "floor.floor_cover_floating_package_transfer.followup",
    requestedMetrics: ["Ln,w", "DeltaLw" as RequestedOutputId],
    sourceCrawlRequired: false
  }
] as const satisfies readonly MatrixRow[];

const RANKED_NEXT_LANES = [
  {
    basisRiskPenalty: 1,
    familySolverReadiness: 4,
    id: "helper_only_timber_open_web_impact_stack_owner",
    metricCriticality: 5,
    physicalInputSurfaceReadiness: 4,
    selectedNext: true,
    sourceCrawlPenalty: 0,
    userFrequency: 5
  },
  {
    basisRiskPenalty: 3,
    familySolverReadiness: 3,
    id: "raw_bare_impact_field_transfer_owner",
    metricCriticality: 4,
    physicalInputSurfaceReadiness: 4,
    selectedNext: false,
    sourceCrawlPenalty: 0,
    userFrequency: 4
  },
  {
    basisRiskPenalty: 2,
    familySolverReadiness: 3,
    id: "tuas_wet_open_box_deferred_impact_owner",
    metricCriticality: 4,
    physicalInputSurfaceReadiness: 3,
    selectedNext: false,
    sourceCrawlPenalty: 0,
    userFrequency: 3
  },
  {
    basisRiskPenalty: 2,
    familySolverReadiness: 3,
    id: "floor_cover_floating_package_transfer_owner",
    metricCriticality: 3,
    physicalInputSurfaceReadiness: 3,
    selectedNext: false,
    sourceCrawlPenalty: 0,
    userFrequency: 4
  },
  {
    basisRiskPenalty: 5,
    familySolverReadiness: 2,
    id: "building_prediction_runtime_owner",
    metricCriticality: 4,
    physicalInputSurfaceReadiness: 2,
    selectedNext: false,
    sourceCrawlPenalty: 0,
    userFrequency: 3
  },
  {
    basisRiskPenalty: 5,
    familySolverReadiness: 2,
    id: "astm_iic_aiic_rating_owner",
    metricCriticality: 3,
    physicalInputSurfaceReadiness: 2,
    selectedNext: false,
    sourceCrawlPenalty: 0,
    userFrequency: 3
  },
  {
    basisRiskPenalty: 4,
    familySolverReadiness: 1,
    id: "broad_source_crawl",
    metricCriticality: 1,
    physicalInputSurfaceReadiness: 1,
    selectedNext: false,
    sourceCrawlPenalty: 6,
    userFrequency: 1
  }
] as const satisfies readonly RankedLane[];

const MATRIX_REFRESH_CONTRACT = {
  broadSourceCrawl: false,
  buildingPredictionRuntimePromotion: false,
  landedGate: LANDED_GATE,
  noRuntimeValueMovement: true,
  previousContract: PREVIOUS_CONTRACT,
  previousGate: PREVIOUS_GATE,
  previousSelectionStatus: PREVIOUS_SELECTION_STATUS,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectedNextFile: SELECTED_NEXT_FILE,
  selectedNextLabel: SELECTED_NEXT_LABEL,
  selectionStatus: SELECTION_STATUS,
  toleranceMovement: false
} as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateFieldCase(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });
}

function laneScore(lane: RankedLane): number {
  return (
    lane.userFrequency +
    lane.familySolverReadiness +
    lane.physicalInputSurfaceReadiness +
    lane.metricCriticality -
    lane.basisRiskPenalty -
    lane.sourceCrawlPenalty
  );
}

describe("broad accuracy post open-web field/building input-surface matrix refresh", () => {
  it("lands the no-runtime matrix refresh and selects helper-only timber/open-web impact ownership next", () => {
    expect(MATRIX_REFRESH_CONTRACT).toEqual({
      broadSourceCrawl: false,
      buildingPredictionRuntimePromotion: false,
      landedGate: "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan",
      noRuntimeValueMovement: true,
      previousContract:
        "packages/engine/src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts",
      previousGate: "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_plan",
      previousSelectionStatus:
        "broad_accuracy_floor_open_web_field_building_post_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh",
      selectedNextAction: "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts",
      selectedNextLabel: "floor helper-only timber/open-web impact stack owner",
      selectionStatus:
        "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner",
      toleranceMovement: false
    });
    expect(existsSync(join(REPO_ROOT, PREVIOUS_CONTRACT))).toBe(true);

    expect(RANKED_NEXT_LANES.filter((lane) => lane.selectedNext).map((lane) => lane.id)).toEqual([
      "helper_only_timber_open_web_impact_stack_owner"
    ]);
    expect([...RANKED_NEXT_LANES].sort((left, right) => laneScore(right) - laneScore(left))[0]).toMatchObject({
      id: "helper_only_timber_open_web_impact_stack_owner",
      selectedNext: true
    });
    expect(RANKED_NEXT_LANES.find((lane) => lane.id === "broad_source_crawl")).toMatchObject({
      selectedNext: false,
      sourceCrawlPenalty: 6
    });
  });

  it("refreshes the observed calculator gap matrix without promoting field/building, ASTM, or source-crawl work", () => {
    expect(MATRIX_ROWS).toHaveLength(10);
    expect(MATRIX_ROWS.filter((row) => row.sourceCrawlRequired)).toEqual([]);
    expect(MATRIX_ROWS.filter((row) => row.expectedPosture === "selected_next_owner").map((row) => row.id)).toEqual([
      "floor.helper_only_timber_open_web_impact_stack_owner.next"
    ]);
    expect(MATRIX_ROWS.filter((row) => row.expectedPosture === "stay_pinned").map((row) => row.id)).toEqual([
      "floor.open_web_exact_field_context.stable",
      "floor.open_web_direct_fixed_field_context.stable",
      "floor.open_web_supported_band_field_context.stable"
    ]);
    expect(MATRIX_ROWS.filter((row) => row.expectedPosture === "stay_blocked").map((row) => row.id)).toEqual([
      "floor.open_web_raw_bare_field_transfer.blocked",
      "floor.open_web_building_prediction.blocked",
      "floor.open_web_astm_iic_alias.blocked"
    ]);
    expect(MATRIX_ROWS.map((row) => row.failureClass)).toEqual([
      "none",
      "none",
      "none",
      "raw_bare_lab_impact_cannot_transfer_to_field",
      "iso_12354_flanking_and_room_owner_missing",
      "astm_iic_aiic_rating_basis_owner_missing",
      "source_absent_floor_impact_solver_missing",
      "weak_family_general_estimate_needs_named_helper_only_owner",
      "wet_open_box_deferred_impact_owner_missing",
      "floor_cover_floating_package_transfer_owner_missing"
    ]);
  });

  it("keeps exact, direct-fixed, and supported-band open-web field values pinned while refreshing the matrix", () => {
    const exact = calculateFieldCase(EXACT_FL23_OPEN_WEB);
    const directFixed = calculateFieldCase(DIRECT_FIXED_PACKAGE);
    const supportedBand = calculateFieldCase(SUPPORTED_BAND_PACKAGE);

    expect(exact.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(exact.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 51, basis: "official_floor_system_exact_match" });
    expect(exact.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(exact.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73, LnW: 71 });

    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.metrics).toMatchObject({ estimatedDnTwDb: 78, estimatedRwPrimeDb: 75 });
    expect(directFixed.impact).toMatchObject({ LPrimeNT50: 76.5, LPrimeNTw: 76.6, LPrimeNW: 79, LnW: 77 });

    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.metrics).toMatchObject({ estimatedDnTwDb: 48, estimatedRwPrimeDb: 45 });
    expect(supportedBand.impact).toMatchObject({ LPrimeNT50: 60, LPrimeNTw: 61.1, LPrimeNW: 63.5, LnW: 61.5 });
  });

  it("keeps raw-bare field transfer, building prediction, ASTM/IIC, and current helper-only postures explicit", () => {
    const rawBareField = calculateFieldCase(RAW_OPEN_WEB_300);
    const building = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });
    const helperOnlyTimber = calculateAssembly(HELPER_ONLY_TIMBER, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const helperOnlyOpenWeb = calculateAssembly(HELPER_ONLY_OPEN_WEB, { targetOutputs: LAB_IMPACT_OUTPUTS });

    expect(rawBareField.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w"]);
    expect(rawBareField.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC"]);
    expect(rawBareField.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact?.LPrimeNW).toBeUndefined();

    expect(building.supportedTargetOutputs).toEqual([]);
    expect(building.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(helperOnlyTimber.floorSystemRatings).toMatchObject({
      C: -1.1,
      Ctr: -5.9,
      Rw: 54.8,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(helperOnlyTimber.impact).toMatchObject({
      CI: 1,
      CI50_2500: 2.3,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(helperOnlyTimber.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(helperOnlyTimber.unsupportedTargetOutputs).toEqual([
      "L'n,w",
      "L'nT,w",
      "IIC"
    ]);

    expect(helperOnlyOpenWeb.floorSystemRatings).toMatchObject({
      C: -1.7,
      Ctr: -7.9,
      Rw: 46.7,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(helperOnlyOpenWeb.impact).toMatchObject({
      CI: 1,
      CI50_2500: 4,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(helperOnlyOpenWeb.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(helperOnlyOpenWeb.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);
  });

  it("keeps living docs and the current-gate runner aligned to the matrix refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(LANDED_GATE);
      expect(content, path).toContain(SELECTION_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("helper-only timber/open-web");
      expect(normalizedWhitespaceContent, path).toContain("exact, direct-fixed, and supported-band");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare impact field transfer remains blocked");
      expect(normalizedWhitespaceContent, path).toContain("building prediction");
      expect(normalizedWhitespaceContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/broad-accuracy-floor-open-web-field-building-post-input-surface-revalidation-contract.test.ts");
    expect(runner).toContain(
      "src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts"
    );
  });
});
