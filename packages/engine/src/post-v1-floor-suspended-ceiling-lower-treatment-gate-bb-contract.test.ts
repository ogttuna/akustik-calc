import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactErrorBudget, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import {
  collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS
} from "./post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS,
  POST_V1_GATE_BB_ASTM_ALIAS_OUTPUTS,
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_LAB_IMPACT_OUTPUTS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentGateBB
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BB_SURFACES = [
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts",
  "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts",
  "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
  "packages/engine/src/impact-predictor-input.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
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
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateGateBB(
  layers: readonly LayerInput[] = POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS
) {
  return calculateAssembly(layers, {
    calculator: "dynamic",
    floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
    targetOutputs: POST_V1_GATE_BB_LAB_IMPACT_OUTPUTS
  });
}

describe("post-V1 floor suspended-ceiling lower-treatment Gate BB", () => {
  it("lands Gate BB after Gate BA and selects surface parity Gate BC", () => {
    const summary = summarizePostV1FloorSuspendedCeilingLowerTreatmentGateBB();

    expect(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS).toBe(
      "post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_landed_no_runtime_selected_suspended_ceiling_lower_treatment_gate_bb"
    );
    expect(POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE,
      previousGateBA: {
        landedGate: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_DYNAMIC_STIFFNESS_LOAD_BASIS_OWNER_GATE_BA_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS,
      sourceRowsRequiredForSelection: false,
      valueMovement: "visible_layer_lower_treatment_formula_promotion"
    });

    for (const path of REQUIRED_GATE_BB_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates a visible acoustic-hanger lower-treatment stack instead of stopping at ceilingOrLowerAssembly", () => {
    const result = calculateGateBB();

    expect(result.impact).toMatchObject({
      DeltaLw: 28.9,
      LnW: 45.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      floatingLoadSurfaceMassKgM2: 100,
      resilientDynamicStiffnessMNm3: 30,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportBucket: "source_absent_estimate",
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
    expect(result.impact?.errorBudgets?.map((budget: ImpactErrorBudget) => budget.metricId)).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("calculates the same heavy-concrete combined family for visible resilient-stud lower support", () => {
    const result = calculateGateBB(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS);

    expect(result.impact).toMatchObject({
      DeltaLw: 29.9,
      LnW: 44.6,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      scope: "heavy_concrete_combined_upper_lower_formula_corridor"
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: [
        {
          metric: "Ln,w",
          value: 44.6
        },
        {
          metric: "DeltaLw",
          value: 29.9
        }
      ]
    });
  });

  it("still blocks the combined upper/lower formula when the lower ceiling cavity is missing", () => {
    const missingCavityLayers = POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS.filter(
      (layer) => layer.floorRole !== "ceiling_cavity"
    );
    const predictorInput = buildImpactPredictorInputFromLayerStack(
      missingCavityLayers,
      {
        loadBasisKgM2: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.loadBasisKgM2,
        resilientLayer: {
          dynamicStiffnessMNm3:
            POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
        }
      }
    );
    const result = calculateGateBB(missingCavityLayers);

    expect(collectHeavyConcreteCombinedImpactFormulaMissingPhysicalInputs(predictorInput)).toEqual([
      "ceilingOrLowerAssembly"
    ]);
    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(
      result.warnings.some((warning: string) =>
        warning.includes("ceilingOrLowerAssembly") &&
          warning.includes("before promoting Ln,w / DeltaLw")
      )
    ).toBe(true);
  });

  it("does not invent load basis or ASTM aliases while widening the lower-treatment route", () => {
    const missingLoad = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3: 30
      },
      targetOutputs: POST_V1_GATE_BB_LAB_IMPACT_OUTPUTS
    });
    const astmAlias = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: POST_V1_GATE_BB_ASTM_ALIAS_OUTPUTS
    });

    expect(missingLoad.impact).toBeNull();
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(missingLoad.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportedMetrics: [],
      valuePins: []
    });

    expect(astmAlias.impact).toBeNull();
    expect(astmAlias.supportedTargetOutputs).toEqual([]);
    expect(astmAlias.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmAlias.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(astmAlias.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BB closeout and Gate BC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_GATE_BB_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("acoustic_hanger_ceiling");
      expect(contents, path).toContain("resilient_stud_ceiling");
      expect(contents, path).toContain("Ln,w 45.6");
      expect(contents, path).toContain("DeltaLw 28.9");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts"
    );
  });
});
