"use client";

import type { ImpactGuideDerivation, ImpactGuideSource } from "@dynecho/engine";
import type { ImpactBoundCalculation, ImpactCalculation } from "@dynecho/shared";
import { GitCompareArrows, NotebookPen, Orbit, Scale, Waves } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import { FieldGuide } from "./field-guide";
import { buildImpactGuideFieldGuides } from "./impact-field-guides";
import {
  formatConfidenceLevel,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";

type ImpactGuidePanelProps = {
  baseImpact: ImpactCalculation | null;
  baseLowerBoundImpact: ImpactBoundCalculation | null;
  ci50_2500Input: string;
  ciInput: string;
  guideResult: ImpactGuideDerivation | null;
  hdInput: string;
  kInput: string;
  massRatioInput: string;
  onEnableSmallRoomEstimateChange: (value: boolean) => void;
  onCi50_2500InputChange: (value: string) => void;
  onCiInputChange: (value: string) => void;
  onGuideSourceChange: (value: ImpactGuideSource) => void;
  onHdInputChange: (value: string) => void;
  onKInputChange: (value: string) => void;
  onMassRatioInputChange: (value: string) => void;
  onReceivingRoomVolumeM3Change: (value: string) => void;
  referenceImpactAvailable: boolean;
  receivingRoomVolumeM3: string;
  selectedSource: ImpactGuideSource;
  smallRoomEstimateEnabled: boolean;
};

const SOURCE_LABELS: Record<ImpactGuideSource, string> = {
  heavy_reference: "Heavy-reference Ln,w",
  live_stack: "Live stack / exact family Ln,w"
};

export function ImpactGuidePanel({
  baseImpact,
  baseLowerBoundImpact,
  ci50_2500Input,
  ciInput,
  guideResult,
  hdInput,
  kInput,
  massRatioInput,
  onEnableSmallRoomEstimateChange,
  onCi50_2500InputChange,
  onCiInputChange,
  onGuideSourceChange,
  onHdInputChange,
  onKInputChange,
  onMassRatioInputChange,
  onReceivingRoomVolumeM3Change,
  referenceImpactAvailable,
  receivingRoomVolumeM3,
  selectedSource,
  smallRoomEstimateEnabled
}: ImpactGuidePanelProps) {
  const baseLnW = typeof baseImpact?.LnW === "number" ? baseImpact.LnW : null;
  const baseLnWUpperBound = typeof baseLowerBoundImpact?.LnWUpperBound === "number" ? baseLowerBoundImpact.LnWUpperBound : null;
  const hasGuideBase = baseLnW !== null || baseLnWUpperBound !== null;
  const sourceOptions: ImpactGuideSource[] = referenceImpactAvailable
    ? ["live_stack", "heavy_reference"]
    : ["live_stack"];
  const fieldGuides = buildImpactGuideFieldGuides({
    baseImpact,
    baseLowerBoundImpact,
    ci50_2500Input,
    ciInput,
    guideResult,
    hdInput,
    kInput,
    massRatioInput,
    receivingRoomVolumeM3,
    selectedSource,
    smallRoomEstimateEnabled
  });

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Guide supplement</Pill>
        <Pill tone={guideResult ? "success" : "neutral"}>
          {guideResult ? "Derived outputs ready" : hasGuideBase ? "Awaiting guide inputs" : "Awaiting selected Ln,w source"}
        </Pill>
        {guideResult ? (
          <Pill tone={getConfidenceTone(guideResult.confidence.level)}>
            {formatConfidenceLevel(guideResult.confidence.level)}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Manual / exact carry-over</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">
          Guide and field supplement
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Exact source sheets often publish CI separately. This lane keeps those numbers usable in the same workspace
          by deriving Ln,w+CI, L&apos;n,w, explicit field-volume L&apos;nT,w / L&apos;nT,50, and the Turkish local-guide
          variants from an explicit selected Ln,w source. If the selected source already carries exact CI terms, those
          values auto-fill unless you overwrite them here. Curated exact floor-family matches also feed this lane as
          live-stack evidence, and the Turkish shortcut can now look up K from Table 2.7 and Hd from Table 2.8 when
          you supply the verified ratio / receiving-room inputs instead of explicit correction values.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[0.95fr_0.7fr_0.7fr_0.7fr] xl:grid-cols-[0.95fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr]">
        <FieldGuide
          guide={fieldGuides.guideBase}
          hint="Choose which existing Ln,w result should feed the carry-over lane."
          inputId="impact-guide-source"
          label="Guide base"
        >
          <select
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-source"
            onChange={(event) => onGuideSourceChange(event.target.value as ImpactGuideSource)}
            value={selectedSource}
          >
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.ci}
          hint="Leave blank to carry CI from the selected exact/live source when available."
          inputId="impact-guide-ci"
          label="CI (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-ci"
            inputMode="decimal"
            onChange={(event) => onCiInputChange(event.target.value)}
            placeholder={typeof baseImpact?.CI === "number" ? `auto ${formatDecimal(baseImpact.CI)}` : "e.g. -2"}
            value={ciInput}
          />
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.ci50_2500}
          hint="This term is only needed for standardized field-side L'nT,50."
          inputId="impact-guide-ci50_2500"
          label="CI,50-2500 (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-ci50_2500"
            inputMode="decimal"
            onChange={(event) => onCi50_2500InputChange(event.target.value)}
            placeholder={
              typeof baseImpact?.CI50_2500 === "number" ? `auto ${formatDecimal(baseImpact.CI50_2500)}` : "field-side"
            }
            value={ci50_2500Input}
          />
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.k}
          hint="K converts lab-side Ln,w into field-side L'n,w. Leave blank if you want Table 2.7 to supply it."
          inputId="impact-guide-k"
          label="K (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-k"
            inputMode="decimal"
            onChange={(event) => onKInputChange(event.target.value)}
            placeholder="optional"
            value={kInput}
          />
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.massRatio}
          hint="Optional Turkish Table 2.7 lookup input for a/(b+c+d+e)."
          inputId="impact-guide-mass-ratio"
          label="a/(b+c+d+e)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-mass-ratio"
            inputMode="decimal"
            onChange={(event) => onMassRatioInputChange(event.target.value)}
            placeholder="ratio for K lookup"
            value={massRatioInput}
          />
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.hd}
          hint="Hd is only used in the Turkish K/Hd shortcut path. Leave blank if you want Table 2.8 to supply it from V."
          inputId="impact-guide-hd"
          label="Hd (dB)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-hd"
            inputMode="decimal"
            onChange={(event) => onHdInputChange(event.target.value)}
            placeholder="optional"
            value={hdInput}
          />
        </FieldGuide>
        <FieldGuide
          guide={fieldGuides.volume}
          hint="Used by the standardized field-volume branch and, when Hd is blank, by the Turkish Table 2.8 lookup."
          inputId="impact-guide-receiving-room-volume"
          label="Receiving room V (m³)"
        >
          <input
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-guide-receiving-room-volume"
            inputMode="decimal"
            onChange={(event) => onReceivingRoomVolumeM3Change(event.target.value)}
            placeholder="standardized field"
            value={receivingRoomVolumeM3}
          />
        </FieldGuide>
      </div>

      <div className="mt-4">
        <FieldGuide
          guide={fieldGuides.smallRoom}
          hint="This is a fallback assumption. Standardized volume input overrides it."
          inputId="impact-guide-small-room"
          label="Enable TR small-room estimate"
        >
          <label
            className="flex items-center justify-between gap-4 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-3 text-sm leading-7 text-[color:var(--ink-soft)]"
            htmlFor="impact-guide-small-room"
          >
            <div>
              <div className="font-semibold text-[color:var(--ink)]">Enable TR small-room estimate</div>
              <div>
                L&apos;nT,w will be carried as Ln,w + 3 only when this explicit guide assumption is turned on. If V
                and K are present, the standardized field-volume path takes priority.
              </div>
            </div>
            <input
              checked={smallRoomEstimateEnabled}
              className="h-4 w-4 accent-[color:var(--accent)]"
              id="impact-guide-small-room"
              onChange={(event) => onEnableSmallRoomEstimateChange(event.target.checked)}
              type="checkbox"
            />
          </label>
        </FieldGuide>
      </div>

      {baseImpact && baseLnW !== null ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
          Selected base is <strong className="text-[color:var(--ink)]">{SOURCE_LABELS[selectedSource]}</strong> at{" "}
          <strong className="text-[color:var(--ink)]">{formatDecimal(baseLnW)} dB</strong>. Basis: {baseImpact.basis}.
        </div>
      ) : baseLowerBoundImpact && baseLnWUpperBound !== null ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
          Selected base is <strong className="text-[color:var(--ink)]">{SOURCE_LABELS[selectedSource]}</strong> at{" "}
          <strong className="text-[color:var(--ink)]">&lt;= {formatDecimal(baseLnWUpperBound)} dB</strong>. Basis: {baseLowerBoundImpact.basis}.
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          The selected guide base has no Ln,w yet. Use the live impact lane or the heavy-reference shortcut first.
        </div>
      )}

      {guideResult ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label={guideResult.baseKind === "upper_bound" ? "Base Ln,w upper bound" : "Base Ln,w"}
              value={
                guideResult.baseKind === "upper_bound"
                  ? `<= ${formatDecimal(guideResult.baseLnWUpperBound ?? 0)} dB`
                  : `${formatDecimal(guideResult.baseLnW ?? 0)} dB`
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  {SOURCE_LABELS[guideResult.source]}
                </span>
              }
            />
            <MetricCard
              label="CI"
              value={
                typeof guideResult.CI === "number"
                  ? `${guideResult.CI >= 0 ? "+" : ""}${formatDecimal(guideResult.CI)} dB`
                  : "Need CI"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <NotebookPen className="h-4 w-4" />
                  Manual or exact source carry-over
                </span>
              }
            />
            <MetricCard
              label="CI,50-2500"
              value={
                typeof guideResult.CI50_2500 === "number"
                  ? `${guideResult.CI50_2500 >= 0 ? "+" : ""}${formatDecimal(guideResult.CI50_2500)} dB`
                  : "Need explicit value"
              }
              detail="Field-side companion term for standardized impact reporting"
            />
            <MetricCard
              label="Ln,w+CI"
              value={
                typeof guideResult.LnWPlusCI === "number"
                  ? `${formatDecimal(guideResult.LnWPlusCI)} dB`
                  : "Need CI"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <GitCompareArrows className="h-4 w-4" />
                  Derived from selected Ln,w + CI
                </span>
              }
            />
            <MetricCard
              label="L'nT,50"
              value={
                typeof guideResult.LPrimeNT50 === "number"
                  ? `${formatDecimal(guideResult.LPrimeNT50)} dB`
                  : "Need V + CI,50-2500 or K + Hd"
              }
              detail={
                <span className="inline-flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Standardized field-volume or TR simple-guide supplement
                </span>
              }
            />
            <MetricCard
              label="L'n,w"
              value={
                typeof guideResult.LPrimeNW === "number"
                  ? `${formatDecimal(guideResult.LPrimeNW)} dB`
                  : typeof guideResult.LPrimeNWUpperBound === "number"
                    ? `<= ${formatDecimal(guideResult.LPrimeNWUpperBound)} dB`
                  : "Need K"
              }
              detail={
                guideResult.baseKind === "upper_bound"
                  ? "Field K-corrected upper bound from the selected conservative Ln,w lane"
                  : "Field K-corrected estimate from lab-side Ln,w"
              }
            />
            <MetricCard
              label="L'nT,w"
              value={
                typeof guideResult.LPrimeNTw === "number"
                  ? `${formatDecimal(guideResult.LPrimeNTw)} dB`
                  : typeof guideResult.LPrimeNTwUpperBound === "number"
                    ? `<= ${formatDecimal(guideResult.LPrimeNTwUpperBound)} dB`
                  : "Need V + K or small-room mode"
              }
              detail={
                guideResult.standardizedFieldEstimateActive
                  ? guideResult.baseKind === "upper_bound"
                    ? "Standardized field-volume upper bound"
                    : "Standardized field-volume estimate"
                  : guideResult.baseKind === "upper_bound"
                    ? "TR small-room guide upper bound"
                    : "TR small-room guide estimate"
              }
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(guideResult.confidence.score)} · ${formatConfidenceLevel(guideResult.confidence.level)}`}
              detail="Inherited from base Ln,w plus manual guide corrections"
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Trust note:</span> {guideResult.confidence.summary}
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {guideResult.notes.map((note) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                <div className="inline-flex items-center gap-2">
                  <Orbit className="h-4 w-4 text-[color:var(--ink-faint)]" />
                  <span>{note}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </SurfacePanel>
  );
}
