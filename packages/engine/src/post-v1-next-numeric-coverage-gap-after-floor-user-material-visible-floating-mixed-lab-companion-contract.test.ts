import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating heavy airborne companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_heavy_airborne_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 2,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract closed wall anchor-delta, direct-fixed, default-catalog, explicit user-material, missing-topology, porous-flow, and current visible floating-floor impact lanes.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe custom visible heavy floating floors: impact values are owned by the heavy floating-floor ISO 12354 Annex C route, but lab airborne companions still publish from the generic screening mass-law basis.",
    iteration: 2
  },
  {
    conclusion:
      "Reject CI/CI50 defaults, generic ASTM IIC/AIIC aliasing, field-context repeats, formula retunes without evidence, and broad source crawling because they do not close the observed ready route gap.",
    iteration: 3
  },
  {
    conclusion:
      "Select the heavy airborne companion owner because the existing heavy concrete airborne companion basis can replace the screening fallback for a physically complete custom heavy floating-floor stack.",
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

const LAB_AND_IMPACT_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "DeltaLw"
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

function calculateCustomHeavyFloor() {
  return calculateAssembly(CUSTOM_HEAVY_STACK, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomHeavyFloorCatalog(),
    targetOutputs: LAB_AND_IMPACT_OUTPUTS
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 1,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "The same custom heavy floating-floor request already calculates Ln,w and DeltaLw through the owned heavy floating-floor route, but Rw/STC/C/Ctr are still supported from the generic screening mass-law basis. The owner should promote the lab airborne companion to the existing heavy concrete companion basis for this physically complete route.",
      score: 96,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_mixed_lab_companion_closed_lane",
      reason:
        "The previous owner and refresh already preserve explicit CI, CI,50-2500, and Ln,w+CI in mixed custom heavy floating-floor requests.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_field_context_closed_lane",
      reason:
        "Complete field K, receiving-room volume, and CI50 context already publish L'n,w, L'nT,w, and L'nT,50 for the custom heavy floating-floor stack.",
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
      id: "floor.user_material_missing_ci_or_ci50_input_surface",
      reason:
        "Missing CI and CI,50-2500 should remain a needs-input surface; defaulting the values would fabricate low-frequency impact performance.",
      score: 64,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_iic_aiic_generic_alias_boundary",
      reason:
        "Generic IIC/AIIC remains lower ROI than the selected owner because ASTM ratings need an owned ASTM band route, not an alias from ISO Ln,w.",
      score: 57,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_same_stack_source_holdout",
      reason:
        "A same-stack measured row would be valuable if found, but broad source acquisition is slower than closing the already observed physics-route basis gap.",
      score: 36,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_airborne_formula_retune",
      reason:
        "Retuning airborne formulas without new validation evidence would be less defensible than selecting the existing heavy companion route boundary.",
      score: 12,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_or_ui_cleanup",
      reason:
        "UI/catalog management work does not itself increase this calculator route's supported layer combinations or metric-basis integrity.",
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
    throw new Error("Numeric gap after visible floating mixed lab-companion must select heavy airborne companion owner.");
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

describe("post-V1 next numeric coverage gap after floor user-material visible floating mixed lab-companion", () => {
  it("lands a no-runtime rerank and selects the heavy airborne companion owner", () => {
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

  it("keeps the selected ready runtime gap closed after the owner lands", () => {
    const result = calculateCustomHeavyFloor();

    expect(result.supportedTargetOutputs).toEqual([...LAB_AND_IMPACT_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      DeltaLw: 24.4,
      LnW: 50.1,
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 58,
      RwCtr: -7.3,
      RwCtrSemantic: "ctr_term",
      basis: "predictor_heavy_concrete_floor_airborne_companion_estimate"
    });
  });

  it("keeps closed, unsafe, and non-goal candidates below the selected owner", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(4);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeBasisPromotions: 1,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      score: 96,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const candidate of candidates.filter((entry) => entry.id !== SELECTED_CANDIDATE_ID)) {
      expect(candidate.score, candidate.id).toBeLessThan(selected?.score ?? 0);
      expect(candidate.selected, candidate.id).toBe(false);
    }

    expect(candidates.find((candidate) => candidate.id === "floor.astm_iic_aiic_generic_alias_boundary")).toMatchObject({
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      sliceKind: "boundary_owner",
      targetMetrics: ["IIC", "AIIC"]
    });
    expect(candidates.find((candidate) => candidate.id === "material_editor_or_ui_cleanup")).toMatchObject({
      score: 0,
      sliceKind: "blocked_non_goal"
    });
  });

  it("keeps docs and current-gate runner aligned with the selected owner", () => {
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
      expect(content, path).toContain("candidateCount 8");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 1");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 2");
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
