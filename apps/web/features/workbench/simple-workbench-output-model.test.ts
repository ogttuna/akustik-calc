import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";

function buildFixture(overrides: Partial<AssemblyCalculation> = {}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [40, 50, 60]
    },
    impact: null,
    layers: [],
    metrics: {
      airGapCount: 0,
      estimatedCDb: -1,
      estimatedCtrDb: -4,
      estimatedRwDb: 56,
      estimatedStc: 55,
      insulationCount: 0,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 180,
      totalThicknessMm: 120
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 56 (-1;-4)",
        descriptor: "Rw"
      }
    },
    warnings: [],
    ...overrides
  } as AssemblyCalculation;
}

describe("simple workbench output model", () => {
  it("prefers floor-lane companion Rw over the live airborne estimate on floor studies", () => {
    const card = buildOutputCard({
      output: "Rw",
      result: buildFixture({
        floorSystemRatings: {
          Rw: 75,
          RwCtr: 68,
          RwCtrSemantic: "rw_plus_ctr",
          basis: "official_floor_system_exact_match"
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail:
          "Companion airborne rating carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
        label: "Rw",
        status: "live",
        value: "75 dB"
      })
    );
  });

  it("keeps wall-study Rw on the live airborne calculator", () => {
    const card = buildOutputCard({
      output: "Rw",
      result: buildFixture({
        floorSystemRatings: {
          Rw: 75,
          RwCtr: 68,
          RwCtrSemantic: "rw_plus_ctr",
          basis: "official_floor_system_exact_match"
        }
      }),
      studyMode: "wall"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail: "Weighted airborne element rating from the active airborne calculator.",
        label: "Rw",
        status: "live",
        value: "56 dB"
      })
    );
  });
});
