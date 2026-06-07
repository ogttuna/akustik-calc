import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_0_ACTION = "post_v1_calculator_capability_roi_confirmation_gate_0_plan";
const GATE_0_FILE =
  "packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts";
const GATE_0_SELECTION_STATUS =
  "post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a";

const GATE_A_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan";
const GATE_A_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts";
const GATE_A_SELECTION_STATUS =
  "post_v1_wall_multileaf_generalized_formula_gate_a_landed_no_runtime_selected_gate_b_runtime_corridor";

const GATE_B_ACTION = "post_v1_wall_multileaf_generalized_formula_gate_b_runtime_corridor_plan";
const GATE_B_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-b-runtime-corridor-contract.test.ts";

const PLANNED_CANDIDATE_ID = "candidate_post_v1_wall_multileaf_generalized_source_absent_family_solver";
const PLANNED_RUNTIME_BASIS = "post_v1_wall_multileaf_generalized_source_absent_formula_runtime";
const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

type OwnerTermStatus = "owned_for_gate_b_runtime" | "boundary_owner" | "extension_hook";

type OwnerTerm = {
  readonly id: string;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: OwnerTermStatus;
};

type RouteAdmissionStatus =
  | "selected_gate_b_runtime_scope"
  | "needs_input_boundary"
  | "separate_owner_boundary"
  | "unsupported_until_future_owner";

type RouteAdmission = {
  readonly basis: "element_lab" | "field_apparent" | "building_prediction";
  readonly id: string;
  readonly ownedMetrics: readonly RequestedOutputId[];
  readonly requiredOwnerTerms: readonly string[];
  readonly route: "wall" | "floor";
  readonly selectedForGateB: boolean;
  readonly status: RouteAdmissionStatus;
  readonly visibleBoundary: string;
};

type FormulaTerm = {
  readonly id: string;
  readonly inputOwners: readonly string[];
  readonly outputOwner: readonly RequestedOutputId[] | "none";
  readonly status: "gate_b_required" | "blocked_until_future_gate";
};

