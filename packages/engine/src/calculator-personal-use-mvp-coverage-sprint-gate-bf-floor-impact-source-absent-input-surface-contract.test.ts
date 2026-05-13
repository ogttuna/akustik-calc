import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-be";
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

const REQUIRED_GATE_BF_SURFACES = [
  "packages/engine/src/heavy-concrete-combined-impact-input-surface.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts",
  "apps/web/features/workbench/scenario-analysis.ts",
  "apps/web/features/workbench/workbench-store.ts",
  "apps/web/features/workbench/simple-workbench-route-panel.tsx",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/server-project-workbench-snapshot.ts",
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
  "docs/calculator/CHECKPOINT_2026-05-13_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate BF floor-impact source-absent input surface", () => {
  it("lands Gate BF and wires complete heavy-concrete inputs to the Gate BD runtime corridor without retuning", () => {
    const contract = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });

    expect(contract).toMatchObject({
      formulaBasis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
      previousGateBE: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS
      },
      requiredPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS,
      runtimeFormulaImpact: {
        DeltaLw: 30.1,
        LnW: 44.4,
        basis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS
      },
      runtimeValueMovement: false,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      status: "ready_for_formula_corridor"
    });
    expect(contract.surfaceResult).toMatchObject({
      formulaTargetOutputRequested: true,
      heavyConcreteStackDetected: true,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(contract.runtimeFormulaImpact?.errorBudgets).toEqual([
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

    for (const path of REQUIRED_GATE_BF_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("feeds the same UI-derived predictor through the public dynamic calculator surface", () => {
    const surface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });

    expect(surface.status).toBe("ready_for_formula_corridor");
    expect(surface.impactPredictorInput).toMatchObject({
      baseSlab: {
        densityKgM3: 2400,
        materialClass: "heavy_concrete",
        thicknessMm: 150
      },
      impactSystemType: "combined_upper_lower_system",
      loadBasisKgM2: 100,
      lowerTreatment: {
        boardLayerCount: 2,
        boardMaterialClass: "gypsum_board",
        boardThicknessMm: 12.5,
        cavityDepthMm: 120,
        cavityFillThicknessMm: 80,
        supportClass: "furred_channels",
        type: "suspended_ceiling_elastic_hanger"
      },
      resilientLayer: {
        dynamicStiffnessMNm3: 30,
        thicknessMm: 8
      },
      structuralSupportType: "reinforced_concrete"
    });

    const result = calculateAssembly(GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4,
      basis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
      availableOutputs: ["Ln,w", "DeltaLw"],
      metricBasis: {
        DeltaLw: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
        LnW: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS
      }
    });
    expect(result.dynamicImpactTrace?.selectedLabel).toBe("Heavy concrete combined upper/lower formula corridor");
  });

  it("keeps partial or hostile surface inputs parked with precise physical-field blockers", () => {
    const missingDynamic = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: {
        ...GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
        resilientLayerDynamicStiffnessMNm3: undefined
      },
      targetOutputs: LAB_OUTPUTS
    });
    const missingLower = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: {
        ...GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
        lowerAssemblyType: undefined
      },
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateBase = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: [
        ...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
        {
          floorRole: "base_structure",
          materialId: "concrete",
          thicknessMm: 50
        }
      ],
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });

    expect(missingDynamic).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      runtimeFormulaImpact: null,
      status: "needs_input"
    });
    expect(missingLower).toMatchObject({
      missingPhysicalInputs: ["ceilingOrLowerAssembly"],
      runtimeFormulaImpact: null,
      status: "needs_input"
    });
    expect(duplicateBase).toMatchObject({
      missingPhysicalInputs: HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS,
      runtimeFormulaImpact: null,
      status: "unsafe_topology"
    });
  });

  it("keeps exact-source precedence and lab/field/building basis boundaries outside the new surface", () => {
    const exactSource = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldRequest = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: ["L'n,w"]
    });
    const buildingRequest = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: ["R'w", "DnT,w"]
    });
    const astmRequest = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      targetOutputs: ["IIC"]
    });

    expect(exactSource).toMatchObject({
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });
    expect(fieldRequest).toMatchObject({
      missingPhysicalInputs: [],
      runtimeFormulaImpact: null,
      status: "inactive"
    });
    expect(buildingRequest).toMatchObject({
      missingPhysicalInputs: [],
      runtimeFormulaImpact: null,
      status: "inactive"
    });
    expect(astmRequest).toMatchObject({
      missingPhysicalInputs: [],
      runtimeFormulaImpact: null,
      status: "inactive"
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BF closeout and Gate BG selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Heavy concrete combined input surface");
      expect(content, path).toContain("Ln,w 44.4");
      expect(content, path).toContain("DeltaLw 30.1");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts"
    );
  });
});
