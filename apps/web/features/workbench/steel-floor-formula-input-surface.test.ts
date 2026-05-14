import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import {
  addOutputCardPosture,
  buildOutputCard
} from "./simple-workbench-output-model";
import {
  normalizeWorkbenchSteelFloorFormulaInputSurface,
  type WorkbenchSteelFloorFormulaInputSurfaceDraft
} from "./steel-floor-formula-input-surface";
import type { LayerDraft } from "./workbench-store";

const STEEL_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
const STEEL_SUSPENDED_CEILING_FORMULA_BASIS =
  "predictor_lightweight_steel_suspended_ceiling_corridor_estimate";
const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const SUSPENDED_TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const MODULAR_STEEL_FLOOR_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "ceramic_tile", thicknessMm: "10" },
  { floorRole: "floating_screed", id: "deck", materialId: "cement_board", thicknessMm: "18" },
  { floorRole: "resilient_layer", id: "underlay", materialId: "generic_resilient_underlay", thicknessMm: "4.5" },
  { floorRole: "base_structure", id: "steel", materialId: "lightweight_steel_floor", thicknessMm: "200" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "air_gap", thicknessMm: "200" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board", materialId: "gypsum_board", thicknessMm: "12.5" }
];

const COMPLETE_OPEN_WEB_SURFACE = {
  impactSteelCarrierDepthMm: "200",
  impactSteelCarrierSpacingMm: "600",
  impactSteelLoadBasisKgM2: "64",
  impactSteelLowerCeilingIsolationSupportForm: "elastic_furred_channels",
  impactSteelResilientLayerDynamicStiffnessMNm3: "35",
  impactSteelSupportForm: "open_web_or_rolled"
} as const satisfies WorkbenchSteelFloorFormulaInputSurfaceDraft;

