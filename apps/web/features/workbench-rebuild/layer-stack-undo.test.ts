import { describe, expect, it } from "vitest";

import {
  createLayerStackUndoSnapshot,
  layerStacksEqual,
  popLayerStackUndoSnapshot,
  pushLayerStackUndoSnapshot,
  restoreLayerStackUndoSnapshot,
  type LayerStackUndoLayer,
  type LayerStackUndoStack
} from "./layer-stack-undo";

const baseLayers: readonly LayerStackUndoLayer[] = [
  { id: "layer-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "layer-b", materialId: "rockwool", role: "cavity", thicknessMm: "50" }
];

describe("layer stack undo", () => {
  it("pushes and pops cloned layer stack snapshots", () => {
    let stack: LayerStackUndoStack = [];
    const snapshot = createLayerStackUndoSnapshot(baseLayers, "layer-a", "adding a layer");

    stack = pushLayerStackUndoSnapshot(stack, snapshot);
    const popped = popLayerStackUndoSnapshot(stack);

    expect(popped?.snapshot).toEqual(snapshot);
    expect(popped?.snapshot.actionLabel).toBe("adding a layer");
    expect(popped?.snapshot.layers).not.toBe(baseLayers);
    expect(popped?.stack).toHaveLength(0);
  });

  it("does not push duplicate consecutive snapshots", () => {
    const snapshot = createLayerStackUndoSnapshot(baseLayers, "layer-a");
    const stack = pushLayerStackUndoSnapshot(pushLayerStackUndoSnapshot([], snapshot), snapshot);

    expect(stack).toHaveLength(1);
  });

  it("caps history to the provided limit", () => {
    let stack: LayerStackUndoStack = [];

    for (let index = 0; index < 5; index += 1) {
      stack = pushLayerStackUndoSnapshot(
        stack,
        createLayerStackUndoSnapshot([{ ...baseLayers[0]!, id: `layer-${index}` }], `layer-${index}`),
        3
      );
    }

    expect(stack).toHaveLength(3);
    expect(stack[0]?.selectedLayerId).toBe("layer-2");
    expect(stack[2]?.selectedLayerId).toBe("layer-4");
  });

  it("compares layer order and layer values", () => {
    expect(layerStacksEqual(baseLayers, baseLayers)).toBe(true);
    expect(layerStacksEqual(baseLayers, [baseLayers[1]!, baseLayers[0]!])).toBe(false);
    expect(layerStacksEqual(baseLayers, [{ ...baseLayers[0]!, thicknessMm: "15" }, baseLayers[1]!])).toBe(false);
  });

  it("restores cloned layer snapshots", () => {
    const snapshot = createLayerStackUndoSnapshot(baseLayers, "layer-b");
    const restored = restoreLayerStackUndoSnapshot(snapshot);

    expect(restored).toEqual(snapshot);
    expect(restored.layers).not.toBe(snapshot.layers);
  });
});
