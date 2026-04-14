import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type UbiqWeakBandSourceRow = {
  bareLnW: number;
  bareLnWPlusCi: number;
  carpetLnW: number;
  carpetLnWPlusCi: number;
  family: "FL-23" | "FL-25" | "FL-27";
  floorCoveringMaterialId: "carpet_with_foam_underlay" | "engineered_timber_with_acoustic_underlay";
  floorCoveringThicknessMm: number;
  inexFloorMm: number;
  joistMm: number;
  rw: number;
  rwPlusCtr: number;
  timberLnW: number;
  timberLnWPlusCi: number;
};

type RuntimeSnapshot = {
  boundFloorSystemEstimateKind: string | null;
  boundFloorSystemMatchId: string | null;
  dntw: number | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  rw: number | null;
  rwPrime: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

const FIELD_AIRBORNE_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FIELD_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_WEAK_BAND_SOURCE_ROWS: readonly UbiqWeakBandSourceRow[] = [
  {
    bareLnW: 77,
    bareLnWPlusCi: 76,
    carpetLnW: 64,
    carpetLnWPlusCi: 63,
    family: "FL-23",
    floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay",
    floorCoveringThicknessMm: 20,
    inexFloorMm: 19,
    joistMm: 300,
    rw: 51,
    rwPlusCtr: 44,
    timberLnW: 71,
    timberLnWPlusCi: 70
  },
  {
    bareLnW: 77,
    bareLnWPlusCi: 76,
    carpetLnW: 64,
    carpetLnWPlusCi: 63,
    family: "FL-25",
    floorCoveringMaterialId: "engineered_timber_with_acoustic_underlay",
    floorCoveringThicknessMm: 20,
    inexFloorMm: 19,
    joistMm: 300,
    rw: 52,
    rwPlusCtr: 45,
    timberLnW: 71,
    timberLnWPlusCi: 70
  },
  {
    bareLnW: 76,
    bareLnWPlusCi: 75,
    carpetLnW: 63,
    carpetLnWPlusCi: 62,
    family: "FL-27",
    floorCoveringMaterialId: "carpet_with_foam_underlay",
    floorCoveringThicknessMm: 15,
    inexFloorMm: 19,
    joistMm: 400,
    rw: 55,
    rwPlusCtr: 48,
    timberLnW: 70,
    timberLnWPlusCi: 69
  }
];

const EXPECTED_RUNTIME_SNAPSHOTS: Record<
  UbiqWeakBandSourceRow["family"],
  {
    field: RuntimeSnapshot;
    lab: RuntimeSnapshot;
  }
> = {
  "FL-23": {
    lab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 73,
      rwPrime: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    field: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: 74,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 71,
      rwPrime: 71,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  "FL-25": {
    lab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 73,
      rwPrime: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    field: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: 74,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 71,
      rwPrime: 71,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  "FL-27": {
    lab: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 76,
      rwPrime: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    },
    field: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      dntw: 77,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rw: 74,
      rwPrime: 74,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  }
};

function weakBandLayers(sourceRow: UbiqWeakBandSourceRow): readonly LayerInput[] {
  return [
    {
      floorRole: "floor_covering",
      materialId: sourceRow.floorCoveringMaterialId,
      thicknessMm: sourceRow.floorCoveringThicknessMm
    },
    {
      floorRole: "floating_screed",
      materialId: "inex_floor_panel",
      thicknessMm: sourceRow.inexFloorMm
    },
    {
      floorRole: "base_structure",
      materialId: "open_web_steel_floor",
      thicknessMm: sourceRow.joistMm
    }
  ];
}

function calculate(sourceRow: UbiqWeakBandSourceRow, mode: "field" | "lab") {
  return calculateAssembly(
    weakBandLayers(sourceRow),
    mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: FIELD_AIRBORNE_CONTEXT,
          impactFieldContext: FIELD_IMPACT_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );
}

function snapshot(sourceRow: UbiqWeakBandSourceRow, mode: "field" | "lab"): RuntimeSnapshot {
  const result = calculate(sourceRow, mode);

  return {
    boundFloorSystemEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    dntw: result.metrics.estimatedDnTwDb ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web weaker-band posture guard", () => {
  it("pins the official FL-23/25/27 weak-band source values used by exact import", () => {
    expect(UBIQ_SYSTEM_TABLE_URL).toBe("https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf");
    expect(UBIQ_WEAK_BAND_SOURCE_ROWS.map((row) => row.family)).toEqual(["FL-23", "FL-25", "FL-27"]);

    for (const sourceRow of UBIQ_WEAK_BAND_SOURCE_ROWS) {
      expect(sourceRow.bareLnW).toBeGreaterThanOrEqual(76);
      expect(sourceRow.timberLnW).toBeGreaterThanOrEqual(70);
      expect(sourceRow.carpetLnW).toBeGreaterThanOrEqual(63);
      expect(sourceRow.timberLnWPlusCi).toBeGreaterThanOrEqual(69);
      expect(sourceRow.carpetLnWPlusCi).toBeGreaterThanOrEqual(62);
    }
  });

  it("keeps FL-23/25/27 imported as exact-only correction rows with bound support still closed", () => {
    const exactRows = EXACT_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_/u.test(system.id));
    const boundIds = BOUND_FLOOR_SYSTEMS.map((system) => system.id);

    expect(exactRows).toHaveLength(54);
    expect(new Set(exactRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));
    expect(boundIds.filter((id) => /^ubiq_fl(?:23|25|27)_/u.test(id))).toEqual([]);
  });

  it("keeps representative weak-band visible packages impact-fail-closed instead of borrowing FL-24/26/28 ratings", () => {
    const failures: string[] = [];

    for (const sourceRow of UBIQ_WEAK_BAND_SOURCE_ROWS) {
      const lab = calculate(sourceRow, "lab");
      const field = calculate(sourceRow, "field");
      const actualLab = snapshot(sourceRow, "lab");
      const actualField = snapshot(sourceRow, "field");
      const expected = EXPECTED_RUNTIME_SNAPSHOTS[sourceRow.family];

      if (JSON.stringify(actualLab) !== JSON.stringify(expected.lab)) {
        failures.push(`${sourceRow.family} lab: expected ${JSON.stringify(expected.lab)}, got ${JSON.stringify(actualLab)}`);
      }

      if (JSON.stringify(actualField) !== JSON.stringify(expected.field)) {
        failures.push(`${sourceRow.family} field: expected ${JSON.stringify(expected.field)}, got ${JSON.stringify(actualField)}`);
      }

      if (!lab.warnings.some((warning: string) => /impact sound outputs are not available/i.test(warning))) {
        failures.push(`${sourceRow.family} lab: missing unsupported impact warning`);
      }

      if (!field.warnings.some((warning: string) => /impact sound outputs are not available/i.test(warning))) {
        failures.push(`${sourceRow.family} field: missing unsupported impact warning`);
      }

      if (
        [...lab.warnings, ...field.warnings].some((warning: string) =>
          /published family estimate active: lightweight steel/i.test(warning)
        )
      ) {
        failures.push(`${sourceRow.family}: should not surface a lightweight-steel family estimate warning`);
      }
    }

    expect(failures).toEqual([]);
  });
});
