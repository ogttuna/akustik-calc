import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { resolveMaterial } from "./material-catalog";

describe("public-source material catalog expansion direct calculation", () => {
  it("resolves new product-specific wall materials into dynamic airborne calculation", () => {
    const result = calculateAssembly(
      [
        { materialId: "gyproc_soundbloc_12_5", thicknessMm: 12.5 },
        { materialId: "tecsound_sy_70", thicknessMm: 3.5 },
        { materialId: "air_gap", thicknessMm: 70 },
        { materialId: "rockwool_afb_40", thicknessMm: 70 },
        { materialId: "quietrock_510", thicknessMm: 12.7 }
      ],
      {
        airborneContext: {
          airtightness: "good",
          contextMode: "element_lab"
        },
        calculator: "dynamic",
        targetOutputs: ["Rw", "STC"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.ratings.iso717.Rw).toBeGreaterThan(0);
    expect(result.metrics.estimatedStc).toBeGreaterThan(0);
    expect(result.unsupportedTargetOutputs).not.toContain("Rw");
    expect(result.layers.map((layer: { material: { id: string } }) => layer.material.id)).toEqual([
      "gyproc_soundbloc_12_5",
      "tecsound_sy_70",
      "air_gap",
      "rockwool_afb_40",
      "quietrock_510"
    ]);
    expect(Number(result.layers[0]!.surfaceMassKgM2.toFixed(1))).toBe(10.3);
    expect(Number(result.layers[1]!.surfaceMassKgM2.toFixed(1))).toBe(7);
  });

  it("uses new REGUPOL dynamic-stiffness materials directly in the heavy floating-floor impact route", () => {
    const result = calculateAssembly(
      [
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "resilient_layer", materialId: "regupol_sound_15", thicknessMm: 12 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      {
        calculator: "dynamic",
        floorImpactContext: {
          loadBasisKgM2: 100
        },
        targetOutputs: ["Ln,w", "DeltaLw"]
      }
    );

    expect(result.ok).toBe(true);
    expect(result.impact?.basis).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.impact?.resilientDynamicStiffnessMNm3).toBe(6);
    expect(result.impact?.DeltaLw).toBeGreaterThan(0);
    expect(result.impact?.LnW).toBeGreaterThan(0);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps aliases and density-derived surface masses wired for assistant-generated stacks", () => {
    const soundbloc = resolveMaterial("gyproc_soundbloc");
    const tecsound = resolveMaterial("tecsound70");
    const regupol = resolveMaterial("regupol_sound15");
    const currentCelcon = resolveMaterial("hh_celcon_standard");

    expect(soundbloc.id).toBe("gyproc_soundbloc_12_5");
    expect(tecsound.id).toBe("tecsound_sy_70");
    expect(regupol.impact?.dynamicStiffnessMNm3).toBe(6);
    expect(currentCelcon.id).toBe("hh_celcon_standard_600");
    expect(Number(computeLayerSurfaceMassKgM2({ thicknessMm: 3.5 }, tecsound).toFixed(1))).toBe(7);
    expect(Number(computeLayerSurfaceMassKgM2({ thicknessMm: 100 }, currentCelcon).toFixed(1))).toBe(60);
  });
});
