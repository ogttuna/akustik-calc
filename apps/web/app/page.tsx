import { HomeGuardrail } from "@/components/marketing/home-guardrail";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomePhases } from "@/components/marketing/home-phases";
import { HomeStack } from "@/components/marketing/home-stack";
import { HomeToolSuite } from "@/components/marketing/home-tool-suite";
import { HomeWorkbenchPreview } from "@/components/marketing/home-workbench-preview";
import { SiteHeader } from "@/components/marketing/site-header";

export default function HomePage() {
  return (
    <main className="ui-shell flex min-h-screen flex-col gap-8 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <SiteHeader />
      <HomeHero />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <HomeStack />
        <HomeGuardrail />
      </section>
      <HomeWorkbenchPreview />
      <HomeToolSuite />
      <HomePhases />
    </main>
  );
}
