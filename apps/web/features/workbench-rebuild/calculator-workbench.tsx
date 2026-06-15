"use client";

import type {
  AirborneBuildingPredictionOutputBasis,
  AirborneConservativeFlankingAssumption,
  AirborneContextMode,
  AirborneFlankingJunctionClass,
  AirborneResilientBarSideCount,
  AssemblyCalculation,
  EstimateRequest,
  FloorRole,
  MaterialDefinition,
  RequestedOutputId,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallSupportTopology,
  WallTopologyMode
} from "@dynecho/shared";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Copy,
  FileText,
  FolderOpen,
  GripVertical,
  Palette,
  Plus,
  Search,
  Trash2,
  Undo2
} from "lucide-react";
import { type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { buildWorkbenchResponseCurveFigures } from "../workbench/response-curve-model";
import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "../workbench/simple-workbench-proposal";
import {
  storeSimpleWorkbenchProposalPreview,
  type SimpleWorkbenchProposalPreviewProjectContext
} from "../workbench/simple-workbench-proposal-preview-storage";
import { MaterialEditorPanel } from "./material-editor-panel";
import {
  buildResolvedMaterialCatalog,
  parseMaterialEditorPersistedState,
  removeCustomMaterial,
  removeMaterialVisualOverride,
  serializeMaterialEditorPersistedState,
  upsertCustomMaterial,
  upsertMaterialVisualOverride,
  type MaterialEditorPersistedStateParseResult,
  type MaterialVisualOverride
} from "./material-editor-state";
import {
  createLayerStackUndoSnapshot,
  layerStacksEqual,
  popLayerStackUndoSnapshot,
  pushLayerStackUndoSnapshot,
  restoreLayerStackUndoSnapshot,
  type LayerStackUndoLayer,
  type LayerStackUndoStack
} from "./layer-stack-undo";
import { ProfessionalLayerIllustration, type ProfessionalLayerIllustrationLayer, type ProfessionalLayerVisualStyle } from "./professional-layer-illustration";
import { ProfessionalResponseCurve } from "./professional-response-curve";
import { ProjectWorkspacePanel } from "./project-workspace-panel";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  parseWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

type StudyMode = WorkbenchV2StudyMode;
type EstimateState =
  | { status: "idle" }
  | { reasons: readonly RequiredTask[]; status: "blocked" }
  | { status: "loading" }
  | { result: AssemblyCalculation; status: "ready" }
  | { message: string; status: "error" };
type OutputStatus = "live" | "needs_input" | "unsupported" | "pending";

type DraftLayer = LayerStackUndoLayer;

type OutputOption = {
  group: "Airborne" | "Impact" | "Spectrum";
  id: RequestedOutputId;
  label: string;
  modes: readonly StudyMode[];
};

type OutputRow = {
  detail: string;
  label: string;
  status: OutputStatus;
  value: string;
};

type RequiredTask = {
  actionLabel?: string;
  detail: string;
  id: string;
  label: string;
  targetElementId?: string;
  targetLayerId?: string;
};

type ContextDraft = WorkbenchV2ContextDraft;

type LayerDropTarget = {
  layerId: string;
  position: "after" | "before";
};

type ServerProjectSummaryPayload = {
  assemblyCount: number;
  id: string;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  reportCount: number;
  scenarioCount: number;
  updatedAtIso: string;
};

type ServerProjectAssemblySummaryPayload = {
  calculationSummary?: {
    primaryOutput?: string;
    primaryValueLabel?: string;
    selectedOutputs: string[];
    status: "error" | "needs_input" | "ready" | "unsupported";
  };
  description?: string;
  displayCode?: string;
  id: string;
  kind: StudyMode;
  name: string;
  updatedAtIso: string;
  version: number;
};

type ServerProjectAssemblyRecordPayload = ServerProjectAssemblySummaryPayload & {
  snapshot: unknown;
};

type ServerProjectReportSummaryPayload = {
  assemblyId: string;
  currentRevisionId: string;
  description?: string;
  displayCode?: string;
  id: string;
  name: string;
  revisionCount: number;
  sourceAssemblyVersion: number;
  status: "archived" | "draft" | "issued";
  updatedAtIso: string;
};

type ServerProjectReportRecordPayload = ServerProjectReportSummaryPayload & {
  reportDocument: SimpleWorkbenchProposalDocument;
  sourceAssemblySnapshot: unknown;
  sourceCalculationOutput?: unknown;
  sourceMaterialSnapshot: {
    customMaterials: readonly unknown[];
    materialVisualOverrides: readonly unknown[];
  };
};

type ServerProjectStatus = "error" | "idle" | "loading" | "restoring" | "syncing";

const OUTPUT_OPTIONS: readonly OutputOption[] = [
  { group: "Airborne", id: "Rw", label: "Rw", modes: ["wall", "floor"] },
  { group: "Airborne", id: "R'w", label: "R'w", modes: ["wall", "floor"] },
  { group: "Airborne", id: "DnT,w", label: "DnT,w", modes: ["wall", "floor"] },
  { group: "Airborne", id: "STC", label: "STC", modes: ["wall", "floor"] },
  { group: "Spectrum", id: "C", label: "C", modes: ["wall", "floor"] },
  { group: "Spectrum", id: "Ctr", label: "Ctr", modes: ["wall", "floor"] },
  { group: "Impact", id: "Ln,w", label: "Ln,w", modes: ["floor"] },
  { group: "Impact", id: "L'n,w", label: "L'n,w", modes: ["floor"] },
  { group: "Impact", id: "L'nT,w", label: "L'nT,w", modes: ["floor"] },
  { group: "Impact", id: "L'nT,50", label: "L'nT,50", modes: ["floor"] },
  { group: "Impact", id: "DeltaLw", label: "DeltaLw", modes: ["floor"] },
  { group: "Impact", id: "CI", label: "CI", modes: ["floor"] },
  { group: "Impact", id: "CI,50-2500", label: "CI,50", modes: ["floor"] }
];

const FLOOR_ROLES: readonly { label: string; value: FloorRole }[] = [
  { label: "Base", value: "base_structure" },
  { label: "Resilient layer", value: "resilient_layer" },
  { label: "Floating screed", value: "floating_screed" },
  { label: "Upper fill", value: "upper_fill" },
  { label: "Finish", value: "floor_covering" },
  { label: "Ceiling cavity", value: "ceiling_cavity" },
  { label: "Ceiling fill", value: "ceiling_fill" },
  { label: "Ceiling board", value: "ceiling_board" }
];

const WALL_ROLES = [
  { label: "Side A", value: "side_a" },
  { label: "Cavity", value: "cavity" },
  { label: "Core", value: "core" },
  { label: "Support", value: "support" },
  { label: "Side B", value: "side_b" }
] as const;

const WALL_TOPOLOGY_MODE_OPTIONS: readonly { label: string; value: WallTopologyMode }[] = [
  { label: "Auto", value: "auto" },
  { label: "Double leaf / framed", value: "double_leaf_framed" }
];

const WALL_CAVITY_FILL_OPTIONS: readonly { label: string; value: WallCavityFillCoverage }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Empty", value: "empty" },
  { label: "Partial", value: "partial" },
  { label: "Full", value: "full" }
];

const WALL_CAVITY_ABSORPTION_OPTIONS: readonly { label: string; value: WallCavityAbsorptionClass }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "None", value: "none" },
  { label: "Porous absorber", value: "porous_absorptive" }
];

const WALL_SUPPORT_TOPOLOGY_OPTIONS: readonly { label: string; value: WallSupportTopology }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Independent frames", value: "independent_frames" },
  { label: "Single shared stud", value: "single_shared_stud" },
  { label: "Twin frame", value: "twin_frame" },
  { label: "Resilient channel", value: "resilient_channel" },
  { label: "Direct fixed", value: "direct_fixed" }
];

const RESILIENT_BAR_SIDE_COUNT_OPTIONS: readonly { label: string; value: AirborneResilientBarSideCount }[] = [
  { label: "Auto", value: "auto" },
  { label: "One side", value: "one_side" },
  { label: "Both sides", value: "both_sides" }
];

const FLANKING_JUNCTION_CLASS_OPTIONS: readonly { label: string; value: AirborneFlankingJunctionClass }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Rigid cross junction", value: "rigid_cross_junction" },
  { label: "Rigid T junction", value: "rigid_t_junction" },
  { label: "Lightweight junction", value: "lightweight_junction" },
  { label: "Isolated junction", value: "isolated_junction" },
  { label: "Mixed junction", value: "mixed_junction" }
];

const CONSERVATIVE_FLANKING_OPTIONS: readonly { label: string; value: AirborneConservativeFlankingAssumption }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Single conservative path", value: "single_conservative_path" },
  { label: "Multi-path conservative", value: "multi_path_conservative" },
  { label: "Worst-case screening", value: "worst_case_screening" }
];

const BUILDING_OUTPUT_BASIS_OPTIONS: readonly { label: string; value: AirborneBuildingPredictionOutputBasis }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Apparent", value: "apparent" },
  { label: "Standardized", value: "standardized" },
  { label: "Apparent + standardized", value: "apparent_and_standardized" }
];

const CONTEXT_INPUT_IDS: Record<keyof ContextDraft, string> = {
  airborneMode: "rebuild-airborne-mode",
  airborneResilientBarSideCount: "rebuild-resilient-bar-side-count",
  buildingPredictionOutputBasis: "rebuild-building-output-basis",
  ci50_2500Db: "rebuild-ci50-2500-db",
  ciDb: "rebuild-ci-db",
  conservativeFlankingAssumption: "rebuild-conservative-flanking-assumption",
  fieldKDb: "rebuild-field-k-db",
  flankingJunctionClass: "rebuild-flanking-junction-class",
  impactReceivingRoomVolumeM3: "rebuild-impact-room-volume",
  junctionCouplingLengthM: "rebuild-junction-coupling-length",
  loadBasisKgM2: "rebuild-load-basis",
  panelHeightMm: "rebuild-panel-height",
  panelWidthMm: "rebuild-panel-width",
  receivingRoomRt60S: "rebuild-receiving-room-rt60",
  receivingRoomVolumeM3: "rebuild-receiving-room-volume",
  resilientLayerDynamicStiffnessMNm3: "rebuild-dynamic-stiffness",
  sourceRoomVolumeM3: "rebuild-source-room-volume",
  supportSpacingMm: "rebuild-support-spacing",
  wallCavity1AbsorptionClass: "rebuild-wall-cavity-1-absorption",
  wallCavity1DepthMm: "rebuild-wall-cavity-1-depth",
  wallCavity1FillCoverage: "rebuild-wall-cavity-1-fill",
  wallCavity1LayerIndices: "rebuild-wall-cavity-1-rows",
  wallSideALeafLayerIndices: "rebuild-wall-side-a-rows",
  wallSideBLeafLayerIndices: "rebuild-wall-side-b-rows",
  wallSupportTopology: "rebuild-wall-support-topology",
  wallTopologyMode: "rebuild-wall-topology-mode"
};

const INITIAL_CONTEXT: ContextDraft = WORKBENCH_V2_DEFAULT_CONTEXT;

const INITIAL_WALL_LAYERS: readonly DraftLayer[] = [
  { id: "rebuild-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "rebuild-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "rebuild-layer-3", materialId: "concrete", role: "side_b", thicknessMm: "100" }
];

const INITIAL_FLOOR_LAYERS: readonly DraftLayer[] = [
  { id: "rebuild-floor-layer-1", materialId: "concrete", role: "base_structure", thicknessMm: "150" },
  { id: "rebuild-floor-layer-2", materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: "5" },
  { id: "rebuild-floor-layer-3", materialId: "screed", role: "floating_screed", thicknessMm: "50" }
];

const INITIAL_LAYERS = INITIAL_WALL_LAYERS;

const MATERIAL_EDITOR_STORAGE_KEY = "dynecho:workbench-v2:material-editor:v1";
const UNKNOWN_MATERIAL: MaterialDefinition = {
  category: "mass",
  densityKgM3: 0,
  id: "unknown_material",
  name: "Unknown material",
  tags: []
};

function createLayerId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `layer-${Date.now()}`;
}

function getMaterialFromCatalog(materialId: string, materialById: ReadonlyMap<string, MaterialDefinition>): MaterialDefinition {
  return materialById.get(materialId) ?? {
    ...UNKNOWN_MATERIAL,
    id: materialId || UNKNOWN_MATERIAL.id,
    name: materialId ? `Unknown material (${materialId})` : UNKNOWN_MATERIAL.name
  };
}

function getDefaultMaterialId(mode: StudyMode, materialById: ReadonlyMap<string, MaterialDefinition>, materials: readonly MaterialDefinition[]): string {
  if (mode === "floor") {
    return materialById.has("concrete") ? "concrete" : materials[0]?.id ?? "concrete";
  }

  return materialById.has("gypsum_board") ? "gypsum_board" : materials[0]?.id ?? "gypsum_board";
}

function getRoleOptions(mode: StudyMode): readonly { label: string; value: string }[] {
  return mode === "floor" ? FLOOR_ROLES : WALL_ROLES;
}

function cloneLayers(layers: readonly DraftLayer[]): DraftLayer[] {
  return layers.map((layer) => ({ ...layer }));
}

function matchesStarterStack(layers: readonly DraftLayer[], starter: readonly DraftLayer[]): boolean {
  return (
    layers.length === starter.length &&
    layers.every((layer, index) => {
      const starterLayer = starter[index];

      return (
        starterLayer !== undefined &&
        layer.materialId === starterLayer.materialId &&
        layer.role === starterLayer.role &&
        layer.thicknessMm === starterLayer.thicknessMm
      );
    })
  );
}

function migrateLayerRoles(
  layers: readonly DraftLayer[],
  nextMode: StudyMode,
  materialById: ReadonlyMap<string, MaterialDefinition>,
  materials: readonly MaterialDefinition[]
): DraftLayer[] {
  const roles = getRoleOptions(nextMode);

  return layers.map((layer, index) => ({
    ...layer,
    materialId: layer.materialId || getDefaultMaterialId(nextMode, materialById, materials),
    role: roles[Math.min(index, roles.length - 1)]!.value
  }));
}

