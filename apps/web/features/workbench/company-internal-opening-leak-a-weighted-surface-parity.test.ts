import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import {
  WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
  getCompanyInternalOpeningLeakFieldBuildingSurface
} from "./opening-leak-field-building-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { getScenarioCorridorSummary } from "./scenario-corridor-summary";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import { getTargetOutputCorridor, getTargetOutputStatus } from "./target-output-status";
import type { WorkbenchAirborneFieldContextInputSurfaceDraft } from "./airborne-field-context-input-surface";
import type {
  WorkbenchOpeningLeakCompositeInputSurfaceDraft
} from "./opening-leak-composite-input-surface";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const FIELD_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const HOST_WALL_ROWS: readonly LayerDraft[] = [
  { id: "gypsum", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "40" },
  { id: "fill", materialId: "rockwool", thicknessMm: "40" },
  { id: "concrete", materialId: "concrete", thicknessMm: "160" }
] as const;

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  id: "door-01",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

const COMPLETE_OPENING_SURFACE = {
  hostWallAreaM2: "12",
  elements: [
    {
      areaM2: "1.8",
      count: "1",
      elementRwDb: "32",
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies WorkbenchOpeningLeakCompositeInputSurfaceDraft;

const COMPLETE_FIELD_SURFACE = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  panelHeightMm: "2700",
  panelWidthMm: "4000",
  receivingRoomRt60S: "0.55",
  receivingRoomVolumeM3: "42"
} as const satisfies WorkbenchAirborneFieldContextInputSurfaceDraft;

const COMPLETE_BUILDING_SURFACE = {
  ...COMPLETE_FIELD_SURFACE,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: "4.8",
  sourceRoomVolumeM3: "38"
} as const satisfies WorkbenchAirborneFieldContextInputSurfaceDraft;

const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  hostWallAreaM2: 12,
  openingLeakFieldBuildingAdapterBoundary: true,
  openingLeakElements: [OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
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

function rowsFor(layers: readonly LayerInput[], id: string): LayerDraft[] {
  return layers.map((layer, index) => ({
    id: `${id}-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function withoutIds(rows: readonly LayerDraft[]): Array<Omit<LayerDraft, "id">> {
  return rows.map((row) => ({
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function openingSurfaceFromScenario(
  snapshot: Pick<ScenarioSnapshot, "airborneOpeningLeakElements" | "airborneOpeningLeakHostWallAreaM2">
): WorkbenchOpeningLeakCompositeInputSurfaceDraft {
  return {
    elements: snapshot.airborneOpeningLeakElements,
    hostWallAreaM2: snapshot.airborneOpeningLeakHostWallAreaM2
  };
}

function airborneFieldSurfaceFromScenario(
  snapshot: Pick<
    ScenarioSnapshot,
    | "airborneAirtightness"
    | "airborneBuildingPredictionOutputBasis"
    | "airborneConservativeFlankingAssumption"
    | "airborneContextMode"
    | "airborneFrequencyBandSet"
    | "airborneFlankingJunctionClass"
    | "airborneJunctionCouplingLengthM"
    | "airbornePanelHeightMm"
    | "airbornePanelWidthMm"
    | "airborneReceivingRoomRt60S"
    | "airborneReceivingRoomVolumeM3"
    | "airborneSourceRoomVolumeM3"
  >
): WorkbenchAirborneFieldContextInputSurfaceDraft {
  return {
    airtightness: snapshot.airborneAirtightness,
    buildingPredictionOutputBasis: snapshot.airborneBuildingPredictionOutputBasis,
    conservativeFlankingAssumption: snapshot.airborneConservativeFlankingAssumption,
    contextMode: snapshot.airborneContextMode,
    frequencyBandSet: snapshot.airborneFrequencyBandSet,
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
  airborneContext: AirborneContext;
  id: string;
  source?: "current" | "saved";
  targetOutputs: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: `Company internal opening/leak A-weighted surface ${input.id}`,
    rows: rowsFor(HOST_WALL, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-15T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function evaluateInputSurfaceScenario(input: {
  airborneFieldContextInputSurface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  id: string;
  openingLeakCompositeInputSurface?: WorkbenchOpeningLeakCompositeInputSurfaceDraft | null;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: input.airborneFieldContextInputSurface,
    calculator: "dynamic",
    id: input.id,
    name: `Company internal opening/leak A-weighted input surface ${input.id}`,
    openingLeakCompositeInputSurface: input.openingLeakCompositeInputSurface ?? COMPLETE_OPENING_SURFACE,
    rows: input.rows ?? HOST_WALL_ROWS,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });

  if (!scenario.result) {
    throw new Error(`Input-surface scenario ${input.id} did not evaluate`);
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

function buildReport(
  scenario: EvaluatedScenario,
  requestedOutputs: readonly RequestedOutputId[]
): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Company Internal Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Company Internal Opening Leak A-weighted Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
  });
}

function expectFieldAWeightedRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(36.4);
  expect(result.metrics.estimatedDnWDb).toBe(36.7);
  expect(result.metrics.estimatedDnTwDb).toBe(36.9);
  expect(result.metrics.estimatedDnADb).toBe(35.9);
  expect(result.metrics.estimatedDnTADb).toBe(36.1);
  expect(result.airborneBasis).toMatchObject({
    errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
    frequencyBands: { bandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET },
    method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
    COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
  );
  expect(result.warnings).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING);
}

function expectBuildingAWeightedRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "DnT,A"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "Dn,w", "Dn,A"]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(31.6);
  expect(result.metrics.estimatedDnTwDb).toBe(32.1);
  expect(result.metrics.estimatedDnADb).toBeUndefined();
  expect(result.metrics.estimatedDnTADb).toBe(31.3);
  expect(result.airborneBasis).toMatchObject({
    errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
    frequencyBands: { bandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET },
    method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
    COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
  );
}

async function saveCompleteAWeightedBuildingStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(HOST_WALL_ROWS));
  store.setRequestedOutputs([...BUILDING_TARGETS]);
  store.setAirborneContextMode("building_prediction");
  store.setAirborneFrequencyBandSet(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET);
  store.setAirborneOpeningLeakHostWallAreaM2(COMPLETE_OPENING_SURFACE.hostWallAreaM2);
  store.replaceAirborneOpeningLeakElements(COMPLETE_OPENING_SURFACE.elements);
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
    throw new Error("Expected the workbench store to save the A-weighted opening/leak snapshot.");
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

describe("company-internal opening/leak A-weighted surface parity", () => {
  it("keeps web A-weighted identifiers aligned with the engine runtime constants", () => {
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING
    );
  });

  it("shows field Dn,A / DnT,A on cards, scenario, dossiers, report, and API payload", async () => {
    const scenario = buildScenario({
      airborneContext: FIELD_CONTEXT,
      id: "opening-leak-a-weighted-field",
      targetOutputs: FIELD_TARGETS
    });
    const result = scenario.result;
    const [rwCard, stcCard, rwPrimeCard, dnWCard, dnTCard, dnACard, dnTACard] = buildCards(
      result,
      FIELD_TARGETS
    );
    const surface = getCompanyInternalOpeningLeakFieldBuildingSurface(result);

    expectFieldAWeightedRuntime(result);
    expect(surface).toMatchObject({
      aWeighted: true,
      budgetLabel: "+/-9 dB",
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      label: "Opening/leak A-weighted field adapter",
      method: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      routeBasis: "field_between_rooms"
    });
    expect(surface?.detail).toContain("Dn,A 35.9 dB");
    expect(surface?.detail).toContain("DnT,A 36.1 dB");
    expect(surface?.detail).toContain("third_octave_100_3150");

    for (const [card, value] of [
      [rwPrimeCard, "36.4 dB"],
      [dnWCard, "36.7 dB"],
      [dnTCard, "36.9 dB"],
      [dnACard, "35.9 dB"],
      [dnTACard, "36.1 dB"]
    ] as const) {
      expect(card).toMatchObject({
        postureLabel: "Opening/leak A-weighted field adapter",
        status: "live",
        value
      });
      expect(card.detail).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD);
      expect(card.detail).toContain("+/-9 dB source-absent field budget");
    }

    for (const card of [rwCard, stcCard]) {
      expect(card).toMatchObject({
        postureLabel: "Opening/leak field/building boundary",
        status: "unsupported",
        value: "Not ready"
      });
      expect(card.detail).toContain("remains unsupported");
      expect(card.detail).toContain("not a lab Rw/STC alias");
    }

    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    expect(branch).toMatchObject({
      tone: "ready",
      value: "Opening/leak A-weighted field adapter"
    });
    expect(branch.detail).toContain("DnT,A 36.1 dB");

    const summary = getScenarioCorridorSummary(result);
    expect(summary.airborneLabel).toBe("Opening/leak A-weighted field adapter");
    expect(summary.airborneProvenanceLabel).toBe("Opening/leak A-weighted field adapter");
    expect(summary.airborneProvenanceDetail).toContain("+/-9 dB source-absent field budget");

    const targetStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,A",
      result
    });
    expect(targetStatus).toMatchObject({
      kind: "engine_live",
      label: "Room-standardized"
    });
    expect(targetStatus.note).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID);

    const targetCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "DnT,A",
      result
    });
    expect(targetCorridor.detail).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD);

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: branch.detail,
      branchLabel: branch.value,
      contextLabel: "Room-to-room field",
      coverageItems: buildCards(result, FIELD_TARGETS),
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "Visible wall rows feed the A-weighted opening/leak field adapter.",
      studyModeLabel: "Wall",
      validationDetail: "Opening/leak A-weighted field adapter runtime remains active.",
      validationLabel: "Opening/leak A-weighted field adapter",
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup?.value).toBe("Opening/leak A-weighted field adapter");
    expect(airborneTraceGroup?.notes).toEqual(
      expect.arrayContaining([
        `Opening/leak A-weighted field adapter selected candidate ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID} through ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD}.`,
        "Field uncertainty remains +/-9 dB; this is source-absent and not measured evidence.",
        COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_WARNING
      ])
    );

    const report = buildReport(scenario, FIELD_TARGETS);
    expect(report).toContain(
      `- Airborne opening/leak field basis: Opening/leak A-weighted field adapter (candidate ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID}; method ${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD}; route field_between_rooms).`
    );
    expect(report).toContain(
      "- Airborne opening/leak field values: R'w 36.4 dB, Dn,w 36.7 dB, DnT,w 36.9 dB, Dn,A 35.9 dB, and DnT,A 36.1 dB; source-absent budget +/-9 dB; not measured evidence yes."
    );
    expect(report).toContain("frequency band set third_octave_100_3150");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: FIELD_TARGETS
      })
    );
    const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result?.metrics.estimatedDnADb).toBe(35.9);
    expect(body.result?.metrics.estimatedDnTADb).toBe(36.1);
    expect(body.result?.airborneBasis?.method).toBe(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD);
  });

  it("keeps UI-derived saved and server building replay on DnT,A while Dn,A stays parked", async () => {
    const liveScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: COMPLETE_BUILDING_SURFACE,
      id: "opening-leak-a-weighted-building-live",
      targetOutputs: BUILDING_TARGETS
    });
    expectBuildingAWeightedRuntime(liveScenario.result);

    const liveSurface = getCompanyInternalOpeningLeakFieldBuildingSurface(liveScenario.result);
    expect(liveSurface).toMatchObject({
      aWeighted: true,
      budgetLabel: "+/-11 dB",
      label: "Opening/leak A-weighted building adapter",
      routeBasis: "building_prediction"
    });

    const liveCards = buildCards(liveScenario.result, BUILDING_TARGETS);
    const dntACard = liveCards.find((card) => card.output === "DnT,A");
    const dnACard = liveCards.find((card) => card.output === "Dn,A");
    expect(dntACard).toMatchObject({
      postureLabel: "Opening/leak A-weighted building adapter",
      status: "live",
      value: "31.3 dB"
    });
    expect(dnACard).toMatchObject({
      postureLabel: "Opening/leak field/building boundary",
      status: "unsupported",
      value: "Not ready"
    });
    expect(dnACard?.detail).toContain("not a building Dn,A shortcut");

    const savedSnapshot = await saveCompleteAWeightedBuildingStoreSnapshot();
    expect(savedSnapshot.airborneFrequencyBandSet).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
    );

    const savedScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: airborneFieldSurfaceFromScenario(savedSnapshot),
      id: "opening-leak-a-weighted-building-saved",
      openingLeakCompositeInputSurface: openingSurfaceFromScenario(savedSnapshot),
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectBuildingAWeightedRuntime(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot?.airborneFrequencyBandSet).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
    );

    const serverScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: airborneFieldSurfaceFromScenario(parsedServerSnapshot as ScenarioSnapshot),
      id: "opening-leak-a-weighted-building-server",
      openingLeakCompositeInputSurface: openingSurfaceFromScenario(parsedServerSnapshot as ScenarioSnapshot),
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? BUILDING_TARGETS
    });
    expectBuildingAWeightedRuntime(serverScenario.result);

    const report = buildReport(savedScenario, BUILDING_TARGETS);
    expect(report).toContain(
      "- Airborne opening/leak building values: R'w 31.6 dB, DnT,w 32.1 dB, and DnT,A 31.3 dB; source-absent budget +/-11 dB; not measured evidence yes."
    );
  });
});
