import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { ksRound1 } from "./math";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  evaluateWallTripleLeafCalibrationFit,
  type WallTripleLeafCalibrationFitEvaluation
} from "./wall-triple-leaf-calibration-fit";

export type WallTripleLeafLocalMappingStatus = "blocked" | "owned" | "outside_source_family";

export type WallTripleLeafLocalMaterialMappingDecisionId =
  | "local_gypsum_board_to_nrc_type_c"
  | "local_rockwool_to_nrc_glass_fiber_batt"
  | "local_mlv_membrane"
  | "local_gypsum_plaster_finish";

export type WallTripleLeafLocalTopologyMappingDecisionId =
  | "complete_grouped_triple_leaf_topology"
  | "source_family_cavity_depth_and_fill"
  | "source_family_internal_leaf"
  | "source_family_support_topology"
  | "source_family_leaf_surface_buildups";

export type WallTripleLeafLocalMaterialMappingDecision = {
  blocker: string | null;
  id: WallTripleLeafLocalMaterialMappingDecisionId;
  localMaterialIds: readonly string[];
  notes: readonly string[];
  sourceFamilyRequirement: string;
  status: WallTripleLeafLocalMappingStatus;
};

export type WallTripleLeafLocalTopologyMappingDecision = {
  blocker: string | null;
  id: WallTripleLeafLocalTopologyMappingDecisionId;
  localObservation: string;
  notes: readonly string[];
  sourceFamilyRequirement: string;
  status: WallTripleLeafLocalMappingStatus;
};

export type WallTripleLeafLocalLeafMassSummary = {
  id: "side_a_leaf" | "internal_leaf" | "side_b_leaf";
  layerIndices: readonly number[];
  materialIds: readonly string[];
  surfaceMassKgM2: number;
};

export type WallTripleLeafLocalMaterialMappingEvaluation = {
  blockers: readonly string[];
  calibrationFit: WallTripleLeafCalibrationFitEvaluation;
  confidencePromotion: false;
  groupedTopologyComplete: boolean;
  leafMasses: readonly WallTripleLeafLocalLeafMassSummary[];
  localMappingOwned: boolean;
  materialDecisions: readonly WallTripleLeafLocalMaterialMappingDecision[];
  negativeBoundariesPreserved: boolean;
  numericRuntimeBehaviorChange: false;
  pairedVisibleRuntimeTestsReady: false;
  runtimeBlockers: readonly string[];
  runtimeEligibleNow: false;
  runtimeImportReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectedNextFile;
  sourceFamilyCalibrationPass: boolean;
  topologyDecisions: readonly WallTripleLeafLocalTopologyMappingDecision[];
};

type ResolvedLocalLayer = LayerInput & {
  material: MaterialDefinition;
  surfaceMassKgM2: number;
};

type RequiredTopology = {
  cavity1AbsorptionClass?: string;
  cavity1DepthMm?: number;
  cavity1FillCoverage?: string;
  cavity1LayerIndices?: readonly number[];
  cavity2AbsorptionClass?: string;
  cavity2DepthMm?: number;
  cavity2FillCoverage?: string;
  cavity2LayerIndices?: readonly number[];
  internalLeafCoupling?: string;
  internalLeafLayerIndices?: readonly number[];
  sideALeafLayerIndices?: readonly number[];
  sideBLeafLayerIndices?: readonly number[];
  supportTopology?: string;
  topologyMode?: string;
};

export const WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS = {
  absorber: "92.1 mm glass-fiber batt in each source-family cavity except separate Assembly C fill-regime context",
  cavityDepthMm: 92.1,
  internalBoardSpacingMm: 25.4,
  leafBoard: "12.7 mm Type C gypsum board, 9.80 kg/m2",
  studGauge: "18 gauge",
  studSpacingMm: 610,
  support: "double 18 gauge 92.1 mm steel studs at 610 mm centers"
} as const;

export const WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g4_local_material_mapping_and_runtime_eligibility_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g5_blocked_diagnostics_and_source_acquisition_decision",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts",
  selectionStatus:
    "gate_g4_blocked_local_material_and_topology_mapping_no_runtime_selected_blocked_diagnostics_and_source_acquisition_gate_g5",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceFamilyCalibrationPass: true,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

function hasLayerGroup(value: readonly number[] | undefined): value is readonly number[] {
  return Array.isArray(value) && value.length > 0;
}

