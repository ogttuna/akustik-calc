import type {
  AirborneCalculatorId,
  AirborneContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { AIRBORNE_CALCULATORS } from "./airborne-calculator";
import { calculateAssembly } from "./calculate-assembly";

export type AirborneBenchmarkMetricPath =
  | "rw"
  | "ratings.iso717.Rw"
  | "ratings.iso717.RwPrime"
  | "ratings.field.RwPrime"
  | "ratings.field.DnTw"
  | "ratings.field.DnTA"
  | "ratings.field.DnTAk"
  | "ratings.astmE413.STC"
  | "ratings.astmE413.ASTC";

export type AirborneBenchmarkCase = {
  airborneContext?: AirborneContext;
  catalog?: MaterialDefinition[];
  expectedValue: number;
  id: string;
  label: string;
  layers: LayerInput[];
  metricLabel: string;
  metricPath: AirborneBenchmarkMetricPath;
  source: string;
  toleranceValue: number | null;
  weight: number;
};

export type AirborneBenchmarkDataset = {
  cases: AirborneBenchmarkCase[];
  description: string;
  name: string;
};

export type AirborneBenchmarkCalculatorResult = {
  absErrorDb: number;
  calculatorId: AirborneCalculatorId;
  calculatorLabel: string;
  errorDb: number;
  predictedValue: number | null;
  sqErrorDb2: number;
};

export type AirborneBenchmarkCaseResult = {
  byCalculator: AirborneBenchmarkCalculatorResult[];
  expectedValue: number;
  id: string;
  label: string;
  metricLabel: string;
  metricPath: AirborneBenchmarkMetricPath;
  source: string;
  toleranceValue: number | null;
  weight: number;
  winners: AirborneCalculatorId[];
};

export type AirborneBenchmarkSummaryRow = {
  biasDb: number;
  calculatorId: AirborneCalculatorId;
  calculatorLabel: string;
  caseCount: number;
  maeDb: number;
  maxAbsErrorDb: number;
  rmseDb: number;
  winCount: number;
  withinToleranceCount: number;
};

export type AirborneBenchmarkReport = {
  caseResults: AirborneBenchmarkCaseResult[];
  summary: AirborneBenchmarkSummaryRow[];
};

export type RunAirborneBenchmarkOptions = {
  calculatorIds?: readonly AirborneCalculatorId[];
  targetOutputs?: readonly RequestedOutputId[];
};

const DEFAULT_TARGET_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "STC",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A"
];

const UPSTREAM_TO_LOCAL_MATERIAL_ALIASES: Record<string, string> = {
  generic_screed: "screed",
  gypsum: "gypsum_board"
};

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64) || "custom_material";
}

function pickFiniteNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function normalizeMetricPath(value: unknown): AirborneBenchmarkMetricPath {
  const raw = String(value ?? "rw").trim();
  const normalized = raw.toLowerCase().replace(/\s+/g, "");

  const aliases: Record<string, AirborneBenchmarkMetricPath> = {
    rw: "rw",
    "ratings.iso717.rw": "ratings.iso717.Rw",
    "ratings.iso717.rwprime": "ratings.iso717.RwPrime",
    "ratings.field.rwprime": "ratings.field.RwPrime",
    "ratings.field.dntw": "ratings.field.DnTw",
    "ratings.field.dnta": "ratings.field.DnTA",
    "ratings.field.dntak": "ratings.field.DnTA",
    "ratings.astme413.stc": "ratings.astmE413.STC",
    "ratings.astme413.astc": "ratings.astmE413.ASTC"
  };

  return aliases[normalized] ?? raw as AirborneBenchmarkMetricPath;
}

