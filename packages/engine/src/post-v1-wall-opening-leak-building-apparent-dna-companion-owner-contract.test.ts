import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_opening_leak_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_opening_leak_building_apparent_dna_companion_owner";

const OWNER_ACTION =
  "post_v1_wall_opening_leak_building_apparent_dna_companion_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_OWNER_PLAN_2026-06-23.md";
const OWNER_STATUS =
  "post_v1_wall_opening_leak_building_apparent_dna_companion_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.opening_leak_building_apparent_dna_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall opening/leak building apparent Dn,w/Dn,A companion coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 2,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 4,
  sourceRowsImported: 0
} as const;

const FULL_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const APPARENT_COMPANION_OUTPUTS = ["Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];
const LAB_APPARENT_OUTPUTS = ["Rw", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const HOST_WALL_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  id: "door-01",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const BASE_OPENING_CONTEXT: AirborneContext = {
  airtightness: "good",
  hostWallAreaM2: 12,
  openingLeakElements: [OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  ...BASE_OPENING_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
};

const APPARENT_ONLY_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: "apparent"
};

const MISSING_FREQUENCY_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  frequencyBandSet: undefined
};

const MISSING_VOLUME_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
};

const MISSING_OUTPUT_BASIS_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
};

const FIELD_CONTEXT: AirborneContext = {
  ...BASE_OPENING_CONTEXT,
  contextMode: "field_between_rooms",
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
};

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  hostWallAreaM2: 12,
  openingLeakElements: [OPENING]
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

function calculateBuilding(
  airborneContext: AirborneContext = COMPLETE_BUILDING_CONTEXT,
  targetOutputs: readonly RequestedOutputId[] = FULL_BUILDING_OUTPUTS
) {
  return calculateAssembly(HOST_WALL_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
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

describe("post-V1 wall opening/leak building apparent Dn,w/Dn,A companion owner", () => {
  it("lands the runtime owner after the opening/leak DnT,A,k coverage refresh", () => {
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

  it("opens apparent Dn,w and Dn,A beside standardized opening/leak building outputs", () => {
    const result = calculateBuilding();

    expect(result.supportedTargetOutputs).toEqual([...FULL_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 31.1,
      estimatedDnTAkDb: 30.4,
      estimatedDnTADb: 31.3,
      estimatedDnTwDb: 32.1,
      estimatedDnWDb: 31.9,
      estimatedRwPrimeDb: 31.6
    });
    expect(result.ratings.field).toMatchObject({
      DnA: 31.1,
      DnTA: 31.3,
      DnTAk: 30.4,
      DnTw: 32.1,
      DnW: 31.9,
      RwPrime: 31.6
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 11,
      frequencyBands: { bandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET },
      method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
        expect.stringMatching(/Gate AR characteristic DnT,A,k adapter active/)
      ])
    );
  });

  it("opens only apparent outputs for apparent-only opening/leak building requests", () => {
    const result = calculateBuilding(APPARENT_ONLY_BUILDING_CONTEXT);

    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "Dn,A"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DnT,w", "DnT,A", "DnT,A,k"]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: 31.1,
      estimatedDnWDb: 31.9,
      estimatedRwPrimeDb: 31.6
    });
    expect(result.metrics.estimatedDnTAkDb).toBeUndefined();
    expect(result.metrics.estimatedDnTADb).toBeUndefined();
    expect(result.airborneBasis).toMatchObject({
      method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("keeps frequency, missing-input, field, lab, and impact boundaries honest", () => {
    const missingFrequency = calculateBuilding(MISSING_FREQUENCY_BUILDING_CONTEXT, APPARENT_COMPANION_OUTPUTS);
    const missingVolume = calculateBuilding(MISSING_VOLUME_BUILDING_CONTEXT, APPARENT_COMPANION_OUTPUTS);
    const missingOutputBasis = calculateBuilding(MISSING_OUTPUT_BASIS_BUILDING_CONTEXT, APPARENT_COMPANION_OUTPUTS);
    const field = calculateBuilding(FIELD_CONTEXT, FIELD_OUTPUTS);
    const lab = calculateBuilding(LAB_CONTEXT, LAB_APPARENT_OUTPUTS);
    const impact = calculateBuilding(LAB_CONTEXT, IMPACT_OUTPUTS);

    expect(missingFrequency.supportedTargetOutputs).toEqual(["Dn,w"]);
    expect(missingFrequency.unsupportedTargetOutputs).toEqual(["Dn,A"]);
    expect(missingFrequency.metrics).toMatchObject({
      estimatedDnWDb: 31.9
    });
    expect(missingFrequency.metrics.estimatedDnADb).toBeUndefined();
    expect(missingFrequency.airborneBasis).toMatchObject({
      method: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(missingFrequency.warnings).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_MISSING_FREQUENCY_WARNING);

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...APPARENT_COMPANION_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

    expect(missingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(missingOutputBasis.unsupportedTargetOutputs).toEqual([...APPARENT_COMPANION_OUTPUTS]);
    expect(missingOutputBasis.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingOutputBasis.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["buildingPredictionOutputBasis"])
    );

    expect(field.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
    expect(field.metrics).toMatchObject({
      estimatedDnADb: 35.9,
      estimatedDnWDb: 36.7
    });

    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Dn,w", "Dn,A"]);

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
      expect(content, path).toContain("newCalculableTargetOutputs: 2");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 4");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
