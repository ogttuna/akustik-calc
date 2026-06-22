import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING } from "./dynamic-airborne-gate-s-double-leaf-framed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_local_substitution_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall local-substitution building DnT,A,k characteristic adapter owner";

const COVERAGE_REFRESH_COUNTERS = {
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

const CHARACTERISTIC_BUILDING_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const LAB_MIXED_OUTPUTS = ["Rw", "DnT,A,k", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const TWO_BOARD_CONTEXT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 0.5,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 22.5,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  wallTopology: {
    ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: undefined
};

const DIRECT_FIXED_BUILDING_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50,
  sourceRoomVolumeM3: 45
};

const DIRECT_FIXED_BUILDING_APPARENT_ONLY_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const DIRECT_FIXED_BUILDING_MISSING_VOLUME_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const DIRECT_FIXED_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
};

const DIRECT_FIXED_FIELD_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function withBuildingContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50,
    sourceRoomVolumeM3: 45
  };
}

function calculateBuilding(
  airborneContext: AirborneContext = DIRECT_FIXED_BUILDING_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = CHARACTERISTIC_BUILDING_OUTPUTS
) {
  return calculateAssembly(TWO_BOARD_CONTEXT_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectCharacteristicValues(
  context: AirborneContext,
  expected: { readonly DnTA: number; readonly DnTAk: number }
) {
  const result = calculateBuilding(withBuildingContext(context));

  expect(result.supportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTAkDb: expected.DnTAk,
    estimatedDnTADb: expected.DnTA
  });
  expect(result.ratings.field).toMatchObject({
    DnTA: expected.DnTA,
    DnTAk: expected.DnTAk
  });
  expect(result.ratings.field?.basis).toContain(
    "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
  );
  expect(result.airborneBasis).toMatchObject({
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
    valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: expected.DnTAk }])
  });
  expect(result.warnings).toContain(GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING);
}

function coverageSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    previousOwner: {
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    reProbedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive-cavity building DnT,A,k characteristic adapter coverage refresh", () => {
  it("lands the no-runtime refresh after the direct-fixed characteristic adapter owner", () => {
    expect(coverageSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      reProbedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes full and partial direct-fixed absorptive-cavity DnT,A,k pins", () => {
    expectCharacteristicValues(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, {
      DnTA: 31,
      DnTAk: 27.7
    });
    expectCharacteristicValues(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT, {
      DnTA: 29,
      DnTAk: 25.7
    });
  });

  it("keeps DnT,A,k available beside mixed direct-fixed Gate AR building outputs", () => {
    const result = calculateBuilding(DIRECT_FIXED_BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTAkDb: 27.7,
      estimatedDnTADb: 31,
      estimatedDnTwDb: 32,
      estimatedDnWDb: 30,
      estimatedRwPrimeDb: 29
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
      valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: 27.7 }])
    });
  });

  it("keeps missing input, apparent-only basis, field, lab, and impact aliases outside", () => {
    const missingVolume = calculateBuilding(DIRECT_FIXED_BUILDING_MISSING_VOLUME_CONTEXT);
    const missingOutputBasis = calculateBuilding(DIRECT_FIXED_BUILDING_MISSING_OUTPUT_BASIS_CONTEXT);
    const missingFlow = calculateBuilding(withBuildingContext(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW));
    const apparentOnly = calculateBuilding(DIRECT_FIXED_BUILDING_APPARENT_ONLY_CONTEXT);
    const field = calculateBuilding(DIRECT_FIXED_FIELD_CONTEXT, FIELD_OUTPUTS);
    const lab = calculateBuilding(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, LAB_MIXED_OUTPUTS);
    const impact = calculateBuilding(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, IMPACT_OUTPUTS);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

    expect(missingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(missingOutputBasis.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingOutputBasis.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      origin: "needs_input"
    });

    expect(apparentOnly.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(apparentOnly.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(apparentOnly.metrics.estimatedDnTAkDb).toBeUndefined();

    expect(field.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(field.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["DnT,A,k", "DnT,A"]);

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the landed refresh and selected runtime owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
