import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const LAB_DOUBLE_STUD_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  connectionType: "line_connection",
  studType: "light_steel_stud",
  studSpacingMm: 600,
  airtightness: "good",
  sharedTrack: "independent"
};

function calculateDynamicWall(
  layers: readonly LayerInput[],
  airborneContext: AirborneContext,
  targetOutputs: readonly ("Rw" | "R'w" | "DnT,w")[]
) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

describe("dynamic airborne family boundary diagnostics", () => {
  it("marks the AAC lined-massive threshold as an ambiguous family boundary instead of pretending the lane is fully stable", () => {
    const lower = calculateDynamicWall(
      [
        { materialId: "ytong_aac_d700", thicknessMm: 80 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      FIELD_CONTEXT,
      ["R'w", "DnT,w"]
    );
    const boundary = calculateDynamicWall(
      [
        { materialId: "ytong_aac_d700", thicknessMm: 100 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      FIELD_CONTEXT,
      ["R'w", "DnT,w"]
    );
    const upper = calculateDynamicWall(
      [
        { materialId: "ytong_aac_d700", thicknessMm: 160 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      FIELD_CONTEXT,
      ["R'w", "DnT,w"]
    );

    expect(lower.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(lower.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(lower.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
    expect(lower.metrics.estimatedRwPrimeDb).toBe(46);
    expect(lower.metrics.estimatedDnTwDb).toBe(47);
    expect(lower.dynamicAirborneTrace?.strategy).toBe("double_leaf_empty_cavity_delegate");

    expect(boundary.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(boundary.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(boundary.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(boundary.dynamicAirborneTrace?.familyDecisionMargin ?? Infinity).toBeLessThanOrEqual(0.1);
    expect(boundary.dynamicAirborneTrace?.familyDecisionMultiplePlausibleFamilies).toBeUndefined();
    expect(boundary.dynamicAirborneTrace?.familyDecisionSelectedBelowRunnerUp).toBe(true);
    expect(boundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
    expect(boundary.dynamicAirborneTrace?.runnerUpFamilyScore ?? 0).toBeGreaterThan(0.49);
    expect(boundary.dynamicAirborneTrace?.selectedFamilyScore ?? 0).toBeGreaterThan(0.49);
    expect(boundary.dynamicAirborneTrace?.runnerUpFamilyScore ?? 0).toBeGreaterThan(
      boundary.dynamicAirborneTrace?.selectedFamilyScore ?? Infinity
    );
    expect(boundary.dynamicAirborneTrace?.secondaryRunnerUpFamily).toBeUndefined();
    expect(boundary.dynamicAirborneTrace?.secondaryRunnerUpFamilyScore).toBeUndefined();
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBe(true);
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldAllowedLeadDb).toBe(4);
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldRunnerUpMetricDb).toBe(39);
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldBoundaryCeilingDb).toBe(43);
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldCurrentMetricDb).toBe(50);
    expect(boundary.dynamicAirborneTrace?.familyBoundaryHoldTargetMetricDb).toBe(48);
    expect(boundary.metrics.estimatedRwPrimeDb).toBe(45);
    expect(boundary.metrics.estimatedDnTwDb).toBe(46);
    expect(boundary.dynamicAirborneTrace?.strategy).toBe(
      "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    );
    expect(
      boundary.dynamicAirborneTrace?.notes.some((note: string) => /family boundary is ambiguous/i.test(note))
    ).toBe(true);
    expect(
      boundary.dynamicAirborneTrace?.notes.some((note: string) => /ambiguity hold trimmed/i.test(note))
    ).toBe(true);
    expect(
      boundary.dynamicAirborneTrace?.notes.some((note: string) => /currently scoring slightly above/i.test(note))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /boundary between Lined Massive Wall and Double Leaf/i.test(warning))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /family-boundary hold was applied/i.test(warning))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /hard family detector stayed on Lined Massive Wall/i.test(warning))
    ).toBe(true);

    expect(upper.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(upper.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(upper.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
    expect(upper.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBeUndefined();
    expect(upper.metrics.estimatedRwPrimeDb).toBe(47);
    expect(upper.metrics.estimatedDnTwDb).toBe(47);
    expect(upper.dynamicAirborneTrace?.strategy).toBe("lined_massive_blend");
  });

  it("carries exact hold metrics on the denser AAC sibling core instead of inventing a new pairing", () => {
    const result = calculateDynamicWall(
      [
        { materialId: "ytong_g5_800", thicknessMm: 100 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "diamond_board", thicknessMm: 12.5 }
      ],
      BUILDING_CONTEXT,
      ["R'w", "DnT,w"]
    );

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(result.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(result.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBe(true);
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldAllowedLeadDb).toBe(4);
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldRunnerUpMetricDb).toBe(42);
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldBoundaryCeilingDb).toBe(46);
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldCurrentMetricDb).toBe(51);
    expect(result.dynamicAirborneTrace?.familyBoundaryHoldTargetMetricDb).toBe(49);
    expect(result.metrics.estimatedRwPrimeDb).toBe(45);
    expect(result.metrics.estimatedDnTwDb).toBe(47);
    expect(result.dynamicAirborneTrace?.strategy).toBe(
      "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    );
  });

  it("keeps the AAC lining board matrix inside a conservative held corridor instead of allowing another hidden lane jump", () => {
    const cases = [
      {
        board: "gypsum_board",
        decision: "ambiguous",
        dnTw: 46,
        rwPrime: 45,
        thicknessMm: 100,
        warningPattern: /boundary between Lined Massive Wall and Double Leaf/i
      },
      {
        board: "diamond_board",
        decision: "ambiguous",
        dnTw: 46,
        rwPrime: 46,
        thicknessMm: 100,
        warningPattern: /boundary between Lined Massive Wall and Double Leaf/i
      },
      {
        board: "diamond_board",
        decision: "narrow",
        dnTw: 46,
        rwPrime: 45,
        thicknessMm: 120,
        warningPattern: /family-boundary hold was applied/i
      },
      {
        board: "firestop_board",
        decision: "ambiguous",
        dnTw: 46,
        rwPrime: 46,
        thicknessMm: 100,
        warningPattern: /boundary between Lined Massive Wall and Double Leaf/i
      },
      {
        board: "firestop_board",
        decision: "narrow",
        dnTw: 46,
        rwPrime: 45,
        thicknessMm: 120,
        warningPattern: /family-boundary hold was applied/i
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateDynamicWall(
        [
          { materialId: "ytong_aac_d700", thicknessMm: testCase.thicknessMm },
          { materialId: "air_gap", thicknessMm: 50 },
          {
            materialId: testCase.board,
            thicknessMm: testCase.board === "firestop_board" ? 15 : 12.5
          }
        ],
        FIELD_CONTEXT,
        ["R'w", "DnT,w"]
      );

      expect(result.dynamicAirborneTrace?.detectedFamily, `${testCase.board} ${testCase.thicknessMm} family`).toBe(
        "lined_massive_wall"
      );
      expect(result.dynamicAirborneTrace?.familyDecisionClass, `${testCase.board} ${testCase.thicknessMm} decision`).toBe(
        testCase.decision
      );
      expect(result.dynamicAirborneTrace?.runnerUpFamily, `${testCase.board} ${testCase.thicknessMm} runner-up`).toBe(
        "double_leaf"
      );
      expect(result.metrics.estimatedRwPrimeDb, `${testCase.board} ${testCase.thicknessMm} R'w`).toBe(
        testCase.rwPrime
      );
      expect(result.metrics.estimatedDnTwDb, `${testCase.board} ${testCase.thicknessMm} DnT,w`).toBe(
        testCase.dnTw
      );
      expect(result.dynamicAirborneTrace?.strategy, `${testCase.board} ${testCase.thicknessMm} strategy`).toBe(
        "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
      );
      expect(
        result.warnings.some((warning) => testCase.warningPattern.test(warning)),
        `${testCase.board} ${testCase.thicknessMm} warning`
      ).toBe(true);
      expect(
        result.dynamicAirborneTrace?.notes.some((note) => /ambiguity hold trimmed/i.test(note)),
        `${testCase.board} ${testCase.thicknessMm} hold note`
      ).toBe(true);
    }
  });

  it("keeps trimmed-prefix hybrid walls inside the same held corridor across deeper 5-layer variants", () => {
    const cases = [
      {
        dnTw: 48,
        outer: { materialId: "rockwool", thicknessMm: 25 },
        rwPrime: 47
      },
      {
        dnTw: 48,
        outer: { materialId: "rockwool", thicknessMm: 50 },
        rwPrime: 47
      },
      {
        dnTw: 48,
        outer: { materialId: "glasswool", thicknessMm: 25 },
        rwPrime: 47
      },
      {
        dnTw: 49,
        outer: { materialId: "air_gap", thicknessMm: 25 },
        rwPrime: 48
      },
      {
        dnTw: 49,
        outer: { materialId: "air_gap", thicknessMm: 50 },
        rwPrime: 48
      }
    ] as const;

    const rwPrimeValues: number[] = [];
    const dnTwValues: number[] = [];

    for (const testCase of cases) {
      const result = calculateDynamicWall(
        [
          testCase.outer,
          { materialId: "ytong_aac_d700", thicknessMm: 100 },
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 12.5 }
        ],
        BUILDING_CONTEXT,
        ["R'w", "DnT,w"]
      );

      rwPrimeValues.push(result.metrics.estimatedRwPrimeDb ?? -Infinity);
      dnTwValues.push(result.metrics.estimatedDnTwDb ?? -Infinity);

      expect(result.dynamicAirborneTrace?.detectedFamily, `${testCase.outer.materialId} family`).toBe(
        "lined_massive_wall"
      );
      expect(result.dynamicAirborneTrace?.familyDecisionClass, `${testCase.outer.materialId} decision`).toBe(
        "ambiguous"
      );
      expect(result.dynamicAirborneTrace?.runnerUpFamily, `${testCase.outer.materialId} runner-up`).toBe(
        "double_leaf"
      );
      expect(result.metrics.estimatedRwPrimeDb, `${testCase.outer.materialId} R'w`).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb, `${testCase.outer.materialId} DnT,w`).toBe(testCase.dnTw);
      expect(result.dynamicAirborneTrace?.strategy, `${testCase.outer.materialId} strategy`).toBe(
        "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
      );
      expect(
        result.warnings.some((warning) => /family-boundary hold was applied/i.test(warning)),
        `${testCase.outer.materialId} hold warning`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /excluded from the dynamic airborne span/i.test(warning)),
        `${testCase.outer.materialId} trim warning`
      ).toBe(true);
    }

    expect(Math.max(...rwPrimeValues) - Math.min(...rwPrimeValues)).toBeLessThanOrEqual(1);
    expect(Math.max(...dnTwValues) - Math.min(...dnTwValues)).toBeLessThanOrEqual(1);
  });

  it("keeps dual-sided trim boundary samples inside the held corridor and exposes exact trim counts", () => {
    const cases = [
      {
        decision: "ambiguous",
        dnTw: 47,
        leading: 1,
        rwPrime: 46,
        stack: [
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "ytong_aac_d700", thicknessMm: 100 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "glasswool", thicknessMm: 25 }
        ] as const,
        trailing: 1
      },
      {
        decision: "ambiguous",
        dnTw: 49,
        leading: 2,
        rwPrime: 47,
        stack: [
          { materialId: "air_gap", thicknessMm: 25 },
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "ytong_aac_d700", thicknessMm: 100 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "glasswool", thicknessMm: 25 }
        ] as const,
        trailing: 1
      },
      {
        decision: "narrow",
        dnTw: 49,
        leading: 1,
        rwPrime: 48,
        stack: [
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "ytong_g5_800", thicknessMm: 100 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "security_board", thicknessMm: 12.5 },
          { materialId: "air_gap", thicknessMm: 25 }
        ] as const,
        trailing: 1
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateDynamicWall(testCase.stack, BUILDING_CONTEXT, ["R'w", "DnT,w"]);

      expect(result.dynamicAirborneTrace?.detectedFamily, stackLabel(testCase.stack)).toBe("lined_massive_wall");
      expect(result.dynamicAirborneTrace?.familyDecisionClass, stackLabel(testCase.stack)).toBe(testCase.decision);
      expect(result.dynamicAirborneTrace?.runnerUpFamily, stackLabel(testCase.stack)).toBe("double_leaf");
      expect(result.dynamicAirborneTrace?.familyBoundaryHoldApplied, stackLabel(testCase.stack)).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLayersApplied, stackLabel(testCase.stack)).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLeadingCount, stackLabel(testCase.stack)).toBe(testCase.leading);
      expect(result.dynamicAirborneTrace?.trimmedOuterTrailingCount, stackLabel(testCase.stack)).toBe(testCase.trailing);
      expect(result.metrics.estimatedRwPrimeDb, stackLabel(testCase.stack)).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb, stackLabel(testCase.stack)).toBe(testCase.dnTw);
      expect(
        result.dynamicAirborneTrace?.notes.some((note) =>
          new RegExp(`dynamic span \\(${testCase.leading} leading, ${testCase.trailing} trailing\\)`, "i").test(note)
        ),
        `${stackLabel(testCase.stack)} trim note`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /excluded from the dynamic airborne span/i.test(warning)),
        `${stackLabel(testCase.stack)} trim warning`
      ).toBe(true);
    }
  });

  it("keeps trimmed non-AAC lined-massive rows clear of family-boundary diagnostics", () => {
    const cases = [
      {
        dnTw: 49,
        leading: 1,
        label: "porotherm-single-trim",
        rwPrime: 47,
        stack: [
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "porotherm_pls_140", thicknessMm: 140 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "diamond_board", thicknessMm: 12.5 },
          { materialId: "glasswool", thicknessMm: 25 }
        ] as const,
        trailing: 1
      },
      {
        dnTw: 58,
        leading: 2,
        label: "silka-dual-trim",
        rwPrime: 56,
        stack: [
          { materialId: "air_gap", thicknessMm: 25 },
          { materialId: "rockwool", thicknessMm: 25 },
          { materialId: "silka_cs_block", thicknessMm: 150 },
          { materialId: "air_gap", thicknessMm: 50 },
          { materialId: "security_board", thicknessMm: 12.5 },
          { materialId: "glasswool", thicknessMm: 25 }
        ] as const,
        trailing: 1
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateDynamicWall(testCase.stack, BUILDING_CONTEXT, ["R'w", "DnT,w"]);

      expect(result.dynamicAirborneTrace?.detectedFamily, testCase.label).toBe("lined_massive_wall");
      expect(result.dynamicAirborneTrace?.familyDecisionClass, testCase.label).toBeUndefined();
      expect(result.dynamicAirborneTrace?.runnerUpFamily, testCase.label).toBeUndefined();
      expect(result.dynamicAirborneTrace?.familyBoundaryHoldApplied, testCase.label).toBeUndefined();
      expect(result.dynamicAirborneTrace?.trimmedOuterLayersApplied, testCase.label).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLeadingCount, testCase.label).toBe(testCase.leading);
      expect(result.dynamicAirborneTrace?.trimmedOuterTrailingCount, testCase.label).toBe(testCase.trailing);
      expect(result.metrics.estimatedRwPrimeDb, testCase.label).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb, testCase.label).toBe(testCase.dnTw);
      expect(result.dynamicAirborneTrace?.strategy, testCase.label).toBe("lined_massive_blend");
      expect(
        result.dynamicAirborneTrace?.notes.some((note) =>
          new RegExp(`dynamic span \\(${testCase.leading} leading, ${testCase.trailing} trailing\\)`, "i").test(note)
        ),
        `${testCase.label} trim note`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /excluded from the dynamic airborne span/i.test(warning)),
        `${testCase.label} trim warning`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /boundary between|family-boundary hold|still somewhat close/i.test(warning)),
        `${testCase.label} boundary warning`
      ).toBe(false);
    }
  });

  it("keeps strong double-stud corridors clear instead of labelling them as boundary cases", () => {
    const result = calculateDynamicWall(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 75 },
        { materialId: "glasswool", thicknessMm: 60 },
        { materialId: "air_gap", thicknessMm: 70 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      LAB_DOUBLE_STUD_CONTEXT,
      ["Rw"]
    );

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_stud_system");
    expect(result.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(result.dynamicAirborneTrace?.familyDecisionMargin).toBeUndefined();
    expect(result.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
    expect(
      result.warnings.some((warning: string) => /boundary between|still somewhat close/i.test(warning))
    ).toBe(false);
  });

  it("keeps triple-leaf diagnostics separate from two-leaf family-boundary warnings", () => {
    const result = calculateDynamicWall(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 50 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      FIELD_CONTEXT,
      ["R'w", "DnT,w"]
    );

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("multileaf_multicavity");
    expect(result.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(result.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
    expect(
      result.warnings.some((warning: string) => /triple-leaf partition/i.test(warning))
    ).toBe(true);
    expect(
      result.warnings.some((warning: string) => /boundary between|still somewhat close/i.test(warning))
    ).toBe(false);
  });
});

function stackLabel(layers: readonly LayerInput[]) {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(" | ");
}
