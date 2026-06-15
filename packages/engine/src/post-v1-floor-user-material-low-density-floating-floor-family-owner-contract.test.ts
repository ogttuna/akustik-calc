import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AirborneContext,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS } from "./lightweight-concrete-delta-lw-runtime-corridor";
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_low_density_floating_floor_family_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_OWNER_PLAN_2026-06-15.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density floating-floor family coverage refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_floating_floor_family_owner";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 6,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 6,
  sourceRowsImported: 0
} as const;

const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const FULL_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const FULL_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const FULL_IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 3,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const CUSTOM_LOW_DENSITY_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_LOW_DENSITY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const CUSTOM_HEAVY_STACK = CUSTOM_LOW_DENSITY_STACK.map((layer) =>
  layer.materialId === CUSTOM_LOW_DENSITY_CONCRETE_ID
    ? { ...layer, materialId: CUSTOM_HEAVY_CONCRETE_ID }
    : layer
) as readonly LayerInput[];

function customMaterial(input: {
  category: MaterialDefinition["category"];
  densityKgM3: number;
  id: string;
  name: string;
  tags: readonly string[];
}): MaterialDefinition {
  return {
    acoustic: {
      behavior: input.category === "support" ? "resilient_layer" : "rigid_mass",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: input.category,
    densityKgM3: input.densityKgM3,
    id: input.id,
    name: input.name,
    tags: [...input.tags]
  };
}

function buildCustomFloorCatalog(): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    customMaterial({
      category: "mass",
      densityKgM3: 1200,
      id: CUSTOM_LOW_DENSITY_CONCRETE_ID,
      name: "Custom Floor Low Density Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 2400,
      id: CUSTOM_HEAVY_CONCRETE_ID,
      name: "Custom Floor Heavy Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      name: "Custom Floor Resilient Underlay",
      tags: ["custom", "resilient", "impact"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 2000,
      id: CUSTOM_SCREED_ID,
      name: "Custom Floor Screed",
      tags: ["custom", "floor", "mass"]
    }),
    customMaterial({
      category: "finish",
      densityKgM3: 2200,
      id: CUSTOM_TILE_ID,
      name: "Custom Floor Tile",
      tags: ["custom", "floor", "finish"]
    })
  ];
}

function calculateCustomFloor(input: {
  airborneContext?: AirborneContext | null;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  layers?: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_LOW_DENSITY_STACK, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    catalog: buildCustomFloorCatalog(),
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function summarizeOwnerCloseout() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      selectedNextAction: OWNER_ACTION,
      selectedNextFile: OWNER_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor user-material low-density floating-floor family owner", () => {
  it("lands the runtime owner and selects coverage refresh next", () => {
    expect(summarizeOwnerCloseout()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });
  });

  it("routes custom low-density concrete floating floors through the lightweight family and field adapter", () => {
    const result = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: FULL_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.floorSystemEstimate).toMatchObject({
      structuralFamily: "lightweight concrete"
    });
    expect(result.impact).toMatchObject({
      CI50_2500: 3,
      DeltaLw: 24.3,
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      metricBasis: {
        CI50_2500: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FIELD_OUTPUTS]
    });
  });

  it("keeps heavy custom concrete on the heavy floating-floor formula basis", () => {
    const result = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      layers: CUSTOM_HEAVY_STACK,
      targetOutputs: ["Ln,w", "DeltaLw", ...FIELD_OUTPUTS]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNT50: 52.9,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3,
      metricBasis: {
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });
  });

  it("keeps missing dynamic stiffness/load basis and generic ASTM ratings out of the owner", () => {
    const missingDynamic = calculateCustomFloor({
      floorImpactContext: { loadBasisKgM2: FULL_FLOOR_IMPACT_CONTEXT.loadBasisKgM2 },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const missingLoad = calculateCustomFloor({
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3: FULL_FLOOR_IMPACT_CONTEXT.resilientLayerDynamicStiffnessMNm3
      },
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const astm = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(missingDynamic.supportedTargetOutputs).toEqual([]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      route: "floor"
    });

    expect(missingLoad.supportedTargetOutputs).toEqual([]);
    expect(missingLoad.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      route: "floor"
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the landed owner", () => {
    for (const path of [
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const ownerPlan = readRepoFile(OWNER_PLAN_DOC);
    expect(ownerPlan).toContain(PREVIOUS_RERANK_ACTION);
    expect(ownerPlan).toContain(PREVIOUS_RERANK_FILE);
    expect(ownerPlan).toContain(PREVIOUS_RERANK_STATUS);
    expect(ownerPlan).toContain(OWNER_ACTION);
    expect(ownerPlan).toContain(OWNER_FILE);
    expect(ownerPlan).toContain(OWNER_STATUS);
    expect(ownerPlan).toContain(SELECTED_NEXT_ACTION);
    expect(ownerPlan).toContain(SELECTED_NEXT_FILE);
    expect(ownerPlan).toContain(SELECTED_NEXT_PLAN_DOC);
    expect(ownerPlan).toContain(SELECTED_CANDIDATE_ID);
    expect(ownerPlan).toContain("Rw 53");
    expect(ownerPlan).toContain("Ln,w 64.3");
    expect(ownerPlan).toContain("DeltaLw 24.3");
    expect(ownerPlan).toContain("L'nT,50 66.9");

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts");
  });
});
