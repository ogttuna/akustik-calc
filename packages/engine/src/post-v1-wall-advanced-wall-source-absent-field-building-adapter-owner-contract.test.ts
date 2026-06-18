import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID,
  calculateGateAYAdvancedWallRuntimeCorridor
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import {
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING,
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
} from "./advanced-wall-source-absent-field-building-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_adapter_coverage_refresh_landed_no_runtime_selected_advanced_wall_source_absent_field_building_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID;

const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 10,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 10,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
} as const;

const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const MIXED_ALIAS_OUTPUTS = ["R'w", "STC", "C"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function cloneGateAYAdvancedWallInput(): NonNullable<AirborneContext["advancedWall"]> {
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

function buildFieldContext(
  advancedWallOverrides: Partial<NonNullable<AirborneContext["advancedWall"]>> = {}
): AirborneContext {
  return {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      ...advancedWallOverrides,
      outputBasis: "field_between_rooms",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    },
    contextMode: "field_between_rooms",
    panelHeightMm: 2800,
    panelWidthMm: 3200,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 55
  };
}

function buildBuildingContext(): AirborneContext {
  return {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "building_prediction",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    },
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2800,
    panelWidthMm: 3200,
    receivingRoomRt60S: 0.6,
    receivingRoomVolumeM3: 55,
    sourceRoomVolumeM3: 42
  };
}

function calculateAdvancedWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectFieldBuildingMetrics(
  result: ReturnType<typeof calculateAssembly>,
  method: string
) {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "ISO 12354-1",
    kind: "airborne_physics_prediction",
    method,
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "advancedWall.fieldBuildingAdapterBoundary",
      "advancedWall.sourceAbsentErrorBudgetOwner",
      "GateI_or_GateAR_field_building_adapter_owner"
    ])
  );
  expect(result.metrics.estimatedRwPrimeDb).toBe(63);
  expect(result.metrics.estimatedDnWDb).toBe(64);
  expect(result.metrics.estimatedDnADb).toBe(62.6);
  expect(result.metrics.estimatedDnTwDb).toBe(66);
  expect(result.metrics.estimatedDnTADb).toBe(65);
  expect(result.metrics.estimatedStc).toBe(63);
  expect(result.metrics.estimatedCDb).toBe(-0.9);
  expect(result.metrics.estimatedCtrDb).toBe(-6);
  expect(result.warnings).toContain(
    POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
  );
  expect(result.warnings.join(" ")).not.toContain("does not alias lab Rw/STC/C/Ctr to field or building outputs");
}

describe("post-V1 wall advanced-wall source-absent field/building adapter owner", () => {
  it("keeps Gate AY lab outputs on the element-lab direct-curve basis", () => {
    const lab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);

    expect(lab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(lab.airborneBasis?.origin).toBe("family_physics_prediction");
    expect(lab.airborneCandidateResolution?.selectedCandidateId).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_CANDIDATE_ID
    );
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });
    expect(lab.warnings).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING);
  });

  it("adapts the owned Gate AY direct curve into field-between-rooms outputs", () => {
    const field = calculateAdvancedWall(buildFieldContext(), FIELD_BUILDING_OUTPUTS);

    expectFieldBuildingMetrics(field, GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S"
      ])
    );
    expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
  });

  it("adapts the owned Gate AY direct curve into building-prediction outputs", () => {
    const building = calculateAdvancedWall(buildBuildingContext(), FIELD_BUILDING_OUTPUTS);

    expectFieldBuildingMetrics(building, GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(building.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "buildingPredictionOutputBasis",
        "flankingJunctionClass",
        "conservativeFlankingAssumption",
        "junctionCouplingLengthM",
        "ISO_12354_1_direct_separating_element_frequency_curve_owner"
      ])
    );
    expect(building.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    expect(building.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  });

  it("does not relabel lab companions as field/building outputs in mixed requests", () => {
    const mixed = calculateAdvancedWall(buildFieldContext(), MIXED_ALIAS_OUTPUTS);

    expect(mixed.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_ALIAS_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.metrics.estimatedRwPrimeDb).toBe(63);
    expect(mixed.metrics.estimatedStc).toBe(65);
    expect(mixed.metrics.estimatedCDb).toBe(-1.1);
    expect(mixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
    );
    expect(mixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
    );
    expect(mixed.warnings.join(" ")).not.toContain("Unsupported target outputs: STC, C");
  });

  it("keeps missing context and Gate AY field/building requests outside the owner", () => {
    const incompleteField = calculateAdvancedWall(
      {
        advancedWall: {
          ...cloneGateAYAdvancedWallInput(),
          outputBasis: "field_between_rooms",
          targetOutputs: [...FIELD_BUILDING_OUTPUTS]
        },
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3200,
        receivingRoomVolumeM3: 55
      },
      FIELD_BUILDING_OUTPUTS
    );
    const incompleteBuilding = calculateAdvancedWall(
      {
        ...buildBuildingContext(),
        sourceRoomVolumeM3: undefined
      },
      FIELD_BUILDING_OUTPUTS
    );
    const gateAYBoundary = calculateGateAYAdvancedWallRuntimeCorridor({
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "field_between_rooms",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    });

    for (const result of [incompleteField, incompleteBuilding]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
      expect(result.warnings).not.toContain(
        POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
      );
    }
    expect(gateAYBoundary.status).toBe("unsupported_boundary");
    expect(gateAYBoundary.supportedTargetOutputs).toEqual([]);
    expect(gateAYBoundary.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(gateAYBoundary.warning).toContain("does not alias lab Rw/STC/C/Ctr to field or building outputs");
  });

  it("documents the landed owner, counters, and selected coverage-refresh handoff", () => {
    expect(OWNER_FILE).toBe(
      "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts"
    );
    expect(SELECTED_CANDIDATE_ID).toBe("wall.advanced_wall_source_absent_field_building_adapter_owner");
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 2,
      newCalculableTargetOutputs: 10,
      runtimeBasisPromotions: 2,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 10,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 6
    });
    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc, docPath).toContain(PREVIOUS_RERANK_ACTION);
      expect(doc, docPath).toContain(PREVIOUS_RERANK_STATUS);
      expect(doc, docPath).toContain(PREVIOUS_RERANK_FILE);
      expect(doc, docPath).toContain(PREVIOUS_RERANK_PLAN_DOC);
      expect(doc, docPath).toContain(OWNER_ACTION);
      expect(doc, docPath).toContain(OWNER_STATUS);
      expect(doc, docPath).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, docPath).toContain(SELECTED_NEXT_ACTION);
      expect(doc, docPath).toContain(SELECTED_NEXT_FILE);
      expect(doc, docPath).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_NEXT_LABEL);
      expect(doc, docPath).toContain("newCalculableRequestShapes: 2");
      expect(doc, docPath).toContain("newCalculableTargetOutputs: 10");
      expect(doc, docPath).toContain("runtimeBasisPromotions: 2");
      expect(doc, docPath).toContain("runtimeValuesMoved 10");
      expect(doc, docPath).toContain("sourceRowsImported: 0");
    }
  });
});
