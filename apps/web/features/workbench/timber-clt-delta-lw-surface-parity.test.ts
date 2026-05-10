import {
  calculateAssembly,
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS,
  buildGateBTimberCltDeltaLwScenarioPack
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
  formatImpactMetricBasisLabel,
  getActiveImpactMetricBasisRows
} from "./impact-metric-basis-view";
import { ImpactTracePanel } from "./impact-trace-panel";
import { getPresetById } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
  isTimberCltDeltaLwFormulaCorridorImpact
} from "./timber-clt-delta-lw-corridor-view";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const IMPACT_ONLY_TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

function contractById(id: string) {
  const entry = buildGateBTimberCltDeltaLwScenarioPack().find((scenario) => scenario.id === id);

  if (!entry) {
    throw new Error(`Missing Gate B scenario ${id}`);
  }

  if (!entry.contract.normalizedPredictorInput) {
    throw new Error(`Gate B scenario ${id} has no predictor input`);
  }

  return entry.contract;
}

function layersFor(id: string): readonly LayerInput[] {
  return id.includes("clt") ? GATE_B_CLT_LAYERS : GATE_B_TIMBER_JOIST_LAYERS;
}

function buildRows(layers: readonly LayerInput[], id: string): LayerDraft[] {
  return layers.map((layer, index) => ({
    floorRole: layer.floorRole,
    id: `${id}-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function buildResult(id: string, targetOutputs: readonly RequestedOutputId[] = TARGET_OUTPUTS): AssemblyCalculation {
  const contract = contractById(id);

  return calculateAssembly(layersFor(id), {
    impactPredictorInput: contract.normalizedPredictorInput ?? undefined,
    targetOutputs
  });
}

function buildScenario(id: string, name: string): EvaluatedScenario & { result: AssemblyCalculation } {
  const result = buildResult(id);

  return {
    id,
    name,
    result,
    rows: buildRows(layersFor(id), id),
    source: "current",
    studyMode: "floor",
    warnings: result.warnings
  };
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate E Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate E Timber CLT DeltaLw Surface Parity",
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

describe("timber/CLT DeltaLw surface parity", () => {
  it("shows timber exact Ln,w plus formula DeltaLw consistently on cards, trace, dossier, and Markdown report", () => {
    const scenario = buildScenario(
      "gate_b_timber_joist_complete_ready_for_formula_corridor",
      "Gate E timber joist DeltaLw surface parity"
    );
    const result = scenario.result;

    expect(result.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51,
      basis: "official_floor_system_exact_match",
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });
    expect(isTimberCltDeltaLwFormulaCorridorImpact(result)).toBe(true);

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );
    const deltaCard = addOutputCardPosture(
      buildOutputCard({ output: "DeltaLw", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );

    expect(lnwCard).toMatchObject({
      postureLabel: "Exact source row",
      status: "live",
      value: "51 dB"
    });
    expect(deltaCard).toMatchObject({
      postureLabel: "Timber/CLT DeltaLw formula",
      status: "live",
      value: "25.2 dB"
    });
    expect(deltaCard.detail).toContain("Timber joist DeltaLw from the timber/CLT formula corridor");
    expect(deltaCard.detail).toContain("+/-7.5 dB corridor tolerance");
    expect(deltaCard.detail).toContain("origin source_absent_formula_error_budget");
    expect(deltaCard.detail).toContain("not measured evidence");
    expect(deltaCard.postureDetail).toContain("do not treat it as measured evidence");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    const deltaBasis = basisRows.find((row) => row.metric === "DeltaLw");
    expect(deltaBasis?.description).toBe("DeltaLw came from the source-absent timber joist DeltaLw formula corridor.");
    expect(deltaBasis ? formatImpactMetricBasisLabel(deltaBasis.basis) : null).toBe("Timber joist DeltaLw formula corridor");

    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result }));
    expect(traceHtml).toContain("Timber/CLT DeltaLw corridor is source-absent lab evidence");
    expect(traceHtml).toContain("Corridor tolerance remains +/-7.5 dB for DeltaLw");

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    const budgetCard = corridorDossier.cards.find((card) => card.label === "DeltaLw error budget");
    expect(corridorDossier.headline).toContain("Source-absent timber/CLT DeltaLw formula budget is structured");
    expect(budgetCard).toMatchObject({
      tone: "warning",
      value: "+/-7.5 dB"
    });
    expect(budgetCard?.detail).toContain("timber_joist_exact_lnw_not_delta_lw 2.4 dB");
    expect(budgetCard?.detail).toContain("not measured evidence");

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a timber floor predictor lane.",
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
      stackDetail: "7 live rows feed the visible timber floor route.",
      studyModeLabel: "Floor",
      validationDetail: "Timber DeltaLw formula corridor remains active.",
      validationLabel: "Timber/CLT DeltaLw formula corridor",
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup?.notes).toContain(
      "Timber/CLT DeltaLw uses 13 log10(m'load) - 14.2 log10(s') + 20.8 plus structural-family and lower-assembly coupling corrections."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- DeltaLw: 25.2 dB");
    expect(report).toContain("- Impact DeltaLw provenance: Timber joist DeltaLw formula corridor. DeltaLw came from the source-absent timber joist DeltaLw formula corridor.");
    expect(report).toContain("- Impact error budget DeltaLw: 25.2 dB, range 17.7-32.7 dB, tolerance +/-7.5 dB, origin source_absent_formula_error_budget, not measured evidence yes.");
    expect(report).toContain("- Formula note: Timber/CLT DeltaLw corridor is source-absent lab evidence, not a measured row.");
  });

  it("shows CLT family Ln,w plus formula DeltaLw with the same visible source-absent budget", () => {
    const scenario = buildScenario(
      "gate_b_clt_complete_ready_for_formula_corridor",
      "Gate E CLT DeltaLw surface parity"
    );
    const result = scenario.result;

    expect(result.impact).toMatchObject({
      DeltaLw: 22.6,
      LnW: 50,
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
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
      postureLabel: "Benchmark-backed estimate",
      value: "50 dB"
    });
    expect(deltaCard).toMatchObject({
      postureLabel: "Timber/CLT DeltaLw formula",
      value: "22.6 dB"
    });
    expect(deltaCard.detail).toContain("Mass-timber CLT DeltaLw from the timber/CLT formula corridor");
    expect(deltaCard.detail).toContain("clt_reference_floor_family_spread 2.5 dB");

    const budget = result.impact?.errorBudgets?.find((item: ImpactErrorBudget) => item.metricId === "DeltaLw");
    expect(budget).toMatchObject({
      estimate: 22.6,
      max: 30.1,
      min: 15.1,
      notMeasuredEvidence: true,
      toleranceDb: 7.5
    });

    const report = buildReport(scenario);
    expect(report).toContain("- Impact DeltaLw provenance: Mass-timber CLT DeltaLw formula corridor. DeltaLw came from the source-absent mass-timber CLT DeltaLw formula corridor.");
    expect(report).toContain("- Impact error budget DeltaLw: 22.6 dB, range 15.1-30.1 dB, tolerance +/-7.5 dB, origin source_absent_formula_error_budget, not measured evidence yes.");
  });

  it("keeps calculator and impact-only API payloads on the same timber/CLT DeltaLw values and budgets", async () => {
    const timberContract = contractById("gate_b_timber_joist_complete_ready_for_formula_corridor");
    const expected = buildResult("gate_b_timber_joist_complete_ready_for_formula_corridor").impact;
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: timberContract.normalizedPredictorInput,
        layers: layersFor("gate_b_timber_joist_complete_ready_for_formula_corridor"),
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(estimateBody.result?.impact?.DeltaLw).toBe(expected?.DeltaLw);
    expect(estimateBody.result?.impact?.metricBasis?.DeltaLw).toBe(TIMBER_JOIST_DELTA_LW_FORMULA_BASIS);
    expect(estimateBody.result?.impact?.errorBudgets).toEqual(expected?.errorBudgets);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: timberContract.normalizedPredictorInput,
        layers: layersFor("gate_b_timber_joist_complete_ready_for_formula_corridor"),
        targetOutputs: IMPACT_ONLY_TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(impactBody.result?.impact?.DeltaLw).toBe(expected?.DeltaLw);
    expect(impactBody.result?.impact?.metricBasis?.DeltaLw).toBe(TIMBER_JOIST_DELTA_LW_FORMULA_BASIS);
    expect(impactBody.result?.impact?.errorBudgets).toEqual(expected?.errorBudgets);
    expect(impactBody.result?.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["L'n,w", "L'nT,w"]));
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });

  it("keeps missing and wrong-basis API requests budget-free", async () => {
    const missingContract = contractById("gate_b_missing_dynamic_stiffness_needs_input");
    const fieldContract = contractById("gate_b_field_context_non_alias_blocked");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const missingResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: missingContract.normalizedPredictorInput,
        layers: layersFor("gate_b_missing_dynamic_stiffness_needs_input"),
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const missingBody = (await missingResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(missingBody.ok).toBe(true);
    expect(missingBody.result?.impact?.DeltaLw).toBeUndefined();
    expect(missingBody.result?.impact?.metricBasis?.DeltaLw).toBeUndefined();
    expect(missingBody.result?.impact?.errorBudgets?.some((item: ImpactErrorBudget) => item.metricId === "DeltaLw") ?? false).toBe(false);
    expect(missingBody.result?.unsupportedTargetOutputs).toContain("DeltaLw");

    const fieldResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: fieldContract.normalizedPredictorInput,
        layers: layersFor("gate_b_field_context_non_alias_blocked"),
        targetOutputs: ["L'n,w", "L'nT,w"] satisfies readonly RequestedOutputId[]
      })
    );
    const fieldBody = (await fieldResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(fieldBody.ok).toBe(true);
    expect(fieldBody.result?.impact?.DeltaLw).toBeUndefined();
    expect(fieldBody.result?.impact?.errorBudgets?.some((item: ImpactErrorBudget) => item.metricId === "DeltaLw") ?? false).toBe(false);
    expect(fieldBody.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
  });
});
