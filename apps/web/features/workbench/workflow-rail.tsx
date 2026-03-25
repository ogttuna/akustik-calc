import { Binoculars, DraftingCompass, FileBadge2, Layers2 } from "lucide-react";

import { SurfacePanel } from "@dynecho/ui";

const STEPS = [
  {
    icon: DraftingCompass,
    label: "Brief the study",
    body: "Capture targets, requested outputs, and report posture before stack editing starts."
  },
  {
    icon: Layers2,
    label: "Compose and save",
    body: "Keep multiple stack options alive instead of overwriting each iteration."
  },
  {
    icon: Binoculars,
    label: "Compare and inspect",
    body: "Use charts, deltas, and narratives to understand why a stack is moving."
  },
  {
    icon: FileBadge2,
    label: "Report and import",
    body: "Carry scenario rationale forward, then port upstream behavior by commit when ready."
  }
] as const;

export function WorkflowRail() {
  return (
    <SurfacePanel className="stage-enter-2 px-5 py-5">
      <div className="eyebrow">Operator lanes</div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map(({ icon: Icon, label, body }, index) => (
          <article className="pointer-card rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4" key={label}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
                <Icon className="h-4 w-4 text-[color:var(--ink)]" />
              </div>
              <div className="eyebrow">0{index + 1}</div>
            </div>
            <div className="mt-4 font-semibold text-[color:var(--ink)]">{label}</div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{body}</p>
          </article>
        ))}
      </div>
    </SurfacePanel>
  );
}
