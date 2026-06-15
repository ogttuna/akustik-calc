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
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner";

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh";
const PREVIOUS_OWNER_CANDIDATE_ID =
  "floor.user_material_impact_context_field_only_adapter_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after floor user-material impact context field-only adapter";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const LAB_PLUS_FIELD_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const FULL_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const FULL_IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 3,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const FIELD_CONTEXT_WITHOUT_LOW_FREQUENCY_OWNER = {
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

const CUSTOM_HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const CUSTOM_LOW_DENSITY_FLOOR_STACK = CUSTOM_HEAVY_FLOATING_FLOOR_STACK.map((layer) =>
  layer.materialId === CUSTOM_HEAVY_CONCRETE_ID
    ? { ...layer, materialId: CUSTOM_LOW_DENSITY_CONCRETE_ID }
    : layer
) as readonly LayerInput[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

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
      densityKgM3: 2400,
      id: CUSTOM_HEAVY_CONCRETE_ID,
      name: "Custom Floor Heavy Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 1200,
      id: CUSTOM_LOW_DENSITY_CONCRETE_ID,
      name: "Custom Floor Low Density Concrete",
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
  return calculateAssembly(input.layers ?? CUSTOM_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    catalog: buildCustomFloorCatalog(),
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwner: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    selectedCandidateId: PREVIOUS_OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectFieldOnlyValues(result: ReturnType<typeof calculateCustomFloor>): void {
  expect(result.supportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.impact).toMatchObject({
    CI50_2500: 3,
    DeltaLw: 24.3,
    LPrimeNT50: 52.9,
    LPrimeNTw: 49.9,
    LPrimeNW: 52.3,
    LnW: 50.3,
    metricBasis: {
      CI50_2500: "explicit_user_impact_ci50_2500_input",
      DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    }
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    requestedBasis: "field_apparent",
    runtimeBasisId: "source_absent_field_building_adapter_error_budget",
    selectedCandidateId: "floor.impact_field_context.field_building_adapter",
    supportedMetrics: [...FIELD_IMPACT_OUTPUTS]
  });
}

describe("post-V1 floor user-material impact context field-only adapter coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next numeric coverage gap", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      selectedCandidateId: PREVIOUS_OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, COVERAGE_REFRESH_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, COVERAGE_REFRESH_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("re-probes field-only and mixed custom heavy floating-floor values without moving runtime", () => {
    const fieldOnly = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const mixed = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: LAB_PLUS_FIELD_OUTPUTS
    });

    expectFieldOnlyValues(fieldOnly);
    expect(mixed.supportedTargetOutputs).toEqual([...LAB_PLUS_FIELD_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNT50: 52.9,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3
    });
    expect(mixed.impactPredictorStatus).toMatchObject({
      active: true,
      implementedFormulaEstimate: true,
      inputMode: "derived_from_visible_layers"
    });
  });

  it("keeps missing low-frequency owner limited to L'nT,50", () => {
    const result = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FIELD_CONTEXT_WITHOUT_LOW_FREQUENCY_OWNER,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3
    });
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.impactPredictorStatus.futureSupportedTargetOutputs).toEqual(["L'nT,50"]);
  });

  it("keeps missing field context and missing lab-anchor inputs parked", () => {
    const missingFieldContext = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const missingLabAnchor = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(missingFieldContext.impact).toBeNull();
    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext"],
      origin: "needs_input",
      route: "floor"
    });

    expect(missingLabAnchor.supportedTargetOutputs).toEqual([]);
    expect(missingLabAnchor.unsupportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(missingLabAnchor.impact).toBeNull();
    expect(missingLabAnchor.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      route: "floor"
    });
  });

  it("keeps low-density custom concrete off the heavy-concrete basis and generic ASTM impact aliases unsupported", () => {
    const lowDensityFieldOnly = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      layers: CUSTOM_LOW_DENSITY_FLOOR_STACK,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const astm = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_IMPACT_OUTPUTS
    });

    expect(lowDensityFieldOnly.supportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(lowDensityFieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(lowDensityFieldOnly.impact).toMatchObject({
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      metricBasis: {
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(lowDensityFieldOnly.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_IMPACT_OUTPUTS]);
    expect(astm.impact).toBeNull();
    expect(astm.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      route: "floor",
      unsupportedOutputs: [...ASTM_IMPACT_OUTPUTS]
    });
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout and next rerank", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(PREVIOUS_OWNER_FILE.replace("packages/engine/", ""));
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
