import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

type FamilyCase = {
  materialId: string;
  name: string;
  monotonicFloorThicknessMm: number;
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
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const FAMILY_CASES: FamilyCase[] = [
  {
    materialId: "ytong_aac_d700",
    name: "aac_lined_massive",
    monotonicFloorThicknessMm: 100
  },
  {
    materialId: "pumice_block",
    name: "pumice_lined_massive",
    monotonicFloorThicknessMm: 100
  }
];

const THICKNESSES_MM = [60, 80, 100, 120, 140, 150, 160];

function buildLayers(materialId: string, thicknessMm: number): LayerInput[] {
  return [
    { materialId, thicknessMm },
    { materialId: "air_gap", thicknessMm: 50 },
    { materialId: "gypsum", thicknessMm: 12.5 }
  ];
}

describe("airborne lined massive stability", () => {
  it("keeps masonry-backed lined-massive thickness steps broadly monotonic in lab and field", () => {
    for (const familyCase of FAMILY_CASES) {
      const labValues: number[] = [];
      const fieldValues: number[] = [];
      const labStrategies: Array<string | undefined> = [];
      const fieldStrategies: Array<string | undefined> = [];

      for (const thicknessMm of THICKNESSES_MM) {
        const lab = calculateAssembly(buildLayers(familyCase.materialId, thicknessMm), {
          airborneContext: LAB_CONTEXT,
          calculator: "dynamic",
          targetOutputs: ["Rw"]
        });
        const field = calculateAssembly(buildLayers(familyCase.materialId, thicknessMm), {
          airborneContext: FIELD_CONTEXT,
          calculator: "dynamic",
          targetOutputs: ["R'w", "DnT,w"]
        });

        labValues.push(lab.ratings.iso717.Rw);
        fieldValues.push(field.ratings.field?.DnTw ?? 0);
        labStrategies.push(lab.dynamicAirborneTrace?.strategy);
        fieldStrategies.push(field.dynamicAirborneTrace?.strategy);
      }

      for (let index = 1; index < labValues.length; index += 1) {
        const labAllowedDropDb = labStrategies[index]?.includes("family_boundary_hold") ? 2 : 1;
        const fieldAllowedDropDb = fieldStrategies[index]?.includes("family_boundary_hold") ? 2 : 1;

        expect(
          labValues[index],
          `${familyCase.name} lab sequence dropped outside held corridor: ${JSON.stringify(labValues)}`
        ).toBeGreaterThanOrEqual(labValues[index - 1] - labAllowedDropDb);
        expect(
          fieldValues[index],
          `${familyCase.name} field sequence dropped outside held corridor: ${JSON.stringify(fieldValues)}`
        ).toBeGreaterThanOrEqual(fieldValues[index - 1] - fieldAllowedDropDb);
      }
    }
  });

  it("applies the reinforcement monotonic floor at active masonry-backed lined-massive transitions", () => {
    for (const familyCase of FAMILY_CASES) {
      const result = calculateAssembly(buildLayers(familyCase.materialId, familyCase.monotonicFloorThicknessMm), {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w"]
      });

      expect(result.dynamicAirborneTrace?.detectedFamily, familyCase.name).toBe("lined_massive_wall");
      expect(result.dynamicAirborneTrace?.strategy, familyCase.name).toContain("reinforcement_monotonic_floor");
      expect(
        result.dynamicAirborneTrace?.notes.some((note: string) => /family-transition drop|thinner sibling variants/i.test(note)),
        familyCase.name
      ).toBe(true);
    }
  });
});
