import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LegacyWorkbenchPage() {
  redirect("/workbench-v2");
}
