export type RequiredFrequencyCoverageResult =
  | {
      readonly missingFrequenciesHz: readonly [];
      readonly samplesDb: readonly number[];
      readonly status: "complete";
    }
  | {
      readonly missingFrequenciesHz: readonly number[];
      readonly samplesDb: readonly [];
      readonly status: "needs_input";
    };

export function pickRequiredFrequencyCoverage(input: {
  readonly frequenciesHz: readonly number[];
  readonly requiredFrequenciesHz: readonly number[];
  readonly valuesDb: readonly number[];
}): RequiredFrequencyCoverageResult {
  const requiredFrequenciesHz = [...input.requiredFrequenciesHz];
  const required = new Set(requiredFrequenciesHz);
  const byFrequency = new Map<number, number>();
  const duplicateRequiredFrequencies = new Set<number>();

  if (
    input.frequenciesHz.length !== input.valuesDb.length ||
    input.frequenciesHz.length === 0 ||
    requiredFrequenciesHz.length === 0
  ) {
    return {
      missingFrequenciesHz: requiredFrequenciesHz,
      samplesDb: [],
      status: "needs_input"
    };
  }

  for (let index = 0; index < input.frequenciesHz.length; index += 1) {
    const frequency = input.frequenciesHz[index];
    const value = input.valuesDb[index];

    if (!Number.isFinite(frequency) || frequency <= 0 || !Number.isFinite(value)) {
      continue;
    }

    if (!required.has(frequency)) {
      continue;
    }

    if (byFrequency.has(frequency)) {
      duplicateRequiredFrequencies.add(frequency);
      continue;
    }

    byFrequency.set(frequency, value);
  }

  const missingFrequenciesHz = requiredFrequenciesHz.filter((frequency) => !byFrequency.has(frequency));
  if (missingFrequenciesHz.length > 0 || duplicateRequiredFrequencies.size > 0) {
    return {
      missingFrequenciesHz: [
        ...missingFrequenciesHz,
        ...[...duplicateRequiredFrequencies].filter((frequency) => !missingFrequenciesHz.includes(frequency))
      ],
      samplesDb: [],
      status: "needs_input"
    };
  }

  return {
    missingFrequenciesHz: [],
    samplesDb: requiredFrequenciesHz.map((frequency) => byFrequency.get(frequency) as number),
    status: "complete"
  };
}
