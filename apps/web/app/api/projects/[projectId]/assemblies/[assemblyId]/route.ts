import { ServerProjectUpdateAssemblyRequestSchema } from "@dynecho/shared";
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

type ProjectAssemblyRouteContext = {
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

export async function GET(_request: Request, context: ProjectAssemblyRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "read_project",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
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
      action: "read_project",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const assembly = project.assemblies.find((entry) => entry.id === assemblyId);
    if (!assembly) {
      return NextResponse.json(
        {
          error: "Assembly not found.",
          ok: false
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json({
      assembly,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: ProjectAssemblyRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "save_project_assembly",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectUpdateAssemblyRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project assembly update payload.",
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

    const updatedProject = await repository.updateAssembly(owner.scope, projectId, assemblyId, parsed.data);
    const assembly = updatedProject.assemblies.find((entry) => entry.id === assemblyId) ?? null;

    return NextResponse.json({
      assembly,
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: ProjectAssemblyRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "delete_project_assembly",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
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
      action: "delete_project_assembly",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.deleteAssembly(owner.scope, projectId, assemblyId);

    return NextResponse.json({
      ok: true,
      project: updatedProject
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
