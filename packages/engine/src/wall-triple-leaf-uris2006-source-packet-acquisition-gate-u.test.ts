import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type AcquisitionCandidate = {
  id: string;
  inspectedLocator: string;
  packetArtifactSatisfiedNow: false;
  rejectionReason: string;
  runtimeUsableNow: false;
  sourceUse:
    | "identity_metadata_only"
    | "authorized_access_path_only"
    | "local_packet_absent"
    | "source_packet_negative_boundary";
  status:
    | "blocked_authorized_payload_not_available"
    | "blocked_local_packet_absent"
    | "blocked_metadata_only"
    | "blocked_not_primary_uris_payload";
};

type EquivalentSourceCandidate = {
  id: string;
  firstMismatch: string;
  protectedBoundary: string;
  runtimeUsableNow: false;
  sourceUse:
    | "adjacent_perforated_negative_boundary"
    | "context_only_manufacturer_rows"
    | "nrc_comparator_only"
    | "public_metadata_only";
};

const WALL_TRIPLE_LEAF_URIS2006_SOURCE_PACKET_ACQUISITION_GATE_U = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v20",
  selectedNextAction: "gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt",
  selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
  selectionStatus:
    "gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20",
  sliceId: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const URIS_2006_SOURCE_IDENTITY = {
  artifact: "uris_2006_rights_safe_source_packet_acquisition_attempt",
  authors: ["Antonio Uris", "Jose Maria Bravo", "Vicente Gomez-Lozano", "Patricio Ramirez", "Jaime Llinares"],
  doi: "10.1016/j.apacoust.2005.11.006",
  journal: "Applied Acoustics 67(9), 918-925",
  pii: "S0003682X05001799",
  title: "Sound insulation of double frame partitions with an internal gypsum board layer"
} as const;

const ACQUISITION_CANDIDATES: readonly AcquisitionCandidate[] = [
  {
    id: "crossref_metadata_record",
    inspectedLocator: "https://api.crossref.org/works/10.1016%2Fj.apacoust.2005.11.006",
    packetArtifactSatisfiedNow: false,
    rejectionReason:
      "metadata_confirms_identity_and_elsevier_tdm_links_but_does_not_supply_page_images_curve_identity_band_vectors_or_rating_derivation",
    runtimeUsableNow: false,
    sourceUse: "identity_metadata_only",
    status: "blocked_metadata_only"
  },
  {
    id: "elsevier_tdm_endpoint_for_pii_s0003682x05001799",
    inspectedLocator: "https://api.elsevier.com/content/article/PII:S0003682X05001799?httpAccept=text/plain",
    packetArtifactSatisfiedNow: false,
    rejectionReason:
      "endpoint_is_an_authorized_access_path_only; the current local corpus_has_no_authorized_payload_or_source_owned_curve_data",
    runtimeUsableNow: false,
    sourceUse: "authorized_access_path_only",
    status: "blocked_authorized_payload_not_available"
  },
  {
    id: "sciencedirect_article_page",
    inspectedLocator: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    packetArtifactSatisfiedNow: false,
    rejectionReason:
      "article_locator_is_concrete_but_no_rights_safe_local_pdf_page_image_numeric_table_or_tdm_payload_was_available_to_this_gate",
    runtimeUsableNow: false,
    sourceUse: "authorized_access_path_only",
    status: "blocked_authorized_payload_not_available"
  },
  {
    id: "local_uris_2006_source_packet_path",
    inspectedLocator: "source-packets/uris-2006/ or equivalent local rights-safe corpus path",
    packetArtifactSatisfiedNow: false,
    rejectionReason:
      "no_local_packet_contains_the_primary_uris_2006_figure_table_page_image_numeric_band_vector_or_chain_of_custody_note",
    runtimeUsableNow: false,
    sourceUse: "local_packet_absent",
    status: "blocked_local_packet_absent"
  },
  {
    id: "opendeved_catalog_metadata_mirror",
    inspectedLocator: "https://docs.opendeved.net/lib/2ZBKZEYN",
    packetArtifactSatisfiedNow: false,
    rejectionReason:
      "public_catalog_metadata_mirrors_identity_and_rights_context_but_not_the_source_curve_payload_needed_for_runtime",
    runtimeUsableNow: false,
    sourceUse: "identity_metadata_only",
    status: "blocked_metadata_only"
  }
] as const;

