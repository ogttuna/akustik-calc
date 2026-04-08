import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";
import { evaluateScenario } from "./scenario-analysis";

type ScenarioRow = {
  floorRole?: string;
  id: string;
  materialId: string;
  thicknessMm: number | string;
};

type RouteSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  kind: string | null;
  statuses: Record<RequestedOutputId, "live" | "needs_input" | "unsupported">;
  supported: readonly RequestedOutputId[];
};

type AuditCase = {
  expected: RouteSnapshot;
  id: string;
  raw: readonly ScenarioRow[];
  tagged: readonly ScenarioRow[];
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

function snapshot(id: string, rows: readonly ScenarioRow[]): RouteSnapshot {
  const result = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: [...rows],
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  }).result;

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    statuses: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "floor"
        }).status
      ])
    ) as RouteSnapshot["statuses"],
    supported: result.supportedTargetOutputs
  };
}

const LIVE_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
  Rw: "live",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "live",
  "L'n,w": "live",
  "L'nT,w": "live"
};

const FAIL_CLOSED_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
  Rw: "unsupported",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "unsupported",
  "L'n,w": "needs_input",
  "L'nT,w": "needs_input"
};

const CASES: readonly AuditCase[] = [
  {
    id: "open-web lower-only packaged lane",
    raw: [
      { id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    tagged: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      kind: "family_general",
      statuses: LIVE_STATUSES,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "composite ceiling-only packaged lane",
    raw: [
      { id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { id: "c", materialId: "rockwool", thicknessMm: 50 },
      { id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    tagged: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      kind: "low_confidence",
      statuses: LIVE_STATUSES,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "clt lower-only guard",
    raw: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 100 },
      { id: "c", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { id: "d", materialId: "clt_panel", thicknessMm: 260 }
    ],
    tagged: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", id: "d", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      kind: null,
      statuses: FAIL_CLOSED_STATUSES,
      supported: ["R'w", "DnT,w"]
    }
  }
];

describe("raw floor packaged-lane route audit", () => {
  it.each(CASES)("$id", ({ id, raw, tagged, expected }) => {
    expect(snapshot(`${id}-raw`, raw)).toEqual(snapshot(`${id}-tagged`, tagged));
    expect(snapshot(`${id}-raw`, raw)).toEqual(expected);
  });
});
