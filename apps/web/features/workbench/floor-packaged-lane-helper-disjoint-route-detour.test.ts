import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

type ScenarioRow = {
  floorRole?: FloorRole;
  id: string;
  materialId: string;
  thicknessMm: number | string;
};

const FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
type FieldOutput = (typeof FIELD_OUTPUTS)[number];
type CardStatus = "live" | "needs_input" | "unsupported";

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

const FAIL_CLOSED_STATUSES: Record<FieldOutput, CardStatus> = {
  Rw: "unsupported",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "unsupported",
  "L'n,w": "needs_input",
  "L'nT,w": "needs_input"
};

function evaluateRows(id: string, rows: readonly ScenarioRow[]) {
  const result = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: rows.map((row) => ({
      ...row,
      thicknessMm: String(row.thicknessMm)
    })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    ...result,
    statuses: result.result
      ? (Object.fromEntries(
          FIELD_OUTPUTS.map((output) => [
            output,
            buildOutputCard({
              output,
              result: result.result!,
              studyMode: "floor"
            }).status
          ])
        ) as Record<FieldOutput, CardStatus>)
      : null
  };
}

function hasPredictorBlocker(warnings: readonly string[], role: "ceiling_fill" | "ceiling_cavity") {
  const label = role.replaceAll("_", " ");
  return warnings.some((warning) => new RegExp(`single-entry floor roles are duplicated: ${label} x2`, "i").test(warning));
}

describe("floor packaged-lane helper disjoint route detours", () => {
  it("demotes disjoint open-web lower helper topology off the defended family-general tier", () => {
    const canonical = evaluateRows("openweb-helper-canonical", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", id: "e", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);
    const fillDisjoint = evaluateRows("openweb-helper-fill-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 70 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "ceiling_fill", id: "d", materialId: "rockwool", thicknessMm: 75 },
      { floorRole: "base_structure", id: "e", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);
    const cavityDisjoint = evaluateRows("openweb-helper-cavity-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "b", materialId: "ubiq_resilient_ceiling", thicknessMm: 30 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "ubiq_resilient_ceiling", thicknessMm: 35 },
      { floorRole: "base_structure", id: "e", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(canonical.result?.floorSystemEstimate?.kind).toBe("family_general");

    expect(fillDisjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasPredictorBlocker(fillDisjoint.warnings, "ceiling_fill")).toBe(true);
    expect(
      fillDisjoint.result?.floorSystemEstimate?.notes.some((note: string) =>
        /Family-general lightweight-steel matching was withheld because the lower-only helper topology is split/i.test(note)
      )
    ).toBe(true);
    expect(fillDisjoint.statuses).toEqual({
      Rw: "live",
      "R'w": "live",
      "DnT,w": "live",
      "Ln,w": "live",
      "L'n,w": "live",
      "L'nT,w": "live"
    });

    expect(cavityDisjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasPredictorBlocker(cavityDisjoint.warnings, "ceiling_cavity")).toBe(true);
    expect(
      cavityDisjoint.result?.floorSystemEstimate?.notes.some((note: string) =>
        /Family-general lightweight-steel matching was withheld because the lower-only helper topology is split/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps disjoint composite lower helper topology on the conservative continuation", () => {
    const canonical = evaluateRows("composite-helper-canonical", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]);
    const fillDisjoint = evaluateRows("composite-helper-fill-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "ceiling_fill", id: "d", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]);
    const cavityDisjoint = evaluateRows("composite-helper-cavity-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", id: "b", materialId: "resilient_stud_ceiling", thicknessMm: 75 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 75 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]);

    expect(canonical.result?.floorSystemEstimate?.kind).toBe("low_confidence");

    expect(fillDisjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasPredictorBlocker(fillDisjoint.warnings, "ceiling_fill")).toBe(true);
    expect(
      fillDisjoint.result?.floorSystemEstimate?.notes.some((note: string) =>
        /Lower-only helper topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);

    expect(cavityDisjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasPredictorBlocker(cavityDisjoint.warnings, "ceiling_cavity")).toBe(true);
    expect(
      cavityDisjoint.result?.floorSystemEstimate?.notes.some((note: string) =>
        /Lower-only helper topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps CLT and open-box disjoint lower helper routes fail-closed with blocker copy", () => {
    const cases = [
      {
        id: "clt-helper-fill-disjoint",
        role: "ceiling_fill" as const,
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 50 },
          { floorRole: "ceiling_cavity", id: "c", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
          { floorRole: "ceiling_fill", id: "d", materialId: "rockwool", thicknessMm: 50 },
          { floorRole: "base_structure", id: "e", materialId: "clt_panel", thicknessMm: 260 }
        ]
      },
      {
        id: "openbox-helper-cavity-disjoint",
        role: "ceiling_cavity" as const,
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", id: "b", materialId: "furring_channel", thicknessMm: 14 },
          { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_cavity", id: "d", materialId: "furring_channel", thicknessMm: 14 },
          { floorRole: "base_structure", id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const scenario = evaluateRows(testCase.id, testCase.rows);

      expect(scenario.result?.floorSystemEstimate, testCase.id).toBeNull();
      expect(scenario.result?.impact, testCase.id).toBeNull();
      expect(scenario.statuses, testCase.id).toEqual(FAIL_CLOSED_STATUSES);
      expect(hasPredictorBlocker(scenario.warnings, testCase.role), testCase.id).toBe(true);
    }
  });
});
