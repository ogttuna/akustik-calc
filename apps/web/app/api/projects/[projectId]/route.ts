import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectAccessRefFromRecord,
  projectRouteAccessErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteAccess,
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
    const authAccess = resolveProjectRouteAccess({
      action: "read_project",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
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

    const projectAccess = resolveProjectRouteAccess({
      action: "read_project",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!projectAccess.ok) {
      return projectRouteAccessErrorResponse(projectAccess);
    }

    return NextResponse.json({
      ok: true,
      project
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
