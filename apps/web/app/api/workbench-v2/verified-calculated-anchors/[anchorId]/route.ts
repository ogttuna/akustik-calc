import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository } from "@/lib/workbench-v2-verified-calculated-anchor-storage";

export const runtime = "nodejs";

// Agent coordination, 2026-06-22:
// Retiring a stored verified-calculated reference is audit/storage behavior
// only; it does not change calculator runtime matching.

type WorkbenchVerifiedCalculatedAnchorRouteContext = {
  params: Promise<{
    anchorId: string;
  }>;
};

export async function DELETE(_request: Request, context: WorkbenchVerifiedCalculatedAnchorRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const { anchorId } = await context.params;
    const repository = createDefaultWorkbenchV2VerifiedCalculatedAnchorRepository();
    const anchor = await repository.retireVerifiedCalculatedAnchor(owner.scope, anchorId);

    return NextResponse.json({
      anchor,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown verified calculated anchor retire failure.");
  }
}
