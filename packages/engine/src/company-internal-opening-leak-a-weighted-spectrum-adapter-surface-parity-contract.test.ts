import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakAWeightedSurfaceParityContract,
  buildCompanyInternalOpeningLeakAWeightedSurfaceParityContract,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACE_PARITY_FILES = [
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts",
  "apps/web/features/workbench/opening-leak-field-building-surface.ts",
  "apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-route-panel.tsx",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/workbench-store.ts",
  "apps/web/features/workbench/server-project-workbench-snapshot.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak A-weighted spectrum-adapter surface parity", () => {
  it("lands the selected surface parity gate after the runtime corridor", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedSurfaceParityContract();

    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE
    );
    expect(contract).toMatchObject({
      cardReportApiParityRequired: true,
      frequencyBandInputSurfaceRequired: true,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE,
      previousRuntimeLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
      previousRuntimeSelectedNextAction:
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      previousRuntimeSelectedNextFile:
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      previousRuntimeSelectionStatus:
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS,
      runtimeMovedAtSurfaceParity: false,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.visibleSurfaceTargets).toEqual([
      "output_cards",
      "route_posture",
      "scenario_summary",
      "corridor_dossier",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "markdown_report",
      "frequency_band_input_surface"
    ]);

    for (const path of REQUIRED_SURFACE_PARITY_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps A-weighted runtime values frozen while making the visible basis first-class", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedSurfaceParityContract();

    assertCompanyInternalOpeningLeakAWeightedSurfaceParityContract(contract);
    expect(contract.fieldSnapshot).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
      dnA: 35.9,
      dntA: 36.1,
      dntw: 36.9,
      dnw: 36.7,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      rwPrime: 36.4,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(contract.buildingSnapshot).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
      dnA: null,
      dntA: 31.3,
      dntw: 32.1,
      dnw: null,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      rwPrime: 31.6,
      supportedTargetOutputs: ["R'w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: ["Dn,A"]
    });
  });

  it("keeps docs and the current-gate runner aligned with surface parity closeout and Matrix V6 selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("field `Dn,A 35.9`");
      expect(content, path).toContain("field `DnT,A 36.1`");
      expect(content, path).toContain("building `DnT,A 31.3`");
      expect(content, path).toContain("frequency band set");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("company-internal-opening-leak-a-weighted-surface-parity.test.ts");
  });
});
