"use client";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type {
  AssemblyCalculation,
  BoundFloorSystem,
  ExactFloorSystem,
  FloorSystemRecommendation
} from "@dynecho/shared";
import { Building2, ShieldCheck, Waypoints } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";
import { getFloorSystemCompanionPresentation } from "./floor-system-airborne-view";

type ExactFloorSystemPanelProps = {
  result: AssemblyCalculation | null;
};

type CuratedFloorSystem = ExactFloorSystem | BoundFloorSystem;

const SOURCE_TYPE_LABELS = {
  official_manufacturer_system_table: "Official tables",
  official_open_component_library: "Open libraries",
  open_measured_dataset: "Measured datasets"
} as const;

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

export function ExactFloorSystemPanel({ result }: ExactFloorSystemPanelProps) {
  const match = result?.floorSystemMatch ?? null;
  const estimate = result?.floorSystemEstimate ?? null;
  const boundMatch = result?.boundFloorSystemMatch ?? null;
  const boundEstimate = result?.boundFloorSystemEstimate ?? null;
  const matchCompanion = match ? getFloorSystemCompanionPresentation(match.system.airborneRatings, "exact") : null;
  const estimateCompanion = estimate ? getFloorSystemCompanionPresentation(estimate.airborneRatings, "estimate") : null;
  const boundMatchCompanion = boundMatch ? getFloorSystemCompanionPresentation(boundMatch.system.airborneRatings, "exact") : null;
  const boundEstimateCompanion = boundEstimate ? getFloorSystemCompanionPresentation(boundEstimate.airborneRatings, "estimate") : null;
  const recommendations: FloorSystemRecommendation[] = result?.floorSystemRecommendations ?? [];
  const recommendationById = new Map<string, FloorSystemRecommendation>(
    recommendations.map((recommendation: FloorSystemRecommendation) => [recommendation.system.id, recommendation])
  );
  const curatedLibrary: CuratedFloorSystem[] = [...EXACT_FLOOR_SYSTEMS, ...BOUND_FLOOR_SYSTEMS];
  const sourceCounts = Object.entries(
    curatedLibrary.reduce<Record<string, number>>((accumulator, system) => {
      accumulator[system.sourceType] = (accumulator[system.sourceType] ?? 0) + 1;
      return accumulator;
    }, {})
  );

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Exact family lane</Pill>
        <Pill tone={match ? "success" : boundMatch ? "neutral" : estimate || boundEstimate ? "accent" : "neutral"}>
          {match
            ? "Curated match active"
            : boundMatch
              ? "Bound family active"
              : estimate || boundEstimate
                ? "Family estimate active"
                : "Awaiting family match"}
        </Pill>
        {match ? (
          <Pill tone={getConfidenceTone(match.impact.confidence.level)}>
            {formatConfidenceLevel(match.impact.confidence.level)}
          </Pill>
        ) : boundMatch ? (
          <Pill tone={getConfidenceTone(boundMatch.lowerBoundImpact.confidence.level)}>
            {formatConfidenceLevel(boundMatch.lowerBoundImpact.confidence.level)}
          </Pill>
        ) : estimate ? (
          <Pill tone={getConfidenceTone(estimate.impact.confidence.level)}>
            {formatConfidenceLevel(estimate.impact.confidence.level)}
          </Pill>
        ) : boundEstimate ? (
          <Pill tone={getConfidenceTone(boundEstimate.lowerBoundImpact.confidence.level)}>
            {formatConfidenceLevel(boundEstimate.lowerBoundImpact.confidence.level)}
          </Pill>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Curated parity import</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Exact floor systems</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Official and measured floor families should live beside the screening stack, not be blurred into it. This
          lane surfaces exact family ratings when the current role-tagged build-up lands on a curated match and keeps
          bound-only lightweight-steel rows honest when the source publishes <code>Ln,w &lt;= ...</code> instead of a
          full metric.
        </p>
      </div>

      {match ? (
        <>
          <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Matched family
                </div>
                <div className="mt-2 font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  {match.system.label}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  {match.system.systemSummary.floorBuildUp}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="neutral">{match.system.sourceLabel}</Pill>
                <Pill tone="neutral">{match.system.trustTier.replaceAll("_", " ")}</Pill>
                <Pill tone="accent">Score {match.score}</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Ln,w"
              value={`${formatDecimal(match.impact.LnW ?? 0)} dB`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Waypoints className="h-4 w-4" />
                  Exact family impact lane
                </span>
              }
            />
            <MetricCard
              label="Rw"
              value={`${formatDecimal(match.system.airborneRatings.Rw)} dB`}
              detail={
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Published family airborne rating
                </span>
              }
            />
            <MetricCard
              label={matchCompanion?.label ?? "Rw + Ctr"}
              value={matchCompanion?.valueText ?? "N/A"}
              detail={
                matchCompanion ? (
                  <>
                    <span>{matchCompanion.detail}</span>
                    {matchCompanion.derivedRwPlusCtrText ? <span className="block">{matchCompanion.derivedRwPlusCtrText}</span> : null}
                  </>
                ) : undefined
              }
            />
            <MetricCard
              label="CI"
              value={typeof match.impact.CI === "number" ? formatSignedDb(match.impact.CI) : "N/A"}
              detail="Low-frequency companion term carried by the matched family"
            />
            <MetricCard
              label="CI,50-2500"
              value={typeof match.impact.CI50_2500 === "number" ? formatSignedDb(match.impact.CI50_2500) : "N/A"}
              detail="Extended field-side companion term when the source family publishes it"
            />
            <MetricCard
              label="Ln,w+CI"
              value={typeof match.impact.LnWPlusCI === "number" ? `${formatDecimal(match.impact.LnWPlusCI)} dB` : "N/A"}
              detail="Published combined impact term from the matched family"
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(match.impact.confidence.score)} · ${formatConfidenceLevel(match.impact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(match.impact.confidence.provenance)} provenance`}
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Carrier:</span> {match.system.systemSummary.carrier}
            <br />
            <span className="font-semibold text-[color:var(--ink)]">Ceiling:</span> {match.system.systemSummary.ceiling}
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {match.notes.concat(match.impact.notes).map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : boundMatch ? (
        <>
          <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Bound family
                </div>
                <div className="mt-2 font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  {boundMatch.system.label}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  {boundMatch.system.systemSummary.floorBuildUp}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="neutral">{boundMatch.system.sourceLabel}</Pill>
                <Pill tone="neutral">{boundMatch.system.trustTier.replaceAll("_", " ")}</Pill>
                <Pill tone="accent">Score {boundMatch.score}</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Ln,w upper bound"
              value={typeof boundMatch.lowerBoundImpact.LnWUpperBound === "number" ? `<= ${formatDecimal(boundMatch.lowerBoundImpact.LnWUpperBound)} dB` : "N/A"}
              detail="Published conservative impact support"
            />
            <MetricCard
              label="Rw"
              value={`${formatDecimal(boundMatch.system.airborneRatings.Rw)} dB`}
              detail="Published family airborne rating"
            />
            <MetricCard
              label={boundMatchCompanion?.label ?? "Rw + Ctr"}
              value={boundMatchCompanion?.valueText ?? "N/A"}
              detail={boundMatchCompanion?.detail}
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(boundMatch.lowerBoundImpact.confidence.score)} · ${formatConfidenceLevel(boundMatch.lowerBoundImpact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(boundMatch.lowerBoundImpact.confidence.provenance)} provenance`}
            />
          </div>

          <div className="mt-5 rounded-md border hairline bg-[color:var(--panel)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
            <span className="font-semibold text-[color:var(--ink)]">Carrier:</span> {boundMatch.system.systemSummary.carrier}
            <br />
            <span className="font-semibold text-[color:var(--ink)]">Ceiling:</span> {boundMatch.system.systemSummary.ceiling}
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {boundMatch.notes.concat(boundMatch.lowerBoundImpact.notes).map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : estimate ? (
        <>
          <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Estimated family
                </div>
                <div className="mt-2 font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  {estimate.structuralFamily}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  DynEcho blended nearby published rows in the same family because no strict exact row landed for the
                  current topology. This is a labeled family estimate, not an exact match.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="neutral">{estimate.kind.replaceAll("_", " ")}</Pill>
                <Pill tone="accent">Fit {formatDecimal(estimate.fitPercent)}%</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Ln,w"
              value={`${formatDecimal(estimate.impact.LnW ?? 0)} dB`}
              detail="Published-family estimate"
            />
            <MetricCard
              label="Rw"
              value={`${formatDecimal(estimate.airborneRatings.Rw)} dB`}
              detail="Weighted companion airborne estimate from the same family rows"
            />
            <MetricCard
              label={estimateCompanion?.label ?? "Rw + Ctr"}
              value={estimateCompanion?.valueText ?? "N/A"}
              detail={
                estimateCompanion ? (
                  <>
                    <span>{estimateCompanion.detail}</span>
                    {estimateCompanion.derivedRwPlusCtrText ? (
                      <span className="block">{estimateCompanion.derivedRwPlusCtrText}</span>
                    ) : null}
                  </>
                ) : undefined
              }
            />
            <MetricCard
              label="CI"
              value={typeof estimate.impact.CI === "number" ? formatSignedDb(estimate.impact.CI) : "N/A"}
              detail="Weighted companion term from supporting rows"
            />
            <MetricCard
              label="CI,50-2500"
              value={typeof estimate.impact.CI50_2500 === "number" ? formatSignedDb(estimate.impact.CI50_2500) : "N/A"}
              detail="Only surfaced when the source family rows publish it"
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(estimate.impact.confidence.score)} · ${formatConfidenceLevel(estimate.impact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(estimate.impact.confidence.provenance)} provenance`}
            />
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {estimate.notes.map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <div className="eyebrow">Blended published rows</div>
            {estimate.sourceSystems.map((system: ExactFloorSystem) => {
              const companion = getFloorSystemCompanionPresentation(system.airborneRatings, "library");

              return (
              <article className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-4" key={system.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[color:var(--ink)]">{system.label}</div>
                    <div className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                      {system.sourceLabel} · {system.trustTier.replaceAll("_", " ")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="neutral">{formatDecimal(system.impactRatings.LnW)} dB Ln,w</Pill>
                    <Pill tone="neutral">{formatDecimal(system.airborneRatings.Rw)} dB Rw</Pill>
                    <Pill tone="neutral">{companion.pillText}</Pill>
                  </div>
                </div>
              </article>
              );
            })}
          </div>

          {recommendations.length > 0 ? (
            <div className="mt-5 space-y-3">
              <div className="eyebrow">Closest curated families</div>
              {recommendations.map((recommendation: FloorSystemRecommendation) => (
                <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={recommendation.system.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[color:var(--ink)]">{recommendation.system.label}</div>
                      <div className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                        {recommendation.system.sourceLabel} · fit {recommendation.fitPercent}% · {recommendation.matchedSignalCount}/
                        {recommendation.totalSignalCount} signals
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="accent">{recommendation.system.impactRatings.LnW} dB Ln,w</Pill>
                      <Pill tone="neutral">{recommendation.system.airborneRatings.Rw} dB Rw</Pill>
                    </div>
                  </div>
                  <ul className="mt-3 grid gap-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                    {recommendation.missingSignals.map((signal: string) => (
                      <li className="rounded-md border hairline bg-[color:var(--paper)] px-3 py-3" key={signal}>
                        {signal}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : null}
        </>
      ) : boundEstimate ? (
        <>
          <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Bound estimate
                </div>
                <div className="mt-2 font-display text-[1.5rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  {boundEstimate.structuralFamily}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  No strict bound-only row landed, so DynEcho interpolated official lightweight-steel family rows and
                  kept impact as a conservative upper bound.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="neutral">{boundEstimate.kind.replaceAll("_", " ")}</Pill>
                <Pill tone="accent">Fit {formatDecimal(boundEstimate.fitPercent)}%</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Ln,w upper bound"
              value={typeof boundEstimate.lowerBoundImpact.LnWUpperBound === "number" ? `<= ${formatDecimal(boundEstimate.lowerBoundImpact.LnWUpperBound)} dB` : "N/A"}
              detail="Interpolated conservative family support"
            />
            <MetricCard
              label="Rw"
              value={`${formatDecimal(boundEstimate.airborneRatings.Rw)} dB`}
              detail="Interpolated published family airborne value"
            />
            <MetricCard
              label={boundEstimateCompanion?.label ?? "Rw + Ctr"}
              value={boundEstimateCompanion?.valueText ?? "N/A"}
              detail={boundEstimateCompanion?.detail}
            />
            <MetricCard
              label="Confidence"
              value={`${formatConfidenceScore(boundEstimate.lowerBoundImpact.confidence.score)} · ${formatConfidenceLevel(boundEstimate.lowerBoundImpact.confidence.level)}`}
              detail={`${formatConfidenceProvenance(boundEstimate.lowerBoundImpact.confidence.provenance)} provenance`}
            />
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {boundEstimate.notes.map((note: string) => (
              <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
            <div className="flex items-center gap-2 font-semibold text-[color:var(--ink)]">
              <ShieldCheck className="h-4 w-4" />
              No curated family landed yet
            </div>
            <p className="mt-3">
              Tag base, resilient, screed, fill, and ceiling roles explicitly. The current curated catalog covers a
              growing Knauf timber and concrete slice, a Dataholz timber-frame and CLT slice, hollow-core Pliteq rows,
              a peer-reviewed composite slice, measured TUAS CLT, open-box timber, dry-floor concrete, exact UBIQ
              open-web steel families, and bound-only UBIQ lightweight-steel rows.
            </p>
            <p className="mt-2">This lane stays exact-match only. It does not guess a family when the role topology is incomplete.</p>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-3">
              <div className="eyebrow">Closest curated families</div>
              {recommendations.map((recommendation: FloorSystemRecommendation) => (
                <article className="rounded-md border hairline bg-[color:var(--panel)] px-4 py-4" key={recommendation.system.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[color:var(--ink)]">{recommendation.system.label}</div>
                      <div className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                        {recommendation.system.sourceLabel} · fit {recommendation.fitPercent}% · {recommendation.matchedSignalCount}/
                        {recommendation.totalSignalCount} signals
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="accent">{recommendation.system.impactRatings.LnW} dB Ln,w</Pill>
                      <Pill tone="neutral">{recommendation.system.airborneRatings.Rw} dB Rw</Pill>
                    </div>
                  </div>
                  <ul className="mt-3 grid gap-2 text-sm leading-7 text-[color:var(--ink-soft)]">
                    {recommendation.missingSignals.map((signal: string) => (
                      <li className="rounded-md border hairline bg-[color:var(--paper)] px-3 py-3" key={signal}>
                        {signal}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="eyebrow">Curated family library</div>
          <Pill tone="neutral">{curatedLibrary.length} families ported</Pill>
          {sourceCounts.map(([sourceType, count]) => (
            <Pill key={sourceType} tone="neutral">
              {SOURCE_TYPE_LABELS[sourceType as keyof typeof SOURCE_TYPE_LABELS]} {count}
            </Pill>
          ))}
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          This is the exact-family slice that now lives locally in DynEcho. Active matches turn green, near misses stay
          highlighted, and the remaining families remain available as curated targets while parity import continues.
        </p>
        <div className="grid gap-3 xl:grid-cols-2">
          {curatedLibrary.map((system: CuratedFloorSystem) => {
            const recommendation = recommendationById.get(system.id);
            const isActive = match?.system.id === system.id || boundMatch?.system.id === system.id;
            const companion = getFloorSystemCompanionPresentation(system.airborneRatings, "library");
            const impactPillText =
              "impactRatings" in system
                ? `${formatDecimal(system.impactRatings.LnW)} dB Ln,w`
                : `<= ${formatDecimal(system.impactBounds.LnWUpperBound ?? 0)} dB Ln,w`;

            return (
              <article className="rounded-md border hairline bg-[color:var(--paper)] px-4 py-4" key={system.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[color:var(--ink)]">{system.label}</div>
                    <div className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                      {system.sourceLabel} · {system.trustTier.replaceAll("_", " ")}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={isActive ? "success" : recommendation ? "accent" : "neutral"}>
                      {isActive ? "Active" : recommendation ? `${recommendation.fitPercent}% fit` : "Library"}
                    </Pill>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="neutral">{impactPillText}</Pill>
                  <Pill tone="neutral">{formatDecimal(system.airborneRatings.Rw)} dB Rw</Pill>
                  <Pill tone="neutral">{companion.pillText}</Pill>
                </div>
                {recommendation ? (
                  <div className="mt-3 rounded-md border hairline bg-[color:var(--panel)] px-3 py-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                    Missing signals: {recommendation.missingSignals.join(" ")}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </SurfacePanel>
  );
}
