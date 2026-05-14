import type {
  AirborneBuildingPredictionOutputBasis,
  AirborneConservativeFlankingAssumption,
  AirborneFlankingJunctionClass,
  AirborneResilientBarSideCount
} from "@dynecho/shared";

import {
  DEFAULT_CRITERIA_PACK_ID,
  getCriteriaPackById,
  type CriteriaPackId
} from "./criteria-packs";
import { getPresetById, type PresetId, type StudyMode } from "./preset-definitions";
import {
  makeWorkbenchOpeningLeakElementDraft,
  type WorkbenchOpeningLeakElementDraft
} from "./opening-leak-composite-input-surface";
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

function parseAirborneResilientBarSideCount(value: unknown): AirborneResilientBarSideCount | undefined {
  return value === "auto" || value === "one_side" || value === "both_sides" ? value : undefined;
}

function parseAirborneBuildingPredictionOutputBasis(value: unknown): AirborneBuildingPredictionOutputBasis {
  return value === "unknown" ||
    value === "apparent" ||
    value === "standardized" ||
    value === "apparent_and_standardized"
    ? value
    : "unknown";
}

function parseAirborneConservativeFlankingAssumption(value: unknown): AirborneConservativeFlankingAssumption {
  return value === "unknown" ||
    value === "single_conservative_path" ||
    value === "multi_path_conservative" ||
    value === "worst_case_screening"
    ? value
    : "unknown";
}

function parseAirborneFlankingJunctionClass(value: unknown): AirborneFlankingJunctionClass {
  return value === "unknown" ||
    value === "rigid_cross_junction" ||
    value === "rigid_t_junction" ||
    value === "lightweight_junction" ||
    value === "isolated_junction" ||
    value === "mixed_junction"
    ? value
    : "unknown";
}

function parseOpeningLeakElementDraft(value: unknown): WorkbenchOpeningLeakElementDraft | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  return makeWorkbenchOpeningLeakElementDraft({
    areaM2: typeof value.areaM2 === "string" ? value.areaM2 : "",
    count: typeof value.count === "string" ? value.count : "",
    elementRwDb: typeof value.elementRwDb === "string" ? value.elementRwDb : "",
    id: typeof value.id === "string" && value.id.trim().length > 0 ? value.id : crypto.randomUUID(),
    origin:
      value.origin === "unknown" ||
      value.origin === "measured" ||
      value.origin === "catalogued" ||
      value.origin === "source_absent"
        ? value.origin
        : "",
    ratingBasis:
      value.ratingBasis === "unknown" ||
      value.ratingBasis === "rw_single_number" ||
      value.ratingBasis === "stc_single_number" ||
      value.ratingBasis === "iso_717_1_curve" ||
      value.ratingBasis === "catalog_row" ||
      value.ratingBasis === "measured_lab"
        ? value.ratingBasis
        : "",
    sealLeakageClass:
      value.sealLeakageClass === "unknown" ||
      value.sealLeakageClass === "sealed" ||
      value.sealLeakageClass === "average" ||
      value.sealLeakageClass === "leaky" ||
      value.sealLeakageClass === "open_gap"
        ? value.sealLeakageClass
        : ""
  });
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
  const openingLeakElements = Array.isArray(value.airborneOpeningLeakElements)
    ? value.airborneOpeningLeakElements
        .map((entry) => parseOpeningLeakElementDraft(entry))
        .filter((entry): entry is WorkbenchOpeningLeakElementDraft => entry !== null)
    : [makeWorkbenchOpeningLeakElementDraft()];

  return {
    ...(value as ScenarioSnapshot),
    airborneBuildingPredictionOutputBasis: parseAirborneBuildingPredictionOutputBasis(
      value.airborneBuildingPredictionOutputBasis
    ),
    airborneConservativeFlankingAssumption: parseAirborneConservativeFlankingAssumption(
      value.airborneConservativeFlankingAssumption
    ),
    airborneFlankingJunctionClass: parseAirborneFlankingJunctionClass(value.airborneFlankingJunctionClass),
    airborneJunctionCouplingLengthM:
      typeof value.airborneJunctionCouplingLengthM === "string" ? value.airborneJunctionCouplingLengthM : "",
    airborneOpeningLeakElements: openingLeakElements.length > 0
      ? openingLeakElements
      : [makeWorkbenchOpeningLeakElementDraft()],
    airborneOpeningLeakHostWallAreaM2:
      typeof value.airborneOpeningLeakHostWallAreaM2 === "string"
        ? value.airborneOpeningLeakHostWallAreaM2
        : "",
    airborneResilientBarSideCount: parseAirborneResilientBarSideCount(value.airborneResilientBarSideCount),
    airborneSourceRoomVolumeM3:
      typeof value.airborneSourceRoomVolumeM3 === "string" ? value.airborneSourceRoomVolumeM3 : "",
    criteriaPackId: parseCriteriaPackId(value.criteriaPackId),
    presetId,
    rows,
    studyMode: value.studyMode
  };
}
