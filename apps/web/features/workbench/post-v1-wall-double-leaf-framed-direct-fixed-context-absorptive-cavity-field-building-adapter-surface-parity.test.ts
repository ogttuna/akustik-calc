import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getGateARAirborneBuildingPredictionSurface } from "./airborne-building-prediction-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import type { WorkbenchAdvancedWallInputSurfaceDraft } from "./advanced-wall-source-absent-input-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { addOutputCardPosture, buildOutputCard } from "./simple-workbench-output-model";
import { buildWorkbenchWallTopology } from "./simple-workbench-wall-topology";
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity";
const SURFACE_PARITY_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter coverage refresh";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md";

const GATE_EO_DIRECT_FIXED_RUNTIME_BASIS =
  "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner";
const GATE_ER_WARNING =
  "Gate ER direct-fixed double-leaf field/building adapter runtime is active only for complete direct-fixed field_between_rooms or building_prediction contexts. It uses the Gate EO direct separating-element curve plus the owned Gate I/AR adapters; it is not measured field or building evidence.";
const GATE_AY_RUNTIME_BASIS = "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor";
const NEEDS_INPUT_METHOD = "dynamic_calculator_route_input_contract_missing_physical_fields";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

const TWO_BOARD_ROWS: readonly LayerDraft[] = [
  { id: "side-a-board", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "side-b-board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE = {
  cavities: [
    {
      absorberCoverageRatio: "1",
      absorberFlowResistivityPaSM2: "15000",
      absorberThicknessMm: "45",
      depthMm: "45",
      id: "cavity-1",
      sealState: "sealed",
      sequence: "1"
    }
  ],
  frameCoupling: {
    depthMm: "",
    frameMaterialClass: "",
    lineCouplingStiffnessMNPerM3: "",
    mechanicalBridgeAreaRatio: "",
    resilientConnectionStiffnessMNPerM3: "",
    resilientConnectionType: "",
    spacingMm: ""
  },
  frequencyBandSet: "",
  hostWallAreaM2: "",
  openingIntent: "",
  openings: [],
  outputBasis: "",
  panels: [],
  wallSolverIntent: ""
} as const satisfies WorkbenchAdvancedWallInputSurfaceDraft;

const DIRECT_FIXED_PARTIAL_ABSORPTIVE_SURFACE = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE,
  cavities: [
    {
      ...DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE.cavities[0],
      absorberCoverageRatio: "0.5",
      absorberThicknessMm: "22.5"
    }
  ]
} as const satisfies WorkbenchAdvancedWallInputSurfaceDraft;

const DIRECT_FIXED_BASE_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_PARTIAL_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_BASE_CONTEXT,
  wallTopology: {
    ...DIRECT_FIXED_BASE_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_BASE_CONTEXT,
  connectionType: undefined,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    ...DIRECT_FIXED_BASE_CONTEXT.wallTopology,
    cavity1DepthMm: 90,
    supportTopology: "independent_frames"
  }
};

const DIRECT_FIXED_GATE_AY_PANEL_CONTEXT: AirborneContext = {
  ...withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ],
    panels: [
      {
        criticalFrequencyHz: 2500,
        id: "panel-a",
        lossFactor: 0.03,
        materialClass: "gypsum_board",
        sequence: 1,
        surfaceMassKgM2: 10.6,
        thicknessMm: 12.5
      }
    ],
    wallSolverIntent: "advanced_source_absent_wall"
  }
};

let originalEnv: Record<string, string | undefined>;

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
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
    thicknessMm: Number.parseFloat(row.thicknessMm)
  }));
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function withFieldContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    contextMode: "field_between_rooms",
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50
  };
}

function withBuildingContext(context: AirborneContext): AirborneContext {
  return {
    ...withFieldContext(context),
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    sourceRoomVolumeM3: 45
  };
}

