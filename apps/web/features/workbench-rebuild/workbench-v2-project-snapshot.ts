import type {
  AirborneBuildingPredictionOutputBasis,
  AirborneConservativeFlankingAssumption,
  AirborneContextMode,
  AirborneFlankingJunctionClass,
  AirborneResilientBarSideCount,
  MaterialDefinition,
  RequestedOutputId,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallSupportTopology,
  WallTopologyMode
} from "@dynecho/shared";

import type { LayerStackUndoLayer } from "./layer-stack-undo";
import {
  parseMaterialEditorPersistedState,
  type MaterialVisualOverride
} from "./material-editor-state";
import {
  WORKBENCH_V2_USER_OUTPUT_ID_SET,
  normalizeWorkbenchV2SelectedOutputs
} from "./workbench-v2-output-catalog";

export const WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID = "dynecho.workbench-v2.snapshot.v1";

export type WorkbenchV2StudyMode = "floor" | "wall";
export type WorkbenchV2DraftLayer = LayerStackUndoLayer;

export type WorkbenchV2ContextDraft = {
  airborneMode: AirborneContextMode;
  airborneResilientBarSideCount: AirborneResilientBarSideCount;
  buildingPredictionOutputBasis: AirborneBuildingPredictionOutputBasis;
  ci50_2500Db: string;
  ciDb: string;
  conservativeFlankingAssumption: AirborneConservativeFlankingAssumption;
  fieldKDb: string;
  flankingJunctionClass: AirborneFlankingJunctionClass;
  impactReceivingRoomVolumeM3: string;
  junctionCouplingLengthM: string;
  loadBasisKgM2: string;
  panelHeightMm: string;
  panelWidthMm: string;
  receivingRoomRt60S: string;
  receivingRoomVolumeM3: string;
  resilientLayerDynamicStiffnessMNm3: string;
  sourceRoomVolumeM3: string;
  supportSpacingMm: string;
  wallCavity1AbsorptionClass: WallCavityAbsorptionClass;
  wallCavity1DepthMm: string;
  wallCavity1FillCoverage: WallCavityFillCoverage;
  wallCavity1LayerIndices: string;
  wallSideALeafLayerIndices: string;
  wallSideBLeafLayerIndices: string;
  wallSupportTopology: WallSupportTopology;
  wallTopologyMode: WallTopologyMode;
};

export type WorkbenchV2ProjectSnapshot = {
  context: WorkbenchV2ContextDraft;
  customMaterials: MaterialDefinition[];
  id: string;
  layers: WorkbenchV2DraftLayer[];
  materialVisualOverrides: MaterialVisualOverride[];
  mode: WorkbenchV2StudyMode;
  name: string;
  savedAtIso: string;
  schemaId: typeof WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID;
  selectedLayerId: string | null;
  selectedOutputs: RequestedOutputId[];
};

export type WorkbenchV2ProjectSnapshotParseResult = {
  droppedCustomMaterials: number;
  droppedVisualOverrides: number;
  snapshot: WorkbenchV2ProjectSnapshot | null;
};

export const WORKBENCH_V2_DEFAULT_CONTEXT: WorkbenchV2ContextDraft = {
  airborneMode: "element_lab",
  airborneResilientBarSideCount: "auto",
  buildingPredictionOutputBasis: "unknown",
  ci50_2500Db: "",
  ciDb: "",
  conservativeFlankingAssumption: "unknown",
  fieldKDb: "",
  flankingJunctionClass: "unknown",
  impactReceivingRoomVolumeM3: "",
  junctionCouplingLengthM: "",
  loadBasisKgM2: "",
  panelHeightMm: "",
  panelWidthMm: "",
  receivingRoomRt60S: "",
  receivingRoomVolumeM3: "",
  resilientLayerDynamicStiffnessMNm3: "",
  sourceRoomVolumeM3: "",
  supportSpacingMm: "",
  wallCavity1AbsorptionClass: "unknown",
  wallCavity1DepthMm: "",
  wallCavity1FillCoverage: "unknown",
  wallCavity1LayerIndices: "",
  wallSideALeafLayerIndices: "",
  wallSideBLeafLayerIndices: "",
  wallSupportTopology: "unknown",
  wallTopologyMode: "auto"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseEnum<TValue extends string>(value: unknown, allowed: readonly TValue[], fallback: TValue): TValue {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as TValue) : fallback;
}

function parseStudyMode(value: unknown): WorkbenchV2StudyMode | null {
  return value === "floor" || value === "wall" ? value : null;
}

function parseLayer(value: unknown): WorkbenchV2DraftLayer | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.materialId !== "string" ||
    typeof value.role !== "string" ||
    typeof value.thicknessMm !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    materialId: value.materialId,
    role: value.role,
    thicknessMm: value.thicknessMm
  };
}

