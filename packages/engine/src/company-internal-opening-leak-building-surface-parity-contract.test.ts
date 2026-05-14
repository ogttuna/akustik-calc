import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakBuildingSurfaceParityContract,
  buildCompanyInternalOpeningLeakBuildingSurfaceParityContract,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-opening-leak-building-surface-parity-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACE_PARITY_FILES = [
  "packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.ts",
  "packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts",
  "apps/web/features/workbench/opening-leak-field-building-surface.ts",
  "apps/web/features/workbench/company-internal-opening-leak-building-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/dynamic-calc-branch.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/field-airborne-provenance.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/target-output-status.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak field/building surface parity", () => {
  it("lands no-runtime surface parity after the selected opening/leak field/building runtime", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingSurfaceParityContract();

    expect(contract).toMatchObject({
      apiSurfaceParityRequired: true,
      cardReportSurfaceParityRequired: true,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE,
      previousRuntimeLandedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
      previousRuntimeSelectedNextAction:
        COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      previousRuntimeSelectedNextFile:
        COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      previousRuntimeSelectionStatus:
        COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
      runtimeMovedAtSurfaceParity: false,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS
    });

    expect(contract.visibleSurfaceTargets).toEqual([
      "output_cards",
      "route_posture",
      "scenario_summary",
      "corridor_dossier",
      "method_dossier",
      "local_saved_replay",
      "calculator_api_payload",
      "markdown_report"
    ]);

    for (const path of REQUIRED_SURFACE_PARITY_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps field and building runtime values frozen while naming the visible basis", () => {
    const contract = buildCompanyInternalOpeningLeakBuildingSurfaceParityContract();

    assertCompanyInternalOpeningLeakBuildingSurfaceParityContract(contract);
    expect(contract.fieldSnapshot).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
      dntw: 36.9,
      dnw: 36.7,
      errorBudgetDb: 8,
      rw: 38.2,
      rwPrime: 36.4,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "STC", "Dn,A", "DnT,A"]
    });
    expect(contract.buildingSnapshot).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
      dntw: 32.1,
      dnw: null,
      errorBudgetDb: 10,
      rw: 38.2,
      rwPrime: 31.6,
      supportedTargetOutputs: ["R'w", "DnT,w"]
    });
  });

  it("keeps docs and the current-gate runner aligned with surface parity closeout and input-surface selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("R'w 36.4");
      expect(content, path).toContain("DnT,w 32.1");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("company-internal-opening-leak-building-surface-parity-contract.test.ts");
    expect(runner).toContain("company-internal-opening-leak-building-surface-parity.test.ts");
  });
});
