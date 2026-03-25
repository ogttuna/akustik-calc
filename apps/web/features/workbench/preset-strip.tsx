"use client";

import { startTransition } from "react";

import { WORKBENCH_PRESETS, type PresetId } from "./preset-definitions";

type PresetStripProps = {
  activePresetId: PresetId;
  onPreset: (presetId: PresetId) => void;
  onReset: () => void;
};

export function PresetStrip({ activePresetId, onPreset, onReset }: PresetStripProps) {
  return (
    <div className="rounded-lg border hairline bg-[color:var(--panel)] px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Preset lane</div>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">
            Use presets as calibrated entry points. On small screens this lane scrolls horizontally to keep the shell short.
          </p>
        </div>
        <button
          className="focus-ring touch-target shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] underline decoration-black/15 underline-offset-4"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="-mx-1 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {WORKBENCH_PRESETS.map((preset) => (
          <button
            aria-label={`Load preset ${preset.label}`}
            className={`focus-ring touch-target w-[17.5rem] shrink-0 snap-start rounded-md border px-4 py-3 text-left text-sm transition sm:w-auto ${
              activePresetId === preset.id
                ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                : "hairline bg-[color:var(--panel)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel-strong)]"
            }`}
            key={preset.id}
            onClick={() => {
              startTransition(() => onPreset(preset.id));
            }}
            type="button"
          >
            <span className="block font-semibold">{preset.label}</span>
            <span className="mt-1 block text-xs leading-6 opacity-80 sm:text-[0.82rem]">{preset.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
