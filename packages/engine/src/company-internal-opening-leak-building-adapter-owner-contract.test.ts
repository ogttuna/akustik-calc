import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakBuildingAdapterOwnerContract,
  buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS
} from "./company-internal-opening-leak-building-adapter-owner-contract";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_OPENING_LEAK_ADAPTER_SURFACES = [
  "packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.ts",
  "packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_V4_REFRESH_AFTER_LNT50_SURFACE_PARITY_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak field/building adapter owner contract", () => {
  it("lands the selected Matrix V4 opening/leak adapter owner contract and selects runtime corridor next", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract();

    expect(contract).toMatchObject({
      buildingPredictionRuntimePromoted: false,
      fieldAndBuildingOwnersSeparated: true,
      labOpeningRwAliasedToFieldOrBuilding: false,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousMatrixV4: {
        landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
        selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
        selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
        selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
        selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS
      },
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    assertCompanyInternalOpeningLeakBuildingAdapterOwnerContract(contract);

    for (const path of REQUIRED_COMPANY_INTERNAL_OPENING_LEAK_ADAPTER_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("separates field and building owner groups with precise physical inputs", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract();

    expect(contract.ownerGroups).toEqual([
      {
        adapterBasis: "field_apparent",
        id: "field_apparent_opening_leak_adapter_owners",
        requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS,
        requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS,
        targetOutputs: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
      },
      {
        adapterBasis: "building_prediction",
        id: "building_prediction_opening_leak_adapter_owners",
        requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS,
        requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS,
        targetOutputs: ["R'w", "DnT,w", "DnT,A"]
      }
    ]);
  });

  it("classifies complete, missing-input, missing-owner, lab, and ASTM boundary scenarios", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract();
    const byId = Object.fromEntries(contract.scenarioPack.map((row) => [row.id, row]));

    expect(byId.company_internal_opening_leak_field_complete_ready_for_runtime_corridor).toMatchObject({
      adapterBasis: "field_apparent",
      labOpeningRwAliasAllowed: false,
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["R'w", "DnT,w"],
      runtimePromotionAllowedAtGate: false,
      status: "ready_for_runtime_corridor",
      unsupportedOutputs: ["Rw", "STC"]
    });

    expect(byId.company_internal_opening_leak_field_runtime_owners_missing).toMatchObject({
      blockedOutputs: ["R'w", "DnT,w"],
      missingOwnerInputs: [
        "fieldOpeningLeakCompositeCurveOwner",
        "fieldFlankingPenaltyOwner",
        "fieldRoomNormalizationOwner",
        "openingLeakFieldUncertaintyBudgetOwner",
        "exactFieldOrBuildingOpeningPacketPrecedenceOwner"
      ],
      status: "runtime_owner_missing"
    });

    expect(byId.company_internal_opening_leak_field_missing_rt60_needs_input).toMatchObject({
      blockedOutputs: ["R'w", "DnT,w"],
      missingPhysicalInputs: ["receivingRoomRt60S"],
      status: "needs_input"
    });

    expect(byId.company_internal_opening_leak_building_complete_ready_for_runtime_corridor).toMatchObject({
      adapterBasis: "building_prediction",
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["R'w", "DnT,w"],
      runtimePromotionAllowedAtGate: false,
      status: "ready_for_runtime_corridor"
    });

    expect(byId.company_internal_opening_leak_building_missing_flanking_class_needs_input).toMatchObject({
      blockedOutputs: ["R'w", "DnT,w"],
      missingPhysicalInputs: ["flankingJunctionClass"],
      status: "needs_input"
    });

    expect(byId.company_internal_opening_leak_lab_rw_stc_stays_out_of_field_building_adapter).toMatchObject({
      adapterBasis: "element_lab",
      status: "unsupported_basis",
      unsupportedOutputs: ["Rw", "STC"]
    });
    expect(byId.company_internal_opening_leak_astm_iic_aiic_not_airborne_adapter).toMatchObject({
      adapterBasis: "astm_rating_boundary",
      status: "unsupported_basis",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("keeps current runtime blocked for field/building opening requests while preserving lab Rw/STC", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract();

    expect(contract.currentRuntimeProbes.labOpeningProbe).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      computedRwDb: 38.2,
      computedStc: 39,
      errorBudgetDb: 6,
      origin: "family_physics_prediction",
      requestedMetrics: ["Rw", "STC", "R'w", "DnT,w"],
      supportedTargetOutputs: ["Rw", "STC"],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });

    expect(contract.currentRuntimeProbes.fieldOpeningProbe).toMatchObject({
      basisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      computedDnTwDb: 59,
      computedRwPrimeDb: 58,
      openingAliasWarningPresent: true,
      origin: "family_physics_prediction",
      requestedMetrics: ["R'w", "DnT,w"],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });

    expect(contract.currentRuntimeProbes.buildingOpeningProbe).toMatchObject({
      basisId: "dynamic_calculator_building_prediction_runtime_adapter_owner_missing",
      computedDnTwDb: null,
      computedRwPrimeDb: null,
      openingAliasWarningPresent: true,
      origin: "unsupported",
      requestedMetrics: ["R'w", "DnT,w"],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });
  });

  it("keeps docs and current-gate runner aligned with the landed owner contract and next runtime corridor", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE);
      expect(content, path).toContain("opening/leak");
      expect(content, path).toContain("R'w");
      expect(content, path).toContain("DnT,w");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-opening-leak-building-adapter-owner-contract.test.ts"
    );
  });
});
