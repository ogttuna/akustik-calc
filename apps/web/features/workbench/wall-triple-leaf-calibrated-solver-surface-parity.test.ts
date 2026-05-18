import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
} from "@dynecho/engine";
import type {
  AirborneCandidate,
  AirborneContext,
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
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
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import { describeAirborneValidationPosture } from "./validation-regime";
import {
  getWallTripleLeafCalibratedSolverSurface,
  WEB_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  WEB_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
  WEB_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
} from "./wall-triple-leaf-calibrated-solver-surface";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

let originalEnv: Record<string, string | undefined>;

const NRC_ASSEMBLY_B_ROWS: readonly LayerDraft[] = [
  { id: "nrc-b-board-a", materialId: "nrc_type_c_gypsum_board", thicknessMm: "12.7" },
  { id: "nrc-b-cavity-a", materialId: "nrc_glass_fiber_batt", thicknessMm: "92.1" },
  { id: "nrc-b-internal-board", materialId: "nrc_type_c_gypsum_board", thicknessMm: "12.7" },
  { id: "nrc-b-cavity-b", materialId: "nrc_glass_fiber_batt", thicknessMm: "92.1" },
  { id: "nrc-b-board-b", materialId: "nrc_type_c_gypsum_board", thicknessMm: "12.7" }
];

const NRC_ASSEMBLY_B_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "92.1",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "2",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "92.1",
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
  draft: WorkbenchWallTopologyDraft = NRC_ASSEMBLY_B_TOPOLOGY_DRAFT,
  layerCount = NRC_ASSEMBLY_B_ROWS.length
): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(draft, layerCount);

  if (!wallTopology) {
    throw new Error("Expected complete NRC Assembly B grouped triple-leaf topology.");
  }

  return {
    airtightness: "good",
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
    id: input.id ?? "wall-triple-leaf-calibrated-current",
    name: "Wall triple-leaf calibrated solver surface parity",
    rows: input.rows ?? NRC_ASSEMBLY_B_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-18T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Wall triple-leaf calibrated scenario did not evaluate.");
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

function expectCalibratedSurfaceResult(
  result: AssemblyCalculation | null | undefined
): asserts result is AssemblyCalculation {
  expect(result?.metrics).toMatchObject({
    estimatedCDb: 1.4,
    estimatedCtrDb: -7.4,
    estimatedRwDb: 49,
    estimatedStc: 60
  });
  const calibratedCandidate = result?.airborneCandidateResolution?.candidates.find(
    (candidate: AirborneCandidate) =>
      candidate.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
  );
  expect(calibratedCandidate).toMatchObject({
    basis: {
      errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      origin: "calibrated_family_physics",
      toleranceClass: "calibrated_prediction"
    },
    id: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
    origin: "calibrated_family_physics"
  });
  expect(getWallTripleLeafCalibratedSolverSurface(result)).toMatchObject({
    budgetLabel: "+/-4 dB",
    candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
    label: "Wall triple-leaf calibrated solver",
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
    origin: "calibrated_family_physics",
    warning: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  expect(result?.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING);
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("light_steel_stud_wall"),
    briefNote: "",
    clientName: "Broad Accuracy",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Wall Triple Leaf Calibrated Solver",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "50"
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
  store.appendRows(withoutIds(NRC_ASSEMBLY_B_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  applyTopologyDraftToStore(useWorkbenchStore, NRC_ASSEMBLY_B_TOPOLOGY_DRAFT);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the calibrated triple-leaf snapshot.");
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

describe("wall triple-leaf calibrated solver surface parity", () => {
  it("keeps web calibrated-solver identifiers aligned with the engine lane", () => {
    expect(WEB_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD
    );
    expect(WEB_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );
    expect(WEB_WALL_TRIPLE_LEAF_CALIBRATED_WARNING).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
    );
  });

  it("shows the same calibrated basis on route labels, cards, dossiers, and Markdown report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectCalibratedSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Wall triple-leaf calibrated solver",
      postureTone: "success",
      status: "live",
      value: "49 dB"
    });
    expect(cards.Rw.detail).toContain("NRC 2024 Type C/glass-fiber");
    expect(cards.Rw.detail).toContain("+/-4 dB");
    expect(cards.STC).toMatchObject({
      postureLabel: "Wall triple-leaf calibrated solver",
      status: "live",
      value: "60 dB"
    });
    expect(cards.C).toMatchObject({
      postureLabel: "Wall triple-leaf calibrated solver",
      status: "live",
      value: "+1.4 dB"
    });
    expect(cards.Ctr).toMatchObject({
      postureLabel: "Wall triple-leaf calibrated solver",
      status: "live",
      value: "-7.4 dB"
    });
    expect(cards["R'w"]).toMatchObject({
      postureLabel: "Awaiting field input",
      status: "needs_input",
      value: "Not ready"
    });
    expect(cards["R'w"].detail).toContain("parked");
    expect(cards["DnT,w"]).toMatchObject({
      postureLabel: "Awaiting field input",
      status: "needs_input",
      value: "Not ready"
    });
    expect(cards["DnT,w"].detail).toContain("parked");

    const validationPosture = describeAirborneValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Wall triple-leaf calibrated solver",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("not an exact product row");

    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    expect(branch).toMatchObject({
      tone: "ready",
      value: "Wall triple-leaf calibrated solver"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    expect(corridorDossier.headline).toContain("Wall triple-leaf calibrated solver");
    expect(corridorDossier.cards.find((card) => card.label === "Airborne lane")).toMatchObject({
      value: "Wall triple-leaf calibrated solver"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating an NRC 2024 grouped triple-leaf wall.",
      branchLabel: "Dynamic Calculator",
      contextLabel: "Element lab",
      coverageItems: Object.values(cards),
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        roleLabel: "wall_layer",
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "5 live rows feed the calibrated triple-leaf wall route.",
      studyModeLabel: "Wall",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup).toMatchObject({
      tone: "success",
      value: "Wall triple-leaf calibrated solver"
    });
    expect(airborneTraceGroup?.notes).toContain(
      "NRC 2024 Type C/glass-fiber triple-leaf calibrated solver selected candidate_broad_accuracy_nrc2024_triple_leaf_calibrated."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Airborne posture: Wall triple-leaf calibrated solver");
    expect(report).toContain("- Airborne wall triple-leaf calibrated basis: Wall triple-leaf calibrated solver");
    expect(report).toContain(
      "- Airborne wall triple-leaf calibrated values: Rw 49 dB; STC 60 dB; C +1.4 dB; Ctr -7.4 dB; budget +/-4 dB"
    );
    expect(report).toContain(
      "- Airborne wall triple-leaf calibrated boundary: Rockwool, MLV, plaster, generic gypsum/glasswool, field, and building outputs do not inherit this NRC source-family lab result."
    );
  });

  it("keeps local saved replay and server snapshot replay on the same calibrated basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.airborneWallTopologyMode).toBe("grouped_triple_leaf");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("92.1");

    const savedWallTopology = buildWorkbenchWallTopology(savedSnapshot, savedSnapshot.rows.length);
    const savedScenario = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: savedWallTopology
      },
      id: "wall-triple-leaf-calibrated-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectCalibratedSurfaceResult(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneWallTopologyMode).toBe("grouped_triple_leaf");

    const serverWallTopology = buildWorkbenchWallTopology(
      parsedServerSnapshot!,
      parsedServerSnapshot?.rows.length ?? 0
    );
    const serverScenario = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: serverWallTopology
      },
      id: "wall-triple-leaf-calibrated-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectCalibratedSurfaceResult(serverScenario.result);
  });

  it("keeps calculator API payloads on the same lab values and non-lab boundaries", async () => {
    const layers = toLayerInputs(NRC_ASSEMBLY_B_ROWS);
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: buildContext(),
        calculator: "dynamic",
        layers,
        targetOutputs: TARGET_OUTPUTS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expectCalibratedSurfaceResult(body.result);
    expect(getWallTripleLeafCalibratedSolverSurface(body.result)?.detail).toContain(
      "field/building outputs are not aliased"
    );
  });
});
