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
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SELECTED_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan";
const PREVIOUS_SELECTED_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts";
const PREVIOUS_SELECTED_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md";
const PREVIOUS_SELECTED_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_OWNER_PLAN_2026-06-16.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_heavy_airborne_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating heavy airborne companion coverage refresh";

const HEAVY_AIRBORNE_COMPANION_BASIS =
  "predictor_heavy_concrete_floor_airborne_companion_estimate";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 1,
  accuracyPromotedTargetOutputs: 4,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 2,
  sourceRowsImported: 0
} as const;

const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const LAB_AND_IMPACT_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
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

const CUSTOM_HEAVY_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];
const CUSTOM_LOW_DENSITY_STACK = CUSTOM_HEAVY_STACK.map((layer) =>
  layer.materialId === CUSTOM_HEAVY_CONCRETE_ID
    ? { ...layer, materialId: CUSTOM_LOW_DENSITY_CONCRETE_ID }
    : layer
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
  underlayDynamicStiffnessMNm3?: number | null;
}): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    customMaterial({
      category: "mass",
      densityKgM3: 1200,
      id: CUSTOM_LOW_DENSITY_CONCRETE_ID,
      name: "Custom Floor Low Density Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "lightweight-base"]
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
  catalog?: readonly MaterialDefinition[];
  impactFieldContext?: ImpactFieldContext;
  layers?: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: input.catalog ?? buildCustomFloorCatalog(),
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs ?? LAB_AND_IMPACT_OUTPUTS
  });
}

function summarizeOwnerCloseout() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousSelectedAction: PREVIOUS_SELECTED_ACTION,
    previousSelectedFile: PREVIOUS_SELECTED_FILE,
    previousSelectedPlanDoc: PREVIOUS_SELECTED_PLAN_DOC,
    previousSelectionStatus: PREVIOUS_SELECTED_STATUS,
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

describe("post-V1 floor user-material visible floating heavy airborne companion owner", () => {
  it("lands the selected runtime owner and selects a bounded coverage refresh", () => {
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

    for (const path of [
      PREVIOUS_SELECTED_FILE,
      PREVIOUS_SELECTED_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes the custom heavy floating-floor lab airborne companion off the screening basis", () => {
    const result = calculateCustomFloor({});

    expect(result.supportedTargetOutputs).toEqual([...LAB_AND_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 58,
      RwCtr: -7.3,
      RwCtrSemantic: "ctr_term",
      basis: HEAVY_AIRBORNE_COMPANION_BASIS
    });
    expect(result.metrics.estimatedRwDb).toBe(58);
    expect(result.metrics.estimatedCtrDb).toBe(-7.3);
    expect(typeof result.metrics.estimatedCDb).toBe("number");
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LnW: 50.1,
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      metricBasis: {
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });
  });

  it("preserves complete field impact companions while promoting only the lab airborne basis", () => {
    const result = calculateCustomFloor({
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: [...LAB_AND_IMPACT_OUTPUTS, ...FIELD_OUTPUTS]
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_AND_IMPACT_OUTPUTS, ...FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings?.basis).toBe(HEAVY_AIRBORNE_COMPANION_BASIS);
    expect(result.impact).toMatchObject({
      LPrimeNT50: 52.7,
      LPrimeNTw: 49.7,
      LPrimeNW: 52.1,
      LnW: 50.1
    });
  });

  it("does not promote low-density or missing-dynamic-stiffness stacks into the heavy companion owner", () => {
    const lowDensity = calculateCustomFloor({
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      layers: CUSTOM_LOW_DENSITY_STACK,
      targetOutputs: [...LAB_AND_IMPACT_OUTPUTS, ...FIELD_OUTPUTS]
    });
    const missingDynamicStiffness = calculateCustomFloor({
      catalog: buildCustomFloorCatalog({ underlayDynamicStiffnessMNm3: null })
    });

    expect(lowDensity.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(lowDensity.floorSystemRatings?.basis).not.toBe(HEAVY_AIRBORNE_COMPANION_BASIS);
    expect(lowDensity.supportedTargetOutputs).toEqual([...LAB_AND_IMPACT_OUTPUTS, ...FIELD_OUTPUTS]);

    expect(missingDynamicStiffness.floorSystemRatings).toMatchObject({
      basis: "screening_mass_law_curve_seed_v3"
    });
    expect(missingDynamicStiffness.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(missingDynamicStiffness.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps generic ASTM impact ratings outside the owner", () => {
    const result = calculateCustomFloor({
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: [...LAB_AND_IMPACT_OUTPUTS, ...ASTM_OUTPUTS]
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_AND_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(result.floorSystemRatings?.basis).toBe(HEAVY_AIRBORNE_COMPANION_BASIS);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with the owner closeout", () => {
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
      SELECTED_NEXT_PLAN_DOC
    ] as const;

    for (const path of requiredDocs) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SELECTED_ACTION);
      expect(content, path).toContain(PREVIOUS_SELECTED_FILE);
      expect(content, path).toContain(PREVIOUS_SELECTED_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("accuracyPromotedRequestShapes: 1");
      expect(content, path).toContain("accuracyPromotedTargetOutputs: 4");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 2");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
