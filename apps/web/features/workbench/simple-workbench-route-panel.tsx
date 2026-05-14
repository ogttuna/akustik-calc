"use client";

import type {
  AirborneCalculatorId,
  AirborneBuildingPredictionOutputBasis,
  AirborneConnectionType,
  AirborneConservativeFlankingAssumption,
  AirborneContextMode,
  AirborneFlankingJunctionClass,
  AirborneOpeningOrigin,
  AirborneOpeningRatingBasis,
  AirborneOpeningSealLeakageClass,
  AirborneResilientBarSideCount,
  AirborneStudType,
  AirtightnessClass,
  ElectricalBoxState,
  FloorRole,
  ImpactPredictorSupportForm,
  JunctionQuality,
  PenetrationState,
  PerimeterSealClass,
  SharedTrackClass,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallInternalLeafCoupling,
  WallSupportTopology,
  WallTopologyMode
} from "@dynecho/shared";
import { ArrowDown, ArrowUp, CloudUpload, FolderOpen, Plus, RefreshCcw, Trash2 } from "lucide-react";

import type { GuidedRouteSignals } from "./guided-route-signals";
import type { GuidedTopologyGap } from "./guided-topology-gap";
import type { GuidedValidationSummary } from "./guided-validation-summary";
import type { DynamicCalcBranchSummary } from "./dynamic-calc-branch";
import type { PresetDefinition, PresetId, StudyMode } from "./preset-definitions";
import { GUIDED_INPUT_SANITY_BANDS, formatGuidedSanityBand } from "./input-sanity";
import {
  AIRBORNE_CONTEXT_OPTIONS,
  AIRTIGHTNESS_OPTIONS,
  BUILDING_PREDICTION_OUTPUT_BASIS_OPTIONS,
  CALCULATOR_OPTIONS,
  CONNECTION_OPTIONS,
  CONSERVATIVE_FLANKING_ASSUMPTION_OPTIONS,
  ELECTRICAL_BOX_OPTIONS,
  FLANKING_JUNCTION_CLASS_OPTIONS,
  JUNCTION_OPTIONS,
  OPENING_LEAK_ORIGIN_OPTIONS,
  OPENING_LEAK_RATING_BASIS_OPTIONS,
  OPENING_LEAK_SEAL_OPTIONS,
  PENETRATION_OPTIONS,
  RESILIENT_BAR_SIDE_COUNT_OPTIONS,
  SEAL_OPTIONS,
  HEAVY_CONCRETE_COMBINED_LOWER_ASSEMBLY_OPTIONS,
  HEAVY_CONCRETE_COMBINED_LOWER_SUPPORT_OPTIONS,
  STEEL_BOUND_SUPPORT_FORM_ACTIONS,
  STEEL_FLOOR_FORMULA_LOWER_ISOLATION_OPTIONS,
  STEEL_FLOOR_FORMULA_SUPPORT_FORM_OPTIONS,
  STUD_TYPE_OPTIONS,
  TIMBER_CLT_DELTA_LW_LOWER_ASSEMBLY_OPTIONS,
  TIMBER_CLT_DELTA_LW_LOWER_SUPPORT_OPTIONS,
  TIMBER_CLT_DELTA_LW_SUPPORT_OPTIONS,
  TIMBER_CLT_DELTA_LW_SYSTEM_OPTIONS,
  TIMBER_IMPACT_ONLY_GUIDED_ACTIONS,
  TRACK_OPTIONS,
  WALL_CAVITY_ABSORPTION_OPTIONS,
  WALL_CAVITY_FILL_COVERAGE_OPTIONS,
  WALL_INTERNAL_LEAF_COUPLING_OPTIONS,
  WALL_SUPPORT_TOPOLOGY_OPTIONS,
  WALL_TOPOLOGY_MODE_OPTIONS,
  type WorkspacePanelId
} from "./simple-workbench-constants";
import type { WorkbenchOpeningLeakElementDraft } from "./opening-leak-composite-input-surface";
import {
  workbenchSectionCardClass,
  workbenchSectionEyebrowClass,
  workbenchSectionMutedCardClass
} from "./simple-workbench-layer-visuals";
import { buildSimpleWorkbenchPresetGroups } from "./simple-workbench-preset-groups";
import {
  ContextBucket,
  ContextSubsection,
  DetailTag,
  FieldShell,
  GuidedFactChip,
  GuidedRouteRow,
  SectionLead
} from "./simple-workbench-primitives";
import { getEnvironmentLabel, getTextInputClassName } from "./simple-workbench-utils";
import type {
  WorkbenchHeavyConcreteCombinedLowerAssemblyType,
  WorkbenchHeavyConcreteCombinedLowerSupportClass
} from "./heavy-concrete-combined-impact-input-surface";
import type { WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm } from "./steel-floor-formula-input-surface";
import type {
  WorkbenchTimberCltDeltaLwImpactSystemType,
  WorkbenchTimberCltDeltaLwLowerAssemblyType,
  WorkbenchTimberCltDeltaLwLowerSupportClass,
  WorkbenchTimberCltDeltaLwStructuralSupportType
} from "./timber-clt-delta-lw-input-surface";

const EMPTY_EXAMPLE_VALUE = "__start_empty__";

