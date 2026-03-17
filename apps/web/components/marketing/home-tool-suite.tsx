import { Binoculars, BookDashed, BriefcaseBusiness, FileOutput, Scale } from "lucide-react";

import { SectionHeading, SurfacePanel } from "@dynecho/ui";

const TOOL_ROWS = [
  {
    body: "Option studies, saved variants, and side-by-side reasoning should be native to the workbench.",
    icon: Binoculars,
    title: "Compare schemes"
  },
  {
    body: "Target gaps should stay visible while designing, not be discovered later in a PDF review cycle.",
    icon: Scale,
    title: "Track criteria"
  },
  {
    body: "Result notes, benchmark references, and source provenance are part of trust, not post-processing.",
    icon: BookDashed,
    title: "Explain confidence"
  },
  {
    body: "Consultant-facing outputs need a clean report posture: assumptions, formulas, targets, and decisions.",
    icon: FileOutput,
    title: "Prepare reports"
  },
  {
    body: "A serious acoustic tool should support commercial project flow, not just isolated one-off calculations.",
    icon: BriefcaseBusiness,
    title: "Fit delivery work"
  }
] as const;

export function HomeToolSuite() {
  return (
    <SurfacePanel className="stage-enter-2 px-6 py-7">
      <SectionHeading
        eyebrow="Why This Becomes a Platform"
        title="An acoustic calculator becomes useful when it also supports comparison, reporting, and trust."
        description="The goal is broader than reproducing formulas. The product should help engineers and consultants frame a decision, defend it, and move it through delivery."
      />

      <div className="mt-8 grid gap-3 lg:grid-cols-5">
        {TOOL_ROWS.map(({ body, icon: Icon, title }) => (
          <article className="pointer-card rounded-[1.35rem] border hairline px-4 py-4" key={title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
              <Icon className="h-5 w-5 text-[color:var(--ink)]" />
            </div>
            <div className="mt-4 font-semibold text-[color:var(--ink)]">{title}</div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{body}</p>
          </article>
        ))}
      </div>
    </SurfacePanel>
  );
}
