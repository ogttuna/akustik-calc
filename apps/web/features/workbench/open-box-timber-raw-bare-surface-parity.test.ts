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
  OPEN_BOX_TIMBER_RAW_BARE_BASIS,
  isOpenBoxTimberRawBareResult
} from "./open-box-timber-raw-bare-surface";
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
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const OPEN_BOX_ROWS: readonly LayerDraft[] = [
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
    id: input.id ?? "open-box-timber-raw-bare-surface",
    name: "Open-box timber raw-bare surface parity",
    rows: input.rows ?? OPEN_BOX_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-20T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Open-box timber raw-bare scenario did not evaluate.");
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

function expectRawBareSurfaceResult(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.impact).toMatchObject({
    CI: -1.1,
    CI50_2500: 3.1,
    LnW: 88.2,
    LnWPlusCI: 87.1,
    basis: OPEN_BOX_TIMBER_RAW_BARE_BASIS,
    labOrField: "lab"
  });
  expect(result?.floorSystemRatings).toMatchObject({
    C: -1.4,
    Ctr: -5.8,
    Rw: 42.3,
    RwCtr: 40.9,
    basis: OPEN_BOX_TIMBER_RAW_BARE_BASIS
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 1,
    detectedSupportFamilyLabel: "open box timber",
    fitPercent: 100,
    impactBasisLabel: "Raw-bare open-box timber formula corridor",
    selectedLabel: "Raw-bare open-box timber formula corridor",
    selectionKindLabel: "Scoped formula estimate",
    structuralSupportLabel: "Open-box timber",
    systemTypeLabel: "Bare floor"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(isOpenBoxTimberRawBareResult(result)).toBe(true);
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
    projectName: "Open Box Timber Raw Bare",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "88",
    targetRwDb: "42"
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
    throw new Error("Expected the workbench store to save the raw-bare open-box timber snapshot.");
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

describe("open-box timber raw-bare surface parity", () => {
  it("shows the same source-absent formula basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectRawBareSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "42.3 dB"
    });
    expect(cards.Rw.detail).toContain("Raw-bare open-box timber formula corridor");
    expect(cards.Rw.detail).toContain("source-absent bare-carrier");
    expect(cards.Rw.detail).toContain("finished package-transfer");

    expect(cards.C).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "-1.4 dB"
    });
    expect(cards.Ctr).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "-5.8 dB"
    });
    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "88.2 dB"
    });
    expect(cards.CI).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "-1.1 dB"
    });
    expect(cards["CI,50-2500"]).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "+3.1 dB"
    });
    expect(cards["Ln,w+CI"]).toMatchObject({
      postureLabel: "Raw-bare open-box formula",
      status: "live",
      value: "87.1 dB"
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
    expect(laneKind).toBe("open_box_timber_raw_bare");
    expect(getImpactLanePillLabel(laneKind)).toBe("Raw-bare open-box live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Raw-bare open-box timber formula corridor");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("source-absent raw-bare open-box timber carrier formula");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact.basis,
      provenance: result.impact.confidence.provenance
    })).toBe("Raw-bare open-box timber formula corridor");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toEqual([
      ["Ln,w", "Raw-bare open-box timber formula corridor"],
      ["CI", "Raw-bare open-box timber formula corridor"],
      ["CI,50-2500", "Raw-bare open-box timber formula corridor"],
      ["Ln,w+CI", "Raw-bare open-box timber formula corridor"]
    ]);
    expect(basisRows[0]?.description).toContain("source-absent raw-bare open-box timber carrier formula lane");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Raw-bare open-box timber formula corridor",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("source-absent raw-bare open-box timber formula corridor");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "formula_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain("Raw-bare open-box timber formula corridor");
    expect(corridorDossier.headline).toContain("Source-absent raw-bare open-box timber formula budgets");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: "Raw-bare open-box timber formula corridor"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Rw error budget")).toMatchObject({
      detail: expect.stringContaining("raw-bare open-box timber formula budget"),
      value: "+/-8.0 dB"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Ln,w error budget")).toMatchObject({
      detail: expect.stringContaining("raw-bare open-box timber formula budget"),
      value: "+/-10.0 dB"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a raw-bare open-box timber floor.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: [cards.Rw, cards.C, cards.Ctr, cards["Ln,w"], cards.CI, cards["CI,50-2500"], cards["Ln,w+CI"]],
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: row.floorRole ?? "floor_role",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "1 live row feeds the raw-bare open-box timber floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Raw-bare open-box timber formula corridor"
    });
    expect(impactTraceGroup?.detail).toContain("100% fit");
    expect(impactTraceGroup?.notes).toContain(
      "Raw-bare open-box timber runtime is source-absent lab evidence for the bare carrier, not a TUAS finished package measurement."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Raw-bare open-box timber formula corridor");
    expect(report).toContain("- Impact basis: Raw-bare open-box timber formula corridor");
    expect(report).toContain("- Impact Ln,w: 88.2 dB");
    expect(report).toContain("- Impact CI: -1.1 dB");
    expect(report).toContain("- Impact CI,50-2500: +3.1 dB");
    expect(report).toContain("- Impact Ln,w+CI: 87.1 dB");
    expect(report).toContain("- Impact error budget Rw: 42.3 dB, range 34.3-50.3 dB, tolerance +/-8.0 dB");
    expect(report).toContain("- Impact error budget Ln,w: 88.2 dB, range 78.2-98.2 dB, tolerance +/-10.0 dB");
    expect(report).toContain("- Estimated family: open-box timber raw-bare");
    expect(report).toContain("- Estimated Rw: 42.3 dB");
    expect(report).toContain("- Companion Rw: 42.3 dB");
    expect(report).toContain(`- Companion basis: ${OPEN_BOX_TIMBER_RAW_BARE_BASIS}`);
    expect(report).toContain("- Implemented formula estimate: yes");
  });

  it("keeps local saved replay and server snapshot replay on the same raw-bare formula basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.rows.map((row) => row.materialId)).toEqual(OPEN_BOX_ROWS.map((row) => row.materialId));

    const savedScenario = buildScenario({
      id: "open-box-timber-raw-bare-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectRawBareSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.requestedOutputs).toEqual([...TARGET_OUTPUTS]);

    const serverScenario = buildScenario({
      id: "open-box-timber-raw-bare-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectRawBareSurfaceResult(serverScenario.result);
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
    expectRawBareSurfaceResult(estimateBody.result);

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
    expectRawBareSurfaceResult(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
