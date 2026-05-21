import type {
  AirborneContext,
  AssemblyCalculation,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  getLayerCombinationResolverCandidateReportLines,
  getLayerCombinationResolverCandidateSurface
} from "./layer-combination-resolver-candidate-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { buildWorkbenchWallTopology } from "./simple-workbench-wall-topology";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const HELPER_ONLY_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";
const SELECTED_CANDIDATE_ID = "floor.helper_only_timber_open_web.source_absent";
const SINGLE_LEAF_BASIS = "layer_combination_resolver_single_leaf_mass_law_banded_source_absent_formula_corridor";
const SINGLE_LEAF_SELECTED_CANDIDATE_ID =
  "candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver";
const DOUBLE_LEAF_BASIS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor";
const DOUBLE_LEAF_SELECTED_CANDIDATE_ID =
  "candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver";
const TARGET_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const SINGLE_LEAF_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const DOUBLE_LEAF_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const HELPER_ONLY_OPEN_WEB_ROWS: readonly LayerDraft[] = [
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "base_structure", id: "open-web", materialId: "open_web_steel_floor", thicknessMm: "250" }
];

const SINGLE_LEAF_GYPSUM_ROWS: readonly LayerDraft[] = [
  { id: "single-leaf-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DOUBLE_LEAF_ROWS: readonly LayerDraft[] = [
  { id: "double-leaf-side-a", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "double-leaf-cavity", materialId: "rockwool", thicknessMm: "90" },
  { id: "double-leaf-side-b", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DOUBLE_LEAF_RESILIENT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

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
  studyMode?: "floor" | "wall";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    calculator: "dynamic",
    id: input.id ?? "resolver-candidate-surface",
    name: "Resolver candidate surface",
    rows: input.rows ?? HELPER_ONLY_OPEN_WEB_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-21T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: input.studyMode ?? "floor",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Resolver candidate surface scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildSingleLeafWallScenario(): EvaluatedScenario & { result: AssemblyCalculation } {
  return buildScenario({
    id: "single-leaf-resolver-candidate-surface",
    rows: SINGLE_LEAF_GYPSUM_ROWS,
    studyMode: "wall",
    targetOutputs: SINGLE_LEAF_TARGET_OUTPUTS
  });
}

function buildDoubleLeafWallScenario(input: {
  airborneContext?: AirborneContext;
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? DOUBLE_LEAF_RESILIENT_CONTEXT,
    calculator: "dynamic",
    id: input.id ?? "double-leaf-resolver-candidate-surface",
    name: "Double-leaf resolver candidate surface",
    rows: input.rows ?? DOUBLE_LEAF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-21T11:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? DOUBLE_LEAF_TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Double-leaf resolver candidate surface scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function expectResolverCandidate(result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined): void {
  const trace = getLayerCombinationResolverCandidateSurface(result);

  expect(trace).toMatchObject({
    boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
    candidateKind: "source_absent_family_solver",
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "floor",
    runtimeBasisId: HELPER_ONLY_BASIS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate"
  });
  expect(trace?.surfaceDetail).toContain(SELECTED_CANDIDATE_ID);
  expect(result?.impact).toMatchObject({
    CI50_2500: 4,
    LnW: 59.6,
    basis: HELPER_ONLY_BASIS
  });
  expect(result?.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC"]);
}

function expectDoubleLeafResolverCandidate(result: AssemblyCalculation | null | undefined): void {
  const trace = getLayerCombinationResolverCandidateSurface(result);

  expect(trace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["Rw", "C", "Ctr", "STC"],
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: DOUBLE_LEAF_BASIS,
    selectedCandidateId: DOUBLE_LEAF_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: 46 },
      { metric: "STC", value: 46 },
      { metric: "C", value: -1.1 },
      { metric: "Ctr", value: -6.2 }
    ])
  });
  expect(trace?.surfaceDetail).toContain("scenario-specific");
  expect(result?.metrics).toMatchObject({
    estimatedCDb: -1.1,
    estimatedCtrDb: -6.2,
    estimatedRwDb: 46,
    estimatedStc: 46
  });
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
    projectName: "Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "floor",
    targetLnwDb: "60",
    targetRwDb: "47"
  });
}

