import { ServerProjectDuplicateAssemblyRequestSchema } from "@dynecho/shared";
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

type ProjectAssemblyDuplicateRouteContext = {
  params: Promise<{
    assemblyId: string;
    projectId: string;
  }>;
};

async function readRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request, context: ProjectAssemblyDuplicateRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "save_project_assembly",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectDuplicateAssemblyRequestSchema.safeParse(rawPayload ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project assembly duplicate payload.",
        issues: parsed.error.issues,
        ok: false
      },
      {
        status: 400
      }
    );
  }

  try {
    const { assemblyId, projectId } = await context.params;
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

    const access = resolveProjectRouteAccess({
      action: "save_project_assembly",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.duplicateAssembly(owner.scope, projectId, assemblyId, parsed.data);
    const assembly = updatedProject.assemblies[updatedProject.assemblies.length - 1] ?? null;

    return NextResponse.json(
      {
        assembly,
        ok: true
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
