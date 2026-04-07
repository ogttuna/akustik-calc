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

    expect(boundary.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(boundary.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(boundary.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(boundary.dynamicAirborneTrace?.familyDecisionMargin ?? Infinity).toBeLessThanOrEqual(0.1);
    expect(boundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
    expect(
      boundary.dynamicAirborneTrace?.notes.some((note: string) => /family boundary is ambiguous/i.test(note))
    ).toBe(true);
    expect(
      boundary.warnings.some((warning: string) => /boundary between Lined Massive Wall and Double Leaf/i.test(warning))
    ).toBe(true);

    expect(upper.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(upper.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(upper.dynamicAirborneTrace?.runnerUpFamily).toBeUndefined();
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
