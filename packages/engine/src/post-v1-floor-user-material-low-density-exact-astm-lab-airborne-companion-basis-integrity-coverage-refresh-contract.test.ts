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
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
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
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner";

const OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-16.md";
const OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-16.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after floor user-material low-density exact ASTM lab-airborne companion basis-integrity";

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
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_EXPECTED_SUPPORTED_OUTPUTS = [
  "Rw",
  "C",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const DIRECT_FLANKING_IMPACT_CONTEXT = {
  ci50_2500Db: 3,
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      id: "low_density_field_aiic_direct_flanking_edge_path",
      label: "Characterized low-density floating-floor edge path",
      levelOffsetDb: -6,
      pathCount: 1
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const AIRBORNE_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 55
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

const ASTM_FIELD_AIIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "field",
  label: "ASTM E1007 field exact bands for the low-density visible floating floor",
  levelsDb: astmContourLevels(62),
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

  return typeof input.impactDynamicStiffnessMNm3 === "number"
    ? {
        ...material,
        impact: {
          dynamicStiffnessMNm3: input.impactDynamicStiffnessMNm3
        }
      }
    : material;
}

function buildCustomLowDensityFloorCatalog(input?: {
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
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      impactDynamicStiffnessMNm3: input?.underlayDynamicStiffnessMNm3 === null
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

function calculateLowDensityFloor(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_LOW_DENSITY_STACK, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    catalog: input.catalog ?? buildCustomLowDensityFloorCatalog(),
    exactImpactSource: input.exactImpactSource,
    floorImpactContext: input.floorImpactContext === undefined
      ? FLOOR_IMPACT_CONTEXT
      : input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: OWNER_ACTION,
    previousOwnerFile: OWNER_FILE,
    previousOwnerStatus: OWNER_STATUS,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
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

describe("post-V1 floor user-material low-density exact ASTM lab-airborne companion basis-integrity coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next numeric coverage-gap rerank", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes field exact ASTM AIIC with same-stack Rw and C lab-airborne companion promotion", () => {
    const result = calculateLowDensityFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -5.5,
      estimatedCtrDb: -6.7,
      estimatedRwDb: 53,
      estimatedStc: 51
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      RwCtr: 47.5,
      RwCtrSemantic: "rw_plus_c",
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      AIIC: 50,
      DeltaLw: 24.3,
      LPrimeNT50: 66.7,
      LPrimeNTw: 63.7,
      LPrimeNW: 66.1,
      LnW: 64.3,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      fieldEstimateProfile: "direct_flanking_energy_sum",
      labOrField: "field",
      metricBasis: {
        AIIC: ASTM_E989_AIIC_METRIC_BASIS,
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
  });

  it("re-probes complete building context Rw and C while STC and Ctr remain unsupported", () => {
    const result = calculateLowDensityFloor({
      airborneContext: AIRBORNE_BUILDING_CONTEXT,
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...BUILDING_EXPECTED_SUPPORTED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC", "Ctr"]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -5.5,
      estimatedCtrDb: -6.7,
      estimatedDnADb: 50.2,
      estimatedDnTADb: 52.6,
      estimatedDnTwDb: 54,
      estimatedDnWDb: 51,
      estimatedRwDb: 53,
      estimatedRwPrimeDb: 51,
      estimatedStc: 51
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: []
    });
    expect(result.impact).toMatchObject({
      AIIC: 50,
      LPrimeNT50: 66.7,
      LPrimeNTw: 63.7,
      LPrimeNW: 66.1,
      basis: ASTM_E989_IMPACT_RATING_BASIS
    });
  });

  it("keeps material-owned impact input live while missing lightweight companion and generic ASTM aliases stay outside the owner", () => {
    const materialOwnedImpactInput = calculateLowDensityFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      floorImpactContext: null,
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    });
    const missingLightweightCompanion = calculateLowDensityFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      catalog: buildCustomLowDensityFloorCatalog({ underlayDynamicStiffnessMNm3: null }),
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      floorImpactContext: null,
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    });
    const genericAstmAlias = calculateLowDensityFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: DIRECT_FLANKING_IMPACT_CONTEXT,
      targetOutputs: LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    });

    expect(materialOwnedImpactInput.supportedTargetOutputs).toEqual([
      ...LAB_AIRBORNE_AND_FIELD_COMPANION_OUTPUTS
    ]);
    expect(materialOwnedImpactInput.unsupportedTargetOutputs).toEqual([]);
    expect(materialOwnedImpactInput.metrics).toMatchObject({
      estimatedCDb: -5.5,
      estimatedRwDb: 53
    });
    expect(materialOwnedImpactInput.impact).toMatchObject({
      AIIC: 50,
      LnW: 64.3,
      basis: ASTM_E989_IMPACT_RATING_BASIS
    });

    expect(missingLightweightCompanion.supportedTargetOutputs).not.toContain("Ln,w");
    expect(missingLightweightCompanion.supportedTargetOutputs).not.toContain("DeltaLw");
    expect(missingLightweightCompanion.metrics.estimatedRwDb).not.toBe(53);
    expect(missingLightweightCompanion.metrics.estimatedCDb).not.toBe(-5.5);

    expect(genericAstmAlias.unsupportedTargetOutputs).toContain("AIIC");
    expect(genericAstmAlias.impact?.AIIC).toBeUndefined();
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

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
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
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