function buildContextFromSnapshot(snapshot: ScenarioSnapshot): AirborneContext {
  const wallTopology = buildWorkbenchWallTopology(snapshot, snapshot.rows.length);
  if (!wallTopology) {
    throw new Error("Expected a saved direct-fixed field/building wall topology.");
  }

  const context: AirborneContext = {
    contextMode: snapshot.airborneContextMode,
    wallTopology
  };
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);
  const panelHeightMm = parsePositiveNumber(snapshot.airbornePanelHeightMm);
  const panelWidthMm = parsePositiveNumber(snapshot.airbornePanelWidthMm);
  const receivingRoomRt60S = parsePositiveNumber(snapshot.airborneReceivingRoomRt60S);
  const receivingRoomVolumeM3 = parsePositiveNumber(snapshot.airborneReceivingRoomVolumeM3);
  const sourceRoomVolumeM3 = parsePositiveNumber(snapshot.airborneSourceRoomVolumeM3);
  const junctionCouplingLengthM = parsePositiveNumber(snapshot.airborneJunctionCouplingLengthM);

  if (snapshot.airborneConnectionType && snapshot.airborneConnectionType !== "auto") {
    context.connectionType = snapshot.airborneConnectionType;
  }
  if (typeof studSpacingMm === "number") context.studSpacingMm = studSpacingMm;
  if (typeof panelHeightMm === "number") context.panelHeightMm = panelHeightMm;
  if (typeof panelWidthMm === "number") context.panelWidthMm = panelWidthMm;
  if (typeof receivingRoomRt60S === "number") context.receivingRoomRt60S = receivingRoomRt60S;
  if (typeof receivingRoomVolumeM3 === "number") context.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  if (typeof sourceRoomVolumeM3 === "number") context.sourceRoomVolumeM3 = sourceRoomVolumeM3;
  if (typeof junctionCouplingLengthM === "number") context.junctionCouplingLengthM = junctionCouplingLengthM;
  if (snapshot.airborneFlankingJunctionClass && snapshot.airborneFlankingJunctionClass !== "unknown") {
    context.flankingJunctionClass = snapshot.airborneFlankingJunctionClass;
  }
  if (
    snapshot.airborneConservativeFlankingAssumption &&
    snapshot.airborneConservativeFlankingAssumption !== "unknown"
  ) {
    context.conservativeFlankingAssumption = snapshot.airborneConservativeFlankingAssumption;
  }
  if (
    snapshot.airborneBuildingPredictionOutputBasis &&
    snapshot.airborneBuildingPredictionOutputBasis !== "unknown"
  ) {
    context.buildingPredictionOutputBasis = snapshot.airborneBuildingPredictionOutputBasis;
  }

  return context;
}

function buildScenario(input: {
  advancedWallInputSurface?: WorkbenchAdvancedWallInputSurfaceDraft | null;
  airborneContext: AirborneContext;
  id: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    advancedWallInputSurface: Object.hasOwn(input, "advancedWallInputSurface")
      ? input.advancedWallInputSurface
      : DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE,
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: `Direct-fixed absorptive cavity field/building surface ${input.id}`,
    rows: input.rows ?? TWO_BOARD_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-11T15:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? FIELD_BUILDING_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildReport(
  scenario: EvaluatedScenario,
  requestedOutputs: readonly RequestedOutputId[] = FIELD_BUILDING_OUTPUTS
): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Direct Fixed Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Double-Leaf Direct-Fixed Absorptive Cavity Field Building Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "35"
  });
}

