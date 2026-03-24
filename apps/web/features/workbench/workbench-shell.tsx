"use client";

import { MATERIAL_SOURCE_NOTE } from "@dynecho/catalogs";
import {
  buildExactImpactImprovementReference,
  deriveHeavyReferenceImpactFromDeltaLw,
  deriveImpactGuideMetrics
} from "@dynecho/engine";
import { SurfacePanel } from "@dynecho/ui";
import dynamic from "next/dynamic";
import { useDeferredValue } from "react";
import { toast } from "sonner";

import { AirborneContextPanel } from "./airborne-context-panel";
import { buildImpactGuideFieldGuides } from "./impact-field-guides";
import { AirborneTracePanel } from "./airborne-trace-panel";
import { AssemblyNarrativePanel } from "./assembly-narrative-panel";
import { CapabilityMapPanel } from "./capability-map-panel";
import { buildReportFilename, composeWorkbenchReport } from "./compose-workbench-report";
import { CriteriaPackPanel } from "./criteria-pack-panel";
import { getCriteriaPackById } from "./criteria-packs";
import { DeliveryAssistPanel } from "./delivery-assist-panel";
import { evaluateScenario } from "./scenario-analysis";
import { ExactFloorSystemPanel } from "./exact-floor-system-panel";
import { FieldUsageBoard } from "./field-usage-board";
import { FieldRiskPanel } from "./field-risk-panel";
import { summarizeFieldRisk } from "./field-risk-model";
import { parseImpactBandImport } from "./impact-band-import";
import { buildImpactFieldPathGuides } from "./impact-field-path-guides";
import { ImpactBandSourcePanel } from "./impact-band-source-panel";
import { ImpactFieldPathPanel } from "./impact-field-path-panel";
import { parseImpactFieldPathInput } from "./impact-field-path-input";
import { ImpactGuidePanel } from "./impact-guide-panel";
import { parseImpactImprovementImport } from "./impact-improvement-import";
import { ImpactImprovementSourcePanel } from "./impact-improvement-source-panel";
import { ImpactProductCatalogPanel } from "./impact-product-catalog-panel";
import { ImpactReferencePanel } from "./impact-reference-panel";
import { ImpactResultPanel } from "./impact-result-panel";
import { ImpactTracePanel } from "./impact-trace-panel";
import { LayerEditor } from "./layer-editor";
import { MaterialLibraryPanel } from "./material-library-panel";
import { normalizeRows } from "./normalize-rows";
import { ParityScorecardPanel } from "./parity-scorecard-panel";
import { PerformanceCriteriaPanel } from "./performance-criteria-panel";
import { PanelPlaceholder } from "./panel-placeholder";
import { ProjectBriefPanel } from "./project-brief-panel";
import { ReadinessPanel } from "./readiness-panel";
import { ResultSummary } from "./result-summary";
import { getPresetById } from "./preset-definitions";
import { useCommandPalette } from "./use-command-palette";
import { useReportExportActions } from "./use-report-export-actions";
import { UpstreamRadarPanel } from "./upstream-radar-panel";
import { ValidationRegimePanel } from "./validation-regime-panel";
import { WorkbenchCommandDeck } from "./workbench-command-deck";
import { WorkbenchChapter } from "./workbench-chapter";
import { WorkbenchHeader } from "./workbench-header";
import { WorkbenchFlowMap } from "./workbench-flow-map";
import { buildWorkbenchMaterialCatalog } from "./workbench-materials";
import { WorkbenchRailLayout } from "./workbench-rail-layout";
import { useWorkbenchStore } from "./workbench-store";

const LayerMassPanel = dynamic(
  () => import("./layer-mass-panel").then((module) => module.LayerMassPanel),
  {
    loading: () => (
      <PanelPlaceholder
        description="Surface-mass visualization will hydrate once the heavy chart lane is ready."
        title="Layer mass loading"
      />
    )
  }
);

const AcousticCurvePanel = dynamic(
  () => import("./acoustic-curve-panel").then((module) => module.AcousticCurvePanel),
  {
    loading: () => (
      <PanelPlaceholder
        description="Frequency-domain screening is loading in a separate chart lane."
        title="Curve lane loading"
      />
    )
  }
);

const ReportExportPanel = dynamic(
  () => import("./report-export-panel").then((module) => module.ReportExportPanel),
  {
    loading: () => (
      <PanelPlaceholder
        description="Report composition is preparing its export surface."
        title="Reporting lane loading"
      />
    )
  }
);

const ScenarioComparePanel = dynamic(
  () => import("./scenario-compare-panel").then((module) => module.ScenarioComparePanel),
  {
    loading: () => (
      <PanelPlaceholder
        description="Scenario comparison charts are loading in a separate client chunk."
        title="Scenario compare loading"
      />
    )
  }
);

const WorkbenchCommandPalette = dynamic(
  () => import("./workbench-command-palette").then((module) => module.WorkbenchCommandPalette),
  {
    loading: () => null,
    ssr: false
  }
);

