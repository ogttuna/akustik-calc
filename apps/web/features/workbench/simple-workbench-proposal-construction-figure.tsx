"use client";

import { Layers3 } from "lucide-react";

import {
  buildSimpleWorkbenchProposalConstructionSection,
  type SimpleWorkbenchProposalConstructionLayer
} from "./simple-workbench-proposal-construction-section";

type SimpleWorkbenchProposalConstructionFigureProps = {
  layers: readonly SimpleWorkbenchProposalConstructionLayer[];
  studyModeLabel: string;
};

function getBandToneClass(tone: "interior" | "leading" | "trailing"): string {
  switch (tone) {
    case "leading":
      return "bg-[color:color-mix(in_oklch,var(--accent)_14%,var(--paper))]";
    case "trailing":
      return "bg-[color:color-mix(in_oklch,var(--ink)_8%,var(--paper))]";
    case "interior":
    default:
      return "bg-[color:var(--paper)]/82";
  }
}

export function SimpleWorkbenchProposalConstructionFigure({
  layers,
  studyModeLabel
}: SimpleWorkbenchProposalConstructionFigureProps) {
  const section = buildSimpleWorkbenchProposalConstructionSection(layers, studyModeLabel);

  if (section.bands.length === 0) {
    return (
      <div className="rounded-md border border-dashed hairline bg-black/[0.02] px-4 py-6 text-sm leading-6 text-[color:var(--ink-soft)]">
        No visible rows are packaged on this proposal yet. Build a supported stack first so DynEcho can draw the construction section.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(15rem,0.66fr)_minmax(0,1fr)]">
      <div className="rounded-md border hairline bg-[color:color-mix(in_oklch,var(--accent)_7%,var(--paper))] px-4 py-4">
        <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
          <span>{section.anchorFromLabel}</span>
          <span>{section.headline}</span>
        </div>

        <div
          className={`mt-4 overflow-hidden rounded-md border hairline bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(255,255,255,0.12))] ${
            section.isWall ? "flex min-h-[10rem]" : "flex min-h-[20rem] flex-col"
          }`}
        >
          {section.bands.map((band) => (
            <div
              className={`grid min-w-0 gap-2 border-b border-r px-3 py-3 last:border-b-0 last:border-r-0 ${
                section.isWall ? "basis-0 content-between" : "items-center"
              } ${getBandToneClass(band.tone)}`}
              key={`${band.indexLabel}-${band.label}-${band.thicknessLabel}`}
              style={
                section.isWall
                  ? { flexBasis: 0, flexGrow: band.flexGrow }
                  : { flexBasis: 0, flexGrow: band.flexGrow }
              }
            >
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border hairline bg-[color:var(--paper)]/86 text-[0.68rem] font-semibold text-[color:var(--ink)]">
                {band.indexLabel}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{band.label}</div>
                <div className="mt-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{band.thicknessLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
          <span>{section.anchorToLabel}</span>
          <span>{section.totalThicknessLabel}</span>
        </div>
      </div>

      <div className="rounded-md border hairline bg-[color:var(--paper)]/78 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Layers3 className="h-4 w-4" />
            Technical schedule legend
          </div>
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            {section.totalThicknessLabel}
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {section.bands.map((band) => (
            <div
              className="grid gap-2 rounded border hairline bg-[color:var(--paper)] px-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              key={`legend-${band.indexLabel}-${band.label}-${band.thicknessLabel}`}
            >
              <div className="text-sm font-semibold text-[color:var(--ink)]">{band.indexLabel}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[color:var(--ink)]">{band.label}</div>
                <div className="text-xs leading-5 text-[color:var(--ink-soft)]">{band.metaLabel}</div>
              </div>
              <div className="text-sm text-[color:var(--ink-soft)]">{band.thicknessLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