function buildSingleLeafReport(scenario: EvaluatedScenario): string {
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
    projectName: "Single Leaf Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: SINGLE_LEAF_TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "35"
  });
}

function buildDoubleLeafReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Double Leaf Resolver Candidate Surface",
    reportProfile: "consultant",
    requestedOutputs: DOUBLE_LEAF_TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
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
    throw new Error("Expected the workbench store to save the resolver candidate snapshot.");
  }

  return savedSnapshot;
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildDoubleLeafContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(snapshot, snapshot.rows.length);
  if (!wallTopology) {
    throw new Error("Expected a saved double-leaf wall topology.");
  }

  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode,
    wallTopology
  };
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);

  if (snapshot.airborneConnectionType !== "auto") {
    context.connectionType = snapshot.airborneConnectionType;
  }
  if (snapshot.airborneResilientBarSideCount) {
    context.resilientBarSideCount = snapshot.airborneResilientBarSideCount;
  }
  if (typeof studSpacingMm === "number") {
    context.studSpacingMm = studSpacingMm;
  }

  return context;
}

async function saveDoubleLeafScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(DOUBLE_LEAF_ROWS));
  store.setRequestedOutputs([...DOUBLE_LEAF_TARGET_OUTPUTS]);
  store.setAirborneConnectionType("resilient_channel");
  store.setAirborneResilientBarSideCount("both_sides");
  store.setAirborneStudSpacingMm("600");
  store.setAirborneWallTopologyMode("double_leaf_framed");
  store.setAirborneWallSideALeafLayerIndices("1");
  store.setAirborneWallCavity1LayerIndices("2");
  store.setAirborneWallCavity1DepthMm("75");
  store.setAirborneWallCavity1FillCoverage("full");
  store.setAirborneWallCavity1AbsorptionClass("porous_absorptive");
  store.setAirborneWallSideBLeafLayerIndices("3");
  store.setAirborneWallSupportTopology("resilient_channel");
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the double-leaf snapshot.");
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

