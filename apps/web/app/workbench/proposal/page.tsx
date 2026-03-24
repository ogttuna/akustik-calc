import { Suspense } from "react";

import { WorkbenchSessionBar } from "@/components/auth/workbench-session-bar";
import { requireAuthenticatedPage } from "@/lib/auth";

import { ProposalPreviewClientPage } from "./proposal-preview-client-page";

export const dynamic = "force-dynamic";

export default async function WorkbenchProposalPage() {
  const session = await requireAuthenticatedPage("/workbench/proposal");

  return (
    <>
      <WorkbenchSessionBar username={session.username} />
      <Suspense
        fallback={
          <main className="ui-shell flex min-h-screen flex-col gap-8 overflow-x-clip px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
              Loading proposal print view...
            </div>
          </main>
        }
      >
        <ProposalPreviewClientPage />
      </Suspense>
    </>
  );
}
