import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemMatchCriteria,
  FloorSystemRoleCriteria,
  LayerInput
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { deriveImpactGuideMetrics } from "./impact-guide";

const MATCH_ROLE_ENTRIES: Array<[FloorRole, keyof FloorSystemMatchCriteria]> = [
  ["ceiling_board", "ceilingBoard"],
  ["ceiling_fill", "ceilingFill"],
  ["ceiling_cavity", "ceilingCavity"],
  ["upper_fill", "upperFill"],
  ["floating_screed", "floatingScreed"],
  ["floor_covering", "floorCovering"],
  ["resilient_layer", "resilientLayer"],
  ["base_structure", "baseStructure"]
];

function getDefaultThicknessMm(role: FloorRole): number {
  switch (role) {
    case "base_structure":
      return 150;
    case "ceiling_board":
      return 12.5;
    case "ceiling_cavity":
      return 25;
    case "ceiling_fill":
      return 90;
    case "floating_screed":
      return 19;
    case "floor_covering":
      return 8;
    case "resilient_layer":
      return 5;
    case "upper_fill":
      return 50;
  }
}

function buildLayersFromCriteria(match: FloorSystemMatchCriteria): LayerInput[] {
  const layers: LayerInput[] = [];

  for (const [role, key] of MATCH_ROLE_ENTRIES) {
    const criteria = match[key] as FloorSystemRoleCriteria | undefined;

    if (!criteria) {
      continue;
    }

    const materialId = criteria.materialIds?.[0];
    if (!materialId) {
      throw new Error(`Cannot build ${role} layer without at least one material id.`);
    }

    const layerCount = criteria.layerCount ?? 1;
    const thicknessMm = criteria.thicknessMm ?? getDefaultThicknessMm(role);

    for (let index = 0; index < layerCount; index += 1) {
      layers.push({
        floorRole: role,
        materialId,
        thicknessMm
      });
    }
  }

  return layers;
}

function buildExactSystemResult(system: ExactFloorSystem, options?: Parameters<typeof calculateAssembly>[1]) {
  if (system.manualMatch === false) {
    return calculateAssembly([], {
      ...options,
      impactPredictorInput: {
        officialFloorSystemId: system.id
      }
    });
  }

  return calculateAssembly(buildLayersFromCriteria(system.match), options);
}

