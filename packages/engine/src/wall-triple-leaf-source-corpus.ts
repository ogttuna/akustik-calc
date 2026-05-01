import type {
  WallTripleLeafSourcePackCandidate,
  WallTripleLeafSourcePackClassification
} from "./wall-triple-leaf-source-pack";
import { WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES } from "./wall-triple-leaf-source-pack";

export type WallTripleLeafSourceCorpusLane =
  | "triple_leaf_calibration_candidate"
  | "baseline_negative_boundary"
  | "qualitative_blocked"
  | "solver_model_context"
  | "adjacent_negative_boundary"
  | "rejection_only";

export type WallTripleLeafSourceCorpusReasonCode =
  | "true_internal_leaf_two_cavity_graph_digitization_needed"
  | "ordinary_wall_baseline_without_internal_leaf"
  | "internal_leaf_paper_missing_full_curves"
  | "solver_equations_without_measured_row"
  | "lined_masonry_adjacent_boundary_only"
  | "ordinary_double_leaf_exact_row_not_triple_leaf"
  | "simple_stud_wall_without_internal_leaf"
  | "one_side_lining_or_lined_masonry_not_triple_leaf"
  | "missing_band_curves_or_exact_topology"
  | "floor_or_impact_row_not_wall_airborne"
  | "field_only_without_lab_element_curve";

export type WallTripleLeafSourceCorpusClassification = {
  calibrationLaneEligible: boolean;
  corpusLane: WallTripleLeafSourceCorpusLane;
  directRuntimeReadyNow: false;
  exactEvidenceEligible: boolean;
  negativeBoundaryTags: readonly string[];
  protectedFromExactEvidenceReason: string;
  reasonCode: WallTripleLeafSourceCorpusReasonCode;
  requiredBeforeCalibration: readonly string[];
  sourceId: string;
  sourcePackClassification?: WallTripleLeafSourcePackClassification;
};

export type WallTripleLeafNegativeFixture = {
  fixtureKind:
    | "ordinary_double_leaf_exact_row"
    | "simple_stud_wall"
    | "one_side_lining_or_lined_masonry"
    | "missing_band_curves_or_exact_topology"
    | "floor_or_impact_row"
    | "field_only_row";
  id: string;
};

const REQUIRED_GRAPH_DIGITIZATION_BEFORE_CALIBRATION = [
  "digitized_one_third_octave_transmission_loss_curve_owner",
  "internal_leaf_coupling_mapping",
  "local_material_mapping",
  "calibration_holdout_tolerance_owner",
  "paired_engine_and_web_visible_tests"
] as const;

function hasTrueInternalLeafTwoCavityTopology(candidate: WallTripleLeafSourcePackCandidate): boolean {
  const { topology } = candidate;

  return (
    topology.internalLeaf !== "none" &&
    !topology.internalLeaf.includes("not_a_triple_leaf_source_row") &&
    !topology.cavity1.includes("not_a_triple_leaf_source_row") &&
    !topology.cavity2.includes("not_a_triple_leaf_source_row")
  );
}

export function classifyWallTripleLeafSourceCandidate(
  candidate: WallTripleLeafSourcePackCandidate
): WallTripleLeafSourceCorpusClassification {
  if (candidate.classification === "graph_digitization_candidate" && hasTrueInternalLeafTwoCavityTopology(candidate)) {
    return {
      calibrationLaneEligible: true,
      corpusLane: "triple_leaf_calibration_candidate",
      directRuntimeReadyNow: false,
      exactEvidenceEligible: false,
      negativeBoundaryTags: ["not_exact_until_curve_digitization", "not_runtime_until_holdout_tolerance"],
      protectedFromExactEvidenceReason:
        "The source has the right internal-leaf/two-cavity topology, but plotted TL curves and local coupling/material mapping are not exact evidence.",
      reasonCode: "true_internal_leaf_two_cavity_graph_digitization_needed",
      requiredBeforeCalibration: REQUIRED_GRAPH_DIGITIZATION_BEFORE_CALIBRATION,
      sourceId: candidate.id,
      sourcePackClassification: candidate.classification
    };
  }

  if (candidate.classification === "baseline_corpus_and_negative_boundary_candidate") {
    return {
      calibrationLaneEligible: false,
      corpusLane: "baseline_negative_boundary",
      directRuntimeReadyNow: false,
      exactEvidenceEligible: false,
      negativeBoundaryTags: ["ordinary_wall_baseline", "without_internal_leaf", "parser_ready_but_not_triple_leaf"],
      protectedFromExactEvidenceReason:
        "Parser-ready gypsum-board TL rows are useful baseline/negative data, but the representative rows do not contain an internal leaf.",
      reasonCode: "ordinary_wall_baseline_without_internal_leaf",
      requiredBeforeCalibration: ["classifier_must_find_internal_leaf_and_two_cavities_before_solver_use"],
      sourceId: candidate.id,
      sourcePackClassification: candidate.classification
    };
  }

  if (candidate.classification === "qualitative_only") {
    return {
      calibrationLaneEligible: false,
      corpusLane: "qualitative_blocked",
      directRuntimeReadyNow: false,
      exactEvidenceEligible: false,
      negativeBoundaryTags: ["abstract_only", "missing_numeric_curves", "missing_exact_specimen_topology"],
      protectedFromExactEvidenceReason:
        "The source is directionally relevant, but abstract-level weighted-index deltas cannot become exact or bounded calibration evidence.",
      reasonCode: "internal_leaf_paper_missing_full_curves",
      requiredBeforeCalibration: ["full_paper_topology", "numeric_band_curves", "metric_owner", "material_mapping"],
      sourceId: candidate.id,
      sourcePackClassification: candidate.classification
    };
  }

  if (candidate.classification === "solver_model_only") {
    return {
      calibrationLaneEligible: false,
      corpusLane: "solver_model_context",
      directRuntimeReadyNow: false,
      exactEvidenceEligible: false,
      negativeBoundaryTags: ["equations_only", "no_measured_metric", "no_source_row"],
      protectedFromExactEvidenceReason:
        "Solver equations may shape Gate F, but they cannot own an Rw value without measured row calibration and holdouts.",
      reasonCode: "solver_equations_without_measured_row",
      requiredBeforeCalibration: ["measured_source_rows", "damping_coupling_calibration", "holdout_tolerance"],
      sourceId: candidate.id,
      sourcePackClassification: candidate.classification
    };
  }

  return {
    calibrationLaneEligible: false,
    corpusLane: "adjacent_negative_boundary",
    directRuntimeReadyNow: false,
    exactEvidenceEligible: false,
    negativeBoundaryTags: ["lined_masonry", "attached_drywall", "not_steel_stud_internal_leaf"],
    protectedFromExactEvidenceReason:
      "Masonry attached-drywall resonance guidance protects lined-masonry boundaries but cannot calibrate steel-stud triple-leaf runtime.",
    reasonCode: "lined_masonry_adjacent_boundary_only",
    requiredBeforeCalibration: ["none_adjacent_boundary_only"],
    sourceId: candidate.id,
    sourcePackClassification: candidate.classification
  };
}

