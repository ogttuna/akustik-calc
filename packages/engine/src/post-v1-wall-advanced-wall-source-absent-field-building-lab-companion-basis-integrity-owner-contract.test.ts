import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import {
  GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK
} from "./calculator-personal-use-mvp-coverage-sprint-gate-az";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
} from "./advanced-wall-source-absent-field-building-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-advanced-wall-source-absent-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_advanced_wall_source_absent_field_building_adapter_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner";

const OWNER_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-18.md";
const OWNER_STATUS =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_lab_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_basis_integrity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 8,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 8,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 7
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_MIXED_OUTPUTS = [
  "R'w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_MIXED_OUTPUTS = [
  "DnT,w",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/HIGH_ROI_CALCULATOR_IMPLEMENTATION_SELECTION_PLAN_2026-06-18.md",
  PREVIOUS_RERANK_PLAN_DOC,
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

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      implementationFile: PREVIOUS_RERANK_FILE,
      planDoc: PREVIOUS_RERANK_PLAN_DOC,
      selectedGate: PREVIOUS_RERANK_ACTION,
      status: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectLabCompanionValues(result: ReturnType<typeof calculateAssembly>) {
  expect(result.metrics).toMatchObject({
    estimatedCDb: -1.1,
    estimatedCtrDb: -6.4,
    estimatedRwDb: 65,
    estimatedStc: 65
  });
  expect(result.warnings).toContain(
    POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING
  );
  expect(result.warnings).toContain(
    POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
  );
}

describe("post-V1 wall advanced-wall source-absent field/building lab-companion basis integrity owner", () => {
  it("lands the runtime owner without source import, formula retune, or frontend changes", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_RERANK_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("publishes Gate AY lab companions next to field-between-rooms outputs", () => {
    const field = calculateAdvancedWall(buildFieldContext(), FIELD_MIXED_OUTPUTS);

    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(field.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics.estimatedRwPrimeDb).toBe(63);
    expectLabCompanionValues(field);
  }, 30000);

  it("publishes Gate AY lab companions next to building-prediction outputs", () => {
    const building = calculateAdvancedWall(buildBuildingContext(), BUILDING_MIXED_OUTPUTS);

    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(building.supportedTargetOutputs).toEqual([...BUILDING_MIXED_OUTPUTS]);
    expect(building.unsupportedTargetOutputs).toEqual([]);
    expect(building.metrics.estimatedDnTwDb).toBe(66);
    expectLabCompanionValues(building);
  }, 30000);

  it("records target-output independence closure while missing context stays outside", () => {
    const labOnlyField = calculateAdvancedWall(buildFieldContext(), LAB_OUTPUTS);
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
      FIELD_MIXED_OUTPUTS
    );
    const elementLab = calculateAdvancedWall(GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT, LAB_OUTPUTS);

    expect(labOnlyField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(labOnlyField.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnlyField.unsupportedTargetOutputs).toEqual([]);
    expectLabCompanionValues(labOnlyField);

    expect(incompleteField.supportedTargetOutputs).toEqual([]);
    expect(incompleteField.unsupportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(incompleteField.warnings).not.toContain(
      POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING
    );

    expect(elementLab.airborneBasis?.method).toBe(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD);
    expect(elementLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(elementLab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 65,
      estimatedStc: 65
    });
  }, 30000);

  it("keeps active docs aligned with the owner and selected coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(contents, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(contents, path).toContain(PREVIOUS_RERANK_FILE);
      expect(contents, path).toContain(PREVIOUS_RERANK_PLAN_DOC);
      expect(contents, path).toContain(OWNER_ACTION);
      expect(contents, path).toContain(OWNER_STATUS);
      expect(contents, path).toContain(OWNER_FILE);
      expect(contents, path).toContain(OWNER_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("newCalculableRequestShapes: 2");
      expect(contents, path).toContain("newCalculableTargetOutputs: 8");
      expect(contents, path).toContain("runtimeBasisPromotions: 2");
      expect(contents, path).toContain("runtimeValuesMoved 8");
      expect(contents, path).toContain("runtimeFormulaRetunes: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
