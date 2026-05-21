import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS,
  buildLayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract
} from "./layer-combination-resolver-single-leaf-mass-law-banded-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LAMINATED_GYPSUM_BOARD = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CONCRETE_WALL = [
  { materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const CONCRETE_FLOOR_DIRECT_AIRBORNE = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const DOUBLE_LEAF_CAVITY = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts",
  "apps/web/features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts",
  "apps/web/features/workbench/layer-combination-resolver-candidate-surface.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
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
  expect(result.airborneBasis?.method).toBe(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS);
  expect(result.airborneBasis?.errorBudgetDb).toBe(6);
  expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("scenario-specific");
}

describe("layer combination resolver single-leaf mass-law banded surface parity contract", () => {
  it("lands single-leaf surface parity and selects the post-single-leaf matrix refresh", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      errorBudgetDb: 6,
      landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousRuntimeCorridor: {
        landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.surfaceTargets).toEqual([
      "candidate_trace",
      "output_cards",
      "route_posture",
      "confidence_provenance",
      "metric_basis_rows",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]);
    expect(contract.representativeScenarios).toEqual([
      expect.objectContaining({ id: "wall_gypsum_board_12_5mm_single_leaf", route: "wall" }),
      expect.objectContaining({ id: "wall_laminated_gypsum_board_25mm_single_leaf", route: "wall" }),
      expect.objectContaining({ id: "wall_concrete_150mm_single_leaf", route: "wall" }),
      expect.objectContaining({ id: "floor_concrete_150mm_direct_airborne_single_leaf", route: "floor" })
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("exposes wall single-leaf runtime values on the resolver candidate surface", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, { calculator: "dynamic", targetOutputs: AIRBORNE_OUTPUTS });
    const laminated = calculateAssembly(LAMINATED_GYPSUM_BOARD, { calculator: "dynamic", targetOutputs: AIRBORNE_OUTPUTS });
    const concrete = calculateAssembly(CONCRETE_WALL, { calculator: "dynamic", targetOutputs: AIRBORNE_OUTPUTS });

    expectSingleLeafTrace(gypsum, { route: "wall", rw: 31, stc: 31 });
    expectSingleLeafTrace(laminated, { route: "wall", rw: 34, stc: 34 });
    expectSingleLeafTrace(concrete, { route: "wall", rw: 55, stc: 55 });
    expect(gypsum.airborneCandidateResolution?.selectedCandidateId).toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(gypsum.airborneCandidateResolution?.rejectedCandidateIds).toEqual(
      expect.arrayContaining(["candidate_blocked_rockwool_exact_source"])
    );
  });

  it("exposes floor direct-airborne single-leaf trace without borrowing impact or field aliases", () => {
    const floorAirborne = calculateAssembly(CONCRETE_FLOOR_DIRECT_AIRBORNE, {
      calculator: "dynamic",
      targetOutputs: AIRBORNE_OUTPUTS
    });
    const floorImpact = calculateAssembly(CONCRETE_FLOOR_DIRECT_AIRBORNE, {
      calculator: "dynamic",
      targetOutputs: IMPACT_OUTPUTS
    });

    expectSingleLeafTrace(floorAirborne, { route: "floor", rw: 55, stc: 55 });
    expect(floorAirborne.impact?.LnW).toBe(74.5);
    expect(floorAirborne.layerCombinationResolverTrace?.valuePins).toEqual(
      expect.arrayContaining([{ metric: "Ctr", value: -5.6 }])
    );

    expect(floorImpact.impact?.LnW).toBe(74.5);
    expect(floorImpact.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps non-single-leaf topology outside the mass-law banded surface", () => {
    const cavity = calculateAssembly(DOUBLE_LEAF_CAVITY, { calculator: "dynamic", targetOutputs: AIRBORNE_OUTPUTS });

    expect(cavity.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    );
    expect(cavity.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs, exports, and current-gate runner aligned with single-leaf surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("candidate trace");
      expect(normalized, path).toContain("scenario-specific");
      expect(normalized, path).toContain("floor direct-airborne");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const index = readRepoFile("packages/engine/src/index.ts");

    expect(runner).toContain("layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts");
    expect(index).toContain('export * from "./layer-combination-resolver-single-leaf-mass-law-banded-surface-parity";');
  });
});
