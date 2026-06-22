import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter";
import { calculateAssembly } from "./calculate-assembly";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_local_substitution_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.local_substitution_building_dntak_characteristic_adapter_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-local-substitution-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_local_substitution_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_opening_leak_building_dntak_characteristic_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall opening/leak building DnT,A,k characteristic adapter owner";

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

const LOCAL_ROCKWOOL_MLV_PLASTER_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LOCAL_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
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

const LOCAL_FIELD_CONTEXT: AirborneContext = {
  ...LOCAL_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...LOCAL_FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  sourceRoomVolumeM3: 50
};

const APPARENT_ONLY_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const MISSING_VOLUME_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const MISSING_OUTPUT_BASIS_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
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
  airborneContext: AirborneContext = COMPLETE_BUILDING_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = CHARACTERISTIC_BUILDING_OUTPUTS
) {
  return calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
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

describe("post-V1 wall local-substitution building DnT,A,k characteristic adapter coverage refresh", () => {
  it("lands the no-runtime refresh after the local-substitution characteristic adapter owner", () => {
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

  it("re-probes grouped triple-leaf local-substitution DnT,A,k pins", () => {
    const result = calculateBuilding();

    expect(result.supportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnTAkDb: 52.4,
      estimatedDnTADb: 53.9
    });
    expect(result.ratings.field).toMatchObject({
      DnTA: 53.9,
      DnTAk: 52.4
    });
    expect(result.ratings.field?.basis).toContain(
      "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
    );
    expect(result.airborneBasis).toMatchObject({
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_SELECTED_CANDIDATE_ID
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_BUILDING_WARNING,
        expect.stringMatching(/Gate AR characteristic DnT,A,k adapter active/)
      ])
    );
  });

  it("keeps DnT,A,k available beside mixed local-substitution building outputs", () => {
    const result = calculateBuilding(COMPLETE_BUILDING_CONTEXT, MIXED_BUILDING_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 52.4,
      estimatedDnTAkDb: 52.4,
      estimatedDnTADb: 53.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 51
    });
    expect(result.ratings.field?.basis).toContain(
      "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
    );
  });

  it("keeps missing input, apparent-only basis, field, lab, and impact aliases outside", () => {
    const missingVolume = calculateBuilding(MISSING_VOLUME_BUILDING_CONTEXT);
    const missingOutputBasis = calculateBuilding(MISSING_OUTPUT_BASIS_BUILDING_CONTEXT);
    const apparentOnly = calculateBuilding(APPARENT_ONLY_BUILDING_CONTEXT);
    const field = calculateBuilding(LOCAL_FIELD_CONTEXT, FIELD_OUTPUTS);
    const lab = calculateBuilding(LOCAL_CONTEXT, LAB_MIXED_OUTPUTS);
    const impact = calculateBuilding(LOCAL_CONTEXT, IMPACT_OUTPUTS);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomVolumeM3"],
      origin: "needs_input"
    });

    expect(missingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(missingOutputBasis.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingOutputBasis.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
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
