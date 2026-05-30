import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildHeavyConcreteCombinedImpactPredictorInputFromSurface
} from "./heavy-concrete-combined-impact-input-surface";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS,
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC
} from "./post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BC_SURFACES = [
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts",
  "apps/web/features/workbench/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc.test.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "apps/web/features/workbench/heavy-concrete-combined-impact-input-surface.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "packages/shared/src/api/impact-only.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/heavy-concrete-combined-impact-input-surface.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor suspended-ceiling lower-treatment surface parity Gate BC", () => {
  it("lands Gate BC after Gate BB and selects coverage refresh Gate BD", () => {
    const summary = summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC();

    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE,
      previousGateBB: {
        landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS
      },
      runtimeMovedAtGateBC: false,
      selectedNextAction:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS
    });
    expect(summary.surfaceSnapshots.map((snapshot) => snapshot.id)).toEqual([
      "workbench_cards",
      "markdown_report",
      "saved_replay",
      "estimate_api_payload",
      "impact_only_api_payload",
      "resolver_trace"
    ]);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.lnWDb === 45.6)).toBe(true);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.deltaLwDb === 28.9)).toBe(true);

    for (const path of REQUIRED_GATE_BC_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps estimate and impact-only layer-derived routes on the same visible lower-treatment answer", () => {
    const estimate = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const impactOnly = calculateImpactOnly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    for (const result of [estimate, impactOnly]) {
      expect(result.impact).toMatchObject({
        basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        DeltaLw: 28.9,
        LnW: 45.6,
        labOrField: "lab"
      });
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
    }
    expect(impactOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: [
        {
          metric: "Ln,w",
          value: 45.6
        },
        {
          metric: "DeltaLw",
          value: 28.9
        }
      ]
    });
  });

  it("treats visible acoustic hanger and resilient stud products as owned lower supports without requiring duplicate support-class fields", () => {
    const acousticHangerSurface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
      layers: POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
      surface: {
        loadBasisKgM2: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const resilientStudSurface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
      layers: POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS,
      surface: {
        loadBasisKgM2: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.loadBasisKgM2,
        resilientLayerDynamicStiffnessMNm3:
          POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(acousticHangerSurface).toMatchObject({
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(acousticHangerSurface.impactPredictorInput?.lowerTreatment).toMatchObject({
      supportProductId: "acoustic_hanger_ceiling"
    });
    expect(resilientStudSurface).toMatchObject({
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(resilientStudSurface.impactPredictorInput?.lowerTreatment).toMatchObject({
      supportProductId: "resilient_stud_ceiling"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BC closeout and Gate BD selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_SURFACE_PARITY_GATE_BC_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain("impact-only API");
      expect(contents, path).toContain("Ln,w 45.6");
      expect(contents, path).toContain("DeltaLw 28.9");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc-contract.test.ts"
    );
    expect(runner).toContain(
      "features/workbench/post-v1-floor-suspended-ceiling-lower-treatment-surface-parity-gate-bc.test.ts"
    );
  });
});
