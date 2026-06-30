import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS
} from "./post-v1-floor-timber-clt-delta-lw-resolver-gate-k";
import {
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS,
  POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT,
  POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
  POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT,
  buildPostV1FloorCompositePanelFamilySolverOwnerGateLContract
} from "./post-v1-floor-composite-panel-family-solver-owner-gate-l";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const COMPOSITE_TRACE_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 90 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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

describe("post-V1 floor composite-panel family solver owner Gate L", () => {
  it("maps the existing composite-panel published interaction basis into the shared resolver", () => {
    const contract = buildPostV1FloorCompositePanelFamilySolverOwnerGateLContract();
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
    );

    expect(contract).toMatchObject({
      blockedMetricsUntilSeparateOwner: ["IIC", "AIIC", "L'n,w", "L'nT,w"],
      candidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE,
      numericRuntimeValueMovement: false,
      previousGateK: {
        landedGate: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTION_STATUS
      },
      requiredPhysicalInputs: COMPOSITE_PANEL_PUBLISHED_INTERACTION_REQUIRED_FIELDS,
      runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS,
      sourceRowsAreAnchorsNotProduct: true,
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      toleranceDb: {
        DeltaLw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB,
        "Ln,w": COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB,
        Rw: COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB
      }
    });
    expect(contract.rejectedDefaultMoves).toEqual([
      "broad_source_crawl",
      "confidence_wording_pass",
      "docs_only_cleanup",
      "finite_scenario_pack",
      "astm_alias_promotion"
    ]);
    expect(contract.valuePins).toEqual([
      { profile: "dry_floating_floor", metric: "Ln,w", value: 69.4 },
      { profile: "dry_floating_floor", metric: "DeltaLw", value: 14.6 },
      { profile: "dry_floating_floor", metric: "Rw", value: 45.1 },
      { profile: "suspended_ceiling_only", metric: "Ln,w", value: 63.3 },
      { profile: "suspended_ceiling_only", metric: "DeltaLw", value: 20.7 },
      { profile: "suspended_ceiling_only", metric: "Rw", value: 48.6 },
      { profile: "combined_upper_lower_system", metric: "Ln,w", value: 48.5 },
      { profile: "combined_upper_lower_system", metric: "DeltaLw", value: 35.5 },
      { profile: "combined_upper_lower_system", metric: "Rw", value: 60.6 }
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
        { metric: "Rw", notMeasuredEvidence: true, toleranceDb: COMPOSITE_PANEL_PUBLISHED_INTERACTION_RW_TOLERANCE_DB },
        { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: COMPOSITE_PANEL_PUBLISHED_INTERACTION_LN_W_TOLERANCE_DB },
        { metric: "DeltaLw", notMeasuredEvidence: true, toleranceDb: COMPOSITE_PANEL_PUBLISHED_INTERACTION_DELTA_LW_TOLERANCE_DB }
      ],
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"]
    });
  });

  it("selects the composite candidate for dry floating, suspended-ceiling, and combined lab profiles", () => {
    const dry = calculateAssembly(COMPOSITE_TRACE_LAYERS, {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
      targetOutputs: LAB_OUTPUTS
    });
    const ceiling = calculateAssembly(COMPOSITE_TRACE_LAYERS, {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_SUSPENDED_CEILING_INPUT,
      targetOutputs: ["Rw", "Ln,w"]
    });
    const combined = calculateAssembly(COMPOSITE_TRACE_LAYERS, {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_COMBINED_INPUT,
      targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    });

    expect(dry.impact).toMatchObject({
      DeltaLw: 14.6,
      LnW: 69.4,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(dry.floorSystemRatings).toMatchObject({
      Rw: 45.1,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(dry.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
    expect(dry.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(dry.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      runtimeBasisId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      valuePins: [
        { metric: "Rw", value: 45.1 },
        { metric: "Ln,w", value: 69.4 },
        { metric: "DeltaLw", value: 14.6 }
      ]
    });

    expect(ceiling.impact).toMatchObject({
      DeltaLw: 20.7,
      LnW: 63.3,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(ceiling.floorSystemRatings).toMatchObject({
      Rw: 48.6,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(ceiling.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 48.6 },
        { metric: "Ln,w", value: 63.3 }
      ]
    });

    expect(combined.impact).toMatchObject({
      DeltaLw: 35.5,
      LnW: 48.5,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(combined.floorSystemRatings).toMatchObject({
      Rw: 60.6,
      basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS
    });
    expect(combined.unsupportedTargetOutputs).toEqual([]);
    expect(combined.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      valuePins: [
        { metric: "Rw", value: 60.6 },
        { metric: "Ln,w", value: 48.5 },
        { metric: "DeltaLw", value: 35.5 }
      ]
    });
  });

  it("keeps composite ASTM and field aliases out while DeltaLw has its separate owner", () => {
    const result = calculateAssembly(COMPOSITE_TRACE_LAYERS, {
      impactPredictorInput: POST_V1_GATE_L_COMPOSITE_DRY_FLOATING_INPUT,
      targetOutputs: ["DeltaLw", "IIC", "AIIC", "L'n,w", "L'nT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC", "L'n,w", "L'nT,w"]);
    expect(result.impact?.DeltaLw).toBe(14.6);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      selectedCandidateId: COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["DeltaLw"],
      valuePins: [{ metric: "DeltaLw", value: 14.6 }]
    });
  });

  it("keeps docs and the current gate runner aligned on Gate L closeout and Gate M selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate K`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_LANDED_GATE
      );
      expect(contents, `${relativePath} records selected Gate L from Gate K`).toContain(
        POST_V1_FLOOR_TIMBER_CLT_DELTA_LW_RESOLVER_GATE_K_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records landed Gate L`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_LANDED_GATE
      );
      expect(contents, `${relativePath} records Gate L status`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTION_STATUS
      );
      expect(contents, `${relativePath} records selected Gate M`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_ACTION
      );
      expect(contents, `${relativePath} records selected Gate M file`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_FILE
      );
      expect(contents, `${relativePath} records selected Gate M label`).toContain(
        POST_V1_FLOOR_COMPOSITE_PANEL_FAMILY_SOLVER_OWNER_GATE_L_SELECTED_NEXT_LABEL
      );
      expect(contents, `${relativePath} records resolver counts`).toContain(
        "42 declared candidates and 39 active runtime-basis mappings"
      );
      expect(contents, `${relativePath} records composite dry floating pins`).toContain("Ln,w 69.4 / Rw 45.1");
      expect(contents, `${relativePath} records composite suspended ceiling pins`).toContain("Ln,w 63.3 / Rw 48.6");
      expect(contents, `${relativePath} records composite combined pins`).toContain("Ln,w 48.5 / Rw 60.6");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts"
    );
  });
});
