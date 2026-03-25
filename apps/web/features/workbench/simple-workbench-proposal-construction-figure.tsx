"use client";

import { Layers3 } from "lucide-react";

import {
  createIllustrationMaterial,
  distributeIllustrationSizes,
  formatIllustrationClampLabel,
  parseIllustrationThicknessMm
} from "./simple-workbench-illustration";
import { getLayerVisualSurface } from "./simple-workbench-layer-visuals";
import { SectionIllustration } from "./simple-workbench-section-illustration";
import {
  buildSimpleWorkbenchProposalConstructionSection,
  type SimpleWorkbenchProposalConstructionLayer
} from "./simple-workbench-proposal-construction-section";

type SimpleWorkbenchProposalConstructionFigureProps = {
  layers: readonly SimpleWorkbenchProposalConstructionLayer[];
  studyModeLabel: string;
};

export function SimpleWorkbenchProposalConstructionFigure({
  layers,
  studyModeLabel
}: SimpleWorkbenchProposalConstructionFigureProps) {
  const section = buildSimpleWorkbenchProposalConstructionSection(layers, studyModeLabel);

  if (section.bands.length === 0) {
    return (
      <div className="rounded-md border border-dashed hairline bg-[color:var(--panel)] px-4 py-6 text-sm leading-6 text-[color:var(--ink-soft)]">
        No visible rows are packaged on this proposal yet. Build a supported stack first so DynEcho can draw the construction section.
      </div>
    );
  }

  const axis = section.isWall ? "proposalWall" : "proposalFloor";
  const allocations = distributeIllustrationSizes(
    section.bands.map((entry) => parseIllustrationThicknessMm(entry.thicknessLabel)),
    axis
  );
  const bands = section.bands.map((band, index) => {
    const material = createIllustrationMaterial({
      categoryLabel: band.category,
      label: band.label,
      metaLabel: band.metaLabel
    });

    return {
      allocation: allocations[index]!,
      band,
      surface: getLayerVisualSurface(material)
    };
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1fr)]">
      <div className="rounded-xl border hairline bg-[color:color-mix(in_oklch,var(--accent)_6%,var(--paper))] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            <div>{section.anchorFromLabel}</div>
            <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">{section.headline}</div>
          </div>
          <div className="text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            <div>{section.totalThicknessLabel}</div>
            <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">{formatIllustrationClampLabel(axis)}</div>
          </div>
        </div>

        <div className="mt-4">
          <SectionIllustration
            axis={axis}
            compact
            layers={section.bands.map((band) => ({
              indexLabel: band.indexLabel,
              key: `${band.indexLabel}-${band.label}-${band.thicknessLabel}`,
              material: createIllustrationMaterial({
                categoryLabel: band.category,
                label: band.label,
                metaLabel: band.metaLabel
              }),
              ready: true,
              thicknessLabel: band.thicknessLabel,
              thicknessMm: parseIllustrationThicknessMm(band.thicknessLabel)
            }))}
            orientation={section.isWall ? "wall" : "floor"}
          />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
          <div>
            <div>{section.anchorToLabel}</div>
            <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Visual scale is presentation-only</div>
          </div>
          <div className="text-right">
            <div>{section.totalThicknessLabel}</div>
            <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Calculation values stay literal</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border hairline bg-[color:var(--paper)]/78 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Layers3 className="h-4 w-4" />
            Technical schedule legend
          </div>
          <div className="text-right text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            <div>{section.totalThicknessLabel}</div>
            <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">{formatIllustrationClampLabel(axis)}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {bands.map(({ allocation, band, surface }) => (
            <div
              className="grid gap-3 rounded-[0.9rem] border hairline bg-[color:var(--paper)] px-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              key={`legend-${band.indexLabel}-${band.label}-${band.thicknessLabel}`}
            >
              <div
                className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-[0.7rem] px-2 text-[0.68rem] font-bold shadow-[0_10px_18px_rgba(17,24,39,0.08)] ${surface.labelToneClass}`}
                style={surface.badgeStyle}
              >
                {band.indexLabel}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-10 rounded-full border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" style={surface.frontStyle} />
                  <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{band.label}</div>
                </div>
                <div className="mt-1 text-xs leading-5 text-[color:var(--ink-soft)]">
                  {band.metaLabel}
                  {allocation.clampedTo ? ` · ${allocation.clampedTo} clamp applied in preview` : ""}
                </div>
              </div>
              <div
                className={`justify-self-start rounded-[0.7rem] px-2 py-1 text-sm font-semibold tabular-nums shadow-[0_10px_18px_rgba(17,24,39,0.06)] sm:justify-self-end ${surface.labelToneClass}`}
                style={surface.dimensionStyle}
              >
                {band.thicknessLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
