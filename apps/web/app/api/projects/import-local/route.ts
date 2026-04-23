import { ServerProjectImportLocalRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import {
  createDefaultServerProjectRepository,
  summarizeServerProject
} from "@/lib/server-project-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "DynEcho could not read the local scenario import payload.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const parsed = ServerProjectImportLocalRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid local scenario import payload.",
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
    const project = await repository.importLocalScenarios(owner.scope, parsed.data);

    return NextResponse.json(
      {
        importedScenarioIds: project.scenarioSnapshots.map((scenario) => scenario.id),
        ok: true,
        project,
        summary: summarizeServerProject(project)
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error, "Unknown project import failure.");
  }
}
