import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_web_field_building_adapter_owner_plan";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_field_building_surface_parity_plan";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts";

const BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL =
  "floor open-web field/building surface parity";

const PREVIOUS_REVALIDATION_GATE = "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan";
const PREVIOUS_REVALIDATION_STATUS =
  "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner";

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

const OWNER_CONTRACT = {
  apiShapeChange: false,
  buildingPredictionRuntimePromotion: false,
  evidencePromotion: false,
  landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_LANDED_GATE,
  noRuntimeValueMovement: true,
  previousGate: PREVIOUS_REVALIDATION_GATE,
  previousSelectionStatus: PREVIOUS_REVALIDATION_STATUS,
  selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
  selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
  toleranceMovement: false,
  workbenchInputBehaviorChange: false
} as const;

const FIELD_BUILDING_OWNER_REQUIREMENTS = [
  {
    id: "airborne_field_between_rooms_rwprime_dntw_owner",
    ownedInputs: ["airborneContext.contextMode", "panelWidthMm", "panelHeightMm", "receivingRoomVolumeM3", "receivingRoomRt60S"],
    ownedOutputs: ["R'w", "DnT,w"],
    runtimePosture: "current_field_between_rooms_adapter_owned"
  },
  {
    id: "impact_field_lprime_owner",
    ownedInputs: ["impactFieldContext.fieldKDb", "impactFieldContext.receivingRoomVolumeM3", "selected lab Ln,w/CI basis"],
    ownedOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
    runtimePosture: "owned only for exact/direct-fixed/supported-band lab anchors"
  },
  {
    id: "raw_bare_open_web_impact_field_transfer_followup",
    ownedOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
    blocker:
      "raw-bare source-absent open-web Ln,w was the follow-up field-transfer runtime gap after the owner boundary and is now admitted only with explicit field context"
  },
  {
    id: "open_web_building_prediction_boundary",
    blockedOutputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
    blocker:
      "building prediction needs separate flanking and building uncertainty owners; field_between_rooms and lab impact adapters cannot be relabelled as building evidence"
  },
  {
    id: "astm_iic_aiic_boundary",
    blockedOutputs: ["IIC", "AIIC"],
    blocker: "ISO Ln,w and L'n,w outputs cannot be relabelled as ASTM IIC/AIIC without a rating-curve owner"
  }
] as const;