const SUSPENDED_CEILING_STEEL_ROWS: readonly LayerDraft[] = [
  { floorRole: "floor_covering", id: "finish", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "base_structure", id: "steel", materialId: "steel_joist_floor", thicknessMm: "250" },
  { floorRole: "ceiling_cavity", id: "cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "120" },
  { floorRole: "ceiling_fill", id: "fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_board", id: "board-a", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", id: "board-b", materialId: "firestop_board", thicknessMm: "16" }
];

const COMPLETE_SUSPENDED_CEILING_SURFACE = {
  impactSteelCarrierDepthMm: "250",
  impactSteelCarrierSpacingMm: "600",
  impactSteelLoadBasisKgM2: "",
  impactSteelLowerCeilingIsolationSupportForm: "elastic_furred_channels",
  impactSteelResilientLayerDynamicStiffnessMNm3: "",
  impactSteelSupportForm: "joist_or_purlin"
} as const satisfies WorkbenchSteelFloorFormulaInputSurfaceDraft;

function evaluateSteelScenario(input: {
  rows?: readonly LayerDraft[];
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
}) {
  return evaluateScenario({
    id: "gate-af-web-steel-floor-formula-input-surface",
    name: "Gate AF web steel input surface",
    rows: input.rows ?? MODULAR_STEEL_FLOOR_ROWS,
    source: "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_OPEN_WEB_SURFACE,
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });
}

function evaluateSuspendedCeilingSteelScenario(input: {
  rows?: readonly LayerDraft[];
  surface?: WorkbenchSteelFloorFormulaInputSurfaceDraft | null;
}) {
  return evaluateScenario({
    id: "gate-bl-web-steel-suspended-ceiling-input-surface",
    name: "Gate BL web steel suspended-ceiling input surface",
    rows: input.rows ?? SUSPENDED_CEILING_STEEL_ROWS,
    source: "current",
    steelFloorFormulaInputSurface: input.surface ?? COMPLETE_SUSPENDED_CEILING_SURFACE,
    studyMode: "floor",
    targetOutputs: SUSPENDED_TARGET_OUTPUTS
  });
}

describe("steel floor formula input surface", () => {
  it("normalizes workbench strings into the engine steel formula surface", () => {
    expect(normalizeWorkbenchSteelFloorFormulaInputSurface({
      ...COMPLETE_OPEN_WEB_SURFACE,
      impactSteelCarrierSpacingMm: "600,0",
      impactSteelLoadBasisKgM2: "64.0"
    })).toEqual({
      loadBasisKgM2: 64,
      lowerCeilingIsolationSupportForm: "elastic_furred_channels",
      resilientLayerDynamicStiffnessMNm3: 35,
      steelCarrierDepthMm: 200,
      steelCarrierSpacingMm: 600,
      steelSupportForm: "open_web_or_rolled"
    });
  });

  it("feeds complete UI steel fields into the live dynamic calculator formula lane", () => {
    const scenario = evaluateSteelScenario({});

    expect(scenario.result?.impact).toMatchObject({
      basis: STEEL_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
    expect(scenario.result?.impactPredictorStatus).toMatchObject({
      implementedFormulaEstimate: true,
      inputMode: "explicit_predictor_input"
    });
  });

  it("feeds complete suspended-ceiling-only steel fields into the Gate BK formula lane", () => {
    const scenario = evaluateSuspendedCeilingSteelScenario({});

    expect(scenario.result?.impact).toMatchObject({
      basis: STEEL_SUSPENDED_CEILING_FORMULA_BASIS,
      LnW: 62.2,
      labOrField: "lab"
    });
    expect(scenario.result?.impact?.DeltaLw).toBeUndefined();
    expect(scenario.result?.floorSystemEstimate).toBeNull();
    expect(scenario.warnings.some((warning) => /low-confidence fallback active/i.test(warning))).toBe(false);
    expect(scenario.warnings.join("\n")).toContain("before calculating DeltaLw");
    expect(scenario.warnings.join("\n")).toContain("Topping or floating layer");

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
      { result: scenario.result, studyMode: "floor" }
    );
    expect(lnwCard).toMatchObject({
      postureLabel: "Steel formula corridor",
      status: "live",
      value: "62.2 dB"
    });
    expect(lnwCard.detail).toContain("Gate BK lightweight-steel suspended-ceiling-only formula corridor");
    expect(lnwCard.detail).toContain("+/-6.0 dB corridor tolerance");
  });

  it("keeps partial steel fields from producing a fake formula value", () => {
    const scenario = evaluateSteelScenario({
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        impactSteelCarrierSpacingMm: ""
      }
    });

    expect(scenario.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(scenario.result?.impact?.notes ?? []).not.toContain(
      "Steel-floor impact estimate used the Gate AD mass-spring formula corridor instead of the broad floor-system family blend."
    );
  });

  it("turns partial suspended-ceiling steel fields into a visible missing-input card", () => {
    const scenario = evaluateSuspendedCeilingSteelScenario({
      surface: {
        ...COMPLETE_SUSPENDED_CEILING_SURFACE,
        impactSteelCarrierSpacingMm: "",
        impactSteelLowerCeilingIsolationSupportForm: ""
      }
    });

    expect(scenario.result?.impact?.basis).not.toBe(STEEL_SUSPENDED_CEILING_FORMULA_BASIS);
    expect(scenario.result?.floorSystemEstimate?.kind).not.toBe("low_confidence");
    expect(scenario.warnings.join("\n")).toContain("Steel carrier spacing (mm)");
    expect(scenario.warnings.join("\n")).toContain("Lower ceiling isolation support form");

    const lnwCard = addOutputCardPosture(
      buildOutputCard({ output: "Ln,w", result: scenario.result, studyMode: "floor" }),
      { result: scenario.result, studyMode: "floor" }
    );
    expect(lnwCard).toMatchObject({
      status: "unsupported",
      value: "Not ready"
    });
    expect(scenario.warnings.join("\n")).toContain("Steel-floor formula lane needs these physical inputs");
  });

  it("refuses unsafe duplicate steel carriers without crashing the workbench scenario", () => {
    const scenario = evaluateSteelScenario({
      rows: [
        ...MODULAR_STEEL_FLOOR_ROWS,
        { floorRole: "base_structure", id: "steel-duplicate", materialId: "open_web_steel_floor", thicknessMm: "200" }
      ]
    });

    expect(scenario.result).not.toBeNull();
    expect(scenario.result?.impact?.basis).not.toBe(STEEL_FORMULA_BASIS);
    expect(scenario.warnings).toContain(
      "Steel-floor formula input surface is parked because the visible steel carrier topology is unsafe to collapse. Keep one explicit base_structure carrier before relying on the steel formula lane."
    );
  });
});
