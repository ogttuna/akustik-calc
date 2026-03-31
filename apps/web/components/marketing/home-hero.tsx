import Link from "next/link";
import { ArrowRight, Boxes, MonitorCog, ShieldCheck } from "lucide-react";

import { Pill, SectionHeading, SurfacePanel } from "@dynecho/ui";

export function HomeHero() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
      <SurfacePanel className="grain-mask stage-enter-2 overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap gap-3">
          <Pill tone="neutral">Web-first</Pill>
          <Pill tone="neutral">Desktop-ready</Pill>
          <Pill tone="warning">No upstream coupling</Pill>
        </div>
        <div className="mt-8 max-w-4xl space-y-8">
          <SectionHeading
            eyebrow="Acoustic Product Track"
            title="A premium operator shell for acoustics, with the engine kept clean underneath."
            description="The product layer is being rebuilt around strong boundaries: portable calculations, typed catalogs, and a workbench UI designed for decision-making instead of DOM sprawl."
          />
          <div className="grid gap-4 text-sm leading-7 text-[color:var(--ink-soft)] md:grid-cols-3">
            <div className="section-rule surface-subtle rounded-[1.4rem] border hairline px-4 py-4">
              <div className="eyebrow">01</div>
              <div className="mt-4 font-medium text-[color:var(--ink)]">Portable engine first</div>
              <p className="mt-2">No React, no DOM, no persistence concerns inside the calculation boundary.</p>
            </div>
            <div className="section-rule surface-subtle rounded-[1.4rem] border hairline px-4 py-4">
              <div className="eyebrow">02</div>
              <div className="mt-4 font-medium text-[color:var(--ink)]">Useful workbench second</div>
              <p className="mt-2">The UI is being organized around compose, inspect, and trust, not around whatever the legacy controller happened to expose.</p>
            </div>
            <div className="section-rule surface-subtle rounded-[1.4rem] border hairline px-4 py-4">
              <div className="eyebrow">03</div>
              <div className="mt-4 font-medium text-[color:var(--ink)]">Upstream discipline always</div>
              <p className="mt-2">`Acoustic2` stays read-only while Ln,w work continues there. This repo ports intentionally.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="focus-ring ink-button-solid touch-target inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:translate-y-[-1px]"
              href="/workbench"
            >
              Open workbench
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="focus-ring surface-subtle-hover touch-target inline-flex items-center rounded-full border hairline px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition"
              href="/#phase-plan"
            >
              View rollout
            </Link>
          </div>
        </div>
      </SurfacePanel>
      <SurfacePanel className="stage-enter-3 flex flex-col justify-between gap-8 px-6 py-8">
        <div className="space-y-4">
          <div className="eyebrow">Current build stance</div>
          <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
            We are intentionally not importing `Acoustic2` behavior yet. The current calculator path is a transparent
            screening workflow that proves package boundaries, runtime flow, and UI direction without falsifying formula
            parity.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="pointer-card rounded-[1.5rem] border hairline bg-[color:var(--accent-soft)] px-4 py-4">
            <div className="flex items-center gap-3">
              <Boxes className="h-5 w-5 text-[color:var(--accent-ink)]" />
              <div className="text-sm font-semibold text-[color:var(--accent-ink)]">Package edges are live</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--accent-ink)]/85">
              `shared`, `catalogs`, `engine`, `ui`, and `web` already talk through explicit boundaries.
            </p>
          </div>
          <div className="pointer-card rounded-[1.5rem] border hairline bg-[color:var(--teal-soft)] px-4 py-4">
            <div className="flex items-center gap-3">
              <MonitorCog className="h-5 w-5 text-[color:var(--ink)]" />
              <div className="text-sm font-semibold text-[color:var(--ink)]">The shell is usable</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              There is already a live workbench route, responsive layout behavior, and Docker-backed deployment flow.
            </p>
          </div>
          <div className="pointer-card surface-subtle rounded-[1.5rem] border hairline px-4 py-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[color:var(--success-ink)]" />
              <div className="text-sm font-semibold text-[color:var(--ink)]">Source discipline is visible</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              Every major surface reminds the team that upstream parity is deferred until an explicit import step.
            </p>
          </div>
        </div>
      </SurfacePanel>
    </section>
  );
}
