import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { LayerInput } from "@dynecho/shared";

// Regression guard for the 2026-04-22 step-7 finding: splitting a
// masonry core into two same-material halves with no gap between
// them is physically a no-op (mass and topology preserved), but
// the masonry calibrators in `dynamic-airborne-masonry-calibration.ts`
// were gating on `solidLayers.length === 3` and falling off the
// calibration lane when the split produced 4 solid leaves. The
// engine-side fix coalesces adjacent same-material solid leaves
// before the structural checks fire, so the split variant must
// now produce the same Rw as the intact stack.

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

function runLab(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, { calculator: "dynamic", targetOutputs: WALL_LAB_OUTPUTS });
}

describe("masonry calibration stays stable when a same-material core is split into halves with no gap", () => {
  it("porotherm 100 mm intact vs 50+50 split produces the same Rw (dense plaster finish)", () => {
    const intact: LayerInput[] = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const splitEqual: LayerInput[] = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 50 },
      { materialId: "porotherm_pls_100", thicknessMm: 50 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const splitAsymmetric: LayerInput[] = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 40 },
      { materialId: "porotherm_pls_100", thicknessMm: 60 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    const intactResult = runLab(intact);
    const splitEqualResult = runLab(splitEqual);
    const splitAsymmetricResult = runLab(splitAsymmetric);

    expect(intactResult.metrics.estimatedRwDb).toBe(43);
    expect(splitEqualResult.metrics.estimatedRwDb).toBe(intactResult.metrics.estimatedRwDb);
    expect(splitAsymmetricResult.metrics.estimatedRwDb).toBe(intactResult.metrics.estimatedRwDb);
  });

  it("symmetric plaster facings split into halves stay on the calibration lane", () => {
    const intact: LayerInput[] = [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ];

    // Finish-side symmetric split — left plaster 6.5+6.5, right plaster 6.5+6.5.
    const splitFinishes: LayerInput[] = [
      { materialId: "dense_plaster", thicknessMm: 6.5 },
      { materialId: "dense_plaster", thicknessMm: 6.5 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 },
      { materialId: "dense_plaster", thicknessMm: 6.5 },
      { materialId: "dense_plaster", thicknessMm: 6.5 }
    ];

    const intactResult = runLab(intact);
    const splitResult = runLab(splitFinishes);

    expect(splitResult.metrics.estimatedRwDb).toBe(intactResult.metrics.estimatedRwDb);
  });
});
