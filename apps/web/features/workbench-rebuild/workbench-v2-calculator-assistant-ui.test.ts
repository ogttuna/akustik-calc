import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("workbench v2 calculator assistant ui", () => {
  const source = readFileSync(new URL("./calculator-workbench.tsx", import.meta.url), "utf8");

  it("sends the active Workbench V2 snapshot to the preview-only assistant route", () => {
    expect(source).toContain('fetch("/api/report-assistant/calculator-preview"');
    expect(source).toContain("snapshot: currentWorkbenchDraftSnapshot");
    expect(source).toContain("targetOutputs: [...selectedOutputs]");
    expect(source).toContain("parseCalculatorAssistantPreviewPayload");
    expect(source).toContain("calc-assistant-preview-section");
    expect(source).toContain("calc-assistant-route-summary");
    expect(source).toContain("calculatorAssistantPreview.engineSummary.method");
  });

  it("keeps calculator execution outside the client component", () => {
    expect(source).toContain("import type { WorkbenchV2CalculatorAssistantPreview }");
    expect(source).not.toContain("@dynecho/engine");
    expect(source).not.toContain("calculateAssembly(");
  });

  it("guards preview results against stale calculator snapshots", () => {
    expect(source).toContain("calculatorAssistantPreviewSnapshotRef");
    expect(source).toContain("calculatorAssistantPreviewSnapshotRef.current === null");
    expect(source).toContain("calculatorAssistantPreviewRequestRef");
    expect(source).toContain("calculatorAssistantPreviewAbortRef");
    expect(source).toContain("const controller = new AbortController()");
    expect(source).toContain("signal: controller.signal");
    expect(source).toContain("const requestIsCurrent = () => calculatorAssistantPreviewRequestRef.current === requestId && !controller.signal.aborted");
    expect(source).toContain("calculatorAssistantPreviewAbortRef.current?.abort()");
  });
});
