import {
  GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING
} from "@dynecho/engine";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { composeWorkbenchReport } from "./compose-workbench-report";
import { CRITERIA_PACKS } from "./criteria-packs";
import {
  WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD,
  WEB_GATE_AY_ADVANCED_WALL_RUNTIME_WARNING,
  getGateAYAdvancedWallSurface
} from "./advanced-wall-source-absent-surface";
import { getPresetById } from "./preset-definitions";
import { evaluateScenario, type EvaluatedScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import type {
  WorkbenchAdvancedWallInputSurfaceDraft
} from "./advanced-wall-source-absent-input-surface";
import type { LayerDraft } from "./workbench-store";

const ADVANCED_WALL_TARGETS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_ADVANCED_WALL_SURFACE = {
  cavities: [
    {
      absorberCoverageRatio: "0.85",
      absorberFlowResistivityPaSM2: "10500",
      absorberThicknessMm: "50",
      depthMm: "70",
      id: "cavity-a",
      sealState: "sealed",
      sequence: "1"
    },
    {
      absorberCoverageRatio: "0.65",
      absorberFlowResistivityPaSM2: "8200",
      absorberThicknessMm: "40",
      depthMm: "55",
      id: "cavity-b",
      sealState: "average",
      sequence: "2"
    }
  ],
  frameCoupling: {
    depthMm: "70",
    frameMaterialClass: "light_steel",
    lineCouplingStiffnessMNPerM3: "1.8",
    mechanicalBridgeAreaRatio: "0.018",
    resilientConnectionStiffnessMNPerM3: "0.9",
    resilientConnectionType: "resilient_channel",
    spacingMm: "600"
  },
  frequencyBandSet: "third_octave_100_3150",
  hostWallAreaM2: "",
  openingIntent: "none",
  openings: [],
  outputBasis: "element_lab",
  panels: [
    {
      bendingStiffnessNm: "86",
      criticalFrequencyHz: "2300",
      id: "panel-a",
      layerIdsCsv: "a-gypsum-1,a-gypsum-2",
      leafId: "leaf-a",
      lossFactor: "0.05",
      materialClass: "gypsum_board",
      sequence: "1",
      surfaceMassKgM2: "21.6",
      thicknessMm: "25"
    },
    {
      bendingStiffnessNm: "240",
      criticalFrequencyHz: "1250",
      id: "panel-core",
      layerIdsCsv: "core-engineered-timber",
      leafId: "leaf-core",
      lossFactor: "0.035",
      materialClass: "engineered_timber",
      sequence: "2",
      surfaceMassKgM2: "16.5",
      thicknessMm: "36"
    },
    {
      bendingStiffnessNm: "118",
      criticalFrequencyHz: "1750",
      id: "panel-b",
      layerIdsCsv: "b-gypsum,b-cement-board",
      leafId: "leaf-b",
      lossFactor: "0.045",
      materialClass: "cement_board",
      sequence: "3",
      surfaceMassKgM2: "24",
      thicknessMm: "30"
    }
  ],
  wallSolverIntent: "advanced_source_absent_wall"
} as const satisfies WorkbenchAdvancedWallInputSurfaceDraft;

function rowsFor(layers: readonly LayerInput[]): LayerDraft[] {
  return layers.map((layer, index) => ({
    id: `gate-az-layer-${index + 1}`,
    materialId: layer.materialId,
    thicknessMm: String(layer.thicknessMm)
  }));
}

function evaluateAdvancedWallScenario(input: {
  source?: "current" | "saved";
  surface?: WorkbenchAdvancedWallInputSurfaceDraft | null;
  targetOutputs?: readonly RequestedOutputId[];
} = {}): EvaluatedScenario {
  return evaluateScenario({
    advancedWallInputSurface: input.surface ?? COMPLETE_ADVANCED_WALL_SURFACE,
    calculator: "dynamic",
    id: input.source === "saved" ? "gate-az-saved" : "gate-az-current",
    name: "Gate AZ advanced wall input surface",
    rows: rowsFor(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK),
    savedAtIso: input.source === "saved" ? "2026-05-13T09:00:00.000Z" : undefined,
    source: input.source ?? "current",
    studyMode: "wall",
    targetOutputs: input.targetOutputs ?? ADVANCED_WALL_TARGETS
  });
}

function buildReport(scenario: EvaluatedScenario): string {
  return composeWorkbenchReport({
    activeCriteriaPack: CRITERIA_PACKS[0],
    activePreset: getPresetById("concrete_wall"),
    briefNote: "",
    clientName: "Gate AZ Client",
    currentScenario: scenario,
    fieldRiskIds: [],
    impactGuide: null,
    impactImprovementBandInput: "",
    impactReference: null,
    impactReferenceDeltaLwDb: "",
    improvementReferenceImpact: null,
    projectName: "Gate AZ Advanced Wall Input Surface",
    reportProfile: "consultant",
    requestedOutputs: ADVANCED_WALL_TARGETS,
    savedScenarios: [],
    studyContext: "coordination",
    studyMode: "wall",
    targetLnwDb: "",
    targetRwDb: "60"
  });
}

describe("advanced wall source-absent input surface acceptance", () => {
  it("keeps web Gate AY constants aligned with the engine runtime basis", () => {
    expect(WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD
    );
    expect(WEB_GATE_AY_ADVANCED_WALL_RUNTIME_WARNING).toBe(
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING
    );
  });

  it("feeds complete UI-derived advanced-wall fields through scenario analysis, cards, dossiers, and report", () => {
    const scenario = evaluateAdvancedWallScenario();
    const result = scenario.result;
    const surface = getGateAYAdvancedWallSurface(result);

    expect(result?.metrics.estimatedRwDb).toBe(65);
    expect(result?.metrics.estimatedStc).toBe(65);
    expect(result?.metrics.estimatedCDb).toBe(-1.1);
    expect(result?.metrics.estimatedCtrDb).toBe(-6.4);
    expect(result?.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(surface?.budgetLabel).toBe("+/-8 dB Rw/STC; +/-3 dB C/Ctr");

    const rwCard = addOutputCardPosture(
      buildOutputCard({ output: "Rw", result, studyMode: "wall" }),
      { result, studyMode: "wall" }
    );
    const ctrCard = addOutputCardPosture(
      buildOutputCard({ output: "Ctr", result, studyMode: "wall" }),
      { result, studyMode: "wall" }
    );
    const dossier = buildSimpleWorkbenchCorridorDossier(result, "wall");
    const report = buildReport(scenario);

    expect(rwCard).toMatchObject({
      postureLabel: "Advanced wall source-absent runtime",
      status: "live",
      value: "65 dB"
    });
    expect(rwCard.detail).toContain("+/-8 dB Rw/STC; +/-3 dB C/Ctr");
    expect(ctrCard).toMatchObject({
      postureLabel: "Advanced wall source-absent runtime",
      status: "live",
      value: "-6.4 dB"
    });
    expect(dossier.headline).toContain("Advanced wall source-absent runtime");
    expect(report).toContain("Airborne advanced-wall values: Rw 65 dB; STC 65 dB; C -1.1 dB; Ctr -6.4 dB");
  });

  it("preserves the same Gate AY basis on saved replay and blocks partial UI fields precisely", () => {
    const savedScenario = evaluateAdvancedWallScenario({ source: "saved" });
    const partialScenario = evaluateAdvancedWallScenario({
      surface: {
        ...COMPLETE_ADVANCED_WALL_SURFACE,
        panels: COMPLETE_ADVANCED_WALL_SURFACE.panels.map((panel, index) =>
          index === 0 ? { ...panel, lossFactor: "", criticalFrequencyHz: "" } : panel
        )
      }
    });

    expect(savedScenario.result?.metrics.estimatedRwDb).toBe(65);
    expect(savedScenario.result?.airborneBasis?.method).toBe(WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD);

    expect(partialScenario.result?.airborneBasis?.origin).toBe("needs_input");
    expect(partialScenario.result?.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["panelLossFactor", "panelCriticalFrequencyHz"])
    );
    expect(partialScenario.result?.supportedTargetOutputs).toEqual([]);
    expect(partialScenario.result?.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(partialScenario.warnings.join(" ")).toContain("Panel loss factor");
  });

  it("keeps field/building outputs parked instead of aliasing lab advanced-wall values", () => {
    const scenario = evaluateAdvancedWallScenario({
      surface: {
        ...COMPLETE_ADVANCED_WALL_SURFACE,
        outputBasis: "field_between_rooms"
      },
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(scenario.result?.airborneBasis?.method).toBe(WEB_GATE_AY_ADVANCED_WALL_RUNTIME_METHOD);
    expect(scenario.result?.airborneBasis?.origin).toBe("unsupported");
    expect(scenario.result?.supportedTargetOutputs).toEqual([]);
    expect(scenario.result?.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(scenario.warnings.join(" ")).toContain("field_or_building_output_basis");
  });
});