const LANE_RANKING = [
  {
    id: "field_building_surface_parity",
    nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
    reason:
      "selected because the owner boundary is now explicit and the next risk is whether cards, reports, API payloads, and saved replay show the same field/building posture",
    selectedNext: true
  },
  {
    id: "raw_bare_impact_field_runtime_transfer",
    nextAction: "broad_accuracy_floor_open_web_raw_bare_field_impact_transfer_owner_plan",
    reason:
      "not selected until visible parity proves existing exact/direct-fixed/supported-band field adapters and raw-bare blockers are shown consistently",
    selectedNext: false
  },
  {
    id: "open_web_building_prediction_runtime",
    nextAction: "broad_accuracy_floor_open_web_building_prediction_runtime_owner_plan",
    reason: "not selected because building prediction requires flanking and building uncertainty owners beyond room-to-room field context",
    selectedNext: false
  },
  {
    id: "astm_iic_aiic_rating_curve_owner",
    nextAction: "broad_accuracy_floor_open_web_astm_iic_aiic_rating_curve_owner_plan",
    reason: "not selected because ASTM/IIC remains a separate rating procedure from ISO Ln,w / L'n,w",
    selectedNext: false
  },
  {
    id: "broad_source_crawl",
    nextAction: "blocked_until_narrow_owner_gap_requires_sources",
    reason: "not selected because this gate is an adapter-owner boundary over current calculator routes, not source-library expansion",
    selectedNext: false
  }
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-web field/building adapter owner contract", () => {
  it("lands a no-runtime owner boundary and selects field/building surface parity next", () => {
    expect(OWNER_CONTRACT).toEqual({
      apiShapeChange: false,
      buildingPredictionRuntimePromotion: false,
      evidencePromotion: false,
      landedGate: "broad_accuracy_floor_open_web_field_building_adapter_owner_plan",
      noRuntimeValueMovement: true,
      previousGate: "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_plan",
      previousSelectionStatus:
        "broad_accuracy_post_raw_bare_open_web_coverage_revalidation_landed_no_runtime_selected_open_web_field_building_adapter_owner",
      selectedNextAction: "broad_accuracy_floor_open_web_field_building_surface_parity_plan",
      selectedNextFile: "packages/engine/src/broad-accuracy-floor-open-web-field-building-surface-parity-contract.test.ts",
      selectedNextLabel: "floor open-web field/building surface parity",
      selectionStatus: "broad_accuracy_floor_open_web_field_building_adapter_owner_landed_no_runtime_selected_field_building_surface_parity",
      toleranceMovement: false,
      workbenchInputBehaviorChange: false
    });

    expect(FIELD_BUILDING_OWNER_REQUIREMENTS.map((requirement) => requirement.id)).toEqual([
      "airborne_field_between_rooms_rwprime_dntw_owner",
      "impact_field_lprime_owner",
      "raw_bare_open_web_impact_field_transfer_followup",
      "open_web_building_prediction_boundary",
      "astm_iic_aiic_boundary"
    ]);
  });

  it("keeps existing exact, direct-fixed, and supported-band field adapters pinned", () => {
    const exact = calculateAssembly(EXACT_FL23_OPEN_WEB, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(exact.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(exact.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026");
    expect(exact.floorSystemRatings).toMatchObject({ Rw: 51, basis: "official_floor_system_exact_match" });
    expect(exact.metrics).toMatchObject({ estimatedRwPrimeDb: 77, estimatedDnTwDb: 80 });
    expect(exact.impact).toMatchObject({
      LnW: 71,
      LPrimeNW: 73,
      LPrimeNTw: 70.6,
      LPrimeNT50: 70,
      basis: "mixed_exact_plus_estimated_local_guide"
    });

    expect(directFixed.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(directFixed.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.metrics).toMatchObject({ estimatedRwPrimeDb: 75, estimatedDnTwDb: 78 });
    expect(directFixed.impact).toMatchObject({
      LnW: 77,
      LPrimeNW: 79,
      LPrimeNTw: 76.6,
      LPrimeNT50: 76.5,
      basis: "mixed_predicted_plus_estimated_local_guide"
    });

    expect(supportedBand.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(supportedBand.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.metrics).toMatchObject({ estimatedRwPrimeDb: 45, estimatedDnTwDb: 48 });
    expect(supportedBand.impact).toMatchObject({
      LnW: 61.5,
      LPrimeNW: 63.5,
      LPrimeNTw: 61.1,
      LPrimeNT50: 60,
      basis: "mixed_predicted_plus_estimated_local_guide"
    });

    for (const result of [exact, directFixed, supportedBand]) {
      expect(result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")).toBe(true);
    }
  });

  it("now carries raw-bare open-web field impact through the explicit field adapter", () => {
    const rawBare = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(rawBare.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(rawBare.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(rawBare.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBare.metrics).toMatchObject({ estimatedRwPrimeDb: 77, estimatedDnTwDb: 80 });
    expect(rawBare.impact).toMatchObject({
      LnW: 96,
      LPrimeNW: 98,
      LPrimeNTw: 95.6,
      LPrimeNT50: 100.8,
      CI: 1.8,
      CI50_2500: 5.2,
      LnWPlusCI: 97.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(rawBare.impact?.metricBasis).toMatchObject({
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
    });
    expect(rawBare.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.origin === "source_absent_field_building_adapter_error_budget")).toBe(true);
  });

  it("keeps building impact and ASTM/IIC outside the open-web field adapter owner while later airborne building coverage stays live", () => {
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

    expect(building.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(building.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
    expect(building.metrics).toMatchObject({
      estimatedDnTwDb: 32,
      estimatedRwPrimeDb: 30
    });
    expect(building.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(LANE_RANKING.find((lane) => lane.selectedNext)).toMatchObject({
      id: "field_building_surface_parity",
      nextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION
    });
    expect(LANE_RANKING.filter((lane) => !lane.selectedNext).map((lane) => lane.id)).toEqual([
      "raw_bare_impact_field_runtime_transfer",
      "open_web_building_prediction_runtime",
      "astm_iic_aiic_rating_curve_owner",
      "broad_source_crawl"
    ]);
  });

  it("keeps docs and current-gate runner aligned with the field/building adapter owner", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_FIELD_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("floor open-web field/building surface parity");
      expect(normalizedWhitespaceContent, path).toContain("field_between_rooms");
      expect(normalizedContent, path).toContain("impactfieldcontext");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare impact field");
      expect(normalizedWhitespaceContent, path).toContain("building prediction");
      expect(normalizedContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts"))).toBe(true);
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "broad-accuracy-floor-open-web-field-building-adapter-owner-contract.test.ts"
    );
  });
});
