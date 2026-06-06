import { redirect } from "next/navigation";

import { requireAuthenticatedPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

type WorkbenchProposalConfigurePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickSingleValue(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function WorkbenchProposalConfigurePage({
  searchParams
}: WorkbenchProposalConfigurePageProps) {
  const params = await searchParams;
  const style = pickSingleValue(params.style);
  await requireAuthenticatedPage("/workbench/proposal/configure");

  redirect(style === "simple" ? "/workbench/proposal?style=simple" : "/workbench/proposal");
}
