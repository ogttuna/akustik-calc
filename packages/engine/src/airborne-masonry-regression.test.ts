import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomVolumeM3: 30
};

function calculateDynamic(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs:
      airborneContext.contextMode === "element_lab"
        ? ["Rw"]
        : ["R'w", "DnT,w"]
  });
}

describe("airborne masonry regressions", () => {
  it("keeps outer compliant layers from changing the single-leaf masonry result", () => {
    const base = calculateDynamic([{ materialId: "ytong_aac_d700", thicknessMm: 100 }], LAB_CONTEXT);
    const trailing = calculateDynamic(
      [
        { materialId: "ytong_aac_d700", thicknessMm: 100 },
        { materialId: "rockwool", thicknessMm: 50 }
      ],
      LAB_CONTEXT
    );
    const leading = calculateDynamic(
      [
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "ytong_aac_d700", thicknessMm: 100 }
      ],
      LAB_CONTEXT
    );

    expect(base.dynamicAirborneTrace?.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(trailing.dynamicAirborneTrace?.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(leading.dynamicAirborneTrace?.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(base.ratings.iso717.Rw).toBe(trailing.ratings.iso717.Rw);
    expect(base.ratings.iso717.Rw).toBe(leading.ratings.iso717.Rw);
    expect(
      trailing.dynamicAirborneTrace?.notes.some((note: string) => /outermost solid leaves|outer compliant layers/i.test(note))
    ).toBe(true);
    expect(
      leading.dynamicAirborneTrace?.notes.some((note: string) => /outermost solid leaves|outer compliant layers/i.test(note))
    ).toBe(true);
  });

  it("caps narrow heavy cavity gains against the contact-equivalent masonry wall", () => {
    const base = calculateDynamic(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      LAB_CONTEXT
    );
    const split = calculateDynamic(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "air_gap", thicknessMm: 10 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      LAB_CONTEXT
    );
    const splitField = calculateDynamic(
      [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "air_gap", thicknessMm: 10 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "ytong_aac_d700", thicknessMm: 75 },
        { materialId: "gypsum_board", thicknessMm: 12.5 }
      ],
      FIELD_CONTEXT
    );

    expect(base.dynamicAirborneTrace?.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(split.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(split.ratings.iso717.Rw).toBeLessThanOrEqual(base.ratings.iso717.Rw + 6);
    expect(split.ratings.iso717.Rw).toBeLessThan(60);
    expect(split.dynamicAirborneTrace?.strategy).toContain("narrow_heavy_gap_cap");
    expect(
      split.dynamicAirborneTrace?.notes.some((note: string) => /contact-equivalent wall/i.test(note))
    ).toBe(true);
    expect(
      split.warnings.some((warning: string) => /contact-equivalent wall/i.test(warning))
    ).toBe(true);
    expect(splitField.ratings.field?.DnTw ?? 0).toBeLessThanOrEqual(55);
  });

  it("keeps single-leaf masonry thickness steps broadly monotonic in lab and field", () => {
    const families = [
      {
        name: "aac_raw",
        layersForThickness: (thicknessMm: number): LayerInput[] => [{ materialId: "ytong_aac_d700", thicknessMm }]
      },
      {
        name: "aac_plaster10",
        layersForThickness: (thicknessMm: number): LayerInput[] => [
          { materialId: "cement_plaster", thicknessMm: 10 },
          { materialId: "ytong_aac_d700", thicknessMm },
          { materialId: "cement_plaster", thicknessMm: 10 }
        ]
      },
      {
        name: "pumice_raw",
        layersForThickness: (thicknessMm: number): LayerInput[] => [{ materialId: "pumice_block", thicknessMm }]
      },
      {
        name: "pumice_plaster10",
        layersForThickness: (thicknessMm: number): LayerInput[] => [
          { materialId: "cement_plaster", thicknessMm: 10 },
          { materialId: "pumice_block", thicknessMm },
          { materialId: "cement_plaster", thicknessMm: 10 }
        ]
      }
    ];
    const thicknessesMm = [30, 40, 50, 60, 80, 100, 120, 140, 160];

    for (const family of families) {
      const labValues: number[] = [];
      const fieldValues: number[] = [];

      for (const thicknessMm of thicknessesMm) {
        const lab = calculateDynamic(family.layersForThickness(thicknessMm), LAB_CONTEXT);
        const field = calculateDynamic(family.layersForThickness(thicknessMm), FIELD_CONTEXT);

        expect(lab.dynamicAirborneTrace?.detectedFamily, `${family.name} ${thicknessMm}`).toBe("masonry_nonhomogeneous");
        labValues.push(lab.ratings.iso717.Rw);
        fieldValues.push(field.ratings.field?.DnTw ?? 0);
      }

      for (let index = 1; index < labValues.length; index += 1) {
        expect(
          labValues[index],
          `${family.name} lab sequence dropped too far: ${JSON.stringify(labValues)}`
        ).toBeGreaterThanOrEqual(labValues[index - 1] - 1);
        expect(
          fieldValues[index],
          `${family.name} field sequence dropped too far: ${JSON.stringify(fieldValues)}`
        ).toBeGreaterThanOrEqual(fieldValues[index - 1] - 1);
      }
    }
  });

  it("applies the single-leaf masonry floor when plastered AAC thickness steps would otherwise dip", () => {
    const result = calculateDynamic(
      [
        { materialId: "cement_plaster", thicknessMm: 10 },
        { materialId: "ytong_aac_d700", thicknessMm: 50 },
        { materialId: "cement_plaster", thicknessMm: 10 }
      ],
      FIELD_CONTEXT
    );

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(result.dynamicAirborneTrace?.strategy).toContain("single_leaf_masonry_floor");
    expect(
      result.dynamicAirborneTrace?.notes.some((note: string) => /thickness dip|thinner sibling variants/i.test(note))
    ).toBe(true);
  });
});
