import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow,
  type WallTimberLightweightSourceCorpusClassification,
  type WallTimberLightweightSourceCorpusReasonCode,
  type WallTimberLightweightSourceCorpusTopology
} from "./wall-timber-lightweight-source-corpus";

type LinkedHoldoutDatasetRow = {
  assemblyMeta: AirborneContext;
  expectedValue: number;
  id: string;
  layers: LayerInput[];
  toleranceValue: number;
};

type LinkedHoldoutDataset = {
  cases: LinkedHoldoutDatasetRow[];
};

type AuditCase = {
  airborneContext: AirborneContext;
  classification: WallTimberLightweightSourceCorpusClassification;
  classificationReasonCode: WallTimberLightweightSourceCorpusReasonCode;
  expectedRw: number;
  id: string;
  layers: LayerInput[];
  toleranceDb: number;
  topology: WallTimberLightweightSourceCorpusTopology;
};

type AuditResult = {
  actualRw: number;
  errorDb: number;
  result: ReturnType<typeof calculateAssembly>;
  testCase: AuditCase;
};

const TARGET_OUTPUTS = ["Rw"] as const;

const CLASSIFICATION_THRESHOLDS: Record<
  WallTimberLightweightSourceCorpusClassification,
  { caseCount: number; thresholdMaeDb: number; thresholdMaxDb: number }
> = {
  exact_import_landed: {
    caseCount: 6,
    thresholdMaeDb: 0,
    thresholdMaxDb: 0
  },
  secondary_benchmark: {
    caseCount: 1,
    thresholdMaeDb: 1.5,
    thresholdMaxDb: 2
  },
  holdout_only: {
    caseCount: 2,
    thresholdMaeDb: 0,
    thresholdMaxDb: 0
  }
};

const LIVE_TIMBER_PRESET_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LIVE_TIMBER_PRESET_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "wood_stud"
};

function readLinkedHoldoutDataset(): LinkedHoldoutDataset {
  const raw = readFileSync(new URL(`../fixtures/${WALL_TIMBER_LIGHTWEIGHT_LINKED_HOLDOUT_DATASET}`, import.meta.url), "utf8");
  return JSON.parse(raw) as LinkedHoldoutDataset;
}

function buildAuditCases(): AuditCase[] {
  const linkedHoldoutDataset = readLinkedHoldoutDataset();
  const linkedHoldoutMap = new Map(linkedHoldoutDataset.cases.map((entry) => [entry.id, entry] as const));

  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.map((entry) => {
    if (entry.kind === "official_row") {
      return {
        airborneContext: entry.airborneContext as AirborneContext,
        classification: entry.classification,
        classificationReasonCode: entry.classificationReasonCode,
        expectedRw: entry.expectedRw,
        id: entry.id,
        layers: entry.layers,
        toleranceDb: entry.toleranceDb,
        topology: entry.topology
      } satisfies AuditCase;
    }

    const linkedRow = linkedHoldoutMap.get(entry.linkedCaseId);

    expect(linkedRow, entry.id).toBeDefined();

    if (!linkedRow) {
      throw new Error(`${entry.id} linked holdout row missing`);
    }

    return {
      airborneContext: linkedRow.assemblyMeta,
      classification: entry.classification,
      classificationReasonCode: entry.classificationReasonCode,
      expectedRw: linkedRow.expectedValue,
      id: entry.id,
      layers: linkedRow.layers,
      toleranceDb: linkedRow.toleranceValue,
      topology: entry.topology
    } satisfies AuditCase;
  });
}

function evaluateAuditCase(testCase: AuditCase): AuditResult {
  const result = calculateAssembly(testCase.layers, {
    airborneContext: testCase.airborneContext,
    calculator: "dynamic",
    targetOutputs: TARGET_OUTPUTS
  });
  const actualRw = result.ratings.iso717?.Rw;

  expect(actualRw, `${testCase.id} actual Rw`).not.toBeNull();

  if (actualRw == null) {
    throw new Error(`${testCase.id} returned null Rw`);
  }

  return {
    actualRw,
    errorDb: Math.abs(actualRw - testCase.expectedRw),
    result,
    testCase
  };
}

function hasExactLayerSignature(
  left: readonly LayerInput[],
  right: readonly LayerInput[]
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (layer, index) =>
        layer.materialId === right[index]?.materialId &&
        layer.thicknessMm === right[index]?.thicknessMm
    )
  );
}

