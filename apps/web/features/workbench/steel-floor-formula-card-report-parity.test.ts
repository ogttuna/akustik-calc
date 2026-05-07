import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { formatConfidenceProvenanceForImpact } from "./impact-confidence-view";
import {
  getImpactLaneHeadline,
  getImpactLaneKind,
  getImpactLaneNarrative,
  getImpactLanePillLabel
} from "./impact-lane-view";
import { ImpactTracePanel } from "./impact-trace-panel";
import { getPresetById } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import {
  describeImpactValidationPosture,
  getActiveValidationMode
} from "./validation-regime";
import type { LayerDraft } from "./workbench-store";

const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const STEEL_FORMULA_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "10" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "4.5" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "18" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "200" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const STEEL_FORMULA_LAYER_INPUTS: readonly LayerInput[] = STEEL_FORMULA_ROWS.map((row) => ({
  floorRole: row.floorRole,
  materialId: row.materialId,
  thicknessMm: Number(row.thicknessMm)
}));

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18
  },
  floorCovering: {
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 10
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled"
} as const satisfies ImpactPredictorInput;

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function buildSteelFormulaResult(): AssemblyCalculation {
  return calculateAssembly(STEEL_FORMULA_LAYER_INPUTS, {
    impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildSteelFormulaScenario(): EvaluatedScenario {
  const result = buildSteelFormulaResult();

  return {
    id: "gate-ae-steel-formula-card-report-parity",
    name: "Gate AE steel formula card/report parity",
    result,
    rows: buildRows(STEEL_FORMULA_ROWS, "gate-ae-steel-formula"),
    source: "current",
    studyMode: "floor",
    warnings: result.warnings
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("steel floor formula card/report parity", () => {
  it("shows the Gate AD steel formula corridor consistently across cards, trace, dossier, and report", () => {
    const scenario = buildSteelFormulaScenario();
    const result = scenario.result;

    expect(result).not.toBeNull();
    expect(result?.impact).toMatchObject({
      basis: STEEL_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );
    const deltaCard = addOutputCardPosture(
      buildOutputCard({ output: "DeltaLw", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );

    expect(lnwCard).toMatchObject({
      postureLabel: "Steel formula corridor",
      status: "live",
      value: "55.6 dB"
    });
    expect(lnwCard.detail).toContain("Gate AD lightweight-steel formula corridor");
    expect(lnwCard.detail).toContain("+/-4.5 dB corridor tolerance");
    expect(lnwCard.postureDetail).toContain("Source-absent lab formula corridor");
    expect(lnwCard.postureDetail).toContain("+/-4.5 dB Ln,w");

    expect(deltaCard).toMatchObject({
      postureLabel: "Steel formula corridor",
      status: "live",
      value: "22.4 dB"
    });
    expect(deltaCard.detail).toContain("steel mass-spring relation");
    expect(deltaCard.detail).toContain("+/-2.0 dB corridor tolerance");

    const laneKind = getImpactLaneKind({ impact: result?.impact, lowerBoundImpact: result?.lowerBoundImpact });
    expect(laneKind).toBe("steel_formula_corridor");
    expect(getImpactLanePillLabel(laneKind)).toBe("Steel formula live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Steel floor formula corridor");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("not the broad steel-family blend");

    expect(formatConfidenceProvenanceForImpact({
      basis: result?.impact?.basis,
      provenance: result?.impact?.confidence.provenance ?? "formula_estimate_narrow_scope"
    })).toBe("Steel formula corridor");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Lightweight-steel formula corridor",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("+/-4.5 dB Ln,w");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "steel_formula_corridor_estimate",
      label: "Lightweight-steel formula corridor"
    });

    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result }));
    expect(traceHtml).toContain("Formula lane");
    expect(traceHtml).toContain("Lightweight-steel formula corridor");
    expect(traceHtml).toContain("Gate AD steel-floor mass-spring formula corridor remains a source-absent lab estimate");
    expect(traceHtml).toContain("Corridor tolerance remains +/-4.5 dB");

    const dossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a steel floor predictor lane.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: [lnwCard, deltaCard],
      layers: STEEL_FORMULA_ROWS.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "6 live rows feed the visible steel floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = dossier.traceGroups.find((group) => group.label === "Impact lane");

    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Lightweight-steel formula corridor"
    });
    expect(impactTraceGroup?.notes).toContain(
      "Gate AD steel-floor mass-spring formula corridor remains a source-absent lab estimate, not a measured row."
    );

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
      projectName: "Steel Formula Parity Report",
      reportProfile: "consultant",
      requestedOutputs: TARGET_OUTPUTS,
      savedScenarios: [],
      studyContext: "coordination",
      studyMode: "floor",
      targetLnwDb: "50",
      targetRwDb: "60"
    });

    expect(report).toContain("- Impact lane: Lightweight-steel formula corridor");
    expect(report).toContain("- Impact basis: Lightweight-steel formula corridor");
    expect(report).toContain("- Active benchmark mode: Lightweight-steel formula corridor | Estimate benchmark mode | 1 benchmark cases.");
    expect(report).toContain("- Implemented formula estimate: yes");
    expect(report).toContain("- Formula note: Gate AD steel-floor mass-spring formula corridor remains a source-absent lab estimate, not a measured row.");
    expect(report).toContain("- Formula note: Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw.");
  });
});
