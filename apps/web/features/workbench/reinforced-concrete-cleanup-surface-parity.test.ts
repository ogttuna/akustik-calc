import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "@dynecho/engine";
import type {
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import {
  buildWorkbenchHeavyConcreteCombinedImpactInputSurface,
  type WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft
} from "./heavy-concrete-combined-impact-input-surface";
import { ImpactTracePanel } from "./impact-trace-panel";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const IMPACT_ONLY_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

const REINFORCED_CONCRETE_ROWS: readonly LayerDraft[] = [
  { floorRole: "base_structure", id: "slab", materialId: "concrete", thicknessMm: "180" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { floorRole: "floor_covering", id: "finish", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "resilient_channel", thicknessMm: "120" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "glasswool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" }
];

const COMPLETE_REINFORCED_CONCRETE_SURFACE = {
  impactHeavyConcreteBaseSlabDensityKgM3: "2400",
  impactHeavyConcreteBaseSlabThicknessMm: "180",
  impactHeavyConcreteLoadBasisKgM2: "4.2",
  impactHeavyConcreteLowerAssemblyType: "suspended_ceiling_elastic_hanger",
  impactHeavyConcreteLowerBoardLayerCount: "2",
  impactHeavyConcreteLowerBoardThicknessMm: "16",
  impactHeavyConcreteLowerCavityDepthMm: "120",
  impactHeavyConcreteLowerCavityFillThicknessMm: "100",
  impactHeavyConcreteLowerSupportClass: "furred_channels",
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: "35",
  impactHeavyConcreteResilientLayerThicknessMm: "8"
} as const satisfies WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;

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

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: Number(row.thicknessMm)
  }));
}

