import {
  DEFAULT_CRITERIA_PACK_ID,
  getCriteriaPackById,
  type CriteriaPackId
} from "./criteria-packs";
import { getPresetById, type PresetId, type StudyMode } from "./preset-definitions";
import type { LayerDraft, ScenarioSnapshot } from "./workbench-store";

export const SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID = "dynecho.simple-workbench.snapshot.v1";

export type ServerProjectWorkbenchSnapshot = ScenarioSnapshot & {
  schemaId: typeof SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStudyMode(value: unknown): value is StudyMode {
  return value === "floor" || value === "wall";
}

function parsePresetId(value: unknown, studyMode: StudyMode): PresetId | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const preset = getPresetById(value as PresetId);
    return preset.studyMode === studyMode ? preset.id : null;
  } catch {
    return null;
  }
}

function parseCriteriaPackId(value: unknown): CriteriaPackId {
  if (typeof value !== "string") {
    return DEFAULT_CRITERIA_PACK_ID;
  }

  try {
    return getCriteriaPackById(value as CriteriaPackId).id;
  } catch {
    return DEFAULT_CRITERIA_PACK_ID;
  }
}

function parseLayerDraft(value: unknown): LayerDraft | null {
  if (!isObjectRecord(value) || typeof value.materialId !== "string" || typeof value.thicknessMm !== "string") {
    return null;
  }

  return {
    densityKgM3: typeof value.densityKgM3 === "string" ? value.densityKgM3 : undefined,
    dynamicStiffnessMNm3: typeof value.dynamicStiffnessMNm3 === "string" ? value.dynamicStiffnessMNm3 : undefined,
    floorRole:
      value.floorRole === "base_structure" ||
      value.floorRole === "floating_screed" ||
      value.floorRole === "resilient_layer" ||
      value.floorRole === "floor_covering" ||
      value.floorRole === "upper_fill" ||
      value.floorRole === "ceiling_cavity" ||
      value.floorRole === "ceiling_board" ||
      value.floorRole === "ceiling_fill"
        ? value.floorRole
        : undefined,
    id: typeof value.id === "string" && value.id.trim().length > 0 ? value.id : crypto.randomUUID(),
    materialId: value.materialId,
    thicknessMm: value.thicknessMm
  };
}

export function buildServerProjectWorkbenchSnapshot(snapshot: ScenarioSnapshot): ServerProjectWorkbenchSnapshot {
  return {
    ...snapshot,
    schemaId: SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID
  };
}

export function parseServerProjectWorkbenchSnapshot(value: unknown): ScenarioSnapshot | null {
  if (!isObjectRecord(value) || value.schemaId !== SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.projectName !== "string" ||
    typeof value.savedAtIso !== "string" ||
    !isStudyMode(value.studyMode) ||
    !Array.isArray(value.rows)
  ) {
    return null;
  }

  const presetId = parsePresetId(value.presetId, value.studyMode);
  if (!presetId) {
    return null;
  }

  const rows = value.rows.map((row) => parseLayerDraft(row)).filter((row): row is LayerDraft => row !== null);

  return {
    ...(value as ScenarioSnapshot),
    criteriaPackId: parseCriteriaPackId(value.criteriaPackId),
    presetId,
    rows,
    studyMode: value.studyMode
  };
}
