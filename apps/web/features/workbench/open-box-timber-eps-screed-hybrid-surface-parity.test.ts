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
  OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS,
  OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL,
  isOpenBoxTimberEpsScreedHybridResult
} from "./open-box-timber-eps-screed-hybrid-surface";
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
  { floorRole: "ceiling_cavity", id: "family-a-cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: "45" },
  { floorRole: "ceiling_cavity", id: "resilient-cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", id: "finish", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", id: "eps-board", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
  { floorRole: "floating_screed", id: "separator", materialId: "geotextile", thicknessMm: "1" },
  { floorRole: "floating_screed", id: "screed", materialId: "screed", thicknessMm: "43" },
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
    id: input.id ?? "open-box-timber-eps-screed-hybrid-surface",
    name: "Open-box timber EPS/screed hybrid surface parity",
    rows: input.rows ?? OPEN_BOX_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-20T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Open-box timber EPS/screed hybrid scenario did not evaluate.");
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

function expectHybridSurfaceResult(result: AssemblyCalculation | null | undefined): asserts result is AssemblyCalculation {
  expect(result?.impact).toMatchObject({
    CI: 0,
    CI50_2500: 1,
    LnW: 47,
    LnWPlusCI: 47,
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS,
    labOrField: "lab"
  });
  expect(result?.floorSystemRatings).toMatchObject({
    C: -1.3,
    Rw: 72,
    RwCtr: 70.7,
    RwCtrSemantic: "rw_plus_c",
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS
  });
  expect(result?.dynamicImpactTrace).toMatchObject({
    candidateRowCount: 1,
    detectedSupportFamilyLabel: "open box timber",
    estimateTierLabel: "Archetype family",
    fitPercent: 95,
    selectedLabel: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL,
    selectionKindLabel: "Published family estimate",
    structuralSupportLabel: "Open-box timber",
    systemTypeLabel: "Dry floating floor"
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "IIC"]);
  expect(isOpenBoxTimberEpsScreedHybridResult(result)).toBe(true);
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
    projectName: "Open Box Timber EPS Screed",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "47",
    targetRwDb: "72"
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
    throw new Error("Expected the workbench store to save the EPS/screed open-box timber snapshot.");
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

describe("open-box timber EPS/screed hybrid surface parity", () => {
  it("shows the same EPS/screed basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectHybridSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "72 dB"
    });
    expect(cards.Rw.detail).toContain(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL);
    expect(cards.Rw.detail).toContain("source-absent");
    expect(cards.Rw.detail).toContain("Exact R7b still wins");

    expect(cards.C).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "-1.3 dB"
    });
    expect(cards["Ln,w"]).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "47 dB"
    });
    expect(cards.CI).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "+0 dB"
    });
    expect(cards["CI,50-2500"]).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "+1 dB"
    });
    expect(cards["Ln,w+CI"]).toMatchObject({
      postureLabel: "EPS/screed hybrid formula",
      status: "live",
      value: "47 dB"
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
    expect(laneKind).toBe("open_box_timber_eps_screed_hybrid");
    expect(getImpactLanePillLabel(laneKind)).toBe("EPS/screed open-box live");
    expect(getImpactLaneHeadline(laneKind)).toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL);
    expect(getImpactLaneNarrative(laneKind, false)).toContain("source-absent open-box timber EPS/screed hybrid package formula");

    expect(formatConfidenceProvenanceForImpact({
      basis: result.impact.basis,
      provenance: result.impact.confidence.provenance
    })).toBe(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL);

    const basisRows = getActiveImpactMetricBasisRows(result.impact);
    expect(basisRows.map((row) => [row.label, formatImpactMetricBasisLabel(row.basis)])).toEqual([
      ["Ln,w", OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL],
      ["CI", OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL],
      ["CI,50-2500", OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL],
      ["Ln,w+CI", OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL]
    ]);
    expect(basisRows[0]?.description).toContain("source-absent open-box timber EPS/screed hybrid package formula lane");

    const validationPosture = describeImpactValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL,
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("source-absent open-box timber EPS/screed hybrid package formula corridor");
    expect(getActiveValidationMode(result)).toMatchObject({
      id: "family_specific_estimate"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "floor");
    expect(corridorDossier.headline).toContain(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL);
    expect(corridorDossier.headline).toContain("Source-absent open-box timber EPS/screed hybrid package budgets");
    expect(corridorDossier.cards.find((card) => card.label === "Benchmark mode")).toMatchObject({
      value: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL
    });
    expect(corridorDossier.cards.find((card) => card.label === "Rw error budget")).toMatchObject({
      detail: expect.stringContaining("open-box timber EPS/screed hybrid package budget"),
      value: "+/-7.0 dB"
    });
    expect(corridorDossier.cards.find((card) => card.label === "Ln,w error budget")).toMatchObject({
      detail: expect.stringContaining("open-box timber EPS/screed hybrid package budget"),
      value: "+/-8.0 dB"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating an EPS/screed open-box timber floor.",
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
      stackDetail: "11 live rows feed the EPS/screed open-box timber floor route.",
      studyModeLabel: "Floor",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const impactTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Impact lane");
    expect(impactTraceGroup).toMatchObject({
      tone: "accent",
      value: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL
    });
    expect(impactTraceGroup?.detail).toContain("95% fit");
    expect(impactTraceGroup?.notes).toContain(
      "Open-box timber EPS/screed hybrid package formula corridor used R7b as a design anchor while keeping exact rows and dry package-transfer rows separate."
    );

    const report = buildReport(scenario);
    expect(report).toContain(`- Impact lane: ${OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL}`);
    expect(report).toContain("- Impact basis: broad accuracy floor open box timber eps screed hybrid package formula corridor");
    expect(report).toContain(`- Impact basis: ${OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS}`);
    expect(report).toContain("- Impact Ln,w: 47.0 dB");
    expect(report).toContain("- Impact CI: +0.0 dB");
    expect(report).toContain("- Impact CI,50-2500: +1.0 dB");
    expect(report).toContain("- Impact Ln,w+CI: 47.0 dB");
    expect(report).toContain("- Impact error budget Rw: 72.0 dB, range 65.0-79.0 dB, tolerance +/-7.0 dB");
    expect(report).toContain("- Impact error budget Ln,w: 47.0 dB, range 39.0-55.0 dB, tolerance +/-8.0 dB");
    expect(report).toContain("- Estimated family: open-box timber EPS/screed hybrid package");
    expect(report).toContain("- Estimated Rw: 72.0 dB");
    expect(report).toContain("- Estimated Ln,w+CI: 47.0 dB");
    expect(report).toContain("- Companion Rw: 72.0 dB");
    expect(report).toContain("- Companion Rw + C: 70.7 dB");
    expect(report).toContain(`- Companion basis: ${OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS}`);
    expect(report).toContain("- Implemented family estimate: yes");
    expect(report).toContain("- Implemented formula estimate: no");
  });

  it("keeps local saved replay and server snapshot replay on the same EPS/screed formula basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.rows.map((row) => row.materialId)).toEqual(OPEN_BOX_ROWS.map((row) => row.materialId));

    const savedScenario = buildScenario({
      id: "open-box-timber-eps-screed-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectHybridSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.requestedOutputs).toEqual([...TARGET_OUTPUTS]);

    const serverScenario = buildScenario({
      id: "open-box-timber-eps-screed-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectHybridSurfaceResult(serverScenario.result);
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
    expectHybridSurfaceResult(estimateBody.result);

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
    expectHybridSurfaceResult(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });
});
