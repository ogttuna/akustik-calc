import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  ExactFloorSystem,
  FloorRole,
  FloorSystemRoleCriteria,
  ImpactFieldContext,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  cards: Record<string, CardSnapshot>;
  exactMatchId: string | null;
  impactBasis: string | null;
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

function criteriaToRows(
  role: FloorRole,
  criteria: FloorSystemRoleCriteria | undefined,
  options: {
    fragment: boolean;
  }
): readonly Omit<LayerDraft, "id">[] {
  if (!criteria) {
    return [];
  }

  if (criteria.materialScheduleIds || criteria.thicknessScheduleMm) {
    const materialSchedule = criteria.materialScheduleIds ?? criteria.materialIds ?? [];
    const thicknessSchedule = criteria.thicknessScheduleMm ?? [];

    return thicknessSchedule.map((thicknessMm, index) => ({
      floorRole: role,
      materialId: materialSchedule[index] ?? materialSchedule[0] ?? criteria.materialIds?.[0] ?? "generic_fill",
      thicknessMm: String(thicknessMm)
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
      thicknessMm: String(thicknessMm)
    }));
  });
}

function rowsFromSystem(system: ExactFloorSystem, options: { fragment: boolean }): readonly Omit<LayerDraft, "id">[] {
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

    return criteriaToRows(role, criteria, options);
  });
}

function rowsWithIds(id: string, rows: readonly Omit<LayerDraft, "id">[]): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

function snapshot(
  id: string,
  rows: readonly Omit<LayerDraft, "id">[],
  options: {
    impactFieldContext?: ImpactFieldContext;
    targetOutputs: readonly RequestedOutputId[];
  }
): RouteSnapshot {
  const evaluated = evaluateScenario({
    id,
    impactFieldContext: options.impactFieldContext,
    name: id,
    rows: rowsWithIds(id, rows),
    source: "current",
    studyMode: "floor",
    targetOutputs: options.targetOutputs
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  return {
    cards: Object.fromEntries(
      options.targetOutputs.map((output) => {
        const card = buildOutputCard({
          output,
          result: evaluated.result!,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ),
    exactMatchId: evaluated.result.floorSystemMatch?.system.id ?? null,
    impactBasis: evaluated.result.impact?.basis ?? null,
    supported: evaluated.result.supportedTargetOutputs,
    unsupported: evaluated.result.unsupportedTargetOutputs
  };
}

describe("TUAS open-box same-package fragmentation card design", () => {
  it("keeps every imported TUAS open-box source-equivalent fragmented package on the same lab output cards", () => {
    const failures: string[] = [];

    expect(TUAS_OPEN_BOX_ROWS).toHaveLength(15);

    for (const system of TUAS_OPEN_BOX_ROWS) {
      const canonical = snapshot(`${system.id}-canonical-lab`, rowsFromSystem(system, { fragment: false }), {
        targetOutputs: LAB_OUTPUTS
      });
      const fragmented = snapshot(`${system.id}-fragmented-lab`, rowsFromSystem(system, { fragment: true }), {
        targetOutputs: LAB_OUTPUTS
      });

      if (canonical.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical stack missed exact id ${system.id}, got ${canonical.exactMatchId}`);
      }

      if (JSON.stringify(fragmented) !== JSON.stringify(canonical)) {
        failures.push(`${system.id}: fragmented lab cards drifted from canonical route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every imported TUAS open-box source-equivalent fragmented package on the same field output cards", () => {
    const failures: string[] = [];

    expect(TUAS_OPEN_BOX_ROWS).toHaveLength(15);

    for (const system of TUAS_OPEN_BOX_ROWS) {
      const canonical = snapshot(`${system.id}-canonical-field`, rowsFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmented = snapshot(`${system.id}-fragmented-field`, rowsFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonical.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical field stack missed exact id ${system.id}, got ${canonical.exactMatchId}`);
      }

      if (JSON.stringify(fragmented) !== JSON.stringify(canonical)) {
        failures.push(`${system.id}: fragmented field cards drifted from canonical route`);
      }
    }

    expect(failures).toEqual([]);
  });
});
