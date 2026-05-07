import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateYFloorImpactFieldContextContract,
  type GateYFloorImpactFieldContextAssessment
} from "./dynamic-calculator-floor-impact-field-context-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_Y = {
  evidencePromotion: false,
  landedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousLandedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
  selectionStatus:
    "gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_Y_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts",
  "packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts",
  "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/impact-field-context.ts",
  "packages/engine/src/impact-direct-flanking.ts",
  "packages/engine/src/impact-guide.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Y_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Y_HANDOFF.md"
] as const;

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

const COMPLETE_AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55
} as const;

const COMPLETE_IMPACT_FIELD_CONTEXT = {
  enableSmallRoomEstimate: true,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const;

const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function byId(
  scenarioPack: readonly GateYFloorImpactFieldContextAssessment[]
): Record<GateYFloorImpactFieldContextAssessment["id"], GateYFloorImpactFieldContextAssessment> {
  return Object.fromEntries(
    scenarioPack.map((scenario) => [scenario.id, scenario])
  ) as Record<GateYFloorImpactFieldContextAssessment["id"], GateYFloorImpactFieldContextAssessment>;
}

describe("calculator model-first physics prediction pivot Gate Y", () => {
  it("lands the no-runtime floor-impact field-context contract and selects Gate Z", () => {
    const contract = buildGateYFloorImpactFieldContextContract();

    expect(MODEL_FIRST_GATE_Y).toEqual({
      evidencePromotion: false,
      landedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousLandedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
      selectionStatus:
        "gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract).toMatchObject({
      adapterOwner: "ISO_717_2_floor_impact_field_context_adapter_boundary",
      landedGate: MODEL_FIRST_GATE_Y.landedGate,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: MODEL_FIRST_GATE_Y.previousLandedGate,
      runtimePromotionAllowedInGateY: false,
      selectedNextAction: MODEL_FIRST_GATE_Y.selectedNextAction,
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts",
      selectionStatus: MODEL_FIRST_GATE_Y.selectionStatus,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract.requiredContextInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "impactFieldContext"
    ]);
    expect(contract.requiredOwnerInputs).toEqual([
      "labImpactAnchorLnWOrDeltaLw",
      "impactFieldContext.fieldKDb_or_guideMassRatio_or_direct_flanking_paths",
      "flankingPathOrJunctionPolicy",
      "lowFrequencyImpactSpectrumOrCI50_2500Owner"
    ]);

    for (const path of REQUIRED_GATE_Y_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines ISO 717-2 field impact adapter readiness without source-row dependency", () => {
    const contract = buildGateYFloorImpactFieldContextContract();
    const scenarios = byId(contract.scenarioPack);
    const ready = scenarios.gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency;

    expect(ready.status).toBe("ready_for_runtime_gate");
    expect(ready.runtimePromotionAllowedInGateY).toBe(false);
    expect(ready.sourceRowsRequiredForRuntimeSelection).toBe(false);
    expect(ready.requestedOutputs).toEqual(FIELD_OUTPUTS);
    expect(ready.readyOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(ready.blockedOutputs).toEqual(["L'nT,50"]);
    expect(ready.missingPhysicalInputs).toEqual([]);
    expect(ready.missingOwnerInputs).toEqual(["lowFrequencyImpactSpectrumOrCI50_2500Owner"]);

    expect(ready.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ISO_717_2_Lprime_nw_field_impact",
        blockedOutputs: [],
        missingPhysicalInputs: [],
        outputBasis: "field_impact_apparent",
        requestedOutputs: ["L'n,w"],
        status: "ready_for_runtime_gate"
      })
    );
    expect(ready.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ISO_717_2_Lprime_nT_w_standardized_field_impact",
        blockedOutputs: [],
        missingPhysicalInputs: [],
        outputBasis: "field_impact_standardized",
        requestedOutputs: ["L'nT,w"],
        status: "ready_for_runtime_gate"
      })
    );
    expect(ready.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ISO_717_2_Lprime_nT_50_low_frequency_field_impact",
        blockedOutputs: ["L'nT,50"],
        missingOwnerInputs: ["lowFrequencyImpactSpectrumOrCI50_2500Owner"],
        missingPhysicalInputs: [],
        outputBasis: "field_impact_low_frequency_standardized",
        requestedOutputs: ["L'nT,50"],
        status: "blocked_low_frequency_owner"
      })
    );
  });

  it("keeps nearby negative field-context cases as explicit needs_input boundaries", () => {
    const scenarios = byId(buildGateYFloorImpactFieldContextContract().scenarioPack);
    const missingExpectations: readonly [
      GateYFloorImpactFieldContextAssessment["id"],
      readonly string[],
      readonly string[]
    ][] = [
      ["gate_y_missing_context_mode_needs_input", ["contextMode"], []],
      ["gate_y_missing_partition_area_needs_input", ["partitionAreaM2"], []],
      ["gate_y_missing_receiving_room_volume_needs_input", ["receivingRoomVolumeM3"], []],
      ["gate_y_missing_receiving_room_rt60_needs_input", ["receivingRoomRt60S"], []],
      ["gate_y_missing_impact_field_context_needs_input", ["impactFieldContext"], [
        "impactFieldContext.fieldKDb_or_guideMassRatio_or_direct_flanking_paths",
        "flankingPathOrJunctionPolicy"
      ]],
      ["gate_y_missing_flanking_or_k_policy_needs_input", ["impactFieldContext"], [
        "impactFieldContext.fieldKDb_or_guideMassRatio_or_direct_flanking_paths",
        "flankingPathOrJunctionPolicy"
      ]],
      ["gate_y_missing_lab_dynamic_stiffness_anchor_needs_input", [
        "resilientLayerDynamicStiffnessMNm3"
      ], ["labImpactAnchorLnWOrDeltaLw"]]
    ];

    for (const [id, physicalFields, ownerFields] of missingExpectations) {
      const scenario = scenarios[id];

      expect(scenario.status, id).toBe("needs_input");
      expect(scenario.readyOutputs, id).toEqual([]);
      expect(scenario.missingPhysicalInputs, id).toEqual(expect.arrayContaining([...physicalFields]));
      expect(scenario.missingOwnerInputs, id).toEqual(expect.arrayContaining([...ownerFields]));
      expect(scenario.blockedOutputs, id).toEqual([]);
    }
  });

  it("keeps the Gate Y boundary historical while Gate Z owns the current field-only runtime", () => {
    const fieldOnly = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: ["L'n,w", "L'nT,w"]
    });
    const labAnchoredMixed = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(fieldOnly.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(fieldOnly.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(fieldOnly.warnings).toContain(
      "Live field-side supplement is active on the main impact lane. K and receiving-room context are now carried through the engine boundary, not only the guide lane."
    );
    expect(labAnchoredMixed.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(labAnchoredMixed.impact?.metricBasis).toMatchObject({
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(labAnchoredMixed.supportedTargetOutputs).toEqual([
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(labAnchoredMixed.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(fieldOnly.impact?.LPrimeNW).toBe(labAnchoredMixed.impact?.LPrimeNW);
    expect(fieldOnly.impact?.LPrimeNTw).toBe(labAnchoredMixed.impact?.LPrimeNTw);
    expect(buildGateYFloorImpactFieldContextContract().currentRuntimeBoundary).toEqual({
      fieldOnlyRequestsStillBlockedBeforeGateZ: true,
      labAnchoredMixedRequestsCanReachExistingFieldSupplement: true,
      selectedNextGateMustOwnFieldOnlyRuntimeAndVisibleParity: true
    });
  });

  it("keeps docs and current-gate runner aligned with Gate Y closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z"
      );
      expect(text, path).toContain(
        "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts"
    );
  });
});
