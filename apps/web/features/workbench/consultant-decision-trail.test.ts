import { describe, expect, it } from "vitest";

import { getConsultantDecisionTrail, getConsultantDecisionTrailReportLines } from "./consultant-decision-trail";
import { evaluateScenario } from "./scenario-analysis";

const WALL_ROWS = [
  { id: "wall-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "wall-2", materialId: "air_gap", thicknessMm: "75" },
  { id: "wall-3", materialId: "rockwool", thicknessMm: "75" },
  { id: "wall-4", materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

describe("consultant decision trail", () => {
  it("keeps corridor, provenance, and assumption posture in one trail", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3000,
        receivingRoomVolumeM3: 42
      },
      id: "consultant-trail-field",
      name: "Consultant trail field",
      rows: WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"]
    });

    const trail = getConsultantDecisionTrail({
      briefNote: "Assume clean perimeter sealing and no late-stage service penetrations.",
      guideResult: null,
      outputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      result: scenario.result,
      warnings: scenario.warnings
    });
    const lines = getConsultantDecisionTrailReportLines({
      briefNote: "Assume clean perimeter sealing and no late-stage service penetrations.",
      guideResult: null,
      outputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    expect(trail.headline).toContain("field-airborne reading");
    expect(trail.items.some((item) => item.label === "Field provenance")).toBe(true);
    expect(trail.items.some((item) => item.label === "Assumption log" && item.tone === "success")).toBe(true);
    expect(lines).toContainEqual(expect.stringContaining("Decision trail headline"));
    expect(lines).toContainEqual(expect.stringContaining("Output coverage: 4 requested outputs are armed."));
  });

  it("fails closed when no live result or assumptions exist", () => {
    const trail = getConsultantDecisionTrail({
      briefNote: "",
      guideResult: null,
      outputs: ["Ln,w", "IIC"],
      result: null,
      warnings: []
    });

    expect(trail.headline).toContain("No live decision trail yet");
    expect(trail.items).toContainEqual(
      expect.objectContaining({
        label: "Assumption log",
        tone: "warning"
      })
    );
    expect(trail.items).toContainEqual(
      expect.objectContaining({
        label: "Output coverage",
        tone: "warning"
      })
    );
  });
});
