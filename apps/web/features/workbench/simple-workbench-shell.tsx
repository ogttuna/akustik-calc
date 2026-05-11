"use client";

import { isMaterialEligibleFloorBaseStructure } from "@dynecho/engine";
import type {
  AirborneContext,
  ImpactFieldContext,
  RequestedOutputId
} from "@dynecho/shared";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { formatDecimal } from "@/lib/format";

import { describeAssembly, getMaterialCategoryLabel } from "./describe-assembly";
import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getEffectiveDensity } from "./material-density";
import {
  buildSimpleWorkbenchCorridorDossier
} from "./simple-workbench-corridor-dossier";
import {
  FIELD_AIRBORNE_OUTPUTS,
  STANDARDIZED_AIRBORNE_OUTPUTS
} from "./field-airborne-output";
import { buildWorkbenchAirborneFieldContextInputSurface } from "./airborne-field-context-input-surface";
import { buildWorkbenchOpeningLeakCompositeInputSurface } from "./opening-leak-composite-input-surface";
import { formatUnlockOutputs, getGuidedOutputUnlocks } from "./guided-output-unlocks";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { deriveGuidedRouteSignals } from "./guided-route-signals";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import { isImpactOnlyLowConfidenceFloorLane } from "./impact-only-low-confidence-floor-lane";
import { getGuidedNumericSanityWarning, GUIDED_INPUT_SANITY_BANDS } from "./input-sanity";
import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildSimpleWorkbenchMethodDossier } from "./simple-workbench-method-dossier";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import {
  downloadSimpleWorkbenchProposalDocx,
  downloadSimpleWorkbenchProposalPdf,
  getSimpleWorkbenchProposalExportLabel,
  type SimpleWorkbenchProposalExportFormat,
  type SimpleWorkbenchProposalExportStyle
} from "./simple-workbench-proposal-pdf";
import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
} from "./simple-workbench-proposal-policy-presets";
import {
  buildWorkbenchWallTopology,
  hasActiveWorkbenchWallTopologyDraft
} from "./simple-workbench-wall-topology";
import { storeSimpleWorkbenchProposalPreview } from "./simple-workbench-proposal-preview-storage";
import { readSimpleWorkbenchIssueSequence } from "./simple-workbench-issue-sequence";
import { buildWorkbenchResponseCurveFigures } from "./response-curve-model";
import {
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot,
  type ServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import { isSteelBoundSupportFormLane } from "./steel-bound-support-form-lane";
import { useTheme } from "./use-theme";
import {
  FLOOR_ROLE_LABELS,
  REPORT_PROFILE_LABELS,
  STUDY_CONTEXT_LABELS
} from "./workbench-data";
import {
  buildCustomMaterialDefinition,
  buildWorkbenchMaterialCatalog,
  createEmptyCustomMaterialDraft,
  defaultThicknessForMaterialInRole,
  resolveThicknessForMaterialChange,
  validateCustomMaterialDraft,
  type CustomMaterialDraft
} from "./workbench-materials";
import { inferFloorRole, useWorkbenchStore, type ScenarioSnapshot } from "./workbench-store";

import {
  AIRBORNE_CONTEXT_OPTIONS,
  FIELD_IMPACT_OUTPUTS,
  MODE_PRESETS,
  SIMPLE_WORKBENCH_THEME,
  type AssemblyToolPanel,
  type NewLayerDraft,
  type ReviewTabId,
  type WorkspacePanelId
} from "./simple-workbench-constants";
import {
  buildDefaultNewLayerDraft,
  buildMaterialGroups,
  countAssignedFloorRoles,
  countValidThicknessRows,
  formatCountLabel,
  formatDensityLabel,
  getAutomaticOutputs,
  getEnvironmentLabel,
  getRowActivityCounts,
  getStudyModeLabel,
  parsePositiveNumber,
  sameRequestedOutputs,
  sumThickness
} from "./simple-workbench-utils";
import { addOutputCardPosture, buildOutputCard } from "./simple-workbench-output-model";
import { pickPrimaryOutputCard } from "./simple-workbench-output-cards";

import { SimpleWorkbenchToolbar } from "./simple-workbench-toolbar";
import { SimpleWorkbenchRoutePanel } from "./simple-workbench-route-panel";
import { SimpleWorkbenchAssemblyPanel } from "./simple-workbench-assembly-panel";
import { SimpleWorkbenchResultsPanel } from "./simple-workbench-results-panel";
import { SimpleWorkbenchResetDialog } from "./simple-workbench-reset-dialog";
import { SimpleWorkbenchReviewPanel } from "./simple-workbench-review-panel";
import { WorkspacePanelButton } from "./simple-workbench-primitives";

// ---------------------------------------------------------------------------

type ServerProjectSummaryPayload = {
  clientName?: string;
  id: string;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  proposalAuditEventCount: number;
  scenarioCount: number;
  updatedAtIso: string;
};

type ServerProjectScenarioPayload = {
  calculatorInput: {
    payload: unknown;
  };
  capturedAtIso: string;
  id: string;
  name: string;
  savedAtIso: string;
};

type ServerProjectRecordPayload = {
  clientName?: string;
  id: string;
  name: string;
  scenarioSnapshots: ServerProjectScenarioPayload[];
};

type ServerProjectStatus = "idle" | "loading" | "syncing" | "restoring" | "error";

const STEEL_FLOOR_FORMULA_BASE_MATERIAL_IDS = new Set([
  "lightweight_steel_floor",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "steel_joist_floor"
]);
const TIMBER_CLT_DELTA_LW_BASE_MATERIAL_IDS = new Set([
  "clt_panel",
  "timber_frame_floor",
  "timber_joist_floor"
]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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

  return value.projects.filter((project): project is ServerProjectSummaryPayload =>
    isObjectRecord(project) &&
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    typeof project.ownerLabel === "string" &&
    typeof project.scenarioCount === "number" &&
    typeof project.updatedAtIso === "string"
  );
}

function parseServerProjectRecord(value: unknown): ServerProjectRecordPayload | null {
  if (!isObjectRecord(value) || !isObjectRecord(value.project)) {
    return null;
  }

  const { project } = value;
  if (
    typeof project.id !== "string" ||
    typeof project.name !== "string" ||
    !Array.isArray(project.scenarioSnapshots)
  ) {
    return null;
  }

  const scenarioSnapshots = project.scenarioSnapshots.filter((scenario): scenario is ServerProjectScenarioPayload =>
    isObjectRecord(scenario) &&
    isObjectRecord(scenario.calculatorInput) &&
    "payload" in scenario.calculatorInput &&
    typeof scenario.capturedAtIso === "string" &&
    typeof scenario.id === "string" &&
    typeof scenario.name === "string" &&
    typeof scenario.savedAtIso === "string"
  );

  return {
    clientName: typeof project.clientName === "string" ? project.clientName : undefined,
    id: project.id,
    name: project.name,
    scenarioSnapshots
  };
}

function getLatestServerProjectScenario(project: ServerProjectRecordPayload): ServerProjectScenarioPayload | null {
  return project.scenarioSnapshots.reduce<ServerProjectScenarioPayload | null>((latest, scenario) => {
    if (!latest || scenario.capturedAtIso > latest.capturedAtIso) {
      return scenario;
    }

    return latest;
  }, null);
}

function formatServerProjectOptionLabel(project: ServerProjectSummaryPayload): string {
  const scenarioLabel = `${project.scenarioCount} scenario${project.scenarioCount === 1 ? "" : "s"}`;
  return `${project.name} · ${scenarioLabel}`;
}

export function SimpleWorkbenchShell() {
  // ── Store reads ──────────────────────────────────────────────────────────
  const addCustomMaterial = useWorkbenchStore((state) => state.addCustomMaterial);
  const briefNote = useWorkbenchStore((state) => state.briefNote);
  const clientName = useWorkbenchStore((state) => state.clientName);
  const consultantAddress = useWorkbenchStore((state) => state.consultantAddress);
  const consultantCompany = useWorkbenchStore((state) => state.consultantCompany);
  const consultantEmail = useWorkbenchStore((state) => state.consultantEmail);
  const consultantLogoDataUrl = useWorkbenchStore((state) => state.consultantLogoDataUrl);
  const consultantPhone = useWorkbenchStore((state) => state.consultantPhone);
  const consultantWordmarkLine = useWorkbenchStore((state) => state.consultantWordmarkLine);
  const customMaterials = useWorkbenchStore((state) => state.customMaterials);
  const approverTitle = useWorkbenchStore((state) => state.approverTitle);
  const preparedBy = useWorkbenchStore((state) => state.preparedBy);
  const proposalIssueCodePrefix = useWorkbenchStore((state) => state.proposalIssueCodePrefix);
  const proposalAttention = useWorkbenchStore((state) => state.proposalAttention);
  const proposalIssuePurpose = useWorkbenchStore((state) => state.proposalIssuePurpose);
  const proposalRecipient = useWorkbenchStore((state) => state.proposalRecipient);
  const projectName = useWorkbenchStore((state) => state.projectName);
  const proposalReference = useWorkbenchStore((state) => state.proposalReference);
  const proposalRevision = useWorkbenchStore((state) => state.proposalRevision);
  const proposalSubject = useWorkbenchStore((state) => state.proposalSubject);
  const proposalValidityNote = useWorkbenchStore((state) => state.proposalValidityNote);
  const reportProfile = useWorkbenchStore((state) => state.reportProfile);
  const criteriaPackId = useWorkbenchStore((state) => state.criteriaPackId);
  const fieldRiskIds = useWorkbenchStore((state) => state.fieldRiskIds);
  const rows = useWorkbenchStore((state) => state.rows);
  const studyContext = useWorkbenchStore((state) => state.studyContext);
  const studyMode = useWorkbenchStore((state) => state.studyMode);
  const activePresetId = useWorkbenchStore((state) => state.activePresetId);
  const targetLnwDb = useWorkbenchStore((state) => state.targetLnwDb);
  const targetRwDb = useWorkbenchStore((state) => state.targetRwDb);
  const calculatorId = useWorkbenchStore((state) => state.calculatorId);
  const requestedOutputs = useWorkbenchStore((state) => state.requestedOutputs);
  const airborneContextMode = useWorkbenchStore((state) => state.airborneContextMode);
  const airborneAirtightness = useWorkbenchStore((state) => state.airborneAirtightness);
  const airborneConnectionType = useWorkbenchStore((state) => state.airborneConnectionType);
  const airborneElectricalBoxes = useWorkbenchStore((state) => state.airborneElectricalBoxes);
  const airborneJunctionQuality = useWorkbenchStore((state) => state.airborneJunctionQuality);
  const airborneOpeningLeakElements = useWorkbenchStore((state) => state.airborneOpeningLeakElements);
  const airborneOpeningLeakHostWallAreaM2 = useWorkbenchStore((state) => state.airborneOpeningLeakHostWallAreaM2);
  const airbornePanelHeightMm = useWorkbenchStore((state) => state.airbornePanelHeightMm);
  const airbornePanelWidthMm = useWorkbenchStore((state) => state.airbornePanelWidthMm);
  const airbornePenetrationState = useWorkbenchStore((state) => state.airbornePenetrationState);
  const airbornePerimeterSeal = useWorkbenchStore((state) => state.airbornePerimeterSeal);
  const airborneReceivingRoomRt60S = useWorkbenchStore((state) => state.airborneReceivingRoomRt60S);
  const airborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.airborneReceivingRoomVolumeM3);
  const airborneResilientBarSideCount = useWorkbenchStore((state) => state.airborneResilientBarSideCount);
  const airborneSharedTrack = useWorkbenchStore((state) => state.airborneSharedTrack);
  const airborneStudSpacingMm = useWorkbenchStore((state) => state.airborneStudSpacingMm);
  const airborneStudType = useWorkbenchStore((state) => state.airborneStudType);
  const airborneWallCavity1AbsorptionClass = useWorkbenchStore((state) => state.airborneWallCavity1AbsorptionClass);
  const airborneWallCavity1DepthMm = useWorkbenchStore((state) => state.airborneWallCavity1DepthMm);
  const airborneWallCavity1FillCoverage = useWorkbenchStore((state) => state.airborneWallCavity1FillCoverage);
  const airborneWallCavity1LayerIndices = useWorkbenchStore((state) => state.airborneWallCavity1LayerIndices);
  const airborneWallCavity2AbsorptionClass = useWorkbenchStore((state) => state.airborneWallCavity2AbsorptionClass);
  const airborneWallCavity2DepthMm = useWorkbenchStore((state) => state.airborneWallCavity2DepthMm);
  const airborneWallCavity2FillCoverage = useWorkbenchStore((state) => state.airborneWallCavity2FillCoverage);
  const airborneWallCavity2LayerIndices = useWorkbenchStore((state) => state.airborneWallCavity2LayerIndices);
  const airborneWallInternalLeafCoupling = useWorkbenchStore((state) => state.airborneWallInternalLeafCoupling);
  const airborneWallInternalLeafLayerIndices = useWorkbenchStore((state) => state.airborneWallInternalLeafLayerIndices);
  const airborneWallSideALeafLayerIndices = useWorkbenchStore((state) => state.airborneWallSideALeafLayerIndices);
  const airborneWallSideBLeafLayerIndices = useWorkbenchStore((state) => state.airborneWallSideBLeafLayerIndices);
  const airborneWallSupportTopology = useWorkbenchStore((state) => state.airborneWallSupportTopology);
  const airborneWallTopologyMode = useWorkbenchStore((state) => state.airborneWallTopologyMode);
  const impactDirectPathOffsetDb = useWorkbenchStore((state) => state.impactDirectPathOffsetDb);
  const impactGuideCi50_2500Db = useWorkbenchStore((state) => state.impactGuideCi50_2500Db);
  const impactGuideCiDb = useWorkbenchStore((state) => state.impactGuideCiDb);
  const impactGuideHdDb = useWorkbenchStore((state) => state.impactGuideHdDb);
  const impactGuideKDb = useWorkbenchStore((state) => state.impactGuideKDb);
  const impactGuideMassRatio = useWorkbenchStore((state) => state.impactGuideMassRatio);
  const impactExactBandInput = useWorkbenchStore((state) => state.impactExactBandInput);
  const impactExactLabOrField = useWorkbenchStore((state) => state.impactExactLabOrField);
  const impactFlankingPathsInput = useWorkbenchStore((state) => state.impactFlankingPathsInput);
  const impactImprovementBandInput = useWorkbenchStore((state) => state.impactImprovementBandInput);
  const impactGuideSmallRoomMode = useWorkbenchStore((state) => state.impactGuideSmallRoomMode);
  const impactGuideSource = useWorkbenchStore((state) => state.impactGuideSource);
  const impactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.impactGuideReceivingRoomVolumeM3);
  const impactLowerTreatmentReductionDb = useWorkbenchStore((state) => state.impactLowerTreatmentReductionDb);
  const impactReferenceDeltaLwDb = useWorkbenchStore((state) => state.impactReferenceDeltaLwDb);
  const impactSteelCarrierDepthMm = useWorkbenchStore((state) => state.impactSteelCarrierDepthMm);
  const impactSteelCarrierSpacingMm = useWorkbenchStore((state) => state.impactSteelCarrierSpacingMm);
  const impactSteelLoadBasisKgM2 = useWorkbenchStore((state) => state.impactSteelLoadBasisKgM2);
  const impactSteelLowerCeilingIsolationSupportForm = useWorkbenchStore((state) => state.impactSteelLowerCeilingIsolationSupportForm);
  const impactSteelResilientLayerDynamicStiffnessMNm3 = useWorkbenchStore((state) => state.impactSteelResilientLayerDynamicStiffnessMNm3);
  const impactSteelSupportForm = useWorkbenchStore((state) => state.impactSteelSupportForm);
  const impactTimberCltBaseFloorDensityKgM3 = useWorkbenchStore((state) => state.impactTimberCltBaseFloorDensityKgM3);
  const impactTimberCltBaseFloorThicknessMm = useWorkbenchStore((state) => state.impactTimberCltBaseFloorThicknessMm);
  const impactTimberCltImpactSystemType = useWorkbenchStore((state) => state.impactTimberCltImpactSystemType);
  const impactTimberCltLoadBasisKgM2 = useWorkbenchStore((state) => state.impactTimberCltLoadBasisKgM2);
  const impactTimberCltLowerAssemblyType = useWorkbenchStore((state) => state.impactTimberCltLowerAssemblyType);
  const impactTimberCltLowerBoardLayerCount = useWorkbenchStore((state) => state.impactTimberCltLowerBoardLayerCount);
  const impactTimberCltLowerBoardThicknessMm = useWorkbenchStore((state) => state.impactTimberCltLowerBoardThicknessMm);
  const impactTimberCltLowerCavityDepthMm = useWorkbenchStore((state) => state.impactTimberCltLowerCavityDepthMm);
  const impactTimberCltLowerCavityFillThicknessMm = useWorkbenchStore((state) => state.impactTimberCltLowerCavityFillThicknessMm);
  const impactTimberCltLowerSupportClass = useWorkbenchStore((state) => state.impactTimberCltLowerSupportClass);
  const impactTimberCltResilientLayerDynamicStiffnessMNm3 = useWorkbenchStore((state) => state.impactTimberCltResilientLayerDynamicStiffnessMNm3);
  const impactTimberCltResilientLayerThicknessMm = useWorkbenchStore((state) => state.impactTimberCltResilientLayerThicknessMm);
  const impactTimberCltStructuralSupportType = useWorkbenchStore((state) => state.impactTimberCltStructuralSupportType);
  const impactTimberCltUpperFillDensityKgM3 = useWorkbenchStore((state) => state.impactTimberCltUpperFillDensityKgM3);
  const impactTimberCltUpperFillThicknessMm = useWorkbenchStore((state) => state.impactTimberCltUpperFillThicknessMm);
  const impactTimberCltUpperTreatmentDensityKgM3 = useWorkbenchStore((state) => state.impactTimberCltUpperTreatmentDensityKgM3);
  const impactTimberCltUpperTreatmentThicknessMm = useWorkbenchStore((state) => state.impactTimberCltUpperTreatmentThicknessMm);

  const appendRows = useWorkbenchStore((state) => state.appendRows);
  const clearRows = useWorkbenchStore((state) => state.clearRows);
  const duplicateRow = useWorkbenchStore((state) => state.duplicateRow);
  const loadPreset = useWorkbenchStore((state) => state.loadPreset);
  const loadScenarioSnapshot = useWorkbenchStore((state) => state.loadScenarioSnapshot);
  const moveRow = useWorkbenchStore((state) => state.moveRow);
  const removeRow = useWorkbenchStore((state) => state.removeRow);
  const reset = useWorkbenchStore((state) => state.reset);
  const startStudyMode = useWorkbenchStore((state) => state.startStudyMode);
  const setAirborneAirtightness = useWorkbenchStore((state) => state.setAirborneAirtightness);
  const setAirborneConnectionType = useWorkbenchStore((state) => state.setAirborneConnectionType);
  const setAirborneContextMode = useWorkbenchStore((state) => state.setAirborneContextMode);
  const setAirborneElectricalBoxes = useWorkbenchStore((state) => state.setAirborneElectricalBoxes);
  const setAirborneJunctionQuality = useWorkbenchStore((state) => state.setAirborneJunctionQuality);
  const addAirborneOpeningLeakElement = useWorkbenchStore((state) => state.addAirborneOpeningLeakElement);
  const moveAirborneOpeningLeakElement = useWorkbenchStore((state) => state.moveAirborneOpeningLeakElement);
  const removeAirborneOpeningLeakElement = useWorkbenchStore((state) => state.removeAirborneOpeningLeakElement);
  const setAirborneOpeningLeakHostWallAreaM2 = useWorkbenchStore((state) => state.setAirborneOpeningLeakHostWallAreaM2);
  const updateAirborneOpeningLeakElement = useWorkbenchStore((state) => state.updateAirborneOpeningLeakElement);
  const setAirbornePanelHeightMm = useWorkbenchStore((state) => state.setAirbornePanelHeightMm);
  const setAirbornePanelWidthMm = useWorkbenchStore((state) => state.setAirbornePanelWidthMm);
  const setAirbornePenetrationState = useWorkbenchStore((state) => state.setAirbornePenetrationState);
  const setAirbornePerimeterSeal = useWorkbenchStore((state) => state.setAirbornePerimeterSeal);
  const setAirborneReceivingRoomRt60S = useWorkbenchStore((state) => state.setAirborneReceivingRoomRt60S);
  const setAirborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setAirborneReceivingRoomVolumeM3);
  const setAirborneResilientBarSideCount = useWorkbenchStore((state) => state.setAirborneResilientBarSideCount);
  const setAirborneSharedTrack = useWorkbenchStore((state) => state.setAirborneSharedTrack);
  const setAirborneStudSpacingMm = useWorkbenchStore((state) => state.setAirborneStudSpacingMm);
  const setAirborneStudType = useWorkbenchStore((state) => state.setAirborneStudType);
  const setAirborneWallCavity1AbsorptionClass = useWorkbenchStore((state) => state.setAirborneWallCavity1AbsorptionClass);
  const setAirborneWallCavity1DepthMm = useWorkbenchStore((state) => state.setAirborneWallCavity1DepthMm);
  const setAirborneWallCavity1FillCoverage = useWorkbenchStore((state) => state.setAirborneWallCavity1FillCoverage);
  const setAirborneWallCavity1LayerIndices = useWorkbenchStore((state) => state.setAirborneWallCavity1LayerIndices);
  const setAirborneWallCavity2AbsorptionClass = useWorkbenchStore((state) => state.setAirborneWallCavity2AbsorptionClass);
  const setAirborneWallCavity2DepthMm = useWorkbenchStore((state) => state.setAirborneWallCavity2DepthMm);
  const setAirborneWallCavity2FillCoverage = useWorkbenchStore((state) => state.setAirborneWallCavity2FillCoverage);
  const setAirborneWallCavity2LayerIndices = useWorkbenchStore((state) => state.setAirborneWallCavity2LayerIndices);
  const setAirborneWallInternalLeafCoupling = useWorkbenchStore((state) => state.setAirborneWallInternalLeafCoupling);
  const setAirborneWallInternalLeafLayerIndices = useWorkbenchStore((state) => state.setAirborneWallInternalLeafLayerIndices);
  const setAirborneWallSideALeafLayerIndices = useWorkbenchStore((state) => state.setAirborneWallSideALeafLayerIndices);
  const setAirborneWallSideBLeafLayerIndices = useWorkbenchStore((state) => state.setAirborneWallSideBLeafLayerIndices);
  const setAirborneWallSupportTopology = useWorkbenchStore((state) => state.setAirborneWallSupportTopology);
  const setAirborneWallTopologyMode = useWorkbenchStore((state) => state.setAirborneWallTopologyMode);
  const setBriefNote = useWorkbenchStore((state) => state.setBriefNote);
  const setCalculatorId = useWorkbenchStore((state) => state.setCalculatorId);
  const setClientName = useWorkbenchStore((state) => state.setClientName);
  const setConsultantAddress = useWorkbenchStore((state) => state.setConsultantAddress);
  const setConsultantCompany = useWorkbenchStore((state) => state.setConsultantCompany);
  const setConsultantEmail = useWorkbenchStore((state) => state.setConsultantEmail);
  const setConsultantLogoDataUrl = useWorkbenchStore((state) => state.setConsultantLogoDataUrl);
  const setConsultantPhone = useWorkbenchStore((state) => state.setConsultantPhone);
  const setConsultantWordmarkLine = useWorkbenchStore((state) => state.setConsultantWordmarkLine);
  const setImpactGuideKDb = useWorkbenchStore((state) => state.setImpactGuideKDb);
  const setImpactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setImpactGuideReceivingRoomVolumeM3);
  const setImpactSteelCarrierDepthMm = useWorkbenchStore((state) => state.setImpactSteelCarrierDepthMm);
  const setImpactSteelCarrierSpacingMm = useWorkbenchStore((state) => state.setImpactSteelCarrierSpacingMm);
  const setImpactSteelLoadBasisKgM2 = useWorkbenchStore((state) => state.setImpactSteelLoadBasisKgM2);
  const setImpactSteelLowerCeilingIsolationSupportForm = useWorkbenchStore((state) => state.setImpactSteelLowerCeilingIsolationSupportForm);
  const setImpactSteelResilientLayerDynamicStiffnessMNm3 = useWorkbenchStore((state) => state.setImpactSteelResilientLayerDynamicStiffnessMNm3);
  const setImpactSteelSupportForm = useWorkbenchStore((state) => state.setImpactSteelSupportForm);
  const setImpactTimberCltBaseFloorDensityKgM3 = useWorkbenchStore((state) => state.setImpactTimberCltBaseFloorDensityKgM3);
  const setImpactTimberCltBaseFloorThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltBaseFloorThicknessMm);
  const setImpactTimberCltImpactSystemType = useWorkbenchStore((state) => state.setImpactTimberCltImpactSystemType);
  const setImpactTimberCltLoadBasisKgM2 = useWorkbenchStore((state) => state.setImpactTimberCltLoadBasisKgM2);
  const setImpactTimberCltLowerAssemblyType = useWorkbenchStore((state) => state.setImpactTimberCltLowerAssemblyType);
  const setImpactTimberCltLowerBoardLayerCount = useWorkbenchStore((state) => state.setImpactTimberCltLowerBoardLayerCount);
  const setImpactTimberCltLowerBoardThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltLowerBoardThicknessMm);
  const setImpactTimberCltLowerCavityDepthMm = useWorkbenchStore((state) => state.setImpactTimberCltLowerCavityDepthMm);
  const setImpactTimberCltLowerCavityFillThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltLowerCavityFillThicknessMm);
  const setImpactTimberCltLowerSupportClass = useWorkbenchStore((state) => state.setImpactTimberCltLowerSupportClass);
  const setImpactTimberCltResilientLayerDynamicStiffnessMNm3 = useWorkbenchStore((state) => state.setImpactTimberCltResilientLayerDynamicStiffnessMNm3);
  const setImpactTimberCltResilientLayerThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltResilientLayerThicknessMm);
  const setImpactTimberCltStructuralSupportType = useWorkbenchStore((state) => state.setImpactTimberCltStructuralSupportType);
  const setImpactTimberCltUpperFillDensityKgM3 = useWorkbenchStore((state) => state.setImpactTimberCltUpperFillDensityKgM3);
  const setImpactTimberCltUpperFillThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltUpperFillThicknessMm);
  const setImpactTimberCltUpperTreatmentDensityKgM3 = useWorkbenchStore((state) => state.setImpactTimberCltUpperTreatmentDensityKgM3);
  const setImpactTimberCltUpperTreatmentThicknessMm = useWorkbenchStore((state) => state.setImpactTimberCltUpperTreatmentThicknessMm);
  const setApproverTitle = useWorkbenchStore((state) => state.setApproverTitle);
  const setPreparedBy = useWorkbenchStore((state) => state.setPreparedBy);
  const setProposalIssueCodePrefix = useWorkbenchStore((state) => state.setProposalIssueCodePrefix);
  const setProposalAttention = useWorkbenchStore((state) => state.setProposalAttention);
  const setProposalIssuePurpose = useWorkbenchStore((state) => state.setProposalIssuePurpose);
  const setProposalRecipient = useWorkbenchStore((state) => state.setProposalRecipient);
  const setProjectName = useWorkbenchStore((state) => state.setProjectName);
  const setProposalReference = useWorkbenchStore((state) => state.setProposalReference);
  const setProposalRevision = useWorkbenchStore((state) => state.setProposalRevision);
  const setProposalSubject = useWorkbenchStore((state) => state.setProposalSubject);
  const setProposalValidityNote = useWorkbenchStore((state) => state.setProposalValidityNote);
  const setRequestedOutputs = useWorkbenchStore((state) => state.setRequestedOutputs);
  const setReportProfile = useWorkbenchStore((state) => state.setReportProfile);
  const replaceSingleBaseStructure = useWorkbenchStore((state) => state.replaceSingleBaseStructure);
  const updateDensity = useWorkbenchStore((state) => state.updateDensity);
  const updateDynamicStiffness = useWorkbenchStore((state) => state.updateDynamicStiffness);
  const updateFloorRole = useWorkbenchStore((state) => state.updateFloorRole);
  const updateMaterial = useWorkbenchStore((state) => state.updateMaterial);
  const updateThickness = useWorkbenchStore((state) => state.updateThickness);

  // ── Derived values ───────────────────────────────────────────────────────
  const materials = buildWorkbenchMaterialCatalog(customMaterials);
  const modePresets = MODE_PRESETS[studyMode].map((presetId) => getPresetById(presetId));
  const automaticOutputs = getAutomaticOutputs(studyMode, airborneContextMode);
  const steelFloorFormulaInputSurfaceActive =
    studyMode === "floor" &&
    automaticOutputs.some((output) => output === "Ln,w" || output === "DeltaLw" || FIELD_IMPACT_OUTPUTS.has(output)) &&
    rows.some(
      (row) =>
        row.floorRole === "base_structure" &&
        STEEL_FLOOR_FORMULA_BASE_MATERIAL_IDS.has(row.materialId)
    );
  const timberCltDeltaLwInputSurfaceActive =
    studyMode === "floor" &&
    automaticOutputs.some((output) => output === "Ln,w" || output === "DeltaLw") &&
    rows.some(
      (row) =>
        row.floorRole === "base_structure" &&
        TIMBER_CLT_DELTA_LW_BASE_MATERIAL_IDS.has(row.materialId)
    );
  const openingLeakCompositeInputSurfaceActive = studyMode === "wall";
  const totalThickness = sumThickness(rows);
  const { collapsedLiveRowCount, liveRowCount, parkedRowCount, solverLayerCount } = getRowActivityCounts(rows, materials);

  // ── Local state ──────────────────────────────────────────────────────────
  const [newLayerDraft, setNewLayerDraft] = useState<NewLayerDraft>(() => buildDefaultNewLayerDraft(studyMode));
  const [customMaterialDraft, setCustomMaterialDraft] = useState<CustomMaterialDraft>(() => createEmptyCustomMaterialDraft());
  const [customMaterialExpanded, setCustomMaterialExpanded] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [activeAssemblyTool, setActiveAssemblyTool] = useState<AssemblyToolPanel | null>(null);
  const [movedRowFlash, setMovedRowFlash] = useState<{ direction: "down" | "up"; rowId: string } | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTabId>("method");
  const [activeWorkspacePanel, setActiveWorkspacePanel] = useState<WorkspacePanelId>(() => (rows.length > 0 ? "stack" : "setup"));
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [serverProjectStatus, setServerProjectStatus] = useState<ServerProjectStatus>("idle");
  const [serverProjectMessage, setServerProjectMessage] = useState("Browser-local");
  const [serverProjects, setServerProjects] = useState<ServerProjectSummaryPayload[]>([]);
  const [selectedServerProjectId, setSelectedServerProjectId] = useState("");
  const [activeServerProject, setActiveServerProject] = useState<{
    id: string;
    name: string;
    scenarioId?: string;
  } | null>(null);
  const previousNewLayerDraftRef = useRef(newLayerDraft);
  const draftMaterial = materials.find((material) => material.id === newLayerDraft.materialId) ?? null;
  const draftMaterialEligibleForBaseReplacement = draftMaterial ? isMaterialEligibleFloorBaseStructure(draftMaterial) : false;
  const explicitBaseStructureCount = rows.filter((row) => row.floorRole === "base_structure").length;
  const replaceConfiguredBaseLayerAvailable =
    studyMode === "floor" &&
    newLayerDraft.floorRole === "base_structure" &&
    explicitBaseStructureCount === 1 &&
    draftMaterialEligibleForBaseReplacement;

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (sameRequestedOutputs(requestedOutputs, automaticOutputs)) return;
    setRequestedOutputs(automaticOutputs);
  }, [automaticOutputs, requestedOutputs, setRequestedOutputs]);

  useEffect(() => {
    const previousDraft = previousNewLayerDraftRef.current;
    const materialOrRoleChanged =
      previousDraft.materialId !== newLayerDraft.materialId || previousDraft.floorRole !== newLayerDraft.floorRole;

    if (!materialOrRoleChanged) {
      previousNewLayerDraftRef.current = newLayerDraft;
      return;
    }

    const nextMaterial = materials.find((material) => material.id === newLayerDraft.materialId) ?? null;
    const previousMaterial = materials.find((material) => material.id === previousDraft.materialId) ?? null;

    if (!nextMaterial) {
      previousNewLayerDraftRef.current = newLayerDraft;
      return;
    }

    const baselineDraft = buildDefaultNewLayerDraft(studyMode);
    const nextThickness = resolveThicknessForMaterialChange({
      currentThicknessMm: newLayerDraft.thicknessMm,
      nextFloorRole: newLayerDraft.floorRole,
      nextMaterial,
      previousDefaultThicknessMm:
        previousDraft.materialId === baselineDraft.materialId ? baselineDraft.thicknessMm : undefined,
      previousFloorRole: previousDraft.floorRole,
      previousMaterial
    });

    if (nextThickness !== newLayerDraft.thicknessMm) {
      previousNewLayerDraftRef.current = { ...newLayerDraft, thicknessMm: nextThickness };
      setNewLayerDraft((current) =>
        current.materialId === newLayerDraft.materialId &&
        current.floorRole === newLayerDraft.floorRole &&
        current.thicknessMm === newLayerDraft.thicknessMm
          ? { ...current, thicknessMm: nextThickness }
          : current
      );
      return;
    }

    previousNewLayerDraftRef.current = newLayerDraft;
  }, [materials, newLayerDraft, setNewLayerDraft, studyMode]);

  useEffect(() => { setNewLayerDraft(buildDefaultNewLayerDraft(studyMode)); }, [studyMode]);

  useEffect(() => {
    if (activeRowId && !rows.some((row) => row.id === activeRowId)) setActiveRowId(null);
  }, [activeRowId, rows]);

  useEffect(() => {
    if (expandedRowId && rows.some((row) => row.id === expandedRowId)) return;
    setExpandedRowId(null);
  }, [expandedRowId, rows]);

  useEffect(() => {
    if (!movedRowFlash) return;
    const timeoutId = window.setTimeout(() => {
      setMovedRowFlash((current) => (current?.rowId === movedRowFlash.rowId ? null : current));
    }, 520);
    return () => window.clearTimeout(timeoutId);
  }, [movedRowFlash]);

  // ── Computed values ──────────────────────────────────────────────────────
  const selectedPreset = modePresets.find((preset) => preset.id === activePresetId) ?? modePresets[0]!;
  const selectedContextOption = AIRBORNE_CONTEXT_OPTIONS.find((option) => option.value === airborneContextMode) ?? AIRBORNE_CONTEXT_OPTIONS[0]!;
  const newLayerMaterialGroups = buildMaterialGroups(studyMode, materials, newLayerDraft.materialId, newLayerDraft.floorRole);
  const customMaterialErrors = validateCustomMaterialDraft(customMaterialDraft, materials);
  const wallTopologyDraft = {
    airborneWallCavity1AbsorptionClass,
    airborneWallCavity1DepthMm,
    airborneWallCavity1FillCoverage,
    airborneWallCavity1LayerIndices,
    airborneWallCavity2AbsorptionClass,
    airborneWallCavity2DepthMm,
    airborneWallCavity2FillCoverage,
    airborneWallCavity2LayerIndices,
    airborneWallInternalLeafCoupling,
    airborneWallInternalLeafLayerIndices,
    airborneWallSideALeafLayerIndices,
    airborneWallSideBLeafLayerIndices,
    airborneWallSupportTopology,
    airborneWallTopologyMode
  };
  const liveWallTopology = studyMode === "wall" ? buildWorkbenchWallTopology(wallTopologyDraft, rows.length) : undefined;

  const liveAirborneBaseContext: Omit<
    AirborneContext,
    "airtightness" | "contextMode" | "panelHeightMm" | "panelWidthMm" | "receivingRoomRt60S" | "receivingRoomVolumeM3"
  > = {
    connectionType: airborneConnectionType,
    electricalBoxes: airborneElectricalBoxes,
    junctionQuality: airborneJunctionQuality,
    penetrationState: airbornePenetrationState,
    perimeterSeal: airbornePerimeterSeal,
    resilientBarSideCount: airborneResilientBarSideCount,
    sharedTrack: airborneSharedTrack,
    studSpacingMm: parsePositiveNumber(airborneStudSpacingMm),
    studType: airborneStudType,
    wallTopology: liveWallTopology
  };
  const openingLeakCompositeInputSurface = buildWorkbenchOpeningLeakCompositeInputSurface({
    studyMode,
    surface: {
      elements: airborneOpeningLeakElements,
      hostWallAreaM2: airborneOpeningLeakHostWallAreaM2
    },
    targetOutputs: automaticOutputs
  });
  const liveAirborneBaseContextWithOpenings: typeof liveAirborneBaseContext = {
    ...liveAirborneBaseContext,
    ...(openingLeakCompositeInputSurface.status !== "inactive"
      ? openingLeakCompositeInputSurface.airborneContextPatch
      : {})
  };
  const airborneFieldContextInputSurface = buildWorkbenchAirborneFieldContextInputSurface({
    studyMode,
    surface: {
      airtightness: airborneAirtightness,
      baseContext: liveAirborneBaseContextWithOpenings,
      contextMode: airborneContextMode,
      panelHeightMm: airbornePanelHeightMm,
      panelWidthMm: airbornePanelWidthMm,
      receivingRoomRt60S: airborneReceivingRoomRt60S,
      receivingRoomVolumeM3: airborneReceivingRoomVolumeM3
    },
    targetOutputs: automaticOutputs
  });
  const liveAirborneContext: AirborneContext = {
    ...airborneFieldContextInputSurface.airborneContext,
    ...(openingLeakCompositeInputSurface.status !== "inactive"
      ? openingLeakCompositeInputSurface.airborneContextPatch
      : {}),
    airtightness: airborneAirtightness,
    contextMode: airborneContextMode,
    panelHeightMm: parsePositiveNumber(airbornePanelHeightMm),
    panelWidthMm: parsePositiveNumber(airbornePanelWidthMm),
    receivingRoomRt60S: parsePositiveNumber(airborneReceivingRoomRt60S),
    receivingRoomVolumeM3: parsePositiveNumber(airborneReceivingRoomVolumeM3)
  };

  const liveImpactFieldContext: ImpactFieldContext | null =
    studyMode === "floor" && (parsePositiveNumber(impactGuideKDb) || parsePositiveNumber(impactGuideReceivingRoomVolumeM3))
      ? { fieldKDb: parsePositiveNumber(impactGuideKDb), receivingRoomVolumeM3: parsePositiveNumber(impactGuideReceivingRoomVolumeM3) }
      : null;

  const scenario = evaluateScenario({
    airborneFieldContextInputSurface: {
      airtightness: airborneAirtightness,
      baseContext: liveAirborneBaseContext,
      contextMode: airborneContextMode,
      panelHeightMm: airbornePanelHeightMm,
      panelWidthMm: airbornePanelWidthMm,
      receivingRoomRt60S: airborneReceivingRoomRt60S,
      receivingRoomVolumeM3: airborneReceivingRoomVolumeM3
    },
    airborneContext: liveAirborneContext,
    calculator: calculatorId,
    customMaterials,
    id: "simple-current",
    impactFieldContext: liveImpactFieldContext,
    name: projectName,
    openingLeakCompositeInputSurface: openingLeakCompositeInputSurfaceActive
      ? {
          elements: airborneOpeningLeakElements,
          hostWallAreaM2: airborneOpeningLeakHostWallAreaM2
        }
      : null,
    rows,
    source: "current",
    steelFloorFormulaInputSurface: steelFloorFormulaInputSurfaceActive
      ? {
          impactSteelCarrierDepthMm,
          impactSteelCarrierSpacingMm,
          impactSteelLoadBasisKgM2,
          impactSteelLowerCeilingIsolationSupportForm,
          impactSteelResilientLayerDynamicStiffnessMNm3,
          impactSteelSupportForm
        }
      : null,
    studyMode,
    targetOutputs: automaticOutputs,
    timberCltDeltaLwInputSurface: timberCltDeltaLwInputSurfaceActive
      ? {
          impactTimberCltBaseFloorDensityKgM3,
          impactTimberCltBaseFloorThicknessMm,
          impactTimberCltImpactSystemType,
          impactTimberCltLoadBasisKgM2,
          impactTimberCltLowerAssemblyType,
          impactTimberCltLowerBoardLayerCount,
          impactTimberCltLowerBoardThicknessMm,
          impactTimberCltLowerCavityDepthMm,
          impactTimberCltLowerCavityFillThicknessMm,
          impactTimberCltLowerSupportClass,
          impactTimberCltResilientLayerDynamicStiffnessMNm3,
          impactTimberCltResilientLayerThicknessMm,
          impactTimberCltStructuralSupportType,
          impactTimberCltUpperFillDensityKgM3,
          impactTimberCltUpperFillThicknessMm,
          impactTimberCltUpperTreatmentDensityKgM3,
          impactTimberCltUpperTreatmentThicknessMm
        }
      : null
  });

  const result = scenario.result;
  const assemblyDescription = describeAssembly(result, studyMode);
  const fieldAirborneRequested = automaticOutputs.some((output) => FIELD_AIRBORNE_OUTPUTS.has(output));
  const fieldImpactRequested = automaticOutputs.some((output) => FIELD_IMPACT_OUTPUTS.has(output));
  const geometryActive = airborneContextMode !== "element_lab" && fieldAirborneRequested;
  const standardizedAirborneActive = geometryActive && automaticOutputs.some((output) => STANDARDIZED_AIRBORNE_OUTPUTS.has(output));
  const wallModifiersActive = studyMode === "wall" && airborneContextMode !== "element_lab";
  const impactFieldActive = studyMode === "floor" && fieldImpactRequested;
  const standardizedImpactOutputsActive = automaticOutputs.includes("L'nT,w") || automaticOutputs.includes("L'nT,50");
  const wallTopologyControlsActive = studyMode === "wall";
  const wallTopologyInputsActive = wallTopologyControlsActive && hasActiveWorkbenchWallTopologyDraft(wallTopologyDraft);
  const expertInputsActive = wallModifiersActive || wallTopologyInputsActive || calculatorId !== "dynamic";
  const validThicknessCount = countValidThicknessRows(rows);
  const assignedFloorRoleCount = countAssignedFloorRoles(rows);
  const missingFloorRoleCount = studyMode === "floor" ? Math.max(rows.length - assignedFloorRoleCount, 0) : 0;

  const contextNotes: string[] = [];
  if (!geometryActive) {
    contextNotes.push(airborneContextMode === "element_lab" ? "Lab mode ignores room geometry, RT60, and field normalization inputs." : "The current output set does not need extra airborne geometry fields.");
  } else if (!standardizedAirborneActive) {
    contextNotes.push("Receiving-room volume stays parked because the current route stops at apparent field outputs such as R'w and Dn,w.");
  } else {
    contextNotes.push("Field-standardized airborne outputs require partition geometry, receiving-room volume, and RT60 before Gate I can defend the field-context route.");
  }
  if (studyMode === "floor") {
    if (steelFloorFormulaInputSurfaceActive) contextNotes.push("Steel floor formula inputs are active for the source-absent lab impact lane.");
    if (timberCltDeltaLwInputSurfaceActive) contextNotes.push("Timber/CLT DeltaLw formula inputs are active for the source-absent lab impact lane.");
    if (!impactFieldActive) contextNotes.push("Field K and floor-side room-volume corrections stay hidden until field impact outputs are requested.");
    else if (!standardizedImpactOutputsActive) contextNotes.push("Floor field volume is optional right now because only L'n,w is active; standardized L'nT outputs are not requested yet.");
  }
  if (openingLeakCompositeInputSurfaceActive) {
    contextNotes.push("Opening/leak fields can activate the Gate S lab Rw composite route; blank fields leave the host-wall route unchanged.");
  }
  if (!wallModifiersActive) contextNotes.push("Wall leakage modifiers only matter on wall field or building reads, so they stay out of the main path here.");

  const panelWidthSanityWarning = geometryActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.panelWidthMm, label: "Partition width", suffix: "Check that the value is in millimetres.", value: airbornePanelWidthMm }) : null;
  const panelHeightSanityWarning = geometryActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.panelHeightMm, label: "Partition height", suffix: "Check that the value is in millimetres.", value: airbornePanelHeightMm }) : null;
  const airborneVolumeSanityWarning = geometryActive && standardizedAirborneActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3, label: "Receiving-room volume", suffix: "Check that the value reflects the real receiving space.", value: airborneReceivingRoomVolumeM3 }) : null;
  const rt60SanityWarning = standardizedAirborneActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S, label: "RT60", suffix: "Recheck the measurement or assumption before trusting a standardized field read.", value: airborneReceivingRoomRt60S }) : null;
  const impactKSanityWarning = impactFieldActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.fieldKDb, label: "Field K correction", suffix: "Recheck the correction source before trusting carried field impact values.", value: impactGuideKDb }) : null;
  const impactVolumeSanityWarning = impactFieldActive && standardizedImpactOutputsActive ? getGuidedNumericSanityWarning({ band: GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3, label: "Impact receiving-room volume", suffix: "Check that the value reflects the room used for field standardization.", value: impactGuideReceivingRoomVolumeM3 }) : null;

  // ── Output cards ─────────────────────────────────────────────────────────
  const outputCards = automaticOutputs.map((output) => addOutputCardPosture(buildOutputCard({ output, result, studyMode }), { result, studyMode }));
  const readyCards = outputCards.filter((card) => card.status === "live" || card.status === "bound");
  const pendingCards = outputCards.filter((card) => card.status !== "live" && card.status !== "bound");
  const liveOutputCards = outputCards.filter((card) => card.status === "live");
  const boundOutputCards = outputCards.filter((card) => card.status === "bound");
  const needsInputCards = pendingCards.filter((card) => card.status === "needs_input");
  const unsupportedCards = pendingCards.filter((card) => card.status === "unsupported");
  const outputUnlockGroups = getGuidedOutputUnlocks({ airborneContextMode, airbornePanelHeightMm, airbornePanelWidthMm, airborneReceivingRoomRt60S, airborneReceivingRoomVolumeM3, impactGuideKDb, impactGuideReceivingRoomVolumeM3, parkedOutputs: needsInputCards.map((card) => card.output), studyMode });
  const primaryReadyCard = pickPrimaryOutputCard(readyCards, studyMode);
  const secondaryReadyCards = primaryReadyCard ? readyCards.filter((card) => card !== primaryReadyCard) : readyCards;
  const readyOutputCount = readyCards.length;
  const heroHeadline = result ? assemblyDescription.headline : "Choose a context and build the assembly to start the live estimate.";
  const routeCoverageLabel = rows.length === 0 ? "Stack empty" : `${validThicknessCount}/${rows.length} layer${rows.length === 1 ? "" : "s"} ready`;
  const hasOptionalContextFields = geometryActive || (impactFieldActive && !standardizedImpactOutputsActive);
  const validationSummary = getGuidedValidationSummary({ result, studyMode });
  const topologyGap = getGuidedTopologyGap({ result, rows, studyMode });
  const routeSignals = deriveGuidedRouteSignals({ missingFloorRoleCount, primaryReadyCard: primaryReadyCard ? { label: primaryReadyCard.label, value: primaryReadyCard.value } : null, rowsLength: rows.length, studyMode, topologyGap, validationPosture: validationSummary.posture, validThicknessCount, warningCount: scenario.warnings.length });
  const dynamicCalcBranch = getDynamicCalcBranchSummary({ result, studyMode });
  const showTimberImpactOnlyGuidedActions = studyMode === "floor" && isImpactOnlyLowConfidenceFloorLane(result);
  const lightweightSteelBaseRow = studyMode === "floor" ? rows.find((row) => row.floorRole === "base_structure" && row.materialId === "lightweight_steel_floor") : null;
  const showSteelBoundSupportFormActions = studyMode === "floor" && isSteelBoundSupportFormLane(result) && Boolean(lightweightSteelBaseRow);

  // ── Proposal data ────────────────────────────────────────────────────────
  const proposalIssuedOnLabel = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date());
  const proposalIssuedOnIso = new Date().toISOString();
  const outputUnlockActionById = new Map<RequestedOutputId, string>();
  for (const group of outputUnlockGroups) {
    for (const output of group.outputs) {
      if (!outputUnlockActionById.has(output)) outputUnlockActionById.set(output, group.title);
    }
  }
  const proposalMetrics = readyCards.map((card) => ({ detail: card.detail, label: card.label, value: card.value }));
  const proposalCoverageItems = outputCards.map((card) => ({
    detail: card.detail, label: card.label, nextStep: card.status === "needs_input" ? outputUnlockActionById.get(card.output) : undefined,
    postureDetail: card.postureDetail, postureLabel: card.postureLabel, postureTone: card.postureTone, status: card.status, value: card.value
  }));
  const proposalLayers = rows.map((row, index) => {
    const material = materials.find((entry) => entry.id === row.materialId);
    const effectiveDensity = material ? getEffectiveDensity({ material, overrideValue: row.densityKgM3 }) : undefined;
    const densityLabel = material ? formatDensityLabel(material, row.densityKgM3) : "Not listed";
    const layerThicknessMm = parsePositiveNumber(row.thicknessMm);
    const surfaceMassLabel = typeof effectiveDensity === "number" && typeof layerThicknessMm === "number" ? `${formatDecimal((effectiveDensity * layerThicknessMm) / 1000)} kg/m²` : undefined;
    return {
      categoryLabel: material ? getMaterialCategoryLabel(material) : "Uncatalogued layer",
      densityLabel, index: index + 1, label: material?.name ?? row.materialId,
      roleLabel: studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : undefined,
      surfaceMassLabel, thicknessLabel: `${row.thicknessMm.trim().length > 0 ? row.thicknessMm : "?"} mm`
    };
  });

  // ── Method & evidence dossiers ───────────────────────────────────────────
  const methodReadyMetrics = readyCards.map((card) => ({ detail: card.detail, label: card.label, value: card.value }));
  const methodUnlocks = outputUnlockGroups.map((group) => ({ detail: group.detail, outputsLabel: formatUnlockOutputs(group.outputs), title: group.title }));
  const methodStackDetail = parkedRowCount > 0
    ? `${formatCountLabel(liveRowCount, "live row")} currently resolve to ${formatCountLabel(solverLayerCount, "solver layer")}. ${formatCountLabel(parkedRowCount, "parked row")} stay visible but do not affect the live route.`
    : collapsedLiveRowCount > 0
      ? `${formatCountLabel(liveRowCount, "live row")} collapse to ${formatCountLabel(solverLayerCount, "solver layer")} before calculation because adjacent identical live rows are merged.`
      : `${formatCountLabel(liveRowCount, "live row")} feed ${formatCountLabel(solverLayerCount, "solver layer")} directly on the active route.`;
  const methodDossier = buildSimpleWorkbenchMethodDossier({
    branchDetail: dynamicCalcBranch.detail, branchLabel: dynamicCalcBranch.value, contextLabel: getEnvironmentLabel(airborneContextMode),
    coverageItems: proposalCoverageItems, layers: proposalLayers, result: scenario.result, stackDetail: methodStackDetail,
    studyModeLabel: getStudyModeLabel(studyMode), validationDetail: validationSummary.detail, validationLabel: validationSummary.value, warnings: scenario.warnings
  });
  const corridorDossier = buildSimpleWorkbenchCorridorDossier(scenario.result, studyMode);
  const selectedTraceNoteCount = methodDossier.traceGroups.reduce((count, group) => count + group.notes.length, 0);
  const proposalEvidence = buildSimpleWorkbenchEvidencePacket({ briefNote, outputs: automaticOutputs, result, warnings: scenario.warnings });
  const proposalBrief = buildSimpleWorkbenchProposalBrief({
    briefNote, citations: proposalEvidence.citations, consultantCompany, contextLabel: getEnvironmentLabel(airborneContextMode),
    dynamicBranchDetail: dynamicCalcBranch.detail, dynamicBranchLabel: dynamicCalcBranch.value, issueCodePrefix: proposalIssueCodePrefix,
    issuedOnIso: proposalIssuedOnIso, primaryMetricLabel: proposalMetrics[0]?.label ?? "Primary read",
    primaryMetricValue: proposalMetrics[0]?.value ?? "Waiting for supported output", projectName,
    reportProfileLabel: REPORT_PROFILE_LABELS[reportProfile], studyContextLabel: STUDY_CONTEXT_LABELS[studyContext],
    studyModeLabel: getStudyModeLabel(studyMode), validationDetail: validationSummary.detail, validationLabel: validationSummary.value,
    validationTone: validationSummary.tone, warnings: scenario.warnings
  });
  const methodAssumptionItems = proposalBrief.assumptionItems;
  const activeReviewPanelId = `guided-review-panel-${activeReviewTab}`;
  const exportReady = proposalLayers.length > 0 && proposalMetrics.length > 0;
  const responseCurveFigures = buildWorkbenchResponseCurveFigures(result);

  // ── Callbacks ────────────────────────────────────────────────────────────
  const buildCurrentServerScenarioSnapshot = (): ServerProjectWorkbenchSnapshot => {
    const savedAtIso = new Date().toISOString();
    const snapshot: ScenarioSnapshot = {
      airborneAirtightness,
      airborneConnectionType,
      airborneContextMode,
      airborneElectricalBoxes,
      airborneJunctionQuality,
      airborneOpeningLeakElements: airborneOpeningLeakElements.map((element) => ({ ...element })),
      airborneOpeningLeakHostWallAreaM2,
      airbornePanelHeightMm,
      airbornePanelWidthMm,
      airbornePenetrationState,
      airbornePerimeterSeal,
      airborneReceivingRoomRt60S,
      airborneReceivingRoomVolumeM3,
      airborneResilientBarSideCount,
      airborneSharedTrack,
      airborneStudSpacingMm,
      airborneStudType,
      airborneWallCavity1AbsorptionClass,
      airborneWallCavity1DepthMm,
      airborneWallCavity1FillCoverage,
      airborneWallCavity1LayerIndices,
      airborneWallCavity2AbsorptionClass,
      airborneWallCavity2DepthMm,
      airborneWallCavity2FillCoverage,
      airborneWallCavity2LayerIndices,
      airborneWallInternalLeafCoupling,
      airborneWallInternalLeafLayerIndices,
      airborneWallSideALeafLayerIndices,
      airborneWallSideBLeafLayerIndices,
      airborneWallSupportTopology,
      airborneWallTopologyMode,
      approverTitle,
      briefNote,
      calculatorId,
      clientName,
      consultantAddress,
      consultantCompany,
      consultantEmail,
      consultantLogoDataUrl,
      consultantPhone,
      consultantWordmarkLine,
      criteriaPackId,
      customMaterials: [...customMaterials],
      fieldRiskIds: [...fieldRiskIds],
      id: crypto.randomUUID(),
      impactDirectPathOffsetDb,
      impactExactBandInput,
      impactExactLabOrField,
      impactFlankingPathsInput,
      impactGuideCi50_2500Db,
      impactGuideCiDb,
      impactGuideHdDb,
      impactGuideKDb,
      impactGuideMassRatio,
      impactGuideReceivingRoomVolumeM3,
      impactGuideSmallRoomMode,
      impactGuideSource,
      impactImprovementBandInput,
      impactLowerTreatmentReductionDb,
      impactReferenceDeltaLwDb,
      impactSteelCarrierDepthMm,
      impactSteelCarrierSpacingMm,
      impactSteelLoadBasisKgM2,
      impactSteelLowerCeilingIsolationSupportForm,
      impactSteelResilientLayerDynamicStiffnessMNm3,
      impactSteelSupportForm,
      impactTimberCltBaseFloorDensityKgM3,
      impactTimberCltBaseFloorThicknessMm,
      impactTimberCltImpactSystemType,
      impactTimberCltLoadBasisKgM2,
      impactTimberCltLowerAssemblyType,
      impactTimberCltLowerBoardLayerCount,
      impactTimberCltLowerBoardThicknessMm,
      impactTimberCltLowerCavityDepthMm,
      impactTimberCltLowerCavityFillThicknessMm,
      impactTimberCltLowerSupportClass,
      impactTimberCltResilientLayerDynamicStiffnessMNm3,
      impactTimberCltResilientLayerThicknessMm,
      impactTimberCltStructuralSupportType,
      impactTimberCltUpperFillDensityKgM3,
      impactTimberCltUpperFillThicknessMm,
      impactTimberCltUpperTreatmentDensityKgM3,
      impactTimberCltUpperTreatmentThicknessMm,
      name: `${projectName.trim() || "Untitled project"} server snapshot`,
      preparedBy,
      proposalAttention,
      proposalIssueCodePrefix,
      proposalIssuePurpose,
      proposalRecipient,
      proposalReference,
      proposalRevision,
      proposalSubject,
      proposalValidityNote,
      presetId: activePresetId,
      projectName,
      reportProfile,
      requestedOutputs: [...requestedOutputs],
      rows: rows.map((row) => ({ ...row })),
      savedAtIso,
      studyMode,
      targetLnwDb,
      targetRwDb
    };

    return buildServerProjectWorkbenchSnapshot(snapshot);
  };

  const refreshServerProjects = async (options?: { preserveMessage?: boolean; silent?: boolean }) => {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading server projects");
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
      }

      if (!options?.preserveMessage) {
        setServerProjectStatus("idle");
        setServerProjectMessage(projects.length > 0 ? `${projects.length} server project${projects.length === 1 ? "" : "s"}` : "Browser-local");
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Server project list failed");
      if (!options?.silent) {
        toast.error("Server project list failed", {
          description: error instanceof Error ? error.message : "DAC could not load server projects."
        });
      }
    }
  };

  useEffect(() => {
    void refreshServerProjects({ silent: true });
    // Server project listing is an explicit persistence surface; the
    // initial read intentionally runs once per mounted workbench.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncCurrentProjectToServer = async () => {
    const snapshot = buildCurrentServerScenarioSnapshot();
    setServerProjectStatus("syncing");
    setServerProjectMessage("Syncing current project");

    try {
      const response = await fetch("/api/projects/import-local", {
        body: JSON.stringify({
          clientName: clientName.trim() || undefined,
          projectName: projectName.trim() || undefined,
          scenarios: [
            {
              inputSnapshot: snapshot,
              localScenarioId: snapshot.id,
              name: snapshot.name,
              outputSnapshot: {
                result,
                warnings: scenario.warnings
              },
              savedAtIso: snapshot.savedAtIso
            }
          ]
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not sync the project."));
      }

      const payload = (await response.json()) as unknown;
      const project = parseServerProjectRecord(payload);
      const latestScenario = project ? getLatestServerProjectScenario(project) : null;

      if (!project) {
        throw new Error("DAC synced the project but the server response was incomplete.");
      }

      setActiveServerProject({
        id: project.id,
        name: project.name,
        scenarioId: latestScenario?.id
      });
      setSelectedServerProjectId(project.id);
      setServerProjectStatus("idle");
      setServerProjectMessage("Synced");
      await refreshServerProjects({ preserveMessage: true, silent: true });
      toast.success("Server project synced", {
        description: `${project.name} is now available from the server project list.`
      });
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Server sync failed");
      toast.error("Server sync failed", {
        description: error instanceof Error ? error.message : "DAC could not sync this workbench state."
      });
    }
  };

  const loadServerProject = async () => {
    if (!selectedServerProjectId) {
      return;
    }

    setServerProjectStatus("restoring");
    setServerProjectMessage("Loading server project");

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(selectedServerProjectId)}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load the selected server project."));
      }

      const payload = (await response.json()) as unknown;
      const project = parseServerProjectRecord(payload);
      const latestScenario = project ? getLatestServerProjectScenario(project) : null;
      const restoredSnapshot = latestScenario
        ? parseServerProjectWorkbenchSnapshot(latestScenario.calculatorInput.payload)
        : null;

      if (!project || !latestScenario || !restoredSnapshot) {
        throw new Error("Selected server project does not contain a restorable workbench snapshot.");
      }

      loadScenarioSnapshot(restoredSnapshot);
      setActiveServerProject({
        id: project.id,
        name: project.name,
        scenarioId: latestScenario.id
      });
      setServerProjectStatus("idle");
      setServerProjectMessage("Loaded");
      toast.success("Server project loaded", {
        description: `${latestScenario.name} restored into the workbench.`
      });
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Server project load failed");
      toast.error("Server project load failed", {
        description: error instanceof Error ? error.message : "DAC could not restore the selected project."
      });
    }
  };

  const revealReviewDeck = () => {
    const reveal = () => {
      const reviewDeck = document.getElementById("guided-review-deck");
      if (!reviewDeck) {
        return;
      }

      reviewDeck.scrollTop = 0;
      if (typeof reviewDeck.scrollIntoView === "function") {
        reviewDeck.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(reveal);
    } else {
      window.setTimeout(reveal, 0);
    }
  };
  const openWorkspacePanel = (panelId: WorkspacePanelId) => {
    setActiveWorkspacePanel(panelId);
    if (panelId === "review") {
      setReviewExpanded(true);
      revealReviewDeck();
    }
  };
  const closeReviewPanel = () => {
    setReviewExpanded(false);
    setActiveWorkspacePanel(rows.length > 0 ? "results" : "stack");
  };
  const selectReviewTab = (tabId: ReviewTabId) => {
    if (tabId === "proposal") {
      handleOpenPdfSetup();
      return;
    }

    setActiveReviewTab(tabId);
    setReviewExpanded(true);
    setActiveWorkspacePanel("review");
    revealReviewDeck();
  };
  const focusAssemblyPanel = () => {
    setActiveWorkspacePanel("stack");
    setReviewExpanded(false);
  };
  const appendConfiguredLayer = () => {
    if (!parsePositiveNumber(newLayerDraft.thicknessMm)) return;
    appendRows([{
      densityKgM3: newLayerDraft.densityKgM3, dynamicStiffnessMNm3: newLayerDraft.dynamicStiffnessMNm3,
      floorRole: studyMode === "floor" ? newLayerDraft.floorRole : undefined,
      materialId: newLayerDraft.materialId, thicknessMm: newLayerDraft.thicknessMm
    }]);
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
    focusAssemblyPanel();
    setActiveAssemblyTool("composer");
  };
  const replaceConfiguredBaseLayer = () => {
    if (!(replaceConfiguredBaseLayerAvailable && parsePositiveNumber(newLayerDraft.thicknessMm))) return;
    replaceSingleBaseStructure(newLayerDraft.materialId, newLayerDraft.thicknessMm);
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
    focusAssemblyPanel();
    setActiveAssemblyTool("composer");
  };
  const createCustomMaterial = () => {
    const errors = validateCustomMaterialDraft(customMaterialDraft, materials);
    if (Object.values(errors).some((value) => value)) return;
    const material = buildCustomMaterialDefinition({ draft: customMaterialDraft, existingMaterials: materials });
    addCustomMaterial(material);
    setCustomMaterialDraft(createEmptyCustomMaterialDraft());
    setCustomMaterialExpanded(false);
    setActiveAssemblyTool("composer");
    const inferredFloorRole = inferFloorRole(material.id, studyMode, [...customMaterials, material]);
    setNewLayerDraft({
      densityKgM3: "", dynamicStiffnessMNm3: "",
      floorRole: inferredFloorRole,
      materialId: material.id,
      thicknessMm: defaultThicknessForMaterialInRole(material, inferredFloorRole)
    });
    setActiveWorkspacePanel("stack");
  };
  const buildQuickProposalDocument = (): SimpleWorkbenchProposalDocument => {
    const issueSeq = readSimpleWorkbenchIssueSequence(proposalBrief.suggestedIssue.reference);

    return {
      approverTitle: approverTitle.trim() || "Acoustic Consultant", assemblyHeadline: heroHeadline,
      assumptionItems: proposalBrief.assumptionItems, briefNote,
      clientName: clientName.trim() || "Unnamed client", consultantAddress: consultantAddress.trim() || "Office address not entered",
      citations: proposalEvidence.citations, consultantCompany: consultantCompany.trim() || "DYNECHO Acoustic Consulting",
      consultantEmail: consultantEmail.trim() || "Contact email not entered", consultantLogoDataUrl: consultantLogoDataUrl.trim(),
      consultantPhone: consultantPhone.trim() || "Contact phone not entered", consultantWordmarkLine: consultantWordmarkLine.trim(),
      corridorDossierCards: corridorDossier.cards, corridorDossierHeadline: corridorDossier.headline,
      contextLabel: getEnvironmentLabel(airborneContextMode), coverageItems: proposalCoverageItems,
      decisionTrailHeadline: proposalEvidence.decisionTrailHeadline, decisionTrailItems: proposalEvidence.decisionTrailItems,
      dynamicBranchDetail: dynamicCalcBranch.detail, dynamicBranchLabel: dynamicCalcBranch.value,
      executiveSummary: proposalBrief.executiveSummary, issuedOnLabel: proposalIssuedOnLabel, issuedOnIso: proposalIssuedOnIso,
      issueBaseReference: issueSeq.baseReference, issueCodePrefix: proposalIssueCodePrefix.trim(),
      issueNextReference: issueSeq.nextReference, issueRegisterItems: [], layers: proposalLayers,
      methodDossierCards: methodDossier.cards, methodDossierHeadline: methodDossier.headline,
      methodTraceGroups: methodDossier.traceGroups,
      metrics: proposalMetrics.length > 0 ? proposalMetrics : [{ detail: "No live outputs yet.", label: "Status", value: "Waiting" }],
      preparedBy: preparedBy.trim() || "DAC Operator",
      primaryMetricLabel: proposalMetrics[0]?.label ?? "Primary read", primaryMetricValue: proposalMetrics[0]?.value ?? "Waiting",
      projectName: projectName.trim() || "Untitled acoustic proposal",
      proposalAttention: proposalAttention.trim() || "Attention line not entered",
      proposalIssuePurpose: proposalIssuePurpose.trim() || DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
      proposalRecipient: proposalRecipient.trim() || clientName.trim() || "Client delivery team",
      proposalReference: proposalReference.trim() || proposalBrief.suggestedIssue.reference,
      proposalRevision: proposalRevision.trim() || proposalBrief.suggestedIssue.revision,
      proposalSubject: proposalSubject.trim() || `${projectName.trim() || "Untitled project"} ${getStudyModeLabel(studyMode).toLowerCase()} acoustic proposal`,
      proposalValidityNote: proposalValidityNote.trim() || DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
      recommendationItems: proposalBrief.recommendationItems, reportProfile,
      reportProfileLabel: REPORT_PROFILE_LABELS[reportProfile], responseCurves: responseCurveFigures,
      serverProjectId: activeServerProject?.id,
      serverProjectScenarioId: activeServerProject?.scenarioId,
      studyModeLabel: getStudyModeLabel(studyMode), studyContextLabel: STUDY_CONTEXT_LABELS[studyContext],
      validationDetail: validationSummary.detail, validationLabel: validationSummary.value, warnings: scenario.warnings
    };
  };
  const handleQuickExport = async (
    style: SimpleWorkbenchProposalExportStyle,
    format: SimpleWorkbenchProposalExportFormat
  ) => {
    setIsExportingPdf(true);
    try {
      const doc = buildQuickProposalDocument();
      if (format === "docx") {
        await downloadSimpleWorkbenchProposalDocx(doc, { projectId: activeServerProject?.id, style });
      } else {
        await downloadSimpleWorkbenchProposalPdf(doc, { projectId: activeServerProject?.id, style });
      }
      toast.success(`${getSimpleWorkbenchProposalExportLabel({ format, style })} downloaded`);
    } catch {
      toast.error(`${getSimpleWorkbenchProposalExportLabel({ format, style })} failed`);
    } finally {
      setIsExportingPdf(false);
    }
  };
  function handleOpenPdfSetup() {
    const doc = buildQuickProposalDocument();
    storeSimpleWorkbenchProposalPreview(doc);
    window.location.assign("/workbench/proposal/configure?style=simple");
  }
  const moveRowWithFeedback = (rowId: string, direction: "up" | "down") => {
    moveRow(rowId, direction);
    setActiveRowId(rowId);
    setMovedRowFlash({ direction, rowId });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-row-id="${rowId}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  };

  const handleStudyModeChange = (nextStudyMode: "floor" | "wall") => {
    setAirborneContextMode("element_lab");
    startStudyMode(nextStudyMode);
    setActiveWorkspacePanel("setup");
    setReviewExpanded(false);
    setActiveAssemblyTool(null);
  };
  const handlePresetChange = (presetId: PresetId) => {
    loadPreset(presetId);
    focusAssemblyPanel();
    setActiveAssemblyTool(null);
  };
  const handleStartEmpty = () => {
    clearRows();
    focusAssemblyPanel();
    setActiveAssemblyTool("composer");
  };

  const serverProjectBusy =
    serverProjectStatus === "loading" ||
    serverProjectStatus === "syncing" ||
    serverProjectStatus === "restoring";
  const serverProjectOptions = serverProjects.map((project) => ({
    id: project.id,
    label: formatServerProjectOptionLabel(project)
  }));
  const serverProjectStatusLabel = activeServerProject
    ? `${serverProjectMessage} · ${activeServerProject.name}`
    : serverProjectMessage;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded border border-[color:var(--line)] bg-[color:var(--paper)]" style={SIMPLE_WORKBENCH_THEME}>
      <SimpleWorkbenchToolbar
        exportReady={exportReady}
        isExportingPdf={isExportingPdf}
        onExportBrandedDocx={() => void handleQuickExport("branded", "docx")}
        onExportBrandedPdf={() => void handleQuickExport("branded", "pdf")}
        onExportSimpleDocx={() => void handleQuickExport("simple", "docx")}
        onExportSimplePdf={() => void handleQuickExport("simple", "pdf")}
        onOpenPdfSetup={handleOpenPdfSetup}
        onReset={() => setResetDialogOpen(true)}
        onToggleTheme={toggleTheme}
        readyOutputCount={readyOutputCount}
        rowCount={rows.length}
        studyMode={studyMode}
        theme={theme}
      />

      {!isDesktop ? (
        <div className="flex shrink-0 border-b border-[color:var(--line)] bg-[color:var(--paper)] px-2">
          <WorkspacePanelButton active={activeWorkspacePanel === "setup"} label="Setup" onClick={() => openWorkspacePanel("setup")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "stack"} badge={rows.length ? String(rows.length) : undefined} label="Assembly" onClick={() => openWorkspacePanel("stack")} shortLabel="Stack" />
          <WorkspacePanelButton active={activeWorkspacePanel === "results"} badge={readyOutputCount ? String(readyOutputCount) : undefined} label="Results" onClick={() => openWorkspacePanel("results")} shortLabel="Result" />
          <WorkspacePanelButton active={activeWorkspacePanel === "review"} badge={scenario.warnings.length ? String(scenario.warnings.length) : undefined} label="Review" onClick={() => openWorkspacePanel("review")} shortLabel="Review" />
        </div>
      ) : null}

      <section
        className={`${!isDesktop && activeWorkspacePanel === "review" ? "hidden" : "grid"} min-h-0 min-w-0 flex-1 overflow-hidden ${
          isDesktop ? "grid-cols-[minmax(13rem,0.58fr)_minmax(40rem,1.55fr)_minmax(22rem,0.82fr)]" : ""
        }`}
      >
        <SimpleWorkbenchRoutePanel
          activeWorkspacePanel={activeWorkspacePanel}
          airborneAirtightness={airborneAirtightness}
          airborneConnectionType={airborneConnectionType}
          airborneContextMode={airborneContextMode}
          airborneElectricalBoxes={airborneElectricalBoxes}
          airborneJunctionQuality={airborneJunctionQuality}
          airborneOpeningLeakElements={airborneOpeningLeakElements}
          airborneOpeningLeakHostWallAreaM2={airborneOpeningLeakHostWallAreaM2}
          airbornePanelHeightMm={airbornePanelHeightMm}
          airbornePanelWidthMm={airbornePanelWidthMm}
          airbornePenetrationState={airbornePenetrationState}
          airbornePerimeterSeal={airbornePerimeterSeal}
          airborneReceivingRoomRt60S={airborneReceivingRoomRt60S}
          airborneReceivingRoomVolumeM3={airborneReceivingRoomVolumeM3}
          airborneResilientBarSideCount={airborneResilientBarSideCount}
          airborneSharedTrack={airborneSharedTrack}
          airborneStudSpacingMm={airborneStudSpacingMm}
          airborneStudType={airborneStudType}
          airborneWallCavity1AbsorptionClass={airborneWallCavity1AbsorptionClass}
          airborneWallCavity1DepthMm={airborneWallCavity1DepthMm}
          airborneWallCavity1FillCoverage={airborneWallCavity1FillCoverage}
          airborneWallCavity1LayerIndices={airborneWallCavity1LayerIndices}
          airborneWallCavity2AbsorptionClass={airborneWallCavity2AbsorptionClass}
          airborneWallCavity2DepthMm={airborneWallCavity2DepthMm}
          airborneWallCavity2FillCoverage={airborneWallCavity2FillCoverage}
          airborneWallCavity2LayerIndices={airborneWallCavity2LayerIndices}
          airborneWallInternalLeafCoupling={airborneWallInternalLeafCoupling}
          airborneWallInternalLeafLayerIndices={airborneWallInternalLeafLayerIndices}
          airborneWallSideALeafLayerIndices={airborneWallSideALeafLayerIndices}
          airborneWallSideBLeafLayerIndices={airborneWallSideBLeafLayerIndices}
          airborneWallSupportTopology={airborneWallSupportTopology}
          airborneWallTopologyMode={airborneWallTopologyMode}
          airborneVolumeSanityWarning={airborneVolumeSanityWarning}
          appendRows={appendRows}
          automaticOutputsLength={automaticOutputs.length}
          calculatorId={calculatorId}
          contextNotes={contextNotes}
          dynamicCalcBranch={dynamicCalcBranch}
          expertInputsActive={expertInputsActive}
          geometryActive={geometryActive}
          hasOptionalContextFields={hasOptionalContextFields}
          impactFieldActive={impactFieldActive}
          impactGuideKDb={impactGuideKDb}
          impactGuideReceivingRoomVolumeM3={impactGuideReceivingRoomVolumeM3}
          impactSteelCarrierDepthMm={impactSteelCarrierDepthMm}
          impactSteelCarrierSpacingMm={impactSteelCarrierSpacingMm}
          impactSteelLoadBasisKgM2={impactSteelLoadBasisKgM2}
          impactSteelLowerCeilingIsolationSupportForm={impactSteelLowerCeilingIsolationSupportForm}
          impactSteelResilientLayerDynamicStiffnessMNm3={impactSteelResilientLayerDynamicStiffnessMNm3}
          impactSteelSupportForm={impactSteelSupportForm}
          impactTimberCltBaseFloorDensityKgM3={impactTimberCltBaseFloorDensityKgM3}
          impactTimberCltBaseFloorThicknessMm={impactTimberCltBaseFloorThicknessMm}
          impactTimberCltImpactSystemType={impactTimberCltImpactSystemType}
          impactTimberCltLoadBasisKgM2={impactTimberCltLoadBasisKgM2}
          impactTimberCltLowerAssemblyType={impactTimberCltLowerAssemblyType}
          impactTimberCltLowerBoardLayerCount={impactTimberCltLowerBoardLayerCount}
          impactTimberCltLowerBoardThicknessMm={impactTimberCltLowerBoardThicknessMm}
          impactTimberCltLowerCavityDepthMm={impactTimberCltLowerCavityDepthMm}
          impactTimberCltLowerCavityFillThicknessMm={impactTimberCltLowerCavityFillThicknessMm}
          impactTimberCltLowerSupportClass={impactTimberCltLowerSupportClass}
          impactTimberCltResilientLayerDynamicStiffnessMNm3={impactTimberCltResilientLayerDynamicStiffnessMNm3}
          impactTimberCltResilientLayerThicknessMm={impactTimberCltResilientLayerThicknessMm}
          impactTimberCltStructuralSupportType={impactTimberCltStructuralSupportType}
          impactTimberCltUpperFillDensityKgM3={impactTimberCltUpperFillDensityKgM3}
          impactTimberCltUpperFillThicknessMm={impactTimberCltUpperFillThicknessMm}
          impactTimberCltUpperTreatmentDensityKgM3={impactTimberCltUpperTreatmentDensityKgM3}
          impactTimberCltUpperTreatmentThicknessMm={impactTimberCltUpperTreatmentThicknessMm}
          impactKSanityWarning={impactKSanityWarning}
          impactVolumeSanityWarning={impactVolumeSanityWarning}
          isServerProjectBusy={serverProjectBusy}
          isDesktop={isDesktop}
          lightweightSteelBaseRow={lightweightSteelBaseRow ? { id: lightweightSteelBaseRow.id } : null}
          liveRowCount={liveRowCount}
          modePresets={modePresets}
          onContextModeChange={setAirborneContextMode}
          onLoadServerProject={() => void loadServerProject()}
          onPresetChange={handlePresetChange}
          onRefreshServerProjects={() => void refreshServerProjects()}
          onSelectedServerProjectChange={setSelectedServerProjectId}
          onStartEmpty={handleStartEmpty}
          onStudyModeChange={handleStudyModeChange}
          onSyncServerProject={() => void syncCurrentProjectToServer()}
          panelHeightSanityWarning={panelHeightSanityWarning}
          panelWidthSanityWarning={panelWidthSanityWarning}
          parkedRowCount={parkedRowCount}
          readyOutputCount={readyOutputCount}
          rowCount={rows.length}
          routeSignals={routeSignals}
          rt60SanityWarning={rt60SanityWarning}
          selectedContextOption={selectedContextOption}
          selectedPreset={selectedPreset}
          selectedServerProjectId={selectedServerProjectId}
          serverProjectOptions={serverProjectOptions}
          serverProjectStatusLabel={serverProjectStatusLabel}
          setAirborneAirtightness={setAirborneAirtightness}
          setAirborneConnectionType={setAirborneConnectionType}
          setAirborneElectricalBoxes={setAirborneElectricalBoxes}
          setAirborneJunctionQuality={setAirborneJunctionQuality}
          addAirborneOpeningLeakElement={addAirborneOpeningLeakElement}
          moveAirborneOpeningLeakElement={moveAirborneOpeningLeakElement}
          removeAirborneOpeningLeakElement={removeAirborneOpeningLeakElement}
          setAirborneOpeningLeakHostWallAreaM2={setAirborneOpeningLeakHostWallAreaM2}
          updateAirborneOpeningLeakElement={updateAirborneOpeningLeakElement}
          setAirbornePanelHeightMm={setAirbornePanelHeightMm}
          setAirbornePanelWidthMm={setAirbornePanelWidthMm}
          setAirbornePenetrationState={setAirbornePenetrationState}
          setAirbornePerimeterSeal={setAirbornePerimeterSeal}
          setAirborneReceivingRoomRt60S={setAirborneReceivingRoomRt60S}
          setAirborneReceivingRoomVolumeM3={setAirborneReceivingRoomVolumeM3}
          setAirborneResilientBarSideCount={setAirborneResilientBarSideCount}
          setAirborneSharedTrack={setAirborneSharedTrack}
          setAirborneStudSpacingMm={setAirborneStudSpacingMm}
          setAirborneStudType={setAirborneStudType}
          setAirborneWallCavity1AbsorptionClass={setAirborneWallCavity1AbsorptionClass}
          setAirborneWallCavity1DepthMm={setAirborneWallCavity1DepthMm}
          setAirborneWallCavity1FillCoverage={setAirborneWallCavity1FillCoverage}
          setAirborneWallCavity1LayerIndices={setAirborneWallCavity1LayerIndices}
          setAirborneWallCavity2AbsorptionClass={setAirborneWallCavity2AbsorptionClass}
          setAirborneWallCavity2DepthMm={setAirborneWallCavity2DepthMm}
          setAirborneWallCavity2FillCoverage={setAirborneWallCavity2FillCoverage}
          setAirborneWallCavity2LayerIndices={setAirborneWallCavity2LayerIndices}
          setAirborneWallInternalLeafCoupling={setAirborneWallInternalLeafCoupling}
          setAirborneWallInternalLeafLayerIndices={setAirborneWallInternalLeafLayerIndices}
          setAirborneWallSideALeafLayerIndices={setAirborneWallSideALeafLayerIndices}
          setAirborneWallSideBLeafLayerIndices={setAirborneWallSideBLeafLayerIndices}
          setAirborneWallSupportTopology={setAirborneWallSupportTopology}
          setAirborneWallTopologyMode={setAirborneWallTopologyMode}
          setCalculatorId={setCalculatorId}
          setImpactGuideKDb={setImpactGuideKDb}
          setImpactGuideReceivingRoomVolumeM3={setImpactGuideReceivingRoomVolumeM3}
          setImpactSteelCarrierDepthMm={setImpactSteelCarrierDepthMm}
          setImpactSteelCarrierSpacingMm={setImpactSteelCarrierSpacingMm}
          setImpactSteelLoadBasisKgM2={setImpactSteelLoadBasisKgM2}
          setImpactSteelLowerCeilingIsolationSupportForm={setImpactSteelLowerCeilingIsolationSupportForm}
          setImpactSteelResilientLayerDynamicStiffnessMNm3={setImpactSteelResilientLayerDynamicStiffnessMNm3}
          setImpactSteelSupportForm={setImpactSteelSupportForm}
          setImpactTimberCltBaseFloorDensityKgM3={setImpactTimberCltBaseFloorDensityKgM3}
          setImpactTimberCltBaseFloorThicknessMm={setImpactTimberCltBaseFloorThicknessMm}
          setImpactTimberCltImpactSystemType={setImpactTimberCltImpactSystemType}
          setImpactTimberCltLoadBasisKgM2={setImpactTimberCltLoadBasisKgM2}
          setImpactTimberCltLowerAssemblyType={setImpactTimberCltLowerAssemblyType}
          setImpactTimberCltLowerBoardLayerCount={setImpactTimberCltLowerBoardLayerCount}
          setImpactTimberCltLowerBoardThicknessMm={setImpactTimberCltLowerBoardThicknessMm}
          setImpactTimberCltLowerCavityDepthMm={setImpactTimberCltLowerCavityDepthMm}
          setImpactTimberCltLowerCavityFillThicknessMm={setImpactTimberCltLowerCavityFillThicknessMm}
          setImpactTimberCltLowerSupportClass={setImpactTimberCltLowerSupportClass}
          setImpactTimberCltResilientLayerDynamicStiffnessMNm3={setImpactTimberCltResilientLayerDynamicStiffnessMNm3}
          setImpactTimberCltResilientLayerThicknessMm={setImpactTimberCltResilientLayerThicknessMm}
          setImpactTimberCltStructuralSupportType={setImpactTimberCltStructuralSupportType}
          setImpactTimberCltUpperFillDensityKgM3={setImpactTimberCltUpperFillDensityKgM3}
          setImpactTimberCltUpperFillThicknessMm={setImpactTimberCltUpperFillThicknessMm}
          setImpactTimberCltUpperTreatmentDensityKgM3={setImpactTimberCltUpperTreatmentDensityKgM3}
          setImpactTimberCltUpperTreatmentThicknessMm={setImpactTimberCltUpperTreatmentThicknessMm}
          showSteelBoundSupportFormActions={showSteelBoundSupportFormActions}
          openingLeakCompositeInputSurfaceActive={openingLeakCompositeInputSurfaceActive}
          steelFloorFormulaInputSurfaceActive={steelFloorFormulaInputSurfaceActive}
          timberCltDeltaLwInputSurfaceActive={timberCltDeltaLwInputSurfaceActive}
          showTimberImpactOnlyGuidedActions={showTimberImpactOnlyGuidedActions}
          standardizedAirborneActive={standardizedAirborneActive}
          standardizedImpactOutputsActive={standardizedImpactOutputsActive}
          studyMode={studyMode}
          topologyGap={topologyGap}
          updateMaterial={updateMaterial}
          validationSummary={validationSummary}
          wallTopologyControlsActive={wallTopologyControlsActive}
          wallModifiersActive={wallModifiersActive}
        />

        <SimpleWorkbenchAssemblyPanel
          activeAssemblyTool={activeAssemblyTool}
          activeRowId={activeRowId}
          activeWorkspacePanel={activeWorkspacePanel}
          appendConfiguredLayer={appendConfiguredLayer}
          createCustomMaterial={createCustomMaterial}
          customMaterialDraft={customMaterialDraft}
          customMaterialErrors={customMaterialErrors}
          customMaterialExpanded={customMaterialExpanded}
          customMaterials={customMaterials}
          duplicateRow={duplicateRow}
          expandedRowId={expandedRowId}
          isDesktop={isDesktop}
          liveRowCount={liveRowCount}
          materials={materials}
          missingFloorRoleCount={missingFloorRoleCount}
          movedRowFlash={movedRowFlash}
          moveRowWithFeedback={moveRowWithFeedback}
          newLayerDraft={newLayerDraft}
          newLayerMaterialGroups={newLayerMaterialGroups}
          onOpenResults={() => openWorkspacePanel("results")}
          parkedRowCount={parkedRowCount}
          replaceConfiguredBaseLayer={replaceConfiguredBaseLayer}
          replaceConfiguredBaseLayerAvailable={replaceConfiguredBaseLayerAvailable}
          removeRow={removeRow}
          result={result}
          rows={rows}
          setActiveAssemblyTool={setActiveAssemblyTool}
          setActiveRowId={setActiveRowId}
          setCustomMaterialDraft={setCustomMaterialDraft}
          setCustomMaterialExpanded={setCustomMaterialExpanded}
          setExpandedRowId={setExpandedRowId}
          setNewLayerDraft={setNewLayerDraft}
          studyMode={studyMode}
          totalThickness={totalThickness}
          updateDensity={updateDensity}
          updateDynamicStiffness={updateDynamicStiffness}
          updateFloorRole={updateFloorRole}
          updateMaterial={updateMaterial}
          updateThickness={updateThickness}
        />

        <SimpleWorkbenchResultsPanel
          activeRowId={activeRowId}
          activeWorkspacePanel={activeWorkspacePanel}
          boundOutputCardCount={boundOutputCards.length}
          collapsedLiveRowCount={collapsedLiveRowCount}
          contextLabel={getEnvironmentLabel(airborneContextMode)}
          heroHeadline={heroHeadline}
          isDesktop={isDesktop}
          liveOutputCardCount={liveOutputCards.length}
          liveRowCount={liveRowCount}
          materials={materials}
          needsInputCards={needsInputCards}
          onOpenAssembly={() => openWorkspacePanel("stack")}
          onSelectReviewTab={selectReviewTab}
          outputUnlockGroups={outputUnlockGroups}
          parkedRowCount={parkedRowCount}
          primaryReadyCard={primaryReadyCard}
          readyCardCount={readyCards.length}
          result={result}
          responseCurves={responseCurveFigures}
          routeCoverageLabel={routeCoverageLabel}
          rows={rows}
          secondaryReadyCards={secondaryReadyCards}
          solverLayerCount={solverLayerCount}
          studyMode={studyMode}
          targetLnwDb={targetLnwDb}
          targetRwDb={targetRwDb}
          totalOutputCount={automaticOutputs.length}
          unsupportedCards={unsupportedCards}
          validationSummary={validationSummary}
          warnings={scenario.warnings}
        />
      </section>

      {reviewExpanded ? (
        <SimpleWorkbenchReviewPanel
          reviewExpanded={reviewExpanded}
          isDesktop={isDesktop}
          activeWorkspacePanel={activeWorkspacePanel}
          activeReviewTab={activeReviewTab}
          activeReviewPanelId={activeReviewPanelId}
          selectReviewTab={selectReviewTab}
          closeReviewPanel={closeReviewPanel}
          proposalMetricsCount={proposalMetrics.length}
          proposalLayersCount={proposalLayers.length}
          warnings={scenario.warnings}
          hasRows={rows.length > 0}
          corridorDossierCards={corridorDossier.cards}
          corridorDossierHeadline={corridorDossier.headline}
          selectedTraceNoteCount={selectedTraceNoteCount}
          traceGroupCount={methodDossier.traceGroups.length}
          proposalLayers={proposalLayers}
          studyModeLabel={getStudyModeLabel(studyMode)}
          methodPanelProps={{
            assumptionItems: methodAssumptionItems, branchDetail: dynamicCalcBranch.detail, branchLabel: dynamicCalcBranch.value,
            citations: proposalEvidence.citations, coverageItems: proposalCoverageItems, contextLabel: getEnvironmentLabel(airborneContextMode),
            layers: proposalLayers, readyMetrics: methodReadyMetrics, result: scenario.result, stackDetail: methodStackDetail,
            studyMode, studyModeLabel: getStudyModeLabel(studyMode), unlocks: methodUnlocks,
            validationDetail: validationSummary.detail, validationLabel: validationSummary.value, warnings: scenario.warnings
          }}
          diagnosticsPanelProps={{
            branchLabel: dynamicCalcBranch.value, citations: proposalEvidence.citations,
            decisionTrailHeadline: proposalEvidence.decisionTrailHeadline, decisionTrailItems: proposalEvidence.decisionTrailItems,
            layers: proposalLayers, result, studyMode, studyModeLabel: getStudyModeLabel(studyMode),
            traceGroups: methodDossier.traceGroups, validationDetail: validationSummary.detail,
            validationLabel: validationSummary.value, warnings: scenario.warnings
          }}
          proposalPanelProps={{
            assemblyHeadline: heroHeadline, briefNote, clientName, consultantAddress, citations: proposalEvidence.citations,
            consultantCompany, consultantEmail, consultantLogoDataUrl, consultantPhone, consultantWordmarkLine,
            contextLabel: getEnvironmentLabel(airborneContextMode), coverageItems: proposalCoverageItems,
            corridorDossierCards: corridorDossier.cards, corridorDossierHeadline: corridorDossier.headline,
            decisionTrailHeadline: proposalEvidence.decisionTrailHeadline, decisionTrailItems: proposalEvidence.decisionTrailItems,
            dynamicBranchDetail: dynamicCalcBranch.detail, dynamicBranchLabel: dynamicCalcBranch.value,
            issuedOnLabel: proposalIssuedOnLabel, issuedOnIso: proposalIssuedOnIso, layers: proposalLayers,
            metrics: proposalMetrics, methodDossierCards: methodDossier.cards, methodDossierHeadline: methodDossier.headline,
            methodTraceGroups: methodDossier.traceGroups,
            onApproverTitleChange: setApproverTitle, onBriefNoteChange: setBriefNote, onClientNameChange: setClientName,
            onConsultantAddressChange: setConsultantAddress, onConsultantCompanyChange: setConsultantCompany,
            onConsultantEmailChange: setConsultantEmail, onConsultantLogoDataUrlChange: setConsultantLogoDataUrl,
            onConsultantPhoneChange: setConsultantPhone, onConsultantWordmarkLineChange: setConsultantWordmarkLine,
            onPreparedByChange: setPreparedBy, onIssueCodePrefixChange: setProposalIssueCodePrefix,
            onProposalAttentionChange: setProposalAttention, onProposalIssuePurposeChange: setProposalIssuePurpose,
            onProposalRecipientChange: setProposalRecipient, onProjectNameChange: setProjectName,
            onProposalReferenceChange: setProposalReference, onProposalRevisionChange: setProposalRevision,
            onProposalSubjectChange: setProposalSubject, onProposalValidityNoteChange: setProposalValidityNote,
            onReportProfileChange: setReportProfile,
            approverTitle, preparedBy, issueCodePrefix: proposalIssueCodePrefix,
            proposalAttention, proposalIssuePurpose, proposalRecipient, projectName,
            proposalReference, proposalRevision, proposalSubject, proposalValidityNote,
            reportProfile, reportProfileLabel: REPORT_PROFILE_LABELS[reportProfile],
            serverProjectId: activeServerProject?.id, serverProjectScenarioId: activeServerProject?.scenarioId,
            result, studyModeLabel: getStudyModeLabel(studyMode), studyContextLabel: STUDY_CONTEXT_LABELS[studyContext],
            validationDetail: validationSummary.detail, validationLabel: validationSummary.value,
            validationTone: validationSummary.tone, warnings: scenario.warnings
          }}
        />
      ) : null}
      <SimpleWorkbenchResetDialog
        onCancel={() => setResetDialogOpen(false)}
        onConfirm={() => { reset(); setResetDialogOpen(false); }}
        open={resetDialogOpen}
        rowCount={rows.length}
      />
    </div>
  );
}
