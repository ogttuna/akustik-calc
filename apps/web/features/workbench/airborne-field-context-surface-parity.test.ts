import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
  calculateAssembly,
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
  WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING,
  getGateIAirborneFieldContextSurface
} from "./airborne-field-context-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getScenarioCorridorSummary } from "./scenario-corridor-summary";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import { getPresetById } from "./preset-definitions";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const WALL_BUILDING_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  contextMode: "building_prediction",
  junctionQuality: "good"
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const GROUPED_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
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

const GROUPED_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  wallTopology: GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology
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
  layers: readonly LayerInput[];
  name: string;
  source?: "current" | "saved";
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: input.name,
    rows: rowsFor(input.layers, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-10T12:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: WALL_FIELD_OUTPUTS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): readonly OutputCardModel[] {
  return WALL_FIELD_OUTPUTS.map((output) =>
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
    clientName: "Gate J Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate J Airborne Field Context Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: WALL_FIELD_OUTPUTS,
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

describe("airborne field-context surface parity", () => {
  it("keeps web Gate I identifiers aligned with the engine constants", () => {
    expect(WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID).toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(WEB_GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );
    expect(WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(WEB_BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
    );
  });

  it("shows lined, CLT, and grouped field-context values with their owned bases on visible surfaces", () => {
    const cases = [
      {
        airborneContext: WALL_FIELD_CONTEXT,
        basisLabel: "Gate I airborne field/apparent context adapter",
        candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        dnt: "59 dB",
        id: "gate_j_lined_massive",
        layers: LINED_MASSIVE_WALL,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        name: "Gate J lined massive field surface",
        notePrefix: "Gate I field-context candidate",
        rwPrime: "58 dB",
        warning: GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
      },
      {
        airborneContext: WALL_FIELD_CONTEXT,
        basisLabel: "Gate I airborne field/apparent context adapter",
        candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        dnt: "41 dB",
        id: "gate_j_clt",
        layers: CLT_WALL,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        name: "Gate J CLT field surface",
        notePrefix: "Gate I field-context candidate",
        rwPrime: "40 dB",
        warning: GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
      },
      {
        airborneContext: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
        basisLabel: "Local-substitution field-context harmonization",
        candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        dnt: "53 dB",
        id: "gate_j_grouped_triple_leaf",
        layers: GROUPED_TRIPLE_LEAF_STACK,
        method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
        name: "Gate J grouped triple-leaf field surface",
        notePrefix: "Local-substitution field-context candidate",
        rwPrime: "52 dB",
        warning: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
      }
    ] as const;

    for (const testCase of cases) {
      const scenario = buildScenario({
        airborneContext: testCase.airborneContext ?? WALL_FIELD_CONTEXT,
        id: testCase.id,
        layers: testCase.layers,
        name: testCase.name
      });
      const result = scenario.result;
      const surface = getGateIAirborneFieldContextSurface(result);
      const [rwPrimeCard, dntCard] = buildCards(result);

      expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(testCase.candidateId);
      expect(result.airborneBasis?.method).toBe(testCase.method);
      expect(surface?.budgetLabel).toBe(`+/-${result.airborneBasis?.errorBudgetDb} dB`);
      expect(result.warnings).toContain(testCase.warning);
      const budgetLabel = surface?.budgetLabel ?? "";

      expect(rwPrimeCard).toMatchObject({
        postureLabel: "Airborne field-context prediction",
        status: "live",
        value: testCase.rwPrime
      });
      expect(dntCard).toMatchObject({
        postureLabel: "Airborne field-context prediction",
        status: "live",
        value: testCase.dnt
      });

      for (const card of [rwPrimeCard, dntCard]) {
        expect(card.detail).toContain(testCase.candidateId);
        expect(card.detail).toContain(testCase.method);
        expect(card.detail).toContain(`${budgetLabel} uncalibrated field prediction budget`);
        expect(card.detail).toContain("not measured field evidence");
        expect(card.detail).toContain(testCase.warning);
        expect(card.postureDetail).toContain("not a lab Rw/STC relabel");
      }

      const summary = getScenarioCorridorSummary(result);
      expect(summary.airborneLabel).toBe("Airborne field-context prediction");
      expect(summary.airborneProvenanceLabel).toBe("Airborne field-context prediction");
      expect(summary.airborneProvenanceDetail).toContain(testCase.method);

      const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
      expect(corridorDossier.headline).toContain("Airborne field-context prediction");
      expect(corridorDossier.cards.find((card) => card.label === "Field route")?.detail).toContain(budgetLabel);

      const methodDossier = buildSimpleWorkbenchMethodDossier({
        branchDetail: "Dynamic calculator route is evaluating a wall field-context lane.",
        branchLabel: "Dynamic Calculator",
        contextLabel: "Room-to-room field",
        coverageItems: buildCards(result),
        layers: scenario.rows.map((row, index) => ({
          categoryLabel: "Test layer",
          index: index + 1,
          label: row.materialId,
          thicknessLabel: `${row.thicknessMm} mm`
        })),
        result,
        stackDetail: "Visible wall rows feed the Gate I field-context surface parity route.",
        studyModeLabel: "Wall",
        validationDetail: "Gate I airborne field-context adapter remains active.",
        validationLabel: "Airborne field-context prediction",
        warnings: scenario.warnings
      });
      const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
      expect(airborneTraceGroup?.value).toBe("Airborne field-context prediction");
      expect(airborneTraceGroup?.notes).toEqual(
        expect.arrayContaining([
          `${testCase.notePrefix} ${testCase.candidateId} is selected through ${testCase.method}.`,
          `Field uncertainty remains ${budgetLabel}; this is not measured field evidence and is not a lab Rw/STC relabel.`,
          testCase.warning
        ])
      );

      const report = buildReport(scenario);
      expect(report).toContain("- Airborne field route: Room-to-room field");
      expect(report).toContain(
        `- Airborne field basis: ${testCase.basisLabel} (candidate ${testCase.candidateId}; method ${testCase.method}).`
      );
      expect(report).toContain(`- Airborne field error budget: R'w/DnT,w use ${budgetLabel} uncalibrated field prediction budget; not measured field evidence yes.`);
      expect(report).toContain(`- Airborne field warning: ${testCase.warning}`);
    }
  });

  it("keeps saved replay and calculator API payloads on the same field-context bases", async () => {
    const savedScenario = buildScenario({
      airborneContext: WALL_FIELD_CONTEXT,
      id: "gate_j_lined_massive_saved",
      layers: LINED_MASSIVE_WALL,
      name: "Gate J saved lined massive field surface",
      source: "saved"
    });
    const [rwPrimeCard, dntCard] = buildCards(savedScenario.result);

    expect(savedScenario.source).toBe("saved");
    expect(rwPrimeCard.value).toBe("58 dB");
    expect(dntCard.value).toBe("59 dB");
    expect(getGateIAirborneFieldContextSurface(savedScenario.result)?.candidateId).toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: WALL_FIELD_CONTEXT,
        calculator: "dynamic",
        layers: LINED_MASSIVE_WALL,
        targetOutputs: WALL_FIELD_OUTPUTS
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
    expect(body.result?.airborneCandidateResolution?.selectedCandidateId).toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(body.result?.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(body.result?.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

    const localSubstitutionSaved = buildScenario({
      airborneContext: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
      id: "local_substitution_field_saved",
      layers: GROUPED_TRIPLE_LEAF_STACK,
      name: "Local substitution saved grouped triple-leaf field surface",
      source: "saved"
    });
    const [localRwPrimeCard, localDntCard] = buildCards(localSubstitutionSaved.result);

    expect(localSubstitutionSaved.source).toBe("saved");
    expect(localRwPrimeCard.value).toBe("52 dB");
    expect(localDntCard.value).toBe("53 dB");
    expect(getGateIAirborneFieldContextSurface(localSubstitutionSaved.result)?.candidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(localRwPrimeCard.detail).toContain("Local-substitution field-context harmonization");
    expect(localRwPrimeCard.detail).toContain("not a lab Rw/STC relabel");

    const localSubstitutionApi = await estimate(
      jsonRequest("http://localhost/api/estimate/local_substitution_field_api", {
        airborneContext: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
        calculator: "dynamic",
        layers: GROUPED_TRIPLE_LEAF_STACK,
        targetOutputs: WALL_FIELD_OUTPUTS
      })
    );
    const localBody = (await localSubstitutionApi.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(localSubstitutionApi.status).toBe(200);
    expect(localBody.ok).toBe(true);
    expect(localBody.result?.metrics.estimatedRwPrimeDb).toBe(52);
    expect(localBody.result?.metrics.estimatedDnTwDb).toBe(53);
    expect(localBody.result?.airborneCandidateResolution?.selectedCandidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(localBody.result?.airborneBasis?.method).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD
    );
    expect(localBody.result?.warnings).toContain(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
    );
  });

  it("keeps missing context, building prediction, lab outputs, and exact source precedence outside Gate I surface claims", () => {
    const missingField = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const lab = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(getGateIAirborneFieldContextSurface(missingField)).toBeNull();
    expect(missingField.airborneCandidateResolution?.selectedCandidateId).toBe("candidate_dynamic_needs_input");
    expect(missingField.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    const missingCard = addOutputCardPosture(
      buildOutputCard({ output: "R'w", result: missingField, studyMode: "wall" }),
      { result: missingField, studyMode: "wall" }
    );
    expect(missingCard).toMatchObject({
      postureLabel: "Awaiting field input",
      status: "needs_input",
      value: "Not ready"
    });
    expect(missingCard.detail).not.toContain("+/-7 dB");

    expect(getGateIAirborneFieldContextSurface(building)).toBeNull();
    expect(building.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(getGateIAirborneFieldContextSurface(lab)).toBeNull();
    const labCard = addOutputCardPosture(
      buildOutputCard({ output: "Rw", result: lab, studyMode: "wall" }),
      { result: lab, studyMode: "wall" }
    );
    expect(labCard.label).toBe("Rw");
    expect(labCard.detail).not.toContain("R'w/DnT,w");
  });
});
