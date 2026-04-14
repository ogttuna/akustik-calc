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

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type UbiqFloorSystem = BoundFloorSystem | ExactFloorSystem;

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  boundMatchId: string | null;
  cards: Record<TargetOutput, CardSnapshot>;
  estimateKind: string | null;
  exactMatchId: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
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

const FAIL_CLOSED_CARDS = {
  "Ln,w": { status: "unsupported", value: "Not ready" },
  CI: { status: "unsupported", value: "Not ready" },
  "Ln,w+CI": { status: "unsupported", value: "Not ready" },
  "L'n,w": { status: "needs_input", value: "Not ready" },
  "L'nT,w": { status: "needs_input", value: "Not ready" },
  "L'nT,50": { status: "needs_input", value: "Not ready" }
} as const satisfies Omit<Record<TargetOutput, CardSnapshot>, "Rw">;

const CASES = [
  {
    id: "weak-carpet-wrong-deck",
    anchorId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    sourceKind: "exact",
    mutation: "wrongDeck",
    sourceCriticalMismatch: true,
    expected: {
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "77 dB" },
        ...FAIL_CLOSED_CARDS
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "76 dB" },
        ...FAIL_CLOSED_CARDS
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "Ln,w": { status: "live", value: "70 dB" },
        CI: { status: "live", value: "-1 dB" },
        "Ln,w+CI": { status: "live", value: "69 dB" },
        "L'n,w": { status: "live", value: "72 dB" },
        "L'nT,w": { status: "live", value: "69.6 dB" },
        "L'nT,50": { status: "live", value: "69 dB" }
      },
      estimateKind: null,
      exactMatchId: "ubiq_fl27_open_web_steel_400_19mm_timber_underlay_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "64 dB" },
        "Ln,w": { status: "live", value: "51 dB" },
        CI: { status: "live", value: "-2 dB" },
        "Ln,w+CI": { status: "live", value: "49 dB" },
        "L'n,w": { status: "live", value: "53 dB" },
        "L'nT,w": { status: "live", value: "50.6 dB" },
        "L'nT,50": { status: "live", value: "49 dB" }
      },
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "62.6 dB" },
        "Ln,w": { status: "live", value: "52.4 dB" },
        CI: { status: "live", value: "-1.8 dB" },
        "Ln,w+CI": { status: "live", value: "50.5 dB" },
        "L'n,w": { status: "live", value: "54.4 dB" },
        "L'nT,w": { status: "live", value: "52 dB" },
        "L'nT,50": { status: "live", value: "50.5 dB" }
      },
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "64 dB" },
        "Ln,w": { status: "live", value: "51 dB" },
        CI: { status: "live", value: "-2 dB" },
        "Ln,w+CI": { status: "live", value: "49 dB" },
        "L'n,w": { status: "live", value: "53 dB" },
        "L'nT,w": { status: "live", value: "50.6 dB" },
        "L'nT,50": { status: "live", value: "49 dB" }
      },
      estimateKind: "family_archetype",
      exactMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lowerBoundBasis: null,
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
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      cards: {
        Rw: { status: "live", value: "64 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        CI: { status: "unsupported", value: "Not ready" },
        "Ln,w+CI": { status: "bound", value: "<= 45 dB" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" },
        "L'nT,50": { status: "needs_input", value: "Not ready" }
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: "official_floor_system_bound_support",
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "74 dB" },
        ...FAIL_CLOSED_CARDS
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "74 dB" },
        ...FAIL_CLOSED_CARDS
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "74 dB" },
        ...FAIL_CLOSED_CARDS
      },
      estimateKind: null,
      exactMatchId: null,
      impactBasis: null,
      lowerBoundBasis: null,
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
      boundMatchId: null,
      cards: {
        Rw: { status: "live", value: "64 dB" },
        "Ln,w": { status: "live", value: "51 dB" },
        CI: { status: "live", value: "-2 dB" },
        "Ln,w+CI": { status: "live", value: "49 dB" },
        "L'n,w": { status: "live", value: "53 dB" },
        "L'nT,w": { status: "live", value: "50.6 dB" },
        "L'nT,50": { status: "live", value: "49 dB" }
      },
      estimateKind: null,
      exactMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lowerBoundBasis: null,
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

function rowsWithIds(id: string, layers: readonly LayerInput[]): LayerDraft[] {
  return layers.map((layer, index) => ({
    id: `${id}-${index + 1}`,
    floorRole: layer.floorRole,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function snapshot(id: string, layers: readonly LayerInput[]): RouteSnapshot {
  const evaluated = evaluateScenario({
    id,
    impactFieldContext: FIELD_CONTEXT,
    name: id,
    rows: rowsWithIds(id, layers),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    cards: Object.fromEntries(
      TARGET_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as RouteSnapshot["cards"],
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged finish near-miss card matrix", () => {
  it("pins exact, bound, fallback, and fail-closed workbench cards when source-critical attributes drift", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase.id, mutateLayers(layersFromSystem(resolveAnchor(testCase)), testCase.mutation));

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
