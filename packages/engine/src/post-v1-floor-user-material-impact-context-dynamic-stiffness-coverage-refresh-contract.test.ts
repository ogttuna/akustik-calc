import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS } from "./lightweight-concrete-delta-lw-runtime-corridor";
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner";

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md";
const PREVIOUS_OWNER_CANDIDATE_ID =
  "floor.user_material_impact_context_dynamic_stiffness_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md";

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

const IMPACT_LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FULL_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

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
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  layers?: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_HEAVY_FLOATING_FLOOR_STACK, {
    calculator: "dynamic",
    catalog: buildCustomFloorCatalog(),
    floorImpactContext: input.floorImpactContext,
    targetOutputs: input.targetOutputs ?? IMPACT_LAB_OUTPUTS
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
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectNeedsInputBoundary(
  result: ReturnType<typeof calculateCustomFloor>,
  missingPhysicalInputs: readonly string[]
) {
  expect(result.impact).toBeNull();
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...IMPACT_LAB_OUTPUTS]);
  expect(result.acousticAnswerBoundary).toMatchObject({
    missingPhysicalInputs: [...missingPhysicalInputs],
    origin: "needs_input",
    unsupportedOutputs: [...IMPACT_LAB_OUTPUTS]
  });
  expect(result.impactPredictorStatus).toMatchObject({
    active: false,
    implementedFormulaEstimate: false,
    readyForPlannedSolver: false
  });
}

describe("post-V1 floor user-material impact context dynamic-stiffness coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next numeric coverage gap", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
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
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_FILE))).toBe(true);
  });

  it("re-probes the context-owned custom heavy floating-floor stack without moving values", () => {
    const result = calculateCustomFloor({
      floorImpactContext: FULL_IMPACT_CONTEXT
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      floatingLoadSurfaceMassKgM2: 76,
      resilientDynamicStiffnessMNm3: 30
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(result.impactPredictorStatus).toMatchObject({
      active: true,
      implementedFormulaEstimate: true,
      inputMode: "derived_from_visible_layers",
      readyForPlannedSolver: true
    });
    expect(result.supportedTargetOutputs).toEqual([...IMPACT_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps missing dynamic stiffness at needs_input without using a substitute estimate", () => {
    const result = calculateCustomFloor({
      floorImpactContext: {
        loadBasisKgM2: 76
      }
    });

    expectNeedsInputBoundary(result, ["resilientLayerDynamicStiffnessMNm3"]);
  });

  it("derives missing load basis from the visible custom floating package", () => {
    const result = calculateCustomFloor({
      floorImpactContext: {
        resilientLayerDynamicStiffnessMNm3: 30
      }
    });

    expect(result.supportedTargetOutputs).toEqual([...IMPACT_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LnW: 50.1,
      floatingLoadSurfaceMassKgM2: 77.6
    });
  });

  it("keeps missing dynamic stiffness at needs_input while visible load basis is derivable", () => {
    const result = calculateCustomFloor({});

    expectNeedsInputBoundary(result, ["resilientLayerDynamicStiffnessMNm3"]);
  });

  it("routes low-density custom concrete through the lightweight family instead of the heavy concrete carrier", () => {
    const result = calculateCustomFloor({
      floorImpactContext: FULL_IMPACT_CONTEXT,
      layers: CUSTOM_LOW_DENSITY_FLOOR_STACK
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 64.3,
      metricBasis: {
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.supportedTargetOutputs).toEqual([...IMPACT_LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps ASTM and field/building impact outputs outside this owner", () => {
    const astm = calculateCustomFloor({
      floorImpactContext: FULL_IMPACT_CONTEXT,
      targetOutputs: ASTM_IMPACT_OUTPUTS
    });
    const fieldBuilding = calculateCustomFloor({
      floorImpactContext: FULL_IMPACT_CONTEXT,
      targetOutputs: FIELD_BUILDING_IMPACT_OUTPUTS
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_IMPACT_OUTPUTS]);
    expect(astm.impact).toBeNull();

    expect(fieldBuilding.supportedTargetOutputs).toEqual([]);
    expect(fieldBuilding.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_IMPACT_OUTPUTS]);
    expect(fieldBuilding.impact).toBeNull();
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
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts"
    );
  });
});
