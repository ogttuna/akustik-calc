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
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: [],
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

  it("prefers floor-lane companion Ctr over the live airborne estimate on floor studies", () => {
    const card = buildOutputCard({
      output: "Ctr",
      result: buildFixture({
        supportedTargetOutputs: ["Ctr"],
        unsupportedTargetOutputs: [],
        floorSystemRatings: {
          Rw: 83,
          RwCtr: -17,
          RwCtrSemantic: "ctr_term",
          basis: "official_floor_system_exact_match"
        },
        metrics: {
          ...buildFixture().metrics,
          estimatedCtrDb: -6
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail:
          "Companion traffic-noise adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
        label: "Ctr",
        status: "live",
        value: "-17 dB"
      })
    );
  });

  it("derives floor-lane Ctr from published Rw plus Ctr companions", () => {
    const card = buildOutputCard({
      output: "Ctr",
      result: buildFixture({
        supportedTargetOutputs: ["Ctr"],
        unsupportedTargetOutputs: [],
        floorSystemRatings: {
          Rw: 75,
          RwCtr: 68,
          RwCtrSemantic: "rw_plus_ctr",
          basis: "official_floor_system_exact_match"
        },
        metrics: {
          ...buildFixture().metrics,
          estimatedCtrDb: -4
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        label: "Ctr",
        status: "live",
        value: "-7 dB"
      })
    );
  });

  it("derives floor-lane C from published Rw plus C companions", () => {
    const card = buildOutputCard({
      output: "C",
      result: buildFixture({
        supportedTargetOutputs: ["C"],
        unsupportedTargetOutputs: [],
        floorSystemRatings: {
          Rw: 49,
          RwCtr: 44.52764215440286,
          RwCtrSemantic: "rw_plus_c",
          basis: "official_floor_system_exact_match"
        },
        metrics: {
          ...buildFixture().metrics,
          estimatedCDb: -1
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail:
          "Companion mid-frequency adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
        label: "C",
        status: "live",
        value: "-4.5 dB"
      })
    );
  });

  it("does not surface Rw plus C companions as Ctr", () => {
    const card = buildOutputCard({
      output: "Ctr",
      result: buildFixture({
        supportedTargetOutputs: ["C"],
        unsupportedTargetOutputs: ["Ctr"],
        floorSystemRatings: {
          Rw: 49,
          RwCtr: 44.52764215440286,
          RwCtrSemantic: "rw_plus_c",
          basis: "official_floor_system_exact_match"
        },
        metrics: {
          ...buildFixture().metrics,
          estimatedCtrDb: -6
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        label: "Ctr",
        status: "unsupported",
        value: "Not ready"
      })
    );
  });

  it("keeps wall-study Rw on the live airborne calculator", () => {
    const card = buildOutputCard({
      output: "Rw",
      result: buildFixture({
        supportedTargetOutputs: ["Rw"],
        unsupportedTargetOutputs: [],
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

  it("does not surface unsupported floor-lane companion Rw when the support bucket keeps it hidden", () => {
    const card = buildOutputCard({
      output: "Rw",
      result: buildFixture({
        floorSystemRatings: {
          Rw: 40,
          RwCtr: 34,
          RwCtrSemantic: "rw_plus_ctr",
          basis: "screening_mass_law_curve_seed_v3"
        },
        metrics: {
          ...buildFixture().metrics,
          estimatedRwDb: 39.8
        },
        supportedTargetOutputs: ["R'w", "DnT,w"],
        unsupportedTargetOutputs: ["Rw", "Ln,w"]
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        label: "Rw",
        status: "unsupported",
        value: "Not ready"
      })
    );
  });

  it("does not surface wall-side Rw once the apparent field route marks it unsupported", () => {
    const card = buildOutputCard({
      output: "Rw",
      result: buildFixture({
        metrics: {
          ...buildFixture().metrics,
          estimatedRwDb: 49.7,
          estimatedRwPrimeDb: 50
        },
        supportedTargetOutputs: ["R'w", "Dn,w", "Dn,A"],
        unsupportedTargetOutputs: ["Rw"]
      }),
      studyMode: "wall"
    });

    expect(card).toEqual(
      expect.objectContaining({
        label: "Rw",
        status: "unsupported",
        value: "Not ready"
      })
    );
  });

  it("keeps bound-only Ln,w cards explicit as conservative upper bounds instead of live reads", () => {
    const card = buildOutputCard({
      output: "Ln,w",
      result: buildFixture({
        lowerBoundImpact: {
          LnWUpperBound: 51
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail:
          "Conservative upper bound from a bound-only floor family lane. DynEcho keeps this separate from any live airborne companion still shown on the same route.",
        label: "Ln,w",
        status: "bound",
        value: "<= 51 dB"
      })
    );
  });

  it("keeps standardized field-side bounds explicit when only the conservative carry-over is available", () => {
    const card = buildOutputCard({
      output: "L'nT,w",
      result: buildFixture({
        lowerBoundImpact: {
          LPrimeNTwUpperBound: 51
        }
      }),
      studyMode: "floor"
    });

    expect(card).toEqual(
      expect.objectContaining({
        detail:
          "Conservative standardized field impact upper bound carried from the same bound-only lane.",
        label: "L'nT,w",
        status: "bound",
        value: "<= 51 dB"
      })
    );
  });
});
