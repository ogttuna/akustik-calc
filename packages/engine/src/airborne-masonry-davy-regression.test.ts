import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const MATERIAL_CATALOG = getDefaultMaterialCatalog();

function resolveLayers(layers: readonly LayerInput[]): ResolvedLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, MATERIAL_CATALOG);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  });
}

describe("airborne masonry Davy regression", () => {
  it("caps generic low-density AAC monoblock stacks into the upstream ultimate corridor", () => {
    const layers: LayerInput[] = [
      { materialId: "cement_plaster", thicknessMm: 20 },
      { materialId: "celcon_solar_grade", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 20 }
    ];
    const resolvedLayers = resolveLayers(layers);
    const uncapped = calculateDynamicAirborneResult(resolvedLayers, {
      airborneContext: LAB_CONTEXT,
      disableMasonryDavyCap: true,
      screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
    });
    const capped = calculateDynamicAirborneResult(resolvedLayers, {
      airborneContext: LAB_CONTEXT,
      screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
    });
    const finalResult = calculateAssembly(layers, {
      airborneContext: LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(uncapped.trace.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(capped.trace.detectedFamily).toBe("masonry_nonhomogeneous");
    expect(uncapped.rw - capped.rw).toBeGreaterThanOrEqual(3);
    expect(capped.trace.strategy).toContain("masonry_davy_cap");
    expect(capped.rw).toBeGreaterThanOrEqual(45);
    expect(capped.rw).toBeLessThanOrEqual(47);
    expect(finalResult.ratings.iso717.Rw).toBe(capped.rw);
  });

  it("does not override source-specific Celcon finished-aircrete corridors", () => {
    const layers: LayerInput[] = [
      { materialId: "celcon_lwt_plaster", thicknessMm: 13 },
      { materialId: "celcon_standard_grade", thicknessMm: 150 },
      { materialId: "celcon_lwt_plaster", thicknessMm: 13 }
    ];
    const resolvedLayers = resolveLayers(layers);
    const uncapped = calculateDynamicAirborneResult(resolvedLayers, {
      airborneContext: LAB_CONTEXT,
      disableMasonryDavyCap: true,
      screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
    });
    const capped = calculateDynamicAirborneResult(resolvedLayers, {
      airborneContext: LAB_CONTEXT,
      screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
    });

    expect(capped.trace.strategy).not.toContain("masonry_davy_cap");
    expect(capped.rw).toBe(uncapped.rw);
    expect(Math.abs(capped.rw - 46.5)).toBeLessThanOrEqual(1);
  });
});
