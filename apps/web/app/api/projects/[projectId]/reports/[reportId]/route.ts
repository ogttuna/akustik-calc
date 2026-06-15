import { ServerProjectUpdateReportRequestSchema } from "@dynecho/shared";
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

type ProjectReportRouteContext = {
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

export async function GET(_request: Request, context: ProjectReportRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "read_project",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
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
      action: "read_project",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const report = project.reports.find((entry) => entry.id === reportId);
    if (!report) {
      return NextResponse.json(
        {
          error: "Report not found.",
          ok: false
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json({
      ok: true,
      report
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: ProjectReportRouteContext) {
  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectUpdateReportRequestSchema.safeParse(rawPayload);
  const requestedAction = parsed.success && parsed.data.status === "archived" ? "delete_project_report" : "save_project_report";
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: requestedAction,
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project report update payload.",
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
      action: requestedAction,
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.updateReport(owner.scope, projectId, reportId, parsed.data);
    const report = updatedProject.reports.find((entry) => entry.id === reportId) ?? null;

    return NextResponse.json({
      ok: true,
      report
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: ProjectReportRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "delete_project_report",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
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
      action: "delete_project_report",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.deleteReport(owner.scope, projectId, reportId);

    return NextResponse.json({
      ok: true,
      project: updatedProject
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
