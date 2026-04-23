import { NextResponse } from "next/server";

import {
  buildSimpleWorkbenchProposalFilename,
  parseSimpleWorkbenchProposalDocument
} from "@/features/workbench/simple-workbench-proposal";
import { renderSimpleWorkbenchProposalDocx } from "@/features/workbench/simple-workbench-proposal-docx-server";
import { getAuthState } from "@/lib/auth";
import {
  appendProposalAuditEventForProject,
  getProposalAuditProjectId,
  getProposalAuditScenarioIds
} from "@/lib/project-proposal-audit";
import {
  projectOwnerScopeErrorResponse,
  projectStorageRouteErrorResponse,
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";

export const runtime = "nodejs";

const DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function POST(request: Request) {
  const authState = await getAuthState();
  const owner = resolveProjectRouteOwner(authState);

  if (!owner.ok) {
    return projectOwnerScopeErrorResponse(owner);
  }

  const style = new URL(request.url).searchParams.get("style") === "simple" ? "simple" : "branded";
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "DynEcho could not read the proposal payload."
      },
      {
        status: 400
      }
    );
  }

  const proposalDocument = parseSimpleWorkbenchProposalDocument(payload);

  if (!proposalDocument) {
    return NextResponse.json(
      {
        error: "DynEcho rejected the proposal payload because the issue sheet snapshot is incomplete."
      },
      {
        status: 400
      }
    );
  }

  try {
    const docxBuffer = await renderSimpleWorkbenchProposalDocx(proposalDocument, {
      style
    });
    const docxBytes = new Uint8Array(docxBuffer);
    const filename = `${buildSimpleWorkbenchProposalFilename(proposalDocument.projectName)}${style === "simple" ? "-simple" : ""}.docx`;
    const projectId = getProposalAuditProjectId(request.url, proposalDocument.serverProjectId);

    if (projectId) {
      try {
        await appendProposalAuditEventForProject({
          authState,
          format: "docx",
          projectId,
          scenarioIds: getProposalAuditScenarioIds(proposalDocument.serverProjectScenarioId),
          style
        });
      } catch (error) {
        return projectStorageRouteErrorResponse(error, "DynEcho could not record the proposal audit event.");
      }
    }

    return new NextResponse(docxBytes, {
      headers: {
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="${filename}"`,
        "content-type": DOCX_CONTENT_TYPE
      }
    });
  } catch (error) {
    const detail = error instanceof Error && error.message.trim().length > 0 ? error.message : null;

    return NextResponse.json(
      {
        error: detail
          ? `DynEcho could not generate the ${style === "simple" ? "simple" : "branded"} DOCX on the server. ${detail}`
          : `DynEcho could not generate the ${style === "simple" ? "simple" : "branded"} DOCX on the server.`
      },
      {
        status: 500
      }
    );
  }
}
