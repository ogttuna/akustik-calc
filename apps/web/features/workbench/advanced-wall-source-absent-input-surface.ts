import type {
  AcousticInputFieldId,
  AirborneAdvancedWallCavitySealState,
  AirborneAdvancedWallFrameMaterialClass,
  AirborneAdvancedWallInput,
  AirborneAdvancedWallOpeningIntent,
  AirborneAdvancedWallPanelMaterialClass,
  AirborneAdvancedWallResilientConnectionType,
  AirborneContext,
  RequestedOutputId
} from "@dynecho/shared";

import { parsePositiveWorkbenchNumber } from "./parse-number";
import type { StudyMode } from "./preset-definitions";

export const WORKBENCH_ADVANCED_WALL_SOURCE_ABSENT_INPUT_SURFACE_ID =
  "gate_az_personal_use_mvp_advanced_wall_source_absent_input_surface";

export const WORKBENCH_ADVANCED_WALL_INPUT_LABELS: Partial<Record<AcousticInputFieldId, string>> = {
  absorberCoverageRatio: "Absorber coverage ratio",
  absorberFlowResistivityPaSM2: "Absorber flow resistivity",
  absorberThicknessMm: "Absorber thickness",
  cavityDepthMm: "Cavity depth",
  cavitySealState: "Cavity seal state",
  cavitySequence: "Cavity sequence",
  fieldBuildingAdapterBoundary: "Field/building adapter boundary",
  frameDepthMm: "Frame depth",
  frameLineCouplingStiffnessMNPerM3: "Frame coupling stiffness",
  frameMaterialClass: "Frame material class",
  frameSpacingMm: "Frame spacing",
  frequencyBandSet: "Frequency band set",
  hostWallAreaM2: "Host wall area",
  leafGrouping: "Leaf grouping",
  leafSequence: "Leaf sequence",
  mechanicalBridgeAreaRatio: "Mechanical bridge area ratio",
  openingAreaM2: "Opening area",
  openingElementRw: "Opening element Rw",
  openingIntent: "Opening intent",
  openingOrigin: "Opening origin",
  openingRatingBasis: "Opening rating basis",
  openingSealLeakageClass: "Opening seal/leakage class",
  openingSubElementIds: "Opening sub-element ids",
  outputBasis: "Output basis",
  panelBendingStiffnessNm: "Panel bending stiffness",
  panelCriticalFrequencyHz: "Panel critical frequency",
  panelLayerOwnership: "Panel layer ownership",
  panelLossFactor: "Panel loss factor",
  panelMaterialClass: "Panel material class",
  panelSurfaceMassKgM2: "Panel surface mass",
  panelThicknessMm: "Panel thickness",
  resilientConnectionStiffnessMNPerM3: "Resilient connection stiffness",
  resilientConnectionType: "Resilient connection type",
  wallSolverIntent: "Advanced wall solver intent"
};

export type WorkbenchAdvancedWallPanelDraft = {
  bendingStiffnessNm: string;
  criticalFrequencyHz: string;
  id: string;
  layerIdsCsv: string;
  leafId: string;
  lossFactor: string;
  materialClass: "" | AirborneAdvancedWallPanelMaterialClass;
  sequence: string;
  surfaceMassKgM2: string;
  thicknessMm: string;
};

export type WorkbenchAdvancedWallCavityDraft = {
  absorberCoverageRatio: string;
  absorberFlowResistivityPaSM2: string;
  absorberThicknessMm: string;
  depthMm: string;
  id: string;
  sealState: "" | AirborneAdvancedWallCavitySealState;
  sequence: string;
};

export type WorkbenchAdvancedWallFrameCouplingDraft = {
  depthMm: string;
  frameMaterialClass: "" | AirborneAdvancedWallFrameMaterialClass;
  lineCouplingStiffnessMNPerM3: string;
  mechanicalBridgeAreaRatio: string;
  resilientConnectionStiffnessMNPerM3: string;
  resilientConnectionType: "" | AirborneAdvancedWallResilientConnectionType;
  spacingMm: string;
};

