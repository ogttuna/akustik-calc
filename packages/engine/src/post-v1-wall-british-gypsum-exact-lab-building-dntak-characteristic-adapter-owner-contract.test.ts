import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_WARNING,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING
} from "./british-gypsum-exact-lab-field-building-adapter";
import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner";

const OWNER_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md";
const OWNER_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 5
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

const CASES = [
  {
    directRw: 55,
    dna: 48,
    dnta: 49.1,
    dntak: 48,
    dntw: 50,
    dnw: 49,
    id: "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "one_side",
    rwPrime: 49
  },
  {
    directRw: 58,
    dna: 51,
    dnta: 52.1,
    dntak: 51,
    dntw: 53,
    dnw: 52,
    id: "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "both_sides",
    rwPrime: 52
  }
] as const;

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

function officialRow(id: string): WallTimberLightweightOfficialSourceRow {
  const row = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
    (entry): entry is WallTimberLightweightOfficialSourceRow =>
      entry.kind === "official_row" && entry.id === id
  );

  if (!row) {
    throw new Error(`Missing official source row ${id}`);
  }

  return row;
}

function baseContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...row.airborneContext,
    airtightness: "good",
    connectionType: "resilient_channel",
    panelHeightMm: 2500,
    panelWidthMm: 4000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 40,
    resilientBarSideCount,
    sourceRoomVolumeM3: 42,
    studSpacingMm: 600,
    studType: "resilient_stud"
  };
}

function fieldContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...baseContext(row, resilientBarSideCount),
    contextMode: "field_between_rooms"
  };
}

function buildingContext(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...baseContext(row, resilientBarSideCount),
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "single_conservative_path",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_cross_junction",
    junctionCouplingLengthM: 3.2
  };
}

function calculateBritishGypsum(
  testCase: (typeof CASES)[number],
  airborneContext: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = CHARACTERISTIC_BUILDING_OUTPUTS
) {
  const row = officialRow(testCase.id);

  return calculateAssembly(row.layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectOwnedCharacteristicDnTAk(testCase: (typeof CASES)[number]) {
  const row = officialRow(testCase.id);
  const result = calculateBritishGypsum(
    testCase,
    buildingContext(row, testCase.resilientBarSideCount)
  );

  expect(result.supportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTAkDb: testCase.dntak,
    estimatedDnTADb: testCase.dnta
  });
  expect(result.ratings.field).toMatchObject({
    DnTA: testCase.dnta,
    DnTAk: testCase.dntak
  });
  expect(result.ratings.field?.basis).toContain(
    "nen_5077_characteristic_dntak_from_gate_ar_building_prediction"
  );
  expect(result.airborneBasis).toMatchObject({
    exactSourceId: testCase.id,
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      `exactBritishGypsumSourceRow:${testCase.id}`,
      "resilientBarSideCount:one_side_or_both_sides",
      "britishGypsumExactLabRwDirectCurve",
      "buildingCharacteristicAdapter:DnTAk",
      "GateI_or_GateAR_field_building_adapter_owner"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
    valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: testCase.dntak }])
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING,
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING,
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_WARNING,
      expect.stringMatching(/Gate AR characteristic DnT,A,k adapter active/)
    ])
  );
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

describe("post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter owner", () => {
  it("lands the runtime owner after the A-weighted field/building coverage refresh", () => {
    expect(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_SELECTED_CANDIDATE_ID).toBe(
      OWNER_CANDIDATE_ID
    );
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

  it.each(CASES)("opens building DnT,A,k for exact British Gypsum $id", (testCase) => {
    expectOwnedCharacteristicDnTAk(testCase);
  });

  it("keeps DnT,A,k available beside mixed British Gypsum exact-lab Gate AR building outputs", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const result = calculateBritishGypsum(
      testCase,
      buildingContext(row, testCase.resilientBarSideCount),
      MIXED_BUILDING_OUTPUTS
    );

    expect(result.supportedTargetOutputs).toEqual([...MIXED_BUILDING_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedDnADb: testCase.dna,
      estimatedDnTAkDb: testCase.dntak,
      estimatedDnTADb: testCase.dnta,
      estimatedDnTwDb: testCase.dntw,
      estimatedDnWDb: testCase.dnw,
      estimatedRwPrimeDb: testCase.rwPrime
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      supportedMetrics: expect.arrayContaining(["DnT,A,k"]),
      valuePins: expect.arrayContaining([{ metric: "DnT,A,k", value: testCase.dntak }])
    });
  });

  it("keeps missing input, apparent-only basis, field, lab, and impact aliases outside", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const completeBuilding = buildingContext(row, testCase.resilientBarSideCount);
    const missingVolume = calculateBritishGypsum(testCase, {
      ...completeBuilding,
      receivingRoomVolumeM3: undefined
    });
    const missingOutputBasis = calculateBritishGypsum(testCase, {
      ...completeBuilding,
      buildingPredictionOutputBasis: undefined
    });
    const apparentOnly = calculateBritishGypsum(testCase, {
      ...completeBuilding,
      buildingPredictionOutputBasis: "apparent"
    });
    const field = calculateBritishGypsum(
      testCase,
      fieldContext(row, testCase.resilientBarSideCount),
      FIELD_OUTPUTS
    );
    const lab = calculateBritishGypsum(
      testCase,
      {
        ...baseContext(row, testCase.resilientBarSideCount),
        contextMode: "element_lab"
      },
      LAB_MIXED_OUTPUTS
    );
    const impact = calculateBritishGypsum(
      testCase,
      {
        ...baseContext(row, testCase.resilientBarSideCount),
        contextMode: "element_lab"
      },
      IMPACT_OUTPUTS
    );

    expect(missingVolume.supportedTargetOutputs).toEqual([]);
    expect(missingVolume.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingVolume.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingVolume.airborneBasis?.missingPhysicalInputs).toContain("receivingRoomVolumeM3");

    expect(missingOutputBasis.supportedTargetOutputs).toEqual([]);
    expect(missingOutputBasis.unsupportedTargetOutputs).toEqual([...CHARACTERISTIC_BUILDING_OUTPUTS]);
    expect(missingOutputBasis.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingOutputBasis.airborneBasis?.missingPhysicalInputs).toContain("buildingPredictionOutputBasis");

    expect(apparentOnly.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(apparentOnly.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(apparentOnly.metrics.estimatedDnTAkDb).toBeUndefined();

    expect(field.supportedTargetOutputs).toEqual(["DnT,A"]);
    expect(field.unsupportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    });
    expect(field.metrics.estimatedDnTAkDb).toBeUndefined();

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
