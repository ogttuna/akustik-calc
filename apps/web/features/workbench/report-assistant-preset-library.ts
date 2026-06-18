import type { WorkbenchV2UserPresetSummary } from "../../lib/workbench-v2-preset-storage";
import {
  WORKBENCH_V2_COMMON_PRESETS,
  type WorkbenchV2CommonPreset
} from "../workbench-rebuild/workbench-v2-common-presets";

export type ReportAssistantPresetSummary = {
  description?: string;
  hasCustomMaterials: boolean;
  hasVisualOverrides: boolean;
  id: string;
  kind: "common" | "user";
  layerCount: number;
  name: string;
  presetRoute: "floor" | "wall";
  selectedOutputCount: number;
  sourceLabel?: string;
  sourceMetric?: string;
  sourceTargetValueDb?: number;
  tags?: readonly string[];
  updatedAtIso: string;
};

export type ReportAssistantPresetLibrarySummary = {
  commonPresetCount: number;
  commonPresets: readonly ReportAssistantPresetSummary[];
  recentUserPresets: readonly ReportAssistantPresetSummary[];
  userPresetCount?: number;
};

export type ReportAssistantPresetReadToolName =
  | "list_common_preset_summaries"
  | "list_user_preset_summaries"
  | "read_common_preset_snapshot"
  | "read_user_preset_snapshot";

export type ReportAssistantPresetReadToolDefinition = {
  description: string;
  mutates: false;
  name: ReportAssistantPresetReadToolName;
  requiredInputs: readonly string[];
};

export const REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS: readonly ReportAssistantPresetReadToolDefinition[] = [
  {
    description: "List built-in common preset summaries without full Workbench V2 snapshots.",
    mutates: false,
    name: "list_common_preset_summaries",
    requiredInputs: []
  },
  {
    description: "List owner-scoped user preset summaries without full Workbench V2 snapshots.",
    mutates: false,
    name: "list_user_preset_summaries",
    requiredInputs: []
  },
  {
    description: "Read one built-in common preset snapshot by explicit preset id.",
    mutates: false,
    name: "read_common_preset_snapshot",
    requiredInputs: ["presetId"]
  },
  {
    description: "Read one owner-scoped user preset snapshot by explicit preset id.",
    mutates: false,
    name: "read_user_preset_snapshot",
    requiredInputs: ["presetId"]
  }
];

const MAX_ASSISTANT_COMMON_PRESETS = 8;
const MAX_ASSISTANT_USER_PRESETS = 8;

function summarizeCommonPreset(preset: WorkbenchV2CommonPreset): ReportAssistantPresetSummary {
  const firstSource = preset.sourceReferences[0];

  return {
    description: preset.description,
    hasCustomMaterials: preset.snapshot.customMaterials.length > 0,
    hasVisualOverrides: preset.snapshot.materialVisualOverrides.length > 0,
    id: preset.id,
    kind: "common",
    layerCount: preset.snapshot.layers.length,
    name: preset.label,
    presetRoute: preset.snapshot.mode,
    selectedOutputCount: preset.snapshot.selectedOutputs.length,
    sourceLabel: firstSource?.sourceLabel,
    sourceMetric: firstSource?.metric,
    sourceTargetValueDb: firstSource?.targetValue,
    tags: preset.tags.slice(0, 8),
    updatedAtIso: preset.snapshot.savedAtIso
  };
}

function summarizeUserPreset(preset: WorkbenchV2UserPresetSummary): ReportAssistantPresetSummary {
  return {
    description: preset.description,
    hasCustomMaterials: preset.hasCustomMaterials ?? false,
    hasVisualOverrides: preset.hasVisualOverrides ?? false,
    id: preset.id,
    kind: "user",
    layerCount: preset.layerCount,
    name: preset.name,
    presetRoute: preset.kind,
    selectedOutputCount: preset.selectedOutputCount ?? 0,
    updatedAtIso: preset.updatedAtIso
  };
}

export function getReportAssistantCommonPresetSummaries(
  presets: readonly WorkbenchV2CommonPreset[] = WORKBENCH_V2_COMMON_PRESETS
): ReportAssistantPresetSummary[] {
  return presets.map(summarizeCommonPreset);
}

export function buildReportAssistantPresetLibrarySummary(input?: {
  commonPresets?: readonly WorkbenchV2CommonPreset[];
  userPresets?: readonly WorkbenchV2UserPresetSummary[];
}): ReportAssistantPresetLibrarySummary {
  const commonPresets = getReportAssistantCommonPresetSummaries(input?.commonPresets);
  const recentUserPresets = (input?.userPresets ?? []).map(summarizeUserPreset);

  return {
    commonPresetCount: commonPresets.length,
    commonPresets: commonPresets.slice(0, MAX_ASSISTANT_COMMON_PRESETS),
    recentUserPresets: recentUserPresets.slice(0, MAX_ASSISTANT_USER_PRESETS),
    userPresetCount: input?.userPresets?.length
  };
}

export function getDefaultReportAssistantPresetLibrarySummary(): ReportAssistantPresetLibrarySummary {
  return buildReportAssistantPresetLibrarySummary();
}
