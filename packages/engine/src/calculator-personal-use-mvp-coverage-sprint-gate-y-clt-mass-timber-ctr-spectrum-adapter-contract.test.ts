import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS,
  buildPersonalUseMvpCoverageSprintGateYScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateY
} from "./calculator-personal-use-mvp-coverage-sprint-gate-y";
import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
  GATE_H_CLT_MASS_TIMBER_WALL_WARNING
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD
} from "./dynamic-airborne-gate-x-aac-nonhomogeneous-masonry";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Y = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus:
    "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y",
  runtimeOriginPromotion: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_Y_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const BUILDING_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 8,
  sourceRoomVolumeM3: 48
};

const MASS_TIMBER_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    topologyMode: "mass_timber_panel"
  }
};

const COMPLETE_LINED_MASSIVE_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 80,
    cavity1FillCoverage: "partial",
    cavity1LayerIndices: [1, 2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [3],
    supportTopology: "direct_fixed",
    topologyMode: "lined_massive_wall"
  }
};

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const DOUBLE_CLT_WALL_WITHOUT_TOPOLOGY: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 60 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "clt_panel", thicknessMm: 60 }
] as const;

const AAC_WALL: readonly LayerInput[] = [
  { materialId: "ytong_aac_d700", thicknessMm: 150 }
] as const;

const SINGLE_GYPSUM_BOARD: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function values(result: ReturnType<typeof calculateAssembly>): Record<string, number | undefined> {
  return {
    C: result.metrics.estimatedCDb,
    Ctr: result.metrics.estimatedCtrDb,
    Rw: result.metrics.estimatedRwDb,
    STC: result.metrics.estimatedStc
  };
}

describe("Personal-Use MVP Coverage Sprint Gate Y CLT / mass-timber Ctr spectrum adapter", () => {
  it("lands Gate Y surfaces and selects a post-Gate-Y coverage revalidation", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_Y).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y",
      runtimeOriginPromotion: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts",
      selectionStatus:
        "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_Y_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete CLT lab Ctr support from the calculated ISO 717-1 curve without retuning values", () => {
    const result = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(values(result)).toMatchObject({
      C: -1.2,
      Ctr: -6.1,
      Rw: 42,
      STC: 42
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "single_leaf_panel",
      selectedMethod: "sharp",
      strategy: "timber_panel_blend"
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "single_leaf_panel",
      method: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneBasis?.frequencyBands).toMatchObject({
      bandSet: "dynamic_airborne_delegate_grid"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(expect.arrayContaining([
      "materialClass:mass_timber",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm",
      "GateYCtrSpectrumAdapter:ISO717-1 traffic spectrum term from calculated TL curve"
    ]));
    expect(result.airborneBasis?.assumptions.join(" ")).toContain(
      "no measured source row, calibration anchor, field output, or ASTM-only rating is consumed"
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_H_CLT_MASS_TIMBER_WALL_WARNING);
    expect(result.warnings).toContain(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING);
  });

  it("asks for missing custom CLT density instead of promoting the Ctr adapter", () => {
    const customCltWithoutDensity: MaterialDefinition = {
      acoustic: {
        behavior: "mass_timber",
        notes: ["Custom mass-timber panel deliberately missing density for Gate Y input prompts."],
        propertySourceStatus: "unknown"
      },
      category: "mass",
      densityKgM3: 0,
      id: "custom_clt_missing_density",
      name: "Custom CLT missing density",
      tags: ["clt", "mass-timber"]
    };
    const catalog = [...getDefaultMaterialCatalog(), customCltWithoutDensity];
    const layers = [{ materialId: "custom_clt_missing_density", thicknessMm: 120 }] as const;
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: MASS_TIMBER_CONTEXT,
      catalog,
      layers,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const result = calculateAssembly(layers, {
      airborneContext: MASS_TIMBER_CONTEXT,
      calculator: "dynamic",
      catalog,
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(assessment).toMatchObject({
      missingPhysicalInputs: ["densityKgM3"],
      routeFamilies: ["mass_timber_airborne"],
      status: "needs_input"
    });
    expect(assessment.prompts).toEqual([
      expect.objectContaining({
        fieldId: "densityKgM3",
        source: "material_property"
      })
    ]);
    expect(result.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    );
    expect(result.warnings).not.toContain(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps wrong families, duplicate CLT leaves, field/building basis, and STC-only requests outside Gate Y", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const aac = calculateAssembly(AAC_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const lined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_LINED_MASSIVE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const duplicateClt = calculateAssembly(DOUBLE_CLT_WALL_WITHOUT_TOPOLOGY, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const field = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = calculateAssembly(CLT_WALL, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const stcOnly = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });

    expect(gypsum.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(aac.airborneBasis?.method).toBe(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD);
    expect(aac.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(lined.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(duplicateClt.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(field.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(building.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(stcOnly.airborneBasis?.method).toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(stcOnly.airborneBasis?.method).not.toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
  });

  it("keeps exact measured source precedence ahead of the source-absent Gate Y adapter", () => {
    const runtime = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: CLT_WALL,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_y_rights_safe_exact_clt_lab_row",
          label: "Gate Y exact CLT lab row",
          metricLabel: "Rw",
          metricValue: 42,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(exactOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_y_rights_safe_exact_clt_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("updates the executable matrix, closes the CLT Ctr gap, and keeps next work explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateYScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateY(rows);
    const clt = rows.find((row) => row.id === "wall.clt_mass_timber.lab");

    expect(rows).toHaveLength(28);
    expect(clt).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_gate_y_clt_mass_timber_ctr_spectrum_adapter_family_physics",
      runtime: {
        basisId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        selectedMethod: "sharp",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
        unsupportedTargetOutputs: []
      }
    });
    expect(clt?.runtime.valuePins).toEqual([
      { metric: "Rw", value: 42 },
      { metric: "STC", value: 42 },
      { metric: "C", value: -1.2 },
      { metric: "Ctr", value: -6.1 }
    ]);
    expect(summary).toMatchObject({
      cltCtrRuntimeBasisId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      cltCtrSelectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      closedCoverageGapRowIds: ["wall.clt_mass_timber.lab"],
      numericRuntimeValueMovement: false,
      remainingCoverageGapRowIds: [],
      rowCount: 28,
      selectedNextAction: "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan"
    });
  });

  it("keeps docs, file size guard, and current-gate runner aligned with Gate Y closeout", () => {
    const gateXLines = readRepoFile("packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x.ts")
      .split("\n").length;
    const gateYLines = readRepoFile("packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y.ts")
      .split("\n").length;
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(gateXLines).toBeLessThan(2000);
    expect(gateYLines).toBeLessThan(2000);
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts"
    );

    for (const path of CURRENT_SELECTION_DOCS) {
      const doc = readRepoFile(path);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_LANDED_GATE);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE);
    }
  });
});
