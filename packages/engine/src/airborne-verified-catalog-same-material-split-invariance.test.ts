import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { AirborneContext, LayerInput } from "@dynecho/shared";

// Regression guard for the 2026-04-22 step-7 finding F2: the
// verified-catalog match at `layersApproximatelyMatch`
// (packages/engine/src/airborne-verified-catalog.ts) gated on
// strict `inputLayers.length === referenceLayers.length`. When
// a torture-matrix variant split a same-material run (e.g.
// the 70 mm glasswool cavity fill into 35+35, or an acoustic
// gypsum facing into 6.25+6.25), the split produced 7 layers
// vs. the 6-layer reference — the exact Knauf catalog match
// stopped firing and the engine fell back to a formula lane
// that drifted +5 dB (Rw=55 → 60 on LSF lab).
//
// Fix coalesces adjacent same-material layers on BOTH input
// and reference sides before the length + per-position check,
// restoring idempotency under same-material splits.

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;
const LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

function runLab(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, {
    airborneContext: LSF_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });
}

describe("verified-catalog matcher stays on the exact-anchor lane when same-material layers split", () => {
  it("Knauf LSF 70 mm glasswool split into 35+35 still hits the exact anchor (Rw=55)", () => {
    const intact: LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ];

    const splitGlasswool: LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 35 },
      { materialId: "glasswool", thicknessMm: 35 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ];

    const intactResult = runLab(intact);
    const splitResult = runLab(splitGlasswool);

    expect(intactResult.metrics.estimatedRwDb).toBe(55);
    expect(splitResult.metrics.estimatedRwDb).toBe(intactResult.metrics.estimatedRwDb);
  });

  it("Knauf LSF facing split into 6.25+6.25 halves still hits the exact anchor (Rw=55)", () => {
    const intact: LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
    ];

    const splitFacing: LayerInput[] = [
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 5 },
      { materialId: "glasswool", thicknessMm: 70 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 6.25 },
      { materialId: "acoustic_gypsum_board", thicknessMm: 6.25 }
    ];

    const intactResult = runLab(intact);
    const splitResult = runLab(splitFacing);

    expect(splitResult.metrics.estimatedRwDb).toBe(intactResult.metrics.estimatedRwDb);
  });
});
