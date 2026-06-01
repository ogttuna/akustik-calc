import {
  MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
  POST_V1_GATE_BI_FIELD_CONTEXT,
  POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
  POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS,
  summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ,
  calculateAssembly
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
import { formatConfidenceProvenanceForImpact } from "./impact-confidence-view";
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
import {
  MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
  isMixedSupportFloorImpactCorridorImpact
} from "./mixed-support-floor-impact-corridor-view";
import { getPresetById } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  describeImpactValidationPosture,
  getActiveValidationMode
} from "./validation-regime";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

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

function buildMixedSupportResult(): AssemblyCalculation {
  return calculateAssembly(POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS, {
    calculator: "dynamic",
    impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
    impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
    targetOutputs: TARGET_OUTPUTS
  });
}

function buildScenario(source: "current" | "saved" = "current"): EvaluatedScenario & { result: AssemblyCalculation } {
  const result = buildMixedSupportResult();

  return {
    id: source === "saved" ? "gate-bj-mixed-support-saved" : "gate-bj-mixed-support-current",
    name: "Gate BJ mixed-support surface parity",
    result,
    rows: toLayerDrafts(POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS, `gate-bj-${source}`),
    savedAtIso: source === "saved" ? "2026-06-01T09:00:00.000Z" : undefined,
    source,
    studyMode: "floor",
    warnings: result.warnings
  };
}

