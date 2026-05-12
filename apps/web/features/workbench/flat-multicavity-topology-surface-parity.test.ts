import {
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_GATE,
  WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
  getGateACFlatMulticavityTopologyReportLines,
  getGateACFlatMulticavityTopologySurface
} from "./flat-multicavity-topology-surface";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import {
  buildWorkbenchWallTopology,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const FLAT_MULTICAVITY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 60 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const PINNED_GROUPED_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const COMPLETE_FLAT_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "porous_absorptive",
  airborneWallCavity1DepthMm: "70",
  airborneWallCavity1FillCoverage: "partial",
  airborneWallCavity1LayerIndices: "4, 5",
  airborneWallCavity2AbsorptionClass: "porous_absorptive",
  airborneWallCavity2DepthMm: "80",
  airborneWallCavity2FillCoverage: "partial",
  airborneWallCavity2LayerIndices: "7, 8",
  airborneWallInternalLeafCoupling: "independent",
  airborneWallInternalLeafLayerIndices: "6",
  airborneWallSideALeafLayerIndices: "1, 2, 3",
  airborneWallSideBLeafLayerIndices: "9, 10, 11",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
};

const COMPLETE_PINNED_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
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
  airborneWallSideALeafLayerIndices: "1, 2, 3",
  airborneWallSideBLeafLayerIndices: "7, 8, 9",
  airborneWallSupportTopology: "independent_frames",
  airborneWallTopologyMode: "grouped_triple_leaf"
};

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
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

