import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const NRC_TRIPLE_LEAF_2024_URL =
  "https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2";
const NRC_GYPSUM_WALL_TL_DATA_URL =
  "https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f";
const URIS_2006_INTERNAL_GYPSUM_DOUBLE_FRAME_URL =
  "https://www.sciencedirect.com/science/article/pii/S0003682X05001799";
const NRC_WARNOCK_CONCRETE_BLOCK_DRYWALL_URL =
  "https://nrc-publications.canada.ca/eng/view/object/?id=8fe95aff-adf1-4a91-bc2e-f150870a5aee";
const BALLAGH_TRIPLE_PANEL_MODEL_URL =
  "https://new.acoustics.org.nz/wp-content/uploads/Ballagh_K_NZA2013.pdf";
const ISO_10140_2_URL =
  "https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc";
const ISO_717_1_URL = "https://www.iso.org/standard/77435.html";
const ISO_12354_1_URL = "https://www.iso.org/standard/70242.html";

const WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C = {
  apiShapeChange: false,
  confidencePromotion: false,
  currentMultileafBlendPromoted: false,
  evidencePromotion: false,
  landedGate: "gate_c_research_plan_and_numeric_hold",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_d_source_pack_extraction_and_calibration_corpus",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  selectionStatus:
    "gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const GATE_C_RESEARCH_EVIDENCE = [
  {
    blockedRuntimeReason:
      "The paper proves the low-frequency triple-leaf failure mode and magnitude, but it is not a local source row for the user's exact material stack.",
    id: "nrc_2024_internal_gypsum_double_stud",
    role: "physics_and_negative_boundary",
    sourceType: "measured_triple_leaf_paper",
    sourceUrl: NRC_TRIPLE_LEAF_2024_URL,
    usableNowFor: "directional physics, low-frequency dip magnitude, source-pack target shape"
  },
  {
    blockedRuntimeReason:
      "The report is parser-ready measured wall data, but it mainly provides ordinary gypsum-board wall rows; triple-leaf runtime use still needs exact row classification and negative-boundary mapping.",
    id: "nrc_1998_gypsum_board_walls_tl_data",
    role: "baseline_corpus_and_negative_boundary_candidate",
    sourceType: "measured_wall_data_report",
    sourceUrl: NRC_GYPSUM_WALL_TL_DATA_URL,
    usableNowFor: "future row extraction with construction details, material properties, STC, and one-third-octave TL curves"
  },
  {
    blockedRuntimeReason:
      "The paper reports measured double-frame partitions with an internal gypsum board layer and weighted-index decreases, but full numeric import requires accessible curves and exact construction mapping.",
    id: "uris_2006_internal_gypsum_double_frame",
    role: "triple_leaf_measured_row_candidate",
    sourceType: "measured_triple_leaf_paper",
    sourceUrl: URIS_2006_INTERNAL_GYPSUM_DOUBLE_FRAME_URL,
    usableNowFor: "Gate D source extraction target; abstract-level evidence cannot become runtime truth"
  },
  {
    blockedRuntimeReason:
      "The NRC construction update shows attached drywall on masonry can create detrimental mass-air-mass behavior; it is adjacent negative-boundary evidence, not a steel-stud internal-board row.",
    id: "warnock_1998_concrete_block_attached_drywall",
    role: "adjacent_lined_masonry_negative_boundary",
    sourceType: "measured_and_guidance_wall_report",
    sourceUrl: NRC_WARNOCK_CONCRETE_BLOCK_DRYWALL_URL,
    usableNowFor: "protect lined masonry and one-side lining paths from leaking into the triple-leaf solver lane"
  },
  {
    blockedRuntimeReason:
      "The low-frequency model needs local damping/coupling calibration and must be blended with mid/high-frequency behavior before it can own Rw.",
    id: "ballagh_2013_triple_panel_low_frequency_model",
    role: "solver_model_candidate",
    sourceType: "published_model_paper",
    sourceUrl: BALLAGH_TRIPLE_PANEL_MODEL_URL,
    usableNowFor: "three-mass two-spring low-frequency solver design"
  },
  {
    blockedRuntimeReason:
      "It defines the lab measurement boundary; it does not provide a prediction row or a field result by itself.",
    id: "iso_10140_2_lab_airborne_measurement",
    role: "metric_boundary",
    sourceType: "official_standard_locator",
    sourceUrl: ISO_10140_2_URL,
    usableNowFor: "lab R curve provenance and lab/field separation"
  },
  {
    blockedRuntimeReason:
      "It defines single-number rating from band data; without a validated curve it cannot legitimize a hand-tuned Rw.",
    id: "iso_717_1_airborne_rating",
    role: "rating_boundary",
    sourceType: "official_standard_locator",
    sourceUrl: ISO_717_1_URL,
    usableNowFor: "Rw and spectrum-term derivation from frequency bands"
  },
  {
    blockedRuntimeReason:
      "It governs building prediction from element data; it cannot replace the missing source-calibrated triple-leaf element curve.",
    id: "iso_12354_1_building_airborne_prediction",
    role: "field_overlay_boundary",
    sourceType: "official_standard_locator",
    sourceUrl: ISO_12354_1_URL,
    usableNowFor: "future R'w and DnT,w overlay policy after lab curve ownership"
  }
] as const;

