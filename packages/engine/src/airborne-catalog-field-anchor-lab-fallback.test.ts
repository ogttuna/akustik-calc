// Field-mode anchor lab-fallback audit — guarantees `applyVerified
// AirborneCatalogAnchor` enforces the lab Rw ceiling on apparent
// R'w even when the catalog carries only a lab-mode entry for the
// requested layer stack. Without this, mass-law-overestimating
// materials (clay hollow brick etc.) produce field R'w > lab Rw,
// violating ISO 140-4.
//
// The fallback target is `lab_benchmark - flanking_penalty_db`.
// That keeps R'w under the lab Rw ceiling and lets the overlay's
// flanking magnitude remain visible (R'w displaced below Rw by the
// same amount the overlay attributed to the junction graph).

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

describe("applyVerifiedAirborneCatalogAnchor lab-fallback in field context", () => {
  it("anchors Porotherm 100 + dense plaster field run below the lab benchmark", () => {
    const layers = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const lab = calculateAssembly(layers, {
      airborneContext: { contextMode: "element_lab", airtightness: "good" },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    const field = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 3000,
        panelWidthMm: 4200
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w"]
    });

    expect(lab.ratings.iso717.Rw).toBe(43);
    expect(field.ratings.iso717.Rw).toBeLessThanOrEqual(43);
    expect(field.ratings.field?.RwPrime ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(43);
    expect(
      field.warnings.some((warning: string) =>
        /lab[- ]fallback|lab fallback|apparent ceiling|lab ceiling/i.test(warning)
      )
    ).toBe(true);
  });

  it("anchors Porotherm 140 + light plaster field run below the lab benchmark", () => {
    const layers = [
      { materialId: "lightweight_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "lightweight_plaster", thicknessMm: 13 }
    ];

    const lab = calculateAssembly(layers, {
      airborneContext: { contextMode: "element_lab", airtightness: "good" },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    const field = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 3000,
        panelWidthMm: 4200
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w"]
    });

    expect(lab.ratings.iso717.Rw).toBe(41);
    expect(field.ratings.iso717.Rw).toBeLessThanOrEqual(41);
    expect(field.ratings.field?.RwPrime ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(41);
  });

  it("still anchors Porotherm field run under the building_prediction context", () => {
    const layers = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_190", thicknessMm: 190 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const lab = calculateAssembly(layers, {
      airborneContext: { contextMode: "element_lab", airtightness: "good" },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    const field = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "building_prediction",
        airtightness: "good",
        panelHeightMm: 3000,
        panelWidthMm: 4200,
        receivingRoomRt60S: 0.7,
        receivingRoomVolumeM3: 55
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(lab.ratings.iso717.Rw).toBe(48);
    expect(field.ratings.iso717.Rw).toBeLessThanOrEqual(48);
    expect(field.ratings.field?.RwPrime ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(48);
  });

  it("leaves lab-mode Porotherm anchoring behaviour unchanged", () => {
    const layers = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const result = calculateAssembly(layers, {
      airborneContext: { contextMode: "element_lab", airtightness: "good" },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    // Lab mode must keep the benchmarked Rw ceiling regardless of
    // whether the anchor curve-shift fired (if the dynamic curve
    // already produces Rw=43 the anchor is a no-op) or produced a
    // trace warning. What matters: the displayed and carried Rw is
    // the lab benchmark (43), and no lab-fallback warning leaks
    // into lab context.
    expect(result.ratings.iso717.Rw).toBe(43);
    expect(result.metrics.estimatedRwDb).toBe(43);
    expect(
      result.warnings.some((warning: string) => /lab[- ]fallback/i.test(warning))
    ).toBe(false);
  });

  it("leaves Ytong field mode consistent with the lab Rw ceiling", () => {
    const layers = [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ];

    const lab = calculateAssembly(layers, {
      airborneContext: { contextMode: "element_lab", airtightness: "good" },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    const field = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 3000,
        panelWidthMm: 4200
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w"]
    });

    const labRw = lab.ratings.iso717.Rw;
    const fieldRwPrime =
      field.ratings.field?.RwPrime ??
      (field.ratings.iso717 as { RwPrime?: number }).RwPrime ??
      field.ratings.iso717.Rw;

    expect(fieldRwPrime).toBeLessThanOrEqual(labRw + 0.5);
  });

  it("does not engage the fallback when no verified catalog entry matches the layers", () => {
    const layers = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 250 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const field = calculateAssembly(layers, {
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 3000,
        panelWidthMm: 4200
      },
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w"]
    });

    expect(
      field.warnings.some((warning: string) => /lab[- ]fallback|lab fallback/i.test(warning))
    ).toBe(false);
  });
});
