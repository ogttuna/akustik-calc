import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import { createWorkbenchV2AssistantBoundedEditPlan } from "./workbench-v2-assistant-bounded-edit-plan";
import { getWorkbenchV2AssistantLayerStackSignature } from "./workbench-v2-assistant-layer-stack-command";
import type { WorkbenchV2DraftLayer } from "./workbench-v2-project-snapshot";

const materials = buildResolvedMaterialCatalog([]);

const baseLayers: readonly WorkbenchV2DraftLayer[] = [
  { id: "existing-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

function plan(instruction: string) {
  return createWorkbenchV2AssistantBoundedEditPlan({
    currentLayers: baseLayers,
    currentMode: "wall",
    currentSelectedOutputs: ["Rw"],
    idFactory: (index) => `plan-layer-${index + 1}`,
    instruction,
    materials
  });
}

describe("workbench v2 assistant bounded edit plan", () => {
  it("creates a dry-run ordered plan without mutating visible or saved state", () => {
    const result = plan("2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error(result.message);
    }

    expect(result.mutatesSavedState).toBe(false);
    expect(result.providerCallsAllowed).toBe(false);
    expect(result.applyRequiresConfirmation).toBe(true);
    expect(result.previewRequired).toBe(true);
    expect(result.steps.map((step) => step.commandKind)).toEqual([
      "remove_layer",
      "add_layer",
      "set_outputs",
      "preview"
    ]);
    expect(result.selectedOutputs).toEqual(["Rw", "STC"]);
    expect(result.initialLayerSignature).toBe(getWorkbenchV2AssistantLayerStackSignature(baseLayers));
    expect(result.finalLayerSignature).not.toBe(result.initialLayerSignature);
    expect(result.finalLayers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "gypsum_board",
      "gypsum_board"
    ]);
    expect(baseLayers.map((layer) => layer.id)).toEqual([
      "existing-layer-1",
      "existing-layer-2",
      "existing-layer-3"
    ]);
  });

  it("blocks candidate generation inside a multi-step plan and keeps the partial plan read-only", () => {
    const result = plan("rockwool'u çıkar, iki gypsum layer ekle, iki alternatif dene");

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("Expected candidate generation to stay blocked in bounded edit plans.");
    }

    expect(result.code).toBe("unsupported_candidate_generation");
    expect(result.mutatesSavedState).toBe(false);
    expect(result.providerCallsAllowed).toBe(false);
    expect(result.applyRequiresConfirmation).toBe(true);
    expect(result.partialSteps.map((step) => step.commandKind)).toEqual([
      "remove_layer",
      "add_layer"
    ]);
    expect(result.partialSteps[1]?.repeatCount).toBe(2);
    expect(result.partialLayerSignature).not.toBe(result.initialLayerSignature);
  });

  it("rejects provider or web research requests before parsing write-like steps", () => {
    const result = plan("internetten araştır sonra gypsum ekle");

    expect(result).toMatchObject({
      applyRequiresConfirmation: true,
      code: "unsafe_provider_request",
      mutatesSavedState: false,
      ok: false,
      providerCallsAllowed: false
    });
  });
});
