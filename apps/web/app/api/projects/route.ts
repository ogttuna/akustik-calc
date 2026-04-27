import { ServerProjectCreateRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectRouteAccessErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteAccess,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import { createDefaultServerProjectRepository } from "@/lib/server-project-storage";

export const runtime = "nodejs";

async function readRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const owner = resolveProjectRouteOwner(await getAuthState());
  const access = resolveProjectRouteAccess({
    action: "list_projects",
    owner
  });

  if (!access.ok) {
    return projectRouteAccessErrorResponse(access);
  }

  try {
    const repository = createDefaultServerProjectRepository();
    const projects = await repository.listProjects(access.scope);

    return NextResponse.json({
      ok: true,
      projects
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  const access = resolveProjectRouteAccess({
    action: "create_project",
    owner
  });

  if (!access.ok) {
    return projectRouteAccessErrorResponse(access);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectCreateRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project payload.",
        issues: parsed.error.issues,
        ok: false
      },
      {
        status: 400
      }
    );
  }

  try {
    const repository = createDefaultServerProjectRepository();
    const project = await repository.createProject(access.scope, parsed.data);

    return NextResponse.json(
      {
        ok: true,
        project
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
