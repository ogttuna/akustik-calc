import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_current_gate_stale_metric_basis_reconciliation";
const SELECTED_CANDIDATE_ID =
  "current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna";

const RECONCILIATION_ACTION =
  "post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_plan";
const RECONCILIATION_FILE =
  "packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts";
const RECONCILIATION_PLAN_DOC =
  "docs/calculator/POST_V1_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_AFTER_OPENING_LEAK_APPARENT_DNA_PLAN_2026-06-23.md";
const RECONCILIATION_STATUS =
  "post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_landed_no_runtime_selected_runtime_first_rerank_after_current_gate_reconciliation";

const SELECTED_NEXT_CANDIDATE_ID =
  "runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation";
const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-current-gate-stale-metric-basis-reconciliation-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_PLAN_2026-06-23.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after current-gate stale metric/basis reconciliation";

const RECONCILIATION_COUNTERS = {
  currentGateKnownFailureAssertionsReconciled: 34,
  frontendImplementationFilesTouched: 1,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  staleExpectationFilesTouched: 22,
  webCurrentGateStaleFailureAssertionsReconciled: 4,
  webStaleExpectationFilesTouched: 4
} as const;

const RECONCILED_STALE_EXPECTATION_FILES = [
  "packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-surface-parity-contract.test.ts",
  "packages/engine/src/broad-accuracy-post-helper-only-timber-open-web-impact-stack-coverage-revalidation-contract.test.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts",
  "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity-contract.test.ts",
  "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts",
  "packages/engine/src/post-v1-wall-flat-multicavity-field-physics-companion-gate-ai-contract.test.ts"
] as const;

const RECONCILED_FAILURE_FAMILIES = [
  {
    assertionsReconciled: 15,
    id: "impact_only_routes_do_not_advertise_airborne_outputs",
    protectedBoundary:
      "Impact-only floor/helper/open-web routes keep internal airborne ratings only as provenance and leave Rw/C/Ctr unsupported until an airborne route owns them."
  },
  {
    assertionsReconciled: 6,
    id: "opening_leak_apparent_dna_landed_support",
    protectedBoundary:
      "Opening/leak building requests now support apparent Dn,A beside Dn,w only on the owned building A-weighted route; lab, field, and wrong-basis aliases stay closed."
  },
  {
    assertionsReconciled: 2,
    id: "user_verified_calculated_exact_precedence",
    protectedBoundary:
      "user_verified_calculated_exact remains below exact measured and bounded measured-subassembly-plus-delta candidates, but above generic calculated routes."
  },
  {
    assertionsReconciled: 5,
    id: "mixed_field_building_missing_input_owner",
    protectedBoundary:
      "Mixed field/building probes now choose the required-input owner rather than leaking lab, raw-bare, direct-fixed, or supported-band basis values."
  },
  {
    assertionsReconciled: 6,
    id: "flat_multicavity_missing_rt60_and_topology_boundaries",
    protectedBoundary:
      "Flat multicavity missing-RT60 requests may keep lab/screening and apparent companions live, while standardized outputs and missing topology remain blocked."
  }
] as const;

const RECONCILED_WEB_STALE_EXPECTATION_FILES = [
  "apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts",
  "apps/web/features/workbench/company-internal-opening-leak-building-surface-parity.test.ts",
  "apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts"
] as const;

