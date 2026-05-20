import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract,
  evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor
} from "./broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const RAW_BARE_OPEN_BOX_LAYERS = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const R5B_EXACT_PACKAGE_LAYERS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-box timber raw-bare formula corridor contract", () => {
  it("lands the no-runtime raw-bare formula corridor and selects runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      forbiddenBorrowedPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false
    });
    expect(contract.previousCarrierOwner).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
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

  it("defines raw-bare formula terms, wide budgets, and runtime promotion criteria", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "airborne_direct_curve_surface_mass_depth",
      "bare_impact_reference_curve_surface_mass_mobility",
      "finish_absence_and_lower_treatment_state",
      "exact_source_and_package_transfer_exclusion",
      "iso717_metric_adapter_boundaries",
      "hostile_topology_and_safe_split_equivalence",
      "source_absent_budget_decomposition"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 8],
      ["C", 2.5],
      ["Ctr", 3.5],
      ["Ln,w", 10],
      ["CI", 3],
      ["CI,50-2500", 4],
      ["Ln,w+CI", 10.5]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_raw_bare_open_box_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_raw_bare_open_box_formula_basis_not_finished_tuas_package_transfer_basis",
      "public_runtime_must_require_surface_mass_depth_void_fraction_rib_spacing_and_loss_factor",
      "public_runtime_must_keep_exact_source_rows_ahead_of_raw_bare_source_absent_formula_rows",
      "public_runtime_must_keep_partial_upper_or_lower_packages_out_of_raw_bare_formula_promotion",
      "formula_surface_must_show_not_measured_error_budget_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);
  });

  it("computes source-absent design payloads for complete raw-bare open-box candidates", () => {
    const contract = buildBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { C: -1.4, CI: -1.1, CI50_2500: 3.1, Ctr: -5.8, LnW: 88.2, LnWPlusCI: 87.1, Rw: 42.3 },
      { C: -1.6, CI: -0.9, CI50_2500: 3.4, Ctr: -6.2, LnW: 91.1, LnWPlusCI: 90.2, Rw: 38.1 },
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
  });

  it("blocks missing owners, wrong families, hostile topology, exact rows, package routes, and basis aliases", () => {
    const complete = {
      carrierDepthMm: 370,
      finishAbsenceState: "explicit_none" as const,
      lossFactor: 0.04,
      lowerTreatmentState: "explicit_bare_underside" as const,
      packageTransferState: "no_complete_package" as const,
      panelPlateSchedule: "ribbed_box_plates" as const,
      ribOrWebSpacingMm: 600,
      roleTopologyState: "source_equivalent" as const,
      sourceOrPhysicsBasis: "source_absent_physics_model" as const,
      supportFamily: "open_box_timber" as const,
      supportForm: "open_box_timber_slab" as const,
      surfaceMassKgM2: 96,
      targetOutputs: TARGET_OUTPUTS,
      voidFraction: 0.4
    };

    const missing = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      lossFactor: undefined,
      surfaceMassKgM2: undefined
    });
    const wrongFamily = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      supportFamily: "open_web_steel",
      supportForm: "open_web_steel_floor"
    });
    const hostile = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      roleTopologyState: "ambiguous_duplicate_or_overlap"
    });
    const exact = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      exactSourceId: "tuas_r5b_open_box_timber_measured_2026"
    });
    const packageTransfer = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      packageTransferState: "complete_package_transfer_candidate"
    });
    const partialTreatment = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      finishAbsenceState: "partial_upper_package"
    });
    const missingBasis = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      sourceOrPhysicsBasis: "missing"
    });
    const aliases = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
      ...complete,
      requestedBasis: "field",
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual(["surfaceMassKgM2", "lossFactor"]);
    expect(wrongFamily.corridorStatus).toBe("blocked_wrong_support_family");
    expect(hostile.corridorStatus).toBe("blocked_hostile_topology");
    expect(exact.corridorStatus).toBe("blocked_exact_source_precedence");
    expect(packageTransfer.corridorStatus).toBe("blocked_package_transfer_route");
    expect(partialTreatment.corridorStatus).toBe("blocked_partial_or_ambiguous_treatment");
    expect(missingBasis.corridorStatus).toBe("blocked_missing_source_or_physics_basis");
    expect(aliases.corridorStatus).toBe("blocked_basis_alias");
    expect(aliases.affectedFormulaOutputs).toEqual([]);
    expect(aliases.blockedFormulaOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);
    expect(packageTransfer.packageTransferBasisForbidden).toBe(OPEN_BOX_TIMBER_SIMILARITY_BASIS);
  });

  it("keeps the formula-gate no-runtime record while the later runtime corridor owns current raw-bare values", () => {
    const rawBare = calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, { targetOutputs: TARGET_OUTPUTS });
    const exact = calculateAssembly(R5B_EXACT_PACKAGE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(rawBare.floorSystemMatch).toBeNull();
    expect(rawBare.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(rawBare.impact).toMatchObject({
      CI: -1.1,
      CI50_2500: 3.1,
      LnW: 88.2,
      LnWPlusCI: 87.1,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(rawBare.floorSystemRatings).toMatchObject({
      C: -1.4,
      Ctr: -5.8,
      Rw: 42.3,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
    });
    expect(rawBare.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(rawBare.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);

    expect(exact.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(exact.impact).toMatchObject({
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44,
      basis: "open_measured_floor_system_exact_match",
      labOrField: "lab"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 75,
      basis: "open_measured_floor_system_exact_match"
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the raw-bare formula corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain("Ln,w 50.8");
      expect(content, path).toContain("Rw 66");
      expect(content, path).toContain("+/-10 dB");
      expect(content, path).toContain("+/-8 dB");
      expect(normalizedContent, path).toContain("raw-bare");
      expect(normalizedContent, path).toContain("source-absent");
      expect(normalizedContent, path).toContain("runtime corridor");
      expect(normalizedContent, path).toContain("field/building");
      expect(normalizedContent, path).toContain("astm/iic");
    }

    const indexContent = readRepoFile("packages/engine/src/index.ts");
    const gateRunnerContent = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(indexContent).toContain("broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor");
    expect(gateRunnerContent).toContain("src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts");
  });
});
