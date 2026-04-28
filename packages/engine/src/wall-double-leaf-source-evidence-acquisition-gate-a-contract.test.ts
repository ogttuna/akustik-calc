import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const KNAUF_SYSTEM_TABLES_URL =
  "https://knauf.com/api/download-center/v1/assets/8b5d23c5-a182-4ac8-81f7-2a6d7c289d12?country=nl&download=true";
const KNAUF_QUIETSTUD_URL =
  "https://knauf.com/api/download-center/v1/assets/844d89d6-948a-408d-9da3-f6f1a238cf45?download=true";
const DAVY_DOUBLE_LEAF_MODEL_URL = "https://pubmed.ncbi.nlm.nih.gov/20136207/";
const STUD_TYPE_SOURCE_URL = "https://www.nature.com/articles/s41598-024-82403-w";

type ImportDecision = "accept" | "bounded" | "reject";
type CandidateFamily =
  | "empty_double_leaf"
  | "porous_double_leaf"
  | "single_stud_lightweight"
  | "double_stud_split_cavity"
  | "formula_reference"
  | "protected_boundary";

type SourceEvidenceCandidate = {
  assemblyLayers: readonly string[];
  assemblyMetadata: {
    cavityDepthMm: string;
    coupling: string;
    densityOrSurfaceMass: string;
    fillType: string;
    mounting: string;
    studSpacingMm: string;
    studType: string;
  };
  blocker: string;
  candidateFamily: CandidateFamily;
  declaredToleranceOrFitThreshold: string;
  id: string;
  importDecision: ImportDecision;
  reportedMetricAndContext: string;
  runtimeMovementAllowedNow: boolean;
  sourceLabel: string;
  sourceLocator: string;
  topologyFit: "direct_family_fit" | "adjacent_context_only" | "negative_boundary";
};

const WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A = {
  landedGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
  previousClosedSlice: "wall_double_leaf_sharp_davy_scoping_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedGateBAction:
    "gate_b_reconcile_bounded_framed_wall_sources_or_close_no_runtime_without_value_movement",
  sliceId: "wall_double_leaf_source_evidence_acquisition_v1",
  status: "no_runtime_source_tolerance_inventory_landed"
} as const;

