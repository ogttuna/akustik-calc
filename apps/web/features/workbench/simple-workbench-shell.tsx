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
import { formatUnlockOutputs, getGuidedOutputUnlocks } from "./guided-output-unlocks";
import { getGuidedTopologyGap } from "./guided-topology-gap";
import { deriveGuidedRouteSignals } from "./guided-route-signals";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import { isImpactOnlyLowConfidenceFloorLane } from "./impact-only-low-confidence-floor-lane";
import { getGuidedNumericSanityWarning, GUIDED_INPUT_SANITY_BANDS } from "./input-sanity";
import { getPresetById } from "./preset-definitions";
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
import { storeSimpleWorkbenchProposalPreview } from "./simple-workbench-proposal-preview-storage";
import { readSimpleWorkbenchIssueSequence } from "./simple-workbench-issue-sequence";
import { buildWorkbenchResponseCurveFigures } from "./response-curve-model";
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
import { inferFloorRole, useWorkbenchStore } from "./workbench-store";

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
  const airbornePanelHeightMm = useWorkbenchStore((state) => state.airbornePanelHeightMm);
  const airbornePanelWidthMm = useWorkbenchStore((state) => state.airbornePanelWidthMm);
  const airbornePenetrationState = useWorkbenchStore((state) => state.airbornePenetrationState);
  const airbornePerimeterSeal = useWorkbenchStore((state) => state.airbornePerimeterSeal);
  const airborneReceivingRoomRt60S = useWorkbenchStore((state) => state.airborneReceivingRoomRt60S);
  const airborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.airborneReceivingRoomVolumeM3);
  const airborneSharedTrack = useWorkbenchStore((state) => state.airborneSharedTrack);
  const airborneStudSpacingMm = useWorkbenchStore((state) => state.airborneStudSpacingMm);
  const airborneStudType = useWorkbenchStore((state) => state.airborneStudType);
  const impactGuideKDb = useWorkbenchStore((state) => state.impactGuideKDb);
  const impactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.impactGuideReceivingRoomVolumeM3);

  const appendRows = useWorkbenchStore((state) => state.appendRows);
  const clearRows = useWorkbenchStore((state) => state.clearRows);
  const duplicateRow = useWorkbenchStore((state) => state.duplicateRow);
  const loadPreset = useWorkbenchStore((state) => state.loadPreset);
  const moveRow = useWorkbenchStore((state) => state.moveRow);
  const removeRow = useWorkbenchStore((state) => state.removeRow);
  const reset = useWorkbenchStore((state) => state.reset);
  const startStudyMode = useWorkbenchStore((state) => state.startStudyMode);
  const setAirborneAirtightness = useWorkbenchStore((state) => state.setAirborneAirtightness);
  const setAirborneConnectionType = useWorkbenchStore((state) => state.setAirborneConnectionType);
  const setAirborneContextMode = useWorkbenchStore((state) => state.setAirborneContextMode);
  const setAirborneElectricalBoxes = useWorkbenchStore((state) => state.setAirborneElectricalBoxes);
  const setAirborneJunctionQuality = useWorkbenchStore((state) => state.setAirborneJunctionQuality);
  const setAirbornePanelHeightMm = useWorkbenchStore((state) => state.setAirbornePanelHeightMm);
  const setAirbornePanelWidthMm = useWorkbenchStore((state) => state.setAirbornePanelWidthMm);
  const setAirbornePenetrationState = useWorkbenchStore((state) => state.setAirbornePenetrationState);
  const setAirbornePerimeterSeal = useWorkbenchStore((state) => state.setAirbornePerimeterSeal);
  const setAirborneReceivingRoomRt60S = useWorkbenchStore((state) => state.setAirborneReceivingRoomRt60S);
  const setAirborneReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setAirborneReceivingRoomVolumeM3);
  const setAirborneSharedTrack = useWorkbenchStore((state) => state.setAirborneSharedTrack);
  const setAirborneStudSpacingMm = useWorkbenchStore((state) => state.setAirborneStudSpacingMm);
  const setAirborneStudType = useWorkbenchStore((state) => state.setAirborneStudType);
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

  const liveAirborneContext: AirborneContext = {
    airtightness: airborneAirtightness,
    connectionType: airborneConnectionType,
    contextMode: airborneContextMode,
    electricalBoxes: airborneElectricalBoxes,
    junctionQuality: airborneJunctionQuality,
    panelHeightMm: parsePositiveNumber(airbornePanelHeightMm),
    panelWidthMm: parsePositiveNumber(airbornePanelWidthMm),
    penetrationState: airbornePenetrationState,
    perimeterSeal: airbornePerimeterSeal,
    receivingRoomRt60S: parsePositiveNumber(airborneReceivingRoomRt60S),
    receivingRoomVolumeM3: parsePositiveNumber(airborneReceivingRoomVolumeM3),
    sharedTrack: airborneSharedTrack,
    studSpacingMm: parsePositiveNumber(airborneStudSpacingMm),
    studType: airborneStudType
  };

  const liveImpactFieldContext: ImpactFieldContext | null =
    studyMode === "floor" && (parsePositiveNumber(impactGuideKDb) || parsePositiveNumber(impactGuideReceivingRoomVolumeM3))
      ? { fieldKDb: parsePositiveNumber(impactGuideKDb), receivingRoomVolumeM3: parsePositiveNumber(impactGuideReceivingRoomVolumeM3) }
      : null;

  const scenario = evaluateScenario({
    airborneContext: liveAirborneContext,
    calculator: calculatorId,
    customMaterials,
    id: "simple-current",
    impactFieldContext: liveImpactFieldContext,
    name: projectName,
    rows,
    source: "current",
    studyMode,
    targetOutputs: automaticOutputs
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
  const expertInputsActive = wallModifiersActive || calculatorId !== "dynamic";
  const validThicknessCount = countValidThicknessRows(rows);
  const assignedFloorRoleCount = countAssignedFloorRoles(rows);
  const missingFloorRoleCount = studyMode === "floor" ? Math.max(rows.length - assignedFloorRoleCount, 0) : 0;

  const contextNotes: string[] = [];
  if (!geometryActive) {
    contextNotes.push(airborneContextMode === "element_lab" ? "Lab mode ignores room geometry, RT60, and field normalization inputs." : "The current output set does not need extra airborne geometry fields.");
  } else if (!standardizedAirborneActive) {
    contextNotes.push("Receiving-room volume stays parked because the current route stops at apparent field outputs such as R'w and Dn,w.");
  } else {
    contextNotes.push("RT60 stays optional here. DnT outputs standardize with partition geometry and receiving-room volume; RT60 only feeds absorption-aware sidecars.");
  }
  if (studyMode === "floor") {
    if (!impactFieldActive) contextNotes.push("Field K and floor-side room-volume corrections stay hidden until field impact outputs are requested.");
    else if (!standardizedImpactOutputsActive) contextNotes.push("Floor field volume is optional right now because only L'n,w is active; standardized L'nT outputs are not requested yet.");
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
  const openWorkspacePanel = (panelId: WorkspacePanelId) => {
    setActiveWorkspacePanel(panelId);
    if (panelId === "review") setReviewExpanded(true);
  };
  const closeReviewPanel = () => {
    setReviewExpanded(false);
    setActiveWorkspacePanel(rows.length > 0 ? "results" : "stack");
  };
  const selectReviewTab = (tabId: ReviewTabId) => {
    setActiveReviewTab(tabId);
    setReviewExpanded(true);
    setActiveWorkspacePanel("review");
  };
  const appendConfiguredLayer = () => {
    if (!parsePositiveNumber(newLayerDraft.thicknessMm)) return;
    appendRows([{
      densityKgM3: newLayerDraft.densityKgM3, dynamicStiffnessMNm3: newLayerDraft.dynamicStiffnessMNm3,
      floorRole: studyMode === "floor" ? newLayerDraft.floorRole : undefined,
      materialId: newLayerDraft.materialId, thicknessMm: newLayerDraft.thicknessMm
    }]);
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
    setActiveAssemblyTool(null);
  };
  const replaceConfiguredBaseLayer = () => {
    if (!(replaceConfiguredBaseLayerAvailable && parsePositiveNumber(newLayerDraft.thicknessMm))) return;
    replaceSingleBaseStructure(newLayerDraft.materialId, newLayerDraft.thicknessMm);
    setNewLayerDraft(buildDefaultNewLayerDraft(studyMode));
    setActiveAssemblyTool(null);
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
      citations: proposalEvidence.citations, consultantCompany: consultantCompany.trim() || "DynEcho Acoustic Consulting",
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
      preparedBy: preparedBy.trim() || "DynEcho Operator",
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
        await downloadSimpleWorkbenchProposalDocx(doc, { style });
      } else {
        await downloadSimpleWorkbenchProposalPdf(doc, { style });
      }
      toast.success(`${getSimpleWorkbenchProposalExportLabel({ format, style })} downloaded`);
    } catch {
      toast.error(`${getSimpleWorkbenchProposalExportLabel({ format, style })} failed`);
    } finally {
      setIsExportingPdf(false);
    }
  };
  const handleOpenPdfSetup = () => {
    const doc = buildQuickProposalDocument();
    storeSimpleWorkbenchProposalPreview(doc);
    const adjustmentWindow = window.open("/workbench/proposal/configure?style=simple", "_blank");

    if (!adjustmentWindow) {
      toast.error("Simple PDF editor blocked");
    }
  };
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
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="grid min-w-0 gap-0" style={SIMPLE_WORKBENCH_THEME}>
      <SimpleWorkbenchToolbar
        airborneContextMode={airborneContextMode}
        exportReady={exportReady}
        isExportingPdf={isExportingPdf}
        modePresets={modePresets}
        onContextModeChange={setAirborneContextMode}
        onExportBrandedDocx={() => void handleQuickExport("branded", "docx")}
        onExportBrandedPdf={() => void handleQuickExport("branded", "pdf")}
        onExportSimpleDocx={() => void handleQuickExport("simple", "docx")}
        onExportSimplePdf={() => void handleQuickExport("simple", "pdf")}
        onOpenPdfSetup={handleOpenPdfSetup}
        onPresetChange={loadPreset}
        onStartEmpty={clearRows}
        onReset={() => setResetDialogOpen(true)}
        onStudyModeChange={handleStudyModeChange}
        onToggleTheme={toggleTheme}
        readyOutputCount={readyOutputCount}
        rowCount={rows.length}
        selectedPreset={selectedPreset}
        studyMode={studyMode}
        theme={theme}
      />

      {!isDesktop ? (
        <div className="flex border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4">
          <WorkspacePanelButton active={activeWorkspacePanel === "setup"} label="Setup" onClick={() => openWorkspacePanel("setup")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "stack"} label="Assembly" onClick={() => openWorkspacePanel("stack")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "results"} label="Results" onClick={() => openWorkspacePanel("results")} />
          <WorkspacePanelButton active={activeWorkspacePanel === "review"} label="Details" onClick={() => openWorkspacePanel("review")} />
        </div>
      ) : null}

      <section className={`grid min-w-0 ${isDesktop ? "grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" : ""}`}>
        <SimpleWorkbenchRoutePanel
          activeWorkspacePanel={activeWorkspacePanel}
          airborneAirtightness={airborneAirtightness}
          airborneConnectionType={airborneConnectionType}
          airborneContextMode={airborneContextMode}
          airborneElectricalBoxes={airborneElectricalBoxes}
          airborneJunctionQuality={airborneJunctionQuality}
          airbornePanelHeightMm={airbornePanelHeightMm}
          airbornePanelWidthMm={airbornePanelWidthMm}
          airbornePenetrationState={airbornePenetrationState}
          airbornePerimeterSeal={airbornePerimeterSeal}
          airborneReceivingRoomRt60S={airborneReceivingRoomRt60S}
          airborneReceivingRoomVolumeM3={airborneReceivingRoomVolumeM3}
          airborneSharedTrack={airborneSharedTrack}
          airborneStudSpacingMm={airborneStudSpacingMm}
          airborneStudType={airborneStudType}
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
          impactKSanityWarning={impactKSanityWarning}
          impactVolumeSanityWarning={impactVolumeSanityWarning}
          isDesktop={isDesktop}
          lightweightSteelBaseRow={lightweightSteelBaseRow ? { id: lightweightSteelBaseRow.id } : null}
          liveRowCount={liveRowCount}
          panelHeightSanityWarning={panelHeightSanityWarning}
          panelWidthSanityWarning={panelWidthSanityWarning}
          parkedRowCount={parkedRowCount}
          readyOutputCount={readyOutputCount}
          routeSignals={routeSignals}
          rt60SanityWarning={rt60SanityWarning}
          selectedContextOption={selectedContextOption}
          selectedPreset={selectedPreset}
          setAirborneAirtightness={setAirborneAirtightness}
          setAirborneConnectionType={setAirborneConnectionType}
          setAirborneElectricalBoxes={setAirborneElectricalBoxes}
          setAirborneJunctionQuality={setAirborneJunctionQuality}
          setAirbornePanelHeightMm={setAirbornePanelHeightMm}
          setAirbornePanelWidthMm={setAirbornePanelWidthMm}
          setAirbornePenetrationState={setAirbornePenetrationState}
          setAirbornePerimeterSeal={setAirbornePerimeterSeal}
          setAirborneReceivingRoomRt60S={setAirborneReceivingRoomRt60S}
          setAirborneReceivingRoomVolumeM3={setAirborneReceivingRoomVolumeM3}
          setAirborneSharedTrack={setAirborneSharedTrack}
          setAirborneStudSpacingMm={setAirborneStudSpacingMm}
          setAirborneStudType={setAirborneStudType}
          setCalculatorId={setCalculatorId}
          setImpactGuideKDb={setImpactGuideKDb}
          setImpactGuideReceivingRoomVolumeM3={setImpactGuideReceivingRoomVolumeM3}
          showSteelBoundSupportFormActions={showSteelBoundSupportFormActions}
          showTimberImpactOnlyGuidedActions={showTimberImpactOnlyGuidedActions}
          standardizedAirborneActive={standardizedAirborneActive}
          standardizedImpactOutputsActive={standardizedImpactOutputsActive}
          topologyGap={topologyGap}
          updateMaterial={updateMaterial}
          validationSummary={validationSummary}
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
