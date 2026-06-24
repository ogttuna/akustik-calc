import { describe, expect, it } from "vitest";

import { getMissingInputCopy } from "./workbench-v2-shell";

describe("Workbench V2 legacy route-input presentation", () => {
  it("keeps floor impact topping needs-input copy user-facing", () => {
    const copy = getMissingInputCopy("toppingOrFloatingLayer");

    expect(copy.label).toBe("Upper topping / floating layer");
    expect(copy.detail).toContain("topping / floating layer");
    expect(copy.detail).not.toContain("toppingOrFloatingLayer");
  });

  it("keeps grouped impact field-context copy user-facing", () => {
    const copy = getMissingInputCopy("impactFieldContext");

    expect(copy.label).toBe("Impact field context");
    expect(copy.detail).toContain("impact field context");
    expect(copy.targetElementId).toBe("workbench-v2-field-k-db");
  });

  it("maps area-family result paths to panel area copy and the local panel control", () => {
    const copy = getMissingInputCopy("ratings.field.partitionAreaM2");

    expect(copy.label).toBe("Panel area");
    expect(copy.detail).toContain("panel width and height");
    expect(copy.targetElementId).toBe("workbench-v2-panel-width");
  });
});
