import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchOutputPosture, getFallbackSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

describe("simple workbench output posture", () => {
  it("distinguishes exact, estimated, and low-confidence floor lanes", () => {
    const exact = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          evidenceTier: "exact",
          selectionKindLabel: "Exact floor system"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });
    const estimate = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          evidenceTier: "estimate",
          selectionKindLabel: "Published family estimate"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });
    const lowConfidence = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w",
      result: {
        dynamicImpactTrace: {
          estimateTier: "low_confidence",
          estimateTierLabel: "Low-confidence family fallback",
          evidenceTier: "estimate",
          selectionKindLabel: "Published family fallback"
        }
      } as AssemblyCalculation,
      status: "live",
      studyMode: "floor"
    });

    expect(exact).toMatchObject({ label: "Exact source row", tone: "success" });
    expect(estimate).toMatchObject({ label: "Benchmark-backed estimate", tone: "accent" });
    expect(lowConfidence).toMatchObject({ label: "Low-confidence fallback", tone: "warning" });
  });

  it("keeps field and companion metrics separate from the core route evidence class", () => {
    const fieldContinuation = buildSimpleWorkbenchOutputPosture({
      output: "DnT,w",
      result: null,
      status: "live",
      studyMode: "floor"
    });
    const companion = buildSimpleWorkbenchOutputPosture({
      output: "Ln,w+CI",
      result: null,
      status: "live",
      studyMode: "floor"
    });

    expect(fieldContinuation).toMatchObject({ label: "Field continuation", tone: "accent" });
    expect(companion).toMatchObject({ label: "Companion carry-over", tone: "neutral" });
  });

  it("falls back to explicit pending and unsupported posture language when no live route exists", () => {
    expect(getFallbackSimpleWorkbenchOutputPosture("needs_input")).toMatchObject({
      label: "Awaiting route input",
      tone: "warning"
    });
    expect(buildSimpleWorkbenchOutputPosture({
      output: "LnT,A",
      result: null,
      status: "unsupported",
      studyMode: "floor"
    })).toMatchObject({
      label: "Unsupported on route",
      tone: "neutral"
    });
  });
});
