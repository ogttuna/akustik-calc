import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  getCompanyInternalOpeningLeakFieldBuildingSurface
} from "./opening-leak-field-building-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import {
  buildWorkbenchAirborneFieldContextInputSurface,
  type WorkbenchAirborneFieldContextInputSurfaceDraft
} from "./airborne-field-context-input-surface";
import {
  buildWorkbenchOpeningLeakCompositeInputSurface,
  type WorkbenchOpeningLeakCompositeInputSurfaceDraft
} from "./opening-leak-composite-input-surface";
import { buildWorkbenchOpeningLeakFieldBuildingInputSurface } from "./opening-leak-field-building-input-surface";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const FIELD_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const HOST_WALL_ROWS: readonly LayerDraft[] = [
  { id: "gypsum", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "gap", materialId: "air_gap", thicknessMm: "40" },
  { id: "fill", materialId: "rockwool", thicknessMm: "40" },
  { id: "concrete", materialId: "concrete", thicknessMm: "160" }
];

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
    flankingJunctionClass: snapshot.airborneFlankingJunctionClass,
    junctionCouplingLengthM: snapshot.airborneJunctionCouplingLengthM,
    panelHeightMm: snapshot.airbornePanelHeightMm,
    panelWidthMm: snapshot.airbornePanelWidthMm,
    receivingRoomRt60S: snapshot.airborneReceivingRoomRt60S,
    receivingRoomVolumeM3: snapshot.airborneReceivingRoomVolumeM3,
    sourceRoomVolumeM3: snapshot.airborneSourceRoomVolumeM3
  };
}

function evaluateInputSurfaceScenario(input: {
  airborneFieldContextInputSurface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  id?: string;
  openingLeakCompositeInputSurface?: WorkbenchOpeningLeakCompositeInputSurfaceDraft | null;
  rows?: readonly LayerDraft[];
  source?: "current" | "saved";
  targetOutputs: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: input.airborneFieldContextInputSurface,
    calculator: "dynamic",
    id: input.id ?? "company-internal-opening-leak-building-input-surface",
    name: "Company internal opening/leak building input surface",
    openingLeakCompositeInputSurface: input.openingLeakCompositeInputSurface ?? COMPLETE_OPENING_SURFACE,
    rows: input.rows ?? HOST_WALL_ROWS,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });

  if (!scenario.result) {
    throw new Error("Company-internal opening/leak input-surface scenario did not evaluate.");
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildReport(scenario: EvaluatedScenario, requestedOutputs: readonly RequestedOutputId[]): string {
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
    projectName: "Company Internal Opening Leak Building Input Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
  });
}

function buildApiContext(input: {
  fieldSurface: WorkbenchAirborneFieldContextInputSurfaceDraft;
  openingSurface: WorkbenchOpeningLeakCompositeInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): AirborneContext {
  const fieldSurface = buildWorkbenchAirborneFieldContextInputSurface({
    studyMode: "wall",
    surface: input.fieldSurface,
    targetOutputs: input.targetOutputs
  });
  const openingSurface = buildWorkbenchOpeningLeakCompositeInputSurface({
    studyMode: "wall",
    surface: input.openingSurface,
    targetOutputs: input.targetOutputs
  });
  const fieldBuildingSurface = buildWorkbenchOpeningLeakFieldBuildingInputSurface({
    contextMode: fieldSurface.airborneContext.contextMode,
    openingLeakCompositeInputSurface: openingSurface,
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });

  return {
    ...fieldSurface.airborneContext,
    ...openingSurface.airborneContextPatch,
    ...fieldBuildingSurface.airborneContextPatch
  };
}

function expectFieldRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "Dn,A", "DnT,A"]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(36.4);
  expect(result.metrics.estimatedDnWDb).toBe(36.7);
  expect(result.metrics.estimatedDnTwDb).toBe(36.9);
  expect(result.airborneBasis).toMatchObject({
    errorBudgetDb: 8,
    method: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
    COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
  );
}

function expectBuildingRuntime(result: AssemblyCalculation): void {
  expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
  expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "Dn,A", "DnT,A"]);
  expect(result.metrics.estimatedRwPrimeDb).toBe(31.6);
  expect(result.metrics.estimatedDnWDb).toBe(31.9);
  expect(result.metrics.estimatedDnTwDb).toBe(32.1);
  expect(result.airborneBasis).toMatchObject({
    errorBudgetDb: 10,
    method: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
    COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID
  );
}

async function saveCompleteBuildingStoreSnapshot(): Promise<ScenarioSnapshot> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore.getState();
  store.reset();
  store.startStudyMode("wall");
  store.clearRows();
  store.appendRows(withoutIds(HOST_WALL_ROWS));
  store.setRequestedOutputs([...BUILDING_TARGETS]);
  store.setAirborneContextMode("building_prediction");
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
    throw new Error("Expected the workbench store to save the building opening/leak snapshot.");
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

