import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

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

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "DnT,w"];
const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw"];

function buildRows(
  stack: readonly { materialId: string; thicknessMm: string }[],
  prefix: string
) {
  return stack.map((layer, index) => ({
    ...layer,
    id: `${prefix}-${index + 1}`
  }));
}

function evaluateDynamicWall(input: {
  airborneContext: AirborneContext;
  id: string;
  outputs: readonly RequestedOutputId[];
  stack: readonly { materialId: string; thicknessMm: string }[];
}) {
  const result = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows: buildRows(input.stack, input.id),
    source: "current",
    studyMode: "wall",
    targetOutputs: input.outputs
  });

  expect(result.result?.ok, `${input.id} should stay ok`).toBe(true);
  return result.result!;
}

describe("dynamic route family boundary diagnostics", () => {
  it("surfaces the AAC lined-massive boundary as an ambiguous family decision in workbench flow", () => {
    const lower = evaluateDynamicWall({
      airborneContext: FIELD_CONTEXT,
      id: "aac-lower",
      outputs: FIELD_OUTPUTS,
      stack: [
        { materialId: "ytong_aac_d700", thicknessMm: "80" },
        { materialId: "air_gap", thicknessMm: "50" },
        { materialId: "gypsum_board", thicknessMm: "12.5" }
      ]
    });
    const boundary = evaluateDynamicWall({
      airborneContext: FIELD_CONTEXT,
      id: "aac-boundary",
      outputs: FIELD_OUTPUTS,
      stack: [
        { materialId: "ytong_aac_d700", thicknessMm: "100" },
        { materialId: "air_gap", thicknessMm: "50" },
        { materialId: "gypsum_board", thicknessMm: "12.5" }
      ]
    });
    const upper = evaluateDynamicWall({
      airborneContext: FIELD_CONTEXT,
      id: "aac-upper",
      outputs: FIELD_OUTPUTS,
      stack: [
        { materialId: "ytong_aac_d700", thicknessMm: "160" },
        { materialId: "air_gap", thicknessMm: "50" },
        { materialId: "gypsum_board", thicknessMm: "12.5" }
      ]
    });

    expect(lower.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(lower.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(lower.metrics.estimatedRwPrimeDb).toBe(46);
    expect(lower.metrics.estimatedDnTwDb).toBe(47);
    expect(lower.dynamicAirborneTrace?.strategy).toBe("double_leaf_empty_cavity_delegate");

    expect(boundary.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(boundary.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(boundary.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(boundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
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
      boundary.warnings.some((warning: string) => /boundary between Lined Massive Wall and Double Leaf/i.test(warning))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /family-boundary hold was applied/i.test(warning))
    ).toBe(true);

    expect(upper.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(upper.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(upper.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBeUndefined();
    expect(upper.metrics.estimatedRwPrimeDb).toBe(47);
    expect(upper.metrics.estimatedDnTwDb).toBe(47);
    expect(upper.dynamicAirborneTrace?.strategy).toBe("lined_massive_blend");
  });

  it("surfaces the same hold metrics through workbench flow on the denser AAC sibling core", () => {
    const result = evaluateDynamicWall({
      airborneContext: BUILDING_CONTEXT,
      id: "g5-boundary",
      outputs: FIELD_OUTPUTS,
      stack: [
        { materialId: "ytong_g5_800", thicknessMm: "100" },
        { materialId: "air_gap", thicknessMm: "50" },
        { materialId: "diamond_board", thicknessMm: "12.5" }
      ]
    });

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

  it("keeps the workbench AAC lining board matrix in the same conservative held corridor", () => {
    const cases = [
      {
        board: "gypsum_board",
        decision: "ambiguous",
        dnTw: 46,
        rwPrime: 45,
        thicknessMm: "100",
        warningPattern: /boundary between Lined Massive Wall and Double Leaf/i
      },
      {
        board: "diamond_board",
        decision: "ambiguous",
        dnTw: 46,
        rwPrime: 46,
        thicknessMm: "100",
        warningPattern: /boundary between Lined Massive Wall and Double Leaf/i
      },
      {
        board: "diamond_board",
        decision: "narrow",
        dnTw: 46,
        rwPrime: 45,
        thicknessMm: "120",
        warningPattern: /family-boundary hold was applied/i
      }
    ] as const;

    for (const testCase of cases) {
      const result = evaluateDynamicWall({
        airborneContext: FIELD_CONTEXT,
        id: `${testCase.board}-${testCase.thicknessMm}`,
        outputs: FIELD_OUTPUTS,
        stack: [
          { materialId: "ytong_aac_d700", thicknessMm: testCase.thicknessMm },
          { materialId: "air_gap", thicknessMm: "50" },
          {
            materialId: testCase.board,
            thicknessMm: testCase.board === "firestop_board" ? "15" : "12.5"
          }
        ]
      });

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
    }
  });

  it("keeps trimmed-prefix workbench hybrids inside the held corridor across deeper 5-layer variants", () => {
    const cases = [
      {
        dnTw: 48,
        outer: { materialId: "rockwool", thicknessMm: "25" },
        rwPrime: 47
      },
      {
        dnTw: 48,
        outer: { materialId: "glasswool", thicknessMm: "25" },
        rwPrime: 47
      },
      {
        dnTw: 49,
        outer: { materialId: "air_gap", thicknessMm: "25" },
        rwPrime: 48
      }
    ] as const;

    const rwPrimeValues: number[] = [];
    const dnTwValues: number[] = [];

    for (const testCase of cases) {
      const result = evaluateDynamicWall({
        airborneContext: BUILDING_CONTEXT,
        id: `trimmed-${testCase.outer.materialId}-${testCase.outer.thicknessMm}`,
        outputs: FIELD_OUTPUTS,
        stack: [
          testCase.outer,
          { materialId: "ytong_aac_d700", thicknessMm: "100" },
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "diamond_board", thicknessMm: "12.5" }
        ]
      });

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

  it("keeps dual-sided trim workbench samples in the held corridor and surfaces trim counts through the route", () => {
    const cases = [
      {
        decision: "ambiguous",
        dnTw: 47,
        id: "dual-trim-aac-single",
        leading: 1,
        rwPrime: 46,
        stack: [
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "ytong_aac_d700", thicknessMm: "100" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "diamond_board", thicknessMm: "12.5" },
          { materialId: "glasswool", thicknessMm: "25" }
        ] as const,
        trailing: 1
      },
      {
        decision: "ambiguous",
        dnTw: 49,
        id: "dual-trim-aac-double",
        leading: 2,
        rwPrime: 47,
        stack: [
          { materialId: "air_gap", thicknessMm: "25" },
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "ytong_aac_d700", thicknessMm: "100" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "diamond_board", thicknessMm: "12.5" },
          { materialId: "glasswool", thicknessMm: "25" }
        ] as const,
        trailing: 1
      },
      {
        decision: "narrow",
        dnTw: 49,
        id: "dual-trim-g5",
        leading: 1,
        rwPrime: 48,
        stack: [
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "ytong_g5_800", thicknessMm: "100" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "security_board", thicknessMm: "12.5" },
          { materialId: "air_gap", thicknessMm: "25" }
        ] as const,
        trailing: 1
      }
    ] as const;

    for (const testCase of cases) {
      const result = evaluateDynamicWall({
        airborneContext: BUILDING_CONTEXT,
        id: testCase.id,
        outputs: FIELD_OUTPUTS,
        stack: testCase.stack
      });

      expect(result.dynamicAirborneTrace?.detectedFamily, testCase.id).toBe("lined_massive_wall");
      expect(result.dynamicAirborneTrace?.familyDecisionClass, testCase.id).toBe(testCase.decision);
      expect(result.dynamicAirborneTrace?.runnerUpFamily, testCase.id).toBe("double_leaf");
      expect(result.dynamicAirborneTrace?.familyBoundaryHoldApplied, testCase.id).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLayersApplied, testCase.id).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLeadingCount, testCase.id).toBe(testCase.leading);
      expect(result.dynamicAirborneTrace?.trimmedOuterTrailingCount, testCase.id).toBe(testCase.trailing);
      expect(result.metrics.estimatedRwPrimeDb, testCase.id).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb, testCase.id).toBe(testCase.dnTw);
      expect(
        result.dynamicAirborneTrace?.notes.some((note) =>
          new RegExp(`dynamic span \\(${testCase.leading} leading, ${testCase.trailing} trailing\\)`, "i").test(note)
        ),
        `${testCase.id} trim note`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /excluded from the dynamic airborne span/i.test(warning)),
        `${testCase.id} trim warning`
      ).toBe(true);
    }
  });

  it("keeps trimmed non-AAC workbench rows clear of family-boundary diagnostics", () => {
    const cases = [
      {
        dnTw: 48,
        id: "porotherm-single-trim",
        leading: 1,
        rwPrime: 47,
        stack: [
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "porotherm_pls_140", thicknessMm: "140" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "diamond_board", thicknessMm: "12.5" },
          { materialId: "glasswool", thicknessMm: "25" }
        ] as const,
        trailing: 1
      },
      {
        dnTw: 57,
        id: "silka-dual-trim",
        leading: 2,
        rwPrime: 56,
        stack: [
          { materialId: "air_gap", thicknessMm: "25" },
          { materialId: "rockwool", thicknessMm: "25" },
          { materialId: "silka_cs_block", thicknessMm: "150" },
          { materialId: "air_gap", thicknessMm: "50" },
          { materialId: "security_board", thicknessMm: "12.5" },
          { materialId: "glasswool", thicknessMm: "25" }
        ] as const,
        trailing: 1
      }
    ] as const;

    for (const testCase of cases) {
      const result = evaluateDynamicWall({
        airborneContext: FIELD_CONTEXT,
        id: testCase.id,
        outputs: FIELD_OUTPUTS,
        stack: testCase.stack
      });

      expect(result.dynamicAirborneTrace?.detectedFamily, testCase.id).toBe("lined_massive_wall");
      expect(result.dynamicAirborneTrace?.familyDecisionClass, testCase.id).toBeUndefined();
      expect(result.dynamicAirborneTrace?.runnerUpFamily, testCase.id).toBeUndefined();
      expect(result.dynamicAirborneTrace?.familyBoundaryHoldApplied, testCase.id).toBeUndefined();
      expect(result.dynamicAirborneTrace?.trimmedOuterLayersApplied, testCase.id).toBe(true);
      expect(result.dynamicAirborneTrace?.trimmedOuterLeadingCount, testCase.id).toBe(testCase.leading);
      expect(result.dynamicAirborneTrace?.trimmedOuterTrailingCount, testCase.id).toBe(testCase.trailing);
      expect(result.metrics.estimatedRwPrimeDb, testCase.id).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb, testCase.id).toBe(testCase.dnTw);
      expect(result.dynamicAirborneTrace?.strategy, testCase.id).toBe("lined_massive_blend");
      expect(
        result.dynamicAirborneTrace?.notes.some((note) =>
          new RegExp(`dynamic span \\(${testCase.leading} leading, ${testCase.trailing} trailing\\)`, "i").test(note)
        ),
        `${testCase.id} trim note`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /excluded from the dynamic airborne span/i.test(warning)),
        `${testCase.id} trim warning`
      ).toBe(true);
      expect(
        result.warnings.some((warning) => /boundary between|family-boundary hold|still somewhat close/i.test(warning)),
        `${testCase.id} boundary warning`
      ).toBe(false);
    }
  });

  it("keeps clear double-stud workbench cases free from boundary warnings", () => {
    const result = evaluateDynamicWall({
      airborneContext: LAB_DOUBLE_STUD_CONTEXT,
      id: "double-stud-clear",
      outputs: LAB_OUTPUTS,
      stack: [
        { materialId: "gypsum", thicknessMm: "12.5" },
        { materialId: "gypsum", thicknessMm: "12.5" },
        { materialId: "air_gap", thicknessMm: "75" },
        { materialId: "glasswool", thicknessMm: "60" },
        { materialId: "air_gap", thicknessMm: "70" },
        { materialId: "gypsum", thicknessMm: "12.5" },
        { materialId: "gypsum", thicknessMm: "12.5" }
      ]
    });

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_stud_system");
    expect(result.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(
      result.warnings.some((warning: string) => /boundary between|still somewhat close/i.test(warning))
    ).toBe(false);
  });

  it("keeps triple-leaf workbench warnings distinct from two-leaf family-boundary diagnostics", () => {
    const result = evaluateDynamicWall({
      airborneContext: FIELD_CONTEXT,
      id: "triple-leaf-separate",
      outputs: FIELD_OUTPUTS,
      stack: [
        { materialId: "gypsum_board", thicknessMm: "12.5" },
        { materialId: "rockwool", thicknessMm: "50" },
        { materialId: "gypsum_board", thicknessMm: "12.5" },
        { materialId: "air_gap", thicknessMm: "50" },
        { materialId: "gypsum_board", thicknessMm: "12.5" }
      ]
    });

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("multileaf_multicavity");
    expect(result.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(
      result.warnings.some((warning: string) => /triple-leaf partition/i.test(warning))
    ).toBe(true);
    expect(
      result.warnings.some((warning: string) => /boundary between|still somewhat close/i.test(warning))
    ).toBe(false);
  });
});
