import { Suspense } from "react";

import { CalculatorWorkbench } from "@/features/workbench-rebuild/calculator-workbench";
import { requireAuthenticatedPage } from "@/lib/auth";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export const dynamic = "force-dynamic";

export default async function WorkbenchV2Page() {
  const session = await requireAuthenticatedPage("/workbench-v2");

  return (
    <div className="min-h-screen bg-[color:var(--surface-app)]">
      <header className="calc-topbar">
        <div className="calc-topbar-inner">
          <div className="calc-topbar-brand">
            <span className="intro-mark">DAC</span>
            <span>DynEcho</span>
            <small>{session.username}</small>
          </div>
          <div className="calc-topbar-actions">
            <ThemeModeToggle />
            <form action="/logout" method="post">
              <button className="focus-ring ui-button" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <Suspense
        fallback={
          <main className="calc-page">
            <div className="calc-shell">
              <div className="ui-panel px-6 py-8 text-sm text-[color:var(--text-secondary)]">
                Loading workbench...
              </div>
            </div>
          </main>
        }
      >
        <CalculatorWorkbench />
      </Suspense>
    </div>
  );
}
