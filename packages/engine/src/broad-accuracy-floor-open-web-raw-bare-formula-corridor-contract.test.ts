import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-raw-bare-carrier-owner";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract,
  evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor
} from "./broad-accuracy-floor-open-web-raw-bare-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "R'w",
  "DnT,w",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_SAFE_SPLIT = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const OPEN_WEB_INEX_DECK_ONLY = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

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

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor.ts",
  "packages/engine/src/open-web-raw-bare-estimate.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-web raw-bare formula corridor contract", () => {
  it("lands the no-runtime formula corridor and selects the runtime corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract();

    expect(contract).toMatchObject({
      additionalSourceRowsRequiredForRuntimeSelection: false,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false
    });
    expect(contract.previousCarrierOwner).toEqual({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
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

  it("defines raw open-web formula terms, wide budgets, and runtime promotion criteria", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract();

    expect(contract.formulaTerms.map((term) => term.termId)).toEqual([
      "open_web_support_form_and_geometry",
      "airborne_direct_curve_open_web_mobility",
      "bare_impact_reference_curve_structural_mobility",
      "bare_reference_surface_and_package_exclusion",
      "exact_source_and_package_precedence",
      "iso717_metric_adapter_boundaries",
      "hostile_topology_and_safe_split_equivalence",
      "source_absent_budget_decomposition"
    ]);
    expect(contract.formulaTerms.every((term) => term.runtimeOwnedInGate === false)).toBe(true);
    expect(contract.toleranceBudgets.map((budget) => [budget.metricId, budget.totalBudgetDb])).toEqual([
      ["Rw", 9],
      ["C", 3],
      ["Ctr", 4.5],
      ["Ln,w", 12],
      ["CI", 4],
      ["CI,50-2500", 5],
      ["Ln,w+CI", 12.5]
    ]);
    expect(contract.toleranceBudgets.flatMap((budget) => budget.terms).every(
      (term) => term.basis === "source_absent_raw_bare_open_web_formula_design_budget"
    )).toBe(true);
    expect(contract.runtimePromotionEntryCriteria).toEqual([
      "public_runtime_must_use_open_web_raw_bare_formula_basis_not_screening_or_package_basis",
      "raw_bare_runtime_must_require_explicit_bare_reference_surface_and_no_inex_firestop_package",
      "carrier_geometry_depth_spacing_mass_void_ratio_and_loss_factor_must_be_finite",
      "exact_source_and_ubiq_package_rows_must_precede_source_absent_raw_bare_formula",
      "formula_surface_must_show_not_measured_budgets_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ]);
  });

  it("computes source-absent design payloads for complete raw open-web candidates", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareFormulaCorridorContract();

    expect(contract.candidateFormulaRows.map((row) => row.corridorStatus)).toEqual([
      "formula_corridor_defined_runtime_gate_required",
      "formula_corridor_defined_runtime_gate_required",
      "blocked_basis_alias"
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.basisId)).toEqual([
      BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS
    ]);
    expect(contract.candidateFormulaRows.map((row) => row.designMetrics)).toEqual([
      { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32 },
      { C: -2, CI: 1.3, CI50_2500: 4.6, Ctr: -7.5, LnW: 92.8, LnWPlusCI: 94.1, Rw: 36.6 },
      { C: -2.2, CI: 1.8, CI50_2500: 5.2, Ctr: -7.8, LnW: 96, LnWPlusCI: 97.8, Rw: 32 }
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

  it("blocks missing owners, wrong families, package evidence, exact rows, hostile topology, and basis aliases", () => {
    const complete = {
      bareCarrierSurfaceMassKgM2: 28,
      bareReferenceSurfaceState: "explicit_bare_steel_walking_surface" as const,
      carrierDepthMm: 300,
      carrierGaugeOrMassKgM2: 14,
      carrierSpacingMm: 600,
      chordWidthMm: 50,
      lowerTreatmentState: "explicit_none" as const,
      lossFactor: 0.015,
      openWebVoidRatio: 0.72,
      packageEvidenceState: "no_package" as const,
      roleTopologyState: "source_equivalent" as const,
      sourceOrPhysicsBasis: "source_absent_physics_model" as const,
      supportFamily: "lightweight_steel" as const,
      supportForm: "open_web_or_rolled" as const,
      supportMaterial: "open_web_steel_floor" as const,
      targetOutputs: TARGET_OUTPUTS,
      webDepthMm: 240
    };

    const missing = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      bareCarrierSurfaceMassKgM2: undefined,
      lossFactor: undefined
    });
    const wrongFamily = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      supportFamily: "open_box_timber",
      supportForm: "other_floor_carrier",
      supportMaterial: "other_floor_material"
    });
    const packageEvidence = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      packageEvidenceState: "ubiq_inex_firestop_package"
    });
    const exact = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      exactSourceId: "ubiq_fl26_open_web_steel_300_exact_lab_2026"
    });
    const partialReferenceSurface = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      bareReferenceSurfaceState: "inex_or_finish_package_present"
    });
    const hostile = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      roleTopologyState: "ambiguous_duplicate_or_overlap"
    });
    const missingBasis = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      sourceOrPhysicsBasis: "missing"
    });
    const outOfRange = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      openWebVoidRatio: 0.99
    });
    const aliases = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
      ...complete,
      requestedBasis: "field",
      targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
    });

    expect(missing.corridorStatus).toBe("blocked_missing_owner_fields");
    expect(missing.missingOwnerFields).toEqual(["bareCarrierSurfaceMassKgM2", "lossFactor"]);
    expect(wrongFamily.corridorStatus).toBe("blocked_wrong_support_family");
    expect(packageEvidence.corridorStatus).toBe("blocked_package_evidence");
    expect(packageEvidence.packageEvidenceForbidden).toEqual([
      "ubiq_inex_firestop_package",
      "partial_lower_package",
      "partial_upper_package"
    ]);
    expect(exact).toMatchObject({
      corridorStatus: "blocked_exact_source_precedence",
      exactSourceId: "ubiq_fl26_open_web_steel_300_exact_lab_2026"
    });
    expect(partialReferenceSurface.corridorStatus).toBe("blocked_partial_or_ambiguous_reference_surface");
    expect(hostile.corridorStatus).toBe("blocked_hostile_topology");
    expect(missingBasis.corridorStatus).toBe("blocked_missing_source_or_physics_basis");
    expect(outOfRange.corridorStatus).toBe("blocked_nonfinite_geometry");
    expect(aliases.corridorStatus).toBe("blocked_basis_alias");
    expect(aliases.affectedFormulaOutputs).toEqual([]);
    expect(aliases.blockedFormulaOutputs).toEqual(["R'w", "DnT,w", "L'n,w", "IIC"]);
  });

  it("keeps the formula gate no-runtime record while the later runtime corridor owns public raw open-web values", () => {
    const raw = calculateAssembly(RAW_OPEN_WEB_300, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const split = calculateAssembly(RAW_OPEN_WEB_SAFE_SPLIT, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });
    const deckOnly = calculateAssembly(OPEN_WEB_INEX_DECK_ONLY, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

    for (const result of [raw, split]) {
      expect(result.floorSystemMatch).toBeNull();
      expect(result.floorSystemEstimate?.kind).toBe("family_archetype");
      expect(result.floorSystemEstimate?.structuralFamily).toBe("open-web steel raw-bare");
      expect(result.impact).toMatchObject({
        CI: 1.8,
        CI50_2500: 5.2,
        LnW: 96,
        LnWPlusCI: 97.8,
        basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
        labOrField: "lab"
      });
      expect(result.floorSystemRatings).toMatchObject({
        C: -2.2,
        Ctr: -7.8,
        Rw: 32,
        basis: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS
      });
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
      expect(result.unsupportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "R'w", "DnT,w", "L'n,w", "IIC"]);
    }

    expect(deckOnly.floorSystemMatch).toBeNull();
    expect(deckOnly.floorSystemEstimate?.impact.basis).not.toBe(
      BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS
    );
    expect(deckOnly.impact?.basis).not.toBe(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS);
    expect(deckOnly.floorSystemRatings).toMatchObject({
      Rw: 79,
      basis: "screening_mass_law_curve_seed_v3"
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the raw open-web formula corridor", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain("Rw 32");
      expect(content, path).toContain("Ln,w 96");
      expect(content, path).toContain("+/-12 dB");
      expect(content, path).toContain("+/-9 dB");
      expect(normalized, path).toContain("open-web raw-bare");
      expect(normalized, path).toContain("source-absent");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      "broad-accuracy-floor-open-web-raw-bare-formula-corridor"
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts"
    );
  });
});
