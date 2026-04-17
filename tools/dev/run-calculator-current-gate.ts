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
      label: "engine Dataholz CLT closeout + blocked-source rerank gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/engine",
        "exec",
        "vitest",
        "run",
        "src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts",
        "src/dataholz-clt-calibration-tightening-audit.test.ts",
        "src/dataholz-gdmtxa04a-material-surface-recheck.test.ts",
        "src/dataholz-clt-source-truth-audit.test.ts",
        "src/floor-source-corpus-contract.test.ts",
        "src/source-gap-candidate-re-rank-contract.test.ts",
        "src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
        "src/remaining-source-gap-posture-matrix.test.ts",
        "--maxWorkers=1"
      ]
    },
    {
      label: "web Dataholz CLT closeout + blocked-source posture gate",
      args: [
        "pnpm",
        "--filter",
        "@dynecho/web",
        "exec",
        "vitest",
        "run",
        "features/workbench/dataholz-clt-source-truth-route.test.ts",
        "features/workbench/remaining-source-gap-posture-card-matrix.test.ts",
        "features/workbench/output-origin-trace-card-matrix.test.ts",
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