export type WorkbenchAdvancedWallOpeningDraft = {
  areaM2: string;
  count: string;
  elementRwDb: string;
  id: string;
  origin: "" | "catalogued" | "measured";
  ratingBasis: "" | "measured_lab" | "rw_single_number";
  sealLeakageClass: "" | "average" | "leaky" | "open_gap" | "sealed";
};

export type WorkbenchAdvancedWallInputSurfaceDraft = {
  cavities: readonly WorkbenchAdvancedWallCavityDraft[];
  frameCoupling: WorkbenchAdvancedWallFrameCouplingDraft;
  frequencyBandSet: "" | "third_octave_100_3150";
  hostWallAreaM2: string;
  openingIntent: "" | AirborneAdvancedWallOpeningIntent;
  openings: readonly WorkbenchAdvancedWallOpeningDraft[];
  outputBasis: "" | "building_prediction" | "element_lab" | "field_between_rooms";
  panels: readonly WorkbenchAdvancedWallPanelDraft[];
  wallSolverIntent: "" | "advanced_source_absent_wall";
};

export type WorkbenchAdvancedWallInputSurfaceResult = {
  airborneContextPatch: Pick<AirborneContext, "advancedWall">;
  hostileInputBoundaries: readonly string[];
  id: typeof WORKBENCH_ADVANCED_WALL_SOURCE_ABSENT_INPUT_SURFACE_ID;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: "complete" | "inactive" | "needs_input" | "unsupported";
};

export function makeWorkbenchAdvancedWallPanelDraft(
  seed?: Partial<WorkbenchAdvancedWallPanelDraft>
): WorkbenchAdvancedWallPanelDraft {
  return {
    bendingStiffnessNm: "",
    criticalFrequencyHz: "",
    id: crypto.randomUUID(),
    layerIdsCsv: "",
    leafId: "",
    lossFactor: "",
    materialClass: "",
    sequence: "",
    surfaceMassKgM2: "",
    thicknessMm: "",
    ...seed
  };
}

export function makeWorkbenchAdvancedWallCavityDraft(
  seed?: Partial<WorkbenchAdvancedWallCavityDraft>
): WorkbenchAdvancedWallCavityDraft {
  return {
    absorberCoverageRatio: "",
    absorberFlowResistivityPaSM2: "",
    absorberThicknessMm: "",
    depthMm: "",
    id: crypto.randomUUID(),
    sealState: "",
    sequence: "",
    ...seed
  };
}

export function makeWorkbenchAdvancedWallOpeningDraft(
  seed?: Partial<WorkbenchAdvancedWallOpeningDraft>
): WorkbenchAdvancedWallOpeningDraft {
  return {
    areaM2: "",
    count: "",
    elementRwDb: "",
    id: crypto.randomUUID(),
    origin: "",
    ratingBasis: "",
    sealLeakageClass: "",
    ...seed
  };
}

export function makeWorkbenchAdvancedWallInputSurfaceDraft(
  seed?: Partial<WorkbenchAdvancedWallInputSurfaceDraft>
): WorkbenchAdvancedWallInputSurfaceDraft {
  return {
    cavities: [],
    frameCoupling: {
      depthMm: "",
      frameMaterialClass: "",
      lineCouplingStiffnessMNPerM3: "",
      mechanicalBridgeAreaRatio: "",
      resilientConnectionStiffnessMNPerM3: "",
      resilientConnectionType: "",
      spacingMm: ""
    },
    frequencyBandSet: "",
    hostWallAreaM2: "",
    openingIntent: "",
    openings: [],
    outputBasis: "",
    panels: [],
    wallSolverIntent: "",
    ...seed
  };
}

function known(value: string | undefined): boolean {
  return typeof value === "string" && value.length > 0 && value !== "unknown";
}

