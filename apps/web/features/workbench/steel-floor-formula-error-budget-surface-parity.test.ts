import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  ImpactErrorBudget,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const IMPACT_ONLY_TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

function buildSteelFormulaResult(): AssemblyCalculation {
  return calculateAssembly(STEEL_FORMULA_LAYER_INPUTS, {
    impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildSteelFormulaScenario(): EvaluatedScenario {
  const result = buildSteelFormulaResult();

  return {
    id: "gate-ao-steel-formula-error-budget-surface-parity",
    name: "Gate AO steel formula error-budget surface parity",
    result,
    rows: buildRows(STEEL_FORMULA_ROWS, "gate-ao-steel-formula"),
    source: "current",
    studyMode: "floor",
    warnings: result.warnings
  };
}

function buildSteelFormulaReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate AO Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AO Steel Formula Error Budget",
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

describe("steel floor formula error-budget surface parity", () => {
  it("shows the same structured budget on cards, dossiers, and Markdown report", () => {
    const scenario = buildSteelFormulaScenario();
    const result = scenario.result;
    expect(result).not.toBeNull();
    if (!result) {
      throw new Error("Gate AO steel formula scenario must produce a calculation result.");
    }
    const budgetsByMetric = new Map<string, ImpactErrorBudget>(
      (result.impact?.errorBudgets ?? []).map((budget: ImpactErrorBudget) => [
        budget.metricId,
        budget
      ])
    );

    expect(result.impact).toMatchObject({
      basis: STEEL_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
    expect(budgetsByMetric.get("Ln,w")).toMatchObject({
      estimate: 55.6,
      max: 60.1,
      min: 51.1,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 4.5,
      totalBudgetDb: 4.5
    });
    expect(budgetsByMetric.get("DeltaLw")).toMatchObject({
      estimate: 22.4,
      max: 24.4,
      min: 20.4,
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 2,
      totalBudgetDb: 2
    });

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );
    const deltaCard = addOutputCardPosture(
      buildOutputCard({ output: "DeltaLw", result, studyMode: "floor" }),
      { result, studyMode: "floor" }
    );

    expect(lnwCard.detail).toContain("Gate AN error budget: 55.6 dB range 51.1-60.1 dB (+/-4.5 dB corridor tolerance)");
    expect(lnwCard.detail).toContain("origin source_absent_formula_error_budget");
    expect(lnwCard.detail).toContain("not measured evidence");
    expect(lnwCard.detail).toContain("source_absent_bare_steel_reference_model 0.9 dB");
    expect(deltaCard.detail).toContain("Gate AN error budget: 22.4 dB range 20.4-24.4 dB (+/-2.0 dB corridor tolerance)");
    expect(deltaCard.detail).toContain("upper_resilient_topology_simplification 0.4 dB");

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    const lnwBudgetCard = corridorDossier.cards.find((card) => card.label === "Ln,w error budget");
    const deltaBudgetCard = corridorDossier.cards.find((card) => card.label === "DeltaLw error budget");
    expect(corridorDossier.headline).toContain("Source-absent steel formula budgets are structured");
    expect(lnwBudgetCard).toMatchObject({
      tone: "warning",
      value: "+/-4.5 dB"
    });
    expect(lnwBudgetCard?.detail).toContain("source_owned_delta_lw_holdout_absence 1.1 dB");
    expect(deltaBudgetCard).toMatchObject({
      tone: "warning",
      value: "+/-2.0 dB"
    });
    expect(deltaBudgetCard?.detail).toContain("not measured evidence");

    const methodDossier = buildSimpleWorkbenchMethodDossier({
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
      validationDetail: "Steel formula corridor remains active.",
      validationLabel: "Lightweight-steel formula corridor",
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup?.notes).toContain(
      "Gate AN error budgets are structured: Ln,w 55.6 dB [51.1..60.1] +/-4.5 dB; DeltaLw 22.4 dB [20.4..24.4] +/-2 dB; origin source_absent_formula_error_budget; not measured evidence."
    );

    const report = buildSteelFormulaReport(scenario);
    expect(report).toContain("- Impact error budget Ln,w: 55.6 dB, range 51.1-60.1 dB, tolerance +/-4.5 dB, origin source_absent_formula_error_budget, not measured evidence yes.");
    expect(report).toContain("- Impact error budget Ln,w terms: source_owned_delta_lw_holdout_absence 1.1 dB; source_absent_bare_steel_reference_model 0.9 dB");
    expect(report).toContain("- Impact error budget DeltaLw: 22.4 dB, range 20.4-24.4 dB, tolerance +/-2.0 dB, origin source_absent_formula_error_budget, not measured evidence yes.");
    expect(report).toContain("- Formula note: Gate AN error budgets are structured: Ln,w 55.6 dB [51.1..60.1] +/-4.5 dB; DeltaLw 22.4 dB [20.4..24.4] +/-2 dB; origin source_absent_formula_error_budget; not measured evidence.");
  });

  it("keeps calculator and impact-only API payloads on the same structured budget", async () => {
    const expected = buildSteelFormulaResult().impact?.errorBudgets;
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
        layers: STEEL_FORMULA_LAYER_INPUTS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(estimateBody.result?.impact?.errorBudgets).toEqual(expected);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
        layers: STEEL_FORMULA_LAYER_INPUTS,
        targetOutputs: IMPACT_ONLY_TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(impactBody.result?.impact?.errorBudgets).toEqual(expected);
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(
      expect.arrayContaining(["L'n,w", "L'nT,w"])
    );
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
