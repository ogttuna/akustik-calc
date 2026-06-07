import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import {
  LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID,
  LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB
} from "./lightweight-concrete-delta-lw-runtime-corridor";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS,
  POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT
} from "./post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS,
  summarizePostV1FloorLightweightConcreteDeltaLwRuntimeCorridorGateDB
} from "./post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LIGHTWEIGHT_VISIBLE_LAYERS = [
  { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
  { materialId: "screed", thicknessMm: 50, floorRole: "floating_screed" },
  { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
  { materialId: "lightweight_concrete", thicknessMm: 150, floorRole: "base_structure" }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 70,
  resilientLayerDynamicStiffnessMNm3: 25
} as const;

const MIXED_LIGHTWEIGHT_TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor lightweight-concrete DeltaLw runtime corridor Gate DB", () => {
  it("lands after Gate DA and declares a separate lightweight-concrete DeltaLw owner", () => {
    const summary = summarizePostV1FloorLightweightConcreteDeltaLwRuntimeCorridorGateDB();
    const registry = buildLayerCombinationResolverRegistryContract();
    const registryRowsById = new Map(registry.candidateDeclarations.map((candidate) => [candidate.id, candidate]));
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const surfaceRowsById = new Map(surface.surfaceRows.map((row) => [row.selectedCandidateId, row]));

    expect(summary).toMatchObject({
      deltaLwRuntimeBasisId: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
      existingFamilyCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      existingFamilyRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE,
      previousGateDA: {
        landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS
      },
      requiredFields: LIGHTWEIGHT_CONCRETE_DELTA_LW_REQUIRED_FIELDS,
      selectedCandidateId: LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS,
      supportedMetrics: ["DeltaLw"],
      toleranceDb: LIGHTWEIGHT_CONCRETE_DELTA_LW_TOLERANCE_DB
    });
    expect(summary.forbiddenFormulaBorrowing).toEqual([
      "heavy_concrete_annex_c_delta_lw",
      "composite_panel_bare_minus_treated_delta_lw",
      "timber_clt_delta_lw",
      "steel_mass_spring_delta_lw"
    ]);
    expect(summary.coverageCounters).toEqual({
      newCalculableLayerTemplates: 2,
      newCalculableRequestShapes: 4,
      runtimeCorrectedLayerTemplates: 2,
      runtimeCorrectedRequestShapes: 4
    });

    expect(registryRowsById.get(LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID)).toMatchObject({
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["DeltaLw"]
    });
    expect(surfaceRowsById.get(LIGHTWEIGHT_CONCRETE_DELTA_LW_SELECTED_CANDIDATE_ID)).toMatchObject({
      runtimeBasisId: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
      supportedMetrics: ["DeltaLw"]
    });
  });

  it("calculates DeltaLw for complete visible lightweight-concrete floating-floor stacks", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: MIXED_LIGHTWEIGHT_TARGET_OUTPUTS
    });

    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
      LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.impact?.notes).toContain(
      "DeltaLw companion was carried from the lightweight-concrete dynamic-improvement corridor while Ln,w stayed on the lightweight-family lane."
    );
    expect(result.impact?.notes).not.toContain(
      "DeltaLw companion was carried from the timber/CLT formula corridor while Ln,w stayed on its exact or published-family lane."
    );
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      selectedCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "Ln,w", value: 64.3 },
        { metric: "DeltaLw", value: 24.9 }
      ]
    });
  });

  it("calculates DeltaLw for complete low-density predictor input without borrowing the heavy-concrete basis", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT,
      targetOutputs: ["Ln,w", "Rw", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.sourceLayers.at(-1)?.material.id).toBe("lightweight_concrete");
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS,
      LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps lightweight-concrete DeltaLw single-output requests on the lightweight companion basis", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["DeltaLw"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.metricBasis).toMatchObject({
      DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS
    });
    expect(result.impact?.notes).toContain(
      "DeltaLw companion was carried from the lightweight-concrete dynamic-improvement corridor while Ln,w stayed on the lightweight-family lane."
    );
    expect(result.impact?.notes).not.toContain(
      "DeltaLw companion was carried from the timber/CLT formula corridor while Ln,w stayed on its exact or published-family lane."
    );
    expect(result.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps missing dynamic stiffness or load basis as needs_input while preserving Rw and Ln,w", () => {
    const missingDynamic = calculateImpactOnly([], {
      impactPredictorInput: {
        ...POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT,
        resilientLayer: {
          ...POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT.resilientLayer,
          dynamicStiffnessMNm3: undefined
        }
      },
      targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });
    const missingLoad = calculateImpactOnly([], {
      impactPredictorInput: {
        ...POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT,
        loadBasisKgM2: undefined
      },
      targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });

    expect(missingDynamic).toMatchObject({
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
    expect(missingDynamic.impact).toMatchObject({ LnW: 47 });
    expect(missingDynamic.floorSystemRatings).toMatchObject({ Rw: 49 });
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      unsupportedOutputs: ["DeltaLw"]
    });

    expect(missingLoad).toMatchObject({
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
    expect(missingLoad.impact).toMatchObject({ LnW: 64.3 });
    expect(missingLoad.floorSystemRatings).toMatchObject({ Rw: 53 });
    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["loadBasisKgM2"],
      unsupportedOutputs: ["DeltaLw"]
    });
  });

  it("keeps ASTM impact aliases unsupported after the lightweight DeltaLw corridor lands", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["DeltaLw", "IIC", "AIIC"]
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      metricBasis: {
        DeltaLw: LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS
      }
    });
    expect(result.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate DB closeout and Gate DC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_BASIS);
      expect(contents, path).toContain("DeltaLw 24.9");
      expect(contents, path).toContain("resilientLayerDynamicStiffnessMNm3");
      expect(contents, path).toContain("loadBasisKgM2");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts"
    );
  });
});
