import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_GATE_CG2_COVERAGE_COUNTERS
} from "./post-v1-floor-common-floating-covering-expansion-gate-cg2";
import {
  POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
} from "./post-v1-next-numeric-coverage-gap-gate-ch";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS,
  POST_V1_GATE_CK_VALUE_PINS
} from "./post-v1-opening-leak-composite-wall-adapters-gate-ck";
import {
  POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import {
  POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_LABEL,
  POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS,
  buildPostV1GateCMRequiredPhysicalInputSurfaces,
  rankPostV1GateCMNextCoverageCandidates,
  summarizePostV1RequiredPhysicalInputSurfaceParityGateCM
} from "./post-v1-required-physical-input-surface-parity-gate-cm";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const HOST_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const SIMPLE_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_DOUBLE_LEAF_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42,
  studSpacingMm: 600,
  wallTopology: {
    supportTopology: "independent_frames"
  }
} as const satisfies AirborneContext;

const HEAVY_FLOATING_UPPER_TREATMENT_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID = "gate_cm_resilient_underlay_missing_dynamic";
const HEAVY_FLOATING_MISSING_DYNAMIC_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const SIMPLE_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const DIRECT_FLANKING_FIELD_CONTEXT = {
  ci50_2500Db: 4,
  directPathOffsetDb: 2,
  flankingPaths: [
    {
      id: "gate_cm_rigid_wall_path",
      junctionClass: "rigid",
      label: "Gate CM explicit reinforced-concrete wall flanking path",
      levelOffsetDb: 4,
      pathCount: 1,
      pathType: "wall",
      supportingElementFamily: "reinforced_concrete"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function catalogWithMissingDynamicStiffness(): readonly MaterialDefinition[] {
  const catalog = getDefaultMaterialCatalog();
  const base = catalog.find((material) => material.id === "generic_resilient_underlay_s30");

  if (!base) {
    throw new Error("Gate CM requires generic_resilient_underlay_s30 in the default catalog.");
  }

  return [
    ...catalog,
    {
      ...base,
      id: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID,
      impact: {},
      name: "Gate CM resilient underlay without dynamic stiffness"
    }
  ];
}

describe("post-V1 required physical input surface parity Gate CM", () => {
  it("lands a narrow no-runtime input-surface guard after Gate CL and selects Gate CN numeric coverage", () => {
    const summary = summarizePostV1RequiredPhysicalInputSurfaceParityGateCM();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION).toBe(
      POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts"
    );
    expect(summary).toMatchObject({
      inputSurfaceCounters: POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS,
      landedGate: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS
    });
  });

  it("records only selected runtime route inputs and does not turn Gate CM into UI polish", () => {
    const surfaces = buildPostV1GateCMRequiredPhysicalInputSurfaces();

    expect(surfaces).toHaveLength(POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS.inputSurfaceLedgers);
    expect(surfaces.map((surface) => surface.id)).toEqual([
      "wall.opening_leak_composite.field_building_inputs_gate_ck",
      "wall.common_flat_double_leaf.building_prediction_inputs_gate_cj",
      "floor.heavy_floating_upper_treatment.dynamic_delta_lw_inputs_gate_cg2",
      "floor.heavy_floating_upper_treatment.field_direct_flanking_inputs_gate_ch"
    ]);
    expect(surfaces.flatMap((surface) => surface.nonGoals)).toEqual(
      expect.arrayContaining(["frontend_ui_polish", "formula_retune", "source_row_crawl"])
    );

    for (const surface of surfaces) {
      expect(surface.noRuntimeValueMovement, surface.id).toBe(true);
      expect(surface.requiredPhysicalInputs.length, surface.id).toBeGreaterThan(0);
      expect(surface.missingInputBoundaries.length, surface.id).toBeGreaterThan(0);
      expect(surface.requiredPhysicalInputs, surface.id).not.toContain("openingLeakFieldBuildingAdapterBoundary");
    }
  });

  it("pins wall required-input boundaries without changing Gate CK or Gate CJ values", () => {
    const openingField = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
        openingLeakFieldBuildingAdapterBoundary: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS
    });
    const openingMissingRt = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
        openingLeakFieldBuildingAdapterBoundary: undefined,
        receivingRoomRt60S: undefined
      },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[]
    });
    const openingBuilding = calculateAssembly(HOST_WALL, {
      airborneContext: {
        ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
        openingLeakFieldBuildingAdapterBoundary: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS
    });
    const doubleLeafComplete = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: COMPLETE_DOUBLE_LEAF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS
    });
    const doubleLeafMissingStudSpacing = calculateAssembly(SIMPLE_DOUBLE_LEAF_STACK, {
      airborneContext: {
        ...COMPLETE_DOUBLE_LEAF_BUILDING_CONTEXT,
        studSpacingMm: undefined
      },
      calculator: "dynamic",
      targetOutputs: POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS
    });

    expect(openingField.metrics).toMatchObject({
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.field.metrics["R'w"]
    });
    expect(openingMissingRt.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(openingMissingRt.supportedTargetOutputs).toEqual([]);
    expect(openingBuilding.metrics).toMatchObject({
      estimatedDnTwDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["DnT,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CK_VALUE_PINS.building.metrics["R'w"]
    });

    expect(doubleLeafComplete.supportedTargetOutputs).toEqual([...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS]);
    expect(doubleLeafComplete.metrics).toMatchObject({
      estimatedDnADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,A"],
      estimatedDnTADb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,A"],
      estimatedDnTwDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["DnT,w"],
      estimatedDnWDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["Dn,w"],
      estimatedRwPrimeDb: POST_V1_GATE_CJ_BUILDING_VALUE_PINS[0].metrics["R'w"]
    });
    expect(doubleLeafMissingStudSpacing.supportedTargetOutputs).toEqual([]);
    expect(doubleLeafMissingStudSpacing.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportedMetrics: []
    });
  });

  it("pins floor required-input boundaries without changing Gate CG2 or Gate CH values", () => {
    const missingLoad = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      targetOutputs: ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[]
    });
    const missingDynamic = calculateAssembly(HEAVY_FLOATING_MISSING_DYNAMIC_STACK, {
      calculator: "dynamic",
      catalog: catalogWithMissingDynamicStiffness(),
      floorImpactContext: {
        loadBasisKgM2: 76
      },
      targetOutputs: ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[]
    });
    const completeDynamic = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 76,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      targetOutputs: ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[]
    });
    const simpleField = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: SIMPLE_FIELD_CONTEXT,
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[]
    });
    const directFlankingMissingCi50 = calculateAssembly(HEAVY_FLOATING_UPPER_TREATMENT_STACK, {
      calculator: "dynamic",
      impactFieldContext: {
        directPathOffsetDb: DIRECT_FLANKING_FIELD_CONTEXT.directPathOffsetDb,
        flankingPaths: DIRECT_FLANKING_FIELD_CONTEXT.flankingPaths,
        receivingRoomVolumeM3: DIRECT_FLANKING_FIELD_CONTEXT.receivingRoomVolumeM3
      },
      targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[]
    });

    expect(missingLoad.impact).toMatchObject({ LnW: 50 });
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      unsupportedOutputs: ["DeltaLw"]
    });
    expect(completeDynamic.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(POST_V1_GATE_CG2_COVERAGE_COUNTERS.newCalculableRequestShapes).toBe(10);

    expect(simpleField.impact).toMatchObject({
      LPrimeNT50: 53.6,
      LPrimeNTw: 49.6,
      LPrimeNW: 52
    });
    expect(directFlankingMissingCi50.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(directFlankingMissingCi50.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(directFlankingMissingCi50.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
      origin: "needs_input"
    });
    expect(POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS["L'nT,50"]).toBe(59.1);
  });

  it("selects numeric coverage rerank after the input guard instead of staying on surface work", () => {
    const candidates = rankPostV1GateCMNextCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      id: "next_numeric_coverage_gap_after_input_surface_guards",
      selectedNextActionIfSelected: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
      sliceKind: "numeric_scope_accuracy_rerank"
    });
    expect(candidates.filter((candidate) => candidate.sliceKind === "blocked_non_goal").map((candidate) => candidate.id)).toEqual([
      "frontend_ui_polish",
      "broad_source_row_crawl",
      "confidence_wording"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate CM", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("required physical input");
      expect(contents, path).toContain("needs_input");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts");
  });
});
