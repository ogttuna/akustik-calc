import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
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
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter owner";

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

const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const MIXED_BOUNDARY_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Rw",
  "STC",
  "C",
  "Ctr",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const CASES = [
  {
    directRw: 55,
    dna: 48,
    dnta: 49.1,
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
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
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

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousOwner: {
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    reProbedCandidateId: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectRefreshRuntime(
  result: ReturnType<typeof calculateAssembly>,
  expected: {
    readonly directRw: number;
    readonly dna: number;
    readonly dnta: number;
    readonly dntw: number;
    readonly dnw: number;
    readonly id: string;
    readonly method: string;
    readonly outputs: readonly RequestedOutputId[];
    readonly rwPrime: number;
    readonly selectedCandidateId: string;
  }
) {
  expect(result.supportedTargetOutputs).toEqual([...expected.outputs]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: expected.dna,
    estimatedDnTADb: expected.dnta,
    estimatedDnTwDb: expected.dntw,
    estimatedDnWDb: expected.dnw,
    estimatedRwDb: expected.directRw,
    estimatedRwPrimeDb: expected.rwPrime
  });
  expect(result.airborneBasis).toMatchObject({
    exactSourceId: expected.id,
    method: expected.method,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: expected.selectedCandidateId,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: expected.method,
    supportedMetrics: [...expected.outputs]
  });
  expect(result.layerCombinationResolverTrace?.valuePins).toEqual(
    expect.arrayContaining([
      { metric: "Dn,A", value: expected.dna },
      { metric: "DnT,A", value: expected.dnta }
    ])
  );
  expect(result.warnings).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING);
  expect(result.warnings).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);
}

describe("post-V1 wall British Gypsum exact lab A-weighted field/building adapter coverage refresh", () => {
  it("lands the no-runtime refresh after the A-weighted field/building owner", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      reProbedCandidateId: "wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner",
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

  it.each(CASES)(
    "$id re-probes field and building A-weighted pins without moving runtime values",
    (testCase) => {
      const row = officialRow(testCase.id);
      const field = calculateAssembly(row.layers, {
        airborneContext: fieldContext(row, testCase.resilientBarSideCount),
        calculator: "dynamic",
        targetOutputs: FIELD_BUILDING_OUTPUTS
      });
      const building = calculateAssembly(row.layers, {
        airborneContext: buildingContext(row, testCase.resilientBarSideCount),
        calculator: "dynamic",
        targetOutputs: FIELD_BUILDING_OUTPUTS
      });

      expectRefreshRuntime(field, {
        ...testCase,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        outputs: FIELD_BUILDING_OUTPUTS,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      });
      expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

      expectRefreshRuntime(building, {
        ...testCase,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        outputs: FIELD_BUILDING_OUTPUTS,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      });
      expect(building.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    }
  );

  it("re-probes A-only field and building request shapes", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const fieldAOnly = calculateAssembly(row.layers, {
      airborneContext: fieldContext(row, testCase.resilientBarSideCount),
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const buildingAOnly = calculateAssembly(row.layers, {
      airborneContext: buildingContext(row, testCase.resilientBarSideCount),
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });

    expectRefreshRuntime(fieldAOnly, {
      ...testCase,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      outputs: A_WEIGHTED_OUTPUTS,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    });
    expectRefreshRuntime(buildingAOnly, {
      ...testCase,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      outputs: A_WEIGHTED_OUTPUTS,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    });
  });

  it("keeps missing-input, lab-alias, impact, and legacy auto boundaries explicit", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const missingRt60 = calculateAssembly(row.layers, {
      airborneContext: {
        ...fieldContext(row, testCase.resilientBarSideCount),
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const missingBuildingBasis = calculateAssembly(row.layers, {
      airborneContext: {
        ...buildingContext(row, testCase.resilientBarSideCount),
        buildingPredictionOutputBasis: undefined
      },
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const labAlias = calculateAssembly(row.layers, {
      airborneContext: {
        ...baseContext(row, testCase.resilientBarSideCount),
        contextMode: "element_lab"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", ...A_WEIGHTED_OUTPUTS]
    });
    const legacyAuto = calculateAssembly(row.layers, {
      airborneContext: {
        ...fieldContext(row, testCase.resilientBarSideCount),
        resilientBarSideCount: "auto"
      },
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const mixedBoundary = calculateAssembly(row.layers, {
      airborneContext: buildingContext(row, testCase.resilientBarSideCount),
      calculator: "dynamic",
      targetOutputs: MIXED_BOUNDARY_OUTPUTS
    });

    expect(missingRt60.supportedTargetOutputs).toEqual([]);
    expect(missingRt60.unsupportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(missingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingRt60.airborneBasis?.missingPhysicalInputs).toContain("receivingRoomRt60S");

    expect(missingBuildingBasis.supportedTargetOutputs).toEqual([]);
    expect(missingBuildingBasis.unsupportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(missingBuildingBasis.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingBuildingBasis.airborneBasis?.missingPhysicalInputs).toContain("buildingPredictionOutputBasis");

    expect(labAlias.supportedTargetOutputs).toEqual(["Rw"]);
    expect(labAlias.unsupportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(labAlias.warnings).not.toContain(
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING
    );

    expect(legacyAuto.airborneBasis?.exactSourceId).not.toBe(testCase.id);
    expect(legacyAuto.warnings).not.toContain(
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING
    );

    expect(mixedBoundary.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(mixedBoundary.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "IIC"]);
  });

  it("keeps docs and current-gate runner aligned with the landed refresh and selected runtime owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID);
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
