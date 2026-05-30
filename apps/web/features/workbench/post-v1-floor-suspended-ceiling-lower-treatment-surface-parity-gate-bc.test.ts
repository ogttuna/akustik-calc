import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC
} from "@dynecho/engine";
import type {
  AssemblyCalculation,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import type { WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft } from "./heavy-concrete-combined-impact-input-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "IIC"] as const satisfies readonly RequestedOutputId[];

const VISIBLE_LAYER_DERIVED_SURFACE = {
  impactHeavyConcreteBaseSlabDensityKgM3: "",
  impactHeavyConcreteBaseSlabThicknessMm: "",
  impactHeavyConcreteLoadBasisKgM2: String(POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.loadBasisKgM2),
  impactHeavyConcreteLowerAssemblyType: "",
  impactHeavyConcreteLowerBoardLayerCount: "",
  impactHeavyConcreteLowerBoardThicknessMm: "",
  impactHeavyConcreteLowerCavityDepthMm: "",
  impactHeavyConcreteLowerCavityFillThicknessMm: "",
  impactHeavyConcreteLowerSupportClass: "",
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: String(
    POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
  ),
  impactHeavyConcreteResilientLayerThicknessMm: ""
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

function toLayerDrafts(layers: readonly LayerInput[], idPrefix: string): LayerDraft[] {
  return layers.map((layer, index) => ({
    floorRole: layer.floorRole,
    id: `${idPrefix}-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function evaluateVisibleLowerTreatmentScenario(input: {
  id?: string;
  layers?: readonly LayerInput[];
  source?: "current" | "saved";
  surface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;
} = {}): EvaluatedScenario {
  return evaluateScenario({
    heavyConcreteCombinedImpactInputSurface: input.surface ?? VISIBLE_LAYER_DERIVED_SURFACE,
    id: input.id ?? "gate-bc-visible-lower-treatment",
    name: "Gate BC visible lower treatment surface parity",
    rows: toLayerDrafts(
      input.layers ?? POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
      input.id ?? "gate-bc-visible-lower-treatment"
    ),
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate BC Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate BC Visible Lower Treatment Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

function expectVisibleLowerTreatmentAnswer(result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined) {
  expect(result?.impact).toMatchObject({
    basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    DeltaLw: 28.9,
    LnW: 45.6,
    labOrField: "lab"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["IIC"]);
  expect(result?.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    supportedMetrics: ["Ln,w", "DeltaLw"],
    valuePins: [
      {
        metric: "Ln,w",
        value: 45.6
      },
      {
        metric: "DeltaLw",
        value: 28.9
      }
    ]
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

describe("post-V1 floor suspended-ceiling lower-treatment Gate BC surface parity", () => {
  it("shows visible acoustic-hanger lower-treatment values on workbench cards, saved replay, and Markdown report", () => {
    const summary = summarizePostV1FloorSuspendedCeilingLowerTreatmentSurfaceParityGateBC();
    const liveScenario = evaluateVisibleLowerTreatmentScenario();
    const savedScenario = evaluateVisibleLowerTreatmentScenario({
      id: "gate-bc-visible-lower-treatment-saved",
      source: "saved"
    });

    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.lnWDb === 45.6)).toBe(true);
    expectVisibleLowerTreatmentAnswer(liveScenario.result);
    expectVisibleLowerTreatmentAnswer(savedScenario.result);
    expect(liveScenario.warnings.join("\n")).not.toContain("Lower ceiling assembly");

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result: liveScenario.result, studyMode: "floor" }),
      { result: liveScenario.result, studyMode: "floor" }
    );
    const deltaCard = addOutputCardPosture(
      buildOutputCard({ output: "DeltaLw", result: liveScenario.result, studyMode: "floor" }),
      { result: liveScenario.result, studyMode: "floor" }
    );

    expect(lnwCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "45.6 dB"
    });
    expect(deltaCard).toMatchObject({
      postureLabel: "Heavy concrete combined formula corridor",
      status: "live",
      value: "28.9 dB"
    });

    const report = buildReport(liveScenario);
    expect(report).toContain("- Impact lane: Heavy concrete combined upper/lower formula corridor");
    expect(report).toContain("- Impact Ln,w: 45.6 dB");
    expect(report).toContain("- DeltaLw: 28.9 dB");
    expect(report).toContain(
      "- Impact error budget Ln,w: 45.6 dB, range 39.1-52.1 dB, tolerance +/-6.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain(
      "- Impact error budget DeltaLw: 28.9 dB, range 23.4-34.4 dB, tolerance +/-5.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
  });

  it("keeps calculator API and impact-only API on the same layer-derived lower-treatment answer", async () => {
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        layers: POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectVisibleLowerTreatmentAnswer(estimateBody.result);

    const impactOnlyResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
        layers: POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactOnlyBody = (await impactOnlyResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };
    expect(impactOnlyResponse.status).toBe(200);
    expect(impactOnlyBody.ok).toBe(true);
    expectVisibleLowerTreatmentAnswer(impactOnlyBody.result);
  });

  it("keeps the visible resilient-stud support on the same family with its own value pins", () => {
    const scenario = evaluateVisibleLowerTreatmentScenario({
      id: "gate-bc-resilient-stud",
      layers: POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_RESILIENT_STUD_LAYERS
    });

    expect(scenario.result?.impact).toMatchObject({
      basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      DeltaLw: 29.9,
      LnW: 44.6
    });
    expect(scenario.result?.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
      valuePins: [
        {
          metric: "Ln,w",
          value: 44.6
        },
        {
          metric: "DeltaLw",
          value: 29.9
        }
      ]
    });
  });
});
