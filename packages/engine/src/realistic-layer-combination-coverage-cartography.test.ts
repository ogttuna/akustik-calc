import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly, type CalculateAssemblyOptions } from "./calculate-assembly";
import {
  BUILDING_CONTEXT as DEEP_HYBRID_BUILDING_CONTEXT,
  buildDeepHybridStack,
  DEEP_HYBRID_CAVITY_PACKS,
  DEEP_HYBRID_CORES,
  FAST_BOARD_PAIR
} from "./dynamic-airborne-deep-hybrid-test-helpers";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

type EvidenceTier = "exact" | "benchmark" | "formula" | "family" | "screening" | "bound" | "fail_closed";
type CandidateType = "runtime_widening" | "value_pin_only" | "source_blocked" | "coverage_confirmed";
type SupportBucket = "supported" | "partial" | "fail_closed";
type WebCardStatus = "covered" | "not_required_for_engine_stress";
type CellMode = "lab" | "field";
type StudyMode = "floor" | "wall";
type DeepHybridFamily = "aac_d700_100" | "aac_d700_120" | "aac_g5" | "heavy_core";

type BaseCell = {
  candidateRank?: number;
  candidateType: CandidateType;
  confidencePosture: string;
  engineSupportBucket: SupportBucket;
  evidencePaths: readonly string[];
  evidenceTier: EvidenceTier;
  expectedBoundFloorSystemMatchId?: string | null;
  expectedDynamicFamily?: string | null;
  expectedFloorSystemEstimateKind?: string | null;
  expectedFloorSystemMatchId?: string | null;
  expectedImpactBasisIncludes?: string;
  expectedRwDb?: number;
  expectedRwPrimeDb?: number;
  expectedSupported: readonly RequestedOutputId[];
  expectedUnsupported: readonly RequestedOutputId[];
  family: string;
  id: string;
  invariants: readonly string[];
  originBasisId: string | null;
  studyMode: StudyMode;
  webCardStatus: WebCardStatus;
};

type GeneratedCell = BaseCell & {
  generatedCaseId: string;
  mode: CellMode;
  source: "generated_case";
};

type ResilientSideCountCell = BaseCell & {
  resilientBarSideCount: "auto" | "one_side" | "both_sides";
  rowId: string;
  source: "resilient_side_count_corpus";
};

type DeepHybridCell = BaseCell & {
  deepHybridFamily: DeepHybridFamily;
  source: "deep_hybrid_representative";
};

type CustomCell = BaseCell & {
  layers: readonly LayerInput[];
  options: CalculateAssemblyOptions;
  source: "custom_layers";
};

type CartographyCell = GeneratedCell | ResilientSideCountCell | DeepHybridCell | CustomCell;

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_BUILDING_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const MIXED_BOARD_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 32,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const MIXED_BOARD_SINGLE_BOARD_LAYERS = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 15 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 18 }
] as const satisfies readonly LayerInput[];

const REQUIRED_FLOOR_FAMILIES = [
  "floor_heavy_concrete",
  "floor_reinforced_or_hollow_core",
  "floor_clt_source",
  "floor_timber_direct_or_mount",
  "floor_open_web_or_open_box",
  "floor_ubiq_bound_or_exact",
  "floor_official_product_spot",
  "floor_raw_or_blocked_carrier"
] as const;

const REQUIRED_WALL_FAMILIES = [
  "wall_single_leaf_masonry",
  "wall_single_leaf_or_multileaf_aac",
  "wall_clt_mass_timber",
  "wall_concrete_or_heavy_core_lined",
  "wall_light_steel_stud",
  "wall_timber_stud",
  "wall_resilient_bar_auto",
  "wall_resilient_bar_one_side",
  "wall_resilient_bar_both_sides",
  "wall_mixed_board_single_board",
  "wall_deep_hybrid_aac_d700_100",
  "wall_deep_hybrid_aac_d700_120",
  "wall_deep_hybrid_aac_g5",
  "wall_deep_hybrid_heavy_core"
] as const;

