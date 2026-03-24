"use client";

import {
  buildSimpleWorkbenchProposalFilename,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

type SimpleWorkbenchProposalPdfStyle = "branded" | "simple";

function parseErrorMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const message = (value as { error?: unknown }).error;
  return typeof message === "string" ? message : null;
}

export async function downloadSimpleWorkbenchProposalPdf(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    style?: SimpleWorkbenchProposalPdfStyle;
  }
): Promise<void> {
  const style = options?.style === "simple" ? "simple" : "branded";
  const route = style === "simple" ? "/api/proposal-pdf?style=simple" : "/api/proposal-pdf";
  const response = await fetch(route, {
    body: JSON.stringify(proposalDocument),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    let message =
      style === "simple"
        ? "DynEcho could not generate the simple PDF on the server."
        : "DynEcho could not generate the branded PDF on the server.";

    try {
      const payload = (await response.json()) as unknown;
      message = parseErrorMessage(payload) ?? message;
    } catch {
      // Keep the default message when the response does not decode cleanly.
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${buildSimpleWorkbenchProposalFilename(proposalDocument.projectName)}${style === "simple" ? "-simple" : ""}.pdf`;
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
}
