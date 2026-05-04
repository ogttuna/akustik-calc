import type {
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallInternalLeafCoupling,
  WallSupportTopology,
  WallTopology,
  WallTopologyMode
} from "@dynecho/shared";

export type WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: WallCavityAbsorptionClass;
  airborneWallCavity1DepthMm: string;
  airborneWallCavity1FillCoverage: WallCavityFillCoverage;
  airborneWallCavity1LayerIndices: string;
  airborneWallCavity2AbsorptionClass: WallCavityAbsorptionClass;
  airborneWallCavity2DepthMm: string;
  airborneWallCavity2FillCoverage: WallCavityFillCoverage;
  airborneWallCavity2LayerIndices: string;
  airborneWallInternalLeafCoupling: WallInternalLeafCoupling;
  airborneWallInternalLeafLayerIndices: string;
  airborneWallSideALeafLayerIndices: string;
  airborneWallSideBLeafLayerIndices: string;
  airborneWallSupportTopology: WallSupportTopology;
  airborneWallTopologyMode: WallTopologyMode;
};

export const DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT: WorkbenchWallTopologyDraft = {
  airborneWallCavity1AbsorptionClass: "unknown",
  airborneWallCavity1DepthMm: "",
  airborneWallCavity1FillCoverage: "unknown",
  airborneWallCavity1LayerIndices: "",
  airborneWallCavity2AbsorptionClass: "unknown",
  airborneWallCavity2DepthMm: "",
  airborneWallCavity2FillCoverage: "unknown",
  airborneWallCavity2LayerIndices: "",
  airborneWallInternalLeafCoupling: "unknown",
  airborneWallInternalLeafLayerIndices: "",
  airborneWallSideALeafLayerIndices: "",
  airborneWallSideBLeafLayerIndices: "",
  airborneWallSupportTopology: "unknown",
  airborneWallTopologyMode: "auto"
};

function parsePositiveNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseWorkbenchLayerIndexList(value: string, rowCount: number): number[] | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const indices: number[] = [];
  for (const token of trimmed.split(/[,\s]+/u).filter(Boolean)) {
    if (!/^\d+$/u.test(token)) {
      return undefined;
    }

    const oneBasedIndex = Number(token);
    if (!Number.isSafeInteger(oneBasedIndex) || oneBasedIndex < 1 || oneBasedIndex > rowCount) {
      return undefined;
    }

    const zeroBasedIndex = oneBasedIndex - 1;
    if (!indices.includes(zeroBasedIndex)) {
      indices.push(zeroBasedIndex);
    }
  }

  return indices.length > 0 ? indices : undefined;
}

export function hasActiveWorkbenchWallTopologyDraft(draft: WorkbenchWallTopologyDraft): boolean {
  return Object.entries(DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT).some(
    ([key, defaultValue]) => draft[key as keyof WorkbenchWallTopologyDraft] !== defaultValue
  );
}

export function buildWorkbenchWallTopology(
  draft: WorkbenchWallTopologyDraft,
  rowCount: number
): WallTopology | undefined {
  if (draft.airborneWallTopologyMode === "auto") {
    return undefined;
  }

  const topology: WallTopology = {
    topologyMode: draft.airborneWallTopologyMode
  };

  if (draft.airborneWallTopologyMode !== "grouped_triple_leaf") {
    return topology;
  }

  return {
    ...topology,
    cavity1AbsorptionClass: draft.airborneWallCavity1AbsorptionClass,
    cavity1DepthMm: parsePositiveNumber(draft.airborneWallCavity1DepthMm),
    cavity1FillCoverage: draft.airborneWallCavity1FillCoverage,
    cavity1LayerIndices: parseWorkbenchLayerIndexList(draft.airborneWallCavity1LayerIndices, rowCount),
    cavity2AbsorptionClass: draft.airborneWallCavity2AbsorptionClass,
    cavity2DepthMm: parsePositiveNumber(draft.airborneWallCavity2DepthMm),
    cavity2FillCoverage: draft.airborneWallCavity2FillCoverage,
    cavity2LayerIndices: parseWorkbenchLayerIndexList(draft.airborneWallCavity2LayerIndices, rowCount),
    internalLeafCoupling: draft.airborneWallInternalLeafCoupling,
    internalLeafLayerIndices: parseWorkbenchLayerIndexList(draft.airborneWallInternalLeafLayerIndices, rowCount),
    sideALeafLayerIndices: parseWorkbenchLayerIndexList(draft.airborneWallSideALeafLayerIndices, rowCount),
    sideBLeafLayerIndices: parseWorkbenchLayerIndexList(draft.airborneWallSideBLeafLayerIndices, rowCount),
    supportTopology: draft.airborneWallSupportTopology
  };
}
