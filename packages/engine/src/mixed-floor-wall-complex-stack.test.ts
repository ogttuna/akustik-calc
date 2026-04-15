import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGeneratedVariants,
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot,
  SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES,
  type EngineMixedGeneratedCase
} from "./mixed-floor-wall-generated-test-helpers";

function resolveSelectedCase(engineCaseId: string): EngineMixedGeneratedCase {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find((candidate) => candidate.id === engineCaseId);

  if (!testCase) {
    throw new Error(`Expected selected mixed complex-stack engine case "${engineCaseId}" to exist.`);
  }

  return testCase;
}

const SELECTED_COMPLEX_STACK_CASES = SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES.map(({ engineCaseId, routeId }) => ({
  routeId,
  testCase: resolveSelectedCase(engineCaseId)
}));

describe("mixed floor and wall complex-stack engine parity", () => {
  it("pins the selected seeded boundary routes in the engine companion surface", () => {
    expect(
      SELECTED_COMPLEX_STACK_CASES.map(({ routeId, testCase }) => ({
        engineCaseId: testCase.id,
        routeId
      }))
    ).toEqual([
      {
        engineCaseId: "wall-held-aac",
        routeId: "route-wall-held-aac"
      },
      {
        engineCaseId: "wall-heavy-composite-hint-suppression",
        routeId: "route-wall-heavy-composite-hint-suppression"
      },
      {
        engineCaseId: "floor-dataholz-gdmtxa04a-boundary",
        routeId: "route-dataholz-gdmtxa04a-boundary"
      },
      {
        engineCaseId: "floor-tuas-c11c-fail-closed",
        routeId: "route-tuas-c11c-fail-closed"
      },
      {
        engineCaseId: "floor-open-box-exact",
        routeId: "route-open-box-exact"
      },
      {
        engineCaseId: "floor-open-web-bound",
        routeId: "route-open-web-bound"
      }
    ]);
  });

  it("keeps the selected mixed seeded boundary routes stable across neutral split variants", () => {
    const failures: string[] = [];

    for (const { routeId, testCase } of SELECTED_COMPLEX_STACK_CASES) {
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
});
