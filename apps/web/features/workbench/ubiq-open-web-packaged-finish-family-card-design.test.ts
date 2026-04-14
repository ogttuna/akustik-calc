import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  BoundFloorSystem,
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

type UbiqFloorSystem = BoundFloorSystem | ExactFloorSystem;

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  boundMatchId: string | null;
  cards: Record<string, CardSnapshot>;
  exactMatchId: string | null;
  impactBasis: string | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  lnWUpperBound: number | null;
  lowerBoundBasis: string | null;
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

function rowsFromSystem(system: UbiqFloorSystem, options: { fragment: boolean }): readonly Omit<LayerDraft, "id">[] {
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

  const result = evaluated.result;

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    cards: Object.fromEntries(
      options.targetOutputs.map((output) => {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ),
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("UBIQ open-web packaged finish-family card design", () => {
  it("keeps every imported UBIQ open-web exact package on the same workbench cards after source-equivalent fragmentation", () => {
    const failures: string[] = [];

    expect(UBIQ_OPEN_WEB_EXACT_ROWS).toHaveLength(90);

    for (const system of UBIQ_OPEN_WEB_EXACT_ROWS) {
      const canonicalLab = snapshot(`${system.id}-canonical-lab`, rowsFromSystem(system, { fragment: false }), {
        targetOutputs: LAB_OUTPUTS
      });
      const fragmentedLab = snapshot(`${system.id}-fragmented-lab`, rowsFromSystem(system, { fragment: true }), {
        targetOutputs: LAB_OUTPUTS
      });
      const canonicalField = snapshot(`${system.id}-canonical-field`, rowsFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmentedField = snapshot(`${system.id}-fragmented-field`, rowsFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonicalLab.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical lab cards missed exact id ${system.id}, got ${canonicalLab.exactMatchId}`);
      }

      if (canonicalField.exactMatchId !== system.id) {
        failures.push(`${system.id}: canonical field cards missed exact id ${system.id}, got ${canonicalField.exactMatchId}`);
      }

      if (JSON.stringify(fragmentedLab) !== JSON.stringify(canonicalLab)) {
        failures.push(`${system.id}: fragmented lab cards drifted from canonical exact route`);
      }

      if (JSON.stringify(fragmentedField) !== JSON.stringify(canonicalField)) {
        failures.push(`${system.id}: fragmented field cards drifted from canonical exact route`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps every imported UBIQ open-web bound package on the same workbench cards after source-equivalent fragmentation", () => {
    const failures: string[] = [];

    expect(UBIQ_OPEN_WEB_BOUND_ROWS).toHaveLength(21);

    for (const system of UBIQ_OPEN_WEB_BOUND_ROWS) {
      const canonicalLab = snapshot(`${system.id}-canonical-lab`, rowsFromSystem(system, { fragment: false }), {
        targetOutputs: LAB_OUTPUTS
      });
      const fragmentedLab = snapshot(`${system.id}-fragmented-lab`, rowsFromSystem(system, { fragment: true }), {
        targetOutputs: LAB_OUTPUTS
      });
      const canonicalField = snapshot(`${system.id}-canonical-field`, rowsFromSystem(system, { fragment: false }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const fragmentedField = snapshot(`${system.id}-fragmented-field`, rowsFromSystem(system, { fragment: true }), {
        impactFieldContext: FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });

      if (canonicalLab.boundMatchId !== system.id) {
        failures.push(`${system.id}: canonical lab cards missed bound id ${system.id}, got ${canonicalLab.boundMatchId}`);
      }

      if (canonicalField.boundMatchId !== system.id) {
        failures.push(`${system.id}: canonical field cards missed bound id ${system.id}, got ${canonicalField.boundMatchId}`);
      }

      if (JSON.stringify(fragmentedLab) !== JSON.stringify(canonicalLab)) {
        failures.push(`${system.id}: fragmented lab cards drifted from canonical bound route`);
      }

      if (JSON.stringify(fragmentedField) !== JSON.stringify(canonicalField)) {
        failures.push(`${system.id}: fragmented field cards drifted from canonical bound route`);
      }
    }

    expect(failures).toEqual([]);
  });
});
