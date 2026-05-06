import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AssemblyCalculationSchema,
  RatingAdapterBasisSchema,
  RatingAdapterInventorySchema,
  type AirborneContext,
  type LayerInput,
  type RatingAdapterBasis,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildRatingsFromCurve, TL_PLOT_FREQS } from "./curve-rating";
import {
  computeImpactSpectrumAdaptationTerms,
  computeImpactWeightedRating,
  IMPACT_REFERENCE_HEAVY_FLOOR_FREQS,
  IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS
} from "./impact-iso717";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_C = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_c_inventory_rating_adapter_integrity_without_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts",
  selectionStatus:
    "gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_C_SURFACES = [
  "packages/shared/src/domain/rating-adapter.ts",
  "packages/shared/src/domain/assembly.ts",
  "packages/shared/src/index.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
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

const FIELD_RATING_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function ratingInventory(): RatingAdapterBasis[] {
  return RatingAdapterInventorySchema.parse([
    {
      adapterId: "iso_717_1_rw_from_airborne_transmission_loss_curve",
      aliasBlocks: [
        {
          fromMetricId: "STC",
          reason: "ASTM E413 STC has its own contour and cannot be copied into Rw.",
          toMetricId: "Rw"
        }
      ],
      contextBasis: "element_lab",
      implementationStatus: "runtime_adapter",
      inputBasis: "airborne_transmission_loss_curve",
      metricFamily: "airborne",
      metricId: "Rw",
      ratingStandard: "ISO 717-1",
      sourceMetricIds: ["Rw"]
    },
    {
      adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
      aliasBlocks: [
        {
          fromMetricId: "Rw",
          reason: "ISO 717-1 Rw has its own contour and cannot be copied into STC.",
          toMetricId: "STC"
        }
      ],
      contextBasis: "element_lab",
      implementationStatus: "runtime_adapter",
      inputBasis: "airborne_transmission_loss_curve",
      metricFamily: "airborne",
      metricId: "STC",
      ratingStandard: "ASTM E413",
      sourceMetricIds: ["STC"]
    },
    {
      adapterId: "iso_717_1_rw_prime_from_apparent_airborne_curve",
      contextBasis: "building_prediction",
      implementationStatus: "runtime_adapter",
      inputBasis: "airborne_apparent_transmission_loss_curve",
      metricFamily: "airborne",
      metricId: "R'w",
      ratingStandard: "ISO 717-1",
      requiredContextInputs: ["contextMode", "panelWidthMm", "panelHeightMm"]
    },
    {
      adapterId: "iso_717_1_dntw_from_standardized_airborne_curve",
      contextBasis: "building_prediction",
      implementationStatus: "runtime_adapter",
      inputBasis: "airborne_standardized_level_difference_curve",
      metricFamily: "airborne",
      metricId: "DnT,w",
      ratingStandard: "ISO 717-1",
      requiredContextInputs: ["panelWidthMm", "panelHeightMm", "receivingRoomVolumeM3"]
    },
    {
      adapterId: "iso_717_2_lnw_from_impact_level_curve",
      aliasBlocks: [
        {
          fromMetricId: "IIC",
          reason: "ASTM E989 IIC has its own impact contour and cannot be copied into Ln,w.",
          toMetricId: "Ln,w"
        }
      ],
      contextBasis: "element_lab",
      implementationStatus: "runtime_adapter",
      inputBasis: "impact_level_curve",
      metricFamily: "impact",
      metricId: "Ln,w",
      ratingStandard: "ISO 717-2",
      sourceMetricIds: ["Ln,w"]
    },
    {
      adapterId: "iso_717_2_lprime_ntw_from_standardized_field_impact_curve",
      contextBasis: "building_prediction",
      implementationStatus: "runtime_adapter",
      inputBasis: "impact_standardized_field_level_curve",
      metricFamily: "impact",
      metricId: "L'nT,w",
      ratingStandard: "ISO 717-2",
      requiredContextInputs: ["impactFieldContext", "receivingRoomVolumeM3"]
    },
    {
      adapterId: "astm_e989_iic_from_impact_level_curve",
      aliasBlocks: [
        {
          fromMetricId: "Ln,w",
          reason: "ISO 717-2 Ln,w must not be exposed as ASTM E989 IIC without an E989 adapter or source owner.",
          toMetricId: "IIC"
        }
      ],
      blockedReasons: ["astm_e989_runtime_adapter_absent"],
      contextBasis: "element_lab",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_level_curve",
      metricFamily: "impact",
      metricId: "IIC",
      ratingStandard: "ASTM E989"
    }
  ]);
}

