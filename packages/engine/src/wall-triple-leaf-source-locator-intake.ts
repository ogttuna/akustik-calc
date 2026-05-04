import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafSourceEvidenceAcquisition,
  type WallTripleLeafSourceEvidenceAcquisitionEvaluation,
  type WallTripleLeafSourceEvidenceRequirementId
} from "./wall-triple-leaf-source-evidence-acquisition";

export type WallTripleLeafSourceLocatorClassification =
  | "adjacent_context_only"
  | "direct_measured_row_locator_full_curve_needed"
  | "flow_resistivity_density_equivalence_pack_context_only"
  | "rejected_context"
  | "reproducible_graph_digitized_adjacent_source_family";

export type WallTripleLeafSourceLocatorEvidenceUse =
  | "comparator_for_negative_boundary"
  | "equivalence_context_only"
  | "rejected_for_gate_o"
  | "selected_primary_for_gate_o_full_curve_retrieval";

export type WallTripleLeafSourceLocatorId =
  | "nrc_1998_gypsum_board_walls_baseline_numeric_rows"
  | "nrc_2024_internal_board_glass_fiber_92mm_source_family"
  | "uris_1999_rockwool_bulk_density_double_wall"
  | "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
  | "wang_2022_lightweight_double_leaf_stone_wool_glass_wool";

export type WallTripleLeafSourceLocatorCandidate = {
  classification: WallTripleLeafSourceLocatorClassification;
  coversGateMGapIds: readonly WallTripleLeafSourceEvidenceRequirementId[];
  evidenceUse: WallTripleLeafSourceLocatorEvidenceUse;
  has50MmClassMineralWoolCavity: boolean;
  hasAccessibleFullBandCurveNow: boolean;
  hasInternalLeaf: boolean;
  hasMeasuredSoundReductionData: boolean;
  hasRockwoolOrMineralWool: boolean;
  id: WallTripleLeafSourceLocatorId;
  locator: string;
  missingForRuntime: readonly string[];
  publicationIdentity: string;
  reportedMetricContext: readonly string[];
  runtimeImportReadyNow: false;
  sourceLabel: string;
  sourceUrl: string;
  topologyContext: readonly string[];
};

