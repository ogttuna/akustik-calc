import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const INTERNAL_USE_OPERATING_ENVELOPE_GATE_A = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: "gate_a_short_internal_pilot_usage_note_and_scenario_summary",
  numericRuntimeBehaviorChange: false,
  pilotUsageNote: "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
  previousClosedSlice: "calculator_source_gap_revalidation_v3",
  routeCardCopyChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  scenarioContract:
    "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
  selectedNextAction: "internal_use_operating_envelope_v1_gate_b_regular_internal_use_visibility_audit",
  selectedNextFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
  sliceId: "internal_use_operating_envelope_v1",
  supportPromotion: false
} as const;

const PILOT_BUCKETS = [
  "pilot_ready_with_standard_caveat",
  "pilot_allowed_with_visible_caveat",
  "not_defended_fail_closed_or_source_gated"
] as const;

const PILOT_SCENARIOS = [
  {
    id: "wall_lsf_exact_preset",
    bucket: "pilot_ready_with_standard_caveat",
    confidencePosture: "high_source_backed",
    evidenceTier: "exact_lab_row",
    expectedOutputs: ["Rw", "R'w", "DnT,w"],
    expectedValuesDb: {
      buildingDnTw: 49,
      buildingRwPrime: 48,
      fieldRwPrime: 48,
      labRw: 55
    },
    proofOwners: ["apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"],
    visibleUserMessage: "exact Knauf LSF row; standard internal-estimate caveat still applies"
  },
  {
    id: "wall_aac_single_leaf_benchmark",
    bucket: "pilot_ready_with_standard_caveat",
    confidencePosture: "benchmark_backed",
    evidenceTier: "benchmark_exact_lab_anchor",
    expectedOutputs: ["Rw", "R'w", "DnT,w"],
    expectedValuesDb: {
      buildingDnTw: 46,
      buildingRwPrime: 45,
      fieldRwPrime: 45,
      labRw: 47
    },
    proofOwners: ["apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"],
    visibleUserMessage: "Xella AAC benchmark/exact lab anchor; standard internal-estimate caveat"
  },
  {
    id: "wall_masonry_single_leaf_benchmark",
    bucket: "pilot_ready_with_standard_caveat",
    confidencePosture: "benchmark_backed",
    evidenceTier: "benchmark_exact_lab_anchor",
    expectedOutputs: ["Rw", "R'w", "DnT,w"],
    expectedValuesDb: {
      buildingDnTw: 43,
      buildingRwPrime: 41,
      fieldRwPrime: 41,
      labRw: 43
    },
    proofOwners: ["apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"],
    visibleUserMessage: "Wienerberger masonry benchmark/exact lab anchor; standard internal-estimate caveat"
  },
  {
    id: "floor_exact_bound_source_corridor",
    bucket: "pilot_ready_with_standard_caveat",
    confidencePosture: "source_backed_when_stack_matches_corridor",
    evidenceTier: "exact_or_bound_floor_source_precedence",
    expectedOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedValuesDb: {},
    proofOwners: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "packages/engine/src/floor-source-corpus-contract.test.ts"
    ],
    visibleUserMessage: "exact/bound floor source corridor; only source-backed while topology still matches"
  },
  {
    id: "wall_timber_double_board_generated",
    bucket: "pilot_allowed_with_visible_caveat",
    confidencePosture: "low_confidence_source_gated",
    evidenceTier: "formula_owned",
    expectedOutputs: ["Rw", "R'w", "DnT,w"],
    expectedValuesDb: {
      buildingDnTw: 44,
      fieldDnTw: 43,
      fieldRwPrime: 42,
      labRw: 50
    },
    proofOwners: ["packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts"],
    visibleUserMessage: "low-confidence formula-owned timber double-board estimate; source-gated"
  },
  {
    id: "wall_clt_local_generated",
    bucket: "pilot_allowed_with_visible_caveat",
    confidencePosture: "medium_confidence_source_gated",
    evidenceTier: "formula_owned",
    expectedOutputs: ["Rw", "R'w", "DnT,w"],
    expectedValuesDb: {
      fieldDnTw: 42,
      fieldRwPrime: 41,
      labRw: 42
    },
    proofOwners: ["packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts"],
    visibleUserMessage: "medium-confidence formula-owned CLT wall estimate; source-gated"
  },
  {
    id: "wall_lined_heavy_core_screening",
    bucket: "pilot_allowed_with_visible_caveat",
    confidencePosture: "medium_confidence_screening",
    evidenceTier: "screening",
    expectedOutputs: ["Rw", "R'w", "DnT,w", "DnT,A"],
    expectedValuesDb: {
      fieldDnTA: 54.9,
      fieldDnTw: 56,
      fieldRwPrime: 55,
      labRw: 57
    },
    proofOwners: ["packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"],
    visibleUserMessage: "screening only; no wall-specific bounded lining rule"
  },
  {
    id: "floor_steel_fallback_generated",
    bucket: "pilot_allowed_with_visible_caveat",
    confidencePosture: "low_confidence_screening",
    evidenceTier: "fallback_estimate",
    expectedOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    expectedValuesDb: {
      fieldRwPrime: 70,
      labRw: 61,
      lnT50Unsupported: 1,
      lnTw: 58.5,
      lnw: 58.3,
      lnwPrime: 61.3
    },
    proofOwners: ["packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts"],
    unsupportedTargetOutputs: ["L'nT,50"],
    visibleUserMessage: "low-confidence generated floor fallback; L'nT,50 remains unsupported"
  },
  {
    id: "many_layer_and_reorder_guardrails",
    bucket: "pilot_allowed_with_visible_caveat",
    confidencePosture: "guardrail_not_source_claim",
    evidenceTier: "stability_guard",
    expectedOutputs: ["finite_or_explicitly_unsupported"],
    expectedValuesDb: {},
    proofOwners: [
      "packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts",
      "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
    ],
    visibleUserMessage: "many-layer and reorder edits must stay finite, stable, or explicitly unsupported"
  },
  {
    id: "invalid_or_missing_inputs",
    bucket: "not_defended_fail_closed_or_source_gated",
    confidencePosture: "fail_closed_or_needs_input",
    evidenceTier: "input_guard",
    expectedOutputs: ["needs_input", "unsupported"],
    expectedValuesDb: {},
    proofOwners: [
      "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
      "apps/web/lib/calculator-api-validation.test.ts"
    ],
    visibleUserMessage: "ask for the missing or invalid field instead of synthesizing a defended result"
  },
  {
    id: "wall_no_stud_double_leaf_source_gated",
    bucket: "not_defended_fail_closed_or_source_gated",
    confidencePosture: "formula_owned_source_gated",
    evidenceTier: "source_gap",
    expectedOutputs: ["no_confidence_promotion"],
    expectedValuesDb: {},
    proofOwners: [
      "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts"
    ],
    visibleUserMessage: "not defended without direct no-stud rows or a bounded Davy/Sharp tolerance owner"
  },
  {
    id: "historical_blocked_floor_families",
    bucket: "not_defended_fail_closed_or_source_gated",
    confidencePosture: "closed_fail_closed",
    evidenceTier: "historical_source_gap",
    expectedOutputs: ["no_reopen_from_nearby_green_tests"],
    expectedValuesDb: {},
    proofOwners: [
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts"
    ],
    visibleUserMessage: "GDMTXA04A, C11c, and raw open-box/open-web remain closed source gaps"
  }
] as const;

