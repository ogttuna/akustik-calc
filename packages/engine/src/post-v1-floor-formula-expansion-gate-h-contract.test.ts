import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_G_ACTION = "post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan";
const GATE_H_ACTION = "post_v1_floor_formula_expansion_gate_h_plan";
const GATE_H_FILE = "packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts";
const GATE_H_SELECTION_STATUS =
  "post_v1_floor_formula_expansion_gate_h_landed_selected_gate_i_floor_formula_gap_refresh";
const GATE_I_ACTION = "post_v1_floor_formula_gap_refresh_gate_i_plan";
const GATE_I_FILE = "packages/engine/src/post-v1-floor-formula-gap-refresh-gate-i-contract.test.ts";
const GATE_I_LABEL = "post-V1 floor formula gap refresh Gate I";

const STEEL_UPPER_LOWER_CANDIDATE_ID = "floor.lightweight_steel.upper_lower_mass_spring.source_absent";
const STEEL_SUSPENDED_ONLY_CANDIDATE_ID = "floor.lightweight_steel.suspended_ceiling_only.source_absent";

const COMPLETE_STEEL_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "IIC",
  "AIIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const SUSPENDED_ONLY_TARGET_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const STEEL_SUSPENDED_CEILING_ONLY_LAYERS = [
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
] as const satisfies readonly LayerInput[];

const STEEL_SUSPENDED_CEILING_ONLY_SURFACE = {
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  steelCarrierDepthMm: 250,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "joist_or_purlin"
} as const;

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

describe("post-V1 floor formula expansion Gate H", () => {
  it("declares lightweight-steel floor formula candidates on the shared resolver surface", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const registryRowsById = new Map(registry.candidateDeclarations.map((candidate) => [candidate.id, candidate]));
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const surfaceRowsById = new Map(surface.surfaceRows.map((row) => [row.selectedCandidateId, row]));

    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 40,
      candidateCount: 43
    });
    expect(surface.summary.surfaceRowCount).toBe(43);

    expect(registryRowsById.get(STEEL_UPPER_LOWER_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      errorBudgetTerms: expect.arrayContaining([
        { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB },
        { metric: "DeltaLw", notMeasuredEvidence: true, toleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB }
      ]),
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });
    expect(surfaceRowsById.get(STEEL_UPPER_LOWER_CANDIDATE_ID)).toMatchObject({
      runtimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"]
    });

    expect(registryRowsById.get(STEEL_SUSPENDED_ONLY_CANDIDATE_ID)).toMatchObject({
      basis: "element_lab",
      errorBudgetTerms: [
        { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB }
      ],
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Ln,w"]
    });
    expect(surfaceRowsById.get(STEEL_SUSPENDED_ONLY_CANDIDATE_ID)).toMatchObject({
      runtimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w"]
    });
  });

  it("publishes complete lightweight-steel upper/lower mass-spring answers through the selected formula candidate", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: COMPLETE_STEEL_TARGET_OUTPUTS
    });
    const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: COMPLETE_STEEL_TARGET_OUTPUTS
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC", "L'nT,50"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      requestedBasis: "element_lab",
      runtimeBasisId: STEEL_FLOOR_FORMULA_BASIS,
      selectedCandidateId: STEEL_UPPER_LOWER_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w", "DeltaLw"],
      valuePins: expect.arrayContaining([
        { metric: "Ln,w", value: 51.6 },
        { metric: "DeltaLw", value: 22.4 }
      ])
    });
  });

  it("keeps suspended-ceiling-only steel floors calculable for Ln,w while DeltaLw waits for its upper package owner inputs", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: STEEL_SUSPENDED_CEILING_ONLY_LAYERS,
      surface: STEEL_SUSPENDED_CEILING_ONLY_SURFACE,
      targetOutputs: SUSPENDED_ONLY_TARGET_OUTPUTS
    });
    const result = calculateAssembly(STEEL_SUSPENDED_CEILING_ONLY_LAYERS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: SUSPENDED_ONLY_TARGET_OUTPUTS
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor",
      targetOutputMissingPhysicalInputs: {
        DeltaLw: ["toppingOrFloatingLayer", "resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"]
      }
    });
    expect(result.impact).toMatchObject({
      LnW: 62.2,
      basis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "element_lab",
      runtimeBasisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      selectedCandidateId: STEEL_SUSPENDED_ONLY_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Ln,w"],
      valuePins: [{ metric: "Ln,w", value: 62.2 }]
    });
  });

  it("keeps docs and the current gate runner aligned on Gate H closeout and Gate I selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate G`).toContain(GATE_G_ACTION);
      expect(contents, `${relativePath} records landed Gate H`).toContain(GATE_H_ACTION);
      expect(contents, `${relativePath} records Gate H file`).toContain(GATE_H_FILE);
      expect(contents, `${relativePath} records Gate H status`).toContain(GATE_H_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate I`).toContain(GATE_I_ACTION);
      expect(contents, `${relativePath} records selected Gate I file`).toContain(GATE_I_FILE);
      expect(contents, `${relativePath} records selected Gate I label`).toContain(GATE_I_LABEL);
      expect(contents, `${relativePath} records steel upper/lower values`).toContain("Ln,w 51.6");
      expect(contents, `${relativePath} records steel suspended-only values`).toContain("Ln,w 62.2");
      expect(contents, `${relativePath} records resolver counts`).toContain("42 declared candidates and 39 active runtime-basis mappings");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-formula-expansion-gate-h-contract.test.ts");
  });
});