describe("company-internal opening/leak field/building input surface", () => {
  it("feeds the field adapter from UI-derived opening and room fields across cards, report, and API", async () => {
    const scenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: COMPLETE_FIELD_SURFACE,
      id: "opening-leak-field-input-surface",
      targetOutputs: FIELD_TARGETS
    });
    expectFieldRuntime(scenario.result);

    const fieldSurface = getCompanyInternalOpeningLeakFieldBuildingSurface(scenario.result);
    const rwPrimeCard = addOutputCardPosture(
      buildOutputCard({ output: "R'w", result: scenario.result, studyMode: "wall" }),
      { result: scenario.result, studyMode: "wall" }
    );
    expect(fieldSurface).toMatchObject({
      budgetLabel: "+/-8 dB",
      label: "Opening/leak field adapter",
      routeBasis: "field_between_rooms"
    });
    expect(rwPrimeCard).toMatchObject({
      postureLabel: "Opening/leak field adapter",
      status: "live",
      value: "36.4 dB"
    });

    const report = buildReport(scenario, FIELD_TARGETS);
    expect(report).toContain(
      `- Airborne opening/leak field basis: Opening/leak field adapter (candidate ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID}; method ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD}; route field_between_rooms).`
    );

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: buildApiContext({
          fieldSurface: COMPLETE_FIELD_SURFACE,
          openingSurface: COMPLETE_OPENING_SURFACE,
          targetOutputs: FIELD_TARGETS
        }),
        calculator: "dynamic",
        layers: toLayerInputs(HOST_WALL_ROWS),
        targetOutputs: FIELD_TARGETS
      })
    );
    const body = (await response.json()) as { ok?: boolean; result?: AssemblyCalculation };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result).toBeDefined();
    expectFieldRuntime(body.result as AssemblyCalculation);
  });

  it("keeps saved and server building replay on the building adapter basis", async () => {
    const liveScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: COMPLETE_BUILDING_SURFACE,
      id: "opening-leak-building-input-surface",
      targetOutputs: BUILDING_TARGETS
    });
    expectBuildingRuntime(liveScenario.result);

    const buildingSurface = getCompanyInternalOpeningLeakFieldBuildingSurface(liveScenario.result);
    expect(buildingSurface).toMatchObject({
      budgetLabel: "+/-10 dB",
      label: "Opening/leak building adapter",
      routeBasis: "building_prediction"
    });

    const report = buildReport(liveScenario, BUILDING_TARGETS);
    expect(report).toContain(
      `- Airborne opening/leak building basis: Opening/leak building adapter (candidate ${COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID}; method ${COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD}; route building_prediction).`
    );

    const savedSnapshot = await saveCompleteBuildingStoreSnapshot();
    expect(savedSnapshot.airborneSourceRoomVolumeM3).toBe("38");
    expect(savedSnapshot.airborneFlankingJunctionClass).toBe("rigid_t_junction");
    expect(savedSnapshot.airborneConservativeFlankingAssumption).toBe("multi_path_conservative");
    expect(savedSnapshot.airborneJunctionCouplingLengthM).toBe("4.8");
    expect(savedSnapshot.airborneBuildingPredictionOutputBasis).toBe("apparent_and_standardized");

    const savedScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: airborneFieldSurfaceFromScenario(savedSnapshot),
      id: "opening-leak-building-saved-input-surface",
      openingLeakCompositeInputSurface: openingSurfaceFromScenario(savedSnapshot),
      rows: savedSnapshot.rows,
      source: "saved",
      targetOutputs: savedSnapshot.requestedOutputs
    });
    expectBuildingRuntime(savedScenario.result);

    const parsedServerSnapshot = parseServerProjectWorkbenchSnapshot(
      buildServerProjectWorkbenchSnapshot(savedSnapshot)
    );
    expect(parsedServerSnapshot).not.toBeNull();

    const serverScenario = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: airborneFieldSurfaceFromScenario(parsedServerSnapshot as ScenarioSnapshot),
      id: "opening-leak-building-server-input-surface",
      openingLeakCompositeInputSurface: openingSurfaceFromScenario(parsedServerSnapshot as ScenarioSnapshot),
      rows: parsedServerSnapshot?.rows,
      source: "saved",
      targetOutputs: parsedServerSnapshot?.requestedOutputs ?? BUILDING_TARGETS
    });
    expectBuildingRuntime(serverScenario.result);
  });

  it("does not set a runtime adapter when building owners or opening fields are missing or hostile", () => {
    const missingBuildingOwner = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: {
        ...COMPLETE_BUILDING_SURFACE,
        sourceRoomVolumeM3: ""
      },
      targetOutputs: BUILDING_TARGETS
    });
    expect(missingBuildingOwner.result.airborneBasis?.origin).toBe("needs_input");
    expect(missingBuildingOwner.result.airborneBasis?.missingPhysicalInputs).toContain("sourceRoomVolumeM3");
    expect(getCompanyInternalOpeningLeakFieldBuildingSurface(missingBuildingOwner.result)).toBeNull();

    const duplicateOpening = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: COMPLETE_FIELD_SURFACE,
      openingLeakCompositeInputSurface: {
        hostWallAreaM2: "12",
        elements: [
          COMPLETE_OPENING_SURFACE.elements[0]!,
          COMPLETE_OPENING_SURFACE.elements[0]!
        ]
      },
      targetOutputs: FIELD_TARGETS
    });
    expect(duplicateOpening.result.airborneBasis?.origin).toBe("unsupported");
    expect(duplicateOpening.result.airborneBasis?.errorBudgetDb).toBeUndefined();
    expect(getCompanyInternalOpeningLeakFieldBuildingSurface(duplicateOpening.result)).toBeNull();

    const labOnly = evaluateInputSurfaceScenario({
      airborneFieldContextInputSurface: {
        ...COMPLETE_FIELD_SURFACE,
        contextMode: "element_lab"
      },
      targetOutputs: FIELD_TARGETS
    });
    expect(labOnly.result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(labOnly.result.unsupportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"]);
    expect(getCompanyInternalOpeningLeakFieldBuildingSurface(labOnly.result)).toBeNull();
  });
});
