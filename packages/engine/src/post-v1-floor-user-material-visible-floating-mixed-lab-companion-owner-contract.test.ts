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
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan";
const PREVIOUS_SELECTED_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts";
const PREVIOUS_SELECTED_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md";
const PREVIOUS_SELECTED_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_landed_no_runtime_selected_floor_user_material_visible_floating_mixed_lab_companion_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_OWNER_PLAN_2026-06-16.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_mixed_lab_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating mixed lab-companion coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 3,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 3,
  sourceRowsImported: 0
} as const;

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const PARTIAL_MIXED_OUTPUTS = [
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const COMPLETE_MIXED_OUTPUTS = [
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

function buildCustomHeavyFloorCatalog(): readonly MaterialDefinition[] {
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
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      impactDynamicStiffnessMNm3: 30,
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

function calculateCustomHeavyFloor(input: {
  impactFieldContext?: ImpactFieldContext;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomHeavyFloorCatalog(),
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs ?? PARTIAL_MIXED_OUTPUTS
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

describe("post-V1 floor user-material visible floating mixed lab-companion owner", () => {
  it("lands a runtime owner selected by the post-load-basis numeric rerank", () => {
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

  it("preserves explicit lab companions when a mixed field output is still missing context", () => {
    const result = calculateCustomHeavyFloor({
      impactFieldContext: {
        ciDb: -1,
        ci50_2500Db: 3
      }
    });

    expect(result.supportedTargetOutputs).toEqual(["CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.impact).toMatchObject({
      CI: -1,
      CI50_2500: 3,
      DeltaLw: 24.4,
      LnW: 50.1,
      LnWPlusCI: 49.1,
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
      metricBasis: {
        CI: "explicit_user_impact_ci_input",
        CI50_2500: "explicit_user_impact_ci50_2500_input",
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
      }
    });
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.warnings).toContain(
      "Some requested impact sound outputs are still unavailable for the current input/path: L'nT,50. DynEcho kept those outputs explicit instead of fabricating unsupported ratings."
    );
  });

  it("keeps complete field context fully supported in the same mixed request shape", () => {
    const result = calculateCustomHeavyFloor({
      impactFieldContext: {
        ciDb: -1,
        ci50_2500Db: 3,
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      targetOutputs: COMPLETE_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...COMPLETE_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      CI: -1,
      CI50_2500: 3,
      LPrimeNT50: 52.7,
      LPrimeNTw: 49.7,
      LPrimeNW: 52.1,
      LnW: 50.1,
      LnWPlusCI: 49.1,
      metricBasis: {
        CI: "explicit_user_impact_ci_input",
        CI50_2500: "explicit_user_impact_ci50_2500_input",
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnWPlusCI: "estimated_local_guide_lnwci_from_lnw_plus_ci"
      }
    });
  });

  it("does not invent lab companions when explicit CI inputs are absent", () => {
    const result = calculateCustomHeavyFloor({
      impactFieldContext: {}
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...PARTIAL_MIXED_OUTPUTS]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LnW: 50.1,
      availableOutputs: ["Ln,w", "DeltaLw"],
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(result.impact?.CI).toBeUndefined();
    expect(result.impact?.CI50_2500).toBeUndefined();
    expect(result.impact?.LnWPlusCI).toBeUndefined();
  });

  it("keeps ASTM IIC and AIIC unsupported instead of aliasing ISO impact companions", () => {
    const result = calculateCustomHeavyFloor({
      impactFieldContext: {
        ciDb: -1,
        ci50_2500Db: 3
      },
      targetOutputs: [...PARTIAL_MIXED_OUTPUTS, ...ASTM_OUTPUTS]
    });

    expect(result.supportedTargetOutputs).toEqual(["CI", "CI,50-2500", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50", "IIC", "AIIC"]);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps the docs aligned to the selected coverage refresh", () => {
    const ownerPlan = readRepoFile(OWNER_PLAN_DOC);
    const nextPlan = readRepoFile(SELECTED_NEXT_PLAN_DOC);
    const currentPlan = readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md");

    expect(ownerPlan).toContain(OWNER_STATUS);
    expect(ownerPlan).toContain("unsupported field outputs explicit");
    expect(nextPlan).toContain(SELECTED_NEXT_ACTION);
    expect(currentPlan).toContain(SELECTED_NEXT_ACTION);
    expect(currentPlan).toContain(SELECTED_NEXT_FILE);
  });
});
