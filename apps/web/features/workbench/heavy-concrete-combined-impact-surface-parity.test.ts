import {
  GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
  calculateAssembly
} from "@dynecho/engine";
import type {
  AssemblyCalculation,
  ImpactErrorBudget,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  formatConfidenceProvenanceForImpact
} from "./impact-confidence-view";
import {
  getImpactLaneHeadline,
  getImpactLaneKind,
  getImpactLaneNarrative,
  getImpactLanePillLabel
} from "./impact-lane-view";
import {
  formatImpactMetricBasisLabel,
  getActiveImpactMetricBasisRows
} from "./impact-metric-basis-view";
import { ImpactTracePanel } from "./impact-trace-panel";
import { getPresetById } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import { getScenarioCorridorSummary } from "./scenario-corridor-summary";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import {
  HEAVY_CONCRETE_COMBINED_FORMULA_BASIS,
  getHeavyConcreteCombinedFormulaCorridorNarrative,
  isHeavyConcreteCombinedFormulaCorridorImpact
} from "./heavy-concrete-combined-impact-corridor-view";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "IIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_ONLY_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const HEAVY_COMBINED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: "8" },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: "150" },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: "120" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "80" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const HEAVY_COMBINED_LAYER_INPUTS: readonly LayerInput[] = HEAVY_COMBINED_ROWS.map((row) => ({
  floorRole: row.floorRole,
  materialId: row.materialId,
  thicknessMm: Number(row.thicknessMm)
}));