const CARTOGRAPHY_CELLS: readonly CartographyCell[] = [
  {
    id: "floor.ubiq_open_web_200_exact.lab",
    source: "generated_case",
    generatedCaseId: "floor-open-web-200-exact",
    mode: "lab",
    studyMode: "floor",
    family: "floor_ubiq_bound_or_exact",
    evidenceTier: "exact",
    originBasisId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    confidencePosture: "official exact floor-system row",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    expectedSupported: ["Rw", "Ln,w", "Ln,w+CI"],
    expectedUnsupported: ["DeltaLw"],
    invariants: ["exact row remains exact", "DeltaLw remains unsupported for this exact mixed row"],
    evidencePaths: [
      "packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts",
      "apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts"
    ]
  },
  {
    id: "floor.ubiq_open_web_200_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-open-web-200-exact",
    mode: "field",
    studyMode: "floor",
    family: "floor_open_web_or_open_box",
    evidenceTier: "exact",
    originBasisId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    confidencePosture: "exact airborne plus estimated field impact companion",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    expectedUnsupported: [],
    invariants: ["exact split-equivalent open-web stack stays exact", "field impact companion stays finite"],
    evidencePaths: [
      "packages/catalogs/src/floor-systems/ubiq-open-web-weak-band-rows.ts",
      "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
      "apps/web/features/workbench/floor-full-preset-contract-matrix.test.ts"
    ]
  },
  {
    id: "floor.ubiq_open_web_bound.field",
    source: "generated_case",
    generatedCaseId: "floor-open-web-bound",
    mode: "field",
    studyMode: "floor",
    family: "floor_ubiq_bound_or_exact",
    evidenceTier: "bound",
    originBasisId: "ubiq_fl33_open_web_steel_300_lab_2026",
    confidencePosture: "lower/upper bound row, not exact",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedBoundFloorSystemMatchId: "ubiq_fl33_open_web_steel_300_lab_2026",
    expectedImpactBasisIncludes: "mixed_bound",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["bound lane stays labelled as bound", "L'nT,50 does not leak as exact"],
    evidencePaths: [
      "packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts",
      "packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
      "apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts"
    ]
  },
  {
    id: "floor.regupol_curve_8_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-regupol-curve-8-exact",
    mode: "field",
    studyMode: "floor",
    family: "floor_official_product_spot",
    evidenceTier: "exact",
    originBasisId: "regupol_sonus_curve_8_exact_delta",
    confidencePosture: "official product spot exact/delta lane",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["official product delta remains finite", "low-frequency field output stays unsupported"],
    evidencePaths: [
      "packages/catalogs/src/impact/official-product-catalog.ts",
      "packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts"
    ]
  },
  {
    id: "floor.heavy_concrete_family.field",
    source: "generated_case",
    generatedCaseId: "floor-heavy-concrete",
    mode: "field",
    studyMode: "floor",
    family: "floor_heavy_concrete",
    evidenceTier: "family",
    originBasisId: "predictor_heavy_concrete_published_upper_treatment_estimate",
    confidencePosture: "family estimate with published heavy-concrete treatment basis",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemEstimateKind: "family_general",
    expectedImpactBasisIncludes: "mixed_predicted",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["family estimate stays finite", "unsupported low-frequency field output remains explicit"],
    evidencePaths: [
      "packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts",
      "packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts"
    ]
  },
  {
    id: "floor.hollow_core_vinyl_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-hollow-core-vinyl",
    mode: "field",
    studyMode: "floor",
    family: "floor_reinforced_or_hollow_core",
    evidenceTier: "exact",
    originBasisId: "pliteq_hcp200_vinyl_lab_2026",
    confidencePosture: "official product exact row",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "pliteq_hcp200_vinyl_lab_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["exact product row stays exact", "field companion remains finite"],
    evidencePaths: [
      "packages/catalogs/src/impact/official-product-catalog.ts",
      "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts"
    ]
  },
  {
    id: "floor.reinforced_concrete_tuas_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-tuas-concrete-dry",
    mode: "field",
    studyMode: "floor",
    family: "floor_reinforced_or_hollow_core",
    evidenceTier: "exact",
    originBasisId: "tuas_h5_concrete160_measured_2026",
    confidencePosture: "reinforced-concrete exact row with complete field impact companion",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "tuas_h5_concrete160_measured_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    expectedUnsupported: [],
    invariants: ["reinforced-concrete exact row stays exact", "low-frequency field output stays supported"],
    evidencePaths: [
      "packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts",
      "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts"
    ]
  },
  {
    id: "floor.reinforced_concrete_product_formula.field",
    source: "generated_case",
    generatedCaseId: "floor-getzner-afm-35-delta",
    mode: "field",
    studyMode: "floor",
    family: "floor_reinforced_or_hollow_core",
    evidenceTier: "formula",
    originBasisId: "getzner_afm35_delta_product_row_plus_heavy_floor_formula",
    confidencePosture: "official product DeltaLw with predicted airborne/field companion",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: null,
    expectedImpactBasisIncludes: "mixed_predicted",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["official product delta does not masquerade as an exact floor-system row", "predicted companion stays explicit"],
    evidencePaths: [
      "packages/catalogs/src/impact/official-product-catalog.ts",
      "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts"
    ]
  },
  {
    id: "floor.dataholz_clt_dry_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-clt-dry",
    mode: "field",
    studyMode: "floor",
    family: "floor_clt_source",
    evidenceTier: "exact",
    originBasisId: "dataholz_gdmtxn01_dry_clt_lab_2026",
    confidencePosture: "Dataholz CLT exact row with field companion",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    expectedUnsupported: [],
    invariants: ["CLT dry exact stack stays exact", "L'nT,50 stays supported on this row"],
    evidencePaths: [
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
      "apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts"
    ]
  },
  {
    id: "floor.knauf_direct_timber_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-knauf-direct-timber",
    mode: "field",
    studyMode: "floor",
    family: "floor_timber_direct_or_mount",
    evidenceTier: "exact",
    originBasisId: "knauf_ct2g_timber_r25_lab_2026",
    confidencePosture: "Knauf timber direct mount exact row",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "knauf_ct2g_timber_r25_lab_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["timber direct row remains exact", "low-frequency field output remains unsupported"],
    evidencePaths: [
      "packages/catalogs/src/floor-systems/knauf-au-timber-family-rows.ts",
      "apps/web/features/workbench/floor-full-preset-contract-matrix.test.ts"
    ]
  },
  {
    id: "floor.tuas_open_box_exact.field",
    source: "generated_case",
    generatedCaseId: "floor-open-box-exact",
    mode: "field",
    studyMode: "floor",
    family: "floor_open_web_or_open_box",
    evidenceTier: "exact",
    originBasisId: "tuas_r2b_open_box_timber_measured_2026",
    confidencePosture: "TUAS open-box exact row",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedFloorSystemMatchId: "tuas_r2b_open_box_timber_measured_2026",
    expectedImpactBasisIncludes: "mixed_exact",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    expectedUnsupported: [],
    invariants: ["open-box exact row remains exact", "field output set remains complete"],
    evidencePaths: [
      "packages/engine/src/floor-source-corpus-contract.test.ts",
      "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts"
    ]
  },
  {
    id: "floor.tuas_c11c_fail_closed.field",
    source: "generated_case",
    generatedCaseId: "floor-tuas-c11c-fail-closed",
    mode: "field",
    studyMode: "floor",
    family: "floor_raw_or_blocked_carrier",
    evidenceTier: "fail_closed",
    originBasisId: null,
    confidencePosture: "source-blocked exact import; field airborne support only",
    engineSupportBucket: "fail_closed",
    webCardStatus: "covered",
    candidateType: "source_blocked",
    expectedSupported: ["R'w", "DnT,w"],
    expectedUnsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    invariants: ["blocked C11c exact import does not leak impact outputs", "source evidence required before reopening"],
    evidencePaths: [
      "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts"
    ]
  },
  {
    id: "floor.dataholz_gdmtxa04a_visible_formula.field",
    source: "generated_case",
    generatedCaseId: "floor-dataholz-gdmtxa04a-boundary",
    mode: "field",
    studyMode: "floor",
    family: "floor_raw_or_blocked_carrier",
    evidenceTier: "formula",
    originBasisId: "predictor_mass_timber_clt_dataholz_dry_estimate",
    confidencePosture: "visible formula estimate while direct exact row remains source-blocked",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "source_blocked",
    expectedFloorSystemEstimateKind: "family_general",
    expectedImpactBasisIncludes: "mixed_predicted",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
    expectedUnsupported: [],
    invariants: ["visible estimate stays formula-owned", "direct exact import remains blocked"],
    evidencePaths: [
      "packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts",
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts"
    ]
  },
  {
    id: "floor.steel_fallback_low_confidence.field",
    source: "generated_case",
    generatedCaseId: "floor-steel-fallback",
    mode: "field",
    studyMode: "floor",
    family: "floor_open_web_or_open_box",
    evidenceTier: "screening",
    originBasisId: "predictor_floor_system_low_confidence_estimate",
    confidencePosture: "low-confidence fallback",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "runtime_widening",
    candidateRank: 5,
    expectedFloorSystemEstimateKind: "low_confidence",
    expectedImpactBasisIncludes: "mixed_predicted",
    expectedSupported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedUnsupported: ["L'nT,50"],
    invariants: ["fallback remains explicitly low-confidence", "low-frequency field output remains unsupported"],
    evidencePaths: [
      "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
      "apps/web/features/workbench/raw-floor-screening-route-support.test.ts"
    ]
  },
  {
    id: "wall.masonry_brick_benchmark.field",
    source: "generated_case",
    generatedCaseId: "wall-masonry-brick",
    mode: "field",
    studyMode: "wall",
    family: "wall_single_leaf_masonry",
    evidenceTier: "benchmark",
    originBasisId: "porotherm_masonry_benchmark_lane",
    confidencePosture: "masonry benchmark fit",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedDynamicFamily: "masonry_nonhomogeneous",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["dynamic masonry family remains selected", "field outputs stay finite"],
    evidencePaths: [
      "packages/engine/src/airborne-masonry-benchmark.test.ts",
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
    ]
  },
  {
    id: "wall.aac_multileaf_family.field",
    source: "generated_case",
    generatedCaseId: "wall-held-aac",
    mode: "field",
    studyMode: "wall",
    family: "wall_single_leaf_or_multileaf_aac",
    evidenceTier: "family",
    originBasisId: "dynamic_multileaf_multicavity_lane",
    confidencePosture: "family lane with explicit local dynamic warning",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "multileaf_multicavity",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["AAC held wall stays supported", "does not claim exact source row"],
    evidencePaths: [
      "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-100.test.ts"
    ]
  },
  {
    id: "wall.clt_formula.field",
    source: "generated_case",
    generatedCaseId: "wall-clt-local",
    mode: "field",
    studyMode: "wall",
    family: "wall_clt_mass_timber",
    evidenceTier: "formula",
    originBasisId: "laminated_single_leaf_formula_lane",
    confidencePosture: "formula-owned mass timber wall lane",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "runtime_widening",
    candidateRank: 3,
    expectedDynamicFamily: "laminated_single_leaf",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["CLT wall stays formula-owned", "field outputs stay finite"],
    evidencePaths: [
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    ]
  },
  {
    id: "wall.lsf_knauf_benchmark.field",
    source: "generated_case",
    generatedCaseId: "wall-lsf-knauf",
    mode: "field",
    studyMode: "wall",
    family: "wall_light_steel_stud",
    evidenceTier: "benchmark",
    originBasisId: "knauf_lsf_dynamic_benchmark_lane",
    confidencePosture: "framed-wall benchmark fit",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedDynamicFamily: "stud_wall_system",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["studType metadata keeps LSF on stud-wall lane", "field outputs stay finite"],
    evidencePaths: [
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"
    ]
  },
  {
    id: "wall.timber_stud_formula.field",
    source: "generated_case",
    generatedCaseId: "wall-timber-stud",
    mode: "field",
    studyMode: "wall",
    family: "wall_timber_stud",
    evidenceTier: "formula",
    originBasisId: "wood_stud_formula_owned_lane",
    confidencePosture: "formula-owned timber stud lane awaiting precise exact topology",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "runtime_widening",
    candidateRank: 2,
    expectedDynamicFamily: "stud_wall_system",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["wood_stud metadata stays active", "does not promote parked timber preset to exact"],
    evidencePaths: [
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
      "apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts"
    ]
  },
  {
    id: "wall.concrete_heavy_core_screening.field",
    source: "generated_case",
    generatedCaseId: "wall-screening-concrete",
    mode: "field",
    studyMode: "wall",
    family: "wall_concrete_or_heavy_core_lined",
    evidenceTier: "screening",
    originBasisId: "lined_massive_wall_screening_lane",
    confidencePosture: "screening/high-user-value wall lane",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "runtime_widening",
    candidateRank: 1,
    expectedDynamicFamily: "lined_massive_wall",
    expectedRwPrimeDb: 55,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["heavy-core field outputs stay finite", "next runtime slice must source/tighten before claiming benchmark"],
    evidencePaths: [
      "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
      "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts"
    ]
  },
  {
    id: "wall.heavy_composite_screening.field",
    source: "generated_case",
    generatedCaseId: "wall-heavy-composite-hint-suppression",
    mode: "field",
    studyMode: "wall",
    family: "wall_concrete_or_heavy_core_lined",
    evidenceTier: "screening",
    originBasisId: "double_leaf_heavy_composite_lane",
    confidencePosture: "screening double-leaf heavy composite lane",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "double_leaf",
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["hint-suppression wall stays out of unrelated floor helper routes", "field outputs stay finite"],
    evidencePaths: [
      "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-heavy-core.test.ts"
    ]
  },
  {
    id: "wall.mixed_board_single_board.field",
    source: "custom_layers",
    layers: MIXED_BOARD_SINGLE_BOARD_LAYERS,
    options: {
      airborneContext: MIXED_BOARD_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    },
    studyMode: "wall",
    family: "wall_mixed_board_single_board",
    evidenceTier: "benchmark",
    originBasisId: "mixed_enhanced_filled_single_board_field_corridor",
    confidencePosture: "mixed-board single-board corridor benchmark fit",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "stud_wall_system",
    expectedRwPrimeDb: 35,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["mixed-board field correction stays active", "premium/single-board lane stays explicitly low-confidence"],
    evidencePaths: [
      "packages/engine/src/airborne-mixed-enhanced-framed-benchmark.test.ts",
      "packages/engine/src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts"
    ]
  },
  {
    id: "wall.resilient_bar_auto.building",
    source: "resilient_side_count_corpus",
    rowId: "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    resilientBarSideCount: "auto",
    studyMode: "wall",
    family: "wall_resilient_bar_auto",
    evidenceTier: "benchmark",
    originBasisId: "legacy_auto_resilient_bar_side_count_blind_lane",
    confidencePosture: "legacy auto side-count broad corridor",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedDynamicFamily: "stud_wall_system",
    expectedRwPrimeDb: 55,
    expectedSupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
    expectedUnsupported: ["Rw"],
    invariants: ["auto remains side-count blind", "building field outputs stay finite"],
    evidencePaths: [
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ]
  },
  {
    id: "wall.resilient_bar_one_side.building",
    source: "resilient_side_count_corpus",
    rowId: "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    resilientBarSideCount: "one_side",
    studyMode: "wall",
    family: "wall_resilient_bar_one_side",
    evidenceTier: "exact",
    originBasisId: "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
    confidencePosture: "explicit one-side resilient-bar exact import",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedDynamicFamily: "stud_wall_system",
    expectedRwPrimeDb: 50,
    expectedSupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
    expectedUnsupported: ["Rw"],
    invariants: ["explicit one-side row does not collapse to auto", "side-count exact import stays selected"],
    evidencePaths: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ]
  },
  {
    id: "wall.resilient_bar_both_sides.building",
    source: "resilient_side_count_corpus",
    rowId: "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    resilientBarSideCount: "both_sides",
    studyMode: "wall",
    family: "wall_resilient_bar_both_sides",
    evidenceTier: "exact",
    originBasisId: "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
    confidencePosture: "explicit both-sides resilient-bar exact import",
    engineSupportBucket: "partial",
    webCardStatus: "covered",
    candidateType: "coverage_confirmed",
    expectedDynamicFamily: "stud_wall_system",
    expectedRwPrimeDb: 53,
    expectedSupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
    expectedUnsupported: ["Rw"],
    invariants: ["both-sides row remains distinct from one-side row", "side-count exact import stays selected"],
    evidencePaths: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ]
  },
  {
    id: "wall.deep_hybrid_aac_d700_100.building",
    source: "deep_hybrid_representative",
    deepHybridFamily: "aac_d700_100",
    studyMode: "wall",
    family: "wall_deep_hybrid_aac_d700_100",
    evidenceTier: "family",
    originBasisId: "deep_hybrid_swap_aac_d700_100_invariant_lane",
    confidencePosture: "engine stress corridor; web route parity already pinned",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "lined_massive_wall",
    expectedRwPrimeDb: 44,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["no silent deep-hybrid swap jumps", "family remains lined massive"],
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-aac-d700-100.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-100.test.ts"
    ]
  },
  {
    id: "wall.deep_hybrid_aac_d700_120.building",
    source: "deep_hybrid_representative",
    deepHybridFamily: "aac_d700_120",
    studyMode: "wall",
    family: "wall_deep_hybrid_aac_d700_120",
    evidenceTier: "family",
    originBasisId: "deep_hybrid_swap_aac_d700_120_invariant_lane",
    confidencePosture: "engine stress corridor; web route parity already pinned",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "lined_massive_wall",
    expectedRwPrimeDb: 47,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["no silent deep-hybrid swap jumps", "family remains lined massive"],
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-aac-d700-120.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-120.test.ts"
    ]
  },
  {
    id: "wall.deep_hybrid_aac_g5.building",
    source: "deep_hybrid_representative",
    deepHybridFamily: "aac_g5",
    studyMode: "wall",
    family: "wall_deep_hybrid_aac_g5",
    evidenceTier: "family",
    originBasisId: "deep_hybrid_swap_aac_g5_invariant_lane",
    confidencePosture: "engine stress corridor; web route parity already pinned",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "lined_massive_wall",
    expectedRwPrimeDb: 46,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["no silent deep-hybrid swap jumps", "family remains lined massive"],
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-aac-g5.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-g5.test.ts"
    ]
  },
  {
    id: "wall.deep_hybrid_heavy_core.building",
    source: "deep_hybrid_representative",
    deepHybridFamily: "heavy_core",
    studyMode: "wall",
    family: "wall_deep_hybrid_heavy_core",
    evidenceTier: "family",
    originBasisId: "deep_hybrid_swap_heavy_core_invariant_lane",
    confidencePosture: "engine stress corridor; web route parity already pinned",
    engineSupportBucket: "supported",
    webCardStatus: "covered",
    candidateType: "value_pin_only",
    expectedDynamicFamily: "lined_massive_wall",
    expectedRwPrimeDb: 48,
    expectedSupported: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    expectedUnsupported: [],
    invariants: ["no silent deep-hybrid swap jumps", "family remains lined massive"],
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-heavy-core.test.ts"
    ]
  }
];

