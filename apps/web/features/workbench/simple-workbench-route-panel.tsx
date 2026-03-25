"use client";

import type {
  AirborneCalculatorId,
  AirborneConnectionType,
  AirborneContextMode,
  AirborneStudType,
  AirtightnessClass,
  ElectricalBoxState,
  FloorRole,
  JunctionQuality,
  PenetrationState,
  PerimeterSealClass,
  SharedTrackClass
} from "@dynecho/shared";
import { Plus } from "lucide-react";

import type { GuidedRouteSignals } from "./guided-route-signals";
import type { GuidedTopologyGap } from "./guided-topology-gap";
import type { GuidedValidationSummary } from "./guided-validation-summary";
import type { DynamicCalcBranchSummary } from "./dynamic-calc-branch";
import type { PresetDefinition } from "./preset-definitions";
import { GUIDED_INPUT_SANITY_BANDS, formatGuidedSanityBand } from "./input-sanity";
import {
  AIRTIGHTNESS_OPTIONS,
  CALCULATOR_OPTIONS,
  CONNECTION_OPTIONS,
  ELECTRICAL_BOX_OPTIONS,
  JUNCTION_OPTIONS,
  PENETRATION_OPTIONS,
  SEAL_OPTIONS,
  STEEL_BOUND_SUPPORT_FORM_ACTIONS,
  STUD_TYPE_OPTIONS,
  TIMBER_IMPACT_ONLY_GUIDED_ACTIONS,
  TRACK_OPTIONS,
  type WorkspacePanelId
} from "./simple-workbench-constants";
import {
  workbenchSectionCardClass,
  workbenchSectionEyebrowClass,
  workbenchSectionMutedCardClass
} from "./simple-workbench-layer-visuals";
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

type SimpleWorkbenchRoutePanelProps = {
  activeWorkspacePanel: WorkspacePanelId;
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
  airborneVolumeSanityWarning: string | null;
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
  impactKSanityWarning: string | null;
  impactVolumeSanityWarning: string | null;
  isDesktop: boolean;
  lightweightSteelBaseRow: { id: string } | null;
  liveRowCount: number;
  panelHeightSanityWarning: string | null;
  panelWidthSanityWarning: string | null;
  parkedRowCount: number;
  readyOutputCount: number;
  routeSignals: GuidedRouteSignals;
  rt60SanityWarning: string | null;
  selectedContextOption: { note: string };
  selectedPreset: Pick<PresetDefinition, "label" | "summary">;
  setAirborneAirtightness: (value: AirtightnessClass) => void;
  setAirborneConnectionType: (value: AirborneConnectionType) => void;
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
  setCalculatorId: (value: AirborneCalculatorId) => void;
  setImpactGuideKDb: (value: string) => void;
  setImpactGuideReceivingRoomVolumeM3: (value: string) => void;
  showSteelBoundSupportFormActions: boolean;
  showTimberImpactOnlyGuidedActions: boolean;
  standardizedAirborneActive: boolean;
  standardizedImpactOutputsActive: boolean;
  topologyGap: GuidedTopologyGap | null;
  updateMaterial: (id: string, materialId: string) => void;
  validationSummary: GuidedValidationSummary;
  wallModifiersActive: boolean;
};