const GATE_D_EXTRACTION_PRIORITY = [
  {
    directRuntimeReadyNow: false,
    id: "nrc_2024_internal_gypsum_double_stud",
    priority: "P0",
    requiredGateDClassification: "graph_digitization_or_bounded_calibration_candidate",
    requiredGateDBlocker:
      "extract wall assembly short codes, STC values, resonance estimates, and determine whether graph-digitized TL curves are accurate enough for calibration"
  },
  {
    directRuntimeReadyNow: false,
    id: "nrc_1998_gypsum_board_walls_tl_data",
    priority: "P0",
    requiredGateDClassification: "baseline_corpus_and_negative_boundary_candidate",
    requiredGateDBlocker:
      "extract parser-ready TL rows, material densities, framing, insulation, and double-stud negatives before using any row for triple-leaf calibration"
  },
  {
    directRuntimeReadyNow: false,
    id: "uris_2006_internal_gypsum_double_frame",
    priority: "P1",
    requiredGateDClassification: "exact_or_bounded_candidate_only_if_full_curves_are_available",
    requiredGateDBlocker:
      "abstract snippets and weighted-index deltas are not enough; Gate D must obtain full topology plus band data or keep it qualitative"
  },
  {
    directRuntimeReadyNow: false,
    id: "ballagh_2013_triple_panel_low_frequency_model",
    priority: "P1",
    requiredGateDClassification: "solver_model_only",
    requiredGateDBlocker:
      "model equations cannot own Rw without extracted source rows, damping and coupling calibration, and mid/high-frequency policy"
  },
  {
    directRuntimeReadyNow: false,
    id: "warnock_1998_concrete_block_attached_drywall",
    priority: "P2",
    requiredGateDClassification: "adjacent_negative_boundary",
    requiredGateDBlocker:
      "attached-drywall masonry resonance evidence protects boundaries but must not calibrate steel-stud internal-board runtime directly"
  }
] as const;

const NO_NUMERIC_PROMOTION_BLOCKERS = [
  "no_local_triple_leaf_source_corpus_with_extracted_band_curves",
  "no_validated_local_material_mapping_for_gypsum_mlv_rockwool_gypsum_plaster_stack",
  "no_calibrated_damping_or_bridge_parameter_owner",
  "no_holdout_tolerance_for_source_calibrated_triple_leaf_solver",
  "no_web_visible_grouped_topology_route_or_report_tests",
  "field_outputs_must_wait_for_lab_curve_and_iso_12354_overlay_policy"
] as const;

const WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE = [
  {
    gate: "D",
    name: "source_pack_extraction_and_calibration_corpus",
    nextFile: "packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts",
    requiredExit:
      "local candidate rows with topology, leaf masses, cavity depths, fill state, coupling/support class, metric owner, and frequency-band TL availability"
  },
  {
    gate: "E",
    name: "row_classifier_and_negative_boundaries",
    nextFile: "packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts",
    requiredExit:
      "exact-row, bounded-calibration, qualitative-only, and rejection-only classes with double-leaf, lined-masonry, one-side-lining, simple-stud, and floor negatives"
  },
  {
    gate: "F",
    name: "frequency_band_solver_skeleton",
    nextFile: "packages/engine/src/wall-triple-leaf-frequency-solver.test.ts",
    requiredExit:
      "three-leaf two-cavity curve builder that predicts resonance bands and returns ISO 717-ready curves without touching dynamic runtime"
  },
  {
    gate: "G",
    name: "calibration_and_holdout_tolerance",
    nextFile: "packages/engine/src/wall-triple-leaf-calibration-regime.test.ts",
    requiredExit:
      "source-family MAE/max-error thresholds, damping/coupling parameters, holdout rows, and explicit reject status when thresholds fail"
  },
  {
    gate: "H",
    name: "engine_integration_fail_closed",
    nextFile: "packages/engine/src/wall-triple-leaf-runtime-integration.test.ts",
    requiredExit:
      "runtime promotion only for grouped topology plus source-calibrated solver pass; otherwise fail closed to multileaf_screening_blend low confidence"
  },
  {
    gate: "I",
    name: "web_visible_grouped_topology_inputs",
    nextFile: "apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts",
    requiredExit:
      "Side A, cavity 1, internal leaf, cavity 2, Side B, coupling, support topology, route-card, output-card, and proposal/report visibility"
  },
  {
    gate: "J",
    name: "company_internal_acceptance_rehearsal",
    nextFile: "packages/engine/src/wall-triple-leaf-internal-acceptance.test.ts",
    requiredExit:
      "user PDF repro, source exact rows, bounded near rows, hostile reorder, many-layer, missing-input, lab, R'w, and DnT,w scenarios all pinned"
  }
] as const;

