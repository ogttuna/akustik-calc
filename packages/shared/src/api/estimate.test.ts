import { describe, expect, it } from "vitest";

import { EstimateRequestSchema } from "./estimate";

const customMaterial = {
  acoustic: {
    behavior: "rigid_mass",
    propertySourceStatus: "user_supplied"
  },
  category: "finish",
  densityKgM3: 720,
  id: "custom_cork_finish",
  name: "Custom cork finish",
  tags: ["custom-workbench-material", "finish"]
};

describe("EstimateRequestSchema materialCatalog", () => {
  it("accepts project custom materials for estimate requests", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.materialCatalog?.[0]?.id).toBe("custom_cork_finish");
    }
  });

  it("rejects duplicate project material ids", () => {
    const parsed = EstimateRequestSchema.safeParse({
      calculator: "dynamic",
      layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
      materialCatalog: [customMaterial, { ...customMaterial, name: "Duplicate cork" }],
      targetOutputs: ["Rw"]
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toEqual(["materialCatalog", 1, "id"]);
    }
  });
});
