import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  ImpactFieldContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type RouteSnapshot = {
  candidateIds: readonly string[] | null;
  exactMatchId: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  ratingsBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

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

const TUAS_OPEN_BOX_ROWS = EXACT_FLOOR_SYSTEMS.filter(
  (system) =>
    system.id.startsWith("tuas_") &&
    system.id.includes("_open_box_") &&
    system.match.baseStructure?.materialIds?.includes("open_box_timber_slab") === true
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

function layersFromSystem(system: ExactFloorSystem, options: { fragment: boolean }): readonly LayerInput[] {
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
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("TUAS open-box same-package fragmentation design", () => {
  it("keeps every imported TUAS open-box source-equivalent fragmented package on the exact lab impact lane", () => {
    const failures: string[] = [];

    expect(TUAS_OPEN_BOX_ROWS).toHaveLength(15);

    for (const system of TUAS_OPEN_BOX_ROWS) {
      const canonical = snapshot(layersFromSystem(system, { fragment: false }), { targetOutputs: LAB_OUTPUTS });
      const fragmented = snapshot(layersFromSystem(system, { fragment: true }), { targetOutputs: LAB_OUTPUTS });

      if (canonical.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical stack missed exact id ${system.id}, got ${canonical.exactMatchId}`);
      }

      if (JSON.stringify(fragmented) !== JSON.stringify(canonical)) {
        failures.push(`${system.id}: fragmented lab package drifted from canonical route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every imported TUAS open-box source-equivalent fragmented package on the same field continuation", () => {
    const failures: string[] = [];

    expect(TUAS_OPEN_BOX_ROWS).toHaveLength(15);

    for (const system of TUAS_OPEN_BOX_ROWS) {
      const canonical = snapshot(layersFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmented = snapshot(layersFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonical.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical field stack missed exact id ${system.id}, got ${canonical.exactMatchId}`);
      }

      if (JSON.stringify(fragmented) !== JSON.stringify(canonical)) {
        failures.push(`${system.id}: fragmented field package drifted from canonical route`);
      }
    }

    expect(failures).toEqual([]);
  });
});
