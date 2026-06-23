import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PLAN_DOC =
  "docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_NEEDS_INPUT_BOUNDARY_FIX_PLAN_2026-06-23.md";
const CONTRACT_FILE =
  "packages/engine/src/post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts";
const RUNNER_FILE = "tools/dev/run-calculator-current-gate.ts";

const ACTION =
  "post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_plan";
const STATUS =
  "post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_landed_runtime_boundary_selected_runtime_first_rerank_after_current_gate_reconciliation";
const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_plan";

const MIXED_LAB_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_AND_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const REQUIRED_GROUPED_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
] as const;

const EXACT_CASES = [
  {
    c: -0.6,
    ctr: -5.4,
    id: "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "one_side",
    rw: 55,
    stc: 55
  },
  {
    c: -0.6,
    ctr: -5.4,
    id: "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
    resilientBarSideCount: "both_sides",
    rw: 58,
    stc: 58
  }
] as const;

const LEGACY_AUTO_CASE = {
  c: -0.6,
  ctr: -5.4,
  ids: [
    "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
    "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
  ],
  rw: 56,
  stc: 56
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function officialRow(id: string): WallTimberLightweightOfficialSourceRow {
  const row = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
    (entry): entry is WallTimberLightweightOfficialSourceRow =>
      entry.kind === "official_row" && entry.id === id
  );

  if (!row) {
    throw new Error(`Missing official source row ${id}`);
  }

  return row;
}

function contextFor(
  row: WallTimberLightweightOfficialSourceRow,
  resilientBarSideCount: "both_sides" | "one_side"
): AirborneContext {
  return {
    ...row.airborneContext,
    airtightness: "good",
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    resilientBarSideCount,
    studSpacingMm: 600,
    studType: "resilient_stud"
  };
}

describe("post-V1 British Gypsum exact lab needs-input boundary fix", () => {
  it("keeps the legacy auto side-count stud-wall lab formula outputs live while field/building companions wait", () => {
    const results = LEGACY_AUTO_CASE.ids.map((id) => {
      const row = officialRow(id);

      return calculateAssembly(row.layers, {
        airborneContext: {
          ...row.airborneContext,
          airtightness: "good",
          connectionType: "resilient_channel",
          contextMode: "element_lab",
          resilientBarSideCount: "auto",
          studSpacingMm: 600,
          studType: "resilient_stud"
        },
        calculator: "dynamic",
        targetOutputs: MIXED_LAB_OUTPUTS
      });
    });

    expect(results[0]?.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(results[0]?.unsupportedTargetOutputs).toEqual([...FIELD_AND_BUILDING_OUTPUTS]);
    expect(results[1]?.supportedTargetOutputs).toEqual(results[0]?.supportedTargetOutputs);
    expect(results[1]?.unsupportedTargetOutputs).toEqual(results[0]?.unsupportedTargetOutputs);
    expect(results[0]?.metrics.estimatedRwDb).toBe(LEGACY_AUTO_CASE.rw);
    expect(results[0]?.metrics.estimatedStc).toBe(LEGACY_AUTO_CASE.stc);
    expect(results[0]?.metrics.estimatedCDb).toBe(LEGACY_AUTO_CASE.c);
    expect(results[0]?.metrics.estimatedCtrDb).toBe(LEGACY_AUTO_CASE.ctr);
    expect(results[0]?.warnings.join("\n")).not.toMatch(/Curated exact airborne lab match active/i);
    expect(results[0]?.warnings.join("\n")).toMatch(/No curated exact floor-system landed/i);
    expect(results[0]?.acousticAnswerBoundary?.unsupportedOutputs).toEqual([...FIELD_AND_BUILDING_OUTPUTS]);
  });

  it.each(EXACT_CASES)(
    "$id keeps exact lab outputs live while field/building companions wait for route inputs",
    (testCase) => {
      const row = officialRow(testCase.id);
      const result = calculateAssembly(row.layers, {
        airborneContext: contextFor(row, testCase.resilientBarSideCount),
        calculator: "dynamic",
        targetOutputs: MIXED_LAB_OUTPUTS
      });

      expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([...FIELD_AND_BUILDING_OUTPUTS]);
      expect(result.metrics.estimatedRwDb).toBe(testCase.rw);
      expect(result.metrics.estimatedStc).toBe(testCase.stc);
      expect(result.metrics.estimatedCDb).toBe(testCase.c);
      expect(result.metrics.estimatedCtrDb).toBe(testCase.ctr);

      expect(result.acousticAnswerBoundary).toMatchObject({
        origin: "needs_input",
        route: "wall",
        unsupportedOutputs: [...FIELD_AND_BUILDING_OUTPUTS]
      });
      expect(result.acousticAnswerBoundary?.unsupportedOutputs).not.toContain("Rw");
      expect(result.acousticAnswerBoundary?.unsupportedOutputs).not.toContain("STC");
      expect(result.acousticAnswerBoundary?.unsupportedOutputs).not.toContain("C");
      expect(result.acousticAnswerBoundary?.unsupportedOutputs).not.toContain("Ctr");
      for (const input of REQUIRED_GROUPED_INPUTS) {
        expect(result.acousticAnswerBoundary?.missingPhysicalInputs).toContain(input);
      }
      expect(
        result.warnings.some((warning) =>
          /Curated exact airborne lab match active: British Gypsum/i.test(warning)
        )
      ).toBe(true);
      expect(result.warnings.join("\n")).not.toMatch(/needs_input for Rw,/);
    }
  );

  it("documents the bounded runtime boundary movement and keeps current-gate wiring explicit", () => {
    const plan = readRepoFile(PLAN_DOC);
    const runner = readRepoFile(RUNNER_FILE);

    expect(existsSync(join(REPO_ROOT, CONTRACT_FILE)), CONTRACT_FILE).toBe(true);
    expect(plan).toContain(ACTION);
    expect(plan).toContain(STATUS);
    expect(plan).toContain(SELECTED_NEXT_ACTION);
    expect(plan).toContain("newCalculableRequestShapes: 3");
    expect(plan).toContain("newCalculableTargetOutputs: 4");
    expect(plan).toContain("runtimeValuesMoved 0");
    expect(runner).toContain("post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts");
  });
});
