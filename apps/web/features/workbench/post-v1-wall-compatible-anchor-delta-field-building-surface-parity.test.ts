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
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));
const SURFACE_PARITY_ACTION = "post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan";
const SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts";
const SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner";
const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta lab metric companion owner";
const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;
const FIELD_BUILDING_TARGETS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_UNOWNED_TARGETS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A",
  "STC"
] as const satisfies readonly RequestedOutputId[];

const COMPATIBLE_ANCHOR_WARNING_PREFIX = "Compatible measured-anchor delta active";
const COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX = "Compatible anchor-delta field/building adapter active";

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
    name: `Compatible anchor-delta field/building surface ${input.id}`,
    rows: input.rows ?? COMPATIBLE_LSF_ROWS,
    savedAtIso: input.source === "saved" ? "2026-06-10T08:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? FIELD_BUILDING_TARGETS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate.`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): readonly OutputCardModel[] {
  return FIELD_BUILDING_TARGETS.map((output) =>
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
    projectName: "Compatible Anchor-Delta Field Building Surface",
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

function expectCompatibleFieldRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_TARGETS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTwDb: 53,
    estimatedDnWDb: 51,
    estimatedRwDb: 59,
    estimatedRwPrimeDb: 50
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "exactReducedStackSourceRow",
      "compatibleExteriorBoardDelta",
      "GateI_or_GateAR_field_building_adapter_owner",
      "fieldContext.receivingRoomRt60S"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
    supportedMetrics: [...FIELD_BUILDING_TARGETS]
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      expect.stringContaining(COMPATIBLE_ANCHOR_WARNING_PREFIX),
      expect.stringContaining(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX)
    ])
  );
}

function expectCompatibleBuildingRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_TARGETS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedDnTwDb: 53,
    estimatedDnWDb: 51,
    estimatedRwDb: 59,
    estimatedRwPrimeDb: 50
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "exactReducedStackSourceRow",
      "compatibleExteriorBoardDelta",
      "GateI_or_GateAR_field_building_adapter_owner",
      "buildingPredictionOutputBasis"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    supportedMetrics: [...FIELD_BUILDING_TARGETS]
  });
  expect(result.warnings).toEqual(
    expect.arrayContaining([
      expect.stringContaining(COMPATIBLE_ANCHOR_WARNING_PREFIX),
      expect.stringContaining(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX)
    ])
  );
}

async function saveCompleteBuildingSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();

  store.reset();
  store.startStudyMode("wall");
  store.setCalculatorId("dynamic");
  store.clearRows();
  store.appendRows(withoutIds(COMPATIBLE_LSF_ROWS));
  store.setRequestedOutputs([...FIELD_BUILDING_TARGETS]);
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
    throw new Error("Expected the workbench store to save the compatible anchor-delta snapshot.");
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

