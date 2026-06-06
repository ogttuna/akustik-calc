"use client";

import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
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
import { ArrowDown, ArrowRight, ArrowUp, Copy, FileText, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useMemo, useState } from "react";

import { buildWorkbenchResponseCurveFigures } from "../workbench/response-curve-model";
import type { SimpleWorkbenchProposalDocument } from "../workbench/simple-workbench-proposal";
import { ProfessionalLayerIllustration, type ProfessionalLayerIllustrationLayer } from "./professional-layer-illustration";
import { ProfessionalResponseCurve } from "./professional-response-curve";

type StudyMode = "floor" | "wall";
type EstimateState =
  | { status: "idle" }
  | { reasons: readonly RequiredTask[]; status: "blocked" }
  | { status: "loading" }
  | { result: AssemblyCalculation; status: "ready" }
  | { message: string; status: "error" };
type OutputStatus = "live" | "needs_input" | "unsupported" | "pending";

type DraftLayer = {
  id: string;
  materialId: string;
  role: string;
  thicknessMm: string;
};

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

type ContextDraft = {
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

type LayerDropTarget = {
  layerId: string;
  position: "after" | "before";
};

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

const INITIAL_CONTEXT: ContextDraft = {
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

const MATERIALS = [...MATERIAL_CATALOG_SEED].sort((left, right) => left.name.localeCompare(right.name));
const MATERIAL_BY_ID = new Map(MATERIALS.map((material) => [material.id, material]));
const PROPOSAL_PREVIEW_STORAGE_KEY = "dynecho:proposal-preview:v1";

function createLayerId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `layer-${Date.now()}`;
}

function getMaterial(materialId: string): MaterialDefinition {
  return MATERIAL_BY_ID.get(materialId) ?? MATERIALS[0]!;
}

function getDefaultMaterialId(mode: StudyMode): string {
  if (mode === "floor") {
    return MATERIAL_BY_ID.has("concrete") ? "concrete" : MATERIALS[0]!.id;
  }

  return MATERIAL_BY_ID.has("gypsum_board") ? "gypsum_board" : MATERIALS[0]!.id;
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

function migrateLayerRoles(layers: readonly DraftLayer[], nextMode: StudyMode): DraftLayer[] {
  const roles = getRoleOptions(nextMode);

  return layers.map((layer, index) => ({
    ...layer,
    materialId: layer.materialId || getDefaultMaterialId(nextMode),
    role: roles[Math.min(index, roles.length - 1)]!.value
  }));
}

function getRoleLabel(mode: StudyMode, value: string): string {
  return getRoleOptions(mode).find((role) => role.value === value)?.label ?? value.replace(/_/g, " ");
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

function getFilteredMaterials(search: string, selectedId: string): MaterialDefinition[] {
  const normalized = normalizeSearch(search);
  const filtered = normalized
    ? MATERIALS.filter((material) => {
        const haystack = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();
        return haystack.includes(normalized);
      })
    : MATERIALS;
  const selected = getMaterial(selectedId);
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

function buildLocalTasks(layers: readonly DraftLayer[], selectedOutputs: readonly RequestedOutputId[]): readonly RequiredTask[] {
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
    if (!parsePositiveNumber(layer.thicknessMm)) {
      tasks.push({
        actionLabel: "Edit",
        detail: `Enter thickness for layer ${index + 1}.`,
        id: `missing-thickness-${layer.id}`,
        label: `${getMaterial(layer.materialId).name} thickness`,
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

function inferCavityFillCoverage(layers: readonly DraftLayer[], indices: readonly number[]): WallCavityFillCoverage {
  const materials = indices.map((index) => getMaterial(layers[index]?.materialId ?? ""));

  if (materials.some(isPorousCavityMaterial)) {
    return "full";
  }

  if (materials.length > 0 && materials.every(isEmptyCavityMaterial)) {
    return "empty";
  }

  return "unknown";
}

function inferCavityAbsorptionClass(layers: readonly DraftLayer[], indices: readonly number[]): WallCavityAbsorptionClass {
  const materials = indices.map((index) => getMaterial(layers[index]?.materialId ?? ""));

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

function buildEstimatePayload(
  mode: StudyMode,
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  context: ContextDraft
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

function buildOutputRows(result: AssemblyCalculation, selectedOutputs: readonly RequestedOutputId[]): readonly OutputRow[] {
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

function buildIllustrationLayers(layers: readonly DraftLayer[], mode: StudyMode, selectedLayerId: string | null): ProfessionalLayerIllustrationLayer[] {
  return layers.map((layer) => {
    const material = getMaterial(layer.materialId);
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);

    return {
      active: layer.id === selectedLayerId,
      categoryLabel: material.category,
      id: layer.id,
      label: material.name,
      material,
      roleLabel: getRoleLabel(mode, layer.role),
      solverLabel: mode === "floor" ? "Floor role" : undefined,
      thicknessLabel: formatThickness(thicknessMm),
      thicknessMm
    };
  });
}

function getPrimaryOutput(rows: readonly OutputRow[]): OutputRow | null {
  return rows.find((row) => row.status === "live") ?? rows[0] ?? null;
}

function buildReportSnapshot(input: {
  layers: readonly DraftLayer[];
  mode: StudyMode;
  outputRows: readonly OutputRow[];
  responseFigures: ReturnType<typeof buildWorkbenchResponseCurveFigures>;
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
    const material = getMaterial(layer.materialId);
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
    consultantWordmarkLine: "Acoustic proposal",
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
    projectName: "DAC Operator Deck",
    proposalAttention: "Design coordination team",
    proposalIssuePurpose: "Client review and acoustic coordination",
    proposalRecipient: "Client delivery team",
    proposalReference: "DEC-2026-001",
    proposalRevision: "Rev 00",
    proposalSubject: `${input.mode === "floor" ? "Floor" : "Wall"} acoustic proposal`,
    proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    responseCurves: input.responseFigures,
    studyContextLabel: "Concept",
    studyModeLabel: input.mode === "floor" ? "Floor" : "Wall",
    validationDetail: "Calculation basis is limited to the selected build-up and requested outputs.",
    validationLabel: primary.status === "live" ? "Calculated estimate" : "Review required",
    warnings: []
  };
}

function storeReportSnapshot(document: SimpleWorkbenchProposalDocument): void {
  window.localStorage.setItem(
    PROPOSAL_PREVIEW_STORAGE_KEY,
    JSON.stringify({
      baseDocument: document,
      savedAtIso: new Date().toISOString()
    })
  );
}

export function CalculatorWorkbench() {
  const [mode, setMode] = useState<StudyMode>("wall");
  const [layers, setLayers] = useState<readonly DraftLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(INITIAL_LAYERS[0]!.id);
  const [selectedOutputs, setSelectedOutputs] = useState<readonly RequestedOutputId[]>(["Rw"]);
  const [context, setContext] = useState<ContextDraft>(INITIAL_CONTEXT);
  const [estimateState, setEstimateState] = useState<EstimateState>({ status: "idle" });
  const [materialSearch, setMaterialSearch] = useState<Record<string, string>>({});
  const [openMaterialLayerId, setOpenMaterialLayerId] = useState<string | null>(null);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [layerDropTarget, setLayerDropTarget] = useState<LayerDropTarget | null>(null);

  const estimateResult = estimateState.status === "ready" ? estimateState.result : null;
  const availableOutputs = OUTPUT_OPTIONS.filter((output) => output.modes.includes(mode));
  const outputRows = estimateResult ? buildOutputRows(estimateResult, selectedOutputs) : [];
  const primaryOutput = getPrimaryOutput(outputRows);
  const remoteTasks = getRemoteTasks(estimateResult);
  const localTasks = buildLocalTasks(layers, selectedOutputs);
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
  const illustrationLayers = useMemo(() => buildIllustrationLayers(layers, mode, selectedLayerId), [layers, mode, selectedLayerId]);
  const totalThickness = layers.reduce((sum, layer) => sum + (parsePositiveNumber(layer.thicknessMm) ?? 0), 0);
  const canOpenReport = outputRows.some((row) => row.status === "live");
  const needsAirborne = showAirborneContext(selectedOutputs, estimateResult);
  const needsBuildingPrediction = showBuildingPredictionContext(context, estimateResult);
  const needsImpact = mode === "floor" && showImpactContext(selectedOutputs, estimateResult);
  const needsFloorImpact = mode === "floor" && showFloorImpactContext(selectedOutputs, estimateResult);
  const needsWallTopology = showWallTopologyContext(mode, context, estimateResult);
  const isRouteInputMissing = (inputId: string) => routeInputTaskElementIds.has(inputId);

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
  }, [draggedLayerId]);

  useEffect(() => {
    const tasks = buildLocalTasks(layers, selectedOutputs);

    if (tasks.length) {
      setEstimateState({ reasons: tasks, status: "blocked" });
      return;
    }

    const payload = buildEstimatePayload(mode, layers, selectedOutputs, context);

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
  }, [context, layers, mode, selectedOutputs]);

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
      wallCavity1AbsorptionClass: inferCavityAbsorptionClass(layers, cavity),
      wallCavity1DepthMm: cavityDepthMm ? String(cavityDepthMm) : current.wallCavity1DepthMm,
      wallCavity1FillCoverage: inferCavityFillCoverage(layers, cavity),
      wallCavity1LayerIndices: formatLayerIndexList(cavity),
      wallSideALeafLayerIndices: formatLayerIndexList(sideA),
      wallSideBLeafLayerIndices: formatLayerIndexList(sideB),
      wallTopologyMode: "double_leaf_framed"
    }));
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
          : migrateLayerRoles(layers, nextMode);
    const nextSelectedLayerId = nextLayers.some((layer) => layer.id === selectedLayerId) ? selectedLayerId : nextLayers[0]?.id ?? null;

    setMode(nextMode);
    setSelectedOutputs(nextMode === "floor" ? ["Ln,w"] : ["Rw"]);
    setLayers(nextLayers);
    setSelectedLayerId(nextSelectedLayerId);
    setOpenMaterialLayerId(null);
    setMaterialSearch({});
    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function updateLayer(layerId: string, patch: Partial<DraftLayer>) {
    setLayers((current) => current.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)));
  }

  function addLayer() {
    const id = createLayerId();
    const role = getRoleOptions(mode)[Math.min(layers.length, getRoleOptions(mode).length - 1)]!.value;
    const layer: DraftLayer = {
      id,
      materialId: getDefaultMaterialId(mode),
      role,
      thicknessMm: ""
    };

    setLayers((current) => [...current, layer]);
    setSelectedLayerId(id);
  }

  function duplicateLayer(layerId: string) {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === layerId);
      const source = current[index];

      if (!source) {
        return current;
      }

      const duplicate = { ...source, id: createLayerId() };
      const next = [...current];
      next.splice(index + 1, 0, duplicate);
      setSelectedLayerId(duplicate.id);
      return next;
    });
  }

  function removeLayer(layerId: string) {
    setLayers((current) => current.filter((layer) => layer.id !== layerId));
    setSelectedLayerId((current) => (current === layerId ? layers.find((layer) => layer.id !== layerId)?.id ?? null : current));
  }

  function moveLayer(layerId: string, direction: "down" | "up") {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === layerId);

      if (index < 0) {
        return current;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      return moveItem(current, index, nextIndex);
    });
  }

  function moveLayerToTarget(layerId: string, targetLayerId: string, position: "after" | "before") {
    setLayers((current) => moveLayerBeforeOrAfter(current, layerId, targetLayerId, position));
    setSelectedLayerId(layerId);
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
    updateLayer(layerId, { materialId });
    setMaterialSearch((current) => {
      const next = { ...current };
      delete next[layerId];
      return next;
    });
    setOpenMaterialLayerId(null);
    setSelectedLayerId(layerId);
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

    const firstMaterial = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId)[0];
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

    storeReportSnapshot(
      buildReportSnapshot({
        layers,
        mode,
        outputRows,
        responseFigures
      })
    );
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
            <span className="ui-badge">{mode === "wall" ? "Wall" : "Floor"}</span>
            <span className="ui-badge">{layers.length} layers</span>
            <span className="ui-badge">{formatThickness(totalThickness)}</span>
            <span className={estimateState.status === "ready" ? "ui-badge ui-badge-success" : "ui-badge"}>{getStatusLabel()}</span>
          </div>
        </header>

        <section className="calc-grid" aria-label="Calculator workspace">
          <div className="calc-main">
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
                <button className="focus-ring ui-button ui-button-primary" onClick={addLayer} type="button">
                  <Plus className="h-4 w-4" />
                  Add layer
                </button>
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
                  const material = getMaterial(layer.materialId);
                  const filteredMaterials = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId);

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
                            onChange={(event) => updateLayer(layer.id, { role: event.target.value })}
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
                          onChange={(value) => updateLayer(layer.id, { thicknessMm: value })}
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
