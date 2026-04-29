import { spawn } from "node:child_process";

type Step = {
  args: string[];
  label: string;
};

function getCommand(binary: "pnpm" | "git"): string {
  if (process.platform !== "win32") {
    return binary;
  }

  return `${binary}.cmd`;
}

function runStep(step: Step): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`[current-gate] ${step.label}`);

    const child = spawn(getCommand(step.args[0] === "git" ? "git" : "pnpm"), step.args.slice(1), {
      cwd: process.cwd(),
      stdio: "inherit"
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${step.label} exited via signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${step.label} failed with exit code ${String(code)}`));
        return;
      }

      resolve();
    });
  });
}

async function main() {
  const steps: Step[] = [
    {
      label: "engine calculator final-audit focused gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/engine",
        "exec",
        "vitest",
        "run",
        "src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts",
        "src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts",
        "src/blocked-source-backed-widening-rerank-refresh-contract.test.ts",
        "src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts",
        "src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts",
        "src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
        "src/tuas-c11c-frequency-source-recheck.test.ts",
        "src/tuas-c11c-exact-import-readiness-design.test.ts",
        "src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts",
        "src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts",
        "src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts",
        "src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts",
        "src/source-gap-candidate-re-rank-contract.test.ts",
        "src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts",
        "src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
        "src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
        "src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
        "src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "src/remaining-source-gap-posture-matrix.test.ts",
        "src/raw-floor-screening-carrier-support.test.ts",
        "src/raw-concrete-helper-answer-guard.test.ts",
        "src/raw-terminal-concrete-helper-widening-matrix.test.ts",
        "src/raw-terminal-concrete-helper-origin-matrix.test.ts",
        "src/raw-terminal-concrete-helper-split-topology-matrix.test.ts",
        "src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts",
        "src/raw-terminal-concrete-helper-partial-order-matrix.test.ts",
        "src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts",
        "src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts",
        "src/impact-predictor-input.test.ts",
        "src/tuas-clt-backlog-decision-contract.test.ts",
        "src/clt-local-combined-interaction-evidence-matrix.test.ts",
        "src/clt-local-combined-exact-anchor-pack.test.ts",
        "src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts",
        "src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts",
        "src/post-dataholz-clt-calibration-tightening-second-pass-next-slice-selection-contract.test.ts",
        "src/post-wall-preset-expansion-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts",
        "src/target-output-support-contract.test.ts",
        "src/reinforced-concrete-formula-family-closeout-audit.test.ts",
        "src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts",
        "src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts",
        "src/reinforced-concrete-family-formula-fit-audit.test.ts",
        "src/reinforced-concrete-low-confidence-edge-continuity.test.ts",
        "src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts",
        "src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts",
        "src/dataholz-clt-source-truth-audit.test.ts",
        "src/dataholz-clt-calibration-tightening-audit.test.ts",
        "src/airborne-verified-catalog-lab-fallback.test.ts",
        "src/airborne-catalog-field-anchor-lab-fallback.test.ts",
        "src/post-masonry-flanking-inversion-fix-next-slice-selection-contract.test.ts",
        "src/post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-hostile-input-matrix-with-airborne-cartography-v1-next-slice-selection-contract.test.ts",
        "src/post-dynamic-airborne-split-refactor-v1-next-slice-selection-contract.test.ts",
        "src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts",
        "src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts",
        "src/post-wall-field-continuation-value-pinning-v1-next-slice-selection-contract.test.ts",
        "src/post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts",
        "src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts",
        "src/dynamic-airborne-masonry-same-material-split-invariance.test.ts",
        "src/airborne-verified-catalog-same-material-split-invariance.test.ts",
        "src/dynamic-airborne-wall-selector-value-pins.test.ts",
        "src/airborne-verified-catalog.test.ts",
        "src/wall-formula-family-widening-audit.test.ts",
        "src/wall-timber-lightweight-source-corpus-contract.test.ts",
        "src/wall-timber-lightweight-source-audit.test.ts",
        "src/wall-resilient-bar-side-count-blind-audit.test.ts",
        "src/raw-wall-hostile-input-answer-matrix.test.ts",
        "src/floor-source-corpus-contract.test.ts",
        "src/raw-floor-hostile-input-answer-matrix.test.ts",
        "src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
        "src/raw-floor-safe-bare-split-parity.test.ts",
        "src/output-origin-trace-matrix.test.ts",
        "src/floor-field-continuation-gate-a-matrix.test.ts",
        "src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts",
        "src/floor-many-layer-stress-gate-a-matrix.test.ts",
        "src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts",
        "src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
        "src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts",
        "src/post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts",
        "src/coverage-grid-consistency.test.ts",
        "src/realistic-layer-combination-coverage-cartography.test.ts",
        "src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
        "src/post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts",
        "src/wall-timber-stud-clt-gate-a-audit-contract.test.ts",
        "src/wall-timber-stud-gate-b-source-contract.test.ts",
        "src/wall-clt-gate-b-source-contract.test.ts",
        "src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts",
        "src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts",
        "src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
        "src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts",
        "src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts",
        "src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts",
        "src/post-team-access-model-calculator-refocus-next-slice-selection-contract.test.ts",
        "src/post-wall-formula-family-widening-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts",
        "src/post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts",
        "src/post-proposal-report-polish-next-slice-selection-contract.test.ts",
        "src/calculator-source-gap-revalidation-gate-a-contract.test.ts",
        "src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts",
        "src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts",
        "src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts",
        "src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts",
        "src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts",
        "src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
        "src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts",
        "src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts",
        "src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts",
        "src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts",
        "src/wall-source-catalog-acquisition-gate-a-contract.test.ts",
        "src/wall-source-catalog-acquisition-gate-b-contract.test.ts",
        "src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts",
        "src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts",
        "src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
        "src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
        "src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
        "src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts",
        "src/wall-clt-wall-source-research-gate-a-contract.test.ts",
        "src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts",
        "src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
        "src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts",
        "src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts",
        "src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts",
        "src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts",
        "src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts",
        "src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts",
        "src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts",
        "src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
        "src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
        "src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts",
        "src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts",
        "src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts",
        "src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts",
        "src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
        "--maxWorkers=1"
      ]
    },
    {
      label: "web calculator final-audit focused gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/web",
        "exec",
        "vitest",
        "run",
        "features/workbench/raw-floor-screening-route-support.test.ts",
        "features/workbench/raw-concrete-helper-route-card-guard.test.ts",
        "features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts",
        "features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts",
        "features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts",
        "features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts",
        "features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts",
        "features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts",
        "features/workbench/clt-combined-anchor-history-replay-matrix.test.ts",
        "features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts",
        "features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts",
        "features/workbench/dataholz-clt-source-truth-route.test.ts",
        "features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts",
        "features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts",
        "features/workbench/wall-full-preset-contract-matrix.test.ts",
        "features/workbench/wall-preset-expansion-benchmarks.test.ts",
        "features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts",
        "features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts",
        "features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
        "features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts",
        "features/workbench/wall-resilient-bar-side-count-input-contract.test.ts",
        "features/workbench/wall-physical-invariants-matrix.test.ts",
        "features/workbench/wall-reorder-invariance-matrix.test.ts",
        "features/workbench/wall-framed-facing-split-warning-stability-route-card-matrix.test.ts",
        "features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts",
        "features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts",
        "features/workbench/wall-field-continuation-completeness-matrix.test.ts",
        "features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
        "features/workbench/raw-floor-safe-bare-split-parity.test.ts",
        "features/workbench/output-origin-trace-card-matrix.test.ts",
        "features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts",
        "features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts",
        "features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts",
        "features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts",
        "features/workbench/simple-workbench-output-model.test.ts",
        "lib/calculator-api-validation.test.ts",
        "lib/post-project-access-policy-route-integration-next-slice-selection-contract.test.ts",
        "lib/project-access-policy.test.ts",
        "lib/project-route-auth.test.ts",
        "lib/server-project-routes.test.ts",
        "--maxWorkers=1"
      ]
    },
    {
      label: "repo build",
      args: ["pnpm", "build"]
    },
    {
      label: "whitespace guard",
      args: ["git", "diff", "--check"]
    }
  ];

  for (const step of steps) {
    await runStep(step);
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[current-gate] ${message}`);
  process.exit(1);
});
