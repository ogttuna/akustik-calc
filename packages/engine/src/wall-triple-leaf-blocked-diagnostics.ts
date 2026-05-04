import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  evaluateWallTripleLeafLocalMaterialMapping,
  type WallTripleLeafLocalMaterialMappingEvaluation
} from "./wall-triple-leaf-local-material-mapping";

export type WallTripleLeafBlockedDiagnosticAudience = "developer" | "user" | "user_and_developer";

export type WallTripleLeafBlockedDiagnosticOwner =
  | "bounded_effect_model"
  | "input_topology"
  | "local_material_mapping"
  | "source_acquisition"
  | "visible_runtime_tests";

export type WallTripleLeafBlockedDiagnosticId =
  | "triple_leaf_current_result_screening_only"
  | "triple_leaf_generic_gypsum_board_not_type_c_owned"
  | "triple_leaf_rockwool_not_glass_fiber_owned"
  | "triple_leaf_mlv_absent_from_source_family"
  | "triple_leaf_gypsum_plaster_absent_from_source_family"
  | "triple_leaf_50mm_cavity_not_nrc_92mm_source_family"
  | "triple_leaf_internal_leaf_generic_board_not_type_c"
  | "triple_leaf_support_gauge_depth_not_owned"
  | "triple_leaf_face_leaf_contains_out_of_family_mass"
  | "triple_leaf_paired_visible_runtime_tests_missing";

export type WallTripleLeafBlockedDiagnostic = {
  audience: WallTripleLeafBlockedDiagnosticAudience;
  blockingRuntime: true;
  detail: string;
  id: WallTripleLeafBlockedDiagnosticId;
  owner: WallTripleLeafBlockedDiagnosticOwner;
  requiredEvidence: readonly string[];
  sourceBlocker: string | null;
  summary: string;
};

export type WallTripleLeafSourceAcquisitionTargetId =
  | "local_type_c_board_product_mapping"
  | "rockwool_absorber_equivalence_or_measured_row"
  | "mlv_limp_mass_triple_leaf_effect_model"
  | "gypsum_plaster_face_finish_effect_model"
  | "local_50mm_rockwool_cavity_source_row"
  | "support_gauge_depth_and_spacing_mapping";

export type WallTripleLeafSourceAcquisitionTarget = {
  id: WallTripleLeafSourceAcquisitionTargetId;
  priority: number;
  requiredBeforeRuntime: true;
  requiredEvidence: readonly string[];
  selectedForGateG6: true;
};

export type WallTripleLeafBlockedDiagnosticsEvaluation = {
  apiShapeChange: false;
  confidencePromotion: false;
  developerDiagnosticIds: readonly WallTripleLeafBlockedDiagnosticId[];
  diagnostics: readonly WallTripleLeafBlockedDiagnostic[];
  evidencePromotion: false;
  localMappingEvaluation: WallTripleLeafLocalMaterialMappingEvaluation;
  numericRuntimeBehaviorChange: false;
  outputCardStatusChange: false;
  proposalReportCopyChange: false;
  routeCardValueChange: false;
  runtimeImportReadyNow: false;
  runtimeImportSelectedNow: false;
  screeningCaveat: {
    expectedLiveRwDb: 41;
    expectedLiveStrategy: "multileaf_screening_blend";
    message: "The current Rw 41 result is screening only and must not be presented as a fixed or validated triple-leaf calculation.";
  };
  selectedNextAction: typeof WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectedNextFile;
  sourceAcquisitionTargets: readonly WallTripleLeafSourceAcquisitionTarget[];
  userDiagnosticIds: readonly WallTripleLeafBlockedDiagnosticId[];
  workbenchInputBehaviorChange: false;
};