describe("calculator model-first physics prediction pivot Gate C", () => {
  it("lands rating adapter integrity no-runtime and selects input completeness Gate D", () => {
    expect(MODEL_FIRST_GATE_C).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_c_inventory_rating_adapter_integrity_without_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts",
      selectionStatus:
        "gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_C_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("parses optional rating adapter basis metadata and rejects silent metric aliases", () => {
    const inventory = ratingInventory();
    const legacyResult = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    const parsed = AssemblyCalculationSchema.parse({
      ...legacyResult,
      ratingAdapterBasisSet: inventory
    });
    const parsedRatingAdapterBasisSet = (parsed.ratingAdapterBasisSet ?? []) as RatingAdapterBasis[];

    expect(parsedRatingAdapterBasisSet.map((basis) => basis.ratingStandard)).toEqual([
      "ISO 717-1",
      "ASTM E413",
      "ISO 717-1",
      "ISO 717-1",
      "ISO 717-2",
      "ISO 717-2",
      "ASTM E989"
    ]);
    expect(parsedRatingAdapterBasisSet.find((basis) => basis.metricId === "IIC")?.implementationStatus).toBe(
      "planned_not_implemented"
    );

    expect(() =>
      RatingAdapterBasisSchema.parse({
        adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        inputBasis: "airborne_transmission_loss_curve",
        metricFamily: "airborne",
        metricId: "Rw",
        ratingStandard: "ASTM E413"
      })
    ).toThrow(/must not be silently rated as ASTM E413/);

    expect(() =>
      RatingAdapterBasisSchema.parse({
        adapterId: "astm_e989_iic_from_impact_level_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        inputBasis: "impact_level_curve",
        metricFamily: "impact",
        metricId: "Ln,w",
        ratingStandard: "ASTM E989"
      })
    ).toThrow(/must not be silently rated as ASTM E989/);

    expect(() =>
      RatingAdapterBasisSchema.parse({
        adapterId: "iso_717_1_rw_prime_from_apparent_airborne_curve",
        contextBasis: "element_lab",
        implementationStatus: "runtime_adapter",
        inputBasis: "airborne_apparent_transmission_loss_curve",
        metricFamily: "airborne",
        metricId: "R'w",
        ratingStandard: "ISO 717-1"
      })
    ).toThrow(/requires field or building context/);
  });

  it("pins existing airborne curve adapters as separate ISO 717-1 and ASTM E413 paths", () => {
    const flatCurveDb = TL_PLOT_FREQS.map(() => 50);
    const labRatings = buildRatingsFromCurve(TL_PLOT_FREQS, flatCurveDb, WALL_LAB_CONTEXT);
    const fieldRatings = buildRatingsFromCurve(TL_PLOT_FREQS, flatCurveDb, FIELD_RATING_CONTEXT);

    expect(labRatings.iso717).toMatchObject({
      C: 1,
      Ctr: 1,
      Rw: 49,
      composite: "49 (+1;+1)",
      descriptor: "Rw"
    });
    expect(labRatings.astmE413).toEqual({
      STC: 48
    });
    expect(labRatings.iso717.Rw).not.toBe(labRatings.astmE413.STC);

    expect(fieldRatings.iso717).toMatchObject({
      Rw: 49,
      RwPrime: 49,
      apparent: true,
      descriptor: "R'w"
    });
    expect(fieldRatings.astmE413).toMatchObject({
      ASTC: 48,
      STC: 48,
      basis: "apparent_curve",
      estimated: true
    });
    expect(fieldRatings.field).toMatchObject({
      DnTA: 51.5,
      DnTw: 51,
      DnW: 49,
      RwPrime: 49,
      basis: "apparent_curve_overlay + 10log10(0.32V/S)",
      dnBasis: "apparent_curve_overlay + 10log10(A0/S)"
    });
  });

  it("pins existing impact ISO 717-2 path and keeps ASTM E989 out of runtime aliasing", () => {
    const weighted = computeImpactWeightedRating(
      IMPACT_REFERENCE_HEAVY_FLOOR_FREQS,
      IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS
    );
    const adaptation = computeImpactSpectrumAdaptationTerms(
      IMPACT_REFERENCE_HEAVY_FLOOR_FREQS,
      IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS,
      weighted.value
    );
    const iicBasis = ratingInventory().find((basis) => basis.metricId === "IIC");

    expect(weighted).toEqual({
      bandSet: "one_third_octave_100_3150",
      value: 78
    });
    expect(adaptation).toMatchObject({
      ci: -11,
      ci50_2500: Number.NaN,
      ci50_2500BandSet: "",
      ciBandSet: "one_third_octave_100_2500"
    });
    expect(iicBasis).toMatchObject({
      blockedReasons: ["astm_e989_runtime_adapter_absent"],
      implementationStatus: "planned_not_implemented",
      ratingStandard: "ASTM E989"
    });
  });

  it("keeps rating ownership explicit after Gate G grouped Rockwool prediction movement", () => {
    const adjacent = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(adjacent.metrics.estimatedRwDb).toBe(51);
    expect(adjacent.metrics.estimatedStc).toBe(51);
    expect(adjacent.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(adjacent.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(grouped.metrics.estimatedRwDb).toBe(50);
    expect(grouped.metrics.estimatedStc).toBe(55);
    expect(grouped.dynamicAirborneTrace?.detectedFamily).toBe("multileaf_multicavity");
    expect(grouped.dynamicAirborneTrace?.strategy).toBe(
      "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    );
    expect(grouped.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate C closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain("gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d");
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts"
    );
  });
});
