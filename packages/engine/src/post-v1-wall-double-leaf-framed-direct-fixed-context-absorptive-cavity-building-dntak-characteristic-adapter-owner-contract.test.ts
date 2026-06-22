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

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_direct_fixed_double_leaf_building_dntak_characteristic_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive-cavity building DnT,A,k characteristic adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
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
  PREVIOUS_REFRESH_PLAN_DOC,
  OWNER_PLAN_DOC,
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

function expectOwnedCharacteristicDnTAk(
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
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "directFixedContextAbsorptiveCavityOwner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner",
      "GateER_direct_fixed_field_building_adapter_owner",
      "receivingRoomVolumeM3",
      "buildingPredictionOutputBasis"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
    valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: expected.DnTAk }])
  });
  expect(result.warnings).toContain(GATE_ER_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_WARNING);
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousRefresh: {
      action: PREVIOUS_REFRESH_ACTION,
      file: PREVIOUS_REFRESH_FILE,
      selectionStatus: PREVIOUS_REFRESH_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive-cavity building DnT,A,k characteristic adapter owner", () => {
  it("lands the runtime owner after the compatible anchor-delta coverage refresh", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_REFRESH_FILE,
      PREVIOUS_REFRESH_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("opens DnT,A,k for full and partial direct-fixed absorptive-cavity building requests", () => {
    expectOwnedCharacteristicDnTAk(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, {
      DnTA: 31,
      DnTAk: 27.7
    });
    expectOwnedCharacteristicDnTAk(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT, {
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

  it("keeps missing input, apparent-only basis, field context, lab context, and impact aliases outside", () => {
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

  it("keeps docs and current-gate runner aligned with the landed runtime owner and selected refresh", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 1");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 2");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
