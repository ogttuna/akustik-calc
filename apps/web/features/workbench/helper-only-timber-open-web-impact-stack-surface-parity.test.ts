import type { AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
  isHelperOnlyTimberOpenWebImpactStackResult
} from "./helper-only-timber-open-web-impact-stack-surface";
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
const EXPECTED_HELPER_ONLY_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";
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

const HELPER_ONLY_OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "base_structure", id: "open-web", materialId: "open_web_steel_floor", thicknessMm: "250" }
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
    id: input.id ?? "helper-only-open-web-surface",
    name: "Helper-only open-web surface parity",
    rows: input.rows ?? HELPER_ONLY_OPEN_WEB_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-21T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Helper-only open-web scenario did not evaluate.");
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

function expectHelperOnlySurfaceResult(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.impact).toMatchObject({
    CI: 1,
    CI50_2500: 4,
    LnW: 59.6,
    LnWPlusCI: 60.6,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    labOrField: "lab"
  });
  expect(result?.floorSystemRatings).toMatchObject({
    C: -1.7,
    Ctr: -7.9,
    Rw: 46.7,
    RwCtr: 45,
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  });
  expect(result?.floorSystemEstimate).toMatchObject({
    kind: "family_archetype",
    structuralFamily: "open-web steel helper-only lower treatment"
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    fitPercent: 100,
    impactBasisLabel: "Helper-only timber/open-web formula corridor",
    selectedLabel: "Helper-only timber/open-web formula corridor",
    selectionKindLabel: "Scoped formula estimate",
    systemTypeLabel: "Suspended ceiling only"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(isHelperOnlyTimberOpenWebImpactStackResult(result)).toBe(true);
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
    projectName: "Helper Only Open Web",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "60",
    targetRwDb: "47"
  });
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("floor");
  store.clearRows();
  store.appendRows(withoutIds(HELPER_ONLY_OPEN_WEB_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the helper-only open-web snapshot.");
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

describe("helper-only timber/open-web impact stack surface parity", () => {
  it("shows the same helper-only formula basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expect(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS).toBe(EXPECTED_HELPER_ONLY_BASIS);
    expectHelperOnlySurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "46.7 dB"
    });
    expect(cards.Rw.detail).toContain("Helper-only timber/open-web formula corridor");
    expect(cards.Rw.detail).toContain("raw-bare");
    expect(cards.Rw.detail).toContain("field, building, ASTM, and IIC");

    expect(cards.C).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "-1.7 dB"
    });
    expect(cards.Ctr).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "-7.9 dB"
    });
    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "59.6 dB"
    });
    expect(cards.CI).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "+1 dB"
    });
    expect(cards["CI,50-2500"]).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "+4 dB"
    });
    expect(cards["Ln,w+CI"]).toMatchObject({
      postureLabel: "Helper-only formula",
      status: "live",
      value: "60.6 dB"
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
    expect(laneKind).toBe("helper_only_timber_open_web_impact_stack");
    expect(getImpactLanePillLabel(laneKind)).toBe("Helper-only live");
    expect(getImpactLaneHeadline(laneKind)).toBe("Helper-only timber/open-web formula corridor");
    expect(getImpactLaneNarrative(laneKind, false)).toContain("source-absent helper-only timber/open-web");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact.basis,
      provenance: result.impact.confidence.provenance
    })).toBe("Helper-only timber/open-web formula corridor");

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toEqual([
      ["Ln,w", "Helper-only timber/open-web formula corridor"],
      ["CI", "Helper-only timber/open-web formula corridor"],
      ["CI,50-2500", "Helper-only timber/open-web formula corridor"],
      ["Ln,w+CI", "Helper-only timber/open-web formula corridor"]
    ]);
    expect(basisRows[0]?.description).toContain("source-absent helper-only timber/open-web lower-treatment formula lane");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Helper-only timber/open-web formula corridor",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("source-absent helper-only timber/open-web");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "formula_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain("Helper-only timber/open-web formula corridor");
    expect(corridorDossier.headline).toContain("Source-absent helper-only timber/open-web lower-treatment budgets");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: "Helper-only timber/open-web formula corridor"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Rw error budget")).toMatchObject({
      detail: expect.stringContaining("helper-only timber/open-web formula budget"),
      value: "+/-9.0 dB"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Ln,w error budget")).toMatchObject({
      detail: expect.stringContaining("helper-only timber/open-web formula budget"),
      value: "+/-10.0 dB"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a helper-only open-web lower-treatment floor.",
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
      stackDetail: "5 live rows feed the helper-only open-web lower-treatment route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: "Helper-only timber/open-web formula corridor"
    });
    expect(impactTraceGroup?.detail).toContain("100% fit");
    expect(
      impactTraceGroup?.notes.some((note) =>
        /helper-only timber\/open-web/i.test(note)
      )
    ).toBe(true);

    const report = buildReport(scenario);
    expect(report).toContain("- Impact lane: Helper-only timber/open-web formula corridor");
    expect(report).toContain("- Impact basis: Helper-only timber/open-web formula corridor");
    expect(report).toContain("- Impact Ln,w: 59.6 dB");
    expect(report).toContain("- Impact CI: +1.0 dB");
    expect(report).toContain("- Impact CI,50-2500: +4.0 dB");
    expect(report).toContain("- Impact Ln,w+CI: 60.6 dB");
    expect(report).toContain("- Impact error budget Rw: 46.7 dB, range 37.7-55.7 dB, tolerance +/-9.0 dB");
    expect(report).toContain("- Impact error budget Ln,w: 59.6 dB, range 49.6-69.6 dB, tolerance +/-10.0 dB");
    expect(report).toContain("- Estimated family: open-web steel helper-only lower treatment");
    expect(report).toContain("- Estimated Rw: 46.7 dB");
    expect(report).toContain("- Estimated Ln,w+CI: 60.6 dB");
    expect(report).toContain("- Companion Rw: 46.7 dB");
    expect(report).toContain(`- Companion basis: ${HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS}`);
    expect(report).toContain("- Implemented formula estimate: yes");
  });

  it("keeps local saved replay and server snapshot replay on the same helper-only formula basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.rows.map((row) => row.materialId)).toEqual(
      HELPER_ONLY_OPEN_WEB_ROWS.map((row) => row.materialId)
    );

    const savedScenario = buildScenario({
      id: "helper-only-open-web-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectHelperOnlySurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.requestedOutputs).toEqual([...TARGET_OUTPUTS]);

    const serverScenario = buildScenario({
      id: "helper-only-open-web-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectHelperOnlySurfaceResult(serverScenario.result);
  });

  it("keeps calculator and impact-only API payloads on the same lab values and non-lab boundaries", async () => {
    const layers = toLayerInputs(HELPER_ONLY_OPEN_WEB_ROWS);
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const { POST: impactOnly } = await import("../../app/api/impact-only/route");

    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
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
    expectHelperOnlySurfaceResult(estimateBody.result);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        layers,
        sourceLayers: layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectHelperOnlySurfaceResult(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
