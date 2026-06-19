import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "../workbench-rebuild/material-editor-state";
import {
  createReportAssistantWallCandidateComparison,
  previewReportAssistantWallCandidateComparison,
  type ReportAssistantWallCandidateComparison
} from "./report-assistant-wall-candidate-comparison";

const materials = buildResolvedMaterialCatalog([]);
const WALL_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

function createComparison(instruction: string, requestedOutputs: readonly RequestedOutputId[] = WALL_OUTPUTS): ReportAssistantWallCandidateComparison {
  const result = createReportAssistantWallCandidateComparison({
    instruction,
    materials,
    requestedOutputs
  });

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(result.message);
  }

  return result.comparison;
}

describe("report assistant wall candidate comparison", () => {
  it("parses two explicit wall candidates into draft-backed candidate rows", () => {
    const comparison = createComparison(
      "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum ile 15 mm gypsum + 75 mm rock wool + 15 mm gypsum karşılaştır"
    );

    expect(comparison.status).toBe("ready");
    expect(comparison.candidates).toHaveLength(2);
    expect(comparison.candidates.map((candidate) => candidate.label)).toEqual(["Candidate 1", "Candidate 2"]);
    expect(comparison.candidates.map((candidate) => candidate.sourcePhrase)).toEqual([
      "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum",
      "15 mm gypsum + 75 mm rock wool + 15 mm gypsum"
    ]);
    expect(comparison.candidates[0]?.draft.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
    expect(comparison.candidates[0]?.draft.layers.map((layer) => layer.role)).toEqual(["side_a", "cavity", "side_b"]);
    expect(comparison.candidates[0]?.validation.ok).toBe(true);
    expect(comparison.candidates[1]?.validation.ok).toBe(true);
  });

  it("caps parsed candidates at three before any preview or rendering work", () => {
    const comparison = createComparison(
      [
        "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum",
        "15 mm gypsum + 60 mm rock wool + 15 mm gypsum",
        "18 mm gypsum + 70 mm rock wool + 18 mm gypsum",
        "20 mm gypsum + 80 mm rock wool + 20 mm gypsum"
      ].join("; ")
    );

    expect(comparison.maxCandidates).toBe(3);
    expect(comparison.candidates).toHaveLength(3);
    expect(comparison.candidates.map((candidate) => candidate.sourcePhrase)).toEqual([
      "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum",
      "15 mm gypsum + 60 mm rock wool + 15 mm gypsum",
      "18 mm gypsum + 70 mm rock wool + 18 mm gypsum"
    ]);
    expect(comparison.warnings).toContain("assistant_wall_candidate_comparison_candidate_cap_applied");
  });

  it("keeps unknown material layers as needs-input task rows instead of dropping them", () => {
    const comparison = createComparison("12.5 mm gypsum + 50 mm mystery wool + 12.5 mm gypsum karşılaştır", ["Rw"]);
    const candidate = comparison.candidates[0];

    expect(candidate?.status).toBe("needs_input");
    expect(candidate?.draft.layers.map((layer) => layer.originalPhrase)).toEqual([
      "12.5 mm gypsum",
      "50 mm mystery wool",
      "12.5 mm gypsum"
    ]);
    expect(candidate?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_layer_material_missing",
      "assistant_layer_role_missing"
    ]);
  });

  it("blocks candidate ranking until a calculator-backed output exists", () => {
    const comparison = createComparison(
      "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum vs 15 mm gypsum + 75 mm rock wool + 15 mm gypsum",
      ["Rw"]
    );

    expect(comparison.ranking).toEqual({
      reason: "Candidate ranking requires calculator-backed outputs; this contract only prepares layer-stack drafts.",
      rows: [],
      status: "blocked_no_calculator_output"
    });
    expect(comparison.candidates.every((candidate) => "calculatorPreview" in candidate)).toBe(false);
  });

  it("rejects floor and impact comparison requests as unsupported in the wall-only slice", () => {
    const result = createReportAssistantWallCandidateComparison({
      instruction: "120 mm concrete floor + 30 mm rock wool ile 150 mm concrete floor karşılaştır Ln,w",
      materials,
      requestedOutputs: ["Ln,w"]
    });

    expect(result).toEqual({
      code: "unsupported_wall_candidate_comparison_route",
      message: "Wall candidate comparison v1 only prepares airborne wall layer-stack drafts.",
      ok: false
    });
  });

  it("previews ready wall candidates through calculator-backed output rows", () => {
    const comparison = createComparison(
      "12.5 mm gypsum + 100 mm concrete vs 15 mm gypsum + 120 mm concrete",
      ["Rw", "STC"]
    );
    const preview = previewReportAssistantWallCandidateComparison({ comparison });

    expect(preview).toMatchObject({
      mutates: false,
      previewOnly: true,
      status: "ready"
    });
    expect(preview.candidates).toHaveLength(2);
    expect(preview.outputRows.filter((row) => row.authority === "calculator_backed")).toHaveLength(4);
    expect(preview.outputRows.map((row) => ({
      authority: row.authority,
      basisMetric: row.basis[0]?.metricId,
      candidateId: row.candidateId,
      routeStatus: row.basis[0]?.routeStatus,
      sourceKind: row.sourceTrace[0]?.kind,
      status: row.status
    }))).toEqual([
      {
        authority: "calculator_backed",
        basisMetric: "Rw",
        candidateId: "wall-candidate-1",
        routeStatus: "ready",
        sourceKind: "calculator_preview",
        status: "live"
      },
      {
        authority: "calculator_backed",
        basisMetric: "STC",
        candidateId: "wall-candidate-1",
        routeStatus: "ready",
        sourceKind: "calculator_preview",
        status: "live"
      },
      {
        authority: "calculator_backed",
        basisMetric: "Rw",
        candidateId: "wall-candidate-2",
        routeStatus: "ready",
        sourceKind: "calculator_preview",
        status: "live"
      },
      {
        authority: "calculator_backed",
        basisMetric: "STC",
        candidateId: "wall-candidate-2",
        routeStatus: "ready",
        sourceKind: "calculator_preview",
        status: "live"
      }
    ]);
    expect(preview.ranking.status).toBe("ready");
    expect(preview.ranking.rows).toHaveLength(2);
  });

  it("keeps incomplete candidates visible with tasks and without inherited numeric rows", () => {
    const comparison = createComparison(
      "12.5 mm gypsum + 50 mm rock wool + 100 mm concrete vs 12.5 mm gypsum + 50 mm mystery wool + 100 mm concrete",
      ["Rw"]
    );
    const preview = previewReportAssistantWallCandidateComparison({ comparison });
    const incomplete = preview.candidates.find((candidate) => candidate.candidateId === "wall-candidate-2");

    expect(preview.status).toBe("needs_input");
    expect(incomplete).toMatchObject({
      candidateId: "wall-candidate-2",
      status: "needs_input"
    });
    expect(incomplete?.tasks.map((task) => task.code)).toEqual([
      "assistant_layer_material_missing",
      "assistant_layer_role_missing"
    ]);
    expect(incomplete?.outputRows).toEqual([
      {
        authority: "needs_input",
        basis: [],
        candidateId: "wall-candidate-2",
        detail: "Pending until candidate inputs are complete.",
        label: "Rw",
        sourceTrace: [],
        status: "pending",
        value: "--"
      }
    ]);
    expect(preview.ranking).toMatchObject({
      reason: "Ranking requires live calculator-backed Rw output for every visible candidate.",
      rows: [],
      status: "blocked_missing_candidate_output",
      targetOutput: "Rw"
    });
  });

  it("does not return raw Workbench mutation or snapshot state from comparison preview", () => {
    const comparison = createComparison(
      "12.5 mm gypsum + 100 mm concrete vs 15 mm gypsum + 120 mm concrete",
      ["Rw"]
    );
    const preview = previewReportAssistantWallCandidateComparison({ comparison });
    const serialized = JSON.stringify(preview);

    expect(preview.mutates).toBe(false);
    expect(preview.previewOnly).toBe(true);
    expect(serialized).not.toContain("estimatePayload");
    expect(serialized).not.toContain("requestedSnapshot");
    expect(serialized).not.toContain("selectedLayerId");
    expect(preview.candidates.every((candidate) => "calculatorPreview" in candidate)).toBe(false);
  });
});
