"use client";

import type {
  AirborneConnectionType,
  AirborneContextMode,
  AirborneStudType,
  AirborneOverlay,
  AirtightnessClass,
  ElectricalBoxState,
  JunctionQuality,
  PerimeterSealClass,
  PenetrationState,
  SharedTrackClass
} from "@dynecho/shared";
import { ShieldAlert, ShieldCheck, Waves } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import type { StudyMode } from "./preset-definitions";
import { FieldUsageBoard } from "./field-usage-board";
import { FieldGuide } from "./field-guide";
import { buildAirborneFieldGuides } from "./airborne-field-guides";

const contextModeOptions: { label: string; value: AirborneContextMode }[] = [
  { label: "Element lab", value: "element_lab" },
  { label: "Field between rooms", value: "field_between_rooms" },
  { label: "Building prediction", value: "building_prediction" }
];

const airtightnessOptions: { label: string; value: AirtightnessClass }[] = [
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Poor", value: "poor" }
];

const perimeterOptions: { label: string; value: PerimeterSealClass }[] = [
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Poor", value: "poor" }
];

const penetrationOptions: { label: string; value: PenetrationState }[] = [
  { label: "None", value: "none" },
  { label: "Minor", value: "minor" },
  { label: "Major", value: "major" }
];

const junctionOptions: { label: string; value: JunctionQuality }[] = [
  { label: "Good", value: "good" },
  { label: "Average", value: "average" },
  { label: "Poor", value: "poor" }
];

const sharedTrackOptions: { label: string; value: SharedTrackClass }[] = [
  { label: "Independent", value: "independent" },
  { label: "Shared", value: "shared" },
  { label: "Unknown", value: "unknown" }
];

const electricalBoxOptions: { label: string; value: ElectricalBoxState }[] = [
  { label: "None", value: "none" },
  { label: "Separated", value: "separated" },
  { label: "Back to back", value: "back_to_back" },
  { label: "Many", value: "many" }
];

const connectionTypeOptions: { label: string; value: AirborneConnectionType }[] = [
  { label: "Auto", value: "auto" },
  { label: "None", value: "none" },
  { label: "Line connection", value: "line_connection" },
  { label: "Point connection", value: "point_connection" },
  { label: "Mixed connection", value: "mixed_connection" },
  { label: "Direct fix", value: "direct_fix" },
  { label: "Resilient channel", value: "resilient_channel" }
];

const studTypeOptions: { label: string; value: AirborneStudType }[] = [
  { label: "Auto", value: "auto" },
  { label: "Light steel stud", value: "light_steel_stud" },
  { label: "Resilient stud", value: "resilient_stud" },
  { label: "Wood stud", value: "wood_stud" }
];

