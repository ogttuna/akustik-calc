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
  boundEstimateKind: string | null;
  boundMatchId: string | null;
  estimateKind: string | null;
  exactMatchId: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  lowerBoundBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  anchorId: string;
  expected: RouteSnapshot;
  id: string;
  mutation: "extraBoard" | "finishToCarpet" | "finishToTimber" | "missingFill" | "wrongDeck";
  sourceCriticalMismatch: boolean;
  sourceKind: "bound" | "exact";
};

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

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

const CASES = [
  {
    id: "weak-carpet-wrong-deck",
    anchorId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    sourceKind: "exact",
    mutation: "wrongDeck",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 77,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "weak-carpet-extra-board",
    anchorId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    sourceKind: "exact",
    mutation: "extraBoard",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 76,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "weak-carpet-valid-timber-switch",
    anchorId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    sourceKind: "exact",
    mutation: "finishToTimber",
    sourceCriticalMismatch: false,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: "ubiq_fl27_open_web_steel_400_19mm_timber_underlay_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lPrimeNT50: 69,
      lPrimeNTw: 69.6,
      lPrimeNW: 72,
      lnW: 70,
      lnWPlusCI: 69,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 55,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "supported-timber-wrong-deck",
    anchorId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
    sourceKind: "exact",
    mutation: "wrongDeck",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lPrimeNT50: 49,
      lPrimeNTw: 50.6,
      lPrimeNW: 53,
      lnW: 51,
      lnWPlusCI: 49,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "supported-timber-extra-board",
    anchorId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
    sourceKind: "exact",
    mutation: "extraBoard",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lPrimeNT50: 50.5,
      lPrimeNTw: 52,
      lPrimeNW: 54.4,
      lnW: 52.4,
      lnWPlusCI: 50.5,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 62.6,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "supported-timber-missing-fill",
    anchorId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
    sourceKind: "exact",
    mutation: "missingFill",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lPrimeNT50: 49,
      lPrimeNTw: 50.6,
      lPrimeNW: 53,
      lnW: 51,
      lnWPlusCI: 49,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "supported-timber-valid-carpet-bound-switch",
    anchorId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
    sourceKind: "exact",
    mutation: "finishToCarpet",
    sourceCriticalMismatch: false,
    expected: {
      boundEstimateKind: null,
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "supported-bound-wrong-deck",
    anchorId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
    sourceKind: "bound",
    mutation: "wrongDeck",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 74,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "supported-bound-extra-board",
    anchorId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
    sourceKind: "bound",
    mutation: "extraBoard",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 74,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "supported-bound-missing-fill",
    anchorId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
    sourceKind: "bound",
    mutation: "missingFill",
    sourceCriticalMismatch: true,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 74,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "supported-bound-valid-timber-switch",
    anchorId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
    sourceKind: "bound",
    mutation: "finishToTimber",
    sourceCriticalMismatch: false,
    expected: {
      boundEstimateKind: null,
      boundMatchId: null,
      estimateKind: null,
      exactMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lPrimeNT50: 49,
      lPrimeNTw: 50.6,
      lPrimeNW: 53,
      lnW: 51,
      lnWPlusCI: 49,
      lnWPlusCIUpperBound: null,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  }
] as const satisfies readonly RouteCase[];

function criteriaToLayers(role: FloorRole, criteria: FloorSystemRoleCriteria | undefined): readonly LayerInput[] {
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

  return Array.from({ length: layerCount }).map(() => ({
    floorRole: role,
    materialId,
    thicknessMm: baseThicknessMm
  }));
}

function layersFromSystem(system: UbiqFloorSystem): readonly LayerInput[] {
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

    return criteriaToLayers(role, criteria);
  });
}

function resolveAnchor(testCase: RouteCase): UbiqFloorSystem {
  const rows = testCase.sourceKind === "bound" ? BOUND_FLOOR_SYSTEMS : EXACT_FLOOR_SYSTEMS;
  const system = rows.find((candidate) => candidate.id === testCase.anchorId);

  if (!system) {
    throw new Error(`Missing UBIQ open-web test anchor: ${testCase.anchorId}`);
  }

  return system;
}

function mutateLayers(layers: readonly LayerInput[], mutation: RouteCase["mutation"]): readonly LayerInput[] {
  if (mutation === "wrongDeck") {
    return layers.map((layer) =>
      layer.floorRole === "base_structure" ? { ...layer, thicknessMm: Number(layer.thicknessMm) + 5 } : layer
    );
  }

  if (mutation === "finishToTimber") {
    return layers.map((layer) =>
      layer.floorRole === "floor_covering" ? { ...layer, materialId: "engineered_timber_with_acoustic_underlay" } : layer
    );
  }

  if (mutation === "finishToCarpet") {
    return layers.map((layer) =>
      layer.floorRole === "floor_covering" ? { ...layer, materialId: "carpet_with_foam_underlay" } : layer
    );
  }

  if (mutation === "extraBoard") {
    const boardIndex = layers.findIndex((layer) => layer.floorRole === "ceiling_board");

    if (boardIndex < 0) {
      throw new Error("Expected a ceiling board layer to duplicate.");
    }

    return [
      ...layers.slice(0, boardIndex + 1),
      { ...layers[boardIndex]!, thicknessMm: Number(layers[boardIndex]!.thicknessMm) },
      ...layers.slice(boardIndex + 1)
    ];
  }

  return layers.filter((layer) => layer.floorRole !== "ceiling_fill");
}

function snapshot(layers: readonly LayerInput[]): RouteSnapshot {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged finish near-miss matrix", () => {
  it("pins exact, bound, fallback, and fail-closed posture when source-critical attributes drift", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(mutateLayers(layersFromSystem(resolveAnchor(testCase)), testCase.mutation));

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }

      if (testCase.sourceCriticalMismatch && (actual.exactMatchId || actual.boundMatchId)) {
        failures.push(`${testCase.id}: source-critical mismatch retained official exact/bound provenance`);
      }
    }

    expect(failures).toEqual([]);
  });
});
