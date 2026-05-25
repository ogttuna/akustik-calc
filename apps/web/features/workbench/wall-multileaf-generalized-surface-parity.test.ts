import type {
  AirborneContext,
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { getLayerCombinationResolverCandidateSurface } from "./layer-combination-resolver-candidate-surface";
import { getPresetById } from "./preset-definitions";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const RUNTIME_BASIS = "triple_leaf_two_cavity_frequency_solver";
const SELECTED_RESOLVER_CANDIDATE_ID =
  "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver";
const NEEDS_INPUT_CANDIDATE_ID = "generic.required_input_owner.needs_input_boundary";
const FIELD_MISSING_INPUTS = [
  "contextMode",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S"
] as const;

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

let originalEnv: Record<string, string | undefined>;

const GROUPED_ROCKWOOL_ROWS: readonly LayerDraft[] = [
  { id: "generalized-side-a-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generalized-cavity-1", materialId: "rockwool", thicknessMm: "50" },
  { id: "generalized-internal-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "generalized-cavity-2", materialId: "rockwool", thicknessMm: "50" },
  { id: "generalized-side-b-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const GROUPED_ROCKWOOL_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "50",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "2",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "50",
  airborneWallCavity2FillCoverage: "full",
  airborneWallCavity2LayerIndices: "4",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "3",
  airborneWallSideALeafLayerIndices: "1",
  airborneWallSideBLeafLayerIndices: "5",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
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

function buildContext(
  draft: WorkbenchWallTopologyDraft = GROUPED_ROCKWOOL_TOPOLOGY_DRAFT,
  layerCount = GROUPED_ROCKWOOL_ROWS.length
): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(draft, layerCount);

  if (!wallTopology) {
    throw new Error("Expected complete generalized grouped triple-leaf topology.");
  }

  return {
    contextMode: "element_lab",
    wallTopology
  };
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm.replace(",", "."))
  }));
}

function buildScenario(input: {
  airborneContext?: AirborneContext;
  id?: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext ?? buildContext(),
    calculator: "dynamic",
    id: input.id ?? "wall-multileaf-generalized-current",
    name: "Wall multileaf generalized surface parity",
    rows: input.rows ?? GROUPED_ROCKWOOL_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-25T12:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Wall multileaf generalized scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): Record<TargetOutput, OutputCardModel> {
  return Object.fromEntries(
    TARGET_OUTPUTS.map((output) => [
      output,
      addOutputCardPosture(buildOutputCard({ output, result, studyMode: "wall" }), {
        result,
        studyMode: "wall"
      })
    ])
  ) as Record<TargetOutput, OutputCardModel>;
}

function expectGeneralizedSurfaceResult(
  result: AssemblyCalculation | null | undefined
): asserts result is AssemblyCalculation {
  expect(result?.metrics).toMatchObject({
    estimatedCDb: -0.7,
    estimatedCtrDb: -7.7,
    estimatedRwDb: 43,
    estimatedStc: 43
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  expect(result?.acousticAnswerBoundary).toMatchObject({
    missingPhysicalInputs: [...FIELD_MISSING_INPUTS],
    origin: "needs_input",
    route: "wall",
    unsupportedOutputs: ["R'w", "DnT,w"]
  });
  expect(getLayerCombinationResolverCandidateSurface(result)).toMatchObject({
    boundaryCandidateIds: [NEEDS_INPUT_CANDIDATE_ID],
    candidateKind: "source_absent_family_solver",
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: RUNTIME_BASIS,
    selectedCandidateId: SELECTED_RESOLVER_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "STC", "C", "Ctr"],
    valuePins: [
      { metric: "Rw", value: 43 },
      { metric: "STC", value: 43 },
      { metric: "C", value: -0.7 },
      { metric: "Ctr", value: -7.7 }
    ]
  });
  expect(result?.layerCombinationResolverTrace?.requiredInputs).toEqual(
    expect.arrayContaining([...FIELD_MISSING_INPUTS])
  );
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("light_steel_stud_wall"),
    briefNote: "",
    clientName: "Post V1",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Wall Multileaf Generalized",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "43"
  });
}

type WorkbenchStoreApi = typeof import("./workbench-store").useWorkbenchStore;

