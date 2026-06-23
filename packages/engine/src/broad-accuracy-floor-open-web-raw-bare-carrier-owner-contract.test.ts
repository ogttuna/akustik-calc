import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract
} from "./broad-accuracy-floor-open-web-raw-bare-carrier-owner";
import {
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh";
import { calculateAssembly } from "./calculate-assembly";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
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

const OPEN_WEB_LOWER_ONLY_PACKAGED_SYSTEM = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
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
  "packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh.ts",
  "packages/engine/src/steel-floor-impact-physics-input-contract.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculatorPosture(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { calculator: "dynamic", targetOutputs: TARGET_OUTPUTS });

  return {
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impact: result.impact
      ? {
          CI: result.impact.CI ?? null,
          LnW: result.impact.LnW ?? null,
          LnWPlusCI: result.impact.LnWPlusCI ?? null,
          basis: result.impact.basis
        }
      : null,
    ratings: result.floorSystemRatings
      ? {
          Rw: result.floorSystemRatings.Rw,
          basis: result.floorSystemRatings.basis
        }
      : null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("broad accuracy floor open-web raw-bare carrier owner contract", () => {
  it("lands a no-runtime raw-bare open-web owner and selects the formula corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract();

    expect(contract).toMatchObject({
      exactRowsStayFirst: true,
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      runtimePromotionAllowedInGate: false,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
    });
    expect(contract.previousMatrixRefresh).toEqual({
      landedGate: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS
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

  it("classifies current UBIQ open-web evidence as packaged, not raw bare carrier evidence", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract();

    expect(contract.evidenceInventory).toEqual({
      allRowsHaveCeilingOrDeckPackage: true,
      boundRows: 21,
      carrierOnlyRows: 0,
      deckMaterial: "inex_floor_panel",
      exactRows: 90,
      familyIds: ["fl23", "fl24", "fl25", "fl26", "fl27", "fl28", "fl33"],
      lowerTreatmentCounts: {
        directFixedCeiling: 54,
        packagedNoLowerTreatmentOwner: 21,
        suspendedCeilingElasticHanger: 36
      },
      sourceLabel: "UBIQ official system table PDF",
      supportDepthsMm: [200, 300, 400],
      supportMaterial: "open_web_steel_floor",
      totalRows: 111
    });
  });

  it("owns the physical terms needed before any raw-bare open-web formula can promote", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract();

    expect(contract.ownerTerms.map((term) => term.id)).toEqual([
      "open_web_support_form_owner",
      "carrier_geometry_owner",
      "bare_reference_surface_owner",
      "bare_impact_curve_owner",
      "airborne_screening_replacement_owner",
      "package_evidence_exclusion_owner",
      "direct_fixed_negative_boundary_owner",
      "suspended_ceiling_negative_boundary_owner",
      "exact_source_precedence_owner",
      "source_absent_budget_owner",
      "basis_boundary_owner",
      "hostile_topology_owner"
    ]);
    expect(contract.ownerTerms.find((term) => term.id === "open_web_support_form_owner")).toMatchObject({
      requiredPhysicalFields: [
        "supportFamily=lightweight_steel",
        "supportForm=open_web_or_rolled",
        "supportMaterial=open_web_steel_floor",
        "carrierDepthMm",
        "carrierSpacingMm",
        "carrierGaugeOrMassKgM2"
      ],
      status: "owned_for_formula_corridor"
    });
    expect(contract.ownerTerms.find((term) => term.id === "bare_reference_surface_owner")).toMatchObject({
      requiredPhysicalFields: [
        "deckAbsenceOrExplicitBareWalkingSurface",
        "inexDeckAbsence=true",
        "floorCoveringAbsence=true",
        "floatingScreedAbsence=true",
        "ceilingBoardAbsence=true"
      ],
      status: "owned_for_formula_corridor"
    });
    expect(contract.ownerTerms.find((term) => term.id === "source_absent_budget_owner")).toMatchObject({
      requiredPhysicalFields: [
        "RwToleranceBudgetOwner",
        "LnWToleranceBudgetOwner",
        "CIBudgetOwner",
        "LnWPlusCIBudgetOwner",
        "inputPrecisionBudgetOwner",
        "packageExclusionUncertaintyOwner"
      ],
      status: "runtime_blocked_until_formula_corridor"
    });
    expect(contract.negativeBoundaries).toEqual([
      "open_web_raw_bare_owner_contract_does_not_promote_runtime_values",
      "raw_open_web_impact_outputs_remain_unsupported_until_bare_impact_curve_owner_lands",
      "raw_open_web_airborne_remains_screening_until_direct_curve_owner_lands",
      "ubiq_inex_deck_and_firestop_rows_are_package_evidence_not_bare_carrier_evidence",
      "direct_fixed_and_suspended_ceiling_rows_stay_separate_package_lanes",
      "lower_only_partial_open_web_package_inputs_remain_fail_closed",
      "open_box_timber_package_transfer_raw_bare_and_eps_screed_values_remain_frozen",
      "field_building_and_astm_iic_aliases_remain_unpromoted",
      "raw_open_web_screening_postures_remain_blocked_until_geometry_owner_lands"
    ]);
  });

  it("keeps the carrier-owner record no-runtime while the later runtime corridor owns raw open-web values", () => {
    const contract = buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract();

    expect(contract.rawBareProbePosture.map((probe) => [probe.id, probe.expectedCurrentRw, probe.expectedImpactAdmission])).toEqual([
      ["raw_open_web_300", 79, "blocked_raw_bare"],
      ["raw_open_web_safe_split_150_150", 79, "blocked_raw_bare"],
      ["open_web_inex_deck_only", 79, "blocked_raw_bare"],
      ["open_web_lower_only_packaged_system", 34, "blocked_partial_package"]
    ]);

    expect(calculatorPosture(RAW_OPEN_WEB_300)).toMatchObject({
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      impact: { CI: 1.8, LnW: 96, LnWPlusCI: 97.8, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS },
      ratings: { Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS },
      supported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupported: ["Rw", "R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]
    });
    expect(calculatorPosture(RAW_OPEN_WEB_SAFE_SPLIT)).toMatchObject({
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      impact: { CI: 1.8, LnW: 96, LnWPlusCI: 97.8, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS },
      ratings: { Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS },
      supported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupported: ["Rw", "R'w", "DnT,w", "L'n,w", "L'nT,w", "IIC", "AIIC"]
    });

    expect(calculatorPosture(OPEN_WEB_INEX_DECK_ONLY)).toMatchObject({
      estimateKind: null,
      floorSystemMatchId: null,
      impact: null,
      ratings: { Rw: 79, basis: "screening_mass_law_curve_seed_v3" },
      supported: [],
      unsupported: ["Rw", "R'w", "DnT,w", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "IIC", "AIIC"]
    });

    expect(calculatorPosture(OPEN_WEB_LOWER_ONLY_PACKAGED_SYSTEM)).toMatchObject({
      estimateKind: null,
      floorSystemMatchId: null,
      impact: null,
      ratings: {
        Rw: 34,
        basis: "screening_mass_law_curve_seed_v3"
      },
      supported: [],
      unsupported: ["Rw", "R'w", "DnT,w", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "IIC", "AIIC"]
    });
  });

  it("keeps docs, exports, and current-gate list aligned to the landed owner gate", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain("no-runtime");
      expect(normalized, path).toContain("open-web raw-bare");
      expect(normalized, path).toContain("111");
      expect(normalized, path).toContain("carrier-only");
      expect(normalized, path).toContain("inex");
      expect(normalized, path).toContain("firestop");
      expect(normalized, path).toContain("rw 72");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./broad-accuracy-floor-open-web-raw-bare-carrier-owner";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts"
    );
  });
});
