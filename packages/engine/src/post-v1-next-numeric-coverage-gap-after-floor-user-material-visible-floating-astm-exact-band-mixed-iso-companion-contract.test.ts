import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ExactImpactSource,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ASTM_E989_IMPACT_RATING_BASIS } from "./impact-astm-e989";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating ASTM exact-band field impact companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 10,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 6,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract closed visible floating load-basis, mixed lab-companion, heavy airborne companion, exact ASTM mixed ISO companion owner, and its coverage refresh.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe exact ASTM mixed requests with complete field context. Current runtime has the owned inputs and formulas, but lab IIC crashes when field context changes the top-level impact basis and field AIIC suppresses the owned field companions.",
    iteration: 2
  },
  {
    conclusion:
      "Reject generic ASTM aliasing, non-ASTM exact-method promotion, low-frequency defaults without CI50, broad source crawling, UI work, and formula coefficient retunes.",
    iteration: 3
  },
  {
    conclusion:
      "Select the field impact companion owner because it can close a real request crash and move six already-owned field companion values for exact ASTM lab/field requests without weakening ASTM/ISO metric-basis integrity.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "blocked_non_goal"
  | "boundary_owner"
  | "closed_lane"
  | "input_surface_owner"
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly closesRuntimeException: boolean;
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextCalculableRequestShapes: number;
  readonly expectedNextRuntimeBasisPromotions: number;
  readonly expectedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly sliceKind: CandidateKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
};

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const CLOSED_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const;
const IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 3,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

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
  exactImpactSource?: ExactImpactSource;
  impactFieldContext?: ImpactFieldContext;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomHeavyFloorCatalog(),
    exactImpactSource: input.exactImpactSource,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      closesRuntimeException: true,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 6,
      id: SELECTED_CANDIDATE_ID,
      reason:
      "The same stack already owns exact ASTM IIC/AIIC, ISO Ln,w/DeltaLw, heavy airborne companions, and field impact adapters. Complete field context currently either triggers an impact schema failure or leaves the three field companions unsupported next to the ASTM rating.",
      score: 97,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner",
      reason:
        "Closed by the previous runtime owner and protected by the selected coverage refresh.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw", "IIC", "AIIC"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.generic_iic_aiic_aliasing",
      reason:
        "Rejected because generic ASTM outputs without exact E492/E1007 bands would alias ISO and ASTM metrics.",
      score: -100,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_broad_source_crawl",
      reason:
        "Rejected because source crawling without a selected formula/anchor route would not directly improve the current calculator slice.",
      score: -50,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_missing_ci50_default",
      reason:
        "Rejected because CI50/L'nT,50 defaults without explicit field or source input would weaken low-frequency metric ownership.",
      score: -80,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'nT,50"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_heavy_airborne_companion_owner",
      reason:
        "Closed by the heavy airborne companion owner and its coverage refresh; it should not be selected again.",
      score: 15,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_mixed_lab_companion_owner",
      reason:
        "Closed by the mixed lab-companion owner and coverage refresh; CI and Ln,w+CI should not displace the selected field-context crash.",
      score: 14,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_load_basis_owner",
      reason:
        "Closed by the visible load-basis owner and coverage refresh; load derivation is not the next open gap.",
      score: 13,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_formula_retune_without_holdout",
      reason:
        "Rejected because changing formula coefficients without measured holdout evidence would reduce calculator defensibility.",
      score: -90,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"]
    },
    {
      closesRuntimeException: false,
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_ui_only_surface_copy",
      reason:
        "Rejected because UI copy or route-card polish would not increase calculator scope or accuracy in this slice.",
      score: -40,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: []
    }
  ];
}

function summarizeGapRerank() {
  const candidates = rankNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);

  return {
    candidates,
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    previousCoverageRefreshAction: PREVIOUS_COVERAGE_REFRESH_ACTION,
    previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
    previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    roiAnalysisIterations: ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected?.id,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: GAP_STATUS
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band mixed ISO companion", () => {
  it("selects the exact ASTM field impact companion owner after four ROI iterations", () => {
    const summary = summarizeGapRerank();

    expect(summary).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: GAP_STATUS
    });
    expect(summary.roiAnalysisIterations).toHaveLength(4);
    expect(summary.candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(summary.candidates.filter((candidate) => candidate.selected)).toHaveLength(1);

    const selected = summary.candidates.find((candidate) => candidate.selected);
    expect(selected).toMatchObject({
      closesRuntimeException: true,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeValuesMoved: 6,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false
    });
  });

  it("proves the previously selected mixed ASTM/ISO lane is closed without field context", () => {
    const result = calculateCustomHeavyFloor({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: CLOSED_MIXED_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([...CLOSED_MIXED_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      IIC: 50,
      LnW: 50.1,
      basis: ASTM_E989_IMPACT_RATING_BASIS
    });
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 58,
      estimatedStc: 57
    });
  });

  it("ties the selected field-context gap to runtime values instead of docs-only work", () => {
    const selected = summarizeGapRerank().candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      closesRuntimeException: true,
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 6,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selected?.targetMetrics).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]);
    expect(selected?.reason).toContain("field companions");
  });

  it("keeps the same-stack field impact adapter live when ASTM exact ratings are not present", () => {
    const result = calculateCustomHeavyFloor({
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw", ...FIELD_IMPACT_OUTPUTS]
    });

    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", ...FIELD_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LPrimeNT50: 52.7,
      LPrimeNTw: 49.7,
      LPrimeNW: 52.1,
      LnW: 50.1
    });
    expect(result.impact?.basis).not.toBe(ASTM_E989_IMPACT_RATING_BASIS);
    expect(result.impact?.metricBasis?.LnW).toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
  });

  it("rejects non-calculator and unsafe follow-ups from the selected next slot", () => {
    const candidates = rankNumericCoverageCandidates();
    const rejected = new Map(candidates.filter((candidate) => !candidate.selected).map((candidate) => [candidate.id, candidate]));

    expect(rejected.get("floor.generic_iic_aiic_aliasing")).toMatchObject({
      expectedNextRuntimeValuesMoved: 0,
      score: -100,
      sliceKind: "boundary_owner"
    });
    expect(rejected.get("floor.visible_floating_broad_source_crawl")).toMatchObject({
      score: -50,
      sourceRowsRequiredForRuntimeSelection: true,
      sliceKind: "source_research"
    });
    expect(rejected.get("floor.visible_floating_missing_ci50_default")).toMatchObject({
      score: -80,
      sliceKind: "input_surface_owner"
    });
  });

  it("keeps docs and current-gate runner aligned with the rerank", () => {
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
      GAP_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ] as const;

    for (const path of requiredDocs) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("candidateCount: 10");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 6");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(GAP_FILE.replace("packages/engine/", ""));
  });
});
