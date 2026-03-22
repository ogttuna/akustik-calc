"use client";

import { materialCatalogById } from "@dynecho/catalogs";
import type { ImpactGuideSource } from "@dynecho/engine";
import type {
  AirborneCalculatorId,
  AirborneConnectionType,
  AirborneStudType,
  AirtightnessClass,
  AirborneContextMode,
  ElectricalBoxState,
  ExactImpactSourceLabOrField,
  FloorRole,
  JunctionQuality,
  PerimeterSealClass,
  PenetrationState,
  ReportProfile,
  RequestedOutputId,
  SharedTrackClass,
  StudyContext
} from "@dynecho/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_PRESET_ID,
  getPresetById,
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

type LayerDraft = {
  floorRole?: FloorRole;
  id: string;
  materialId: string;
  thicknessMm: string;
};

type AppendLayerDraftInput = Pick<LayerDraft, "floorRole" | "materialId" | "thicknessMm">;

type ScenarioSnapshot = {
  calculatorId: AirborneCalculatorId;
  airborneAirtightness: AirtightnessClass;
  airborneConnectionType: AirborneConnectionType;
  airborneContextMode: AirborneContextMode;
  airborneElectricalBoxes: ElectricalBoxState;
  airborneJunctionQuality: JunctionQuality;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airbornePenetrationState: PenetrationState;
  airbornePerimeterSeal: PerimeterSealClass;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  airborneSharedTrack: SharedTrackClass;
  airborneStudSpacingMm: string;
  airborneStudType: AirborneStudType;
  briefNote: string;
  clientName: string;
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

type WorkbenchStore = {
  activePresetId: PresetId;
  calculatorId: AirborneCalculatorId;
  airborneAirtightness: AirtightnessClass;
  airborneConnectionType: AirborneConnectionType;
  airborneContextMode: AirborneContextMode;
  airborneElectricalBoxes: ElectricalBoxState;
  airborneJunctionQuality: JunctionQuality;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airbornePenetrationState: PenetrationState;
  airbornePerimeterSeal: PerimeterSealClass;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  airborneSharedTrack: SharedTrackClass;
  airborneStudSpacingMm: string;
  airborneStudType: AirborneStudType;
  briefNote: string;
  clientName: string;
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
  applyCriteriaPack: (criteriaPackId: CriteriaPackId) => void;
  deleteSavedScenario: (scenarioId: string) => void;
  loadPreset: (presetId: PresetId) => void;
  loadSavedScenario: (scenarioId: string) => void;
  moveRow: (id: string, direction: "up" | "down") => void;
  removeRow: (id: string) => void;
  reset: () => void;
  saveCurrentScenario: () => void;
  setCalculatorId: (value: AirborneCalculatorId) => void;
  setAirborneAirtightness: (value: AirtightnessClass) => void;
  setAirborneConnectionType: (value: AirborneConnectionType) => void;
  setAirborneContextMode: (value: AirborneContextMode) => void;
  setAirborneElectricalBoxes: (value: ElectricalBoxState) => void;
  setAirborneJunctionQuality: (value: JunctionQuality) => void;
  setAirbornePanelHeightMm: (value: string) => void;
  setAirbornePanelWidthMm: (value: string) => void;
  setAirbornePenetrationState: (value: PenetrationState) => void;
  setAirbornePerimeterSeal: (value: PerimeterSealClass) => void;
  setAirborneReceivingRoomRt60S: (value: string) => void;
  setAirborneReceivingRoomVolumeM3: (value: string) => void;
  setAirborneSharedTrack: (value: SharedTrackClass) => void;
  setAirborneStudSpacingMm: (value: string) => void;
  setAirborneStudType: (value: AirborneStudType) => void;
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
  updateFloorRole: (id: string, floorRole?: FloorRole) => void;
  updateMaterial: (id: string, materialId: string) => void;
  updateThickness: (id: string, thicknessMm: string) => void;
};

function inferFloorRole(materialId: string, studyMode: StudyMode): FloorRole | undefined {
  if (studyMode !== "floor") {
    return undefined;
  }

  const material = materialCatalogById[materialId];
  if (!material) {
    return undefined;
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

  if (materialId === "generic_resilient_underlay" || material.category === "support") {
    return "resilient_layer";
  }

  if (materialId === "screed") {
    return "floating_screed";
  }

  if (materialId === "inex_floor_panel") {
    return "floating_screed";
  }

  if (
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

  if (materialId === "impactstop_board" || materialId === "firestop_board") {
    return "ceiling_board";
  }

  if (materialId === "rockwool") {
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

  if (material.id === "concrete" || material.tags.includes("structural")) {
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
  floorRole?: FloorRole
): LayerDraft {
  return {
    floorRole,
    id: crypto.randomUUID(),
    materialId,
    thicknessMm
  };
}

function duplicateRows(rows: readonly LayerDraft[]): LayerDraft[] {
  return rows.map((row) => makeRow(row.materialId, row.thicknessMm, row.floorRole));
}

function buildPresetRows(presetId: PresetId): LayerDraft[] {
  return getPresetById(presetId).rows.map((row) => makeRow(row.materialId, row.thicknessMm, row.floorRole));
}

const INITIAL_PRESET = getPresetById(DEFAULT_PRESET_ID);
const INITIAL_CRITERIA_PACK = getCriteriaPackById(DEFAULT_CRITERIA_PACK_ID);

function makeDefaultState() {
  return {
    activePresetId: INITIAL_PRESET.id,
    calculatorId: "dynamic" as const,
    airborneAirtightness: "good" as const,
    airborneConnectionType: "auto" as const,
    airborneContextMode: "element_lab" as const,
    airborneElectricalBoxes: "none" as const,
    airborneJunctionQuality: "good" as const,
    airbornePanelHeightMm: "",
    airbornePanelWidthMm: "",
    airbornePenetrationState: "none" as const,
    airbornePerimeterSeal: "good" as const,
    airborneReceivingRoomRt60S: "",
    airborneReceivingRoomVolumeM3: "",
    airborneSharedTrack: "independent" as const,
    airborneStudSpacingMm: "",
    airborneStudType: "auto" as const,
    approverTitle: "Acoustic Consultant",
    briefNote: "Record assumptions, flanking risks, and report caveats here.",
    clientName: "Internal study",
    consultantAddress: "Office address not entered",
    consultantCompany: "DynEcho Acoustic Consulting",
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
    preparedBy: "DynEcho Operator",
    proposalIssueCodePrefix: "",
    proposalAttention: "Attention line not entered",
    proposalIssuePurpose: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    proposalRecipient: "Client delivery team",
    projectName: "DynEcho Operator Deck",
    proposalReference: "DEC-2026-001",
    proposalRevision: "Rev 00",
    proposalSubject: "Acoustic performance proposal",
    proposalValidityNote: DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
    reportProfile: "consultant" as const,
    requestedOutputs: [...INITIAL_CRITERIA_PACK.requestedOutputs],
    rows: buildPresetRows(INITIAL_PRESET.id),
    savedScenarios: [] as ScenarioSnapshot[],
    studyContext: "concept" as const,
    studyMode: INITIAL_PRESET.studyMode,
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
      appendMaterial: (materialId, thicknessMm) =>
        set((state) => {
          const floorRole = inferFloorRole(materialId, state.studyMode);

          return {
            rows: [...state.rows, makeRow(materialId, thicknessMm, floorRole)]
          };
        }),
      appendRows: (rows) =>
        set((state) => ({
          rows: [
            ...state.rows,
            ...rows.map((row) =>
              makeRow(row.materialId, row.thicknessMm, row.floorRole ?? inferFloorRole(row.materialId, state.studyMode))
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
      deleteSavedScenario: (scenarioId) =>
        set((state) => ({
          savedScenarios: state.savedScenarios.filter((scenario) => scenario.id !== scenarioId)
        })),
      loadPreset: (presetId) => {
        const preset = getPresetById(presetId);
        set({
          activePresetId: preset.id,
          rows: buildPresetRows(preset.id),
          studyMode: preset.studyMode
        });
      },
      loadSavedScenario: (scenarioId) =>
        set((state) => {
          const scenario = state.savedScenarios.find((entry) => entry.id === scenarioId);
          if (!scenario) {
            return state;
          }

          const criteriaPack = getCriteriaPackById(scenario.criteriaPackId ?? DEFAULT_CRITERIA_PACK_ID);

          return {
            activePresetId: scenario.presetId,
            calculatorId: scenario.calculatorId ?? "dynamic",
            airborneAirtightness: scenario.airborneAirtightness ?? "good",
            airborneConnectionType: scenario.airborneConnectionType ?? "auto",
            airborneContextMode: scenario.airborneContextMode ?? "element_lab",
            airborneElectricalBoxes: scenario.airborneElectricalBoxes ?? "none",
            airborneJunctionQuality: scenario.airborneJunctionQuality ?? "good",
            airbornePanelHeightMm: scenario.airbornePanelHeightMm ?? "",
            airbornePanelWidthMm: scenario.airbornePanelWidthMm ?? "",
            airbornePenetrationState: scenario.airbornePenetrationState ?? "none",
            airbornePerimeterSeal: scenario.airbornePerimeterSeal ?? "good",
            airborneReceivingRoomRt60S: scenario.airborneReceivingRoomRt60S ?? "",
            airborneReceivingRoomVolumeM3: scenario.airborneReceivingRoomVolumeM3 ?? "",
            airborneSharedTrack: scenario.airborneSharedTrack ?? "independent",
            airborneStudSpacingMm: scenario.airborneStudSpacingMm ?? "",
            airborneStudType: scenario.airborneStudType ?? "auto",
            approverTitle: scenario.approverTitle ?? "Acoustic Consultant",
            briefNote: scenario.briefNote ?? "Record assumptions, flanking risks, and report caveats here.",
            clientName: scenario.clientName ?? "Internal study",
            consultantAddress: scenario.consultantAddress ?? "Office address not entered",
            consultantCompany: scenario.consultantCompany ?? "DynEcho Acoustic Consulting",
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
            preparedBy: scenario.preparedBy ?? "DynEcho Operator",
            proposalIssueCodePrefix: scenario.proposalIssueCodePrefix ?? "",
            proposalAttention: scenario.proposalAttention ?? "Attention line not entered",
            proposalIssuePurpose: scenario.proposalIssuePurpose ?? DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
            proposalRecipient: scenario.proposalRecipient ?? "Client delivery team",
            projectName: scenario.projectName ?? "DynEcho Operator Deck",
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
      reset: () => set(makeDefaultState()),
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
              airbornePanelHeightMm: state.airbornePanelHeightMm,
              airbornePanelWidthMm: state.airbornePanelWidthMm,
              airbornePenetrationState: state.airbornePenetrationState,
              airbornePerimeterSeal: state.airbornePerimeterSeal,
              airborneReceivingRoomRt60S: state.airborneReceivingRoomRt60S,
              airborneReceivingRoomVolumeM3: state.airborneReceivingRoomVolumeM3,
              airborneSharedTrack: state.airborneSharedTrack,
              airborneStudSpacingMm: state.airborneStudSpacingMm,
              airborneStudType: state.airborneStudType,
              approverTitle: state.approverTitle,
              briefNote: state.briefNote,
              clientName: state.clientName,
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
      setAirbornePanelHeightMm: (value) => set({ airbornePanelHeightMm: value }),
      setAirbornePanelWidthMm: (value) => set({ airbornePanelWidthMm: value }),
      setAirbornePenetrationState: (value) => set({ airbornePenetrationState: value }),
      setAirbornePerimeterSeal: (value) => set({ airbornePerimeterSeal: value }),
      setAirborneReceivingRoomRt60S: (value) => set({ airborneReceivingRoomRt60S: value }),
      setAirborneReceivingRoomVolumeM3: (value) => set({ airborneReceivingRoomVolumeM3: value }),
      setAirborneSharedTrack: (value) => set({ airborneSharedTrack: value }),
      setAirborneStudSpacingMm: (value) => set({ airborneStudSpacingMm: value }),
      setAirborneStudType: (value) => set({ airborneStudType: value }),
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
      updateFloorRole: (id, floorRole) =>
        set((state) => ({
          rows: state.rows.map((row) => (row.id === id ? { ...row, floorRole } : row))
        })),
      updateMaterial: (id, materialId) =>
        set((state) => {
          const floorRole = inferFloorRole(materialId, state.studyMode);

          return {
            rows: state.rows.map((row) =>
              row.id === id ? { ...row, floorRole: state.studyMode === "floor" ? floorRole : undefined, materialId } : row
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
