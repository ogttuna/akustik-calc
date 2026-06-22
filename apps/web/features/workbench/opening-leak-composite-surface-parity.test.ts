import {
  GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING
} from "@dynecho/engine";
import type { AirborneContext, AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import {
  WEB_GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING,
  WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING,
  getGateSOpeningLeakCompositeSurface
} from "./opening-leak-composite-surface";
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
const OPENING_TARGETS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

let originalEnv: Record<string, string | undefined>;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const COMPLETE_OPENING_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
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
  targetOutputs?: readonly RequestedOutputId[];
}): EvaluatedScenario & { result: AssemblyCalculation } {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: `Gate T opening/leak surface ${input.id}`,
    rows: rowsFor(HOST_WALL, input.id),
    savedAtIso: input.source === "saved" ? "2026-05-11T10:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? OPENING_TARGETS
  });

  if (!scenario.result) {
    throw new Error(`Scenario ${input.id} did not evaluate`);
  }

  return scenario as EvaluatedScenario & { result: AssemblyCalculation };
}

function buildCards(result: AssemblyCalculation): readonly OutputCardModel[] {
  return OPENING_TARGETS.map((output) =>
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
    clientName: "Gate T Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate T Opening Leak Surface Parity",
    reportProfile: "consultant",
    requestedOutputs: OPENING_TARGETS,
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

describe("opening/leak composite surface parity", () => {
  it("keeps web Gate S and Gate AH identifiers aligned with the engine constants", () => {
    expect(WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD).toBe(
      GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
    );
    expect(WEB_GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING).toBe(
      GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING
    );
    expect(WEB_GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING).toBe(
      GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
    );
  });

  it("shows the same opening/leak lab Rw basis on route, cards, scenario, dossiers, and Markdown report", () => {
    const scenario = buildScenario({
      airborneContext: COMPLETE_OPENING_CONTEXT,
      id: "gate_t_complete_opening"
    });
    const result = scenario.result;
    const [rwCard, stcCard, rwPrimeCard, dntCard] = buildCards(result);
    const surface = getGateSOpeningLeakCompositeSurface(result);

    expect(result.metrics.estimatedRwDb).toBe(38.2);
    expect(result.metrics.estimatedStc).toBe(39);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);

    expect(surface).toMatchObject({
      budgetLabel: "+/-6 dB",
      label: "Opening/leak composite runtime",
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      stcAdapterActive: true,
      stcAdapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      stcAdapterLabel: "Gate AH ASTM E413 STC adapter",
      stcRatingStandard: "ASTM E413"
    });
    expect(surface?.detail).toContain("lab Rw 38.2 dB");
    expect(surface?.detail).toContain("Gate AH lab STC 39 dB");
    expect(surface?.detail).toContain("not measured evidence");

    expect(rwCard).toMatchObject({
      postureLabel: "Opening/leak composite runtime",
      status: "live",
      value: "38.2 dB"
    });
    expect(rwCard.detail).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(rwCard.detail).toContain("+/-6 dB source-absent lab Rw / STC budget");

    expect(stcCard).toMatchObject({
      postureLabel: "Opening/leak composite runtime",
      status: "live",
      value: "39 dB"
    });
    expect(stcCard.detail).toContain("Gate AH ASTM E413 spectrum adapter");

    for (const card of [rwPrimeCard, dntCard]) {
      expect(card).toMatchObject({
        postureLabel: "Opening/leak boundary",
        status: "unsupported",
        value: "Not ready"
      });
      expect(card.detail).toContain(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
      expect(card.detail).toContain("field and building outputs are not aliased");
    }

    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    expect(branch).toMatchObject({
      tone: "ready",
      value: "Opening/leak composite runtime"
    });
    expect(branch.detail).toContain("lab Rw 38.2 dB");

    const summary = getScenarioCorridorSummary(result);
    expect(summary.airborneLabel).toBe("Opening/leak composite runtime");
    expect(summary.airbornePosture.detail).toContain("+/-6 dB source-absent lab Rw / STC budget");

    const targetStatus = getTargetOutputStatus({
      guideResult: null,
      output: "STC",
      result
    });
    expect(targetStatus).toMatchObject({
      kind: "engine_live",
      label: "Live"
    });
    expect(targetStatus.note).toContain("Gate AH ASTM");

    const targetCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "STC",
      result
    });
    expect(targetCorridor).toMatchObject({
      laneLabel: "Airborne lane"
    });
    expect(targetCorridor.detail).toContain("Gate AH ASTM E413 spectrum adapter");

    const corridorDossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    expect(corridorDossier.headline).toContain("Opening/leak composite runtime");
    expect(corridorDossier.cards.find((card) => card.label === "Airborne lane")?.detail).toContain(
      GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
    );
    expect(corridorDossier.cards.find((card) => card.label === "Airborne lane")?.detail).toContain(
      "Gate AH lab STC 39 dB"
    );

    const methodDossier = buildSimpleWorkbenchMethodDossier({
      branchDetail: branch.detail,
      branchLabel: branch.value,
      contextLabel: "Element lab",
      coverageItems: buildCards(result),
      layers: scenario.rows.map((row, index) => ({
        categoryLabel: "Test layer",
        index: index + 1,
        label: row.materialId,
        thicknessLabel: `${row.thicknessMm} mm`
      })),
      result,
      stackDetail: "Visible wall rows feed the Gate T opening/leak surface parity route.",
      studyModeLabel: "Wall",
      validationDetail: "Gate S opening/leak composite runtime remains active.",
      validationLabel: "Opening/leak composite runtime",
      warnings: scenario.warnings
    });
    const airborneTraceGroup = methodDossier.traceGroups.find((group) => group.label === "Airborne lane");
    expect(airborneTraceGroup?.value).toBe("Opening/leak composite runtime");
    expect(airborneTraceGroup?.notes).toEqual(
      expect.arrayContaining([
        "Gate S selected gate_s_opening_leak_composite_area_energy_runtime_corridor with lab Rw 38.2 dB and Gate AH STC 39 dB.",
        "Opening/leak uncertainty remains +/-6 dB; this is not measured evidence.",
        GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
      ])
    );

    const report = buildReport(scenario);
    expect(report).toContain(
      `- Airborne opening/leak basis: Gate S opening/leak composite runtime (method ${GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD}; origin family_physics_prediction).`
    );
    expect(report).toContain(
      "- Airborne opening/leak Rw: 38.2 dB; STC: 39 dB through Gate AH ASTM E413 adapter, budget +/-6 dB, not measured evidence."
    );
    expect(report).toContain(
      "- Airborne opening/leak unsupported outputs: R'w, DnT,w stay unsupported; no field or building alias."
    );
    expect(report).toContain(`- Airborne opening/leak warning: ${GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING}`);
  });

  it("keeps saved replay and calculator API payloads on the same Gate S opening/leak basis", async () => {
    const savedScenario = buildScenario({
      airborneContext: COMPLETE_OPENING_CONTEXT,
      id: "gate_t_complete_opening_saved",
      source: "saved"
    });
    const [rwCard] = buildCards(savedScenario.result);

    expect(savedScenario.source).toBe("saved");
    expect(rwCard.value).toBe("38.2 dB");
    expect(getGateSOpeningLeakCompositeSurface(savedScenario.result)?.budgetLabel).toBe("+/-6 dB");

    const { POST: estimate } = await import("../../app/api/estimate/route");
    const response = await estimate(
      jsonRequest("http://localhost/api/estimate", {
        airborneContext: COMPLETE_OPENING_CONTEXT,
        calculator: "dynamic",
        layers: HOST_WALL,
        targetOutputs: OPENING_TARGETS
      })
    );
    const body = (await response.json()) as {
      ok?: boolean;
      result?: AssemblyCalculation;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result?.metrics.estimatedRwDb).toBe(38.2);
    expect(body.result?.metrics.estimatedStc).toBe(39);
    expect(body.result?.supportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(body.result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(body.result?.airborneBasis?.method).toBe(GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD);
    expect(body.result?.airborneBasis?.errorBudgetDb).toBe(6);
    expect(body.result?.ratingAdapterBasisSet).toEqual([
      expect.objectContaining({
        adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        metricId: "STC",
        ratingStandard: "ASTM E413"
      })
    ]);
    expect(body.result?.warnings).toContain(GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps missing, hostile, source-absent, and STC-only opening inputs visible without budgeted aliases", () => {
    const missing = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1.8,
            count: 1,
            id: "partial-door",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      id: "gate_t_missing_opening",
      targetOutputs: ["Rw"]
    });
    const duplicate = buildScenario({
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: [
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] },
          { ...COMPLETE_OPENING_CONTEXT.openingLeakElements?.[0] }
        ]
      },
      id: "gate_t_duplicate_opening",
      targetOutputs: ["Rw"]
    });
    const excessiveArea = buildScenario({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 2,
        openingLeakElements: [
          {
            areaM2: 3,
            count: 1,
            elementRwDb: 30,
            id: "too-large",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      id: "gate_t_excessive_area",
      targetOutputs: ["Rw"]
    });
    const sourceAbsent = buildScenario({
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "source-absent-door",
          origin: "source_absent"
        }))
      },
      id: "gate_t_source_absent_opening",
      targetOutputs: ["Rw"]
    });
    const stcOnly = buildScenario({
      airborneContext: {
        ...COMPLETE_OPENING_CONTEXT,
        openingLeakElements: COMPLETE_OPENING_CONTEXT.openingLeakElements?.map((opening) => ({
          ...opening,
          id: "stc-only-door",
          ratingBasis: "stc_single_number"
        }))
      },
      id: "gate_t_stc_only_opening",
      targetOutputs: ["Rw", "STC"]
    });

    const missingRwCard = addOutputCardPosture(
      buildOutputCard({ output: "Rw", result: missing.result, studyMode: "wall" }),
      { result: missing.result, studyMode: "wall" }
    );
    expect(missing.result.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["openingElementRwDb"],
      origin: "needs_input"
    });
    expect(missingRwCard).toMatchObject({
      postureLabel: "Opening/leak input needed",
      status: "needs_input",
      value: "Not ready"
    });
    expect(missingRwCard.detail).toContain("opening element Rw");
    expect(missingRwCard.detail).not.toContain("openingElementRwDb");

    for (const [scenario, warningFragment] of [
      [duplicate, "duplicate opening ids"],
      [excessiveArea, "opening area exceeds host wall area"],
      [sourceAbsent, "source-absent opening value budget owner"],
      [stcOnly, "STC-only opening ratings cannot be aliased"]
    ] as const) {
      const card = addOutputCardPosture(
        buildOutputCard({ output: "Rw", result: scenario.result, studyMode: "wall" }),
        { result: scenario.result, studyMode: "wall" }
      );

      expect(scenario.result.supportedTargetOutputs).toEqual([]);
      expect(scenario.result.airborneBasis?.origin).toBe("unsupported");
      expect(card).toMatchObject({
        postureLabel: "Opening/leak boundary",
        status: "unsupported",
        value: "Not ready"
      });
      expect(card.detail).toContain(warningFragment);
      expect(card.detail).not.toContain("+/-6 dB source-absent lab Rw budget");
    }

    expect(stcOnly.result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
  });
});
