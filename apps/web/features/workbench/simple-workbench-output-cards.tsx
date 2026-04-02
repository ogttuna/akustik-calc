"use client";

import type { RequestedOutputId } from "@dynecho/shared";

import type { GuidedValidationSummary } from "./guided-validation-summary";
import { formatUnlockOutputs } from "./guided-output-unlocks";
import type { StudyMode } from "./preset-definitions";
import { workbenchSectionCardClass } from "./simple-workbench-layer-visuals";
import type { OutputCardModel } from "./simple-workbench-output-model";
import {
  outputPostureTextClass,
  outputStatusClass,
  outputStatusTextClass,
  statusLabel
} from "./simple-workbench-output-model";
import { formatCountLabel } from "./simple-workbench-utils";
import { DetailTag, GuidedFactChip } from "./simple-workbench-primitives";

export function OutputCard(props: { card: OutputCardModel }) {
  const { card } = props;

  return (
    <article
      className={`min-w-0 rounded-md border px-4 py-4 ${outputStatusClass(card.status)}`}
      title={card.detail}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-2 text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[color:var(--ink)]">{card.value}</div>
        </div>
        <span className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
          {statusLabel(card.status)}
        </span>
      </div>
      <div className="mt-2 text-[0.72rem] font-medium text-[color:var(--ink-soft)]">{card.postureLabel}</div>
    </article>
  );
}

export function OutputCoverageSummary(props: {
  boundCount: number;
  liveCount: number;
  parkedCount: number;
  readyCount: number;
  totalCount: number;
  unsupportedCount: number;
}) {
  const { boundCount, liveCount, parkedCount, readyCount, totalCount, unsupportedCount } = props;

  return (
    <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("results")}`}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Coverage</div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-[color:var(--ink-faint)]">
          <span className="font-semibold text-[color:var(--ink-soft)]">{readyCount}/{totalCount} ready</span>
          {liveCount > 0 ? <span>{liveCount} live</span> : null}
          {boundCount > 0 ? <span>{boundCount} bound</span> : null}
          {parkedCount > 0 ? <span>{parkedCount} parked</span> : null}
          {unsupportedCount > 0 ? <span>{unsupportedCount} unsupported</span> : null}
        </div>
      </div>
    </section>
  );
}

export function OutputUnlockRail(props: {
  groups: readonly {
    detail: string;
    outputs: readonly RequestedOutputId[];
    title: string;
  }[];
}) {
  const { groups } = props;

  if (!groups.length) {
    return null;
  }

  return (
    <details className="rounded-md border hairline bg-[color:var(--paper)]/72 px-4 py-3">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[color:var(--ink)]">Unlock parked outputs</div>
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            {formatCountLabel(groups.length, "next step")}
          </div>
        </div>
      </summary>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {groups.map((group) => (
          <div className="flex items-start gap-3 px-1 py-2" key={`unlock-${group.title}`}>
            <div className="min-w-0 flex-1">
              <div className="text-[0.78rem] font-semibold text-[color:var(--ink)]">{group.title}</div>
              <p className="mt-0.5 text-[0.72rem] leading-4 text-[color:var(--ink-soft)]">{group.detail}</p>
            </div>
            <GuidedFactChip tone="warning">{formatUnlockOutputs(group.outputs)}</GuidedFactChip>
          </div>
        ))}
      </div>
    </details>
  );
}

export function pickPrimaryOutputCard(cards: readonly OutputCardModel[], studyMode: StudyMode): OutputCardModel | null {
  if (!cards.length) {
    return null;
  }

  const priority =
    studyMode === "floor"
      ? ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "DeltaLw", "Rw", "R'w", "DnT,w", "Dn,w"]
      : ["Rw", "R'w", "DnT,w", "Dn,w", "STC", "Ctr", "C"];

  for (const label of priority) {
    const match = cards.find((card) => card.label === label);
    if (match) {
      return match;
    }
  }

  return cards[0] ?? null;
}

export function PrimaryResultCard(props: {
  card: OutputCardModel;
  collapsedLiveRowCount: number;
  contextLabel: string;
  heroHeadline: string;
  liveRowCount: number;
  parkedRowCount: number;
  solverLayerCount: number;
  studyMode: StudyMode;
  validationSummary: GuidedValidationSummary;
}) {
  const { card, contextLabel, heroHeadline, liveRowCount, studyMode, validationSummary } = props;
  const liveStackValue = `${formatCountLabel(liveRowCount, "live row")} used`;

  return (
    <article className={`result-hero min-w-0 overflow-hidden rounded border border-l-4 border-l-[color:var(--accent)] px-4 py-4 ${outputStatusClass(card.status)}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
            {studyMode === "floor" ? "Primary floor read" : "Primary wall read"}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <GuidedFactChip>{card.label}</GuidedFactChip>
            <GuidedFactChip>{heroHeadline}</GuidedFactChip>
          </div>
        </div>
        <DetailTag>{contextLabel}</DetailTag>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 text-right">
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{card.label}</div>
          <div className="mt-1 text-[clamp(2.4rem,4vw,3.2rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[color:var(--ink)]">
            {card.value}
          </div>
          <div className={`mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${outputStatusTextClass(card.status)}`}>
            {statusLabel(card.status)}
          </div>
        </div>

        <div className="min-w-0 grid gap-2">
          <div className="flex flex-wrap gap-2">
            <GuidedFactChip>{card.postureLabel}</GuidedFactChip>
            <GuidedFactChip>{validationSummary.value}</GuidedFactChip>
            <GuidedFactChip>{liveStackValue}</GuidedFactChip>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PendingOutputRow(props: { card: OutputCardModel }) {
  const { card } = props;
  const postureTextClass = outputPostureTextClass(card.postureTone);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] px-1 py-2 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[0.78rem] font-semibold text-[color:var(--ink)]">{card.label}</div>
        <div className={`mt-0.5 text-[0.68rem] font-medium ${postureTextClass}`}>{card.postureLabel}</div>
      </div>
      <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${outputStatusTextClass(card.status)}`}>
        {statusLabel(card.status)}
      </span>
    </div>
  );
}

export function PendingOutputGroup(props: {
  cards: readonly OutputCardModel[];
  countLabel: string;
  detail: string;
  title: string;
}) {
  const { cards, countLabel, title } = props;

  if (!cards.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">{countLabel}</div>
      </div>
      <div className="mt-3 grid gap-3">
        {cards.map((card) => (
          <PendingOutputRow card={card} key={`pending-${title}-${card.label}`} />
        ))}
      </div>
    </div>
  );
}
