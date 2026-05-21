import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract,
  evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_IMPACT_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

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

const OPEN_BOX_HELPER_FORMULA_INPUT = {
  absorberFlowResistivityClass: "medium",
  baseStructureMaterialId: "open_box_timber_slab",
  boardAttachmentClass: "resilient_rail",
  carrierDepthMm: 370,
  carrierSpacingMm: 600,
  ceilingCavityDepthMm: 100,
  ceilingFillDensityKgM3: 35,
  ceilingFillMaterialId: "rockwool",
  ceilingFillThicknessMm: 100,
  connectionSpacingMm: 600,
  lowerCeilingBoardLayerCount: 2,
  lowerCeilingBoardMaterialId: "gypsum_board",
  lowerCeilingBoardSurfaceMassKgM2: 17.6,
  lowerCeilingBoardThicknessMm: 13,
  resilientDynamicStiffnessMNPerM3: 18,
  roleTopologyState: "source_equivalent",
  shortCircuitRiskClass: "low",
  sourceOrPhysicsBasis: "source_absent_physics_model",
  supportFamily: "open_box_timber",
  supportForm: "open_box",
  supportLossFactor: 0.018,
  surfaceMassKgM2: 82,
  suspensionSupportClass: "resilient_rail",
  targetOutputs: LAB_IMPACT_OUTPUTS,
  upperPackageState: "explicit_absent"
} as const;

const OPEN_WEB_HELPER_FORMULA_INPUT = {
  ...OPEN_BOX_HELPER_FORMULA_INPUT,
  baseStructureMaterialId: "open_web_steel_floor",
  boardAttachmentClass: "resilient_hanger",
  carrierDepthMm: 250,
  ceilingCavityDepthMm: 65,
  ceilingFillDensityKgM3: 45,
  ceilingFillThicknessMm: 145,
  lowerCeilingBoardMaterialId: "firestop_board",
  lowerCeilingBoardSurfaceMassKgM2: 32,
  lowerCeilingBoardThicknessMm: 16,
  resilientDynamicStiffnessMNPerM3: 12,
  supportFamily: "lightweight_steel_open_web",
  supportForm: "open_web_or_rolled",
  supportLossFactor: 0.015,
  surfaceMassKgM2: 28,
  suspensionSupportClass: "resilient_hanger"
} as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
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

