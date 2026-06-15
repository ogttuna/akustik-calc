import { ServerProjectCreateReportRequestSchema } from "@dynecho/shared";
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

type ProjectReportsRouteContext = {
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

function reportSummary(report: {
  assemblyId: string;
  createdAtIso: string;
  currentRevisionId: string;
  displayCode?: string;
  id: string;
  name: string;
  revisions: readonly unknown[];
  sourceAssemblyVersion: number;
  status: "archived" | "draft" | "issued";
  updatedAtIso: string;
}) {
  return {
    assemblyId: report.assemblyId,
    createdAtIso: report.createdAtIso,
    currentRevisionId: report.currentRevisionId,
    displayCode: report.displayCode,
    id: report.id,
    name: report.name,
    revisionCount: report.revisions.length,
    sourceAssemblyVersion: report.sourceAssemblyVersion,
    status: report.status,
    updatedAtIso: report.updatedAtIso
  };
}

export async function GET(_request: Request, context: ProjectReportsRouteContext) {
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
      ok: true,
      reports: project.reports.map((report) => reportSummary(report))
    });
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}

export async function POST(request: Request, context: ProjectReportsRouteContext) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    const authAccess = resolveProjectRouteAccess({
      action: "save_project_report",
      owner
    });
    return projectRouteAccessErrorResponse(authAccess);
  }

  const rawPayload = await readRequestJson(request);
  const parsed = ServerProjectCreateReportRequestSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid project report payload.",
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
      action: "save_project_report",
      owner,
      project: projectAccessRefFromRecord(project)
    });

    if (!access.ok) {
      return projectRouteAccessErrorResponse(access);
    }

    const updatedProject = await repository.appendReport(owner.scope, projectId, parsed.data);
    const report = updatedProject.reports[updatedProject.reports.length - 1];

    return NextResponse.json(
      {
        ok: true,
        report,
        summary: report ? reportSummary(report) : null
      },
      {
        status: 201
      }
    );
  } catch (error) {
    return projectStorageRouteErrorResponse(error);
  }
}