function applyTopologyDraftToStore(store: WorkbenchStoreApi, draft: WorkbenchWallTopologyDraft): void {
  store.getState().setAirborneWallTopologyMode(draft.airborneWallTopologyMode);
  store.getState().setAirborneWallSideALeafLayerIndices(draft.airborneWallSideALeafLayerIndices);
  store.getState().setAirborneWallCavity1LayerIndices(draft.airborneWallCavity1LayerIndices);
  store.getState().setAirborneWallCavity1DepthMm(draft.airborneWallCavity1DepthMm);
  store.getState().setAirborneWallCavity1FillCoverage(draft.airborneWallCavity1FillCoverage);
  store.getState().setAirborneWallCavity1AbsorptionClass(draft.airborneWallCavity1AbsorptionClass);
  store.getState().setAirborneWallInternalLeafLayerIndices(draft.airborneWallInternalLeafLayerIndices);
  store.getState().setAirborneWallInternalLeafCoupling(draft.airborneWallInternalLeafCoupling);
  store.getState().setAirborneWallCavity2LayerIndices(draft.airborneWallCavity2LayerIndices);
  store.getState().setAirborneWallCavity2DepthMm(draft.airborneWallCavity2DepthMm);
  store.getState().setAirborneWallCavity2FillCoverage(draft.airborneWallCavity2FillCoverage);
  store.getState().setAirborneWallCavity2AbsorptionClass(draft.airborneWallCavity2AbsorptionClass);
  store.getState().setAirborneWallSideBLeafLayerIndices(draft.airborneWallSideBLeafLayerIndices);
  store.getState().setAirborneWallSupportTopology(draft.airborneWallSupportTopology);
}

async function saveCompleteScenario(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(GROUPED_ROCKWOOL_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  applyTopologyDraftToStore(useWorkbenchStore, GROUPED_ROCKWOOL_TOPOLOGY_DRAFT);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the generalized triple-leaf snapshot.");
  }

  return savedSnapshot;
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));
  vi.resetModules();
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

describe("wall multileaf generalized surface parity", () => {
  it("shows calculated lab outputs, guided topology status, and field missing inputs on the same resolver surface", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectGeneralizedSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Generalized multileaf formula",
      status: "live",
      value: "43 dB"
    });
    expect(cards.Rw.detail).toContain("generalized multileaf formula");
    expect(cards.Rw.detail).toContain("+/-5 dB source-absent error budget");
    expect(cards.STC).toMatchObject({
      postureLabel: "Generalized multileaf formula",
      status: "live",
      value: "43 dB"
    });
    expect(cards.C).toMatchObject({
      postureLabel: "Generalized multileaf formula",
      status: "live",
      value: "-0.7 dB"
    });
    expect(cards.Ctr).toMatchObject({
      postureLabel: "Generalized multileaf formula",
      status: "live",
      value: "-7.7 dB"
    });
    for (const output of ["R'w", "DnT,w"] as const) {
      expect(cards[output]).toMatchObject({
        postureLabel: "Awaiting field input",
        status: "needs_input",
        value: "Not ready"
      });
    }
    expect(cards["R'w"].detail).toContain("leaves lab mode");
    expect(cards["DnT,w"].detail).toContain("leaves lab mode");

    expect(getGuidedTopologyGap({
      result,
      rows: GROUPED_ROCKWOOL_ROWS,
      studyMode: "wall"
    })).toMatchObject({
      value: "Generalized multileaf formula"
    });

    const trace = getLayerCombinationResolverCandidateSurface(result);
    expect(trace?.surfaceDetail).toContain(SELECTED_RESOLVER_CANDIDATE_ID);
    expect(trace?.surfaceDetail).toContain("Stopped outputs: R'w, DnT,w");
    expect(trace?.surfaceDetail).toContain("Missing physical inputs: contextMode");

    const report = buildReport(scenario);
    expect(report).toContain(`- Resolver candidate id: ${SELECTED_RESOLVER_CANDIDATE_ID}`);
    expect(report).toContain(`- Resolver runtime basis: ${RUNTIME_BASIS}`);
    expect(report).toContain("- Resolver value pins: Rw 43, STC 43, C -0.7, Ctr -7.7");
    expect(report).toContain(`- Resolver boundary candidates: ${NEEDS_INPUT_CANDIDATE_ID}`);
    expect(report).toContain("Missing physical inputs: contextMode, partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S");
  });

  it("keeps local saved replay and server snapshot replay on the generalized resolver candidate", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.airborneWallTopologyMode).toBe("grouped_triple_leaf");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("50");

    const savedWallTopology = buildWorkbenchWallTopology(savedSnapshot, savedSnapshot.rows.length);
    if (!savedWallTopology) {
      throw new Error("Expected saved generalized wall topology to replay.");
    }
    const savedScenario = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: savedWallTopology
      },
      id: "wall-multileaf-generalized-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectGeneralizedSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneWallTopologyMode).toBe("grouped_triple_leaf");

    const serverWallTopology = buildWorkbenchWallTopology(
      parsedServerSnapshot!,
      parsedServerSnapshot?.rows.length ?? 0
    );
    if (!serverWallTopology) {
      throw new Error("Expected server generalized wall topology to replay.");
    }
    const serverScenario = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: serverWallTopology
      },
      id: "wall-multileaf-generalized-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectGeneralizedSurfaceResult(serverScenario.result);
  });

  it("keeps calculator API payloads on the generalized resolver candidate with field outputs parked", async () => {
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: buildContext(),
        calculator: "dynamic",
        layers: toLayerInputs(GROUPED_ROCKWOOL_ROWS),
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expectGeneralizedSurfaceResult(body.result);
  });
});