function repoPathExists(path: string): boolean {
  return existsSync(join(REPO_ROOT, path));
}

function sameMembers(left: readonly RequestedOutputId[], right: readonly RequestedOutputId[]) {
  expect([...left].sort()).toEqual([...right].sort());
}

function findGeneratedCase(cell: GeneratedCell) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === cell.generatedCaseId);
  expect(found, cell.generatedCaseId).toBeDefined();

  if (!found) {
    throw new Error(`Missing generated cartography case ${cell.generatedCaseId}`);
  }

  return found;
}

function isResilientSideCountRow(
  row: (typeof WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS)[number]
): row is WallTimberLightweightOfficialSourceRow {
  return (
    row.kind === "official_row" &&
    (
      row.topology === "timber_resilient_bar_one_side_double_board" ||
      row.topology === "timber_resilient_bar_both_sides_double_board"
    )
  );
}

function findResilientSideCountRow(cell: ResilientSideCountCell): WallTimberLightweightOfficialSourceRow {
  const row = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
    (entry): entry is WallTimberLightweightOfficialSourceRow =>
      isResilientSideCountRow(entry) && entry.id === cell.rowId
  );
  expect(row, cell.rowId).toBeDefined();

  if (!row) {
    throw new Error(`Missing resilient side-count row ${cell.rowId}`);
  }

  return row;
}