export const WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g5_blocked_diagnostics_and_source_acquisition_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g6_local_source_acquisition_and_effect_model_requirements",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts",
  selectionStatus:
    "gate_g5_landed_blocked_diagnostics_no_runtime_selected_local_source_acquisition_gate_g6",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const BLOCKER_DIAGNOSTICS = {
  local_cavity_depths_or_fill_do_not_match_nrc_92_1_mm_full_fill_source_family: {
    audience: "user_and_developer",
    detail:
      "The local repro uses 50 mm porous cavities, while the calibrated NRC 2024 source family uses 92.1 mm full-fill cavities plus a separate 25.4 mm internal-board spacing.",
    id: "triple_leaf_50mm_cavity_not_nrc_92mm_source_family",
    owner: "source_acquisition",
    requiredEvidence: [
      "measured or graph-digitized triple-leaf rows with 50 mm rockwool cavities",
      "bounded tolerance showing the 50 mm cavity substitution stays inside the calibrated family"
    ],
    summary: "The local 50 mm cavity family is not the NRC 92.1 mm source family."
  },
  local_face_leaves_contain_mlv_or_gypsum_plaster_outside_nrc_source_family: {
    audience: "user_and_developer",
    detail:
      "The local face leaves contain MLV or gypsum plaster mass that the NRC 2024 board-only source-family leaves do not contain.",
    id: "triple_leaf_face_leaf_contains_out_of_family_mass",
    owner: "bounded_effect_model",
    requiredEvidence: [
      "source rows or a bounded effect model for added limp-mass membrane in the face leaf",
      "source rows or a bounded effect model for wet gypsum plaster finish in the face leaf"
    ],
    summary: "The local face leaves include mass layers outside the source-family leaf buildup."
  },
  local_generic_gypsum_board_to_nrc_type_c_mapping_not_owned: {
    audience: "user_and_developer",
    detail:
      "The local catalog material is generic gypsum_board; it does not encode Type C board identity, core type, paper facing, or tested product family.",
    id: "triple_leaf_generic_gypsum_board_not_type_c_owned",
    owner: "local_material_mapping",
    requiredEvidence: [
      "specific local board product or Type C equivalent mapping",
      "surface-mass and construction tolerance against NRC 12.7 mm Type C gypsum board at 9.80 kg/m2"
    ],
    summary: "Generic local gypsum board is not owned as NRC Type C gypsum board."
  },
  local_gypsum_plaster_absent_from_nrc_source_family: {
    audience: "user_and_developer",
    detail:
      "NRC 2024 assemblies A/B/D use board leaves, not a wet gypsum plaster finish layered onto a face leaf.",
    id: "triple_leaf_gypsum_plaster_absent_from_source_family",
    owner: "bounded_effect_model",
    requiredEvidence: [
      "triple-leaf source rows with gypsum plaster face finish",
      "bounded model for plaster mass and damping effects on the calibrated source family"
    ],
    summary: "Gypsum plaster is outside the exact NRC-like source family."
  },
  local_internal_leaf_is_generic_gypsum_board_not_source_owned_type_c: {
    audience: "developer",
    detail:
      "The internal leaf is in the correct broad role, but a generic local gypsum_board layer is still not a source-owned Type C internal board.",
    id: "triple_leaf_internal_leaf_generic_board_not_type_c",
    owner: "local_material_mapping",
    requiredEvidence: [
      "specific Type C internal-board mapping",
      "board-count and mass tolerance for the internal leaf"
    ],
    summary: "The internal leaf needs Type C material ownership before exact promotion."
  },
  local_mlv_absent_from_nrc_source_family: {
    audience: "user_and_developer",
    detail:
      "The calibrated NRC 2024 source-family rows do not include a limp-mass membrane in either outer face leaf or the internal leaf.",
    id: "triple_leaf_mlv_absent_from_source_family",
    owner: "bounded_effect_model",
    requiredEvidence: [
      "measured triple-leaf rows with MLV in the same leaf position",
      "bounded limp-mass effect model with one-third-octave tolerance"
    ],
    summary: "MLV is outside the exact NRC-like source family."
  },
  local_rockwool_to_nrc_glass_fiber_batt_mapping_not_owned: {
    audience: "user_and_developer",
    detail:
      "The NRC source-family absorber is glass-fiber batt; the local repro uses rockwool without owned flow-resistivity, density, or band-tolerance equivalence.",
    id: "triple_leaf_rockwool_not_glass_fiber_owned",
    owner: "source_acquisition",
    requiredEvidence: [
      "source rows using rockwool/mineral-wool absorber in the same two-cavity triple-leaf topology",
      "flow-resistivity or density equivalence accepted against one-third-octave tolerance"
    ],
    summary: "Rockwool is not owned as the NRC glass-fiber batt absorber."
  },
  source_18_gauge_92_1_mm_steel_stud_support_not_owned_in_local_grouped_topology: {
    audience: "user_and_developer",
    detail:
      "Current wallTopology can express generic support class, but it does not own the NRC double 18 gauge / 92.1 mm steel-stud support.",
    id: "triple_leaf_support_gauge_depth_not_owned",
    owner: "input_topology",
    requiredEvidence: [
      "exact stud gauge, depth, spacing, and frame independence inputs",
      "source-family tolerance for substituting local support topology"
    ],
    summary: "Support gauge/depth ownership is missing."
  }
} as const satisfies Record<
  string,
  Omit<WallTripleLeafBlockedDiagnostic, "blockingRuntime" | "sourceBlocker">
