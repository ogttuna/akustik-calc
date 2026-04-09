import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalHtml } from "./simple-workbench-proposal";
import { buildSimpleWorkbenchProposalSimpleHtml } from "./simple-workbench-proposal-simple";

export type SimpleWorkbenchProposalPreviewStyle = "branded" | "simple";

export function buildSimpleWorkbenchProposalPreviewHtml(
  document: SimpleWorkbenchProposalDocument,
  style: SimpleWorkbenchProposalPreviewStyle = "branded"
): string {
  return style === "simple"
    ? buildSimpleWorkbenchProposalSimpleHtml(document)
    : buildSimpleWorkbenchProposalHtml(document);
}
