import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  BoundFloorSystem,
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  ImpactFieldContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type UbiqFloorSystem = BoundFloorSystem | ExactFloorSystem;

type RouteSnapshot = {
  boundBasis: string | null;
  boundMatchId: string | null;
  exactMatchId: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNT50UpperBound: number | null;
  lPrimeNTw: number | null;
  lPrimeNTwUpperBound: number | null;
  lPrimeNW: number | null;
  lPrimeNWUpperBound: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  lnWUpperBound: number | null;
  ratingsBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const ROLE_ORDER = [
  "ceiling_board",
  "ceiling_fill",
  "ceiling_cavity",
  "floor_covering",
  "resilient_layer",
  "upper_fill",
  "floating_screed",
  "base_structure"
] as const satisfies readonly FloorRole[];

const UBIQ_OPEN_WEB_EXACT_ROWS = EXACT_FLOOR_SYSTEMS.filter(
  (system) =>
    system.id.startsWith("ubiq_") &&
    system.id.includes("_open_web_steel_") &&
    system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
);

const UBIQ_OPEN_WEB_BOUND_ROWS = BOUND_FLOOR_SYSTEMS.filter(
  (system) =>
    system.id.startsWith("ubiq_") &&
    system.id.includes("_open_web_steel_") &&
    system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
);

function splitThickness(thicknessMm: number): readonly number[] {
  if (thicknessMm <= 2) {
    return [thicknessMm];
  }

  const first = Math.floor(thicknessMm / 2);
  return [first, thicknessMm - first];
}

function criteriaToLayers(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  options: {
    fragment: boolean;
  }
): readonly LayerInput[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      floorRole: role,
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm
    }));
  }

  const materialId = criteria.materialIds?.[0] ?? "generic_fill";
  const baseThicknessMm = criteria.thicknessMm ?? 1;
  const layerCount = criteria.layerCount ?? 1;

  return Array.from({ length: layerCount }).flatMap(() => {
    const schedule = options.fragment ? splitThickness(baseThicknessMm) : [baseThicknessMm];

    return schedule.map((thicknessMm) => ({
      floorRole: role,
      materialId,
      thicknessMm
    }));
  });
}

function layersFromSystem(system: UbiqFloorSystem, options: { fragment: boolean }): readonly LayerInput[] {
  return ROLE_ORDER.flatMap((role) => {
    const criteria =
      role === "base_structure"
        ? system.match.baseStructure
        : role === "ceiling_board"
        ? system.match.ceilingBoard
        : role === "ceiling_cavity"
        ? system.match.ceilingCavity
        : role === "ceiling_fill"
        ? system.match.ceilingFill
        : role === "floating_screed"
        ? system.match.floatingScreed
        : role === "floor_covering"
        ? system.match.floorCovering
        : role === "resilient_layer"
        ? system.match.resilientLayer
        : system.match.upperFill;

    return criteriaToLayers(role, criteria, options);
  });
}

function snapshot(
  layers: readonly LayerInput[],
  options: {
    impactFieldContext?: ImpactFieldContext;
    targetOutputs: readonly RequestedOutputId[];
  }
): RouteSnapshot {
  const result = calculateAssembly(layers, options);

  return {
    boundBasis: result.lowerBoundImpact?.basis ?? null,
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNT50UpperBound: result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNTwUpperBound: result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lPrimeNWUpperBound: result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged finish-family design", () => {
  it("keeps every imported UBIQ open-web exact package stable under source-equivalent fragmentation", () => {
    const failures: string[] = [];

    expect(UBIQ_OPEN_WEB_EXACT_ROWS).toHaveLength(90);

    for (const system of UBIQ_OPEN_WEB_EXACT_ROWS) {
      const canonicalLab = snapshot(layersFromSystem(system, { fragment: false }), { targetOutputs: LAB_OUTPUTS });
      const fragmentedLab = snapshot(layersFromSystem(system, { fragment: true }), { targetOutputs: LAB_OUTPUTS });
      const canonicalField = snapshot(layersFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmentedField = snapshot(layersFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonicalLab.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical lab stack missed exact id ${system.id}, got ${canonicalLab.exactMatchId}`);
      }

      if (canonicalField.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical field stack missed exact id ${system.id}, got ${canonicalField.exactMatchId}`);
      }

      if (JSON.stringify(fragmentedLab) !== JSON.stringify(canonicalLab)) {
        failures.push(`${system.id}: fragmented lab package drifted from canonical exact route`);
      }

      if (JSON.stringify(fragmentedField) !== JSON.stringify(canonicalField)) {
        failures.push(`${system.id}: fragmented field package drifted from canonical exact route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every imported UBIQ open-web bound package stable under source-equivalent fragmentation", () => {
    const failures: string[] = [];

    expect(UBIQ_OPEN_WEB_BOUND_ROWS).toHaveLength(21);

    for (const system of UBIQ_OPEN_WEB_BOUND_ROWS) {
      const canonicalLab = snapshot(layersFromSystem(system, { fragment: false }), { targetOutputs: LAB_OUTPUTS });
      const fragmentedLab = snapshot(layersFromSystem(system, { fragment: true }), { targetOutputs: LAB_OUTPUTS });
      const canonicalField = snapshot(layersFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmentedField = snapshot(layersFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonicalLab.boundMatchId !== system.id) {
        failures.push(`${system.id}: canonical lab stack missed bound id ${system.id}, got ${canonicalLab.boundMatchId}`);
      }

      if (canonicalField.boundMatchId !== system.id) {
        failures.push(`${system.id}: canonical field stack missed bound id ${system.id}, got ${canonicalField.boundMatchId}`);
      }

      if (JSON.stringify(fragmentedLab) !== JSON.stringify(canonicalLab)) {
        failures.push(`${system.id}: fragmented lab package drifted from canonical bound route`);
      }

      if (JSON.stringify(fragmentedField) !== JSON.stringify(canonicalField)) {
        failures.push(`${system.id}: fragmented field package drifted from canonical bound route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps UBIQ exact, combined-bound, and weak-band package lanes separated", () => {
    const weakRows = UBIQ_OPEN_WEB_EXACT_ROWS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id));
    const supportedExactRows = UBIQ_OPEN_WEB_EXACT_ROWS.filter((system) => /^ubiq_fl(?:24|26|28)_open_web_steel_/u.test(system.id));
    const weakCarpetExactRows = weakRows.filter((system) => system.id.includes("carpet_underlay_exact"));
    const supportedCarpetExactRows = supportedExactRows.filter((system) => system.id.includes("carpet"));
    const supportedCarpetBoundRows = UBIQ_OPEN_WEB_BOUND_ROWS.filter(
      (system) => /^ubiq_fl(?:24|26|28)_open_web_steel_/u.test(system.id) && system.id.includes("carpet_lnw_plus_ci_bound")
    );

    expect(weakRows).toHaveLength(54);
    expect(supportedExactRows).toHaveLength(36);
    expect(new Set(weakRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));
    expect(weakCarpetExactRows).toHaveLength(18);
    expect(supportedCarpetExactRows).toEqual([]);
    expect(supportedCarpetBoundRows).toHaveLength(18);
    expect(new Set(supportedCarpetBoundRows.map((system) => system.impactBounds.LnWPlusCIUpperBound))).toEqual(new Set([45]));
    expect(new Set(supportedCarpetBoundRows.map((system) => system.impactBounds.LnWUpperBound))).toEqual(new Set([undefined]));
  });
});