describe("curated floor-library sweep", () => {
  it("every manual-topology exact floor-system row still resolves through the engine", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false)) {
      const result = calculateAssembly(buildLayersFromCriteria(system.match));

      if (result.floorSystemMatch?.system.id !== system.id) {
        failures.push(`${system.id}: expected exact match, got ${result.floorSystemMatch?.system.id ?? "none"}`);
        continue;
      }

      if (result.impact?.LnW !== system.impactRatings.LnW) {
        failures.push(`${system.id}: expected Ln,w ${system.impactRatings.LnW}, got ${result.impact?.LnW ?? "none"}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("every curated exact floor-system row resolves by official id when selected directly", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS) {
      const result = calculateAssembly([], {
        impactPredictorInput: {
          officialFloorSystemId: system.id
        }
      });

      if (result.floorSystemMatch?.system.id !== system.id) {
        failures.push(`${system.id}: expected direct id resolution, got ${result.floorSystemMatch?.system.id ?? "none"}`);
        continue;
      }

      if (result.impact?.LnW !== system.impactRatings.LnW) {
        failures.push(`${system.id}: expected direct-id Ln,w ${system.impactRatings.LnW}, got ${result.impact?.LnW ?? "none"}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("preset-only exact rows stay off the manual topology exact lane", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch === false)) {
      const result = calculateAssembly(buildLayersFromCriteria(system.match));

      if (result.floorSystemMatch?.system.id === system.id) {
        failures.push(`${system.id}: expected preset-only row to avoid manual topology exact matching`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("every curated bound floor-system row resolves to a conservative bound lane", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      const result = calculateAssembly(buildLayersFromCriteria(system.match));

      if (result.boundFloorSystemMatch?.system.id !== system.id) {
        failures.push(`${system.id}: expected bound match, got ${result.boundFloorSystemMatch?.system.id ?? "none"}`);
        continue;
      }

      if (result.impact !== null) {
        failures.push(`${system.id}: expected no exact impact metric, got ${result.impact.basis}`);
      }

      if (result.lowerBoundImpact?.LnWUpperBound !== system.impactBounds.LnWUpperBound) {
        failures.push(
          `${system.id}: expected Ln,w upper bound ${system.impactBounds.LnWUpperBound}, got ${result.lowerBoundImpact?.LnWUpperBound ?? "none"}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("every exact floor row can continue into field-side guide outputs when K and V are provided", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS) {
      const result = buildExactSystemResult(system);
      const impact = result.floorSystemMatch?.impact ?? result.impact;

      if (!impact?.LnW) {
        failures.push(`${system.id}: missing exact Ln,w before field-side derivation`);
        continue;
      }

      const guide = deriveImpactGuideMetrics({
        baseConfidence: impact.confidence,
        baseLnW: impact.LnW,
        ci50_2500Db: impact.CI50_2500,
        ciDb: impact.CI,
        hdDb: 0,
        kDb: 2,
        receivingRoomVolumeM3: 50,
        source: "live_stack"
      });

      if (!guide || typeof guide.LPrimeNW !== "number" || typeof guide.LPrimeNTw !== "number") {
        failures.push(`${system.id}: expected non-empty L'n,w and L'nT,w guide outputs`);
        continue;
      }

      if (typeof impact.CI50_2500 === "number" && typeof guide.LPrimeNT50 !== "number") {
        failures.push(`${system.id}: expected standardized L'nT,50 when CI,50-2500 is published`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("every exact floor row can continue into direct field-side main-lane outputs when K and V are provided", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS) {
      const result = buildExactSystemResult(system, {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      });
      const impact = result.impact;

      if (!impact?.LnW) {
        failures.push(`${system.id}: missing exact Ln,w before direct field-side derivation`);
        continue;
      }

      if (typeof impact.LPrimeNW !== "number" || typeof impact.LPrimeNTw !== "number") {
        failures.push(`${system.id}: expected direct L'n,w and L'nT,w outputs on the main impact lane`);
        continue;
      }

      if (typeof system.impactRatings.CI50_2500 === "number" && typeof impact.LPrimeNT50 !== "number") {
        failures.push(`${system.id}: expected direct standardized L'nT,50 on the main impact lane`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("every bound-only floor row can continue into conservative field-side upper bounds when K and V are provided", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      const result = calculateAssembly(buildLayersFromCriteria(system.match));
      const lowerBoundImpact = result.boundFloorSystemMatch?.lowerBoundImpact ?? result.lowerBoundImpact;

      if (!lowerBoundImpact?.LnWUpperBound) {
        failures.push(`${system.id}: missing lab-side Ln,w upper bound before guide derivation`);
        continue;
      }

      const guide = deriveImpactGuideMetrics({
        baseConfidence: lowerBoundImpact.confidence,
        baseLnWUpperBound: lowerBoundImpact.LnWUpperBound,
        kDb: 2,
        receivingRoomVolumeM3: 50,
        source: "live_stack"
      });

      if (!guide || typeof guide.LPrimeNWUpperBound !== "number" || typeof guide.LPrimeNTwUpperBound !== "number") {
        failures.push(`${system.id}: expected non-empty L'n,w / L'nT,w upper bounds`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("every bound-only floor row can continue into conservative direct field-side upper bounds on the main lane", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      const result = calculateAssembly(buildLayersFromCriteria(system.match), {
        impactFieldContext: {
          fieldKDb: 2,
          receivingRoomVolumeM3: 50
        }
      });
      const lowerBoundImpact = result.lowerBoundImpact;

      if (!lowerBoundImpact?.LnWUpperBound) {
        failures.push(`${system.id}: missing lab-side Ln,w upper bound before direct field carry-over`);
        continue;
      }

      if (
        typeof lowerBoundImpact.LPrimeNWUpperBound !== "number" ||
        typeof lowerBoundImpact.LPrimeNTwUpperBound !== "number"
      ) {
        failures.push(`${system.id}: expected direct L'n,w / L'nT,w upper bounds on the main lane`);
      }
    }

    expect(failures).toEqual([]);
  });
});