describe("post-V1 wall compatible anchor-delta field/building surface parity", () => {
  it("feeds the UI-derived field surface through cards, report, and calculator API", async () => {
    const scenario = buildScenario({
      id: "compatible-anchor-field-live",
      surface: COMPLETE_FIELD_SURFACE
    });
    const result = scenario.result;
    const [rwPrimeCard, dnWCard, dnTwCard] = buildCards(result);

    expectCompatibleFieldRuntime(result);
    expect(getGateIAirborneFieldContextSurface(result)).toMatchObject({
      budgetLabel: "+/-7 dB",
      candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      label: "Airborne field-context prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
    });
    expect(rwPrimeCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "50 dB"
    });
    expect(dnWCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "51 dB"
    });
    expect(dnTwCard).toMatchObject({
      postureLabel: "Airborne field-context prediction",
      status: "live",
      value: "53 dB"
    });
    expect(dnWCard.detail).toContain("Dn,w is being derived from the same apparent field curve");
    expect(scenario.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining(COMPATIBLE_ANCHOR_WARNING_PREFIX),
        expect.stringContaining(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX)
      ])
    );

    const report = buildReport(scenario, FIELD_BUILDING_TARGETS);
    expect(report).toContain("Airborne field basis: Gate I airborne field/apparent context adapter");
    expect(report).toContain("Airborne field error budget: R'w/DnT,w use +/-7 dB");
    expect(report).toContain(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX);

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: buildApiContext({
          surface: COMPLETE_FIELD_SURFACE,
          targetOutputs: FIELD_BUILDING_TARGETS
        }),
        calculator: "dynamic",
        layers: toLayerInputs(COMPATIBLE_LSF_ROWS),
        targetOutputs: FIELD_BUILDING_TARGETS
      })
    );
    const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result).toBeDefined();
    expectCompatibleFieldRuntime(body.result as AssemblyCalculation);
  });

  it("keeps saved and server building replay on the Gate AR compatible anchor-delta basis", async () => {
    const liveScenario = buildScenario({
      id: "compatible-anchor-building-live",
      surface: COMPLETE_BUILDING_SURFACE
    });
    expectCompatibleBuildingRuntime(liveScenario.result);

    const buildingSurface = getGateARAirborneBuildingPredictionSurface(liveScenario.result);
    expect(buildingSurface).toMatchObject({
      budgetLabel: "+/-9 dB",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      label: "Airborne building prediction",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(buildingSurface?.detail).toContain("R'w 50 dB, Dn,w 51 dB and DnT,w 53 dB");

    const report = buildReport(liveScenario, FIELD_BUILDING_TARGETS);
    expect(report).toContain(
      `Airborne building basis: Gate AR all-owner building-prediction runtime (candidate ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID}; method ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD}).`
    );
    expect(report).toContain("Airborne building values: R'w 50 dB, Dn,w 51 dB and DnT,w 53 dB");

    const savedSnapshot = await saveCompleteBuildingSnapshot();
    expect(savedSnapshot.airborneConnectionType).toBe("line_connection");
    expect(savedSnapshot.airborneStudType).toBe("light_steel_stud");
    expect(savedSnapshot.airborneStudSpacingMm).toBe("600");
    expect(savedSnapshot.airborneBuildingPredictionOutputBasis).toBe("apparent_and_standardized");

    const savedScenario = buildScenario({
      id: "compatible-anchor-building-saved",
      rows: savedSnapshot.rows,
      source: "saved",
      surface: airborneFieldSurfaceFromSnapshot(savedSnapshot),
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectCompatibleBuildingRuntime(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = buildScenario({
      id: "compatible-anchor-building-server",
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      surface: airborneFieldSurfaceFromSnapshot(parsedServerSnapshot as ScenarioSnapshot),
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? FIELD_BUILDING_TARGETS
    });
    expectCompatibleBuildingRuntime(serverScenario.result);
  });

  it("keeps missing inputs and unowned metric aliases parked on the web surface", () => {
    const missingRt60 = buildScenario({
      id: "compatible-anchor-field-missing-rt60",
      surface: {
        ...COMPLETE_FIELD_SURFACE,
        receivingRoomRt60S: ""
      }
    });
    const buildingMixed = buildScenario({
      id: "compatible-anchor-building-mixed-unowned",
      surface: COMPLETE_BUILDING_SURFACE,
      targetOutputs: MIXED_UNOWNED_TARGETS
    });

    expect(missingRt60.result.supportedTargetOutputs).toEqual([]);
    expect(missingRt60.result.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_TARGETS]);
    expect(missingRt60.result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(getGateIAirborneFieldContextSurface(missingRt60.result)).toBeNull();

    expect(buildingMixed.result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_TARGETS, "Dn,A", "DnT,A"]);
    expect(buildingMixed.result.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(getGateARAirborneBuildingPredictionSurface(buildingMixed.result)).not.toBeNull();
    const dnACard = addOutputCardPosture(
      buildOutputCard({ output: "Dn,A", result: buildingMixed.result, studyMode: "wall" }),
      { result: buildingMixed.result, studyMode: "wall" }
    );
    const dntACard = addOutputCardPosture(
      buildOutputCard({ output: "DnT,A", result: buildingMixed.result, studyMode: "wall" }),
      { result: buildingMixed.result, studyMode: "wall" }
    );
    expect(dnACard.status).not.toBe("unsupported");
    expect(dnACard.value).toContain("49.5");
    expect(dntACard.status).not.toBe("unsupported");
    expect(dntACard.value).toContain("51.9");
    for (const output of ["STC"] as const satisfies readonly RequestedOutputId[]) {
      const card = addOutputCardPosture(
        buildOutputCard({ output, result: buildingMixed.result, studyMode: "wall" }),
        { result: buildingMixed.result, studyMode: "wall" }
      );
      expect(card.status).toBe("unsupported");
      expect(card.value).not.toMatch(/\d/);
    }
    expect(buildingMixed.result.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining(COMPATIBLE_FIELD_BUILDING_WARNING_PREFIX)])
    );
    expect(buildingMixed.result.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A")])
    );
  });

  it("keeps docs and the current-gate runner aligned with the landed surface parity and selected metric owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(SURFACE_PARITY_ACTION);
      expect(contents, path).toContain(SURFACE_PARITY_FILE);
      expect(contents, path).toContain(SURFACE_PARITY_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("webSurfaceParityContractFilesTouched: 1");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts"
    );
  });
});