>;

const PAIRED_VISIBLE_TEST_DIAGNOSTIC: WallTripleLeafBlockedDiagnostic = {
  audience: "developer",
  blockingRuntime: true,
  detail:
    "The engine can explain the blocked state, but no paired web-visible route-card/output-card/proposal tests own a future runtime promotion yet.",
  id: "triple_leaf_paired_visible_runtime_tests_missing",
  owner: "visible_runtime_tests",
  requiredEvidence: [
    "engine contract for the promoted path",
    "web route-card, output-card, proposal/report, and workbench-input tests for the same path"
  ],
  sourceBlocker: "paired_engine_web_visible_runtime_tests_not_written",
  summary: "Paired engine/web visible runtime tests are missing."
};

const SCREENING_CAVEAT_DIAGNOSTIC: WallTripleLeafBlockedDiagnostic = {
  audience: "user_and_developer",
  blockingRuntime: true,
  detail:
    "The current split-rockwool value is the low-confidence screening result, not the calibrated source-family solver result.",
  id: "triple_leaf_current_result_screening_only",
  owner: "visible_runtime_tests",
  requiredEvidence: [
    "local material mapping",
    "source/effect-model ownership",
    "paired engine and web visible tests before the number can be presented as validated"
  ],
  sourceBlocker: null,
  summary: "Current Rw 41 remains screening only."
};

const SOURCE_ACQUISITION_TARGETS: readonly WallTripleLeafSourceAcquisitionTarget[] = [
  {
    id: "local_type_c_board_product_mapping",
    priority: 1,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "local gypsum board product/type identity",
      "surface-mass tolerance against NRC 12.7 mm Type C gypsum board"
    ],
    selectedForGateG6: true
  },
  {
    id: "rockwool_absorber_equivalence_or_measured_row",
    priority: 2,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "rockwool/mineral-wool triple-leaf measured row",
      "flow-resistivity or density equivalence to the calibrated absorber"
    ],
    selectedForGateG6: true
  },
  {
    id: "local_50mm_rockwool_cavity_source_row",
    priority: 3,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "two-cavity triple-leaf source row with 50 mm cavities",
      "one-third-octave curve or graph-digitized curve with bounded uncertainty"
    ],
    selectedForGateG6: true
  },
  {
    id: "mlv_limp_mass_triple_leaf_effect_model",
    priority: 4,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "measured MLV-in-leaf triple-leaf source row",
      "bounded limp-mass effect model across one-third-octave bands"
    ],
    selectedForGateG6: true
  },
  {
    id: "gypsum_plaster_face_finish_effect_model",
    priority: 5,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "gypsum plaster finish source row in a similar triple-leaf wall",
      "bounded mass/damping effect model for plaster finish"
    ],
    selectedForGateG6: true
  },
  {
    id: "support_gauge_depth_and_spacing_mapping",
    priority: 6,
    requiredBeforeRuntime: true,
    requiredEvidence: [
      "exact support gauge/depth/spacing input",
      "substitution tolerance against NRC double 18 gauge 92.1 mm steel studs"
    ],
    selectedForGateG6: true
  }
] as const;

