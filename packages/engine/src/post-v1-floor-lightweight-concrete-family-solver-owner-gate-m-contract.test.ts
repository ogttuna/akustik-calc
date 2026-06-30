import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB,
  LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS
} from "./post-v1-floor-composite-panel-family-solver-owner-gate-l";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS,
  POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT,
  buildPostV1FloorLightweightConcreteFamilySolverOwnerGateMContract
} from "./post-v1-floor-lightweight-concrete-family-solver-owner-gate-m";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const LIGHTWEIGHT_VISIBLE_LAYERS = [
  { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
  { materialId: "screed", thicknessMm: 50, floorRole: "floating_screed" },
  { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
  { materialId: "lightweight_concrete", thicknessMm: 150, floorRole: "base_structure" }
] as const;

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

describe("post-V1 floor lightweight-concrete family solver owner Gate M", () => {
  it("maps the lightweight-concrete family basis into the shared resolver without numeric movement", () => {
    const contract = buildPostV1FloorLightweightConcreteFamilySolverOwnerGateMContract();
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
    );

    expect(contract).toMatchObject({
      blockedMetricsUntilSeparateOwner: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"],
      candidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE,
      numericRuntimeValueMovement: false,
      previousGateL: {
        landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS
      },
      requiredPhysicalInputs: LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
      runtimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS,
      sourceRowsAreAnchorsNotProduct: true,
      supportedMetrics: ["Rw", "Ln,w"],
      toleranceDb: {
        "Ln,w": LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB,
        Rw: LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB
      }
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "heavy_concrete_formula_borrowing"
    ]);
    expect(contract.valuePins).toEqual([
      { profile: "visible_lightweight_floating_floor", metric: "Ln,w", value: 64.3 },
      { profile: "visible_lightweight_floating_floor", metric: "Rw", value: 53 },
      { profile: "low_density_predictor_input", metric: "Ln,w", value: 47 },
      { profile: "low_density_predictor_input", metric: "Rw", value: 49 }
    ]);
    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 54,
      candidateCount: 57
    });
    expect(adapter.summary.adaptedRuntimeBasisCount).toBe(54);
    expect(surface.summary.surfaceRowCount).toBe(57);
    expect(candidate).toMatchObject({
      basis: "element_lab",
      errorBudgetTerms: [
        { metric: "Rw", notMeasuredEvidence: true, toleranceDb: LIGHTWEIGHT_CONCRETE_FAMILY_RW_TOLERANCE_DB },
        { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: LIGHTWEIGHT_CONCRETE_FAMILY_LN_W_TOLERANCE_DB }
      ],
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Rw", "Ln,w"]
    });
  });

  it("selects the lightweight-concrete candidate for the visible low-density floating-floor stack", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.floorSystemEstimate).toMatchObject({
      kind: "family_general",
      structuralFamily: "lightweight concrete"
    });
    expect(result.floorSystemEstimate?.impact.estimateCandidateIds).toEqual([
      "tuas_h2_concrete160_measured_2026",
      "euracoustics_f0_bare_concrete_lab_2026"
    ]);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC", "AIIC"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps low-density reinforced-concrete predictor input on lightweight concrete instead of heavy formulas", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_M_LOW_DENSITY_REINFORCED_CONCRETE_INPUT,
      targetOutputs: ["Ln,w", "Rw", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.sourceLayers.at(-1)?.material.id).toBe("lightweight_concrete");
    expect(result.impact).toMatchObject({
      LnW: 47,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.floorSystemEstimate?.fitPercent).toBe(45);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 49,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.estimateCandidateIds).toEqual(["tuas_h2_concrete160_measured_2026"]);
    expect(result.impactPredictorStatus).toMatchObject({
      implementedFamilyEstimate: true,
      implementedFormulaEstimate: false
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps lightweight-concrete DeltaLw, ASTM, and field aliases out when required physical inputs are missing", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      targetOutputs: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"]);
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("keeps docs and the current gate runner aligned on Gate M closeout and Gate N selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate L`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE
      );
      expect(contents, `${relativePath} records selected Gate M from Gate L`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records landed Gate M`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate M status`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate N`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate N file`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate N label`).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_FAMILY_SOLVER_OWNER_GATE_M_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records resolver counts`).toContain(
        "42 declared candidates and 39 active runtime-basis mappings"
      );
      expect(contents, `${relativePath} records visible lightweight concrete pins`).toContain("Ln,w 64.3 / Rw 53");
      expect(contents, `${relativePath} records low-density predictor pins`).toContain("Ln,w 47 / Rw 49");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts"
    );
  });
});