const SOURCE_EVIDENCE_CANDIDATES: readonly SourceEvidenceCandidate[] = [
  {
    assemblyLayers: ["80 mm AAC D700", "50 mm air gap", "12.5 mm gypsum board"],
    assemblyMetadata: {
      cavityDepthMm: "50",
      coupling: "no stud or rail metadata",
      densityOrSurfaceMass: "local catalog can derive masses, but no source row names this stack",
      fillType: "empty",
      mounting: "generic free layer stack",
      studSpacingMm: "not_applicable",
      studType: "not_applicable"
    },
    blocker: "no direct AAC-gap-board source row, no family benchmark tolerance, and no field/lab transfer rule",
    candidateFamily: "empty_double_leaf",
    declaredToleranceOrFitThreshold: "none",
    id: "empty_double_leaf_aac_gap_gypsum_no_source_row",
    importDecision: "reject",
    reportedMetricAndContext: "current formula-owned runtime only: lab Rw 48, field R'w 46",
    runtimeMovementAllowedNow: false,
    sourceLabel: "local Gate B current-value matrix",
    sourceLocator: "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
    topologyFit: "adjacent_context_only"
  },
  {
    assemblyLayers: ["12.5 mm gypsum board", "50 mm mineral wool", "25 mm air gap", "12.5 mm gypsum board"],
    assemblyMetadata: {
      cavityDepthMm: "25 residual air gap plus 50 mm porous fill",
      coupling: "no stud or rail metadata",
      densityOrSurfaceMass: "local catalog can derive masses, but no source row names this exact no-stud topology",
      fillType: "mineral wool / porous fill",
      mounting: "generic free layer stack",
      studSpacingMm: "not_applicable",
      studType: "not_applicable"
    },
    blocker:
      "Knauf W111/W112 rows support framed mineral-wool trends, but this live case deliberately lacks stud/coupling metadata",
    candidateFamily: "porous_double_leaf",
    declaredToleranceOrFitThreshold: "none for the no-stud generic topology",
    id: "porous_double_leaf_no_stud_metadata_context_only",
    importDecision: "reject",
    reportedMetricAndContext: "current formula-owned runtime only: lab Rw 43, field R'w 41",
    runtimeMovementAllowedNow: false,
    sourceLabel: "local Gate B current-value matrix plus Knauf framed-wall context",
    sourceLocator: KNAUF_SYSTEM_TABLES_URL,
    topologyFit: "adjacent_context_only"
  },
  {
    assemblyLayers: ["12.5 mm gypsum", "40 mm air gap", "60 mm mineral wool", "12.5 mm gypsum"],
    assemblyMetadata: {
      cavityDepthMm: "100 mm partition depth represented locally as 40 mm residual air plus 60 mm fill",
      coupling: "line-connected lightweight steel frame",
      densityOrSurfaceMass: "generic local gypsum/glasswool ids, not exact manufacturer board density",
      fillType: "60 mm mineral wool",
      mounting: "W111-style single frame",
      studSpacingMm: "600",
      studType: "light steel stud"
    },
    blocker:
      "bounded single-stud evidence exists, but Gate A must not retune runtime; Gate B must reconcile exact source-row precedence, lab/field metric choice, and route-card text first",
    candidateFamily: "single_stud_lightweight",
    declaredToleranceOrFitThreshold:
      "local framed benchmark contract pins Rw holdout tolerance 3 dB and field holdout tolerance 3 dB",
    id: "knauf_w111_75_100_60mw_single_stud_bounded",
    importDecision: "bounded",
    reportedMetricAndContext: "Knauf W111 75/100 60 MW: Rw 43 holdout and DnT,A,k 34 proxy field companion",
    runtimeMovementAllowedNow: false,
    sourceLabel: "Knauf Netherlands system tables / local framed-wall benchmark corpus",
    sourceLocator: "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
    topologyFit: "direct_family_fit"
  },
  {
    assemblyLayers: [
      "2 x 12.5 mm gypsum",
      "75 mm air gap",
      "60 mm mineral wool",
      "70 mm air gap",
      "2 x 12.5 mm gypsum"
    ],
    assemblyMetadata: {
      cavityDepthMm: "205 mm total split-cavity depth with 60 mm fill",
      coupling: "independent/double-stud split cavity",
      densityOrSurfaceMass: "generic local gypsum/glasswool ids, not exact manufacturer board density",
      fillType: "60 mm mineral wool",
      mounting: "W115-style independent double frame",
      studSpacingMm: "600",
      studType: "light steel stud"
    },
    blocker:
      "bounded double-stud evidence matches the live topology, but Gate B must prove whether current lab/field values already satisfy the source row before any visible movement",
    candidateFamily: "double_stud_split_cavity",
    declaredToleranceOrFitThreshold:
      "local framed benchmark contract pins Rw holdout tolerance 4 dB and field holdout tolerance 3 dB",
    id: "knauf_w115_2x75_205_60gw_double_stud_bounded",
    importDecision: "bounded",
    reportedMetricAndContext: "Knauf W115 2x75/205 60 GW: Rw 61 holdout and DnT,A,k 52 field holdout",
    runtimeMovementAllowedNow: false,
    sourceLabel: "Knauf Netherlands system tables / local framed-wall benchmark corpus",
    sourceLocator: "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
    topologyFit: "direct_family_fit"
  },
  {
    assemblyLayers: [
      "2 x 12.5 mm gypsum each side",
      "92 mm Quietstud cavity",
      "0/50/75/90 mm mineral wool variants"
    ],
    assemblyMetadata: {
      cavityDepthMm: "92",
      coupling: "resilient proprietary stud path",
      densityOrSurfaceMass: "proprietary system metadata, not the generic live steel-stud lane",
      fillType: "none to high-fill mineral wool variants",
      mounting: "Quietstud/resilient channel family",
      studSpacingMm: "600",
      studType: "resilient stud"
    },
    blocker:
      "useful for fill monotonicity and resilient-stud boundaries, but not a direct source for generic line-connected steel or no-stud double-leaf values",
    candidateFamily: "single_stud_lightweight",
    declaredToleranceOrFitThreshold: "local official-primary benchmark threshold: MAE <= 1.5 dB, max <= 4 dB",
    id: "knauf_quietstud_primary_context_only",
    importDecision: "bounded",
    reportedMetricAndContext: "Knauf Quietstud primary rows: Rw 49, 55, 56, 57 across fill variants",
    runtimeMovementAllowedNow: false,
    sourceLabel: "Knauf Quietstud system PDF / local official-primary benchmark corpus",
    sourceLocator: KNAUF_QUIETSTUD_URL,
    topologyFit: "adjacent_context_only"
  },
  {
    assemblyLayers: ["generic double-leaf cavity walls", "gypsum plasterboard cavity walls", "absorbing cavity material variants"],
    assemblyMetadata: {
      cavityDepthMm: "formula input, not a row-specific import",
      coupling: "model-dependent",
      densityOrSurfaceMass: "formula input, not a local material-id source row",
      fillType: "with and without absorbing material",
      mounting: "model reference, not catalog stack",
      studSpacingMm: "formula-dependent",
      studType: "formula-dependent"
    },
    blocker:
      "relevant formula corridor source, but it is not a direct row for current live stacks and does not by itself authorize a single-number runtime retune",
    candidateFamily: "formula_reference",
    declaredToleranceOrFitThreshold:
      "published abstract reports mean difference about -0.6 dB and standard deviation about 3.1 dB for model comparisons",
    id: "davy_double_leaf_formula_corridor_reference",
    importDecision: "bounded",
    reportedMetricAndContext: "double-leaf model comparison reference, not a catalog Rw/DnT row",
    runtimeMovementAllowedNow: false,
    sourceLabel: "Davy 2010 JASA double-leaf cavity wall model abstract",
    sourceLocator: DAVY_DOUBLE_LEAF_MODEL_URL,
    topologyFit: "adjacent_context_only"
  },
  {
    assemblyLayers: ["lightweight double-leaf walls with wood, steel, and acoustic stud variants"],
    assemblyMetadata: {
      cavityDepthMm: "study-dependent",
      coupling: "stud sound-bridge path differs by stud type",
      densityOrSurfaceMass: "study-dependent",
      fillType: "study-dependent",
      mounting: "stud-type comparison",
      studSpacingMm: "study-dependent",
      studType: "wood, steel, acoustic"
    },
    blocker:
      "supports keeping studType/coupling explicit, not collapsing all cavity walls into one double-leaf runtime lane",
    candidateFamily: "formula_reference",
    declaredToleranceOrFitThreshold: "none imported into local runtime",
    id: "stud_type_sound_bridge_boundary_reference",
    importDecision: "bounded",
    reportedMetricAndContext: "stud-type sensitivity reference, not a direct local source row",
    runtimeMovementAllowedNow: false,
    sourceLabel: "Scientific Reports 2024 lightweight double-leaf wall stud-type study",
    sourceLocator: STUD_TYPE_SOURCE_URL,
    topologyFit: "adjacent_context_only"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES: readonly SourceEvidenceCandidate[] = [
  {
    assemblyLayers: ["exact catalog/lab-fallback walls", "resilient side-count walls"],
    assemblyMetadata: {
      cavityDepthMm: "source-row owned",
      coupling: "source-row owned",
      densityOrSurfaceMass: "source-row owned",
      fillType: "source-row owned",
      mounting: "source-row owned",
      studSpacingMm: "source-row owned",
      studType: "source-row owned"
    },
    blocker: "verified exact/lab-fallback rows must keep precedence over generic formula imports",
    candidateFamily: "protected_boundary",
    declaredToleranceOrFitThreshold: "source-row exactness or prior contract tolerance",
    id: "exact_catalog_and_resilient_side_count_rows_protected",
    importDecision: "reject",
    reportedMetricAndContext: "not part of the double-leaf evidence import lane",
    runtimeMovementAllowedNow: false,
    sourceLabel: "existing exact catalog and resilient-side-count contracts",
    sourceLocator: "packages/engine/src/airborne-verified-catalog.test.ts",
    topologyFit: "negative_boundary"
  },
  {
    assemblyLayers: ["timber exact/formula rows", "single-leaf mass-law rows", "lined-massive/heavy-core/CLT rows"],
    assemblyMetadata: {
      cavityDepthMm: "different family owner",
      coupling: "different family owner",
      densityOrSurfaceMass: "different family owner",
      fillType: "different family owner",
      mounting: "different family owner",
      studSpacingMm: "different family owner",
      studType: "different family owner"
    },
    blocker: "adjacent wall-family rows cannot be borrowed as double-leaf or stud-cavity truth",
    candidateFamily: "protected_boundary",
    declaredToleranceOrFitThreshold: "owned by their prior contracts, not this slice",
    id: "adjacent_wall_family_rows_protected",
    importDecision: "reject",
    reportedMetricAndContext: "not part of the double-leaf evidence import lane",
    runtimeMovementAllowedNow: false,
    sourceLabel: "single-leaf, timber, heavy-core, and CLT wall contracts",
    sourceLocator: "docs/calculator/CURRENT_STATE.md",
    topologyFit: "negative_boundary"
  },
  {
    assemblyLayers: ["direct-coupled leaves", "triple-leaf / multi-cavity shapes"],
    assemblyMetadata: {
      cavityDepthMm: "multiple or absent cavities",
      coupling: "not decoupled two-leaf",
      densityOrSurfaceMass: "not applicable to selected direct family",
      fillType: "varies",
      mounting: "not applicable to selected direct family",
      studSpacingMm: "not applicable",
      studType: "not applicable"
    },
    blocker:
      "direct-coupled and triple-leaf boundary shapes must not be normalized into decoupled double-leaf imports",
    candidateFamily: "protected_boundary",
    declaredToleranceOrFitThreshold: "none",
    id: "direct_coupled_and_triple_leaf_shapes_protected",
    importDecision: "reject",
    reportedMetricAndContext: "negative boundary from prior scoping slice",
    runtimeMovementAllowedNow: false,
    sourceLabel: "wall double-leaf Sharp/Davy Gate A/B negative boundaries",
    sourceLocator: "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
    topologyFit: "negative_boundary"
  }
] as const;

const GATE_B_DECISION = {
  gateBMustChangeRuntime: false,
  allowedGateBBranches: [
    "reconcile_bounded_knauf_w111_w112_w115_w119_rows_against_current_lab_field_outputs",
    "close_no_runtime_if_bounded_rows_already_match_or_do_not_map_cleanly",
    "open_a_later_runtime_slice_only_with_paired_engine_value_and_web_route_card_tests"
  ],
  disallowedGateBMoves: [
    "retune_empty_aac_gap_gypsum_double_leaf_from_adjacent_framed_rows",
    "retune_no_stud_porous_double_leaf_from_framed_knauf_rows",
    "collapse_resilient_quietstud_or_stud_type_specific_sources_into_generic_stud_wall",
    "borrow_single_leaf_lined_massive_clt_floor_or_direct_coupled_rows",
    "change_confidence_evidence_tier_output_support_or_route_card_text_without_a_runtime_contract"
  ]
} as const;

function assertCandidateIsComplete(candidate: SourceEvidenceCandidate) {
  expect(candidate.id).toMatch(/^[a-z0-9_]+$/);
  expect(candidate.sourceLabel.length, candidate.id).toBeGreaterThan(0);
  expect(candidate.sourceLocator.length, candidate.id).toBeGreaterThan(0);
  expect(candidate.assemblyLayers.length, candidate.id).toBeGreaterThan(0);
  expect(candidate.reportedMetricAndContext.length, candidate.id).toBeGreaterThan(0);
  expect(candidate.declaredToleranceOrFitThreshold.length, candidate.id).toBeGreaterThan(0);
  expect(candidate.blocker, candidate.id).toMatch(/source|row|tolerance|runtime|generic|boundary|topology|formula|Gate B/i);

  for (const value of Object.values(candidate.assemblyMetadata)) {
    expect(value.length, candidate.id).toBeGreaterThan(0);
  }
}

describe("wall double-leaf source evidence acquisition Gate A contract", () => {
  it("records Gate A as a no-runtime source/tolerance inventory", () => {
    expect(WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A).toEqual({
      landedGate: "gate_a_double_leaf_stud_cavity_source_tolerance_inventory",
      previousClosedSlice: "wall_double_leaf_sharp_davy_scoping_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedGateBAction:
        "gate_b_reconcile_bounded_framed_wall_sources_or_close_no_runtime_without_value_movement",
      sliceId: "wall_double_leaf_source_evidence_acquisition_v1",
      status: "no_runtime_source_tolerance_inventory_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "packages/engine/src/airborne-verified-catalog.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every source candidate complete enough for a later import decision", () => {
    expect(SOURCE_EVIDENCE_CANDIDATES).toHaveLength(7);

    for (const candidate of SOURCE_EVIDENCE_CANDIDATES) {
      assertCandidateIsComplete(candidate);
      expect(["accept", "bounded", "reject"]).toContain(candidate.importDecision);
      expect(candidate.runtimeMovementAllowedNow, candidate.id).toBe(false);
    }
  });

  it("finds bounded framed-wall evidence but no immediate runtime import", () => {
    const boundedCandidates = SOURCE_EVIDENCE_CANDIDATES.filter((candidate) => candidate.importDecision === "bounded");

    expect(boundedCandidates.map((candidate) => candidate.id)).toEqual([
      "knauf_w111_75_100_60mw_single_stud_bounded",
      "knauf_w115_2x75_205_60gw_double_stud_bounded",
      "knauf_quietstud_primary_context_only",
      "davy_double_leaf_formula_corridor_reference",
      "stud_type_sound_bridge_boundary_reference"
    ]);
    expect(boundedCandidates.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(
      boundedCandidates.filter((candidate) => candidate.topologyFit === "direct_family_fit").map((candidate) => candidate.id)
    ).toEqual(["knauf_w111_75_100_60mw_single_stud_bounded", "knauf_w115_2x75_205_60gw_double_stud_bounded"]);
    expect(SOURCE_EVIDENCE_CANDIDATES.filter((candidate) => candidate.importDecision === "accept")).toEqual([]);
  });

  it("rejects generic no-stud double-leaf movement from adjacent framed evidence", () => {
    const rejectedPositiveRows = SOURCE_EVIDENCE_CANDIDATES.filter(
      (candidate) => candidate.importDecision === "reject" && candidate.candidateFamily !== "protected_boundary"
    );

    expect(rejectedPositiveRows.map((candidate) => candidate.id)).toEqual([
      "empty_double_leaf_aac_gap_gypsum_no_source_row",
      "porous_double_leaf_no_stud_metadata_context_only"
    ]);
    expect(rejectedPositiveRows.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(rejectedPositiveRows.every((candidate) => candidate.topologyFit === "adjacent_context_only")).toBe(true);
  });

  it("keeps adjacent exact, single-leaf, timber, CLT, direct-coupled, and triple-leaf boundaries protected", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(3);

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      assertCandidateIsComplete(boundary);
      expect(boundary.candidateFamily).toBe("protected_boundary");
      expect(boundary.importDecision).toBe("reject");
      expect(boundary.runtimeMovementAllowedNow).toBe(false);
      expect(boundary.topologyFit).toBe("negative_boundary");
    }
  });

  it("selects a bounded Gate B reconciliation branch without requiring runtime movement", () => {
    expect(GATE_B_DECISION).toEqual({
      gateBMustChangeRuntime: false,
      allowedGateBBranches: [
        "reconcile_bounded_knauf_w111_w112_w115_w119_rows_against_current_lab_field_outputs",
        "close_no_runtime_if_bounded_rows_already_match_or_do_not_map_cleanly",
        "open_a_later_runtime_slice_only_with_paired_engine_value_and_web_route_card_tests"
      ],
      disallowedGateBMoves: [
        "retune_empty_aac_gap_gypsum_double_leaf_from_adjacent_framed_rows",
        "retune_no_stud_porous_double_leaf_from_framed_knauf_rows",
        "collapse_resilient_quietstud_or_stud_type_specific_sources_into_generic_stud_wall",
        "borrow_single_leaf_lined_massive_clt_floor_or_direct_coupled_rows",
        "change_confidence_evidence_tier_output_support_or_route_card_text_without_a_runtime_contract"
      ]
    });
  });
});