describe("layer combination resolver candidate surface parity", () => {
  it("shows the candidate trace on the workbench result and Markdown report", () => {
    const scenario = buildScenario();

    expectResolverCandidate(scenario.result);
    expect(getLayerCombinationResolverCandidateReportLines(scenario.result)).toEqual(
      expect.arrayContaining([
        `- Resolver candidate id: ${SELECTED_CANDIDATE_ID}`,
        "- Resolver candidate kind: source_absent_family_solver",
        "- Resolver support bucket: source_absent_estimate",
        "- Resolver route / basis: floor / element_lab",
        `- Resolver runtime basis: ${HELPER_ONLY_BASIS}`,
        "- Resolver boundary candidates: generic.astm_iic_aiic.unsupported_boundary"
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${SELECTED_CANDIDATE_ID}`);
    expect(report).toContain("- Resolver candidate kind: source_absent_family_solver");
    expect(report).toContain("- Resolver support bucket: source_absent_estimate");
    expect(report).toContain(`- Resolver runtime basis: ${HELPER_ONLY_BASIS}`);
    expect(report).toContain("- Resolver boundary candidates: generic.astm_iic_aiic.unsupported_boundary");
    expect(report).toContain("- Resolver value pins: Rw 46.7, Ln,w 59.6, CI,50-2500 4");
  });

  it("keeps local saved replay and server snapshot replay on the same candidate trace", async () => {
    const savedSnapshot = await saveCompleteScenario();
    const savedScenario = buildScenario({
      id: "resolver-candidate-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });

    expectResolverCandidate(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = buildScenario({
      id: "resolver-candidate-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectResolverCandidate(serverScenario.result);
  });

  it("keeps calculator and impact-only API payloads on the same candidate trace", async () => {
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
    expectResolverCandidate(estimateBody.result);

    const impactResponse = await impactOnly(
      jsonRequest("http://localhost/api/impact-only", {
        layers,
        sourceLayers: layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const impactBody = (await impactResponse.json()) as {
      ok?: boolean;
      result?: ImpactOnlyCalculation;
    };

    expect(impactResponse.status).toBe(200);
    expect(impactBody.ok).toBe(true);
    expectResolverCandidate(impactBody.result);
    expect(impactBody.result?.impact?.LPrimeNW).toBeUndefined();
    expect(impactBody.result?.impact?.LPrimeNTw).toBeUndefined();
  });

  it("shows the single-leaf wall mass-law candidate on workbench, report, and calculator API surfaces", async () => {
    const scenario = buildSingleLeafWallScenario();
    const trace = getLayerCombinationResolverCandidateSurface(scenario.result);

    expect(trace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: ["Rw", "STC"],
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: SINGLE_LEAF_BASIS,
      selectedCandidateId: SINGLE_LEAF_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ])
    });
    expect(scenario.result.metrics).toMatchObject({
      estimatedRwDb: 31,
      estimatedStc: 31
    });

    const report = buildSingleLeafReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${SINGLE_LEAF_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${SINGLE_LEAF_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver value pins: Rw 31, STC 31");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: toLayerInputs(SINGLE_LEAF_GYPSUM_ROWS),
        targetOutputs: SINGLE_LEAF_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expect(getLayerCombinationResolverCandidateSurface(estimateBody.result)).toMatchObject({
      runtimeBasisId: SINGLE_LEAF_BASIS,
      selectedCandidateId: SINGLE_LEAF_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([{ metric: "Rw", value: 31 }])
    });
  });

  it("shows the double-leaf framed wall candidate on workbench, report, saved replay, server replay, and calculator API surfaces", async () => {
    const scenario = buildDoubleLeafWallScenario();
    expectDoubleLeafResolverCandidate(scenario.result);

    const report = buildDoubleLeafReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${DOUBLE_LEAF_SELECTED_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${DOUBLE_LEAF_BASIS}`);
    expect(report).toContain("- Resolver route / basis: wall / element_lab");
    expect(report).toContain("- Resolver value pins: Rw 46, STC 46, C -1.1, Ctr -6.2");

    const savedSnapshot = await saveDoubleLeafScenario();
    expect(savedSnapshot.airborneWallTopologyMode).toBe("double_leaf_framed");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("75");
    expect(savedSnapshot.airborneResilientBarSideCount).toBe("both_sides");

    const savedScenario = buildDoubleLeafWallScenario({
      airborneContext: buildDoubleLeafContextFromSnapshot(savedSnapshot),
      id: "double-leaf-resolver-candidate-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectDoubleLeafResolverCandidate(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneWallTopologyMode).toBe("double_leaf_framed");

    const serverScenario = buildDoubleLeafWallScenario({
      airborneContext: buildDoubleLeafContextFromSnapshot(parsedServerSnapshot!),
      id: "double-leaf-resolver-candidate-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? DOUBLE_LEAF_TARGET_OUTPUTS
    });
    expectDoubleLeafResolverCandidate(serverScenario.result);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const estimateResponse = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: DOUBLE_LEAF_RESILIENT_CONTEXT,
        calculator: "dynamic",
        layers: toLayerInputs(DOUBLE_LEAF_ROWS),
        targetOutputs: DOUBLE_LEAF_TARGET_OUTPUTS
      })
    );
    const estimateBody = (await estimateResponse.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(estimateResponse.status).toBe(200);
    expect(estimateBody.ok).toBe(true);
    expectDoubleLeafResolverCandidate(estimateBody.result);
  });
});
