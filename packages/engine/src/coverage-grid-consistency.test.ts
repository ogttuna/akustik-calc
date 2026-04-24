import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

type GridSection = "floor" | "wall" | "cross-cutting";
type EvidenceTier = "exact" | "benchmark" | "formula" | "family" | "screening" | "fail-closed" | "partial";

type GridRowExpectation = {
  deferredReason?: string;
  evidencePaths: readonly string[];
  evidenceTier: EvidenceTier;
  id: string;
  labelNeedle: string;
  section: GridSection;
  statusLabel: string;
};

type CompletionSignalExpectation = {
  evidencePaths: readonly string[];
  id: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  requiredNeedles: readonly string[];
};

type ParsedRow = {
  cells: readonly string[];
  line: string;
};

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const MASTER_PLAN_PATH = "docs/calculator/MASTER_PLAN.md";

const GRID_ROWS: readonly GridRowExpectation[] = [
  {
    id: "floor.ubiq_open_web_weak_band",
    section: "floor",
    labelNeedle: "UBIQ open-web steel (weak-band)",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/ubiq-open-web-weak-band-rows.ts",
      "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts"
    ]
  },
  {
    id: "floor.ubiq_open_web_supported_band",
    section: "floor",
    labelNeedle: "UBIQ open-web steel (supported-band)",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-rows.ts",
      "packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts"
    ]
  },
  {
    id: "floor.ubiq_carpet_bound",
    section: "floor",
    labelNeedle: "UBIQ carpet bound",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/ubiq-open-web-supported-band-carpet-bound-rows.ts",
      "packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts"
    ]
  },
  {
    id: "floor.knauf_timber_direct_mount",
    section: "floor",
    labelNeedle: "Knauf timber direct mount",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/knauf-au-timber-family-rows.ts",
      "apps/web/features/workbench/floor-full-preset-contract-matrix.test.ts"
    ]
  },
  {
    id: "floor.knauf_acoustic_mount_timber",
    section: "floor",
    labelNeedle: "Knauf acoustic mount timber",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/knauf-au-timber-family-rows.ts",
      "apps/web/features/workbench/floor-full-preset-contract-matrix.test.ts"
    ]
  },
  {
    id: "floor.heavy_concrete_annex_c",
    section: "floor",
    labelNeedle: "Heavy concrete Annex C family",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: ["packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts"]
  },
  {
    id: "floor.reinforced_concrete_vinyl_elastic",
    section: "floor",
    labelNeedle: "Reinforced concrete (vinyl + elastic)",
    statusLabel: "Screening",
    evidenceTier: "screening",
    evidencePaths: [
      "packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts",
      "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts"
    ]
  },
  {
    id: "floor.reinforced_concrete_formula_boundaries",
    section: "floor",
    labelNeedle: "Reinforced concrete (formula boundaries)",
    statusLabel: "Formula",
    evidenceTier: "formula",
    evidencePaths: ["packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts"]
  },
  {
    id: "floor.dataholz_clt_dry",
    section: "floor",
    labelNeedle: "Dataholz CLT dry",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: ["packages/engine/src/dataholz-clt-source-truth-audit.test.ts"]
  },
  {
    id: "floor.dataholz_clt_wet_suspended",
    section: "floor",
    labelNeedle: "Dataholz CLT wet + suspended",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts",
      "packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts"
    ]
  },
  {
    id: "floor.dataholz_gdmtxa04a_direct_exact",
    section: "floor",
    labelNeedle: "Dataholz GDMTXA04A (direct exact)",
    statusLabel: "Fail-closed",
    evidenceTier: "fail-closed",
    deferredReason: "Composite dry-screed surface stays blocked until modeled source evidence exists.",
    evidencePaths: [
      "packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts",
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts"
    ]
  },
  {
    id: "floor.dataholz_gdmtxa04a_visible_estimate",
    section: "floor",
    labelNeedle: "Dataholz GDMTXA04A (visible estimate)",
    statusLabel: "Formula",
    evidenceTier: "formula",
    evidencePaths: [
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts"
    ]
  },
  {
    id: "floor.clt_local_combined_exact",
    section: "floor",
    labelNeedle: "CLT local combined (C2c/C3c/C4c/C7c)",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts",
      "packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts"
    ]
  },
  {
    id: "floor.clt_local_combined_c5c",
    section: "floor",
    labelNeedle: "CLT local combined (C5c)",
    statusLabel: "Family",
    evidenceTier: "family",
    evidencePaths: [
      "packages/engine/src/tuas-clt-backlog-decision-contract.test.ts",
      "packages/engine/src/impact-predictor-input.test.ts"
    ]
  },
  {
    id: "floor.raw_terminal_concrete_helper",
    section: "floor",
    labelNeedle: "Raw terminal-concrete helper",
    statusLabel: "Formula",
    evidenceTier: "formula",
    evidencePaths: [
      "packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts",
      "packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts",
      "packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts"
    ]
  },
  {
    id: "floor.tuas_c11c_exact_import",
    section: "floor",
    labelNeedle: "TUAS C11c exact import",
    statusLabel: "Fail-closed",
    evidenceTier: "fail-closed",
    deferredReason: "Combined wet tuple anomaly keeps the exact import blocked.",
    evidencePaths: [
      "packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts"
    ]
  },
  {
    id: "floor.raw_bare_open_box_open_web_impact",
    section: "floor",
    labelNeedle: "Raw bare open-box/open-web impact",
    statusLabel: "Fail-closed",
    evidenceTier: "fail-closed",
    deferredReason: "No bare-carrier impact source evidence is available.",
    evidencePaths: [
      "packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts"
    ]
  },
  {
    id: "floor.official_product_spot_coverage",
    section: "floor",
    labelNeedle: "Pliteq / Regupol / Getzner",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/catalogs/src/floor-systems/pliteq-steel-joist-rows.ts",
      "packages/catalogs/src/impact/official-product-catalog.ts"
    ]
  },
  {
    id: "wall.concrete_double_leaf_preset",
    section: "wall",
    labelNeedle: "Concrete double-leaf",
    statusLabel: "Screening",
    evidenceTier: "screening",
    evidencePaths: [
      "apps/web/features/workbench/preset-definitions.ts",
      "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts"
    ]
  },
  {
    id: "wall.aac_single_leaf_preset",
    section: "wall",
    labelNeedle: "AAC single-leaf",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: ["apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"]
  },
  {
    id: "wall.masonry_brick_preset",
    section: "wall",
    labelNeedle: "Masonry brick",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
      "apps/web/features/workbench/wall-physical-invariants-matrix.test.ts"
    ]
  },
  {
    id: "wall.clt_wall_preset",
    section: "wall",
    labelNeedle: "CLT wall",
    statusLabel: "Formula",
    evidenceTier: "formula",
    evidencePaths: ["apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"]
  },
  {
    id: "wall.light_steel_stud_preset",
    section: "wall",
    labelNeedle: "Light-steel stud",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: ["apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"]
  },
  {
    id: "wall.timber_stud_preset",
    section: "wall",
    labelNeedle: "Timber stud",
    statusLabel: "Formula",
    evidenceTier: "formula",
    deferredReason:
      "Timber-stud runtime tightening stays parked after wall_timber_lightweight_source_corpus_v1 closed; the current selected follow-up is wall_resilient_bar_side_count_modeling_v1 because resilient-bar side count is the next source-backed common-wall gap.",
    evidencePaths: ["apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"]
  },
  {
    id: "wall.selector_families",
    section: "wall",
    labelNeedle: "Wall selector families",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
      "packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts"
    ]
  },
  {
    id: "wall.deep_hybrid_swap_corridors",
    section: "wall",
    labelNeedle: "Deep-hybrid swap corridors",
    statusLabel: "Family",
    evidenceTier: "family",
    deferredReason: "Deep-hybrid swap VALUE pins are a low-ROI explicit deferral.",
    evidencePaths: [
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-heavy-core.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-100.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-d700-120.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-aac-g5.test.ts"
    ]
  },
  {
    id: "wall.hostile_input_matrix",
    section: "wall",
    labelNeedle: "Wall hostile-input matrix",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    ]
  },
  {
    id: "wall.reorder_invariance",
    section: "wall",
    labelNeedle: "Wall reorder invariance",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts",
      "packages/engine/src/target-output-support-contract.test.ts"
    ]
  },
  {
    id: "wall.field_continuation_per_corridor",
    section: "wall",
    labelNeedle: "Wall field continuation per corridor",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts"
    ]
  },
  {
    id: "cross.floor_hostile_input_matrix",
    section: "cross-cutting",
    labelNeedle: "Floor hostile-input matrix",
    statusLabel: "Exact",
    evidenceTier: "exact",
    evidencePaths: [
      "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts"
    ]
  },
  {
    id: "cross.wall_hostile_input_matrix",
    section: "cross-cutting",
    labelNeedle: "Wall hostile-input matrix",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts"
    ]
  },
  {
    id: "cross.engine_mixed_mode_torture",
    section: "cross-cutting",
    labelNeedle: "Engine mixed-mode cross-mode torture",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: ["packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"]
  },
  {
    id: "cross.engine_torture_wall_coverage",
    section: "cross-cutting",
    labelNeedle: "Engine torture matrix wall coverage",
    statusLabel: "6/6",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/mixed-floor-wall-generated-test-helpers.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    ]
  },
  {
    id: "cross.adjacent_same_material_split_invariance",
    section: "cross-cutting",
    labelNeedle: "Adjacent same-material split invariance",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-masonry-same-material-split-invariance.test.ts",
      "packages/engine/src/airborne-verified-catalog-same-material-split-invariance.test.ts"
    ]
  },
  {
    id: "cross.engine_thickness_validity",
    section: "cross-cutting",
    labelNeedle: "Engine thickness validity",
    statusLabel: "Partial",
    evidenceTier: "partial",
    deferredReason: "Standalone all-caller floor/wall direct engine guard remains deferred.",
    evidencePaths: [
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts"
    ]
  },
  {
    id: "cross.many_layer_stability",
    section: "cross-cutting",
    labelNeedle: "Many-layer (50+) stability",
    statusLabel: "Partial",
    evidenceTier: "partial",
    deferredReason: "Wall 50-layer behavior is pinned; a dedicated floor 50+ layer regression remains deferred.",
    evidencePaths: [
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    ]
  },
  {
    id: "cross.reorder_output_set_invariance",
    section: "cross-cutting",
    labelNeedle: "Reorder output-set invariance",
    statusLabel: "Benchmark",
    evidenceTier: "benchmark",
    evidencePaths: [
      "packages/engine/src/target-output-support-contract.test.ts",
      "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts"
    ]
  },
  {
    id: "cross.dynamic_airborne_size",
    section: "cross-cutting",
    labelNeedle: "`dynamic-airborne.ts` size",
    statusLabel: "Split v1 landed, v2 deferred",
    evidenceTier: "partial",
    deferredReason: "dynamic-airborne.ts still exceeds 2000 lines; split v2 remains documented-deferred.",
    evidencePaths: [
      "packages/engine/src/dynamic-airborne.ts",
      "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md",
      "packages/engine/src/post-dynamic-airborne-split-refactor-v1-next-slice-selection-contract.test.ts"
    ]
  }
];

