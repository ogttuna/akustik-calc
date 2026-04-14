import { describe, expect, it } from "vitest";

import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";

import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import type { LayerDraft } from "./workbench-store";

const FORMULA_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FORMULA_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const HEAVY_FLOATING_FORMULA_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
];

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

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

  it("keeps heavy concrete formula provenance explicit in dynamic impact citations", () => {
    const scenario = evaluateScenario({
      id: "evidence-heavy-floating-formula",
      impactFieldContext: FORMULA_IMPACT_FIELD_CONTEXT,
      name: "Evidence heavy floating formula",
      rows: buildRows(HEAVY_FLOATING_FORMULA_ROWS, "evidence-heavy-floating-formula"),
      source: "current",
      studyMode: "floor",
      targetOutputs: FORMULA_TARGET_OUTPUTS
    });

    const packet = buildSimpleWorkbenchEvidencePacket({
      outputs: FORMULA_TARGET_OUTPUTS,
      result: scenario.result,
      warnings: scenario.warnings
    });
    const dynamicCitation = packet.citations.find((citation) => citation.label === "Dynamic impact anchor");

    expect(dynamicCitation).toEqual(
      expect.objectContaining({
        detail: "Heavy floating-floor formula · Estimated evidence · Standardized field-volume carry-over.",
        tone: "accent"
      })
    );
  });
});