const OWNER_TERMS = [
  {
    id: "grouped_multileaf_topology_owner",
    requiredPhysicalFields: [
      "route=wall",
      "wallTopology.topologyMode=grouped_triple_leaf",
      "sideALeafLayerIndices",
      "internalLeafLayerIndices",
      "sideBLeafLayerIndices",
      "cavity1LayerIndices",
      "cavity2LayerIndices"
    ],
    runtimeRole: "admit only explicit grouped triple-leaf/two-cavity wall topology into Gate B",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "leaf_surface_mass_distribution_owner",
    requiredPhysicalFields: [
      "sideALeafMassKgM2",
      "internalLeafMassKgM2",
      "sideBLeafMassKgM2",
      "layerDensityOrSurfaceMass",
      "duplicateLayerMergePolicy"
    ],
    runtimeRole: "partition side/internal leaf mass before banded transmission-loss terms are calculated",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "two_cavity_airspace_owner",
    requiredPhysicalFields: [
      "cavity1DepthMm",
      "cavity2DepthMm",
      "cavity1FillCoverage",
      "cavity2FillCoverage",
      "cavityAbsorptionClass"
    ],
    runtimeRole: "own the two mass-air-mass cavities and absorber damping inputs for Gate B",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "internal_leaf_coupling_owner",
    requiredPhysicalFields: [
      "internalLeafCoupling",
      "internalLeafSupportClass",
      "mechanicalBridgePath",
      "couplingPenaltyDb"
    ],
    runtimeRole: "separate independent, tied, and unknown internal-leaf behavior",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "support_bridge_owner",
    requiredPhysicalFields: [
      "supportTopology",
      "studOrFrameSpacingMm",
      "bridgeClass",
      "resilientConnectionState",
      "unsafeDirectFixBoundary"
    ],
    runtimeRole: "bound structural coupling instead of borrowing double-leaf bridge assumptions",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "banded_tl_curve_owner",
    requiredPhysicalFields: [
      "oneThirdOctaveBandSet",
      "tripleLeafResonanceTerms",
      "coincidenceRegionTerms",
      "bridgeLossTilt",
      "curveSmoothingPolicy"
    ],
    runtimeRole: "produce a one-third-octave TL curve before single-number ratings are derived",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "iso717_and_stc_adapter_owner",
    requiredPhysicalFields: [
      "ISO717-1 referenceContour",
      "RwAdapter",
      "CAdapter",
      "CtrAdapter",
      "STC display boundary",
      "no Rw-to-STC alias promotion"
    ],
    runtimeRole: "derive owned Rw/C/Ctr and keep STC display separated from unowned ASTM claims",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "source_absent_error_budget_owner",
    requiredPhysicalFields: [
      "sourceAbsentRwBudget",
      "sourceAbsentSpectrumBudget",
      "materialPropertyDefaultBudget",
      "topologyClassificationBudget",
      "holdoutResidualBudget"
    ],
    runtimeRole: "publish not-measured budgets until calibrated holdouts narrow them",
    status: "owned_for_gate_b_runtime"
  },
  {
    id: "exact_and_anchor_precedence_owner",
    requiredPhysicalFields: [
      "sameStackExactSourceId",
      "sameMetricBasis",
      "compatibleAnchorTopology",
      "nearbyNegativeRows",
      "anchorDeltaOwnerRequired"
    ],
    runtimeRole: "keep exact rows above formulas and keep compatible anchors named, not implicit",
    status: "boundary_owner"
  },
  {
    id: "flat_or_ambiguous_multileaf_needs_input_owner",
    requiredPhysicalFields: [...FLAT_MULTICAVITY_MISSING_INPUTS],
    runtimeRole: "stop flat/grouping-ambiguous multileaf stacks before any design-looking value publishes",
    status: "boundary_owner"
  },
  {
    id: "quad_three_cavity_extension_hook",
    requiredPhysicalFields: [
      "cavity3LayerIndices",
      "cavity3DepthMm",
      "secondInternalLeafLayerIndices",
      "quadSystemFormulaOwner"
    ],
    runtimeRole: "classify quad/three-cavity walls explicitly without claiming Gate B runtime support",
    status: "extension_hook"
  },
  {
    id: "field_building_and_floor_boundary_owner",
    requiredPhysicalFields: [
      "route=wall",
      "contextMode=element_lab",
      "no field value alias",
      "no floor impact transfer",
      "ISO12354 owner required"
    ],
    runtimeRole: "keep field, building, floor, and impact metrics out of the element-lab wall formula",
    status: "boundary_owner"
  }
] as const satisfies readonly OwnerTerm[];

const FORMULA_TERMS = [
  {
    id: "leaf_mass_and_panel_response",
    inputOwners: ["leaf_surface_mass_distribution_owner"],
    outputOwner: "none",
    status: "gate_b_required"
  },
  {
    id: "two_cavity_mass_air_mass_resonance",
    inputOwners: ["two_cavity_airspace_owner", "leaf_surface_mass_distribution_owner"],
    outputOwner: "none",
    status: "gate_b_required"
  },
  {
    id: "internal_leaf_coupling_and_bridge_loss",
    inputOwners: ["internal_leaf_coupling_owner", "support_bridge_owner"],
    outputOwner: "none",
    status: "gate_b_required"
  },
  {
    id: "one_third_octave_transmission_loss_curve",
    inputOwners: ["banded_tl_curve_owner"],
    outputOwner: "none",
    status: "gate_b_required"
  },
  {
    id: "iso717_rw_c_ctr_and_stc_display",
    inputOwners: ["iso717_and_stc_adapter_owner", "source_absent_error_budget_owner"],
    outputOwner: ["Rw", "STC", "C", "Ctr"],
    status: "gate_b_required"
  },
  {
    id: "quad_three_cavity_formula",
    inputOwners: ["quad_three_cavity_extension_hook"],
    outputOwner: "none",
    status: "blocked_until_future_gate"
  }
] as const satisfies readonly FormulaTerm[];

