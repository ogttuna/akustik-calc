import { describe, expect, it } from "vitest";

import { summarizeFieldRisk } from "./field-risk-model";

describe("summarizeFieldRisk", () => {
  it("returns a clear summary when no flags are active", () => {
    const summary = summarizeFieldRisk([]);

    expect(summary.level).toBe("clear");
    expect(summary.score).toBe(0);
    expect(summary.activeDefinitions).toHaveLength(0);
  });

  it("elevates the tone when multiple coordination and flanking flags are active", () => {
    const summary = summarizeFieldRisk([
      "junction_detail_unresolved",
      "perimeter_bridge_risk",
      "service_penetrations_open"
    ]);

    expect(summary.level).toBe("high");
    expect(summary.score).toBe(7);
    expect(summary.tone).toBe("warning");
    expect(summary.actions[0]).toMatch(/Freeze junction details/i);
  });
});
