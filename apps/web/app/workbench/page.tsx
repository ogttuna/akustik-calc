import { Suspense } from "react";

import { WorkbenchClientPage } from "./workbench-client-page";

export default function WorkbenchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col gap-8 overflow-x-clip px-[clamp(0.75rem,1.6vw,1.5rem)] pb-10 pt-4">
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
