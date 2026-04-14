import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDutchResidentialImpactReferenceReportLines } from "./dutch-impact-reference";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w"];

const UBIQ_FL28_STEEL_300_CARPET_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function buildUbiqCarpetBoundScenario() {
  return evaluateScenario({
    id: "ubiq-carpet-bound-report",
    name: "UBIQ carpet bound report",
    rows: buildRows(UBIQ_FL28_STEEL_300_CARPET_ROWS, "ubiq-carpet-bound-report"),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

describe("workbench report bound metrics", () => {
  it("reports UBIQ Ln,w+CI bounds without converting them into Ln,w target evidence", () => {
    const scenario = buildUbiqCarpetBoundScenario();

    expect(scenario.result?.boundFloorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
    );

    const report = composeWorkbenchReport({
      activeCriteriaPack: CRITERIA_PACKS[0],
      activePreset: getPresetById("clt_floor"),
      briefNote: "",
      clientName: "Test Client",
      currentScenario: scenario,
      fieldRiskIds: [],
      impactGuide: null,
      impactImprovementBandInput: "",
      impactReference: null,
      impactReferenceDeltaLwDb: "",
      improvementReferenceImpact: null,
      projectName: "Bound Metric Report",
      reportProfile: "consultant",
      requestedOutputs: TARGET_OUTPUTS,
      savedScenarios: [],
      studyContext: "coordination",
      studyMode: "floor",
      targetLnwDb: "50",
      targetRwDb: "60"
    });

    expect(report).toContain("- Impact Ln,w+CI upper bound: <= 45.0 dB");
    expect(report).toContain("- Ln,w+CI upper bound: <= 45.0 dB");
    expect(report).toContain("- Exact Ln,w+CI upper bound: <= 45.0 dB");
    expect(report).not.toContain("- Impact Ln,w upper bound");
    expect(report).not.toContain("- Exact Ln,w upper bound");
    expect(report).toContain("- Target Ln,w: 50.0 dB (no live impact lane for the current stack)");
  });

  it("keeps Dutch impact references staged while naming the combined bound proxy", () => {
    const scenario = buildUbiqCarpetBoundScenario();
    const lines = getDutchResidentialImpactReferenceReportLines(scenario.result);

    expect(lines).toHaveLength(4);
    expect(lines.join("\n")).toContain("Current live lab metric is Ln,w+CI upper bound <= 45.0 dB");
    expect(lines.join("\n")).toContain("DynEcho does not treat this as a compliance verdict");
  });
});