const WEB_SURFACE_IMPLEMENTATION_FILES = [
  "apps/web/features/workbench/opening-leak-field-building-surface.ts"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  RECONCILIATION_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildReconciliationSummary() {
  const reconciledAssertions = RECONCILED_FAILURE_FAMILIES.reduce(
    (total, family) => total + family.assertionsReconciled,
    0
  );

  if (reconciledAssertions !== RECONCILIATION_COUNTERS.currentGateKnownFailureAssertionsReconciled) {
    throw new Error("Current-gate stale assertion count must stay explicit.");
  }

  if (RECONCILED_STALE_EXPECTATION_FILES.length !== RECONCILIATION_COUNTERS.staleExpectationFilesTouched) {
    throw new Error("Reconciled stale expectation file count must stay explicit.");
  }

  if (RECONCILED_WEB_STALE_EXPECTATION_FILES.length !== RECONCILIATION_COUNTERS.webStaleExpectationFilesTouched) {
    throw new Error("Reconciled web stale expectation file count must stay explicit.");
  }

  if (WEB_SURFACE_IMPLEMENTATION_FILES.length !== RECONCILIATION_COUNTERS.frontendImplementationFilesTouched) {
    throw new Error("Frontend surface implementation touch count must stay explicit.");
  }

  return {
    counters: RECONCILIATION_COUNTERS,
    failureFamilies: RECONCILED_FAILURE_FAMILIES,
    landedGate: RECONCILIATION_ACTION,
    noRuntimeValueMovement: true,
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      planDoc: PREVIOUS_RERANK_PLAN_DOC,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    reconciledStaleExpectationFiles: RECONCILED_STALE_EXPECTATION_FILES,
    reconciledWebStaleExpectationFiles: RECONCILED_WEB_STALE_EXPECTATION_FILES,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextCandidateId: SELECTED_NEXT_CANDIDATE_ID,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RECONCILIATION_STATUS,
    webSurfaceImplementationFiles: WEB_SURFACE_IMPLEMENTATION_FILES
  };
}

describe("post-V1 current-gate stale metric/basis reconciliation after opening/leak apparent Dn,w/Dn,A", () => {
  it("lands the no-runtime reconciliation and selects a fresh runtime-first rerank", () => {
    const summary = buildReconciliationSummary();

    expect(summary).toMatchObject({
      counters: RECONCILIATION_COUNTERS,
      landedGate: RECONCILIATION_ACTION,
      noRuntimeValueMovement: true,
      previousRerank: {
        action: PREVIOUS_RERANK_ACTION,
        file: PREVIOUS_RERANK_FILE,
        planDoc: PREVIOUS_RERANK_PLAN_DOC,
        selectedCandidateId: SELECTED_CANDIDATE_ID,
        selectionStatus: PREVIOUS_RERANK_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextCandidateId: SELECTED_NEXT_CANDIDATE_ID,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RECONCILIATION_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_RERANK_PLAN_DOC,
      RECONCILIATION_FILE,
      RECONCILIATION_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records only stale expectation files and no runtime/source movement", () => {
    const summary = buildReconciliationSummary();

    expect(summary.reconciledStaleExpectationFiles).toHaveLength(
      RECONCILIATION_COUNTERS.staleExpectationFilesTouched
    );
    expect(new Set(summary.reconciledStaleExpectationFiles).size).toBe(
      RECONCILIATION_COUNTERS.staleExpectationFilesTouched
    );

    for (const path of summary.reconciledStaleExpectationFiles) {
      expect(path.endsWith("-contract.test.ts") || path.endsWith("-v1-contract.test.ts"), path).toBe(true);
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    expect(RECONCILIATION_COUNTERS.newCalculableRequestShapes).toBe(0);
    expect(RECONCILIATION_COUNTERS.newCalculableTargetOutputs).toBe(0);
    expect(RECONCILIATION_COUNTERS.runtimeBasisPromotions).toBe(0);
    expect(RECONCILIATION_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RECONCILIATION_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RECONCILIATION_COUNTERS.sourceRowsImported).toBe(0);
    expect(RECONCILIATION_COUNTERS.frontendImplementationFilesTouched).toBe(1);
    expect(RECONCILIATION_COUNTERS.webCurrentGateStaleFailureAssertionsReconciled).toBe(4);

    expect(summary.reconciledWebStaleExpectationFiles).toHaveLength(
      RECONCILIATION_COUNTERS.webStaleExpectationFilesTouched
    );
    for (const path of summary.reconciledWebStaleExpectationFiles) {
      expect(path.endsWith(".test.ts"), path).toBe(true);
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    for (const path of summary.webSurfaceImplementationFiles) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the stale families tied to calculator metric/basis boundaries", () => {
    const byId = new Map(
      buildReconciliationSummary().failureFamilies.map((family) => [family.id, family])
    );

    expect(byId.get("impact_only_routes_do_not_advertise_airborne_outputs")?.protectedBoundary).toContain(
      "leave Rw/C/Ctr unsupported"
    );
    expect(byId.get("opening_leak_apparent_dna_landed_support")?.protectedBoundary).toContain(
      "support apparent Dn,A beside Dn,w"
    );
    expect(byId.get("user_verified_calculated_exact_precedence")?.protectedBoundary).toContain(
      "below exact measured"
    );
    expect(byId.get("mixed_field_building_missing_input_owner")?.protectedBoundary).toContain(
      "required-input owner"
    );
    expect(byId.get("flat_multicavity_missing_rt60_and_topology_boundaries")?.protectedBoundary).toContain(
      "standardized outputs and missing topology remain blocked"
    );
  });

  it("keeps docs and the current gate runner synchronized", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(RECONCILIATION_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const previousRerankIndex = runner.indexOf(
      "src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts"
    );
    const reconciliationIndex = runner.indexOf(
      "src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts"
    );

    expect(previousRerankIndex).toBeGreaterThanOrEqual(0);
    expect(reconciliationIndex).toBeGreaterThan(previousRerankIndex);
  });
});