function hasKnownToken(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function resolveLocalLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): readonly ResolvedLocalLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: ksRound1(computeLayerSurfaceMassKgM2(layer, material))
    };
  });
}

function layerIds(indices: readonly number[] | undefined, layers: readonly ResolvedLocalLayer[]): readonly string[] {
  if (!indices) {
    return [];
  }

  return indices.map((index) => layers[index]?.material.id ?? `missing_layer_${String(index)}`);
}

function summarizeLeaf(
  id: WallTripleLeafLocalLeafMassSummary["id"],
  indices: readonly number[] | undefined,
  layers: readonly ResolvedLocalLayer[]
): WallTripleLeafLocalLeafMassSummary {
  const layerIndices = indices ?? [];
  const selectedLayers = layerIndices.map((index) => layers[index]).filter((layer): layer is ResolvedLocalLayer => Boolean(layer));

  return {
    id,
    layerIndices,
    materialIds: selectedLayers.map((layer) => layer.material.id),
    surfaceMassKgM2: ksRound1(selectedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0))
  };
}

function buildMaterialDecisions(layers: readonly ResolvedLocalLayer[]): readonly WallTripleLeafLocalMaterialMappingDecision[] {
  const materialIds = new Set(layers.map((layer) => layer.material.id));
  const gypsumLayer = layers.find((layer) => layer.material.id === "gypsum_board" && layer.thicknessMm >= 12 && layer.thicknessMm <= 13);
  const gypsumSurfaceMass = gypsumLayer ? ksRound1(gypsumLayer.surfaceMassKgM2) : null;

  return [
    {
      blocker: "local_generic_gypsum_board_to_nrc_type_c_mapping_not_owned",
      id: "local_gypsum_board_to_nrc_type_c",
      localMaterialIds: materialIds.has("gypsum_board") ? ["gypsum_board"] : [],
      notes: [
        gypsumSurfaceMass === null
          ? "No local 12-13 mm gypsum_board layer was found in the evaluated stack."
          : `Local gypsum_board is catalog-mass ${gypsumSurfaceMass} kg/m2 at ${String(gypsumLayer?.thicknessMm)} mm, while the NRC source row names Type C board at 9.80 kg/m2.`,
        "Generic gypsum_board does not encode Type C board identity, paper facing, core type, or tested product family."
      ],
      sourceFamilyRequirement: WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.leafBoard,
      status: "blocked"
    },
    {
      blocker: "local_rockwool_to_nrc_glass_fiber_batt_mapping_not_owned",
      id: "local_rockwool_to_nrc_glass_fiber_batt",
      localMaterialIds: materialIds.has("rockwool") ? ["rockwool"] : [],
      notes: [
        "The source-family absorber is glass-fiber batt; the local stack uses rockwool.",
        "No owned flow-resistivity, density-equivalence, or one-third-octave tolerance row proves this substitution for the calibrated triple-leaf lane."
      ],
      sourceFamilyRequirement: WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.absorber,
      status: "blocked"
    },
    {
      blocker: materialIds.has("mlv") ? "local_mlv_absent_from_nrc_source_family" : null,
      id: "local_mlv_membrane",
      localMaterialIds: materialIds.has("mlv") ? ["mlv"] : [],
      notes: [
        "NRC 2024 source-family rows do not include a limp-mass membrane in either face leaf or the internal leaf.",
        "A local MLV layer changes leaf mass and damping; it needs a source row or bounded effect model before exact promotion."
      ],
      sourceFamilyRequirement: "No MLV layer in the NRC 2024 source-family assemblies A/B/D",
      status: materialIds.has("mlv") ? "outside_source_family" : "owned"
    },
    {
      blocker: materialIds.has("gypsum_plaster") ? "local_gypsum_plaster_absent_from_nrc_source_family" : null,
      id: "local_gypsum_plaster_finish",
      localMaterialIds: materialIds.has("gypsum_plaster") ? ["gypsum_plaster"] : [],
      notes: [
        "NRC 2024 source-family rows use board leaves, not wet gypsum plaster as an added face finish.",
        "The plaster layer changes side-leaf surface mass and finish regime and is outside the calibrated source family."
      ],
      sourceFamilyRequirement: "No gypsum plaster finish in the NRC 2024 source-family assemblies A/B/D",
      status: materialIds.has("gypsum_plaster") ? "outside_source_family" : "owned"
    }
  ] as const;
}

