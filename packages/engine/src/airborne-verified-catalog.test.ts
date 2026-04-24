import { describe, expect, it } from "vitest";

import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import { WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS } from "./wall-timber-lightweight-source-corpus";

describe("airborne verified catalog anchors", () => {
  it("anchors exact lab rows to the official Rw value", () => {
    const result = calculateAssembly(
      [
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 5 },
        { materialId: "glasswool", thicknessMm: 70 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
        { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "element_lab",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good"
        },
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      }
    );

    expect(result.ratings.iso717.Rw).toBe(55);
    expect(result.metrics.estimatedRwDb).toBe(55);
    expect(result.warnings.some((warning: string) => /exact airborne lab match active/i.test(warning))).toBe(true);
  });

  it.each(WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS)(
    "anchors landed direct timber exact row $id to the official lab Rw",
    (row) => {
      const catalog = getDefaultMaterialCatalog();
      const layers = row.layers.map((layer) => {
        const material = resolveMaterial(layer.materialId, catalog);

        return {
          ...layer,
          material,
          surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
        };
      });
      const match = findVerifiedAirborneAssemblyMatch(layers, row.airborneContext);
      const result = calculateAssembly(row.layers, {
        airborneContext: row.airborneContext,
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });

      expect(match?.id).toBe(row.id);
      expect(result.ratings.iso717.Rw).toBe(row.expectedRw);
      expect(result.metrics.estimatedRwDb).toBe(row.expectedRw);
      expect(result.warnings.some((warning: string) => /exact airborne lab match active/i.test(warning))).toBe(true);
    }
  );

  it("anchors exact Xella masonry lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(
      layers,
      {
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        },
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      }
    );

    expect(match?.id).toBe("xella_ytong_d700_150_plaster10_official_2026");
    expect(result.ratings.iso717.Rw).toBe(47);
    expect(result.metrics.estimatedRwDb).toBe(47);
  });

  it("anchors exact Xella NL separatiepanelen lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "skim_plaster", thicknessMm: 3 },
      { materialId: "ytong_separatiepaneel_aac_5_750", thicknessMm: 100 },
      { materialId: "skim_plaster", thicknessMm: 3 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "element_lab",
        airtightness: "good"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(match?.id).toBe("xella_nl_ytong_sep_aac_5_750_100_skim3_lab_2026");
    expect(result.ratings.iso717.Rw).toBe(37);
    expect(result.metrics.estimatedRwDb).toBe(37);
  });

  it("anchors exact Xella NL massiefblokken lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "skim_plaster", thicknessMm: 3 },
      { materialId: "ytong_massief_g2_300", thicknessMm: 300 },
      { materialId: "skim_plaster", thicknessMm: 3 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "element_lab",
        airtightness: "good"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(match?.id).toBe("xella_nl_ytong_massief_g2_300_300_skim3_lab_2026");
    expect(result.ratings.iso717.Rw).toBe(49);
    expect(result.metrics.estimatedRwDb).toBe(49);
  });

  it("anchors exact Xella NL cellenbetonblokken lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "skim_plaster", thicknessMm: 3 },
      { materialId: "ytong_cellenbetonblok_g4_600", thicknessMm: 240 },
      { materialId: "skim_plaster", thicknessMm: 3 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "element_lab",
        airtightness: "good"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(match?.id).toBe("xella_nl_ytong_cellenbetonblok_g4_600_240_skim3_lab_2026");
    expect(result.ratings.iso717.Rw).toBe(48);
    expect(result.metrics.estimatedRwDb).toBe(48);
  });

  it("anchors exact Porotherm perforated-clay lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "element_lab",
        airtightness: "good"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(match?.id).toBe("wienerberger_porotherm_140_dense_plaster_primary_2026");
    expect(result.ratings.iso717.Rw).toBe(44);
    expect(result.metrics.estimatedRwDb).toBe(44);
  });

  it("anchors exact HELUZ clay masonry lab rows to the official Rw value", () => {
    const catalog = getDefaultMaterialCatalog();
    const layers = [
      { materialId: "lime_cement_plaster_1780", thicknessMm: 17 },
      { materialId: "heluz_aku_200_p15", thicknessMm: 200 },
      { materialId: "lime_cement_plaster_1780", thicknessMm: 17 }
    ].map((layer) => {
      const material = resolveMaterial(layer.materialId, catalog);

      return {
        ...layer,
        material,
        surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
      };
    });
    const match = findVerifiedAirborneAssemblyMatch(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });
    const result = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "element_lab",
        airtightness: "good"
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(match?.id).toBe("heluz_aku_200_p15_lab_2026");
    expect(result.ratings.iso717.Rw).toBe(53);
    expect(result.metrics.estimatedRwDb).toBe(53);
  });

  it("anchors exact field rows to the official DnT,A,k target through the local DnT,A proxy lane", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 60 },
        { materialId: "glasswool", thicknessMm: 40 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good",
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          sharedTrack: "independent",
          electricalBoxes: "none",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30
        },
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w", "DnT,A"]
      }
    );

    expect(result.ratings.field?.DnTA).toBe(43);
    expect(result.ratings.field?.DnTAk).toBe(43);
    expect(
      result.warnings.some((warning: string) => /DnT,A,k 43.0 dB through the local DnT,A proxy lane/i.test(warning))
    ).toBe(true);
  });

  it("does not apply the field anchor until DnT-side geometry is complete", () => {
    const result = calculateAssembly(
      [
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "air_gap", thicknessMm: 60 },
        { materialId: "glasswool", thicknessMm: 40 },
        { materialId: "gypsum", thicknessMm: 12.5 },
        { materialId: "gypsum", thicknessMm: 12.5 }
      ],
      {
        airborneContext: {
          contextMode: "field_between_rooms",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good"
        },
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w", "DnT,A"]
      }
    );

    expect(result.ratings.field?.DnTA).toBeUndefined();
    expect(result.ratings.field?.DnTAk).toBeUndefined();
    expect(result.warnings.some((warning: string) => /field match found/i.test(warning))).toBe(true);
    expect(result.warnings.some((warning: string) => /geometry is still incomplete/i.test(warning))).toBe(true);
  });
});
