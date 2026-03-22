import { describe, expect, it } from "vitest";

import { selectSimpleWorkbenchTraceNotes } from "./simple-workbench-trace-notes";

describe("simple workbench trace notes", () => {
  it("keeps route-critical notes and trims lower-signal duplicates into a consultant-grade set", () => {
    const selection = selectSimpleWorkbenchTraceNotes([
      "Published family estimate is active on the current impact lane.",
      "Current evidence tier is estimated evidence.",
      "Detected support family: reinforced concrete.",
      "Published family blend stayed active at 82% fit.",
      "Predictor topology came from visible floor-role layers.",
      "Published family estimate is active on the current impact lane."
    ]);

    expect(selection.notes).toEqual([
      "Published family estimate is active on the current impact lane.",
      "Current evidence tier is estimated evidence.",
      "Detected support family: reinforced concrete.",
      "Published family blend stayed active at 82% fit."
    ]);
    expect(selection.totalCount).toBe(5);
    expect(selection.hiddenCount).toBe(1);
  });

  it("falls back to provided note copy when a lane has no raw trace notes yet", () => {
    const selection = selectSimpleWorkbenchTraceNotes([], {
      fallbackNotes: [
        "ISO 717 composite stays on Rw + C / Ctr.",
        "Surface mass 450 kg/m² and total thickness 192 mm are feeding the current screening curve."
      ]
    });

    expect(selection.notes).toEqual([
      "ISO 717 composite stays on Rw + C / Ctr.",
      "Surface mass 450 kg/m² and total thickness 192 mm are feeding the current screening curve."
    ]);
    expect(selection.totalCount).toBe(2);
    expect(selection.hiddenCount).toBe(0);
  });
});
