"use client";

import dynamic from "next/dynamic";

const WorkbenchShell = dynamic(
  () => import("@/features/workbench/workbench-shell").then((module) => module.WorkbenchShell),
  {
    loading: () => (
      <div className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
        Loading operator desk...
      </div>
    ),
    ssr: false
  }
);

export function WorkbenchClientPage() {
  return (
    <main className="ui-shell flex min-h-screen flex-col gap-8 overflow-x-clip px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <WorkbenchShell />
    </main>
  );
}
