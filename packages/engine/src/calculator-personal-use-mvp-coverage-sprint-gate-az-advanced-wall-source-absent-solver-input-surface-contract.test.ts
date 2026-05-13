import { describe, expect, it } from "vitest";

import type { AirborneContext } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS,
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS,
  buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";

type GateAZAdvancedWallInput = NonNullable<AirborneContext["advancedWall"]>;

function cloneGateAZAdvancedWallInput(): GateAZAdvancedWallInput {
  return {
    ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
    cavities: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.cavities.map((cavity) => ({ ...cavity })),
    frameCoupling: { ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.frameCoupling },
    panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel) => ({
      ...panel,
      layerIds: [...(panel.layerIds ?? [])]
    })),
    targetOutputs: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.targetOutputs]
  };
}

describe("Personal-Use MVP Coverage Sprint Gate AZ advanced wall source-absent solver input surface", () => {
  it("wires complete advanced-wall physical input through public Dynamic Calculator without retuning Gate AY values", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract();
    const result = contract.activeAssembly;

    expect(contract.landedGate).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE);
    expect(contract.selectionStatus).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS);
    expect(contract.selectedNextAction).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION);
    expect(contract.selectedNextFile).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE);
    expect(contract.sourceRowsRequiredForInputSurface).toBe(false);
    expect(contract.numericRuntimeBehaviorMovedBeforeGateAZ).toBe(false);
    expect(contract.targetOutputs).toEqual(GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS);

    expect(result.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).toBe("family_physics_prediction");
    expect(result.airborneBasis?.errorBudgetDb).toBe(8);
    expect(result.airborneBasis?.missingSourceEvidence).toContain(
      "same-family source-owned N-layer wall holdout curves for Gate AY runtime calibration"
    );
    expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
    );
    expect(result.airborneCandidateResolution?.runtimeValueMovement).toBe(true);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwDb).toBe(65);
    expect(result.metrics.estimatedStc).toBe(65);
    expect(result.metrics.estimatedCDb).toBe(-1.1);
    expect(result.metrics.estimatedCtrDb).toBe(-6.4);
    expect(result.warnings).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING);
  });

  it("keeps missing advanced-wall physical inputs parked with precise prompts and no source-absent budget", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract();
    const result = contract.missingInputAssembly;

    expect(result.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).toBe("needs_input");
    expect(result.airborneBasis?.errorBudgetDb).toBeUndefined();
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["panelLossFactor", "panelCriticalFrequencyHz"])
    );
    expect(result.airborneCandidateResolution?.selectedOrigin).toBe("needs_input");
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.warnings.join(" ")).toContain("panelLossFactor");
  });

  it("refuses field/building aliases from the advanced-wall lab runtime", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract();
    const result = contract.fieldBoundaryAssembly;

    expect(result.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(result.airborneBasis?.origin).toBe("unsupported");
    expect(result.airborneBasis?.errorBudgetDb).toBeUndefined();
    expect(result.airborneCandidateResolution?.selectedOrigin).toBe("unsupported");
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.warnings.join(" ")).toContain("does not alias lab Rw/STC/C/Ctr to field or building outputs");
  });

  it("stays stable under safe explicit panel/cavity reorders and rejects duplicate ownership", () => {
    const reorderedInput = cloneGateAZAdvancedWallInput();
    const duplicateInput = cloneGateAZAdvancedWallInput();
    const firstPanelLayerIds = duplicateInput.panels?.[0]?.layerIds;
    const reordered = calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
      airborneContext: {
        advancedWall: {
          ...reorderedInput,
          cavities: [...(reorderedInput.cavities ?? [])].reverse(),
          panels: [...(reorderedInput.panels ?? [])].reverse()
        },
        contextMode: "element_lab"
      },
      calculator: "dynamic",
      targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
    });
    const duplicate = calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
      airborneContext: {
        advancedWall: {
          ...duplicateInput,
          panels: duplicateInput.panels?.map((panel, index) =>
            index === 1
              ? { ...panel, layerIds: firstPanelLayerIds ? [...firstPanelLayerIds] : undefined }
              : panel
          )
        },
        contextMode: "element_lab"
      },
      calculator: "dynamic",
      targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
    });

    expect(reordered.metrics.estimatedRwDb).toBe(65);
    expect(reordered.metrics.estimatedStc).toBe(65);
    expect(reordered.airborneBasis?.origin).toBe("family_physics_prediction");

    expect(duplicate.airborneBasis?.origin).toBe("needs_input");
    expect(duplicate.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["panelLayerOwnership", "splitLayerGuard"])
    );
    expect(duplicate.supportedTargetOutputs).toEqual([]);
  });

  it("does not disturb the existing grouped triple-leaf route or exact-source precedence boundary", () => {
    const delegatedInput = cloneGateAZAdvancedWallInput();
    const advancedResult = calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
      airborneContext: GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
    });
    const delegatedResult = calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
      airborneContext: {
        advancedWall: {
          ...delegatedInput,
          existingOwnedDelegateRoute: "triple_leaf_two_cavity_frequency_solver"
        },
        contextMode: "element_lab"
      },
      calculator: "dynamic",
      targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
    });

    expect(advancedResult.airborneCandidateResolution?.selectedCandidateId).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
    );
    expect(delegatedResult.airborneBasis?.method).not.toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(delegatedResult.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
    );
  });
});