const GATE_B_VISIBILITY_AUDIT = {
  allowedRuntimeMathChange: false,
  expectedAuditSurfaces: ["workbench_route_cards", "proposal_report_output_notes", "docs_operating_envelope"],
  firstGateFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
  requiredScenarioSource: "PILOT_SCENARIOS",
  selectedAction: "regular_internal_use_visibility_audit",
  triggerForFix: "only_if_a_low_confidence_screening_unsupported_or_source_gated_scenario_looks_too_certain"
} as const;

function readPilotUsageNote(): string {
  return readFileSync(join(REPO_ROOT, INTERNAL_USE_OPERATING_ENVELOPE_GATE_A.pilotUsageNote), "utf8");
}

describe("internal use operating envelope v1 Gate A contract", () => {
  it("lands the short pilot pack without runtime, support, confidence, evidence, API, or route-card movement", () => {
    expect(INTERNAL_USE_OPERATING_ENVELOPE_GATE_A).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_a_short_internal_pilot_usage_note_and_scenario_summary",
      numericRuntimeBehaviorChange: false,
      pilotUsageNote: "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
      previousClosedSlice: "calculator_source_gap_revalidation_v3",
      routeCardCopyChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      scenarioContract:
        "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
      selectedNextAction: "internal_use_operating_envelope_v1_gate_b_regular_internal_use_visibility_audit",
      selectedNextFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
      sliceId: "internal_use_operating_envelope_v1",
      supportPromotion: false
    });
  });

  it("keeps the pilot usage note present and synced with every operating-envelope bucket and scenario id", () => {
    const note = readPilotUsageNote();

    for (const bucket of PILOT_BUCKETS) {
      expect(note, `usage note should include bucket ${bucket}`).toContain(bucket);
    }

    for (const scenario of PILOT_SCENARIOS) {
      expect(note, `usage note should include scenario ${scenario.id}`).toContain(scenario.id);
      expect(note, `usage note should include bucket for ${scenario.id}`).toContain(scenario.bucket);
    }
  });

  it("pins the pilot scenario matrix to current proof owners and current representative values", () => {
    expect(PILOT_SCENARIOS.map((scenario) => scenario.id)).toEqual([
      "wall_lsf_exact_preset",
      "wall_aac_single_leaf_benchmark",
      "wall_masonry_single_leaf_benchmark",
      "floor_exact_bound_source_corridor",
      "wall_timber_double_board_generated",
      "wall_clt_local_generated",
      "wall_lined_heavy_core_screening",
      "floor_steel_fallback_generated",
      "many_layer_and_reorder_guardrails",
      "invalid_or_missing_inputs",
      "wall_no_stud_double_leaf_source_gated",
      "historical_blocked_floor_families"
    ]);

    expect(PILOT_SCENARIOS.find((scenario) => scenario.id === "wall_lsf_exact_preset")?.expectedValuesDb).toEqual({
      buildingDnTw: 49,
      buildingRwPrime: 48,
      fieldRwPrime: 48,
      labRw: 55
    });
    expect(
      PILOT_SCENARIOS.find((scenario) => scenario.id === "wall_timber_double_board_generated")?.expectedValuesDb
    ).toEqual({
      buildingDnTw: 44,
      fieldDnTw: 43,
      fieldRwPrime: 42,
      labRw: 50
    });
    expect(PILOT_SCENARIOS.find((scenario) => scenario.id === "wall_clt_local_generated")?.expectedValuesDb).toEqual({
      fieldDnTw: 42,
      fieldRwPrime: 41,
      labRw: 42
    });
    expect(
      PILOT_SCENARIOS.find((scenario) => scenario.id === "wall_lined_heavy_core_screening")?.expectedValuesDb
    ).toEqual({
      fieldDnTA: 54.9,
      fieldDnTw: 56,
      fieldRwPrime: 55,
      labRw: 57
    });
    expect(
      PILOT_SCENARIOS.find((scenario) => scenario.id === "floor_steel_fallback_generated")?.expectedValuesDb
    ).toEqual({
      fieldRwPrime: 70,
      labRw: 61,
      lnT50Unsupported: 1,
      lnTw: 58.5,
      lnw: 58.3,
      lnwPrime: 61.3
    });

    for (const scenario of PILOT_SCENARIOS) {
      expect(scenario.proofOwners.length, `${scenario.id} should have at least one proof owner`).toBeGreaterThan(0);
      for (const proofOwner of scenario.proofOwners) {
        expect(existsSync(join(REPO_ROOT, proofOwner)), `${scenario.id} proof owner should exist: ${proofOwner}`).toBe(
          true
        );
      }
    }
  });

  it("does not promote low-confidence, screening, source-gated, unsupported, or fail-closed work into the pilot-ready bucket", () => {
    const nonReadyScenarios = PILOT_SCENARIOS.filter((scenario) =>
      /low_confidence|screening|source_gated|fail_closed|input_guard|source_gap|fallback|stability_guard/.test(
        `${scenario.confidencePosture} ${scenario.evidenceTier}`
      )
    );

    expect(nonReadyScenarios.map((scenario) => scenario.id)).toEqual([
      "wall_timber_double_board_generated",
      "wall_clt_local_generated",
      "wall_lined_heavy_core_screening",
      "floor_steel_fallback_generated",
      "many_layer_and_reorder_guardrails",
      "invalid_or_missing_inputs",
      "wall_no_stud_double_leaf_source_gated",
      "historical_blocked_floor_families"
    ]);

    for (const scenario of nonReadyScenarios) {
      expect(scenario.bucket, `${scenario.id} must not be pilot-ready`).not.toBe(
        "pilot_ready_with_standard_caveat"
      );
      expect(scenario.visibleUserMessage, `${scenario.id} must have a user-visible caveat`).toMatch(
        /caveat|source-gated|screening|unsupported|missing|invalid|not defended|low-confidence|finite|closed source gaps/i
      );
    }
  });

  it("keeps unsupported and missing-input behavior explicit for pilot use", () => {
    const fallback = PILOT_SCENARIOS.find((scenario) => scenario.id === "floor_steel_fallback_generated");
    const invalidInputs = PILOT_SCENARIOS.find((scenario) => scenario.id === "invalid_or_missing_inputs");

    expect(fallback?.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(fallback?.visibleUserMessage).toMatch(/unsupported/i);
    expect(invalidInputs?.expectedOutputs).toEqual(["needs_input", "unsupported"]);
    expect(invalidInputs?.bucket).toBe("not_defended_fail_closed_or_source_gated");
  });

  it("selects Gate B as a visibility audit for regular internal use, not a math or confidence retune", () => {
    expect(GATE_B_VISIBILITY_AUDIT).toEqual({
      allowedRuntimeMathChange: false,
      expectedAuditSurfaces: ["workbench_route_cards", "proposal_report_output_notes", "docs_operating_envelope"],
      firstGateFile: "packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
      requiredScenarioSource: "PILOT_SCENARIOS",
      selectedAction: "regular_internal_use_visibility_audit",
      triggerForFix: "only_if_a_low_confidence_screening_unsupported_or_source_gated_scenario_looks_too_certain"
    });
  });
});
