import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD
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

const OWNER_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md";
const OWNER_STATUS =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall British Gypsum exact lab field/building adapter coverage refresh";

const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const MIXED_UNOWNED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
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
    dntw: 50,
    dnw: 49,
    id: "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "one_side",
    rwPrime: 49
  },
  {
    directRw: 58,
    dntw: 53,
    dnw: 52,
    id: "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "both_sides",
    rwPrime: 52
  }
] as const;

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 12,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 7
} as const;

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

function expectBritishGypsumRuntime(
  result: ReturnType<typeof calculateAssembly>,
  expected: {
    readonly directRw: number;
    readonly dntw: number;
    readonly dnw: number;
    readonly id: string;
    readonly method: string;
    readonly rwPrime: number;
    readonly selectedCandidateId: string;
  }
) {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTwDb: expected.dntw,
    estimatedDnWDb: expected.dnw,
    estimatedRwDb: expected.directRw,
    estimatedRwPrimeDb: expected.rwPrime
  });
  expect(result.airborneBasis).toMatchObject({
    exactSourceId: expected.id,
    method: expected.method,
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.method).not.toBe(
    POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD
  );
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      `exactBritishGypsumSourceRow:${expected.id}`,
      "resilientBarSideCount:one_side_or_both_sides",
      "britishGypsumExactLabRwDirectCurve",
      "GateI_or_GateAR_field_building_adapter_owner"
    ])
  );
  expect(result.airborneBasis?.assumptions).toEqual(
    expect.arrayContaining([
      expect.stringContaining("single-number lab Rw anchor")
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
    supportedMetrics: [...FIELD_BUILDING_OUTPUTS]
  });
  expect(result.layerCombinationResolverTrace?.valuePins).toEqual(
    expect.arrayContaining([
      { metric: "R'w", value: expected.rwPrime },
      { metric: "DnT,w", value: expected.dntw },
      { metric: "Dn,w", value: expected.dnw }
    ])
  );
  expect(result.warnings).toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING);
  expect(result.warnings.join("\n")).toContain("lab values must not be copied into field/building outputs");
}

describe("post-V1 wall British Gypsum exact lab field/building adapter owner", () => {
  it.each(CASES)(
    "$id adapts the exact lab Rw base into complete field and building outputs through Gate I / Gate AR",
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

      expectBritishGypsumRuntime(field, {
        ...testCase,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      });
      expect(field.airborneBasis?.requiredInputs).toEqual(
        expect.arrayContaining([
          "fieldContext.contextMode:field_between_rooms",
          "fieldContext.receivingRoomVolumeM3",
          "fieldContext.receivingRoomRt60S"
        ])
      );
      expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

      expectBritishGypsumRuntime(building, {
        ...testCase,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      });
      expect(building.airborneBasis?.requiredInputs).toEqual(
        expect.arrayContaining([
          "buildingPredictionOutputBasis",
          "flankingJunctionClass",
          "conservativeFlankingAssumption",
          "junctionCouplingLengthM",
          "ISO_12354_1_direct_separating_element_frequency_curve_owner"
        ])
      );
      expect(building.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
    }
  );

  it("keeps missing context, auto side-count, lab alias, and impact boundaries closed while later A-weighted owner opens Dn,A/DnT,A", () => {
    const testCase = CASES[0];
    const row = officialRow(testCase.id);
    const missingRt60 = calculateAssembly(row.layers, {
      airborneContext: {
        ...fieldContext(row, testCase.resilientBarSideCount),
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const autoSideCount = calculateAssembly(row.layers, {
      airborneContext: {
        ...fieldContext(row, testCase.resilientBarSideCount),
        resilientBarSideCount: "auto"
      },
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    const mixedUnowned = calculateAssembly(row.layers, {
      airborneContext: buildingContext(row, testCase.resilientBarSideCount),
      calculator: "dynamic",
      targetOutputs: MIXED_UNOWNED_OUTPUTS
    });

    expect(missingRt60.supportedTargetOutputs).toEqual([]);
    expect(missingRt60.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(missingRt60.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(missingRt60.airborneBasis?.missingPhysicalInputs).toContain("receivingRoomRt60S");
    expect(missingRt60.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING);

    expect(autoSideCount.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(autoSideCount.airborneBasis?.exactSourceId).not.toBe(testCase.id);
    expect(autoSideCount.warnings).not.toContain(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING);

    expect(mixedUnowned.supportedTargetOutputs).toEqual([...FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS]);
    expect(mixedUnowned.unsupportedTargetOutputs).toEqual([
      "Rw",
      "STC",
      "C",
      "Ctr",
      "IIC"
    ]);
    expect(mixedUnowned.metrics.estimatedDnADb).toBeDefined();
    expect(mixedUnowned.metrics.estimatedDnTADb).toBeDefined();
    expect(mixedUnowned.supportedTargetOutputs).toContain("Dn,A");
    expect(mixedUnowned.supportedTargetOutputs).toContain("DnT,A");
    expect(mixedUnowned.supportedTargetOutputs).not.toContain("Rw");
    expect(mixedUnowned.supportedTargetOutputs).not.toContain("STC");
    expect(mixedUnowned.supportedTargetOutputs).not.toContain("C");
    expect(mixedUnowned.supportedTargetOutputs).not.toContain("Ctr");
  });

  it("documents the landed owner, counters, and selected coverage refresh handoff", () => {
    expect(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID).toBe(
      "wall.british_gypsum_exact_lab_field_building_adapter_owner"
    );
    expect(OWNER_COUNTERS).toEqual({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 4,
      newCalculableTargetOutputs: 12,
      runtimeBasisPromotions: 4,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 12,
      sourceRowsImported: 0,
      unsupportedBoundariesProtected: 7
    });

    for (const path of [
      "AGENTS.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/DOCUMENTATION_MAP.md",
      "docs/calculator/NEXT_AGENT_BRIEF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const doc = readRepoFile(path);

      expect(doc, path).toContain(OWNER_ACTION);
      expect(doc, path).toContain(OWNER_FILE);
      expect(doc, path).toContain(OWNER_STATUS);
      expect(doc, path).toContain(SELECTED_NEXT_ACTION);
      expect(doc, path).toContain(SELECTED_NEXT_FILE);
      expect(doc, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(doc, path).toContain(SELECTED_NEXT_LABEL);
      expect(doc, path).toContain("newCalculableRequestShapes: 4");
      expect(doc, path).toContain("newCalculableTargetOutputs: 12");
      expect(doc, path).toContain("runtimeValuesMoved 12");
      expect(doc, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
