import { Suspense } from "react";

import { WorkbenchSessionBar } from "@/components/auth/workbench-session-bar";
import { requireAuthenticatedPage } from "@/lib/auth";

import { ProposalAdjustClientPage } from "./proposal-adjust-client-page";

export const dynamic = "force-dynamic";

export default async function WorkbenchProposalConfigurePage() {
  const session = await requireAuthenticatedPage("/workbench/proposal/configure");

  return (
    <>
      <WorkbenchSessionBar username={session.username} />
      <Suspense
        fallback={
          <main className="flex min-h-screen flex-col gap-8 overflow-x-clip px-[clamp(0.75rem,1.6vw,1.5rem)] pb-10 pt-4">
            <div className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
              Loading PDF editor...
            </div>
          </main>
        }
      >
        <ProposalAdjustClientPage />
      </Suspense>
    </>
  );
}