function resilientBuildingContext(
  row: WallTimberLightweightOfficialSourceRow,
  sideCount: ResilientSideCountCell["resilientBarSideCount"]
): AirborneContext {
  return {
    ...row.airborneContext,
    contextMode: "building_prediction",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    receivingRoomRt60S: 0.7,
    receivingRoomVolumeM3: 55,
    resilientBarSideCount: sideCount
  };
}

function deepHybridCore(family: DeepHybridFamily) {
  if (family === "aac_d700_100") return DEEP_HYBRID_CORES[0];
  if (family === "aac_d700_120") return DEEP_HYBRID_CORES[1];
  if (family === "aac_g5") return DEEP_HYBRID_CORES[2];
  return DEEP_HYBRID_CORES[3];
}

function evaluateCell(cell: CartographyCell) {
  if (cell.source === "generated_case") {
    const testCase = findGeneratedCase(cell);
    const options = cell.mode === "lab" ? testCase.labOptions : testCase.fieldOptions;

    if (!options) {
      throw new Error(`Missing ${cell.mode} cartography options for ${cell.generatedCaseId}`);
    }

    const result = calculateAssembly(testCase.rows, options);
    return { result, requestedOutputs: options.targetOutputs ?? [] };
  }

  if (cell.source === "resilient_side_count_corpus") {
    const row = findResilientSideCountRow(cell);
    const result = calculateAssembly(row.layers, {
      airborneContext: resilientBuildingContext(row, cell.resilientBarSideCount),
      calculator: "dynamic",
      targetOutputs: WALL_BUILDING_OUTPUTS
    });
    return { result, requestedOutputs: WALL_BUILDING_OUTPUTS };
  }

  if (cell.source === "deep_hybrid_representative") {
    const layers = buildDeepHybridStack({
      board: FAST_BOARD_PAIR[0],
      cavityPack: DEEP_HYBRID_CAVITY_PACKS[0],
      core: deepHybridCore(cell.deepHybridFamily),
      prefix: [],
      suffix: []
    });
    const result = calculateAssembly(layers, {
      airborneContext: DEEP_HYBRID_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    return { result, requestedOutputs: WALL_FIELD_OUTPUTS };
  }

  const result = calculateAssembly(cell.layers, cell.options);
  return { result, requestedOutputs: cell.options.targetOutputs ?? [] };
}

describe("realistic layer-combination coverage cartography Gate A", () => {
  it("keeps the representative family map broad, evidence-tiered, and backed by live artifacts", () => {
    const families = new Set(CARTOGRAPHY_CELLS.map((cell) => cell.family));
    const failures: string[] = [];

    for (const required of [...REQUIRED_FLOOR_FAMILIES, ...REQUIRED_WALL_FAMILIES]) {
      if (!families.has(required)) {
        failures.push(`missing representative family ${required}`);
      }
    }

    for (const cell of CARTOGRAPHY_CELLS) {
      if (cell.invariants.length === 0) {
        failures.push(`${cell.id}: missing invariants`);
      }
      if (!cell.confidencePosture) {
        failures.push(`${cell.id}: missing confidence posture`);
      }
      if (cell.evidencePaths.length === 0) {
        failures.push(`${cell.id}: missing evidence paths`);
      }
      for (const evidencePath of cell.evidencePaths) {
        if (!repoPathExists(evidencePath)) {
          failures.push(`${cell.id}: missing evidence artifact ${evidencePath}`);
        }
      }
      if (cell.evidenceTier === "exact" && cell.candidateType === "runtime_widening") {
        failures.push(`${cell.id}: exact rows must not be runtime-widening candidates`);
      }
      if (cell.candidateType === "source_blocked" && !["fail_closed", "formula"].includes(cell.evidenceTier)) {
        failures.push(`${cell.id}: source-blocked rows must stay fail-closed or visible-formula`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("executes every engine-backed cartography cell and pins support/origin posture", () => {
    for (const cell of CARTOGRAPHY_CELLS) {
      const { result, requestedOutputs } = evaluateCell(cell);
      const snapshot = resultSnapshot(result);
      const accountedOutputs = [...result.supportedTargetOutputs, ...result.unsupportedTargetOutputs];

      sameMembers(accountedOutputs, requestedOutputs);
      sameMembers(result.supportedTargetOutputs, cell.expectedSupported);
      sameMembers(result.unsupportedTargetOutputs, cell.expectedUnsupported);

      if (cell.expectedFloorSystemMatchId !== undefined) {
        expect(snapshot.floorSystemMatchId, `${cell.id} floor match`).toBe(cell.expectedFloorSystemMatchId);
      }
      if (cell.expectedBoundFloorSystemMatchId !== undefined) {
        expect(snapshot.boundFloorSystemMatchId, `${cell.id} bound match`).toBe(cell.expectedBoundFloorSystemMatchId);
      }
      if (cell.expectedFloorSystemEstimateKind !== undefined) {
        expect(snapshot.floorSystemEstimateKind, `${cell.id} floor estimate`).toBe(
          cell.expectedFloorSystemEstimateKind
        );
      }
      if (cell.expectedDynamicFamily !== undefined) {
        expect(snapshot.dynamicFamily, `${cell.id} dynamic family`).toBe(cell.expectedDynamicFamily);
      }
      if (cell.expectedImpactBasisIncludes) {
        expect(snapshot.impactBasis, `${cell.id} impact basis`).toContain(cell.expectedImpactBasisIncludes);
      }
      if (typeof cell.expectedRwDb === "number") {
        expect(snapshot.rwDb, `${cell.id} Rw`).toBe(cell.expectedRwDb);
      }
      if (typeof cell.expectedRwPrimeDb === "number") {
        expect(snapshot.rwPrimeDb, `${cell.id} R'w`).toBe(cell.expectedRwPrimeDb);
      }
      if (cell.engineSupportBucket === "supported") {
        expect(result.supportedTargetOutputs.length, `${cell.id} supported outputs`).toBeGreaterThan(0);
        expect(result.unsupportedTargetOutputs, `${cell.id} unsupported outputs`).toEqual([]);
      }
      if (cell.engineSupportBucket === "fail_closed") {
        expect(result.unsupportedTargetOutputs.length, `${cell.id} unsupported outputs`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Gate A candidate ranking tied to weak evidence, not nearby green tests", () => {
    const runtimeCandidates = CARTOGRAPHY_CELLS.filter((cell) => cell.candidateType === "runtime_widening")
      .sort((left, right) => (left.candidateRank ?? 999) - (right.candidateRank ?? 999))
      .map((cell) => ({
        evidenceTier: cell.evidenceTier,
        family: cell.family,
        id: cell.id,
        rank: cell.candidateRank
      }));

    expect(runtimeCandidates).toEqual([
      {
        evidenceTier: "screening",
        family: "wall_concrete_or_heavy_core_lined",
        id: "wall.concrete_heavy_core_screening.field",
        rank: 1
      },
      {
        evidenceTier: "formula",
        family: "wall_timber_stud",
        id: "wall.timber_stud_formula.field",
        rank: 2
      },
      {
        evidenceTier: "formula",
        family: "wall_clt_mass_timber",
        id: "wall.clt_formula.field",
        rank: 3
      },
      {
        evidenceTier: "screening",
        family: "floor_open_web_or_open_box",
        id: "floor.steel_fallback_low_confidence.field",
        rank: 5
      }
    ]);

    expect(CARTOGRAPHY_CELLS.filter((cell) => cell.candidateType === "source_blocked").map((cell) => cell.id)).toEqual([
      "floor.tuas_c11c_fail_closed.field",
      "floor.dataholz_gdmtxa04a_visible_formula.field"
    ]);
  });
});
