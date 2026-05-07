import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { BoundFloorSystem, ExactFloorSystem, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_AB = {
  evidencePromotion: false,
  landedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: true,
  outputSupportChange: true,
  previousLandedGate: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts",
  selectionStatus:
    "gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_AB_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts",
  "packages/engine/src/floor-family-source-guard.ts",
  "packages/engine/src/floor-system-estimate.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/calculate-impact-only.ts",
  "packages/engine/src/calculate-assembly.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AB_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AB_HANDOFF.md"
] as const;

const IMPACT_TARGET_OUTPUTS = ["Ln,w", "CI", "Ln,w+CI", "Rw", "Ctr"] as const satisfies readonly RequestedOutputId[];

const MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactFloorSystem(id: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);

  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function boundFloorSystem(id: string): BoundFloorSystem {
  const system = BOUND_FLOOR_SYSTEMS.find((entry) => entry.id === id);

  if (!system) {
    throw new Error(`Missing bound floor system ${id}`);
  }

  return system;
}

describe("calculator model-first physics prediction pivot Gate AB", () => {
  it("lands the floor-family source guard and selects steel-floor physics-input Gate AC", () => {
    expect(MODEL_FIRST_GATE_AB).toEqual({
      evidencePromotion: false,
      landedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: true,
      outputSupportChange: true,
      previousLandedGate: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts",
      selectionStatus:
        "gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AB_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps generic modular steel floors on needs_input instead of borrowing open-web or steel-joist source rows", () => {
    const result = calculateImpactOnly(MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK, {
      targetOutputs: IMPACT_TARGET_OUTPUTS
    });

    expect(result.impact).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.boundFloorSystemEstimate).toBeNull();
    expect(result.floorSystemMatch).toBeNull();
    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.dynamicImpactTrace).toBeUndefined();
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["Ln,w", "CI", "Ln,w+CI"]);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "Ln,w+CI", "Rw", "Ctr"]);

    const warnings = [
      ...result.warnings,
      ...(result.impactPredictorStatus?.warnings ?? [])
    ].join("\n");
    expect(warnings).toContain("Generic lightweight-steel floor impact route needs steel support form");
    expect(warnings).toContain("open_web_or_rolled");
    expect(warnings).toContain("joist_or_purlin");
    expect(warnings).toContain("not borrow UBIQ or Pliteq steel rows");

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("ubiq_fl26_open_web");
    expect(serialized).not.toContain("ubiq_fl28_open_web");
    expect(serialized).not.toContain("pliteq_steel_joist");
    expect(result.impactPredictorStatus).toMatchObject({
      active: false,
      futureSupportedTargetOutputs: ["Ln,w", "CI", "Ln,w+CI"],
      implementedFamilyEstimate: false,
      implementedLowConfidenceEstimate: false,
      readyForPlannedSolver: false
    });
  });

  it("still promotes exact same-family steel rows when the full topology truly matches", () => {
    const system = exactFloorSystem("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    const result = calculateImpactOnly(buildFloorTestLayersFromCriteria(system.match, "tagged"), {
      targetOutputs: ["Ln,w", "Rw"] satisfies RequestedOutputId[]
    });

    expect(result.floorSystemMatch?.system.id).toBe("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    expect(result.impact).toMatchObject({
      LnW: 58,
      basis: "official_floor_system_exact_match",
      labOrField: "lab"
    });
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps same-family steel bound rows visible without converting bound support into exact Ln,w", () => {
    const system = boundFloorSystem("ubiq_fl32_steel_200_lab_2026");
    const result = calculateImpactOnly(buildFloorTestLayersFromCriteria(system.match, "tagged"), {
      targetOutputs: ["Ln,w", "Ln,w+CI", "Rw"] satisfies RequestedOutputId[]
    });

    expect(result.boundFloorSystemMatch?.system.id).toBe("ubiq_fl32_steel_200_lab_2026");
    expect(result.lowerBoundImpact).toMatchObject({
      LnWUpperBound: 53
    });
    expect(result.lowerBoundImpact?.LnWPlusCIUpperBound).toBeUndefined();
    expect(result.impact).toBeNull();
    expect(result.floorSystemEstimate).toBeNull();
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(result.impactPredictorStatus).toMatchObject({
      active: true,
      matchedFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
      readyForPlannedSolver: false
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AB closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan"
      );
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts"
    );
  });
});