export function getAirborneBenchmarkMetricLabel(metricPath: AirborneBenchmarkMetricPath): string {
  const labels: Record<AirborneBenchmarkMetricPath, string> = {
    rw: "Rw",
    "ratings.iso717.Rw": "Rw",
    "ratings.iso717.RwPrime": "R'w",
    "ratings.field.RwPrime": "R'w",
    "ratings.field.DnTw": "DnT,w",
    "ratings.field.DnTA": "DnT,A",
    "ratings.field.DnTAk": "DnT,A,k",
    "ratings.astmE413.STC": "STC",
    "ratings.astmE413.ASTC": "ASTC"
  };

  return labels[metricPath] ?? metricPath;
}

export function getAirborneBenchmarkMetricValue(
  payload: unknown,
  metricPath: AirborneBenchmarkMetricPath
): number | null {
  if (metricPath === "rw") {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const result = payload as Record<string, unknown>;
    return pickFiniteNumber(
      result.rw,
      (result.metrics as Record<string, unknown> | undefined)?.estimatedRwDb,
      (((result.ratings as Record<string, unknown> | undefined)?.iso717 as Record<string, unknown> | undefined)?.Rw)
    );
  }

  return metricPath.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, payload) as number | null;
}

function coerceMaterialCategory(rawLayer: Record<string, unknown>): MaterialDefinition["category"] {
  const text = [
    rawLayer.category,
    rawLayer.materialName,
    rawLayer.materialId
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/gap|air/.test(text)) {
    return "gap";
  }

  if (/rockwool|glasswool|wool|insulation|fill|porous/.test(text)) {
    return "insulation";
  }

  if (/support|channel|clip|stud/.test(text)) {
    return "support";
  }

  if (/floor|finish|vinyl|laminate|tile|carpet/.test(text)) {
    return "finish";
  }

  return "mass";
}

function normalizeBenchmarkLayers(
  caseId: string,
  rawLayers: unknown
): { catalog: MaterialDefinition[]; layers: LayerInput[] } {
  if (!Array.isArray(rawLayers) || rawLayers.length === 0) {
    throw new Error(`Benchmark case ${caseId} is missing layers.`);
  }

  const catalog: MaterialDefinition[] = [];
  const layers: LayerInput[] = rawLayers.map((rawLayer, index) => {
    if (!rawLayer || typeof rawLayer !== "object") {
      throw new Error(`Benchmark case ${caseId} has an invalid layer at index ${index}.`);
    }

    const entry = rawLayer as Record<string, unknown>;
    const thicknessMm = safeNumber(entry.thicknessMm, Number.NaN);

    if (!Number.isFinite(thicknessMm) || !(thicknessMm > 0)) {
      throw new Error(`Benchmark case ${caseId} layer ${index} is missing a positive thickness.`);
    }

    if (typeof entry.materialId === "string" && entry.materialId.trim().length > 0) {
      return {
        materialId: UPSTREAM_TO_LOCAL_MATERIAL_ALIASES[entry.materialId.trim()] ?? entry.materialId.trim(),
        thicknessMm
      } satisfies LayerInput;
    }

    const materialName = String(entry.materialName ?? entry.name ?? `Custom Material ${index + 1}`).trim();
    const materialId = `${caseId}_${slugify(materialName)}_${index + 1}`;
    const originalCategory = String(entry.category ?? "").trim();
    const category = coerceMaterialCategory(entry);

    catalog.push({
      category,
      densityKgM3: Math.max(safeNumber(entry.density ?? entry.densityKgM3, 0), 0),
      id: materialId,
      name: materialName,
      notes: originalCategory || undefined,
      tags: [originalCategory, materialName].filter(Boolean).map((value) => String(value).toLowerCase())
    });

    return {
      materialId,
      thicknessMm
    } satisfies LayerInput;
  });

  return { catalog, layers };
}