describe("broad accuracy floor helper-only timber/open-web impact stack formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction:
        BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false
    });
    expect(contract.previousOwner).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTION_STATUS
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines branch-specific terms, not-measured budgets, and runtime entry criteria", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "branch_specific_bare_carrier_reference",
      "ceiling_board_mass_gain",
      "cavity_absorber_gain",
      "suspension_and_short_circuit_adjustment",
      "package_absence_and_helper_only_scope",
      "exact_package_and_lane_precedence",
      "iso717_helper_only_metric_adapters",
      "hostile_topology_and_safe_reorder_policy",
      "source_absent_budget_decomposition"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.filter((budget) => budget.metricId === "Ln,w").map(
      (budget) => [budget.supportFamily, budget.totalBudgetDb]
    )).toEqual([
      ["open_box_timber", 10.5],
      ["timber_joists", 11.5],
      ["lightweight_steel_open_web", 10]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_helper_only_timber_open_web_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_helper_only_formula_basis_not_generic_published_family_or_screening_basis",
      "runtime_must_require_complete_carrier_lower_board_cavity_absorber_suspension_and_package_absence_owners",
      "exact_direct_fixed_supported_band_raw_bare_package_transfer_and_eps_screed_lanes_must_precede_helper_only_formula",
      "formula_surface_must_show_not_measured_budgets_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);
  });

  it("computes source-absent design payloads for complete helper-only candidates without runtime values", () => {
    const contract = buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { C: -1.1, CI: 1, CI50_2500: 2.3, Ctr: -5.9, LnW: 59.6, LnWPlusCI: 60.6, Rw: 54.8 },
      { C: -2.1, CI: 0.8, CI50_2500: 3.5, Ctr: -8.5, LnW: 65.9, LnWPlusCI: 66.7, Rw: 46.8 },
      { C: -1.7, CI: 1, CI50_2500: 4, Ctr: -7.9, LnW: 59.6, LnWPlusCI: 60.6, Rw: 46.7 },
      { C: null, CI: null, CI50_2500: null, Ctr: null, LnW: null, LnWPlusCI: null, Rw: null }
    ]);
    expect(contract.candidateFormulaRows[0]?.runtimeValues).toEqual({
      C: null,
      CI: null,
      CI50_2500: null,
      Ctr: null,
      LnW: null,
      LnWPlusCI: null,
      Rw: null
    });
    expect(contract.candidateFormulaRows.map((row) => row.referenceBasis)).toEqual([
      "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor",
      "source_absent_timber_joist_bare_carrier_reference_placeholder",
      OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      OPEN_WEB_RAW_BARE_FORMULA_BASIS
    ]);
  });

  it("blocks missing owners, wrong families, package evidence, exact rows, hostile topology, and basis aliases", () => {
    const missing = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      ceilingCavityDepthMm: undefined,
      lowerCeilingBoardSurfaceMassKgM2: undefined,
      suspensionSupportClass: undefined
    });
    const wrongFamily = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      baseStructureMaterialId: "open_box_timber_slab",
      supportFamily: "lightweight_steel_open_web",
      supportForm: "open_box"
    });
    const packagePresent = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      upperPackageState: "present"
    });
    const exact = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      exactSourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
    });
    const hostile = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      roleTopologyState: "ambiguous_duplicate_or_overlap"
    });
    const missingBasis = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      sourceOrPhysicsBasis: "missing"
    });
    const outOfRange = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      resilientDynamicStiffnessMNPerM3: 450
    });
    const aliases = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
      ...OPEN_WEB_HELPER_FORMULA_INPUT,
      requestedBasis: "building_prediction",
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual([
      "lowerCeilingBoardSurfaceMassKgM2",
      "ceilingCavityDepthMm",
      "suspensionSupportClass"
    ]);
    expect(wrongFamily.corridorStatus).toBe("blocked_wrong_support_family");
    expect(packagePresent.corridorStatus).toBe("blocked_upper_package_present");
    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_or_package_precedence",
      exactSourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
    });
    expect(hostile.corridorStatus).toBe("blocked_hostile_topology");
    expect(missingBasis.corridorStatus).toBe("blocked_missing_source_or_physics_basis");
    expect(outOfRange.corridorStatus).toBe("blocked_nonfinite_geometry");
    expect(aliases.corridorStatus).toBe("blocked_basis_alias");
    expect(aliases.affectedFormulaOutputs).toEqual([]);
    expect(aliases.blockedFormulaOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);
  });

  it("keeps the formula-gate no-runtime record while the later runtime corridor owns current helper-only values", () => {
    const timber = calculateAssembly(HELPER_ONLY_TIMBER, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const openWeb = calculateAssembly(HELPER_ONLY_OPEN_WEB, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const exact = calculateFieldCase(EXACT_FL23_OPEN_WEB);
    const directFixed = calculateFieldCase(DIRECT_FIXED_PACKAGE);
    const supportedBand = calculateFieldCase(SUPPORTED_BAND_PACKAGE);
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

    expect(timber.floorSystemRatings).toMatchObject({
      C: -1.1,
      Ctr: -5.9,
      Rw: 54.8,
      basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS
    });
    expect(timber.impact).toMatchObject({
      CI: 1,
      CI50_2500: 2.3,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS
    });
    expect(timber.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(timber.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);
    expect(openWeb.floorSystemRatings).toMatchObject({
      C: -1.7,
      Ctr: -7.9,
      Rw: 46.7,
      basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS
    });
    expect(openWeb.impact).toMatchObject({
      CI: 1,
      CI50_2500: 4,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS
    });
    expect(openWeb.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(openWeb.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]);

    expect(exact.floorSystemRatings).toMatchObject({ Rw: 51, basis: "official_floor_system_exact_match" });
    expect(exact.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(exact.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73, LnW: 71 });

    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.metrics).toMatchObject({ estimatedDnTwDb: 78, estimatedRwPrimeDb: 75 });
    expect(directFixed.impact).toMatchObject({ LPrimeNT50: 76.5, LPrimeNTw: 76.6, LPrimeNW: 79, LnW: 77 });

    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.metrics).toMatchObject({ estimatedDnTwDb: 48, estimatedRwPrimeDb: 45 });
    expect(supportedBand.impact).toMatchObject({ LPrimeNT50: 60, LPrimeNTw: 61.1, LPrimeNW: 63.5, LnW: 61.5 });

    expect(rawBareField.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact?.LPrimeNW).toBeUndefined();
    expect(building.supportedTargetOutputs).toEqual([]);
    expect(astm.supportedTargetOutputs).toEqual([]);
  });

  it("keeps docs, exports, and current-gate runner aligned with the helper-only formula corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS);
      expect(normalized, path).toContain("helper-only timber/open-web");
      expect(normalized, path).toContain("no-runtime");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("not a broad source crawl");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      "broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor"
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts"
    );
  });
});
