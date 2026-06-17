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

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 12,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract closed wall user-material, floor impact-context, low-density, visible load-basis, mixed lab-companion, and heavy airborne companion lanes.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe remaining floor ASTM/IIC surfaces. Exact ASTM band sources already publish IIC/AIIC correctly, but when combined with a custom visible heavy floating-floor stack they currently suppress owned ISO Ln,w/DeltaLw and fall back to screening airborne companions.",
    iteration: 2
  },
  {
    conclusion:
      "Reject generic ISO-to-ASTM aliasing, broad ASTM source crawling, missing-method defaults, low-frequency defaults, UI cleanup, and formula retunes without validation evidence.",
    iteration: 3
  },
  {
    conclusion:
      "Select the ASTM exact-band mixed ISO companion owner because it can preserve exact ASTM IIC/AIIC while restoring already-owned layer-derived ISO impact and heavy airborne companion outputs in the same user-entered construction.",
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
  readonly currentFormulaInputsAvailable: boolean;
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

const MIXED_LAB_ASTM_AND_ISO_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const CUSTOM_HEAVY_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const;

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

function calculateCustomHeavyFloorWithAstmSource(input: {
  exactImpactSource: ExactImpactSource;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomHeavyFloorCatalog(),
    exactImpactSource: input.exactImpactSource,
    targetOutputs: input.targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "Exact ASTM lab/field band sources already own IIC/AIIC, and the same custom heavy floating-floor stack already owns ISO Ln,w, DeltaLw, and heavy airborne companions. The gap is mixed-basis composition: ASTM exact source precedence currently withholds the owned ISO values and downgrades airborne companions to screening.",
      score: 98,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_heavy_airborne_companion_closed_lane",
      reason:
        "The previous owner and refresh already promote custom heavy floating-floor airborne companions when no ASTM exact source overrides impact selection.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_e989_exact_band_standalone_closed_lane",
      reason:
        "Standalone exact ASTM E492/E1007 band requests already calculate IIC or AIIC through the ASTM E989 contour bridge.",
      score: 19,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_iic_aiic_generic_alias_boundary",
      reason:
        "Generic IIC/AIIC without exact ASTM bands must stay unsupported; ISO Ln,w and DeltaLw cannot be relabelled as ASTM ratings.",
      score: 67,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_exact_band_missing_or_ambiguous_method_input_surface",
      reason:
        "Missing or ambiguous ASTM method evidence needs a precise input prompt, not a default to ASTM E492 or E1007.",
      score: 63,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_field_context_closed_lane",
      reason:
        "Complete field context already publishes L'n,w, L'nT,w, and L'nT,50 for the custom heavy floating-floor stack.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_low_frequency_default",
      reason:
        "Defaulting CI or CI,50-2500 would fabricate low-frequency impact behavior instead of asking for the route-required input.",
      score: 58,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_astm_or_floor_source_crawl",
      reason:
        "Narrow source-backed exact rows are useful later, but broad crawling is lower ROI than composing already-owned ASTM and ISO formula routes.",
      score: 10,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["IIC", "AIIC", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_or_ui_cleanup",
      reason:
        "Material editor and UI cleanup do not directly move this mixed-basis calculator route.",
      score: 0,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: []
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error("Numeric gap after heavy airborne companion must select the ASTM exact-band mixed ISO owner.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      refreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    previousOwner: {
      landedGate: PREVIOUS_OWNER_ACTION,
      ownerFile: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    roiAnalysisIterations: ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
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

describe("post-V1 next numeric coverage gap after floor user-material visible floating heavy airborne companion", () => {
  it("lands the no-runtime rerank and selects the ASTM exact-band mixed ISO runtime owner next", () => {
    expect(summarizeNumericGap()).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: GAP_STATUS
    });
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(4);

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_COVERAGE_REFRESH_FILE,
      GAP_FILE,
      GAP_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("proves the selected gap is now closed without aliasing ASTM from ISO impact values", () => {
    const lab = calculateCustomHeavyFloorWithAstmSource({
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: MIXED_LAB_ASTM_AND_ISO_OUTPUTS
    });
    const field = calculateCustomHeavyFloorWithAstmSource({
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: ["AIIC", "Ln,w", "DeltaLw"]
    });

    expect(lab.impact).toMatchObject({
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
    expect(lab.floorSystemRatings).toMatchObject({
      Rw: 58,
      RwCtr: -7.3,
      RwCtrSemantic: "ctr_term",
      basis: "predictor_heavy_concrete_floor_airborne_companion_estimate"
    });
    expect(lab.supportedTargetOutputs).toEqual([...MIXED_LAB_ASTM_AND_ISO_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);

    expect(field.impact).toMatchObject({
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
    expect(field.supportedTargetOutputs).toEqual(["AIIC", "Ln,w", "DeltaLw"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps the selected candidate ahead of unsafe or lower-ROI alternatives", () => {
    const candidates = rankNumericCoverageCandidates();
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const selected = byId.get(SELECTED_CANDIDATE_ID);

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 12,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw", "IIC", "AIIC"]
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_generic_alias_boundary")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_exact_band_missing_or_ambiguous_method_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("broad_astm_or_floor_source_crawl")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("material_editor_or_ui_cleanup")?.score ?? 0);
  });

  it("documents the selected owner, counters, and anti-drift rules", () => {
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
      expect(content, path).toContain("candidateCount 9");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 12");
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