export function normalizeAirborneBenchmarkDataset(payload: unknown): AirborneBenchmarkDataset {
  if (!payload || typeof payload !== "object") {
    throw new Error("Benchmark dataset must be an object.");
  }

  const rawDataset = payload as Record<string, unknown>;
  const rawCases = Array.isArray(rawDataset.cases) ? rawDataset.cases : null;

  if (!rawCases) {
    throw new Error("Benchmark dataset must contain a cases array.");
  }

  const cases = rawCases.map((rawCase, index) => {
    if (!rawCase || typeof rawCase !== "object") {
      throw new Error(`Benchmark case ${index} is invalid.`);
    }

    const entry = rawCase as Record<string, unknown>;
    const id = String(entry.id ?? `case_${index + 1}`).trim();
    const metricPath = normalizeMetricPath(entry.metricPath ?? "rw");
    const expectedValue = safeNumber(
      entry.expectedValue ?? entry.expectedRw ?? (entry.expected as Record<string, unknown> | undefined)?.value,
      Number.NaN
    );
    const toleranceValueRaw = entry.toleranceValue ?? entry.toleranceRw;
    const toleranceValue = typeof toleranceValueRaw === "number" && Number.isFinite(toleranceValueRaw)
      ? toleranceValueRaw
      : null;
    const weight = Math.max(safeNumber(entry.weight, 1), 0.0001);
    const airborneContext = entry.assemblyMeta as AirborneContext | undefined;
    const normalizedLayers = normalizeBenchmarkLayers(id, entry.layers);

    if (!id) {
      throw new Error(`Benchmark case ${index} is missing id.`);
    }

    if (!Number.isFinite(expectedValue)) {
      throw new Error(`Benchmark case ${id} is missing a finite expected value.`);
    }

    return {
      airborneContext,
      catalog: normalizedLayers.catalog.length > 0 ? normalizedLayers.catalog : undefined,
      expectedValue,
      id,
      label: String(entry.label ?? id),
      layers: normalizedLayers.layers,
      metricLabel: getAirborneBenchmarkMetricLabel(metricPath),
      metricPath,
      source: String(entry.source ?? ""),
      toleranceValue,
      weight
    } satisfies AirborneBenchmarkCase;
  });

  return {
    cases,
    description: String(rawDataset.description ?? ""),
    name: String(rawDataset.name ?? "Benchmark Set")
  };
}

export function buildAirborneBenchmarkSummary(
  caseResults: readonly AirborneBenchmarkCaseResult[],
  calculatorIds: readonly AirborneCalculatorId[] = AIRBORNE_CALCULATORS.map((calculator) => calculator.id)
): AirborneBenchmarkSummaryRow[] {
  const totals = new Map<AirborneCalculatorId, {
    biasWeightedNumerator: number;
    calculatorLabel: string;
    caseCount: number;
    maeWeightedNumerator: number;
    maxAbsErrorDb: number;
    rmseWeightedNumerator: number;
    weightSum: number;
    winCount: number;
    withinToleranceCount: number;
  }>();

  for (const calculatorId of calculatorIds) {
    totals.set(calculatorId, {
      biasWeightedNumerator: 0,
      calculatorLabel:
        AIRBORNE_CALCULATORS.find((calculator) => calculator.id === calculatorId)?.label ?? calculatorId,
      caseCount: 0,
      maeWeightedNumerator: 0,
      maxAbsErrorDb: 0,
      rmseWeightedNumerator: 0,
      weightSum: 0,
      winCount: 0,
      withinToleranceCount: 0
    });
  }

  for (const caseResult of caseResults) {
    const winners = new Set(caseResult.winners);

    for (const row of caseResult.byCalculator) {
      const total = totals.get(row.calculatorId);
      if (!total) {
        continue;
      }

      total.maeWeightedNumerator += row.absErrorDb * caseResult.weight;
      total.rmseWeightedNumerator += row.sqErrorDb2 * caseResult.weight;
      total.biasWeightedNumerator += row.errorDb * caseResult.weight;
      total.weightSum += caseResult.weight;
      total.caseCount += 1;
      total.maxAbsErrorDb = Math.max(total.maxAbsErrorDb, row.absErrorDb);

      if (typeof caseResult.toleranceValue === "number" && row.absErrorDb <= caseResult.toleranceValue) {
        total.withinToleranceCount += 1;
      }

      if (winners.has(row.calculatorId)) {
        total.winCount += 1;
      }
    }
  }

  return Array.from(totals.entries())
    .map(([calculatorId, total]) => {
      const weightSum = Math.max(total.weightSum, 1e-12);

      return {
        biasDb: total.biasWeightedNumerator / weightSum,
        calculatorId,
        calculatorLabel: total.calculatorLabel,
        caseCount: total.caseCount,
        maeDb: total.maeWeightedNumerator / weightSum,
        maxAbsErrorDb: total.maxAbsErrorDb,
        rmseDb: Math.sqrt(total.rmseWeightedNumerator / weightSum),
        winCount: total.winCount,
        withinToleranceCount: total.withinToleranceCount
      } satisfies AirborneBenchmarkSummaryRow;
    })
    .sort((left, right) => {
      if (left.maeDb !== right.maeDb) {
        return left.maeDb - right.maeDb;
      }

      if (left.rmseDb !== right.rmseDb) {
        return left.rmseDb - right.rmseDb;
      }

      return left.calculatorId.localeCompare(right.calculatorId);
    });
}

