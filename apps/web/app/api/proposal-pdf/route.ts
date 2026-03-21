import { NextRequest, NextResponse } from "next/server";

import {
  buildSimpleWorkbenchProposalFilename,
  parseSimpleWorkbenchProposalDocument
} from "@/features/workbench/simple-workbench-proposal";
import { renderSimpleWorkbenchProposalPdf } from "@/features/workbench/simple-workbench-proposal-pdf-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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
    const pdfBuffer = await renderSimpleWorkbenchProposalPdf(proposalDocument);
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfBytes, {
      headers: {
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="${buildSimpleWorkbenchProposalFilename(proposalDocument.projectName)}.pdf"`,
        "content-type": "application/pdf"
      }
    });
  } catch (error) {
    const detail = error instanceof Error && error.message.trim().length > 0 ? error.message : null;

    return NextResponse.json(
      {
        error: detail
          ? `DynEcho could not generate the branded PDF on the server. ${detail}`
          : "DynEcho could not generate the branded PDF on the server."
      },
      {
        status: 500
      }
    );
  }
}
