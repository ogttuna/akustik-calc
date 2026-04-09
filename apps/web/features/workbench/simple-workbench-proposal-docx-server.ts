import HtmlToDocx from "@turbodocx/html-to-docx";

import {
  buildSimpleWorkbenchProposalHtml,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalSimpleHtml } from "./simple-workbench-proposal-simple";

type SimpleWorkbenchProposalDocxStyle = "branded" | "simple";

const A4_PAGE_SIZE_TWIPS = {
  height: 16838,
  width: 11906
} as const;

const ZERO_MARGINS_TWIPS = {
  bottom: 0,
  footer: 0,
  gutter: 0,
  header: 0,
  left: 0,
  right: 0,
  top: 0
} as const;

function toNodeBuffer(value: ArrayBuffer | Blob | Buffer): Buffer {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof ArrayBuffer) {
    return Buffer.from(value);
  }

  throw new Error("DOCX renderer returned a browser-only Blob in the Node.js route.");
}

export async function renderSimpleWorkbenchProposalDocx(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    style?: SimpleWorkbenchProposalDocxStyle;
  }
): Promise<Buffer> {
  const style = options?.style === "simple" ? "simple" : "branded";
  const html =
    style === "simple"
      ? buildSimpleWorkbenchProposalSimpleHtml(proposalDocument)
      : buildSimpleWorkbenchProposalHtml(proposalDocument);

  const docx = await HtmlToDocx(html, null, {
    creator: proposalDocument.consultantCompany || "DynEcho",
    description: `${style === "simple" ? "Simple" : "Branded"} DOCX export for ${proposalDocument.projectName}.`,
    footer: false,
    header: false,
    margins: ZERO_MARGINS_TWIPS,
    pageNumber: false,
    pageSize: A4_PAGE_SIZE_TWIPS,
    subject: proposalDocument.proposalSubject,
    title: proposalDocument.projectName
  });

  return toNodeBuffer(docx);
}
