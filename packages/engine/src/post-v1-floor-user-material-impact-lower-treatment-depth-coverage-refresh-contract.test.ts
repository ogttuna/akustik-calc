import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ImpactErrorBudget,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS } from "./heavy-concrete-combined-impact-formula-corridor";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner";

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_OWNER_PLAN_2026-06-26.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_lower_treatment_depth_owner_landed_runtime_selected_coverage_refresh";
const PREVIOUS_OWNER_CANDIDATE_ID =
  "floor.user_material_impact_lower_treatment_depth_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after floor user-material impact lower-treatment depth coverage refresh";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 3,
  newCalculableTargetOutputs: 4,
  requiredPhysicalInputsCaptured: 2,
  runtimeBasisPromotions: 3,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 8,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 7
} as const;

const CUSTOM_HEAVY_CONCRETE_ID = "custom_lower_treatment_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_lower_treatment_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_lower_treatment_screed";
const CUSTOM_TILE_ID = "custom_lower_treatment_tile";
const CUSTOM_LOWER_SUPPORT_ID = "custom_lower_treatment_resilient_clip_support";
const CUSTOM_CEILING_FILL_ID = "custom_lower_treatment_mineral_fill";
const CUSTOM_CEILING_BOARD_ID = "custom_lower_treatment_board";

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const CUSTOM_VISIBLE_LOWER_TREATMENT_STACK = [
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { materialId: CUSTOM_LOWER_SUPPORT_ID, thicknessMm: 90 },
  { floorRole: "ceiling_fill", materialId: CUSTOM_CEILING_FILL_ID, thicknessMm: 80 },
  { floorRole: "ceiling_board", materialId: CUSTOM_CEILING_BOARD_ID, thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: CUSTOM_CEILING_BOARD_ID, thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const STACK_WITHOUT_LOWER_SUPPORT = CUSTOM_VISIBLE_LOWER_TREATMENT_STACK.filter(
  (layer) => layer.materialId !== CUSTOM_LOWER_SUPPORT_ID
) as readonly LayerInput[];

const REQUIRED_DOCS = [
  "AGENTS.md",
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
  behavior?: NonNullable<MaterialDefinition["acoustic"]>["behavior"];
  category: MaterialDefinition["category"];
  densityKgM3: number;
  id: string;
  impact?: MaterialDefinition["impact"];
  name: string;
  tags: readonly string[];
}): MaterialDefinition {
  return {
    acoustic: {
      behavior: input.behavior ??
        (input.category === "insulation"
          ? "porous_absorber"
          : input.category === "support"
            ? "resilient_layer"
            : "rigid_mass"),
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: input.category,
    densityKgM3: input.densityKgM3,
    id: input.id,
    impact: input.impact,
    name: input.name,
    tags: [...input.tags]
  };
}

function buildCustomFloorCatalog(input?: {
  omitDynamicStiffness?: boolean;
}): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    customMaterial({
      category: "mass",
      densityKgM3: 2400,
      id: CUSTOM_HEAVY_CONCRETE_ID,
      name: "Custom Lower Treatment Heavy Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      impact: input?.omitDynamicStiffness ? undefined : { dynamicStiffnessMNm3: 30 },
      name: "Custom Lower Treatment Resilient Underlay",
      tags: ["custom", "resilient", "impact"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 2000,
      id: CUSTOM_SCREED_ID,
      name: "Custom Lower Treatment Screed",
      tags: ["custom", "floor", "mass"]
    }),
    customMaterial({
      category: "finish",
      densityKgM3: 2200,
      id: CUSTOM_TILE_ID,
      name: "Custom Lower Treatment Tile",
      tags: ["custom", "floor", "finish"]
    }),
    customMaterial({
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_LOWER_SUPPORT_ID,
      name: "Custom Lower Treatment Clip Support",
      tags: ["custom", "support", "resilient", "ceiling-support", "clip"]
    }),
    customMaterial({
      behavior: "porous_absorber",
      category: "insulation",
      densityKgM3: 35,
      id: CUSTOM_CEILING_FILL_ID,
      name: "Custom Lower Treatment Mineral Fill",
      tags: ["custom", "porous", "mineral-wool", "ceiling-fill"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 800,
      id: CUSTOM_CEILING_BOARD_ID,
      name: "Custom Lower Treatment Board",
      tags: ["custom", "gypsum_board", "ceiling-board"]
    })
  ];
}

function calculateCustomFloor(input: {
  catalog?: readonly MaterialDefinition[];
  impactFieldContext?: ImpactFieldContext | null;
  layers?: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_VISIBLE_LOWER_TREATMENT_STACK, {
    calculator: "dynamic",
    catalog: input.catalog ?? buildCustomFloorCatalog(),
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
    ownerCountersReprobed: OWNER_COUNTERS,
    previousOwner: {
      action: PREVIOUS_OWNER_ACTION,
      file: PREVIOUS_OWNER_FILE,
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      status: PREVIOUS_OWNER_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedCandidateId: PREVIOUS_OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectCombinedLabAnchor(result: ReturnType<typeof calculateCustomFloor>): void {
  expect(result.impact).toMatchObject({
    DeltaLw: 30.9,
    LnW: 43.6,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bareReferenceLnW: 74.5,
    baseSurfaceMassKgM2: 360,
    basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    floatingLoadSurfaceMassKgM2: 117.6,
    metricBasis: {
      DeltaLw: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      LnW: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    },
    resilientDynamicStiffnessMNm3: 30,
    scope: "heavy_concrete_combined_upper_lower_formula_corridor"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    selectedCandidateId: "floor.heavy_concrete_combined_upper_lower.lab_impact_formula",
    valuePins: expect.arrayContaining([
      { metric: "Ln,w", value: 43.6 },
      { metric: "DeltaLw", value: 30.9 }
    ])
  });
}

function expectCombinedFieldCompanions(result: ReturnType<typeof calculateCustomFloor>): void {
  expect(result.impact).toMatchObject({
    DeltaLw: 30.9,
    LPrimeNTw: 43.2,
    LPrimeNW: 45.6,
    LnW: 43.6,
    availableOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
    basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    metricBasis: {
      DeltaLw: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
      LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
      LnW: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
    }
  });
  expect(result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) =>
    budget.origin === "source_absent_field_building_adapter_error_budget"
  )).toBe(true);
}

describe("post-V1 floor user-material impact lower-treatment depth coverage refresh", () => {
  it("lands the no-runtime refresh and selects a fresh runtime-first rerank", () => {
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

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_FILE,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes lab, field-only, and mixed output shapes without moving values", () => {
    const lab = calculateCustomFloor({ targetOutputs: LAB_OUTPUTS });
    const fieldOnly = calculateCustomFloor({
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const mixed = calculateCustomFloor({
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: MIXED_OUTPUTS
    });

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expectCombinedLabAnchor(lab);

    expect(fieldOnly.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expectCombinedFieldCompanions(fieldOnly);
    expect(fieldOnly.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.impact_field_context.field_building_adapter",
      supportedMetrics: [...FIELD_OUTPUTS],
      valuePins: expect.arrayContaining([
        { metric: "L'n,w", value: 45.6 },
        { metric: "L'nT,w", value: 43.2 }
      ])
    });

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expectCombinedFieldCompanions(mixed);
  });

  it("keeps missing field context, dynamic stiffness, and lower support parked", () => {
    const missingFieldContext = calculateCustomFloor({ targetOutputs: FIELD_OUTPUTS });
    const missingDynamicStiffness = calculateCustomFloor({
      catalog: buildCustomFloorCatalog({ omitDynamicStiffness: true }),
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: MIXED_OUTPUTS
    });
    const missingLowerSupport = calculateCustomFloor({
      impactFieldContext: FIELD_CONTEXT,
      layers: STACK_WITHOUT_LOWER_SUPPORT,
      targetOutputs: MIXED_OUTPUTS
    });

    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_field_impact_missing_context",
      missingPhysicalInputs: ["impactFieldContext", "receivingRoomVolumeM3"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: [...FIELD_OUTPUTS]
    });

    expect(missingDynamicStiffness.supportedTargetOutputs).toEqual([]);
    expect(missingDynamicStiffness.unsupportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(missingDynamicStiffness.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_impact_missing_physical_inputs",
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: [...MIXED_OUTPUTS]
    });
    expect(missingDynamicStiffness.acousticAnswerBoundary?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["resilientLayerDynamicStiffnessMNm3"])
    );

    expect(missingLowerSupport.supportedTargetOutputs).toEqual([]);
    expect(missingLowerSupport.unsupportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(missingLowerSupport.impactPredictorStatus.warnings).toEqual(
      expect.arrayContaining([
        "Dynamic Calculator reinforced-concrete combined upper/lower impact runtime is waiting for ceilingOrLowerAssembly before promoting Ln,w / DeltaLw from the heavy-concrete combined formula corridor."
      ])
    );
  });

  it("keeps ASTM impact aliases unsupported on the ISO lower-treatment route", () => {
    const result = calculateCustomFloor({
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(result.impact).toBeNull();
    expect(result.acousticAnswerBoundary).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_floor_astm_iic_aiic_unsupported_boundary",
      origin: "unsupported",
      route: "floor",
      unsupportedOutputs: [...ASTM_OUTPUTS]
    });
  });

  it("keeps active docs and the current-gate runner aligned with the refresh", () => {
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
      expect(content, path).toContain("newCalculableLayerTemplates: 0");
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
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
