import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateBGRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bg";
import {
  buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract,
  buildHeavyConcreteCombinedImpactPredictorInputFromSurface,
  GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
  GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
  GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
  HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS
} from "./heavy-concrete-combined-impact-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const;

const REQUIRED_GATE_BG_REVALIDATION_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts",
  "packages/engine/src/heavy-concrete-combined-impact-input-surface.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BG floor-impact source-absent post-input-surface revalidation", () => {
  it("lands Gate BG as no-runtime revalidation and selects the coverage matrix refresh next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBGRevalidationContract();

    expect(contract).toMatchObject({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousGateBF: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS
      },
      routeCardValueChange: false,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(contract.revalidatedRuntimeImpact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4,
      basis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS
    });

    for (const path of REQUIRED_GATE_BG_REVALIDATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps complete and safe-reordered input-surface cases on the same Gate BD runtime values and budgets", () => {
    const completeSurface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });
    const safeReorderedSurface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
      layers: [...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK].reverse(),
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });

    expect(completeSurface).toMatchObject({
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(safeReorderedSurface).toMatchObject({
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });

    const complete = calculateAssembly(GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK, {
      impactPredictorInput: completeSurface.impactPredictorInput,
      targetOutputs: LAB_OUTPUTS
    });
    const safeReordered = calculateAssembly([...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK].reverse(), {
      impactPredictorInput: safeReorderedSurface.impactPredictorInput,
      targetOutputs: LAB_OUTPUTS
    });

    for (const result of [complete, safeReordered]) {
      expect(result.impact).toMatchObject({
        DeltaLw: 30.1,
        LnW: 44.4,
        basis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
        metricBasis: {
          DeltaLw: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
          LnW: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS
        }
      });
      expect(result.impact?.errorBudgets).toEqual([
        expect.objectContaining({
          metricId: "Ln,w",
          notMeasuredEvidence: true,
          origin: "source_absent_formula_error_budget",
          toleranceDb: 6.5
        }),
        expect.objectContaining({
          metricId: "DeltaLw",
          notMeasuredEvidence: true,
          origin: "source_absent_formula_error_budget",
          toleranceDb: 5.5
        })
      ]);
      expect(result.dynamicImpactTrace?.selectedLabel).toBe(
        "Heavy concrete combined upper/lower formula corridor"
      );
    }
  });

  it("keeps missing-input, unsafe-topology, exact-source, and basis-boundary cases out of promoted runtime support", () => {
    const missingLoad = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: {
        ...GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
        loadBasisKgM2: undefined
      },
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateBase = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: [
        ...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
        {
          floorRole: "base_structure",
          materialId: "heavy_concrete",
          thicknessMm: 45
        }
      ],
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });
    const exactSource = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });
    const field = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: ["L'n,w"]
    });
    const astm = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: ["IIC"]
    });

    expect(missingLoad).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      runtimeFormulaImpact: null,
      status: "needs_input"
    });
    expect(duplicateBase).toMatchObject({
      missingPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS,
      runtimeFormulaImpact: null,
      status: "unsafe_topology"
    });
    expect(exactSource).toMatchObject({
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });
    expect(field).toMatchObject({
      missingPhysicalInputs: [],
      runtimeFormulaImpact: null,
      status: "inactive"
    });
    expect(astm).toMatchObject({
      missingPhysicalInputs: [],
      runtimeFormulaImpact: null,
      status: "inactive"
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BG closeout and Gate BH selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE);
      expect(content, path).toContain("floor-impact source-absent coverage matrix refresh");
      expect(content, path).toContain("Heavy concrete combined input surface");
      expect(content, path).toContain("Ln,w 44.4");
      expect(content, path).toContain("DeltaLw 30.1");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bg-floor-impact-source-absent-post-input-surface-revalidation-contract.test.ts"
    );
    expect(runner).toContain("heavy-concrete-combined-impact-input-surface-acceptance.test.ts");
  });
});
