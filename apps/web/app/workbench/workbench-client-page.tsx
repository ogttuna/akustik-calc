"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const SimpleWorkbenchShell = dynamic(
  () => import("@/features/workbench/simple-workbench-shell").then((module) => module.SimpleWorkbenchShell),
  {
    loading: () => (
      <div className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
        Loading simple workbench...
      </div>
    ),
    ssr: false
  }
);

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
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <main className={`flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3 ${view === "advanced" ? "overflow-y-auto" : "overflow-hidden"}`}>
      {view === "advanced" ? <WorkbenchShell /> : <SimpleWorkbenchShell />}
    </main>
  );
}