function hasExactContextSignature(
  left: AirborneContext,
  right: AirborneContext
): boolean {
  return (
    left.contextMode === right.contextMode &&
    left.connectionType === right.connectionType &&
    left.studType === right.studType &&
    left.studSpacingMm === right.studSpacingMm
  );
}

function expectTraceNote(
  result: AuditResult,
  pattern: RegExp,
  label: string
): void {
  expect(
    result.result.dynamicAirborneTrace?.notes.some((note: string) => pattern.test(note)),
    `${result.testCase.id} ${label}`
  ).toBe(true);
}

function expectNoTraceNote(
  result: AuditResult,
  pattern: RegExp,
  label: string
): void {
  expect(
    result.result.dynamicAirborneTrace?.notes.some((note: string) => pattern.test(note)),
    `${result.testCase.id} ${label}`
  ).toBe(false);
}

function expectCurrentDynamicBenchmarkPosture(result: AuditResult): void {
  expect(result.result.calculatorId, `${result.testCase.id} calculator`).toBe("dynamic");
  expect(result.result.metrics.method, `${result.testCase.id} method`).toBe("dynamic");
  expect(result.result.dynamicAirborneTrace?.detectedFamily, `${result.testCase.id} family`).toBe("stud_wall_system");
  expect(result.result.dynamicAirborneTrace?.strategy, `${result.testCase.id} strategy`).toBe(
    "stud_surrogate_blend+framed_wall_calibration"
  );
  expect(result.result.dynamicAirborneTrace?.confidenceClass, `${result.testCase.id} confidence`).toBe("low");
}

function resolveLayers(layers: readonly LayerInput[]) {
  const catalog = getDefaultMaterialCatalog();

  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  });
}

function expectWarning(
  warnings: readonly string[],
  pattern: RegExp,
  label: string
): void {
  expect(warnings.some((warning) => pattern.test(warning)), label).toBe(true);
}

function expectNoWarning(
  warnings: readonly string[],
  pattern: RegExp,
  label: string
): void {
  expect(warnings.some((warning) => pattern.test(warning)), label).toBe(false);
}

