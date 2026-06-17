import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS } from "./lightweight-concrete-delta-lw-runtime-corridor";
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SELECTED_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan";
const PREVIOUS_SELECTED_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_PLAN_2026-06-15.md";

const OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_load_basis_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_OWNER_PLAN_2026-06-15.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_load_basis_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_COVERAGE_REFRESH_PLAN_2026-06-15.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after floor user-material visible floating load-basis";

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

const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", ...FIELD_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT = {
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
} as const;

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

const CUSTOM_MISSING_FLOATING_STACK = CUSTOM_LOW_DENSITY_STACK.filter(
  (layer) => layer.floorRole !== "floating_screed"
) as readonly LayerInput[];

function customMaterial(input: {
  category: MaterialDefinition["category"];
  densityKgM3: number;
  id: string;
  impactDynamicStiffnessMNm3?: number;
  name: string;
  tags: readonly string[];
}): MaterialDefinition {
  const material: MaterialDefinition = {
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

  if (typeof input.impactDynamicStiffnessMNm3 === "number") {
    return { ...material, impact: { dynamicStiffnessMNm3: input.impactDynamicStiffnessMNm3 } };
  }

  return material;
}

function buildCustomFloorCatalog(input?: {
  screedDensityKgM3?: number;
  underlayDynamicStiffnessMNm3?: number | null;
}): readonly MaterialDefinition[] {
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
      impactDynamicStiffnessMNm3:
        input?.underlayDynamicStiffnessMNm3 === null
          ? undefined
          : input?.underlayDynamicStiffnessMNm3 ?? 30,
      name: "Custom Floor Resilient Underlay",
      tags: ["custom", "resilient", "impact"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: input?.screedDensityKgM3 ?? 2000,
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
  catalog?: readonly MaterialDefinition[];
  floorImpactContext?: { loadBasisKgM2?: number; resilientLayerDynamicStiffnessMNm3?: number } | null;
  layers?: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_LOW_DENSITY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: input.catalog ?? buildCustomFloorCatalog(),
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: input.targetOutputs ?? IMPACT_OUTPUTS
  });
}

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: OWNER_ACTION,
    previousOwnerStatus: OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor user-material visible floating load-basis coverage refresh", () => {
  it("lands the no-runtime refresh and selects a runtime-focused numeric-gap rerank", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      PREVIOUS_SELECTED_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes custom low-density floating-floor impact without manual loadBasisKgM2", () => {
    const result = calculateCustomFloor({});

    expect(result.supportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      floatingLoadSurfaceMassKgM2: 77.6,
      metricBasis: {
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
  });

  it("re-probes custom heavy floating-floor impact without manual loadBasisKgM2", () => {
    const result = calculateCustomFloor({ layers: CUSTOM_HEAVY_STACK });

    expect(result.supportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LPrimeNT50: 52.7,
      LPrimeNTw: 49.7,
      LPrimeNW: 52.1,
      LnW: 50.1,
      floatingLoadSurfaceMassKgM2: 77.6,
      metricBasis: {
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });
  });

  it("keeps explicit loadBasisKgM2 override stable", () => {
    const result = calculateCustomFloor({
      floorImpactContext: {
        loadBasisKgM2: 76,
        resilientLayerDynamicStiffnessMNm3: 30
      },
      layers: CUSTOM_HEAVY_STACK
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LPrimeNT50: 52.9,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3,
      floatingLoadSurfaceMassKgM2: 76
    });
  });

  it("keeps missing dynamic stiffness and non-derivable load basis at needs_input", () => {
    const missingDynamic = calculateCustomFloor({
      catalog: buildCustomFloorCatalog({ underlayDynamicStiffnessMNm3: null }),
      targetOutputs: ["Ln,w", "DeltaLw"]
    });
    const missingLoad = calculateCustomFloor({
      layers: CUSTOM_MISSING_FLOATING_STACK,
      targetOutputs: ["Ln,w", "DeltaLw"]
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
      missingPhysicalInputs: ["toppingOrFloatingLayer", "loadBasisKgM2"],
      origin: "needs_input",
      route: "floor"
    });
  });

  it("keeps generic ASTM IIC and AIIC unsupported for ISO-derived stacks", () => {
    const astm = calculateCustomFloor({ targetOutputs: ASTM_OUTPUTS });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(astm.impact).toBeNull();
    expect(astm.acousticAnswerBoundary).toMatchObject({
      origin: "unsupported",
      route: "floor",
      unsupportedOutputs: [...ASTM_OUTPUTS]
    });
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    const requiredDocs = [
      "AGENTS.md",
      "README.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/DOCUMENTATION_MAP.md",
      "docs/calculator/NEXT_AGENT_BRIEF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/README.md",
      "docs/calculator/SYSTEM_MAP.md",
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ] as const;

    for (const path of requiredDocs) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SELECTED_ACTION);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
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
    expect(currentGateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