type SimpleWorkbenchRoutePanelProps = {
  activeWorkspacePanel: WorkspacePanelId;
  airborneAirtightness: AirtightnessClass;
  airborneBuildingPredictionOutputBasis: AirborneBuildingPredictionOutputBasis;
  airborneConnectionType: AirborneConnectionType;
  airborneConservativeFlankingAssumption: AirborneConservativeFlankingAssumption;
  airborneContextMode: AirborneContextMode;
  airborneElectricalBoxes: ElectricalBoxState;
  airborneFlankingJunctionClass: AirborneFlankingJunctionClass;
  airborneJunctionCouplingLengthM: string;
  airborneJunctionQuality: JunctionQuality;
  airbornePanelHeightMm: string;
  airbornePanelWidthMm: string;
  airbornePenetrationState: PenetrationState;
  airbornePerimeterSeal: PerimeterSealClass;
  airborneReceivingRoomRt60S: string;
  airborneReceivingRoomVolumeM3: string;
  airborneResilientBarSideCount: AirborneResilientBarSideCount;
  airborneSharedTrack: SharedTrackClass;
  airborneSourceRoomVolumeM3: string;
  airborneStudSpacingMm: string;
  airborneStudType: AirborneStudType;
  airborneWallCavity1AbsorptionClass: WallCavityAbsorptionClass;
  airborneWallCavity1DepthMm: string;
  airborneWallCavity1FillCoverage: WallCavityFillCoverage;
  airborneWallCavity1LayerIndices: string;
  airborneWallCavity2AbsorptionClass: WallCavityAbsorptionClass;
  airborneWallCavity2DepthMm: string;
  airborneWallCavity2FillCoverage: WallCavityFillCoverage;
  airborneWallCavity2LayerIndices: string;
  airborneWallInternalLeafCoupling: WallInternalLeafCoupling;
  airborneWallInternalLeafLayerIndices: string;
  airborneOpeningLeakElements: readonly WorkbenchOpeningLeakElementDraft[];
  airborneOpeningLeakHostWallAreaM2: string;
  airborneWallSideALeafLayerIndices: string;
  airborneWallSideBLeafLayerIndices: string;
  airborneWallSupportTopology: WallSupportTopology;
  airborneWallTopologyMode: WallTopologyMode;
  airborneVolumeSanityWarning: string | null;
  addAirborneOpeningLeakElement: () => void;
  appendRows: (rows: readonly { densityKgM3?: string; dynamicStiffnessMNm3?: string; floorRole?: FloorRole; materialId: string; thicknessMm: string }[]) => void;
  automaticOutputsLength: number;
  calculatorId: AirborneCalculatorId;
  contextNotes: readonly string[];
  dynamicCalcBranch: DynamicCalcBranchSummary;
  expertInputsActive: boolean;
  geometryActive: boolean;
  hasOptionalContextFields: boolean;
  impactFieldActive: boolean;
  impactGuideKDb: string;
  impactGuideReceivingRoomVolumeM3: string;
  impactHeavyConcreteBaseSlabDensityKgM3: string;
  impactHeavyConcreteBaseSlabThicknessMm: string;
  impactHeavyConcreteLoadBasisKgM2: string;
  impactHeavyConcreteLowerAssemblyType: WorkbenchHeavyConcreteCombinedLowerAssemblyType;
  impactHeavyConcreteLowerBoardLayerCount: string;
  impactHeavyConcreteLowerBoardThicknessMm: string;
  impactHeavyConcreteLowerCavityDepthMm: string;
  impactHeavyConcreteLowerCavityFillThicknessMm: string;
  impactHeavyConcreteLowerSupportClass: WorkbenchHeavyConcreteCombinedLowerSupportClass;
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: string;
  impactHeavyConcreteResilientLayerThicknessMm: string;
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
  impactKSanityWarning: string | null;
  impactVolumeSanityWarning: string | null;
  isServerProjectBusy: boolean;
  isDesktop: boolean;
  lightweightSteelBaseRow: { id: string } | null;
  liveRowCount: number;
  modePresets: readonly PresetDefinition[];
  moveAirborneOpeningLeakElement: (id: string, direction: "down" | "up") => void;
  onContextModeChange: (mode: AirborneContextMode) => void;
  onLoadServerProject: () => void;
  onPresetChange: (presetId: PresetId) => void;
  onRefreshServerProjects: () => void;
  onSelectedServerProjectChange: (projectId: string) => void;
  onStartEmpty: () => void;
  onStudyModeChange: (mode: StudyMode) => void;
  onSyncServerProject: () => void;
  openingLeakCompositeInputSurfaceActive: boolean;
  panelHeightSanityWarning: string | null;
  panelWidthSanityWarning: string | null;
  parkedRowCount: number;
  readyOutputCount: number;
  rowCount: number;
  routeSignals: GuidedRouteSignals;
  rt60SanityWarning: string | null;
  selectedContextOption: { note: string };
  selectedPreset: PresetDefinition;
  selectedServerProjectId: string;
  serverProjectOptions: ReadonlyArray<{
    id: string;
    label: string;
  }>;
  serverProjectStatusLabel: string;
  removeAirborneOpeningLeakElement: (id: string) => void;
  setAirborneAirtightness: (value: AirtightnessClass) => void;
  setAirborneBuildingPredictionOutputBasis: (value: AirborneBuildingPredictionOutputBasis) => void;
  setAirborneConnectionType: (value: AirborneConnectionType) => void;
  setAirborneConservativeFlankingAssumption: (value: AirborneConservativeFlankingAssumption) => void;
  setAirborneElectricalBoxes: (value: ElectricalBoxState) => void;
  setAirborneFlankingJunctionClass: (value: AirborneFlankingJunctionClass) => void;
  setAirborneJunctionCouplingLengthM: (value: string) => void;
  setAirborneJunctionQuality: (value: JunctionQuality) => void;
  setAirborneOpeningLeakHostWallAreaM2: (value: string) => void;
  setAirbornePanelHeightMm: (value: string) => void;
  setAirbornePanelWidthMm: (value: string) => void;
  setAirbornePenetrationState: (value: PenetrationState) => void;
  setAirbornePerimeterSeal: (value: PerimeterSealClass) => void;
  setAirborneReceivingRoomRt60S: (value: string) => void;
  setAirborneReceivingRoomVolumeM3: (value: string) => void;
  setAirborneResilientBarSideCount: (value: AirborneResilientBarSideCount) => void;
  setAirborneSharedTrack: (value: SharedTrackClass) => void;
  setAirborneSourceRoomVolumeM3: (value: string) => void;
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
  setCalculatorId: (value: AirborneCalculatorId) => void;
  setImpactGuideKDb: (value: string) => void;
  setImpactGuideReceivingRoomVolumeM3: (value: string) => void;
  setImpactHeavyConcreteBaseSlabDensityKgM3: (value: string) => void;
  setImpactHeavyConcreteBaseSlabThicknessMm: (value: string) => void;
  setImpactHeavyConcreteLoadBasisKgM2: (value: string) => void;
  setImpactHeavyConcreteLowerAssemblyType: (value: WorkbenchHeavyConcreteCombinedLowerAssemblyType) => void;
  setImpactHeavyConcreteLowerBoardLayerCount: (value: string) => void;
  setImpactHeavyConcreteLowerBoardThicknessMm: (value: string) => void;
  setImpactHeavyConcreteLowerCavityDepthMm: (value: string) => void;
  setImpactHeavyConcreteLowerCavityFillThicknessMm: (value: string) => void;
  setImpactHeavyConcreteLowerSupportClass: (value: WorkbenchHeavyConcreteCombinedLowerSupportClass) => void;
  setImpactHeavyConcreteResilientLayerDynamicStiffnessMNm3: (value: string) => void;
  setImpactHeavyConcreteResilientLayerThicknessMm: (value: string) => void;
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
  showSteelBoundSupportFormActions: boolean;
  steelFloorFormulaInputSurfaceActive: boolean;
  heavyConcreteCombinedImpactInputSurfaceActive: boolean;
  timberCltDeltaLwInputSurfaceActive: boolean;
  showTimberImpactOnlyGuidedActions: boolean;
  standardizedAirborneActive: boolean;
  standardizedImpactOutputsActive: boolean;
  studyMode: StudyMode;
  topologyGap: GuidedTopologyGap | null;
  updateMaterial: (id: string, materialId: string) => void;
  updateAirborneOpeningLeakElement: (id: string, value: Partial<WorkbenchOpeningLeakElementDraft>) => void;
  validationSummary: GuidedValidationSummary;
  wallTopologyControlsActive: boolean;
  wallModifiersActive: boolean;
};