const ROUTE_ADMISSIONS = [
  {
    basis: "element_lab",
    id: "wall.grouped_triple_leaf.two_cavity.complete.element_lab",
    ownedMetrics: WALL_OUTPUTS,
    requiredOwnerTerms: [
      "grouped_multileaf_topology_owner",
      "leaf_surface_mass_distribution_owner",
      "two_cavity_airspace_owner",
      "internal_leaf_coupling_owner",
      "support_bridge_owner",
      "banded_tl_curve_owner",
      "iso717_and_stc_adapter_owner",
      "source_absent_error_budget_owner"
    ],
    route: "wall",
    selectedForGateB: true,
    status: "selected_gate_b_runtime_scope",
    visibleBoundary: "complete grouped triple-leaf/two-cavity wall can enter Gate B runtime"
  },
  {
    basis: "element_lab",
    id: "wall.flat_or_grouping_ambiguous_multileaf.needs_input",
    ownedMetrics: [],
    requiredOwnerTerms: ["flat_or_ambiguous_multileaf_needs_input_owner"],
    route: "wall",
    selectedForGateB: false,
    status: "needs_input_boundary",
    visibleBoundary: "missing topology fields remain needs_input"
  },
  {
    basis: "element_lab",
    id: "wall.quad_or_three_cavity.extension_hook",
    ownedMetrics: [],
    requiredOwnerTerms: ["quad_three_cavity_extension_hook"],
    route: "wall",
    selectedForGateB: false,
    status: "unsupported_until_future_owner",
    visibleBoundary: "quad/three-cavity is classified but not promoted in Gate B"
  },
  {
    basis: "element_lab",
    id: "wall.double_leaf.direct_fixed_or_framed.separate_owner",
    ownedMetrics: [],
    requiredOwnerTerms: ["support_bridge_owner"],
    route: "wall",
    selectedForGateB: false,
    status: "separate_owner_boundary",
    visibleBoundary: "double-leaf, lined massive, and heavy-composite wall lanes remain separate"
  },
  {
    basis: "field_apparent",
    id: "wall.field_or_building_metrics.boundary",
    ownedMetrics: [],
    requiredOwnerTerms: ["field_building_and_floor_boundary_owner"],
    route: "wall",
    selectedForGateB: false,
    status: "unsupported_until_future_owner",
    visibleBoundary: "element-lab multileaf formula does not publish R'w or DnT,w"
  },
  {
    basis: "element_lab",
    id: "floor.or.impact.metrics.boundary",
    ownedMetrics: [],
    requiredOwnerTerms: ["field_building_and_floor_boundary_owner"],
    route: "floor",
    selectedForGateB: false,
    status: "separate_owner_boundary",
    visibleBoundary: "floor and impact routes remain outside wall airborne Gate B"
  }
] as const satisfies readonly RouteAdmission[];