function getRoleLabel(mode: StudyMode, value: string): string {
  return getRoleOptions(mode).find((role) => role.value === value)?.label ?? value.replace(/_/g, " ");
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

function getFilteredMaterials(
  search: string,
  selectedId: string,
  materials: readonly MaterialDefinition[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): MaterialDefinition[] {
  const normalized = normalizeSearch(search);
  const filtered = normalized
    ? materials.filter((material) => {
        const haystack = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();
        return haystack.includes(normalized);
      })
    : materials;
  const selected = getMaterialFromCatalog(selectedId, materialById);
  const limited = filtered.slice(0, 48);

  if (normalized) {
    return limited;
  }

  return limited.some((material) => material.id === selected.id) ? limited : [selected, ...limited];
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseOptionalPositiveNumber(value: string): number | undefined {
  return parsePositiveNumber(value) ?? undefined;
}

function parseOptionalFiniteNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDb(value: number): string {
  return Number.isInteger(value) ? `${value} dB` : `${value.toFixed(1)} dB`;
}

function formatThickness(value: number | null): string {
  if (!value) {
    return "Missing";
  }

  return Number.isInteger(value) ? `${value} mm` : `${value.toFixed(1)} mm`;
}

function getLayerThicknessInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-thickness`;
}

function getLayerMaterialInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-material`;
}

function getLayerMaterialPopoverId(layerId: string): string {
  return `rebuild-layer-${layerId}-material-popover`;
}

function getLayerRoleInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-role`;
}

function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);

  if (!item) {
    return next;
  }

  next.splice(toIndex, 0, item);
  return next;
}

function moveLayerBeforeOrAfter(
  layers: readonly DraftLayer[],
  sourceLayerId: string,
  targetLayerId: string,
  position: "after" | "before"
): DraftLayer[] {
  if (sourceLayerId === targetLayerId) {
    return [...layers];
  }

  const source = layers.find((layer) => layer.id === sourceLayerId);
  if (!source) {
    return [...layers];
  }

  const withoutSource = layers.filter((layer) => layer.id !== sourceLayerId);
  const targetIndex = withoutSource.findIndex((layer) => layer.id === targetLayerId);
  if (targetIndex < 0) {
    return [...layers];
  }

  const insertIndex = position === "after" ? targetIndex + 1 : targetIndex;
  const next = [...withoutSource];
  next.splice(insertIndex, 0, source);
  return next;
}

function buildLocalTasks(
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): readonly RequiredTask[] {
  const tasks: RequiredTask[] = [];

  if (!layers.length) {
    tasks.push({
      actionLabel: "Add",
      detail: "Add at least one construction layer.",
      id: "missing-layer",
      label: "No layers"
    });
  }

  if (!selectedOutputs.length) {
    tasks.push({
      actionLabel: "Select",
      detail: "Choose at least one requested output.",
      id: "missing-output",
      label: "No output selected",
      targetElementId: "rebuild-output-picker"
    });
  }

  for (const [index, layer] of layers.entries()) {
    const material = getMaterialFromCatalog(layer.materialId, materialById);

    if (!materialById.has(layer.materialId)) {
      tasks.push({
        actionLabel: "Review",
        detail: `Layer ${index + 1} references a material that is not in the current catalog.`,
        id: `missing-material-${layer.id}`,
        label: "Missing material",
        targetLayerId: layer.id
      });
    }

    if (!parsePositiveNumber(layer.thicknessMm)) {
      tasks.push({
        actionLabel: "Edit",
        detail: `Enter thickness for layer ${index + 1}.`,
        id: `missing-thickness-${layer.id}`,
        label: `${material.name} thickness`,
        targetElementId: getLayerThicknessInputId(layer.id),
        targetLayerId: layer.id
      });
    }
  }

  return tasks;
}

function parseLayerIndexList(value: string, rowCount: number): number[] | undefined {
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

  return indices.length ? indices : undefined;
}

function formatLayerIndexList(indices: readonly number[]): string {
  return indices.map((index) => String(index + 1)).join(", ");
}

function getLayerIndicesByRole(layers: readonly DraftLayer[], role: string): number[] {
  return layers.flatMap((layer, index) => (layer.role === role ? [index] : []));
}

function getLayerThicknessSum(layers: readonly DraftLayer[], indices: readonly number[]): number | null {
  const total = indices.reduce((sum, index) => sum + (parsePositiveNumber(layers[index]?.thicknessMm ?? "") ?? 0), 0);
  return total > 0 ? Math.round(total * 10) / 10 : null;
}

function isPorousCavityMaterial(material: MaterialDefinition): boolean {
  const descriptor = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();

  return (
    material.category === "insulation" ||
    material.acoustic?.behavior === "porous_absorber" ||
    /insulation|wool|mineral|porous|absorber|fiber|fibre/u.test(descriptor)
  );
}

function isEmptyCavityMaterial(material: MaterialDefinition): boolean {
  const descriptor = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();

  return material.category === "gap" || material.acoustic?.behavior === "air_cavity" || /air|gap|cavity|void/u.test(descriptor);
}

function inferCavityFillCoverage(
  layers: readonly DraftLayer[],
  indices: readonly number[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): WallCavityFillCoverage {
  const materials = indices.map((index) => getMaterialFromCatalog(layers[index]?.materialId ?? "", materialById));

  if (materials.some(isPorousCavityMaterial)) {
    return "full";
  }

  if (materials.length > 0 && materials.every(isEmptyCavityMaterial)) {
    return "empty";
  }

  return "unknown";
}

function inferCavityAbsorptionClass(
  layers: readonly DraftLayer[],
  indices: readonly number[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): WallCavityAbsorptionClass {
  const materials = indices.map((index) => getMaterialFromCatalog(layers[index]?.materialId ?? "", materialById));

  if (materials.some(isPorousCavityMaterial)) {
    return "porous_absorptive";
  }

  if (materials.length > 0 && materials.every(isEmptyCavityMaterial)) {
    return "none";
  }

  return "unknown";
}

function buildWallTopologyFromContext(context: ContextDraft, rowCount: number): NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] | undefined {
  if (context.wallTopologyMode === "auto") {
    return undefined;
  }

  const topology: NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] = {
    topologyMode: context.wallTopologyMode
  };
  const sideA = parseLayerIndexList(context.wallSideALeafLayerIndices, rowCount);
  const cavity1 = parseLayerIndexList(context.wallCavity1LayerIndices, rowCount);
  const sideB = parseLayerIndexList(context.wallSideBLeafLayerIndices, rowCount);
  const cavity1DepthMm = parseOptionalPositiveNumber(context.wallCavity1DepthMm);

  if (sideA) topology.sideALeafLayerIndices = sideA;
  if (cavity1) topology.cavity1LayerIndices = cavity1;
  if (sideB) topology.sideBLeafLayerIndices = sideB;
  if (cavity1DepthMm) topology.cavity1DepthMm = cavity1DepthMm;
  if (context.wallCavity1FillCoverage !== "unknown") topology.cavity1FillCoverage = context.wallCavity1FillCoverage;
  if (context.wallCavity1AbsorptionClass !== "unknown") topology.cavity1AbsorptionClass = context.wallCavity1AbsorptionClass;
  if (context.wallSupportTopology !== "unknown") topology.supportTopology = context.wallSupportTopology;

  return topology;
}

function isWallTopologyInput(fieldId: string): boolean {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    "sidealeafgroup",
    "sidebleafgroup",
    "cavity1depthmm",
    "cavitydepthmm",
    "cavity1fillcoverage",
    "fillstate",
    "absorberclass",
    "framebridgeclass",
    "supporttopology",
    "supportspacingmm",
    "studspacingmm",
    "resilientbarsidecount",
    "leafgrouping"
  ].some((field) => normalized.includes(field));
}

function isBuildingPredictionInput(fieldId: string): boolean {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    "sourceroomvolumem3",
    "flankingjunctionclass",
    "conservativeflankingassumption",
    "junctioncouplinglengthm",
    "buildingpredictionoutputbasis"
  ].some((field) => normalized.includes(field));
}

function getMissingInputTask(fieldId: string): RequiredTask {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (normalized.includes("sidealeafgroup")) {
    return {
      actionLabel: "Group",
      detail: "Set Wall topology to Double leaf, then enter the visible row number(s) for the Side A leaf.",
      id: `remote-${fieldId}`,
      label: "Side A leaf rows",
      targetElementId: CONTEXT_INPUT_IDS.wallSideALeafLayerIndices
    };
  }

  if (normalized.includes("sidebleafgroup")) {
    return {
      actionLabel: "Group",
      detail: "Enter the visible row number(s) for the Side B leaf.",
      id: `remote-${fieldId}`,
      label: "Side B leaf rows",
      targetElementId: CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices
    };
  }

  if (normalized.includes("leafgrouping")) {
    return {
      actionLabel: "Review",
      detail: "Leaf and cavity row groups must be non-empty, non-overlapping, and inside the current layer list.",
      id: `remote-${fieldId}`,
      label: "Layer ownership",
      targetElementId: CONTEXT_INPUT_IDS.wallTopologyMode
    };
  }

  if (normalized.includes("cavity1depthmm") || normalized.includes("cavitydepthmm")) {
    return {
      actionLabel: "Enter",
      detail: "Enter the cavity depth in millimetres or use the current cavity layer role to fill it.",
      id: `remote-${fieldId}`,
      label: "Cavity depth",
      targetElementId: CONTEXT_INPUT_IDS.wallCavity1DepthMm
    };
  }

  if (normalized.includes("cavity1fillcoverage") || normalized.includes("fillstate")) {
    return {
      actionLabel: "Select",
      detail: "Select whether the cavity is empty, partially filled, or fully filled.",
      id: `remote-${fieldId}`,
      label: "Cavity fill",
      targetElementId: CONTEXT_INPUT_IDS.wallCavity1FillCoverage
    };
  }

  if (normalized.includes("absorberclass")) {
    return {
      actionLabel: "Select",
      detail: "Select the cavity absorption class for the fill layer.",
      id: `remote-${fieldId}`,
      label: "Cavity absorption",
      targetElementId: CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass
    };
  }

  if (normalized.includes("framebridgeclass")) {
    return {
      actionLabel: "Select",
      detail: "Choose the support topology; the dynamic route derives the frame bridge class from that support path.",
      id: `remote-${fieldId}`,
      label: "Frame bridge path",
      targetElementId: CONTEXT_INPUT_IDS.wallSupportTopology
    };
  }

  if (normalized.includes("supporttopology")) {
    return {
      actionLabel: "Select",
      detail: "Select the support path used by the framed wall route.",
      id: `remote-${fieldId}`,
      label: "Support topology",
      targetElementId: CONTEXT_INPUT_IDS.wallSupportTopology
    };
  }

  if (normalized.includes("supportspacingmm") || normalized.includes("studspacingmm")) {
    return {
      actionLabel: "Enter",
      detail: "Enter support or stud spacing in millimetres.",
      id: `remote-${fieldId}`,
      label: "Support spacing",
      targetElementId: CONTEXT_INPUT_IDS.supportSpacingMm
    };
  }

  if (normalized.includes("resilientbarsidecount")) {
    return {
      actionLabel: "Select",
      detail: "Select whether resilient bars/channels are on one side or both sides.",
      id: `remote-${fieldId}`,
      label: "Resilient bars",
      targetElementId: CONTEXT_INPUT_IDS.airborneResilientBarSideCount
    };
  }

  if (normalized.includes("contextmode")) {
    return {
      actionLabel: "Select",
      detail: "Select Field or Building mode for apparent airborne outputs.",
      id: `remote-${fieldId}`,
      label: "Airborne mode",
      targetElementId: CONTEXT_INPUT_IDS.airborneMode
    };
  }

  if (normalized.includes("partitionaream2")) {
    return {
      actionLabel: "Enter",
      detail: "Enter panel width and height; the route derives partition area from those dimensions.",
      id: `remote-${fieldId}`,
      label: "Panel area",
      targetElementId: CONTEXT_INPUT_IDS.panelWidthMm
    };
  }

  if (normalized.includes("sourceroomvolumem3")) {
    return {
      actionLabel: "Enter",
      detail: "Required for building prediction.",
      id: `remote-${fieldId}`,
      label: "Source room volume",
      targetElementId: CONTEXT_INPUT_IDS.sourceRoomVolumeM3
    };
  }

  if (normalized.includes("flankingjunctionclass")) {
    return {
      actionLabel: "Select",
      detail: "Select the flanking junction class used by the building route.",
      id: `remote-${fieldId}`,
      label: "Flanking junction",
      targetElementId: CONTEXT_INPUT_IDS.flankingJunctionClass
    };
  }

  if (normalized.includes("conservativeflankingassumption")) {
    return {
      actionLabel: "Select",
      detail: "Select the conservative flanking assumption for the route.",
      id: `remote-${fieldId}`,
      label: "Flanking assumption",
      targetElementId: CONTEXT_INPUT_IDS.conservativeFlankingAssumption
    };
  }

  if (normalized.includes("junctioncouplinglengthm")) {
    return {
      actionLabel: "Enter",
      detail: "Required for the building prediction flanking path.",
      id: `remote-${fieldId}`,
      label: "Coupling length",
      targetElementId: CONTEXT_INPUT_IDS.junctionCouplingLengthM
    };
  }

  if (normalized.includes("buildingpredictionoutputbasis")) {
    return {
      actionLabel: "Select",
      detail: "Select whether the building route should publish apparent, standardized, or both outputs.",
      id: `remote-${fieldId}`,
      label: "Building output basis",
      targetElementId: CONTEXT_INPUT_IDS.buildingPredictionOutputBasis
    };
  }

  if (normalized.includes("ci502500db")) {
    return {
      actionLabel: "Enter",
      detail: "Required for low-frequency impact field output.",
      id: `remote-${fieldId}`,
      label: "CI,50-2500",
      targetElementId: CONTEXT_INPUT_IDS.ci50_2500Db
    };
  }

  if (normalized.includes("cidb")) {
    return {
      actionLabel: "Enter",
      detail: "Required for impact spectrum adaptation.",
      id: `remote-${fieldId}`,
      label: "CI",
      targetElementId: CONTEXT_INPUT_IDS.ciDb
    };
  }

  if (normalized.includes("fieldkdb")) {
    return {
      actionLabel: "Enter",
      detail: "Required for field correction.",
      id: `remote-${fieldId}`,
      label: "K correction",
      targetElementId: CONTEXT_INPUT_IDS.fieldKDb
    };
  }

  if (normalized.includes("receivingroomrt60s")) {
    return {
      actionLabel: "Enter",
      detail: "Required for standardized receiving-room output.",
      id: `remote-${fieldId}`,
      label: "RT60",
      targetElementId: CONTEXT_INPUT_IDS.receivingRoomRt60S
    };
  }

  if (normalized.includes("receivingroomvolumem3")) {
    return {
      actionLabel: "Enter",
      detail: "Required for field or standardized output.",
      id: `remote-${fieldId}`,
      label: "Room volume",
      targetElementId: normalized.includes("impactfieldcontext")
        ? CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3
        : CONTEXT_INPUT_IDS.receivingRoomVolumeM3
    };
  }

  if (normalized.includes("panelwidthmm")) {
    return {
      actionLabel: "Enter",
      detail: "Required for field/building airborne output.",
      id: `remote-${fieldId}`,
      label: "Panel width",
      targetElementId: CONTEXT_INPUT_IDS.panelWidthMm
    };
  }

  if (normalized.includes("panelheightmm")) {
    return {
      actionLabel: "Enter",
      detail: "Required for field/building airborne output.",
      id: `remote-${fieldId}`,
      label: "Panel height",
      targetElementId: CONTEXT_INPUT_IDS.panelHeightMm
    };
  }

  if (normalized.includes("loadbasiskgm2")) {
    return {
      actionLabel: "Enter",
      detail: "Required by the floor impact route.",
      id: `remote-${fieldId}`,
      label: "Load basis",
      targetElementId: CONTEXT_INPUT_IDS.loadBasisKgM2
    };
  }

  if (normalized.includes("resilientlayerdynamicstiffnessmnm3")) {
    return {
      actionLabel: "Enter",
      detail: "Required by the resilient layer route.",
      id: `remote-${fieldId}`,
      label: "Dynamic stiffness",
      targetElementId: CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3
    };
  }

  return {
    detail: "Required physical input is missing.",
    id: `remote-${fieldId}`,
    label: fieldId.split(".").at(-1) ?? fieldId
  };
}

function getRemoteTasks(result: AssemblyCalculation | null): readonly RequiredTask[] {
  const boundary = result?.acousticAnswerBoundary;

  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  const missingPhysicalInputs = Array.from(new Set<string>(boundary.missingPhysicalInputs));
  return missingPhysicalInputs.map(getMissingInputTask);
}

function getMissingPhysicalInputs(result: AssemblyCalculation | null): readonly string[] {
  const boundary = result?.acousticAnswerBoundary;

  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  return boundary.missingPhysicalInputs;
}

export function buildEstimatePayload(
  mode: StudyMode,
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  context: ContextDraft,
  customMaterials: readonly MaterialDefinition[]
): EstimateRequest | null {
  const requestLayers: EstimateRequest["layers"] = [];

  for (const layer of layers) {
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);

    if (!thicknessMm) {
      return null;
    }

    requestLayers.push({
      floorRole: mode === "floor" ? (layer.role as FloorRole) : undefined,
      materialId: layer.materialId,
      thicknessMm
    });
  }

  if (!requestLayers.length || !selectedOutputs.length) {
    return null;
  }

  const airborneContext: EstimateRequest["airborneContext"] = {};
  const panelWidthMm = parseOptionalPositiveNumber(context.panelWidthMm);
  const panelHeightMm = parseOptionalPositiveNumber(context.panelHeightMm);
  const receivingRoomVolumeM3 = parseOptionalPositiveNumber(context.receivingRoomVolumeM3);
  const receivingRoomRt60S = parseOptionalPositiveNumber(context.receivingRoomRt60S);
  const sourceRoomVolumeM3 = parseOptionalPositiveNumber(context.sourceRoomVolumeM3);
  const junctionCouplingLengthM = parseOptionalPositiveNumber(context.junctionCouplingLengthM);
  const supportSpacingMm = parseOptionalPositiveNumber(context.supportSpacingMm);
  const wallTopology = mode === "wall" ? buildWallTopologyFromContext(context, layers.length) : undefined;

  if (context.airborneMode !== "element_lab") airborneContext.contextMode = context.airborneMode;
  if (panelWidthMm) airborneContext.panelWidthMm = panelWidthMm;
  if (panelHeightMm) airborneContext.panelHeightMm = panelHeightMm;
  if (receivingRoomVolumeM3) airborneContext.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  if (receivingRoomRt60S) airborneContext.receivingRoomRt60S = receivingRoomRt60S;
  if (sourceRoomVolumeM3) airborneContext.sourceRoomVolumeM3 = sourceRoomVolumeM3;
  if (junctionCouplingLengthM) airborneContext.junctionCouplingLengthM = junctionCouplingLengthM;
  if (supportSpacingMm) airborneContext.studSpacingMm = supportSpacingMm;
  if (context.airborneResilientBarSideCount !== "auto") airborneContext.resilientBarSideCount = context.airborneResilientBarSideCount;
  if (context.flankingJunctionClass !== "unknown") airborneContext.flankingJunctionClass = context.flankingJunctionClass;
  if (context.conservativeFlankingAssumption !== "unknown") {
    airborneContext.conservativeFlankingAssumption = context.conservativeFlankingAssumption;
  }
  if (context.buildingPredictionOutputBasis !== "unknown") airborneContext.buildingPredictionOutputBasis = context.buildingPredictionOutputBasis;
  if (wallTopology) airborneContext.wallTopology = wallTopology;

  const impactFieldContext: EstimateRequest["impactFieldContext"] = {};
  const fieldKDb = parseOptionalFiniteNumber(context.fieldKDb);
  const ciDb = parseOptionalFiniteNumber(context.ciDb);
  const ci50_2500Db = parseOptionalFiniteNumber(context.ci50_2500Db);
  const impactReceivingRoomVolumeM3 = parseOptionalPositiveNumber(context.impactReceivingRoomVolumeM3);

  if (fieldKDb !== undefined) impactFieldContext.fieldKDb = fieldKDb;
  if (ciDb !== undefined) impactFieldContext.ciDb = ciDb;
  if (ci50_2500Db !== undefined) impactFieldContext.ci50_2500Db = ci50_2500Db;
  if (impactReceivingRoomVolumeM3) impactFieldContext.receivingRoomVolumeM3 = impactReceivingRoomVolumeM3;

  const floorImpactContext: EstimateRequest["floorImpactContext"] = {};
  const loadBasisKgM2 = parseOptionalPositiveNumber(context.loadBasisKgM2);
  const resilientLayerDynamicStiffnessMNm3 = parseOptionalPositiveNumber(context.resilientLayerDynamicStiffnessMNm3);

  if (loadBasisKgM2) floorImpactContext.loadBasisKgM2 = loadBasisKgM2;
  if (resilientLayerDynamicStiffnessMNm3) floorImpactContext.resilientLayerDynamicStiffnessMNm3 = resilientLayerDynamicStiffnessMNm3;

  const payload: EstimateRequest = {
    calculator: "dynamic",
    layers: requestLayers,
    targetOutputs: [...selectedOutputs]
  };

  if (Object.keys(airborneContext).length) payload.airborneContext = airborneContext;
  if (Object.keys(impactFieldContext).length) payload.impactFieldContext = impactFieldContext;
  if (mode === "floor" && Object.keys(floorImpactContext).length) payload.floorImpactContext = floorImpactContext;
  if (customMaterials.length) payload.materialCatalog = [...customMaterials];

  return payload;
}

function readOutputValue(result: AssemblyCalculation, outputId: RequestedOutputId): number | null {
  switch (outputId) {
    case "AIIC":
      return result.impact?.AIIC ?? null;
    case "C":
      return result.ratings.iso717.C;
    case "CI":
      return result.impact?.CI ?? null;
    case "CI,50-2500":
      return result.impact?.CI50_2500 ?? null;
    case "Ctr":
      return result.ratings.iso717.Ctr;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? null;
    case "Dn,A":
      return result.ratings.field?.DnA ?? result.metrics.estimatedDnADb ?? null;
    case "DnT,A":
      return result.ratings.field?.DnTA ?? result.metrics.estimatedDnTADb ?? null;
    case "DnT,A,k":
      return result.ratings.field?.DnTAk ?? result.metrics.estimatedDnTAkDb ?? null;
    case "DnT,w":
      return result.ratings.field?.DnTw ?? result.metrics.estimatedDnTwDb ?? null;
    case "Dn,w":
      return result.ratings.field?.DnW ?? result.metrics.estimatedDnWDb ?? null;
    case "IIC":
      return result.impact?.IIC ?? null;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? null;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? null;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? null;
    case "Ln,w":
      return result.impact?.LnW ?? null;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? null;
    case "LnT,A":
      return result.impact?.LnTA ?? null;
    case "Rw":
      return result.ratings.iso717.Rw;
    case "R'w":
      return result.ratings.field?.RwPrime ?? result.metrics.estimatedRwPrimeDb ?? null;
    case "STC":
      return result.ratings.astmE413.STC;
    case "HIIC":
    case "ISR":
    case "LIIC":
    case "LIR":
    case "NISR":
      return null;
    default:
      return null;
  }
}

function getOutputDetail(result: AssemblyCalculation, outputId: RequestedOutputId, status: OutputStatus): string {
  const boundary = result.acousticAnswerBoundary;

  if (status === "live") {
    return "Calculated";
  }

  if (boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId)) {
    const tasks = getRemoteTasks(result);
    return tasks.length ? `Needs ${tasks.slice(0, 2).map((task) => task.label).join(", ")}` : "Needs input";
  }

  if (result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId)) {
    return "Unsupported for route";
  }

  return "No value";
}

export function buildOutputRows(result: AssemblyCalculation, selectedOutputs: readonly RequestedOutputId[]): readonly OutputRow[] {
  return selectedOutputs.map((outputId) => {
    const value = readOutputValue(result, outputId);
    const hasDisplayValue = typeof value === "number" && Number.isFinite(value);
    const boundary = result.acousticAnswerBoundary;
    const isNeedsInput = boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId);
    const isUnsupported = result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId);
    const isSupported = result.supportedTargetOutputs.includes(outputId);
    let status: OutputStatus = "pending";

    if (isNeedsInput) {
      status = "needs_input";
    } else if (isUnsupported) {
      status = "unsupported";
    } else if (isSupported && hasDisplayValue) {
      status = "live";
    }

    return {
      detail: getOutputDetail(result, outputId, status),
      label: outputId,
      status,
      value: status === "live" && hasDisplayValue ? formatDb(value) : "--"
    };
  });
}

function parseEstimateError(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }

  return "Estimate failed.";
}

function outputRequiresAirborneContext(outputId: RequestedOutputId): boolean {
  return outputId === "R'w" || outputId.startsWith("Dn");
}

function outputRequiresImpactContext(outputId: RequestedOutputId): boolean {
  return outputId.includes("'n") || outputId.startsWith("L'nT") || outputId === "CI" || outputId === "CI,50-2500";
}

function isImpactOutput(outputId: RequestedOutputId): boolean {
  return OUTPUT_OPTIONS.find((output) => output.id === outputId)?.group === "Impact";
}

function isAirborneCurveOutput(outputId: RequestedOutputId): boolean {
  const group = OUTPUT_OPTIONS.find((output) => output.id === outputId)?.group;
  return group === "Airborne" || group === "Spectrum";
}

function showAirborneContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.some(outputRequiresAirborneContext) ||
    missingPhysicalInputs.some((field: string) => field.includes("receivingRoom") || field.includes("panel"))
  );
}

function showBuildingPredictionContext(context: ContextDraft, result: AssemblyCalculation | null): boolean {
  return context.airborneMode === "building_prediction" || getMissingPhysicalInputs(result).some(isBuildingPredictionInput);
}

function showImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.some(outputRequiresImpactContext) ||
    missingPhysicalInputs.some((field: string) => field.includes("impactFieldContext"))
  );
}

function showFloorImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.includes("DeltaLw") ||
    missingPhysicalInputs.some((field: string) => field.includes("loadBasisKgM2") || field.includes("resilientLayerDynamicStiffnessMNm3"))
  );
}

function showWallTopologyContext(mode: StudyMode, context: ContextDraft, result: AssemblyCalculation | null): boolean {
  if (mode !== "wall") {
    return false;
  }

  return context.wallTopologyMode !== "auto" || getMissingPhysicalInputs(result).some(isWallTopologyInput);
}

function buildLayerVisualStyle(override: MaterialVisualOverride | undefined): ProfessionalLayerVisualStyle | undefined {
  if (!override) {
    return undefined;
  }

  const style: ProfessionalLayerVisualStyle = {};
  if (override.fillColor) style["--layer-fill"] = override.fillColor;
  if (override.sideColor) style["--layer-side"] = override.sideColor;
  if (override.strokeColor) style["--layer-stroke"] = override.strokeColor;
  if (override.patternColor) style["--layer-pattern"] = override.patternColor;

  return Object.keys(style).length ? style : undefined;
}

export function buildIllustrationLayers(
  layers: readonly DraftLayer[],
  mode: StudyMode,
  selectedLayerId: string | null,
  materialById: ReadonlyMap<string, MaterialDefinition>,
  visualOverrides: readonly MaterialVisualOverride[]
): ProfessionalLayerIllustrationLayer[] {
  return layers.map((layer) => {
    const material = getMaterialFromCatalog(layer.materialId, materialById);
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);
    const visualOverride = visualOverrides.find((override) => override.materialId === layer.materialId);

    return {
      active: layer.id === selectedLayerId,
      categoryLabel: material.category,
      id: layer.id,
      label: material.name,
      material,
      roleLabel: getRoleLabel(mode, layer.role),
      solverLabel: mode === "floor" ? "Floor role" : undefined,
      thicknessLabel: formatThickness(thicknessMm),
      thicknessMm,
      visualStyle: buildLayerVisualStyle(visualOverride)
    };
  });
}

function getPrimaryOutput(rows: readonly OutputRow[]): OutputRow | null {
  return rows.find((row) => row.status === "live") ?? rows[0] ?? null;
}

function buildReportSnapshot(input: {
  layers: readonly DraftLayer[];
  materialById: ReadonlyMap<string, MaterialDefinition>;
  mode: StudyMode;
  outputRows: readonly OutputRow[];
  projectName?: string;
  responseFigures: ReturnType<typeof buildWorkbenchResponseCurveFigures>;
  serverProjectId?: string;
  serverProjectScenarioId?: string;
}): SimpleWorkbenchProposalDocument {
  const issuedOn = new Date();
  const issuedOnIso = issuedOn.toISOString();
  const issuedOnLabel = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(issuedOn);
  const liveRows = input.outputRows.filter((row) => row.status === "live");
  const primary = liveRows[0] ?? input.outputRows[0] ?? {
    detail: "No live output is packaged.",
    label: "Status",
    status: "pending" as const,
    value: "Waiting"
  };
  const proposalLayers = input.layers.map((layer, index) => {
    const material = getMaterialFromCatalog(layer.materialId, input.materialById);
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);
    const density = material.densityKgM3;
    const surfaceMass = thicknessMm && density ? (density * thicknessMm) / 1000 : null;

    return {
      categoryLabel: material.category,
      densityLabel: density ? `${density} kg/m3` : undefined,
      index: index + 1,
      label: material.name,
      roleLabel: getRoleLabel(input.mode, layer.role),
      surfaceMassLabel: surfaceMass ? `${surfaceMass.toFixed(1)} kg/m2` : undefined,
      thicknessLabel: formatThickness(thicknessMm)
    };
  });
  const metrics = liveRows.length
    ? liveRows.map((row) => ({
        detail: row.detail,
        engineDisplayValue: row.value,
        label: row.label,
        outputId: row.label as RequestedOutputId,
        reportMetricId: row.label,
        value: row.value
      }))
    : [{ detail: "No live outputs yet.", label: primary.label, value: primary.value }];

  return {
    approverTitle: "Acoustic Consultant",
    assemblyHeadline: `${input.mode === "floor" ? "Floor" : "Wall"} build-up from calculator workbench`,
    assumptionItems: [
      {
        detail: "Report snapshot was packaged from the current calculator workbench state.",
        label: "Packaged workbench state",
        tone: "neutral"
      }
    ],
    briefNote: "",
    citations: [],
    clientName: "Client delivery team",
    consultantAddress: "Office address not entered",
    consultantCompany: "DYNECHO Acoustic Consulting",
    consultantEmail: "Contact email not entered",
    consultantLogoDataUrl: "",
    consultantPhone: "Contact phone not entered",
    consultantWordmarkLine: "Acoustic analysis report",
    contextLabel: "Calculator route",
    corridorDossierCards: [],
    corridorDossierHeadline: "No validation corridor package was added in this frontend handoff.",
    coverageItems: input.outputRows.map((row) => ({
      detail: row.detail,
      engineDisplayValue: row.value,
      label: row.label,
      nextStep: row.status === "needs_input" ? row.detail : undefined,
      outputId: row.label as RequestedOutputId,
      postureDetail: row.status === "live" ? "Calculated output row from the active estimate." : row.detail,
      postureLabel: row.status === "live" ? "Live" : row.status === "needs_input" ? "Needs input" : "Unsupported",
      postureTone: row.status === "live" ? "success" : row.status === "needs_input" ? "warning" : "neutral",
      reportMetricId: row.label,
      status: row.status === "live" ? "live" : row.status === "needs_input" ? "needs_input" : "unsupported",
      value: row.value
    })),
    decisionTrailHeadline: "Packaged from calculator handoff.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Result values are copied from the active calculator response without changing engine behavior.",
    dynamicBranchLabel: "Calculator estimate",
    executiveSummary: `${primary.label} ${primary.value} from the current ${input.mode} layer stack.`,
    issuedOnIso,
    issuedOnLabel,
    issueBaseReference: "DEC-2026-001",
    issueCodePrefix: "DEC",
    issueNextReference: "DEC-2026-002",
    issueRegisterItems: [],
    layers: proposalLayers,
    methodDossierCards: [],
    methodDossierHeadline: "No solver rationale package was added in this frontend handoff.",
    methodTraceGroups: [],
    metrics,
    preparedBy: "DAC Operator",
    primaryMetricLabel: primary.label,
    primaryMetricValue: primary.value,
    primaryMetricVisible: true,
    projectName: input.projectName?.trim() || "DAC Operator Deck",
    proposalAttention: "Design coordination team",
    proposalIssuePurpose: "Client review and acoustic coordination",
    proposalRecipient: "Client delivery team",
    proposalReference: "DEC-2026-001",
    proposalRevision: "Rev 00",
    proposalSubject: `${input.mode === "floor" ? "Floor" : "Wall"} acoustic analysis report`,
    proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    responseCurves: input.responseFigures,
    serverProjectId: input.serverProjectId,
    serverProjectScenarioId: input.serverProjectScenarioId,
    studyContextLabel: "Concept",
    studyModeLabel: input.mode === "floor" ? "Floor" : "Wall",
    validationDetail: "Calculation basis is limited to the selected build-up and requested outputs.",
    validationLabel: primary.status === "live" ? "Calculated estimate" : "Review required",
    warnings: []
  };
}

function storeReportSnapshot(
  document: SimpleWorkbenchProposalDocument,
  projectContext?: SimpleWorkbenchProposalPreviewProjectContext
): void {
  storeSimpleWorkbenchProposalPreview(document, {
    projectContext
  });
}

function readStoredMaterialEditorState(): MaterialEditorPersistedStateParseResult {
  if (typeof window === "undefined") {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(MATERIAL_EDITOR_STORAGE_KEY);
  } catch {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  if (!raw) {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  try {
    return parseMaterialEditorPersistedState(JSON.parse(raw) as unknown);
  } catch {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: true,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }
}

function formatMaterialEditorRestoreWarning(result: MaterialEditorPersistedStateParseResult): string | null {
  const details: string[] = [];

  if (result.malformed) {
    details.push("stored data could not be parsed");
  }

  if (result.droppedCustomMaterials) {
    details.push(`${result.droppedCustomMaterials} invalid material${result.droppedCustomMaterials === 1 ? "" : "s"} ignored`);
  }

  if (result.droppedVisualOverrides) {
    details.push(`${result.droppedVisualOverrides} invalid appearance override${result.droppedVisualOverrides === 1 ? "" : "s"} ignored`);
  }

  return details.length ? details.join("; ") : null;
}

function storeMaterialEditorState(input: {
  customMaterials: readonly MaterialDefinition[];
  materialVisualOverrides: readonly MaterialVisualOverride[];
}): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!input.customMaterials.length && !input.materialVisualOverrides.length) {
    try {
      window.localStorage.removeItem(MATERIAL_EDITOR_STORAGE_KEY);
    } catch {
      // Persistence is best-effort; the workbench remains usable without storage.
    }
    return;
  }

  try {
    window.localStorage.setItem(
      MATERIAL_EDITOR_STORAGE_KEY,
      serializeMaterialEditorPersistedState({
        customMaterials: [...input.customMaterials],
        materialVisualOverrides: [...input.materialVisualOverrides]
      })
    );
  } catch {
    // Persistence is best-effort; the workbench remains usable without storage.
  }
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readServerProjectError(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (isObjectRecord(payload) && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Keep the caller's fallback when the response body is not JSON.
  }

  return fallback;
}

function parseServerProjectSummaries(value: unknown): ServerProjectSummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.projects)) {
    return [];
  }

  return value.projects.filter(
    (project): project is ServerProjectSummaryPayload =>
      isObjectRecord(project) &&
      typeof project.assemblyCount === "number" &&
      typeof project.id === "string" &&
      typeof project.name === "string" &&
      typeof project.ownerLabel === "string" &&
      typeof project.reportCount === "number" &&
      typeof project.scenarioCount === "number" &&
      typeof project.updatedAtIso === "string"
  );
}

function parseAssemblySummary(value: unknown): ServerProjectAssemblySummaryPayload | null {
  if (
    !isObjectRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    (value.kind !== "floor" && value.kind !== "wall") ||
    typeof value.updatedAtIso !== "string" ||
    typeof value.version !== "number"
  ) {
    return null;
  }

  return {
    calculationSummary: parseAssemblyCalculationSummary(value.calculationSummary),
    description: typeof value.description === "string" ? value.description : undefined,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    kind: value.kind,
    name: value.name,
    updatedAtIso: value.updatedAtIso,
    version: value.version
  };
}

function parseAssemblyCalculationSummary(value: unknown): ServerProjectAssemblySummaryPayload["calculationSummary"] {
  if (
    !isObjectRecord(value) ||
    (value.status !== "ready" && value.status !== "needs_input" && value.status !== "unsupported" && value.status !== "error") ||
    !Array.isArray(value.selectedOutputs)
  ) {
    return undefined;
  }

  return {
    primaryOutput: typeof value.primaryOutput === "string" ? value.primaryOutput : undefined,
    primaryValueLabel: typeof value.primaryValueLabel === "string" ? value.primaryValueLabel : undefined,
    selectedOutputs: value.selectedOutputs.filter((entry): entry is string => typeof entry === "string"),
    status: value.status
  };
}

function parseProjectAssemblySummaries(value: unknown): ServerProjectAssemblySummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.assemblies)) {
    return [];
  }

  return value.assemblies
    .map((assembly) => parseAssemblySummary(assembly))
    .filter((assembly): assembly is ServerProjectAssemblySummaryPayload => assembly !== null);
}

function parseProjectAssemblyRecord(value: unknown): ServerProjectAssemblyRecordPayload | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const summary = parseAssemblySummary(value.assembly);
  if (!summary || !isObjectRecord(value.assembly) || !("snapshot" in value.assembly)) {
    return null;
  }

  return {
    ...summary,
    snapshot: value.assembly.snapshot
  };
}

function parseReportSummary(value: unknown): ServerProjectReportSummaryPayload | null {
  if (
    !isObjectRecord(value) ||
    typeof value.assemblyId !== "string" ||
    typeof value.currentRevisionId !== "string" ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.revisionCount !== "number" ||
    typeof value.sourceAssemblyVersion !== "number" ||
    (value.status !== "archived" && value.status !== "draft" && value.status !== "issued") ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  return {
    assemblyId: value.assemblyId,
    currentRevisionId: value.currentRevisionId,
    description: typeof value.description === "string" ? value.description : undefined,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    name: value.name,
    revisionCount: value.revisionCount,
    sourceAssemblyVersion: value.sourceAssemblyVersion,
    status: value.status,
    updatedAtIso: value.updatedAtIso
  };
}

function parseProjectReportSummaries(value: unknown): ServerProjectReportSummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.reports)) {
    return [];
  }

  return value.reports
    .map((report) => parseReportSummary(report))
    .filter((report): report is ServerProjectReportSummaryPayload => report !== null);
}

function parseReportMaterialSnapshot(value: unknown): ServerProjectReportRecordPayload["sourceMaterialSnapshot"] | null {
  if (!isObjectRecord(value) || !Array.isArray(value.customMaterials) || !Array.isArray(value.materialVisualOverrides)) {
    return null;
  }

  return {
    customMaterials: [...value.customMaterials],
    materialVisualOverrides: [...value.materialVisualOverrides]
  };
}

function parseProjectReportRecord(value: unknown): ServerProjectReportRecordPayload | null {
  if (!isObjectRecord(value) || !isObjectRecord(value.report)) {
    return null;
  }

  const summary = parseReportSummary({
    assemblyId: value.report.assemblyId,
    currentRevisionId: value.report.currentRevisionId,
    displayCode: value.report.displayCode,
    id: value.report.id,
    name: value.report.name,
    revisionCount: Array.isArray(value.report.revisions) ? value.report.revisions.length : undefined,
    sourceAssemblyVersion: value.report.sourceAssemblyVersion,
    status: value.report.status,
    updatedAtIso: value.report.updatedAtIso
  });
  const reportDocument = parseSimpleWorkbenchProposalDocument(value.report.reportDocument);
  const sourceMaterialSnapshot = parseReportMaterialSnapshot(value.report.sourceMaterialSnapshot);

  if (!summary || !reportDocument || !sourceMaterialSnapshot || !("sourceAssemblySnapshot" in value.report)) {
    return null;
  }

  return {
    ...summary,
    reportDocument,
    sourceAssemblySnapshot: value.report.sourceAssemblySnapshot,
    sourceCalculationOutput: Object.hasOwn(value.report, "sourceCalculationOutput") ? value.report.sourceCalculationOutput : undefined,
    sourceMaterialSnapshot
  };
}

function formatWorkbenchV2SnapshotRestoreWarning(input: {
  droppedCustomMaterials: number;
  droppedVisualOverrides: number;
}): string | null {
  const details: string[] = [];

  if (input.droppedCustomMaterials) {
    details.push(`${input.droppedCustomMaterials} invalid material${input.droppedCustomMaterials === 1 ? "" : "s"} ignored`);
  }

  if (input.droppedVisualOverrides) {
    details.push(`${input.droppedVisualOverrides} invalid appearance override${input.droppedVisualOverrides === 1 ? "" : "s"} ignored`);
  }

  return details.length ? details.join("; ") : null;
}

export function CalculatorWorkbench() {
  const [customMaterials, setCustomMaterials] = useState<readonly MaterialDefinition[]>([]);
  const [materialVisualOverrides, setMaterialVisualOverrides] = useState<readonly MaterialVisualOverride[]>([]);
  const [materialEditorStoreLoaded, setMaterialEditorStoreLoaded] = useState(false);
  const [materialEditorRestoreWarning, setMaterialEditorRestoreWarning] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyMode>("wall");
  const [layers, setLayers] = useState<readonly DraftLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(INITIAL_LAYERS[0]!.id);
  const [selectedOutputs, setSelectedOutputs] = useState<readonly RequestedOutputId[]>(["Rw"]);
  const [context, setContext] = useState<ContextDraft>(INITIAL_CONTEXT);
  const [estimateState, setEstimateState] = useState<EstimateState>({ status: "idle" });
  const [materialSearch, setMaterialSearch] = useState<Record<string, string>>({});
  const [openMaterialLayerId, setOpenMaterialLayerId] = useState<string | null>(null);
  const [materialEditorOpen, setMaterialEditorOpen] = useState(false);
  const [materialEditorMaterialId, setMaterialEditorMaterialId] = useState<string | null>(INITIAL_LAYERS[0]?.materialId ?? null);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [layerDropTarget, setLayerDropTarget] = useState<LayerDropTarget | null>(null);
  const [layerUndoStack, setLayerUndoStack] = useState<LayerStackUndoStack>([]);
  const [serverProjects, setServerProjects] = useState<ServerProjectSummaryPayload[]>([]);
  const [selectedServerProjectId, setSelectedServerProjectId] = useState("");
  const [serverProjectNameDraft, setServerProjectNameDraft] = useState("");
  const serverProjectNameDraftRef = useRef(serverProjectNameDraft);
  const [serverProjectAssemblies, setServerProjectAssemblies] = useState<ServerProjectAssemblySummaryPayload[]>([]);
  const [selectedServerAssemblyId, setSelectedServerAssemblyId] = useState("");
  const [serverAssemblyNameDraft, setServerAssemblyNameDraft] = useState("");
  const serverAssemblyNameDraftRef = useRef(serverAssemblyNameDraft);
  const [serverAssemblyDescriptionDraft, setServerAssemblyDescriptionDraft] = useState("");
  const serverAssemblyDescriptionDraftRef = useRef(serverAssemblyDescriptionDraft);
  const [serverAssemblyRenameDraft, setServerAssemblyRenameDraft] = useState("");
  const serverAssemblyRenameDraftRef = useRef(serverAssemblyRenameDraft);
  const [serverAssemblyRenameDescriptionDraft, setServerAssemblyRenameDescriptionDraft] = useState("");
  const serverAssemblyRenameDescriptionDraftRef = useRef(serverAssemblyRenameDescriptionDraft);
  const [serverProjectReports, setServerProjectReports] = useState<ServerProjectReportSummaryPayload[]>([]);
  const [selectedServerReportId, setSelectedServerReportId] = useState("");
  const [serverReportRenameDraft, setServerReportRenameDraft] = useState("");
  const serverReportRenameDraftRef = useRef(serverReportRenameDraft);
  const [serverReportDescriptionDraft, setServerReportDescriptionDraft] = useState("");
  const serverReportDescriptionDraftRef = useRef(serverReportDescriptionDraft);
  const [serverProjectStatus, setServerProjectStatus] = useState<ServerProjectStatus>("idle");
  const [serverProjectMessage, setServerProjectMessage] = useState("Browser-local draft");
  const [projectWorkspaceOpen, setProjectWorkspaceOpen] = useState(false);
  const serverProjectMutationInFlightRef = useRef(false);

  const materials = useMemo(() => buildResolvedMaterialCatalog(customMaterials), [customMaterials]);
  const materialById = useMemo(() => new Map(materials.map((material) => [material.id, material])), [materials]);
  const estimateResult = estimateState.status === "ready" ? estimateState.result : null;
  const availableOutputs = OUTPUT_OPTIONS.filter((output) => output.modes.includes(mode));
  const outputRows = estimateResult ? buildOutputRows(estimateResult, selectedOutputs) : [];
  const primaryOutput = getPrimaryOutput(outputRows);
  const remoteTasks = getRemoteTasks(estimateResult);
  const localTasks = buildLocalTasks(layers, selectedOutputs, materialById);
  const routeInputTaskElementIds = new Set(remoteTasks.map((task) => task.targetElementId).filter((id): id is string => Boolean(id)));
  const requiredTasks = [...localTasks, ...remoteTasks.filter((task) => !task.targetElementId || !routeInputTaskElementIds.has(task.targetElementId))];
  const responseFigures = buildWorkbenchResponseCurveFigures(estimateResult);
  const selectedImpactOutputs = selectedOutputs.some(isImpactOutput);
  const selectedAirborneCurveOutputs = selectedOutputs.some(isAirborneCurveOutput);
  const visibleResponseFigures = responseFigures.filter((figure) => {
    if (figure.id === "impact") {
      return selectedImpactOutputs;
    }

    return selectedAirborneCurveOutputs;
  });
  const missingSelectedImpactCurve =
    estimateState.status === "ready" && selectedImpactOutputs && !responseFigures.some((figure) => figure.id === "impact");
  const missingSelectedAirborneCurve =
    estimateState.status === "ready" && selectedAirborneCurveOutputs && !responseFigures.some((figure) => figure.id === "airborne");
  const illustrationLayers = useMemo(
    () => buildIllustrationLayers(layers, mode, selectedLayerId, materialById, materialVisualOverrides),
    [layers, materialById, materialVisualOverrides, mode, selectedLayerId]
  );
  const totalThickness = layers.reduce((sum, layer) => sum + (parsePositiveNumber(layer.thicknessMm) ?? 0), 0);
  const canOpenReport = outputRows.some((row) => row.status === "live");
  const needsAirborne = showAirborneContext(selectedOutputs, estimateResult);
  const needsBuildingPrediction = showBuildingPredictionContext(context, estimateResult);
  const needsImpact = mode === "floor" && showImpactContext(selectedOutputs, estimateResult);
  const needsFloorImpact = mode === "floor" && showFloorImpactContext(selectedOutputs, estimateResult);
  const needsWallTopology = showWallTopologyContext(mode, context, estimateResult);
  const isRouteInputMissing = (inputId: string) => routeInputTaskElementIds.has(inputId);
  const canUndoLayerStack = layerUndoStack.length > 0;
  const lastLayerUndoActionLabel = layerUndoStack[layerUndoStack.length - 1]?.actionLabel;
  const undoLayerStackActionLabel = lastLayerUndoActionLabel ? `Undo ${lastLayerUndoActionLabel}` : "Undo layer change";
  const undoLayerStackTitle = canUndoLayerStack ? undoLayerStackActionLabel : "No layer changes to undo";
  const selectedServerProject = serverProjects.find((project) => project.id === selectedServerProjectId) ?? null;
  const selectedServerAssembly = serverProjectAssemblies.find((assembly) => assembly.id === selectedServerAssemblyId) ?? null;
  const selectedServerReport = serverProjectReports.find((report) => report.id === selectedServerReportId) ?? null;
  const serverProjectBusy =
    serverProjectStatus === "loading" || serverProjectStatus === "syncing" || serverProjectStatus === "restoring";
  const canCreateServerProject = !serverProjectBusy;
  const canRenameServerAssembly = Boolean(selectedServerProjectId && selectedServerAssembly) && !serverProjectBusy;
  const canRenameServerReport = Boolean(selectedServerProjectId && selectedServerReport) && !serverProjectBusy;
  const projectWorkspaceTriggerStatus = selectedServerProject?.name ?? "No project";

  useEffect(() => {
    const restored = readStoredMaterialEditorState();

    setCustomMaterials(restored.state.customMaterials);
    setMaterialVisualOverrides(restored.state.materialVisualOverrides);
    setMaterialEditorRestoreWarning(formatMaterialEditorRestoreWarning(restored));
    setMaterialEditorStoreLoaded(true);
  }, []);

  useEffect(() => {
    if (!materialEditorStoreLoaded) {
      return;
    }

    storeMaterialEditorState({
      customMaterials,
      materialVisualOverrides
    });
  }, [customMaterials, materialEditorStoreLoaded, materialVisualOverrides]);

  useEffect(() => {
    void refreshServerProjects({ silent: true });
    // Server project discovery is a persistence affordance; the initial read
    // intentionally runs once per mounted workbench.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const nextName = selectedServerAssembly?.name ?? "";
    const nextDescription = selectedServerAssembly?.description ?? "";
    serverAssemblyRenameDraftRef.current = nextName;
    serverAssemblyRenameDescriptionDraftRef.current = nextDescription;
    setServerAssemblyRenameDraft(nextName);
    setServerAssemblyRenameDescriptionDraft(nextDescription);
  }, [selectedServerAssembly?.description, selectedServerAssembly?.id, selectedServerAssembly?.name]);

  useEffect(() => {
    const nextName = selectedServerReport?.name ?? "";
    const nextDescription = selectedServerReport?.description ?? "";
    serverReportRenameDraftRef.current = nextName;
    serverReportDescriptionDraftRef.current = nextDescription;
    setServerReportRenameDraft(nextName);
    setServerReportDescriptionDraft(nextDescription);
  }, [selectedServerReport?.description, selectedServerReport?.id, selectedServerReport?.name]);

  useEffect(() => {
    if (!selectedServerProjectId) {
      setServerProjectAssemblies([]);
      setSelectedServerAssemblyId("");
      setServerProjectReports([]);
      setSelectedServerReportId("");
      serverAssemblyRenameDraftRef.current = "";
      serverAssemblyRenameDescriptionDraftRef.current = "";
      serverReportRenameDraftRef.current = "";
      serverReportDescriptionDraftRef.current = "";
      setServerAssemblyRenameDraft("");
      setServerAssemblyRenameDescriptionDraft("");
      setServerReportRenameDraft("");
      setServerReportDescriptionDraft("");
      return;
    }

    void refreshServerProjectAssemblies(selectedServerProjectId, { silent: true });
    void refreshServerProjectReports(selectedServerProjectId, { silent: true });
    // Child record discovery follows the active project; the helpers update
    // project state and selected record guards internally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServerProjectId]);

  useEffect(() => {
    if (openMaterialLayerId && !layers.some((layer) => layer.id === openMaterialLayerId)) {
      setOpenMaterialLayerId(null);
    }
  }, [layers, openMaterialLayerId]);

  useEffect(() => {
    if (!draggedLayerId) {
      return;
    }

    const activeDraggedLayerId = draggedLayerId;

    function handleMouseMove(event: globalThis.MouseEvent) {
      setLayerDropTarget(getLayerDropTargetFromPoint(event.clientX, event.clientY, activeDraggedLayerId));
    }

    function handleMouseUp(event: globalThis.MouseEvent) {
      const target = getLayerDropTargetFromPoint(event.clientX, event.clientY, activeDraggedLayerId);

      if (target) {
        moveLayerToTarget(activeDraggedLayerId, target.layerId, target.position);
      }

      setDraggedLayerId(null);
      setLayerDropTarget(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // Drag listeners intentionally capture the active layer id for the current
    // drag gesture; recreating them for every layer mutation interrupts drag/drop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedLayerId]);

  useEffect(() => {
    const tasks = buildLocalTasks(layers, selectedOutputs, materialById);

    if (tasks.length) {
      setEstimateState({ reasons: tasks, status: "blocked" });
      return;
    }

    const payload = buildEstimatePayload(mode, layers, selectedOutputs, context, customMaterials);

    if (!payload) {
      setEstimateState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setEstimateState({ status: "loading" });

      async function estimate() {
        try {
          const response = await fetch("/api/estimate", {
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            signal: controller.signal
          });
          const data = (await response.json()) as unknown;

          if (!response.ok) {
            setEstimateState({ message: parseEstimateError(data), status: "error" });
            return;
          }

          if (typeof data === "object" && data !== null && "result" in data) {
            setEstimateState({ result: (data as { result: AssemblyCalculation }).result, status: "ready" });
            return;
          }

          setEstimateState({ message: "Estimate response is missing result.", status: "error" });
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }

          setEstimateState({
            message: error instanceof Error ? error.message : "Estimate failed.",
            status: "error"
          });
        }
      }

      void estimate();
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [context, customMaterials, layers, materialById, mode, selectedOutputs]);

  function updateContext(patch: Partial<ContextDraft>) {
    setContext((current) => ({ ...current, ...patch }));
  }

  function updateWallTopologyContext(patch: Partial<ContextDraft>) {
    setContext((current) => ({
      ...current,
      wallTopologyMode: current.wallTopologyMode === "auto" ? "double_leaf_framed" : current.wallTopologyMode,
      ...patch
    }));
  }

  function applyLayerRoleTopology() {
    const sideA = getLayerIndicesByRole(layers, "side_a");
    const cavity = getLayerIndicesByRole(layers, "cavity");
    const sideB = getLayerIndicesByRole(layers, "side_b");
    const cavityDepthMm = getLayerThicknessSum(layers, cavity);

    setContext((current) => ({
      ...current,
      wallCavity1AbsorptionClass: inferCavityAbsorptionClass(layers, cavity, materialById),
      wallCavity1DepthMm: cavityDepthMm ? String(cavityDepthMm) : current.wallCavity1DepthMm,
      wallCavity1FillCoverage: inferCavityFillCoverage(layers, cavity, materialById),
      wallCavity1LayerIndices: formatLayerIndexList(cavity),
      wallSideALeafLayerIndices: formatLayerIndexList(sideA),
      wallSideBLeafLayerIndices: formatLayerIndexList(sideB),
      wallTopologyMode: "double_leaf_framed"
    }));
  }

  function clearLayerInteractionState() {
    setOpenMaterialLayerId(null);
    setMaterialSearch({});
    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  async function refreshServerProjects(options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading projects");
    }

    try {
      const response = await fetch("/api/projects", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load server projects."));
      }

      const payload = (await response.json()) as unknown;
      const projects = parseServerProjectSummaries(payload);
      setServerProjects(projects);

      if (selectedServerProjectId && !projects.some((project) => project.id === selectedServerProjectId)) {
        setSelectedServerProjectId("");
        setServerProjectAssemblies([]);
        setSelectedServerAssemblyId("");
        setServerProjectReports([]);
        setSelectedServerReportId("");
        serverAssemblyRenameDraftRef.current = "";
        serverAssemblyRenameDescriptionDraftRef.current = "";
        serverReportRenameDraftRef.current = "";
        serverReportDescriptionDraftRef.current = "";
        setServerAssemblyRenameDraft("");
        setServerAssemblyRenameDescriptionDraft("");
        setServerReportRenameDraft("");
        setServerReportDescriptionDraft("");
      }

      if (!options?.preserveMessage) {
        setServerProjectStatus("idle");
        setServerProjectMessage(projects.length ? `${projects.length} project${projects.length === 1 ? "" : "s"}` : "Browser-local draft");
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Server project list failed");
    }
  }

  async function refreshServerProjectAssemblies(projectId: string, options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading saved combinations");
    }

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/assemblies`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load saved combinations."));
      }

      const payload = (await response.json()) as unknown;
      const assemblies = parseProjectAssemblySummaries(payload);
      setServerProjectAssemblies(assemblies);

      if (selectedServerAssemblyId && !assemblies.some((assembly) => assembly.id === selectedServerAssemblyId)) {
        setSelectedServerAssemblyId("");
      }

      if (!options?.preserveMessage && !options?.silent) {
        setServerProjectStatus("idle");
        setServerProjectMessage(
          assemblies.length ? `${assemblies.length} saved combination${assemblies.length === 1 ? "" : "s"}` : "No saved combinations"
        );
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved combination list failed");
    }
  }

  async function refreshServerProjectReports(projectId: string, options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading saved reports");
    }

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/reports`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load saved reports."));
      }

      const payload = (await response.json()) as unknown;
      const reports = parseProjectReportSummaries(payload);
      setServerProjectReports(reports);

      if (selectedServerReportId && !reports.some((report) => report.id === selectedServerReportId)) {
        setSelectedServerReportId("");
      }

      if (!options?.preserveMessage && !options?.silent) {
        setServerProjectStatus("idle");
        setServerProjectMessage(reports.length ? `${reports.length} saved report${reports.length === 1 ? "" : "s"}` : "No saved reports");
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved report list failed");
    }
  }

  function buildCurrentWorkbenchV2ServerSnapshot(name?: string) {
    const savedAtIso = new Date().toISOString();

    return buildWorkbenchV2ProjectSnapshot({
      context,
      customMaterials,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `workbench-v2-${Date.now()}`,
      layers,
      materialVisualOverrides,
      mode,
      name: name?.trim() || `${mode === "wall" ? "Wall" : "Floor"} saved combination`,
      savedAtIso,
      selectedLayerId,
      selectedOutputs
    });
  }

  function beginServerProjectMutation(): boolean {
    if (serverProjectMutationInFlightRef.current) {
      return false;
    }

    serverProjectMutationInFlightRef.current = true;
    return true;
  }

  function finishServerProjectMutation() {
    serverProjectMutationInFlightRef.current = false;
  }

  function buildAssemblyCalculationSummary() {
    const selectedOutputLabels = selectedOutputs.map((output) => output);

    if (estimateState.status === "ready" && primaryOutput) {
      return {
        primaryOutput: primaryOutput.label,
        primaryValueLabel: primaryOutput.value,
        selectedOutputs: selectedOutputLabels,
        status: "ready" as const
      };
    }

    return {
      selectedOutputs: selectedOutputLabels,
      status: estimateState.status === "blocked" ? ("needs_input" as const) : estimateState.status === "error" ? ("error" as const) : ("unsupported" as const)
    };
  }

  async function createServerProject() {
    const projectName = serverProjectNameDraftRef.current.trim();
    if (!projectName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a project name first");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Creating project");

    try {
      const response = await fetch("/api/projects", {
        body: JSON.stringify({
          name: projectName
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not create the project."));
      }

      const payload = (await response.json()) as unknown;
      const project = isObjectRecord(payload) && isObjectRecord(payload.project) && typeof payload.project.id === "string"
        ? {
            id: payload.project.id
          }
        : null;

      if (!project) {
        throw new Error("DAC created the project but the server response was incomplete.");
      }

      setSelectedServerProjectId(project.id);
      setSelectedServerAssemblyId("");
      setSelectedServerReportId("");
      setServerProjectAssemblies([]);
      setServerProjectReports([]);
      serverProjectNameDraftRef.current = "";
      setServerProjectNameDraft("");
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Project created");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Project create failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function saveCurrentAssemblyToServerProject() {
    if (!selectedServerProjectId) {
      setServerProjectStatus("error");
      setServerProjectMessage("Create or select a project first");
      return;
    }

    const assemblyName = serverAssemblyNameDraftRef.current.trim() || `${mode === "wall" ? "Wall" : "Floor"} saved combination`;
    const assemblyDescription = serverAssemblyDescriptionDraftRef.current.trim();
    const snapshot = buildCurrentWorkbenchV2ServerSnapshot(assemblyName);
    if (!beginServerProjectMutation()) {
      return;
    }
    setServerProjectStatus("syncing");
    setServerProjectMessage("Saving combination");

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies`, {
        body: JSON.stringify({
          calculationSummary: buildAssemblyCalculationSummary(),
          description: assemblyDescription || undefined,
          kind: mode,
          name: assemblyName,
          snapshot
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not save the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC saved the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      serverAssemblyNameDraftRef.current = "";
      setServerAssemblyNameDraft("");
      serverAssemblyDescriptionDraftRef.current = "";
      setServerAssemblyDescriptionDraft("");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Saved combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination save failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function renameSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }

    const nextName = serverAssemblyRenameDraftRef.current.trim();
    if (!nextName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a combination name first");
      return;
    }
    const nextDescription = serverAssemblyRenameDescriptionDraftRef.current.trim();
    const currentDescription = selectedServerAssembly.description ?? "";
    if (nextName === selectedServerAssembly.name && nextDescription === currentDescription) {
      setServerProjectMessage("Combination details unchanged");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Renaming combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}`,
        {
          body: JSON.stringify({
            description: nextDescription || undefined,
            name: nextName
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not rename the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC renamed the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      serverAssemblyRenameDescriptionDraftRef.current = assembly.description ?? "";
      setServerAssemblyRenameDescriptionDraft(assembly.description ?? "");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Updated combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination rename failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function duplicateSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Duplicating combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}/duplicate`,
        {
          body: JSON.stringify({}),
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not duplicate the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC duplicated the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Duplicated combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination duplicate failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function deleteSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }
    if (!window.confirm(`Delete "${selectedServerAssembly.name}" from this project? Reports linked to a combination must be deleted first.`)) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Deleting combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not delete the combination."));
      }

      setSelectedServerAssemblyId("");
      serverAssemblyRenameDraftRef.current = "";
      serverAssemblyRenameDescriptionDraftRef.current = "";
      setServerAssemblyRenameDraft("");
      setServerAssemblyRenameDescriptionDraft("");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Deleted combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination delete failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function loadSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssemblyId) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("restoring");
    setServerProjectMessage("Loading saved combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssemblyId)}`,
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load the selected combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      const parsed = assembly ? parseWorkbenchV2ProjectSnapshot(assembly.snapshot) : null;

      if (!assembly || !parsed?.snapshot) {
        throw new Error("Selected combination does not contain a restorable workbench v2 snapshot.");
      }

      restoreWorkbenchV2Snapshot(parsed);
      setSelectedServerAssemblyId(assembly.id);
      setServerProjectStatus("idle");
      setServerProjectMessage("Loaded saved combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved combination load failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function openSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReportId) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("restoring");
    setServerProjectMessage("Opening saved report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReportId)}`,
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not open the selected report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("Selected report does not contain a restorable proposal document.");
      }

      storeReportSnapshot(
        {
          ...report.reportDocument,
          serverProjectId: selectedServerProjectId,
          serverProjectScenarioId: report.assemblyId
        },
        {
          serverProjectAssemblyId: report.assemblyId,
          serverProjectId: selectedServerProjectId,
          serverProjectReportId: report.id,
          serverProjectReportUpdatedAtIso: report.updatedAtIso,
          sourceAssemblySnapshot: report.sourceAssemblySnapshot,
          sourceCalculationOutput: report.sourceCalculationOutput,
          sourceMaterialSnapshot: report.sourceMaterialSnapshot
        }
      );

      setServerProjectStatus("idle");
      setServerProjectMessage("Opened saved report");
      window.location.assign(
        `/workbench/proposal?projectId=${encodeURIComponent(selectedServerProjectId)}&reportId=${encodeURIComponent(report.id)}`
      );
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved report open failed");
      finishServerProjectMutation();
    }
  }

  async function renameSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }

    const nextName = serverReportRenameDraftRef.current.trim();
    const nextDescription = serverReportDescriptionDraftRef.current.trim();
    const currentDescription = selectedServerReport.description ?? "";
    if (!nextName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a report name first");
      return;
    }
    if (nextName === selectedServerReport.name && nextDescription === currentDescription) {
      setServerProjectMessage("Report details unchanged");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Renaming report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          body: JSON.stringify({
            description: nextDescription || undefined,
            expectedReportUpdatedAtIso: selectedServerReport.updatedAtIso,
            name: nextName
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not rename the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC renamed the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      serverReportDescriptionDraftRef.current = report.description ?? "";
      setServerReportDescriptionDraft(report.description ?? "");
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Updated report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report rename failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function duplicateSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Duplicating report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}/duplicate`,
        {
          body: JSON.stringify({}),
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not duplicate the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC duplicated the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Duplicated report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report duplicate failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function setSelectedProjectReportArchived(archived: boolean) {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage(archived ? "Archiving report" : "Restoring report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          body: JSON.stringify({
            expectedReportUpdatedAtIso: selectedServerReport.updatedAtIso,
            status: archived ? "archived" : "draft"
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, archived ? "DAC could not archive the report." : "DAC could not restore the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC updated the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage(archived ? "Archived report" : "Restored report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : archived ? "Report archive failed" : "Report restore failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function deleteSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!window.confirm(`Delete "${selectedServerReport.name}" and all of its revisions from this project?`)) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Deleting report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not delete the report."));
      }

      setSelectedServerReportId("");
      serverReportRenameDraftRef.current = "";
      serverReportDescriptionDraftRef.current = "";
      setServerReportRenameDraft("");
      setServerReportDescriptionDraft("");
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Deleted report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report delete failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  function restoreWorkbenchV2Snapshot(parsed: ReturnType<typeof parseWorkbenchV2ProjectSnapshot>) {
    if (!parsed.snapshot) {
      return;
    }

    const snapshot = parsed.snapshot;
    setMode(snapshot.mode);
    setLayers(snapshot.layers);
    setSelectedLayerId(snapshot.selectedLayerId);
    setSelectedOutputs(snapshot.selectedOutputs);
    setContext(snapshot.context);
    setCustomMaterials(snapshot.customMaterials);
    setMaterialVisualOverrides(snapshot.materialVisualOverrides);
    setMaterialEditorRestoreWarning(formatWorkbenchV2SnapshotRestoreWarning(parsed));
    setMaterialEditorMaterialId(snapshot.layers.find((layer) => layer.id === snapshot.selectedLayerId)?.materialId ?? snapshot.layers[0]?.materialId ?? null);
    setMaterialEditorOpen(false);
    setLayerUndoStack([]);
    clearLayerInteractionState();
  }

  function commitLayerStackChange(
    actionLabel: string,
    buildChange: (
      currentLayers: readonly DraftLayer[],
      currentSelectedLayerId: string | null
    ) => { layers: readonly DraftLayer[]; selectedLayerId?: string | null } | null
  ): boolean {
    const change = buildChange(layers, selectedLayerId);

    if (!change) {
      return false;
    }

    const nextSelectedLayerId = change.selectedLayerId === undefined ? selectedLayerId : change.selectedLayerId;

    if (nextSelectedLayerId === selectedLayerId && layerStacksEqual(layers, change.layers)) {
      return false;
    }

    setLayerUndoStack((current) => pushLayerStackUndoSnapshot(current, createLayerStackUndoSnapshot(layers, selectedLayerId, actionLabel)));
    setLayers(change.layers);
    setSelectedLayerId(nextSelectedLayerId);
    return true;
  }

  function undoLayerStackChange() {
    const popped = popLayerStackUndoSnapshot(layerUndoStack);

    if (!popped) {
      return;
    }

    const restored = restoreLayerStackUndoSnapshot(popped.snapshot);

    setLayerUndoStack(popped.stack);
    setLayers(restored.layers);
    setSelectedLayerId(restored.selectedLayerId);
    clearLayerInteractionState();

    if (popped.snapshot.actionLabel) {
      toast.success("Layer change undone", { description: `Reverted ${popped.snapshot.actionLabel}.` });
      return;
    }

    toast.success("Layer change undone");
  }

  function setModeWithDefaults(nextMode: StudyMode) {
    if (nextMode === mode) {
      return;
    }

    const nextLayers =
      nextMode === "floor" && matchesStarterStack(layers, INITIAL_WALL_LAYERS)
        ? cloneLayers(INITIAL_FLOOR_LAYERS)
        : nextMode === "wall" && matchesStarterStack(layers, INITIAL_FLOOR_LAYERS)
          ? cloneLayers(INITIAL_WALL_LAYERS)
          : migrateLayerRoles(layers, nextMode, materialById, materials);
    const nextSelectedLayerId = nextLayers.some((layer) => layer.id === selectedLayerId) ? selectedLayerId : nextLayers[0]?.id ?? null;

    setMode(nextMode);
    setSelectedOutputs(nextMode === "floor" ? ["Ln,w"] : ["Rw"]);
    setLayers(nextLayers);
    setSelectedLayerId(nextSelectedLayerId);
    setLayerUndoStack([]);
    clearLayerInteractionState();
  }

  function updateLayerWithUndo(actionLabel: string, layerId: string, patch: Partial<DraftLayer>, nextSelectedLayerId?: string | null): boolean {
    return commitLayerStackChange(actionLabel, (currentLayers, currentSelectedLayerId) => ({
      layers: currentLayers.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)),
      selectedLayerId: nextSelectedLayerId === undefined ? currentSelectedLayerId : nextSelectedLayerId
    }));
  }

  function addLayer() {
    const id = createLayerId();
    const role = getRoleOptions(mode)[Math.min(layers.length, getRoleOptions(mode).length - 1)]!.value;
    const layer: DraftLayer = {
      id,
      materialId: getDefaultMaterialId(mode, materialById, materials),
      role,
      thicknessMm: ""
    };

    commitLayerStackChange("adding a layer", (currentLayers) => ({
      layers: [...currentLayers, layer],
      selectedLayerId: id
    }));
  }

  function duplicateLayer(layerId: string) {
    const duplicateId = createLayerId();

    commitLayerStackChange("duplicating a layer", (currentLayers) => {
      const index = currentLayers.findIndex((layer) => layer.id === layerId);
      const source = currentLayers[index];

      if (!source) {
        return null;
      }

      const duplicate = { ...source, id: duplicateId };
      const next = [...currentLayers];
      next.splice(index + 1, 0, duplicate);

      return {
        layers: next,
        selectedLayerId: duplicate.id
      };
    });
  }

  function removeLayer(layerId: string) {
    commitLayerStackChange("removing a layer", (currentLayers, currentSelectedLayerId) => {
      if (!currentLayers.some((layer) => layer.id === layerId)) {
        return null;
      }

      const nextLayers = currentLayers.filter((layer) => layer.id !== layerId);

      return {
        layers: nextLayers,
        selectedLayerId: currentSelectedLayerId === layerId ? nextLayers[0]?.id ?? null : currentSelectedLayerId
      };
    });
  }

  function moveLayer(layerId: string, direction: "down" | "up") {
    commitLayerStackChange("moving a layer", (currentLayers, currentSelectedLayerId) => {
      const index = currentLayers.findIndex((layer) => layer.id === layerId);

      if (index < 0) {
        return null;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= currentLayers.length) {
        return null;
      }

      return {
        layers: moveItem(currentLayers, index, nextIndex),
        selectedLayerId: currentSelectedLayerId
      };
    });
  }

  function moveLayerToTarget(layerId: string, targetLayerId: string, position: "after" | "before") {
    const changed = commitLayerStackChange("reordering a layer", (currentLayers) => {
      if (!currentLayers.some((layer) => layer.id === layerId)) {
        return null;
      }

      return {
        layers: moveLayerBeforeOrAfter(currentLayers, layerId, targetLayerId, position),
        selectedLayerId: layerId
      };
    });

    if (!changed && layers.some((layer) => layer.id === layerId)) {
      setSelectedLayerId(layerId);
    }
  }

  function getLayerDropTargetFromPoint(clientX: number, clientY: number, sourceLayerId: string): LayerDropTarget | null {
    const row = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>(".calc-layer-row");
    const targetLayerId = row?.dataset.layerId;

    if (!row || !targetLayerId || targetLayerId === sourceLayerId) {
      return null;
    }

    const bounds = row.getBoundingClientRect();
    return {
      layerId: targetLayerId,
      position: clientY < bounds.top + bounds.height / 2 ? "before" : "after"
    };
  }

  function handleLayerPointerDown(event: PointerEvent<HTMLButtonElement>, layerId: string) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedLayerId(layerId);
    setSelectedLayerId(layerId);
  }

  function handleLayerMouseDown(event: MouseEvent<HTMLButtonElement>, layerId: string) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    setDraggedLayerId(layerId);
    setSelectedLayerId(layerId);
  }

  function handleLayerPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!draggedLayerId) {
      return;
    }

    setLayerDropTarget(getLayerDropTargetFromPoint(event.clientX, event.clientY, draggedLayerId));
  }

  function handleLayerPointerUp(event: PointerEvent<HTMLButtonElement>, layerId: string) {
    const sourceLayerId = draggedLayerId ?? layerId;
    const target = getLayerDropTargetFromPoint(event.clientX, event.clientY, sourceLayerId);

    if (target) {
      moveLayerToTarget(sourceLayerId, target.layerId, target.position);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function handleLayerPointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function selectMaterial(layerId: string, materialId: string) {
    updateLayerWithUndo("changing a layer material", layerId, { materialId }, layerId);
    setMaterialEditorMaterialId(materialId);
    setMaterialSearch((current) => {
      const next = { ...current };
      delete next[layerId];
      return next;
    });
    setOpenMaterialLayerId(null);
    setSelectedLayerId(layerId);
  }

  function openMaterialEditor(materialId: string | null = null) {
    const selectedLayerMaterialId = layers.find((layer) => layer.id === selectedLayerId)?.materialId ?? layers[0]?.materialId ?? null;
    setMaterialEditorMaterialId(materialId ?? selectedLayerMaterialId);
    setMaterialEditorOpen(true);
  }

  function saveCustomMaterial(material: MaterialDefinition) {
    setCustomMaterials((current) => upsertCustomMaterial(current, material));
    setMaterialEditorMaterialId(material.id);
  }

  function deleteCustomMaterial(materialId: string) {
    setCustomMaterials((current) => removeCustomMaterial(current, materialId));
    setMaterialVisualOverrides((current) => removeMaterialVisualOverride(current, materialId));
    setMaterialEditorMaterialId((current) => (current === materialId ? materials.find((material) => material.id !== materialId)?.id ?? null : current));
    setLayerUndoStack([]);
  }

  function replaceMaterialInLayers(fromMaterialId: string, toMaterialId: string) {
    commitLayerStackChange("replacing layer materials", (currentLayers, currentSelectedLayerId) => ({
      layers: currentLayers.map((layer) => (layer.materialId === fromMaterialId ? { ...layer, materialId: toMaterialId } : layer)),
      selectedLayerId: currentSelectedLayerId
    }));
  }

  function saveMaterialVisualOverride(override: MaterialVisualOverride) {
    setMaterialVisualOverrides((current) => upsertMaterialVisualOverride(current, override));
  }

  function resetMaterialVisualOverride(materialId: string) {
    setMaterialVisualOverrides((current) => removeMaterialVisualOverride(current, materialId));
  }

  function handleMaterialComboboxBlur(layerId: string, event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenMaterialLayerId((current) => (current === layerId ? null : current));
    }
  }

  function handleMaterialSearchKeyDown(
    layer: DraftLayer,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Escape") {
      setOpenMaterialLayerId(null);
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const firstMaterial = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId, materials, materialById)[0];
    if (!firstMaterial) {
      return;
    }

    event.preventDefault();
    selectMaterial(layer.id, firstMaterial.id);
  }

  function toggleOutput(outputId: RequestedOutputId) {
    setSelectedOutputs((current) => (current.includes(outputId) ? current.filter((id) => id !== outputId) : [...current, outputId]));
  }

  function focusTask(task: RequiredTask) {
    if (task.targetLayerId) {
      setSelectedLayerId(task.targetLayerId);
    }

    if (!task.targetElementId) {
      return;
    }

    window.setTimeout(() => {
      const target = document.getElementById(task.targetElementId!);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.focus({ preventScroll: true });
    }, 0);
  }

  function getStatusLabel(): string {
    if (estimateState.status === "ready") return "Ready";
    if (estimateState.status === "loading") return "Calculating";
    if (estimateState.status === "error") return "Error";
    if (estimateState.status === "blocked") return "Needs input";
    return "Pending";
  }

  function handleOpenReport() {
    if (!canOpenReport) {
      return;
    }

    const projectName = selectedServerProject?.name;
    const serverProjectId = selectedServerProjectId || undefined;
    const serverProjectAssemblyId = selectedServerAssemblyId || undefined;
    const sourceAssemblySnapshot = buildCurrentWorkbenchV2ServerSnapshot(selectedServerAssembly?.name);
    const projectContext: SimpleWorkbenchProposalPreviewProjectContext = {
      serverProjectAssemblyId,
      serverProjectId,
      sourceAssemblySnapshot,
      sourceCalculationOutput: {
        calculationSummary: buildAssemblyCalculationSummary(),
        outputRows,
        responseFigures
      },
      sourceMaterialSnapshot: {
        customMaterials: [...customMaterials],
        materialVisualOverrides: [...materialVisualOverrides]
      }
    };

    const reportDocument = buildReportSnapshot({
      layers,
      materialById,
      mode,
      outputRows,
      projectName,
      responseFigures,
      serverProjectId,
      serverProjectScenarioId: serverProjectAssemblyId
    });

    storeReportSnapshot(reportDocument, projectContext);
    window.location.assign("/workbench/proposal");
  }

  return (
    <main className="calc-page">
      <div className="calc-shell">
        <header className="calc-header">
          <div>
            <div className="eyebrow">Calculator</div>
            <h1>Acoustic workbench</h1>
          </div>
          <div className="calc-header-meta">
            <button
              aria-controls="workbench-project-workspace"
              aria-expanded={projectWorkspaceOpen}
              aria-label={projectWorkspaceOpen ? "Hide project workspace" : "Show project workspace"}
              className={projectWorkspaceOpen ? "focus-ring ui-button ui-button-primary calc-project-trigger" : "focus-ring ui-button ui-button-ghost calc-project-trigger"}
              onClick={() => setProjectWorkspaceOpen((current) => !current)}
              type="button"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Project</span>
              <small>{projectWorkspaceTriggerStatus}</small>
            </button>
            <span className="ui-badge">{mode === "wall" ? "Wall" : "Floor"}</span>
            <span className="ui-badge">{layers.length} layers</span>
            <span className="ui-badge">{formatThickness(totalThickness)}</span>
            <span className={estimateState.status === "ready" ? "ui-badge ui-badge-success" : "ui-badge"}>{getStatusLabel()}</span>
          </div>
        </header>

        <section className="calc-grid" aria-label="Calculator workspace">
          <div className="calc-main">
            {projectWorkspaceOpen ? (
              <ProjectWorkspacePanel
                busy={serverProjectBusy}
                combinations={{
                  assemblies: serverProjectAssemblies,
                  assemblyDescriptionDraft: serverAssemblyDescriptionDraft,
                  assemblyNameDraft: serverAssemblyNameDraft,
                  assemblyRenameDescriptionDraft: serverAssemblyRenameDescriptionDraft,
                  assemblyRenameDraft: serverAssemblyRenameDraft,
                  canRenameAssembly: canRenameServerAssembly,
                  onAssemblyDescriptionDraftChange: (value) => {
                    serverAssemblyDescriptionDraftRef.current = value;
                    setServerAssemblyDescriptionDraft(value);
                  },
                  onAssemblyNameDraftChange: (value) => {
                    serverAssemblyNameDraftRef.current = value;
                    setServerAssemblyNameDraft(value);
                  },
                  onAssemblyRenameDescriptionDraftChange: (value) => {
                    serverAssemblyRenameDescriptionDraftRef.current = value;
                    setServerAssemblyRenameDescriptionDraft(value);
                  },
                  onAssemblyRenameDraftChange: (value) => {
                    serverAssemblyRenameDraftRef.current = value;
                    setServerAssemblyRenameDraft(value);
                  },
                  onDeleteAssembly: deleteSelectedProjectAssembly,
                  onDuplicateAssembly: duplicateSelectedProjectAssembly,
                  onLoadAssembly: loadSelectedProjectAssembly,
                  onRenameAssembly: renameSelectedProjectAssembly,
                  onSaveAssembly: saveCurrentAssemblyToServerProject,
                  onSelectAssembly: (nextAssemblyId) => {
                    const nextAssembly = serverProjectAssemblies.find((assembly) => assembly.id === nextAssemblyId);
                    const nextName = nextAssembly?.name ?? "";
                    const nextDescription = nextAssembly?.description ?? "";
                    setSelectedServerAssemblyId(nextAssemblyId);
                    serverAssemblyRenameDraftRef.current = nextName;
                    serverAssemblyRenameDescriptionDraftRef.current = nextDescription;
                    setServerAssemblyRenameDraft(nextName);
                    setServerAssemblyRenameDescriptionDraft(nextDescription);
                  },
                  projectSelected: Boolean(selectedServerProjectId),
                  selectedAssembly: selectedServerAssembly,
                  selectedAssemblyId: selectedServerAssemblyId,
                  selectedProjectName: selectedServerProject?.name
                }}
                id="workbench-project-workspace"
                identity={{
                  canCreateProject: canCreateServerProject,
                  onCreateProject: createServerProject,
                  onProjectNameDraftChange: (value) => {
                    serverProjectNameDraftRef.current = value;
                    setServerProjectNameDraft(value);
                  },
                  onRefreshProjects: () => refreshServerProjects(),
                  onSelectProject: (nextProjectId) => {
                    setSelectedServerProjectId(nextProjectId);
                    setSelectedServerAssemblyId("");
                    setSelectedServerReportId("");
                    serverAssemblyRenameDraftRef.current = "";
                    serverAssemblyRenameDescriptionDraftRef.current = "";
                    serverReportRenameDraftRef.current = "";
                    serverReportDescriptionDraftRef.current = "";
                    setServerAssemblyRenameDraft("");
                    setServerAssemblyRenameDescriptionDraft("");
                    setServerReportRenameDraft("");
                    setServerReportDescriptionDraft("");
                  },
                  projectNameDraft: serverProjectNameDraft,
                  projects: serverProjects,
                  selectedProject: selectedServerProject,
                  selectedProjectId: selectedServerProjectId
                }}
                message={serverProjectMessage}
                onClose={() => setProjectWorkspaceOpen(false)}
                reports={{
                  assemblies: serverProjectAssemblies,
                  canRenameReport: canRenameServerReport,
                  onDeleteReport: deleteSelectedProjectReport,
                  onDuplicateReport: duplicateSelectedProjectReport,
                  onOpenReport: openSelectedProjectReport,
                  onRenameReport: renameSelectedProjectReport,
                  onReportRenameDraftChange: (value) => {
                    serverReportRenameDraftRef.current = value;
                    setServerReportRenameDraft(value);
                  },
                  onReportDescriptionDraftChange: (value) => {
                    serverReportDescriptionDraftRef.current = value;
                    setServerReportDescriptionDraft(value);
                  },
                  onSelectReport: (nextReportId) => {
                    const nextReport = serverProjectReports.find((report) => report.id === nextReportId);
                    const nextName = nextReport?.name ?? "";
                    const nextDescription = nextReport?.description ?? "";
                    setSelectedServerReportId(nextReportId);
                    serverReportRenameDraftRef.current = nextName;
                    serverReportDescriptionDraftRef.current = nextDescription;
                    setServerReportRenameDraft(nextName);
                    setServerReportDescriptionDraft(nextDescription);
                  },
                  onSetReportArchived: setSelectedProjectReportArchived,
                  projectSelected: Boolean(selectedServerProjectId),
                  reportRenameDraft: serverReportRenameDraft,
                  reportDescriptionDraft: serverReportDescriptionDraft,
                  reports: serverProjectReports,
                  selectedReport: selectedServerReport,
                  selectedReportId: selectedServerReportId
                }}
                status={serverProjectStatus}
              />
            ) : null}

            <section className="calc-section calc-setup-section">
              <div className="calc-section-head">
                <div>
                  <h2>Setup</h2>
                </div>
              </div>

              <div className="calc-setup-grid">
                <div className="calc-segment" aria-label="Assembly mode">
                  {(["wall", "floor"] as const).map((nextMode) => (
                    <button
                      aria-pressed={mode === nextMode}
                      className="focus-ring"
                      key={nextMode}
                      onClick={() => setModeWithDefaults(nextMode)}
                      type="button"
                    >
                      {nextMode === "wall" ? "Wall" : "Floor"}
                    </button>
                  ))}
                </div>

                <div className="calc-output-picker" id="rebuild-output-picker" tabIndex={-1}>
                  {availableOutputs.map((output) => (
                    <label className="calc-output-choice" key={output.id}>
                      <input checked={selectedOutputs.includes(output.id)} onChange={() => toggleOutput(output.id)} type="checkbox" />
                      <span>{output.label}</span>
                      <small>{output.group}</small>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {needsAirborne || needsBuildingPrediction || needsImpact || needsFloorImpact || needsWallTopology ? (
              <section className="calc-section calc-route-section">
                <div className="calc-section-head">
                  <div>
                    <h2>Route inputs</h2>
                  </div>
                </div>

                <div className="calc-field-grid">
                  {needsWallTopology ? (
                    <div className="calc-route-block calc-route-block-wide">
                      <div className="calc-route-toolbar">
                        <strong>Wall ownership</strong>
                        <button className="focus-ring ui-button ui-button-ghost" onClick={applyLayerRoleTopology} type="button">
                          Use layer roles
                        </button>
                      </div>
                      <div className="calc-field-grid">
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallTopologyMode) ? "true" : undefined}>
                          <span>Topology mode</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallTopologyMode) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallTopologyMode}
                            onChange={(event) => updateContext({ wallTopologyMode: event.target.value as WallTopologyMode })}
                            value={context.wallTopologyMode}
                          >
                            {WALL_TOPOLOGY_MODE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <TextField
                          id={CONTEXT_INPUT_IDS.wallSideALeafLayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSideALeafLayerIndices)}
                          label="Side A rows"
                          onChange={(value) => updateWallTopologyContext({ wallSideALeafLayerIndices: value })}
                          placeholder="1"
                          value={context.wallSideALeafLayerIndices}
                        />
                        <TextField
                          id={CONTEXT_INPUT_IDS.wallCavity1LayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1LayerIndices)}
                          label="Cavity rows"
                          onChange={(value) => updateWallTopologyContext({ wallCavity1LayerIndices: value })}
                          placeholder="2"
                          value={context.wallCavity1LayerIndices}
                        />
                        <TextField
                          id={CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices)}
                          label="Side B rows"
                          onChange={(value) => updateWallTopologyContext({ wallSideBLeafLayerIndices: value })}
                          placeholder="3"
                          value={context.wallSideBLeafLayerIndices}
                        />
                        <NumberField
                          id={CONTEXT_INPUT_IDS.wallCavity1DepthMm}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1DepthMm)}
                          label="Cavity depth"
                          onChange={(value) => updateWallTopologyContext({ wallCavity1DepthMm: value })}
                          suffix="mm"
                          value={context.wallCavity1DepthMm}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1FillCoverage) ? "true" : undefined}>
                          <span>Cavity fill</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1FillCoverage) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallCavity1FillCoverage}
                            onChange={(event) => updateWallTopologyContext({ wallCavity1FillCoverage: event.target.value as WallCavityFillCoverage })}
                            value={context.wallCavity1FillCoverage}
                          >
                            {WALL_CAVITY_FILL_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass) ? "true" : undefined}>
                          <span>Cavity absorption</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass}
                            onChange={(event) => updateWallTopologyContext({ wallCavity1AbsorptionClass: event.target.value as WallCavityAbsorptionClass })}
                            value={context.wallCavity1AbsorptionClass}
                          >
                            {WALL_CAVITY_ABSORPTION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSupportTopology) ? "true" : undefined}>
                          <span>Support topology</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSupportTopology) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallSupportTopology}
                            onChange={(event) => updateWallTopologyContext({ wallSupportTopology: event.target.value as WallSupportTopology })}
                            value={context.wallSupportTopology}
                          >
                            {WALL_SUPPORT_TOPOLOGY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumberField
                          id={CONTEXT_INPUT_IDS.supportSpacingMm}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.supportSpacingMm)}
                          label="Support spacing"
                          onChange={(value) => updateContext({ supportSpacingMm: value })}
                          suffix="mm"
                          value={context.supportSpacingMm}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneResilientBarSideCount) ? "true" : undefined}>
                          <span>Resilient bars</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneResilientBarSideCount) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.airborneResilientBarSideCount}
                            onChange={(event) =>
                              updateContext({ airborneResilientBarSideCount: event.target.value as AirborneResilientBarSideCount })
                            }
                            value={context.airborneResilientBarSideCount}
                          >
                            {RESILIENT_BAR_SIDE_COUNT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {needsAirborne || needsBuildingPrediction ? (
                    <>
                      <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneMode) ? "true" : undefined}>
                        <span>Airborne mode</span>
                        <select
                          aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneMode) ? true : undefined}
                          className="focus-ring ui-field"
                          id={CONTEXT_INPUT_IDS.airborneMode}
                          onChange={(event) => updateContext({ airborneMode: event.target.value as AirborneContextMode })}
                          value={context.airborneMode}
                        >
                          <option value="element_lab">Lab</option>
                          <option value="field_between_rooms">Field</option>
                          <option value="building_prediction">Building</option>
                        </select>
                      </label>
                      <NumberField
                        id={CONTEXT_INPUT_IDS.panelWidthMm}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.panelWidthMm)}
                        label="Panel width"
                        onChange={(value) => updateContext({ panelWidthMm: value })}
                        suffix="mm"
                        value={context.panelWidthMm}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.panelHeightMm}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.panelHeightMm)}
                        label="Panel height"
                        onChange={(value) => updateContext({ panelHeightMm: value })}
                        suffix="mm"
                        value={context.panelHeightMm}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.receivingRoomVolumeM3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.receivingRoomVolumeM3)}
                        label="Room volume"
                        onChange={(value) => updateContext({ receivingRoomVolumeM3: value })}
                        suffix="m3"
                        value={context.receivingRoomVolumeM3}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.receivingRoomRt60S}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.receivingRoomRt60S)}
                        label="RT60"
                        onChange={(value) => updateContext({ receivingRoomRt60S: value })}
                        suffix="s"
                        value={context.receivingRoomRt60S}
                      />
                    </>
                  ) : null}

                  {needsBuildingPrediction ? (
                    <div className="calc-route-block calc-route-block-wide">
                      <div className="calc-route-toolbar">
                        <strong>Building prediction</strong>
                      </div>
                      <div className="calc-field-grid">
                        <NumberField
                          id={CONTEXT_INPUT_IDS.sourceRoomVolumeM3}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.sourceRoomVolumeM3)}
                          label="Source room volume"
                          onChange={(value) => updateContext({ sourceRoomVolumeM3: value })}
                          suffix="m3"
                          value={context.sourceRoomVolumeM3}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.flankingJunctionClass) ? "true" : undefined}>
                          <span>Flanking junction</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.flankingJunctionClass) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.flankingJunctionClass}
                            onChange={(event) => updateContext({ flankingJunctionClass: event.target.value as AirborneFlankingJunctionClass })}
                            value={context.flankingJunctionClass}
                          >
                            {FLANKING_JUNCTION_CLASS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label
                          className="calc-field"
                          data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.conservativeFlankingAssumption) ? "true" : undefined}
                        >
                          <span>Flanking assumption</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.conservativeFlankingAssumption) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.conservativeFlankingAssumption}
                            onChange={(event) =>
                              updateContext({ conservativeFlankingAssumption: event.target.value as AirborneConservativeFlankingAssumption })
                            }
                            value={context.conservativeFlankingAssumption}
                          >
                            {CONSERVATIVE_FLANKING_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumberField
                          id={CONTEXT_INPUT_IDS.junctionCouplingLengthM}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.junctionCouplingLengthM)}
                          label="Coupling length"
                          onChange={(value) => updateContext({ junctionCouplingLengthM: value })}
                          suffix="m"
                          value={context.junctionCouplingLengthM}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.buildingPredictionOutputBasis) ? "true" : undefined}>
                          <span>Output basis</span>
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.buildingPredictionOutputBasis) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.buildingPredictionOutputBasis}
                            onChange={(event) =>
                              updateContext({ buildingPredictionOutputBasis: event.target.value as AirborneBuildingPredictionOutputBasis })
                            }
                            value={context.buildingPredictionOutputBasis}
                          >
                            {BUILDING_OUTPUT_BASIS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {needsImpact ? (
                    <>
                      <NumberField
                        id={CONTEXT_INPUT_IDS.fieldKDb}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.fieldKDb)}
                        label="K correction"
                        onChange={(value) => updateContext({ fieldKDb: value })}
                        suffix="dB"
                        value={context.fieldKDb}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.ciDb}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.ciDb)}
                        label="CI"
                        onChange={(value) => updateContext({ ciDb: value })}
                        suffix="dB"
                        value={context.ciDb}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.ci50_2500Db}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.ci50_2500Db)}
                        label="CI,50-2500"
                        onChange={(value) => updateContext({ ci50_2500Db: value })}
                        suffix="dB"
                        value={context.ci50_2500Db}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3)}
                        label="Impact room volume"
                        onChange={(value) => updateContext({ impactReceivingRoomVolumeM3: value })}
                        suffix="m3"
                        value={context.impactReceivingRoomVolumeM3}
                      />
                    </>
                  ) : null}

                  {needsFloorImpact ? (
                    <>
                      <NumberField
                        id={CONTEXT_INPUT_IDS.loadBasisKgM2}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.loadBasisKgM2)}
                        label="Load basis"
                        onChange={(value) => updateContext({ loadBasisKgM2: value })}
                        suffix="kg/m2"
                        value={context.loadBasisKgM2}
                      />
                      <NumberField
                        id={CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3)}
                        label="Dynamic stiffness"
                        onChange={(value) => updateContext({ resilientLayerDynamicStiffnessMNm3: value })}
                        suffix="MN/m3"
                        value={context.resilientLayerDynamicStiffnessMNm3}
                      />
                    </>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section className="calc-section calc-layer-section">
              <div className="calc-section-head">
                <div>
                  <h2>Layer stack</h2>
                </div>
                <div className="calc-section-actions">
                  <button
                    aria-label={undoLayerStackActionLabel}
                    className="focus-ring ui-icon-button"
                    disabled={!canUndoLayerStack}
                    onClick={undoLayerStackChange}
                    title={undoLayerStackTitle}
                    type="button"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button className="focus-ring ui-button ui-button-ghost" onClick={() => openMaterialEditor()} type="button">
                    <Palette className="h-4 w-4" />
                    Materials
                  </button>
                  <button className="focus-ring ui-button ui-button-primary" onClick={addLayer} type="button">
                    <Plus className="h-4 w-4" />
                    Add layer
                  </button>
                </div>
              </div>

              <div className="calc-layer-list">
                <div className="calc-layer-list-head" aria-hidden="true">
                  <span />
                  <span>Material</span>
                  <span>Role</span>
                  <span>Thickness</span>
                  <span>Actions</span>
                </div>
                {layers.map((layer, index) => {
                  const material = getMaterialFromCatalog(layer.materialId, materialById);
                  const filteredMaterials = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId, materials, materialById);

                  return (
                    <article
                      className="calc-layer-row"
                      data-active={selectedLayerId === layer.id ? "true" : "false"}
                      data-dragging={draggedLayerId === layer.id ? "true" : undefined}
                      data-layer-id={layer.id}
                      data-drop-position={layerDropTarget?.layerId === layer.id ? layerDropTarget.position : undefined}
                      key={layer.id}
                      onFocus={() => setSelectedLayerId(layer.id)}
                    >
                      <div className="calc-layer-rail">
                        <button
                          aria-label={`Drag layer ${index + 1}`}
                          className="calc-layer-drag focus-ring"
                          disabled={layers.length <= 1}
                          onMouseDown={(event) => handleLayerMouseDown(event, layer.id)}
                          onPointerCancel={handleLayerPointerCancel}
                          onPointerDown={(event) => handleLayerPointerDown(event, layer.id)}
                          onPointerMove={handleLayerPointerMove}
                          onPointerUp={(event) => handleLayerPointerUp(event, layer.id)}
                          title="Drag to reorder"
                          type="button"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Select layer ${index + 1}`}
                          className="calc-layer-index focus-ring"
                          onClick={() => setSelectedLayerId(layer.id)}
                          type="button"
                        >
                          {index + 1}
                        </button>
                      </div>

                      <div className="calc-layer-fields">
                        <div className="calc-field calc-material-combobox" onBlur={(event) => handleMaterialComboboxBlur(layer.id, event)}>
                          <span>Material</span>
                          <button
                            aria-controls={getLayerMaterialPopoverId(layer.id)}
                            aria-expanded={openMaterialLayerId === layer.id}
                            className="calc-material-current focus-ring"
                            onClick={() => setOpenMaterialLayerId((current) => (current === layer.id ? null : layer.id))}
                            type="button"
                          >
                            <strong>{material.name}</strong>
                            <small>
                              {material.densityKgM3} kg/m3 / {material.category}
                            </small>
                          </button>
                          {openMaterialLayerId === layer.id ? (
                            <div className="calc-material-popover" id={getLayerMaterialPopoverId(layer.id)} role="listbox">
                              <div className="calc-search-input calc-material-popover-search">
                                <Search className="h-4 w-4" />
                                <input
                                  aria-controls={getLayerMaterialPopoverId(layer.id)}
                                  aria-expanded={openMaterialLayerId === layer.id}
                                  autoComplete="off"
                                  autoFocus
                                  id={getLayerMaterialInputId(layer.id)}
                                  onChange={(event) => setMaterialSearch((current) => ({ ...current, [layer.id]: event.target.value }))}
                                  onKeyDown={(event) => handleMaterialSearchKeyDown(layer, event)}
                                  placeholder="Search material"
                                  role="searchbox"
                                  value={materialSearch[layer.id] ?? ""}
                                />
                              </div>
                              {filteredMaterials.map((entry) => (
                                <button
                                  aria-selected={entry.id === layer.materialId}
                                  className="calc-material-option focus-ring"
                                  key={entry.id}
                                  onClick={() => selectMaterial(layer.id, entry.id)}
                                  role="option"
                                  type="button"
                                >
                                  <strong>{entry.name}</strong>
                                  <small>
                                    {entry.densityKgM3} kg/m3 / {entry.category}
                                  </small>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <label className="calc-field">
                          <span>Role</span>
                          <select
                            className="focus-ring ui-field"
                            id={getLayerRoleInputId(layer.id)}
                            onChange={(event) => updateLayerWithUndo("changing a layer role", layer.id, { role: event.target.value })}
                            value={layer.role}
                          >
                            {getRoleOptions(mode).map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <NumberField
                          id={getLayerThicknessInputId(layer.id)}
                          label="Thickness"
                          onChange={(value) => updateLayerWithUndo("changing a layer thickness", layer.id, { thicknessMm: value })}
                          suffix="mm"
                          value={layer.thicknessMm}
                        />
                      </div>

                      <div className="calc-layer-actions">
                        <button
                          aria-label="Move layer up"
                          className="focus-ring ui-icon-button"
                          disabled={index === 0}
                          onClick={() => moveLayer(layer.id, "up")}
                          type="button"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Move layer down"
                          className="focus-ring ui-icon-button"
                          disabled={index === layers.length - 1}
                          onClick={() => moveLayer(layer.id, "down")}
                          type="button"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button aria-label="Duplicate layer" className="focus-ring ui-icon-button" onClick={() => duplicateLayer(layer.id)} type="button">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button aria-label="Remove layer" className="focus-ring ui-icon-button" onClick={() => removeLayer(layer.id)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {materialEditorOpen ? (
              <MaterialEditorPanel
                layers={layers.map((layer, index) => ({
                  id: layer.id,
                  label: `Layer ${index + 1}`,
                  materialId: layer.materialId
                }))}
                materials={materials}
                onClose={() => setMaterialEditorOpen(false)}
                onDeleteMaterial={deleteCustomMaterial}
                onReplaceMaterialInLayers={replaceMaterialInLayers}
                onResetVisualOverride={resetMaterialVisualOverride}
                onSaveMaterial={saveCustomMaterial}
                onSaveVisualOverride={saveMaterialVisualOverride}
                onSelectMaterial={setMaterialEditorMaterialId}
                restoreWarning={materialEditorRestoreWarning}
                selectedMaterialId={materialEditorMaterialId}
                visualOverrides={materialVisualOverrides}
              />
            ) : null}

            <ProfessionalLayerIllustration
              layers={illustrationLayers}
              orientation={mode}
              title={mode === "floor" ? "Floor construction preview" : "Wall construction preview"}
            />
          </div>

          <aside className="calc-review" aria-label="Calculation review">
            <section className="calc-result-hero" data-status={estimateState.status}>
              <span>Current result</span>
              <strong>{primaryOutput?.value ?? "--"}</strong>
              <p>{primaryOutput ? `${primaryOutput.label}: ${primaryOutput.detail}` : "Complete inputs to calculate."}</p>
            </section>

            {requiredTasks.length || estimateState.status === "error" ? (
              <section className="calc-review-section">
                <div className="calc-review-head">
                  <h2>{estimateState.status === "error" ? "Error" : "Needs input"}</h2>
                </div>
                <div className="calc-task-list">
                  {estimateState.status === "error" ? <p className="calc-error-text">{estimateState.message}</p> : null}
                  {requiredTasks.map((task) => (
                    <button className="calc-task-row focus-ring" key={task.id} onClick={() => focusTask(task)} type="button">
                      <span>
                        <strong>{task.label}</strong>
                        <small>{task.detail}</small>
                      </span>
                      {task.actionLabel ? <em>{task.actionLabel}</em> : null}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="calc-review-section">
              <div className="calc-review-head">
                <h2>Outputs</h2>
                <span>{outputRows.length || selectedOutputs.length}</span>
              </div>
              <div className="calc-output-rows">
                {(outputRows.length ? outputRows : selectedOutputs.map((output) => ({ detail: "Pending", label: output, status: "pending" as const, value: "--" }))).map(
                  (row) => (
                    <div className="calc-output-row" data-status={row.status} key={row.label}>
                      <span>
                        <strong>{row.label}</strong>
                        <small>{row.detail}</small>
                      </span>
                      <em>{row.value}</em>
                    </div>
                  )
                )}
              </div>
            </section>

            {visibleResponseFigures.length || missingSelectedImpactCurve || missingSelectedAirborneCurve ? (
              <div className="calc-curve-stack">
                {visibleResponseFigures.map((figure) => (
                  <ProfessionalResponseCurve figure={figure} key={figure.id} />
                ))}
                {missingSelectedImpactCurve ? (
                  <div className="calc-curve-empty">
                    <span>Impact spectrum</span>
                    <strong>Band curve unavailable</strong>
                    <p>Current impact result exposes weighted values, but no trace-backed impact band curve.</p>
                  </div>
                ) : null}
                {missingSelectedAirborneCurve ? (
                  <div className="calc-curve-empty">
                    <span>Airborne spectrum</span>
                    <strong>Band curve unavailable</strong>
                    <p>Current airborne result does not expose response-curve bands.</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <section className="calc-review-section">
              <div className="calc-review-head">
                <h2>Report handoff</h2>
              </div>
              {canOpenReport ? (
                <button className="focus-ring ui-button ui-button-primary calc-report-link" onClick={handleOpenReport} type="button">
                  <FileText className="h-4 w-4" />
                  Open report
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button className="ui-button calc-report-link" disabled type="button">
                  <FileText className="h-4 w-4" />
                  Result required
                </button>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function NumberField(props: {
  id: string;
  invalid?: boolean;
  label: string;
  onChange: (value: string) => void;
  suffix: string;
  value: string;
}) {
  return (
    <label className="calc-field" data-missing={props.invalid ? "true" : undefined}>
      <span>{props.label}</span>
      <div className="calc-number-field">
        <input
          aria-invalid={props.invalid ? true : undefined}
          className="focus-ring"
          id={props.id}
          inputMode="decimal"
          onChange={(event) => props.onChange(event.target.value)}
          type="number"
          value={props.value}
        />
        <em>{props.suffix}</em>
      </div>
    </label>
  );
}

function TextField(props: {
  id: string;
  invalid?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="calc-field" data-missing={props.invalid ? "true" : undefined}>
      <span>{props.label}</span>
      <input
        aria-invalid={props.invalid ? true : undefined}
        className="focus-ring ui-field"
        id={props.id}
        inputMode="numeric"
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        type="text"
        value={props.value}
      />
    </label>
  );
}
