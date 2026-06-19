import { describe, expect, it } from "vitest";

import {
  REPORT_ASSISTANT_GOLDEN_EVAL_CASES,
  REPORT_ASSISTANT_REQUIRED_GOLDEN_EVAL_FAMILIES,
  runReportAssistantGoldenEvals
} from "./report-assistant-golden-evals";

describe("report assistant golden eval matrix", () => {
  it("covers every required high-accuracy assistant family", () => {
    expect(new Set(REPORT_ASSISTANT_GOLDEN_EVAL_CASES.map((testCase) => testCase.family))).toEqual(
      new Set(REPORT_ASSISTANT_REQUIRED_GOLDEN_EVAL_FAMILIES)
    );
    expect(REPORT_ASSISTANT_GOLDEN_EVAL_CASES).toHaveLength(REPORT_ASSISTANT_REQUIRED_GOLDEN_EVAL_FAMILIES.length);
  });

  it("passes the full matrix with an exact 1.0 score", () => {
    const summary = runReportAssistantGoldenEvals();
    const failures = summary.results
      .filter((result) => !result.ok)
      .map((result) => ({
        failures: result.failures,
        id: result.case.id,
        observation: result.observation
      }));

    expect(failures).toEqual([]);
    expect(summary).toMatchObject({
      failed: 0,
      passed: REPORT_ASSISTANT_REQUIRED_GOLDEN_EVAL_FAMILIES.length,
      score: 1,
      total: REPORT_ASSISTANT_REQUIRED_GOLDEN_EVAL_FAMILIES.length
    });
  });

  it("keeps blocked and needs-input boundaries numeric-free", () => {
    const summary = runReportAssistantGoldenEvals();
    const numericFreeFamilies = new Set([
      "fabricated_calculator_value",
      "floor_impact_missing_physical_inputs",
      "incomplete_wall_stack",
      "invented_capability",
      "prompt_injection",
      "stale_draft_replay",
      "unsupported_metric_basis",
      "untrusted_source_injection"
    ]);
    const observations = summary.results
      .filter((result) => numericFreeFamilies.has(result.case.family))
      .map((result) => result.observation);

    expect(observations.every((observation) => observation.basisCount === 0)).toBe(true);
    expect(observations.every((observation) => observation.numericRowsVisible === false)).toBe(true);
  });

  it("requires calculator-backed successes to carry calculator source traces", () => {
    const summary = runReportAssistantGoldenEvals();
    const calculatorBacked = summary.results
      .map((result) => result.observation)
      .filter((observation) => observation.authority === "calculator_backed");

    expect(calculatorBacked.length).toBeGreaterThanOrEqual(2);
    expect(calculatorBacked.every((observation) => observation.basisCount > 0)).toBe(true);
    expect(calculatorBacked.every((observation) => observation.sourceTraceKinds.includes("calculator_preview"))).toBe(true);
  });
});
