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
  AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS,
  evaluateFamilyMaterialBenchmarkScenarioReadiness,
  listMaterialAcousticPropertyFields
} from "./airborne-family-material-expansion";
import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_I = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_i_expand_family_material_properties_and_benchmark_scenarios",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_j_build_personal_use_readiness_scenario_pack",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts",
  selectionStatus:
    "gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_I_SURFACES = [
  "packages/shared/src/domain/material.ts",
  "packages/catalogs/src/materials/seed-materials.ts",
  "packages/engine/src/airborne-family-material-expansion.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
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

describe("calculator model-first physics prediction pivot Gate I", () => {
  it("lands family/material expansion contracts and selects personal-use readiness Gate J", () => {
    expect(MODEL_FIRST_GATE_I).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_i_expand_family_material_properties_and_benchmark_scenarios",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_j_build_personal_use_readiness_scenario_pack",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts",
      selectionStatus:
        "gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_I_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extends material definitions with acoustic properties without implying source-owned exactness", () => {
    const gypsum = MaterialDefinitionSchema.parse(catalogEntry("gypsum_board"));
    const rockwool = MaterialDefinitionSchema.parse(catalogEntry("rockwool"));
    const underlay = MaterialDefinitionSchema.parse(catalogEntry("generic_resilient_underlay"));
    const mlv = MaterialDefinitionSchema.parse(catalogEntry("mlv"));

    expect(gypsum.acoustic).toMatchObject({
      behavior: "panel_leaf",
      propertySourceStatus: "engineering_default"
    });
    expect(listMaterialAcousticPropertyFields(gypsum)).toEqual([
      "densityKgM3",
      "youngModulusPa",
      "poissonRatio",
      "lossFactor"
    ]);

    expect(rockwool.acoustic).toMatchObject({
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      propertySourceStatus: "engineering_default"
    });
    expect(listMaterialAcousticPropertyFields(rockwool)).toEqual([
      "densityKgM3",
      "flowResistivityPaSM2",
      "porosity"
    ]);

    expect(listMaterialAcousticPropertyFields(mlv)).toEqual([
      "densityKgM3",
      "lossFactor",
      "limpMassBehavior"
    ]);
    expect(listMaterialAcousticPropertyFields(underlay)).toEqual([
      "densityKgM3",
      "lossFactor",
      "dynamicStiffnessMNm3"
    ]);
    expect([gypsum, rockwool, underlay, mlv].map((material) => material.acoustic?.propertySourceStatus)).not.toContain(
      "source_owned"
    );
  });

  it("defines benchmark scenarios for the main family/material widening routes", () => {
    expect(AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      "b3_single_leaf_massive_material_properties",
      "b4_double_leaf_framed_absorbed_cavity_properties",
      "b5_triple_leaf_limp_mass_porous_properties",
      "b6_lined_masonry_finish_and_porous_lining_properties",
      "b7_clt_mass_timber_material_properties",
      "b8_floating_floor_dynamic_stiffness_properties"
    ]);

    for (const scenario of AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS) {
      expect(scenario.benchmarkIds.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.materialIds.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.positiveScenarioIds.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.negativeScenarioIds.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.requiredProperties.length, scenario.id).toBeGreaterThan(0);
      expect(scenario.expectedOrigin, scenario.id).not.toBe("measured_exact_full_stack");
    }
  });

  it("evaluates material readiness and keeps engineering defaults visible in uncertainty metadata", () => {
    const readiness = AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS.map((scenario) =>
      evaluateFamilyMaterialBenchmarkScenarioReadiness(scenario)
    );

    expect(readiness.map((entry) => [entry.scenarioId, entry.status])).toEqual([
      ["b3_single_leaf_massive_material_properties", "complete"],
      ["b4_double_leaf_framed_absorbed_cavity_properties", "complete"],
      ["b5_triple_leaf_limp_mass_porous_properties", "complete"],
      ["b6_lined_masonry_finish_and_porous_lining_properties", "complete"],
      ["b7_clt_mass_timber_material_properties", "complete"],
      ["b8_floating_floor_dynamic_stiffness_properties", "complete"]
    ]);
    expect(readiness.every((entry) => entry.sourceOwnedMaterialIds.length === 0)).toBe(true);
    expect(
      readiness.find((entry) => entry.scenarioId === "b5_triple_leaf_limp_mass_porous_properties")
        ?.engineeringDefaultMaterialIds
    ).toEqual(["gypsum_board", "mlv", "rockwool"]);
  });

  it("fails closed when a required material property is absent and widens uncertainty for optional precision gaps", () => {
    const tripleLeafScenario = AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS.find(
      (scenario) => scenario.id === "b5_triple_leaf_limp_mass_porous_properties"
    );
    const cltScenario = AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS.find(
      (scenario) => scenario.id === "b7_clt_mass_timber_material_properties"
    );
    if (!tripleLeafScenario || !cltScenario) {
      throw new Error("Gate I scenario list is missing required test fixtures.");
    }

    const missingFlowCatalog = updateCatalogMaterial("rockwool", (material) => {
      if (!material.acoustic) {
        throw new Error("rockwool acoustic properties are required for Gate I tests");
      }

      const acoustic = { ...material.acoustic };
      delete acoustic.flowResistivityPaSM2;
      return { ...material, acoustic };
    });
    const missingOptionalCatalog = updateCatalogMaterial("clt_panel", (material) => {
      if (!material.acoustic) {
        throw new Error("clt_panel acoustic properties are required for Gate I tests");
      }

      const acoustic = { ...material.acoustic };
      delete acoustic.poissonRatio;
      return { ...material, acoustic };
    });

    const requiredMissing = evaluateFamilyMaterialBenchmarkScenarioReadiness(
      tripleLeafScenario,
      missingFlowCatalog
    );
    const optionalMissing = evaluateFamilyMaterialBenchmarkScenarioReadiness(
      cltScenario,
      missingOptionalCatalog
    );

    expect(requiredMissing).toMatchObject({
      missingRequiredProperties: ["flowResistivityPaSM2"],
      status: "needs_input"
    });
    expect(requiredMissing.errorBudgetAdjustmentDb).toBe(0);

    expect(optionalMissing).toMatchObject({
      appliedDefaultProperties: ["poissonRatio"],
      errorBudgetAdjustmentDb: 1,
      missingOptionalPrecisionProperties: ["poissonRatio"],
      status: "complete_with_defaults"
    });
  });

  it("keeps Gate G grouped Rockwool prediction values and flat-list guard unchanged", () => {
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const flatList = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(grouped.metrics).toMatchObject({
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(grouped.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(grouped.airborneBasis?.propertyDefaults.map((entry: { field: string }) => entry.field)).toEqual([
      "rockwool.flowResistivity",
      "tripleLeaf.cavityDamping"
    ]);

    expect(flatList.metrics.estimatedRwDb).toBe(41);
    expect(flatList.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(flatList.supportedTargetOutputs).toEqual([]);
    expect(flatList.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate I closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts"
      );
      expect(text, path).toContain("gate_j_build_personal_use_readiness_scenario_pack");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts"
    );
  });
});