function isGroupedTopologyComplete(topology: RequiredTopology | undefined): boolean {
  if (topology?.topologyMode !== "grouped_triple_leaf") {
    return false;
  }

  return (
    hasLayerGroup(topology.sideALeafLayerIndices) &&
    hasLayerGroup(topology.cavity1LayerIndices) &&
    hasLayerGroup(topology.internalLeafLayerIndices) &&
    hasLayerGroup(topology.cavity2LayerIndices) &&
    hasLayerGroup(topology.sideBLeafLayerIndices) &&
    typeof topology.cavity1DepthMm === "number" &&
    topology.cavity1DepthMm > 0 &&
    typeof topology.cavity2DepthMm === "number" &&
    topology.cavity2DepthMm > 0 &&
    hasKnownToken(topology.cavity1FillCoverage) &&
    hasKnownToken(topology.cavity1AbsorptionClass) &&
    hasKnownToken(topology.cavity2FillCoverage) &&
    hasKnownToken(topology.cavity2AbsorptionClass) &&
    hasKnownToken(topology.internalLeafCoupling) &&
    hasKnownToken(topology.supportTopology)
  );
}

function formatDepths(topology: RequiredTopology | undefined): string {
  const first = typeof topology?.cavity1DepthMm === "number" ? `${String(topology.cavity1DepthMm)} mm` : "missing";
  const second = typeof topology?.cavity2DepthMm === "number" ? `${String(topology.cavity2DepthMm)} mm` : "missing";

  return `${first} / ${second}`;
}

function buildTopologyDecisions(
  topology: RequiredTopology | undefined,
  layers: readonly ResolvedLocalLayer[]
): readonly WallTripleLeafLocalTopologyMappingDecision[] {
  const groupedComplete = isGroupedTopologyComplete(topology);
  const cavityDepthsMatch =
    typeof topology?.cavity1DepthMm === "number" &&
    typeof topology.cavity2DepthMm === "number" &&
    Math.abs(topology.cavity1DepthMm - WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.cavityDepthMm) <= 3 &&
    Math.abs(topology.cavity2DepthMm - WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.cavityDepthMm) <= 3;
  const fullPorousFill =
    topology?.cavity1FillCoverage === "full" &&
    topology.cavity2FillCoverage === "full" &&
    topology.cavity1AbsorptionClass === "porous_absorptive" &&
    topology.cavity2AbsorptionClass === "porous_absorptive";
  const internalLeafIds = layerIds(topology?.internalLeafLayerIndices, layers);
  const sideLeafIds = [
    ...layerIds(topology?.sideALeafLayerIndices, layers),
    ...layerIds(topology?.sideBLeafLayerIndices, layers)
  ];
  const sideLeavesContainOutOfFamilyLayers = sideLeafIds.some((id) => id === "mlv" || id === "gypsum_plaster");

  return [
    {
      blocker: groupedComplete ? null : "complete_grouped_triple_leaf_topology_required",
      id: "complete_grouped_triple_leaf_topology",
      localObservation: groupedComplete ? "grouped triple-leaf topology is complete" : "grouped topology is missing required fields",
      notes: [
        "Gate G4 evaluates source-family eligibility only after the flat layer list is disambiguated into leaf/cavity groups."
      ],
      sourceFamilyRequirement: "complete grouped sideA/cavity1/internalLeaf/cavity2/sideB topology",
      status: groupedComplete ? "owned" : "blocked"
    },
    {
      blocker:
        cavityDepthsMatch && fullPorousFill
          ? null
          : "local_cavity_depths_or_fill_do_not_match_nrc_92_1_mm_full_fill_source_family",
      id: "source_family_cavity_depth_and_fill",
      localObservation: `local cavity depths ${formatDepths(topology)}, fill ${topology?.cavity1FillCoverage ?? "missing"} / ${topology?.cavity2FillCoverage ?? "missing"}`,
      notes: [
        "The user repro uses 50 mm rockwool cavities; the calibrated NRC source family uses 92.1 mm-class glass-fiber cavities with the internal board spacing called out separately."
      ],
      sourceFamilyRequirement: "two 92.1 mm-class full porous-fill cavities plus 25.4 mm internal-board spacing",
      status: cavityDepthsMatch && fullPorousFill ? "owned" : "blocked"
    },
    {
      blocker:
        internalLeafIds.length > 0 && internalLeafIds.every((id) => id === "gypsum_board")
          ? "local_internal_leaf_is_generic_gypsum_board_not_source_owned_type_c"
          : "local_internal_leaf_not_type_c_source_family",
      id: "source_family_internal_leaf",
      localObservation:
        internalLeafIds.length > 0 ? `internal leaf materials: ${internalLeafIds.join(", ")}` : "internal leaf missing",
      notes: [
        "A local gypsum_board internal leaf has the right broad role, but Gate G4 still lacks Type C product/material ownership."
      ],
      sourceFamilyRequirement: "one or two 12.7 mm Type C gypsum boards as the internal leaf",
      status: "blocked"
    },
    {
      blocker: "source_18_gauge_92_1_mm_steel_stud_support_not_owned_in_local_grouped_topology",
      id: "source_family_support_topology",
      localObservation: `support topology: ${topology?.supportTopology ?? "missing"}`,
      notes: [
        "Current wallTopology can express generic support class, but not stud gauge/depth or the exact NRC double 18 gauge 92.1 mm steel-stud source support."
      ],
      sourceFamilyRequirement: WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.support,
      status: "blocked"
    },
    {
      blocker: sideLeavesContainOutOfFamilyLayers
        ? "local_face_leaves_contain_mlv_or_gypsum_plaster_outside_nrc_source_family"
        : "local_face_leaf_type_c_board_count_not_source_owned",
      id: "source_family_leaf_surface_buildups",
      localObservation:
        sideLeafIds.length > 0 ? `side leaf materials: ${sideLeafIds.join(", ")}` : "side leaf groups missing",
      notes: [
        "The source-family leaves are board-only Type C assemblies; local face leaves include extra membrane/plaster mass in the user repro."
      ],
      sourceFamilyRequirement: "outside leaves made only from source-family Type C gypsum board counts",
      status: "blocked"
    }
  ] as const;
}