type SelectFieldProps<T extends string> = {
  id: string;
  onValueChange: (value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
};

function SelectField<T extends string>({ id, onValueChange, options, value }: SelectFieldProps<T>) {
  return (
    <select
      className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
      id={id}
      onChange={(event) => onValueChange(event.target.value as T)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type NumericFieldProps = {
  id: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function NumericField({ id, onValueChange, placeholder, value }: NumericFieldProps) {
  return (
    <input
      className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
      id={id}
      inputMode="decimal"
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

type AirborneContextPanelProps = {
  airtightness: AirtightnessClass;
  connectionType: AirborneConnectionType;
  contextMode: AirborneContextMode;
  electricalBoxes: ElectricalBoxState;
  junctionQuality: JunctionQuality;
  onAirtightnessChange: (value: AirtightnessClass) => void;
  onConnectionTypeChange: (value: AirborneConnectionType) => void;
  onContextModeChange: (value: AirborneContextMode) => void;
  onElectricalBoxesChange: (value: ElectricalBoxState) => void;
  onJunctionQualityChange: (value: JunctionQuality) => void;
  onPanelHeightMmChange: (value: string) => void;
  onPanelWidthMmChange: (value: string) => void;
  onPenetrationStateChange: (value: PenetrationState) => void;
  onPerimeterSealChange: (value: PerimeterSealClass) => void;
  onReceivingRoomRt60SChange: (value: string) => void;
  onReceivingRoomVolumeM3Change: (value: string) => void;
  onSharedTrackChange: (value: SharedTrackClass) => void;
  onStudSpacingMmChange: (value: string) => void;
  onStudTypeChange: (value: AirborneStudType) => void;
  overlay: AirborneOverlay | null;
  panelHeightMm: string;
  panelWidthMm: string;
  penetrationState: PenetrationState;
  perimeterSeal: PerimeterSealClass;
  receivingRoomRt60S: string;
  receivingRoomVolumeM3: string;
  sharedTrack: SharedTrackClass;
  studSpacingMm: string;
  studType: AirborneStudType;
  studyMode: StudyMode;
};

export function AirborneContextPanel({
  airtightness,
  connectionType,
  contextMode,
  electricalBoxes,
  junctionQuality,
  onAirtightnessChange,
  onConnectionTypeChange,
  onContextModeChange,
  onElectricalBoxesChange,
  onJunctionQualityChange,
  onPanelHeightMmChange,
  onPanelWidthMmChange,
  onPenetrationStateChange,
  onPerimeterSealChange,
  onReceivingRoomRt60SChange,
  onReceivingRoomVolumeM3Change,
  onSharedTrackChange,
  onStudSpacingMmChange,
  onStudTypeChange,
  overlay,
  panelHeightMm,
  panelWidthMm,
  penetrationState,
  perimeterSeal,
  receivingRoomRt60S,
  receivingRoomVolumeM3,
  sharedTrack,
  studSpacingMm,
  studType,
  studyMode
}: AirborneContextPanelProps) {
  const guides = buildAirborneFieldGuides({
    airtightness,
    contextMode,
    electricalBoxes,
    junctionQuality,
    overlay,
    penetrationState,
    perimeterSeal,
    sharedTrack,
    studyMode
  });

  if (studyMode !== "wall") {
    return null;
  }

  const statusTone = overlay?.fieldFlankingPenaltyApplied || overlay?.leakagePenaltyApplied
    ? "warning"
    : "success";
  const usageItems = [
    { guide: guides.contextMode, id: "context_mode", label: "Context mode" },
    { guide: guides.airtightness, id: "airtightness", label: "Airtightness" },
    { guide: guides.perimeterSeal, id: "perimeter_seal", label: "Perimeter seal" },
    { guide: guides.penetrationState, id: "penetration_state", label: "Penetration state" },
    { guide: guides.junctionQuality, id: "junction_quality", label: "Junction quality" },
    { guide: guides.sharedTrack, id: "shared_track", label: "Shared track" },
    { guide: guides.electricalBoxes, id: "electrical_boxes", label: "Electrical boxes" }
  ] as const;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Airborne context</Pill>
        <Pill tone={statusTone}>
          {overlay?.fieldFlankingPenaltyApplied || overlay?.leakagePenaltyApplied ? "Overlay active" : "Lab-clean path"}
        </Pill>
      </div>

      <div className="mt-5">
        <div className="eyebrow">Wall-side airborne drift controls</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Leakage and field-flanking context</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          The screening Rw lane can stay lab-clean or move into a conservative field-side posture. These controls do not invent a new solver; they declare why the visible wall stack may underperform once workmanship, perimeter sealing, and indirect paths are considered.
        </p>
      </div>

      <div className="mt-5">
        <FieldUsageBoard
          description="Wall overlay inputs stay separate from the core TL curve. This map tells you which assumptions are actively pushing the current airborne result and which ones are only staged for a field-side posture."
          items={usageItems}
          title="Which wall-side context controls matter right now"
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <FieldGuide guide={guides.contextMode} hint="Switches the wall lane between lab-side screening and conservative field drift." inputId="airborne-context-mode" label="Context mode">
          <SelectField id="airborne-context-mode" onValueChange={onContextModeChange} options={contextModeOptions} value={contextMode} />
        </FieldGuide>
        <FieldGuide guide={guides.airtightness} hint="Primary leakage quality assumption for the wall lane." inputId="airborne-airtightness" label="Airtightness">
          <SelectField id="airborne-airtightness" onValueChange={onAirtightnessChange} options={airtightnessOptions} value={airtightness} />
        </FieldGuide>
        <FieldGuide guide={guides.perimeterSeal} hint="Controls perimeter execution quality and leakage severity." inputId="airborne-perimeter-seal" label="Perimeter seal">
          <SelectField id="airborne-perimeter-seal" onValueChange={onPerimeterSealChange} options={perimeterOptions} value={perimeterSeal} />
        </FieldGuide>
        <FieldGuide guide={guides.penetrationState} hint="Service penetrations and box openings on the wall line." inputId="airborne-penetration-state" label="Penetration state">
          <SelectField id="airborne-penetration-state" onValueChange={onPenetrationStateChange} options={penetrationOptions} value={penetrationState} />
        </FieldGuide>
        <FieldGuide guide={guides.junctionQuality} hint="Only used on field/building modes." inputId="airborne-junction-quality" label="Junction quality">
          <SelectField id="airborne-junction-quality" onValueChange={onJunctionQualityChange} options={junctionOptions} value={junctionQuality} />
        </FieldGuide>
        <FieldGuide guide={guides.sharedTrack} hint="Only relevant for stud/cavity surrogates in field/building mode." inputId="airborne-shared-track" label="Shared track">
          <SelectField id="airborne-shared-track" onValueChange={onSharedTrackChange} options={sharedTrackOptions} value={sharedTrack} />
        </FieldGuide>
      </div>

      <div className="mt-5">
        <FieldGuide guide={guides.electricalBoxes} hint="Optional weak-point assumption for box placement." inputId="airborne-electrical-boxes" label="Electrical boxes">
          <SelectField id="airborne-electrical-boxes" onValueChange={onElectricalBoxesChange} options={electricalBoxOptions} value={electricalBoxes} />
        </FieldGuide>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
        <div className="text-sm font-semibold text-[color:var(--ink)]">Framed wall metadata</div>
        <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
          Simple cavity stacks can drift badly when the engine cannot tell whether they are plain double-leaf, light-steel stud, resilient channel, or resilient-stud walls. These inputs activate the framed-wall calibration corridor.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-connection-type">
            <span className="block font-medium text-[color:var(--ink)]">Connection type</span>
            <SelectField id="airborne-connection-type" onValueChange={onConnectionTypeChange} options={connectionTypeOptions} value={connectionType} />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-stud-type">
            <span className="block font-medium text-[color:var(--ink)]">Stud type</span>
            <SelectField id="airborne-stud-type" onValueChange={onStudTypeChange} options={studTypeOptions} value={studType} />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-stud-spacing-mm">
            <span className="block font-medium text-[color:var(--ink)]">Stud spacing (mm)</span>
            <NumericField id="airborne-stud-spacing-mm" onValueChange={onStudSpacingMmChange} placeholder="e.g. 600" value={studSpacingMm} />
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
        <div className="text-sm font-semibold text-[color:var(--ink)]">Field conversion inputs</div>
        <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
          These values do not change the apparent wall curve itself. They unlock `DnT,w / DnT,A` and `Dn,w / Dn,A` from the final apparent airborne curve when field or building mode is active.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-panel-width-mm">
            <span className="block font-medium text-[color:var(--ink)]">Panel width (mm)</span>
            <NumericField id="airborne-panel-width-mm" onValueChange={onPanelWidthMmChange} placeholder="e.g. 3000" value={panelWidthMm} />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-panel-height-mm">
            <span className="block font-medium text-[color:var(--ink)]">Panel height (mm)</span>
            <NumericField id="airborne-panel-height-mm" onValueChange={onPanelHeightMmChange} placeholder="e.g. 2800" value={panelHeightMm} />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-room-volume-m3">
            <span className="block font-medium text-[color:var(--ink)]">Receiving room volume (m3)</span>
            <NumericField id="airborne-room-volume-m3" onValueChange={onReceivingRoomVolumeM3Change} placeholder="e.g. 42" value={receivingRoomVolumeM3} />
          </label>
          <label className="space-y-2 text-sm text-[color:var(--ink-soft)]" htmlFor="airborne-room-rt60-s">
            <span className="block font-medium text-[color:var(--ink)]">Receiving room RT60 (s)</span>
            <NumericField id="airborne-room-rt60-s" onValueChange={onReceivingRoomRt60SChange} placeholder="e.g. 0.55" value={receivingRoomRt60S} />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Waves className="h-4 w-4" />
            Current lane intent
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>Keep `Element lab` for clean catalog or screening comparisons.</p>
            <p>Move to `Field between rooms` when the same wall needs conservative room-to-room posture without pretending it is a validated apparent-rating solver.</p>
          </div>
        </article>

        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            {overlay?.fieldFlankingPenaltyApplied || overlay?.leakagePenaltyApplied ? (
              <ShieldAlert className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Overlay posture
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>
              Leakage penalty: {overlay?.leakagePenaltyApplied ? `${overlay.leakagePenaltyDb} dB active` : "not active"}
            </p>
            <p>
              Field-flanking penalty: {overlay?.fieldFlankingPenaltyApplied ? `${overlay.fieldFlankingPenaltyDb} dB active` : "not active"}
            </p>
          </div>
        </article>
      </div>
    </SurfacePanel>
  );
}
