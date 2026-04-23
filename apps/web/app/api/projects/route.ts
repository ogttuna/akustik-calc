import { ServerProjectCreateRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
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

  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  try {
    const repository = createDefaultServerProjectRepository();
    const projects = await repository.listProjects(owner.scope);

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

  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
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
    const project = await repository.createProject(owner.scope, parsed.data);

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