function rowsFor(layers: readonly LayerInput[], id: string): LayerDraft[] {
  return layers.map((layer, index) => ({
    id: `${id}-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function buildContext(draft: WorkbenchWallTopologyDraft, layerCount: number): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(draft, layerCount);

  if (!wallTopology) {
    throw new Error("Gate AC test topology draft did not parse.");
  }

  return {
    contextMode: "element_lab",
    wallTopology
  };
}

function buildScenario(input: {
  airborneContext: AirborneContext;
  id: string;
  layers: readonly LayerInput[];
  source?: "current" | "saved";
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: `Gate AC flat multicavity topology ${input.id}`,
    rows: rowsFor(input.layers, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-11T13:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): readonly OutputCardModel[] {
  return WALL_OUTPUTS.map((output) =>
    addOutputCardPosture(buildOutputCard({ output, result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })
  );
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Gate AC Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AC Flat Multicavity Topology Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: WALL_OUTPUTS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "50"
  });
}

type WorkbenchTopologyStoreApi = typeof import("./workbench-store").useWorkbenchStore;

function applyTopologyDraftToStore(
  store: WorkbenchTopologyStoreApi,
  draft: WorkbenchWallTopologyDraft
): void {
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

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }

  vi.resetModules();
  vi.stubGlobal("localStorage", createMemoryStorage());
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

describe("flat multicavity topology surface parity", () => {
  it("keeps web Gate AC identifiers aligned with engine constants", () => {
    expect(WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL).toBe(
      GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL
    );
    expect(WEB_GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_GATE).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE
    );
  });

  it("carries complete flat multicavity UI topology into cards, route summary, and Markdown report", () => {
    const airborneContext = buildContext(COMPLETE_FLAT_TOPOLOGY_DRAFT, FLAT_MULTICAVITY_STACK.length);
    const scenario = buildScenario({
      airborneContext,
      id: "flat-many-layer-current",
      layers: FLAT_MULTICAVITY_STACK
    });
    const result = scenario.result;
    const [rwCard, stcCard, cCard, ctrCard] = buildCards(result);
    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    const surface = getGateACFlatMulticavityTopologySurface({ airborneContext, result });
    const reportLines = getGateACFlatMulticavityTopologyReportLines(scenario);
    const report = buildReport(scenario);

    expect(result.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedCDb: -0.6,
      estimatedCtrDb: -8,
      estimatedStc: 57
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(rwCard).toMatchObject({ status: "live", value: "53 dB" });
    expect(stcCard).toMatchObject({ status: "live", value: "57 dB" });
    expect(cCard).toMatchObject({ status: "live", value: "-0.6 dB" });
    expect(ctrCard).toMatchObject({ status: "live", value: "-8 dB" });
    expect(branch).toMatchObject({
      tone: "neutral",
      value: "Multi-Leaf / Multi-Cavity"
    });

    expect(surface).toMatchObject({
      label: GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      status: "solver_with_explicit_topology"
    });
    expect(surface?.groupLine).toContain("side A rows 1, 2, 3");
    expect(surface?.groupLine).toContain("cavity 1 rows 4, 5 at 70.0 mm");
    expect(surface?.groupLine).toContain("cavity 2 rows 7, 8 at 80.0 mm");
    expect(surface?.groupLine).toContain("side B rows 9, 10, 11");

    expect(reportLines).toEqual([
      `- Wall multicavity topology basis: Wall multicavity topology owner set carried from visible row groups; method ${GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD}; origin family_physics_prediction; not measured evidence.`,
      "- Wall multicavity topology groups: side A rows 1, 2, 3; cavity 1 rows 4, 5 at 70.0 mm, partial fill, porous absorptive; internal leaf rows 6, coupling independent; cavity 2 rows 7, 8 at 80.0 mm, partial fill, porous absorptive; side B rows 9, 10, 11; support independent frames."
    ]);
    expect(report).toContain(reportLines[0]);
    expect(report).toContain(reportLines[1]);
  });

  it("keeps saved replay and calculator API payloads on the same explicit topology basis", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");

    useWorkbenchStore.getState().startStudyMode("wall");
    useWorkbenchStore.getState().appendRows(
      FLAT_MULTICAVITY_STACK.map((layer) => ({
        materialId: layer.materialId,
        thicknessMm: String(layer.thicknessMm)
      }))
    );
    applyTopologyDraftToStore(useWorkbenchStore, COMPLETE_FLAT_TOPOLOGY_DRAFT);
    useWorkbenchStore.getState().saveCurrentScenario();
    const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

    useWorkbenchStore.getState().setAirborneWallTopologyMode("auto");
    useWorkbenchStore.getState().loadSavedScenario(savedScenarioId!);

    expect(useWorkbenchStore.getState().airborneWallTopologyMode).toBe("grouped_triple_leaf");
    expect(useWorkbenchStore.getState().airborneWallSideALeafLayerIndices).toBe("1, 2, 3");
    expect(useWorkbenchStore.getState().airborneWallCavity2LayerIndices).toBe("7, 8");

    const savedWallTopology = buildWorkbenchWallTopology(
      useWorkbenchStore.getState(),
      useWorkbenchStore.getState().rows.length
    );
    const savedScenario = evaluateScenario({
      airborneContext: {
        contextMode: "element_lab",
        wallTopology: savedWallTopology
      },
      calculator: "dynamic",
      id: "flat-many-layer-saved",
      name: "Gate AC saved flat multicavity topology",
      rows: useWorkbenchStore.getState().rows,
      savedAtIso: "2026-05-11T13:00:00.000Z",
      source: "saved",
      studyMode: "wall",
      targetOutputs: WALL_OUTPUTS
    }) as EvaluatedScenario & { result: AssemblyCalculation };

    expect(savedScenario.source).toBe("saved");
    expect(savedScenario.result.metrics.estimatedRwDb).toBe(53);
    expect(
      getGateACFlatMulticavityTopologySurface({
        airborneContext: savedScenario.airborneContext,
        result: savedScenario.result
      })?.status
    ).toBe("solver_with_explicit_topology");

    const pinnedContext = buildContext(
      COMPLETE_PINNED_TOPOLOGY_DRAFT,
      PINNED_GROUPED_TRIPLE_LEAF_STACK.length
    );
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: pinnedContext,
        calculator: "dynamic",
        layers: PINNED_GROUPED_TRIPLE_LEAF_STACK,
        targetOutputs: WALL_OUTPUTS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result?.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedStc: 55
    });
    expect(body.result?.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
    expect(
      getGateACFlatMulticavityTopologySurface({
        airborneContext: pinnedContext,
        result: body.result ?? null
      })?.status
    ).toBe("solver_with_explicit_topology");
  });

  it("keeps partial UI topology parked instead of creating a report surface", () => {
    const partialContext = buildContext(
      {
        ...COMPLETE_FLAT_TOPOLOGY_DRAFT,
        airborneWallCavity2LayerIndices: "",
        airborneWallCavity2DepthMm: ""
      },
      FLAT_MULTICAVITY_STACK.length
    );
    const scenario = buildScenario({
      airborneContext: partialContext,
      id: "flat-many-layer-partial",
      layers: FLAT_MULTICAVITY_STACK
    });
    const topologyGap = getGuidedTopologyGap({
      result: scenario.result,
      rows: scenario.rows,
      studyMode: "wall"
    });

    expect(getGateACFlatMulticavityTopologySurface({
      airborneContext: partialContext,
      result: scenario.result
    })).toBeNull();
    expect(getGateACFlatMulticavityTopologyReportLines(scenario)).toEqual([]);
    expect(topologyGap).toMatchObject({
      value: "Grouped topology missing"
    });
    expect(topologyGap?.detail).toContain("Missing:");
  });
});
