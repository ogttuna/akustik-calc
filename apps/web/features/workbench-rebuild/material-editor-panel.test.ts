import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MaterialEditorPanel } from "./material-editor-panel";

describe("MaterialEditorPanel", () => {
  beforeEach(() => {
    vi.stubGlobal("React", React);
  });

  it("exports the rebuilt workbench material editor component", () => {
    expect(typeof MaterialEditorPanel).toBe("function");
  });

  it("renders source/category filters and restore warnings", () => {
    const html = renderToStaticMarkup(
      React.createElement(MaterialEditorPanel, {
        layers: [{ id: "layer-1", label: "Layer 1", materialId: "gypsum_board" }],
        materials: [
          {
            category: "finish",
            densityKgM3: 850,
            id: "gypsum_board",
            name: "Gypsum Board",
            tags: ["board"]
          },
          {
            category: "finish",
            densityKgM3: 720,
            id: "custom_cork_finish",
            name: "Cork finish",
            tags: ["custom-workbench-material", "finish"]
          }
        ],
        onClose: () => undefined,
        onDeleteMaterial: () => undefined,
        onReplaceMaterialInLayers: () => undefined,
        onResetVisualOverride: () => undefined,
        onSaveMaterial: () => undefined,
        onSaveVisualOverride: () => undefined,
        onSelectMaterial: () => undefined,
        restoreWarning: "1 invalid appearance override ignored",
        selectedMaterialId: "gypsum_board",
        visualOverrides: []
      })
    );

    expect(html).toContain("Material editor");
    expect(html).toContain("Project");
    expect(html).toContain("Built-in");
    expect(html).toContain("All categories");
    expect(html).toContain("Material state restored");
    expect(html).toContain("1 invalid appearance override ignored");
    expect(html).toContain("Material density, rho, in kg/m3");
    expect(html).toContain("Records whether the values are user supplied");
    expect(html).toContain("Free-form product/source notes");
  });
});
