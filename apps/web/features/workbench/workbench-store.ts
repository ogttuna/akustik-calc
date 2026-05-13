"use client";

import {
  isMaterialEligibleFloorBaseStructure,
  type ImpactGuideSource
} from "@dynecho/engine";
import type {
  AirborneCalculatorId,
  AirborneConnectionType,
  AirborneResilientBarSideCount,
  AirborneStudType,
  AirtightnessClass,
  AirborneContextMode,
  ElectricalBoxState,
  ExactImpactSourceLabOrField,
  FloorRole,
  ImpactPredictorSupportForm,
  JunctionQuality,
  MaterialDefinition,
  PerimeterSealClass,
  PenetrationState,
  ReportProfile,
  RequestedOutputId,
  SharedTrackClass,
  StudyContext,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallInternalLeafCoupling,
  WallSupportTopology,
  WallTopologyMode
} from "@dynecho/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_PRESET_ID,
  getPresetById,
  WORKBENCH_PRESETS,
  type PresetId,
  type StudyMode
} from "./preset-definitions";
import {
  DEFAULT_CRITERIA_PACK_ID,
  getCriteriaPackById,
  type CriteriaPackId
} from "./criteria-packs";
import type { FieldRiskId } from "./field-risk-model";
import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
} from "./simple-workbench-proposal-policy-presets";
import {
  DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
  type WorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import { getWorkbenchMaterialById } from "./workbench-materials";
import type { WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm } from "./steel-floor-formula-input-surface";
import type {
  WorkbenchTimberCltDeltaLwImpactSystemType,
  WorkbenchTimberCltDeltaLwLowerAssemblyType,
  WorkbenchTimberCltDeltaLwLowerSupportClass,
  WorkbenchTimberCltDeltaLwStructuralSupportType
} from "./timber-clt-delta-lw-input-surface";
import {
  makeWorkbenchOpeningLeakElementDraft,
  type WorkbenchOpeningLeakElementDraft
} from "./opening-leak-composite-input-surface";
import {
  makeWorkbenchAdvancedWallInputSurfaceDraft,
  type WorkbenchAdvancedWallInputSurfaceDraft
} from "./advanced-wall-source-absent-input-surface";

type LayerDraft = {
  densityKgM3?: string;
  dynamicStiffnessMNm3?: string;
  floorRole?: FloorRole;
  id: string;
  materialId: string;
  thicknessMm: string;
};

type AppendLayerDraftInput = Pick<LayerDraft, "densityKgM3" | "dynamicStiffnessMNm3" | "floorRole" | "materialId" | "thicknessMm">;

type ScenarioSnapshot = WorkbenchWallTopologyDraft & {
  calculatorId: AirborneCalculatorId;
  airborneAirtightness: AirtightnessClass;
  airborneConnectionType: AirborneConnectionType;
  airborneContextMode: AirborneContextMode;
  airborneElectricalBoxes: ElectricalBoxState;
  airborneJunctionQuality: JunctionQuality;
  airborneAdvancedWallInputSurface?: WorkbenchAdvancedWallInputSurfaceDraft;
  airborneOpeningLeakElements: WorkbenchOpeningLeakElementDraft[];
  airborneOpeningLeakHostWallAreaM2: string;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airbornePenetrationState: PenetrationState;
  airbornePerimeterSeal: PerimeterSealClass;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  airborneResilientBarSideCount?: AirborneResilientBarSideCount;
  airborneSharedTrack: SharedTrackClass;
  airborneStudSpacingMm: string;
  airborneStudType: AirborneStudType;
  briefNote: string;
  clientName: string;
  customMaterials: MaterialDefinition[];
  consultantAddress: string;
  criteriaPackId: CriteriaPackId;
  consultantCompany: string;
  consultantEmail: string;
  consultantLogoDataUrl: string;
  consultantPhone: string;
  consultantWordmarkLine: string;
  fieldRiskIds: FieldRiskId[];
  impactDirectPathOffsetDb: string;
  impactGuideCi50_2500Db: string;
  impactGuideCiDb: string;
  impactGuideHdDb: string;
  impactGuideKDb: string;
  impactGuideMassRatio: string;
  impactExactBandInput: string;
  impactExactLabOrField: ExactImpactSourceLabOrField;
  impactFlankingPathsInput: string;
  impactImprovementBandInput: string;
  impactGuideSmallRoomMode: boolean;
  impactGuideSource: ImpactGuideSource;
  impactGuideReceivingRoomVolumeM3: string;
  impactLowerTreatmentReductionDb: string;
  impactReferenceDeltaLwDb: string;
  impactSteelCarrierDepthMm: string;
  impactSteelCarrierSpacingMm: string;
  impactSteelLoadBasisKgM2: string;
  impactSteelLowerCeilingIsolationSupportForm: WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm;
  impactSteelResilientLayerDynamicStiffnessMNm3: string;
  impactSteelSupportForm: "" | ImpactPredictorSupportForm;
  impactTimberCltBaseFloorDensityKgM3: string;
  impactTimberCltBaseFloorThicknessMm: string;
  impactTimberCltImpactSystemType: WorkbenchTimberCltDeltaLwImpactSystemType;
  impactTimberCltLoadBasisKgM2: string;
  impactTimberCltLowerAssemblyType: WorkbenchTimberCltDeltaLwLowerAssemblyType;
  impactTimberCltLowerBoardLayerCount: string;
  impactTimberCltLowerBoardThicknessMm: string;
  impactTimberCltLowerCavityDepthMm: string;
  impactTimberCltLowerCavityFillThicknessMm: string;
  impactTimberCltLowerSupportClass: WorkbenchTimberCltDeltaLwLowerSupportClass;
  impactTimberCltResilientLayerDynamicStiffnessMNm3: string;
  impactTimberCltResilientLayerThicknessMm: string;
  impactTimberCltStructuralSupportType: WorkbenchTimberCltDeltaLwStructuralSupportType;
  impactTimberCltUpperFillDensityKgM3: string;
  impactTimberCltUpperFillThicknessMm: string;
  impactTimberCltUpperTreatmentDensityKgM3: string;
  impactTimberCltUpperTreatmentThicknessMm: string;
  id: string;
  name: string;
  preparedBy: string;
  proposalIssueCodePrefix: string;
  proposalAttention: string;
  proposalIssuePurpose: string;
  proposalRecipient: string;
  approverTitle: string;
  presetId: PresetId;
  projectName: string;
  proposalReference: string;
  proposalRevision: string;
  proposalSubject: string;
  proposalValidityNote: string;
  reportProfile: ReportProfile;
  requestedOutputs: RequestedOutputId[];
  rows: LayerDraft[];
  savedAtIso: string;
  studyMode: StudyMode;
  targetLnwDb: string;
  targetRwDb: string;
};

type WorkbenchStore = WorkbenchWallTopologyDraft & {
  activePresetId: PresetId;
  calculatorId: AirborneCalculatorId;
  airborneAirtightness: AirtightnessClass;
  airborneConnectionType: AirborneConnectionType;
  airborneContextMode: AirborneContextMode;
  airborneElectricalBoxes: ElectricalBoxState;
  airborneJunctionQuality: JunctionQuality;
  airborneAdvancedWallInputSurface: WorkbenchAdvancedWallInputSurfaceDraft;
  airborneOpeningLeakElements: WorkbenchOpeningLeakElementDraft[];
  airborneOpeningLeakHostWallAreaM2: string;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airbornePenetrationState: PenetrationState;
  airbornePerimeterSeal: PerimeterSealClass;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  airborneResilientBarSideCount: AirborneResilientBarSideCount;
  airborneSharedTrack: SharedTrackClass;
  airborneStudSpacingMm: string;
  airborneStudType: AirborneStudType;
  briefNote: string;
  clientName: string;
  customMaterials: MaterialDefinition[];
  consultantAddress: string;
  consultantCompany: string;
  consultantEmail: string;
  consultantLogoDataUrl: string;
  consultantPhone: string;
  consultantWordmarkLine: string;
  criteriaPackId: CriteriaPackId;
  fieldRiskIds: FieldRiskId[];
  impactDirectPathOffsetDb: string;
  impactGuideCi50_2500Db: string;
  impactGuideCiDb: string;
  impactGuideHdDb: string;
  impactGuideKDb: string;
  impactGuideMassRatio: string;
  impactExactBandInput: string;
  impactExactLabOrField: ExactImpactSourceLabOrField;
  impactFlankingPathsInput: string;
  impactImprovementBandInput: string;
  impactGuideSmallRoomMode: boolean;
  impactGuideSource: ImpactGuideSource;
  impactGuideReceivingRoomVolumeM3: string;
  impactLowerTreatmentReductionDb: string;
  impactReferenceDeltaLwDb: string;
  impactSteelCarrierDepthMm: string;
  impactSteelCarrierSpacingMm: string;
  impactSteelLoadBasisKgM2: string;
  impactSteelLowerCeilingIsolationSupportForm: WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm;
  impactSteelResilientLayerDynamicStiffnessMNm3: string;
  impactSteelSupportForm: "" | ImpactPredictorSupportForm;
  impactTimberCltBaseFloorDensityKgM3: string;
  impactTimberCltBaseFloorThicknessMm: string;
  impactTimberCltImpactSystemType: WorkbenchTimberCltDeltaLwImpactSystemType;
  impactTimberCltLoadBasisKgM2: string;
  impactTimberCltLowerAssemblyType: WorkbenchTimberCltDeltaLwLowerAssemblyType;
  impactTimberCltLowerBoardLayerCount: string;
  impactTimberCltLowerBoardThicknessMm: string;
  impactTimberCltLowerCavityDepthMm: string;
  impactTimberCltLowerCavityFillThicknessMm: string;
  impactTimberCltLowerSupportClass: WorkbenchTimberCltDeltaLwLowerSupportClass;
  impactTimberCltResilientLayerDynamicStiffnessMNm3: string;
  impactTimberCltResilientLayerThicknessMm: string;
  impactTimberCltStructuralSupportType: WorkbenchTimberCltDeltaLwStructuralSupportType;
  impactTimberCltUpperFillDensityKgM3: string;
  impactTimberCltUpperFillThicknessMm: string;
  impactTimberCltUpperTreatmentDensityKgM3: string;
  impactTimberCltUpperTreatmentThicknessMm: string;
  approverTitle: string;
  preparedBy: string;
  proposalIssueCodePrefix: string;
  proposalAttention: string;
  proposalIssuePurpose: string;
  proposalRecipient: string;
  projectName: string;
  proposalReference: string;
  proposalRevision: string;
  proposalSubject: string;
  proposalValidityNote: string;
  reportProfile: ReportProfile;
  requestedOutputs: RequestedOutputId[];
  rows: LayerDraft[];
  savedScenarios: ScenarioSnapshot[];
  studyContext: StudyContext;
  studyMode: StudyMode;
  targetLnwDb: string;
  targetRwDb: string;
  addRow: () => void;
  appendMaterial: (materialId: string, thicknessMm: string) => void;
  appendRows: (rows: readonly AppendLayerDraftInput[]) => void;
  addCustomMaterial: (material: MaterialDefinition) => void;
  applyCriteriaPack: (criteriaPackId: CriteriaPackId) => void;
  clearRows: () => void;
  deleteSavedScenario: (scenarioId: string) => void;
  loadPreset: (presetId: PresetId) => void;
  loadScenarioSnapshot: (scenario: ScenarioSnapshot) => void;
  loadSavedScenario: (scenarioId: string) => void;
  duplicateRow: (id: string) => void;
  moveRow: (id: string, direction: "up" | "down") => void;
  removeRow: (id: string) => void;
  replaceSingleBaseStructure: (materialId: string, thicknessMm: string) => void;
  reset: () => void;
  saveCurrentScenario: () => void;
  setCalculatorId: (value: AirborneCalculatorId) => void;
  setAirborneAirtightness: (value: AirtightnessClass) => void;
  setAirborneConnectionType: (value: AirborneConnectionType) => void;
  setAirborneContextMode: (value: AirborneContextMode) => void;
  setAirborneElectricalBoxes: (value: ElectricalBoxState) => void;
  setAirborneJunctionQuality: (value: JunctionQuality) => void;
  replaceAirborneAdvancedWallInputSurface: (surface: WorkbenchAdvancedWallInputSurfaceDraft) => void;
  addAirborneOpeningLeakElement: () => void;
  moveAirborneOpeningLeakElement: (id: string, direction: "down" | "up") => void;
  removeAirborneOpeningLeakElement: (id: string) => void;
  replaceAirborneOpeningLeakElements: (elements: readonly WorkbenchOpeningLeakElementDraft[]) => void;
  setAirborneOpeningLeakHostWallAreaM2: (value: string) => void;
  updateAirborneOpeningLeakElement: (id: string, value: Partial<WorkbenchOpeningLeakElementDraft>) => void;
  setAirbornePanelHeightMm: (value: string) => void;
  setAirbornePanelWidthMm: (value: string) => void;
  setAirbornePenetrationState: (value: PenetrationState) => void;
  setAirbornePerimeterSeal: (value: PerimeterSealClass) => void;
  setAirborneReceivingRoomRt60S: (value: string) => void;
  setAirborneReceivingRoomVolumeM3: (value: string) => void;
  setAirborneResilientBarSideCount: (value: AirborneResilientBarSideCount) => void;
  setAirborneSharedTrack: (value: SharedTrackClass) => void;
  setAirborneStudSpacingMm: (value: string) => void;
  setAirborneStudType: (value: AirborneStudType) => void;
  setAirborneWallCavity1AbsorptionClass: (value: WallCavityAbsorptionClass) => void;
  setAirborneWallCavity1DepthMm: (value: string) => void;
  setAirborneWallCavity1FillCoverage: (value: WallCavityFillCoverage) => void;
  setAirborneWallCavity1LayerIndices: (value: string) => void;
  setAirborneWallCavity2AbsorptionClass: (value: WallCavityAbsorptionClass) => void;
  setAirborneWallCavity2DepthMm: (value: string) => void;
  setAirborneWallCavity2FillCoverage: (value: WallCavityFillCoverage) => void;
  setAirborneWallCavity2LayerIndices: (value: string) => void;
  setAirborneWallInternalLeafCoupling: (value: WallInternalLeafCoupling) => void;
  setAirborneWallInternalLeafLayerIndices: (value: string) => void;
  setAirborneWallSideALeafLayerIndices: (value: string) => void;
  setAirborneWallSideBLeafLayerIndices: (value: string) => void;
  setAirborneWallSupportTopology: (value: WallSupportTopology) => void;
  setAirborneWallTopologyMode: (value: WallTopologyMode) => void;
  setClientName: (value: string) => void;
  setBriefNote: (value: string) => void;
  setConsultantCompany: (value: string) => void;
  setConsultantAddress: (value: string) => void;
  setConsultantEmail: (value: string) => void;
  setConsultantLogoDataUrl: (value: string) => void;
  setConsultantPhone: (value: string) => void;
  setConsultantWordmarkLine: (value: string) => void;
  setImpactDirectPathOffsetDb: (value: string) => void;
  setImpactGuideCi50_2500Db: (value: string) => void;
  setImpactGuideCiDb: (value: string) => void;
  setImpactGuideHdDb: (value: string) => void;
  setImpactGuideKDb: (value: string) => void;
  setImpactGuideMassRatio: (value: string) => void;
  setImpactExactBandInput: (value: string) => void;
  setImpactExactLabOrField: (value: ExactImpactSourceLabOrField) => void;
  setImpactFlankingPathsInput: (value: string) => void;
  setImpactImprovementBandInput: (value: string) => void;
  setImpactGuideSmallRoomMode: (value: boolean) => void;
  setImpactGuideSource: (value: ImpactGuideSource) => void;
  setImpactGuideReceivingRoomVolumeM3: (value: string) => void;
  setImpactLowerTreatmentReductionDb: (value: string) => void;
  setImpactReferenceDeltaLwDb: (value: string) => void;
  setImpactSteelCarrierDepthMm: (value: string) => void;
  setImpactSteelCarrierSpacingMm: (value: string) => void;
  setImpactSteelLoadBasisKgM2: (value: string) => void;
  setImpactSteelLowerCeilingIsolationSupportForm: (value: WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm) => void;
  setImpactSteelResilientLayerDynamicStiffnessMNm3: (value: string) => void;
  setImpactSteelSupportForm: (value: "" | ImpactPredictorSupportForm) => void;
  setImpactTimberCltBaseFloorDensityKgM3: (value: string) => void;
  setImpactTimberCltBaseFloorThicknessMm: (value: string) => void;
  setImpactTimberCltImpactSystemType: (value: WorkbenchTimberCltDeltaLwImpactSystemType) => void;
  setImpactTimberCltLoadBasisKgM2: (value: string) => void;
  setImpactTimberCltLowerAssemblyType: (value: WorkbenchTimberCltDeltaLwLowerAssemblyType) => void;
  setImpactTimberCltLowerBoardLayerCount: (value: string) => void;
  setImpactTimberCltLowerBoardThicknessMm: (value: string) => void;
  setImpactTimberCltLowerCavityDepthMm: (value: string) => void;
  setImpactTimberCltLowerCavityFillThicknessMm: (value: string) => void;
  setImpactTimberCltLowerSupportClass: (value: WorkbenchTimberCltDeltaLwLowerSupportClass) => void;
  setImpactTimberCltResilientLayerDynamicStiffnessMNm3: (value: string) => void;
  setImpactTimberCltResilientLayerThicknessMm: (value: string) => void;
  setImpactTimberCltStructuralSupportType: (value: WorkbenchTimberCltDeltaLwStructuralSupportType) => void;
  setImpactTimberCltUpperFillDensityKgM3: (value: string) => void;
  setImpactTimberCltUpperFillThicknessMm: (value: string) => void;
  setImpactTimberCltUpperTreatmentDensityKgM3: (value: string) => void;
  setImpactTimberCltUpperTreatmentThicknessMm: (value: string) => void;
  setPreparedBy: (value: string) => void;
  setProposalIssueCodePrefix: (value: string) => void;
  setApproverTitle: (value: string) => void;
  setProposalAttention: (value: string) => void;
  setProposalIssuePurpose: (value: string) => void;
  setProposalRecipient: (value: string) => void;
  setProjectName: (value: string) => void;
  setProposalReference: (value: string) => void;
  setProposalRevision: (value: string) => void;
  setProposalSubject: (value: string) => void;
  setProposalValidityNote: (value: string) => void;
  setRequestedOutputs: (outputs: RequestedOutputId[]) => void;
  setReportProfile: (value: ReportProfile) => void;
  startStudyMode: (studyMode: StudyMode) => void;
  setStudyContext: (value: StudyContext) => void;
  setTargetLnwDb: (value: string) => void;
  setTargetRwDb: (value: string) => void;
  toggleFieldRisk: (fieldRiskId: FieldRiskId) => void;
  toggleRequestedOutput: (output: RequestedOutputId) => void;
  updateDensity: (id: string, densityKgM3: string) => void;
  updateDynamicStiffness: (id: string, dynamicStiffnessMNm3: string) => void;
  updateFloorRole: (id: string, floorRole?: FloorRole) => void;
  updateMaterial: (id: string, materialId: string) => void;
  updateThickness: (id: string, thicknessMm: string) => void;
};

export function inferFloorRole(
  materialId: string,
  studyMode: StudyMode,
  customMaterials: readonly MaterialDefinition[] = []
): FloorRole | undefined {
  if (studyMode !== "floor") {
    return undefined;
  }

  const material = getWorkbenchMaterialById(materialId, customMaterials);
  if (!material) {
    return undefined;
  }

  const materialName = material.name.toLocaleLowerCase("en-US");
  const materialTags = new Set(material.tags);

  if (materialTags.has("ceiling-support")) {
    return "ceiling_cavity";
  }

  if (materialId === "resilient_channel") {
    return "ceiling_cavity";
  }

  if (materialId === "furring_channel") {
    return "ceiling_cavity";
  }

  if (materialId === "acoustic_hanger_ceiling") {
    return "ceiling_cavity";
  }

  if (materialId === "resilient_stud_ceiling") {
    return "ceiling_cavity";
  }

  if (materialId === "ubiq_resilient_ceiling") {
    return "ceiling_cavity";
  }

  if (
    materialId === "mw_t_impact_layer" ||
    materialId === "mw_t_impact_layer_s35" ||
    materialId === "mw_t_impact_layer_s40" ||
    materialId === "mw_t_impact_layer_s6" ||
    materialId === "wf_t_impact_layer_s102" ||
    materialId === "eps_underlay"
  ) {
    return "resilient_layer";
  }

  if (
    materialId === "regupol_sonus_curve_8" ||
    materialId === "regupol_sonus_multi_4_5" ||
    materialId === "getzner_afm_21" ||
    materialId === "getzner_afm_23" ||
    materialId === "getzner_afm_26" ||
    materialId === "getzner_afm_29" ||
    materialId === "getzner_afm_33" ||
    materialId === "getzner_afm_35"
  ) {
    return "resilient_layer";
  }

  if (typeof material.impact?.dynamicStiffnessMNm3 === "number") {
    return "resilient_layer";
  }

  if (materialId === "generic_resilient_underlay" || material.category === "support") {
    return "resilient_layer";
  }

  if (materialId === "screed" || /screed/iu.test(materialName)) {
    return "floating_screed";
  }

  if (materialId === "inex_floor_panel") {
    return "floating_screed";
  }

  if (
    materialId === "eps_floor_insulation_board" ||
    materialId === "generic_fill" ||
    materialId === "bonded_chippings" ||
    materialId === "non_bonded_chippings" ||
    materialId === "elastic_bonded_fill"
  ) {
    return "upper_fill";
  }

  if (materialId === "gypsum_board") {
    return "ceiling_board";
  }

  if (materialId === "impactstop_board" || materialId === "firestop_board" || materialTags.has("board")) {
    return "ceiling_board";
  }

  if (materialId === "rockwool" || materialTags.has("cavity-fill")) {
    return "ceiling_fill";
  }

  if (material.category === "finish") {
    return "floor_covering";
  }

  if (material.category === "gap") {
    return "ceiling_cavity";
  }

  if (material.category === "insulation") {
    return "ceiling_fill";
  }

  if (material.id === "concrete" || materialTags.has("structural")) {
    return "base_structure";
  }

  if (material.category === "mass") {
    return "upper_fill";
  }

  return undefined;
}

function makeRow(
  materialId = "concrete",
  thicknessMm = "100",
  floorRole?: FloorRole,
  densityKgM3?: string,
  dynamicStiffnessMNm3?: string
): LayerDraft {
  return {
    densityKgM3,
    dynamicStiffnessMNm3,
    floorRole,
    id: crypto.randomUUID(),
    materialId,
    thicknessMm
  };
}

function duplicateRows(rows: readonly LayerDraft[]): LayerDraft[] {
  return rows.map((row) => makeRow(row.materialId, row.thicknessMm, row.floorRole, row.densityKgM3, row.dynamicStiffnessMNm3));
}

function buildPresetRows(presetId: PresetId): LayerDraft[] {
  return getPresetById(presetId).rows.map((row) => makeRow(row.materialId, row.thicknessMm, row.floorRole));
}

function replaceSingleBaseStructureRow(args: {
  customMaterials: readonly MaterialDefinition[];
  materialId: string;
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
  thicknessMm: string;
}): LayerDraft[] {
  const { customMaterials, materialId, rows, studyMode, thicknessMm } = args;
  const material = getWorkbenchMaterialById(materialId, customMaterials);
  const floorRole = inferFloorRole(materialId, studyMode, customMaterials);
  const nextRow = makeRow(materialId, thicknessMm, floorRole);

  if (studyMode !== "floor" || floorRole !== "base_structure") {
    return [...rows, nextRow];
  }

  if (!material || !isMaterialEligibleFloorBaseStructure(material)) {
    return [...rows];
  }

  const explicitBaseIndices = rows.flatMap((row, index) => (row.floorRole === "base_structure" ? [index] : []));
  if (explicitBaseIndices.length !== 1) {
    return [...rows, nextRow];
  }

  const [baseIndex] = explicitBaseIndices;

  return rows.map((row, index) =>
    index === baseIndex
      ? {
          ...row,
          densityKgM3: "",
          dynamicStiffnessMNm3: "",
          floorRole: "base_structure",
          materialId,
          thicknessMm
        }
      : row
  );
}

const INITIAL_PRESET = getPresetById(DEFAULT_PRESET_ID);
const INITIAL_CRITERIA_PACK = getCriteriaPackById(DEFAULT_CRITERIA_PACK_ID);

function resolveDefaultPreset(input?: {
  presetId?: PresetId;
  studyMode?: StudyMode;
}) {
  if (input?.presetId) {
    const preset = getPresetById(input.presetId);
    if (!input.studyMode || preset.studyMode === input.studyMode) {
      return preset;
    }
  }

  if (input?.studyMode) {
    return WORKBENCH_PRESETS.find((preset) => preset.studyMode === input.studyMode) ?? INITIAL_PRESET;
  }

  return INITIAL_PRESET;
}

function makeDefaultState(input?: {
  presetId?: PresetId;
  studyMode?: StudyMode;
}) {
  const preset = resolveDefaultPreset(input);

  return {
    activePresetId: preset.id,
    calculatorId: "dynamic" as const,
    airborneAirtightness: "good" as const,
    airborneConnectionType: "auto" as const,
    airborneContextMode: "element_lab" as const,
    airborneElectricalBoxes: "none" as const,
    airborneJunctionQuality: "good" as const,
    airborneAdvancedWallInputSurface: makeWorkbenchAdvancedWallInputSurfaceDraft(),
    airborneOpeningLeakElements: [makeWorkbenchOpeningLeakElementDraft()],
    airborneOpeningLeakHostWallAreaM2: "",
    airbornePanelHeightMm: "",
    airbornePanelWidthMm: "",
    airbornePenetrationState: "none" as const,
    airbornePerimeterSeal: "good" as const,
    airborneReceivingRoomRt60S: "",
    airborneReceivingRoomVolumeM3: "",
    airborneResilientBarSideCount: "auto" as const,
    airborneSharedTrack: "independent" as const,
    airborneStudSpacingMm: "",
    airborneStudType: "auto" as const,
    ...DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
    approverTitle: "Acoustic Consultant",
    briefNote: "Record assumptions, flanking risks, and report caveats here.",
    clientName: "Internal study",
    customMaterials: [] as MaterialDefinition[],
    consultantAddress: "Office address not entered",
    consultantCompany: "DYNECHO Acoustic Consulting",
    consultantEmail: "Contact email not entered",
    consultantLogoDataUrl: "",
    consultantPhone: "Contact phone not entered",
    consultantWordmarkLine: "",
    criteriaPackId: INITIAL_CRITERIA_PACK.id,
    fieldRiskIds: [] as FieldRiskId[],
    impactDirectPathOffsetDb: "",
    impactGuideCi50_2500Db: "",
    impactGuideCiDb: "",
    impactGuideHdDb: "",
    impactGuideKDb: "",
    impactGuideMassRatio: "",
    impactExactBandInput: "",
    impactExactLabOrField: "lab" as const,
    impactFlankingPathsInput: "",
    impactImprovementBandInput: "",
    impactGuideSmallRoomMode: false,
    impactGuideSource: "live_stack" as const,
    impactGuideReceivingRoomVolumeM3: "",
    impactLowerTreatmentReductionDb: "",
    impactReferenceDeltaLwDb: "",
    impactSteelCarrierDepthMm: "",
    impactSteelCarrierSpacingMm: "",
    impactSteelLoadBasisKgM2: "",
    impactSteelLowerCeilingIsolationSupportForm: "" as const,
    impactSteelResilientLayerDynamicStiffnessMNm3: "",
    impactSteelSupportForm: "" as const,
    impactTimberCltBaseFloorDensityKgM3: "",
    impactTimberCltBaseFloorThicknessMm: "",
    impactTimberCltImpactSystemType: "" as const,
    impactTimberCltLoadBasisKgM2: "",
    impactTimberCltLowerAssemblyType: "" as const,
    impactTimberCltLowerBoardLayerCount: "",
    impactTimberCltLowerBoardThicknessMm: "",
    impactTimberCltLowerCavityDepthMm: "",
    impactTimberCltLowerCavityFillThicknessMm: "",
    impactTimberCltLowerSupportClass: "" as const,
    impactTimberCltResilientLayerDynamicStiffnessMNm3: "",
    impactTimberCltResilientLayerThicknessMm: "",
    impactTimberCltStructuralSupportType: "" as const,
    impactTimberCltUpperFillDensityKgM3: "",
    impactTimberCltUpperFillThicknessMm: "",
    impactTimberCltUpperTreatmentDensityKgM3: "",
    impactTimberCltUpperTreatmentThicknessMm: "",
    preparedBy: "DAC Operator",
    proposalIssueCodePrefix: "",
    proposalAttention: "Attention line not entered",
    proposalIssuePurpose: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    proposalRecipient: "Client delivery team",
    projectName: "DAC Operator Deck",
    proposalReference: "DEC-2026-001",
    proposalRevision: "Rev 00",
    proposalSubject: "Acoustic performance proposal",
    proposalValidityNote: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
    reportProfile: "consultant" as const,
    requestedOutputs: [...INITIAL_CRITERIA_PACK.requestedOutputs],
    rows: buildPresetRows(preset.id),
    savedScenarios: [] as ScenarioSnapshot[],
    studyContext: "concept" as const,
    studyMode: preset.studyMode,
    targetLnwDb: INITIAL_CRITERIA_PACK.targetLnwDb,
    targetRwDb: INITIAL_CRITERIA_PACK.targetRwDb
  };
}

function buildDefaultRequestedOutputs(studyMode: StudyMode): RequestedOutputId[] {
  return studyMode === "floor" ? ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] : ["Rw", "STC", "C", "Ctr"];
}

