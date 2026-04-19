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
      label: "engine mixed seeded-chain closeout + blocked-source refresh gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/engine",
        "exec",
        "vitest",
        "run",
        "src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts",
        "src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts",
        "src/source-gap-candidate-re-rank-contract.test.ts",
        "src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts",
        "src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
        "src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
        "src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
        "src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "src/remaining-source-gap-posture-matrix.test.ts",
        "src/mixed-floor-wall-complex-stack.test.ts",
        "src/mixed-floor-wall-generated-matrix.test.ts",
        "--maxWorkers=1"
      ]
    },
    {
      label: "web mixed floor/wall seeded-chain gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/web",
        "exec",
        "vitest",
        "run",
        "features/workbench/mixed-study-mode-torture.test.ts",
        "features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
        "features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts",
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
