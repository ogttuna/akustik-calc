import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultWorkbenchV2MeasuredWallRwAnchorRepository } from "@/lib/workbench-v2-measured-wall-rw-anchor-storage";

export const runtime = "nodejs";

type WorkbenchMeasuredWallRwAnchorRouteContext = {
  params: Promise<{
    anchorId: string;
  }>;
};

export async function DELETE(_request: Request, context: WorkbenchMeasuredWallRwAnchorRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const { anchorId } = await context.params;
    const repository = createDefaultWorkbenchV2MeasuredWallRwAnchorRepository();
    const anchor = await repository.retireWallRwAnchor(owner.scope, anchorId);

    return NextResponse.json({
      anchor,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown measured wall Rw anchor retire failure.");
  }
}
