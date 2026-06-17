import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ExactImpactSource,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS
} from "./impact-astm-e989";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion coverage refresh";

const HEAVY_AIRBORNE_COMPANION_BASIS =
  "predictor_heavy_concrete_floor_airborne_companion_estimate";

const OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 12,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 12,
  sourceRowsImported: 0
} as const;

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const LAB_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FIELD_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

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

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "ASTM E492 lab exact bands for the visible heavy floating floor",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "ASTM E1007 field exact bands for the visible heavy floating floor",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

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

function buildCustomHeavyFloorCatalog(input?: {
  underlayDynamicStiffnessMNm3?: number | null;
}): readonly MaterialDefinition[] {
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

function calculateCustomHeavyFloorWithAstm(input: {
  catalog?: readonly MaterialDefinition[];
  exactImpactSource: ExactImpactSource;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: input.catalog ?? buildCustomHeavyFloorCatalog(),
    exactImpactSource: input.exactImpactSource,
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

describe("post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion owner", () => {
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

  it("preserves exact lab ASTM IIC while restoring ISO impact and heavy airborne companions", () => {
    const result = calculateCustomHeavyFloorWithAstm({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: LAB_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      IIC: 50,
      LnW: 50.1,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      metricBasis: {
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        IIC: ASTM_E989_IIC_METRIC_BASIS,
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });
    expect(result.impact?.AIIC).toBeUndefined();
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 58,
      RwCtr: -7.3,
      RwCtrSemantic: "ctr_term",
      basis: HEAVY_AIRBORNE_COMPANION_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCtrDb: -7.3,
      estimatedRwDb: 58,
      estimatedStc: 57
    });
    expect(result.metrics.estimatedCDb).toBe(-1.8);
  });

  it("preserves exact field ASTM AIIC while keeping the ISO lab companions separate", () => {
    const result = calculateCustomHeavyFloorWithAstm({
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: FIELD_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...FIELD_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      AIIC: 50,
      DeltaLw: 24.4,
      LnW: 50.1,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      metricBasis: {
        AIIC: ASTM_E989_AIIC_METRIC_BASIS,
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.floorSystemRatings?.basis).toBe(HEAVY_AIRBORNE_COMPANION_BASIS);
    expect(result.metrics).toMatchObject({
      estimatedCtrDb: -7.3,
      estimatedRwDb: 58,
      estimatedStc: 57
    });
  });

  it("keeps generic ASTM ratings and missing ISO physical inputs outside the mixed owner", () => {
    const genericAstm = calculateAssembly(CUSTOM_HEAVY_STACK, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      catalog: buildCustomHeavyFloorCatalog(),
      targetOutputs: [...LAB_MIXED_OUTPUTS, "AIIC"]
    });
    const missingDynamicStiffness = calculateCustomHeavyFloorWithAstm({
      catalog: buildCustomHeavyFloorCatalog({ underlayDynamicStiffnessMNm3: null }),
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: LAB_MIXED_OUTPUTS
    });

    expect(genericAstm.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw"]);
    expect(genericAstm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(genericAstm.impact?.IIC).toBeUndefined();
    expect(genericAstm.impact?.AIIC).toBeUndefined();

    expect(missingDynamicStiffness.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "IIC"]);
    expect(missingDynamicStiffness.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingDynamicStiffness.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      metricBasis: {
        IIC: ASTM_E989_IIC_METRIC_BASIS
      }
    });
    expect(missingDynamicStiffness.impact?.LnW).toBeUndefined();
    expect(missingDynamicStiffness.impact?.DeltaLw).toBeUndefined();
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
      expect(content, path).toContain("newCalculableTargetOutputs: 12");
      expect(content, path).toContain("runtimeBasisPromotions: 2");
      expect(content, path).toContain("runtimeValuesMoved 12");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
  });
});
