import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
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
  getWallTripleLeafLocalSubstitutionSurface,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_GATE,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_STATUS,
  WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_WARNING
} from "./wall-triple-leaf-local-substitution-surface";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

let originalEnv: Record<string, string | undefined>;

const LOCAL_ROCKWOOL_MLV_PLASTER_ROWS: readonly LayerDraft[] = [
  { id: "local-side-a-board-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "local-side-a-mlv", materialId: "mlv", thicknessMm: "4" },
  { id: "local-side-a-board-2", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "local-cavity-1", materialId: "rockwool", thicknessMm: "50" },
  { id: "local-internal-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "local-cavity-2", materialId: "rockwool", thicknessMm: "50" },
  { id: "local-side-b-board-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "local-side-b-plaster", materialId: "gypsum_plaster", thicknessMm: "10" },
  { id: "local-side-b-board-2", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const LOCAL_ROCKWOOL_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "50",
  airborneWallCavity1FillCoverage: "full",
  airborneWallCavity1LayerIndices: "4",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "50",
  airborneWallCavity2FillCoverage: "full",
  airborneWallCavity2LayerIndices: "6",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "5",
  airborneWallSideALeafLayerIndices: "1,2,3",
  airborneWallSideBLeafLayerIndices: "7,8,9",
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
  draft: WorkbenchWallTopologyDraft = LOCAL_ROCKWOOL_TOPOLOGY_DRAFT,
  layerCount = LOCAL_ROCKWOOL_MLV_PLASTER_ROWS.length
): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(draft, layerCount);

  if (!wallTopology) {
    throw new Error("Expected complete local-substitution grouped triple-leaf topology.");
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
    id: input.id ?? "wall-triple-leaf-local-substitution-current",
    name: "Wall triple-leaf local substitution surface parity",
    rows: input.rows ?? LOCAL_ROCKWOOL_MLV_PLASTER_ROWS,
    savedAtIso: input.source === "saved" ? "2026-05-18T12:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? TARGET_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error("Wall triple-leaf local substitution scenario did not evaluate.");
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

function expectLocalSubstitutionSurfaceResult(
  result: AssemblyCalculation | null | undefined
): asserts result is AssemblyCalculation {
  expect(result?.metrics.estimatedRwDb).toBe(53);
  expect(result?.metrics.estimatedStc).toBe(64);
  expect(result?.metrics.estimatedCDb).toBeCloseTo(1.6, 1);
  expect(result?.metrics.estimatedCtrDb).toBeCloseTo(-7.2, 1);
  const candidate = result?.airborneCandidateResolution?.candidates.find(
    (entry: AirborneCandidate) =>
      entry.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
  );
  expect(candidate).toMatchObject({
    basis: {
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    },
    id: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
    origin: "family_physics_prediction"
  });
  expect(getWallTripleLeafLocalSubstitutionSurface(result)).toMatchObject({
    budgetLabel: "+/-8 dB",
    candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
    label: "Wall triple-leaf local substitution",
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    origin: "family_physics_prediction",
    warning: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING
  });
  expect(result?.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  expect(result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  expect(result?.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);
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
    projectName: "Wall Triple Leaf Local Substitution",
    reportProfile: "consultant",
    requestedOutputs: TARGET_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "53"
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
  store.appendRows(withoutIds(LOCAL_ROCKWOOL_MLV_PLASTER_ROWS));
  store.setRequestedOutputs([...TARGET_OUTPUTS]);
  applyTopologyDraftToStore(useWorkbenchStore, LOCAL_ROCKWOOL_TOPOLOGY_DRAFT);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the local-substitution triple-leaf snapshot.");
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

describe("wall triple-leaf local substitution surface parity", () => {
  it("keeps web local-substitution identifiers aligned with the engine lane", () => {
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_GATE).toBe(
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_STATUS).toBe(
      BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_WARNING).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    );
    expect(WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING
    );
  });

  it("shows the same lab-spectrum local-substitution basis on cards, route labels, dossiers, and report", () => {
    const scenario = buildScenario();
    const result = scenario.result;
    expectLocalSubstitutionSurfaceResult(result);

    const cards = buildCards(result);
    expect(cards.Rw).toMatchObject({
      postureLabel: "Wall triple-leaf local substitution",
      postureTone: "accent",
      status: "live",
      value: "53 dB"
    });
    expect(cards.Rw.detail).toContain("source-absent grouped triple-leaf");
    expect(cards.Rw.detail).toContain("+/-8 dB");
    expect(cards.STC).toMatchObject({
      postureLabel: "Wall triple-leaf local substitution",
      postureTone: "accent",
      status: "live",
      value: "64 dB"
    });
    expect(cards.STC.detail).toContain("rated from the calculated curve");
    expect(cards.C).toMatchObject({
      postureLabel: "Wall triple-leaf local substitution",
      postureTone: "accent",
      status: "live",
      value: "+1.6 dB"
    });
    expect(cards.C.detail).toContain("rated from the calculated curve");
    expect(cards.Ctr).toMatchObject({
      postureLabel: "Wall triple-leaf local substitution",
      postureTone: "accent",
      status: "live",
      value: "-7.2 dB"
    });
    expect(cards.Ctr.detail).toContain("rated from the calculated curve");
    for (const output of ["R'w", "DnT,w"] as const) {
      expect(cards[output]).toMatchObject({
        postureLabel: "Awaiting field input",
        status: "needs_input",
        value: "Not ready"
      });
      expect(cards[output].detail).toContain("parked");
    }

    const validationPosture = describeAirborneValidationPosture(result);
    expect(validationPosture).toMatchObject({
      label: "Wall triple-leaf local substitution",
      posture: "estimate"
    });
    expect(validationPosture.detail).toContain("not exact measured evidence");

    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    expect(branch).toMatchObject({
      tone: "ready",
      value: "Wall triple-leaf local substitution"
    });

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    expect(corridorDossier.headline).toContain("Wall triple-leaf local substitution");
    expect(corridorDossier.cards.find((card) => card.label === "Airborne lane")).toMatchObject({
      value: "Wall triple-leaf local substitution"
    });

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: "Dynamic calculator route is evaluating a local Rockwool/MLV/plaster grouped triple-leaf wall.",
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
      stackDetail: "9 live rows feed the local-substitution grouped triple-leaf wall route.",
      studyModeLabel: "Wall",
      validationDetail: validationPosture.detail,
      validationLabel: validationPosture.label,
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup).toMatchObject({
      tone: "accent",
      value: "Wall triple-leaf local substitution"
    });
    expect(airborneTraceGroup?.notes).toContain(
      "Wall triple-leaf local substitution selected candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction."
    );

    const report = buildReport(scenario);
    expect(report).toContain("- Airborne posture: Wall triple-leaf local substitution");
    expect(report).toContain("- Airborne wall triple-leaf local-substitution basis: Wall triple-leaf local substitution");
    expect(report).toContain(
      "- Airborne wall triple-leaf local-substitution value: Rw 53 dB; budget +/-8 dB; Formula design corridor Rw 52.8 with live ISO-rounded Rw 53"
    );
    expect(report).toContain(
      "- Airborne wall triple-leaf local-substitution lab spectrum adapter: STC 64 dB; C 1.6 dB; Ctr -7.2 dB; all rated from the calculated curve, not copied from Rw."
    );
  });

  it("keeps local saved replay and server snapshot replay on the same local-substitution basis", async () => {
    const savedSnapshot = await saveCompleteScenario();
    expect(savedSnapshot.requestedOutputs).toEqual([...TARGET_OUTPUTS]);
    expect(savedSnapshot.airborneWallTopologyMode).toBe("grouped_triple_leaf");
    expect(savedSnapshot.airborneWallCavity1DepthMm).toBe("50");

    const savedWallTopology = buildWorkbenchWallTopology(savedSnapshot, savedSnapshot.rows.length);
    const savedScenario = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: savedWallTopology
      },
      id: "wall-triple-leaf-local-substitution-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectLocalSubstitutionSurfaceResult(savedScenario.result);

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
      id: "wall-triple-leaf-local-substitution-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? TARGET_OUTPUTS
    });
    expectLocalSubstitutionSurfaceResult(serverScenario.result);
  });

  it("keeps calculator API payloads on the same lab-spectrum value and unsupported field boundaries", async () => {
    const layers = toLayerInputs(LOCAL_ROCKWOOL_MLV_PLASTER_ROWS);
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
    expectLocalSubstitutionSurfaceResult(body.result);
    expect(getWallTripleLeafLocalSubstitutionSurface(body.result)?.detail).toContain(
      "lab STC 64 dB, C 1.6 dB, and Ctr -7.2 dB are rated from the calculated curve"
    );
  });
});
