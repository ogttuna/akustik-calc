import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultServerProjectRepository } from "@/lib/server-project-storage";

export const runtime = "nodejs";

type ProjectRouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const { projectId } = await context.params;
    const repository = createDefaultServerProjectRepository();
    const project = await repository.readProject(owner.scope, projectId);

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found.",
          ok: false
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json({
      ok: true,
      project
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
