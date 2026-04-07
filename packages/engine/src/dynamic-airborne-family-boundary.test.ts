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
    expect(boundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
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
      boundary.warnings.some((warning: string) => /boundary between Lined Massive Wall and Double Leaf/i.test(warning))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /family-boundary hold was applied/i.test(warning))
    ).toBe(true);

    expect(upper.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(upper.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(upper.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
    expect(upper.metrics.estimatedRwPrimeDb).toBe(47);
    expect(upper.metrics.estimatedDnTwDb).toBe(47);
    expect(upper.dynamicAirborneTrace?.strategy).toBe("lined_massive_blend");
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
