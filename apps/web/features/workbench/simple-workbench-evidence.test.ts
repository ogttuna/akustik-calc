import { describe, expect, it } from "vitest";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";

describe("simple workbench evidence packet", () => {
  it("surfaces decision-trail and exact-family citation data for an exact floor preset", () => {
    const preset = getPresetById("dataholz_clt_dry_exact");
    const rows = preset.rows.map((row, index) => ({
      ...row,
      id: `row-${index + 1}`
    }));
    const scenario = evaluateScenario({
      id: "evidence-test",
      name: "Evidence test",
      rows,
      source: "current",
      studyMode: preset.studyMode,
      targetOutputs: ["Rw", "Ln,w"]
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      briefNote: "Keep exact-family lineage explicit in the brief.",
      outputs: ["Rw", "Ln,w"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    expect(packet.decisionTrailHeadline).toMatch(/current floor-side posture|active/i);
    expect(packet.decisionTrailItems.some((item) => item.label === "Impact corridor")).toBe(true);
    expect(packet.citations.some((citation) => citation.label.includes("Exact floor family"))).toBe(true);
    expect(packet.citations.some((citation) => /system id/i.test(citation.detail))).toBe(true);
    expect(packet.citations.some((citation) => citation.href?.includes("dataholz.eu"))).toBe(true);
  });

  it("keeps dynamic airborne citations explicit on protected wall boundary holds", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 2700,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 30,
        sharedTrack: "independent"
      },
      calculator: "dynamic",
      id: "evidence-wall-boundary",
      name: "Evidence wall boundary",
      rows: [
        { id: "wall-1", materialId: "ytong_aac_d700", thicknessMm: "100" },
        { id: "wall-2", materialId: "air_gap", thicknessMm: "50" },
        { id: "wall-3", materialId: "gypsum_board", thicknessMm: "12.5" }
      ],
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      outputs: ["R'w", "DnT,w"],
      result: scenario.result,
      warnings: scenario.warnings
    });

    const dynamicCitation = packet.citations.find((citation) => citation.label === "Dynamic airborne anchor");

    expect(dynamicCitation).toBeTruthy();
    expect(dynamicCitation?.detail).toContain("Ambiguous boundary with Double Leaf");
    expect(dynamicCitation?.detail).toContain("protected corridor hold");
  });
});
