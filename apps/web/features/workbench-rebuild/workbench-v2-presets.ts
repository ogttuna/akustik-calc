import type {
  WorkbenchV2ProjectSnapshot,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2PresetStatus = "error" | "idle" | "loading" | "restoring" | "syncing";

export type WorkbenchV2PresetSummary = {
  createdAtIso: string;
  description?: string;
  hasCustomMaterials?: boolean;
  hasVisualOverrides?: boolean;
  id: string;
  kind: WorkbenchV2StudyMode;
  layerCount: number;
  name: string;
  selectedOutputCount?: number;
  updatedAtIso: string;
};

export type WorkbenchV2PresetRecord = WorkbenchV2PresetSummary & {
  snapshot: unknown;
};

export const WORKBENCH_V2_PRESET_NAME_MAX_LENGTH = 160;
export const WORKBENCH_V2_PRESET_DESCRIPTION_MAX_LENGTH = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePresetKind(value: unknown): WorkbenchV2StudyMode | null {
  return value === "floor" || value === "wall" ? value : null;
}

function normalizeForStableSerialization(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForStableSerialization);
  }
  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, normalizeForStableSerialization(value[key])])
  );
}

function stableSerialize(value: unknown): string {
  return JSON.stringify(normalizeForStableSerialization(value));
}

function getPresetDraftComparable(snapshot: WorkbenchV2ProjectSnapshot) {
  return {
    context: snapshot.context,
    customMaterials: snapshot.customMaterials,
    layers: snapshot.layers,
    materialVisualOverrides: snapshot.materialVisualOverrides,
    mode: snapshot.mode,
    selectedOutputs: snapshot.selectedOutputs
  };
}

export function workbenchV2SnapshotsRepresentSameDraft(left: WorkbenchV2ProjectSnapshot, right: WorkbenchV2ProjectSnapshot): boolean {
  return stableSerialize(getPresetDraftComparable(left)) === stableSerialize(getPresetDraftComparable(right));
}

export function parseWorkbenchV2PresetSummary(value: unknown): WorkbenchV2PresetSummary | null {
  if (
    !isRecord(value) ||
    typeof value.createdAtIso !== "string" ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    (value.description !== undefined && typeof value.description !== "string") ||
    typeof value.layerCount !== "number" ||
    !Number.isInteger(value.layerCount) ||
    value.layerCount < 0 ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  const kind = parsePresetKind(value.kind);
  if (!kind) {
    return null;
  }

  return {
    createdAtIso: value.createdAtIso,
    description: value.description,
    hasCustomMaterials: typeof value.hasCustomMaterials === "boolean" ? value.hasCustomMaterials : undefined,
    hasVisualOverrides: typeof value.hasVisualOverrides === "boolean" ? value.hasVisualOverrides : undefined,
    id: value.id,
    kind,
    layerCount: value.layerCount,
    name: value.name,
    selectedOutputCount:
      typeof value.selectedOutputCount === "number" &&
      Number.isInteger(value.selectedOutputCount) &&
      value.selectedOutputCount >= 0
        ? value.selectedOutputCount
        : undefined,
    updatedAtIso: value.updatedAtIso
  };
}

export function parseWorkbenchV2PresetSummaries(value: unknown): WorkbenchV2PresetSummary[] {
  if (!isRecord(value) || !Array.isArray(value.presets)) {
    return [];
  }

  return value.presets
    .map(parseWorkbenchV2PresetSummary)
    .filter((preset): preset is WorkbenchV2PresetSummary => preset !== null);
}

export function parseWorkbenchV2PresetRecord(value: unknown): WorkbenchV2PresetRecord | null {
  if (!isRecord(value) || !isRecord(value.preset) || !("snapshot" in value.preset)) {
    return null;
  }

  const summary = parseWorkbenchV2PresetSummary(value.preset);
  if (!summary) {
    return null;
  }

  return {
    ...summary,
    snapshot: value.preset.snapshot
  };
}

export function formatWorkbenchV2PresetKindLabel(kind: WorkbenchV2StudyMode): string {
  return kind === "floor" ? "Floor" : "Wall";
}

export function formatWorkbenchV2PresetLayerCount(layerCount: number): string {
  return `${layerCount} layer${layerCount === 1 ? "" : "s"}`;
}

export function formatWorkbenchV2PresetUpdatedDateLabel(updatedAtIso: string): string {
  const updatedAt = new Date(updatedAtIso);

  if (Number.isNaN(updatedAt.getTime())) {
    return "Updated date unavailable";
  }

  return `Updated ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(updatedAt)}`;
}

export function formatWorkbenchV2PresetTriggerStatus(presetCount: number): string {
  return presetCount === 0 ? "No templates" : `${presetCount} saved`;
}

export function formatWorkbenchV2PresetLibraryTriggerStatus(savedPresetCount: number, commonPresetCount: number): string {
  if (savedPresetCount === 0) {
    return commonPresetCount === 0 ? "No templates" : `${commonPresetCount} common`;
  }

  return commonPresetCount === 0 ? `${savedPresetCount} saved` : `${savedPresetCount} saved, ${commonPresetCount} common`;
}
