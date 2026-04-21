// Lab-fallback lookup audit — when field context mode is requested
// but the verified airborne catalog only has lab-mode entries for
// the given layers, the lookup must still surface the lab entry with
// a fallback flag. This lets the anchor pipeline enforce the lab Rw
// ceiling on apparent field R'w (ISO 140-4 flanking non-negativity).
//
// This is the unit-level guard behind the
// `airborne-catalog-field-anchor-lab-fallback.test.ts` integration
// test and the `wall-physical-invariants-matrix.test.ts` acceptance
// test. If this matcher drifts, the whole field R'w ≤ lab Rw chain
// becomes silently conditional on which benchmarks happen to be
// represented as `field` vs `lab` in the catalog.

import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatchWithLabFallback } from "./airborne-verified-catalog";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

function resolveLayers(rows: { materialId: string; thicknessMm: number }[]) {
  const catalog = getDefaultMaterialCatalog();
  return rows.map((row) => {
    const material = resolveMaterial(row.materialId, catalog);
    return {
      ...row,
      material,
      surfaceMassKgM2: (material.densityKgM3 * row.thicknessMm) / 1000
    };
  });
}

describe("findVerifiedAirborneAssemblyMatchWithLabFallback", () => {
  it("returns the lab entry directly (no fallback) for lab context", () => {
    const layers = resolveLayers([
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ]);

    const result = findVerifiedAirborneAssemblyMatchWithLabFallback(layers, {
      contextMode: "element_lab",
      airtightness: "good"
    });

    expect(result?.match?.id).toBe("wienerberger_porotherm_100_dense_plaster_primary_2026");
    expect(result?.match?.sourceMode).toBe("lab");
    expect(result?.usedLabFallback).toBe(false);
  });

  it("falls back to the lab entry when field context has no field-mode match", () => {
    const layers = resolveLayers([
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ]);

    const result = findVerifiedAirborneAssemblyMatchWithLabFallback(layers, {
      contextMode: "field_between_rooms",
      airtightness: "good",
      panelHeightMm: 3000,
      panelWidthMm: 4200
    });

    expect(result?.match?.id).toBe("wienerberger_porotherm_100_dense_plaster_primary_2026");
    expect(result?.match?.sourceMode).toBe("lab");
    expect(result?.usedLabFallback).toBe(true);
  });

  it("falls back for building_prediction context just like field_between_rooms", () => {
    const layers = resolveLayers([
      { materialId: "lightweight_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "lightweight_plaster", thicknessMm: 13 }
    ]);

    const result = findVerifiedAirborneAssemblyMatchWithLabFallback(layers, {
      contextMode: "building_prediction",
      airtightness: "good",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55
    });

    expect(result?.match?.id).toBe("wienerberger_porotherm_140_light_plaster_primary_2026");
    expect(result?.match?.sourceMode).toBe("lab");
    expect(result?.usedLabFallback).toBe(true);
  });

  it("returns null when neither field nor lab entries match the layer stack", () => {
    const layers = resolveLayers([
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 250 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ]);

    const result = findVerifiedAirborneAssemblyMatchWithLabFallback(layers, {
      contextMode: "field_between_rooms",
      airtightness: "good",
      panelHeightMm: 3000,
      panelWidthMm: 4200
    });

    expect(result).toBeNull();
  });

  it("does not trigger the lab fallback when context is null (lookup behaves as lab mode)", () => {
    const layers = resolveLayers([
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ]);

    // Null context makes `preferredCatalogMode` return "lab" and
    // `essentialMetaMatches` conservatively reject the Porotherm
    // LAB_MASONRY_CONTEXT expectation (airtightness=good). The
    // important guarantee is that the fallback path is NOT used —
    // we stay on the direct-match codepath.
    const result = findVerifiedAirborneAssemblyMatchWithLabFallback(layers, null);

    expect(result?.usedLabFallback ?? false).toBe(false);
  });
});
