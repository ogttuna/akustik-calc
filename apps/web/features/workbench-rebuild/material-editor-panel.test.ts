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

  it("renders route input effectiveness badges on solver material fields", () => {
    const html = renderToStaticMarkup(
      React.createElement(MaterialEditorPanel, {
        layers: [{ id: "layer-1", label: "Layer 1", materialId: "porous_absorber" }],
        materials: [
          {
            acoustic: {
              absorberClass: "porous_absorptive",
              behavior: "porous_absorber",
              notes: [],
              propertySourceStatus: "user_supplied"
            },
            category: "insulation",
            densityKgM3: 45,
            id: "porous_absorber",
            name: "Porous absorber",
            tags: []
          }
        ],
        onDeleteMaterial: () => undefined,
        onReplaceMaterialInLayers: () => undefined,
        onResetVisualOverride: () => undefined,
        onSaveMaterial: () => undefined,
        onSaveVisualOverride: () => undefined,
        onSelectMaterial: () => undefined,
        routeInputEffectiveness: {
          notes: {
            status: "inactive",
            title: "Notes are saved with the material but are not used by the acoustic solver"
          },
          flowResistivityPaSM2: {
            status: "needed",
            title: "Needed: this porous absorber material is missing flow resistivity, so the active porous cavity damping route cannot calculate the current output"
          },
          tags: {
            status: "inactive",
            title: "Tags are catalog/search metadata and are not used by the acoustic solver"
          }
        },
        selectedMaterialId: "porous_absorber",
        visualOverrides: []
      })
    );

    expect(html).toContain("Flow resistivity");
    expect(html).toContain("Material property for porous absorbers");
    expect(html).toContain("material-route-input-effectiveness");
    expect(html).toContain("Needed");
    expect(html).toContain("Inactive");
  });

  it("renders dynamic stiffness when a material carries impact stiffness even if acoustic behavior is not resilient", () => {
    const html = renderToStaticMarkup(
      React.createElement(MaterialEditorPanel, {
        layers: [{ id: "layer-1", label: "Layer 1", materialId: "geniemat_rst05" }],
        materials: [
          {
            acoustic: {
              behavior: "rigid_mass",
              notes: [],
              propertySourceStatus: "user_supplied"
            },
            category: "support",
            densityKgM3: 760,
            id: "geniemat_rst05",
            impact: {
              dynamicStiffnessMNm3: 30
            },
            name: "GenieMat RST05",
            tags: ["resilient"]
          }
        ],
        onDeleteMaterial: () => undefined,
        onReplaceMaterialInLayers: () => undefined,
        onResetVisualOverride: () => undefined,
        onSaveMaterial: () => undefined,
        onSaveVisualOverride: () => undefined,
        onSelectMaterial: () => undefined,
        routeInputEffectiveness: {
          dynamicStiffnessMNm3: {
            status: "used",
            title: "Used by the current floor impact route"
          }
        },
        selectedMaterialId: "geniemat_rst05",
        visualOverrides: []
      })
    );

    expect(html).toContain("Dynamic stiffness");
    expect(html).toContain("Used");
    expect(html).toContain("30");
  });
});
