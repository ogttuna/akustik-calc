"use client";

import { OFFICIAL_IMPACT_PRODUCT_CATALOG } from "@dynecho/catalogs";
import type {
  AssemblyCalculation,
  ImpactProductCatalogEntry,
  ImpactProductCatalogMatchMode,
  ImpactProductCatalogSourceType
} from "@dynecho/shared";
import { ShieldX } from "lucide-react";

import { MetricCard, Pill, SurfacePanel } from "@dynecho/ui";

import { formatDecimal } from "@/lib/format";

import {
  formatConfidenceLevel,
  formatConfidenceProvenance,
  formatConfidenceScore,
  getConfidenceTone
} from "./impact-confidence-view";

type ImpactProductCatalogPanelProps = {
  result: AssemblyCalculation | null;
};

const SOURCE_TYPE_LABELS: Record<ImpactProductCatalogSourceType, string> = {
  official_manufacturer_catalog_pdf: "Official catalog PDF",
  official_manufacturer_technical_data_pdf: "Technical data PDF"
};

const MATCH_MODE_LABELS: Record<ImpactProductCatalogMatchMode, string> = {
  exact_system: "Exact system",
  lower_bound_support: "Lower-bound support",
  product_property_delta: "Catalog DeltaLw"
};

export function ImpactProductCatalogPanel({ result }: ImpactProductCatalogPanelProps) {
  const match = result?.impactCatalogMatch ?? null;
  const liveImpact = match?.impact ?? null;
  const lowerBoundImpact = match?.lowerBoundImpact ?? null;
  const primaryConfidence = liveImpact?.confidence ?? lowerBoundImpact?.confidence ?? null;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Official product lane</Pill>
        <Pill tone={match ? "success" : "neutral"}>{match ? "Product row active" : "Awaiting product row"}</Pill>
        {match ? (
          <>
            <Pill tone="neutral">{MATCH_MODE_LABELS[match.catalog.matchMode as ImpactProductCatalogMatchMode]}</Pill>
            {primaryConfidence ? (
              <Pill tone={getConfidenceTone(primaryConfidence.level)}>
                {formatConfidenceLevel(primaryConfidence.level)}
              </Pill>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="eyebrow">Official manufacturer evidence</div>
        <h2 className="mt-1 font-display text-[1.95rem] leading-none tracking-[-0.04em]">Product catalog matches</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Official manufacturer rows now sit in their own evidence class. This keeps exact product-system matches,
          lower-bound support rows, and catalog DeltaLw rows distinct from curated family import and from the narrow
          heavy-floor formula.
        </p>
      </div>

      {match ? (
        <>
          <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Active product row
                </div>
                <div className="mt-2 font-display text-[1.45rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
                  {match.catalog.label}
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                  {SOURCE_TYPE_LABELS[match.catalog.sourceType as ImpactProductCatalogSourceType]} · {match.catalog.referenceFloorType.replaceAll("_", " ")} reference ·{" "}
                  {match.catalog.impactSystemType.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="neutral">{match.catalog.trustTier.replaceAll("_", " ")}</Pill>
                <Pill tone="accent">Score {match.score}</Pill>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={lowerBoundImpact && !liveImpact ? "Ln,w upper bound" : "Ln,w"}
              value={
                typeof liveImpact?.LnW === "number"
                  ? `${formatDecimal(liveImpact.LnW)} dB`
                  : typeof lowerBoundImpact?.LnWUpperBound === "number"
                    ? `<= ${formatDecimal(lowerBoundImpact.LnWUpperBound)} dB`
                    : "N/A"
              }
              detail={
                match.catalog.matchMode === "exact_system"
                  ? "Official product-system row"
                  : match.catalog.matchMode === "product_property_delta"
                    ? "Heavy-reference derived from official DeltaLw"
                    : "Conservative official product-row support"
              }
            />
            <MetricCard
              label={lowerBoundImpact && !liveImpact ? "DeltaLw lower bound" : "DeltaLw"}
              value={
                typeof liveImpact?.DeltaLw === "number"
                  ? `${formatDecimal(liveImpact.DeltaLw)} dB`
                  : typeof lowerBoundImpact?.DeltaLwLowerBound === "number"
                    ? `>= ${formatDecimal(lowerBoundImpact.DeltaLwLowerBound)} dB`
                    : "N/A"
              }
              detail={
                match.catalog.matchMode === "lower_bound_support"
                  ? "Official minimum improvement support"
                  : "Official manufacturer improvement term"
              }
            />
            <MetricCard
              label="Confidence"
              value={
                primaryConfidence
                  ? `${formatConfidenceScore(primaryConfidence.score)} · ${formatConfidenceLevel(primaryConfidence.level)}`
                  : "N/A"
              }
              detail={primaryConfidence ? formatConfidenceProvenance(primaryConfidence.provenance) : "No confidence data"}
            />
            <MetricCard
              label="Basis"
              value={liveImpact?.basis ?? lowerBoundImpact?.basis ?? "N/A"}
              detail={
                match.catalog.matchMode === "exact_system"
                  ? "Topology-specific official row"
                  : match.catalog.matchMode === "product_property_delta"
                    ? "Reference-heavy product property lane"
                    : "Conservative official support lane"
              }
            />
          </div>

          {primaryConfidence ? (
            <div className="mt-5 rounded-[1.2rem] border hairline bg-black/[0.025] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              <span className="font-semibold text-[color:var(--ink)]">Trust note:</span> {primaryConfidence.summary}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {match.notes.concat(liveImpact?.notes ?? []).concat(lowerBoundImpact?.notes ?? []).map((note: string) => (
              <article className="rounded-[1.2rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={note}>
                {note}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.3rem] border border-dashed hairline px-4 py-6 text-sm leading-7 text-[color:var(--ink-soft)]">
          <div className="flex items-center gap-2 font-semibold text-[color:var(--ink)]">
            <ShieldX className="h-4 w-4" />
            No official product row matched the current stack
          </div>
          <p className="mt-3">
            Current local slice includes REGUPOL exact-system rows, REGUPOL lower-bound wet-screed support, and Getzner
            AFM DeltaLw rows. Use product-specific resilient layers if you want this lane to activate.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="eyebrow">Official product library</div>
          <Pill tone="neutral">{OFFICIAL_IMPACT_PRODUCT_CATALOG.length} product rows ported</Pill>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {OFFICIAL_IMPACT_PRODUCT_CATALOG.map((entry: ImpactProductCatalogEntry) => {
            const isActive = match?.catalog.id === entry.id;
            return (
              <article className="rounded-[1.2rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={entry.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[color:var(--ink)]">{entry.label}</div>
                    <div className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">
                      {SOURCE_TYPE_LABELS[entry.sourceType]} · {MATCH_MODE_LABELS[entry.matchMode]}
                    </div>
                  </div>
                  <Pill tone={isActive ? "success" : "neutral"}>{isActive ? "Active" : "Library"}</Pill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeof entry.impactRatings.LnW === "number" ? (
                    <Pill tone="neutral">{formatDecimal(entry.impactRatings.LnW)} dB Ln,w</Pill>
                  ) : null}
                  {typeof entry.impactRatings.DeltaLw === "number" ? (
                    <Pill tone="neutral">{formatDecimal(entry.impactRatings.DeltaLw)} dB DeltaLw</Pill>
                  ) : null}
                  {typeof entry.impactRatings.LnWUpperBound === "number" ? (
                    <Pill tone="neutral">{`<= ${formatDecimal(entry.impactRatings.LnWUpperBound)} dB Ln,w`}</Pill>
                  ) : null}
                  {typeof entry.impactRatings.DeltaLwLowerBound === "number" ? (
                    <Pill tone="neutral">{`>= ${formatDecimal(entry.impactRatings.DeltaLwLowerBound)} dB DeltaLw`}</Pill>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SurfacePanel>
  );
}