describe("wall triple-leaf accuracy recovery Gate C", () => {
  it("holds numeric behavior after research instead of promoting the screening blend", () => {
    expect(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C).toMatchObject({
      confidencePromotion: false,
      currentMultileafBlendPromoted: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_d_source_pack_extraction_and_calibration_corpus",
      sourceReadyRuntimePackAvailable: false,
      workbenchInputBehaviorChange: false
    });
    expect(NO_NUMERIC_PROMOTION_BLOCKERS).toEqual([
      "no_local_triple_leaf_source_corpus_with_extracted_band_curves",
      "no_validated_local_material_mapping_for_gypsum_mlv_rockwool_gypsum_plaster_stack",
      "no_calibrated_damping_or_bridge_parameter_owner",
      "no_holdout_tolerance_for_source_calibrated_triple_leaf_solver",
      "no_web_visible_grouped_topology_route_or_report_tests",
      "field_outputs_must_wait_for_lab_curve_and_iso_12354_overlay_policy"
    ]);
  });

  it("keeps the research evidence as source input, not runtime approval", () => {
    expect(GATE_C_RESEARCH_EVIDENCE.map((source) => source.id)).toEqual([
      "nrc_2024_internal_gypsum_double_stud",
      "nrc_1998_gypsum_board_walls_tl_data",
      "uris_2006_internal_gypsum_double_frame",
      "warnock_1998_concrete_block_attached_drywall",
      "ballagh_2013_triple_panel_low_frequency_model",
      "iso_10140_2_lab_airborne_measurement",
      "iso_717_1_airborne_rating",
      "iso_12354_1_building_airborne_prediction"
    ]);
    expect(GATE_C_RESEARCH_EVIDENCE.every((source) => source.blockedRuntimeReason.length > 80)).toBe(true);
    expect(GATE_C_RESEARCH_EVIDENCE.some((source) => source.role === "triple_leaf_measured_row_candidate")).toBe(true);
    expect(GATE_C_RESEARCH_EVIDENCE.some((source) => source.role === "baseline_corpus_and_negative_boundary_candidate")).toBe(
      true
    );
    expect(GATE_C_RESEARCH_EVIDENCE.some((source) => source.role === "solver_model_candidate")).toBe(true);
    expect(GATE_C_RESEARCH_EVIDENCE.filter((source) => source.sourceType === "official_standard_locator")).toHaveLength(3);
  });

  it("prioritizes Gate D extraction sources without treating any source as immediate runtime truth", () => {
    expect(GATE_D_EXTRACTION_PRIORITY.map((source) => `${source.priority}:${source.id}`)).toEqual([
      "P0:nrc_2024_internal_gypsum_double_stud",
      "P0:nrc_1998_gypsum_board_walls_tl_data",
      "P1:uris_2006_internal_gypsum_double_frame",
      "P1:ballagh_2013_triple_panel_low_frequency_model",
      "P2:warnock_1998_concrete_block_attached_drywall"
    ]);
    expect(GATE_D_EXTRACTION_PRIORITY.every((source) => source.directRuntimeReadyNow === false)).toBe(true);
    const uris2006 = GATE_D_EXTRACTION_PRIORITY.find(
      (source) => source.id === "uris_2006_internal_gypsum_double_frame"
    );
    const warnock1998 = GATE_D_EXTRACTION_PRIORITY.find(
      (source) => source.id === "warnock_1998_concrete_block_attached_drywall"
    );

    expect(uris2006?.requiredGateDBlocker).toContain("abstract snippets");
    expect(warnock1998?.requiredGateDClassification).toBe("adjacent_negative_boundary");
  });

  it("locks the next work as source corpus, solver, calibration, integration, visible UI, then acceptance", () => {
    expect(WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE.map((step) => step.gate)).toEqual(["D", "E", "F", "G", "H", "I", "J"]);
    expect(WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE[0]).toMatchObject({
      gate: "D",
      name: "source_pack_extraction_and_calibration_corpus",
      nextFile: WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C.selectedNextFile
    });
    expect(WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE[3].requiredExit).toContain("holdout rows");
    expect(WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE[4].requiredExit).toContain("fail");
    expect(WALL_TRIPLE_LEAF_RECOVERY_SEQUENCE[5].nextFile).toContain("apps/web");
  });

  it("keeps active docs aligned with the researched Gate C plan", () => {
    const docs = [
      "AGENTS.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C_HANDOFF.md"
    ] as const;

    for (const relativePath of docs) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C.selectedNextFile);
    }

    const plan = readFileSync(
      join(REPO_ROOT, WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_C.selectedPlanningSurface),
      "utf8"
    );
    expect(plan).toContain(NRC_TRIPLE_LEAF_2024_URL);
    expect(plan).toContain(URIS_2006_INTERNAL_GYPSUM_DOUBLE_FRAME_URL);
    expect(plan).toContain(NRC_WARNOCK_CONCRETE_BLOCK_DRYWALL_URL);
    expect(plan).toContain(BALLAGH_TRIPLE_PANEL_MODEL_URL);
    expect(plan).toContain("Gate J - Company-Internal Acceptance Rehearsal");
  });
});