const EQUIVALENT_ROCKWOOL_TWO_CAVITY_SOURCE_PAYLOAD_SCAN: readonly EquivalentSourceCandidate[] = [
  {
    id: "nrc_2024_internal_board_glass_fiber_comparator",
    firstMismatch:
      "glass_fiber_comparator_graph_family_is_not_the_local_uris_2006_rockwool_or_mineral_wool_two_cavity_payload",
    protectedBoundary: "nrc_2024_comparator_boundary_still_not_local_runtime",
    runtimeUsableNow: false,
    sourceUse: "nrc_comparator_only"
  },
  {
    id: "uris_2008_perforated_absorptive_facing_partition",
    firstMismatch:
      "perforated_absorptive_facing_topology_changes_the_acoustic_mechanism_and_must_remain_a_separate_negative_boundary",
    protectedBoundary: "uris_2008_perforated_facing_not_uris_2006_internal_board_runtime",
    runtimeUsableNow: false,
    sourceUse: "adjacent_perforated_negative_boundary"
  },
  {
    id: "rockwool_usg_ng_gp_pabco_certainteed_context_rows",
    firstMismatch:
      "manufacturer_stc_iic_oitc_context_rows_do_not_supply_uris_2006_curve_identity_band_vectors_or_local_material_tolerance",
    protectedBoundary: "near_source_manufacturer_rows_do_not_fix_uris_2006_split_rockwool",
    runtimeUsableNow: false,
    sourceUse: "context_only_manufacturer_rows"
  },
  {
    id: "public_metadata_and_doi_summaries",
    firstMismatch:
      "metadata_can_confirm_source_identity_but_cannot_define_the_exact_two_cavity_curve_or_weighted_index_derivation",
    protectedBoundary: "metadata_only_not_source_packet",
    runtimeUsableNow: false,
    sourceUse: "public_metadata_only"
  }
] as const;

const SOURCE_PACKET_RUNTIME_READINESS_OR_REJECTION_REASON = {
  artifact: "source_packet_runtime_readiness_or_rejection_reason",
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  missingForRuntime: [
    "rights_safe_source_file_or_authorized_tdm_payload",
    "page_figure_table_locator_for_the_internal_board_curve",
    "curve_identity_map_for_side_a_cavity_1_internal_leaf_cavity_2_side_b",
    "one_third_octave_band_vectors_or_reproducible_digitization_payload",
    "rw_or_stc_derivation_and_uncertainty_owner",
    "local_rockwool_mlv_gypsum_board_gypsum_plaster_mapping_with_tolerance",
    "paired_engine_and_web_visible_tests"
  ],
  runtimeImportReadyNow: false,
  sourcePacketReadyForDigitizationNow: false,
  sourcePacketReadyForRuntimeNow: false
} as const;

const RW41_SCREENING_ANSWER_POSTURE = {
  artifact: "rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests",
  groupedAnswer: "Rw 41",
  runtimeImportReadyNow: false,
  strategy: "multileaf_screening_blend",
  visiblePosture: "low_confidence_screening_not_exact_not_source_validated"
} as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_OUTPUTS = ["Rw"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[], airborneContext: AirborneContext = WALL_LAB_CONTEXT) {
  const result = calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    strategy: result.dynamicAirborneTrace?.strategy,
    warnings: result.warnings.join("\n")
  };
}

