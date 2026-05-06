import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  type AirborneCandidate,
  type AirborneCandidateRejectionReason,
  type AirborneCandidateResolution,
  type AirborneCalculatorId,
  type AirborneResultBasis,
  type AirborneResultOrigin,
  type RequestedOutputId
} from "@dynecho/shared";

import { AIRBORNE_CALCULATORS } from "./airborne-calculator";

export type PersonalUseReadinessRoute = "wall" | "floor";
export type PersonalUseReadinessSurface =
  | "engine"
  | "visible_card"
  | "saved_replay"
  | "pdf_report"
  | "docx_report";
export type PersonalUseReadinessSupportPosture =
  | "exact_ready"
  | "calibration_ready_after_holdout"
  | "calculated_ready"
  | "bounded_only"
  | "screening_guarded"
  | "needs_input"
  | "unsupported";

export type PersonalUseReadinessScenario = {
  acceptedCandidateOrigins: readonly AirborneResultOrigin[];
  description: string;
  expectedMissingInputPrompts: readonly string[];
  id: string;
  rejectedCandidateOrigins: readonly AirborneResultOrigin[];
  route: PersonalUseReadinessRoute;
  sourceCatalogQueueOnly: false;
  supportPosture: PersonalUseReadinessSupportPosture;
  targetOutputs: readonly RequestedOutputId[];
  testedSurfaces: readonly PersonalUseReadinessSurface[];
};

export type DynamicAirborneDelegateInventoryEntry = {
  calculatorId: AirborneCalculatorId;
  currentRole: string;
  designGradeScope: string;
  label: string;
  knownLimitations: readonly string[];
};

type GateJAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

