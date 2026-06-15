export type LayerStackUndoLayer = {
  id: string;
  materialId: string;
  role: string;
  thicknessMm: string;
};

export type LayerStackUndoSnapshot = {
  actionLabel?: string;
  layers: readonly LayerStackUndoLayer[];
  selectedLayerId: string | null;
};

export type LayerStackUndoStack = readonly LayerStackUndoSnapshot[];

const DEFAULT_LAYER_STACK_UNDO_LIMIT = 20;

export function cloneLayerStackUndoLayers(layers: readonly LayerStackUndoLayer[]): LayerStackUndoLayer[] {
  return layers.map((layer) => ({ ...layer }));
}

export function createLayerStackUndoSnapshot(
  layers: readonly LayerStackUndoLayer[],
  selectedLayerId: string | null,
  actionLabel?: string
): LayerStackUndoSnapshot {
  return {
    ...(actionLabel ? { actionLabel } : {}),
    layers: cloneLayerStackUndoLayers(layers),
    selectedLayerId
  };
}

export function layerStacksEqual(left: readonly LayerStackUndoLayer[], right: readonly LayerStackUndoLayer[]): boolean {
  return (
    left.length === right.length &&
    left.every((layer, index) => {
      const rightLayer = right[index];

      return (
        rightLayer !== undefined &&
        layer.id === rightLayer.id &&
        layer.materialId === rightLayer.materialId &&
        layer.role === rightLayer.role &&
        layer.thicknessMm === rightLayer.thicknessMm
      );
    })
  );
}

export function layerStackUndoSnapshotsEqual(left: LayerStackUndoSnapshot, right: LayerStackUndoSnapshot): boolean {
  return left.selectedLayerId === right.selectedLayerId && layerStacksEqual(left.layers, right.layers);
}

export function pushLayerStackUndoSnapshot(
  stack: LayerStackUndoStack,
  snapshot: LayerStackUndoSnapshot,
  limit = DEFAULT_LAYER_STACK_UNDO_LIMIT
): LayerStackUndoStack {
  const previous = stack[stack.length - 1];

  if (previous && layerStackUndoSnapshotsEqual(previous, snapshot)) {
    return stack;
  }

  return [...stack, createLayerStackUndoSnapshot(snapshot.layers, snapshot.selectedLayerId, snapshot.actionLabel)].slice(-limit);
}

export function popLayerStackUndoSnapshot(stack: LayerStackUndoStack): { snapshot: LayerStackUndoSnapshot; stack: LayerStackUndoStack } | null {
  const snapshot = stack[stack.length - 1];

  if (!snapshot) {
    return null;
  }

  return {
    snapshot: createLayerStackUndoSnapshot(snapshot.layers, snapshot.selectedLayerId, snapshot.actionLabel),
    stack: stack.slice(0, -1)
  };
}

export function restoreLayerStackUndoSnapshot(snapshot: LayerStackUndoSnapshot): LayerStackUndoSnapshot {
  return createLayerStackUndoSnapshot(snapshot.layers, snapshot.selectedLayerId, snapshot.actionLabel);
}
