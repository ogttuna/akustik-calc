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

    expect(boundary.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(boundary.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(boundary.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(boundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
    expect(
      boundary.warnings.some((warning: string) => /boundary between Lined Massive Wall and Double Leaf/i.test(warning))
    ).toBe(true);

    expect(upper.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(upper.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
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