function makeScenarioName(state: Pick<WorkbenchStore, "activePresetId" | "projectName" | "savedScenarios">): string {
  const preset = getPresetById(state.activePresetId);
  return `${state.projectName} · ${preset.label} ${String(state.savedScenarios.length + 1).padStart(2, "0")}`;
}

function cloneAdvancedWallInputSurface(
  surface: WorkbenchAdvancedWallInputSurfaceDraft
): WorkbenchAdvancedWallInputSurfaceDraft {
  return {
    ...surface,
    cavities: surface.cavities.map((cavity) => ({ ...cavity })),
    frameCoupling: { ...surface.frameCoupling },
    openings: surface.openings.map((opening) => ({ ...opening })),
    panels: surface.panels.map((panel) => ({ ...panel }))
  };
}

function buildLoadedScenarioState(
  state: Pick<WorkbenchStore, "customMaterials">,
  scenario: ScenarioSnapshot
): Partial<WorkbenchStore> {
  const criteriaPack = getCriteriaPackById(scenario.criteriaPackId ?? DEFAULT_CRITERIA_PACK_ID);

  return {
    activePresetId: scenario.presetId,
    calculatorId: scenario.calculatorId ?? "dynamic",
    airborneAirtightness: scenario.airborneAirtightness ?? "good",
    airborneConnectionType: scenario.airborneConnectionType ?? "auto",
    airborneContextMode: scenario.airborneContextMode ?? "element_lab",
    airborneElectricalBoxes: scenario.airborneElectricalBoxes ?? "none",
    airborneJunctionQuality: scenario.airborneJunctionQuality ?? "good",
    airborneAdvancedWallInputSurface: scenario.airborneAdvancedWallInputSurface
      ? cloneAdvancedWallInputSurface(scenario.airborneAdvancedWallInputSurface)
      : makeWorkbenchAdvancedWallInputSurfaceDraft(),
    airborneOpeningLeakElements:
      scenario.airborneOpeningLeakElements && scenario.airborneOpeningLeakElements.length > 0
        ? scenario.airborneOpeningLeakElements.map((element) => ({ ...element }))
        : [makeWorkbenchOpeningLeakElementDraft()],
    airborneOpeningLeakHostWallAreaM2: scenario.airborneOpeningLeakHostWallAreaM2 ?? "",
    airbornePanelHeightMm: scenario.airbornePanelHeightMm ?? "",
    airbornePanelWidthMm: scenario.airbornePanelWidthMm ?? "",
    airbornePenetrationState: scenario.airbornePenetrationState ?? "none",
    airbornePerimeterSeal: scenario.airbornePerimeterSeal ?? "good",
    airborneReceivingRoomRt60S: scenario.airborneReceivingRoomRt60S ?? "",
    airborneReceivingRoomVolumeM3: scenario.airborneReceivingRoomVolumeM3 ?? "",
    airborneResilientBarSideCount: scenario.airborneResilientBarSideCount ?? "auto",
    airborneSharedTrack: scenario.airborneSharedTrack ?? "independent",
    airborneStudSpacingMm: scenario.airborneStudSpacingMm ?? "",
    airborneStudType: scenario.airborneStudType ?? "auto",
    airborneWallCavity1AbsorptionClass:
      scenario.airborneWallCavity1AbsorptionClass ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity1AbsorptionClass,
    airborneWallCavity1DepthMm:
      scenario.airborneWallCavity1DepthMm ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity1DepthMm,
    airborneWallCavity1FillCoverage:
      scenario.airborneWallCavity1FillCoverage ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity1FillCoverage,
    airborneWallCavity1LayerIndices:
      scenario.airborneWallCavity1LayerIndices ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity1LayerIndices,
    airborneWallCavity2AbsorptionClass:
      scenario.airborneWallCavity2AbsorptionClass ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity2AbsorptionClass,
    airborneWallCavity2DepthMm:
      scenario.airborneWallCavity2DepthMm ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity2DepthMm,
    airborneWallCavity2FillCoverage:
      scenario.airborneWallCavity2FillCoverage ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity2FillCoverage,
    airborneWallCavity2LayerIndices:
      scenario.airborneWallCavity2LayerIndices ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallCavity2LayerIndices,
    airborneWallInternalLeafCoupling:
      scenario.airborneWallInternalLeafCoupling ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallInternalLeafCoupling,
    airborneWallInternalLeafLayerIndices:
      scenario.airborneWallInternalLeafLayerIndices ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallInternalLeafLayerIndices,
    airborneWallSideALeafLayerIndices:
      scenario.airborneWallSideALeafLayerIndices ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallSideALeafLayerIndices,
    airborneWallSideBLeafLayerIndices:
      scenario.airborneWallSideBLeafLayerIndices ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallSideBLeafLayerIndices,
    airborneWallSupportTopology:
      scenario.airborneWallSupportTopology ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallSupportTopology,
    airborneWallTopologyMode:
      scenario.airborneWallTopologyMode ?? DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT.airborneWallTopologyMode,
    approverTitle: scenario.approverTitle ?? "Acoustic Consultant",
    briefNote: scenario.briefNote ?? "Record assumptions, flanking risks, and report caveats here.",
    clientName: scenario.clientName ?? "Internal study",
    customMaterials: mergeCustomMaterials(state.customMaterials, scenario.customMaterials ?? []),
    consultantAddress: scenario.consultantAddress ?? "Office address not entered",
    consultantCompany: scenario.consultantCompany ?? "DYNECHO Acoustic Consulting",
    consultantEmail: scenario.consultantEmail ?? "Contact email not entered",
    consultantLogoDataUrl: scenario.consultantLogoDataUrl ?? "",
    consultantPhone: scenario.consultantPhone ?? "Contact phone not entered",
    consultantWordmarkLine: scenario.consultantWordmarkLine ?? "",
    criteriaPackId: criteriaPack.id,
    fieldRiskIds: [...(scenario.fieldRiskIds ?? [])],
    impactDirectPathOffsetDb: scenario.impactDirectPathOffsetDb ?? "",
    impactGuideCi50_2500Db: scenario.impactGuideCi50_2500Db ?? "",
    impactGuideCiDb: scenario.impactGuideCiDb ?? "",
    impactGuideHdDb: scenario.impactGuideHdDb ?? "",
    impactGuideKDb: scenario.impactGuideKDb ?? "",
    impactGuideMassRatio: scenario.impactGuideMassRatio ?? "",
    impactExactBandInput: scenario.impactExactBandInput ?? "",
    impactExactLabOrField: scenario.impactExactLabOrField ?? "lab",
    impactFlankingPathsInput: scenario.impactFlankingPathsInput ?? "",
    impactImprovementBandInput: scenario.impactImprovementBandInput ?? "",
    impactGuideSmallRoomMode: scenario.impactGuideSmallRoomMode ?? false,
    impactGuideSource: scenario.impactGuideSource ?? "live_stack",
    impactGuideReceivingRoomVolumeM3: scenario.impactGuideReceivingRoomVolumeM3 ?? "",
    impactLowerTreatmentReductionDb: scenario.impactLowerTreatmentReductionDb ?? "",
    impactReferenceDeltaLwDb: scenario.impactReferenceDeltaLwDb ?? "",
    impactSteelCarrierDepthMm: scenario.impactSteelCarrierDepthMm ?? "",
    impactSteelCarrierSpacingMm: scenario.impactSteelCarrierSpacingMm ?? "",
    impactSteelLoadBasisKgM2: scenario.impactSteelLoadBasisKgM2 ?? "",
    impactSteelLowerCeilingIsolationSupportForm: scenario.impactSteelLowerCeilingIsolationSupportForm ?? "",
    impactSteelResilientLayerDynamicStiffnessMNm3: scenario.impactSteelResilientLayerDynamicStiffnessMNm3 ?? "",
    impactSteelSupportForm: scenario.impactSteelSupportForm ?? "",
    impactTimberCltBaseFloorDensityKgM3: scenario.impactTimberCltBaseFloorDensityKgM3 ?? "",
    impactTimberCltBaseFloorThicknessMm: scenario.impactTimberCltBaseFloorThicknessMm ?? "",
    impactTimberCltImpactSystemType: scenario.impactTimberCltImpactSystemType ?? "",
    impactTimberCltLoadBasisKgM2: scenario.impactTimberCltLoadBasisKgM2 ?? "",
    impactTimberCltLowerAssemblyType: scenario.impactTimberCltLowerAssemblyType ?? "",
    impactTimberCltLowerBoardLayerCount: scenario.impactTimberCltLowerBoardLayerCount ?? "",
    impactTimberCltLowerBoardThicknessMm: scenario.impactTimberCltLowerBoardThicknessMm ?? "",
    impactTimberCltLowerCavityDepthMm: scenario.impactTimberCltLowerCavityDepthMm ?? "",
    impactTimberCltLowerCavityFillThicknessMm: scenario.impactTimberCltLowerCavityFillThicknessMm ?? "",
    impactTimberCltLowerSupportClass: scenario.impactTimberCltLowerSupportClass ?? "",
    impactTimberCltResilientLayerDynamicStiffnessMNm3:
      scenario.impactTimberCltResilientLayerDynamicStiffnessMNm3 ?? "",
    impactTimberCltResilientLayerThicknessMm: scenario.impactTimberCltResilientLayerThicknessMm ?? "",
    impactTimberCltStructuralSupportType: scenario.impactTimberCltStructuralSupportType ?? "",
    impactTimberCltUpperFillDensityKgM3: scenario.impactTimberCltUpperFillDensityKgM3 ?? "",
    impactTimberCltUpperFillThicknessMm: scenario.impactTimberCltUpperFillThicknessMm ?? "",
    impactTimberCltUpperTreatmentDensityKgM3: scenario.impactTimberCltUpperTreatmentDensityKgM3 ?? "",
    impactTimberCltUpperTreatmentThicknessMm: scenario.impactTimberCltUpperTreatmentThicknessMm ?? "",
    preparedBy: scenario.preparedBy ?? "DAC Operator",
    proposalIssueCodePrefix: scenario.proposalIssueCodePrefix ?? "",
    proposalAttention: scenario.proposalAttention ?? "Attention line not entered",
    proposalIssuePurpose: scenario.proposalIssuePurpose ?? DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    proposalRecipient: scenario.proposalRecipient ?? "Client delivery team",
    projectName: scenario.projectName ?? "DAC Operator Deck",
    proposalReference: scenario.proposalReference ?? "DEC-2026-001",
    proposalRevision: scenario.proposalRevision ?? "Rev 00",
    proposalSubject: scenario.proposalSubject ?? "Acoustic performance proposal",
    proposalValidityNote: scenario.proposalValidityNote ?? DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
    reportProfile: scenario.reportProfile ?? "consultant",
    requestedOutputs: [...(scenario.requestedOutputs ?? criteriaPack.requestedOutputs)],
    rows: duplicateRows(scenario.rows),
    studyMode: scenario.studyMode,
    targetLnwDb: scenario.targetLnwDb ?? criteriaPack.targetLnwDb,
    targetRwDb: scenario.targetRwDb ?? criteriaPack.targetRwDb
  };
}