function parseContext(value: unknown): WorkbenchV2ContextDraft {
  const source = isRecord(value) ? value : {};

  return {
    airborneMode: parseEnum(source.airborneMode, ["element_lab", "field_between_rooms", "building_prediction"], WORKBENCH_V2_DEFAULT_CONTEXT.airborneMode),
    airborneResilientBarSideCount: parseEnum(source.airborneResilientBarSideCount, ["auto", "one_side", "both_sides"], WORKBENCH_V2_DEFAULT_CONTEXT.airborneResilientBarSideCount),
    buildingPredictionOutputBasis: parseEnum(source.buildingPredictionOutputBasis, ["unknown", "apparent", "standardized", "apparent_and_standardized"], WORKBENCH_V2_DEFAULT_CONTEXT.buildingPredictionOutputBasis),
    ci50_2500Db: parseString(source.ci50_2500Db),
    ciDb: parseString(source.ciDb),
    conservativeFlankingAssumption: parseEnum(source.conservativeFlankingAssumption, ["unknown", "single_conservative_path", "multi_path_conservative", "worst_case_screening"], WORKBENCH_V2_DEFAULT_CONTEXT.conservativeFlankingAssumption),
    fieldKDb: parseString(source.fieldKDb),
    flankingJunctionClass: parseEnum(source.flankingJunctionClass, ["unknown", "rigid_cross_junction", "rigid_t_junction", "lightweight_junction", "isolated_junction", "mixed_junction"], WORKBENCH_V2_DEFAULT_CONTEXT.flankingJunctionClass),
    impactReceivingRoomVolumeM3: parseString(source.impactReceivingRoomVolumeM3),
    junctionCouplingLengthM: parseString(source.junctionCouplingLengthM),
    loadBasisKgM2: parseString(source.loadBasisKgM2),
    panelHeightMm: parseString(source.panelHeightMm),
    panelWidthMm: parseString(source.panelWidthMm),
    receivingRoomRt60S: parseString(source.receivingRoomRt60S),
    receivingRoomVolumeM3: parseString(source.receivingRoomVolumeM3),
    resilientLayerDynamicStiffnessMNm3: parseString(source.resilientLayerDynamicStiffnessMNm3),
    sourceRoomVolumeM3: parseString(source.sourceRoomVolumeM3),
    supportSpacingMm: parseString(source.supportSpacingMm),
    wallCavity1AbsorptionClass: parseEnum(source.wallCavity1AbsorptionClass, ["unknown", "none", "porous_absorptive"], WORKBENCH_V2_DEFAULT_CONTEXT.wallCavity1AbsorptionClass),
    wallCavity1DepthMm: parseString(source.wallCavity1DepthMm),
    wallCavity1FillCoverage: parseEnum(source.wallCavity1FillCoverage, ["unknown", "empty", "partial", "full"], WORKBENCH_V2_DEFAULT_CONTEXT.wallCavity1FillCoverage),
    wallCavity1LayerIndices: parseString(source.wallCavity1LayerIndices),
    wallSideALeafLayerIndices: parseString(source.wallSideALeafLayerIndices),
    wallSideBLeafLayerIndices: parseString(source.wallSideBLeafLayerIndices),
    wallSupportTopology: parseEnum(source.wallSupportTopology, ["unknown", "independent_frames", "single_shared_stud", "twin_frame", "resilient_channel", "direct_fixed"], WORKBENCH_V2_DEFAULT_CONTEXT.wallSupportTopology),
    wallTopologyMode: parseEnum(source.wallTopologyMode, ["auto", "double_leaf_framed"], WORKBENCH_V2_DEFAULT_CONTEXT.wallTopologyMode)
  };
}

function parseRequestedOutputs(value: unknown): RequestedOutputId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter(
        (entry): entry is RequestedOutputId =>
          typeof entry === "string" && WORKBENCH_V2_USER_OUTPUT_ID_SET.has(entry as RequestedOutputId)
      )
    )
  );
}

export function buildWorkbenchV2ProjectSnapshot(input: {
  context: WorkbenchV2ContextDraft;
  customMaterials: readonly MaterialDefinition[];
  id: string;
  layers: readonly WorkbenchV2DraftLayer[];
  materialVisualOverrides: readonly MaterialVisualOverride[];
  mode: WorkbenchV2StudyMode;
  name: string;
  savedAtIso: string;
  selectedLayerId: string | null;
  selectedOutputs: readonly RequestedOutputId[];
}): WorkbenchV2ProjectSnapshot {
  return {
    context: { ...input.context },
    customMaterials: [...input.customMaterials],
    id: input.id,
    layers: input.layers.map((layer) => ({ ...layer })),
    materialVisualOverrides: input.materialVisualOverrides.map((override) => ({ ...override })),
    mode: input.mode,
    name: input.name,
    savedAtIso: input.savedAtIso,
    schemaId: WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID,
    selectedLayerId: input.selectedLayerId,
    selectedOutputs: normalizeWorkbenchV2SelectedOutputs(input.selectedOutputs, input.mode)
  };
}

export function parseWorkbenchV2ProjectSnapshot(value: unknown): WorkbenchV2ProjectSnapshotParseResult {
  if (!isRecord(value) || value.schemaId !== WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID) {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      snapshot: null
    };
  }

  const mode = parseStudyMode(value.mode);
  if (!mode || typeof value.id !== "string" || typeof value.name !== "string" || typeof value.savedAtIso !== "string" || !Array.isArray(value.layers)) {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      snapshot: null
    };
  }

  const layers = value.layers.map((entry) => parseLayer(entry)).filter((entry): entry is WorkbenchV2DraftLayer => entry !== null);
  const materialState = parseMaterialEditorPersistedState({
    customMaterials: value.customMaterials,
    materialVisualOverrides: value.materialVisualOverrides
  });
  const selectedLayerId = typeof value.selectedLayerId === "string" && layers.some((layer) => layer.id === value.selectedLayerId)
    ? value.selectedLayerId
    : layers[0]?.id ?? null;
  const selectedOutputs = normalizeWorkbenchV2SelectedOutputs(parseRequestedOutputs(value.selectedOutputs), mode);

  return {
    droppedCustomMaterials: materialState.droppedCustomMaterials,
    droppedVisualOverrides: materialState.droppedVisualOverrides,
    snapshot: {
      context: parseContext(value.context),
      customMaterials: materialState.state.customMaterials,
      id: value.id,
      layers,
      materialVisualOverrides: materialState.state.materialVisualOverrides,
      mode,
      name: value.name,
      savedAtIso: value.savedAtIso,
      schemaId: WORKBENCH_V2_PROJECT_SNAPSHOT_SCHEMA_ID,
      selectedLayerId,
      selectedOutputs
    }
  };
}
