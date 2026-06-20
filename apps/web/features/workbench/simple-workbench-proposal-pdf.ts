"use client";

import {
  buildSimpleWorkbenchProposalFilename,
  type SimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalLayer
} from "./simple-workbench-proposal";

export type SimpleWorkbenchProposalExportStyle = "branded" | "simple";
export type SimpleWorkbenchProposalExportFormat = "pdf" | "docx";

const MAX_EXPORT_FILENAME_BASE_LENGTH = 72;
const MAX_EXPORT_FILENAME_LAYER_COUNT = 3;

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
      ? "DAC could not generate the simple DOCX on the server."
      : "DAC could not generate the branded DOCX on the server.";
  }

  return options.style === "simple"
    ? "DAC could not generate the simple PDF on the server."
    : "DAC could not generate the branded PDF on the server.";
}

function getDownloadFilename(options: {
  format: SimpleWorkbenchProposalExportFormat;
  projectName: string;
  style: SimpleWorkbenchProposalExportStyle;
}): string {
  return `${buildSimpleWorkbenchProposalFilename(options.projectName)}${options.style === "simple" ? "-simple" : ""}.${options.format}`;
}

function slugifyFilenamePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateFilenameBase(value: string): string {
  if (value.length <= MAX_EXPORT_FILENAME_BASE_LENGTH) {
    return value;
  }

  return value
    .slice(0, MAX_EXPORT_FILENAME_BASE_LENGTH)
    .replace(/-+[^-]*$/, "")
    .replace(/^-+|-+$/g, "");
}

function getLayerFilenamePart(layer: SimpleWorkbenchProposalLayer): string {
  const labelPart = slugifyFilenamePart(layer.label);
  const thicknessPart = slugifyFilenamePart(layer.thicknessLabel);

  if (labelPart.length === 0) {
    return thicknessPart;
  }

  if (thicknessPart.length === 0 || labelPart.includes(thicknessPart)) {
    return labelPart;
  }

  return `${thicknessPart}-${labelPart}`;
}

function getLayerStackFilenamePart(layers: readonly SimpleWorkbenchProposalLayer[]): string {
  const layerParts: string[] = [];

  for (const layer of layers) {
    const layerPart = getLayerFilenamePart(layer);
    if (layerPart.length === 0 || layerParts.includes(layerPart)) {
      continue;
    }
    layerParts.push(layerPart);
    if (layerParts.length >= MAX_EXPORT_FILENAME_LAYER_COUNT) {
      break;
    }
  }

  return layerParts.join("-");
}

export function normalizeSimpleWorkbenchProposalExportFilename(
  value: string,
  options: {
    fallbackFilename: string;
    format: SimpleWorkbenchProposalExportFormat;
  }
): string {
  const extensionPattern = new RegExp(`\\.${options.format}$`, "i");
  const fallbackBase = options.fallbackFilename.replace(extensionPattern, "");
  const sourceBase = value.trim().length > 0 ? value.trim() : fallbackBase;
  const base = truncateFilenameBase(slugifyFilenamePart(sourceBase.replace(/\.(pdf|docx)$/i, "")));
  const filenameBase = base.length > 0 ? base : truncateFilenameBase(slugifyFilenamePart(fallbackBase)) || "dynecho-report";

  return `${filenameBase}.${options.format}`;
}

export function buildSimpleWorkbenchProposalSuggestedFilename(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options: {
    format: SimpleWorkbenchProposalExportFormat;
    style: SimpleWorkbenchProposalExportStyle;
  }
): string {
  const parts = [
    slugifyFilenamePart(proposalDocument.projectName),
    slugifyFilenamePart(proposalDocument.studyModeLabel),
    getLayerStackFilenamePart(proposalDocument.layers),
    options.style === "simple" ? "simple" : ""
  ].filter((part) => part.length > 0);
  const filenameBase = truncateFilenameBase(parts.join("-")) || "dynecho-report";

  return `${filenameBase}.${options.format}`;
}

export async function downloadSimpleWorkbenchProposalExport(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    filename?: string;
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
  const fallbackFilename = getDownloadFilename({
    format,
    projectName: proposalDocument.projectName,
    style
  });
  anchor.href = objectUrl;
  anchor.download = options?.filename
    ? normalizeSimpleWorkbenchProposalExportFilename(options.filename, {
        fallbackFilename,
        format
      })
    : fallbackFilename;
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
}

export async function downloadSimpleWorkbenchProposalPdf(
  proposalDocument: SimpleWorkbenchProposalDocument,
  options?: {
    filename?: string;
    projectId?: string;
    style?: SimpleWorkbenchProposalExportStyle;
  }
): Promise<void> {
  await downloadSimpleWorkbenchProposalExport(proposalDocument, {
    filename: options?.filename,
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
