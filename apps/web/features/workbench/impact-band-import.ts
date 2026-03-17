"use client";

import type { ExactImpactSource, ExactImpactSourceLabOrField } from "@dynecho/shared";

const VALUE_ONLY_BAND_SETS = {
  five_octave_125_2000: {
    frequenciesHz: [125, 250, 500, 1000, 2000],
    label: "Octave 125..2000 Hz",
    summary: "Ln,w + CI only"
  },
  one_third_octave_100_3150: {
    frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
    label: "One-third octave 100..3150 Hz",
    summary: "Ln,w + CI"
  },
  one_third_octave_50_3150: {
    frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
    label: "One-third octave 50..3150 Hz",
    summary: "Ln,w + CI + CI,50-2500"
  }
} as const;

export type ParsedImpactBandImport = {
  detectedBandSetId: keyof typeof VALUE_ONLY_BAND_SETS;
  detectedBandSetLabel: string;
  source: ExactImpactSource;
  summary: string;
  valueCount: number;
};

function areSameFrequencies(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function detectBandSet(
  frequenciesHz: readonly number[]
): { id: keyof typeof VALUE_ONLY_BAND_SETS; label: string; summary: string } | null {
  for (const [id, entry] of Object.entries(VALUE_ONLY_BAND_SETS) as Array<
    [keyof typeof VALUE_ONLY_BAND_SETS, (typeof VALUE_ONLY_BAND_SETS)[keyof typeof VALUE_ONLY_BAND_SETS]]
  >) {
    if (areSameFrequencies(frequenciesHz, entry.frequenciesHz)) {
      return {
        id,
        label: entry.label,
        summary: entry.summary
      };
    }
  }

  return null;
}

function parseExactPairs(text: string): { frequenciesHz: number[]; levelsDb: number[] } | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 5) {
    return null;
  }

  const pairs = lines.map((line) => Array.from(line.matchAll(/-?\d+(?:\.\d+)?/g), (match) => Number(match[0])));
  if (!pairs.every((pair) => pair.length === 2 && pair.every((value) => Number.isFinite(value)))) {
    return null;
  }

  const sortedPairs = [...pairs].sort((left, right) => left[0] - right[0]);

  return {
    frequenciesHz: sortedPairs.map((pair) => pair[0]),
    levelsDb: sortedPairs.map((pair) => pair[1])
  };
}

function parseValueOnly(text: string): { frequenciesHz: number[]; levelsDb: number[] } | null {
  const values = Array.from(text.matchAll(/-?\d+(?:\.\d+)?/g), (match) => Number(match[0]));
  const detected = Object.values(VALUE_ONLY_BAND_SETS).find((entry) => entry.frequenciesHz.length === values.length);

  if (!detected || !values.every((value) => Number.isFinite(value))) {
    return null;
  }

  return {
    frequenciesHz: [...detected.frequenciesHz],
    levelsDb: values
  };
}

export function parseImpactBandImport(input: {
  labOrField: ExactImpactSourceLabOrField;
  text: string;
}): { error: string | null; parsed: ParsedImpactBandImport | null } {
  const trimmed = input.text.trim();
  if (!trimmed) {
    return { error: null, parsed: null };
  }

  const pairParse = parseExactPairs(trimmed);
  const valueParse = pairParse ? null : parseValueOnly(trimmed);
  const parsedBands = pairParse ?? valueParse;

  if (!parsedBands) {
    return {
      error:
        "Use either freq/value rows such as `100 58` or a value-only series with 5, 16, or 19 levels on a supported ISO 717-2 nominal grid.",
      parsed: null
    };
  }

  const detectedBandSet = detectBandSet(parsedBands.frequenciesHz);
  if (!detectedBandSet) {
    return {
      error: "The imported impact bands do not match a supported nominal set. Supported sets are 125..2000, 100..3150, or 50..3150 Hz.",
      parsed: null
    };
  }

  return {
    error: null,
    parsed: {
      detectedBandSetId: detectedBandSet.id,
      detectedBandSetLabel: detectedBandSet.label,
      source: {
        frequenciesHz: parsedBands.frequenciesHz,
        labOrField: input.labOrField,
        levelsDb: parsedBands.levelsDb,
        standardMethod: input.labOrField === "field" ? "ISO 16283-2" : "ISO 10140-3"
      },
      summary: detectedBandSet.summary,
      valueCount: parsedBands.levelsDb.length
    }
  };
}
