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

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";

const OWNER_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md";
const OWNER_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall British Gypsum exact lab A-weighted field/building adapter coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 8,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 8,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
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
  RERANK_PLAN_DOC,
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

function expectAWeightedRuntime(
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
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      `exactBritishGypsumSourceRow:${expected.id}`,
      "resilientBarSideCount:one_side_or_both_sides",
      "britishGypsumExactLabRwDirectCurve",
      "fieldBuildingAWeightedCompanionAdapter:DnA_DnTA",
      "GateI_or_GateAR_field_building_adapter_owner"
    ])
  );
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
  expect(result.warnings.join("\n")).not.toContain("Unsupported target outputs: Dn,A, DnT,A");
}

describe("post-V1 wall British Gypsum exact lab A-weighted field/building adapter owner", () => {
  it("lands a runtime owner from the selected rerank candidate and selects coverage refresh next", () => {
    expect(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID).toBe(
      "wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner"
    );
    expect({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousCoverageRefresh: PREVIOUS_COVERAGE_REFRESH_ACTION,
      previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: OWNER_STATUS
    }).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: OWNER_STATUS
    });
  });

  it.each(CASES)(
    "$id publishes field and building Dn,A/DnT,A beside exact-lab Gate I / Gate AR outputs",
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

      expectAWeightedRuntime(field, {
        ...testCase,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        outputs: FIELD_BUILDING_OUTPUTS,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      });
      expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

      expectAWeightedRuntime(building, {
        ...testCase,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        outputs: FIELD_BUILDING_OUTPUTS,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      });
      expect(building.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    }
  );

  it("supports A-only field and building request shapes without needing base metrics in the request", () => {
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

    expectAWeightedRuntime(fieldAOnly, {
      ...testCase,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      outputs: A_WEIGHTED_OUTPUTS,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    });
    expectAWeightedRuntime(buildingAOnly, {
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
    expect(missingRt60.warnings).not.toContain(
      POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING
    );

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

  it("keeps docs and current-gate runner aligned with the landed runtime owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_PLAN_DOC);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("newCalculableRequestShapes: 4");
      expect(content, path).toContain("newCalculableTargetOutputs: 8");
      expect(content, path).toContain("runtimeBasisPromotions: 4");
      expect(content, path).toContain("runtimeValuesMoved 8");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
