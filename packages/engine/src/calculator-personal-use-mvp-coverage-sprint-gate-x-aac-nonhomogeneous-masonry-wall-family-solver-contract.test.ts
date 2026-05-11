import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTION_STATUS,
  buildPersonalUseMvpCoverageSprintGateXScenarioMatrix,
  rankPersonalUseMvpCoverageSprintGateYLanes,
  summarizePersonalUseMvpCoverageSprintGateX
} from "./calculator-personal-use-mvp-coverage-sprint-gate-x";
import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID,
  GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING
} from "./dynamic-airborne-gate-x-aac-nonhomogeneous-masonry";
import { GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-gate-h-lined-masonry-clt";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_X = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_LANDED_GATE,
  numericRuntimeBehaviorChange: false,
  previousSelectionStatus:
    "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x",
  runtimeOriginPromotion: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_X_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-x-aac-nonhomogeneous-masonry.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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

describe("Personal-Use MVP Coverage Sprint Gate X AAC/non-homogeneous masonry wall family solver", () => {
  it("lands Gate X surfaces and selects the bounded Gate Y CLT Ctr lane", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_X).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_plan",
      numericRuntimeBehaviorChange: false,
      previousSelectionStatus:
        "gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_landed_selected_aac_masonry_gate_x",
      runtimeOriginPromotion: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts",
      selectionStatus:
        "gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_X_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes the complete AAC lab route to named family physics without retuning the runtime values", () => {
    const result = calculateAssembly(AAC_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(values(result)).toMatchObject({
      C: -0.7,
      Ctr: -5.2,
      Rw: 44,
      STC: 44
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "masonry_nonhomogeneous",
      selectedMethod: "sharp"
    });
    expect(result.dynamicAirborneTrace?.strategy).toContain("masonry_nonhomogeneous_blend");
    expect(result.dynamicAirborneTrace?.strategy).toContain("aircrete_unfinished_calibration");
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      family: "masonry_nonhomogeneous",
      method: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(expect.arrayContaining([
      "materialClass:aac_or_nonhomogeneous_masonry",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm",
      "ASTM E413 STC adapter boundary"
    ]));
    expect(result.airborneBasis?.propertyDefaults).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: "ytong_aac_d700.acousticProperties",
        source: "engineering_default"
      })
    ]));
    expect(result.warnings).toContain(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING);
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("declares the AAC material owner set and asks for density instead of guessing for custom AAC materials", () => {
    const completeAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_LAB_CONTEXT,
      catalog: getDefaultMaterialCatalog(),
      layers: AAC_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const completeContract = completeAssessment.inputCompletenessSet.find(
      (entry) => entry.id === "gate_x_aac_nonhomogeneous_masonry_wall_route_inputs"
    );

    expect(completeAssessment).toMatchObject({
      routeFamilies: ["single_leaf_airborne"],
      status: "complete_with_defaults"
    });
    expect(completeContract).toMatchObject({
      appliedDefaults: [
        expect.objectContaining({ fieldId: "youngModulusPa", uncertaintyEffect: "widen_error_budget" }),
        expect.objectContaining({ fieldId: "lossFactor", uncertaintyEffect: "widen_error_budget" })
      ],
      missingPhysicalInputs: [],
      optionalPrecisionFields: ["youngModulusPa", "lossFactor"],
      requiredFields: ["materialClass", "densityKgM3", "thicknessMm", "surfaceMassKgM2"],
      routeFamily: "single_leaf_airborne",
      status: "complete_with_defaults"
    });

    const customAacWithoutDensity: MaterialDefinition = {
      acoustic: {
        behavior: "rigid_mass",
        notes: ["Custom AAC block deliberately missing density for Gate X input prompts."],
        propertySourceStatus: "unknown"
      },
      category: "mass",
      densityKgM3: 0,
      id: "custom_aac_missing_density",
      name: "Custom AAC missing density",
      tags: ["aac", "aircrete", "masonry"]
    };
    const partialAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_LAB_CONTEXT,
      catalog: [...getDefaultMaterialCatalog(), customAacWithoutDensity],
      layers: [{ materialId: "custom_aac_missing_density", thicknessMm: 150 }],
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(partialAssessment).toMatchObject({
      missingPhysicalInputs: ["densityKgM3"],
      routeFamilies: ["single_leaf_airborne"],
      status: "needs_input"
    });
    expect(partialAssessment.prompts).toEqual([
      expect.objectContaining({
        fieldId: "densityKgM3",
        source: "material_property"
      })
    ]);
  });

  it("keeps wrong family, lined massive, field, and building routes out of the Gate X lab basis", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const lined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_LINED_MASSIVE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const field = calculateAssembly(AAC_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = calculateAssembly(AAC_WALL, {
      airborneContext: BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(gypsum.airborneBasis?.method).not.toBe(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD);
    expect(gypsum.warnings).not.toContain(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING);
    expect(lined.airborneBasis?.method).toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);
    expect(lined.airborneBasis?.method).not.toBe(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD);
    expect(field.airborneBasis?.method).not.toBe(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD);
    expect(field.warnings).not.toContain(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING);
    expect(building.airborneBasis?.method).not.toBe(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD);
    expect(building.warnings).not.toContain(GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING);
  });

  it("keeps exact measured source precedence ahead of the source-absent Gate X family prediction", () => {
    const runtime = calculateAssembly(AAC_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: AAC_WALL,
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
          id: "gate_x_rights_safe_exact_aac_lab_row",
          label: "Gate X exact AAC lab row",
          metricLabel: "Rw",
          metricValue: 44,
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
      exactSourceId: "gate_x_rights_safe_exact_aac_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("updates the executable matrix, closes only the AAC gap, and keeps the next step explicit", () => {
    const rows = buildPersonalUseMvpCoverageSprintGateXScenarioMatrix();
    const summary = summarizePersonalUseMvpCoverageSprintGateX(rows);
    const laneSelection = rankPersonalUseMvpCoverageSprintGateYLanes(rows);
    const aac = rows.find((row) => row.id === "wall.aac_nonhomogeneous_masonry.lab");

    expect(rows).toHaveLength(28);
    expect(aac).toMatchObject({
      currentPosture: "family_physics",
      failureClass: "none",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_gate_x_aac_nonhomogeneous_masonry_family_physics",
      runtime: {
        basisId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
        errorBudgetDb: 6,
        origin: "family_physics_prediction",
        selectedMethod: "sharp",
        supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"]
      }
    });
    expect(aac?.runtime.valuePins).toEqual([
      { metric: "Rw", value: 44 },
      { metric: "STC", value: 44 },
      { metric: "C", value: -0.7 },
      { metric: "Ctr", value: -5.2 }
    ]);
    expect(summary).toMatchObject({
      aacRuntimeBasisId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
      aacSelectedCandidateId: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID,
      closedCoverageGapRowIds: ["wall.aac_nonhomogeneous_masonry.lab"],
      numericRuntimeValueMovement: false,
      remainingCoverageGapRowIds: ["wall.clt_mass_timber.lab"],
      rowCount: 28,
      selectedGateYLane: "clt_mass_timber_ctr_spectrum_adapter",
      selectedNextAction: "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan"
    });
    expect(laneSelection.selectedCandidate).toMatchObject({
      id: "clt_mass_timber_ctr_spectrum_adapter",
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
  });

  it("keeps docs, file size guard, and current-gate runner aligned with Gate X closeout", () => {
    const mainMatrixLines = readRepoFile("packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts")
      .split("\n").length;
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(mainMatrixLines).toBeLessThan(2000);
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-x-aac-nonhomogeneous-masonry-wall-family-solver-contract.test.ts"
    );

    for (const path of CURRENT_SELECTION_DOCS) {
      const doc = readRepoFile(path);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_LANDED_GATE);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_ACTION);
      expect(doc, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_X_SELECTED_NEXT_FILE);
    }
  });
});
