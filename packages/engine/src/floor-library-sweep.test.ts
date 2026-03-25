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
import {
  getVisibleLayerPredictorBlockerWarning,
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";

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
const MERGE_SAFE_PACKED_ROLES = new Set<FloorRole>([
  "base_structure",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);
const SINGLE_ENTRY_SCHEDULE_ROLES = new Set<FloorRole>([
  "base_structure",
  "ceiling_cavity",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);
const HIGH_SPLIT_LAYER_COUNTS = [2, 3, 5, 10, 20, 29] as const;
const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI"] as const;
const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const;
const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  partitionHeightM: 4,
  partitionWidthM: 4.5,
  receivingRoomVolumeM3: 55,
  separatingAreaM2: 18
};
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

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

function buildPackedLayersFromCriteria(match: FloorSystemMatchCriteria): LayerInput[] {
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
    const canPackRole = layerCount > 1 && criteria.materialIds?.length === 1 && MERGE_SAFE_PACKED_ROLES.has(role);

    if (canPackRole) {
      layers.push({
        floorRole: role,
        materialId,
        thicknessMm: thicknessMm * layerCount
      });
      continue;
    }

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

function buildHighSplitLayersFromCriteria(
  match: FloorSystemMatchCriteria,
  splitLayerCount: number
): LayerInput[] {
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
    const canSplitRole = criteria.materialIds?.length === 1 && MERGE_SAFE_PACKED_ROLES.has(role);

    if (canSplitRole) {
      for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
        const splitThicknessMm = Math.round((thicknessMm / splitLayerCount) * 1000) / 1000;
        let usedThicknessMm = 0;

        for (let splitIndex = 0; splitIndex < splitLayerCount; splitIndex += 1) {
          const remainingThicknessMm = Math.round((thicknessMm - usedThicknessMm) * 1000) / 1000;
          const nextThicknessMm = splitIndex === splitLayerCount - 1 ? remainingThicknessMm : splitThicknessMm;
          usedThicknessMm = Math.round((usedThicknessMm + nextThicknessMm) * 1000) / 1000;

          layers.push({
            floorRole: role,
            materialId,
            thicknessMm: nextThicknessMm
          });
        }
      }

      continue;
    }

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

function buildDisjointSplitLayersFromCriteria(
  match: FloorSystemMatchCriteria,
  roleToSplit: FloorRole
): LayerInput[] | null {
  if (!SINGLE_ENTRY_SCHEDULE_ROLES.has(roleToSplit)) {
    return null;
  }

  const layers = buildLayersFromCriteria(match);
  const roleIndices = layers.flatMap((layer, index) => (layer.floorRole === roleToSplit ? [index] : []));

  if (roleIndices.length !== 1) {
    return null;
  }

  const roleIndex = roleIndices[0]!;
  const originalLayer = layers[roleIndex]!;
  const firstHalfThicknessMm = Math.round((originalLayer.thicknessMm / 2) * 1000) / 1000;
  const secondHalfThicknessMm = Math.round((originalLayer.thicknessMm - firstHalfThicknessMm) * 1000) / 1000;

  if (!(firstHalfThicknessMm > 0 && secondHalfThicknessMm > 0)) {
    return null;
  }

  const nextDifferentRoleIndex = layers.findIndex((layer, index) => index > roleIndex && layer.floorRole !== roleToSplit);
  let previousDifferentRoleIndex = -1;

  for (let index = roleIndex - 1; index >= 0; index -= 1) {
    if (layers[index]?.floorRole !== roleToSplit) {
      previousDifferentRoleIndex = index;
      break;
    }
  }

  if (nextDifferentRoleIndex === -1 && previousDifferentRoleIndex === -1) {
    return null;
  }

  const splitLayers = layers.map((layer, index) =>
    index === roleIndex
      ? {
          ...layer,
          thicknessMm: firstHalfThicknessMm
        }
      : layer
  );
  const trailingHalf: LayerInput = {
    ...originalLayer,
    thicknessMm: secondHalfThicknessMm
  };

  if (nextDifferentRoleIndex !== -1) {
    splitLayers.splice(nextDifferentRoleIndex + 1, 0, trailingHalf);
    return splitLayers;
  }

  splitLayers.splice(previousDifferentRoleIndex, 0, trailingHalf);
  return splitLayers;
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

function resultSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    basis: result.impact?.basis ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lowerBoundLnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
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

  it("disjoint split schedules do not sneak back into the curated exact floor-system lane", () => {
    const failures: string[] = [];

    for (const system of EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false)) {
      for (const [role, key] of MATCH_ROLE_ENTRIES) {
        const criteria = system.match[key] as FloorSystemRoleCriteria | undefined;
        if (!criteria || !SINGLE_ENTRY_SCHEDULE_ROLES.has(role)) {
          continue;
        }

        const disjointSplitLayers = buildDisjointSplitLayersFromCriteria(system.match, role);
        if (!disjointSplitLayers) {
          continue;
        }

        const result = calculateAssembly(disjointSplitLayers);
        if (result.floorSystemMatch?.system.id) {
          failures.push(`${system.id} role ${role}: expected no exact match after disjoint split, got ${result.floorSystemMatch.system.id}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("disjoint split schedules keep auto predictor derivation fail-closed across curated floor-library rows", () => {
    const failures: string[] = [];

    for (const system of [...EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false), ...BOUND_FLOOR_SYSTEMS]) {
      for (const [role, key] of MATCH_ROLE_ENTRIES) {
        const criteria = system.match[key] as FloorSystemRoleCriteria | undefined;
        if (!criteria || !SINGLE_ENTRY_SCHEDULE_ROLES.has(role)) {
          continue;
        }

        const disjointSplitLayers = buildDisjointSplitLayersFromCriteria(system.match, role);
        if (!disjointSplitLayers) {
          continue;
        }

        const predictorInput = maybeBuildImpactPredictorInputFromLayerStack(disjointSplitLayers);
        const blockerWarning = getVisibleLayerPredictorBlockerWarning(disjointSplitLayers);

        if (predictorInput) {
          failures.push(`${system.id} role ${role}: expected predictor derivation to stay fail-closed after disjoint split`);
        }

        if (!blockerWarning || !/single-entry floor roles are duplicated/i.test(blockerWarning)) {
          failures.push(`${system.id} role ${role}: expected predictor blocker warning after disjoint split`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("every merge-safe manual exact and bound floor-system row stays stable when counted roles are packed into one layer in the lab bundle", () => {
    const failures: string[] = [];

    for (const system of [...EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false), ...BOUND_FLOOR_SYSTEMS]) {
      const canonicalResult = calculateAssembly(buildLayersFromCriteria(system.match), {
        targetOutputs: LAB_OUTPUTS
      });
      const packedResult = calculateAssembly(buildPackedLayersFromCriteria(system.match), {
        targetOutputs: LAB_OUTPUTS
      });

      if (JSON.stringify(resultSnapshot(canonicalResult)) !== JSON.stringify(resultSnapshot(packedResult))) {
        failures.push(
          `${system.id}: expected packed-layer lab parity, canonical=${JSON.stringify(resultSnapshot(canonicalResult))} packed=${JSON.stringify(resultSnapshot(packedResult))}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("every merge-safe manual exact and bound floor-system row stays stable when counted roles are packed into one layer in the field bundle", () => {
    const failures: string[] = [];

    for (const system of [...EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false), ...BOUND_FLOOR_SYSTEMS]) {
      const canonicalResult = calculateAssembly(buildLayersFromCriteria(system.match), {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const packedResult = calculateAssembly(buildPackedLayersFromCriteria(system.match), {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (JSON.stringify(resultSnapshot(canonicalResult)) !== JSON.stringify(resultSnapshot(packedResult))) {
        failures.push(
          `${system.id}: expected packed-layer field parity, canonical=${JSON.stringify(resultSnapshot(canonicalResult))} packed=${JSON.stringify(resultSnapshot(packedResult))}`
        );
      }
    }

    expect(failures).toEqual([]);
  });

  it("every merge-safe manual exact and bound floor-system row stays stable across multiple high split counts in the lab bundle", () => {
    const failures: string[] = [];

    for (const system of [...EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false), ...BOUND_FLOOR_SYSTEMS]) {
      const canonicalResult = calculateAssembly(buildLayersFromCriteria(system.match), {
        targetOutputs: LAB_OUTPUTS
      });

      for (const splitLayerCount of HIGH_SPLIT_LAYER_COUNTS) {
        const splitResult = calculateAssembly(buildHighSplitLayersFromCriteria(system.match, splitLayerCount), {
          targetOutputs: LAB_OUTPUTS
        });

        if (JSON.stringify(resultSnapshot(canonicalResult)) !== JSON.stringify(resultSnapshot(splitResult))) {
          failures.push(
            `${system.id}: expected split-layer lab parity at x${splitLayerCount}, canonical=${JSON.stringify(resultSnapshot(canonicalResult))} split=${JSON.stringify(resultSnapshot(splitResult))}`
          );
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("every merge-safe manual exact and bound floor-system row stays stable across multiple high split counts in the field bundle", () => {
    const failures: string[] = [];

    for (const system of [...EXACT_FLOOR_SYSTEMS.filter((entry) => entry.manualMatch !== false), ...BOUND_FLOOR_SYSTEMS]) {
      const canonicalResult = calculateAssembly(buildLayersFromCriteria(system.match), {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      for (const splitLayerCount of HIGH_SPLIT_LAYER_COUNTS) {
        const splitResult = calculateAssembly(buildHighSplitLayersFromCriteria(system.match, splitLayerCount), {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        });

        if (JSON.stringify(resultSnapshot(canonicalResult)) !== JSON.stringify(resultSnapshot(splitResult))) {
          failures.push(
            `${system.id}: expected split-layer field parity at x${splitLayerCount}, canonical=${JSON.stringify(resultSnapshot(canonicalResult))} split=${JSON.stringify(resultSnapshot(splitResult))}`
          );
        }
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

  it("disjoint split schedules do not sneak back into the curated bound-only floor-system lane", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      for (const [role, key] of MATCH_ROLE_ENTRIES) {
        const criteria = system.match[key] as FloorSystemRoleCriteria | undefined;
        if (!criteria || !SINGLE_ENTRY_SCHEDULE_ROLES.has(role)) {
          continue;
        }

        const disjointSplitLayers = buildDisjointSplitLayersFromCriteria(system.match, role);
        if (!disjointSplitLayers) {
          continue;
        }

        const result = calculateAssembly(disjointSplitLayers);
        if (result.boundFloorSystemMatch?.system.id) {
          failures.push(
            `${system.id} role ${role}: expected no bound-only exact match after disjoint split, got ${result.boundFloorSystemMatch.system.id}`
          );
        }
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
