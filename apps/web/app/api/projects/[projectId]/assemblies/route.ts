import { ServerProjectCreateAssemblyRequestSchema } from "@dynecho/shared";
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

type ProjectAssembliesRouteContext = {
  params: Promise<{
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

function assemblySummary(assembly: {
  calculationSummary?: unknown;
  createdAtIso: string;
  description?: string;
  displayCode?: string;
  id: string;
  kind: "floor" | "wall";
  name: string;
  source: string;
  updatedAtIso: string;
  version: number;
}) {
  return {
    calculationSummary: assembly.calculationSummary,
    createdAtIso: assembly.createdAtIso,
    description: assembly.description,
    displayCode: assembly.displayCode,
    id: assembly.id,
    kind: assembly.kind,
    name: assembly.name,
    source: assembly.source,
    updatedAtIso: assembly.updatedAtIso,
    version: assembly.version
  };
}

export async function GET(_request: Request, context: ProjectAssembliesRouteContext) {
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

    const access = resolveProjectRouteAccess({
      action: "read_project",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    return NextResponse.json({
      assemblies: project.assemblies.map((assembly) => assemblySummary(assembly)),
      ok: true
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function POST(request: Request, context: ProjectAssembliesRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "save_project_assembly",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectCreateAssemblyRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project assembly payload.",
        issues: parsed.error.issues,
        ok: false
      },
      {
        status: 400
      }
    );
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

    const access = resolveProjectRouteAccess({
      action: "save_project_assembly",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.appendAssembly(owner.scope, projectId, parsed.data);
    const assembly = updatedProject.assemblies[updatedProject.assemblies.length - 1];

    return NextResponse.json(
      {
        assembly,
        ok: true,
        summary: assembly ? assemblySummary(assembly) : null
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