export type WallTripleLeafSourceLocatorIntakeEvaluation = {
  acceptedLocatorCount: number;
  apiShapeChange: false;
  candidateLocators: readonly WallTripleLeafSourceLocatorCandidate[];
  confidencePromotion: false;
  directMeasuredLocatorCount: number;
  evidencePromotion: false;
  failClosedStrategy: "multileaf_screening_blend";
  fullCurveReadyForLocalRuntimeCount: 0;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  rejectedLocatorCount: number;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  runtimePromotionReadyNow: false;
  selectedComparatorLocators: readonly WallTripleLeafSourceLocatorCandidate[];
  selectedEquivalenceContextLocators: readonly WallTripleLeafSourceLocatorCandidate[];
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectedNextFile;
  selectedPrimaryLocator: WallTripleLeafSourceLocatorCandidate;
  sourceEvidenceAcquisitionEvaluation: WallTripleLeafSourceEvidenceAcquisitionEvaluation;
  sourceLocatorPackReadyForRuntime: false;
  supportPromotion: false;
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_n_rockwool_two_cavity_source_locator_intake_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_o_full_curve_retrieval_and_provenance_qc_no_runtime",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts",
  selectionStatus:
    "gate_n_classified_rockwool_two_cavity_source_locators_no_runtime_selected_full_curve_retrieval_and_provenance_gate_o",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES: readonly WallTripleLeafSourceLocatorCandidate[] = [
  {
    classification: "direct_measured_row_locator_full_curve_needed",
    coversGateMGapIds: ["rockwool_absorber_equivalence_or_measured_row", "local_50mm_rockwool_cavity_source_row"],
    evidenceUse: "selected_primary_for_gate_o_full_curve_retrieval",
    has50MmClassMineralWoolCavity: true,
    hasAccessibleFullBandCurveNow: false,
    hasInternalLeaf: true,
    hasMeasuredSoundReductionData: true,
    hasRockwoolOrMineralWool: true,
    id: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame",
    locator:
      "Applied Acoustics 67(9), pages 918-925, DOI 10.1016/j.apacoust.2005.11.006, figures/results for double-frame partitions with an internal gypsum board layer",
    missingForRuntime: [
      "full one-third-octave sound-reduction curves for the tested double-frame and internal-board specimens",
      "exact gypsum board surface mass, mineral-wool density/flow-resistivity, support gauge, and coupling details mapped to local inputs",
      "Rw/STC derivation and uncertainty owner from the same band data",
      "negative boundaries against using the reported weighted-index decrease as a fixed runtime penalty"
    ],
    publicationIdentity:
      "Uris, Bravo, Gomez-Lozano, Ramirez, Llinares 2006, Sound insulation of double frame partitions with an internal gypsum board layer",
    reportedMetricContext: [
      "measured sound reduction index data are reported by the paper",
      "weighted sound reduction index decrease is reported around 7-8 dB for internal-board triple-leaf variants",
      "low-frequency degradation is attributed to the internal gypsum board leaf"
    ],
    runtimeImportReadyNow: false,
    sourceLabel: "Uris 2006 internal-gypsum double-frame mineral-wool partition",
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X05001799",
    topologyContext: [
      "two separate 50 x 50 mm steel frames",
      "each frame fitted with 50 mm mineral wool",
      "frames separated by a 100 mm air gap",
      "internal gypsum board layer creates a triple-leaf partition"
    ]
  },
  {
    classification: "reproducible_graph_digitized_adjacent_source_family",
    coversGateMGapIds: ["rockwool_absorber_equivalence_or_measured_row", "local_50mm_rockwool_cavity_source_row"],
    evidenceUse: "comparator_for_negative_boundary",
    has50MmClassMineralWoolCavity: false,
    hasAccessibleFullBandCurveNow: true,
    hasInternalLeaf: true,
    hasMeasuredSoundReductionData: true,
    hasRockwoolOrMineralWool: false,
    id: "nrc_2024_internal_board_glass_fiber_92mm_source_family",
    locator: "NRC 2024 Table 1 assemblies A-D, Figure 4 absolute TL curves, Figure 5 delta curves",
    missingForRuntime: [
      "local rockwool/mineral-wool equivalence against the NRC glass-fiber batt absorber",
      "50 mm cavity substitution tolerance against the NRC 92.1 mm cavity source family",
      "local Type C gypsum board and support topology mapping"
    ],
    publicationIdentity:
      "Mahn, Skoda, Cunha 2024, The transmission loss of double stud walls with layers of gypsum board installed inside the wall cavity",
    reportedMetricContext: [
      "Gate G2B/G3 already digitized and calibrated the NRC-like source family",
      "reported STC rows and derived Rw/STC checks are available for A-D",
      "the source uses glass-fiber batt and 92.1 mm cavities, not local 50 mm rockwool cavities"
    ],
    runtimeImportReadyNow: false,
    sourceLabel: "NRC 2024 internal-board double-stud source family",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/accepted/?id=768bf32f-8313-435f-ab85-8680efba61b2",
    topologyContext: [
      "double 18 gauge 92.1 mm steel studs at 610 mm centers",
      "one or two internal 12.7 mm Type C gypsum board layers",
      "92.1 mm glass-fiber batt in most variants",
      "25.4 mm spacing to the internal board in the source family"
    ]
  },
  {
    classification: "flow_resistivity_density_equivalence_pack_context_only",
    coversGateMGapIds: ["rockwool_absorber_equivalence_or_measured_row"],
    evidenceUse: "equivalence_context_only",
    has50MmClassMineralWoolCavity: false,
    hasAccessibleFullBandCurveNow: false,
    hasInternalLeaf: false,
    hasMeasuredSoundReductionData: true,
    hasRockwoolOrMineralWool: true,
    id: "uris_1999_rockwool_bulk_density_double_wall",
    locator: "Applied Acoustics 58(3), pages 327-331, DOI 10.1016/S0003-682X(98)00065-6",
    missingForRuntime: [
      "triple-leaf internal-board topology is absent",
      "50 mm two-cavity band curves are absent from the current local corpus",
      "density influence from ordinary double walls cannot be merged into triple-leaf runtime without tolerance proof"
    ],
    publicationIdentity:
      "Uris, Llopis, Llinares 1999, Effect of the rockwool bulk density on the airborne sound insulation of lightweight double walls",
    reportedMetricContext: [
      "laboratory double-wall sound insulation measurements are reported",
      "rockwool bulk density influence is relevant to absorber equivalence only",
      "the source is not an internal-leaf triple-leaf source row"
    ],
    runtimeImportReadyNow: false,
    sourceLabel: "Uris 1999 rockwool bulk-density double-wall study",
    sourceUrl: "https://pascal-francis.inist.fr/vibad/index.php?action=getRecordDetail&idt=5805244",
    topologyContext: [
      "lightweight double walls with rockwool in the gap",
      "no internal gypsum board leaf",
      "useful for rockwool absorber equivalence research, not exact triple-leaf runtime"
    ]
  },
  {
    classification: "adjacent_context_only",
    coversGateMGapIds: ["rockwool_absorber_equivalence_or_measured_row"],
    evidenceUse: "equivalence_context_only",
    has50MmClassMineralWoolCavity: false,
    hasAccessibleFullBandCurveNow: false,
    hasInternalLeaf: false,
    hasMeasuredSoundReductionData: true,
    hasRockwoolOrMineralWool: true,
    id: "wang_2022_lightweight_double_leaf_stone_wool_glass_wool",
    locator: "Applied Acoustics 197, 108907, lightweight double-leaf panel parameter study",
    missingForRuntime: [
      "not a triple-leaf internal-board wall",
      "does not own the local 50 mm two-cavity source row",
      "stone/glass wool observations are adjacent absorber context only"
    ],
    publicationIdentity: "Wang et al. 2022, Experimental study on airborne sound insulation performance of lightweight double leaf panels",
    reportedMetricContext: [
      "double-leaf measurements compare stone wool and glass wool cavity filling",
      "the source discusses absorber type and thickness as double-leaf parameters",
      "it does not provide the internal-board triple-leaf source row required by Gate N"
    ],
    runtimeImportReadyNow: false,
    sourceLabel: "Wang 2022 lightweight double-leaf stone/glass wool context",
    sourceUrl: "https://www.sciencedirect.com/science/article/pii/S0003682X2200281X",
    topologyContext: [
      "lightweight double-leaf wall parameter study",
      "stone wool or glass wool cavity filling",
      "no internal gypsum board leaf"
    ]
  },
  {
    classification: "rejected_context",
    coversGateMGapIds: [],
    evidenceUse: "rejected_for_gate_o",
    has50MmClassMineralWoolCavity: false,
    hasAccessibleFullBandCurveNow: true,
    hasInternalLeaf: false,
    hasMeasuredSoundReductionData: true,
    hasRockwoolOrMineralWool: false,
    id: "nrc_1998_gypsum_board_walls_baseline_numeric_rows",
    locator: "NRC 1998 gypsum board wall TL Appendix rows with numeric one-third-octave data",
    missingForRuntime: [
      "ordinary gypsum-board wall rows do not contain an internal leaf",
      "representative rows are baseline/negative-boundary data only",
      "numeric bands must not be promoted into the rockwool two-cavity lane"
    ],
    publicationIdentity: "Halliwell, Nightingale, Warnock, Birta 1998, Gypsum Board Walls: Transmission Loss Data",
    reportedMetricContext: [
      "numeric one-third-octave TL rows exist",
      "rows are useful for parser and negative-boundary controls",
      "not a rockwool two-cavity triple-leaf source locator"
    ],
    runtimeImportReadyNow: false,
    sourceLabel: "NRC 1998 gypsum-board wall baseline rows",
    sourceUrl: "https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f",
    topologyContext: [
      "ordinary gypsum-board wall specimens",
      "no internal gypsum board leaf",
      "baseline and negative-boundary use only for Gate N"
    ]
  }
] as const;

function selectedPrimaryLocator(): WallTripleLeafSourceLocatorCandidate {
  const locator = WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.find(
    (candidate) => candidate.evidenceUse === "selected_primary_for_gate_o_full_curve_retrieval"
  );

  if (!locator) {
    throw new Error("Gate N requires one primary locator for Gate O full-curve retrieval.");
  }

  return locator;
}

export function evaluateWallTripleLeafSourceLocatorIntake(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceEvidenceAcquisitionEvaluation?: WallTripleLeafSourceEvidenceAcquisitionEvaluation;
}): WallTripleLeafSourceLocatorIntakeEvaluation {
  const sourceEvidenceAcquisitionEvaluation =
    input.sourceEvidenceAcquisitionEvaluation ??
    evaluateWallTripleLeafSourceEvidenceAcquisition({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const selectedPrimary = selectedPrimaryLocator();
  const acceptedLocators = WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.filter(
    (candidate) => candidate.evidenceUse !== "rejected_for_gate_o"
  );
  const directMeasuredLocators = WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.filter(
    (candidate) => candidate.classification === "direct_measured_row_locator_full_curve_needed"
  );

  return {
    acceptedLocatorCount: acceptedLocators.length,
    apiShapeChange: false,
    candidateLocators: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES,
    confidencePromotion: false,
    directMeasuredLocatorCount: directMeasuredLocators.length,
    evidencePromotion: false,
    failClosedStrategy: sourceEvidenceAcquisitionEvaluation.failClosedStrategy,
    fullCurveReadyForLocalRuntimeCount: 0,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    rejectedLocatorCount: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.length - acceptedLocators.length,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    runtimePromotionReadyNow: false,
    selectedComparatorLocators: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.filter(
      (candidate) => candidate.evidenceUse === "comparator_for_negative_boundary"
    ),
    selectedEquivalenceContextLocators: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_CANDIDATES.filter(
      (candidate) => candidate.evidenceUse === "equivalence_context_only"
    ),
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectedNextFile,
    selectedPrimaryLocator: selectedPrimary,
    sourceEvidenceAcquisitionEvaluation,
    sourceLocatorPackReadyForRuntime: false,
    supportPromotion: false,
    workbenchInputBehaviorChange: false
  };
}
