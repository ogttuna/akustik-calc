import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS,
  buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract
} from "./layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const GYPSUM_SINGLE_LEAF = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const GYPSUM_LAMINATED_SINGLE_LEAF = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CONCRETE_WALL_SINGLE_LEAF = [
  { materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const CONCRETE_FLOOR_DIRECT_AIRBORNE = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const DOUBLE_LEAF_FRAMED_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh.ts",
  "packages/engine/src/layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
  "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectSingleLeafTrace(result: ReturnType<typeof calculateAssembly>, input: { route: "floor" | "wall"; rw: number; stc: number }) {
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["Rw", "STC"],
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: input.route,
    runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: input.rw },
      { metric: "STC", value: input.stc }
    ])
  });
}

describe("layer combination resolver post single-leaf mass-law banded matrix refresh contract", () => {
  it("lands the no-runtime matrix refresh and selects double-leaf/framed wall owner next", () => {
    const contract = buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSingleLeafSurfaceParity: {
        landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS,
      sourceRowsAreEvidenceNotProduct: true
    });
    expect(contract.summary).toEqual({
      activeRuntimeCandidateCount: 22,
      allowedExactRowCount: 3,
      allowedWithBudgetRowCount: 19,
      blockedActionCount: 4,
      blockedRowCount: 2,
      coverageMatrixRowCount: 25,
      needsUserInputRowCount: 1,
      readinessBucketCount: {
        needs_input: 1,
        ready: 3,
        ready_with_budget: 19,
        research_only: 0,
        unsupported: 2
      },
      researchOnlyGapCount: 5,
      selectedGapId: "double_leaf_framed_wall_banded_solver_owner",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      singleLeafClosedAsAllowedWithBudget: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("moves single-leaf out of the research gap list and keeps it budgeted in V0", () => {
    const contract = buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract();

    expect(contract.closedSingleLeafGap).toEqual({
      candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      closedGapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
      currentCompanyInternalUse: "allowed_with_budget",
      currentReadinessBucket: "ready_with_budget",
      errorBudgetDb: 6,
      noRuntimeValueMovement: true,
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      valuePins: [
        { metric: "Rw", value: 31 },
        { metric: "STC", value: 31 }
      ],
      visibleOnCandidateTrace: true
    });
    expect(contract.rankedResearchOnlyGaps.map((gap) => gap.id)).toEqual([
      "double_leaf_framed_wall_banded_solver_owner",
      "floor_cover_delta_lw_dynamic_stiffness_owner",
      "field_building_prediction_flanking_owner",
      "astm_iic_aiic_rating_owner",
      "broad_source_crawl"
    ]);
    expect(contract.rankedResearchOnlyGaps.find((gap) => gap.selected)).toMatchObject({
      id: "double_leaf_framed_wall_banded_solver_owner",
      rank: 1,
      route: "wall",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE
    });
    expect(contract.rankedResearchOnlyGaps[0]?.requiredOwnerFields).toEqual([
      "side leaf grouping and surface mass per side",
      "cavity depth and absorber flow-resistivity state",
      "frame, stud, rail, or resilient support topology",
      "mechanical bridge and coupling class",
      "one-third-octave airborne transmission-loss curve",
      "ISO 717-1 Rw/C/Ctr adapter and residual budget",
      "hostile topology rules for duplicates, splits, and unsafe reorders"
    ]);
  });

  it("keeps single-leaf runtime values frozen while refusing impact transfer", () => {
    const gypsum = calculateAssembly(GYPSUM_SINGLE_LEAF, { calculator: "dynamic", targetOutputs: AIRBORNE_OUTPUTS });
    const laminated = calculateAssembly(GYPSUM_LAMINATED_SINGLE_LEAF, {
      calculator: "dynamic",
      targetOutputs: AIRBORNE_OUTPUTS
    });
    const concreteWall = calculateAssembly(CONCRETE_WALL_SINGLE_LEAF, {
      calculator: "dynamic",
      targetOutputs: AIRBORNE_OUTPUTS
    });
    const concreteFloorAirborne = calculateAssembly(CONCRETE_FLOOR_DIRECT_AIRBORNE, {
      calculator: "dynamic",
      targetOutputs: AIRBORNE_OUTPUTS
    });
    const concreteFloorImpact = calculateAssembly(CONCRETE_FLOOR_DIRECT_AIRBORNE, {
      calculator: "dynamic",
      targetOutputs: IMPACT_OUTPUTS
    });

    expectSingleLeafTrace(gypsum, { route: "wall", rw: 31, stc: 31 });
    expectSingleLeafTrace(laminated, { route: "wall", rw: 34, stc: 34 });
    expectSingleLeafTrace(concreteWall, { route: "wall", rw: 55, stc: 55 });
    expectSingleLeafTrace(concreteFloorAirborne, { route: "floor", rw: 55, stc: 55 });
    expect(concreteFloorImpact.impact?.LnW).toBe(74.5);
    expect(concreteFloorImpact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps double-leaf topology as the next owner gap without runtime promotion", () => {
    const result = calculateAssembly(DOUBLE_LEAF_FRAMED_WALL, {
      calculator: "dynamic",
      targetOutputs: AIRBORNE_OUTPUTS
    });

    expect(result.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    );
    expect(result.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract().blockedNextActions).toEqual([
      expect.objectContaining({ id: "broad_source_crawl", selectedNow: false }),
      expect.objectContaining({ id: "field_building_runtime_promotion", selectedNow: false }),
      expect.objectContaining({ id: "astm_iic_aiic_alias_runtime", selectedNow: false }),
      expect.objectContaining({ id: "tolerance_retune_without_holdouts", selectedNow: false })
    ]);
  });

  it("keeps docs, exports, and current gate runner aligned with the post-single-leaf matrix refresh", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("double-leaf");
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh";');
  });
});