function evaluateReinforcedConcreteScenario(input: {
  id: string;
  source?: "current" | "saved";
  surface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario {
  return evaluateScenario({
    heavyConcreteCombinedImpactInputSurface: input.surface ?? null,
    id: input.id,
    name: input.id,
    rows: REINFORCED_CONCRETE_ROWS,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });
}

function outputCard(result: AssemblyCalculation | null, output: RequestedOutputId) {
  return addOutputCardPosture(
    buildOutputCard({ output, result, studyMode: "floor" }),
    { result, studyMode: "floor" }
  );
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate BP Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate BP Reinforced Concrete Cleanup Surface Parity",
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

describe("reinforced-concrete cleanup surface parity", () => {
  it("shows visible-derived missing impact owners as needs-input cards, trace, and report text", () => {
    const scenario = evaluateReinforcedConcreteScenario({ id: "gate-bp-visible-derived-needs-input" });
    const result = scenario.result;
    const branchSummary = getDynamicCalcBranchSummary({ result, studyMode: "floor" });

    expect(result?.impact).toBeNull();
    expect(result?.supportedTargetOutputs).toEqual(["Rw", "Ctr"]);
    expect(result?.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(branchSummary).toMatchObject({
      tone: "warning",
      value: "Awaiting supported topology"
    });

    const lnwCard = outputCard(result, "Ln,w");
    const deltaCard = outputCard(result, "DeltaLw");

    expect(lnwCard).toMatchObject({
      postureLabel: "Awaiting route input",
      postureTone: "warning",
      status: "needs_input",
      value: "Not ready"
    });
    expect(deltaCard).toMatchObject({
      postureLabel: "Awaiting route input",
      postureTone: "warning",
      status: "needs_input",
      value: "Not ready"
    });
    expect(`${lnwCard.detail} ${deltaCard.detail}`).toContain(
      "resilientLayerDynamicStiffnessMNm3"
    );
    expect(`${lnwCard.detail} ${deltaCard.detail}`).toContain("loadBasisKgM2");
    expect(`${lnwCard.detail} ${deltaCard.detail}`).toContain("ceilingOrLowerAssembly");

    vi.stubGlobal("React", React);
    const traceHtml = renderToStaticMarkup(React.createElement(ImpactTracePanel, { result }));
    expect(traceHtml).toContain("Future supported outputs");
    expect(traceHtml).toContain("reinforced-concrete combined upper/lower impact runtime is waiting");
    expect(traceHtml).not.toContain("Low-confidence fallback");

    const report = buildReport(scenario);
    expect(report).toContain("- Predictor input mode: derived_from_visible_layers");
    expect(report).toContain("resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, ceilingOrLowerAssembly");
    expect(report).not.toContain("- Low-confidence fallback family: reinforced concrete");
    expect(report).not.toContain("- Impact error budget Ln,w:");
  });

  it("keeps complete UI-derived Gate BO values, budgets, saved replay, and API payloads on the same formula basis", async () => {
    const liveScenario = evaluateReinforcedConcreteScenario({
      id: "gate-bp-live-formula",
      surface: COMPLETE_REINFORCED_CONCRETE_SURFACE
    });
    const result = liveScenario.result;

    expect(result?.impact).toMatchObject({
      DeltaLw: 13.7,
      LnW: 58.1,
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      labOrField: "lab",
      metricBasis: {
        DeltaLw: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
      }
    });
    expect(result?.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w", "DeltaLw"]);
    expect(result?.unsupportedTargetOutputs).toEqual([]);

    const lnwCard = outputCard(result, "Ln,w");
    const deltaCard = outputCard(result, "DeltaLw");
    expect(lnwCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "58.1 dB"
    });
    expect(lnwCard.detail).toContain("+/-6.5 dB corridor tolerance");
    expect(deltaCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "13.7 dB"
    });
    expect(deltaCard.detail).toContain("+/-5.5 dB corridor tolerance");

    const savedScenario = evaluateReinforcedConcreteScenario({
      id: "gate-bp-saved-formula",
      source: "saved",
      surface: COMPLETE_REINFORCED_CONCRETE_SURFACE
    });
    expect(savedScenario.result?.impact?.basis).toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(savedScenario.result?.impact?.errorBudgets).toEqual(result?.impact?.errorBudgets);

    const report = buildReport(liveScenario);
    expect(report).toContain("- Impact basis: Heavy concrete combined upper/lower formula corridor");
    expect(report).toContain("- Impact Ln,w: 58.1 dB");
    expect(report).toContain("- DeltaLw: 13.7 dB");
    expect(report).toContain(
      "- Impact error budget Ln,w: 58.1 dB, range 51.6-64.6 dB, tolerance +/-6.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain(
      "- Impact error budget DeltaLw: 13.7 dB, range 8.2-19.2 dB, tolerance +/-5.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );

    const layers = toLayerInputs(REINFORCED_CONCRETE_ROWS);
    const surface = buildWorkbenchHeavyConcreteCombinedImpactInputSurface({
      layers,
      surface: COMPLETE_REINFORCED_CONCRETE_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    expect(surface.status).toBe("ready_for_formula_corridor");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        impactPredictorInput: surface.impactPredictorInput,
        layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(estimateBody.result?.impact?.basis).toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(estimateBody.result?.impact?.LnW).toBe(58.1);
    expect(estimateBody.result?.impact?.DeltaLw).toBe(13.7);
    expect(estimateBody.result?.impact?.errorBudgets).toEqual(result?.impact?.errorBudgets);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactPredictorInput: surface.impactPredictorInput,
        layers,
        targetOutputs: IMPACT_ONLY_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expect(impactBody.result?.impact?.basis).toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(impactBody.result?.impact?.LnW).toBe(58.1);
    expect(impactBody.result?.impact?.DeltaLw).toBe(13.7);
    expect(impactBody.result?.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["L'n,w", "IIC"]));
  });

  it("keeps partial and wrong-basis reinforced-concrete requests outside the Gate BO formula budget", async () => {
    const missingLoad = evaluateReinforcedConcreteScenario({
      id: "gate-bp-missing-load",
      surface: {
        ...COMPLETE_REINFORCED_CONCRETE_SURFACE,
        impactHeavyConcreteLoadBasisKgM2: ""
      }
    });
    expect(missingLoad.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(outputCard(missingLoad.result, "Ln,w")).toMatchObject({
      status: "needs_input",
      value: "Not ready"
    });
    expect(missingLoad.warnings.join("\n")).toContain("Loaded upper treatment mass basis");
    expect(missingLoad.result?.impact?.errorBudgets?.length ?? 0).toBe(0);

    const fieldOnly = evaluateReinforcedConcreteScenario({
      id: "gate-bp-field-boundary",
      surface: COMPLETE_REINFORCED_CONCRETE_SURFACE,
      targetOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(fieldOnly.result?.impact?.basis).not.toBe(HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS);
    expect(fieldOnly.result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const visibleResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        layers: toLayerInputs(REINFORCED_CONCRETE_ROWS),
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const visibleBody = (await visibleResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(visibleBody.ok).toBe(true);
    expect(visibleBody.result?.impact).toBeNull();
    expect(visibleBody.result?.warnings.join("\n")).toContain("loadBasisKgM2");
    expect(visibleBody.result?.impactPredictorStatus?.implementedLowConfidenceEstimate).toBe(false);
  });
});
