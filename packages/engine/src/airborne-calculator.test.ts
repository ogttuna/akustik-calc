import type { AirborneCalculator } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

describe("imported airborne calculators", () => {
  const seedWall = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "air_gap", thicknessMm: 50 },
    { materialId: "concrete", thicknessMm: 100 }
  ] as const;

  it("keeps the screening path as default", () => {
    const result = calculateAssembly(seedWall);

    expect(result.calculatorId).toBeUndefined();
    expect(result.metrics.method).toBe("screening_mass_law_curve_seed_v3");
    expect(result.availableCalculators.map((entry: AirborneCalculator) => entry.id)).toEqual([
      "dynamic",
      "ks_rw_calibrated",
      "mass_law",
      "sharp",
      "kurtovic"
    ]);
  });

  it("can select imported comparison calculators from Acoustic2", () => {
    const ks = calculateAssembly(seedWall, { calculator: "ks_rw_calibrated" });
    const massLaw = calculateAssembly(seedWall, { calculator: "mass_law" });
    const sharp = calculateAssembly(seedWall, { calculator: "sharp" });
    const kurtovic = calculateAssembly(seedWall, { calculator: "kurtovic" });

    expect(ks.calculatorId).toBe("ks_rw_calibrated");
    expect(ks.metrics.method).toBe("ks_rw_calibrated");
    expect(ks.metrics.estimatedRwDb).toBe(52.1);
    expect(ks.ratings.iso717.Rw).toBe(52);
    expect(ks.ratings.iso717.C).toBe(-1);
    expect(ks.ratings.iso717.Ctr).toBe(-5.8);
    expect(ks.ratings.astmE413.STC).toBe(52);

    expect(massLaw.calculatorId).toBe("mass_law");
    expect(massLaw.metrics.method).toBe("mass_law");
    expect(massLaw.metrics.estimatedRwDb).toBe(58);
    expect(massLaw.ratings.iso717.Rw).toBe(58);
    expect(massLaw.ratings.iso717.C).toBe(-1.1);
    expect(massLaw.ratings.iso717.Ctr).toBe(-5.9);
    expect(massLaw.ratings.astmE413.STC).toBe(58);

    expect(sharp.calculatorId).toBe("sharp");
    expect(sharp.metrics.method).toBe("sharp");
    expect(sharp.metrics.estimatedRwDb).toBe(50);
    expect(sharp.ratings.iso717.Rw).toBe(50);
    expect(sharp.ratings.iso717.C).toBe(-1.2);
    expect(sharp.ratings.iso717.Ctr).toBe(-7.3);
    expect(sharp.ratings.astmE413.STC).toBe(51);

    expect(kurtovic.calculatorId).toBe("kurtovic");
    expect(kurtovic.metrics.method).toBe("kurtovic");
    expect(kurtovic.metrics.estimatedRwDb).toBe(58);
    expect(kurtovic.ratings.iso717.Rw).toBe(58);
    expect(kurtovic.ratings.iso717.C).toBe(-2.2);
    expect(kurtovic.ratings.iso717.Ctr).toBe(-8.7);
    expect(kurtovic.ratings.astmE413.STC).toBe(59);
  });

  it("can select the local dynamic airborne lane", () => {
    const dynamic = calculateAssembly(seedWall, { calculator: "dynamic" });

    expect(dynamic.calculatorId).toBe("dynamic");
    expect(dynamic.metrics.method).toBe("dynamic");
    expect(dynamic.ratings.iso717.Rw).toBe(57);
    expect(dynamic.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(dynamic.dynamicAirborneTrace?.selectedMethod).toBe("mass_law");
    expect(dynamic.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });
});
