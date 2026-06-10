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

import {
  buildWorkbenchAirborneFieldContextInputSurface,
  type WorkbenchAirborneFieldContextInputSurfaceDraft
} from "./airborne-field-context-input-surface";
import { getGateARAirborneBuildingPredictionSurface } from "./airborne-building-prediction-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getPresetById } from "./preset-definitions";
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
import { getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance";

const A_WEIGHTED_SURFACE_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan";
const A_WEIGHTED_SURFACE_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts";
const A_WEIGHTED_SURFACE_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

const A_WEIGHTED_TARGETS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALL_TARGETS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_OWNED_A_WEIGHTED_TARGETS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const COMPATIBLE_ANCHOR_WARNING_PREFIX = "Compatible measured-anchor delta active";
const COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX = "Compatible anchor-delta field/building adapter active";
const COMPATIBLE_A_WEIGHTED_WARNING_PREFIX =
  "Compatible anchor-delta A-weighted field/building owner active";

const COMPATIBLE_LSF_ROWS: readonly LayerDraft[] = [
  { id: "outer-start", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "board-a1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "board-a2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "board-b1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "board-b2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "outer-end", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const COMPATIBLE_ONE_SIDE_LSF_ROWS: readonly LayerDraft[] = [
  { id: "board-a1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "board-a2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "5" },
  { id: "fill", materialId: "glasswool", thicknessMm: "70" },
  { id: "board-b1", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "board-b2", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
  { id: "outer-end", materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
];

const COMPATIBLE_BASE_CONTEXT: WorkbenchAirborneFieldContextInputSurfaceDraft["baseContext"] = {
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const COMPLETE_FIELD_SURFACE = {
  airtightness: "good",
  baseContext: COMPATIBLE_BASE_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: "2800",
  panelWidthMm: "3200",
  receivingRoomRt60S: "0.6",
  receivingRoomVolumeM3: "55"
} as const satisfies WorkbenchAirborneFieldContextInputSurfaceDraft;

const COMPLETE_BUILDING_SURFACE = {
  ...COMPLETE_FIELD_SURFACE,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: "4.8",
  sourceRoomVolumeM3: "48"
} as const satisfies WorkbenchAirborneFieldContextInputSurfaceDraft;

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

function toLayerInputs(rows: readonly LayerDraft[]): LayerInput[] {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: Number.parseFloat(row.thicknessMm)
  }));
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function airborneFieldSurfaceFromSnapshot(
  snapshot: Pick<
    ScenarioSnapshot,
    | "airborneAirtightness"
    | "airborneBuildingPredictionOutputBasis"
    | "airborneConnectionType"
    | "airborneConservativeFlankingAssumption"
    | "airborneContextMode"
    | "airborneFlankingJunctionClass"
    | "airborneJunctionCouplingLengthM"
    | "airbornePanelHeightMm"
    | "airbornePanelWidthMm"
    | "airborneReceivingRoomRt60S"
    | "airborneReceivingRoomVolumeM3"
    | "airborneSourceRoomVolumeM3"
    | "airborneStudSpacingMm"
    | "airborneStudType"
  >
): WorkbenchAirborneFieldContextInputSurfaceDraft {
  const studSpacingMm = parsePositiveNumber(snapshot.airborneStudSpacingMm);
  const baseContext: WorkbenchAirborneFieldContextInputSurfaceDraft["baseContext"] = {};

  if (snapshot.airborneConnectionType && snapshot.airborneConnectionType !== "auto") {
    baseContext.connectionType = snapshot.airborneConnectionType;
  }
  if (snapshot.airborneStudType && snapshot.airborneStudType !== "auto") {
    baseContext.studType = snapshot.airborneStudType;
  }
  if (typeof studSpacingMm === "number") {
    baseContext.studSpacingMm = studSpacingMm;
  }

  return {
    airtightness: snapshot.airborneAirtightness,
    baseContext,
    buildingPredictionOutputBasis: snapshot.airborneBuildingPredictionOutputBasis,
    conservativeFlankingAssumption: snapshot.airborneConservativeFlankingAssumption,
    contextMode: snapshot.airborneContextMode,
    flankingJunctionClass: snapshot.airborneFlankingJunctionClass,
    junctionCouplingLengthM: snapshot.airborneJunctionCouplingLengthM,
    panelHeightMm: snapshot.airbornePanelHeightMm,
    panelWidthMm: snapshot.airbornePanelWidthMm,
    receivingRoomRt60S: snapshot.airborneReceivingRoomRt60S,
    receivingRoomVolumeM3: snapshot.airborneReceivingRoomVolumeM3,
    sourceRoomVolumeM3: snapshot.airborneSourceRoomVolumeM3
  };
}

function buildScenario(input: {
  id: string;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  surface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: input.surface,
    calculator: "dynamic",
    id: input.id,
    name: `Compatible anchor-delta A-weighted field/building surface ${input.id}`,
    rows: input.rows ?? COMPATIBLE_LSF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-10T09:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? A_WEIGHTED_TARGETS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(
  result: AssemblyCalculation,
  outputs: readonly RequestedOutputId[]
): readonly OutputCardModel[] {
  return outputs.map((output) =>
    addOutputCardPosture(buildOutputCard({ output, result, studyMode: "wall" }), {
      result,
      studyMode: "wall"
    })
  );
}

function buildReport(scenario: EvaluatedScenario, requestedOutputs: readonly RequestedOutputId[]): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("light_steel_stud_wall"),
    briefNote: "",
    clientName: "Compatible Anchor Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Compatible Anchor-Delta A-Weighted Field Building Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "55"
  });
}

function buildApiContext(input: {
  surface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): AirborneContext {
  return buildWorkbenchAirborneFieldContextInputSurface({
    studyMode: "wall",
    surface: input.surface,
    targetOutputs: input.targetOutputs
  }).airborneContext;
}

function expectAWeightedFieldRuntime(
  result: AssemblyCalculation,
  expected: { dnA: number; dnTA: number }
): void {
  expect(result.supportedTargetOutputs).toEqual([...A_WEIGHTED_TARGETS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: expected.dnA,
    estimatedDnTADb: expected.dnTA
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
    supportedMetrics: [...A_WEIGHTED_TARGETS],
    valuePins: expect.arrayContaining([
      { metric: "Dn,A", value: expected.dnA },
      { metric: "DnT,A", value: expected.dnTA }
    ])
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      expect.stringContaining(COMPATIBLE_ANCHOR_WARNING_PREFIX),
      expect.stringContaining(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX),
      expect.stringContaining(COMPATIBLE_A_WEIGHTED_WARNING_PREFIX)
    ])
  );
}

function expectAWeightedBuildingRuntime(
  result: AssemblyCalculation,
  expected: { dnA: number; dnTA: number }
): void {
  expect(result.supportedTargetOutputs).toEqual([...BUILDING_OWNED_A_WEIGHTED_TARGETS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnADb: expected.dnA,
    estimatedDnTADb: expected.dnTA
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    supportedMetrics: [...BUILDING_OWNED_A_WEIGHTED_TARGETS],
    valuePins: expect.arrayContaining([
      { metric: "Dn,A", value: expected.dnA },
      { metric: "DnT,A", value: expected.dnTA }
    ])
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      expect.stringContaining(COMPATIBLE_A_WEIGHTED_WARNING_PREFIX)
    ])
  );
  expect(result.warnings).not.toEqual(
    expect.arrayContaining([expect.stringContaining("kept Dn,A out")])
  );
}

async function saveCompleteAWeightedBuildingSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(COMPATIBLE_LSF_ROWS));
  store.setRequestedOutputs([...A_WEIGHTED_TARGETS]);
  store.setAirborneContextMode("building_prediction");
  store.setAirborneAirtightness("good");
  store.setAirborneConnectionType("line_connection");
  store.setAirborneStudType("light_steel_stud");
  store.setAirborneStudSpacingMm("600");
  store.setAirbornePanelWidthMm(COMPLETE_BUILDING_SURFACE.panelWidthMm);
  store.setAirbornePanelHeightMm(COMPLETE_BUILDING_SURFACE.panelHeightMm);
  store.setAirborneReceivingRoomVolumeM3(COMPLETE_BUILDING_SURFACE.receivingRoomVolumeM3);
  store.setAirborneReceivingRoomRt60S(COMPLETE_BUILDING_SURFACE.receivingRoomRt60S);
  store.setAirborneSourceRoomVolumeM3(COMPLETE_BUILDING_SURFACE.sourceRoomVolumeM3);
  store.setAirborneFlankingJunctionClass(COMPLETE_BUILDING_SURFACE.flankingJunctionClass);
  store.setAirborneConservativeFlankingAssumption(COMPLETE_BUILDING_SURFACE.conservativeFlankingAssumption);
  store.setAirborneJunctionCouplingLengthM(COMPLETE_BUILDING_SURFACE.junctionCouplingLengthM);
  store.setAirborneBuildingPredictionOutputBasis(COMPLETE_BUILDING_SURFACE.buildingPredictionOutputBasis);
  store.saveCurrentScenario();

  const savedSnapshot = useWorkbenchStore.getState().savedScenarios[0];
  if (!savedSnapshot) {
    throw new Error("Expected the workbench store to save the compatible A-weighted snapshot.");
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

describe("post-V1 wall compatible anchor-delta A-weighted field/building surface parity", () => {
  it("shows paired field Dn,A/DnT,A from UI-derived inputs through cards, report, and API", async () => {
    const scenario = buildScenario({
      id: "compatible-anchor-a-weighted-field-live",
      surface: COMPLETE_FIELD_SURFACE
    });
    const result = scenario.result;
    const [dnACard, dnTACard] = buildCards(result, A_WEIGHTED_TARGETS);

    expectAWeightedFieldRuntime(result, { dnA: 49.5, dnTA: 51.9 });
    expect(getGateIAirborneFieldContextSurface(result)).toMatchObject({
      budgetLabel: "+/-7 dB",
      candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      label: "Airborne field-context prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(dnACard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "49.5 dB"
    });
    expect(dnACard.detail).toContain("Dn,A is being carried as Dn,w + C");
    expect(dnTACard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "51.9 dB"
    });
    expect(dnTACard.detail).toContain("DnT,A is being carried as DnT,w + C");

    const status = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,A",
      result
    });
    expect(status).toMatchObject({
      kind: "engine_live",
      label: "Room-standardized"
    });
    expect(status.note).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    const report = buildReport(scenario, A_WEIGHTED_TARGETS);
    expect(report).toContain("Airborne field basis: Gate I airborne field/apparent context adapter");
    expect(report).toContain("- DnT,A estimate: 51.9 dB");
    expect(report).toContain(COMPATIBLE_A_WEIGHTED_WARNING_PREFIX);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: buildApiContext({
          surface: COMPLETE_FIELD_SURFACE,
          targetOutputs: A_WEIGHTED_TARGETS
        }),
        calculator: "dynamic",
        layers: toLayerInputs(COMPATIBLE_LSF_ROWS),
        targetOutputs: A_WEIGHTED_TARGETS
      })
    );
    const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result).toBeDefined();
    expectAWeightedFieldRuntime(body.result as AssemblyCalculation, { dnA: 49.5, dnTA: 51.9 });
  });

  it("keeps UI-derived saved and server building replay on Dn,A/DnT,A", async () => {
    const liveScenario = buildScenario({
      id: "compatible-anchor-a-weighted-building-live",
      surface: COMPLETE_BUILDING_SURFACE
    });
    const result = liveScenario.result;
    const [dnACard, dnTACard] = buildCards(result, A_WEIGHTED_TARGETS);

    expectAWeightedBuildingRuntime(result, { dnA: 49.5, dnTA: 51.9 });
    expect(getGateARAirborneBuildingPredictionSurface(result)).toMatchObject({
      budgetLabel: "+/-9 dB",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      label: "Airborne building prediction",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(getGateARAirborneBuildingPredictionSurface(result)?.detail).toContain("Dn,A 49.5 dB");
    expect(getGateARAirborneBuildingPredictionSurface(result)?.detail).toContain("DnT,A 51.9 dB");
    expect(dnACard).toMatchObject({
      postureLabel: "Airborne building prediction",
      status: "live",
      value: "49.5 dB"
    });
    expect(dnACard.detail).toContain("Gate AR airborne building-prediction runtime");
    expect(dnTACard).toMatchObject({
      postureLabel: "Airborne building prediction",
      status: "live",
      value: "51.9 dB"
    });
    expect(dnTACard.detail).toContain("Gate AR airborne building-prediction runtime");

    const dnTAStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,A",
      result
    });
    expect(dnTAStatus).toMatchObject({
      kind: "engine_live",
      label: "Building standardized"
    });
    expect(dnTAStatus.note).toContain("DnT,A 51.9 dB");

    const dnAStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Dn,A",
      result
    });
    expect(dnAStatus).toMatchObject({
      kind: "engine_live",
      label: "Building standardized"
    });
    expect(dnAStatus.note).toContain("Dn,A 49.5 dB");

    const report = buildReport(liveScenario, A_WEIGHTED_TARGETS);
    expect(report).toContain(
      "- Airborne building values: Dn,A 49.5 dB and DnT,A 51.9 dB; source-absent budget +/-9 dB; not measured building evidence yes."
    );
    expect(report).toContain(COMPATIBLE_A_WEIGHTED_WARNING_PREFIX);

    const savedSnapshot = await saveCompleteAWeightedBuildingSnapshot();
    expect(savedSnapshot.requestedOutputs).toEqual([...A_WEIGHTED_TARGETS]);
    expect(savedSnapshot.airborneBuildingPredictionOutputBasis).toBe("apparent_and_standardized");

    const savedScenario = buildScenario({
      id: "compatible-anchor-a-weighted-building-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: airborneFieldSurfaceFromSnapshot(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectAWeightedBuildingRuntime(savedScenario.result, { dnA: 49.5, dnTA: 51.9 });

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = buildScenario({
      id: "compatible-anchor-a-weighted-building-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: airborneFieldSurfaceFromSnapshot(parsedServerSnapshot as ScenarioSnapshot),
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? A_WEIGHTED_TARGETS
    });
    expectAWeightedBuildingRuntime(serverScenario.result, { dnA: 49.5, dnTA: 51.9 });
  });

  it("keeps one-side A-only routes calculable and missing-input boundaries explicit", () => {
    const oneSideField = buildScenario({
      id: "compatible-anchor-a-weighted-one-side-field",
      rows: COMPATIBLE_ONE_SIDE_LSF_ROWS,
      surface: COMPLETE_FIELD_SURFACE
    });
    const oneSideBuilding = buildScenario({
      id: "compatible-anchor-a-weighted-one-side-building",
      rows: COMPATIBLE_ONE_SIDE_LSF_ROWS,
      surface: COMPLETE_BUILDING_SURFACE
    });
    const missingRt60 = buildScenario({
      id: "compatible-anchor-a-weighted-field-missing-rt60",
      surface: {
        ...COMPLETE_FIELD_SURFACE,
        receivingRoomRt60S: ""
      }
    });
    const mixedBuilding = buildScenario({
      id: "compatible-anchor-a-weighted-building-mixed",
      surface: COMPLETE_BUILDING_SURFACE,
      targetOutputs: FIELD_ALL_TARGETS
    });

    expectAWeightedFieldRuntime(oneSideField.result, { dnA: 48, dnTA: 50.4 });
    expectAWeightedBuildingRuntime(oneSideBuilding.result, { dnA: 48, dnTA: 50.4 });
    expect(buildCards(oneSideField.result, A_WEIGHTED_TARGETS)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ output: "Dn,A", value: "48 dB" }),
        expect.objectContaining({ output: "DnT,A", value: "50.4 dB" })
      ])
    );
    expect(buildCards(oneSideBuilding.result, A_WEIGHTED_TARGETS)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ output: "Dn,A", postureLabel: "Airborne building prediction", value: "48 dB" }),
        expect.objectContaining({ output: "DnT,A", postureLabel: "Airborne building prediction", value: "50.4 dB" })
      ])
    );

    expect(missingRt60.result.supportedTargetOutputs).toEqual([]);
    expect(missingRt60.result.unsupportedTargetOutputs).toEqual([...A_WEIGHTED_TARGETS]);
    expect(missingRt60.result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(getGateIAirborneFieldContextSurface(missingRt60.result)).toBeNull();

    expect(mixedBuilding.result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]);
    expect(mixedBuilding.result.unsupportedTargetOutputs).toEqual([]);
    expect(buildCards(mixedBuilding.result, FIELD_ALL_TARGETS)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ output: "Dn,A", postureLabel: "Airborne building prediction", value: "49.5 dB" }),
        expect.objectContaining({ output: "DnT,A", postureLabel: "Airborne building prediction", value: "51.9 dB" }),
      ])
    );
  });

  it("keeps docs and current-gate runner aligned with the landed A-weighted surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(contents, path).toContain(PREVIOUS_OWNER_FILE);
      expect(contents, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(contents, path).toContain(A_WEIGHTED_SURFACE_ACTION);
      expect(contents, path).toContain(A_WEIGHTED_SURFACE_FILE);
      expect(contents, path).toContain(A_WEIGHTED_SURFACE_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("webSurfaceParityContractFilesTouched: 1");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(A_WEIGHTED_SURFACE_FILE.replace("apps/web/", ""));
  });
});
