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

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.context_owned_porous_cavity_building_dntak_characteristic_adapter_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-context-owned-porous-cavity-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_OWNED_POROUS_CAVITY_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_context_owned_porous_cavity_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_compatible_anchor_delta_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_building_dntak_characteristic_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dntak-characteristic-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta building DnT,A,k characteristic adapter owner";

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
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_FRAMED_POROUS_CAVITY_STACK = [
  {
    materialId: "gypsum_board",
    thicknessMm: 15
  },
  {
    materialId: "gypsum_board",
    thicknessMm: 15
  }
] as const satisfies readonly LayerInput[];

const CONTEXT_OWNED_POROUS_CAVITY_BASE = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 90,
        depthMm: 90,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
} satisfies Pick<AirborneContext, "advancedWall" | "sharedTrack" | "studSpacingMm" | "wallTopology">;

const BUILDING_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
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

const APPARENT_ONLY_BUILDING_CONTEXT: AirborneContext = {
  ...BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const INCOMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const FIELD_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const LAB_CONTEXT: AirborneContext = {
  ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
  contextMode: "element_lab"
};

const MISSING_FLOW_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
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

function calculateBuilding(
  airborneContext: AirborneContext = BUILDING_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = CHARACTERISTIC_BUILDING_OUTPUTS
) {
  return calculateAssembly(DOUBLE_LEAF_FRAMED_POROUS_CAVITY_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
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

describe("post-V1 wall double-leaf/framed context-owned porous-cavity building DnT,A,k characteristic adapter coverage refresh", () => {
  it("lands the no-runtime refresh after the double-leaf/framed characteristic adapter owner", () => {
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

  it("re-probes the complete double-leaf/framed porous-cavity DnT,A,k pin", () => {
    const result = calculateBuilding();

    expect(result.supportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnTAkDb: 40.7,
      estimatedDnTADb: 43.6
    });
    expect(result.ratings.field).toMatchObject({
      DnTA: 43.6,
      DnTAk: 40.7
    });
    expect(result.ratings.field?.basis).toContain(
      "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
    );
    expect(result.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
  });

  it("keeps DnT,A,k available beside mixed Gate AR building outputs", () => {
    const result = calculateBuilding(BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 41.2,
      estimatedDnTAkDb: 40.7,
      estimatedDnTADb: 43.6,
      estimatedDnTwDb: 45,
      estimatedDnWDb: 42,
      estimatedRwPrimeDb: 42
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: 40.7 }])
    });
  });

  it("keeps missing input, apparent-only basis, field context, lab context, and impact aliases outside", () => {
    const missingVolume = calculateBuilding(INCOMPLETE_BUILDING_CONTEXT);
    const missingFlow = calculateBuilding(MISSING_FLOW_CONTEXT);
    const apparentOnly = calculateBuilding(APPARENT_ONLY_BUILDING_CONTEXT);
    const field = calculateBuilding(FIELD_CONTEXT, FIELD_OUTPUTS);
    const lab = calculateBuilding(LAB_CONTEXT);
    const impact = calculateBuilding(LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

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

    expect(lab.supportedTargetOutputs).toEqual([]);
    expect(lab.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);

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
