import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";

const TARGET_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);

  return evaluateScenario({
    id: preset.id,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({
      ...row,
      id: `${preset.id}-${index + 1}`
    })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

describe("official product preset breadth", () => {
  it("keeps the added exact official product-system presets on their exact catalog rows", () => {
    const cases = [
      {
        catalogId: "regupol_sonus_multi_45_tile_match_2026",
        deltaLw: 19,
        label: /REGUPOL sonus multi 4\.5, 150 mm slab, 30 mm screed, 8 mm tile/i,
        lnW: 60,
        presetId: "regupol_multi_45_tile_exact" as const
      },
      {
        catalogId: "regupol_sonus_multi_45_porcelain_match_2026",
        deltaLw: 17,
        label: /REGUPOL sonus multi 4\.5, 150 mm slab, 10 mm porcelain tile/i,
        lnW: 61,
        presetId: "regupol_multi_45_porcelain_exact" as const
      }
    ];

    for (const testCase of cases) {
      const scenario = evaluatePreset(testCase.presetId);

      expect(scenario.result).not.toBeNull();
      expect(scenario.result?.impactCatalogMatch?.catalog.id).toBe(testCase.catalogId);
      expect(scenario.result?.impact?.basis).toBe("predictor_catalog_exact_match_official");
      expect(scenario.result?.impact?.LnW).toBe(testCase.lnW);
      expect(scenario.result?.impact?.DeltaLw).toBe(testCase.deltaLw);
      expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
      expect(scenario.result?.unsupportedTargetOutputs).toContain("Ln,w+CI");
      expect(scenario.warnings.some((warning) => /Official impact product row active:/i.test(warning))).toBe(true);
      expect(scenario.warnings.some((warning) => testCase.label.test(warning))).toBe(true);
    }
  });

  it("keeps the added official product-delta presets on the product-delta lane without fabricating CI companions", () => {
    const cases = [
      {
        catalogId: "getzner_afm21_catalog_2026",
        deltaLw: 21,
        lnW: 57,
        presetId: "getzner_afm_21_delta" as const
      },
      {
        catalogId: "getzner_afm35_catalog_2026",
        deltaLw: 35,
        lnW: 43,
        presetId: "getzner_afm_35_delta" as const
      }
    ];

    for (const testCase of cases) {
      const scenario = evaluatePreset(testCase.presetId);

      expect(scenario.result).not.toBeNull();
      expect(scenario.result?.impactCatalogMatch?.catalog.id).toBe(testCase.catalogId);
      expect(scenario.result?.impact?.basis).toBe("predictor_catalog_product_delta_official");
      expect(scenario.result?.impact?.LnW).toBe(testCase.lnW);
      expect(scenario.result?.impact?.DeltaLw).toBe(testCase.deltaLw);
      expect(scenario.result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
      expect(scenario.result?.unsupportedTargetOutputs).toContain("Ln,w+CI");
      expect(
        scenario.warnings.some((warning) =>
          new RegExp(`Official impact product row active: Getzner AFM ${testCase.deltaLw} catalog DeltaLw`, "i").test(
            warning
          )
        )
      ).toBe(true);
    }
  });
});