const BLOCKED_ACTIONS = [
  "runtime value promotion before Gate B",
  "research-only solver import without owner mapping",
  "broad source crawl",
  "low-confidence wording pass",
  "Rw/STC/C/Ctr aliasing from exact Rw-only rows",
  "field or building R'w/DnT,w promotion from element-lab values",
  "floor Ln,w/IIC borrowing from wall airborne curves"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildGateAContract() {
  return {
    blockedActions: BLOCKED_ACTIONS,
    formulaTerms: FORMULA_TERMS,
    gate0: {
      action: GATE_0_ACTION,
      file: GATE_0_FILE,
      selectionStatus: GATE_0_SELECTION_STATUS
    },
    landedGate: GATE_A_ACTION,
    noRuntimeValueMovement: true,
    ownerTerms: OWNER_TERMS,
    plannedCandidate: {
      basis: "element_lab",
      candidateId: PLANNED_CANDIDATE_ID,
      kind: "source_absent_family_solver",
      origin: "source_absent_formula",
      route: "wall",
      runtimeBasis: PLANNED_RUNTIME_BASIS,
      supportBucket: "not_measured_source_absent_formula",
      targetMetrics: WALL_OUTPUTS
    },
    routeAdmissions: ROUTE_ADMISSIONS,
    selectedNextAction: GATE_B_ACTION,
    selectedNextFile: GATE_B_FILE,
    selectedNextLabel: "post-V1 wall multileaf generalized formula Gate B runtime corridor",
    selectionStatus: GATE_A_SELECTION_STATUS,
    summary: {
      blockedActionCount: BLOCKED_ACTIONS.length,
      extensionHookCount: OWNER_TERMS.filter((term) => term.status === "extension_hook").length,
      formulaTermCount: FORMULA_TERMS.length,
      ownerTermCount: OWNER_TERMS.length,
      routeAdmissionCount: ROUTE_ADMISSIONS.length,
      selectedGateBRuntimeScopeCount: ROUTE_ADMISSIONS.filter((admission) => admission.selectedForGateB).length
    }
  };
}

describe("post-V1 wall multileaf generalized formula Gate A", () => {
  it("lands the no-runtime input owner and selects Gate B runtime corridor", () => {
    const contract = buildGateAContract();

    expect(contract).toMatchObject({
      gate0: {
        action: GATE_0_ACTION,
        file: GATE_0_FILE,
        selectionStatus: GATE_0_SELECTION_STATUS
      },
      landedGate: GATE_A_ACTION,
      noRuntimeValueMovement: true,
      plannedCandidate: {
        basis: "element_lab",
        candidateId: PLANNED_CANDIDATE_ID,
        kind: "source_absent_family_solver",
        route: "wall",
        runtimeBasis: PLANNED_RUNTIME_BASIS,
        targetMetrics: ["Rw", "STC", "C", "Ctr"]
      },
      selectedNextAction: GATE_B_ACTION,
      selectedNextFile: GATE_B_FILE,
      selectionStatus: GATE_A_SELECTION_STATUS
    });
    expect(contract.summary).toEqual({
      blockedActionCount: 7,
      extensionHookCount: 1,
      formulaTermCount: 6,
      ownerTermCount: 12,
      routeAdmissionCount: 6,
      selectedGateBRuntimeScopeCount: 1
    });
  });

  it("owns the physical inputs and formula terms needed before Gate B can calculate", () => {
    const contract = buildGateAContract();
    const ownerIds = contract.ownerTerms.map((term) => term.id);

    expect(ownerIds).toEqual(
      expect.arrayContaining([
        "grouped_multileaf_topology_owner",
        "leaf_surface_mass_distribution_owner",
        "two_cavity_airspace_owner",
        "internal_leaf_coupling_owner",
        "support_bridge_owner",
        "banded_tl_curve_owner",
        "iso717_and_stc_adapter_owner",
        "source_absent_error_budget_owner",
        "exact_and_anchor_precedence_owner",
        "flat_or_ambiguous_multileaf_needs_input_owner"
      ])
    );

    expect(contract.ownerTerms.find((term) => term.id === "grouped_multileaf_topology_owner")).toMatchObject({
      requiredPhysicalFields: expect.arrayContaining([
        "wallTopology.topologyMode=grouped_triple_leaf",
        "sideALeafLayerIndices",
        "internalLeafLayerIndices",
        "sideBLeafLayerIndices",
        "cavity1LayerIndices",
        "cavity2LayerIndices"
      ]),
      status: "owned_for_gate_b_runtime"
    });
    expect(contract.ownerTerms.find((term) => term.id === "quad_three_cavity_extension_hook")).toMatchObject({
      status: "extension_hook"
    });
    expect(contract.formulaTerms.map((term) => term.id)).toEqual([
      "leaf_mass_and_panel_response",
      "two_cavity_mass_air_mass_resonance",
      "internal_leaf_coupling_and_bridge_loss",
      "one_third_octave_transmission_loss_curve",
      "iso717_rw_c_ctr_and_stc_display",
      "quad_three_cavity_formula"
    ]);
    expect(contract.formulaTerms.find((term) => term.id === "iso717_rw_c_ctr_and_stc_display")).toMatchObject({
      outputOwner: ["Rw", "STC", "C", "Ctr"],
      status: "gate_b_required"
    });
  });

  it("classifies selected runtime scope and protected boundaries without moving values", () => {
    const contract = buildGateAContract();

    expect(contract.routeAdmissions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "wall.grouped_triple_leaf.two_cavity.complete.element_lab",
          ownedMetrics: ["Rw", "STC", "C", "Ctr"],
          selectedForGateB: true,
          status: "selected_gate_b_runtime_scope"
        }),
        expect.objectContaining({
          id: "wall.flat_or_grouping_ambiguous_multileaf.needs_input",
          ownedMetrics: [],
          selectedForGateB: false,
          status: "needs_input_boundary"
        }),
        expect.objectContaining({
          id: "wall.quad_or_three_cavity.extension_hook",
          selectedForGateB: false,
          status: "unsupported_until_future_owner"
        }),
        expect.objectContaining({
          id: "wall.field_or_building_metrics.boundary",
          ownedMetrics: [],
          status: "unsupported_until_future_owner"
        })
      ])
    );
    expect(contract.blockedActions).toEqual(
      expect.arrayContaining(["broad source crawl", "low-confidence wording pass", "runtime value promotion before Gate B"])
    );
  });

  it("preserves exact precedence, ambiguous needs_input, and current resolver surface", () => {
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
    const registry = buildLayerCombinationResolverRegistryContract();

    expect(exact.metrics.estimatedRwDb).toBe(55);
    expect(exact.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(exact.unsupportedTargetOutputs).toEqual([]);
    expect(exact.layerCombinationResolverTrace).toMatchObject({
      route: "wall",
      runtimeBasisId: "gate_dv_lsf_exact_rw_calculated_lab_companion_runtime",
      selectedCandidateId: "candidate_lsf_exact_rw_calculated_lab_companions",
      supportBucket: "source_absent_estimate",
      supportedMetrics: ["Rw", "STC", "C", "Ctr"],
      valuePins: [
        { metric: "Rw", value: 55 },
        { metric: "STC", value: 55 },
        { metric: "C", value: -1.5 },
        { metric: "Ctr", value: -6.4 }
      ]
    });

    expect(ambiguous.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      origin: "needs_input",
      route: "wall",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(ambiguous.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      route: "wall",
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });

    expect(registry.summary.candidateCount).toBeGreaterThanOrEqual(25);
    expect(registry.summary.activeRuntimeCandidateCount).toBeGreaterThanOrEqual(22);
    expect(registry.candidateDeclarations.map((candidate) => candidate.id)).toEqual(
      expect.arrayContaining([
        "candidate_broad_accuracy_wall_triple_leaf_local_substitution_rw_family_physics_prediction",
        "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
        "wall.flat_list_adjacent_swap.double_leaf_numeric_guard"
      ])
    );
  });

  it("keeps source-of-truth docs aligned on Gate A closeout and Gate B selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records landed Gate 0`).toContain(GATE_0_ACTION);
      expect(contents, `${relativePath} records landed Gate 0 file`).toContain(GATE_0_FILE);
      expect(contents, `${relativePath} records Gate 0 selection`).toContain(GATE_0_SELECTION_STATUS);
      expect(contents, `${relativePath} records Gate A`).toContain(GATE_A_ACTION);
      expect(contents, `${relativePath} records Gate A file`).toContain(GATE_A_FILE);
      expect(contents, `${relativePath} records Gate A closeout`).toContain(GATE_A_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate B`).toContain(GATE_B_ACTION);
      expect(contents, `${relativePath} records selected Gate B file`).toContain(GATE_B_FILE);
    }

    const plan = readRepoFile("docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md");
    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(plan).toContain("Gate B - Element-Lab Runtime Corridor");
    expect(plan).toContain("Gate A must not");
    expect(plan).toContain("newly calculable outputs");
    expect(plan).toContain("no-runtime");
    expect(plan).toContain("not a broad source crawl");
    expect(plan).toContain("low-confidence wording");
    expect(currentGateRunner).toContain("src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts");
    expect(currentGateRunner).toContain("src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts");
  });
});