function csvItems(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function hasPanelInput(panel: WorkbenchAdvancedWallPanelDraft): boolean {
  return [
    panel.bendingStiffnessNm,
    panel.criticalFrequencyHz,
    panel.layerIdsCsv,
    panel.leafId,
    panel.lossFactor,
    panel.sequence,
    panel.surfaceMassKgM2,
    panel.thicknessMm
  ].some((value) => value.trim().length > 0) || panel.materialClass.length > 0;
}

function hasCavityInput(cavity: WorkbenchAdvancedWallCavityDraft): boolean {
  return [
    cavity.absorberCoverageRatio,
    cavity.absorberFlowResistivityPaSM2,
    cavity.absorberThicknessMm,
    cavity.depthMm,
    cavity.sequence
  ].some((value) => value.trim().length > 0) || cavity.sealState.length > 0;
}

function hasOpeningInput(opening: WorkbenchAdvancedWallOpeningDraft): boolean {
  return [
    opening.areaM2,
    opening.count,
    opening.elementRwDb
  ].some((value) => value.trim().length > 0) ||
    opening.origin.length > 0 ||
    opening.ratingBasis.length > 0 ||
    opening.sealLeakageClass.length > 0;
}

function positiveIntegerFromDraft(value: string): number | undefined {
  const parsed = parsePositiveWorkbenchNumber(value);
  return typeof parsed === "number" && Number.isInteger(parsed) ? parsed : undefined;
}

function normalizeAdvancedWallInput(
  surface: WorkbenchAdvancedWallInputSurfaceDraft,
  targetOutputs: readonly RequestedOutputId[]
): AirborneAdvancedWallInput {
  const panels = surface.panels.filter(hasPanelInput).map((panel) => ({
    bendingStiffnessNm: parsePositiveWorkbenchNumber(panel.bendingStiffnessNm),
    criticalFrequencyHz: parsePositiveWorkbenchNumber(panel.criticalFrequencyHz),
    id: panel.id.trim().length > 0 ? panel.id.trim() : undefined,
    layerIds: csvItems(panel.layerIdsCsv),
    leafId: panel.leafId.trim().length > 0 ? panel.leafId.trim() : undefined,
    lossFactor: parsePositiveWorkbenchNumber(panel.lossFactor),
    materialClass: panel.materialClass || undefined,
    sequence: parsePositiveWorkbenchNumber(panel.sequence),
    surfaceMassKgM2: parsePositiveWorkbenchNumber(panel.surfaceMassKgM2),
    thicknessMm: parsePositiveWorkbenchNumber(panel.thicknessMm)
  }));
  const cavities = surface.cavities.filter(hasCavityInput).map((cavity) => ({
    absorberCoverageRatio: parsePositiveWorkbenchNumber(cavity.absorberCoverageRatio),
    absorberFlowResistivityPaSM2: parsePositiveWorkbenchNumber(cavity.absorberFlowResistivityPaSM2),
    absorberThicknessMm: parsePositiveWorkbenchNumber(cavity.absorberThicknessMm),
    depthMm: parsePositiveWorkbenchNumber(cavity.depthMm),
    id: cavity.id.trim().length > 0 ? cavity.id.trim() : undefined,
    sealState: cavity.sealState || undefined,
    sequence: parsePositiveWorkbenchNumber(cavity.sequence)
  }));
  const openings = surface.openings.filter(hasOpeningInput).map((opening) => ({
    areaM2: parsePositiveWorkbenchNumber(opening.areaM2),
    count: positiveIntegerFromDraft(opening.count),
    elementRwDb: parsePositiveWorkbenchNumber(opening.elementRwDb),
    id: opening.id.trim().length > 0 ? opening.id.trim() : undefined,
    origin: opening.origin || undefined,
    ratingBasis: opening.ratingBasis || undefined,
    sealLeakageClass: opening.sealLeakageClass || undefined
  }));

  return {
    cavities,
    directTransmissionCurveOwner: true,
    duplicateOwnershipGuard: true,
    exactSourcePrecedenceCheck: true,
    fieldBuildingAdapterBoundary: true,
    frameCoupling: {
      depthMm: parsePositiveWorkbenchNumber(surface.frameCoupling.depthMm),
      frameMaterialClass: surface.frameCoupling.frameMaterialClass || undefined,
      lineCouplingStiffnessMNPerM3: parsePositiveWorkbenchNumber(surface.frameCoupling.lineCouplingStiffnessMNPerM3),
      mechanicalBridgeAreaRatio: parsePositiveWorkbenchNumber(surface.frameCoupling.mechanicalBridgeAreaRatio),
      resilientConnectionStiffnessMNPerM3: parsePositiveWorkbenchNumber(surface.frameCoupling.resilientConnectionStiffnessMNPerM3),
      resilientConnectionType: surface.frameCoupling.resilientConnectionType || undefined,
      spacingMm: parsePositiveWorkbenchNumber(surface.frameCoupling.spacingMm)
    },
    frequencyBandSet: surface.frequencyBandSet || undefined,
    hostWallAreaM2: parsePositiveWorkbenchNumber(surface.hostWallAreaM2),
    iso717RwCAdapterOwner: true,
    openingIntent: surface.openingIntent || undefined,
    openings,
    outputBasis: surface.outputBasis || undefined,
    panels,
    sourceAbsentErrorBudgetOwner: true,
    splitLayerGuard: true,
    stcAdapterOwner: true,
    targetOutputs: targetOutputs.length > 0 ? [...targetOutputs] : ["Rw", "STC", "C", "Ctr"],
    wallSolverIntent: surface.wallSolverIntent || undefined
  };
}

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function collectMissing(input: AirborneAdvancedWallInput): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (input.wallSolverIntent !== "advanced_source_absent_wall") missing.push("wallSolverIntent");
  if (!input.outputBasis) missing.push("outputBasis");
  if (input.outputBasis && input.outputBasis !== "element_lab") missing.push("fieldBuildingAdapterBoundary");
  if (input.frequencyBandSet !== "third_octave_100_3150") missing.push("frequencyBandSet");
  if ((input.panels?.length ?? 0) < 2) missing.push("leafGrouping", "leafSequence", "panelLayerOwnership");

  for (const panel of input.panels ?? []) {
    if (!panel.id || !panel.leafId) missing.push("leafGrouping");
    if (typeof panel.sequence !== "number") missing.push("leafSequence");
    if (!panel.layerIds || panel.layerIds.length === 0) missing.push("panelLayerOwnership");
    if (!panel.materialClass) missing.push("panelMaterialClass");
    if (typeof panel.thicknessMm !== "number") missing.push("panelThicknessMm");
    if (typeof panel.surfaceMassKgM2 !== "number") missing.push("panelSurfaceMassKgM2");
    if (typeof panel.bendingStiffnessNm !== "number") missing.push("panelBendingStiffnessNm");
    if (typeof panel.lossFactor !== "number") missing.push("panelLossFactor");
    if (typeof panel.criticalFrequencyHz !== "number") missing.push("panelCriticalFrequencyHz");
  }

  if ((input.cavities?.length ?? 0) !== Math.max(0, (input.panels?.length ?? 0) - 1)) {
    missing.push("cavitySequence");
  }
  for (const cavity of input.cavities ?? []) {
    if (!cavity.id || typeof cavity.sequence !== "number") missing.push("cavitySequence");
    if (typeof cavity.depthMm !== "number") missing.push("cavityDepthMm");
    if (typeof cavity.absorberThicknessMm !== "number") missing.push("absorberThicknessMm");
    if (typeof cavity.absorberCoverageRatio !== "number") missing.push("absorberCoverageRatio");
    if (typeof cavity.absorberFlowResistivityPaSM2 !== "number") missing.push("absorberFlowResistivityPaSM2");
    if (!cavity.sealState) missing.push("cavitySealState");
  }

  const frame = input.frameCoupling;
  if (!frame?.frameMaterialClass) missing.push("frameMaterialClass");
  if (typeof frame?.spacingMm !== "number") missing.push("frameSpacingMm");
  if (typeof frame?.depthMm !== "number") missing.push("frameDepthMm");
  if (typeof frame?.lineCouplingStiffnessMNPerM3 !== "number") missing.push("frameLineCouplingStiffnessMNPerM3");
  if (!frame?.resilientConnectionType) missing.push("resilientConnectionType");
  if (typeof frame?.resilientConnectionStiffnessMNPerM3 !== "number") missing.push("resilientConnectionStiffnessMNPerM3");
  if (typeof frame?.mechanicalBridgeAreaRatio !== "number") missing.push("mechanicalBridgeAreaRatio");

  if (!input.openingIntent) {
    missing.push("openingIntent");
  } else if (input.openingIntent === "present") {
    if (typeof input.hostWallAreaM2 !== "number") missing.push("hostWallAreaM2");
    if (!input.openings || input.openings.length === 0) missing.push("openingSubElementIds");
    for (const opening of input.openings ?? []) {
      if (!opening.id) missing.push("openingSubElementIds");
      if (typeof opening.areaM2 !== "number" || typeof opening.count !== "number") missing.push("openingAreaM2");
      if (typeof opening.elementRwDb !== "number") missing.push("openingElementRw");
      if (!known(opening.ratingBasis)) missing.push("openingRatingBasis");
      if (!known(opening.sealLeakageClass)) missing.push("openingSealLeakageClass");
      if (!known(opening.origin)) missing.push("openingOrigin");
    }
  }

  return unique(missing);
}

