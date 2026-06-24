import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING,
  getGateARAirborneBuildingPredictionSurface
} from "./airborne-building-prediction-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { getScenarioCorridorSummary } from "./scenario-corridor-summary";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import { getTargetOutputCorridor, getTargetOutputStatus } from "./target-output-status";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const BUILDING_TARGETS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const BROAD_WALL_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

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

function buildScenario(input: {
  id: string;
  source?: "current" | "saved";
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: COMPLETE_BUILDING_CONTEXT,
    calculator: "dynamic",
    id: input.id,
    name: `Gate AS building-prediction surface ${input.id}`,
    rows: rowsFor(HOST_WALL, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-12T14:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? BUILDING_TARGETS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): readonly OutputCardModel[] {
  return BROAD_WALL_TARGETS.map((output) =>
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
    clientName: "Gate AS Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AS Airborne Building Prediction Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: BROAD_WALL_TARGETS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "55"
  });
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));

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

describe("airborne building-prediction surface parity", () => {
  it("keeps web Gate AR identifiers aligned with the engine constants", () => {
    expect(WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD).toBe(
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    );
    expect(WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID).toBe(
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    );
    expect(WEB_GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING).toBe(
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
    );
  });

  it("shows the same building-prediction basis on cards, scenario, dossiers, target status, and Markdown report", () => {
    const scenario = buildScenario({
      id: "gate_as_complete_building",
      targetOutputs: BROAD_WALL_TARGETS
    });
    const result = scenario.result;
    const [rwCard, stcCard, rwPrimeCard, dntCard] = buildCards(result);
    const surface = getGateARAirborneBuildingPredictionSurface(result);

    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics.estimatedRwDb).toBe(60);
    expect(result.metrics.estimatedStc).toBe(60);
    expect(result.metrics.estimatedRwPrimeDb).toBe(58);
    expect(result.metrics.estimatedDnTwDb).toBe(59);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 9,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);

    expect(surface).toMatchObject({
      budgetLabel: "+/-9 dB",
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      label: "Airborne building prediction",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(surface?.detail).toContain("R'w 58 dB and DnT,w 59 dB");
    expect(surface?.detail).toContain("not measured building evidence");
    expect(surface?.detail).toContain("not a lab Rw/STC relabel");
    expect(surface?.detail).toContain("Requested lab companions stay on the direct element-lab curve: Rw, STC");

    for (const card of [rwPrimeCard, dntCard]) {
      expect(card).toMatchObject({
        postureLabel: "Airborne building prediction",
        status: "live"
      });
      expect(card.detail).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID);
      expect(card.detail).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(card.detail).toContain("+/-9 dB source-absent building-prediction budget");
      expect(card.detail).toContain("not measured building evidence");
    }
    expect(rwPrimeCard.value).toBe("58 dB");
    expect(dntCard.value).toBe("59 dB");

    expect(rwCard).toMatchObject({
      status: "live",
      value: "60 dB"
    });
    expect(rwCard.postureDetail).toContain("Requested lab companions stay on the direct element-lab curve: Rw, STC");
    expect(stcCard).toMatchObject({
      status: "live",
      value: "60 dB"
    });
    expect(stcCard.postureDetail).toContain("companion term derived from the primary live lane");

    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    expect(branch).toMatchObject({
      tone: "ready",
      value: "Airborne building prediction"
    });
    expect(branch.detail).toContain("R'w 58 dB and DnT,w 59 dB");

    const summary = getScenarioCorridorSummary(result);
    expect(summary.airborneLabel).toBe("Airborne building prediction");
    expect(summary.airborneProvenanceLabel).toBe("Airborne building prediction");
    expect(summary.airborneProvenanceDetail).toContain("+/-9 dB source-absent building-prediction budget");

    const targetStatus = getTargetOutputStatus({
      guideResult: null,
      output: "R'w",
      result
    });
    expect(targetStatus).toMatchObject({
      kind: "engine_live",
      label: "Building apparent"
    });
    expect(targetStatus.note).toContain("Gate AR airborne building-prediction runtime");

    const targetCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "R'w",
      result
    });
    expect(targetCorridor).toMatchObject({
      laneLabel: "Field airborne lane",
      modeLabel: "Building prediction"
    });
    expect(targetCorridor.detail).toContain("not measured building evidence");

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    expect(corridorDossier.headline).toContain("Airborne building prediction");
    expect(corridorDossier.cards.find((card) => card.label === "Field route")?.detail).toContain(
      "+/-9 dB"
    );

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: branch.detail,
      branchLabel: branch.value,
      contextLabel: "Building prediction",
      coverageItems: buildCards(result),
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "Visible wall rows feed the Gate AS building-prediction surface parity route.",
      studyModeLabel: "Wall",
      validationDetail: "Gate AR airborne building-prediction runtime remains active.",
      validationLabel: "Airborne building prediction",
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup?.value).toBe("Airborne building prediction");
    expect(airborneTraceGroup?.notes).toEqual(
      expect.arrayContaining([
        `Gate AR building-prediction candidate ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID} is selected through ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD}.`,
        "Building uncertainty remains +/-9 dB; this is not measured building evidence and is not a lab Rw/STC relabel.",
        GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain(
      `- Airborne building basis: Gate AR all-owner building-prediction runtime (candidate ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID}; method ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD}).`
    );
    expect(report).toContain(
      "- Airborne building values: R'w 58 dB and DnT,w 59 dB; source-absent budget +/-9 dB; not measured building evidence yes."
    );
    expect(report).toContain(
      "- Airborne building owners: direct separating-element curve, flanking/junction context, junction coupling length, room standardization, and uncertainty budget are explicit."
    );
    expect(report).toContain(`- Airborne building warning: ${GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING}`);
  });

  it("keeps saved replay and calculator API payloads on the same Gate AR building basis", async () => {
    const savedScenario = buildScenario({
      id: "gate_as_complete_building_saved",
      source: "saved"
    });
    const [rwPrimeCard, dntCard] = buildCards(savedScenario.result).slice(2);

    expect(savedScenario.source).toBe("saved");
    expect(rwPrimeCard.value).toBe("58 dB");
    expect(dntCard.value).toBe("59 dB");
    expect(getGateARAirborneBuildingPredictionSurface(savedScenario.result)?.budgetLabel).toBe("+/-9 dB");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: COMPLETE_BUILDING_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: BROAD_WALL_TARGETS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result?.metrics.estimatedRwPrimeDb).toBe(58);
    expect(body.result?.metrics.estimatedDnTwDb).toBe(59);
    expect(body.result?.supportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(body.result?.unsupportedTargetOutputs).toEqual([]);
    expect(body.result?.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(body.result?.airborneBasis?.errorBudgetDb).toBe(9);
    expect(body.result?.airborneCandidateResolution?.selectedCandidateId).toBe(
      GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
    );
    expect(body.result?.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
  });
});