const ALL_GATE_J_SURFACES = [
  "engine",
  "visible_card",
  "saved_replay",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseReadinessSurface[];

export const GATE_J_PERSONAL_USE_READINESS_SCENARIOS = [
  {
    acceptedCandidateOrigins: ["measured_exact_full_stack"],
    description:
      "Exact wall source wins only when topology, material fingerprint, metric basis, and tolerance owner all match.",
    expectedMissingInputPrompts: [],
    id: "gate_j_wall_exact_full_stack_source_wins_only_on_exact_match",
    rejectedCandidateOrigins: [
      "measured_exact_subassembly_plus_calculated_delta",
      "calibrated_family_physics",
      "family_physics_prediction",
      "bounded_prediction",
      "screening_fallback"
    ],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "exact_ready",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["measured_exact_subassembly_plus_calculated_delta"],
    description:
      "Similar or partial measured assemblies can anchor a named delta only when the delta method owns topology, metric basis, and error budget.",
    expectedMissingInputPrompts: [],
    id: "gate_j_wall_similar_source_anchor_delta_is_algorithmic_not_nearest_neighbor",
    rejectedCandidateOrigins: ["calibrated_family_physics", "family_physics_prediction", "screening_fallback"],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "calibration_ready_after_holdout",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["calibrated_family_physics"],
    description:
      "Calibrated family solvers can beat uncalibrated solvers only after rights-safe calibration and holdout evidence lands.",
    expectedMissingInputPrompts: [],
    id: "gate_j_wall_calibrated_family_requires_holdout_and_keeps_physics_solver_live",
    rejectedCandidateOrigins: ["measured_exact_full_stack", "family_physics_prediction", "screening_fallback"],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "calibration_ready_after_holdout",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["family_physics_prediction"],
    description:
      "Explicit grouped Rockwool/MLV/gypsum triple-leaf wall remains a source-absent family physics prediction with visible uncertainty.",
    expectedMissingInputPrompts: [],
    id: "gate_j_wall_grouped_multicavity_source_absent_family_physics_prediction",
    rejectedCandidateOrigins: ["measured_exact_full_stack", "calibrated_family_physics", "screening_fallback"],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "calculated_ready",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["screening_fallback"],
    description:
      "ACON-like flat-list multi-leaf/multi-cavity walls stay guarded until grouped leaves, cavities, MLV, porous fill, and bridge inputs are explicit.",
    expectedMissingInputPrompts: [
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ],
    id: "gate_j_wall_acon_like_flat_list_multicavity_screening_guard",
    rejectedCandidateOrigins: ["measured_exact_full_stack", "calibrated_family_physics", "family_physics_prediction"],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "screening_guarded",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["needs_input"],
    description:
      "Wall field and building-prediction outputs require room, area, reverberation, and flanking context instead of borrowing lab Rw.",
    expectedMissingInputPrompts: ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "flankingJunctionClass"],
    id: "gate_j_wall_field_building_outputs_need_context_not_lab_alias",
    rejectedCandidateOrigins: ["family_physics_prediction", "screening_fallback"],
    route: "wall",
    sourceCatalogQueueOnly: false,
    supportPosture: "needs_input",
    targetOutputs: ["R'w", "DnT,w", "Dn,w"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["bounded_prediction"],
    description:
      "Heavy floor impact may use bounded or narrow formula support only inside its owned scope and must keep missing outputs explicit.",
    expectedMissingInputPrompts: [],
    id: "gate_j_floor_heavy_floor_bounded_impact_posture",
    rejectedCandidateOrigins: ["measured_exact_full_stack", "calibrated_family_physics", "unsupported"],
    route: "floor",
    sourceCatalogQueueOnly: false,
    supportPosture: "bounded_only",
    targetOutputs: ["Rw", "Ln,w", "DeltaLw"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["needs_input"],
    description:
      "Floating-floor impact requests need dynamic stiffness, load basis, base/floating layer roles, and field context for field metrics.",
    expectedMissingInputPrompts: [
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "baseSlabOrFloor",
      "toppingOrFloatingLayer",
      "impactFieldContext"
    ],
    id: "gate_j_floor_floating_floor_dynamic_stiffness_needs_input",
    rejectedCandidateOrigins: ["bounded_prediction", "screening_fallback", "unsupported"],
    route: "floor",
    sourceCatalogQueueOnly: false,
    supportPosture: "needs_input",
    targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"],
    testedSurfaces: ALL_GATE_J_SURFACES
  },
  {
    acceptedCandidateOrigins: ["unsupported"],
    description:
      "Unsupported rating requests such as IIC/AIIC remain explicit until the required impact adapter and basis owner exist.",
    expectedMissingInputPrompts: [],
    id: "gate_j_floor_iic_adapter_unsupported_until_astm_e989_runtime_owner_lands",
    rejectedCandidateOrigins: ["family_physics_prediction", "bounded_prediction", "screening_fallback"],
    route: "floor",
    sourceCatalogQueueOnly: false,
    supportPosture: "unsupported",
    targetOutputs: ["IIC", "AIIC"],
    testedSurfaces: ALL_GATE_J_SURFACES
  }
] as const satisfies readonly PersonalUseReadinessScenario[];

export function summarizeGateJPersonalUseReadinessScenarioPack(
  scenarios: readonly PersonalUseReadinessScenario[] = GATE_J_PERSONAL_USE_READINESS_SCENARIOS
) {
  return {
    missingPromptScenarioIds: scenarios
      .filter((scenario) => scenario.expectedMissingInputPrompts.length > 0)
      .map((scenario) => scenario.id),
    originCoverage: [...new Set(scenarios.flatMap((scenario) => scenario.acceptedCandidateOrigins))],
    routeCoverage: [...new Set(scenarios.map((scenario) => scenario.route))],
    runtimeValueMovement: false,
    scenarioIds: scenarios.map((scenario) => scenario.id),
    sourceCatalogQueueOnlyCount: scenarios.filter((scenario) => scenario.sourceCatalogQueueOnly).length,
    surfaceCoverage: [...new Set(scenarios.flatMap((scenario) => scenario.testedSurfaces))]
  };
}

export function buildDynamicAirborneDelegateInventory(): readonly DynamicAirborneDelegateInventoryEntry[] {
  const roleByCalculatorId: Record<AirborneCalculatorId, Omit<DynamicAirborneDelegateInventoryEntry, "calculatorId" | "label">> = {
    dynamic: {
      currentRole: "family_selector_and_delegate_blender",
      designGradeScope: "selected only when the family has an owned solver or an explicitly guarded support posture",
      knownLimitations: [
        "multileaf_multicavity can still be a screening blend outside the narrow grouped Rockwool Gate G target",
        "stud and double-stud routes still use surrogate blends until frame/bridge solvers land"
      ]
    },
    ks_rw_calibrated: {
      currentRole: "mass_curve_reference_for_owned_massive_routes",
      designGradeScope: "massive mineral elements inside owned mass/material ranges",
      knownLimitations: ["not a generic cavity, framed-wall, field, or impact solver"]
    },
    kurtovic: {
      currentRole: "single_panel_frequency_curve_delegate",
      designGradeScope: "single-panel curve comparison and coincidence-sensitive benchmark signal",
      knownLimitations: ["not a complete double/framed or multi-cavity solver"]
    },
    mass_law: {
      currentRole: "aggregate_mass_law_curve_delegate",
      designGradeScope: "simple mass-controlled checks and bounded fallback comparisons",
      knownLimitations: ["does not own cavity damping, frame bridges, MLV position, or field normalization"]
    },
    sharp: {
      currentRole: "single_panel_coincidence_delegate",
      designGradeScope: "single-panel and local comparison lane where stiffness/loss assumptions are visible",
      knownLimitations: ["only has a limited double-leaf gap bonus in the current local engine"]
    }
  };

  return AIRBORNE_CALCULATORS.map((calculator) => ({
    calculatorId: calculator.id,
    label: calculator.label,
    ...roleByCalculatorId[calculator.id]
  }));
}

function exactBasis(): AirborneResultBasis {
  return {
    assumptions: ["full-stack measured curve exactly matches requested topology, metric basis, and material fingerprint"],
    curveBasis: "measured_frequency_curve",
    exactSourceId: "source_gate_j_exact_wall_stack",
    family: "double_leaf",
    frequencyBands: {
      bandSet: "third_octave_100_3150_hz"
    },
    kind: "airborne_measured_exact",
    measurementStandard: "ASTM E90",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "ASTM E413",
    requiredInputs: ["exactTopologyMatch", "exactMaterialFingerprint", "metricBasis", "toleranceOwner"],
    toleranceClass: "exact_source"
  };
}

function anchoredDeltaBasis(): AirborneResultBasis {
  return {
    anchorSourceId: "source_gate_j_exact_double_leaf_subassembly",
    assumptions: [
      "subassembly source is exact",
      "remaining layer delta is calculated by a named topology-compatible method"
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "double_leaf",
    kind: "airborne_anchored_delta",
    measurementStandard: "ISO 10140-2",
    method: "similar_source_exact_subassembly_plus_named_delta",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_subassembly_plus_calculated_delta",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["anchorSourceId", "deltaMethod", "topologyCompatibility", "holdoutTolerance"],
    toleranceClass: "calibrated_prediction"
  };
}

function calibratedBasis(): AirborneResultBasis {
  return {
    assumptions: ["calibration rows are topology-compatible and holdout-tested"],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_multi_leaf_family_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "groupedTopology"],
    toleranceClass: "calibrated_prediction"
  };
}

function familyPhysicsBasis(): AirborneResultBasis {
  return {
    assumptions: [
      "source rows are absent",
      "required grouped topology and material properties are present",
      "uncalibrated solver carries explicit error budget"
    ],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 5,
    family: "multileaf_multicavity",
    kind: "airborne_physics_prediction",
    method: "triple_leaf_two_cavity_frequency_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [
      {
        field: "rockwool.flowResistivity",
        reason: "Engineering default is visible until product-specific material data lands.",
        source: "catalog_engineering_default",
        unit: "Pa.s/m2",
        value: 15000
      }
    ],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["groupedLeaves", "cavityDepths", "porousFillProperties", "supportTopology"],
    toleranceClass: "uncalibrated_prediction"
  };
}

function boundedBasis(): AirborneResultBasis {
  return {
    assumptions: ["only a conservative bound is owned for this route"],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_single_number_estimate",
    errorBudgetDb: 8,
    family: "rigid_massive_wall",
    kind: "airborne_bound",
    method: "bounded_heavy_floor_or_wall_estimate",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "bounded_prediction",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["massPerArea", "routeScope"],
    toleranceClass: "bounded_prediction"
  };
}

function screeningBasis(): AirborneResultBasis {
  return {
    assumptions: ["topology is ambiguous or incomplete, so the result is diagnostic only"],
    calculationStandard: "engine_screening",
    curveBasis: "screening_mass_law_curve",
    errorBudgetDb: 10,
    family: "multileaf_multicavity",
    kind: "airborne_screening",
    method: "multileaf_screening_blend",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "screening_fallback",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["layers"],
    toleranceClass: "screening_fallback"
  };
}

function needsInputBasis(): AirborneResultBasis {
  return {
    assumptions: ["missing physical fields are user prompts, not source-packet tasks"],
    calculationStandard: "none",
    curveBasis: "no_curve",
    family: "multileaf_multicavity",
    kind: "airborne_needs_input",
    method: "route_input_contract_missing_physical_fields",
    missingPhysicalInputs: ["cavity1DepthMm", "internalLeafCoupling", "receivingRoomVolumeM3"],
    missingSourceEvidence: [],
    origin: "needs_input",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: ["cavity1DepthMm", "internalLeafCoupling", "receivingRoomVolumeM3"]
  };
}

function unsupportedBasis(): AirborneResultBasis {
  return {
    assumptions: ["requested metric has no runtime adapter owner yet"],
    calculationStandard: "none",
    curveBasis: "no_curve",
    kind: "airborne_unsupported",
    method: "unsupported_metric_basis_guard",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "unsupported",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: []
  };
}

function originRank(origin: AirborneCandidate["origin"]): number {
  return AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf(origin);
}

function resolveGateJCandidates(
  seeds: readonly GateJAirborneCandidateSeed[],
  id: string
): AirborneCandidateResolution {
  const eligible = seeds.filter((seed) => (seed.blockedReasons ?? []).length === 0);
  const selectedSeed = [...eligible].sort((left, right) => {
    const precedenceDelta = originRank(left.origin) - originRank(right.origin);
    return precedenceDelta === 0 ? left.id.localeCompare(right.id) : precedenceDelta;
  })[0];

  if (!selectedSeed) {
    throw new Error("Gate J method-selection resolver requires at least one eligible candidate.");
  }

  const candidates: AirborneCandidate[] = seeds.map((seed) => {
    const selected = seed.id === selectedSeed.id;
    const blockedReasons = [...(seed.blockedReasons ?? [])];
    const rejectionReasons = selected
      ? []
      : blockedReasons.length > 0
        ? blockedReasons
        : [
            {
              code:
                seed.origin === selectedSeed.origin
                  ? "stable_candidate_id_tie_breaker_lost"
                  : "lower_precedence_than_selected",
              detail:
                seed.origin === selectedSeed.origin
                  ? "Candidate has the same origin as the selected candidate but loses the stable id tie-breaker."
                  : `Candidate loses to ${selectedSeed.id} under model-first airborne precedence.`
            }
          ];

    return {
      basis: seed.basis,
      id: seed.id,
      metricIds: seed.metricIds,
      origin: seed.origin,
      outputIds: seed.outputIds,
      rejectionReasons,
      selected
    };
  });

  return AirborneCandidateResolutionSchema.parse({
    candidatePrecedence: [...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE],
    candidates,
    deterministicTieBreakers: [
      "origin_precedence",
      "input_completeness_status",
      "family_confidence_class",
      "error_budget_db",
      "source_evidence_completeness",
      "stable_candidate_id"
    ],
    id,
    inputCompletenessIds: [
      "triple_leaf_multicavity_airborne_minimum_inputs",
      "field_apparent_output_context_minimum_inputs"
    ],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: [
      "iso_717_1_rw_from_airborne_transmission_loss_curve",
      "astm_e413_stc_from_airborne_transmission_loss_curve"
    ],
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: false,
    selectedBasis: selectedSeed.basis,
    selectedCandidateId: selectedSeed.id,
    selectedOrigin: selectedSeed.origin
  });
}

export function buildGateJMethodSelectionResolution(
  mode: "exact_available" | "source_absent_family_selected"
): AirborneCandidateResolution {
  const sourceAbsentBlocker = {
    code: "missing_source_evidence",
    detail: "Source evidence is absent or not owned; this blocks exact/calibration promotion only."
  } as const satisfies AirborneCandidateRejectionReason;
  const seeds: GateJAirborneCandidateSeed[] = [
    {
      basis: {
        ...exactBasis(),
        missingSourceEvidence: mode === "source_absent_family_selected" ? ["rights_safe_exact_curve_absent"] : []
      },
      blockedReasons: mode === "source_absent_family_selected" ? [sourceAbsentBlocker] : [],
      id: "candidate_gate_j_exact_full_stack",
      metricIds: ["Rw", "STC"],
      origin: "measured_exact_full_stack",
      outputIds: ["Rw", "STC"]
    },
    {
      basis: {
        ...anchoredDeltaBasis(),
        missingSourceEvidence:
          mode === "source_absent_family_selected" ? ["exact_subassembly_anchor_absent"] : []
      },
      blockedReasons:
        mode === "source_absent_family_selected"
          ? [
              {
                code: "missing_source_evidence",
                detail: "Similar-source anchored delta is blocked because the exact subassembly anchor is absent."
              }
            ]
          : [],
      id: "candidate_gate_j_similar_source_anchored_delta",
      metricIds: ["Rw", "STC"],
      origin: "measured_exact_subassembly_plus_calculated_delta",
      outputIds: ["Rw", "STC"]
    },
    {
      basis: {
        ...calibratedBasis(),
        missingSourceEvidence:
          mode === "source_absent_family_selected" ? ["calibration_holdout_curve_absent"] : []
      },
      blockedReasons: mode === "source_absent_family_selected" ? [sourceAbsentBlocker] : [],
      id: "candidate_gate_j_calibrated_family",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "calibrated_family_physics",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: familyPhysicsBasis(),
      id: "candidate_gate_j_source_absent_family_solver",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "family_physics_prediction",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: boundedBasis(),
      id: "candidate_gate_j_bounded_prediction",
      metricIds: ["Rw", "Ln,w"],
      origin: "bounded_prediction",
      outputIds: ["Rw", "Ln,w"]
    },
    {
      basis: screeningBasis(),
      id: "candidate_gate_j_screening_fallback",
      metricIds: ["Rw"],
      origin: "screening_fallback",
      outputIds: ["Rw"]
    },
    {
      basis: needsInputBasis(),
      id: "candidate_gate_j_needs_input",
      metricIds: ["DnT,w"],
      origin: "needs_input",
      outputIds: ["DnT,w"]
    },
    {
      basis: unsupportedBasis(),
      id: "candidate_gate_j_unsupported_iic_adapter",
      metricIds: ["IIC"],
      origin: "unsupported",
      outputIds: ["IIC"]
    }
  ];

  return resolveGateJCandidates(seeds, `resolver_gate_j_${mode}`);
}
