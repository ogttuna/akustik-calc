import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import { adaptLayerCombinationRuntimeCandidate } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_A_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan";
const GATE_A_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts";
const GATE_A_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor";

const GATE_B_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan";
const GATE_B_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts";
const GATE_B_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_b_landed_selected_gate_c_surface_parity_and_guided_inputs";

const GATE_C_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_c_surface_parity_and_guided_inputs_plan";
const GATE_C_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-c-surface-parity-contract.test.ts";

const RUNTIME_BASIS = "triple_leaf_two_cavity_frequency_solver";
const SELECTED_RESOLVER_CANDIDATE_ID =
  "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver";
const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const GROUPED_ROCKWOOL_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const GROUPED_ROCKWOOL_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [3],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [4],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const FLAT_MULTICAVITY_UNGROUPED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FLAT_MULTICAVITY_MISSING_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
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

describe("post-V1 wall multileaf generalized formula Gate B runtime corridor", () => {
  it("registers the generalized multileaf runtime basis in the shared resolver", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === SELECTED_RESOLVER_CANDIDATE_ID
    );
    const adapter = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "element_lab",
      requestedMetricAliases: WALL_OUTPUTS,
      route: "wall",
      runtimeBasisId: RUNTIME_BASIS
    });

    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 45,
      candidateCount: 48
    });
    expect(candidate).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: RUNTIME_BASIS,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"]
    });
    expect(candidate?.formulaTerms).toEqual(
      expect.arrayContaining([
        "explicit_grouped_triple_leaf_two_cavity_topology",
        "one_third_octave_transmission_loss_curve",
        "iso_717_1_rw_c_ctr_rating_adapter",
        "astm_e413_stc_curve_rating_boundary"
      ])
    );
    expect(candidate?.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "wallTopology.topologyMode=grouped_triple_leaf",
        "complete_two_cavity_groups_and_depths",
        "element_lab_metric_basis"
      ])
    );
    expect(adapter).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: RUNTIME_BASIS,
      selectedCandidateId: SELECTED_RESOLVER_CANDIDATE_ID
    });
  });

  it("publishes the complete grouped Rockwool triple-leaf lab answer through the selected resolver candidate", () => {
    const result = calculateAssembly(GROUPED_ROCKWOOL_STACK, {
      airborneContext: GROUPED_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.7,
      estimatedCtrDb: -7.7,
      estimatedRwDb: 43,
      estimatedStc: 43
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 5,
      method: RUNTIME_BASIS,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "element_lab",
      candidateKind: "source_absent_family_solver",
      route: "wall",
      runtimeBasisId: RUNTIME_BASIS,
      selectedCandidateId: SELECTED_RESOLVER_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 43 },
        { metric: "STC", value: 43 },
        { metric: "C", value: -0.7 },
        { metric: "Ctr", value: -7.7 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("not measured evidence");
  });

  it("keeps exact rows first and ambiguous multileaf topology stopped", () => {
    const exact = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const ambiguous = calculateAssembly(FLAT_MULTICAVITY_UNGROUPED_STACK, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 55 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6.4 }
      ]
    });
    expect(exact.unsupportedTargetOutputs).toEqual([]);

    expect(ambiguous.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      origin: "needs_input",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(ambiguous.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      valuePins: []
    });
  });

  it("keeps source-of-truth docs aligned on Gate B closeout and Gate C selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate A`).toContain(GATE_A_ACTION);
      expect(contents, `${relativePath} records landed Gate A file`).toContain(GATE_A_FILE);
      expect(contents, `${relativePath} records Gate A selection`).toContain(GATE_A_SELECTION_STATUS);
      expect(contents, `${relativePath} records landed Gate B`).toContain(GATE_B_ACTION);
      expect(contents, `${relativePath} records landed Gate B file`).toContain(GATE_B_FILE);
      expect(contents, `${relativePath} records Gate B selection`).toContain(GATE_B_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate C`).toContain(GATE_C_ACTION);
      expect(contents, `${relativePath} records selected Gate C file`).toContain(GATE_C_FILE);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts");
  });
});