const COMPLETION_SIGNALS: readonly CompletionSignalExpectation[] = [
  {
    id: "C1",
    requiredNeedles: ["honest evidence tiering", "formula-owned presets"],
    evidencePaths: [
      "apps/web/features/workbench/preset-definitions.ts",
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts",
      "apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts"
    ]
  },
  {
    id: "C2",
    requiredNeedles: ["Every defended wall corridor", "explicit honesty note"],
    evidencePaths: [
      "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts"
    ]
  },
  {
    id: "C3",
    requiredNeedles: ["Wall field-continuation coverage complete", "non-blocking follow-up"],
    evidencePaths: [
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts"
    ]
  },
  {
    id: "C4",
    requiredNeedles: ["Hostile-input discipline", "step-7 torture O1"],
    evidencePaths: [
      "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts",
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
    ]
  },
  {
    id: "C5",
    requiredNeedles: ["Reorder and split invariance", "not claimed by this final wall audit"],
    evidencePaths: [
      "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts",
      "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts",
      "packages/engine/src/floor-split-layer-parity.test.ts",
      "packages/engine/src/raw-floor-inferred-split-parity.test.ts",
      "packages/engine/src/floor-topology-sanity-sweep.test.ts"
    ]
  },
  {
    id: "C6",
    requiredNeedles: ["documented `dynamic_airborne_split_refactor_v2` deferral", "DYNAMIC_AIRBORNE_CARTOGRAPHY.md"],
    evidencePaths: [
      "packages/engine/src/dynamic-airborne.ts",
      "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md",
      "packages/engine/src/post-dynamic-airborne-split-refactor-v1-next-slice-selection-contract.test.ts"
    ]
  }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function repoPathExists(path: string): boolean {
  return existsSync(join(REPO_ROOT, path));
}

function parseTableRows(markdown: string): ParsedRow[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("| "))
    .filter((line) => !line.includes("---"))
    .map((line) => ({
      line,
      cells: line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim())
    }))
    .filter((row) => row.cells.length >= 3 && row.cells[0] !== "Family" && row.cells[0] !== "Concern" && row.cells[0] !== "#");
}