export function SimpleWorkbenchRoutePanel(props: SimpleWorkbenchRoutePanelProps) {
  const {
    activeWorkspacePanel,
    airborneAirtightness,
    airborneConnectionType,
    airborneContextMode,
    airborneElectricalBoxes,
    airborneJunctionQuality,
    airbornePanelHeightMm,
    airbornePanelWidthMm,
    airbornePenetrationState,
    airbornePerimeterSeal,
    airborneReceivingRoomRt60S,
    airborneReceivingRoomVolumeM3,
    airborneSharedTrack,
    airborneStudSpacingMm,
    airborneStudType,
    airborneVolumeSanityWarning,
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
    impactKSanityWarning,
    impactVolumeSanityWarning,
    isDesktop,
    lightweightSteelBaseRow,
    liveRowCount,
    panelHeightSanityWarning,
    panelWidthSanityWarning,
    parkedRowCount,
    readyOutputCount,
    routeSignals,
    rt60SanityWarning,
    selectedContextOption,
    selectedPreset,
    setAirborneAirtightness,
    setAirborneConnectionType,
    setAirborneElectricalBoxes,
    setAirborneJunctionQuality,
    setAirbornePanelHeightMm,
    setAirbornePanelWidthMm,
    setAirbornePenetrationState,
    setAirbornePerimeterSeal,
    setAirborneReceivingRoomRt60S,
    setAirborneReceivingRoomVolumeM3,
    setAirborneSharedTrack,
    setAirborneStudSpacingMm,
    setAirborneStudType,
    setCalculatorId,
    setImpactGuideKDb,
    setImpactGuideReceivingRoomVolumeM3,
    showSteelBoundSupportFormActions,
    showTimberImpactOnlyGuidedActions,
    standardizedAirborneActive,
    standardizedImpactOutputsActive,
    topologyGap,
    updateMaterial,
    validationSummary,
    wallModifiersActive
  } = props;

  return (
    <div
      className={isDesktop
        ? "col-start-1 row-start-1 min-w-0 border-r border-[color:var(--line)] px-4 py-4"
        : `stage-enter-2 min-w-0 overflow-hidden px-4 py-4 ${activeWorkspacePanel === "setup" ? "block" : "hidden"}`
      }
    >
      <div className="flex flex-col">
        <SectionLead title="Route" tone="route" />

        <div className="mt-4 space-y-4">
          <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
            <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("route")}`}>Route summary</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <GuidedFactChip>{getEnvironmentLabel(airborneContextMode)}</GuidedFactChip>
              <GuidedFactChip>{selectedPreset.label}</GuidedFactChip>
              <GuidedFactChip>{`${readyOutputCount}/${automaticOutputsLength} ready`}</GuidedFactChip>
              <GuidedFactChip>{`${liveRowCount} live / ${parkedRowCount} parked`}</GuidedFactChip>
            </div>
            <p className="mt-3 text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{selectedContextOption.note}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <GuidedRouteRow detail={routeSignals.primaryRead.detail} label="Primary output" tone="route" value={routeSignals.primaryRead.value} />
              <GuidedRouteRow detail={dynamicCalcBranch.detail} label="Solver lane" tone="route" value={dynamicCalcBranch.value} />
              <GuidedRouteRow detail={validationSummary.detail} label="Validation" tone="route" value={validationSummary.value} />
              <GuidedRouteRow detail={routeSignals.nextAction.detail} label="Next step" tone="route" value={routeSignals.nextAction.value} />
              {topologyGap ? <GuidedRouteRow detail={topologyGap.detail} label="Topology gap" tone="route" value={topologyGap.value} /> : null}
            </div>
          </section>

          {geometryActive || impactFieldActive ? (
            <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("route")}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Input map</div>
                <DetailTag>{getEnvironmentLabel(airborneContextMode)}</DetailTag>
              </div>

              <div className="mt-3 grid gap-3">
                <ContextBucket
                  description="Directly gates the live read."
                  hasContent={geometryActive || impactFieldActive}
                  title="Required now"
                  tone="required"
                >
                  {geometryActive ? (
                    <ContextSubsection
                      note={
                        standardizedAirborneActive
                          ? "Geometry and room volume are live for DnT."
                          : "Geometry is live for apparent airborne reads."
                      }
                      title="Airborne route"
                    >
                      <div className="grid grid-cols-2 gap-3">
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

                  {geometryActive && standardizedAirborneActive ? (
                    <ContextSubsection
                      note="RT60 only feeds absorption-aware sidecars."
                      title="Airborne route"
                    >
                      <FieldShell
                        advisory={`Guided sanity band ${formatGuidedSanityBand(GUIDED_INPUT_SANITY_BANDS.receivingRoomRt60S)}.`}
                        label="RT60 (s)"
                        note="Use only when absorption-aware sidecars matter."
                        relevance="optional"
                        usage="Absorption-aware field sidecars"
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