export const useWorkbenchStore = create<WorkbenchStore>()(
  persist(
    (set) => ({
      ...makeDefaultState(),
      addRow: () =>
        set((state) => ({
          rows: [
            ...state.rows,
            state.studyMode === "floor"
              ? makeRow("vinyl_flooring", "4", inferFloorRole("vinyl_flooring", "floor"))
              : makeRow("gypsum_board", "12.5")
          ]
        })),
      addCustomMaterial: (material) =>
        set((state) => {
          if (state.customMaterials.some((entry) => entry.id === material.id)) {
            return state;
          }

          return {
            customMaterials: [...state.customMaterials, material].sort((left, right) => left.name.localeCompare(right.name, "en"))
          };
        }),
      appendMaterial: (materialId, thicknessMm) =>
        set((state) => {
          const floorRole = inferFloorRole(materialId, state.studyMode, state.customMaterials);

          return {
            rows: [...state.rows, makeRow(materialId, thicknessMm, floorRole)]
          };
        }),
      replaceSingleBaseStructure: (materialId, thicknessMm) =>
        set((state) => ({
          rows: replaceSingleBaseStructureRow({
            customMaterials: state.customMaterials,
            materialId,
            rows: state.rows,
            studyMode: state.studyMode,
            thicknessMm
          })
        })),
      appendRows: (rows) =>
        set((state) => ({
          rows: [
            ...state.rows,
            ...rows.map((row) =>
              makeRow(
                row.materialId,
                row.thicknessMm,
                row.floorRole ?? inferFloorRole(row.materialId, state.studyMode, state.customMaterials),
                row.densityKgM3,
                row.dynamicStiffnessMNm3
              )
            )
          ]
        })),
      applyCriteriaPack: (criteriaPackId) => {
        const criteriaPack = getCriteriaPackById(criteriaPackId);
        set({
          criteriaPackId: criteriaPack.id,
          requestedOutputs: [...criteriaPack.requestedOutputs],
          targetLnwDb: criteriaPack.targetLnwDb,
          targetRwDb: criteriaPack.targetRwDb
        });
      },
      clearRows: () =>
        set({
          rows: []
        }),
      deleteSavedScenario: (scenarioId) =>
        set((state) => ({
          savedScenarios: state.savedScenarios.filter((scenario) => scenario.id !== scenarioId)
        })),
      loadPreset: (presetId) => {
        const preset = getPresetById(presetId);
        // Presets can declare `airborneDefaults` to bring a preset's
        // benchmark-matching context with them (e.g. LSF needs
        // studType=light_steel_stud for the framed-wall family lane
        // to fire). Forward each declared field; leave the rest of
        // the airborne state untouched so a user who has customised
        // other fields does not lose that work.
        const defaults = preset.airborneDefaults;
        const airborneUpdates: Partial<WorkbenchStore> = {};
        if (defaults) {
          if (defaults.airtightness !== undefined) {
            airborneUpdates.airborneAirtightness = defaults.airtightness;
          }
          if (defaults.connectionType !== undefined) {
            airborneUpdates.airborneConnectionType = defaults.connectionType;
          }
          if (defaults.contextMode !== undefined) {
            airborneUpdates.airborneContextMode = defaults.contextMode;
          }
          if (defaults.studSpacingMm !== undefined) {
            airborneUpdates.airborneStudSpacingMm = defaults.studSpacingMm;
          }
          if (defaults.resilientBarSideCount !== undefined) {
            airborneUpdates.airborneResilientBarSideCount = defaults.resilientBarSideCount;
          }
          if (defaults.studType !== undefined) {
            airborneUpdates.airborneStudType = defaults.studType;
          }
        }
        set({
          activePresetId: preset.id,
          ...DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
          rows: buildPresetRows(preset.id),
          studyMode: preset.studyMode,
          ...airborneUpdates
        });
      },
      loadSavedScenario: (scenarioId) =>
        set((state) => {
          const scenario = state.savedScenarios.find((entry) => entry.id === scenarioId);
          if (!scenario) {
            return state;
          }

          return buildLoadedScenarioState(state, scenario);
        }),
      loadScenarioSnapshot: (scenario) =>
        set((state) => buildLoadedScenarioState(state, scenario)),
      duplicateRow: (id) =>
        set((state) => {
          const index = state.rows.findIndex((row) => row.id === id);
          if (index === -1) {
            return state;
          }

          const source = state.rows[index];
          const clone = makeRow(
            source.materialId,
            source.thicknessMm,
            source.floorRole,
            source.densityKgM3,
            source.dynamicStiffnessMNm3
          );

          const rows = [...state.rows];
          rows.splice(index + 1, 0, clone);

          return { rows };
        }),
      moveRow: (id, direction) =>
        set((state) => {
          const index = state.rows.findIndex((row) => row.id === id);
          if (index === -1) {
            return state;
          }

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.rows.length) {
            return state;
          }

          const rows = [...state.rows];
          const [current] = rows.splice(index, 1);
          rows.splice(targetIndex, 0, current);

          return { rows };
        }),
      removeRow: (id) =>
        set((state) => ({
          rows: state.rows.filter((row) => row.id !== id)
        })),
      reset: () =>
        set((state) => ({
          ...makeDefaultState({
            presetId: state.activePresetId,
            studyMode: state.studyMode
          }),
          customMaterials: state.customMaterials
        })),
      saveCurrentScenario: () =>
        set((state) => ({
          savedScenarios: [
            {
              calculatorId: state.calculatorId,
              id: crypto.randomUUID(),
              criteriaPackId: state.criteriaPackId,
              airborneAirtightness: state.airborneAirtightness,
              airborneConnectionType: state.airborneConnectionType,
              airborneContextMode: state.airborneContextMode,
              airborneElectricalBoxes: state.airborneElectricalBoxes,
              airborneJunctionQuality: state.airborneJunctionQuality,
              airborneAdvancedWallInputSurface: cloneAdvancedWallInputSurface(state.airborneAdvancedWallInputSurface),
              airborneOpeningLeakElements: state.airborneOpeningLeakElements.map((element) => ({ ...element })),
              airborneOpeningLeakHostWallAreaM2: state.airborneOpeningLeakHostWallAreaM2,
              airbornePanelHeightMm: state.airbornePanelHeightMm,
              airbornePanelWidthMm: state.airbornePanelWidthMm,
              airbornePenetrationState: state.airbornePenetrationState,
              airbornePerimeterSeal: state.airbornePerimeterSeal,
              airborneReceivingRoomRt60S: state.airborneReceivingRoomRt60S,
              airborneReceivingRoomVolumeM3: state.airborneReceivingRoomVolumeM3,
              airborneResilientBarSideCount: state.airborneResilientBarSideCount,
              airborneSharedTrack: state.airborneSharedTrack,
              airborneStudSpacingMm: state.airborneStudSpacingMm,
              airborneStudType: state.airborneStudType,
              airborneWallCavity1AbsorptionClass: state.airborneWallCavity1AbsorptionClass,
              airborneWallCavity1DepthMm: state.airborneWallCavity1DepthMm,
              airborneWallCavity1FillCoverage: state.airborneWallCavity1FillCoverage,
              airborneWallCavity1LayerIndices: state.airborneWallCavity1LayerIndices,
              airborneWallCavity2AbsorptionClass: state.airborneWallCavity2AbsorptionClass,
              airborneWallCavity2DepthMm: state.airborneWallCavity2DepthMm,
              airborneWallCavity2FillCoverage: state.airborneWallCavity2FillCoverage,
              airborneWallCavity2LayerIndices: state.airborneWallCavity2LayerIndices,
              airborneWallInternalLeafCoupling: state.airborneWallInternalLeafCoupling,
              airborneWallInternalLeafLayerIndices: state.airborneWallInternalLeafLayerIndices,
              airborneWallSideALeafLayerIndices: state.airborneWallSideALeafLayerIndices,
              airborneWallSideBLeafLayerIndices: state.airborneWallSideBLeafLayerIndices,
              airborneWallSupportTopology: state.airborneWallSupportTopology,
              airborneWallTopologyMode: state.airborneWallTopologyMode,
              approverTitle: state.approverTitle,
              briefNote: state.briefNote,
              clientName: state.clientName,
              customMaterials: [...state.customMaterials],
              consultantAddress: state.consultantAddress,
              consultantCompany: state.consultantCompany,
              consultantEmail: state.consultantEmail,
              consultantLogoDataUrl: state.consultantLogoDataUrl,
              consultantPhone: state.consultantPhone,
              consultantWordmarkLine: state.consultantWordmarkLine,
              fieldRiskIds: [...state.fieldRiskIds],
              impactDirectPathOffsetDb: state.impactDirectPathOffsetDb,
              impactGuideCi50_2500Db: state.impactGuideCi50_2500Db,
              impactGuideCiDb: state.impactGuideCiDb,
              impactGuideHdDb: state.impactGuideHdDb,
              impactGuideKDb: state.impactGuideKDb,
              impactGuideMassRatio: state.impactGuideMassRatio,
              impactExactBandInput: state.impactExactBandInput,
              impactExactLabOrField: state.impactExactLabOrField,
              impactFlankingPathsInput: state.impactFlankingPathsInput,
              impactImprovementBandInput: state.impactImprovementBandInput,
              impactGuideSmallRoomMode: state.impactGuideSmallRoomMode,
              impactGuideSource: state.impactGuideSource,
              impactGuideReceivingRoomVolumeM3: state.impactGuideReceivingRoomVolumeM3,
              impactLowerTreatmentReductionDb: state.impactLowerTreatmentReductionDb,
              impactReferenceDeltaLwDb: state.impactReferenceDeltaLwDb,
              impactSteelCarrierDepthMm: state.impactSteelCarrierDepthMm,
              impactSteelCarrierSpacingMm: state.impactSteelCarrierSpacingMm,
              impactSteelLoadBasisKgM2: state.impactSteelLoadBasisKgM2,
              impactSteelLowerCeilingIsolationSupportForm: state.impactSteelLowerCeilingIsolationSupportForm,
              impactSteelResilientLayerDynamicStiffnessMNm3: state.impactSteelResilientLayerDynamicStiffnessMNm3,
              impactSteelSupportForm: state.impactSteelSupportForm,
              impactTimberCltBaseFloorDensityKgM3: state.impactTimberCltBaseFloorDensityKgM3,
              impactTimberCltBaseFloorThicknessMm: state.impactTimberCltBaseFloorThicknessMm,
              impactTimberCltImpactSystemType: state.impactTimberCltImpactSystemType,
              impactTimberCltLoadBasisKgM2: state.impactTimberCltLoadBasisKgM2,
              impactTimberCltLowerAssemblyType: state.impactTimberCltLowerAssemblyType,
              impactTimberCltLowerBoardLayerCount: state.impactTimberCltLowerBoardLayerCount,
              impactTimberCltLowerBoardThicknessMm: state.impactTimberCltLowerBoardThicknessMm,
              impactTimberCltLowerCavityDepthMm: state.impactTimberCltLowerCavityDepthMm,
              impactTimberCltLowerCavityFillThicknessMm: state.impactTimberCltLowerCavityFillThicknessMm,
              impactTimberCltLowerSupportClass: state.impactTimberCltLowerSupportClass,
              impactTimberCltResilientLayerDynamicStiffnessMNm3:
                state.impactTimberCltResilientLayerDynamicStiffnessMNm3,
              impactTimberCltResilientLayerThicknessMm: state.impactTimberCltResilientLayerThicknessMm,
              impactTimberCltStructuralSupportType: state.impactTimberCltStructuralSupportType,
              impactTimberCltUpperFillDensityKgM3: state.impactTimberCltUpperFillDensityKgM3,
              impactTimberCltUpperFillThicknessMm: state.impactTimberCltUpperFillThicknessMm,
              impactTimberCltUpperTreatmentDensityKgM3: state.impactTimberCltUpperTreatmentDensityKgM3,
              impactTimberCltUpperTreatmentThicknessMm: state.impactTimberCltUpperTreatmentThicknessMm,
              name: makeScenarioName(state),
              preparedBy: state.preparedBy,
              proposalIssueCodePrefix: state.proposalIssueCodePrefix,
              proposalAttention: state.proposalAttention,
              proposalIssuePurpose: state.proposalIssuePurpose,
              proposalRecipient: state.proposalRecipient,
              presetId: state.activePresetId,
              projectName: state.projectName,
              proposalReference: state.proposalReference,
              proposalRevision: state.proposalRevision,
              proposalSubject: state.proposalSubject,
              proposalValidityNote: state.proposalValidityNote,
              reportProfile: state.reportProfile,
              requestedOutputs: [...state.requestedOutputs],
              rows: duplicateRows(state.rows),
              savedAtIso: new Date().toISOString(),
              studyMode: state.studyMode,
              targetLnwDb: state.targetLnwDb,
              targetRwDb: state.targetRwDb
            },
            ...state.savedScenarios
          ].slice(0, 8)
        })),
      setCalculatorId: (value) => set({ calculatorId: value }),
      setAirborneAirtightness: (value) => set({ airborneAirtightness: value }),
      setAirborneConnectionType: (value) => set({ airborneConnectionType: value }),
      setAirborneContextMode: (value) => set({ airborneContextMode: value }),
      setAirborneElectricalBoxes: (value) => set({ airborneElectricalBoxes: value }),
      setAirborneJunctionQuality: (value) => set({ airborneJunctionQuality: value }),
      replaceAirborneAdvancedWallInputSurface: (surface) =>
        set({ airborneAdvancedWallInputSurface: cloneAdvancedWallInputSurface(surface) }),
      addAirborneOpeningLeakElement: () =>
        set((state) => ({
          airborneOpeningLeakElements: [
            ...state.airborneOpeningLeakElements,
            makeWorkbenchOpeningLeakElementDraft()
          ]
        })),
      moveAirborneOpeningLeakElement: (id, direction) =>
        set((state) => {
          const index = state.airborneOpeningLeakElements.findIndex((element) => element.id === id);
          if (index === -1) {
            return state;
          }

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.airborneOpeningLeakElements.length) {
            return state;
          }

          const airborneOpeningLeakElements = [...state.airborneOpeningLeakElements];
          const [current] = airborneOpeningLeakElements.splice(index, 1);
          airborneOpeningLeakElements.splice(targetIndex, 0, current);

          return { airborneOpeningLeakElements };
        }),
      removeAirborneOpeningLeakElement: (id) =>
        set((state) => {
          const nextElements = state.airborneOpeningLeakElements.filter((element) => element.id !== id);

          return {
            airborneOpeningLeakElements:
              nextElements.length > 0 ? nextElements : [makeWorkbenchOpeningLeakElementDraft()]
          };
        }),
      replaceAirborneOpeningLeakElements: (elements) =>
        set({
          airborneOpeningLeakElements:
            elements.length > 0
              ? elements.map((element) => ({ ...element }))
              : [makeWorkbenchOpeningLeakElementDraft()]
        }),
      setAirborneOpeningLeakHostWallAreaM2: (value) => set({ airborneOpeningLeakHostWallAreaM2: value }),
      updateAirborneOpeningLeakElement: (id, value) =>
        set((state) => ({
          airborneOpeningLeakElements: state.airborneOpeningLeakElements.map((element) =>
            element.id === id ? { ...element, ...value, id: value.id ?? element.id } : element
          )
        })),
      setAirbornePanelHeightMm: (value) => set({ airbornePanelHeightMm: value }),
      setAirbornePanelWidthMm: (value) => set({ airbornePanelWidthMm: value }),
      setAirbornePenetrationState: (value) => set({ airbornePenetrationState: value }),
      setAirbornePerimeterSeal: (value) => set({ airbornePerimeterSeal: value }),
      setAirborneReceivingRoomRt60S: (value) => set({ airborneReceivingRoomRt60S: value }),
      setAirborneReceivingRoomVolumeM3: (value) => set({ airborneReceivingRoomVolumeM3: value }),
      setAirborneResilientBarSideCount: (value) => set({ airborneResilientBarSideCount: value }),
      setAirborneSharedTrack: (value) => set({ airborneSharedTrack: value }),
      setAirborneStudSpacingMm: (value) => set({ airborneStudSpacingMm: value }),
      setAirborneStudType: (value) => set({ airborneStudType: value }),
      setAirborneWallCavity1AbsorptionClass: (value) => set({ airborneWallCavity1AbsorptionClass: value }),
      setAirborneWallCavity1DepthMm: (value) => set({ airborneWallCavity1DepthMm: value }),
      setAirborneWallCavity1FillCoverage: (value) => set({ airborneWallCavity1FillCoverage: value }),
      setAirborneWallCavity1LayerIndices: (value) => set({ airborneWallCavity1LayerIndices: value }),
      setAirborneWallCavity2AbsorptionClass: (value) => set({ airborneWallCavity2AbsorptionClass: value }),
      setAirborneWallCavity2DepthMm: (value) => set({ airborneWallCavity2DepthMm: value }),
      setAirborneWallCavity2FillCoverage: (value) => set({ airborneWallCavity2FillCoverage: value }),
      setAirborneWallCavity2LayerIndices: (value) => set({ airborneWallCavity2LayerIndices: value }),
      setAirborneWallInternalLeafCoupling: (value) => set({ airborneWallInternalLeafCoupling: value }),
      setAirborneWallInternalLeafLayerIndices: (value) => set({ airborneWallInternalLeafLayerIndices: value }),
      setAirborneWallSideALeafLayerIndices: (value) => set({ airborneWallSideALeafLayerIndices: value }),
      setAirborneWallSideBLeafLayerIndices: (value) => set({ airborneWallSideBLeafLayerIndices: value }),
      setAirborneWallSupportTopology: (value) => set({ airborneWallSupportTopology: value }),
      setAirborneWallTopologyMode: (value) => set({ airborneWallTopologyMode: value }),
      setBriefNote: (value) => set({ briefNote: value }),
      setClientName: (value) => set({ clientName: value }),
      setConsultantAddress: (value) => set({ consultantAddress: value }),
      setConsultantCompany: (value) => set({ consultantCompany: value }),
      setConsultantEmail: (value) => set({ consultantEmail: value }),
      setConsultantLogoDataUrl: (value) => set({ consultantLogoDataUrl: value }),
      setConsultantPhone: (value) => set({ consultantPhone: value }),
      setConsultantWordmarkLine: (value) => set({ consultantWordmarkLine: value }),
      setImpactDirectPathOffsetDb: (value) => set({ impactDirectPathOffsetDb: value }),
      setImpactGuideCi50_2500Db: (value) => set({ impactGuideCi50_2500Db: value }),
      setImpactGuideCiDb: (value) => set({ impactGuideCiDb: value }),
      setImpactGuideHdDb: (value) => set({ impactGuideHdDb: value }),
      setImpactGuideKDb: (value) => set({ impactGuideKDb: value }),
      setImpactGuideMassRatio: (value) => set({ impactGuideMassRatio: value }),
      setImpactExactBandInput: (value) => set({ impactExactBandInput: value }),
      setImpactExactLabOrField: (value) => set({ impactExactLabOrField: value }),
      setImpactFlankingPathsInput: (value) => set({ impactFlankingPathsInput: value }),
      setImpactImprovementBandInput: (value) => set({ impactImprovementBandInput: value }),
      setImpactGuideSmallRoomMode: (value) => set({ impactGuideSmallRoomMode: value }),
      setImpactGuideSource: (value) => set({ impactGuideSource: value }),
      setImpactGuideReceivingRoomVolumeM3: (value) => set({ impactGuideReceivingRoomVolumeM3: value }),
      setImpactLowerTreatmentReductionDb: (value) => set({ impactLowerTreatmentReductionDb: value }),
      setImpactReferenceDeltaLwDb: (value) => set({ impactReferenceDeltaLwDb: value }),
      setImpactSteelCarrierDepthMm: (value) => set({ impactSteelCarrierDepthMm: value }),
      setImpactSteelCarrierSpacingMm: (value) => set({ impactSteelCarrierSpacingMm: value }),
      setImpactSteelLoadBasisKgM2: (value) => set({ impactSteelLoadBasisKgM2: value }),
      setImpactSteelLowerCeilingIsolationSupportForm: (value) => set({ impactSteelLowerCeilingIsolationSupportForm: value }),
      setImpactSteelResilientLayerDynamicStiffnessMNm3: (value) => set({ impactSteelResilientLayerDynamicStiffnessMNm3: value }),
      setImpactSteelSupportForm: (value) => set({ impactSteelSupportForm: value }),
      setImpactTimberCltBaseFloorDensityKgM3: (value) => set({ impactTimberCltBaseFloorDensityKgM3: value }),
      setImpactTimberCltBaseFloorThicknessMm: (value) => set({ impactTimberCltBaseFloorThicknessMm: value }),
      setImpactTimberCltImpactSystemType: (value) => set({ impactTimberCltImpactSystemType: value }),
      setImpactTimberCltLoadBasisKgM2: (value) => set({ impactTimberCltLoadBasisKgM2: value }),
      setImpactTimberCltLowerAssemblyType: (value) => set({ impactTimberCltLowerAssemblyType: value }),
      setImpactTimberCltLowerBoardLayerCount: (value) => set({ impactTimberCltLowerBoardLayerCount: value }),
      setImpactTimberCltLowerBoardThicknessMm: (value) => set({ impactTimberCltLowerBoardThicknessMm: value }),
      setImpactTimberCltLowerCavityDepthMm: (value) => set({ impactTimberCltLowerCavityDepthMm: value }),
      setImpactTimberCltLowerCavityFillThicknessMm: (value) => set({ impactTimberCltLowerCavityFillThicknessMm: value }),
      setImpactTimberCltLowerSupportClass: (value) => set({ impactTimberCltLowerSupportClass: value }),
      setImpactTimberCltResilientLayerDynamicStiffnessMNm3: (value) =>
        set({ impactTimberCltResilientLayerDynamicStiffnessMNm3: value }),
      setImpactTimberCltResilientLayerThicknessMm: (value) => set({ impactTimberCltResilientLayerThicknessMm: value }),
      setImpactTimberCltStructuralSupportType: (value) => set({ impactTimberCltStructuralSupportType: value }),
      setImpactTimberCltUpperFillDensityKgM3: (value) => set({ impactTimberCltUpperFillDensityKgM3: value }),
      setImpactTimberCltUpperFillThicknessMm: (value) => set({ impactTimberCltUpperFillThicknessMm: value }),
      setImpactTimberCltUpperTreatmentDensityKgM3: (value) => set({ impactTimberCltUpperTreatmentDensityKgM3: value }),
      setImpactTimberCltUpperTreatmentThicknessMm: (value) => set({ impactTimberCltUpperTreatmentThicknessMm: value }),
      setApproverTitle: (value) => set({ approverTitle: value }),
      setPreparedBy: (value) => set({ preparedBy: value }),
      setProposalIssueCodePrefix: (value) => set({ proposalIssueCodePrefix: value }),
      setProposalAttention: (value) => set({ proposalAttention: value }),
      setProposalIssuePurpose: (value) => set({ proposalIssuePurpose: value }),
      setProposalRecipient: (value) => set({ proposalRecipient: value }),
      setProjectName: (value) => set({ projectName: value }),
      setProposalReference: (value) => set({ proposalReference: value }),
      setProposalRevision: (value) => set({ proposalRevision: value }),
      setProposalSubject: (value) => set({ proposalSubject: value }),
      setProposalValidityNote: (value) => set({ proposalValidityNote: value }),
      setRequestedOutputs: (requestedOutputs) => set({ requestedOutputs: [...requestedOutputs] }),
      setReportProfile: (value) => set({ reportProfile: value }),
      startStudyMode: (studyMode) =>
        set({
          activePresetId: studyMode === "floor" ? "heavy_concrete_impact_floor" : "concrete_wall",
          airborneContextMode: "element_lab",
          ...DEFAULT_WORKBENCH_WALL_TOPOLOGY_DRAFT,
          requestedOutputs: buildDefaultRequestedOutputs(studyMode),
          rows: [],
          studyMode
        }),
      setStudyContext: (value) => set({ studyContext: value }),
      setTargetLnwDb: (value) => set({ targetLnwDb: value }),
      setTargetRwDb: (value) => set({ targetRwDb: value }),
      toggleFieldRisk: (fieldRiskId) =>
        set((state) => ({
          fieldRiskIds: state.fieldRiskIds.includes(fieldRiskId)
            ? state.fieldRiskIds.filter((entry) => entry !== fieldRiskId)
            : [...state.fieldRiskIds, fieldRiskId]
        })),
      toggleRequestedOutput: (output) =>
        set((state) => ({
          requestedOutputs: state.requestedOutputs.includes(output)
            ? state.requestedOutputs.filter((entry) => entry !== output)
            : [...state.requestedOutputs, output]
        })),
      updateDensity: (id, densityKgM3) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? { ...row, densityKgM3 } : row))
        })),
      updateDynamicStiffness: (id, dynamicStiffnessMNm3) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? { ...row, dynamicStiffnessMNm3 } : row))
        })),
      updateFloorRole: (id, floorRole) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? { ...row, floorRole } : row))
        })),
      updateMaterial: (id, materialId) =>
        set((state) => {
          const floorRole = inferFloorRole(materialId, state.studyMode, state.customMaterials);

          return {
            rows: state.rows.map((row) =>
              row.id === id
                ? {
                    ...row,
                    densityKgM3: "",
                    dynamicStiffnessMNm3: "",
                    floorRole: state.studyMode === "floor" ? floorRole : undefined,
                    materialId
                  }
                : row
            )
          };
        }),
      updateThickness: (id, thicknessMm) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? { ...row, thicknessMm } : row))
        }))
    }),
    {
      name: "dynecho-workbench-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export type { LayerDraft, ScenarioSnapshot };

function mergeCustomMaterials(
  currentMaterials: readonly MaterialDefinition[],
  nextMaterials: readonly MaterialDefinition[]
): MaterialDefinition[] {
  const byId = new Map<string, MaterialDefinition>();

  for (const material of currentMaterials) {
    byId.set(material.id, material);
  }

  for (const material of nextMaterials) {
    byId.set(material.id, material);
  }

  return Array.from(byId.values()).sort((left, right) => left.name.localeCompare(right.name, "en"));
}
