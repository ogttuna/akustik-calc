import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

type ScenarioRow = {
  floorRole?: string;
  id: string;
  materialId: string;
  thicknessMm: number | string;
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

const FAIL_CLOSED_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
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
    rows: [...rows],
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
        ) as Record<RequestedOutputId, "live" | "needs_input" | "unsupported">)
      : null
  };
}

function hasCeilingBoardBlocker(warnings: readonly string[]) {
  return warnings.some((warning) => /single-entry floor roles are duplicated: ceiling board x2/i.test(warning));
}

describe("floor packaged-lane disjoint route detours", () => {
  it("demotes the disjoint open-web route off the defended family-general tier", () => {
    const canonical = evaluateRows("openweb-canonical", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);
    const disjoint = evaluateRows("openweb-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "base_structure", id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(canonical.result?.floorSystemEstimate?.kind).toBe("family_general");
    expect(hasCeilingBoardBlocker(canonical.warnings)).toBe(false);

    expect(disjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasCeilingBoardBlocker(disjoint.warnings)).toBe(true);
    expect(disjoint.statuses).toEqual({
      Rw: "live",
      "R'w": "live",
      "DnT,w": "live",
      "Ln,w": "live",
      "L'n,w": "live",
      "L'nT,w": "live"
    });
  });

  it("keeps the disjoint composite route on the conservative continuation with explicit blocker copy", () => {
    const canonical = evaluateRows("composite-canonical", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]);
    const disjoint = evaluateRows("composite-disjoint", [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ]);

    expect(canonical.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasCeilingBoardBlocker(canonical.warnings)).toBe(false);

    expect(disjoint.result?.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasCeilingBoardBlocker(disjoint.warnings)).toBe(true);
    expect(
      disjoint.result?.floorSystemEstimate?.notes.some((note) =>
        /Disjoint lower-board topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps CLT and open-box disjoint routes fail-closed with blocker copy", () => {
    const cases = [
      {
        id: "clt-disjoint",
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "ceiling_board", id: "c", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
          { floorRole: "base_structure", id: "e", materialId: "clt_panel", thicknessMm: 260 }
        ]
      },
      {
        id: "openbox-disjoint",
        rows: [
          { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_board", id: "c", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", id: "d", materialId: "furring_channel", thicknessMm: 28 },
          { floorRole: "base_structure", id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      }
    ] as const;

    for (const testCase of cases) {
      const scenario = evaluateRows(testCase.id, testCase.rows);

      expect(scenario.result?.floorSystemEstimate, testCase.id).toBeNull();
      expect(scenario.result?.impact, testCase.id).toBeNull();
      expect(scenario.statuses, testCase.id).toEqual(FAIL_CLOSED_STATUSES);
      expect(hasCeilingBoardBlocker(scenario.warnings), testCase.id).toBe(true);
    }
  });
});
