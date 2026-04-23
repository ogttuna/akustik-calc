"use client";

import {
  buildSimpleWorkbenchProposalFilename,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

export type SimpleWorkbenchProposalExportStyle = "branded" | "simple";
export type SimpleWorkbenchProposalExportFormat = "pdf" | "docx";

function parseErrorMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const message = (value as { error?: unknown }).error;
  return typeof message === "string" ? message : null;
}

function getExportRoute(options: {
  format: SimpleWorkbenchProposalExportFormat;
  projectId?: string;
  style: SimpleWorkbenchProposalExportStyle;
}): string {
  const baseRoute = options.format === "docx" ? "/api/proposal-docx" : "/api/proposal-pdf";
  const searchParams = new URLSearchParams();
  if (options.style === "simple") {
    searchParams.set("style", "simple");
  }
  if (options.projectId && options.projectId.trim().length > 0) {
    searchParams.set("projectId", options.projectId.trim());
  }

  return searchParams.size > 0 ? `${baseRoute}?${searchParams.toString()}` : baseRoute;
}

export function getSimpleWorkbenchProposalExportLabel(options: {
  format: SimpleWorkbenchProposalExportFormat;
  style: SimpleWorkbenchProposalExportStyle;
}): string {
  if (options.format === "docx") {
    return options.style === "simple" ? "Simple DOCX" : "Branded DOCX";
  }

  return options.style === "simple" ? "Simple PDF" : "Branded PDF";
}

function getDefaultExportErrorMessage(options: {
  format: SimpleWorkbenchProposalExportFormat;
  style: SimpleWorkbenchProposalExportStyle;
}): string {
  if (options.format === "docx") {
    return options.style === "simple"
      ? "DynEcho could not generate the simple DOCX on the server."
      : "DynEcho could not generate the branded DOCX on the server.";
  }

  return options.style === "simple"
    ? "DynEcho could not generate the simple PDF on the server."
    : "DynEcho could not generate the branded PDF on the server.";
}

function getDownloadFilename(options: {
  format: SimpleWorkbenchProposalExportFormat;
  projectName: string;
  style: SimpleWorkbenchProposalExportStyle;
}): string {
  return `${buildSimpleWorkbenchProposalFilename(options.projectName)}${options.style === "simple" ? "-simple" : ""}.${options.format}`;
}

export async function downloadSimpleWorkbenchProposalExport(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    format?: SimpleWorkbenchProposalExportFormat;
    projectId?: string;
    style?: SimpleWorkbenchProposalExportStyle;
  }
): Promise<void> {
  const style = options?.style === "simple" ? "simple" : "branded";
  const format = options?.format === "docx" ? "docx" : "pdf";
  const projectId = options?.projectId ?? proposalDocument.serverProjectId;
  const route = getExportRoute({
    format,
    projectId,
    style
  });
  const response = await fetch(route, {
    body: JSON.stringify(proposalDocument),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    let message = getDefaultExportErrorMessage({
      format,
      style
    });

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
  anchor.download = getDownloadFilename({
    format,
    projectName: proposalDocument.projectName,
    style
  });
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
}

export async function downloadSimpleWorkbenchProposalPdf(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    projectId?: string;
    style?: SimpleWorkbenchProposalExportStyle;
  }
): Promise<void> {
  await downloadSimpleWorkbenchProposalExport(proposalDocument, {
    format: "pdf",
    projectId: options?.projectId,
    style: options?.style
  });
}

export async function downloadSimpleWorkbenchProposalDocx(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    projectId?: string;
    style?: SimpleWorkbenchProposalExportStyle;
  }
): Promise<void> {
  await downloadSimpleWorkbenchProposalExport(proposalDocument, {
    format: "docx",
    projectId: options?.projectId,
    style: options?.style
  });
}
