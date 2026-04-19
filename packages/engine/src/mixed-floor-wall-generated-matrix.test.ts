import { describe, expect, it } from "vitest";

import {
  applySplitPlans,
  buildGeneratedVariants,
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot,
  SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES,
  type EngineMixedGeneratedCase,
  type SplitPlan
} from "./mixed-floor-wall-generated-test-helpers";
import { calculateAssembly } from "./calculate-assembly";

function resolveSelectedCase(engineCaseId: string): EngineMixedGeneratedCase {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((candidate) => candidate.id === engineCaseId);

  if (!testCase) {
    throw new Error(`Expected selected mixed generated engine case "${engineCaseId}" to exist.`);
  }

  return testCase;
}

const SELECTED_DUPLICATE_SWAP_CASES = SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES.map(
  ({ engineCaseId, routeId }) => ({
    routeId,
    testCase: resolveSelectedCase(engineCaseId)
  })
);

function buildDuplicateSwapGridVariants(testCase: EngineMixedGeneratedCase) {
  // Exhaust every reverse-mask combination on the selected seeded routes so the
  // shared torture pass widens end-state pressure without inventing new route families.
  const reverseMasks = Array.from({ length: 2 ** testCase.splitPlans.length }, (_, mask) =>
    testCase.splitPlans.map((__, index) => Boolean(mask & (1 << index)))
  );

  return reverseMasks.map((reverseMask) => {
    const variantPlans: SplitPlan[] = testCase.splitPlans.map((plan, index) => ({
      ...plan,
      parts: reverseMask[index] ? [...plan.parts].reverse() : [...plan.parts]
    }));

    const reversedSuffix = reverseMask
      .map((reversed, index) => (reversed ? String(index + 1) : null))
      .filter((value): value is string => value !== null)
      .join("-");

    return {
      id: `${testCase.id}:duplicate-swap:${reversedSuffix || "direct"}`,
      rows: applySplitPlans(testCase.rows, variantPlans)
    };
  });
}

function supportBucketSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("mixed floor and wall generated engine matrix", () => {
  it("keeps broader deep floor and wall packages stable across generated neutral split variants", () => {
    const failures: string[] = [];

    for (const testCase of ENGINE_MIXED_GENERATED_CASES) {
      const baselineLab = calculateAssembly(testCase.rows, testCase.labOptions);
      const baselineField = calculateAssembly(testCase.rows, testCase.fieldOptions);
      const baselineLabSnapshot = resultSnapshot(baselineLab);
      const baselineFieldSnapshot = resultSnapshot(baselineField);

      for (const variant of buildGeneratedVariants(testCase)) {
        const variantLab = calculateAssembly(variant.rows, testCase.labOptions);
        const variantField = calculateAssembly(variant.rows, testCase.fieldOptions);
        const variantLabSnapshot = resultSnapshot(variantLab);
        const variantFieldSnapshot = resultSnapshot(variantField);

        if (JSON.stringify(variantLabSnapshot) !== JSON.stringify(baselineLabSnapshot)) {
          failures.push(
            `${testCase.label} ${variant.id} lab: expected ${JSON.stringify(baselineLabSnapshot)}, got ${JSON.stringify(variantLabSnapshot)}`
          );
        }

        if (JSON.stringify(variantFieldSnapshot) !== JSON.stringify(baselineFieldSnapshot)) {
          failures.push(
            `${testCase.label} ${variant.id} field: expected ${JSON.stringify(baselineFieldSnapshot)}, got ${JSON.stringify(variantFieldSnapshot)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps the selected seeded boundary routes stable across duplicate/swap final-row permutations", () => {
    expect(
      SELECTED_DUPLICATE_SWAP_CASES.map(({ routeId, testCase }) => ({
        engineCaseId: testCase.id,
        routeId
      }))
    ).toEqual(SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES);

    const failures: string[] = [];

    for (const { routeId, testCase } of SELECTED_DUPLICATE_SWAP_CASES) {
      const directFinalRows = applySplitPlans(testCase.rows, testCase.splitPlans);
      const baselineLab = calculateAssembly(directFinalRows, testCase.labOptions);
      const baselineField = calculateAssembly(directFinalRows, testCase.fieldOptions);
      const baselineLabSnapshot = resultSnapshot(baselineLab);
      const baselineFieldSnapshot = resultSnapshot(baselineField);

      for (const variant of buildDuplicateSwapGridVariants(testCase)) {
        const variantLab = calculateAssembly(variant.rows, testCase.labOptions);
        const variantField = calculateAssembly(variant.rows, testCase.fieldOptions);
        const variantLabSnapshot = resultSnapshot(variantLab);
        const variantFieldSnapshot = resultSnapshot(variantField);

        if (JSON.stringify(variantLabSnapshot) !== JSON.stringify(baselineLabSnapshot)) {
          failures.push(
            `${routeId} (${testCase.label}) ${variant.id} lab: expected ${JSON.stringify(baselineLabSnapshot)}, got ${JSON.stringify(variantLabSnapshot)}`
          );
        }

        if (JSON.stringify(variantFieldSnapshot) !== JSON.stringify(baselineFieldSnapshot)) {
          failures.push(
            `${routeId} (${testCase.label}) ${variant.id} field: expected ${JSON.stringify(baselineFieldSnapshot)}, got ${JSON.stringify(variantFieldSnapshot)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps the selected seeded boundary route support buckets stable across duplicate/swap final-row permutations", () => {
    const failures: string[] = [];

    for (const { routeId, testCase } of SELECTED_DUPLICATE_SWAP_CASES) {
      const directFinalRows = applySplitPlans(testCase.rows, testCase.splitPlans);
      const baselineLab = calculateAssembly(directFinalRows, testCase.labOptions);
      const baselineField = calculateAssembly(directFinalRows, testCase.fieldOptions);
      const baselineLabBuckets = supportBucketSnapshot(baselineLab);
      const baselineFieldBuckets = supportBucketSnapshot(baselineField);

      for (const variant of buildDuplicateSwapGridVariants(testCase)) {
        const variantLabBuckets = supportBucketSnapshot(calculateAssembly(variant.rows, testCase.labOptions));
        const variantFieldBuckets = supportBucketSnapshot(calculateAssembly(variant.rows, testCase.fieldOptions));

        if (JSON.stringify(variantLabBuckets) !== JSON.stringify(baselineLabBuckets)) {
          failures.push(
            `${routeId} (${testCase.label}) ${variant.id} lab support buckets: expected ${JSON.stringify(baselineLabBuckets)}, got ${JSON.stringify(variantLabBuckets)}`
          );
        }

        if (JSON.stringify(variantFieldBuckets) !== JSON.stringify(baselineFieldBuckets)) {
          failures.push(
            `${routeId} (${testCase.label}) ${variant.id} field support buckets: expected ${JSON.stringify(baselineFieldBuckets)}, got ${JSON.stringify(variantFieldBuckets)}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
