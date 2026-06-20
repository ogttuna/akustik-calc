import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildLayerInputEffectiveness, buildRouteInputEffectiveness, showBuildingPredictionContext } from "./calculator-workbench";
import { WORKBENCH_V2_DEFAULT_CONTEXT } from "./workbench-v2-project-snapshot";

const emptyTaskSet = new Set<string>();
const wallLayers = [
  { id: "layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" }
];
const floorLayers = [
  { id: "floor-layer-1", materialId: "concrete", role: "base_structure", thicknessMm: "150" },
  { id: "floor-layer-2", materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: "5" }
];

function makeAirborneResult(input?: {
  dntw?: number;
  fieldRwPrime?: number;
  origin?: NonNullable<AssemblyCalculation["airborneBasis"]>["origin"];
  propertyDefaults?: NonNullable<AssemblyCalculation["airborneBasis"]>["propertyDefaults"];
  rw?: number;
  unsupportedFieldOutput?: boolean;
}): AssemblyCalculation {
  const rw = input?.rw ?? 46;
  const fieldOutputs: NonNullable<AssemblyCalculation["ratings"]["field"]> = {};
  const supportedTargetOutputs: RequestedOutputId[] = ["Rw"];

  if (typeof input?.fieldRwPrime === "number") {
    fieldOutputs.RwPrime = input.fieldRwPrime;
    supportedTargetOutputs.push("R'w");
  }

  if (typeof input?.dntw === "number") {
    fieldOutputs.DnTw = input.dntw;
    supportedTargetOutputs.push("DnT,w");
  }

  return {
    airborneBasis: {
      assumptions: [],
      curveBasis: "calculated_single_number_estimate",
      kind: input?.origin === "measured_exact_full_stack" ? "airborne_measured_exact" : "airborne_physics_prediction",
      method: "test_route_input_effectiveness_airborne",
      missingPhysicalInputs: [],
      origin: input?.origin ?? "family_physics_prediction",
      propertyDefaults: input?.propertyDefaults ?? [],
      requiredInputs: []
    },
    impact: null,
    metrics: {
      airGapCount: 0,
      estimatedCDb: -1,
      estimatedCtrDb: -6,
      estimatedDnTwDb: input?.dntw,
      estimatedRwDb: rw,
      estimatedRwPrimeDb: input?.fieldRwPrime,
      estimatedStc: rw,
      insulationCount: 0,
      method: "dynamic",
      surfaceMassKgM2: 40,
      totalThicknessMm: 100
    },
    ratings: {
      astmE413: { STC: rw },
      iso717: { C: -1, Ctr: -6, Rw: rw },
      field: Object.keys(fieldOutputs).length ? fieldOutputs : undefined
    },
    supportedTargetOutputs: input?.unsupportedFieldOutput ? [] : supportedTargetOutputs,
    unsupportedTargetOutputs: input?.unsupportedFieldOutput ? ["R'w"] : []
  } as unknown as AssemblyCalculation;
}

function makeImpactResult(input?: { exact?: boolean }): AssemblyCalculation {
  return {
    impact: {
      availableOutputs: ["DeltaLw"],
      basis: input?.exact ? "exact_source_impact_route" : "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      confidence: {
        level: "medium",
        provenance: "formula_estimate_narrow_scope",
        score: 0.7,
        summary: "test"
      },
      DeltaLw: 24,
      notes: ["test"],
      scope: "narrow_heavy_concrete_only"
    },
    metrics: {
      airGapCount: 0,
      estimatedCDb: 0,
      estimatedCtrDb: 0,
      estimatedRwDb: 50,
      estimatedStc: 50,
      insulationCount: 0,
      method: "dynamic",
      surfaceMassKgM2: 300,
      totalThicknessMm: 160
    },
    ratings: {
      astmE413: { STC: 50 },
      iso717: { C: 0, Ctr: 0, Rw: 50 }
    },
    supportedTargetOutputs: ["DeltaLw"],
    unsupportedTargetOutputs: []
  } as unknown as AssemblyCalculation;
}