function hasRuntimeBlocker(
  evaluation: WallTripleLeafLocalMaterialMappingEvaluation,
  blocker: string
): boolean {
  return evaluation.runtimeBlockers.includes(blocker);
}

function buildDiagnostics(
  evaluation: WallTripleLeafLocalMaterialMappingEvaluation
): readonly WallTripleLeafBlockedDiagnostic[] {
  const diagnostics = [
    SCREENING_CAVEAT_DIAGNOSTIC,
    ...evaluation.blockers.flatMap((blocker) => {
      const diagnostic = BLOCKER_DIAGNOSTICS[blocker as keyof typeof BLOCKER_DIAGNOSTICS];

      if (!diagnostic) {
        return [];
      }

      return [
        {
          ...diagnostic,
          blockingRuntime: true,
          sourceBlocker: blocker
        } satisfies WallTripleLeafBlockedDiagnostic
      ];
    }),
    ...(hasRuntimeBlocker(evaluation, "paired_engine_web_visible_runtime_tests_not_written")
      ? [PAIRED_VISIBLE_TEST_DIAGNOSTIC]
      : [])
  ] as const;
  const uniqueDiagnostics = new Map<WallTripleLeafBlockedDiagnosticId, WallTripleLeafBlockedDiagnostic>();

  for (const diagnostic of diagnostics) {
    uniqueDiagnostics.set(diagnostic.id, diagnostic);
  }

  return [...uniqueDiagnostics.values()];
}

export function evaluateWallTripleLeafBlockedDiagnostics(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  localMappingEvaluation?: WallTripleLeafLocalMaterialMappingEvaluation;
}): WallTripleLeafBlockedDiagnosticsEvaluation {
  const localMappingEvaluation =
    input.localMappingEvaluation ??
    evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: input.airborneContext,
      catalog: input.catalog,
      layers: input.layers
    });
  const diagnostics = buildDiagnostics(localMappingEvaluation);

  return {
    apiShapeChange: false,
    confidencePromotion: false,
    developerDiagnosticIds: diagnostics
      .filter((diagnostic) => diagnostic.audience === "developer" || diagnostic.audience === "user_and_developer")
      .map((diagnostic) => diagnostic.id),
    diagnostics,
    evidencePromotion: false,
    localMappingEvaluation,
    numericRuntimeBehaviorChange: false,
    outputCardStatusChange: false,
    proposalReportCopyChange: false,
    routeCardValueChange: false,
    runtimeImportReadyNow: false,
    runtimeImportSelectedNow: false,
    screeningCaveat: {
      expectedLiveRwDb: 41,
      expectedLiveStrategy: "multileaf_screening_blend",
      message:
        "The current Rw 41 result is screening only and must not be presented as a fixed or validated triple-leaf calculation."
    },
    selectedNextAction: WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectedNextFile,
    sourceAcquisitionTargets: SOURCE_ACQUISITION_TARGETS,
    userDiagnosticIds: diagnostics
      .filter((diagnostic) => diagnostic.audience === "user" || diagnostic.audience === "user_and_developer")
      .map((diagnostic) => diagnostic.id),
    workbenchInputBehaviorChange: false
  };
}
