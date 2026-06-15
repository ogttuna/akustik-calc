import { ServerProjectCreateReportRevisionRequestSchema } from "@dynecho/shared";
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

type ProjectReportRevisionsRouteContext = {
  params: Promise<{
    projectId: string;
    reportId: string;
  }>;
};

async function readRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request, context: ProjectReportRevisionsRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "save_project_report",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectCreateReportRevisionRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project report revision payload.",
        issues: parsed.error.issues,
        ok: false
      },
      {
        status: 400
      }
    );
  }

  try {
    const { projectId, reportId } = await context.params;
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
      action: "save_project_report",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.appendReportRevision(owner.scope, projectId, reportId, parsed.data);
    const report = updatedProject.reports.find((entry) => entry.id === reportId) ?? null;
    const revision = report?.revisions.find((entry) => entry.id === report.currentRevisionId) ?? null;

    return NextResponse.json(
      {
        ok: true,
        report,
        revision
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