describe("route input effectiveness", () => {
  it("does not show building prediction inputs for non-airborne output sets", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const
    };

    expect(showBuildingPredictionContext(context, ["Ln,w"], null)).toBe(false);
    expect(showBuildingPredictionContext(context, ["Rw"], null)).toBe(true);
  });

  it("keeps route needs_input tasks as the strongest badge", () => {
    const status = buildRouteInputEffectiveness({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layerCount: 2,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: new Set(["rebuild-load-basis"]),
      selectedOutputs: ["DeltaLw"]
    });

    expect(status["rebuild-load-basis"]).toMatchObject({ status: "needed" });
  });

  it("marks building prediction inputs used when a building output is live", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const,
      buildingPredictionOutputBasis: "apparent_and_standardized" as const,
      conservativeFlankingAssumption: "single_conservative_path" as const,
      flankingJunctionClass: "rigid_cross_junction" as const,
      junctionCouplingLengthM: "12",
      panelHeightMm: "2600",
      panelWidthMm: "3000",
      receivingRoomRt60S: "0.5",
      receivingRoomVolumeM3: "50",
      sourceRoomVolumeM3: "55"
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ fieldRwPrime: 40 }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expect(status["rebuild-panel-width"]).toMatchObject({ status: "used" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "used" });
    expect(status["rebuild-building-output-basis"]).toMatchObject({ status: "used" });
  });

  it("does not mark manual wall topology used from finite but unsupported field helper metrics", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallTopologyMode: "double_leaf_framed" as const
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({
        fieldRwPrime: 40,
        unsupportedFieldOutput: true
      }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expect(status["rebuild-wall-topology-mode"]?.status).not.toBe("used");
    expect(status["rebuild-wall-side-a-rows"]?.status).not.toBe("used");
    expect(status["rebuild-wall-cavity-1-rows"]?.status).not.toBe("used");
    expect(status["rebuild-wall-side-b-rows"]?.status).not.toBe("used");
  });

  it("keeps building inputs inactive when building context is active for only a lab companion output", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const,
      sourceRoomVolumeM3: "55"
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "inactive" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "inactive" });
  });

  it("marks visible blank building inputs inactive before a result returns for a lab-only output", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: null,
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "inactive" });
    expect(status["rebuild-panel-width"]).toMatchObject({ status: "inactive" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "inactive" });
    expect(status["rebuild-building-output-basis"]).toMatchObject({ status: "inactive" });
  });

  it("keeps building inputs active when a standardized airborne building output is live", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const,
      buildingPredictionOutputBasis: "standardized" as const,
      panelHeightMm: "2600",
      panelWidthMm: "3000",
      receivingRoomRt60S: "0.5",
      receivingRoomVolumeM3: "50",
      sourceRoomVolumeM3: "55"
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ dntw: 43 }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw", "DnT,w"]
    });

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "used" });
    expect(status["rebuild-panel-width"]).toMatchObject({ status: "used" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "used" });
    expect(status["rebuild-building-output-basis"]).toMatchObject({ status: "used" });
  });

  it("keeps missing building context inputs needed over active-context defaults", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: new Set(["rebuild-panel-width", "rebuild-source-room-volume"]),
      selectedOutputs: ["R'w"]
    });

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "used" });
    expect(status["rebuild-panel-width"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-receiving-room-rt60"]).toMatchObject({ status: "defaulted" });
  });

  it("marks visible RT60 inactive while a field output is still waiting for Field or Building mode", () => {
    const status = buildRouteInputEffectiveness({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: new Set(["rebuild-airborne-mode", "rebuild-panel-width", "rebuild-receiving-room-volume"]),
      selectedOutputs: ["R'w"]
    });

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-panel-width"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-receiving-room-volume"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-receiving-room-rt60"]).toMatchObject({ status: "inactive" });
  });

  it("does not mark manual wall topology used when an exact source row owns the result", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallTopologyMode: "double_leaf_framed" as const
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ origin: "measured_exact_full_stack" }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expect(status["rebuild-wall-side-a-rows"]).toMatchObject({ status: "inactive" });
  });

  it("marks supplied floor impact load and dynamic stiffness used when the impact route is live", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      loadBasisKgM2: "120",
      resilientLayerDynamicStiffnessMNm3: "15"
    };
    const status = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"] satisfies readonly RequestedOutputId[]
    });

    expect(status["rebuild-load-basis"]).toMatchObject({ status: "used" });
    expect(status["rebuild-dynamic-stiffness"]).toMatchObject({ status: "used" });
  });

  it("marks wall layer roles inactive while material and thickness feed a formula route", () => {
    const status = buildLayerInputEffectiveness({
      layers: wallLayers,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expect(status["layer-1"]?.material).toMatchObject({ status: "used" });
    expect(status["layer-1"]?.thickness).toMatchObject({ status: "used" });
    expect(status["layer-1"]?.role).toMatchObject({ status: "inactive" });
  });

  it("marks floor layer roles used by a live floor impact route", () => {
    const status = buildLayerInputEffectiveness({
      layers: floorLayers,
      mode: "floor",
      result: makeImpactResult(),
      selectedOutputs: ["DeltaLw"]
    });

    expect(status["floor-layer-2"]?.role).toMatchObject({ status: "used" });
  });

  it("marks floor layer roles inactive for airborne-only output sets", () => {
    const status = buildLayerInputEffectiveness({
      layers: floorLayers,
      mode: "floor",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expect(status["floor-layer-1"]?.role).toMatchObject({ status: "inactive" });
  });

  it("marks layer material thickness and floor role used for exact source matching", () => {
    const wallStatus = buildLayerInputEffectiveness({
      layers: wallLayers,
      mode: "wall",
      result: makeAirborneResult({ origin: "measured_exact_full_stack" }),
      selectedOutputs: ["Rw"]
    });
    const floorStatus = buildLayerInputEffectiveness({
      layers: floorLayers,
      mode: "floor",
      result: makeImpactResult({ exact: true }),
      selectedOutputs: ["DeltaLw"]
    });

    expect(wallStatus["layer-1"]?.material).toMatchObject({ status: "used" });
    expect(wallStatus["layer-1"]?.thickness).toMatchObject({ status: "used" });
    expect(wallStatus["layer-1"]?.role).toMatchObject({ status: "inactive" });
    expect(floorStatus["floor-layer-2"]?.role).toMatchObject({ status: "used" });
  });
});
