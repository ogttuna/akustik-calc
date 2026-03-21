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
});
