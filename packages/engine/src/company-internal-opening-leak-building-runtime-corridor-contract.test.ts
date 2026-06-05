import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakBuildingRuntimeCorridorContract,
  buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS
} from "./company-internal-opening-leak-building-adapter-owner-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_OPENING_LEAK_RUNTIME_FILES = [
  "packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts",
  "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.ts",
  "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak field/building runtime corridor", () => {
  it("lands the selected runtime corridor after the owner contract and selects surface parity next", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();

    expect(contract).toMatchObject({
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
      newNumericFieldBuildingRuntimeMovement: true,
      previousOwnerLandedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
      previousOwnerSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
      previousOwnerSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
      previousOwnerSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      tolerancePins: {
        building: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
        field: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
        labOpening: 6
      }
    });

    assertCompanyInternalOpeningLeakBuildingRuntimeCorridorContract(contract);

    for (const path of REQUIRED_OPENING_LEAK_RUNTIME_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate S lab opening/leak Rw/STC unchanged while field/building metrics stay separate", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();

    expect(contract.labRuntimeProbe).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      computedRwDb: 38.2,
      errorBudgetDb: 6,
      origin: "family_physics_prediction",
      supportedTargetOutputs: ["Rw", "STC"],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });
  });

  it("promotes explicit field opening/leak R'w / Dn,w / DnT,w from the area-energy adapter", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();

    expect(contract.fieldRuntimeProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTwDb: 36.9,
      computedDnWDb: 36.7,
      computedRwDb: 38.2,
      computedRwPrimeDb: 36.4,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      origin: "family_physics_prediction",
      requestedMetrics: [...COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS],
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"],
      unsupportedTargetOutputs: ["Dn,A"],
      warningMatched: true
    });
  });

  it("promotes explicit building opening/leak R'w / DnT,w without supporting A-weighted aliases", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();

    expect(contract.buildingRuntimeProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      computedDnTADb: null,
      computedDnTwDb: 32.1,
      computedDnWDb: null,
      computedRwDb: 38.2,
      computedRwPrimeDb: 31.6,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      origin: "family_physics_prediction",
      requestedMetrics: [...COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS],
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["DnT,A"],
      warningMatched: true
    });
  });

  it("keeps the legacy adapter boundary optional when explicit opening/leak route fields are present", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();

    expect(contract.boundaryAbsentProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      computedDnTwDb: 36.9,
      computedRwDb: 38.2,
      computedRwPrimeDb: 36.4,
      origin: "family_physics_prediction",
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: [],
      warningMatched: true
    });
  });

  it("keeps docs and the current-gate runner aligned with opening/leak runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("opening/leak");
      expect(content, path).toContain("R'w");
      expect(content, path).toContain("DnT,w");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-opening-leak-building-runtime-corridor-contract.test.ts"
    );
  });
});
