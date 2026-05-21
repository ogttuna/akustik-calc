import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MaterialDefinitionSchema,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  evaluateGateTAllFamilyMaterialGapClosureReadiness,
  evaluateGateTFamilyMaterialGapClosureReadiness,
  GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS
} from "./airborne-family-material-gap-closure";
import { listMaterialAcousticPropertyFields } from "./airborne-family-material-expansion";
import { calculateAssembly } from "./calculate-assembly";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_T = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts",
  selectionStatus:
    "gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_T_SURFACES = [
  "packages/shared/src/domain/material.ts",
  "packages/catalogs/src/materials/seed-materials.ts",
  "packages/engine/src/airborne-family-material-gap-closure.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_FRAMED_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_FRAMED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function catalogEntry(materialId: string): MaterialDefinition {
  const material = getDefaultMaterialCatalog().find((entry) => entry.id === materialId);
  if (!material) {
    throw new Error(`Missing test material ${materialId}`);
  }

  return material;
}

function updateCatalogMaterial(
  materialId: string,
  update: (material: MaterialDefinition) => MaterialDefinition
): MaterialDefinition[] {
  return getDefaultMaterialCatalog().map((material) =>
    material.id === materialId ? update(material) : material
  );
}

describe("calculator model-first physics prediction pivot Gate T", () => {
  it("lands family material-property gap closure and selects Gate U", () => {
    expect(MODEL_FIRST_GATE_T).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts",
      selectionStatus:
        "gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_T_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("adds absorber class metadata without marking engineering defaults as source-owned", () => {
    const rockwool = MaterialDefinitionSchema.parse(catalogEntry("rockwool"));
    const cellulose = MaterialDefinitionSchema.parse(catalogEntry("cellulose_fill"));
    const securityBoard = MaterialDefinitionSchema.parse(catalogEntry("security_board"));
    const bitumen = MaterialDefinitionSchema.parse(catalogEntry("bitumen_membrane"));

    expect(rockwool.acoustic).toMatchObject({
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      propertySourceStatus: "engineering_default"
    });
    expect(listMaterialAcousticPropertyFields(rockwool)).toEqual([
      "densityKgM3",
      "flowResistivityPaSM2",
      "porosity",
      "absorberClass"
    ]);
    expect(listMaterialAcousticPropertyFields(cellulose)).toEqual([
      "densityKgM3",
      "flowResistivityPaSM2",
      "porosity",
      "absorberClass"
    ]);
    expect(listMaterialAcousticPropertyFields(securityBoard)).toEqual([
      "densityKgM3",
      "youngModulusPa",
      "poissonRatio",
      "lossFactor"
    ]);
    expect(listMaterialAcousticPropertyFields(bitumen)).toEqual([
      "densityKgM3",
      "lossFactor",
      "limpMassBehavior"
    ]);
    expect([rockwool, cellulose, securityBoard, bitumen].map((material) => material.acoustic?.propertySourceStatus)).not.toContain(
      "source_owned"
    );
  });

  it("closes the high-impact per-material gaps for board, masonry, porous, membrane, and floor routes", () => {
    expect(GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      "gate_t_board_leaf_finish_default_closure",
      "gate_t_masonry_core_finish_default_closure",
      "gate_t_porous_absorber_default_closure",
      "gate_t_floor_deck_screed_default_closure",
      "gate_t_limp_membrane_default_closure",
      "gate_t_resilient_impact_layer_default_closure"
    ]);

    const readiness = evaluateGateTAllFamilyMaterialGapClosureReadiness();

    expect(readiness.map((entry) => [entry.scenarioId, entry.status])).toEqual([
      ["gate_t_board_leaf_finish_default_closure", "complete"],
      ["gate_t_masonry_core_finish_default_closure", "complete"],
      ["gate_t_porous_absorber_default_closure", "complete"],
      ["gate_t_floor_deck_screed_default_closure", "complete"],
      ["gate_t_limp_membrane_default_closure", "complete"],
      ["gate_t_resilient_impact_layer_default_closure", "complete"]
    ]);
    expect(readiness.every((entry) => entry.sourceOwnedMaterialIds.length === 0)).toBe(true);
    expect(
      readiness.find((entry) => entry.scenarioId === "gate_t_porous_absorber_default_closure")
        ?.engineeringDefaultMaterialIds
    ).toEqual(["rockwool", "high_density_rockwool", "glasswool_board", "cellulose_fill", "wood_wool_panel", "pet_felt"]);
  });

  it("keeps required property gaps as needs_input and optional precision gaps as uncertainty widening", () => {
    const porousScenario = GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS.find(
      (scenario) => scenario.id === "gate_t_porous_absorber_default_closure"
    );
    const boardScenario = GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS.find(
      (scenario) => scenario.id === "gate_t_board_leaf_finish_default_closure"
    );
    if (!porousScenario || !boardScenario) {
      throw new Error("Gate T scenario list is missing required test fixtures.");
    }

    const missingRequiredCatalog = updateCatalogMaterial("cellulose_fill", (material) => {
      if (!material.acoustic) {
        throw new Error("cellulose_fill acoustic properties are required for Gate T tests");
      }

      const acoustic = { ...material.acoustic };
      delete acoustic.flowResistivityPaSM2;
      return { ...material, acoustic };
    });
    const missingOptionalCatalog = updateCatalogMaterial("security_board", (material) => {
      if (!material.acoustic) {
        throw new Error("security_board acoustic properties are required for Gate T tests");
      }

      const acoustic = { ...material.acoustic };
      delete acoustic.poissonRatio;
      return { ...material, acoustic };
    });

    expect(evaluateGateTFamilyMaterialGapClosureReadiness(porousScenario, missingRequiredCatalog)).toMatchObject({
      errorBudgetAdjustmentDb: 0,
      missingRequiredProperties: [{ field: "flowResistivityPaSM2", materialId: "cellulose_fill" }],
      status: "needs_input"
    });
    expect(evaluateGateTFamilyMaterialGapClosureReadiness(boardScenario, missingOptionalCatalog)).toMatchObject({
      errorBudgetAdjustmentDb: 1,
      missingOptionalPrecisionProperties: [{ field: "poissonRatio", materialId: "security_board" }],
      status: "complete_with_defaults"
    });
  });

  it("keeps Gate S runtime values stable while improving material property readiness", () => {
    const result = calculateAssembly(DOUBLE_LEAF_FRAMED_STACK, {
      airborneContext: DOUBLE_LEAF_FRAMED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneBasis?.propertyDefaults).toEqual([
      {
        field: "porousFill.flowResistivityPaSM2",
        reason:
          "Porous cavity damping is computed with an engineering-default flow resistivity until a product-specific value is entered.",
        source: "engineering_default",
        unit: "Pa*s/m2",
        value: "nominal_flow_resistivity"
      }
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate T closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts"
      );
      expect(text, path).toContain("gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts"
    );
  });
});
