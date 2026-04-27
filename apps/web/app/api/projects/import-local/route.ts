import { ServerProjectImportLocalRequestSchema } from "@dynecho/shared";
import { NextResponse } from "next/server";

import { getAuthState } from "@/lib/auth";
import {
  projectAccessRefForOwnerScope,
  projectRouteAccessErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteAccess,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";
import {
  createDefaultServerProjectRepository,
  summarizeServerProject
} from "@/lib/server-project-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());
  const access = resolveProjectRouteAccess({
    action: "import_local_scenarios",
    owner,
    // The current route imports browser-local scenarios into a newly
    // created owner project, so the policy check uses that planned owner
    // project ref while storage still creates the real project id.
    project: owner.ok ? projectAccessRefForOwnerScope(owner.scope) : null
  });

  if (!access.ok) {
    return projectRouteAccessErrorResponse(access);
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
    const project = await repository.importLocalScenarios(access.scope, parsed.data);

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