function expectDirectFixedFieldBuildingSurface(
  result: AssemblyCalculation | null | undefined,
  expected: {
    DnTw: number;
    DnW: number;
    RwPrime: number;
  },
  basis: {
    budget: number;
    method: string;
    selectedCandidateId: string;
  }
): asserts result is AssemblyCalculation {
  expect(result?.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
  expect(result?.unsupportedTargetOutputs).toEqual([]);
  expect(result?.metrics).toMatchObject({
    estimatedDnTwDb: expected.DnTw,
    estimatedDnWDb: expected.DnW,
    estimatedRwPrimeDb: expected.RwPrime
  });
  expect(result?.airborneBasis).toMatchObject({
    errorBudgetDb: basis.budget,
    method: basis.method,
    origin: "family_physics_prediction"
  });
  expect(result?.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "directFixedContextAbsorptiveCavityOwner",
      "GateER_direct_fixed_field_building_adapter_owner",
      "directFixedEquivalentCoupledMassOwner",
      "directFixedBridgeLossOwner"
    ])
  );
  expect(result?.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining(
      basis.method === GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
        ? ["buildingPredictionOutputBasis"]
        : ["fieldContext.receivingRoomRt60S"]
    )
  );
  expect(result?.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: basis.selectedCandidateId,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result?.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: basis.method,
    supportedMetrics: [...FIELD_BUILDING_OUTPUTS]
  });
  expect(result?.warnings).toEqual(expect.arrayContaining([expect.stringContaining(GATE_ER_WARNING)]));
}

function buildCards(result: AssemblyCalculation) {
  return FIELD_BUILDING_OUTPUTS.map((output) =>
    addOutputCardPosture(buildOutputCard({ output, result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })
  );
}

async function estimateViaApi(input: {
  airborneContext: AirborneContext;
  targetOutputs?: readonly RequestedOutputId[];
}): Promise<AssemblyCalculation> {
  const { POST: estimate } = await import("../../app/api/estimate/route");
  const response = await estimate(
    jsonRequest("http://localhost/api/estimate", {
      airborneContext: input.airborneContext,
      calculator: "dynamic",
      layers: toLayerInputs(TWO_BOARD_ROWS),
      targetOutputs: input.targetOutputs ?? FIELD_BUILDING_OUTPUTS
    })
  );
  const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

  expect(response.status).toBe(200);
  expect(body.ok).toBe(true);
  expect(body.result).toBeDefined();

  return body.result as AssemblyCalculation;
}

async function saveDirectFixedFieldBuildingSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(TWO_BOARD_ROWS));
  store.setRequestedOutputs([...FIELD_BUILDING_OUTPUTS]);
  store.setAirborneContextMode("building_prediction");
  store.setAirborneConnectionType("direct_fix");
  store.setAirborneStudSpacingMm("400");
  store.setAirbornePanelWidthMm("3000");
  store.setAirbornePanelHeightMm("2500");
  store.setAirborneReceivingRoomVolumeM3("50");
  store.setAirborneReceivingRoomRt60S("0.5");
  store.setAirborneSourceRoomVolumeM3("45");
  store.setAirborneFlankingJunctionClass("rigid_t_junction");
  store.setAirborneConservativeFlankingAssumption("multi_path_conservative");
  store.setAirborneJunctionCouplingLengthM("4.8");
  store.setAirborneBuildingPredictionOutputBasis("apparent_and_standardized");
  store.setAirborneWallTopologyMode("double_leaf_framed");
  store.setAirborneWallSideALeafLayerIndices("1");
  store.setAirborneWallCavity1DepthMm("45");
  store.setAirborneWallCavity1FillCoverage("full");
  store.setAirborneWallCavity1AbsorptionClass("porous_absorptive");
  store.setAirborneWallSideBLeafLayerIndices("2");
  store.setAirborneWallSupportTopology("direct_fixed");
  store.replaceAirborneAdvancedWallInputSurface(DIRECT_FIXED_FULL_ABSORPTIVE_SURFACE);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the direct-fixed field/building snapshot.");
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

