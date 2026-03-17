import { SectionHeading, SurfacePanel } from "@dynecho/ui";

const PHASES = [
  {
    title: "Phase 0",
    body: "Monorepo scaffold, Docker runtime, design system seed, live shell."
  },
  {
    title: "Phase 1",
    body: "Portable engine extraction with commit-aware upstream port discipline."
  },
  {
    title: "Phase 2",
    body: "Typed catalog import path with provenance and trust metadata."
  },
  {
    title: "Phase 3",
    body: "Richer workbench flows, result narratives, and decision surfaces."
  },
  {
    title: "Phase 4",
    body: "Auth, saved projects, subscriptions, and the first real SaaS boundary."
  }
];

export function HomePhases() {
  return (
    <SurfacePanel className="stage-enter-3 px-6 py-7" id="phase-plan">
      <SectionHeading
        eyebrow="Delivery sequence"
        title="We ship the product shell in the same order we de-risk the migration."
      />
      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {PHASES.map((phase) => (
          <div className="pointer-card rounded-[1.45rem] border hairline bg-black/[0.025] p-4 text-sm leading-7" key={phase.title}>
            <div className="eyebrow">{phase.title}</div>
            <p className="mt-4 text-[color:var(--ink-soft)]">{phase.body}</p>
          </div>
        ))}
      </div>
    </SurfacePanel>
  );
}

