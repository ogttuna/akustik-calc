import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w"] as const;
const LAB_UNSUPPORTED_OUTPUTS = ["Ln,w+CI", "DeltaLw"] as const;
const FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const;
const FIELD_UNSUPPORTED_OUTPUTS = ["L'nT,50"] as const;

const ESTIMATE_CANDIDATE_IDS = [
  "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
  "ubiq_fl32_steel_200_lab_2026",
  "ubiq_fl32_steel_300_lab_2026",
  "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
  "pliteq_steel_joist_250_rst02_wood_lab_2026"
] as const;

const SELECTED_PLITEQ_SOURCE_IDS = [
  "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
  "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
  "pliteq_steel_joist_250_rst02_wood_lab_2026"
] as const;

const UBIQ_STEEL_BOUND_IDS = [
  "ubiq_fl32_steel_200_lab_2026",
  "ubiq_fl32_steel_300_lab_2026"
] as const;

const FLOOR_FALLBACK_GATE_A_AUDIT = {
  activeSlice: "floor_fallback_low_confidence_cleanup_v1",
  candidateId: "floor.steel_fallback_low_confidence.field",
  generatedCaseId: "floor-steel-fallback",
  gate: "Gate A",
  nextAction:
    "start_gate_b_source_formula_decision_for_floor_steel_fallback_before_any_runtime_math_change",
  runtimeBehaviorChange: false,
  status: "no_runtime_current_surface_and_source_audit_landed"
} as const;

const GATE_A_SOURCE_DECISION = {
  currentLane: "low_confidence_fallback",
  exactPromotionAllowedNow: false,
  boundPromotionAllowedNow: false,
  formulaPromotionAllowedNow: false,
  exactNearMissReason:
    "pliteq_rows_match_the_steel_joist_family_but_require_inex_deck_geniemat_layer_glasswool_fill_and_2_5mm_or_other_finishes",
  boundNearMissReason:
    "ubiq_fl32_rows_are_200_or_300mm_bound_rows_with_inex_deck_engineered_timber_floor_and_no_ceiling_fill_not_the_live_250mm_vinyl_stack",
  requiredBeforeRuntimeChange:
    "exact_source_row_bounded_family_rule_or_fail_closed_correction_with_named_tolerance_and_exact_row_precedence"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "promote_floor_steel_fallback_from_nearby_pliteq_or_ubiq_rows_by_family_adjacency_alone",
    "add_lprimen_t50_support_without_source_bound_or_formula_basis",
    "hide_low_confidence_fallback_behind_generic_estimated_card_wording",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_core_concrete_wall_selector_timber_stud_or_clt_wall_from_this_gate",
    "change_runtime_or_web_posture_in_gate_a"
  ]
} as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function exactFloorSystem(id: string) {
  const found = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

  if (!found) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return found;
}

function boundFloorSystem(id: string) {
  const found = BOUND_FLOOR_SYSTEMS.find((system) => system.id === id);

  if (!found) {
    throw new Error(`Missing bound floor system ${id}`);
  }

  return found;
}

