import { Suspense } from "react";

import { WorkbenchSessionBar } from "@/components/auth/workbench-session-bar";
import { requireAuthenticatedPage } from "@/lib/auth";

import { WorkbenchClientPage } from "./workbench-client-page";

export const dynamic = "force-dynamic";

type WorkbenchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkbenchPage({ searchParams }: WorkbenchPageProps) {
  const params = await searchParams;
  const view = typeof params.view === "string" ? params.view : null;
  const session = await requireAuthenticatedPage(view === "advanced" ? "/workbench?view=advanced" : "/workbench");

  return (
    <div className="flex h-svh min-h-0 flex-col overflow-hidden bg-[color:var(--paper)]">
      <WorkbenchSessionBar username={session.username} />
      <Suspense
        fallback={
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-3">
            <div className="rounded border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
              Loading workbench...
            </div>
          </main>
        }
      >
        <WorkbenchClientPage />
      </Suspense>
    </div>
  );
}
