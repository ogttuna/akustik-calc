import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import {
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
  POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";
import {
  POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING
} from "./post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_owner_landed_input_boundary_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_roof_suspended_ceiling_route_split_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_spectral_rating_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_outdoor_indoor_oitc_spectral_rating_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade outdoor-indoor OITC spectral rating owner";

const DRIFT_LOCK_DOC =
  "docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md";
const OITC_BRIDGE_OWNER_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts";
const OITC_BRIDGE_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts";
const ASTM_EXACT_BAND_OWNER_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts";
const ASTM_EXACT_BAND_SURFACE_FILE =
  "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts";

const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const CEILING_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];

const SELECTED_REQUIRED_INPUTS = [
  "outdoorIndoorTransmissionLossOrNoiseReductionCurve",
  "oneThirdOctaveBands80To4000Hz",
  "facadeOutdoorContext=outdoor_indoor_facade",
  "openingOrFacadeAreaEnergyContext"
] as const;

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 1,
  estimatedNextRequiredPhysicalInputsCaptured: 4,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 1,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_no_same_basis_evidence"
  | "rejected_support_loop"
  | "rejected_unsafe_source_absent_astm_estimator"
  | "selected_next_oitc_spectral_rating_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputsToUnlock: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CANDIDATES = [
  {
    decision: "selected_next_oitc_spectral_rating_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      OITC_BRIDGE_OWNER_FILE,
      OITC_BRIDGE_COVERAGE_FILE,
      RERANK_PLAN_DOC,
      DRIFT_LOCK_DOC
    ],
    reason:
      "The ceiling route boundary is protected, and the current source-of-truth records ASTM IIC/AIIC exact-band runtime and input surfaces as already landed. The remaining high-ROI market-facing metric is OITC: it is requestable but complete outdoor-indoor facade requests still return unsupported until a spectral rating adapter owns the calculation.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_rating",
    selected: true,
    targetOutputsToUnlock: OITC_OUTPUTS,
    unsupportedBoundaries: [
      "no STC-to-OITC alias",
      "no Rw-to-OITC alias",
      "no NISR/ISR-to-OITC alias",
      "no indoor DnT,w or partition field metric as outdoor-indoor facade OITC",
      "missing 80 Hz through 4000 Hz one-third-octave spectral basis remains needs_input",
      "source report scalar OITC rows are exact evidence only when construction, metric, standard, and context match",
      "no broad source crawl or confidence fallback"
    ]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "floor.astm_iic_aiic.exact_band_standard_method_owner",
    implementationEvidencePaths: [ASTM_EXACT_BAND_OWNER_FILE, "packages/engine/src/impact-astm-e989.ts"],
    reason:
      "Lab ASTM E492/E989 bands already calculate IIC and field ASTM E1007/E989 bands already calculate AIIC through the ASTM E989 contour owner. Selecting this again would be a stale repeat.",
    requiredPhysicalInputs: [
      "exactImpactSource.frequenciesHz",
      "exactImpactSource.levelsDb",
      "exactImpactSource.standardMethod",
      "exactImpactSource.labOrField"
    ],
    routeFamily: "floor.impact.astm_iic_aiic_exact_band_owner",
    selected: false,
    targetOutputsToUnlock: ASTM_OUTPUTS,
    unsupportedBoundaries: ["no ISO Ln,w, DeltaLw, CI, or CI,50-2500 alias to IIC/AIIC"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "floor.astm_iic_aiic_user_band_input_surface",
    implementationEvidencePaths: [ASTM_EXACT_BAND_SURFACE_FILE, ASTM_EXACT_BAND_OWNER_FILE],
    reason:
      "The user/import exact-band input surface already landed: ASTM-labelled bands publish owned IIC/AIIC and ISO defaults stay ISO. Repeating it would not increase calculator scope.",
    requiredPhysicalInputs: [
      "exactImpactSource.standardMethod=ASTM_E492_E989_or_ASTME1007_E989",
      "exactImpactSource.bandSet=one_third_octave"
    ],
    routeFamily: "floor.impact.astm_iic_aiic_user_band_input_surface",
    selected: false,
    targetOutputsToUnlock: ASTM_OUTPUTS,
    unsupportedBoundaries: ["no lab/field metric mismatch", "no ambiguous standard method promotion"]
  },
  {
    decision: "rejected_unsafe_source_absent_astm_estimator",
    estimatedRuntimeValuesMoved: 0,
    id: "floor.impact_iic_aiic_source_absent_estimator",
    implementationEvidencePaths: [ASTM_EXACT_BAND_OWNER_FILE, DRIFT_LOCK_DOC],
    reason:
      "A source-absent IIC/AIIC estimator would require deriving ASTM ratings from ISO formula outputs or generic floor families. That violates the exact-source or owned-curve requirement.",
    requiredPhysicalInputs: ["ownedAstmImpactRatingCurveOrExactSource"],
    routeFamily: "floor.impact.astm_iic_aiic_source_absent",
    selected: false,
    targetOutputsToUnlock: ASTM_OUTPUTS,
    unsupportedBoundaries: ["no IIC/AIIC alias from Ln,w or DeltaLw"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.roof_suspended_ceiling_route_split_boundary_owner",
    implementationEvidencePaths: [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      PREVIOUS_COVERAGE_PLAN_DOC
    ],
    reason:
      "The route split boundary owner and coverage refresh are landed and protected. Reopening them now would be a support loop.",
    requiredPhysicalInputs: [
      "airborneContext.routeIntent",
      "airborneContext.roofOrCeilingMountingContext",
      "airborneContext.suspendedCeilingAirborneOrImpactIntent",
      "airborneContext.hangerOrSupportCouplingClass"
    ],
    routeFamily: "ceiling.roof_suspended_ceiling.route_boundary",
    selected: false,
    targetOutputsToUnlock: CEILING_OUTPUTS,
    unsupportedBoundaries: ["no route promotion by layer role or product name alone"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.multileaf_airborne_plenum_formula_accuracy_calibration",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts",
      "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts",
      DRIFT_LOCK_DOC
    ],
    reason:
      "Calibration remains important, but no same-family same-basis holdout packet is selected. OITC opens a still-unsupported target output without broad source crawling.",
    requiredPhysicalInputs: ["sameFamilySameBasisPlenumHoldoutRows"],
    routeFamily: "ceiling.multileaf_airborne.plenum_formula_calibration",
    selected: false,
    targetOutputsToUnlock: CEILING_OUTPUTS,
    unsupportedBoundaries: ["no retune from source-absent formula outputs alone"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner",
    implementationEvidencePaths: [OITC_BRIDGE_OWNER_FILE, OITC_BRIDGE_COVERAGE_FILE],
    reason:
      "The OITC requested-output bridge is already landed. The next useful opening/facade move must calculate through a spectral rating owner, not reopen the schema bridge.",
    requiredPhysicalInputs: [
      "hostWallAreaM2",
      "openingAreaM2",
      "openingElementType",
      "openingFrequencyBandsOrRatingBasis",
      "openingSealLeakageClass",
      "facadeOutdoorOrRoomNormalizationContext"
    ],
    routeFamily: "opening.facade_outdoor_indoor.oitc_metric_schema_adapter_bridge",
    selected: false,
    targetOutputsToUnlock: OITC_OUTPUTS,
    unsupportedBoundaries: ["no repeat of requestable-but-unsupported OITC bridge"]
  },
  {
    decision: "rejected_support_loop",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl_confidence_label_or_frontend_polish",
    implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md", DRIFT_LOCK_DOC],
    reason:
      "This work would not open or protect a bounded calculator behavior. It is explicitly rejected by the north-star and opening-sequence drift lock.",
    requiredPhysicalInputs: [],
    routeFamily: "support.non_calculator_drift",
    selected: false,
    targetOutputsToUnlock: [],
    unsupportedBoundaries: ["no broad support drift after this rerank"]
  }
] as const satisfies readonly Candidate[];

const HOST_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const OITC_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  facadeOutdoorContext: "outdoor_indoor_facade",
  flankingJunctionClass: "rigid_t_junction",
  frequencyBandSet: "third_octave_100_3150",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
  openingFacadeBoundaryIntent: "door_window_facade_frequency_input_boundary",
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementTransmissionLossCurve: {
        frequenciesHz: [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000],
        transmissionLossDb: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48]
      },
      elementType: "window",
      frequencyBandSet: "third_octave_100_3150",
      id: "rerank-oitc-window-01",
      origin: "catalogued",
      ratingBasis: "iso_717_1_curve",
      sealLeakageClass: "average"
    }
  ],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
} as const;

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "rerank ASTM E492 lab source with complete one-third-octave bands",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "rerank ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  DRIFT_LOCK_DOC,
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 runtime-first route-family rerank after ceiling roof/suspended-ceiling route split boundary coverage refresh", () => {
  it("lands the no-runtime rerank and selects the opening/facade outdoor-indoor OITC spectral rating owner", () => {
    for (const path of [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_COVERAGE_PLAN_DOC,
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(CANDIDATES.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.selected)).toMatchObject({
      decision: "selected_next_oitc_spectral_rating_owner",
      id: SELECTED_CANDIDATE_ID,
      requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 1,
      estimatedNextCalculableTargetOutputs: 1,
      estimatedNextRequiredPhysicalInputsCaptured: 4,
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeValuesMoved: 1,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(RERANK_STATUS).toContain("selected_opening_facade_outdoor_indoor_oitc_spectral_rating_owner");
  });

  it("keeps existing ASTM IIC and AIIC exact-band runtime ownership from being selected again", () => {
    const lab = calculateImpactOnly([], {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: ["IIC"]
    });
    const field = calculateImpactOnly([], {
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: ["AIIC"]
    });

    expect(lab.impact).toMatchObject({
      IIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"]
    });

    expect(field.impact).toMatchObject({
      AIIC: 50,
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"]
    });

    expect(CANDIDATES.find((candidate) => candidate.id === "floor.astm_iic_aiic.exact_band_standard_method_owner")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "floor.impact_iic_aiic_source_absent_estimator")).toMatchObject({
      decision: "rejected_unsafe_source_absent_astm_estimator",
      unsupportedBoundaries: ["no IIC/AIIC alias from Ln,w or DeltaLw"]
    });
  });

  it("keeps complete outdoor-indoor OITC requests unsupported until the selected next owner lands", () => {
    const result = calculateAssembly(HOST_WALL, {
      airborneContext: OITC_CONTEXT,
      calculator: "dynamic",
      targetOutputs: OITC_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["OITC"]);
    expect(result.airborneBasis).toMatchObject({
      method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
      origin: "unsupported"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["unsupportedOutputs:OITC"])
    );
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING,
        POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_WARNING
      ])
    );
  });

  it("ties every candidate decision to current implementation or planning evidence", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.implementationEvidencePaths.length, candidate.id).toBeGreaterThan(0);

      for (const evidencePath of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, evidencePath)), `${candidate.id}: ${evidencePath}`).toBe(true);
      }
    }
  });

  it("keeps current docs aligned with the selected OITC spectral rating owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 8");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 1");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 1");
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 4");
      expect(content, path).toContain("estimatedNextRuntimeBasisPromotions: 1");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 1");
      expect(content, path).toContain("estimatedNextUnsupportedBoundariesProtected: 7");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});
