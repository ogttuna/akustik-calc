"use client";

import type { ExactImpactSourceLabOrField } from "@dynecho/shared";
import { AudioWaveform, FileDigit, ShieldCheck, ShieldX } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import type { ParsedImpactBandImport } from "./impact-band-import";
import { FieldGuide } from "./field-guide";
import { buildImpactBandFieldGuides } from "./impact-field-guides";

type ImpactBandSourcePanelProps = {
  input: string;
  labOrField: ExactImpactSourceLabOrField;
  onInputChange: (value: string) => void;
  onLabOrFieldChange: (value: ExactImpactSourceLabOrField) => void;
  parseError: string | null;
  parsedImport: ParsedImpactBandImport | null;
};

const LAB_OR_FIELD_LABELS: Record<ExactImpactSourceLabOrField, string> = {
  field: "Field exact",
  lab: "Lab exact"
};

export function ImpactBandSourcePanel({
  input,
  labOrField,
  onInputChange,
  onLabOrFieldChange,
  parseError,
  parsedImport
}: ImpactBandSourcePanelProps) {
  const hasSource = input.trim().length > 0;
  const fieldGuides = buildImpactBandFieldGuides({
    input,
    labOrField,
    parseError,
    parsedImport
  });

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Exact impact import</Pill>
        <Pill tone={parsedImport ? "success" : parseError ? "warning" : "neutral"}>
          {parsedImport ? "Exact source active" : parseError ? "Needs supported grid" : "Optional override"}
        </Pill>
        {parsedImport ? <Pill tone="success">{LAB_OR_FIELD_LABELS[labOrField]}</Pill> : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Measured or published bands</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Exact impact band source</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          A serious acoustic operator deck needs a way to carry measured or published impact-band data without forcing
          it through the airborne lane. When this source is valid, it overrides the scoped predictor for impact only.
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.75fr_1.25fr]">
        <FieldGuide
          guide={fieldGuides.sourcePosture}
          hint="This only matters once the pasted curve resolves on a supported nominal grid."
          inputId="impact-band-source-posture"
          label="Source posture"
        >
          <select
            className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
            id="impact-band-source-posture"
            onChange={(event) => onLabOrFieldChange(event.target.value as ExactImpactSourceLabOrField)}
            value={labOrField}
          >
            <option value="lab">Lab exact bands</option>
            <option value="field">Field exact bands</option>
          </select>
        </FieldGuide>

        <FieldGuide
          guide={fieldGuides.bandPaste}
          hint="Accepted nominal sets: octave 125..2000, one-third 100..3150, one-third 50..3150."
          inputId="impact-band-source-input"
          label="Band paste"
        >
          <textarea
            className="focus-ring min-h-40 rounded-lg border hairline bg-[color:var(--paper)] px-4 py-4 text-sm leading-7"
            id="impact-band-source-input"
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={"100 58\n125 57\n160 56\n...\n\nor just values:\n60 59 58 58 57 56 ..."}
            value={input}
          />
        </FieldGuide>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <FileDigit className="h-4 w-4" />
            Supported quick formats
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>`100 58` or `100, 58` rows for freq/value pairs.</p>
            <p>`60 59 58 ...` value-only paste with exactly 5, 16, or 19 levels.</p>
            <p>19-value one-third input unlocks `CI,50-2500` automatically.</p>
          </div>
        </article>

        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <AudioWaveform className="h-4 w-4" />
            Operator intent
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            <p>Use this lane when you already have test data and want honest direct rating, not a predictor.</p>
            <p>Airborne `Rw/STC/C/Ctr` remains on the screening engine. Only impact outputs are overridden.</p>
          </div>
        </article>
      </div>

      {parsedImport ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--success-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--success-ink)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Parsed exact source
          </div>
          <div className="mt-2">
            {parsedImport.detectedBandSetLabel} · {parsedImport.valueCount} levels · {parsedImport.summary}
          </div>
        </div>
      ) : hasSource && parseError ? (
        <div className="mt-5 rounded-lg border hairline bg-[color:var(--warning-soft)] px-4 py-4 text-sm leading-7 text-[color:var(--warning-ink)]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldX className="h-4 w-4" />
            Source not active
          </div>
          <div className="mt-2">{parseError}</div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          Paste an exact impact curve if you want `Ln,w / L&apos;nT,w`, `CI`, and `CI,50-2500` to come from measured data.
        </div>
      )}
    </SurfacePanel>
  );
}