describe("wall timber/lightweight source audit", () => {
  it("keeps every timber/lightweight source-corpus row inside the defended current-engine Rw corridor", () => {
    const auditCases = buildAuditCases();

    for (const [classification, threshold] of Object.entries(CLASSIFICATION_THRESHOLDS) as Array<
      [WallTimberLightweightSourceCorpusClassification, (typeof CLASSIFICATION_THRESHOLDS)[WallTimberLightweightSourceCorpusClassification]]
    >) {
      const cases = auditCases.filter((entry) => entry.classification === classification);
      const errors: string[] = [];
      let totalError = 0;
      let maxError = 0;

      expect(cases, `${classification} case count`).toHaveLength(threshold.caseCount);

      for (const testCase of cases) {
        const evaluation = evaluateAuditCase(testCase);

        totalError += evaluation.errorDb;
        maxError = Math.max(maxError, evaluation.errorDb);

        if (evaluation.errorDb > testCase.toleranceDb) {
          errors.push(
            `${testCase.id}: expected ${testCase.expectedRw.toFixed(1)} got ${evaluation.actualRw.toFixed(1)} | error ${evaluation.errorDb.toFixed(2)} dB > tolerance ${testCase.toleranceDb.toFixed(1)} dB`
          );
        }
      }

      const mae = totalError / Math.max(cases.length, 1);

      expect(errors).toEqual([]);
      expect(mae, `${classification} mae`).toBeLessThanOrEqual(threshold.thresholdMaeDb);
      expect(maxError, `${classification} max`).toBeLessThanOrEqual(threshold.thresholdMaxDb);
    }
  });

  it("keeps landed direct timber rows on the exact catalog lane while secondary and holdout rows stay on their defended benchmark surfaces", () => {
    const auditCases = buildAuditCases();
    const evaluations = new Map(auditCases.map((testCase) => [testCase.id, evaluateAuditCase(testCase)] as const));

    const officialRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
      (entry): entry is WallTimberLightweightOfficialSourceRow => entry.kind === "official_row"
    );

    for (const row of officialRows) {
      const evaluation = evaluations.get(row.id);

      expect(evaluation, row.id).toBeDefined();

      if (!evaluation) {
        throw new Error(`${row.id} evaluation missing`);
      }

      if (row.classification === "exact_import_landed") {
        const exactMatch = findVerifiedAirborneAssemblyMatch(resolveLayers(row.layers), row.airborneContext as AirborneContext);

        expect(exactMatch?.id, `${row.id} exact match`).toBe(row.id);
        expectWarning(
          evaluation.result.warnings,
          /Curated exact airborne lab match active:/i,
          `${row.id} exact warning`
        );
        if (row.classificationReasonCode === "resilient_bar_side_count_topology_exactly_representable") {
          expect(evaluation.result.dynamicAirborneTrace?.familyDecisionClass, `${row.id} decision`).toBe("ambiguous");
          expectTraceNote(evaluation, /Resilient stud\/channel metadata activated/i, "resilient exact note");
        } else {
          expect(evaluation.result.dynamicAirborneTrace?.familyDecisionClass, `${row.id} decision`).toBe("narrow");
          expectNoTraceNote(evaluation, /Resilient stud\/channel metadata activated/i, "resilient benchmark note");
        }
        continue;
      }

      expectCurrentDynamicBenchmarkPosture(evaluation);
      expectNoWarning(
        evaluation.result.warnings,
        /Curated exact airborne lab match active:/i,
        `${row.id} exact warning`
      );

      if (row.classificationReasonCode === "resilient_bar_side_count_not_explicitly_modeled") {
        expect(evaluation.result.dynamicAirborneTrace?.familyDecisionClass, `${row.id} decision`).toBe("ambiguous");
        expectTraceNote(evaluation, /double board calibration corridor/i, "double-board corridor note");
        expectTraceNote(evaluation, /Resilient stud\/channel metadata activated/i, "resilient benchmark note");
      } else {
        expect(evaluation.result.dynamicAirborneTrace?.familyDecisionClass, `${row.id} decision`).toBe("ambiguous");
        expectTraceNote(evaluation, /double board calibration corridor/i, "double-board corridor note");
        expectNoTraceNote(evaluation, /Resilient stud\/channel metadata activated/i, "resilient benchmark note");
      }
    }

    const holdoutSingleBoard = evaluations.get("knauf_w111_75_100_60mw_a_rw_holdout_2026");
    const holdoutDoubleBoard = evaluations.get("knauf_w112_75_125_60mw_a_rw_holdout_2026");

    expect(holdoutSingleBoard).toBeDefined();
    expect(holdoutDoubleBoard).toBeDefined();

    if (!holdoutSingleBoard || !holdoutDoubleBoard) {
      throw new Error("linked holdout evaluations missing");
    }

    expectCurrentDynamicBenchmarkPosture(holdoutSingleBoard);
    expectCurrentDynamicBenchmarkPosture(holdoutDoubleBoard);
    expectNoWarning(holdoutSingleBoard.result.warnings, /Curated exact airborne lab match active:/i, "single-board holdout exact warning");
    expectNoWarning(holdoutDoubleBoard.result.warnings, /Curated exact airborne lab match active:/i, "double-board holdout exact warning");
    expectTraceNote(holdoutSingleBoard, /single board calibration corridor/i, "single-board holdout note");
    expectTraceNote(holdoutDoubleBoard, /double board calibration corridor/i, "double-board holdout note");
  });

  it("proves the live timber preset is still family-adjacent to the corpus but not exact-topology-equal to any landed exact row", () => {
    const liveResult = calculateAssembly(LIVE_TIMBER_PRESET_STACK, {
      airborneContext: LIVE_TIMBER_PRESET_CONTEXT,
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const exactImportRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
      (entry): entry is WallTimberLightweightOfficialSourceRow =>
        entry.kind === "official_row" && entry.classification === "exact_import_landed"
    );
    const exactTopologyMatches = exactImportRows.filter(
      (entry) =>
        hasExactLayerSignature(LIVE_TIMBER_PRESET_STACK, entry.layers) &&
        hasExactContextSignature(LIVE_TIMBER_PRESET_CONTEXT, entry.airborneContext as AirborneContext)
    );

    expect(liveResult.ratings.iso717?.Rw).toBe(50);
    expect(liveResult.calculatorId).toBe("dynamic");
    expect(liveResult.metrics.method).toBe("dynamic");
    expect(liveResult.dynamicAirborneTrace?.detectedFamily).toBe("stud_wall_system");
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("stud_surrogate_blend+framed_wall_calibration");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(exactTopologyMatches).toEqual([]);
  });
});
