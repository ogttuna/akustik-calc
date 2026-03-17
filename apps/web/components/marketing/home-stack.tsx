import { DatabaseZap, PanelsTopLeft, Router, ScrollText } from "lucide-react";

import { SectionHeading, SurfacePanel } from "@dynecho/ui";

const STACK_ROWS = [
  {
    icon: PanelsTopLeft,
    label: "Product shell",
    value: "Next.js 15 + a modular workbench layer that can grow without swallowing domain logic."
  },
  {
    icon: Router,
    label: "State and flow",
    value: "Zustand holds session edits while package APIs stay narrow and explicit."
  },
  {
    icon: ScrollText,
    label: "Domain spine",
    value: "Strict TypeScript + typed catalogs + a pure engine boundary for migration safety."
  },
  {
    icon: DatabaseZap,
    label: "Future services",
    value: "Supabase, Prisma, Stripe, and analytics stay queued until the shell has durable value."
  }
] as const;

export function HomeStack() {
  return (
    <SurfacePanel className="stage-enter-2 px-6 py-7">
      <SectionHeading
        eyebrow="Operating system"
        title="The stack is organized around migration control, not framework fashion."
        description="Impeccable design discipline matters, but only if the structure underneath stays legible. These are the rails the product is allowed to run on."
      />
      <div className="mt-8 grid gap-3">
        {STACK_ROWS.map(({ icon: Icon, label, value }) => (
          <div
            className="pointer-card grid gap-4 rounded-[1.35rem] border hairline px-4 py-4 sm:grid-cols-[auto_0.7fr_1fr]"
            key={label}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border hairline bg-black/[0.035]">
              <Icon className="h-5 w-5 text-[color:var(--ink)]" />
            </div>
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-faint)]">
              {label}
            </div>
            <div className="text-sm leading-7 text-[color:var(--ink)]">{value}</div>
          </div>
        ))}
      </div>
    </SurfacePanel>
  );
}
