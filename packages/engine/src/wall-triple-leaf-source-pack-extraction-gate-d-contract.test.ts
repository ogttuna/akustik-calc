import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ,
  WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES,
  WALL_TRIPLE_LEAF_SOURCE_PACK_GATE_D
} from "./wall-triple-leaf-source-pack";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_D_HANDOFF.md"
] as const;

describe("wall triple-leaf source-pack extraction Gate D", () => {
  it("lands source extraction without changing runtime or visible calculator behavior", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_PACK_GATE_D).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_e_source_corpus_classifier_and_negative_boundaries",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("keeps every extracted source candidate blocked from direct runtime promotion", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.map((candidate) => `${candidate.priority}:${candidate.id}`)).toEqual([
      "P0:nrc_2024_internal_gypsum_double_stud",
      "P0:nrc_1998_gypsum_board_walls_tl_data",
      "P1:uris_2006_internal_gypsum_double_frame",
      "P1:ballagh_2013_triple_panel_low_frequency_model",
      "P2:warnock_1998_concrete_block_attached_drywall"
    ]);

    for (const candidate of WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES) {
      expect(candidate.directRuntimeReadyNow, `${candidate.id} cannot be runtime-ready in Gate D`).toBe(false);
      expect(candidate.firstMissingBlocker.length, `${candidate.id} needs a blocker`).toBeGreaterThan(40);
      expect(candidate.locator.length, `${candidate.id} needs a page/table/figure locator`).toBeGreaterThan(20);
      expect(candidate.pairedEngineTestsBeforeRuntime.length, `${candidate.id} needs future engine test ownership`).toBeGreaterThanOrEqual(2);
      expect(
        candidate.pairedWebTestsBeforeVisibleMovement.length,
        `${candidate.id} needs future web visible-test ownership`
      ).toBeGreaterThanOrEqual(2);
      expect(candidate.protectedBoundary.length, `${candidate.id} needs a protected negative boundary`).toBeGreaterThan(50);
    }
  });

  it("extracts the two P0 sources into different lanes instead of mixing baseline rows with triple-leaf rows", () => {
    const nrc2024 = WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.find(
      (candidate) => candidate.id === "nrc_2024_internal_gypsum_double_stud"
    );
    const nrc1998 = WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.find(
      (candidate) => candidate.id === "nrc_1998_gypsum_board_walls_tl_data"
    );

    expect(nrc2024).toMatchObject({
      bandDataStatus: "plotted_curve_requires_digitization",
      classification: "graph_digitization_candidate",
      hasNumericBandCurve: false,
      metricOwner: "lab_stc_with_plotted_transmission_loss"
    });
    expect(nrc2024?.topology.internalLeaf).toContain("12.7 mm Type C gypsum board");
    expect(nrc2024?.reportedMetrics).toContain("Assembly B STC 60");
    expect(nrc2024?.reportedMetrics).toContain("Assembly C STC 57");

    expect(nrc1998).toMatchObject({
      bandDataStatus: "numeric_one_third_octave_rows_extracted",
      classification: "baseline_corpus_and_negative_boundary_candidate",
      hasNumericBandCurve: true,
      metricOwner: "lab_stc_with_numeric_one_third_octave_transmission_loss"
    });
    expect(nrc1998?.topology.internalLeaf).toBe("none");
    expect(nrc1998?.firstMissingBlocker).toContain("without_internal_leaf");
  });

  it("pins representative NRC 1998 parser-ready band rows for later classifier and parser work", () => {
    const nrc1998 = WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.find(
      (candidate) => candidate.id === "nrc_1998_gypsum_board_walls_tl_data"
    );
    const rows = nrc1998?.representativeBandRows ?? [];

    expect(rows.map((row) => row.testId)).toEqual(["TL-93-176", "TL-93-185"]);
    expect(rows.map((row) => row.stc)).toEqual([32, 45]);

    for (const row of rows) {
      expect(row.bandGridHz).toEqual(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ);
      expect(row.tlDb).toHaveLength(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ.length);
      expect(row.tlDb.every((value) => Number.isFinite(value))).toBe(true);
    }
  });

  it("keeps abstract-only, solver-only, and adjacent masonry sources out of exact triple-leaf evidence", () => {
    const byId = new Map(WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.map((candidate) => [candidate.id, candidate]));

    expect(byId.get("uris_2006_internal_gypsum_double_frame")).toMatchObject({
      bandDataStatus: "abstract_or_metadata_only",
      classification: "qualitative_only",
      directRuntimeReadyNow: false
    });
    expect(byId.get("uris_2006_internal_gypsum_double_frame")?.firstMissingBlocker).toContain("full_numeric_curves");

    expect(byId.get("ballagh_2013_triple_panel_low_frequency_model")).toMatchObject({
      bandDataStatus: "model_equations_only",
      classification: "solver_model_only",
      metricOwner: "solver_model_no_measured_metric"
    });

    expect(byId.get("warnock_1998_concrete_block_attached_drywall")).toMatchObject({
      bandDataStatus: "guidance_figures_only",
      classification: "adjacent_negative_boundary",
      metricOwner: "stc_guidance_and_resonance_context_only"
    });
    expect(byId.get("warnock_1998_concrete_block_attached_drywall")?.topology.supportTopology).toContain("masonry");
  });

  it("keeps active docs aligned with Gate D and the selected Gate E classifier", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_PACK_GATE_D.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_PACK_GATE_D.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate D - Source-Pack Extraction and Calibration Corpus");
    expect(plan).toContain("Gate E - Source-Corpus Classifier and Negative Boundaries");
    expect(plan).toContain("directRuntimeReadyNow: false");
  });
});
