import { describe, expect, it } from "vitest";

import {
  buildGeneratedVariants,
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import { calculateAssembly } from "./calculate-assembly";

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
});
