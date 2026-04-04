import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { FloorRole, FloorSystemMatchCriteria, FloorSystemRoleCriteria, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { maybeInferFloorRoleLayerStack } from "./impact-predictor-input";

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

const REQUESTED_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const;

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

function buildLayersFromCriteria(match: FloorSystemMatchCriteria, mode: "raw" | "tagged"): LayerInput[] {
  const layers: LayerInput[] = [];

  for (const [role, key] of MATCH_ROLE_ENTRIES) {
    const criteria = match[key] as FloorSystemRoleCriteria | undefined;

    if (!criteria) {
      continue;
    }

    const materialId = criteria.materialIds?.[0];

    if (!materialId) {
      throw new Error(`Cannot build ${role} layer without a material id.`);
    }

    const layerCount = criteria.layerCount ?? 1;
    const thicknessMm = criteria.thicknessMm ?? getDefaultThicknessMm(role);

    for (let index = 0; index < layerCount; index += 1) {
      layers.push({
        ...(mode === "tagged" ? { floorRole: role } : {}),
        materialId,
        thicknessMm
      });
    }
  }

  return layers;
}

function coreSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    floorRw: result.floorSystemRatings?.Rw ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    impactLnW: result.impact?.LnW ?? null,
    impactLnWPlusCI: result.impact?.LnWPlusCI ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("raw floor exact exception audit", () => {
  it("keeps the current no-safe-inference exact rows explicit", () => {
    const ids = EXACT_FLOOR_SYSTEMS.filter((system) => {
      const rawLayers = buildLayersFromCriteria(system.match, "raw");
      return !maybeInferFloorRoleLayerStack(rawLayers);
    }).map((system) => system.id);

    expect(ids).toEqual(["euracoustics_f0_bare_concrete_lab_2026", "pmc_m1_bare_composite_lab_2026"]);
  });

  it("lets the bare-concrete raw stack land the curated exact row without role backfill", () => {
    expect(
      maybeInferFloorRoleLayerStack([
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toBeNull();

    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      targetOutputs: REQUESTED_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe("euracoustics_f0_bare_concrete_lab_2026");
    expect(result.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(77);
    expect(result.floorSystemRatings?.Rw).toBe(56);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
  });

  it("keeps the same bare-concrete exact landing on the impact-only surface", () => {
    const result = calculateImpactOnly([{ materialId: "concrete", thicknessMm: 140 }], {
      targetOutputs: ["Rw", "Ln,w"]
    });

    expect(result.floorSystemMatch?.system.id).toBe("euracoustics_f0_bare_concrete_lab_2026");
    expect(result.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(result.sourceMode).toBe("predictor_input");
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
  });

  it("keeps the curated floor library free of raw-vs-tagged core drifts after the Phase 2 inference fix", () => {
    const drifts = EXACT_FLOOR_SYSTEMS.map((system) => {
      const tagged = calculateAssembly(buildLayersFromCriteria(system.match, "tagged"), {
        targetOutputs: REQUESTED_OUTPUTS
      });
      const raw = calculateAssembly(buildLayersFromCriteria(system.match, "raw"), {
        targetOutputs: REQUESTED_OUTPUTS
      });

      return {
        id: system.id,
        manualMatch: system.manualMatch ?? true,
        raw: coreSnapshot(raw),
        same: JSON.stringify(coreSnapshot(tagged)) === JSON.stringify(coreSnapshot(raw)),
        tagged: coreSnapshot(tagged)
      };
    })
      .filter((entry) => !entry.same)
      .map(({ id, manualMatch, raw, tagged }) => ({
        id,
        manualMatch,
        raw,
        tagged
      }));

    expect(drifts).toEqual([]);
  });
});
