import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING,
  buildLayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [{ materialId: "gypsum_board", thicknessMm: 12.5 }] as const satisfies readonly LayerInput[];
const DOUBLE_GYPSUM_BOARD_LAMINATED = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const RIGID_CONCRETE_PANEL = [{ materialId: "concrete", thicknessMm: 150 }] as const satisfies readonly LayerInput[];
const FLOOR_RIGID_CONCRETE_PANEL = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];
const CAVITY_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const CLT_PANEL = [{ materialId: "clt_panel", thicknessMm: 100 }] as const satisfies readonly LayerInput[];

const FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor.ts",
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateSingleLeaf(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: { contextMode: "element_lab" },
    calculator: "dynamic",
    targetOutputs: AIRBORNE_OUTPUTS
  });
}

function expectSingleLeafRuntime(
  layers: readonly LayerInput[],
  expected: {
    Rw: number;
    STC: number;
    family: string;
  }
) {
  const result = calculateSingleLeaf(layers);

  expect(result.metrics).toMatchObject({
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC
  });
  expect(result.airborneBasis).toMatchObject({
    calculationStandard: "engine_mass_law",
    errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
    family: expected.family,
    method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction",
    selectedBasis: {
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    }
  });
  expect(result.warnings).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING);
  expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  expect(result.unsupportedTargetOutputs).toEqual([]);

  return result;
}

describe("layer combination resolver single-leaf mass-law banded runtime corridor contract", () => {
  it("lands runtime basis promotion and selects single-leaf surface parity next", () => {
    const contract = buildLayerCombinationResolverSingleLeafMassLawBandedRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
      numericRuntimeValueMovementThisGate: false,
      previousFormulaCorridor: {
        landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
      },
      runtimeBasisMovementThisGate: true,
      runtimeCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
      warning: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
    });
    expect(contract.blockedAliases).toEqual([
      "field_airborne_R_prime_and_DnT_outputs",
      "building_prediction_outputs",
      "floor_impact_Ln_w_CI_DeltaLw_outputs",
      "ASTM_IIC_AIIC_aliases",
      "new_Rw_to_STC_alias_promotion"
    ]);
    expect(contract.supportedScenarios.map((scenario) => [scenario.id, scenario.currentRuntimeMetrics.Rw])).toEqual([
      ["wall_gypsum_board_12_5mm_single_leaf", 31],
      ["wall_laminated_gypsum_board_25mm_single_leaf", 34],
      ["wall_concrete_150mm_single_leaf", 55],
      ["floor_concrete_150mm_direct_airborne_single_leaf", 55]
    ]);
    expect(contract.supportedScenarios.map((scenario) => scenario.designMetrics.Rw)).toEqual([31, 34, 55, 55]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete source-absent single-leaf wall and floor direct-airborne stacks through the formula basis", () => {
    expectSingleLeafRuntime(SINGLE_GYPSUM_BOARD, {
      Rw: 31,
      STC: 31,
      family: "single_leaf_panel"
    });
    expectSingleLeafRuntime(DOUBLE_GYPSUM_BOARD_LAMINATED, {
      Rw: 34,
      STC: 34,
      family: "laminated_single_leaf"
    });
    expectSingleLeafRuntime(RIGID_CONCRETE_PANEL, {
      Rw: 55,
      STC: 55,
      family: "rigid_massive_wall"
    });
    expectSingleLeafRuntime(FLOOR_RIGID_CONCRETE_PANEL, {
      Rw: 55,
      STC: 55,
      family: "rigid_massive_wall"
    });
  });

  it("keeps exact precedence candidates and non-single-leaf boundaries out of the runtime basis", () => {
    const sourceAbsent = expectSingleLeafRuntime(SINGLE_GYPSUM_BOARD, {
      Rw: 31,
      STC: 31,
      family: "single_leaf_panel"
    });
    const exactCandidate = sourceAbsent.airborneCandidateResolution?.candidates.find(
      (candidate: { id: string; selected?: boolean }) => candidate.id === "candidate_blocked_rockwool_exact_source"
    );
    const cavity = calculateSingleLeaf(CAVITY_WALL);
    const clt = calculateSingleLeaf(CLT_PANEL);
    const field = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(exactCandidate).toMatchObject({
      origin: "measured_exact_full_stack",
      selected: false
    });
    expect(exactCandidate?.rejectionReasons.map((reason: { code: string }) => reason.code)).toContain("missing_source_evidence");
    expect(cavity.airborneBasis?.method).not.toBe(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS);
    expect(clt.airborneBasis?.method).not.toBe(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS);
    expect(field.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId:
        LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.warnings).toContain(
      "Airborne field-side overlay active. The current field between rooms context is carrying a conservative flanking penalty of 1.8 dB."
    );
  });

  it("keeps docs, exports, and current-gate runner aligned with the runtime corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain("Rw 31");
      expect(content, path).toContain("Rw 55");
      expect(content, path).toContain("+/-6 dB");
      expect(normalized, path).toContain("single-leaf");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts"
    );
  });
});