describe("post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity", () => {
  it("shows full absorber field values on cards, status, report, and calculator API", async () => {
    const scenario = buildScenario({
      airborneContext: withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-field-full"
    });
    const result = scenario.result;
    const [rwPrimeCard, dnWCard, dnTwCard] = buildCards(result);

    expectDirectFixedFieldBuildingSurface(
      result,
      { DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        budget: 8,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      }
    );
    expect(getGateIAirborneFieldContextSurface(result)).toMatchObject({
      budgetLabel: "+/-8 dB",
      candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      label: "Airborne field-context prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(rwPrimeCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "29 dB"
    });
    expect(dnWCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "30 dB"
    });
    expect(dnTwCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "32 dB"
    });
    expect(getTargetOutputStatus({ guideResult: null, output: "R'w", result })).toMatchObject({
      kind: "engine_live",
      label: "Apparent field",
      output: "R'w",
      tone: "success"
    });

    const report = buildReport(scenario);
    expect(report).toContain("Airborne field basis: Gate I airborne field/apparent context adapter");
    expect(report).toContain("Airborne field error budget: R'w/DnT,w use +/-8 dB");
    expect(report).toContain(GATE_ER_WARNING);

    expectDirectFixedFieldBuildingSurface(
      await estimateViaApi({
        airborneContext: {
          ...withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
          advancedWall: {
            cavities: [
              {
                absorberCoverageRatio: 1,
                absorberFlowResistivityPaSM2: 15000,
                absorberThicknessMm: 45,
                depthMm: 45,
                id: "cavity-1",
                sealState: "sealed"
              }
            ]
          }
        }
      }),
      { DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        budget: 8,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("keeps partial absorber and saved/server building replay on the Gate AR surface", async () => {
    const partial = buildScenario({
      advancedWallInputSurface: DIRECT_FIXED_PARTIAL_ABSORPTIVE_SURFACE,
      airborneContext: withBuildingContext(DIRECT_FIXED_PARTIAL_CONTEXT),
      id: "direct-fixed-absorptive-cavity-building-partial"
    });
    expectDirectFixedFieldBuildingSurface(
      partial.result,
      { DnTw: 30, DnW: 28, RwPrime: 27 },
      {
        budget: 9,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
    expect(getGateARAirborneBuildingPredictionSurface(partial.result)).toMatchObject({
      budgetLabel: "+/-9 dB",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      label: "Airborne building prediction",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(getGateARAirborneBuildingPredictionSurface(partial.result)?.detail).toContain(
      "R'w 27 dB, Dn,w 28 dB and DnT,w 30 dB"
    );

    const report = buildReport(partial);
    expect(report).toContain(
      `Airborne building basis: Gate AR all-owner building-prediction runtime (candidate ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID}; method ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD}).`
    );
    expect(report).toContain("Airborne building values: R'w 27 dB, Dn,w 28 dB and DnT,w 30 dB");

    const savedSnapshot = await saveDirectFixedFieldBuildingSnapshot();
    expect(savedSnapshot.airborneContextMode).toBe("building_prediction");
    expect(savedSnapshot.airborneConnectionType).toBe("direct_fix");
    expect(savedSnapshot.airborneWallSupportTopology).toBe("direct_fixed");
    expect(savedSnapshot.airborneWallCavity1FillCoverage).toBe("full");
    expect(savedSnapshot.airborneBuildingPredictionOutputBasis).toBe("apparent_and_standardized");
    expect(savedSnapshot.airborneAdvancedWallInputSurface?.cavities[0]?.absorberFlowResistivityPaSM2).toBe("15000");

    const savedScenario = buildScenario({
      advancedWallInputSurface: savedSnapshot.airborneAdvancedWallInputSurface,
      airborneContext: buildContextFromSnapshot(savedSnapshot),
      id: "direct-fixed-absorptive-cavity-building-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectDirectFixedFieldBuildingSurface(
      savedScenario.result,
      { DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        budget: 9,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();
    expect(parsedServerSnapshot?.airborneConnectionType).toBe("direct_fix");
    expect(parsedServerSnapshot?.airborneWallSupportTopology).toBe("direct_fixed");
    expect(parsedServerSnapshot?.airborneAdvancedWallInputSurface?.cavities[0]?.absorberFlowResistivityPaSM2).toBe(
      "15000"
    );

    const serverScenario = buildScenario({
      advancedWallInputSurface: parsedServerSnapshot?.airborneAdvancedWallInputSurface,
      airborneContext: buildContextFromSnapshot(parsedServerSnapshot as ScenarioSnapshot),
      id: "direct-fixed-absorptive-cavity-building-server",
      rows: parsedServerSnapshot?.rows ?? [],
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? FIELD_BUILDING_OUTPUTS
    });
    expectDirectFixedFieldBuildingSurface(
      serverScenario.result,
      { DnTw: 32, DnW: 30, RwPrime: 29 },
      {
        budget: 9,
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
      }
    );
  });

  it("keeps A-weighted-only live while ASTM, impact, missing ownership, Gate AY panels, and non-direct-fixed rows stay outside", async () => {
    const aWeightedOnly = buildScenario({
      airborneContext: withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-a-weighted-only",
      targetOutputs: A_WEIGHTED_OUTPUTS
    }).result;
    expect(aWeightedOnly.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
    expect(aWeightedOnly.unsupportedTargetOutputs).toEqual([]);
    expect(aWeightedOnly.metrics).toMatchObject({
      estimatedDnADb: 28.9,
      estimatedDnTADb: 31
    });
    expect(aWeightedOnly.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(getGateIAirborneFieldContextSurface(aWeightedOnly)).toMatchObject({
      candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });

    const astm = buildScenario({
      airborneContext: withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-astm",
      targetOutputs: ASTM_OUTPUTS
    }).result;
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);

    const impact = buildScenario({
      airborneContext: withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-impact",
      targetOutputs: IMPACT_OUTPUTS
    }).result;
    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);

    const missingOwnership = buildScenario({
      advancedWallInputSurface: null,
      airborneContext: withFieldContext(DIRECT_FIXED_BASE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-missing-ownership"
    }).result;
    expect(missingOwnership.supportedTargetOutputs).toEqual([]);
    expect(missingOwnership.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(missingOwnership.airborneBasis).toMatchObject({
      method: NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
      origin: "needs_input"
    });

    const gateAyPanels = await estimateViaApi({
      airborneContext: DIRECT_FIXED_GATE_AY_PANEL_CONTEXT,
      targetOutputs: FIELD_BUILDING_OUTPUTS
    });
    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: GATE_AY_RUNTIME_BASIS,
      origin: "unsupported"
    });

    const nonDirect = buildScenario({
      airborneContext: withFieldContext(NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
      id: "direct-fixed-absorptive-cavity-non-direct"
    }).result;
    expect(nonDirect.airborneBasis?.requiredInputs ?? []).not.toContain(
      "directFixedContextAbsorptiveCavityFieldBuildingAdapterOwner"
    );
    expect(nonDirect.airborneBasis?.requiredInputs ?? []).not.toContain(
      "GateER_direct_fixed_field_building_adapter_owner"
    );
  });

  it("keeps docs and current-gate runner aligned with the landed surface parity and selected coverage refresh", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const text = readRepoFile(path);
      const normalized = text.replace(/\s+/g, " ");

      expect(text, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(text, path).toContain(PREVIOUS_OWNER_FILE);
      expect(text, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(text, path).toContain(SURFACE_PARITY_ACTION);
      expect(text, path).toContain(SURFACE_PARITY_FILE);
      expect(text, path).toContain(SURFACE_PARITY_STATUS);
      expect(text, path).toContain(SELECTED_NEXT_ACTION);
      expect(text, path).toContain(SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(text, path).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(text, path).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(text, path).toContain(GATE_EO_DIRECT_FIXED_RUNTIME_BASIS);
      expect(text, path).toContain("R'w 29");
      expect(text, path).toContain("Dn,w 30");
      expect(text, path).toContain("DnT,w 32");
      expect(text, path).toContain("R'w 27");
      expect(text, path).toContain("Dn,w 28");
      expect(text, path).toContain("DnT,w 30");
      expect(text, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(text, path).toContain("frontendImplementationFilesTouched: 0");
      expect(text, path).toContain("runtimeValuesMoved 0");
      expect(text, path).toContain("runtimeFormulaRetunes: 0");
      expect(text, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(SURFACE_PARITY_FILE.replace("apps/web/", ""));
  });
});
