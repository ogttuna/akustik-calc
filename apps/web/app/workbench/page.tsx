import { Suspense } from "react";

import { WorkbenchClientPage } from "./workbench-client-page";

export default function WorkbenchPage() {
  return (
    <Suspense
      fallback={
        <main className="ui-shell flex min-h-screen flex-col gap-8 overflow-x-clip px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] px-6 py-8 text-sm text-[color:var(--ink-soft)]">
            Loading workbench...
          </div>
        </main>
      }
    >
      <WorkbenchClientPage />
    </Suspense>
  );
}
