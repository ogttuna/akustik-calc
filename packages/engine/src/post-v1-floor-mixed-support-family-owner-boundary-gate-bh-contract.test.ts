import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildPersonalUseMvpCoverageSprintGateBBInputContract } from "./calculator-personal-use-mvp-coverage-sprint-gate-bb";
import {
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS,
  summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH
} from "./post-v1-floor-mixed-support-family-owner-boundary-gate-bh";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-bg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BH_SURFACES = [
  "packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh.ts",
  "packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor mixed-support family owner boundary Gate BH", () => {
  it("lands Gate BH after Gate BG and selects the mixed-support runtime corridor Gate BI", () => {
    const summary = summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBG: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS,
      sourceRowsRequiredForSelection: false,
      targetMetricsForRuntimeFollowup: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });

    for (const path of REQUIRED_GATE_BH_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins mixed-support owner fields as no-default physical ownership boundaries", () => {
    const summary = summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH();

    expect(summary.ownerFields).toEqual([
      {
        defaultPolicy: "no_default",
        fieldId: "primaryCarrierFamily",
        missingBehavior: "needs_input",
        ownerId: "floorMixedSupportPrimaryCarrierOwner",
        runtimeDefaultAllowed: false
      },
      {
        defaultPolicy: "no_default",
        fieldId: "dominantImpactTransferFamily",
        missingBehavior: "needs_input",
        ownerId: "floorMixedSupportDominantImpactTransferOwner",
        runtimeDefaultAllowed: false
      },
      {
        defaultPolicy: "no_default",
        fieldId: "mixedSupportRolePartition",
        missingBehavior: "needs_input",
        ownerId: "floorMixedSupportRolePartitionOwner",
        runtimeDefaultAllowed: false
      },
      {
        defaultPolicy: "no_default",
        fieldId: "secondarySupportTreatmentOwner",
        missingBehavior: "needs_input",
        ownerId: "floorMixedSupportSecondaryTreatmentOwner",
        runtimeDefaultAllowed: false
      },
      {
        defaultPolicy: "no_default",
        fieldId: "duplicateOwnershipGuard",
        missingBehavior: "needs_input",
        ownerId: "floorMixedSupportDuplicateOwnershipGuard",
        runtimeDefaultAllowed: false
      }
    ]);
  });

  it("keeps the current mixed-support family fail-closed instead of inventing a formula result", () => {
    const summary = summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH();
    const current = buildPersonalUseMvpCoverageSprintGateBBInputContract({
      family: "mixed_support_family",
      hostileFlags: ["mixed_support_family"],
      targetOutputs: ["Ln,w", "DeltaLw"]
    });

    expect(current.status).toBe("fail_closed_mixed_family");
    expect(current.missingPhysicalInputs).toEqual(["duplicateOwnershipGuard"]);
    expect(current.formulaCorridorReady).toBe(false);
    expect(current.noRuntimeValueMovement).toBe(true);
    expect(summary.currentMixedSupportStop).toEqual({
      missingPhysicalInputs: ["duplicateOwnershipGuard"],
      status: "fail_closed_mixed_family",
      supportedOutputs: [],
      unsupportedOutputs: []
    });
  });

  it("classifies safe runtime candidate and unsafe boundaries without moving runtime values", () => {
    const summary = summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH();
    const byId = new Map(summary.boundaryCases.map((entry) => [entry.id, entry]));

    expect(summary.boundaryCases.every((entry) => entry.runtimeValueMovementAllowedInGateBH === false)).toBe(true);
    expect(byId.get("explicit_single_primary_carrier_safe_runtime_candidate")).toMatchObject({
      expectedBehavior: "runtime_candidate_for_gate_bi",
      missingOwnerFields: [],
      selectedForGateBIRuntime: true
    });
    expect(byId.get("current_mixed_support_family_duplicate_owner_fail_closed")).toMatchObject({
      expectedBehavior: "needs_input",
      missingOwnerFields: ["duplicateOwnershipGuard"],
      selectedForGateBIRuntime: false
    });
    expect(byId.get("missing_primary_carrier_owner_needs_input")).toMatchObject({
      expectedBehavior: "needs_input",
      missingOwnerFields: ["primaryCarrierFamily", "dominantImpactTransferFamily"]
    });
    expect(byId.get("missing_role_partition_needs_input")).toMatchObject({
      expectedBehavior: "needs_input",
      missingOwnerFields: ["mixedSupportRolePartition", "secondarySupportTreatmentOwner"]
    });
    expect(byId.get("wrong_standard_astm_alias_remains_unsupported")).toMatchObject({
      expectedBehavior: "unsupported",
      selectedForGateBIRuntime: false
    });
  });

  it("keeps docs and current-gate runner aligned with Gate BH closeout and Gate BI selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("primaryCarrierFamily");
      expect(contents, path).toContain("scope/accuracy");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts");
  });
});
