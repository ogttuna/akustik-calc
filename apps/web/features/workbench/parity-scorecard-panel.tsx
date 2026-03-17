"use client";

import { Layers2, Radar, Ratio, Sigma } from "lucide-react";

import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import { Pill, SurfacePanel } from "@dynecho/ui";

import { GENERATED_UPSTREAM_SNAPSHOT } from "./generated-upstream-snapshot";

const SCORECARD_ROWS = [
  {
    detail: "Workbench shell, reporting, responsive operator rails, radar, criteria packs, field-risk UX, and curated family-library guidance are broadly in place.",
    label: "UI / workbench",
    score: 95
  },
  {
    detail: "Portable TS engine now covers airborne screening, exact impact-band rating, exact heavy-reference improvement curves, official product catalog rows and lower-bound support, curated exact floor-family slices across timber, concrete, hollow-core, CLT, open-box, composite, measured dry-floor, open-web steel rows, narrow FL-28 steel interpolation, closest-family recommendations, scoped heavy-floor impact, guide/manual carry-over, field-volume standardization, confidence notes, and fixture-backed real-world floor/field coverage corpora.",
    label: "Engine logic",
    score: 89
  },
  {
    detail: "Acoustic2 still contains broader exact floor-system and predictor-family coverage than this repo, but exact band, heavy-reference DeltaLw, official product rows and lower-bound support, curated Knauf/Dataholz/Pliteq/TUAS/UBIQ family slices, concrete exact rows, hollow-core rows, CLT exact rows, composite archetypes, open-box measured rows, open-web steel rows, FL-28 steel interpolation, dry-floor measured rows, bound-only steel support, and near-match guidance are now materially closer here.",
    label: "Full parity",
    score: 81
  }
] as const;

function getScoreTone(score: number): "accent" | "neutral" | "success" | "warning" {
  if (score >= 80) {
    return "success";
  }

  if (score >= 45) {
    return "accent";
  }

  if (score >= 25) {
    return "neutral";
  }

  return "warning";
}

export function ParityScorecardPanel() {
  const seedMaterialCount = MATERIAL_CATALOG_SEED.length;
  const calculatorCoverage = `${5} local lanes / ${GENERATED_UPSTREAM_SNAPSHOT.core.calculatorCount} upstream calculators`;
  const materialCoverage = `${seedMaterialCount} seed materials / ${GENERATED_UPSTREAM_SNAPSHOT.core.materialCount} upstream materials`;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Ratio className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Migration scorecard</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">How much is actually here</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            This board exists to prevent optimistic blur. It reads the current web workbench against the Acoustic2
            upstream footprint and keeps the migration claim explicit.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {SCORECARD_ROWS.map((row) => (
          <article className="rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={row.label}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">{row.label}</div>
              <Pill tone={getScoreTone(row.score)}>{row.score}%</Pill>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-[color:var(--accent)] transition-[width]"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{row.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Sigma className="h-4 w-4" />
            Upstream core
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {GENERATED_UPSTREAM_SNAPSHOT.core.exportCount} exports, {GENERATED_UPSTREAM_SNAPSHOT.core.calculatorCount} calculators,
            and {GENERATED_UPSTREAM_SNAPSHOT.focus.impactOrLnwTestCount} impact/Ln,w tests are currently tracked upstream.
          </p>
        </article>
        <article className="rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Radar className="h-4 w-4" />
            Current web scope
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {calculatorCoverage}. Dynamic airborne selection is live, comparison calculators are live, exact impact-band import is live, exact DeltaLw reference import is live, official product catalog rows and lower-bound support are live, curated timber, concrete, hollow-core, CLT, composite, measured open-box/dry-floor, open-web steel, and FL-28 steel interpolation families are landing, heavy-floor impact is scoped, field-side outputs are partly guide/manual, and the main floor families now sit under explicit fixture-backed coverage guards instead of presence-only checks.
          </p>
        </article>
        <article className="rounded-[1.2rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Layers2 className="h-4 w-4" />
            Catalog reach
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {materialCoverage}. This repo is still on a curated seed catalog, not full upstream parity.
          </p>
        </article>
      </div>
    </SurfacePanel>
  );
}
