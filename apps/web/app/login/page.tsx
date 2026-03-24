import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

import {
  buildAuthConfigurationErrorMessage,
  getAuthState,
  normalizeNextPath
} from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = normalizeNextPath(pickSingleValue(params.next));
  const authState = await getAuthState();

  if (authState.configured && authState.session) {
    redirect(nextPath);
  }

  const configurationMessage = authState.configured ? null : buildAuthConfigurationErrorMessage(authState.missingKeys);

  return (
    <main className="ui-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-shadow grid w-full max-w-[30rem] gap-6 rounded-[2rem] border hairline bg-[color:var(--panel)] px-6 py-6 sm:px-7 sm:py-7">
        <div className="space-y-3">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Protected DynEcho access</div>
          <div className="space-y-2">
            <h1 className="font-display text-[clamp(2rem,4vw,2.6rem)] leading-none text-[color:var(--ink)]">Sign in to the workbench</h1>
            <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
              The landing page stays public. The calculation workspace, proposal preview, and server-side calculation routes now require an authenticated session.
            </p>
          </div>
        </div>

        <LoginForm authConfigured={authState.configured} configurationMessage={configurationMessage} nextPath={nextPath} />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--ink-soft)]">
          <Link className="focus-ring rounded-full px-3 py-2 font-semibold hover:bg-black/[0.04]" href="/">
            Back to overview
          </Link>
          <div className="text-right">
            <div>Next route</div>
            <div className="font-mono text-[0.78rem] text-[color:var(--ink)]">{nextPath}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
