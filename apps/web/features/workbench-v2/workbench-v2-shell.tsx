"use client";

import type { AirborneContextMode, AssemblyCalculation, EstimateRequest, FloorRole, RequestedOutputId } from "@dynecho/shared";
import { ArrowDown, ArrowRight, ArrowUp, Copy, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StudyMode = "floor" | "wall";
type WorkbenchStep = "setup" | "stack" | "result" | "report";
type OutputStatus = "live" | "needs_input" | "unsupported" | "pending";

type DraftLayer = {
  id: string;
  materialId: string;
  role: string;
  thicknessMm: string;
};

type MaterialOption = {
  defaultThicknessMm: string;
  floorRole?: FloorRole;
  id: string;
  label: string;
  modes: readonly StudyMode[];
  roleLabel: string;
};

type RoleOption = {
  label: string;
  value: string;
};

type OutputOption = {
  id: RequestedOutputId;
  label: string;
  modes: readonly StudyMode[];
};

type EstimateState =
  | { status: "idle" }
  | { reasons: readonly string[]; status: "blocked" }
  | { status: "loading" }
  | { result: AssemblyCalculation; status: "ready" }
  | { message: string; status: "error" };

type OutputRow = {
  detail: string;
  label: string;
  status: OutputStatus;
  value: string;
};

type OutputStatusCounts = Record<OutputStatus, number>;

type ResultSummary = {
  detail: string;
  label: string;
  tone: "blocked" | "error" | "loading" | "pending" | "ready" | "stopped";
  value: string;
};

type ContextDraft = {
  airborneMode: AirborneContextMode;
  ci50_2500Db: string;
  ciDb: string;
  fieldKDb: string;
  impactReceivingRoomVolumeM3: string;
  loadBasisKgM2: string;
  panelHeightMm: string;
  panelWidthMm: string;
  receivingRoomRt60S: string;
  receivingRoomVolumeM3: string;
  resilientLayerDynamicStiffnessMNm3: string;
};

type RequiredTask = {
  actionLabel?: string;
  detail: string;
  fieldId?: string;
  id: string;
  label: string;
  targetElementId?: string;
  targetLayerId?: string;
  targetStep?: WorkbenchStep;
  tone: "local" | "remote";
};

type DiagramLayer = {
  id: string;
  label: string;
  roleLabel: string;
  thicknessLabel: string;
};

const OUTPUT_OPTIONS: readonly OutputOption[] = [
  { id: "Rw", label: "Rw", modes: ["wall", "floor"] },
  { id: "R'w", label: "R'w", modes: ["wall", "floor"] },
  { id: "DnT,w", label: "DnT,w", modes: ["wall", "floor"] },
  { id: "STC", label: "STC", modes: ["wall", "floor"] },
  { id: "C", label: "C", modes: ["wall", "floor"] },
  { id: "Ctr", label: "Ctr", modes: ["wall", "floor"] },
  { id: "Ln,w", label: "Ln,w", modes: ["floor"] },
  { id: "L'n,w", label: "L'n,w", modes: ["floor"] },
  { id: "L'nT,w", label: "L'nT,w", modes: ["floor"] },
  { id: "L'nT,50", label: "L'nT,50", modes: ["floor"] },
  { id: "DeltaLw", label: "DeltaLw", modes: ["floor"] }
];

const MATERIAL_OPTIONS: readonly MaterialOption[] = [
  {
    defaultThicknessMm: "12.5",
    id: "gypsum_board",
    label: "Gypsum board",
    modes: ["wall", "floor"],
    roleLabel: "Board"
  },
  {
    defaultThicknessMm: "50",
    id: "rockwool",
    label: "Rock wool",
    modes: ["wall", "floor"],
    roleLabel: "Cavity fill"
  },
  {
    defaultThicknessMm: "50",
    id: "air_gap",
    label: "Air gap",
    modes: ["wall"],
    roleLabel: "Cavity"
  },
  {
    defaultThicknessMm: "100",
    floorRole: "base_structure",
    id: "concrete",
    label: "Concrete",
    modes: ["wall", "floor"],
    roleLabel: "Base"
  },
  {
    defaultThicknessMm: "160",
    floorRole: "base_structure",
    id: "clt_panel",
    label: "CLT panel",
    modes: ["wall", "floor"],
    roleLabel: "Base"
  },
  {
    defaultThicknessMm: "40",
    floorRole: "floating_screed",
    id: "screed",
    label: "Floating screed",
    modes: ["floor"],
    roleLabel: "Floating screed"
  },
  {
    defaultThicknessMm: "5",
    floorRole: "resilient_layer",
    id: "generic_resilient_underlay",
    label: "Resilient underlay",
    modes: ["floor"],
    roleLabel: "Resilient layer"
  },
  {
    defaultThicknessMm: "10",
    floorRole: "floor_covering",
    id: "ceramic_tile",
    label: "Ceramic tile",
    modes: ["floor"],
    roleLabel: "Finish"
  }
];

const ROLE_OPTIONS: Record<StudyMode, readonly RoleOption[]> = {
  floor: [
    { label: "Base", value: "base_structure" },
    { label: "Resilient layer", value: "resilient_layer" },
    { label: "Floating screed", value: "floating_screed" },
    { label: "Upper fill", value: "upper_fill" },
    { label: "Finish", value: "floor_covering" },
    { label: "Ceiling cavity", value: "ceiling_cavity" },
    { label: "Ceiling fill", value: "ceiling_fill" },
    { label: "Ceiling board", value: "ceiling_board" }
  ],
  wall: [
    { label: "Side A", value: "side_a" },
    { label: "Cavity", value: "cavity" },
    { label: "Stud", value: "stud" },
    { label: "Core", value: "core" },
    { label: "Side B", value: "side_b" }
  ]
};

const INITIAL_LAYERS: readonly DraftLayer[] = [
  { id: "v2-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "v2-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "v2-layer-3", materialId: "concrete", role: "side_b", thicknessMm: "100" }
];

const INITIAL_CONTEXT: ContextDraft = {
  airborneMode: "element_lab",
  ci50_2500Db: "",
  ciDb: "",
  fieldKDb: "",
  impactReceivingRoomVolumeM3: "",
  loadBasisKgM2: "",
  panelHeightMm: "",
  panelWidthMm: "",
  receivingRoomRt60S: "",
  receivingRoomVolumeM3: "",
  resilientLayerDynamicStiffnessMNm3: ""
};

const STATUS_LABELS: Record<EstimateState["status"], string> = {
  blocked: "Needs input",
  error: "Error",
  idle: "Pending",
  loading: "Calculating",
  ready: "Ready"
};

const OUTPUT_STATUS_LABELS: Record<OutputStatus, string> = {
  live: "Ready",
  needs_input: "Needs input",
  pending: "Pending",
  unsupported: "Unsupported"
};

const CONTEXT_INPUT_IDS: Record<keyof ContextDraft, string> = {
  airborneMode: "workbench-v2-airborne-mode",
  ci50_2500Db: "workbench-v2-ci50-2500-db",
  ciDb: "workbench-v2-ci-db",
  fieldKDb: "workbench-v2-field-k-db",
  impactReceivingRoomVolumeM3: "workbench-v2-impact-room-volume",
  loadBasisKgM2: "workbench-v2-load-basis",
  panelHeightMm: "workbench-v2-panel-height",
  panelWidthMm: "workbench-v2-panel-width",
  receivingRoomRt60S: "workbench-v2-receiving-room-rt60",
  receivingRoomVolumeM3: "workbench-v2-receiving-room-volume",
  resilientLayerDynamicStiffnessMNm3: "workbench-v2-dynamic-stiffness"
};

const OUTPUT_PICKER_ID = "workbench-v2-output-picker";

function createLayerId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `layer-${Date.now()}`;
}

