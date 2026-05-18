import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CertainTeedFamily =
  | "nrc_astc_high_rise_steel_stud_field_flanking_context"
  | "silentfx_product_data_steel_stud_stc_context";

type CertainTeedMetricContext = "astc_field_flanking_report" | "product_stc_row_locator";

type CertainTeedPayloadStatus =
  | "open_nrc_archive_record_and_final_pdf_locator"
  | "onesource_pdf_locator_redirects_to_login_indexed_context_only";

type CertainTeedSourceRow = {
  astcExampleCount: number | null;
  blockedTargetOutputs: readonly string[];
  buildSummary: string;
  directRwMetricOwned: false;
  exactLiveTopologyMapped: false;
  family: CertainTeedFamily;
  firstMissingRequirement: string;
  id: string;
  importDisposition: "no_runtime_import";
  localMappingStatus:
    | "blocked_astc_field_flanking_metric_policy_and_silentfx_material_mapping_missing"
    | "blocked_silentfx_type_x_certainteed_type_x_and_stc_metric_mapping_missing";
  metricContext: CertainTeedMetricContext;
  pairedEngineTestsBeforeRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  productLayers: readonly string[];
  protectedBoundary: string;
  sourceLocator: string;
  sourcePayloadStatus: CertainTeedPayloadStatus;
  sourceUrl: string;
  stc: number | null;
  supportContext: string;
  systemReference: string;
};

const CERTAINTEED_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
  status: "certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const NRC_ASTC_ARCHIVE_URL =
  "https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb";
const CERTAINTEED_CTG_2481_URL = "https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf";
const CERTAINTEED_ACOUSTIC_GYPSUM_URL = "https://www.certainteed.com/acoustic-gypsum-board";
const CERTAINTEED_SILENTFX_PRODUCT_URL =
  "https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const CERTAINTEED_SOURCE_ROWS: readonly CertainTeedSourceRow[] = [
  {
    astcExampleCount: 22,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "NRC high-rise examples using lightweight 25 gauge steel stud walls with concrete floors and ceilings plus SilentFX QuickCut and CertainTeed Type X gypsum board combinations",
    directRwMetricOwned: false,
    exactLiveTopologyMapped: false,
    family: "nrc_astc_high_rise_steel_stud_field_flanking_context",
    firstMissingRequirement:
      "nrc_certainteed_astc_examples_need_example_level_payload_astc_direct_flanking_split_metric_policy_stc_or_rw_rejection_policy_silentfx_material_mapping_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    id: "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_astc_field_flanking_metric_policy_and_silentfx_material_mapping_missing",
    metricContext: "astc_field_flanking_report",
    pairedEngineTestsBeforeRuntime: [
      "engine_certainteed_nrc_astc_value_or_rejection_pin",
      "engine_certainteed_nrc_astc_blocks_field_flanking_as_rw_or_dntw_runtime_truth"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_certainteed_nrc_astc_route_card_source_context",
      "web_certainteed_nrc_astc_report_keeps_astc_field_flanking_label"
    ],
    productLayers: [
      "15.9 mm SilentFX QuickCut gypsum board",
      "15.9 mm CertainTeed Type X gypsum board"
    ],
    protectedBoundary:
      "certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs",
    sourceLocator: "NRC Publications Archive / DOI 10.4224/23002223 / final PDF locator",
    sourcePayloadStatus: "open_nrc_archive_record_and_final_pdf_locator",
    sourceUrl: NRC_ASTC_ARCHIVE_URL,
    stc: null,
    supportContext: "ASTC includes direct and flanking transmission through connected building elements",
    systemReference: "2018 NRC technical report / 63 pages / 22 examples"
  },
  {
    astcExampleCount: null,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "SilentFX 5/8 in Type X and CertainTeed 5/8 in Type X product-data example tied to UL Design U465 and an STC 57 source context",
    directRwMetricOwned: false,
    exactLiveTopologyMapped: false,
    family: "silentfx_product_data_steel_stud_stc_context",
    firstMissingRequirement:
      "ctg_2481_u465_stc57_needs_rights_safe_current_pdf_payload_full_layer_fastener_stud_insulation_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_and_visible_tests",
    id: "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_silentfx_type_x_certainteed_type_x_and_stc_metric_mapping_missing",
    metricContext: "product_stc_row_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_certainteed_u465_stc57_value_or_rejection_pin",
      "engine_certainteed_u465_stc57_blocks_lsf_anchor_replacement"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_certainteed_u465_stc57_route_card_source_context",
      "web_certainteed_u465_stc57_report_blocks_stc_as_rw_claim"
    ],
    productLayers: ["5/8 in SilentFX Type X", "5/8 in CertainTeed Type X"],
    protectedBoundary:
      "certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes",
    sourceLocator: "CertainTeed CTG-2481 product data / UL Design U465 / Sound Test STC 57",
    sourcePayloadStatus: "onesource_pdf_locator_redirects_to_login_indexed_context_only",
    sourceUrl: CERTAINTEED_CTG_2481_URL,
    stc: 57,
    supportContext: "product STC row locator, not ISO Rw or field output truth",
    systemReference: "UL Design U465 / CTG-2481 indexed product data context"
  },
  {
    astcExampleCount: null,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "SilentFX 5/8 in Type X and CertainTeed 5/8 in Type X product-data example tied to UL Design U309 and an STC 51 source context",
    directRwMetricOwned: false,
    exactLiveTopologyMapped: false,
    family: "silentfx_product_data_steel_stud_stc_context",
    firstMissingRequirement:
      "ctg_2481_u309_stc51_needs_rights_safe_current_pdf_payload_full_layer_fastener_stud_insulation_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_and_visible_tests",
    id: "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_silentfx_type_x_certainteed_type_x_and_stc_metric_mapping_missing",
    metricContext: "product_stc_row_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_certainteed_u309_stc51_value_or_rejection_pin",
      "engine_certainteed_u309_stc51_blocks_product_stc_to_rw_false_equivalence"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_certainteed_u309_stc51_route_card_source_context",
      "web_certainteed_u309_stc51_report_blocks_product_row_as_runtime_truth"
    ],
    productLayers: ["5/8 in SilentFX Type X", "5/8 in CertainTeed Type X"],
    protectedBoundary:
      "certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs",
    sourceLocator: "CertainTeed CTG-2481 product data / UL Design U309 / Sound Test STC 51",
    sourcePayloadStatus: "onesource_pdf_locator_redirects_to_login_indexed_context_only",
    sourceUrl: CERTAINTEED_CTG_2481_URL,
    stc: 51,
    supportContext: "product STC row locator, not ISO Rw or field output truth",
    systemReference: "UL Design U309 / CTG-2481 indexed product data context"
  }
] as const;

