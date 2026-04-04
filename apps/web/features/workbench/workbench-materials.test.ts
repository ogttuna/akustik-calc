import { describe, expect, it } from "vitest";

import {
  buildCustomMaterialDefinition,
  createEmptyCustomMaterialDraft,
  validateCustomMaterialDraft
} from "./workbench-materials";

describe("workbench custom materials", () => {
  it("accepts comma-decimal density and dynamic stiffness in custom material drafts", () => {
    const draft = {
      ...createEmptyCustomMaterialDraft(),
      category: "support" as const,
      densityKgM3: "1650,0",
      dynamicStiffnessMNm3: "15,5",
      name: "Localized resilient mat"
    };

    expect(validateCustomMaterialDraft(draft, [])).toEqual({});

    const material = buildCustomMaterialDefinition({
      draft,
      existingMaterials: []
    });

    expect(material.densityKgM3).toBe(1650);
    expect(material.impact?.dynamicStiffnessMNm3).toBe(15.5);
  });
});
