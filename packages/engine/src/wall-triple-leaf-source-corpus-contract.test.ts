import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS,
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_GATE_E,
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS
} from "./wall-triple-leaf-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_E_HANDOFF.md"
] as const;

describe("wall triple-leaf source corpus Gate E", () => {
  it("lands classifier and negative boundaries without moving runtime or visible calculator behavior", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CORPUS_GATE_E).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_f_frequency_band_solver_skeleton",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("classifies each Gate D source into exactly one non-runtime corpus lane", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS.map((entry) => `${entry.corpusLane}:${entry.sourceId}`)).toEqual([
      "triple_leaf_calibration_candidate:nrc_2024_internal_gypsum_double_stud",
      "baseline_negative_boundary:nrc_1998_gypsum_board_walls_tl_data",
      "qualitative_blocked:uris_2006_internal_gypsum_double_frame",
      "solver_model_context:ballagh_2013_triple_panel_low_frequency_model",
      "adjacent_negative_boundary:warnock_1998_concrete_block_attached_drywall"
    ]);

    expect(WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS.every((entry) => entry.directRuntimeReadyNow === false)).toBe(true);
    expect(WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS.every((entry) => entry.exactEvidenceEligible === false)).toBe(true);
  });

  it("allows only true internal-leaf two-cavity evidence into the calibration intake lane", () => {
    const calibrationCandidates = WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS.filter(
      (entry) => entry.calibrationLaneEligible
    );

    expect(calibrationCandidates.map((entry) => entry.sourceId)).toEqual(["nrc_2024_internal_gypsum_double_stud"]);
    expect(calibrationCandidates[0]).toMatchObject({
      exactEvidenceEligible: false,
      reasonCode: "true_internal_leaf_two_cavity_graph_digitization_needed"
    });
    expect(calibrationCandidates[0].requiredBeforeCalibration).toEqual([
      "digitized_one_third_octave_transmission_loss_curve_owner",
      "internal_leaf_coupling_mapping",
      "local_material_mapping",
      "calibration_holdout_tolerance_owner",
      "paired_engine_and_web_visible_tests"
    ]);
  });

  it("keeps parser-ready baseline rows, abstract evidence, solver equations, and masonry guidance out of exact triple-leaf evidence", () => {
    const byId = new Map(WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS.map((entry) => [entry.sourceId, entry]));

    expect(byId.get("nrc_1998_gypsum_board_walls_tl_data")).toMatchObject({
      corpusLane: "baseline_negative_boundary",
      reasonCode: "ordinary_wall_baseline_without_internal_leaf"
    });
    expect(byId.get("nrc_1998_gypsum_board_walls_tl_data")?.negativeBoundaryTags).toContain("without_internal_leaf");

    expect(byId.get("uris_2006_internal_gypsum_double_frame")).toMatchObject({
      corpusLane: "qualitative_blocked",
      reasonCode: "internal_leaf_paper_missing_full_curves"
    });
    expect(byId.get("ballagh_2013_triple_panel_low_frequency_model")).toMatchObject({
      corpusLane: "solver_model_context",
      reasonCode: "solver_equations_without_measured_row"
    });
    expect(byId.get("warnock_1998_concrete_block_attached_drywall")).toMatchObject({
      corpusLane: "adjacent_negative_boundary",
      reasonCode: "lined_masonry_adjacent_boundary_only"
    });
  });

  it("protects the required negative families before any solver work", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS.map((entry) => entry.reasonCode)).toEqual([
      "ordinary_double_leaf_exact_row_not_triple_leaf",
      "simple_stud_wall_without_internal_leaf",
      "one_side_lining_or_lined_masonry_not_triple_leaf",
      "missing_band_curves_or_exact_topology",
      "floor_or_impact_row_not_wall_airborne",
      "field_only_without_lab_element_curve"
    ]);

    for (const entry of WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS) {
      expect(entry.corpusLane).toBe("rejection_only");
      expect(entry.calibrationLaneEligible).toBe(false);
      expect(entry.exactEvidenceEligible).toBe(false);
      expect(entry.protectedFromExactEvidenceReason.length).toBeGreaterThan(80);
    }
  });

  it("keeps active docs aligned with Gate E and the selected Gate F solver skeleton", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CORPUS_GATE_E.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CORPUS_GATE_E.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate E - Source-Corpus Classifier and Negative Boundaries");
    expect(plan).toContain("Gate F - Frequency-Band Solver Skeleton");
    expect(plan).toContain("ordinary double-leaf exact rows");
    expect(plan).toContain("field-only rows that lack lab element curve ownership");
  });
});
