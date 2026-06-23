import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import {
  WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
  WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING,
  getCompanyInternalOpeningLeakFieldBuildingSurface
} from "./opening-leak-field-building-surface";
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
const FIELD_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_TARGETS = ["Rw", "STC", "R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
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

const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  hostWallAreaM2: 12,
  openingLeakFieldBuildingAdapterBoundary: true,
  openingLeakElements: [OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const BUILDING_CONTEXT: AirborneContext = {
  ...FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
};

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
  airborneContext: AirborneContext;
  id: string;
  source?: "current" | "saved";
  targetOutputs: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: `Company internal opening/leak field-building surface ${input.id}`,
    rows: rowsFor(HOST_WALL, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-14T18:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate`);
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
    projectName: "Company Internal Opening Leak Field Building Surface",
    reportProfile: "consultant",
    requestedOutputs,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "45"
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

describe("company-internal opening/leak field/building surface parity", () => {
  it("keeps web identifiers aligned with the engine runtime constants", () => {
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID
    );
    expect(WEB_COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING
    );
  });

  it("shows the same field opening/leak basis on cards, scenario, dossiers, report, and API payload", async () => {
    const scenario = buildScenario({
      airborneContext: FIELD_CONTEXT,
      id: "company_internal_opening_leak_field",
      targetOutputs: FIELD_TARGETS
    });
    const result = scenario.result;
    const [rwCard, stcCard, rwPrimeCard, dnWCard, dnTCard, dnACard, dnTACard] = buildCards(
      result,
      FIELD_TARGETS
    );
    const surface = getCompanyInternalOpeningLeakFieldBuildingSurface(result);

    expect(result.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "Dn,A", "DnT,A"]);
    expect(result.metrics.estimatedRwDb).toBe(38.2);
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
    expect(result.warnings).toContain(COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING);

    expect(surface).toMatchObject({
      budgetLabel: "+/-8 dB",
      candidateId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
      label: "Opening/leak field adapter",
      method: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      routeBasis: "field_between_rooms"
    });
    expect(surface?.detail).toContain("R'w 36.4 dB, Dn,w 36.7 dB, and DnT,w 36.9 dB");
    expect(surface?.detail).toContain("not measured field evidence");
    expect(surface?.detail).toContain("not a lab Rw/STC alias");

    for (const [card, value] of [
      [rwPrimeCard, "36.4 dB"],
      [dnWCard, "36.7 dB"],
      [dnTCard, "36.9 dB"]
    ] as const) {
      expect(card).toMatchObject({
        postureLabel: "Opening/leak field adapter",
        status: "live",
        value
      });
      expect(card.detail).toContain(COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD);
      expect(card.detail).toContain("+/-8 dB source-absent field budget");
    }

    for (const card of [rwCard, stcCard, dnACard, dnTACard]) {
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
      value: "Opening/leak field adapter"
    });
    expect(branch.detail).toContain("DnT,w 36.9 dB");

    const summary = getScenarioCorridorSummary(result);
    expect(summary.airborneLabel).toBe("Opening/leak field adapter");
    expect(summary.airborneProvenanceLabel).toBe("Opening/leak field adapter");
    expect(summary.airborneProvenanceDetail).toContain("+/-8 dB source-absent field budget");

    const targetStatus = getTargetOutputStatus({
      guideResult: null,
      output: "R'w",
      result
    });
    expect(targetStatus).toMatchObject({
      kind: "engine_live",
      label: "Apparent field"
    });
    expect(targetStatus.note).toContain(COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID);

    const targetCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "R'w",
      result
    });
    expect(targetCorridor).toMatchObject({
      laneLabel: "Field airborne lane",
      modeLabel: "Room-to-room field"
    });
    expect(targetCorridor.detail).toContain(COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD);

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    expect(corridorDossier.headline).toContain("Opening/leak field adapter");
    expect(corridorDossier.cards.find((card) => card.label === "Airborne lane")?.detail).toContain(
      COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD
    );

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
      stackDetail: "Visible wall rows feed the company-internal opening/leak field adapter.",
      studyModeLabel: "Wall",
      validationDetail: "Opening/leak field adapter runtime remains active.",
      validationLabel: "Opening/leak field adapter",
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup?.value).toBe("Opening/leak field adapter");
    expect(airborneTraceGroup?.notes).toEqual(
      expect.arrayContaining([
        `Opening/leak field adapter selected candidate ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID} through ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD}.`,
        "Field uncertainty remains +/-8 dB; this is source-absent and not measured evidence.",
        COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_WARNING
      ])
    );

    const report = buildReport(scenario, FIELD_TARGETS);
    expect(report).toContain(
      `- Airborne opening/leak field basis: Opening/leak field adapter (candidate ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID}; method ${COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD}; route field_between_rooms).`
    );
    expect(report).toContain(
      "- Airborne opening/leak field values: R'w 36.4 dB, Dn,w 36.7 dB, and DnT,w 36.9 dB; source-absent budget +/-8 dB; not measured evidence yes."
    );

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: FIELD_TARGETS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result?.metrics.estimatedRwPrimeDb).toBe(36.4);
    expect(body.result?.metrics.estimatedDnWDb).toBe(36.7);
    expect(body.result?.metrics.estimatedDnTwDb).toBe(36.9);
    expect(body.result?.airborneBasis?.method).toBe(COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD);
    expect(body.result?.airborneCandidateResolution?.selectedCandidateId).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps saved building replay on the building basis while unsupported aliases stay parked", () => {
    const savedScenario = buildScenario({
      airborneContext: BUILDING_CONTEXT,
      id: "company_internal_opening_leak_building_saved",
      source: "saved",
      targetOutputs: BUILDING_TARGETS
    });
    const result = savedScenario.result;
    const [rwCard, stcCard, rwPrimeCard, dnWCard, dnTCard] = buildCards(result, BUILDING_TARGETS);
    const surface = getCompanyInternalOpeningLeakFieldBuildingSurface(result);

    expect(savedScenario.source).toBe("saved");
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
    expect(surface).toMatchObject({
      budgetLabel: "+/-10 dB",
      label: "Opening/leak building adapter",
      routeBasis: "building_prediction"
    });

    expect(rwPrimeCard).toMatchObject({
      postureLabel: "Opening/leak building adapter",
      status: "live",
      value: "31.6 dB"
    });
    expect(dnTCard).toMatchObject({
      postureLabel: "Opening/leak building adapter",
      status: "live",
      value: "32.1 dB"
    });
    expect(dnWCard).toMatchObject({
      postureLabel: "Opening/leak building adapter",
      status: "live",
      value: "31.9 dB"
    });

    for (const card of [rwCard, stcCard]) {
      expect(card).toMatchObject({
        postureLabel: "Opening/leak field/building boundary",
        status: "unsupported",
        value: "Not ready"
      });
      expect(card.detail).toContain("field/building, A-weighted, or lab basis");
    }

    const targetStatus = getTargetOutputStatus({
      guideResult: null,
      output: "R'w",
      result
    });
    expect(targetStatus).toMatchObject({
      kind: "engine_live",
      label: "Building apparent"
    });

    const report = buildReport(savedScenario, BUILDING_TARGETS);
    expect(report).toContain(
      `- Airborne opening/leak building basis: Opening/leak building adapter (candidate ${COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID}; method ${COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD}; route building_prediction).`
    );
    expect(report).toContain(
      "- Airborne opening/leak building values: R'w 31.6 dB, Dn,w 31.9 dB, and DnT,w 32.1 dB; source-absent budget +/-10 dB; not measured evidence yes."
    );
  });
});
