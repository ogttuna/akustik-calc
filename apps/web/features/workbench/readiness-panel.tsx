import { CheckCircle2, Construction, Lock } from "lucide-react";

import { SurfacePanel } from "@dynecho/ui";

const READINESS_ROWS = [
  {
    icon: CheckCircle2,
    title: "Implemented now",
    body: "Monorepo scaffold, package boundaries, responsive shell, seed engine path, and Docker runtime."
  },
  {
    icon: Lock,
    title: "Locked by policy",
    body: "No direct edits to Acoustic2 and no live import from the upstream working tree."
  },
  {
    icon: Construction,
    title: "Next import wave",
    body: "Commit-aware engine extraction, typed catalog porting, and wider result semantics after parity planning."
  }
] as const;

export function ReadinessPanel() {
  return (
    <SurfacePanel className="px-5 py-5">
      <div className="eyebrow">Readiness</div>
      <div className="mt-5 grid gap-3">
        {READINESS_ROWS.map(({ icon: Icon, title, body }) => (
          <article className="pointer-card rounded-[1.25rem] border hairline px-4 py-4" key={title}>
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-[color:var(--ink)]" />
              <div className="font-semibold text-[color:var(--ink)]">{title}</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{body}</p>
          </article>
        ))}
      </div>
    </SurfacePanel>
  );
}