function createDraftLayer(mode: StudyMode, index: number): DraftLayer {
  const option = getMaterialOptions(mode)[0]!;
  return {
    id: createLayerId(),
    materialId: option.id,
    role: mode === "floor" ? option.floorRole ?? "base_structure" : ROLE_OPTIONS.wall[0]!.value,
    thicknessMm: index === 0 ? option.defaultThicknessMm : ""
  };
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

function parseThickness(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseOptionalNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseOptionalFiniteNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getMaterialOptions(mode: StudyMode): readonly MaterialOption[] {
  return MATERIAL_OPTIONS.filter((option) => option.modes.includes(mode));
}

function getMaterialOption(materialId: string): MaterialOption {
  return MATERIAL_OPTIONS.find((option) => option.id === materialId) ?? MATERIAL_OPTIONS[0]!;
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatDb(value: number): string {
  return Number.isInteger(value) ? `${value} dB` : `${value.toFixed(1)} dB`;
}

function compactMessage(value: string, maxLength = 92): string {
  const firstSentence = value.split(". ")[0]?.trim() || value.trim();
  const normalized = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3).trim()}...` : normalized;
}

function getLayerThicknessInputId(layerId: string): string {
  return `workbench-v2-layer-${layerId}-thickness`;
}

function getLayerThicknessLabel(layer: DraftLayer): string {
  const thickness = parseThickness(layer.thicknessMm);
  return thickness ? `${thickness} mm` : "Missing";
}

function getRoleLabel(mode: StudyMode, roleValue: string): string {
  return ROLE_OPTIONS[mode].find((role) => role.value === roleValue)?.label ?? roleValue.replace(/_/g, " ");
}

function normalizeMissingFieldId(fieldId: string): string {
  return fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function humanizeMissingFieldId(fieldId: string): string {
  const parts = fieldId.split(".");
  const lastPart = parts[parts.length - 1] ?? fieldId;
  return lastPart
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/M Nm3/g, "MN/m3")
    .replace(/M3/g, "m3")
    .replace(/Mm/g, "mm")
    .replace(/Db/g, "dB")
    .replace(/Rt60/g, "RT60")
    .trim();
}

function getMissingInputCopy(fieldId: string): Pick<RequiredTask, "detail" | "label" | "targetElementId"> {
  const normalized = normalizeMissingFieldId(fieldId);

  if (normalized.includes("ci502500db")) {
    return {
      detail: "Enter CI,50-2500 for low-frequency impact output.",
      label: "CI50 dB",
      targetElementId: CONTEXT_INPUT_IDS.ci50_2500Db
    };
  }

  if (normalized.includes("cidb")) {
    return {
      detail: "Enter impact spectrum adaptation term.",
      label: "CI dB",
      targetElementId: CONTEXT_INPUT_IDS.ciDb
    };
  }

  if (normalized.includes("fieldkdb")) {
    return {
      detail: "Enter field correction K.",
      label: "K correction",
      targetElementId: CONTEXT_INPUT_IDS.fieldKDb
    };
  }

  if (normalized.includes("impactfieldcontext") && normalized.includes("receivingroomvolumem3")) {
    return {
      detail: "Enter impact receiving-room volume.",
      label: "Impact room volume",
      targetElementId: CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3
    };
  }

  if (normalized.includes("receivingroomrt60s")) {
    return {
      detail: "Enter receiving-room reverberation time.",
      label: "RT60",
      targetElementId: CONTEXT_INPUT_IDS.receivingRoomRt60S
    };
  }

  if (normalized.includes("receivingroomvolumem3")) {
    return {
      detail: "Enter receiving-room volume.",
      label: "Room volume",
      targetElementId: CONTEXT_INPUT_IDS.receivingRoomVolumeM3
    };
  }

  if (normalized.includes("panelwidthmm")) {
    return {
      detail: "Enter panel width.",
      label: "Panel width",
      targetElementId: CONTEXT_INPUT_IDS.panelWidthMm
    };
  }

  if (normalized.includes("panelheightmm")) {
    return {
      detail: "Enter panel height.",
      label: "Panel height",
      targetElementId: CONTEXT_INPUT_IDS.panelHeightMm
    };
  }

  if (normalized.includes("loadbasiskgm2")) {
    return {
      detail: "Enter floor load basis.",
      label: "Load kg/m2",
      targetElementId: CONTEXT_INPUT_IDS.loadBasisKgM2
    };
  }

  if (normalized.includes("resilientlayerdynamicstiffnessmnm3")) {
    return {
      detail: "Enter resilient layer dynamic stiffness.",
      label: "Dynamic stiffness",
      targetElementId: CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3
    };
  }

  return {
    detail: "Enter the required physical input.",
    label: humanizeMissingFieldId(fieldId)
  };
}

function formatMissingInputList(fieldIds: readonly string[]): string {
  const labels = [...new Set(fieldIds.map((fieldId) => getMissingInputCopy(fieldId).label))];
  if (labels.length <= 2) {
    return labels.join(", ");
  }

  return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
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
    return result.supportedTargetOutputs.includes(outputId) ? "Calculated" : "Available";
  }

  if (boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId)) {
    return boundary.missingPhysicalInputs.length ? `Needs ${formatMissingInputList(boundary.missingPhysicalInputs)}` : "Needs input";
  }

  if (result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId)) {
    return "Unsupported for current route";
  }

  return "No value returned";
}

function buildOutputRows(result: AssemblyCalculation, selectedOutputs: readonly RequestedOutputId[]): readonly OutputRow[] {
  return selectedOutputs.map((outputId) => {
    const value = readOutputValue(result, outputId);
    const boundary = result.acousticAnswerBoundary;
    let status: OutputStatus = "pending";

    if (Number.isFinite(value)) {
      status = "live";
    } else if (boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId)) {
      status = "needs_input";
    } else if (result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId)) {
      status = "unsupported";
    }

    return {
      detail: getOutputDetail(result, outputId, status),
      label: outputId,
      status,
      value: value === null ? "--" : formatDb(value)
    };
  });
}

function buildLocalBlockerTasks(layers: readonly DraftLayer[], selectedOutputs: readonly RequestedOutputId[]): readonly RequiredTask[] {
  const tasks: RequiredTask[] = [];

  for (const [index, layer] of layers.entries()) {
    if (!parseThickness(layer.thicknessMm)) {
      tasks.push({
        actionLabel: "Edit",
        detail: `Enter thickness for layer ${index + 1}.`,
        id: `layer-${layer.id}-thickness`,
        label: `${getMaterialOption(layer.materialId).label} thickness`,
        targetElementId: getLayerThicknessInputId(layer.id),
        targetLayerId: layer.id,
        targetStep: "stack",
        tone: "local"
      });
    }
  }

  if (selectedOutputs.length === 0) {
    tasks.push({
      actionLabel: "Select",
      detail: "Choose at least one requested metric.",
      id: "selected-output-required",
      label: "No output selected",
      targetElementId: OUTPUT_PICKER_ID,
      targetStep: "setup",
      tone: "local"
    });
  }

  if (layers.length === 0) {
    tasks.push({
      actionLabel: "Add",
      detail: "Add a construction layer.",
      id: "layer-required",
      label: "No layers",
      targetStep: "stack",
      tone: "local"
    });
  }

  return tasks;
}

function buildLocalBlockers(layers: readonly DraftLayer[], selectedOutputs: readonly RequestedOutputId[]): readonly string[] {
  return buildLocalBlockerTasks(layers, selectedOutputs).map((task) => `${task.label}: ${task.detail}`);
}

function getRemoteRequiredTasks(result: AssemblyCalculation | null): readonly RequiredTask[] {
  const boundary = result?.acousticAnswerBoundary;
  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  const missingPhysicalInputs: readonly string[] = Array.from(new Set<string>(boundary.missingPhysicalInputs));
  return missingPhysicalInputs.map((fieldId: string) => {
    const copy = getMissingInputCopy(fieldId);
    return {
      actionLabel: copy.targetElementId ? "Enter" : undefined,
      detail: copy.detail,
      fieldId,
      id: `remote-${fieldId}`,
      label: copy.label,
      targetElementId: copy.targetElementId,
      targetStep: "setup",
      tone: "remote"
    };
  });
}

function buildRequiredTasks(
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  result: AssemblyCalculation | null
): readonly RequiredTask[] {
  const localTasks = buildLocalBlockerTasks(layers, selectedOutputs);

  return [...localTasks, ...getRemoteRequiredTasks(result)];
}

function buildEstimatePayload(
  mode: StudyMode,
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  context: ContextDraft
): EstimateRequest | null {
  const requestLayers: EstimateRequest["layers"] = [];

  for (const layer of layers) {
    const thicknessMm = parseThickness(layer.thicknessMm);
    if (!thicknessMm) {
      return null;
    }

    requestLayers.push({
      floorRole: mode === "floor" ? (layer.role as FloorRole) : undefined,
      materialId: layer.materialId,
      thicknessMm
    });
  }

  if (requestLayers.length === 0 || selectedOutputs.length === 0) {
    return null;
  }

  const airborneContext: EstimateRequest["airborneContext"] = {};
  const panelWidthMm = parseOptionalNumber(context.panelWidthMm);
  const panelHeightMm = parseOptionalNumber(context.panelHeightMm);
  const receivingRoomVolumeM3 = parseOptionalNumber(context.receivingRoomVolumeM3);
  const receivingRoomRt60S = parseOptionalNumber(context.receivingRoomRt60S);
  if (context.airborneMode !== "element_lab") {
    airborneContext.contextMode = context.airborneMode;
  }
  if (panelWidthMm) {
    airborneContext.panelWidthMm = panelWidthMm;
  }
  if (panelHeightMm) {
    airborneContext.panelHeightMm = panelHeightMm;
  }
  if (receivingRoomVolumeM3) {
    airborneContext.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  }
  if (receivingRoomRt60S) {
    airborneContext.receivingRoomRt60S = receivingRoomRt60S;
  }

  const impactFieldContext: EstimateRequest["impactFieldContext"] = {};
  const fieldKDb = parseOptionalFiniteNumber(context.fieldKDb);
  const ciDb = parseOptionalFiniteNumber(context.ciDb);
  const ci50_2500Db = parseOptionalFiniteNumber(context.ci50_2500Db);
  const impactReceivingRoomVolumeM3 = parseOptionalNumber(context.impactReceivingRoomVolumeM3);
  if (fieldKDb !== undefined) {
    impactFieldContext.fieldKDb = fieldKDb;
  }
  if (ciDb !== undefined) {
    impactFieldContext.ciDb = ciDb;
  }
  if (ci50_2500Db !== undefined) {
    impactFieldContext.ci50_2500Db = ci50_2500Db;
  }
  if (impactReceivingRoomVolumeM3) {
    impactFieldContext.receivingRoomVolumeM3 = impactReceivingRoomVolumeM3;
  }

  const floorImpactContext: EstimateRequest["floorImpactContext"] = {};
  const loadBasisKgM2 = parseOptionalNumber(context.loadBasisKgM2);
  const resilientLayerDynamicStiffnessMNm3 = parseOptionalNumber(context.resilientLayerDynamicStiffnessMNm3);
  if (loadBasisKgM2) {
    floorImpactContext.loadBasisKgM2 = loadBasisKgM2;
  }
  if (resilientLayerDynamicStiffnessMNm3) {
    floorImpactContext.resilientLayerDynamicStiffnessMNm3 = resilientLayerDynamicStiffnessMNm3;
  }

  const payload: EstimateRequest = {
    calculator: "dynamic",
    layers: requestLayers,
    targetOutputs: [...selectedOutputs]
  };

  if (Object.keys(airborneContext).length) {
    payload.airborneContext = airborneContext;
  }
  if (Object.keys(impactFieldContext).length) {
    payload.impactFieldContext = impactFieldContext;
  }
  if (mode === "floor" && Object.keys(floorImpactContext).length) {
    payload.floorImpactContext = floorImpactContext;
  }

  return payload;
}

function getPrimaryRow(rows: readonly OutputRow[]): OutputRow | null {
  return rows.find((row) => row.status === "live") ?? rows[0] ?? null;
}

function buildOutputStatusCounts(rows: readonly OutputRow[]): OutputStatusCounts {
  return rows.reduce<OutputStatusCounts>(
    (counts, row) => {
      counts[row.status] += 1;
      return counts;
    },
    {
      live: 0,
      needs_input: 0,
      pending: 0,
      unsupported: 0
    }
  );
}

function pluralizeOutput(count: number): string {
  return count === 1 ? "output" : "outputs";
}

function buildResultSummary(
  estimateState: EstimateState,
  primaryRow: OutputRow | null,
  resultRows: readonly OutputRow[],
  stoppedRows: readonly OutputRow[]
): ResultSummary {
  if (estimateState.status === "loading") {
    return {
      detail: "Running estimate for the current layer stack.",
      label: "Calculating",
      tone: "loading",
      value: "..."
    };
  }

  if (estimateState.status === "error") {
    return {
      detail: estimateState.message,
      label: "Estimate error",
      tone: "error",
      value: "--"
    };
  }

  if (estimateState.status === "blocked") {
    return {
      detail: estimateState.reasons[0] ?? "Complete required inputs.",
      label: "Needs input",
      tone: "blocked",
      value: "--"
    };
  }

  if (estimateState.status !== "ready") {
    return {
      detail: "Complete setup and layer inputs to calculate.",
      label: "Pending",
      tone: "pending",
      value: "--"
    };
  }

  if (primaryRow?.status === "live") {
    const stoppedDetail = stoppedRows.length
      ? `${stoppedRows.length} stopped ${pluralizeOutput(stoppedRows.length)}.`
      : "Selected outputs are live.";

    return {
      detail: `${primaryRow.detail}. ${stoppedDetail}`,
      label: primaryRow.label,
      tone: "ready",
      value: primaryRow.value
    };
  }

  if (!resultRows.length) {
    return {
      detail: "The estimate returned no selected output rows.",
      label: "No output",
      tone: "stopped",
      value: "--"
    };
  }

  if (resultRows.some((row) => row.status === "needs_input")) {
    return {
      detail: "Selected outputs need additional physical inputs.",
      label: "Needs input",
      tone: "stopped",
      value: "--"
    };
  }

  return {
    detail: "Selected outputs are unsupported for the current route.",
    label: "Unsupported",
    tone: "stopped",
    value: "--"
  };
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

function buildDiagramLayers(layers: readonly DraftLayer[], mode: StudyMode): readonly DiagramLayer[] {
  return layers.map((layer) => {
    const option = getMaterialOption(layer.materialId);

    return {
      id: layer.id,
      label: option.label,
      roleLabel: getRoleLabel(mode, layer.role),
      thicknessLabel: getLayerThicknessLabel(layer)
    };
  });
}

function buildCurvePath(result: AssemblyCalculation): string | null {
  const values: readonly number[] = result.curve.transmissionLossDb;
  if (values.length < 2) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  return values
    .map((value: number, index: number) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 40 - ((value - min) / span) * 34;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function needsAirborneContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const selectedFieldOutput = selectedOutputs.some((output) => output === "R'w" || output.startsWith("Dn"));
  const boundaryNeedsAirborne = result?.acousticAnswerBoundary?.missingPhysicalInputs.some(
    (field: string) => field.includes("receivingRoom") || field.includes("panel")
  );
  return Boolean(selectedFieldOutput || boundaryNeedsAirborne);
}

function needsImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const selectedImpactFieldOutput = selectedOutputs.some((output) => output.includes("'n") || output.includes("L'nT") || output === "CI" || output === "CI,50-2500");
  const boundaryNeedsImpact = result?.acousticAnswerBoundary?.missingPhysicalInputs.some((field: string) => field.includes("impactFieldContext"));
  return Boolean(selectedImpactFieldOutput || boundaryNeedsImpact);
}

function needsFloorImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const selectedFloorFormulaOutput = selectedOutputs.some((output) => output === "DeltaLw");
  const boundaryNeedsFloor = result?.acousticAnswerBoundary?.missingPhysicalInputs.some(
    (field: string) => field.includes("loadBasisKgM2") || field.includes("resilientLayerDynamicStiffnessMNm3")
  );
  return Boolean(selectedFloorFormulaOutput || boundaryNeedsFloor);
}

export function WorkbenchV2Shell() {
  const [mode, setMode] = useState<StudyMode>("wall");
  const [selectedOutputs, setSelectedOutputs] = useState<readonly RequestedOutputId[]>(["Rw"]);
  const [layers, setLayers] = useState<readonly DraftLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(INITIAL_LAYERS[0]!.id);
  const [context, setContext] = useState<ContextDraft>(INITIAL_CONTEXT);
  const [estimateState, setEstimateState] = useState<EstimateState>({ status: "idle" });

  const availableOutputs = OUTPUT_OPTIONS.filter((output) => output.modes.includes(mode));
  const materialOptions = getMaterialOptions(mode);
  const roleOptions = ROLE_OPTIONS[mode];
  const totalThickness = useMemo(
    () => layers.reduce((total, layer) => total + (parseThickness(layer.thicknessMm) ?? 0), 0),
    [layers]
  );
  const estimateResult = estimateState.status === "ready" ? estimateState.result : null;
  const requiredTasks = useMemo(() => buildRequiredTasks(layers, selectedOutputs, estimateResult), [estimateResult, layers, selectedOutputs]);
  const diagramLayers = useMemo(() => buildDiagramLayers(layers, mode), [layers, mode]);
  const selectedOutputLabels = availableOutputs
    .filter((output) => selectedOutputs.includes(output.id))
    .map((output) => output.label);
  const selectedOutputSummary =
    selectedOutputLabels.length === 0
      ? "No outputs"
      : selectedOutputLabels.length <= 3
        ? selectedOutputLabels.join(", ")
        : `${selectedOutputLabels.slice(0, 3).join(", ")} +${selectedOutputLabels.length - 3}`;
  const resultRows = estimateState.status === "ready" ? buildOutputRows(estimateState.result, selectedOutputs) : [];
  const primaryRow = getPrimaryRow(resultRows);
  const stoppedRows = resultRows.filter((row) => row.status !== "live");
  const visibleWarnings: readonly string[] =
    estimateState.status === "ready" ? estimateState.result.warnings.slice(0, 3).map((warning: string) => compactMessage(warning)) : [];
  const curvePath = estimateState.status === "ready" ? buildCurvePath(estimateState.result) : null;
  const outputStatusCounts = buildOutputStatusCounts(resultRows);
  const resultSummary = buildResultSummary(estimateState, primaryRow, resultRows, stoppedRows);
  const firstRequiredTask = requiredTasks[0] ?? null;
  const showAirborneContext = needsAirborneContext(selectedOutputs, estimateResult);
  const showImpactContext = mode === "floor" && needsImpactContext(selectedOutputs, estimateResult);
  const showFloorImpactContext = mode === "floor" && needsFloorImpactContext(selectedOutputs, estimateResult);
  const canOpenReport = primaryRow?.status === "live";
  const canReviewStoppedOutputs = estimateState.status === "ready" && !canOpenReport && stoppedRows.length > 0 && requiredTasks.length === 0;
  const reportHref = "/workbench/proposal";

  useEffect(() => {
    const localReasons = buildLocalBlockers(layers, selectedOutputs);
    if (localReasons.length) {
      setEstimateState({ reasons: localReasons, status: "blocked" });
      return;
    }

    const payload = buildEstimatePayload(mode, layers, selectedOutputs, context);
    if (!payload) {
      setEstimateState({ status: "idle" });
      return;
    }

    const controller = new AbortController();

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

    return () => controller.abort();
  }, [context, layers, mode, selectedOutputs]);

  function setModeAndDefaults(nextMode: StudyMode) {
    setMode(nextMode);
    setSelectedOutputs(nextMode === "floor" ? ["Ln,w"] : ["Rw"]);
    setLayers((current) =>
      current.map((layer, index) => {
        const option = getMaterialOptions(nextMode)[Math.min(index, getMaterialOptions(nextMode).length - 1)]!;
        return {
          ...layer,
          materialId: option.id,
          role: nextMode === "floor" ? option.floorRole ?? "base_structure" : ROLE_OPTIONS.wall[Math.min(index, ROLE_OPTIONS.wall.length - 1)]!.value,
          thicknessMm: layer.thicknessMm || option.defaultThicknessMm
        };
      })
    );
  }

  function updateLayer(layerId: string, patch: Partial<DraftLayer>) {
    setLayers((current) => current.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)));
  }

  function updateContext(patch: Partial<ContextDraft>) {
    setContext((current) => ({ ...current, ...patch }));
  }

  function addLayer() {
    const nextLayer = createDraftLayer(mode, layers.length);
    setLayers((current) => [...current, nextLayer]);
    setSelectedLayerId(nextLayer.id);
  }

  function duplicateLayer(layerId: string) {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === layerId);
      const layer = current[index];
      if (!layer) {
        return current;
      }

      const next = [...current];
      const duplicate = { ...layer, id: createLayerId() };
      next.splice(index + 1, 0, duplicate);
      setSelectedLayerId(duplicate.id);
      return next;
    });
  }

  function removeLayer(layerId: string) {
    setLayers((current) => current.filter((layer) => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(layers.find((layer) => layer.id !== layerId)?.id ?? "");
    }
  }

  function moveLayer(layerId: string, direction: "down" | "up") {
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === layerId);
      if (index === -1) {
        return current;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      return moveItem(current, index, nextIndex);
    });
  }

  function toggleOutput(outputId: RequestedOutputId) {
    setSelectedOutputs((current) => {
      if (current.includes(outputId)) {
        return current.filter((id) => id !== outputId);
      }

      return [...current, outputId];
    });
  }

  function handleRequiredTaskAction(task: RequiredTask) {
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

  function focusOutputPicker() {
    window.setTimeout(() => {
      const target = document.getElementById(OUTPUT_PICKER_ID);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.focus({ preventScroll: true });
    }, 0);
  }

  function updateMaterial(layer: DraftLayer, materialId: string) {
    const option = getMaterialOption(materialId);
    updateLayer(layer.id, {
      materialId,
      role: mode === "floor" ? option.floorRole ?? layer.role : layer.role
    });
  }

  return (
    <main className="ui-app-surface">
      <div className="ui-workbench-shell">
        <header className="ui-workbench-header">
          <div className="min-w-0">
            <div className="eyebrow">Workbench</div>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-[color:var(--ink)]">Acoustic calculator</h1>
          </div>
          <div className="ui-workbench-statusline">
            <span className="ui-chip">{mode === "wall" ? "Wall" : "Floor"}</span>
            <span className="ui-chip">{layers.length} layers</span>
            <span className="ui-chip">{selectedOutputSummary}</span>
            <span
              className={classNames(
                "ui-chip",
                estimateState.status === "ready"
                  ? "ui-chip-success"
                  : estimateState.status === "blocked" || estimateState.status === "error"
                    ? "ui-chip-warning"
                    : ""
              )}
            >
              {STATUS_LABELS[estimateState.status]}
            </span>
          </div>
        </header>

        <section className="ui-workbench-grid" aria-label="Calculator workspace">
          <div className="ui-workbench-main">
            <section className="ui-workbench-section">
              <div className="ui-workbench-section-header">
                <div>
                  <h2>Setup</h2>
                  <p>Mode and requested outputs.</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {(["wall", "floor"] as const).map((nextMode) => (
                    <button
                      aria-pressed={mode === nextMode}
                      className={classNames("focus-ring ui-button capitalize", mode === nextMode ? "ui-button-primary" : "")}
                      key={nextMode}
                      onClick={() => setModeAndDefaults(nextMode)}
                      type="button"
                    >
                      {nextMode}
                    </button>
                  ))}
                </div>

                <div className="ui-output-grid" id={OUTPUT_PICKER_ID} tabIndex={-1}>
                  {availableOutputs.map((output) => (
                    <label className="ui-output-toggle" key={output.id}>
                      <input
                        checked={selectedOutputs.includes(output.id)}
                        className="h-4 w-4 accent-[color:var(--accent)]"
                        onChange={() => toggleOutput(output.id)}
                        type="checkbox"
                      />
                      <span>{output.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {showAirborneContext || showImpactContext || showFloorImpactContext ? (
              <section className="ui-workbench-section">
                <div className="ui-workbench-section-header">
                  <div>
                    <h2>Required inputs</h2>
                    <p>Only fields needed by the selected route.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {showAirborneContext ? (
                    <div className="ui-input-grid">
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Airborne mode</span>
                        <select
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.airborneMode}
                          onChange={(event) => updateContext({ airborneMode: event.target.value as AirborneContextMode })}
                          value={context.airborneMode}
                        >
                          <option value="element_lab">Lab</option>
                          <option value="field_between_rooms">Field</option>
                          <option value="building_prediction">Building</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Width mm</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.panelWidthMm}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ panelWidthMm: event.target.value })}
                          value={context.panelWidthMm}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Height mm</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.panelHeightMm}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ panelHeightMm: event.target.value })}
                          value={context.panelHeightMm}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Room m3</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.receivingRoomVolumeM3}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ receivingRoomVolumeM3: event.target.value })}
                          value={context.receivingRoomVolumeM3}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">RT60 s</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.receivingRoomRt60S}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ receivingRoomRt60S: event.target.value })}
                          value={context.receivingRoomRt60S}
                        />
                      </label>
                    </div>
                  ) : null}

                  {showImpactContext ? (
                    <div className="ui-input-grid">
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">K dB</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.fieldKDb}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ fieldKDb: event.target.value })}
                          value={context.fieldKDb}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Impact m3</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ impactReceivingRoomVolumeM3: event.target.value })}
                          value={context.impactReceivingRoomVolumeM3}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">CI dB</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.ciDb}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ ciDb: event.target.value })}
                          value={context.ciDb}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">CI50 dB</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.ci50_2500Db}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ ci50_2500Db: event.target.value })}
                          value={context.ci50_2500Db}
                        />
                      </label>
                    </div>
                  ) : null}

                  {showFloorImpactContext ? (
                    <div className="ui-input-grid">
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Stiffness</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ resilientLayerDynamicStiffnessMNm3: event.target.value })}
                          value={context.resilientLayerDynamicStiffnessMNm3}
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="ui-field-label">Load kg/m2</span>
                        <input
                          className="focus-ring ui-field ui-field-sm"
                          id={CONTEXT_INPUT_IDS.loadBasisKgM2}
                          inputMode="decimal"
                          onChange={(event) => updateContext({ loadBasisKgM2: event.target.value })}
                          value={context.loadBasisKgM2}
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section className="ui-workbench-section">
              <div className="ui-workbench-section-header">
                <div>
                  <h2>Layer stack</h2>
                  <p>{totalThickness.toFixed(1)} mm total.</p>
                </div>
                <button className="focus-ring ui-button ui-button-primary h-9" onClick={addLayer} type="button">
                  <Plus className="h-4 w-4" />
                  Add layer
                </button>
              </div>

              <div className="ui-workbench-stack-map" aria-label="Layer order">
                {diagramLayers.map((layer, index) => (
                  <button
                    aria-pressed={selectedLayerId === layer.id}
                    className="focus-ring ui-workbench-stack-item"
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    type="button"
                  >
                    <span className="ui-workbench-stack-index">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{layer.label}</span>
                      <span className="block truncate text-xs text-[color:var(--ink-faint)]">
                        {layer.roleLabel} · {layer.thicknessLabel}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                <div className="ui-workbench-layer-head">
                  <span>No</span>
                  <span>Material</span>
                  <span>Role</span>
                  <span>Thickness</span>
                  <span>Actions</span>
                </div>

                {layers.map((layer, index) => (
                  <article
                    className={classNames("ui-workbench-layer-edit", selectedLayerId === layer.id ? "ui-edit-row-active" : "")}
                    key={layer.id}
                    onFocus={() => setSelectedLayerId(layer.id)}
                  >
                    <button
                      aria-label={`Select layer ${index + 1}`}
                      aria-pressed={selectedLayerId === layer.id}
                      className="focus-ring ui-workbench-layer-number"
                      onClick={() => setSelectedLayerId(layer.id)}
                      type="button"
                    >
                      {index + 1}
                    </button>
                    <button
                      aria-expanded={selectedLayerId === layer.id}
                      className="focus-ring ui-workbench-layer-mobile-summary"
                      onClick={() => setSelectedLayerId(layer.id)}
                      type="button"
                    >
                      <span className="block truncate font-semibold">{getMaterialOption(layer.materialId).label}</span>
                      <span className="block truncate text-xs text-[color:var(--ink-faint)]">
                        {getRoleLabel(mode, layer.role)} · {getLayerThicknessLabel(layer)}
                      </span>
                    </button>
                    <div className={classNames("ui-workbench-layer-fields", selectedLayerId === layer.id ? "grid" : "hidden")}>
                      <label className="min-w-0">
                        <span className="sr-only">Layer {index + 1} material</span>
                        <select
                          className="focus-ring ui-field w-full"
                          onChange={(event) => updateMaterial(layer, event.target.value)}
                          onFocus={() => setSelectedLayerId(layer.id)}
                          value={layer.materialId}
                        >
                          {materialOptions.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="min-w-0">
                        <span className="sr-only">Layer {index + 1} role</span>
                        <select
                          className="focus-ring ui-field w-full"
                          onChange={(event) => updateLayer(layer.id, { role: event.target.value })}
                          onFocus={() => setSelectedLayerId(layer.id)}
                          value={layer.role}
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="min-w-0">
                        <span className="sr-only">Layer {index + 1} thickness</span>
                        <input
                          className="focus-ring ui-field w-full"
                          id={getLayerThicknessInputId(layer.id)}
                          inputMode="decimal"
                          onChange={(event) => updateLayer(layer.id, { thicknessMm: event.target.value })}
                          onFocus={() => setSelectedLayerId(layer.id)}
                          placeholder="mm"
                          value={layer.thicknessMm}
                        />
                      </label>
                      <div className="ui-workbench-layer-actions">
                        <button
                          aria-label={`Move layer ${index + 1} up`}
                          className="focus-ring ui-button ui-icon-button"
                          disabled={index === 0}
                          onClick={() => moveLayer(layer.id, "up")}
                          type="button"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Move layer ${index + 1} down`}
                          className="focus-ring ui-button ui-icon-button"
                          disabled={index === layers.length - 1}
                          onClick={() => moveLayer(layer.id, "down")}
                          type="button"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Duplicate layer ${index + 1}`}
                          className="focus-ring ui-button ui-icon-button"
                          onClick={() => duplicateLayer(layer.id)}
                          type="button"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Remove layer ${index + 1}`}
                          className="focus-ring ui-button ui-button-ghost ui-icon-button text-[color:var(--warning-ink)]"
                          onClick={() => removeLayer(layer.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="ui-workbench-inspector" aria-label="Result and report">
            <section className="ui-workbench-result" aria-live="polite">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">
                {resultSummary.label}
              </div>
              <div className="mt-2 metric-number text-4xl font-semibold text-[color:var(--ink)]">
                {resultSummary.value}
              </div>
              <div className="mt-3 text-sm leading-5 text-[color:var(--ink-soft)]">
                {resultSummary.detail}
              </div>
              {resultRows.length ? (
                <div className="ui-workbench-result-meta">
                  <span>{outputStatusCounts.live} ready</span>
                  <span>{outputStatusCounts.needs_input} input</span>
                  <span>{outputStatusCounts.unsupported} unsupported</span>
                </div>
              ) : null}
            </section>

            {firstRequiredTask ? (
              <section className="ui-workbench-section">
                <div className="ui-workbench-section-header">
                  <div>
                    <h2>Next input</h2>
                    <p>{requiredTasks.length} open.</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {requiredTasks.slice(0, 4).map((task) => (
                    <button
                      className={classNames(
                        "focus-ring ui-required-row",
                        task.tone === "remote" ? "ui-required-row-warning" : ""
                      )}
                      key={task.id}
                      onClick={() => handleRequiredTaskAction(task)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{task.label}</span>
                        <span className="block truncate text-xs text-[color:var(--ink-faint)]">{task.detail}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            ) : canReviewStoppedOutputs ? (
              <section className="ui-workbench-section">
                <button className="focus-ring ui-button h-10 w-full" onClick={focusOutputPicker} type="button">
                  Review outputs
                  <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            ) : null}

            {resultRows.length ? (
              <section className="ui-workbench-section">
                <div className="ui-workbench-section-header">
                  <div>
                    <h2>Selected outputs</h2>
                    <p>{resultRows.length} rows.</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {resultRows.map((row) => (
                    <div className="ui-output-row" key={row.label}>
                      <span className="font-semibold">{row.label}</span>
                      <span className="min-w-0 truncate text-[color:var(--ink-faint)]">{row.detail}</span>
                      <span className="font-semibold">{row.value}</span>
                      <span
                        className={classNames(
                          "ui-chip ui-chip-compact",
                          row.status === "live" ? "ui-chip-success" : row.status === "needs_input" ? "ui-chip-warning" : ""
                        )}
                      >
                        {OUTPUT_STATUS_LABELS[row.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {curvePath ? (
              <section className="ui-workbench-section">
                <div className="ui-workbench-section-header">
                  <div>
                    <h2>Curve</h2>
                    <p>{estimateState.status === "ready" ? estimateState.result.curve.frequenciesHz.length : 0} points.</p>
                  </div>
                </div>
                <svg aria-label="Transmission loss curve" className="h-16 w-full" preserveAspectRatio="none" viewBox="0 0 100 44">
                  <path d="M 0 40 H 100" stroke="currentColor" strokeOpacity="0.18" />
                  <path d={curvePath} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
                </svg>
              </section>
            ) : null}

            {estimateState.status === "ready" ? (
              <section className="ui-workbench-section">
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold">Route detail</summary>
                  <div className="mt-3 grid gap-2 text-[color:var(--ink-soft)]">
                    <div className="grid grid-cols-[6rem_1fr] gap-2">
                      <span>Method</span>
                      <span className="font-semibold text-[color:var(--ink)]">{estimateState.result.metrics.method}</span>
                    </div>
                    <div className="grid grid-cols-[6rem_1fr] gap-2">
                      <span>Mass</span>
                      <span className="font-semibold text-[color:var(--ink)]">{estimateState.result.metrics.surfaceMassKgM2.toFixed(1)} kg/m2</span>
                    </div>
                    <div className="grid grid-cols-[6rem_1fr] gap-2">
                      <span>Thickness</span>
                      <span className="font-semibold text-[color:var(--ink)]">{estimateState.result.metrics.totalThicknessMm.toFixed(1)} mm</span>
                    </div>
                    {estimateState.result.calculatorLabel ? (
                      <div className="grid grid-cols-[6rem_1fr] gap-2">
                        <span>Calculator</span>
                        <span className="font-semibold text-[color:var(--ink)]">{estimateState.result.calculatorLabel}</span>
                      </div>
                    ) : null}
                  </div>
                </details>
              </section>
            ) : null}

            {visibleWarnings.length ? (
              <section className="ui-workbench-section">
                <div className="ui-workbench-section-header">
                  <div>
                    <h2>Warnings</h2>
                    <p>{visibleWarnings.length} shown.</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {visibleWarnings.map((warning) => (
                    <div className="ui-required-row" key={warning}>
                      {warning}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="ui-workbench-section">
              <div className="ui-workbench-section-header">
                <div>
                  <h2>Report</h2>
                  <p>Existing PDF route.</p>
                </div>
              </div>
              {canOpenReport ? (
                <Link className="focus-ring ui-button ui-button-primary h-10 w-full" href={reportHref}>
                  <FileText className="h-4 w-4" />
                  Open PDF report
                </Link>
              ) : (
                <button className="focus-ring ui-button h-10 w-full" disabled type="button">
                  <FileText className="h-4 w-4" />
                  Open PDF report
                </button>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
