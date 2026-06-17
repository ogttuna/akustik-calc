import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AirborneContext,
  ExactImpactSource,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import { LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS } from "./lightweight-concrete-delta-lw-runtime-corridor";
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM companion coverage refresh";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 10,
  runtimeBasisPromotions: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0
} as const;

const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const LAB_EXACT_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  ...FIELD_IMPACT_OUTPUTS,
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FIELD_EXACT_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  ...FIELD_IMPACT_OUTPUTS,
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const FULL_ASTM_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  ...FIELD_IMPACT_OUTPUTS,
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;
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
} as const satisfies AirborneContext;

const CUSTOM_LOW_DENSITY_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_LOW_DENSITY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "ASTM E492 lab exact bands for the low-density visible floating floor",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "ASTM E1007 field exact bands for the low-density visible floating floor",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

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

function buildCustomLowDensityFloorCatalog(): readonly MaterialDefinition[] {
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

function calculateLowDensityFloor(input: {
  exactImpactSource?: ExactImpactSource;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_LOW_DENSITY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomLowDensityFloorCatalog(),
    exactImpactSource: input.exactImpactSource,
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function summarizeOwnerCloseout() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
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

describe("post-V1 floor user-material low-density exact ASTM companion owner", () => {
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
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("combines low-density lightweight ISO companions with exact lab ASTM IIC", () => {
    const result = calculateLowDensityFloor({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      floorImpactContext: FLOOR_IMPACT_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: LAB_EXACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_EXACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      RwCtr: 47.5,
      RwCtrSemantic: "rw_plus_c",
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      IIC: 50,
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: {
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        IIC: ASTM_E989_IIC_METRIC_BASIS,
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("combines low-density lightweight ISO companions with exact field ASTM AIIC", () => {
    const result = calculateLowDensityFloor({
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      floorImpactContext: FLOOR_IMPACT_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_EXACT_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...FIELD_EXACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      AIIC: 50,
      DeltaLw: 24.3,
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: {
        AIIC: ASTM_E989_AIIC_METRIC_BASIS,
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(result.impact?.IIC).toBeUndefined();
  });

  it("keeps opposite ASTM metric aliases and missing physical inputs outside the owner", () => {
    const labWithBothAstm = calculateLowDensityFloor({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      floorImpactContext: FLOOR_IMPACT_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FULL_ASTM_OUTPUTS
    });
    const missingFloorImpactContext = calculateLowDensityFloor({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: LAB_EXACT_OUTPUTS
    });
    const genericAstm = calculateLowDensityFloor({
      floorImpactContext: FLOOR_IMPACT_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FULL_ASTM_OUTPUTS
    });

    expect(labWithBothAstm.supportedTargetOutputs).toEqual([...LAB_EXACT_OUTPUTS]);
    expect(labWithBothAstm.unsupportedTargetOutputs).toEqual(["AIIC"]);
    expect(labWithBothAstm.impact?.AIIC).toBeUndefined();

    expect(missingFloorImpactContext.supportedTargetOutputs).toEqual(["Rw", "IIC"]);
    expect(missingFloorImpactContext.unsupportedTargetOutputs).toEqual([
      "Ln,w",
      "DeltaLw",
      ...FIELD_IMPACT_OUTPUTS
    ]);
    expect(missingFloorImpactContext.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      metricBasis: {
        IIC: ASTM_E989_IIC_METRIC_BASIS
      }
    });
    expect(missingFloorImpactContext.impact?.LnW).toBeUndefined();
    expect(missingFloorImpactContext.impact?.DeltaLw).toBeUndefined();

    expect(genericAstm.supportedTargetOutputs).toEqual([
      "Rw",
      "Ln,w",
      "DeltaLw",
      ...FIELD_IMPACT_OUTPUTS
    ]);
    expect(genericAstm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(genericAstm.impact?.IIC).toBeUndefined();
    expect(genericAstm.impact?.AIIC).toBeUndefined();
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

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 10");
      expect(content, path).toContain("runtimeBasisPromotions: 4");
      expect(content, path).toContain("runtimeValuesMoved 12");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
