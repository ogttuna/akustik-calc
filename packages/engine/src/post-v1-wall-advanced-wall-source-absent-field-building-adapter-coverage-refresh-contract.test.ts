import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  calculateGateAYAdvancedWallRuntimeCorridor
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import {
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING,
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
} from "./advanced-wall-source-absent-field-building-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_adapter_owner";

const COVERAGE_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const COVERAGE_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall advanced-wall source-absent field/building adapter coverage refresh";

const COVERAGE_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
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
  COVERAGE_PLAN_DOC,
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

function buildFieldContext(): AirborneContext {
  return {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
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

function expectFieldBuildingValues(
  result: ReturnType<typeof calculateAssembly>,
  method: string
) {
  expect(result.airborneBasis?.method).toBe(method);
  expect(result.airborneBasis?.origin).toBe("family_physics_prediction");
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(63);
  expect(result.metrics.estimatedDnWDb).toBe(64);
  expect(result.metrics.estimatedDnADb).toBe(62.6);
  expect(result.metrics.estimatedDnTwDb).toBe(66);
  expect(result.metrics.estimatedDnTADb).toBe(65);
  expect(result.warnings).toContain(
    POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
  );
}

describe("post-V1 wall advanced-wall source-absent field/building adapter coverage refresh", () => {
  it("lands a no-runtime refresh over the advanced-wall field/building owner", () => {
    expect(COVERAGE_COUNTERS).toEqual({
      coverageRefreshContractFilesTouched: 1,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(existsSync(join(REPO_ROOT, OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("re-probes the landed owner values without moving runtime", () => {
    const lab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);
    const field = calculateAdvancedWall(buildFieldContext(), FIELD_BUILDING_OUTPUTS);
    const building = calculateAdvancedWall(buildBuildingContext(), FIELD_BUILDING_OUTPUTS);

    expect(lab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });

    expectFieldBuildingValues(field, GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expectFieldBuildingValues(building, GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(building.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  }, 30000);

  it("keeps lab aliases and missing context protected after the owner", () => {
    const mixed = calculateAdvancedWall(buildFieldContext(), MIXED_ALIAS_OUTPUTS);
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
    const gateAYBoundary = calculateGateAYAdvancedWallRuntimeCorridor({
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "building_prediction",
      targetOutputs: [...FIELD_BUILDING_OUTPUTS]
    });

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_ALIAS_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.metrics.estimatedRwPrimeDb).toBe(63);
    expect(mixed.metrics.estimatedStc).toBe(65);
    expect(mixed.metrics.estimatedCDb).toBe(-1.1);
    expect(mixed.warnings).toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
    );
    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(incompleteField.warnings).not.toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
    );
    expect(gateAYBoundary.status).toBe("unsupported_boundary");
    expect(gateAYBoundary.supportedTargetOutputs).toEqual([]);
    expect(gateAYBoundary.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  });

  it("keeps docs aligned with the coverage refresh and next rerank handoff", () => {
    for (const docPath of REQUIRED_DOCS) {
      const doc = readRepoFile(docPath);

      expect(doc, docPath).toContain(OWNER_ACTION);
      expect(doc, docPath).toContain(OWNER_STATUS);
      expect(doc, docPath).toContain(OWNER_FILE);
      expect(doc, docPath).toContain(OWNER_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_CANDIDATE_ID);
      expect(doc, docPath).toContain(COVERAGE_ACTION);
      expect(doc, docPath).toContain(COVERAGE_STATUS);
      expect(doc, docPath).toContain(COVERAGE_FILE);
      expect(doc, docPath).toContain(COVERAGE_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_NEXT_ACTION);
      expect(doc, docPath).toContain(SELECTED_NEXT_FILE);
      expect(doc, docPath).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, docPath).toContain(SELECTED_NEXT_LABEL);
      expect(doc, docPath).toContain("coverageRefreshContractFilesTouched: 1");
      expect(doc, docPath).toContain("runtimeValuesMoved 0");
      expect(doc, docPath).toContain("runtimeFormulaRetunes: 0");
      expect(doc, docPath).toContain("sourceRowsImported: 0");
      expect(doc, docPath).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
