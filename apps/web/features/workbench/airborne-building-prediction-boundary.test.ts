import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING,
  GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING,
  GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS
} from "@dynecho/engine";
import type { AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildWorkbenchAirborneFieldContextInputSurface,
  formatWorkbenchAirborneFieldContextMissingInputWarning,
  type WorkbenchAirborneFieldContextInputSurfaceDraft
} from "./airborne-field-context-input-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
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

function completeDraft(
  overrides: Partial<WorkbenchAirborneFieldContextInputSurfaceDraft> = {}
): WorkbenchAirborneFieldContextInputSurfaceDraft {
  return {
    airtightness: "good",
    contextMode: "building_prediction",
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
  surface?: WorkbenchAirborneFieldContextInputSurfaceDraft;
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: input.surface ?? completeDraft(),
    calculator: "dynamic",
    id: input.id,
    name: input.name,
    rows: rowsFor(input.layers, input.id),
    source: "current",
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

describe("airborne building-prediction boundary", () => {
  it("surfaces flanking owner and conservative assumption as first-class workbench prompts", () => {
    const surface = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft(),
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(surface).toMatchObject({
      missingPhysicalInputs: [...GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS],
      status: "needs_input"
    });
    expect(surface.airborneContext).toMatchObject({
      contextMode: "building_prediction",
      panelHeightMm: 2700,
      panelWidthMm: 4000,
      receivingRoomRt60S: 0.55,
      receivingRoomVolumeM3: 42
    });
    expect(formatWorkbenchAirborneFieldContextMissingInputWarning(surface)).toContain(
      "Flanking/junction class, Conservative flanking assumption"
    );
  });

  it("keeps building-prediction field cards parked and does not expose Gate I card posture", () => {
    const scenario = buildScenario({
      id: "gate_l_building_prediction_boundary",
      layers: LINED_MASSIVE_WALL,
      name: "Gate L building-prediction boundary"
    });
    const [rwPrimeCard, dntCard] = buildCards(scenario.result);

    expect(scenario.result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(scenario.result.airborneBasis?.missingPhysicalInputs).toEqual([
      ...GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS
    ]);
    expect(scenario.result.warnings).toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
    expect(scenario.result.warnings).not.toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(scenario.result.warnings.join("\n")).not.toContain("Airborne field-side overlay active");
    expect(scenario.result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(scenario.result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(getGateIAirborneFieldContextSurface(scenario.result)).toBeNull();

    for (const card of [rwPrimeCard, dntCard]) {
      expect(card).toMatchObject({
        postureLabel: "Awaiting field input",
        status: "needs_input",
        value: "Not ready"
      });
      expect(card.detail).toContain("flanking/junction class");
      expect(card.detail).toContain("conservative flanking assumption");
      expect(card.detail).not.toContain("Gate I field-context adapter");
      expect(card.detail).not.toContain("uncalibrated field prediction budget");
    }
  });

  it("keeps calculator API building-prediction payloads parked on the same boundary warning", async () => {
    const surface = buildWorkbenchAirborneFieldContextInputSurface({
      studyMode: "wall",
      surface: completeDraft(),
      targetOutputs: WALL_FIELD_OUTPUTS
    }).airborneContext;
    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: surface,
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
    expect(body.result?.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(body.result?.airborneBasis?.missingPhysicalInputs).toEqual([
      ...GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS
    ]);
    expect(body.result?.warnings).toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
    expect(body.result?.warnings).not.toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
  });
});