describe("wall triple-leaf Uris 2006 source packet acquisition Gate U", () => {
  it("lands Gate U no-runtime and selects source-gap revalidation v20", () => {
    expect(WALL_TRIPLE_LEAF_URIS2006_SOURCE_PACKET_ACQUISITION_GATE_U).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v20",
      selectedNextAction: "gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt",
      selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
      selectionStatus:
        "gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20",
      sliceId: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("records the Uris 2006 source identity without treating metadata as a packet", () => {
    expect(URIS_2006_SOURCE_IDENTITY).toMatchObject({
      artifact: "uris_2006_rights_safe_source_packet_acquisition_attempt",
      doi: "10.1016/j.apacoust.2005.11.006",
      pii: "S0003682X05001799",
      title: "Sound insulation of double frame partitions with an internal gypsum board layer"
    });
    expect(URIS_2006_SOURCE_IDENTITY.authors).toContain("Antonio Uris");

    expect(ACQUISITION_CANDIDATES.map((candidate) => `${candidate.id}:${candidate.status}`)).toEqual([
      "crossref_metadata_record:blocked_metadata_only",
      "elsevier_tdm_endpoint_for_pii_s0003682x05001799:blocked_authorized_payload_not_available",
      "sciencedirect_article_page:blocked_authorized_payload_not_available",
      "local_uris_2006_source_packet_path:blocked_local_packet_absent",
      "opendeved_catalog_metadata_mirror:blocked_metadata_only"
    ]);
    expect(ACQUISITION_CANDIDATES.every((candidate) => candidate.packetArtifactSatisfiedNow === false)).toBe(true);
    expect(ACQUISITION_CANDIDATES.every((candidate) => candidate.runtimeUsableNow === false)).toBe(true);
  });

  it("scans equivalent payload candidates and keeps every near-source row out of runtime", () => {
    expect(EQUIVALENT_ROCKWOOL_TWO_CAVITY_SOURCE_PAYLOAD_SCAN.map((candidate) => candidate.id)).toEqual([
      "nrc_2024_internal_board_glass_fiber_comparator",
      "uris_2008_perforated_absorptive_facing_partition",
      "rockwool_usg_ng_gp_pabco_certainteed_context_rows",
      "public_metadata_and_doi_summaries"
    ]);
    expect(EQUIVALENT_ROCKWOOL_TWO_CAVITY_SOURCE_PAYLOAD_SCAN.every((candidate) => !candidate.runtimeUsableNow)).toBe(
      true
    );
    expect(EQUIVALENT_ROCKWOOL_TWO_CAVITY_SOURCE_PAYLOAD_SCAN.map((candidate) => candidate.protectedBoundary)).toEqual([
      "nrc_2024_comparator_boundary_still_not_local_runtime",
      "uris_2008_perforated_facing_not_uris_2006_internal_board_runtime",
      "near_source_manufacturer_rows_do_not_fix_uris_2006_split_rockwool",
      "metadata_only_not_source_packet"
    ]);
  });

  it("rejects runtime readiness until source curves, mapping, tolerance, and visible tests exist", () => {
    expect(SOURCE_PACKET_RUNTIME_READINESS_OR_REJECTION_REASON).toMatchObject({
      artifact: "source_packet_runtime_readiness_or_rejection_reason",
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      runtimeImportReadyNow: false,
      sourcePacketReadyForDigitizationNow: false,
      sourcePacketReadyForRuntimeNow: false
    });
    expect(SOURCE_PACKET_RUNTIME_READINESS_OR_REJECTION_REASON.missingForRuntime).toEqual([
      "rights_safe_source_file_or_authorized_tdm_payload",
      "page_figure_table_locator_for_the_internal_board_curve",
      "curve_identity_map_for_side_a_cavity_1_internal_leaf_cavity_2_side_b",
      "one_third_octave_band_vectors_or_reproducible_digitization_payload",
      "rw_or_stc_derivation_and_uncertainty_owner",
      "local_rockwool_mlv_gypsum_board_gypsum_plaster_mapping_with_tolerance",
      "paired_engine_and_web_visible_tests"
    ]);
  });

  it("keeps grouped and flat-list split-rockwool behavior frozen as screening/fail-closed", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4), WALL_LAB_CONTEXT);

    expect(RW41_SCREENING_ANSWER_POSTURE).toEqual({
      artifact: "rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests",
      groupedAnswer: "Rw 41",
      runtimeImportReadyNow: false,
      strategy: "multileaf_screening_blend",
      visiblePosture: "low_confidence_screening_not_exact_not_source_validated"
    });
    expect(grouped).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
  });

  it("keeps active docs aligned with Gate U and the v20 no-runtime next slice", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_URIS2006_SOURCE_PACKET_ACQUISITION_GATE_U.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_URIS2006_SOURCE_PACKET_ACQUISITION_GATE_U.selectedNextFile);
    }

    const sourcePlan = readRepoFile("docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md");
    expect(sourcePlan).toContain("crossref_metadata_record");
    expect(sourcePlan).toContain("elsevier_tdm_endpoint_for_pii_s0003682x05001799");
    expect(sourcePlan).toContain("nrc_2024_comparator_boundary_still_not_local_runtime");
    expect(sourcePlan).toContain("rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests");
  });
});