let originalEnv: Record<string, string | undefined>;

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function buildRows(rows: readonly Omit<LayerDraft, "id">[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` }));
}

function buildHeavyCombinedResult(
  targetOutputs: readonly RequestedOutputId[] = TARGET_OUTPUTS
): AssemblyCalculation {
  return calculateAssembly(HEAVY_COMBINED_LAYER_INPUTS, {
    impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
    targetOutputs
  });
}

function buildScenario(source: "current" | "saved" = "current"): EvaluatedScenario & { result: AssemblyCalculation } {
  const result = buildHeavyCombinedResult();

  return {
    id: `gate-be-heavy-concrete-combined-${source}`,
    name: "Gate BE heavy concrete combined surface parity",
    result,
    rows: buildRows(HEAVY_COMBINED_ROWS, `gate-be-heavy-combined-${source}`),
    savedAtIso: source === "saved" ? "2026-05-13T10:00:00.000Z" : undefined,
    source,
    studyMode: "floor",
    warnings: result.warnings
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate BE Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate BE Heavy Concrete Combined Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  vi.unstubAllGlobals();
});

describe("heavy-concrete combined floor-impact surface parity", () => {
  it("shows the Gate BD lab Ln,w and DeltaLw basis on cards, posture, basis copy, trace, dossiers, scenario, and report", () => {
    const scenario = buildScenario();
    const result = scenario.result;

    expect(result.impact).toMatchObject({
      DeltaLw: 30.1,
      LnW: 44.4,
      basis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      labOrField: "lab",
      metricBasis: {
        DeltaLw: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
        LnW: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS
      }
    });
    expect(isHeavyConcreteCombinedFormulaCorridorImpact(result)).toBe(true);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC"]);

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );
    const deltaCard = addOutputCardPosture(
      buildOutputCard({ output: "DeltaLw", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );

    expect(lnwCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "44.4 dB"
    });
    expect(lnwCard.detail).toContain("Gate BD heavy-concrete combined upper/lower formula corridor");
    expect(lnwCard.detail).toContain("+/-6.5 dB corridor tolerance");
    expect(lnwCard.detail).toContain("heavy_reference_floor_family_spread 1.3 dB");
    expect(lnwCard.postureDetail).toContain("do not treat them as measured evidence");

    expect(deltaCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "30.1 dB"
    });
    expect(deltaCard.detail).toContain("upper floating treatment plus lower suspended ceiling");
    expect(deltaCard.detail).toContain("+/-5.5 dB corridor tolerance");
    expect(deltaCard.detail).toContain("combined_system_holdout_absence 1.6 dB");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    const lnwBasis = basisRows.find((row) => row.metric === "LnW");
    const deltaBasis = basisRows.find((row) => row.metric === "DeltaLw");
    expect(lnwBasis?.description).toBe(
      "Ln,w came from the source-absent heavy-concrete combined upper/lower formula corridor."
    );
    expect(deltaBasis?.description).toBe(
      "DeltaLw came from the source-absent heavy-concrete combined upper/lower formula corridor."
    );
    expect(lnwBasis ? formatImpactMetricBasisLabel(lnwBasis.basis) : null).toBe(
      "Heavy concrete combined upper/lower formula corridor"
    );

    const laneKind = getImpactLaneKind({ impact: result.impact, lowerBoundImpact: result.lowerBoundImpact });
    expect(laneKind).toBe("heavy_concrete_combined_formula_corridor");
    expect(getImpactLanePillLabel(laneKind)).toBe("Heavy concrete formula live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Heavy concrete combined formula corridor");
    expect(getImpactLaneNarrative(laneKind, false)).toBe(getHeavyConcreteCombinedFormulaCorridorNarrative());
    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact?.basis,
      provenance: result.impact?.confidence.provenance ?? "formula_estimate_narrow_scope"
    })).toBe("Heavy concrete combined formula corridor");

    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result }));
    expect(traceHtml).toContain("Heavy concrete combined upper/lower formula corridor");
    expect(traceHtml).toContain("Heavy-concrete combined upper/lower corridor is source-absent lab evidence");
    expect(traceHtml).toContain("Corridor tolerance remains +/-6.5 dB for Ln,w and +/-5.5 dB for DeltaLw");

    const summary = getScenarioCorridorSummary(result);
    expect(summary.impactLabel).toBe("Heavy concrete combined upper/lower formula corridor");
    expect(summary.impactPosture.detail).toContain("Gate BD heavy-concrete combined upper/lower formula corridor");
    expect(summary.impactPosture.detail).toContain("+/-6.5 dB Ln,w and +/-5.5 dB DeltaLw");

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    const lnwBudgetCard = corridorDossier.cards.find((card) => card.label === "Ln,w error budget");
    const deltaBudgetCard = corridorDossier.cards.find((card) => card.label === "DeltaLw error budget");
    expect(corridorDossier.headline).toContain(
      "Source-absent heavy-concrete combined upper/lower budgets are structured"
    );
    expect(lnwBudgetCard).toMatchObject({
      tone: "warning",
      value: "+/-6.5 dB"
    });
    expect(lnwBudgetCard?.detail).toContain("lower_assembly_coupling_simplification 2.1 dB");
    expect(deltaBudgetCard).toMatchObject({
      tone: "warning",
      value: "+/-5.5 dB"
    });
    expect(deltaBudgetCard?.detail).toContain("not measured evidence");

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating the heavy-concrete combined predictor lane.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: [lnwCard, deltaCard],
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole ?? "floor_role",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "8 live rows feed the visible heavy-concrete combined floor route.",
      studyModeLabel: "Floor",
      validationDetail: "Gate BD heavy-concrete combined formula corridor remains active.",
      validationLabel: "Heavy concrete combined formula corridor",
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Heavy concrete combined upper/lower formula corridor"
    });
    expect(impactTraceGroup?.notes).toEqual(
      expect.arrayContaining([
        "Heavy-concrete combined upper/lower corridor is source-absent lab evidence, not a measured row.",
        "Heavy-concrete combined upper/lower error budgets are structured: Ln,w 44.4 dB [37.9..50.9] +/-6.5 dB; DeltaLw 30.1 dB [24.6..35.6] +/-5.5 dB; origin source_absent_formula_error_budget; not measured evidence."
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Heavy concrete combined upper/lower formula corridor");
    expect(report).toContain("- Impact basis: Heavy concrete combined upper/lower formula corridor");
    expect(report).toContain("- Impact Ln,w: 44.4 dB");
    expect(report).toContain("- DeltaLw: 30.1 dB");
    expect(report).toContain(
      "- Impact Ln,w provenance: Heavy concrete combined upper/lower formula corridor. Ln,w came from the source-absent heavy-concrete combined upper/lower formula corridor."
    );
    expect(report).toContain(
      "- Impact DeltaLw provenance: Heavy concrete combined upper/lower formula corridor. DeltaLw came from the source-absent heavy-concrete combined upper/lower formula corridor."
    );
    expect(report).toContain(
      "- Impact error budget Ln,w: 44.4 dB, range 37.9-50.9 dB, tolerance +/-6.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain(
      "- Impact error budget DeltaLw: 30.1 dB, range 24.6-35.6 dB, tolerance +/-5.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain(
      "- Formula note: Heavy-concrete combined upper/lower error budgets are structured: Ln,w 44.4 dB [37.9..50.9] +/-6.5 dB; DeltaLw 30.1 dB [24.6..35.6] +/-5.5 dB; origin source_absent_formula_error_budget; not measured evidence."
    );
  });

  it("keeps saved replay, calculator API, and impact-only API payloads on the same Gate BD basis and budget", async () => {
    const savedScenario = buildScenario("saved");
    const expected = buildHeavyCombinedResult().impact;
    const savedLnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result: savedScenario.result, studyMode: "floor" }),
      { result: savedScenario.result, studyMode: "floor" }
    );

    expect(savedScenario.source).toBe("saved");
    expect(savedLnwCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      value: "44.4 dB"
    });
    expect(savedScenario.result.impact?.errorBudgets).toEqual(expected?.errorBudgets);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
        layers: HEAVY_COMBINED_LAYER_INPUTS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(estimateBody.result?.impact?.basis).toBe(HEAVY_CONCRETE_COMBINED_FORMULA_BASIS);
    expect(estimateBody.result?.impact?.LnW).toBe(44.4);
    expect(estimateBody.result?.impact?.DeltaLw).toBe(30.1);
    expect(estimateBody.result?.impact?.errorBudgets).toEqual(expected?.errorBudgets);
    expect(estimateBody.result?.unsupportedTargetOutputs).toContain("IIC");

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
        layers: HEAVY_COMBINED_LAYER_INPUTS,
        targetOutputs: IMPACT_ONLY_TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(impactBody.result?.impact?.basis).toBe(HEAVY_CONCRETE_COMBINED_FORMULA_BASIS);
    expect(impactBody.result?.impact?.errorBudgets).toEqual(expected?.errorBudgets);
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining(["L'n,w", "L'nT,w", "IIC"])
    );
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });

  it("keeps wrong-basis and missing-input requests outside the Gate BD promoted budget", async () => {
    const missingDynamicStiffnessInput = {
      ...GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
      resilientLayer: {
        thicknessMm: 8
      }
    };
    const missingLowerTreatmentInput = {
      ...GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
      lowerTreatment: undefined
    };
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const missingDynamicResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: missingDynamicStiffnessInput,
        layers: HEAVY_COMBINED_LAYER_INPUTS,
        targetOutputs: ["Ln,w", "DeltaLw"] satisfies readonly RequestedOutputId[]
      })
    );
    const missingDynamicBody = (await missingDynamicResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(missingDynamicBody.ok).toBe(true);
    expect(missingDynamicBody.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_FORMULA_BASIS);
    expect(missingDynamicBody.result?.impact?.errorBudgets?.some((item: ImpactErrorBudget) =>
      item.metricId === "Ln,w" || item.metricId === "DeltaLw"
    ) ?? false).toBe(false);

    const missingLowerResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: missingLowerTreatmentInput,
        layers: HEAVY_COMBINED_LAYER_INPUTS,
        targetOutputs: ["Ln,w", "DeltaLw"] satisfies readonly RequestedOutputId[]
      })
    );
    const missingLowerBody = (await missingLowerResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(missingLowerBody.ok).toBe(true);
    expect(missingLowerBody.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_FORMULA_BASIS);
    expect(missingLowerBody.result?.impact?.errorBudgets?.some((item: ImpactErrorBudget) =>
      item.metricId === "Ln,w" || item.metricId === "DeltaLw"
    ) ?? false).toBe(false);
  });
});