function parseFiniteNumber(value: string | null | undefined): number | undefined {
  if (!value || value.trim().length === 0) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function WorkbenchShell() {
  const activePresetId = useWorkbenchStore((state) => state.activePresetId);
  const calculatorId = useWorkbenchStore((state) => state.calculatorId);
  const airborneAirtightness = useWorkbenchStore((state) => state.airborneAirtightness);
  const airborneConnectionType = useWorkbenchStore((state) => state.airborneConnectionType);
  const airborneContextMode = useWorkbenchStore((state) => state.airborneContextMode);
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
  const briefNote = useWorkbenchStore((state) => state.briefNote);
  const clientName = useWorkbenchStore((state) => state.clientName);
  const criteriaPackId = useWorkbenchStore((state) => state.criteriaPackId);
  const customMaterials = useWorkbenchStore((state) => state.customMaterials);
  const deleteSavedScenario = useWorkbenchStore((state) => state.deleteSavedScenario);
  const fieldRiskIds = useWorkbenchStore((state) => state.fieldRiskIds);
  const impactDirectPathOffsetDb = useWorkbenchStore((state) => state.impactDirectPathOffsetDb);
  const impactGuideCi50_2500Db = useWorkbenchStore((state) => state.impactGuideCi50_2500Db);
  const loadSavedScenario = useWorkbenchStore((state) => state.loadSavedScenario);
  const impactGuideCiDb = useWorkbenchStore((state) => state.impactGuideCiDb);
  const impactGuideHdDb = useWorkbenchStore((state) => state.impactGuideHdDb);
  const impactGuideKDb = useWorkbenchStore((state) => state.impactGuideKDb);
  const impactGuideMassRatio = useWorkbenchStore((state) => state.impactGuideMassRatio);
  const impactExactBandInput = useWorkbenchStore((state) => state.impactExactBandInput);
  const impactExactLabOrField = useWorkbenchStore((state) => state.impactExactLabOrField);
  const impactFlankingPathsInput = useWorkbenchStore((state) => state.impactFlankingPathsInput);
  const impactImprovementBandInput = useWorkbenchStore((state) => state.impactImprovementBandInput);
  const impactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.impactGuideReceivingRoomVolumeM3);
  const impactGuideSmallRoomMode = useWorkbenchStore((state) => state.impactGuideSmallRoomMode);
  const impactGuideSource = useWorkbenchStore((state) => state.impactGuideSource);
  const impactLowerTreatmentReductionDb = useWorkbenchStore((state) => state.impactLowerTreatmentReductionDb);
  const impactReferenceDeltaLwDb = useWorkbenchStore((state) => state.impactReferenceDeltaLwDb);
  const projectName = useWorkbenchStore((state) => state.projectName);
  const reportProfile = useWorkbenchStore((state) => state.reportProfile);
  const requestedOutputs = useWorkbenchStore((state) => state.requestedOutputs);
  const studyMode = useWorkbenchStore((state) => state.studyMode);
  const rows = useWorkbenchStore((state) => state.rows);
  const savedScenarios = useWorkbenchStore((state) => state.savedScenarios);
  const saveCurrentScenario = useWorkbenchStore((state) => state.saveCurrentScenario);
  const setCalculatorId = useWorkbenchStore((state) => state.setCalculatorId);
  const setBriefNote = useWorkbenchStore((state) => state.setBriefNote);
  const setClientName = useWorkbenchStore((state) => state.setClientName);
  const setImpactDirectPathOffsetDb = useWorkbenchStore((state) => state.setImpactDirectPathOffsetDb);
  const setImpactGuideCi50_2500Db = useWorkbenchStore((state) => state.setImpactGuideCi50_2500Db);
  const setImpactGuideCiDb = useWorkbenchStore((state) => state.setImpactGuideCiDb);
  const setImpactGuideHdDb = useWorkbenchStore((state) => state.setImpactGuideHdDb);
  const setImpactGuideKDb = useWorkbenchStore((state) => state.setImpactGuideKDb);
  const setImpactGuideMassRatio = useWorkbenchStore((state) => state.setImpactGuideMassRatio);
  const setImpactExactBandInput = useWorkbenchStore((state) => state.setImpactExactBandInput);
  const setImpactExactLabOrField = useWorkbenchStore((state) => state.setImpactExactLabOrField);
  const setImpactFlankingPathsInput = useWorkbenchStore((state) => state.setImpactFlankingPathsInput);
  const setImpactImprovementBandInput = useWorkbenchStore((state) => state.setImpactImprovementBandInput);
  const setImpactGuideReceivingRoomVolumeM3 = useWorkbenchStore((state) => state.setImpactGuideReceivingRoomVolumeM3);
  const setImpactGuideSmallRoomMode = useWorkbenchStore((state) => state.setImpactGuideSmallRoomMode);
  const setImpactGuideSource = useWorkbenchStore((state) => state.setImpactGuideSource);
  const setImpactLowerTreatmentReductionDb = useWorkbenchStore((state) => state.setImpactLowerTreatmentReductionDb);
  const setImpactReferenceDeltaLwDb = useWorkbenchStore((state) => state.setImpactReferenceDeltaLwDb);
  const setProjectName = useWorkbenchStore((state) => state.setProjectName);
  const setReportProfile = useWorkbenchStore((state) => state.setReportProfile);
  const setStudyContext = useWorkbenchStore((state) => state.setStudyContext);
  const setTargetLnwDb = useWorkbenchStore((state) => state.setTargetLnwDb);
  const setTargetRwDb = useWorkbenchStore((state) => state.setTargetRwDb);
  const studyContext = useWorkbenchStore((state) => state.studyContext);
  const targetLnwDb = useWorkbenchStore((state) => state.targetLnwDb);
  const targetRwDb = useWorkbenchStore((state) => state.targetRwDb);
  const toggleFieldRisk = useWorkbenchStore((state) => state.toggleFieldRisk);
  const toggleRequestedOutput = useWorkbenchStore((state) => state.toggleRequestedOutput);
  const addRow = useWorkbenchStore((state) => state.addRow);
  const applyCriteriaPack = useWorkbenchStore((state) => state.applyCriteriaPack);
  const appendMaterial = useWorkbenchStore((state) => state.appendMaterial);
  const moveRow = useWorkbenchStore((state) => state.moveRow);
  const removeRow = useWorkbenchStore((state) => state.removeRow);
  const updateDensity = useWorkbenchStore((state) => state.updateDensity);
  const updateFloorRole = useWorkbenchStore((state) => state.updateFloorRole);
  const updateMaterial = useWorkbenchStore((state) => state.updateMaterial);
  const updateThickness = useWorkbenchStore((state) => state.updateThickness);
  const loadPreset = useWorkbenchStore((state) => state.loadPreset);
  const reset = useWorkbenchStore((state) => state.reset);
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
  const commandPalette = useCommandPalette();
  const materials = buildWorkbenchMaterialCatalog(customMaterials);

  const deferredRows = useDeferredValue(rows);
  const activeCriteriaPack = getCriteriaPackById(criteriaPackId);
  const fieldRiskSummary = summarizeFieldRisk(fieldRiskIds);
  const normalized = normalizeRows(deferredRows, materials);
  const validThicknessRowCount = rows.filter((row) => {
    const thickness = Number(row.thicknessMm);
    return Number.isFinite(thickness) && thickness > 0;
  }).length;
  const assignedFloorRoleCount = rows.filter((row) => typeof row.floorRole === "string").length;
  const exactImpactImport = parseImpactBandImport({
    labOrField: impactExactLabOrField,
    text: impactExactBandInput
  });
  const flankingPathImport = parseImpactFieldPathInput(impactFlankingPathsInput);
  const exactImprovementImport = parseImpactImprovementImport(impactImprovementBandInput);
  const parsedImpactReferenceDeltaLwDb = parseFiniteNumber(impactReferenceDeltaLwDb);
  const parsedImpactDirectPathOffsetDb = parseFiniteNumber(impactDirectPathOffsetDb);
  const parsedImpactGuideKDb = parseFiniteNumber(impactGuideKDb);
  const parsedImpactGuideHdDb = parseFiniteNumber(impactGuideHdDb);
  const parsedImpactGuideMassRatio = parseFiniteNumber(impactGuideMassRatio);
  const parsedImpactGuideReceivingRoomVolumeM3 = parseFiniteNumber(impactGuideReceivingRoomVolumeM3);
  const parsedImpactLowerTreatmentReductionDb = parseFiniteNumber(impactLowerTreatmentReductionDb);
  const parsedImpactGuideCi50_2500Db = parseFiniteNumber(impactGuideCi50_2500Db);
  const parsedImpactGuideCiDb = parseFiniteNumber(impactGuideCiDb);
  const parsedAirbornePanelHeightMm = parseFiniteNumber(airbornePanelHeightMm);
  const parsedAirbornePanelWidthMm = parseFiniteNumber(airbornePanelWidthMm);
  const parsedAirborneReceivingRoomRt60S = parseFiniteNumber(airborneReceivingRoomRt60S);
  const parsedAirborneReceivingRoomVolumeM3 = parseFiniteNumber(airborneReceivingRoomVolumeM3);
  const parsedAirborneStudSpacingMm = parseFiniteNumber(airborneStudSpacingMm);
  const manualReferenceImpact =
    typeof parsedImpactReferenceDeltaLwDb === "number"
      ? deriveHeavyReferenceImpactFromDeltaLw(parsedImpactReferenceDeltaLwDb)
      : null;
  const improvementReferenceImpact = exactImprovementImport.parsed
    ? buildExactImpactImprovementReference(exactImprovementImport.parsed.source)
    : null;
  const referenceImpact = improvementReferenceImpact ?? manualReferenceImpact;
  const liveImpactFieldContext =
    {
      directPathOffsetDb: parsedImpactDirectPathOffsetDb,
      enableSmallRoomEstimate: impactGuideSource === "live_stack" ? impactGuideSmallRoomMode : undefined,
      fieldKDb: impactGuideSource === "live_stack" ? parsedImpactGuideKDb : undefined,
      flankingPaths: flankingPathImport.parsed?.paths ?? [],
      guideHdDb: impactGuideSource === "live_stack" ? parsedImpactGuideHdDb : undefined,
      guideMassRatio: impactGuideSource === "live_stack" ? parsedImpactGuideMassRatio : undefined,
      lowerTreatmentReductionDb: parsedImpactLowerTreatmentReductionDb,
      receivingRoomVolumeM3: parsedImpactGuideReceivingRoomVolumeM3
    };
  const liveAirborneContext =
    studyMode === "wall"
      ? {
          airtightness: airborneAirtightness,
          connectionType: airborneConnectionType,
          contextMode: airborneContextMode,
          electricalBoxes: airborneElectricalBoxes,
          junctionQuality: airborneJunctionQuality,
          panelHeightMm: parsedAirbornePanelHeightMm,
          panelWidthMm: parsedAirbornePanelWidthMm,
          penetrationState: airbornePenetrationState,
          perimeterSeal: airbornePerimeterSeal,
          receivingRoomRt60S: parsedAirborneReceivingRoomRt60S,
          receivingRoomVolumeM3: parsedAirborneReceivingRoomVolumeM3,
          sharedTrack: airborneSharedTrack,
          studSpacingMm: parsedAirborneStudSpacingMm,
          studType: airborneStudType
        }
      : null;
  const currentScenario = evaluateScenario({
    airborneContext: liveAirborneContext,
    calculator: calculatorId,
    customMaterials,
    exactImpactSource: exactImpactImport.parsed?.source ?? null,
    id: "current",
    impactFieldContext: liveImpactFieldContext,
    name: projectName,
    rows: deferredRows,
    source: "current",
    studyMode,
    targetOutputs: requestedOutputs
  });
  const result = currentScenario.result;
  const rawGuideBaseImpact =
    impactGuideSource === "heavy_reference"
      ? referenceImpact
      : result?.impact ?? result?.floorSystemMatch?.impact ?? result?.floorSystemEstimate?.impact ?? null;
  const rawGuideBaseBound =
    impactGuideSource === "heavy_reference"
      ? null
      : !rawGuideBaseImpact
        ? result?.lowerBoundImpact ?? null
        : null;
  const guideBaseImpact =
    rawGuideBaseImpact && typeof rawGuideBaseImpact.LnW === "number" ? rawGuideBaseImpact : null;
  const guideBaseBound =
    rawGuideBaseBound && typeof rawGuideBaseBound.LnWUpperBound === "number" ? rawGuideBaseBound : null;
  const guideBaseLnW = guideBaseImpact?.LnW ?? null;
  const guideBaseLnWUpperBound = guideBaseBound?.LnWUpperBound ?? null;
  const hasGuideCarryover =
    typeof guideBaseImpact?.CI === "number" || typeof guideBaseImpact?.CI50_2500 === "number";
  const hasGuideInputs =
    hasGuideCarryover ||
    impactGuideCi50_2500Db.trim().length > 0 ||
    impactGuideCiDb.trim().length > 0 ||
    impactGuideKDb.trim().length > 0 ||
    impactGuideHdDb.trim().length > 0 ||
    impactGuideMassRatio.trim().length > 0 ||
    impactGuideReceivingRoomVolumeM3.trim().length > 0 ||
    impactGuideSmallRoomMode;
  const impactGuide =
    (guideBaseImpact && typeof guideBaseLnW === "number" && hasGuideInputs) ||
    (guideBaseBound && typeof guideBaseLnWUpperBound === "number" && hasGuideInputs)
      ? deriveImpactGuideMetrics({
          baseConfidence: guideBaseImpact?.confidence ?? guideBaseBound?.confidence,
          baseLnW: guideBaseLnW,
          baseLnWUpperBound: guideBaseLnWUpperBound,
          ci50_2500Db:
            typeof parsedImpactGuideCi50_2500Db === "number"
              ? parsedImpactGuideCi50_2500Db
              : typeof guideBaseImpact?.CI50_2500 === "number"
                ? guideBaseImpact.CI50_2500
                : null,
          ciDb:
            typeof parsedImpactGuideCiDb === "number"
              ? parsedImpactGuideCiDb
              : typeof guideBaseImpact?.CI === "number"
                ? guideBaseImpact.CI
                : null,
          enableSmallRoomEstimate: impactGuideSmallRoomMode,
          hdDb: parsedImpactGuideHdDb ?? null,
          kDb: parsedImpactGuideKDb ?? null,
          massRatio: parsedImpactGuideMassRatio ?? null,
          receivingRoomVolumeM3: parsedImpactGuideReceivingRoomVolumeM3 ?? null,
          source: impactGuideSource
        })
      : null;
  const evaluatedSavedScenarios = savedScenarios.map((scenario) =>
    {
      const parsedScenarioExactImpact = parseImpactBandImport({
        labOrField: scenario.impactExactLabOrField ?? "lab",
        text: scenario.impactExactBandInput ?? ""
      });

      return evaluateScenario({
        airborneContext:
          scenario.studyMode === "wall"
            ? {
                airtightness: scenario.airborneAirtightness ?? "good",
                connectionType: scenario.airborneConnectionType ?? "auto",
                contextMode: scenario.airborneContextMode ?? "element_lab",
                electricalBoxes: scenario.airborneElectricalBoxes ?? "none",
                junctionQuality: scenario.airborneJunctionQuality ?? "good",
                panelHeightMm: parseFiniteNumber(scenario.airbornePanelHeightMm),
                panelWidthMm: parseFiniteNumber(scenario.airbornePanelWidthMm),
                penetrationState: scenario.airbornePenetrationState ?? "none",
                perimeterSeal: scenario.airbornePerimeterSeal ?? "good",
                receivingRoomRt60S: parseFiniteNumber(scenario.airborneReceivingRoomRt60S),
                receivingRoomVolumeM3: parseFiniteNumber(scenario.airborneReceivingRoomVolumeM3),
                sharedTrack: scenario.airborneSharedTrack ?? "independent",
                studSpacingMm: parseFiniteNumber(scenario.airborneStudSpacingMm),
                studType: scenario.airborneStudType ?? "auto"
              }
            : null,
        calculator: scenario.calculatorId ?? "dynamic",
        customMaterials: scenario.customMaterials ?? [],
        exactImpactSource: parsedScenarioExactImpact.parsed?.source ?? null,
        id: scenario.id,
        impactFieldContext:
          scenario.impactGuideSource === "live_stack"
            ? {
                enableSmallRoomEstimate: scenario.impactGuideSmallRoomMode,
                fieldKDb: parseFiniteNumber(scenario.impactGuideKDb),
                guideHdDb: parseFiniteNumber(scenario.impactGuideHdDb),
                guideMassRatio: parseFiniteNumber(scenario.impactGuideMassRatio),
                receivingRoomVolumeM3: parseFiniteNumber(scenario.impactGuideReceivingRoomVolumeM3)
              }
            : null,
        name: scenario.name,
        rows: scenario.rows,
        savedAtIso: scenario.savedAtIso,
        source: "saved",
        studyMode: scenario.studyMode,
        targetOutputs: scenario.requestedOutputs
      });
    }
  );
  const activePreset = getPresetById(activePresetId);
  const saveScenario = () => {
    saveCurrentScenario();
    toast.success("Scenario saved", {
      description: "The live assembly is now available in option studies."
    });
  };
  const loadScenario = (scenarioId: string) => {
    const scenario = savedScenarios.find((entry) => entry.id === scenarioId);
    loadSavedScenario(scenarioId);
    toast.success("Scenario loaded", {
      description: scenario?.name ?? "Saved study restored."
    });
  };
  const loadWorkbenchPreset = (presetId: typeof activePreset.id) => {
    const preset = getPresetById(presetId);
    loadPreset(presetId);
    toast.success(`${preset.label} loaded`, {
      description: preset.note
    });
  };
  const resetWorkspace = () => {
    reset();
    toast("Workspace reset", {
      description: "The operator desk returned to its default wall study."
    });
  };
  const deleteScenario = (scenarioId: string) => {
    const scenario = savedScenarios.find((entry) => entry.id === scenarioId);
    deleteSavedScenario(scenarioId);
    toast("Scenario removed", {
      description: scenario?.name ?? "Saved option study removed."
    });
  };
  const reportMarkdown = composeWorkbenchReport({
    activeCriteriaPack,
    activePreset,
    briefNote,
    clientName,
    currentScenario,
    fieldRiskIds,
    impactGuide,
    impactImprovementBandInput,
    improvementReferenceImpact,
    impactReference: referenceImpact,
    impactReferenceDeltaLwDb,
    projectName,
    reportProfile,
    requestedOutputs,
    savedScenarios: evaluatedSavedScenarios,
    studyContext,
    studyMode,
    targetLnwDb,
    targetRwDb
  });
  const reportFilename = buildReportFilename(projectName);
  const reportExport = useReportExportActions(reportMarkdown, reportFilename);
  const liveSolverStatus = !result
    ? { label: "Awaiting stack", tone: "neutral" as const }
    : result.dynamicImpactTrace
      ? {
          label: result.dynamicImpactTrace.selectionKindLabel,
          tone:
            result.dynamicImpactTrace.evidenceTier === "exact"
              ? ("success" as const)
              : result.dynamicImpactTrace.evidenceTier === "estimate"
                ? ("accent" as const)
                : result.dynamicImpactTrace.evidenceTier === "derived"
                  ? ("neutral" as const)
                  : ("warning" as const)
        }
      : { label: result.calculatorLabel ?? "Live result", tone: "success" as const };
  const evidenceReady = Boolean(
    exactImpactImport.parsed ||
      exactImprovementImport.parsed ||
      manualReferenceImpact ||
      result?.impactCatalogMatch ||
      result?.floorSystemMatch ||
      result?.boundFloorSystemMatch
  );
  const wallOverlayActive = Boolean(
    result?.airborneOverlay ||
      studyMode === "wall" ||
      airborneContextMode !== "element_lab" ||
      airborneAirtightness !== "good" ||
      airborneElectricalBoxes !== "none" ||
      airborneJunctionQuality !== "good" ||
      airbornePenetrationState !== "none" ||
      airbornePerimeterSeal !== "good" ||
      airborneSharedTrack !== "independent"
  );
  const fieldCarryoverActive = Boolean(
    result?.dynamicImpactTrace?.fieldContinuation !== "none" ||
      impactGuide ||
      flankingPathImport.parsed ||
      impactDirectPathOffsetDb.trim().length > 0 ||
      impactGuideKDb.trim().length > 0 ||
      impactGuideReceivingRoomVolumeM3.trim().length > 0 ||
      impactGuideSmallRoomMode
  );
  const impactFieldPathGuides = buildImpactFieldPathGuides({
    directPathOffsetDb: impactDirectPathOffsetDb,
    lowerTreatmentReductionDb: impactLowerTreatmentReductionDb,
    parsed: flankingPathImport.parsed,
    parseError: flankingPathImport.error,
    result: result?.impact ?? null
  });
  const impactGuideGuides = buildImpactGuideFieldGuides({
    baseImpact: guideBaseImpact,
    baseLowerBoundImpact: guideBaseBound,
    ci50_2500Input: impactGuideCi50_2500Db,
    ciInput: impactGuideCiDb,
    guideResult: impactGuide,
    hdInput: impactGuideHdDb,
    kInput: impactGuideKDb,
    massRatioInput: impactGuideMassRatio,
    receivingRoomVolumeM3: impactGuideReceivingRoomVolumeM3,
    selectedSource: impactGuideSource,
    smallRoomEstimateEnabled: impactGuideSmallRoomMode
  });
  const fieldUsageItems = [
    { guide: impactFieldPathGuides.directOffset, id: "direct_path_offset", label: "Direct path offset", section: "Field path" },
    { guide: impactFieldPathGuides.lowerTreatmentReduction, id: "direct_path_dld", label: "Direct-path ΔLd", section: "Field path" },
    { guide: impactFieldPathGuides.flankingPaths, id: "flanking_paths", label: "Flanking paths JSON", section: "Field path" },
    { guide: impactGuideGuides.guideBase, id: "guide_base", label: "Guide base", section: "Guide" },
    { guide: impactGuideGuides.ci, id: "guide_ci", label: "CI", section: "Guide" },
    { guide: impactGuideGuides.ci50_2500, id: "guide_ci50_2500", label: "CI,50-2500", section: "Guide" },
    { guide: impactGuideGuides.k, id: "guide_k", label: "K", section: "Guide" },
    { guide: impactGuideGuides.massRatio, id: "guide_mass_ratio", label: "a/(b+c+d+e)", section: "Guide" },
    { guide: impactGuideGuides.hd, id: "guide_hd", label: "Hd", section: "Guide" },
    { guide: impactGuideGuides.volume, id: "guide_volume", label: "Receiving room V", section: "Guide" },
    { guide: impactGuideGuides.smallRoom, id: "guide_small_room", label: "TR small-room", section: "Guide" }
  ] as const;
  const activeFieldUsageCount = fieldUsageItems.filter((item) => item.guide.kind === "active").length;
  const anchoredFieldUsageCount = fieldUsageItems.filter((item) => item.guide.kind === "anchored").length;
  const flowItems = [
    {
      href: "#chapter-scope",
      label: "Scope and targets",
      stage: "01",
      statusLabel: requestedOutputs.length > 0 ? `${requestedOutputs.length} outputs armed` : "Targets open",
      summary: "Lock the brief, requested outputs, and criteria packs before you read any solver lane.",
      tone: requestedOutputs.length > 0 ? "success" : "neutral"
    },
    {
      href: "#chapter-compose",
      label: "Compose and compare",
      stage: "02",
      statusLabel:
        rows.length === 0
          ? "Stack empty"
          : studyMode === "floor"
            ? `${rows.length} rows · ${assignedFloorRoleCount}/${rows.length} roles`
            : `${rows.length} rows · ${validThicknessRowCount}/${rows.length} sized`,
      summary:
        studyMode === "floor"
          ? "Edit the assembly, then lock material, thickness, and floor-role coverage before trusting exact family or product lanes."
          : "Edit the assembly, then keep scenario branches alive instead of overwriting the current stack.",
      tone: rows.length > 0 ? "accent" : "neutral"
    },
    {
      href: "#chapter-live-solver",
      label: "Solver and evidence",
      stage: "03",
      statusLabel: liveSolverStatus.label,
      summary: "Read the live airborne and impact lanes first, then move directly into exact evidence and catalog-backed checks.",
      tone: liveSolverStatus.tone
    },
    {
      href: "#chapter-wall-overlay",
      label: "Field and wall corrections",
      stage: "04",
      statusLabel:
        fieldCarryoverActive || wallOverlayActive
          ? fieldCarryoverActive && wallOverlayActive
            ? "Both active"
            : fieldCarryoverActive
              ? "Field active"
              : "Wall active"
          : "Standby",
      summary: "Airborne overlay, explicit K, room volume, flanking sums, and guide branches stay visible as separate corrections.",
      tone: fieldCarryoverActive || wallOverlayActive ? "accent" : "neutral"
    },
    {
      href: "#chapter-delivery",
      label: "Delivery and diagnostics",
      stage: "05",
      statusLabel: result ? "Ready" : "Waiting",
      summary: "Criteria, reporting, layer mass, narrative, and readiness checks close the operator loop.",
      tone: result ? "success" : "neutral"
    }
  ] as const;
  const leftRail = (
    <aside className="space-y-6 xl:sticky xl:top-4">
      <WorkbenchChapter
        description="Start by defining the project frame, requested outputs, and performance thresholds. This is the control surface that decides which downstream lanes matter."
        eyebrow="Chapter 01"
        id="chapter-scope"
        index="01"
        statusLabel={requestedOutputs.length > 0 ? `${requestedOutputs.length} outputs armed` : "Targets open"}
        statusTone={requestedOutputs.length > 0 ? "success" : "neutral"}
        title="Scope, targets, and criteria"
      >
        <ProjectBriefPanel
          activeCriteriaPackLabel={activeCriteriaPack.label}
          briefNote={briefNote}
          clientName={clientName}
          guideResult={impactGuide}
          onBriefNoteChange={setBriefNote}
          onClientNameChange={setClientName}
          onProjectNameChange={setProjectName}
          onReportProfileChange={setReportProfile}
          onStudyContextChange={setStudyContext}
          onTargetLnwDbChange={setTargetLnwDb}
          onTargetRwDbChange={setTargetRwDb}
          onToggleRequestedOutput={toggleRequestedOutput}
          projectName={projectName}
          reportProfile={reportProfile}
          result={result}
          requestedOutputs={requestedOutputs}
          studyContext={studyContext}
          targetLnwDb={targetLnwDb}
          targetRwDb={targetRwDb}
        />
        <CriteriaPackPanel activeCriteriaPackId={criteriaPackId} onApplyCriteriaPack={applyCriteriaPack} />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Keep one eye on implemented coverage and one eye on parity pressure. This chapter is the guardrail against adding attractive UI around unsupported acoustic claims."
        eyebrow="Chapter 02"
        id="chapter-parity-watch"
        index="02"
        statusLabel="Parity watch"
        statusTone="accent"
        title="Coverage, parity, and upstream watch"
      >
        <CapabilityMapPanel />
        <ParityScorecardPanel />
        <UpstreamRadarPanel />
      </WorkbenchChapter>
    </aside>
  );
  const centerRail = (
    <div className="space-y-6">
      <WorkbenchChapter
        description="Build the visible stack here. Floor roles, thicknesses, and material identity should be adjusted before you read any solver trace."
        eyebrow="Chapter 03"
        id="chapter-compose"
        index="03"
        statusLabel={
          rows.length === 0
            ? "Stack empty"
            : studyMode === "floor"
              ? `${rows.length} rows · ${assignedFloorRoleCount}/${rows.length} roles`
              : `${rows.length} rows · ${validThicknessRowCount}/${rows.length} sized`
        }
        statusTone={rows.length > 0 ? "success" : "neutral"}
        title="Compose the assembly"
      >
        <LayerEditor
          materials={materials}
          onDensityChange={updateDensity}
          onAddRow={addRow}
          onFloorRoleChange={updateFloorRole}
          onMaterialChange={updateMaterial}
          onMoveRow={moveRow}
          onRemoveRow={removeRow}
          onThicknessChange={updateThickness}
          rows={rows}
          studyMode={studyMode}
        />
        <MaterialLibraryPanel materials={materials} onAppendMaterial={appendMaterial} />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Save, reload, and compare option studies without leaving the main desk. This is where topology variants stay comparable under the same targets."
        eyebrow="Chapter 04"
        id="chapter-scenarios"
        index="04"
        statusLabel={savedScenarios.length > 0 ? `${savedScenarios.length} saved` : "No saved options"}
        statusTone={savedScenarios.length > 0 ? "accent" : "neutral"}
        title="Scenario studies"
      >
        <ScenarioComparePanel
          currentScenario={currentScenario}
          onDeleteScenario={deleteScenario}
          onLoadScenario={loadScenario}
          onSaveScenario={saveScenario}
          savedScenarios={evaluatedSavedScenarios}
          targetLnwDb={targetLnwDb}
          targetRwDb={targetRwDb}
        />
      </WorkbenchChapter>
    </div>
  );
  const rightRail = (
    <aside className="space-y-6 xl:sticky xl:top-4">
      <WorkbenchChapter
        description="Read the current airborne and impact outcomes first. This chapter should tell you what lane is live before you inspect any evidence import or guide override."
        eyebrow="Chapter 05"
        id="chapter-live-solver"
        index="05"
        statusLabel={liveSolverStatus.label}
        statusTone={liveSolverStatus.tone}
        title={studyMode === "wall" ? "Live wall-side solver" : "Live floor-side solver"}
      >
        <ResultSummary result={result} warnings={normalized.warnings} />
        <ValidationRegimePanel result={result} />
        <ImpactResultPanel result={result} />
        <AirborneTracePanel result={result} />
        <ImpactTracePanel result={result} />
        <AcousticCurvePanel result={result} />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Exact impact bands, catalog rows, curated floor families, and heavy-reference shortcuts all enter here. These lanes should be preferred before any broad estimate branch."
        eyebrow="Chapter 06"
        id="chapter-evidence-lanes"
        index="06"
        statusLabel={evidenceReady ? "Evidence armed" : "Standby"}
        statusTone={evidenceReady ? "success" : "neutral"}
        title="Evidence lanes and exact references"
      >
        <ImpactProductCatalogPanel result={result} />
        <ExactFloorSystemPanel result={result} />
        <ImpactBandSourcePanel
          input={impactExactBandInput}
          labOrField={impactExactLabOrField}
          onInputChange={setImpactExactBandInput}
          onLabOrFieldChange={setImpactExactLabOrField}
          parseError={exactImpactImport.error}
          parsedImport={exactImpactImport.parsed}
        />
        <ImpactImprovementSourcePanel
          input={impactImprovementBandInput}
          onInputChange={setImpactImprovementBandInput}
          parseError={exactImprovementImport.error}
          parsedImport={exactImprovementImport.parsed}
          referenceImpact={improvementReferenceImpact}
        />
        <ImpactReferencePanel
          deltaLwInput={impactReferenceDeltaLwDb}
          onDeltaLwInputChange={setImpactReferenceDeltaLwDb}
          referenceImpact={manualReferenceImpact}
          targetLnwDb={targetLnwDb}
        />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Leakage, perimeter, shared-track, and field flanking assumptions belong to the airborne wall lane. In floor mode this remains a companion overlay, not the main impact path."
        eyebrow="Chapter 07"
        id="chapter-wall-overlay"
        index="07"
        statusLabel={wallOverlayActive ? (studyMode === "wall" ? "Wall lane active" : "Companion overlay") : "Standby"}
        statusTone={wallOverlayActive ? (studyMode === "wall" ? "accent" : "neutral") : "neutral"}
        title="Wall overlay and apparent-field drift"
      >
        <AirborneContextPanel
          airtightness={airborneAirtightness}
          connectionType={airborneConnectionType}
          contextMode={airborneContextMode}
          electricalBoxes={airborneElectricalBoxes}
          junctionQuality={airborneJunctionQuality}
          onAirtightnessChange={setAirborneAirtightness}
          onConnectionTypeChange={setAirborneConnectionType}
          onContextModeChange={setAirborneContextMode}
          onElectricalBoxesChange={setAirborneElectricalBoxes}
          onJunctionQualityChange={setAirborneJunctionQuality}
          onPanelHeightMmChange={setAirbornePanelHeightMm}
          onPanelWidthMmChange={setAirbornePanelWidthMm}
          onPenetrationStateChange={setAirbornePenetrationState}
          onPerimeterSealChange={setAirbornePerimeterSeal}
          onReceivingRoomRt60SChange={setAirborneReceivingRoomRt60S}
          onReceivingRoomVolumeM3Change={setAirborneReceivingRoomVolumeM3}
          onSharedTrackChange={setAirborneSharedTrack}
          onStudSpacingMmChange={setAirborneStudSpacingMm}
          onStudTypeChange={setAirborneStudType}
          overlay={result?.airborneOverlay ?? null}
          panelHeightMm={airbornePanelHeightMm}
          panelWidthMm={airbornePanelWidthMm}
          penetrationState={airbornePenetrationState}
          perimeterSeal={airbornePerimeterSeal}
          receivingRoomRt60S={airborneReceivingRoomRt60S}
          receivingRoomVolumeM3={airborneReceivingRoomVolumeM3}
          sharedTrack={airborneSharedTrack}
          studSpacingMm={airborneStudSpacingMm}
          studType={airborneStudType}
          studyMode={studyMode}
        />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Once a lab-side Ln,w lane exists, continue it here into explicit K corrections, direct+flanking field paths, standardized room-volume normalization, and Turkish guide branches."
        eyebrow="Chapter 08"
        id="chapter-field-carryover"
        index="08"
        statusLabel={
          activeFieldUsageCount > 0
            ? `${activeFieldUsageCount} active input${activeFieldUsageCount === 1 ? "" : "s"}`
            : anchoredFieldUsageCount > 0
              ? `${anchoredFieldUsageCount} anchored`
              : fieldCarryoverActive
                ? "Carry-over staged"
                : "Optional lane"
        }
        statusTone={fieldCarryoverActive ? "accent" : "neutral"}
        title="Field carry-over and guide branches"
      >
        <FieldUsageBoard
          description="This chapter mixes two families of controls: explicit field-path editing and guide-side Ln,w carry-over. The board below tells you which knobs are actually shaping the active dynamic impact lane before you inspect individual forms."
          items={fieldUsageItems}
          title="Which field and guide inputs are shaping the current floor solve"
        />
        <ImpactFieldPathPanel
          directPathOffsetDb={impactDirectPathOffsetDb}
          flankingPathsInput={impactFlankingPathsInput}
          lowerTreatmentReductionDb={impactLowerTreatmentReductionDb}
          onDirectPathOffsetDbChange={setImpactDirectPathOffsetDb}
          onFlankingPathsInputChange={setImpactFlankingPathsInput}
          onLowerTreatmentReductionDbChange={setImpactLowerTreatmentReductionDb}
          parseError={flankingPathImport.error}
          parsed={flankingPathImport.parsed}
          result={result?.impact ?? null}
        />
        <ImpactGuidePanel
          baseImpact={guideBaseImpact}
          baseLowerBoundImpact={guideBaseBound}
          ci50_2500Input={impactGuideCi50_2500Db}
          ciInput={impactGuideCiDb}
          guideResult={impactGuide}
          hdInput={impactGuideHdDb}
          kInput={impactGuideKDb}
          massRatioInput={impactGuideMassRatio}
          onEnableSmallRoomEstimateChange={setImpactGuideSmallRoomMode}
          onCi50_2500InputChange={setImpactGuideCi50_2500Db}
          onCiInputChange={setImpactGuideCiDb}
          onGuideSourceChange={setImpactGuideSource}
          onHdInputChange={setImpactGuideHdDb}
          onKInputChange={setImpactGuideKDb}
          onMassRatioInputChange={setImpactGuideMassRatio}
          onReceivingRoomVolumeM3Change={setImpactGuideReceivingRoomVolumeM3}
          referenceImpactAvailable={Boolean(referenceImpact)}
          receivingRoomVolumeM3={impactGuideReceivingRoomVolumeM3}
          selectedSource={impactGuideSource}
          smallRoomEstimateEnabled={impactGuideSmallRoomMode}
        />
      </WorkbenchChapter>

      <WorkbenchChapter
        description="Close the loop here: compare against targets, export the current study, inspect layer mass and narrative, and keep readiness visible before claiming a result is shippable."
        eyebrow="Chapter 09"
        id="chapter-delivery"
        index="09"
        statusLabel={result ? "Review ready" : "Awaiting live result"}
        statusTone={result ? "success" : "neutral"}
        title="Delivery, reporting, and diagnostics"
      >
        <PerformanceCriteriaPanel
          activeCriteriaPack={activeCriteriaPack}
          guideResult={impactGuide}
          requestedOutputs={requestedOutputs}
          result={result}
          studyMode={studyMode}
          targetLnwDb={targetLnwDb}
          targetRwDb={targetRwDb}
        />
        <FieldRiskPanel fieldRiskIds={fieldRiskIds} onToggleFieldRisk={toggleFieldRisk} />
        <ReportExportPanel
          briefNote={briefNote}
          exportStatus={reportExport.status}
          fileName={reportFilename}
          guideResult={impactGuide}
          onCopyReport={reportExport.copyReport}
          onDownloadReport={reportExport.downloadReport}
          result={result}
          requestedOutputs={requestedOutputs}
          requestedOutputCount={requestedOutputs.length}
          savedScenarioCount={savedScenarios.length}
          warnings={currentScenario.warnings}
        />
        <DeliveryAssistPanel
          activeCriteriaPack={activeCriteriaPack}
          briefNote={briefNote}
          fieldRiskSummary={fieldRiskSummary}
          guideResult={impactGuide}
          reportProfile={reportProfile}
          requestedOutputs={requestedOutputs}
          result={result}
          savedScenarioCount={savedScenarios.length}
          studyContext={studyContext}
        />
        <LayerMassPanel result={result} />
        <AssemblyNarrativePanel result={result} studyMode={studyMode} />
        <SurfacePanel className="px-5 py-5">
          <div className="eyebrow">Catalog note</div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{MATERIAL_SOURCE_NOTE}</p>
        </SurfacePanel>
        <ReadinessPanel />
      </WorkbenchChapter>
    </aside>
  );

  return (
    <>
      <WorkbenchCommandPalette
        activeCriteriaPackId={criteriaPackId}
        currentScenario={currentScenario}
        currentPresetId={activePreset.id}
        onApplyCriteriaPack={applyCriteriaPack}
        onCopyReport={reportExport.copyReport}
        onDownloadReport={reportExport.downloadReport}
        onLoadPreset={loadWorkbenchPreset}
        onLoadScenario={loadScenario}
        onOpenChange={commandPalette.setOpen}
        onReset={resetWorkspace}
        onSaveScenario={saveScenario}
        onToggleRequestedOutput={toggleRequestedOutput}
        open={commandPalette.open}
        projectName={projectName}
        requestedOutputs={requestedOutputs}
        savedScenarios={evaluatedSavedScenarios}
        targetLnwDb={targetLnwDb}
        targetRwDb={targetRwDb}
      />
      <WorkbenchHeader
        activePreset={activePreset}
        activeCalculatorId={calculatorId}
        onCalculatorChange={setCalculatorId}
        onOpenCommands={() => commandPalette.setOpen(true)}
        onPreset={loadWorkbenchPreset}
        onReset={resetWorkspace}
        projectName={projectName}
        savedScenarioCount={savedScenarios.length}
        studyMode={studyMode}
      />
      <WorkbenchFlowMap items={flowItems} />
      <WorkbenchCommandDeck
        currentScenario={currentScenario}
        onOpenCommands={() => commandPalette.setOpen(true)}
        onSaveScenario={saveScenario}
        projectName={projectName}
        requestedOutputs={requestedOutputs}
        savedScenarios={evaluatedSavedScenarios}
        studyMode={studyMode}
        targetLnwDb={targetLnwDb}
        targetRwDb={targetRwDb}
      />

      <WorkbenchRailLayout centerRail={centerRail} leftRail={leftRail} rightRail={rightRail} />
    </>
  );
}
