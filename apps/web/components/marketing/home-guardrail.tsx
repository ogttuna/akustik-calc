import { GitFork, LockKeyhole, TestTubeDiagonal } from "lucide-react";

import { SectionHeading, SurfacePanel } from "@dynecho/ui";

const GUARDRAILS = [
  {
    icon: LockKeyhole,
    title: "Upstream remains read-only",
    body: "No direct edits inside `Acoustic2`, no live-coupled runtime import, no symlink tricks."
  },
  {
    icon: GitFork,
    title: "Ports must cite provenance",
    body: "Future behavior imports should cite an upstream commit, then be re-tested and documented here."
  },
  {
    icon: TestTubeDiagonal,
    title: "Migration beats mimicry",
    body: "We prove architecture and UX first, then import formula behavior deliberately instead of hand-waving parity."
  }
] as const;

export function HomeGuardrail() {
  return (
    <SurfacePanel className="stage-enter-3 px-6 py-7" id="source-policy">
      <SectionHeading
        eyebrow="Source policy"
        title="`Acoustic2` stays read-only from this repo."
        description="The upstream repo is still moving, especially on the Ln,w side. This project ports behavior deliberately instead of live-coupling to unfinished work."
      />
      <div className="mt-8 grid gap-3 text-sm leading-7 text-[color:var(--ink-soft)]">
        {GUARDRAILS.map(({ icon: Icon, title, body }) => (
          <article className="pointer-card rounded-[1.3rem] border hairline px-4 py-4" key={title}>
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-[color:var(--ink)]" />
              <div className="font-semibold text-[color:var(--ink)]">{title}</div>
            </div>
            <p className="mt-3">{body}</p>
          </article>
        ))}
      </div>
    </SurfacePanel>
  );
}
