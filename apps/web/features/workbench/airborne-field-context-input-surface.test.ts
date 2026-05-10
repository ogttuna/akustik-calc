import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID,
  buildWorkbenchAirborneFieldContextInputSurface,
  formatWorkbenchAirborneFieldContextMissingInputWarning,
  type WorkbenchAirborneFieldContextInputSurfaceDraft
} from "./airborne-field-context-input-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { formatUnlockOutputs, getGuidedOutputUnlocks } from "./guided-output-unlocks";
import { getPresetById } from "./preset-definitions";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import { getAutomaticOutputs } from "./simple-workbench-utils";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

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

const GROUPED_TRIPLE_LEAF_TOPOLOGY: NonNullable<AirborneContext["wallTopology"]> = {
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

function completeDraft(
  overrides: Partial<WorkbenchAirborneFieldContextInputSurfaceDraft> = {}
): WorkbenchAirborneFieldContextInputSurfaceDraft {
  return {
    airtightness: "good",
    contextMode: "field_between_rooms",
    panelHeightMm: "2700",
    panelWidthMm: "4000",
    receivingRoomRt60S: "0.55",
    receivingRoomVolumeM3: "42",
    ...overrides
  };
}

function buildScenario(input: {
  id: string;
  layers: readonly LayerInput[];
  name: string;
  source?: "current" | "saved";
  surface?: WorkbenchAirborneFieldContextInputSurfaceDraft;
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: input.surface ?? completeDraft(),
    calculator: "dynamic",
    id: input.id,
    name: input.name,
    rows: rowsFor(input.layers, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-10T15:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? WALL_FIELD_OUTPUTS
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
    clientName: "Gate K Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate K Airborne Field Context Input Surface",
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

describe("airborne field-context input surface", () => {
  it("normalizes Dynamic Calculator field-between-rooms inputs into a complete Gate K context", () => {
    const complete = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft(),
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const missing = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft({
        contextMode: "element_lab",
        panelHeightMm: "",
        panelWidthMm: "",
        receivingRoomRt60S: "",
        receivingRoomVolumeM3: ""
      }),
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft({ contextMode: "building_prediction" }),
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(complete).toMatchObject({
      id: WORKBENCH_AIRBORNE_FIELD_CONTEXT_INPUT_SURFACE_ID,
      missingPhysicalInputs: [],
      status: "complete"
    });
    expect(complete.airborneContext).toMatchObject({
      contextMode: "field_between_rooms",
      panelHeightMm: 2700,
      panelWidthMm: 4000,
      receivingRoomRt60S: 0.55,
      receivingRoomVolumeM3: 42
    });
    expect(missing.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(formatWorkbenchAirborneFieldContextMissingInputWarning(missing)).toContain(
      "Context mode, Partition width and height, Receiving-room volume (m3), Receiving-room RT60 (s)"
    );
    expect(building).toMatchObject({
      missingPhysicalInputs: ["flankingJunctionClass", "conservativeFlankingAssumption"],
      status: "needs_input"
    });
    expect(getAutomaticOutputs("wall", "field_between_rooms")).toEqual(
      expect.arrayContaining(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"])
    );
  });

  it("feeds complete UI-derived lined, CLT, and grouped contexts into the Gate I/J runtime and surface", () => {
    const cases = [
      { dnt: "59 dB", id: "gate_k_lined_massive", layers: LINED_MASSIVE_WALL, rwPrime: "58 dB", surface: undefined },
      { dnt: "41 dB", id: "gate_k_clt", layers: CLT_WALL, rwPrime: "40 dB", surface: undefined },
      {
        dnt: "51 dB",
        id: "gate_k_grouped_triple_leaf",
        layers: GROUPED_TRIPLE_LEAF_STACK,
        rwPrime: "50 dB",
        surface: completeDraft({ baseContext: { wallTopology: GROUPED_TRIPLE_LEAF_TOPOLOGY } })
      }
    ] as const;

    for (const testCase of cases) {
      const scenario = buildScenario({
        id: testCase.id,
        layers: testCase.layers,
        name: testCase.id,
        surface: testCase.surface
      });
      const surface = getGateIAirborneFieldContextSurface(scenario.result);
      const [rwPrimeCard, dntCard] = buildCards(scenario.result);

      expect(scenario.result.airborneCandidateResolution?.selectedCandidateId).toBe(
        GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      );
      expect(scenario.result.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(scenario.result.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
      expect(surface?.detail).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
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
    }
  });

  it("keeps partial UI fields parked with precise missing-input copy and no Gate I budget", () => {
    const scenario = buildScenario({
      id: "gate_k_missing_rt60",
      layers: LINED_MASSIVE_WALL,
      name: "Gate K missing RT60",
      surface: completeDraft({ receivingRoomRt60S: "" })
    });
    const [rwPrimeCard, dntCard] = buildCards(scenario.result);
    const unlocks = getGuidedOutputUnlocks({
      airborneContextMode: "field_between_rooms",
      airbornePanelHeightMm: "2700",
      airbornePanelWidthMm: "4000",
      airborneReceivingRoomRt60S: "",
      airborneReceivingRoomVolumeM3: "42",
      impactGuideKDb: "",
      impactGuideReceivingRoomVolumeM3: "",
      parkedOutputs: WALL_FIELD_OUTPUTS,
      studyMode: "wall"
    });

    expect(scenario.result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(scenario.result.airborneBasis?.missingPhysicalInputs).toEqual(["receivingRoomRt60S"]);
    expect(scenario.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Airborne field/building-context route needs these physical inputs before calculating R'w / DnT,w: Receiving-room RT60 (s).")
      ])
    );
    for (const card of [rwPrimeCard, dntCard]) {
      expect(card).toMatchObject({
        postureLabel: "Awaiting field input",
        status: "needs_input",
        value: "Not ready"
      });
      expect(card.detail).toContain("still needs receiving-room RT60");
      expect(card.detail).not.toContain("uncalibrated field prediction budget");
    }
    expect(getGateIAirborneFieldContextSurface(scenario.result)).toBeNull();
    expect(unlocks.map((group) => group.title)).toEqual(["Enter airborne RT60"]);
    expect(formatUnlockOutputs(unlocks[0]?.outputs ?? [])).toBe("R'w · DnT,w");
  });

  it("preserves field context through saved replay, calculator API payload, and Markdown report", async () => {
    const savedScenario = buildScenario({
      id: "gate_k_saved_lined_massive",
      layers: LINED_MASSIVE_WALL,
      name: "Gate K saved replay",
      source: "saved"
    });
    const report = buildReport(savedScenario);
    const fieldContext = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft(),
      targetOutputs: WALL_FIELD_OUTPUTS
    }).airborneContext;

    expect(savedScenario.source).toBe("saved");
    expect(getGateIAirborneFieldContextSurface(savedScenario.result)?.candidateId).toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(report).toContain("Airborne field basis: Gate I airborne field/apparent context adapter");
    expect(report).toContain("Airborne field error budget: R'w/DnT,w use +/-8 dB");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: fieldContext,
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
  });

  it("does not let hostile field edits or lab/building requests masquerade as the Gate K field surface", () => {
    const missingAfterEdit = buildScenario({
      id: "gate_k_hostile_missing_volume",
      layers: LINED_MASSIVE_WALL,
      name: "Gate K hostile missing volume",
      surface: completeDraft({ receivingRoomVolumeM3: "" })
    });
    const lab = buildScenario({
      id: "gate_k_lab_outputs",
      layers: LINED_MASSIVE_WALL,
      name: "Gate K lab outputs",
      surface: completeDraft({ contextMode: "element_lab" }),
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const building = buildScenario({
      id: "gate_k_building_boundary",
      layers: LINED_MASSIVE_WALL,
      name: "Gate K building boundary",
      surface: completeDraft({ contextMode: "building_prediction" })
    });

    expect(missingAfterEdit.result.airborneCandidateResolution?.selectedOrigin).toBe("needs_input");
    expect(missingAfterEdit.result.airborneBasis?.missingPhysicalInputs).toEqual(["receivingRoomVolumeM3"]);
    expect(getGateIAirborneFieldContextSurface(missingAfterEdit.result)).toBeNull();

    expect(getGateIAirborneFieldContextSurface(lab.result)).toBeNull();
    expect(lab.result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(getGateIAirborneFieldContextSurface(building.result)).toBeNull();
    expect(building.result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(building.result.airborneBasis?.missingPhysicalInputs).toEqual([
      "flankingJunctionClass",
      "conservativeFlankingAssumption"
    ]);
    expect(building.result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  });
});