export function evaluateWallTripleLeafLocalMaterialMapping(input: {
  airborneContext: AirborneContext;
  calibrationFit?: WallTripleLeafCalibrationFitEvaluation;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): WallTripleLeafLocalMaterialMappingEvaluation {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const resolvedLayers = resolveLocalLayers(input.layers, catalog);
  const topology = input.airborneContext.wallTopology;
  const calibrationFit = input.calibrationFit ?? evaluateWallTripleLeafCalibrationFit();
  const materialDecisions = buildMaterialDecisions(resolvedLayers);
  const topologyDecisions = buildTopologyDecisions(topology, resolvedLayers);
  const leafMasses = [
    summarizeLeaf("side_a_leaf", topology?.sideALeafLayerIndices, resolvedLayers),
    summarizeLeaf("internal_leaf", topology?.internalLeafLayerIndices, resolvedLayers),
    summarizeLeaf("side_b_leaf", topology?.sideBLeafLayerIndices, resolvedLayers)
  ] as const;
  const materialBlockers = materialDecisions
    .map((decision) => decision.blocker)
    .filter((blocker): blocker is string => typeof blocker === "string");
  const topologyBlockers = topologyDecisions
    .map((decision) => decision.blocker)
    .filter((blocker): blocker is string => typeof blocker === "string");
  const sourceFamilyCalibrationPass = calibrationFit.sourceFamilyCalibrationPass;
  const blockers = [
    ...(!sourceFamilyCalibrationPass ? ["gate_g3_source_family_calibration_or_holdout_failed"] : []),
    ...materialBlockers,
    ...topologyBlockers
  ];
  const runtimeBlockers = [
    ...blockers,
    "paired_engine_web_visible_runtime_tests_not_written",
    "gate_h_engine_integration_fail_closed_not_landed"
  ];

  return {
    blockers,
    calibrationFit,
    confidencePromotion: false,
    groupedTopologyComplete: isGroupedTopologyComplete(topology),
    leafMasses,
    localMappingOwned: false,
    materialDecisions,
    negativeBoundariesPreserved: calibrationFit.negativeBoundaryProof.passed,
    numericRuntimeBehaviorChange: false,
    pairedVisibleRuntimeTestsReady: false,
    runtimeBlockers,
    runtimeEligibleNow: false,
    runtimeImportReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectedNextFile,
    sourceFamilyCalibrationPass,
    topologyDecisions
  };
}