function statusCategory(status: string): string {
  if (status.includes("Exact")) return "Exact";
  if (status.includes("Benchmark")) return "Benchmark";
  if (status.includes("Formula")) return "Formula";
  if (status.includes("Family")) return "Family";
  if (status.includes("Screening")) return "Screening";
  if (status.includes("Fail-closed")) return "Fail-closed";
  if (status.includes("Partial")) return "Partial";
  if (status.includes("6/6")) return "6/6";
  if (status.includes("Split v1 landed, v2 deferred")) return "Split v1 landed, v2 deferred";
  return status;
}

function findRow(parsedRows: readonly ParsedRow[], expectation: GridRowExpectation): ParsedRow | undefined {
  return parsedRows.find((row) => row.cells[0]?.includes(expectation.labelNeedle));
}

describe("coverage grid consistency", () => {
  const masterPlan = readRepoFile(MASTER_PLAN_PATH);
  const parsedRows = parseTableRows(masterPlan);

  it("keeps MASTER_PLAN section 3 reconciled to the final-audit snapshot date", () => {
    expect(masterPlan).toContain("## 3. Implementation State Grid (last reconciled 2026-04-23)");
    expect(masterPlan).not.toMatch(/\| Wall hostile-input matrix \| .*Not yet covered/);
    expect(masterPlan).not.toMatch(/\| Wall field continuation per corridor \| .*Family \(partial\)/);
    expect(masterPlan).not.toContain("LSF and timber stud presets not yet landed");
    expect(masterPlan).not.toContain("wall hostile-input matrix missing");
    expect(masterPlan).not.toContain("wall field-continuation completeness not audited");
    expect(masterPlan).not.toContain("hostile-thickness-input.test.ts");
    expect(masterPlan).not.toContain("floor equivalent both green");
  });

  it("maps every required grid row to an existing non-archived evidence artifact", () => {
    const failures: string[] = [];

    for (const row of GRID_ROWS) {
      const parsedRow = findRow(parsedRows, row);

      if (!parsedRow) {
        failures.push(`${row.id}: missing MASTER_PLAN grid row containing ${row.labelNeedle}`);
        continue;
      }

      const actualStatus = parsedRow.cells[1] ?? "";
      if (!actualStatus.includes(row.statusLabel)) {
        failures.push(`${row.id}: expected status containing ${row.statusLabel}, got ${actualStatus}`);
      }

      if (row.evidencePaths.length === 0) {
        failures.push(`${row.id}: expected at least one evidence artifact`);
      }

      for (const evidencePath of row.evidencePaths) {
        if (evidencePath.includes("docs/archive/")) {
          failures.push(`${row.id}: evidence path must not be archive-only: ${evidencePath}`);
        }
        if (!repoPathExists(evidencePath)) {
          failures.push(`${row.id}: evidence path does not exist: ${evidencePath}`);
        }
      }

      if (["Fail-closed", "Partial"].includes(row.statusLabel) && !row.deferredReason) {
        failures.push(`${row.id}: ${row.statusLabel} rows need an explicit deferredReason`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("does not carry contradictory statuses for duplicate grid concerns", () => {
    const duplicateConcerns = ["Wall hostile-input matrix"];
    const failures: string[] = [];

    for (const concern of duplicateConcerns) {
      const statuses = parsedRows.filter((row) => row.cells[0] === concern).map((row) => statusCategory(row.cells[1] ?? ""));
      const uniqueStatuses = Array.from(new Set(statuses));

      if (uniqueStatuses.length > 1) {
        failures.push(`${concern}: contradictory statuses ${uniqueStatuses.join(", ")}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps the final-audit completion signals tied to concrete evidence", () => {
    const failures: string[] = [];

    for (const signal of COMPLETION_SIGNALS) {
      const signalRow = parsedRows.find((row) => row.cells[0] === signal.id);

      if (!signalRow) {
        failures.push(`${signal.id}: missing completion-signal row`);
        continue;
      }

      const rowText = signalRow.line;
      for (const needle of signal.requiredNeedles) {
        if (!rowText.includes(needle)) {
          failures.push(`${signal.id}: missing signal wording ${needle}`);
        }
      }

      for (const evidencePath of signal.evidencePaths) {
        if (!repoPathExists(evidencePath)) {
          failures.push(`${signal.id}: evidence path does not exist: ${evidencePath}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("asserts the specific C1, C3, C5, and C6 final-audit honesty checks", () => {
    const presetDefinitions = readRepoFile("apps/web/features/workbench/preset-definitions.ts");
    const wallPresetIds = [
      "concrete_wall",
      "aac_single_leaf_wall",
      "masonry_brick_wall",
      "clt_wall",
      "light_steel_stud_wall",
      "timber_stud_wall"
    ];
    const dynamicAirborneLines = readRepoFile("packages/engine/src/dynamic-airborne.ts").split("\n").length;
    const cartography = readRepoFile("docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md");

    for (const presetId of wallPresetIds) {
      expect(presetDefinitions).toContain(`id: "${presetId}"`);
    }
    expect((presetDefinitions.match(/studyMode: "wall"/g) ?? []).length).toBeGreaterThanOrEqual(6);

    expect(masterPlan).toContain("Full floor field-continuation expansion is an explicit non-blocking follow-up");
    expect(masterPlan).toContain("Full arbitrary floor reorder expansion is not claimed by this final wall audit");

    if (dynamicAirborneLines > 2000) {
      expect(cartography).toContain("dynamic_airborne_split_refactor_v2");
      expect(masterPlan).toContain("C6 closes only as a documented `dynamic_airborne_split_refactor_v2` deferral");
    }
  });
});
