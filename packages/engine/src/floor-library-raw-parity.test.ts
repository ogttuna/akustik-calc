import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  FloorRole,
  FloorSystemMatchCriteria,
  FloorSystemRoleCriteria,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
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

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
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
];

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

type RoleMode = "alternating" | "base_only" | "raw" | "tagged";

function buildLayersFromCriteria(match: FloorSystemMatchCriteria, mode: RoleMode = "tagged"): LayerInput[] {
  const layers: LayerInput[] = [];
  let layerIndex = 0;

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
      const shouldKeepRole =
        mode === "tagged" ||
        (mode === "base_only" && role === "base_structure") ||
        (mode === "alternating" && layerIndex % 2 === 1);

      layers.push({
        ...(shouldKeepRole ? { floorRole: role } : {}),
        materialId,
        thicknessMm
      });
      layerIndex += 1;
    }
  }

  return layers;
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
    ok: result.ok,
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

function assertRawParity(
  failures: string[],
  label: string,
  taggedLayers: LayerInput[],
  rawLayers: LayerInput[],
  options: Parameters<typeof calculateAssembly>[1]
) {
  const taggedResult = calculateAssembly(taggedLayers, options);
  const rawResult = calculateAssembly(rawLayers, options);

  if (JSON.stringify(resultSnapshot(taggedResult)) !== JSON.stringify(resultSnapshot(rawResult))) {
    failures.push(
      `${label}: expected raw stack parity with tagged floor roles, got tagged=${JSON.stringify(resultSnapshot(taggedResult))} raw=${JSON.stringify(resultSnapshot(rawResult))}`
    );
  }
}

const MANUAL_EXACT_SYSTEMS_WITH_RAW_TOPOLOGY_EVIDENCE = EXACT_FLOOR_SYSTEMS.filter(
  (entry) => entry.manualMatch !== false && maybeInferFloorRoleLayerStack(buildLayersFromCriteria(entry.match, "raw"))
);

describe("floor-library raw-layer parity", () => {
  it("keeps every evidence-rich manual exact floor-system row stable on the lab bundle without explicit floor roles", () => {
    const failures: string[] = [];

    for (const system of MANUAL_EXACT_SYSTEMS_WITH_RAW_TOPOLOGY_EVIDENCE) {
      assertRawParity(
        failures,
        `exact lab ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "raw"),
        {
          targetOutputs: LAB_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps every evidence-rich manual exact floor-system row stable on the field bundle without explicit floor roles", () => {
    const failures: string[] = [];

    for (const system of MANUAL_EXACT_SYSTEMS_WITH_RAW_TOPOLOGY_EVIDENCE) {
      assertRawParity(
        failures,
        `exact field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "raw"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps every bound floor-system row stable on the lab bundle without explicit floor roles", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      assertRawParity(
        failures,
        `bound lab ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "raw"),
        {
          targetOutputs: LAB_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps every bound floor-system row stable on the field bundle without explicit floor roles", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      assertRawParity(
        failures,
        `bound field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "raw"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps every evidence-rich manual exact floor-system row stable when only base_structure stays explicitly tagged", () => {
    const failures: string[] = [];

    for (const system of MANUAL_EXACT_SYSTEMS_WITH_RAW_TOPOLOGY_EVIDENCE) {
      assertRawParity(
        failures,
        `exact base-only field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "base_only"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps every bound floor-system row stable when only base_structure stays explicitly tagged", () => {
    const failures: string[] = [];

    for (const system of BOUND_FLOOR_SYSTEMS) {
      assertRawParity(
        failures,
        `bound base-only field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "base_only"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative exact floor-system rows stable under sparse alternating role tags", () => {
    const failures: string[] = [];
    const representativeExactIds = new Set([
      "knauf_ct30_1a_timber_lab_2026",
      "tuas_r5b_open_box_timber_measured_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "pliteq_hcp200_vinyl_lab_2026",
      "tuas_x2_clt140_measured_2026"
    ]);
    const representativeSystems = EXACT_FLOOR_SYSTEMS.filter((entry) => representativeExactIds.has(entry.id));

    expect(representativeSystems).toHaveLength(5);

    for (const system of representativeSystems) {
      assertRawParity(
        failures,
        `exact alternating field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "alternating"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });

  it("keeps representative bound floor-system rows stable under sparse alternating role tags", () => {
    const failures: string[] = [];
    const representativeBoundIds = new Set([
      "ubiq_fl33_open_web_steel_300_lab_2026",
      "ubiq_fl32_steel_300_lab_2026"
    ]);
    const representativeSystems = BOUND_FLOOR_SYSTEMS.filter((entry) => representativeBoundIds.has(entry.id));

    expect(representativeSystems).toHaveLength(2);

    for (const system of representativeSystems) {
      assertRawParity(
        failures,
        `bound alternating field ${system.id}`,
        buildLayersFromCriteria(system.match),
        buildLayersFromCriteria(system.match, "alternating"),
        {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
      );
    }

    expect(failures).toEqual([]);
  });
});
