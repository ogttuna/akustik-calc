import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getImpactLaneKind, getImpactLanePillLabel } from "./impact-lane-view";
import { ImpactTracePanel } from "./impact-trace-panel";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { selectSimpleWorkbenchTraceNotes } from "./simple-workbench-trace-notes";
import type { LayerDraft } from "./workbench-store";

const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
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

function buildHeavyFloatingFormulaScenario() {
  return evaluateScenario({
    id: "heavy-floating-formula-provenance",
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: "Heavy floating formula provenance",
    rows: buildRows(HEAVY_FLOATING_FORMULA_ROWS, "heavy-floating-formula-provenance"),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

describe("heavy concrete formula provenance report surface", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps field-carried formula outputs labeled as formula-owned in branch, trace, and report surfaces", () => {
    const scenario = buildHeavyFloatingFormulaScenario();
    const result = scenario.result;

    expect(result, "scenario should evaluate").not.toBeNull();
    if (!result) {
      throw new Error("Expected formula scenario to evaluate.");
    }

    expect(result.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(result.impact?.metricBasis?.LnW).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impact?.metricBasis?.DeltaLw).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(result.impactPredictorStatus?.implementedFormulaEstimate).toBe(true);

    const summary = getDynamicCalcBranchSummary({
      result,
      studyMode: "floor"
    });
    expect(summary.value).toBe("Dry floating floor");
    expect(summary.detail).toContain("Heavy floating-floor formula is active.");
    expect(summary.detail).toContain("Standardized field-volume carry-over");

    const laneKind = getImpactLaneKind({
      impact: result.impact,
      lowerBoundImpact: result.lowerBoundImpact
    });
    expect(laneKind).toBe("scoped_formula");
    expect(getImpactLanePillLabel(laneKind)).toBe("Scoped live");

    const formulaNotes: readonly string[] = result.impactSupport?.formulaNotes ?? [];
    expect(formulaNotes.some((note) => /f0 .* sqrt\(s'\/m'load\)/i.test(note))).toBe(true);

    const formulaNoteSelection = selectSimpleWorkbenchTraceNotes(formulaNotes);
    expect(formulaNoteSelection.notes.some((note) => /Annex C style estimate/i.test(note))).toBe(true);
    expect(formulaNoteSelection.notes.some((note) => /13 log10\(m'load\) - 14\.2 log10\(s'\) \+ 20\.8/i.test(note))).toBe(true);

    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result }));
    expect(traceHtml).toContain("Formula lane");
    expect(traceHtml).toContain("Formula notes");
    expect(traceHtml).toContain("Annex C style estimate remains a narrow heavy-floor screening path.");
    expect(traceHtml).toContain("Floating-floor branch applies");

    const report = composeWorkbenchReport({
      activeCriteriaPack: CRITERIA_PACKS[0],
      activePreset: getPresetById("heavy_concrete_impact_floor"),
      briefNote: "",
      clientName: "Test Client",
      currentScenario: scenario,
      fieldRiskIds: [],
      impactGuide: null,
      impactImprovementBandInput: "",
      impactReference: null,
      impactReferenceDeltaLwDb: "",
      improvementReferenceImpact: null,
      projectName: "Formula Provenance Report",
      reportProfile: "consultant",
      requestedOutputs: TARGET_OUTPUTS,
      savedScenarios: [],
      studyContext: "coordination",
      studyMode: "floor",
      targetLnwDb: "50",
      targetRwDb: "60"
    });

    expect(report).toContain("- Implemented formula estimate: yes");
    expect(report).toContain("- Formula note: Annex C style estimate remains a narrow heavy-floor screening path.");
    expect(report).toContain("- Formula note: Floating-floor branch applies 13 log10(m'load) - 14.2 log10(s') + 20.8 for the treatment term.");
    expect(report).toContain("- Formula note: Resonance cross-check follows f0 ~= 160 * sqrt(s'/m'load).");
    expect(report).toContain("- Formula note: L'n,w = Ln,w + K.");
    expect(report).toContain("- Formula note: L'nT,w = L'n,w + 10 log10(31.3 / V) on the standardized field-volume path.");
  });
});
