import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const INTERNAL_USE_OPERATING_ENVELOPE_GATE_B = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: "gate_b_regular_internal_use_visibility_audit",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  previousGate: "internal_use_operating_envelope_v1_gate_a_short_pilot_pack",
  reportEvidenceCopyChange: true,
  routeCardValueChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "internal_use_operating_envelope_v1_gate_c_closeout_and_next_slice_selection",
  selectedNextFile: "packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts",
  sliceId: "internal_use_operating_envelope_v1",
  supportPromotion: false
} as const;

const GATE_B_VISIBILITY_FIX = {
  changedSurfaces: [
    "apps/web/features/workbench/validation-regime.ts",
    "apps/web/features/workbench/guided-validation-summary.ts",
    "apps/web/features/workbench/simple-workbench-evidence.ts"
  ],
  reason:
    "wall_dynamic_formula_routes_needed_explicit_formula_owned_source_gated_wording_in_validation_evidence_and_proposal_surfaces",
  testOwner: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts"
} as const;

const GATE_B_SCENARIO_AUDIT = [
  {
    caveatRequired: "formula_owned_source_gated_scoped_estimate",
    id: "wall_timber_double_board_generated",
    proofSurfaces: ["guided_validation_summary", "dynamic_airborne_evidence_citation", "proposal_brief"],
    protectedBy: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
    runtimeMovementAllowed: false
  },
  {
    caveatRequired: "formula_owned_source_gated_scoped_estimate",
    id: "wall_clt_local_generated",
    proofSurfaces: ["guided_validation_summary", "dynamic_airborne_evidence_citation", "proposal_brief"],
    protectedBy: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
    runtimeMovementAllowed: false
  },
  {
    caveatRequired: "formula_owned_source_gated_scoped_estimate",
    id: "wall_lined_heavy_core_screening",
    proofSurfaces: ["guided_validation_summary", "dynamic_airborne_evidence_citation", "proposal_brief"],
    protectedBy: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
    runtimeMovementAllowed: false
  },
  {
    caveatRequired: "low_confidence_screening_fallback_and_unsupported_lprimen_t50",
    id: "floor_steel_fallback_generated",
    proofSurfaces: [
      "dynamic_branch_summary",
      "guided_validation_summary",
      "decision_trail",
      "proposal_brief",
      "unsupported_output_card"
    ],
    protectedBy: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
    runtimeMovementAllowed: false
  }
] as const;

const EXISTING_SURFACE_OWNERS = [
  "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
  "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
  "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
  "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.test.ts"
] as const;

const GATE_C_CLOSEOUT_SCOPE = {
  firstFile: "packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts",
  requiredDecision:
    "close_internal_use_operating_envelope_or_select_only_a_source_ready_accuracy_slice",
  shouldUpdate: [
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
    "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md"
  ]
} as const;

describe("internal use operating envelope v1 Gate B contract", () => {
  it("lands Gate B as a visible-honesty audit and copy fix without runtime movement", () => {
    expect(INTERNAL_USE_OPERATING_ENVELOPE_GATE_B).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_b_regular_internal_use_visibility_audit",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      previousGate: "internal_use_operating_envelope_v1_gate_a_short_pilot_pack",
      reportEvidenceCopyChange: true,
      routeCardValueChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "internal_use_operating_envelope_v1_gate_c_closeout_and_next_slice_selection",
      selectedNextFile: "packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts",
      sliceId: "internal_use_operating_envelope_v1",
      supportPromotion: false
    });
  });

  it("ties the visibility fix to concrete web surfaces and a focused web proof", () => {
    expect(GATE_B_VISIBILITY_FIX).toEqual({
      changedSurfaces: [
        "apps/web/features/workbench/validation-regime.ts",
        "apps/web/features/workbench/guided-validation-summary.ts",
        "apps/web/features/workbench/simple-workbench-evidence.ts"
      ],
      reason:
        "wall_dynamic_formula_routes_needed_explicit_formula_owned_source_gated_wording_in_validation_evidence_and_proposal_surfaces",
      testOwner: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts"
    });

    for (const path of [...GATE_B_VISIBILITY_FIX.changedSurfaces, GATE_B_VISIBILITY_FIX.testOwner]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("audits the caveated internal-use scenario set without promoting confidence or support", () => {
    expect(GATE_B_SCENARIO_AUDIT.map((scenario) => scenario.id)).toEqual([
      "wall_timber_double_board_generated",
      "wall_clt_local_generated",
      "wall_lined_heavy_core_screening",
      "floor_steel_fallback_generated"
    ]);

    for (const scenario of GATE_B_SCENARIO_AUDIT) {
      expect(scenario.runtimeMovementAllowed, `${scenario.id} runtime`).toBe(false);
      expect(scenario.proofSurfaces.length, `${scenario.id} proof surface count`).toBeGreaterThanOrEqual(3);
      expect(existsSync(join(REPO_ROOT, scenario.protectedBy)), `${scenario.id} protectedBy`).toBe(true);
      expect(scenario.caveatRequired, `${scenario.id} caveat`).toMatch(
        /formula_owned_source_gated|low_confidence_screening/
      );
    }
  });

  it("keeps existing route-card and proposal owners in scope for regular internal-use visibility", () => {
    for (const owner of EXISTING_SURFACE_OWNERS) {
      expect(existsSync(join(REPO_ROOT, owner)), owner).toBe(true);
    }
  });

  it("selects Gate C closeout and next-slice selection instead of another Gate B runtime pass", () => {
    expect(GATE_C_CLOSEOUT_SCOPE).toEqual({
      firstFile: "packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts",
      requiredDecision:
        "close_internal_use_operating_envelope_or_select_only_a_source_ready_accuracy_slice",
      shouldUpdate: [
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md",
        "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md"
      ]
    });
  });
});
