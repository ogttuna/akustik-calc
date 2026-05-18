import type { AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
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
  OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
  isOpenWebSupportedBandSimilarityResult
} from "./open-web-supported-band-similarity-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
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
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", id: "finish", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "3" },
  { floorRole: "floating_screed", id: "deck", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", id: "steel", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    get length() {
      return entries.size;
    },
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, value);
    }
  };
}

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm.replace(",", "."))
  }));
}

function buildScenario(input: {
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    calculator: "dynamic",
    id: input.id ?? "open-web-supported-band-similarity-surface",
    name: "Open-web supported-band similarity surface parity",
    rows: input.rows ?? OPEN_WEB_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-18T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Open-web supported-band similarity scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): Record<RequestedOutputId, OutputCardModel> {
  return Object.fromEntries(
    TARGET_OUTPUTS.map((output) => [
      output,
      addOutputCardPosture(buildOutputCard({ output, result, studyMode: "floor" }), {
        result,
        studyMode: "floor"
      })
    ])
  ) as Record<RequestedOutputId, OutputCardModel>;
}

function expectOpenWebSurfaceResult(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.impact).toMatchObject({
    CI: -1.5,
    LnW: 53.5,
    LnWPlusCI: 52,
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    labOrField: "lab"
  });
  expect(result?.floorSystemRatings).toMatchObject({
    Rw: 61.5,
    RwCtr: 56,
    basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    fitPercent: 89.5,
    impactBasisLabel: "Open-web steel supported-band similarity",
    selectedLabel: "Open-web steel supported-band similarity",
    selectionKindLabel: "Published family estimate"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(isOpenWebSupportedBandSimilarityResult(result)).toBe(true);
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("heavy_concrete_impact_floor"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Open Web Supported Band Similarity",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "50",
    targetRwDb: "60"
  });
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(OPEN_WEB_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the open-web supported-band snapshot.");
  }

  return savedSnapshot;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  vi.stubGlobal("localStorage", createMemoryStorage());

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

describe("open-web supported-band similarity surface parity", () => {
  it("shows the same FL-26 supported-band basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectOpenWebSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards["Rw"]).toMatchObject({
      postureLabel: "Open-web supported-band similarity",
      status: "live",
      value: "61.5 dB"
    });
    expect(cards["Rw"].detail).toContain("Open-web steel supported-band similarity");
    expect(cards["Rw"].detail).toContain("UBIQ FL-24/FL-26");

    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: "Open-web supported-band similarity",
      status: "live",
      value: "53.5 dB"
    });
    expect(cards["CI"]).toMatchObject({
      postureLabel: "Open-web supported-band similarity",
      status: "live",
      value: "-1.5 dB"
    });
    expect(cards["Ln,w+CI"]).toMatchObject({
      postureLabel: "Open-web supported-band similarity",
      status: "live",
      value: "52 dB"
    });
    expect(cards["L'n,w"]).toMatchObject({
      postureLabel: "Awaiting field input",
      status: "needs_input",
      value: "Not ready"
    });
    expect(cards.IIC).toMatchObject({
      postureLabel: "Unsupported on route",
      status: "unsupported",
      value: "Not ready"
    });

    const laneKind = getImpactLaneKind({ impact: result.impact, lowerBoundImpact: result.lowerBoundImpact });
    expect(laneKind).toBe("open_web_supported_band_similarity");
    expect(getImpactLanePillLabel(laneKind)).toBe("Open-web similarity live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Open-web steel supported-band similarity");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("UBIQ FL-24/FL-26");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact.basis,
      provenance: result.impact.confidence.provenance
    })).toBe("Open-web steel supported-band similarity");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toEqual([
      ["Ln,w", "Open-web steel supported-band similarity"],
      ["CI", "Open-web steel supported-band similarity"],
      ["Ln,w+CI", "Open-web steel supported-band similarity"]
    ]);
    expect(basisRows[0]?.description).toContain("UBIQ FL-24/FL-26 open-web steel supported-band");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Open-web steel supported-band similarity",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("UBIQ FL-24/FL-26");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "family_specific_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain("Open-web steel supported-band similarity");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: "Open-web steel supported-band similarity"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating an open-web supported-band steel floor.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: [cards["Rw"], cards["Ln,w"], cards["CI"], cards["Ln,w+CI"]],
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole ?? "floor_role",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "7 live rows feed the open-web supported-band floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Open-web steel supported-band similarity"
    });
    expect(impactTraceGroup?.detail).toContain("90% fit");
    expect(impactTraceGroup?.notes).toContain(
      "Open-web steel supported-band similarity stayed inside the UBIQ FL-24/FL-26 elastic suspended-ceiling source grid."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Open-web steel supported-band similarity");
    expect(report).toContain("- Impact basis: Open-web steel supported-band similarity");
    expect(report).toContain("- Impact Ln,w: 53.5 dB");
    expect(report).toContain("- Impact CI: -1.5 dB");
    expect(report).toContain("- Impact Ln,w+CI: 52.0 dB");
    expect(report).toContain("- Estimated family: lightweight steel");
    expect(report).toContain("- Estimated Rw: 61.5 dB");
    expect(report).toContain("- Estimated Ln,w+CI: 52.0 dB");
    expect(report).toContain("- Companion Rw: 61.5 dB");
    expect(report).toContain(`- Basis: ${OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS}`);
    expect(report).toContain("- Implemented family estimate: yes");
  });

  it("keeps local saved replay and server snapshot replay on the same supported-band basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.rows.map((row) => row.materialId)).toEqual(OPEN_WEB_ROWS.map((row) => row.materialId));

    const savedScenario = buildScenario({
      id: "open-web-supported-band-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectOpenWebSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.requestedOutputs).toEqual([...TARGET_OUTPUTS]);

    const serverScenario = buildScenario({
      id: "open-web-supported-band-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectOpenWebSurfaceResult(serverScenario.result);
  });

  it("keeps calculator and impact-only API payloads on the same lab values and non-lab boundaries", async () => {
    const layers = toLayerInputs(OPEN_WEB_ROWS);
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
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
    expectOpenWebSurfaceResult(estimateBody.result);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectOpenWebSurfaceResult(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