const SOURCE_SURFACE_COVERAGE = {
  acousticGypsumPublicPageAvailable: true,
  certainteedOneSourcePdfRedirectsToLogin: true,
  nrcArchiveFinalPdfLocatorAvailable: true,
  nrcArchiveIdentifier: "A1-010179.1 / NPARC 23002223 / DOI 10.4224/23002223",
  nrcArchivePublicationDate: "2018-05-30",
  nrcArchiveReportedExampleCount: 22,
  nrcArchiveReportedPhysicalDescription: "63 p.",
  publicProductPageConfirmsSilentFxQuickCutMaterialContext: true,
  sourceUrls: [
    NRC_ASTC_ARCHIVE_URL,
    CERTAINTEED_CTG_2481_URL,
    CERTAINTEED_ACOUSTIC_GYPSUM_URL,
    CERTAINTEED_SILENTFX_PRODUCT_URL
  ]
} as const;

const METRIC_POLICY = {
  astcDirectRwEquivalenceOwned: false,
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directRwImportSelectedNow: false,
  directStcToRwEquivalenceOwned: false,
  fullBandCurvesCaptured: false,
  productStcRowsAreLocatorsOnly: true,
  sourceMetrics: ["ASTC", "STC", "field_or_flanking_context", "UL_design_context"],
  toleranceOwnerNamed: false
} as const;

