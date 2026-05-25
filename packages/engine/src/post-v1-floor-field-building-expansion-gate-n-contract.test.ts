import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
} from "./impact-field-adapter-error-budget";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS
} from "./post-v1-floor-lightweight-concrete-family-solver-owner-gate-m";
import {
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS,
  POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS,
  buildPostV1FloorFieldBuildingExpansionGateNContract
} from "./post-v1-floor-field-building-expansion-gate-n";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const LIGHTWEIGHT_VISIBLE_LAYERS = [
  { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
  { materialId: "screed", thicknessMm: 50, floorRole: "floating_screed" },
  { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
  { materialId: "lightweight_concrete", thicknessMm: 150, floorRole: "base_structure" }
] as const satisfies readonly LayerInput[];
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor field/building expansion Gate N", () => {
  it("lands a calculator-capacity field adapter slice after Gate M", () => {
    const contract = buildPostV1FloorFieldBuildingExpansionGateNContract();
    const registry = buildLayerCombinationResolverRegistryContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
    );

    expect(contract).toMatchObject({
      adapterCandidateId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
      blockedAliasesUntilSeparateOwner: ["IIC", "AIIC", "building_prediction"],
      landedGate: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE,
      previousGateM: {
        landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS
      },
      runtimeBasisId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
      selectedNextAction: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS,
      sourceRowsAreAnchorsNotProduct: true,
      supportedMetrics: FIELD_OUTPUTS,
      unlockedRuntimeScenario: {
        anchorCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
        anchorRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
        valuePins: POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS
      }
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "lab_to_field_alias"
    ]);
    expect(candidate).toMatchObject({
      basis: "field_apparent",
      id: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("unlocks dynamic floor field impact values from the Gate M lightweight-concrete lab anchor", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impact).toMatchObject({
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.impact?.errorBudgets).toEqual(expect.arrayContaining([
      expect.objectContaining({
        metricId: "L'n,w",
        origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
        toleranceDb: 5
      }),
      expect.objectContaining({
        metricId: "L'nT,w",
        origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
        toleranceDb: 5.5
      })
    ]));
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
      selectedCandidateId: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
      supportBucket: "field_adapter",
      supportedMetrics: ["L'n,w", "L'nT,w"],
      valuePins: POST_V1_GATE_N_LIGHTWEIGHT_FIELD_VALUE_PINS
    });
    expect(result.layerCombinationResolverTrace?.requiredInputs).toEqual([
      "impactFieldContext.fieldKDb_or_guideMassRatio_or_directFlankingPaths",
      "impactFieldContext.receivingRoomVolumeM3_for_LprimeNTw",
      "ownedLabImpactAnchorLnW",
      "fieldImpactBasisNotBuildingPrediction"
    ]);
  });

  it("asks only for the missing floor field-impact inputs when the lab anchor already exists", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      targetOutputs: FIELD_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(result.impact).toMatchObject({
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["impactFieldContext", "receivingRoomVolumeM3"],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(result.acousticAnswerBoundary?.missingPhysicalInputs).not.toEqual(
      expect.arrayContaining(["loadBasisKgM2", "contextMode", "partitionAreaM2", "receivingRoomRt60S"])
    );
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      requiredInputs: ["impactFieldContext", "receivingRoomVolumeM3"]
    });
  });

  it("keeps building prediction and ASTM aliases blocked instead of relabelling the field adapter", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      airborneContext: {
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
      },
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["L'n,w", "L'nT,w", "IIC", "AIIC"]
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "IIC", "AIIC"]);
    expect(result.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      unsupportedOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });
  });

  it("keeps docs and the current gate runner aligned on Gate N closeout and Gate O selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate M`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE
      );
      expect(contents, `${relativePath} records landed Gate N`).toContain(
        POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate N status`).toContain(
        POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate O`).toContain(
        POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate O file`).toContain(
        POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate O label`).toContain(
        POST_V1_FLOOR_FIELD_BUILDING_EXPANSION_GATE_N_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records Gate N pins`).toContain("L'n,w 66.3 / L'nT,w 63.9");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts"
    );
  });
});