export function SimpleWorkbenchRoutePanel(props: SimpleWorkbenchRoutePanelProps) {
  const {
    activeWorkspacePanel,
    airborneAirtightness,
    airborneBuildingPredictionOutputBasis,
    airborneConnectionType,
    airborneConservativeFlankingAssumption,
    airborneContextMode,
    airborneElectricalBoxes,
    airborneFlankingJunctionClass,
    airborneJunctionCouplingLengthM,
    airborneJunctionQuality,
    airbornePanelHeightMm,
    airbornePanelWidthMm,
    airbornePenetrationState,
    airbornePerimeterSeal,
    airborneReceivingRoomRt60S,
    airborneReceivingRoomVolumeM3,
    airborneResilientBarSideCount,
    airborneSharedTrack,
    airborneSourceRoomVolumeM3,
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
    airborneOpeningLeakElements,
    airborneOpeningLeakHostWallAreaM2,
    airborneWallSideALeafLayerIndices,
    airborneWallSideBLeafLayerIndices,
    airborneWallSupportTopology,
    airborneWallTopologyMode,
    airborneVolumeSanityWarning,
    addAirborneOpeningLeakElement,
    appendRows,
    automaticOutputsLength,
    calculatorId,
    contextNotes,
    dynamicCalcBranch,
    expertInputsActive,
    geometryActive,
    hasOptionalContextFields,
    impactFieldActive,
    impactGuideKDb,
    impactGuideReceivingRoomVolumeM3,
    impactHeavyConcreteBaseSlabDensityKgM3,
    impactHeavyConcreteBaseSlabThicknessMm,
    impactHeavyConcreteLoadBasisKgM2,
    impactHeavyConcreteLowerAssemblyType,
    impactHeavyConcreteLowerBoardLayerCount,
    impactHeavyConcreteLowerBoardThicknessMm,
    impactHeavyConcreteLowerCavityDepthMm,
    impactHeavyConcreteLowerCavityFillThicknessMm,
    impactHeavyConcreteLowerSupportClass,
    impactHeavyConcreteResilientLayerDynamicStiffnessMNm3,
    impactHeavyConcreteResilientLayerThicknessMm,
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
    impactKSanityWarning,
    impactVolumeSanityWarning,
    isServerProjectBusy,
    isDesktop,
    lightweightSteelBaseRow,
    liveRowCount,
    modePresets,
    moveAirborneOpeningLeakElement,
    onContextModeChange,
    onLoadServerProject,
    onPresetChange,
    onRefreshServerProjects,
    onSelectedServerProjectChange,
    onStartEmpty,
    onStudyModeChange,
    onSyncServerProject,
    openingLeakCompositeInputSurfaceActive,
    panelHeightSanityWarning,
    panelWidthSanityWarning,
    parkedRowCount,
    readyOutputCount,
    rowCount,
    routeSignals,
    rt60SanityWarning,
    selectedContextOption,
    selectedPreset,
    selectedServerProjectId,
    serverProjectOptions,
    serverProjectStatusLabel,
    removeAirborneOpeningLeakElement,
    setAirborneAirtightness,
    setAirborneBuildingPredictionOutputBasis,
    setAirborneConnectionType,
    setAirborneConservativeFlankingAssumption,
    setAirborneElectricalBoxes,
    setAirborneFlankingJunctionClass,
    setAirborneJunctionCouplingLengthM,
    setAirborneJunctionQuality,
    setAirborneOpeningLeakHostWallAreaM2,
    setAirbornePanelHeightMm,
    setAirbornePanelWidthMm,
    setAirbornePenetrationState,
    setAirbornePerimeterSeal,
    setAirborneReceivingRoomRt60S,
    setAirborneReceivingRoomVolumeM3,
    setAirborneResilientBarSideCount,
    setAirborneSharedTrack,
    setAirborneSourceRoomVolumeM3,
    setAirborneStudSpacingMm,
    setAirborneStudType,
    setAirborneWallCavity1AbsorptionClass,
    setAirborneWallCavity1DepthMm,
    setAirborneWallCavity1FillCoverage,
    setAirborneWallCavity1LayerIndices,
    setAirborneWallCavity2AbsorptionClass,
    setAirborneWallCavity2DepthMm,
    setAirborneWallCavity2FillCoverage,
    setAirborneWallCavity2LayerIndices,
    setAirborneWallInternalLeafCoupling,
    setAirborneWallInternalLeafLayerIndices,
    setAirborneWallSideALeafLayerIndices,
    setAirborneWallSideBLeafLayerIndices,
    setAirborneWallSupportTopology,
    setAirborneWallTopologyMode,
    setCalculatorId,
    setImpactGuideKDb,
    setImpactGuideReceivingRoomVolumeM3,
    setImpactHeavyConcreteBaseSlabDensityKgM3,
    setImpactHeavyConcreteBaseSlabThicknessMm,
    setImpactHeavyConcreteLoadBasisKgM2,
    setImpactHeavyConcreteLowerAssemblyType,
    setImpactHeavyConcreteLowerBoardLayerCount,
    setImpactHeavyConcreteLowerBoardThicknessMm,
    setImpactHeavyConcreteLowerCavityDepthMm,
    setImpactHeavyConcreteLowerCavityFillThicknessMm,
    setImpactHeavyConcreteLowerSupportClass,
    setImpactHeavyConcreteResilientLayerDynamicStiffnessMNm3,
    setImpactHeavyConcreteResilientLayerThicknessMm,
    setImpactSteelCarrierDepthMm,
    setImpactSteelCarrierSpacingMm,
    setImpactSteelLoadBasisKgM2,
    setImpactSteelLowerCeilingIsolationSupportForm,
    setImpactSteelResilientLayerDynamicStiffnessMNm3,
    setImpactSteelSupportForm,
    setImpactTimberCltBaseFloorDensityKgM3,
    setImpactTimberCltBaseFloorThicknessMm,
    setImpactTimberCltImpactSystemType,
    setImpactTimberCltLoadBasisKgM2,
    setImpactTimberCltLowerAssemblyType,
    setImpactTimberCltLowerBoardLayerCount,
    setImpactTimberCltLowerBoardThicknessMm,
    setImpactTimberCltLowerCavityDepthMm,
    setImpactTimberCltLowerCavityFillThicknessMm,
    setImpactTimberCltLowerSupportClass,
    setImpactTimberCltResilientLayerDynamicStiffnessMNm3,
    setImpactTimberCltResilientLayerThicknessMm,
    setImpactTimberCltStructuralSupportType,
    setImpactTimberCltUpperFillDensityKgM3,
    setImpactTimberCltUpperFillThicknessMm,
    setImpactTimberCltUpperTreatmentDensityKgM3,
    setImpactTimberCltUpperTreatmentThicknessMm,
    showSteelBoundSupportFormActions,
    steelFloorFormulaInputSurfaceActive,
    heavyConcreteCombinedImpactInputSurfaceActive,
    timberCltDeltaLwInputSurfaceActive,
    showTimberImpactOnlyGuidedActions,
    standardizedAirborneActive,
    standardizedImpactOutputsActive,
    studyMode,
    topologyGap,
    updateMaterial,
    updateAirborneOpeningLeakElement,
    validationSummary,
    wallTopologyControlsActive,
    wallModifiersActive
  } = props;
  const presetGroups = buildSimpleWorkbenchPresetGroups(modePresets);
  const selectedExampleValue = rowCount === 0 ? EMPTY_EXAMPLE_VALUE : selectedPreset.id;

  return (
    <div
      className={isDesktop
        ? "col-start-1 row-start-1 min-h-0 min-w-0 overflow-y-auto border-r border-[color:var(--line)] px-4 py-4"
        : `stage-enter-2 min-h-0 min-w-0 overflow-y-auto px-4 py-4 ${activeWorkspacePanel === "setup" ? "block" : "hidden"}`
      }
    >
      <div className="flex flex-col">
        <SectionLead title="Setup" tone="route" />

        <div className="mt-4 space-y-4">
          <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
            <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("route")}`}>Study</div>
            <div className="mt-3 grid gap-3">
              <label className="grid min-w-0 gap-1.5">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Mode</span>
                <select
                  aria-label="Study type"
                  className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.9rem] text-[color:var(--ink)]"
                  onChange={(event) => onStudyModeChange(event.target.value as StudyMode)}
                  value={studyMode}
                >
                  <option value="floor">Floor</option>
                  <option value="wall">Wall</option>
                </select>
              </label>

              <label className="grid min-w-0 gap-1.5">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Context</span>
                <select
                  aria-label="Project context"
                  className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.9rem] text-[color:var(--ink)]"
                  onChange={(event) => onContextModeChange(event.target.value as AirborneContextMode)}
                  value={airborneContextMode}
                >
                  {AIRBORNE_CONTEXT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid min-w-0 gap-1.5">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Example Stack</span>
                <select
                  aria-label="Load sample rows"
                  className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.9rem] text-[color:var(--ink)]"
                  onChange={(event) => {
                    const nextValue = event.target.value;

                    if (nextValue === EMPTY_EXAMPLE_VALUE) {
                      onStartEmpty();
                      return;
                    }

                    onPresetChange(nextValue as PresetId);
                  }}
                  value={selectedExampleValue}
                >
                  <option value={EMPTY_EXAMPLE_VALUE}>Start empty</option>
                  {presetGroups.map((group) => (
                    <optgroup key={group.id} label={group.label}>
                      {group.options.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <div className="grid min-w-0 gap-1.5">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">Server Project</span>
                <div className="grid min-w-0 gap-1.5">
                  <select
                    aria-label="Server project"
                    className="focus-ring touch-target h-10 min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2 text-[0.9rem] text-[color:var(--ink)]"
                    disabled={isServerProjectBusy}
                    onChange={(event) => onSelectedServerProjectChange(event.target.value)}
                    value={selectedServerProjectId}
                  >
                    <option value="">Browser-local</option>
                    {serverProjectOptions.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.label}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      aria-label="Refresh server projects"
                      className="focus-ring touch-target inline-flex h-10 min-w-0 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isServerProjectBusy}
                      onClick={onRefreshServerProjects}
                      title="Refresh server projects"
                      type="button"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Load server project"
                      className="focus-ring touch-target inline-flex h-10 min-w-0 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isServerProjectBusy || selectedServerProjectId.length === 0}
                      onClick={onLoadServerProject}
                      title="Load server project"
                      type="button"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Sync current project to server"
                      className="focus-ring touch-target inline-flex h-10 min-w-0 items-center justify-center rounded border border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isServerProjectBusy || rowCount === 0}
                      onClick={onSyncServerProject}
                      title="Sync current project to server"
                      type="button"
                    >
                      <CloudUpload className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <span className="min-h-4 break-words text-[0.72rem] leading-4 text-[color:var(--ink-faint)]">{serverProjectStatusLabel}</span>
              </div>
            </div>
          </section>

          <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
            <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("route")}`}>Route status</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <GuidedFactChip>{getEnvironmentLabel(airborneContextMode)}</GuidedFactChip>
              <GuidedFactChip>{selectedPreset.label}</GuidedFactChip>
              <GuidedFactChip>{`${readyOutputCount}/${automaticOutputsLength} ready`}</GuidedFactChip>
              <GuidedFactChip>{`${liveRowCount} live / ${parkedRowCount} parked`}</GuidedFactChip>
            </div>
            <details className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2">
              <summary className="cursor-pointer text-[0.78rem] font-semibold text-[color:var(--ink)]">
                Information
              </summary>
              <p className="mt-2 text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{selectedContextOption.note}</p>
              <div className="mt-3 grid gap-2">
              <GuidedRouteRow detail={routeSignals.primaryRead.detail} label="Primary output" tone="route" value={routeSignals.primaryRead.value} />
              <GuidedRouteRow detail={dynamicCalcBranch.detail} label="Solver lane" tone="route" value={dynamicCalcBranch.value} />
              <GuidedRouteRow detail={validationSummary.detail} label="Validation" tone="route" value={validationSummary.value} />
              <GuidedRouteRow detail={routeSignals.nextAction.detail} label="Next step" tone="route" value={routeSignals.nextAction.value} />
              {topologyGap ? <GuidedRouteRow detail={topologyGap.detail} label="Topology gap" tone="route" value={topologyGap.value} /> : null}
              </div>
            </details>
          </section>

          {geometryActive || impactFieldActive || openingLeakCompositeInputSurfaceActive || steelFloorFormulaInputSurfaceActive || timberCltDeltaLwInputSurfaceActive || heavyConcreteCombinedImpactInputSurfaceActive ? (
            <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Input map</div>
                <DetailTag>{getEnvironmentLabel(airborneContextMode)}</DetailTag>
              </div>

              <div className="mt-3 grid gap-3">
                <ContextBucket
                  description="Directly gates the live read."
                  hasContent={geometryActive || impactFieldActive || openingLeakCompositeInputSurfaceActive || steelFloorFormulaInputSurfaceActive || timberCltDeltaLwInputSurfaceActive || heavyConcreteCombinedImpactInputSurfaceActive}
                  title="Required now"
                  tone="required"
                >
                  {openingLeakCompositeInputSurfaceActive ? (
                    <ContextSubsection
                      note="These fields feed the opening/leak lab, field, and building corridors."
                      title="Opening/leak composite"
                    >
                      <div className="grid gap-3">
                        <FieldShell
                          label="Host wall area (m²)"
                          note="Gross separating wall area before opening subtraction."
                          relevance="required"
                          usage="Rw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setAirborneOpeningLeakHostWallAreaM2(event.target.value)}
                            placeholder="e.g. 12"
                            value={airborneOpeningLeakHostWallAreaM2}
                          />
                        </FieldShell>

                        <div className="grid gap-2">
                          {airborneOpeningLeakElements.map((opening, openingIndex) => (
                            <div
                              className="grid gap-3 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3"
                              key={`${opening.id}-${openingIndex}`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-[0.74rem] font-semibold text-[color:var(--ink-soft)]">
                                  Opening {openingIndex + 1}
                                </div>
                                <div className="inline-flex shrink-0 items-center gap-1">
                                  <button
                                    aria-label={`Move opening ${openingIndex + 1} up`}
                                    className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-45"
                                    disabled={openingIndex === 0}
                                    onClick={() => moveAirborneOpeningLeakElement(opening.id, "up")}
                                    title="Move up"
                                    type="button"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    aria-label={`Move opening ${openingIndex + 1} down`}
                                    className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-45"
                                    disabled={openingIndex === airborneOpeningLeakElements.length - 1}
                                    onClick={() => moveAirborneOpeningLeakElement(opening.id, "down")}
                                    title="Move down"
                                    type="button"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    aria-label={`Remove opening ${openingIndex + 1}`}
                                    className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-45"
                                    disabled={airborneOpeningLeakElements.length === 1}
                                    onClick={() => removeAirborneOpeningLeakElement(opening.id)}
                                    title="Remove opening"
                                    type="button"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2">
                                <FieldShell
                                  label="Opening id"
                                  note="Stable id used for duplicate and reorder guards."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <input
                                    className={getTextInputClassName(false)}
                                    onChange={(event) => updateAirborneOpeningLeakElement(opening.id, { id: event.target.value })}
                                    placeholder="e.g. door-1"
                                    value={opening.id}
                                  />
                                </FieldShell>

                                <FieldShell
                                  label="Area (m²)"
                                  note="Area of one repeated opening."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <input
                                    className={getTextInputClassName(false)}
                                    inputMode="decimal"
                                    onChange={(event) => updateAirborneOpeningLeakElement(opening.id, { areaM2: event.target.value })}
                                    placeholder="e.g. 1.8"
                                    value={opening.areaM2}
                                  />
                                </FieldShell>

                                <FieldShell
                                  label="Count"
                                  note="Positive integer repeat count."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <input
                                    className={getTextInputClassName(false)}
                                    inputMode="numeric"
                                    onChange={(event) => updateAirborneOpeningLeakElement(opening.id, { count: event.target.value })}
                                    placeholder="e.g. 1"
                                    value={opening.count}
                                  />
                                </FieldShell>

                                <FieldShell
                                  label="Element Rw (dB)"
                                  note="Opening element rating before leakage penalty."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <input
                                    className={getTextInputClassName(false)}
                                    inputMode="decimal"
                                    onChange={(event) => updateAirborneOpeningLeakElement(opening.id, { elementRwDb: event.target.value })}
                                    placeholder="e.g. 32"
                                    value={opening.elementRwDb}
                                  />
                                </FieldShell>

                                <FieldShell
                                  label="Rating basis"
                                  note="Rw-compatible basis is required for this corridor."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <select
                                    aria-label={`Opening ${openingIndex + 1} rating basis`}
                                    className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                    onChange={(event) =>
                                      updateAirborneOpeningLeakElement(opening.id, {
                                        ratingBasis: event.target.value as "" | AirborneOpeningRatingBasis
                                      })
                                    }
                                    value={opening.ratingBasis}
                                  >
                                    <option value="">Select rating basis</option>
                                    {OPENING_LEAK_RATING_BASIS_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </FieldShell>

                                <FieldShell
                                  label="Seal/leakage"
                                  note="Leakage class controls the opening penalty."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <select
                                    aria-label={`Opening ${openingIndex + 1} seal leakage class`}
                                    className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                    onChange={(event) =>
                                      updateAirborneOpeningLeakElement(opening.id, {
                                        sealLeakageClass: event.target.value as "" | AirborneOpeningSealLeakageClass
                                      })
                                    }
                                    value={opening.sealLeakageClass}
                                  >
                                    <option value="">Select seal/leakage</option>
                                    {OPENING_LEAK_SEAL_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </FieldShell>

                                <FieldShell
                                  label="Origin"
                                  note="Measured or catalogued opening values can promote; source-absent is parked."
                                  relevance="required"
                                  usage="Rw"
                                >
                                  <select
                                    aria-label={`Opening ${openingIndex + 1} origin`}
                                    className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                    onChange={(event) =>
                                      updateAirborneOpeningLeakElement(opening.id, {
                                        origin: event.target.value as "" | AirborneOpeningOrigin
                                      })
                                    }
                                    value={opening.origin}
                                  >
                                    <option value="">Select origin</option>
                                    {OPENING_LEAK_ORIGIN_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </FieldShell>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          className="focus-ring inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 text-[0.82rem] font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                          onClick={addAirborneOpeningLeakElement}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          Add opening
                        </button>
                      </div>
                    </ContextSubsection>
                  ) : null}

                  {steelFloorFormulaInputSurfaceActive ? (
                    <ContextSubsection
                      note="These fields feed the source-absent steel floor formula lane."
                      title="Steel floor formula"
                    >
                      <div className="grid gap-3">
                        <FieldShell
                          label="Steel support form"
                          note="Carrier family for the steel transfer path."
                          relevance="required"
                          usage="Ln,w; DeltaLw with upper package"
                        >
                          <select
                            aria-label="Steel support form"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) => setImpactSteelSupportForm(event.target.value as "" | ImpactPredictorSupportForm)}
                            value={impactSteelSupportForm}
                          >
                            <option value="">Select support form</option>
                            {STEEL_FLOOR_FORMULA_SUPPORT_FORM_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Steel carrier depth (mm)"
                          note="Overrides the base_structure layer depth when entered."
                          relevance="required"
                          usage="Ln,w; DeltaLw with upper package"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactSteelCarrierDepthMm(event.target.value)}
                            placeholder="e.g. 200"
                            value={impactSteelCarrierDepthMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Steel carrier spacing (mm)"
                          note="Centre-to-centre spacing for the steel carrier."
                          relevance="required"
                          usage="Ln,w; DeltaLw with upper package"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactSteelCarrierSpacingMm(event.target.value)}
                            placeholder="e.g. 600"
                            value={impactSteelCarrierSpacingMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper resilient dynamic stiffness (MN/m³)"
                          note="Upper impact layer stiffness."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactSteelResilientLayerDynamicStiffnessMNm3(event.target.value)}
                            placeholder="e.g. 35"
                            value={impactSteelResilientLayerDynamicStiffnessMNm3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Resilient-layer load basis (kg/m²)"
                          note="Surface mass carried by the resilient layer."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactSteelLoadBasisKgM2(event.target.value)}
                            placeholder="e.g. 64"
                            value={impactSteelLoadBasisKgM2}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower ceiling isolation"
                          note="Support class for the ceiling-side isolation package."
                          relevance="required"
                          usage="Ln,w"
                        >
                          <select
                            aria-label="Steel lower ceiling isolation"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactSteelLowerCeilingIsolationSupportForm(
                                event.target.value as WorkbenchSteelFloorFormulaLowerCeilingIsolationSupportForm
                              )
                            }
                            value={impactSteelLowerCeilingIsolationSupportForm}
                          >
                            <option value="">Select lower isolation</option>
                            {STEEL_FLOOR_FORMULA_LOWER_ISOLATION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>
                      </div>
                    </ContextSubsection>
                  ) : null}

                  {heavyConcreteCombinedImpactInputSurfaceActive ? (
                    <ContextSubsection
                      note="These fields feed the source-absent heavy-concrete combined upper/lower formula lane."
                      title="Heavy concrete combined formula"
                    >
                      <div className="grid gap-3">
                        <FieldShell
                          label="Base slab density (kg/m³)"
                          note="Concrete density for the reference slab mass."
                          relevance="required"
                          usage="Ln,w"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteBaseSlabDensityKgM3(event.target.value)}
                            placeholder="e.g. 2400"
                            value={impactHeavyConcreteBaseSlabDensityKgM3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Base slab thickness (mm)"
                          note="Overrides the base_structure layer thickness when entered."
                          relevance="required"
                          usage="Ln,w"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteBaseSlabThicknessMm(event.target.value)}
                            placeholder="e.g. 150"
                            value={impactHeavyConcreteBaseSlabThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Loaded upper mass basis (kg/m²)"
                          note="Loaded mass carried by the resilient layer."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteLoadBasisKgM2(event.target.value)}
                            placeholder="e.g. 100"
                            value={impactHeavyConcreteLoadBasisKgM2}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper resilient dynamic stiffness (MN/m³)"
                          note="Upper impact layer stiffness."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteResilientLayerDynamicStiffnessMNm3(event.target.value)}
                            placeholder="e.g. 30"
                            value={impactHeavyConcreteResilientLayerDynamicStiffnessMNm3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Resilient layer thickness (mm)"
                          note="Optional thickness for resonance trace and replay parity."
                          relevance="optional"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteResilientLayerThicknessMm(event.target.value)}
                            placeholder="e.g. 8"
                            value={impactHeavyConcreteResilientLayerThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower ceiling assembly"
                          note="Ceiling-side isolation type."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <select
                            aria-label="Heavy concrete lower ceiling assembly"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactHeavyConcreteLowerAssemblyType(
                                event.target.value as WorkbenchHeavyConcreteCombinedLowerAssemblyType
                              )
                            }
                            value={impactHeavyConcreteLowerAssemblyType}
                          >
                            <option value="">Select lower assembly</option>
                            {HEAVY_CONCRETE_COMBINED_LOWER_ASSEMBLY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Lower support class"
                          note="Support class used by the lower ceiling term."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <select
                            aria-label="Heavy concrete lower support class"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactHeavyConcreteLowerSupportClass(
                                event.target.value as WorkbenchHeavyConcreteCombinedLowerSupportClass
                              )
                            }
                            value={impactHeavyConcreteLowerSupportClass}
                          >
                            <option value="">Select lower support</option>
                            {HEAVY_CONCRETE_COMBINED_LOWER_SUPPORT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Lower cavity depth (mm)"
                          note="Soffit-to-board cavity depth."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteLowerCavityDepthMm(event.target.value)}
                            placeholder="e.g. 120"
                            value={impactHeavyConcreteLowerCavityDepthMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower cavity fill thickness (mm)"
                          note="Absorber thickness in the ceiling cavity."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteLowerCavityFillThicknessMm(event.target.value)}
                            placeholder="e.g. 80"
                            value={impactHeavyConcreteLowerCavityFillThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower board thickness (mm)"
                          note="Per-layer gypsum board thickness."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactHeavyConcreteLowerBoardThicknessMm(event.target.value)}
                            placeholder="e.g. 12.5"
                            value={impactHeavyConcreteLowerBoardThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower board layer count"
                          note="Number of lower gypsum board layers."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="numeric"
                            onChange={(event) => setImpactHeavyConcreteLowerBoardLayerCount(event.target.value)}
                            placeholder="e.g. 2"
                            value={impactHeavyConcreteLowerBoardLayerCount}
                          />
                        </FieldShell>
                      </div>
                    </ContextSubsection>
                  ) : null}

                  {timberCltDeltaLwInputSurfaceActive ? (
                    <ContextSubsection
                      note="These fields feed the source-absent timber/CLT DeltaLw formula lane."
                      title="Timber/CLT DeltaLw formula"
                    >
                      <div className="grid gap-3">
                        <FieldShell
                          label="Support family"
                          note="Structural family for the timber or CLT reference floor."
                          relevance="required"
                          usage="Ln,w and DeltaLw"
                        >
                          <select
                            aria-label="Timber CLT support family"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactTimberCltStructuralSupportType(
                                event.target.value as WorkbenchTimberCltDeltaLwStructuralSupportType
                              )
                            }
                            value={impactTimberCltStructuralSupportType}
                          >
                            <option value="">Infer from base layer</option>
                            {TIMBER_CLT_DELTA_LW_SUPPORT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Impact system"
                          note="Formula route for upper-only CLT or combined timber joist build-up."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <select
                            aria-label="Timber CLT impact system"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactTimberCltImpactSystemType(
                                event.target.value as WorkbenchTimberCltDeltaLwImpactSystemType
                              )
                            }
                            value={impactTimberCltImpactSystemType}
                          >
                            <option value="">Use family default</option>
                            {TIMBER_CLT_DELTA_LW_SYSTEM_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Resilient-layer load basis (kg/m²)"
                          note="Surface mass carried by the resilient layer."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltLoadBasisKgM2(event.target.value)}
                            placeholder="e.g. 72"
                            value={impactTimberCltLoadBasisKgM2}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper resilient dynamic stiffness (MN/m³)"
                          note="Upper resilient layer stiffness."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltResilientLayerDynamicStiffnessMNm3(event.target.value)}
                            placeholder="e.g. 30"
                            value={impactTimberCltResilientLayerDynamicStiffnessMNm3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Resilient thickness (mm)"
                          note="Precision field for the upper resilient layer."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltResilientLayerThicknessMm(event.target.value)}
                            placeholder="e.g. 30"
                            value={impactTimberCltResilientLayerThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper layer thickness (mm)"
                          note="Thickness of dry board, topping, or equivalent upper treatment."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltUpperTreatmentThicknessMm(event.target.value)}
                            placeholder="e.g. 25"
                            value={impactTimberCltUpperTreatmentThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper layer density (kg/m³)"
                          note="Density for the upper treatment mass."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltUpperTreatmentDensityKgM3(event.target.value)}
                            placeholder="e.g. 1150"
                            value={impactTimberCltUpperTreatmentDensityKgM3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper fill thickness (mm)"
                          note="Use for CLT dry fill; leave empty for timber joist packages without fill."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltUpperFillThicknessMm(event.target.value)}
                            placeholder="e.g. 70"
                            value={impactTimberCltUpperFillThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Upper fill density (kg/m³)"
                          note="Use with upper fill thickness when the CLT route includes dry fill."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltUpperFillDensityKgM3(event.target.value)}
                            placeholder="e.g. 500"
                            value={impactTimberCltUpperFillDensityKgM3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Base density (kg/m³)"
                          note="Precision field for CLT or timber reference floor mass."
                          relevance="required"
                          usage="Ln,w"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltBaseFloorDensityKgM3(event.target.value)}
                            placeholder="e.g. 470"
                            value={impactTimberCltBaseFloorDensityKgM3}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Base thickness override (mm)"
                          note="Leave empty to use the base_structure layer thickness."
                          relevance="required"
                          usage="Ln,w"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltBaseFloorThicknessMm(event.target.value)}
                            placeholder="e.g. 145"
                            value={impactTimberCltBaseFloorThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower assembly"
                          note="Explicitly choose none for upper-only CLT; timber joists need a lower package."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <select
                            aria-label="Timber CLT lower assembly"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactTimberCltLowerAssemblyType(
                                event.target.value as WorkbenchTimberCltDeltaLwLowerAssemblyType
                              )
                            }
                            value={impactTimberCltLowerAssemblyType}
                          >
                            <option value="">Select lower assembly</option>
                            {TIMBER_CLT_DELTA_LW_LOWER_ASSEMBLY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Lower support class"
                          note="Support class for the lower ceiling package."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <select
                            aria-label="Timber CLT lower support class"
                            className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                            onChange={(event) =>
                              setImpactTimberCltLowerSupportClass(
                                event.target.value as WorkbenchTimberCltDeltaLwLowerSupportClass
                              )
                            }
                            value={impactTimberCltLowerSupportClass}
                          >
                            <option value="">Select support class</option>
                            {TIMBER_CLT_DELTA_LW_LOWER_SUPPORT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldShell>

                        <FieldShell
                          label="Lower cavity depth (mm)"
                          note="Cavity depth for the lower ceiling package."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltLowerCavityDepthMm(event.target.value)}
                            placeholder="e.g. 27"
                            value={impactTimberCltLowerCavityDepthMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower fill thickness (mm)"
                          note="Cavity absorption thickness; zero is parked, use the actual fill thickness."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltLowerCavityFillThicknessMm(event.target.value)}
                            placeholder="e.g. 100"
                            value={impactTimberCltLowerCavityFillThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower board thickness (mm)"
                          note="Thickness of each lower board layer."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="decimal"
                            onChange={(event) => setImpactTimberCltLowerBoardThicknessMm(event.target.value)}
                            placeholder="e.g. 12.5"
                            value={impactTimberCltLowerBoardThicknessMm}
                          />
                        </FieldShell>

                        <FieldShell
                          label="Lower board layers"
                          note="Number of lower board layers."
                          relevance="required"
                          usage="DeltaLw"
                        >
                          <input
                            className={getTextInputClassName(false)}
                            inputMode="numeric"
                            onChange={(event) => setImpactTimberCltLowerBoardLayerCount(event.target.value)}
                            placeholder="e.g. 2"
                            value={impactTimberCltLowerBoardLayerCount}
                          />
                        </FieldShell>
                      </div>
                    </ContextSubsection>
                  ) : null}

                  {geometryActive ? (
                    <ContextSubsection
                      note={
                        standardizedAirborneActive
                          ? "Geometry, room volume, and RT60 are live for DnT."
                          : "Geometry is live for apparent airborne reads."
                      }
                      title="Airborne route"
                    >
                      <div className="grid gap-3">
                        <FieldShell
                          advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.panelWidthMm)}.`}
                          label="Partition width (mm)"
                          note="Clear width of the separating element."
                          relevance="required"
                          usage="Dn,w, Dn,A, DnT,w, DnT,A"
                          warning={panelWidthSanityWarning}
                        >
                          <input
                            aria-invalid={Boolean(panelWidthSanityWarning)}
                            className={getTextInputClassName(Boolean(panelWidthSanityWarning))}
                            inputMode="decimal"
                            onChange={(event) => setAirbornePanelWidthMm(event.target.value)}
                            placeholder="e.g. 3600"
                            value={airbornePanelWidthMm}
                          />
                        </FieldShell>

                        <FieldShell
                          advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.panelHeightMm)}.`}
                          label="Partition height (mm)"
                          note="Clear height of the separating element."
                          relevance="required"
                          usage="Dn,w, Dn,A, DnT,w, DnT,A"
                          warning={panelHeightSanityWarning}
                        >
                          <input
                            aria-invalid={Boolean(panelHeightSanityWarning)}
                            className={getTextInputClassName(Boolean(panelHeightSanityWarning))}
                            inputMode="decimal"
                            onChange={(event) => setAirbornePanelHeightMm(event.target.value)}
                            placeholder="e.g. 2800"
                            value={airbornePanelHeightMm}
                          />
                        </FieldShell>
                      </div>

                      {standardizedAirborneActive ? (
                        <>
                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                            label="Airborne room volume (m³)"
                            note="Receiving room volume for standardized DnT."
                            relevance="required"
                            usage="DnT,w and DnT,A"
                            warning={airborneVolumeSanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(airborneVolumeSanityWarning)}
                              className={getTextInputClassName(Boolean(airborneVolumeSanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirborneReceivingRoomVolumeM3(event.target.value)}
                              placeholder="e.g. 42"
                              value={airborneReceivingRoomVolumeM3}
                            />
                          </FieldShell>

                          <FieldShell
                            advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S)}.`}
                            label="RT60 (s)"
                            note="Receiving-room reverberation time required by the Gate I field-context adapter."
                            relevance="required"
                            usage="R'w, DnT,w and DnT,A"
                            warning={rt60SanityWarning}
                          >
                            <input
                              aria-invalid={Boolean(rt60SanityWarning)}
                              className={getTextInputClassName(Boolean(rt60SanityWarning))}
                              inputMode="decimal"
                              onChange={(event) => setAirborneReceivingRoomRt60S(event.target.value)}
                              placeholder="e.g. 0.6"
                              value={airborneReceivingRoomRt60S}
                            />
                          </FieldShell>
                        </>
                      ) : null}

                      {airborneContextMode === "building_prediction" ? (
                        <div className="grid gap-3">
                          <FieldShell
                            label="Source room volume (m³)"
                            note="Source-side room volume for the building prediction adapter."
                            relevance="required"
                            usage="R'w and DnT,w"
                          >
                            <input
                              className={getTextInputClassName(false)}
                              inputMode="decimal"
                              onChange={(event) => setAirborneSourceRoomVolumeM3(event.target.value)}
                              placeholder="e.g. 38"
                              value={airborneSourceRoomVolumeM3}
                            />
                          </FieldShell>

                          <FieldShell
                            label="Flanking/junction class"
                            note="Owned junction boundary for the building prediction path."
                            relevance="required"
                            usage="R'w and DnT,w"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) =>
                                setAirborneFlankingJunctionClass(event.target.value as AirborneFlankingJunctionClass)
                              }
                              value={airborneFlankingJunctionClass}
                            >
                              {FLANKING_JUNCTION_CLASS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Conservative flanking assumption"
                            note="Explicit conservative flanking owner required before building outputs promote."
                            relevance="required"
                            usage="R'w and DnT,w"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) =>
                                setAirborneConservativeFlankingAssumption(
                                  event.target.value as AirborneConservativeFlankingAssumption
                                )
                              }
                              value={airborneConservativeFlankingAssumption}
                            >
                              {CONSERVATIVE_FLANKING_ASSUMPTION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>

                          <FieldShell
                            label="Junction coupling length (m)"
                            note="Coupling length used by the building prediction adapter."
                            relevance="required"
                            usage="R'w and DnT,w"
                          >
                            <input
                              className={getTextInputClassName(false)}
                              inputMode="decimal"
                              onChange={(event) => setAirborneJunctionCouplingLengthM(event.target.value)}
                              placeholder="e.g. 4.8"
                              value={airborneJunctionCouplingLengthM}
                            />
                          </FieldShell>

                          <FieldShell
                            label="Building output basis"
                            note="Select which building metrics the physical context owns."
                            relevance="required"
                            usage="R'w and DnT,w"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) =>
                                setAirborneBuildingPredictionOutputBasis(
                                  event.target.value as AirborneBuildingPredictionOutputBasis
                                )
                              }
                              value={airborneBuildingPredictionOutputBasis}
                            >
                              {BUILDING_PREDICTION_OUTPUT_BASIS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>
                        </div>
                      ) : null}
                    </ContextSubsection>
                  ) : null}

                  {impactFieldActive ? (
                    <ContextSubsection
                      note={
                        standardizedImpactOutputsActive
                          ? "K and room volume are live for standardized impact reads."
                          : "K is the only live field carry-over input."
                      }
                      title="Impact route"
                    >
                      <FieldShell
                        advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.fieldKDb)}.`}
                        label="Impact K correction (dB)"
                        note="Direct field K carry-over."
                        relevance="required"
                        usage="L'n,w, L'nT,w and L'nT,50"
                        warning={impactKSanityWarning}
                      >
                        <input
                          aria-invalid={Boolean(impactKSanityWarning)}
                          className={getTextInputClassName(Boolean(impactKSanityWarning))}
                          inputMode="decimal"
                          onChange={(event) => setImpactGuideKDb(event.target.value)}
                          placeholder="e.g. 2"
                          value={impactGuideKDb}
                        />
                      </FieldShell>

                      {standardizedImpactOutputsActive ? (
                        <FieldShell
                          advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                          label="Impact room volume (m³)"
                          note="Receiving room volume for standardized impact reads."
                          relevance="required"
                          usage="L'nT,w and L'nT,50"
                          warning={impactVolumeSanityWarning}
                        >
                          <input
                            aria-invalid={Boolean(impactVolumeSanityWarning)}
                            className={getTextInputClassName(Boolean(impactVolumeSanityWarning))}
                            inputMode="decimal"
                            onChange={(event) => setImpactGuideReceivingRoomVolumeM3(event.target.value)}
                            placeholder="e.g. 42"
                            value={impactGuideReceivingRoomVolumeM3}
                          />
                        </FieldShell>
                      ) : null}
                    </ContextSubsection>
                  ) : null}
                </ContextBucket>

                <ContextBucket
                  description="Keep nearby for the next route upgrade."
                  hasContent={hasOptionalContextFields}
                  title="Optional now"
                  tone="optional"
                >
                  {geometryActive && !standardizedAirborneActive ? (
                    <ContextSubsection
                      note="Room volume can wait until this route upgrades to DnT."
                      title="Airborne route"
                    >
                      <FieldShell
                        advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                        label="Airborne room volume (m³)"
                        note="Keep the receiving room volume ready for DnT."
                        relevance="optional"
                        usage="DnT,w, DnT,A and floor-side L'nT,w when requested"
                        warning={airborneVolumeSanityWarning}
                      >
                        <input
                          aria-invalid={Boolean(airborneVolumeSanityWarning)}
                          className={getTextInputClassName(Boolean(airborneVolumeSanityWarning))}
                          inputMode="decimal"
                          onChange={(event) => setAirborneReceivingRoomVolumeM3(event.target.value)}
                          placeholder="e.g. 42"
                          value={airborneReceivingRoomVolumeM3}
                        />
                      </FieldShell>
                    </ContextSubsection>
                  ) : null}

                  {impactFieldActive && !standardizedImpactOutputsActive ? (
                    <ContextSubsection
                      note="Room volume can wait until this route upgrades to L'nT."
                      title="Impact route"
                    >
                      <FieldShell
                        advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomVolumeM3)}.`}
                        label="Impact room volume (m³)"
                        note="Keep the receiving room volume ready for standardized impact reads."
                        relevance="optional"
                        usage="L'nT,w and L'nT,50"
                        warning={impactVolumeSanityWarning}
                      >
                        <input
                          aria-invalid={Boolean(impactVolumeSanityWarning)}
                          className={getTextInputClassName(Boolean(impactVolumeSanityWarning))}
                          inputMode="decimal"
                          onChange={(event) => setImpactGuideReceivingRoomVolumeM3(event.target.value)}
                          placeholder="e.g. 42"
                          value={impactGuideReceivingRoomVolumeM3}
                        />
                      </FieldShell>
                    </ContextSubsection>
                  ) : null}
                </ContextBucket>
              </div>
            </section>
          ) : (
            <div className={`rounded border px-3 py-3 text-[0.8rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionCardClass("route")}`}>
              {contextNotes[0] ?? "No additional route inputs are needed for this context."}
            </div>
          )}

          <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("route")}`}>
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Tools</div>
                <DetailTag>{selectedPreset.label}</DetailTag>
              </div>
            </summary>

            <div className="mt-3 grid gap-4">
              <p className="text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{selectedPreset.summary}</p>

              {showTimberImpactOnlyGuidedActions ? (
                <div className="grid gap-2">
                  {TIMBER_IMPACT_ONLY_GUIDED_ACTIONS.map((action) => (
                    <button
                      className="focus-ring flex min-w-0 flex-col items-start gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3 text-left hover:bg-[color:var(--panel)]"
                      key={action.id}
                      onClick={() => appendRows(action.rows)}
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                        <Plus className="h-4 w-4" />
                        {action.label}
                      </span>
                      <span className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{action.note}</span>
                    </button>
                  ))}
                </div>
              ) : null}

              {showSteelBoundSupportFormActions && lightweightSteelBaseRow ? (
                <div className="grid gap-2">
                  {STEEL_BOUND_SUPPORT_FORM_ACTIONS.map((action) => (
                    <button
                      className="focus-ring flex min-w-0 flex-col items-start gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3 text-left hover:bg-[color:var(--panel)]"
                      key={action.id}
                      onClick={() => updateMaterial(lightweightSteelBaseRow.id, action.materialId)}
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                        <Plus className="h-4 w-4" />
                        {action.label}
                      </span>
                      <span className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{action.note}</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <details className={`rounded border px-3 py-3 ${workbenchSectionMutedCardClass("route")}`}>
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[0.82rem] font-semibold text-[color:var(--ink)]">Advanced controls</div>
                    {expertInputsActive ? <DetailTag tone="optional">Active</DetailTag> : <DetailTag>Hidden</DetailTag>}
                  </div>
                </summary>

                <div className="mt-4 grid gap-5">
                  <div className="grid gap-3">
                    <FieldShell
                      label="Calculator"
                      note="This selector chooses the airborne solver family."
                      relevance="optional"
                      usage="Rw, R'w, STC, C, Ctr, Dn* outputs and any airborne companion on floor studies"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setCalculatorId(event.target.value as AirborneCalculatorId)}
                        value={calculatorId}
                      >
                        {CALCULATOR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                        </select>
                      </FieldShell>
                  </div>

                  {wallTopologyControlsActive ? (
                    <div className="grid gap-3">
                      <FieldShell
                        label="Wall topology mode"
                        note="Use explicit groups when flat order is ambiguous."
                        relevance="optional"
                        usage="Triple-leaf role ownership and route-card diagnostics"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneWallTopologyMode(event.target.value as WallTopologyMode)}
                          value={airborneWallTopologyMode}
                        >
                          {WALL_TOPOLOGY_MODE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      {airborneWallTopologyMode === "grouped_triple_leaf" ? (
                        <div className="grid gap-3">
                          <div className="grid gap-3">
                            <FieldShell
                              label="Side A leaf rows"
                              note="Visible row numbers, comma separated."
                              relevance="optional"
                              usage="Triple-leaf Side A group"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="numeric"
                                onChange={(event) => setAirborneWallSideALeafLayerIndices(event.target.value)}
                                placeholder="1, 2, 3"
                                value={airborneWallSideALeafLayerIndices}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Internal leaf rows"
                              note="Visible row numbers, comma separated."
                              relevance="optional"
                              usage="Triple-leaf internal leaf group"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="numeric"
                                onChange={(event) => setAirborneWallInternalLeafLayerIndices(event.target.value)}
                                placeholder="5"
                                value={airborneWallInternalLeafLayerIndices}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Side B leaf rows"
                              note="Visible row numbers, comma separated."
                              relevance="optional"
                              usage="Triple-leaf Side B group"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="numeric"
                                onChange={(event) => setAirborneWallSideBLeafLayerIndices(event.target.value)}
                                placeholder="7, 8, 9"
                                value={airborneWallSideBLeafLayerIndices}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Internal leaf coupling"
                              note="Declare bridge or coupling when known."
                              relevance="optional"
                              usage="Triple-leaf bridge guard"
                            >
                              <select
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                onChange={(event) =>
                                  setAirborneWallInternalLeafCoupling(event.target.value as WallInternalLeafCoupling)
                                }
                                value={airborneWallInternalLeafCoupling}
                              >
                                {WALL_INTERNAL_LEAF_COUPLING_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>
                          </div>

                          <div className="grid gap-3">
                            <FieldShell
                              label="Cavity 1 rows"
                              note="Visible row numbers for the Side A to internal-leaf cavity."
                              relevance="optional"
                              usage="Triple-leaf cavity 1 group"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="numeric"
                                onChange={(event) => setAirborneWallCavity1LayerIndices(event.target.value)}
                                placeholder="4"
                                value={airborneWallCavity1LayerIndices}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Cavity 1 depth (mm)"
                              note="Declared cavity depth."
                              relevance="optional"
                              usage="Triple-leaf cavity 1 spring"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="decimal"
                                onChange={(event) => setAirborneWallCavity1DepthMm(event.target.value)}
                                placeholder="50"
                                value={airborneWallCavity1DepthMm}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Cavity 1 fill"
                              note="Declared fill coverage."
                              relevance="optional"
                              usage="Triple-leaf cavity 1 damping"
                            >
                              <select
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                onChange={(event) =>
                                  setAirborneWallCavity1FillCoverage(event.target.value as WallCavityFillCoverage)
                                }
                                value={airborneWallCavity1FillCoverage}
                              >
                                {WALL_CAVITY_FILL_COVERAGE_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>

                            <FieldShell
                              label="Cavity 1 absorption"
                              note="Declared absorption class."
                              relevance="optional"
                              usage="Triple-leaf cavity 1 damping"
                            >
                              <select
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                onChange={(event) =>
                                  setAirborneWallCavity1AbsorptionClass(event.target.value as WallCavityAbsorptionClass)
                                }
                                value={airborneWallCavity1AbsorptionClass}
                              >
                                {WALL_CAVITY_ABSORPTION_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>
                          </div>

                          <div className="grid gap-3">
                            <FieldShell
                              label="Cavity 2 rows"
                              note="Visible row numbers for the internal-leaf to Side B cavity."
                              relevance="optional"
                              usage="Triple-leaf cavity 2 group"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="numeric"
                                onChange={(event) => setAirborneWallCavity2LayerIndices(event.target.value)}
                                placeholder="6"
                                value={airborneWallCavity2LayerIndices}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Cavity 2 depth (mm)"
                              note="Declared cavity depth."
                              relevance="optional"
                              usage="Triple-leaf cavity 2 spring"
                            >
                              <input
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                inputMode="decimal"
                                onChange={(event) => setAirborneWallCavity2DepthMm(event.target.value)}
                                placeholder="50"
                                value={airborneWallCavity2DepthMm}
                              />
                            </FieldShell>

                            <FieldShell
                              label="Cavity 2 fill"
                              note="Declared fill coverage."
                              relevance="optional"
                              usage="Triple-leaf cavity 2 damping"
                            >
                              <select
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                onChange={(event) =>
                                  setAirborneWallCavity2FillCoverage(event.target.value as WallCavityFillCoverage)
                                }
                                value={airborneWallCavity2FillCoverage}
                              >
                                {WALL_CAVITY_FILL_COVERAGE_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>

                            <FieldShell
                              label="Cavity 2 absorption"
                              note="Declared absorption class."
                              relevance="optional"
                              usage="Triple-leaf cavity 2 damping"
                            >
                              <select
                                className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                                onChange={(event) =>
                                  setAirborneWallCavity2AbsorptionClass(event.target.value as WallCavityAbsorptionClass)
                                }
                                value={airborneWallCavity2AbsorptionClass}
                              >
                                {WALL_CAVITY_ABSORPTION_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FieldShell>
                          </div>

                          <FieldShell
                            label="Support topology"
                            note="Declare the support path when known."
                            relevance="optional"
                            usage="Triple-leaf support and route guards"
                          >
                            <select
                              className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                              onChange={(event) => setAirborneWallSupportTopology(event.target.value as WallSupportTopology)}
                              value={airborneWallSupportTopology}
                            >
                              {WALL_SUPPORT_TOPOLOGY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </FieldShell>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {wallModifiersActive ? (
                    <div className="grid gap-3">
                      <FieldShell
                        label="Connection path"
                        note="Choose a known connection only if it is clear."
                        relevance="optional"
                        usage="Wall-family detection and airborne overlays"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneConnectionType(event.target.value as AirborneConnectionType)}
                          value={airborneConnectionType}
                        >
                          {CONNECTION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Stud family"
                        note="Set this only when the framing type is known."
                        relevance="optional"
                        usage="Framed-wall family matching and resilient framing penalties"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneStudType(event.target.value as AirborneStudType)}
                          value={airborneStudType}
                        >
                          {STUD_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Stud spacing (mm)"
                        note="Leave blank if spacing is unknown."
                        relevance="optional"
                        usage="Framed wall family matching when stud spacing is part of the evidence"
                      >
                        <input
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          inputMode="decimal"
                          onChange={(event) => setAirborneStudSpacingMm(event.target.value)}
                          value={airborneStudSpacingMm}
                        />
                      </FieldShell>

                      <FieldShell
                        label="Resilient bars"
                        note="Use the tested assembly side count when known."
                        relevance="optional"
                        usage="Framed-wall matching when resilient bars are part of the source evidence"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) =>
                            setAirborneResilientBarSideCount(event.target.value as AirborneResilientBarSideCount)
                          }
                          value={airborneResilientBarSideCount}
                        >
                          {RESILIENT_BAR_SIDE_COUNT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Airtightness"
                        note="One of the main leakage penalty drivers."
                        relevance="optional"
                        usage="Field/building airborne overlays"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneAirtightness(event.target.value as AirtightnessClass)}
                          value={airborneAirtightness}
                        >
                          {AIRTIGHTNESS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Perimeter seal"
                        note="Expected seal quality around the element."
                        relevance="optional"
                        usage="Leakage overlay on the airborne field/building route"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirbornePerimeterSeal(event.target.value as PerimeterSealClass)}
                          value={airbornePerimeterSeal}
                        >
                          {SEAL_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Penetrations"
                        note="Reflects service cut-through and opening intensity."
                        relevance="optional"
                        usage="Airborne leakage penalty on field/building reads"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirbornePenetrationState(event.target.value as PenetrationState)}
                          value={airbornePenetrationState}
                        >
                          {PENETRATION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Junction quality"
                        note="Use this when flanking quality differs from a clean build."
                        relevance="optional"
                        usage="Field flanking overlay and conservative airborne penalties"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneJunctionQuality(event.target.value as JunctionQuality)}
                          value={airborneJunctionQuality}
                        >
                          {JUNCTION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Electrical boxes"
                        note="Only set this when back boxes are a real concern."
                        relevance="optional"
                        usage="Wall field/building leakage penalties"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneElectricalBoxes(event.target.value as ElectricalBoxState)}
                          value={airborneElectricalBoxes}
                        >
                          {ELECTRICAL_BOX_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell
                        label="Shared support track"
                        note="Use this when adjacent leaves or supports are clearly shared."
                        relevance="optional"
                        usage="Conservative flanking posture on field/building overlays"
                      >
                        <select
                          className="focus-ring touch-target rounded border hairline bg-[color:var(--paper)] px-3 py-2.5"
                          onChange={(event) => setAirborneSharedTrack(event.target.value as SharedTrackClass)}
                          value={airborneSharedTrack}
                        >
                          {TRACK_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