describe("floor fallback low-confidence Gate A audit contract", () => {
  it("records the no-runtime Gate A audit surface before any steel fallback retune", () => {
    expect(FLOOR_FALLBACK_GATE_A_AUDIT).toEqual({
      activeSlice: "floor_fallback_low_confidence_cleanup_v1",
      candidateId: "floor.steel_fallback_low_confidence.field",
      generatedCaseId: "floor-steel-fallback",
      gate: "Gate A",
      nextAction:
        "start_gate_b_source_formula_decision_for_floor_steel_fallback_before_any_runtime_math_change",
      runtimeBehaviorChange: false,
      status: "no_runtime_current_surface_and_source_audit_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md",
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md",
      "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
      "packages/engine/src/raw-floor-screening-carrier-support.test.ts",
      "packages/engine/src/floor-source-corpus-contract.test.ts",
      "packages/engine/src/floor-library-sweep.test.ts",
      "apps/web/features/workbench/raw-floor-screening-route-support.test.ts",
      "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
      "apps/web/features/workbench/impact-result-panel.tsx",
      "apps/web/features/workbench/result-summary.tsx"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins generated floor-steel-fallback lab and field values with unsupported outputs explicit", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(testCase.studyMode).toBe("floor");
    expect(testCase.rows).toEqual([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
    ]);

    expect(resultSnapshot(lab)).toEqual({
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      c: -0.9,
      ctr: -5.8,
      dnTA: null,
      dnTw: null,
      dnW: null,
      dynamicFamily: null,
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: 58.3,
      lnWPlusCI: null,
      rw: 61,
      rwDb: 72.2,
      rwPrimeDb: null,
      stc: 72,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: [...LAB_UNSUPPORTED_OUTPUTS],
      warnings: [
        "Screening estimate only. This result is coming from the local calibrated seed lane.",
        "Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate.",
        "Some requested impact sound outputs are still unavailable for the current input/path: Ln,w+CI, DeltaLw. DynEcho kept those outputs explicit instead of fabricating unsupported ratings.",
        "Impact predictor input is active. DynEcho is resolving the impact lane against a dedicated predictor topology while preserving the visible assembly stack for airborne screening and UI continuity.",
        "Impact predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector.",
        "Published low-confidence fallback active: lightweight steel at 28% fit."
      ]
    });

    expect(resultSnapshot(field)).toEqual({
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      c: -0.9,
      ctr: -5.6,
      dnTA: 70.6,
      dnTw: 72,
      dnW: 69,
      dynamicFamily: null,
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      floorSystemMatchId: null,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: null,
      lPrimeNTw: 58.5,
      lPrimeNW: 61.3,
      lnW: 58.3,
      lnWPlusCI: null,
      rw: 61,
      rwDb: 70.2,
      rwPrimeDb: 70,
      stc: 70,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
      unsupportedTargetOutputs: [...FIELD_UNSUPPORTED_OUTPUTS],
      warnings: [
        "Screening estimate only. This result is coming from the local calibrated seed lane.",
        "Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate.",
        "Airborne field-side overlay active. The current building prediction context is carrying a conservative flanking penalty of 1.8 dB.",
        "Some requested impact sound outputs are still unavailable for the current input/path: L'nT,50. DynEcho kept those outputs explicit instead of fabricating unsupported ratings.",
        "Impact predictor input is active. DynEcho is resolving the impact lane against a dedicated predictor topology while preserving the visible assembly stack for airborne screening and UI continuity.",
        "Impact predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector.",
        "Published low-confidence fallback active: lightweight steel at 28% fit.",
        "Live field-side supplement is active on the main impact lane. K and receiving-room context are now carried through the engine boundary, not only the guide lane."
      ]
    });
  });

  it("pins low-confidence origin, candidate lineage, and field continuation posture", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(lab.floorSystemEstimate).toMatchObject({
      fitPercent: 28,
      kind: "low_confidence",
      structuralFamily: "lightweight steel"
    });
    expect(lab.impact).toMatchObject({
      LnW: 58.3,
      availableOutputs: ["Ln,w"],
      basis: "predictor_floor_system_low_confidence_estimate",
      confidence: {
        level: "low",
        provenance: "published_family_estimate",
        score: 0.54
      },
      estimateCandidateIds: [...ESTIMATE_CANDIDATE_IDS],
      metricBasis: {
        LnW: "predictor_floor_system_low_confidence_estimate"
      },
      scope: "family_estimate"
    });
    expect(lab.dynamicImpactTrace).toMatchObject({
      confidenceClass: "low",
      confidenceScore: 0.54,
      detectedSupportFamily: "steel_joists",
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      fieldContinuation: "none",
      fieldOutputsActive: false,
      fitPercent: 28,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      selectedSourceIds: [...SELECTED_PLITEQ_SOURCE_IDS],
      selectionKind: "family_estimate",
      structuralSupportType: "steel_joists",
      supportForm: "joist_or_purlin",
      systemType: "suspended_ceiling_only"
    });

    expect(field.floorSystemEstimate).toMatchObject({
      fitPercent: 28,
      kind: "low_confidence",
      structuralFamily: "lightweight steel"
    });
    expect(field.impact).toMatchObject({
      LPrimeNTw: 58.5,
      LPrimeNW: 61.3,
      LnW: 58.3,
      availableOutputs: ["Ln,w", "L'n,w", "L'nT,w"],
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      confidence: {
        level: "medium",
        provenance: "published_family_estimate",
        score: 0.72
      },
      estimateCandidateIds: [...ESTIMATE_CANDIDATE_IDS],
      fieldEstimateKCorrectionDb: 3,
      fieldEstimateProfile: "explicit_field_lprimenw_from_lnw_plus_k",
      metricBasis: {
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: "predictor_floor_system_low_confidence_estimate"
      },
      scope: "family_estimate"
    });
    expect(field.dynamicImpactTrace).toMatchObject({
      confidenceClass: "medium",
      confidenceScore: 0.72,
      detectedSupportFamily: "steel_joists",
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      fieldContinuation: "standardized_room_volume",
      fieldOutputsActive: true,
      fitPercent: 28,
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      selectedSourceIds: [...SELECTED_PLITEQ_SOURCE_IDS],
      selectionKind: "family_estimate",
      standardizedFieldActive: true,
      structuralSupportType: "steel_joists",
      supportForm: "joist_or_purlin",
      systemType: "suspended_ceiling_only"
    });
  });

  it("blocks exact and bound promotion while keeping Gate B evidence requirements explicit", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const pliteqVinyl = exactFloorSystem("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    const ubiqBounds = UBIQ_STEEL_BOUND_IDS.map(boundFloorSystem);

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.boundFloorSystemMatch).toBeNull();
    expect(lab.boundFloorSystemEstimate).toBeNull();
    expect(field.floorSystemMatch).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();

    expect(pliteqVinyl).toMatchObject({
      airborneRatings: { Rw: 60 },
      impactRatings: { LnW: 58 },
      match: {
        ceilingCavity: { materialIds: ["resilient_channel"], thicknessMm: 120 },
        ceilingFill: { materialIds: ["glasswool"], thicknessMm: 100 },
        floorCovering: { materialIds: ["vinyl_flooring"], thicknessMm: 2.5 },
        floatingScreed: { materialIds: ["inex_floor_panel"], thicknessMm: 19 },
        resilientLayer: { materialIds: ["geniemat_rst02"], thicknessMm: 2 }
      }
    });
    expect(testCase.rows).not.toContainEqual({
      floorRole: "floating_screed",
      materialId: "inex_floor_panel",
      thicknessMm: 19
    });
    expect(testCase.rows).not.toContainEqual({
      floorRole: "resilient_layer",
      materialId: "geniemat_rst02",
      thicknessMm: 2
    });

    expect(ubiqBounds.map((system) => system.id)).toEqual([...UBIQ_STEEL_BOUND_IDS]);
    expect(ubiqBounds.map((system) => system.match.baseStructure?.thicknessMm)).toEqual([200, 300]);
    expect(ubiqBounds.map((system) => system.match.absentRoles)).toEqual([
      ["upper_fill", "ceiling_fill"],
      ["upper_fill", "ceiling_fill"]
    ]);
    expect(testCase.rows).toContainEqual({
      floorRole: "ceiling_fill",
      materialId: "rockwool",
      thicknessMm: 100
    });
    expect(testCase.rows).toContainEqual({
      floorRole: "floor_covering",
      materialId: "vinyl_flooring",
      thicknessMm: 3
    });

    expect(GATE_A_SOURCE_DECISION).toEqual({
      currentLane: "low_confidence_fallback",
      exactPromotionAllowedNow: false,
      boundPromotionAllowedNow: false,
      formulaPromotionAllowedNow: false,
      exactNearMissReason:
        "pliteq_rows_match_the_steel_joist_family_but_require_inex_deck_geniemat_layer_glasswool_fill_and_2_5mm_or_other_finishes",
      boundNearMissReason:
        "ubiq_fl32_rows_are_200_or_300mm_bound_rows_with_inex_deck_engineered_timber_floor_and_no_ceiling_fill_not_the_live_250mm_vinyl_stack",
      requiredBeforeRuntimeChange:
        "exact_source_row_bounded_family_rule_or_fail_closed_correction_with_named_tolerance_and_exact_row_precedence"
    });
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "promote_floor_steel_fallback_from_nearby_pliteq_or_ubiq_rows_by_family_adjacency_alone",
      "add_lprimen_t50_support_without_source_bound_or_formula_basis",
      "hide_low_confidence_fallback_behind_generic_estimated_card_wording",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_heavy_core_concrete_wall_selector_timber_stud_or_clt_wall_from_this_gate",
      "change_runtime_or_web_posture_in_gate_a"
    ]);
  });
});