function collectHostile(input: AirborneAdvancedWallInput): string[] {
  const hostile: string[] = [];
  const panelIds = (input.panels ?? []).map((panel) => panel.id).filter((id): id is string => Boolean(id));
  const leafIds = (input.panels ?? []).map((panel) => panel.leafId).filter((id): id is string => Boolean(id));
  const cavityIds = (input.cavities ?? []).map((cavity) => cavity.id).filter((id): id is string => Boolean(id));
  const layerIds = (input.panels ?? []).flatMap((panel) => panel.layerIds ?? []);
  const openingIds = (input.openings ?? []).map((opening) => opening.id).filter((id): id is string => Boolean(id));

  if (new Set(panelIds).size !== panelIds.length) hostile.push("duplicatePanelId");
  if (new Set(leafIds).size !== leafIds.length) hostile.push("duplicateLeafId");
  if (new Set(cavityIds).size !== cavityIds.length) hostile.push("duplicateCavityId");
  if (new Set(layerIds).size !== layerIds.length) hostile.push("duplicatePanelLayerOwnership");
  if (new Set(openingIds).size !== openingIds.length) hostile.push("duplicateOpeningId");

  return unique(hostile);
}

export function buildWorkbenchAdvancedWallInputSurface(input: {
  studyMode: StudyMode;
  surface: WorkbenchAdvancedWallInputSurfaceDraft;
  targetOutputs: readonly RequestedOutputId[];
}): WorkbenchAdvancedWallInputSurfaceResult {
  const routeActive =
    input.surface.wallSolverIntent.length > 0 ||
    input.surface.outputBasis.length > 0 ||
    input.surface.frequencyBandSet.length > 0 ||
    input.surface.openingIntent.length > 0 ||
    input.surface.hostWallAreaM2.trim().length > 0 ||
    input.surface.panels.some(hasPanelInput) ||
    input.surface.cavities.some(hasCavityInput) ||
    input.surface.openings.some(hasOpeningInput);

  if (input.studyMode !== "wall" || !routeActive) {
    return {
      airborneContextPatch: {},
      hostileInputBoundaries: [],
      id: WORKBENCH_ADVANCED_WALL_SOURCE_ABSENT_INPUT_SURFACE_ID,
      missingPhysicalInputs: [],
      status: "inactive"
    };
  }

  const advancedWall = normalizeAdvancedWallInput(input.surface, input.targetOutputs);
  const missingPhysicalInputs = collectMissing(advancedWall);
  const hostileInputBoundaries = collectHostile(advancedWall);

  return {
    airborneContextPatch: { advancedWall },
    hostileInputBoundaries,
    id: WORKBENCH_ADVANCED_WALL_SOURCE_ABSENT_INPUT_SURFACE_ID,
    missingPhysicalInputs,
    status:
      hostileInputBoundaries.length > 0 || advancedWall.outputBasis === "field_between_rooms" || advancedWall.outputBasis === "building_prediction"
        ? "unsupported"
        : missingPhysicalInputs.length > 0
          ? "needs_input"
          : "complete"
  };
}

export function formatWorkbenchAdvancedWallMissingInputWarning(
  result: WorkbenchAdvancedWallInputSurfaceResult
): string | null {
  if (result.status !== "needs_input" || result.missingPhysicalInputs.length === 0) {
    return null;
  }

  const missingLabels = result.missingPhysicalInputs.map(
    (field) => WORKBENCH_ADVANCED_WALL_INPUT_LABELS[field] ?? field
  );

  return `Advanced wall source-absent lane needs these physical inputs before calculating lab Rw/STC/C/Ctr: ${missingLabels.join(", ")}.`;
}