function buildCards(result: AssemblyCalculation): Record<(typeof TARGET_OUTPUTS)[number], OutputCardModel> {
  return Object.fromEntries(
    TARGET_OUTPUTS.map((output) => [
      output,
      addOutputCardPosture(buildOutputCard({ output, result, studyMode: "floor" }), {
        result,
        studyMode: "floor"
      })
    ])
  ) as Record<(typeof TARGET_OUTPUTS)[number], OutputCardModel>;
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Gate BJ Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate BJ Mixed Support Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

function expectMixedSupportAnswer(
  result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined
) {
  expect(result?.impact).toMatchObject({
    DeltaLw: 29.9,
    LPrimeNT50: 47.8,
    LPrimeNTw: 43.8,
    LPrimeNW: 46.6,
    LnW: 44.6
  });
  expect(result?.impact?.metricBasis).toMatchObject({
    DeltaLw: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
    LnW: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS
  });
  expect(result?.supportedTargetOutputs).toEqual([
    "Ln,w",
    "DeltaLw",
    "L'n,w",
    "L'nT,w",
    "L'nT,50"
  ]);
  expect(result?.unsupportedTargetOutputs).toEqual(["IIC"]);
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

describe("post-V1 floor mixed-support family surface parity Gate BJ", () => {
  it("shows the same mixed-support basis on cards, route labels, dossiers, saved replay, and Markdown report", () => {
    const summary = summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ();
    const scenario = buildScenario();
    const savedScenario = buildScenario("saved");
    const result = scenario.result;
    const savedResult = savedScenario.result;

    expect(summary.runtimeMovedAtGateBJ).toBe(false);
    expect(summary.surfaceSnapshots.every((snapshot) => snapshot.lnWDb === 44.6)).toBe(true);
    expectMixedSupportAnswer(result);
    expectMixedSupportAnswer(savedResult);
    expect(isMixedSupportFloorImpactCorridorImpact(result)).toBe(true);
    expect(result.dynamicImpactTrace).toMatchObject({
      fieldContinuation: "standardized_room_volume",
      selectedLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL
    });

    const cards = buildCards(result);
    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      status: "live",
      value: "44.6 dB"
    });
    expect(cards["Ln,w"].detail).toContain("Gate BI explicit single-primary-carrier mixed-support corridor");
    expect(cards["Ln,w"].detail).toContain("+/-7.5 dB corridor tolerance");
    expect(cards.DeltaLw).toMatchObject({
      postureLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      status: "live",
      value: "29.9 dB"
    });
    expect(cards.DeltaLw.detail).toContain("lower-treatment-only secondary owner");
    expect(cards["L'n,w"]).toMatchObject({
      postureLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      status: "live",
      value: "46.6 dB"
    });
    expect(cards["L'nT,w"]).toMatchObject({
      postureLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      status: "live",
      value: "43.8 dB"
    });
    expect(cards["L'nT,50"]).toMatchObject({
      postureLabel: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      status: "live",
      value: "47.8 dB"
    });
    expect(cards.IIC).toMatchObject({
      postureLabel: "Unsupported on route",
      status: "unsupported",
      value: "Not ready"
    });

    const laneKind = getImpactLaneKind({ impact: result.impact, lowerBoundImpact: result.lowerBoundImpact });
    expect(laneKind).toBe("mixed_support_floor_formula_corridor");
    expect(getImpactLanePillLabel(laneKind)).toBe("Mixed-support formula live");
    expect(getImpactLaneHeadline(laneKind)).toBe(MIXED_SUPPORT_FLOOR_IMPACT_LABEL);
    expect(getImpactLaneNarrative(laneKind, false)).toContain("unsafe duplicate-carrier partitions");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact?.metricBasis?.LnW ?? result.impact?.basis,
      provenance: result.impact?.confidence.provenance ?? "formula_estimate_narrow_scope"
    })).toBe(MIXED_SUPPORT_FLOOR_IMPACT_LABEL);

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toContainEqual([
      "Ln,w",
      MIXED_SUPPORT_FLOOR_IMPACT_LABEL
    ]);
    expect(basisRows.find((row) => row.label === "DeltaLw")?.description).toContain(
      "explicit ownership guards"
    );

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("+/-7.5 dB Ln,w");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "field_standardized_volume_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain(MIXED_SUPPORT_FLOOR_IMPACT_LABEL);
    expect(corridorDossier.headline).toContain("mixed-support single-primary-carrier budgets");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: MIXED_SUPPORT_FLOOR_IMPACT_LABEL
    });
    expect(corridorDossier.cards.find((card) => card.label === "Ln,w error budget")).toMatchObject({
      detail: expect.stringContaining("mixed_support_single_primary_carrier_guard"),
      value: "+/-7.5 dB"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a mixed-support floor predictor lane.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Field standardized",
      coverageItems: Object.values(cards),
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole ?? "floor_role",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "6 live rows feed the visible mixed-support floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: MIXED_SUPPORT_FLOOR_IMPACT_LABEL
    });
    expect(impactTraceGroup?.detail).toContain("Standardized field-volume carry-over");
    expect(impactTraceGroup?.notes.join("\n")).toContain("Gate BI mixed-support runtime");

    const report = buildReport(scenario);
    expect(report).toContain(`- Impact lane: ${MIXED_SUPPORT_FLOOR_IMPACT_LABEL}`);
    expect(report).toContain("- Impact basis: Standardized field-volume carry-over");
    expect(report).toContain("- Impact Ln,w: 44.6 dB");
    expect(report).toContain("- DeltaLw: 29.9 dB");
    expect(report).toContain("- Impact L'n,w: 46.6 dB");
    expect(report).toContain("- Impact L'nT,w: 43.8 dB");
    expect(report).toContain("- Impact L'nT,50: 47.8 dB");
    expect(report).toContain(
      "- Impact error budget Ln,w: 44.6 dB, range 37.1-52.1 dB, tolerance +/-7.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain(
      "- Impact error budget DeltaLw: 29.9 dB, range 23.4-36.4 dB, tolerance +/-6.5 dB, origin source_absent_formula_error_budget, not measured evidence yes."
    );
    expect(report).toContain("- Formula note: Gate BI mixed-support runtime reuses");
  });

  it("keeps calculator API and impact-only API payloads on the same mixed-support answer", async () => {
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
        impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
        layers: POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };
    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectMixedSupportAnswer(estimateBody.result);
    expect(estimateBody.result?.dynamicImpactTrace?.selectedLabel).toBe(MIXED_SUPPORT_FLOOR_IMPACT_LABEL);

    const impactOnlyResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        impactFieldContext: POST_V1_GATE_BI_FIELD_CONTEXT,
        impactPredictorInput: POST_V1_GATE_BI_SINGLE_PRIMARY_CARRIER_PREDICTOR_INPUT,
        layers: POST_V1_GATE_BJ_VISIBLE_MIXED_SUPPORT_LAYERS,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactOnlyBody = (await impactOnlyResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };
    expect(impactOnlyResponse.status).toBe(200);
    expect(impactOnlyBody.ok).toBe(true);
    expectMixedSupportAnswer(impactOnlyBody.result);
    expect(impactOnlyBody.result?.dynamicImpactTrace?.selectedLabel).toBe(MIXED_SUPPORT_FLOOR_IMPACT_LABEL);
  });
});
