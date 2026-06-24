import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildRouteInputTaskElementIds,
  buildLayerInputEffectiveness,
  buildRouteInputEffectiveness,
  getMissingInputTask,
  parseEstimateError,
  showBuildingPredictionContext,
  showFloorImpactContext,
  showImpactContext
} from "./calculator-workbench";
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

function makeImpactResult(input?: { ci?: number; exact?: boolean }): AssemblyCalculation {
  const supportedTargetOutputs: RequestedOutputId[] = ["DeltaLw"];
  if (typeof input?.ci === "number") {
    supportedTargetOutputs.push("CI");
  }

  return {
    impact: {
      availableOutputs: ["DeltaLw"],
      basis: input?.exact ? "exact_source_impact_route" : "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      CI: input?.ci,
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
    supportedTargetOutputs,
    unsupportedTargetOutputs: []
  } as unknown as AssemblyCalculation;
}

function expectEffectiveness(
  effectiveness: { status: string; title: string } | undefined,
  status: string,
  titleParts: readonly string[]
): void {
  expect(effectiveness).toMatchObject({ status });
  for (const titlePart of titleParts) {
    expect(effectiveness?.title).toContain(titlePart);
  }
}

describe("route input effectiveness", () => {
  it("parses structured estimate error envelopes without exposing issue JSON", () => {
    const message = parseEstimateError({
      error: "The estimate result could not be published safely. Review the highlighted calculator inputs and try again.",
      errorKind: "result_validation",
      issues: [
        {
          message: "Number must be greater than 0",
          path: ["ratings", "field", "receivingRoomVolumeM3"]
        }
      ],
      ok: false
    });

    expect(message).toBe("The estimate result could not be published safely. Review the highlighted calculator inputs and try again.");
    expect(message).not.toContain("Number must be greater than 0");
    expect(message).not.toContain("ratings");
  });

  it("keeps estimate error parsing safe for malformed payloads", () => {
    expect(parseEstimateError(null)).toBe("Estimate failed.");
    expect(parseEstimateError({ error: "" })).toBe("Estimate failed.");
    expect(parseEstimateError({ issues: [{ message: "raw issue", path: ["ratings"] }] })).toBe("Estimate failed.");
  });

  it("maps area-family remote tasks to both panel dimension fields", () => {
    const targets = buildRouteInputTaskElementIds([
      getMissingInputTask("ratings.field.partitionAreaM2")
    ]);

    expect([...targets].sort()).toEqual([
      "rebuild-panel-height",
      "rebuild-panel-width"
    ]);
  });

  it("keeps direct panel dimension remote tasks narrow", () => {
    const widthTargets = buildRouteInputTaskElementIds([
      getMissingInputTask("panelWidthMm")
    ]);
    const heightTargets = buildRouteInputTaskElementIds([
      getMissingInputTask("panelHeightMm")
    ]);

    expect([...widthTargets].sort()).toEqual(["rebuild-panel-width"]);
    expect([...heightTargets].sort()).toEqual(["rebuild-panel-height"]);
  });

  it("maps grouped impact field context to the visible impact context controls", () => {
    const targets = buildRouteInputTaskElementIds([
      getMissingInputTask("impactFieldContext")
    ]);

    expect([...targets].sort()).toEqual([
      "rebuild-ci-db",
      "rebuild-ci50-2500-db",
      "rebuild-field-k-db",
      "rebuild-impact-room-volume"
    ]);
  });

  it("merges mixed remote route-input targets without dropping area, building, or impact controls", () => {
    const targets = buildRouteInputTaskElementIds([
      getMissingInputTask("ratings.field.partition_area_m2"),
      getMissingInputTask("sourceRoomVolumeM3"),
      getMissingInputTask("buildingPredictionOutputBasis"),
      getMissingInputTask("impactFieldContext")
    ]);

    expect([...targets].sort()).toEqual([
      "rebuild-building-output-basis",
      "rebuild-ci-db",
      "rebuild-ci50-2500-db",
      "rebuild-field-k-db",
      "rebuild-impact-room-volume",
      "rebuild-panel-height",
      "rebuild-panel-width",
      "rebuild-source-room-volume"
    ]);
  });

  it("does not turn layer-stack route tasks into numeric context field highlights", () => {
    const targets = buildRouteInputTaskElementIds([
      getMissingInputTask("toppingOrFloatingLayer")
    ]);

    expect([...targets]).toEqual([]);
  });

  it("does not show building prediction inputs for non-airborne output sets", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const
    };

    expect(showBuildingPredictionContext(context, ["Ln,w"], null)).toBe(false);
    expect(showBuildingPredictionContext(context, ["Rw"], null)).toBe(true);
    expect(showBuildingPredictionContext(context, ["DnT,A,k"], null)).toBe(true);
    expect(showBuildingPredictionContext(context, ["AIIC"], null)).toBe(false);
  });

  it("shows impact context panels for newly selectable impact output sets", () => {
    expect(showImpactContext(["AIIC"], null)).toBe(true);
    expect(showImpactContext(["Ln,w+CI"], null)).toBe(true);
    expect(showImpactContext(["LnT,A"], null)).toBe(true);
    expect(showImpactContext(["IIC"], null)).toBe(false);
    expect(showFloorImpactContext(["AIIC"], null)).toBe(true);
    expect(showFloorImpactContext(["IIC"], null)).toBe(true);
    expect(showFloorImpactContext(["Rw"], null)).toBe(false);
  });

  // AGENT COORDINATION 2026-06-22: visibility/status audit only; keep these tests focused on panel visibility not formula behavior.
  it("keeps the visible Building panel truthful when Building mode is selected for lab-only Rw", () => {
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
      result: makeAirborneResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expect(showBuildingPredictionContext(context, ["Rw"], makeAirborneResult())).toBe(true);
    for (const inputId of [
      "rebuild-panel-width",
      "rebuild-panel-height",
      "rebuild-receiving-room-volume",
      "rebuild-receiving-room-rt60",
      "rebuild-source-room-volume",
      "rebuild-flanking-junction-class",
      "rebuild-conservative-flanking-assumption",
      "rebuild-junction-coupling-length",
      "rebuild-building-output-basis"
    ]) {
      expectEffectiveness(status[inputId], "inactive", ["lab airborne", "field/building"]);
    }
  });

  it("keeps visible field/building blockers distinct from inactive context fields while still in Lab mode", () => {
    const status = buildRouteInputEffectiveness({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: new Set(["rebuild-airborne-mode", "rebuild-panel-width", "rebuild-receiving-room-volume"]),
      selectedOutputs: ["R'w"]
    });

    expect(showBuildingPredictionContext(WORKBENCH_V2_DEFAULT_CONTEXT, ["R'w"], makeAirborneResult())).toBe(false);
    expectEffectiveness(status["rebuild-airborne-mode"], "needed", ["Airborne mode", "selected output"]);
    expectEffectiveness(status["rebuild-panel-width"], "needed", ["Panel width", "selected output"]);
    expectEffectiveness(status["rebuild-receiving-room-volume"], "needed", ["Receiving room volume", "selected output"]);
    expectEffectiveness(status["rebuild-receiving-room-rt60"], "inactive", ["Field or Building", "Lab mode"]);
    expectEffectiveness(status["rebuild-source-room-volume"], "inactive", ["Building-prediction", "outside Building mode"]);
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

  it("documents the current route context badge title baseline", () => {
    const buildingLabContext = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction" as const,
      sourceRoomVolumeM3: "55"
    };
    const labOnlyStatus = buildRouteInputEffectiveness({
      context: buildingLabContext,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(labOnlyStatus["rebuild-source-room-volume"], "inactive", ["lab airborne", "field/building"]);

    const liveBuildingContext = {
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
    const liveBuildingStatus = buildRouteInputEffectiveness({
      context: liveBuildingContext,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ fieldRwPrime: 40 }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(liveBuildingStatus["rebuild-panel-width"], "used", ["current building-prediction route"]);
    expectEffectiveness(liveBuildingStatus["rebuild-source-room-volume"], "used", [
      "current building-prediction route"
    ]);

    const missingContextStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction" as const
      },
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: new Set(["rebuild-panel-width", "rebuild-source-room-volume"]),
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(missingContextStatus["rebuild-panel-width"], "needed", [
      "Panel width",
      "current route",
      "selected output"
    ]);
    expectEffectiveness(missingContextStatus["rebuild-receiving-room-rt60"], "inactive", [
      "No supported field/building output",
      "active route"
    ]);

    const exactSourceStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        wallCavity1LayerIndices: "2",
        wallSideALeafLayerIndices: "1",
        wallSideBLeafLayerIndices: "3",
        wallTopologyMode: "double_leaf_framed" as const
      },
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ origin: "measured_exact_full_stack" }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(exactSourceStatus["rebuild-wall-side-a-rows"], "inactive", [
      "Exact source",
      "current output",
      "manual wall topology"
    ]);

    const liveImpactStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        loadBasisKgM2: "120",
        resilientLayerDynamicStiffnessMNm3: "15"
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"] satisfies readonly RequestedOutputId[]
    });

    expectEffectiveness(liveImpactStatus["rebuild-load-basis"], "used", ["floor impact", "formula route"]);
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

  it("keeps building context inputs inactive when a field output only has stale helper metrics", () => {
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
      result: makeAirborneResult({
        fieldRwPrime: 40,
        unsupportedFieldOutput: true
      }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(status["rebuild-panel-width"], "inactive", ["unsupported", "active route"]);
    expectEffectiveness(status["rebuild-source-room-volume"], "inactive", ["unsupported", "active route"]);
    expectEffectiveness(status["rebuild-building-output-basis"], "inactive", ["unsupported", "active route"]);
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

  it("keeps missing building context inputs needed without marking unresolved context used", () => {
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

    expect(status["rebuild-airborne-mode"]).toMatchObject({ status: "inactive" });
    expect(status["rebuild-panel-width"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-source-room-volume"]).toMatchObject({ status: "needed" });
    expect(status["rebuild-receiving-room-rt60"]).toMatchObject({ status: "inactive" });
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
    expectEffectiveness(status["rebuild-receiving-room-rt60"], "inactive", ["Field or Building", "Lab mode"]);
  });

  it("explains needed/defaulted route context titles", () => {
    const missingContextStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction" as const
      },
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: new Set(["rebuild-panel-width"]),
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(missingContextStatus["rebuild-panel-width"], "needed", [
      "Panel width",
      "required",
      "selected output"
    ]);

    const defaultedContextStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction" as const
      },
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({
        fieldRwPrime: 40,
        propertyDefaults: [
          {
            field: "panelWidthMm",
            reason: "test default",
            source: "engineering_default",
            unit: "mm",
            value: 3000
          }
        ]
      }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(defaultedContextStatus["rebuild-panel-width"], "defaulted", [
      "Panel width",
      "route default",
      "replace"
    ]);
  });

  it("explains route context inactivity for mode and output-set boundaries", () => {
    const fieldModeStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "field_between_rooms" as const,
        panelHeightMm: "2600",
        panelWidthMm: "3000",
        receivingRoomRt60S: "0.5",
        receivingRoomVolumeM3: "50"
      },
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ fieldRwPrime: 40 }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["R'w"]
    });

    expectEffectiveness(fieldModeStatus["rebuild-panel-width"], "used", [
      "field airborne route",
      "current output"
    ]);
    expectEffectiveness(fieldModeStatus["rebuild-building-output-basis"], "inactive", [
      "Building-prediction",
      "Field airborne mode",
      "current output"
    ]);

    const impactOnlyStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction" as const
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"]
    });

    expectEffectiveness(impactOnlyStatus["rebuild-panel-width"], "inactive", [
      "Airborne context",
      "selected output set",
      "not airborne"
    ]);
    expectEffectiveness(impactOnlyStatus["rebuild-building-output-basis"], "inactive", [
      "Airborne context",
      "selected output set",
      "not airborne"
    ]);

    const autoTopologyStatus = buildRouteInputEffectiveness({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(autoTopologyStatus["rebuild-wall-side-a-rows"], "inactive", [
      "Manual wall topology",
      "Auto",
      "current output"
    ]);
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

  it("explains wall topology route context titles", () => {
    const context = {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallTopologyMode: "double_leaf_framed" as const
    };
    const liveStatus = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(liveStatus["rebuild-wall-topology-mode"], "used", [
      "wall topology",
      "formula route",
      "current output"
    ]);
    expectEffectiveness(liveStatus["rebuild-wall-side-a-rows"], "used", [
      "wall topology",
      "formula route",
      "leaf/cavity grouping"
    ]);

    const exactStatus = buildRouteInputEffectiveness({
      context,
      layerCount: 3,
      mode: "wall",
      result: makeAirborneResult({ origin: "measured_exact_full_stack" }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(exactStatus["rebuild-wall-topology-mode"], "inactive", [
      "Exact source",
      "current output",
      "manual topology"
    ]);
    expectEffectiveness(exactStatus["rebuild-wall-side-a-rows"], "inactive", [
      "Exact source",
      "current output",
      "manual wall topology"
    ]);
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

  it("explains impact route context titles", () => {
    const liveFloorStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        loadBasisKgM2: "120",
        resilientLayerDynamicStiffnessMNm3: "15"
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"]
    });

    expectEffectiveness(liveFloorStatus["rebuild-load-basis"], "used", [
      "floor impact",
      "formula route",
      "current output"
    ]);
    expectEffectiveness(liveFloorStatus["rebuild-dynamic-stiffness"], "used", [
      "dynamic stiffness",
      "floor impact",
      "current output"
    ]);

    const exactFloorStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        loadBasisKgM2: "120",
        resilientLayerDynamicStiffnessMNm3: "15"
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult({ exact: true }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"]
    });

    expectEffectiveness(exactFloorStatus["rebuild-load-basis"], "inactive", [
      "Exact impact source",
      "current output",
      "formula route"
    ]);

    const liveImpactFieldStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        fieldKDb: "2"
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult({ ci: -1 }),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["CI"]
    });

    expectEffectiveness(liveImpactFieldStatus["rebuild-field-k-db"], "used", [
      "impact field",
      "formula route",
      "current output"
    ]);

    const inactiveImpactFieldStatus = buildRouteInputEffectiveness({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        fieldKDb: "2"
      },
      layerCount: 3,
      mode: "floor",
      result: makeImpactResult(),
      routeInputTaskElementIds: emptyTaskSet,
      selectedOutputs: ["DeltaLw"]
    });

    expectEffectiveness(inactiveImpactFieldStatus["rebuild-field-k-db"], "inactive", [
      "impact field",
      "selected output"
    ]);
  });

  it("marks wall layer roles inactive while material and thickness feed a formula route", () => {
    const status = buildLayerInputEffectiveness({
      layers: wallLayers,
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(status["layer-1"]?.material, "used", ["formula route", "layer stack"]);
    expectEffectiveness(status["layer-1"]?.thickness, "used", ["formula route", "layer mass", "geometry"]);
    expectEffectiveness(status["layer-1"]?.role, "inactive", ["Wall layer role", "Wall topology"]);
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

    expectEffectiveness(wallStatus["layer-1"]?.material, "used", ["exact source", "current output", "construction"]);
    expectEffectiveness(wallStatus["layer-1"]?.thickness, "used", ["exact source", "current output", "construction"]);
    expect(wallStatus["layer-1"]?.role).toMatchObject({ status: "inactive" });
    expectEffectiveness(floorStatus["floor-layer-2"]?.role, "used", [
      "exact impact source",
      "current output",
      "construction"
    ]);
  });

  it("explains missing layer thickness as needed for the current output", () => {
    const status = buildLayerInputEffectiveness({
      layers: [{ ...wallLayers[0]!, thicknessMm: "" }],
      mode: "wall",
      result: makeAirborneResult(),
      selectedOutputs: ["Rw"]
    });

    expectEffectiveness(status["layer-1"]?.thickness, "needed", [
      "layer thickness",
      "current output",
      "layer stack"
    ]);
  });
});