export function runAirborneBenchmark(
  cases: readonly AirborneBenchmarkCase[],
  options: RunAirborneBenchmarkOptions = {}
): AirborneBenchmarkReport {
  const calculatorIds = options.calculatorIds ?? AIRBORNE_CALCULATORS.map((calculator) => calculator.id);
  const targetOutputs = options.targetOutputs ?? DEFAULT_TARGET_OUTPUTS;

  const caseResults = cases.map((entry) => {
    const byCalculator = calculatorIds.map((calculatorId) => {
      const calculatorLabel =
        AIRBORNE_CALCULATORS.find((calculator) => calculator.id === calculatorId)?.label ?? calculatorId;

      try {
        const result = calculateAssembly(entry.layers, {
          airborneContext: entry.airborneContext,
          calculator: calculatorId,
          catalog: entry.catalog,
          targetOutputs
        });
        const predictedValue = getAirborneBenchmarkMetricValue(result, entry.metricPath);
        const errorDb = predictedValue === null ? Number.POSITIVE_INFINITY : predictedValue - entry.expectedValue;
        const absErrorDb = Number.isFinite(errorDb) ? Math.abs(errorDb) : Number.POSITIVE_INFINITY;

        return {
          absErrorDb,
          calculatorId,
          calculatorLabel,
          errorDb,
          predictedValue,
          sqErrorDb2: Number.isFinite(errorDb) ? errorDb * errorDb : Number.POSITIVE_INFINITY
        } satisfies AirborneBenchmarkCalculatorResult;
      } catch {
        return {
          absErrorDb: Number.POSITIVE_INFINITY,
          calculatorId,
          calculatorLabel,
          errorDb: Number.POSITIVE_INFINITY,
          predictedValue: null,
          sqErrorDb2: Number.POSITIVE_INFINITY
        } satisfies AirborneBenchmarkCalculatorResult;
      }
    });

    const bestAbsError = byCalculator.reduce((minimum, row) => Math.min(minimum, row.absErrorDb), Number.POSITIVE_INFINITY);
    const winners = byCalculator
      .filter((row) => Math.abs(row.absErrorDb - bestAbsError) < 1e-9)
      .map((row) => row.calculatorId);

    return {
      byCalculator,
      expectedValue: entry.expectedValue,
      id: entry.id,
      label: entry.label,
      metricLabel: entry.metricLabel,
      metricPath: entry.metricPath,
      source: entry.source,
      toleranceValue: entry.toleranceValue,
      weight: entry.weight,
      winners
    } satisfies AirborneBenchmarkCaseResult;
  });

  return {
    caseResults,
    summary: buildAirborneBenchmarkSummary(caseResults, calculatorIds)
  };
}
