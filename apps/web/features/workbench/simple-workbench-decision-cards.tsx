"use client";

import type { SimpleWorkbenchCorridorDossierCard } from "./simple-workbench-corridor-dossier";
import { SimpleWorkbenchProposalConstructionFigure } from "./simple-workbench-proposal-construction-figure";
import { workbenchSectionCardClass } from "./simple-workbench-layer-visuals";
import { GuidedFactChip, DetailTag } from "./simple-workbench-primitives";

export function GuidedDecisionBasisCard(props: SimpleWorkbenchCorridorDossierCard) {
  const { detail, label, tone, value } = props;
  const valueClass =
    tone === "success"
      ? "text-[color:var(--success-ink)]"
      : tone === "warning"
        ? "text-[color:var(--warning-ink)]"
        : "text-[color:var(--ink)]";
  const toneLabel =
    tone === "success" ? "Locked" : tone === "warning" ? "Caution" : tone === "accent" ? "Live" : "Explicit";

  return (
    <article className="grid gap-1 rounded-md bg-[color:var(--panel)] px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[color:var(--ink-faint)]">{label}</div>
        <DetailTag tone={tone === "warning" ? "required" : tone === "accent" ? "optional" : "neutral"}>{toneLabel}</DetailTag>
      </div>
      <div className={`text-sm font-semibold ${valueClass}`}>{value}</div>
      <p className="text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </article>
  );
}

export function GuidedDecisionBasisStrip(props: {
  cards: readonly SimpleWorkbenchCorridorDossierCard[];
  headline: string;
  selectedTraceNoteCount: number;
  traceGroupCount: number;
}) {
  const { cards, headline, selectedTraceNoteCount, traceGroupCount } = props;

  return (
    <section className={`mt-4 overflow-hidden rounded-lg border px-4 py-4 ${workbenchSectionCardClass("review")}`}>
      <div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Decision basis</div>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{headline}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <GuidedFactChip>{`${traceGroupCount} trace group${traceGroupCount === 1 ? "" : "s"}`}</GuidedFactChip>
          <GuidedFactChip>{`${selectedTraceNoteCount} note${selectedTraceNoteCount === 1 ? "" : "s"}`}</GuidedFactChip>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {cards.map((card) => (
          <GuidedDecisionBasisCard {...card} key={`decision-basis-${card.label}-${card.value}`} />
        ))}
      </div>
    </section>
  );
}

export function GuidedConstructionSnapshot(props: {
  layers: readonly {
    categoryLabel: string;
    index: number;
    label: string;
    roleLabel?: string;
    thicknessLabel: string;
  }[];
  studyModeLabel: string;
}) {
  const { layers, studyModeLabel } = props;

  return (
    <section className={`mt-4 overflow-hidden rounded-lg border px-4 py-4 ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
          Construction snapshot
        </div>
        <GuidedFactChip>{`${layers.length} row${layers.length === 1 ? "" : "s"}`}</GuidedFactChip>
      </div>

      <div className="mt-3">
        <SimpleWorkbenchProposalConstructionFigure layers={layers} studyModeLabel={studyModeLabel} />
      </div>
    </section>
  );
}
