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
  OPEN_BOX_TIMBER_SIMILARITY_BASIS,
  isOpenBoxTimberSimilarityResult
} from "./open-box-timber-similarity-surface";
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
const TARGET_OUTPUTS = ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "IIC"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const OPEN_BOX_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", id: "lower-fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", id: "lower-cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", id: "finish", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", id: "upper-fill", materialId: "generic_fill", thicknessMm: "32" },
  { floorRole: "floating_screed", id: "dry-floor", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "45" },
  { floorRole: "base_structure", id: "open-box", materialId: "open_box_timber_slab", thicknessMm: "370" }
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
    id: input.id ?? "open-box-timber-similarity-surface",
    name: "Open-box timber similarity surface parity",
    rows: input.rows ?? OPEN_BOX_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-19T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Open-box timber similarity scenario did not evaluate.");
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

function expectOpenBoxSurfaceResult(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.impact).toMatchObject({
    CI: 1.3,
    CI50_2500: 3.3,
    LnW: 50.8,
    LnWPlusCI: 52,
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    labOrField: "lab"
  });
  expect(result?.floorSystemRatings).toMatchObject({
    Rw: 66,
    RwCtr: 62.1,
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 4,
    detectedSupportFamilyLabel: "open box timber",
    fitPercent: 85,
    impactBasisLabel: "Open-box timber package-transfer corridor",
    selectedLabel: "Open-box timber package-transfer corridor",
    selectionKindLabel: "Published family estimate"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(isOpenBoxTimberSimilarityResult(result)).toBe(true);
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
    projectName: "Open Box Timber Similarity",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "52",
    targetRwDb: "65"
  });
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(OPEN_BOX_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the open-box timber snapshot.");
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

describe("open-box timber similarity surface parity", () => {
  it("shows the same package-transfer basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectOpenBoxSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Open-box timber package transfer",
      status: "live",
      value: "66 dB"
    });
    expect(cards.Rw.detail).toContain("Open-box timber package-transfer corridor");
    expect(cards.Rw.detail).toContain("TUAS measured open-box timber");

    expect(cards.C).toMatchObject({
      postureLabel: "Open-box timber package transfer",
      status: "live",
      value: "-3.9 dB"
    });
    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: "Open-box timber package transfer",
      status: "live",
      value: "50.8 dB"
    });
    expect(cards.CI).toMatchObject({
      postureLabel: "Open-box timber package transfer",
      status: "live",
      value: "+1.3 dB"
    });
    expect(cards["CI,50-2500"]).toMatchObject({
      postureLabel: "Open-box timber package transfer",
      status: "live",
      value: "+3.3 dB"
    });
    expect(cards["Ln,w+CI"]).toMatchObject({
      postureLabel: "Open-box timber package transfer",
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
    expect(laneKind).toBe("open_box_timber_similarity");
    expect(getImpactLanePillLabel(laneKind)).toBe("Open-box timber live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Open-box timber package-transfer corridor");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("TUAS measured open-box timber packet family");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact.basis,
      provenance: result.impact.confidence.provenance
    })).toBe("Open-box timber package-transfer corridor");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toEqual([
      ["Ln,w", "Open-box timber package-transfer corridor"],
      ["CI", "Open-box timber package-transfer corridor"],
      ["CI,50-2500", "Open-box timber package-transfer corridor"],
      ["Ln,w+CI", "Open-box timber package-transfer corridor"]
    ]);
    expect(basisRows[0]?.description).toContain("TUAS measured open-box timber package-transfer lane");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Open-box timber package-transfer corridor",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("same-family TUAS measured open-box timber packets");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "family_specific_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain("Open-box timber package-transfer corridor");
    expect(corridorDossier.headline).toContain("Source-absent open-box timber package-transfer budgets");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: "Open-box timber package-transfer corridor"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Ln,w error budget")).toMatchObject({
      detail: expect.stringContaining("open-box timber package-transfer budget"),
      value: "+/-7.0 dB"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating an open-box timber floor.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: [cards.Rw, cards.C, cards["Ln,w"], cards.CI, cards["CI,50-2500"], cards["Ln,w+CI"]],
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole ?? "floor_role",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "9 live rows feed the open-box timber floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Open-box timber package-transfer corridor"
    });
    expect(impactTraceGroup?.detail).toContain("85% fit");
    expect(impactTraceGroup?.notes).toContain(
      "Open-box timber package-transfer corridor stayed inside the TUAS measured open-box timber packet family."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Open-box timber package-transfer corridor");
    expect(report).toContain("- Impact basis: Open-box timber package-transfer corridor");
    expect(report).toContain("- Impact Ln,w: 50.8 dB");
    expect(report).toContain("- Impact CI: +1.3 dB");
    expect(report).toContain("- Impact CI,50-2500: +3.3 dB");
    expect(report).toContain("- Impact Ln,w+CI: 52.0 dB");
    expect(report).toContain("- Impact error budget Ln,w: 50.8 dB, range 43.8-57.8 dB, tolerance +/-7.0 dB");
    expect(report).toContain("- Estimated family: open-box timber");
    expect(report).toContain("- Estimated Rw: 66.0 dB");
    expect(report).toContain("- Estimated Ln,w+CI: 52.0 dB");
    expect(report).toContain("- Companion Rw: 66.0 dB");
    expect(report).toContain(`- Basis: ${OPEN_BOX_TIMBER_SIMILARITY_BASIS}`);
    expect(report).toContain("- Implemented family estimate: yes");
  });

  it("keeps local saved replay and server snapshot replay on the same open-box timber basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.rows.map((row) => row.materialId)).toEqual(OPEN_BOX_ROWS.map((row) => row.materialId));

    const savedScenario = buildScenario({
      id: "open-box-timber-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectOpenBoxSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.requestedOutputs).toEqual([...TARGET_OUTPUTS]);

    const serverScenario = buildScenario({
      id: "open-box-timber-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectOpenBoxSurfaceResult(serverScenario.result);
  });

  it("keeps calculator and impact-only API payloads on the same lab values and non-lab boundaries", async () => {
    const layers = toLayerInputs(OPEN_BOX_ROWS);
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
    expectOpenBoxSurfaceResult(estimateBody.result);

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
    expectOpenBoxSurfaceResult(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
