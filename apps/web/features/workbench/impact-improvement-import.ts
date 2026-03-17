"use client";

import type { ExactImpactImprovementSource } from "@dynecho/shared";

const IMPROVEMENT_FREQUENCIES_HZ = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];

export type ParsedImpactImprovementImport = {
  source: ExactImpactImprovementSource;
  valueCount: number;
};

function parseExactPairs(text: string): { frequenciesHz: number[]; improvementDb: number[] } | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < IMPROVEMENT_FREQUENCIES_HZ.length) {
    return null;
  }

  const pairs = lines.map((line) => Array.from(line.matchAll(/-?\d+(?:\.\d+)?/g), (match) => Number(match[0])));
  if (!pairs.every((pair) => pair.length === 2 && pair.every((value) => Number.isFinite(value)))) {
    return null;
  }

  const sortedPairs = [...pairs].sort((left, right) => left[0] - right[0]);

  return {
    frequenciesHz: sortedPairs.map((pair) => pair[0]),
    improvementDb: sortedPairs.map((pair) => pair[1])
  };
}

function parseValueOnly(text: string): { frequenciesHz: number[]; improvementDb: number[] } | null {
  const values = Array.from(text.matchAll(/-?\d+(?:\.\d+)?/g), (match) => Number(match[0]));

  if (values.length !== IMPROVEMENT_FREQUENCIES_HZ.length || !values.every((value) => Number.isFinite(value))) {
    return null;
  }

  return {
    frequenciesHz: [...IMPROVEMENT_FREQUENCIES_HZ],
    improvementDb: values
  };
}

function matchesImprovementGrid(frequenciesHz: readonly number[]): boolean {
  return (
    frequenciesHz.length === IMPROVEMENT_FREQUENCIES_HZ.length &&
    frequenciesHz.every((value, index) => value === IMPROVEMENT_FREQUENCIES_HZ[index])
  );
}

export function parseImpactImprovementImport(text: string): {
  error: string | null;
  parsed: ParsedImpactImprovementImport | null;
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { error: null, parsed: null };
  }

  const exactPairs = parseExactPairs(trimmed);
  const parsed = exactPairs ?? parseValueOnly(trimmed);

  if (!parsed) {
    return {
      error: "Use either `100 20` style freq/value rows or a 16-value DeltaLw curve on the 100..3150 Hz one-third-octave grid.",
      parsed: null
    };
  }

  if (!matchesImprovementGrid(parsed.frequenciesHz)) {
    return {
      error: "Exact improvement import currently requires the nominal 100..3150 Hz one-third-octave heavy-reference grid.",
      parsed: null
    };
  }

  return {
    error: null,
    parsed: {
      source: {
        frequenciesHz: parsed.frequenciesHz,
        improvementDb: parsed.improvementDb,
        referenceFloorType: "heavy_standard",
        standardMethod: "ISO 10140-3"
      },
      valueCount: parsed.improvementDb.length
    }
  };
}