const MATERIAL_AND_TOPOLOGY_POLICY = [
  {
    aliasDecision: "blocked_silentfx_quickcut_type_x_is_not_generic_gypsum_without_material_mapping",
    localInput: "gypsum_board",
    sourceMaterial: "SilentFX QuickCut Type X gypsum board"
  },
  {
    aliasDecision: "blocked_certainteed_type_x_is_not_generic_type_c_pabco_type_x_or_quietrock_without_tolerance",
    localInput: "gypsum_board",
    sourceMaterial: "CertainTeed Type X gypsum board"
  },
  {
    aliasDecision: "blocked_astc_steel_stud_high_rise_examples_are_not_existing_lsf_lab_anchor_topology",
    localInput: "steel_stud_context",
    sourceMaterial: "lightweight 25 gauge steel stud high-rise ASTC examples"
  },
  {
    aliasDecision: "blocked_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_live_topology_mapping",
    localInput: "steel_stud_wall",
    sourceMaterial: "UL Design U465 / U309 product STC examples"
  }
] as const;

const FAMILY_BOUNDARY_MATRIX = [
  {
    blockedPromotion: "do_not_promote_certainteed_nrc_astc_examples_to_dyn_echo_rw_or_dntw_runtime",
    sourceFamily: "nrc_astc_high_rise_steel_stud_field_flanking_context",
    targetRouteFamilies: ["field_flanking_context_only", "lab_rw_rejected_until_policy"]
  },
  {
    blockedPromotion: "do_not_promote_certainteed_product_stc_rows_to_existing_lsf_anchors",
    sourceFamily: "silentfx_product_data_steel_stud_stc_context",
    targetRouteFamilies: ["stc_context_only", "exact_lsf_anchor_rejected_until_payload_mapping"]
  },
  {
    blockedPromotion: "do_not_coalesce_silentfx_generic_gypsum_quietrock_or_pabco_type_x_by_name",
    sourceFamily: "silentfx_material_alias_context",
    targetRouteFamilies: ["material_mapping_required"]
  },
  {
    blockedPromotion: "do_not_use_certainteed_context_to_fix_uris_2006_split_rockwool_lane",
    sourceFamily: "silentfx_and_astc_context",
    targetRouteFamilies: ["uris_2006_source_packet_required"]
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw",
  "certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests",
  "silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner",
  "certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result",
  "certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim",
  "certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMappingOrCloseout: CERTAINTEED_SOURCE_ROWS.map((row) => row.id),
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts"
} as const;

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("CertainTeed SilentFX NRC ASTC source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source extraction and selects Gate B mapping", () => {
    expect(CERTAINTEED_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
      status: "certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts NRC ASTC and CertainTeed product STC rows with metric context separated", () => {
    expect(CERTAINTEED_SOURCE_ROWS.map((row) => row.id)).toEqual([
      "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
      "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
      "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
    ]);
    expect(new Set(CERTAINTEED_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<CertainTeedFamily>([
        "nrc_astc_high_rise_steel_stud_field_flanking_context",
        "silentfx_product_data_steel_stud_stc_context"
      ])
    );
    expect(CERTAINTEED_SOURCE_ROWS.map((row) => row.metricContext)).toEqual([
      "astc_field_flanking_report",
      "product_stc_row_locator",
      "product_stc_row_locator"
    ]);
    expect(CERTAINTEED_SOURCE_ROWS.map((row) => row.stc)).toEqual([null, 57, 51]);
    expect(CERTAINTEED_SOURCE_ROWS[0].astcExampleCount).toBe(22);
    expect(CERTAINTEED_SOURCE_ROWS.every((row) => row.directRwMetricOwned === false)).toBe(true);
    expect(CERTAINTEED_SOURCE_ROWS.every((row) => row.exactLiveTopologyMapped === false)).toBe(true);
  });

  it("records source access and payload posture without turning locators into runtime truth", () => {
    expect(SOURCE_SURFACE_COVERAGE).toEqual({
      acousticGypsumPublicPageAvailable: true,
      certainteedOneSourcePdfRedirectsToLogin: true,
      nrcArchiveFinalPdfLocatorAvailable: true,
      nrcArchiveIdentifier: "A1-010179.1 / NPARC 23002223 / DOI 10.4224/23002223",
      nrcArchivePublicationDate: "2018-05-30",
      nrcArchiveReportedExampleCount: 22,
      nrcArchiveReportedPhysicalDescription: "63 p.",
      publicProductPageConfirmsSilentFxQuickCutMaterialContext: true,
      sourceUrls: [
        NRC_ASTC_ARCHIVE_URL,
        CERTAINTEED_CTG_2481_URL,
        CERTAINTEED_ACOUSTIC_GYPSUM_URL,
        CERTAINTEED_SILENTFX_PRODUCT_URL
      ]
    });
    expect(CERTAINTEED_SOURCE_ROWS.map((row) => row.sourcePayloadStatus)).toEqual([
      "open_nrc_archive_record_and_final_pdf_locator",
      "onesource_pdf_locator_redirects_to_login_indexed_context_only",
      "onesource_pdf_locator_redirects_to_login_indexed_context_only"
    ]);
    expect(CERTAINTEED_SOURCE_ROWS.every((row) => row.firstMissingRequirement.length > 95)).toBe(true);
  });

  it("blocks ASTC, STC, and field context from becoming DynEcho Rw or field outputs", () => {
    expect(METRIC_POLICY).toEqual({
      astcDirectRwEquivalenceOwned: false,
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directRwImportSelectedNow: false,
      directStcToRwEquivalenceOwned: false,
      fullBandCurvesCaptured: false,
      productStcRowsAreLocatorsOnly: true,
      sourceMetrics: ["ASTC", "STC", "field_or_flanking_context", "UL_design_context"],
      toleranceOwnerNamed: false
    });
    expect(new Set(CERTAINTEED_SOURCE_ROWS.map((row) => row.metricContext))).toEqual(
      new Set<CertainTeedMetricContext>(["astc_field_flanking_report", "product_stc_row_locator"])
    );
    expect(CERTAINTEED_SOURCE_ROWS.every((row) => row.blockedTargetOutputs.includes("DnT,w"))).toBe(true);
  });

  it("blocks SilentFX, Type X, ASTC topology, and product STC coalescing", () => {
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => `${entry.sourceMaterial}:${entry.localInput}`)).toEqual([
      "SilentFX QuickCut Type X gypsum board:gypsum_board",
      "CertainTeed Type X gypsum board:gypsum_board",
      "lightweight 25 gauge steel stud high-rise ASTC examples:steel_stud_context",
      "UL Design U465 / U309 product STC examples:steel_stud_wall"
    ]);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.every((entry) => entry.aliasDecision.startsWith("blocked"))).toBe(true);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => entry.aliasDecision).join("\n")).toContain(
      "not_generic_gypsum"
    );
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => entry.aliasDecision).join("\n")).not.toContain(
      "runtime_exact"
    );
  });

  it("holds source-family boundaries for ASTC, product STC, material aliases, and Uris 2006", () => {
    expect(FAMILY_BOUNDARY_MATRIX.map((entry) => entry.blockedPromotion)).toEqual([
      "do_not_promote_certainteed_nrc_astc_examples_to_dyn_echo_rw_or_dntw_runtime",
      "do_not_promote_certainteed_product_stc_rows_to_existing_lsf_anchors",
      "do_not_coalesce_silentfx_generic_gypsum_quietrock_or_pabco_type_x_by_name",
      "do_not_use_certainteed_context_to_fix_uris_2006_split_rockwool_lane"
    ]);
    expect(FAMILY_BOUNDARY_MATRIX.flatMap((entry) => entry.targetRouteFamilies)).not.toContain(
      "runtime_import_ready"
    );
  });

  it("protects the original split-rockwool defect and closed near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMappingOrCloseout: [
        "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
        "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
        "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(7);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain(
      "certainteed_context_does_not_fix_uris_2006_split_rockwool"
    );
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("onesource_login_redirect_blocks");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("closed_pabco_georgia_pacific");
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(CERTAINTEED_GATE_A.sliceId);
    expect(docs).toContain(CERTAINTEED_GATE_A.status);
    expect(docs).toContain(CERTAINTEED_GATE_A.selectedNextAction);
    expect(docs).toContain(CERTAINTEED_GATE_A.selectedNextFile);
    expect(docs).toContain(NRC_ASTC_ARCHIVE_URL);
    expect(docs).toContain(CERTAINTEED_CTG_2481_URL);
    expect(docs).toContain(CERTAINTEED_ACOUSTIC_GYPSUM_URL);
    expect(docs).toContain(CERTAINTEED_SILENTFX_PRODUCT_URL);

    for (const row of CERTAINTEED_SOURCE_ROWS) {
      expect(docs, row.id).toContain(row.id);
      expect(docs, row.sourceUrl).toContain(row.sourceUrl);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