export function classifyWallTripleLeafNegativeFixture(
  fixture: WallTripleLeafNegativeFixture
): WallTripleLeafSourceCorpusClassification {
  const common = {
    calibrationLaneEligible: false,
    corpusLane: "rejection_only" as const,
    directRuntimeReadyNow: false as const,
    exactEvidenceEligible: false,
    requiredBeforeCalibration: ["not_a_triple_leaf_wall_source_row"] as const,
    sourceId: fixture.id
  };

  switch (fixture.fixtureKind) {
    case "ordinary_double_leaf_exact_row":
      return {
        ...common,
        negativeBoundaryTags: ["ordinary_double_leaf", "exact_row_but_wrong_family"],
        protectedFromExactEvidenceReason:
          "A high-quality ordinary double-leaf exact row must stay in its own family and cannot stand in for internal-leaf triple-leaf behavior.",
        reasonCode: "ordinary_double_leaf_exact_row_not_triple_leaf"
      };
    case "simple_stud_wall":
      return {
        ...common,
        negativeBoundaryTags: ["simple_stud", "without_internal_leaf"],
        protectedFromExactEvidenceReason:
          "A simple stud wall lacks the internal leaf and second cavity needed for the triple-leaf solver lane.",
        reasonCode: "simple_stud_wall_without_internal_leaf"
      };
    case "one_side_lining_or_lined_masonry":
      return {
        ...common,
        negativeBoundaryTags: ["one_side_lining", "lined_masonry"],
        protectedFromExactEvidenceReason:
          "One-side lining and lined masonry can have mass-air-mass effects, but they are not the same source topology as steel-stud internal-board triple leaf.",
        reasonCode: "one_side_lining_or_lined_masonry_not_triple_leaf"
      };
    case "missing_band_curves_or_exact_topology":
      return {
        ...common,
        negativeBoundaryTags: ["missing_band_curves", "missing_exact_topology"],
        protectedFromExactEvidenceReason:
          "Rows without both usable band curves and exact topology cannot become exact evidence or bounded calibration rows.",
        reasonCode: "missing_band_curves_or_exact_topology"
      };
    case "floor_or_impact_row":
      return {
        ...common,
        negativeBoundaryTags: ["floor", "impact_or_floor_ceiling_metric"],
        protectedFromExactEvidenceReason:
          "Floor and impact rows are different assemblies and metric owners; they must not enter a wall airborne triple-leaf corpus.",
        reasonCode: "floor_or_impact_row_not_wall_airborne"
      };
    case "field_only_row":
      return {
        ...common,
        negativeBoundaryTags: ["field_only", "missing_lab_element_curve"],
        protectedFromExactEvidenceReason:
          "Field-only R'w or DnT,w rows cannot replace a lab element curve owner for source-calibrated wall prediction.",
        reasonCode: "field_only_without_lab_element_curve"
      };
  }
}

export const WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS = WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.map(
  classifyWallTripleLeafSourceCandidate
);

export const WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_FIXTURES: readonly WallTripleLeafNegativeFixture[] = [
  { fixtureKind: "ordinary_double_leaf_exact_row", id: "negative_ordinary_double_leaf_exact_row" },
  { fixtureKind: "simple_stud_wall", id: "negative_simple_stud_without_internal_leaf" },
  { fixtureKind: "one_side_lining_or_lined_masonry", id: "negative_lined_masonry_or_one_side_lining" },
  { fixtureKind: "missing_band_curves_or_exact_topology", id: "negative_missing_band_curves_or_exact_topology" },
  { fixtureKind: "floor_or_impact_row", id: "negative_floor_or_impact_row" },
  { fixtureKind: "field_only_row", id: "negative_field_only_without_lab_curve" }
] as const;

export const WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS =
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_FIXTURES.map(classifyWallTripleLeafNegativeFixture);

export const WALL_TRIPLE_LEAF_SOURCE_CORPUS_GATE_E = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_e_source_corpus_classifier_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_f_frequency_band_solver_skeleton",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-frequency-solver.test.ts",
  selectionStatus:
    "gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;
