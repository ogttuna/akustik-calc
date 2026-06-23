import type { RequestedOutputId } from "@dynecho/shared";

import type { WorkbenchV2StudyMode } from "./workbench-v2-project-snapshot";

export type WorkbenchV2OutputGroup = "Airborne" | "Impact" | "Spectrum";

export type WorkbenchV2OutputOption = {
  group: WorkbenchV2OutputGroup;
  id: RequestedOutputId;
  label: string;
  modes: readonly WorkbenchV2StudyMode[];
};

export const WORKBENCH_V2_OUTPUT_OPTIONS: readonly WorkbenchV2OutputOption[] = [
  { group: "Airborne", id: "Rw", label: "Rw", modes: ["wall", "floor"] },
  { group: "Airborne", id: "R'w", label: "R'w", modes: ["wall", "floor"] },
  { group: "Airborne", id: "Dn,w", label: "Dn,w", modes: ["wall", "floor"] },
  { group: "Airborne", id: "Dn,A", label: "Dn,A", modes: ["wall", "floor"] },
  { group: "Airborne", id: "DnT,w", label: "DnT,w", modes: ["wall", "floor"] },
  { group: "Airborne", id: "DnT,A", label: "DnT,A", modes: ["wall", "floor"] },
  { group: "Airborne", id: "DnT,A,k", label: "DnT,A,k", modes: ["wall", "floor"] },
  { group: "Airborne", id: "STC", label: "STC", modes: ["wall", "floor"] },
  { group: "Spectrum", id: "C", label: "C", modes: ["wall", "floor"] },
  { group: "Spectrum", id: "Ctr", label: "Ctr", modes: ["wall", "floor"] },
  { group: "Impact", id: "Ln,w", label: "Ln,w", modes: ["floor"] },
  { group: "Impact", id: "Ln,w+CI", label: "Ln,w+CI", modes: ["floor"] },
  { group: "Impact", id: "L'n,w", label: "L'n,w", modes: ["floor"] },
  { group: "Impact", id: "L'nT,w", label: "L'nT,w", modes: ["floor"] },
  { group: "Impact", id: "L'nT,50", label: "L'nT,50", modes: ["floor"] },
  { group: "Impact", id: "LnT,A", label: "LnT,A", modes: ["floor"] },
  { group: "Impact", id: "DeltaLw", label: "DeltaLw", modes: ["floor"] },
  { group: "Impact", id: "CI", label: "CI", modes: ["floor"] },
  { group: "Impact", id: "CI,50-2500", label: "CI,50", modes: ["floor"] },
  { group: "Impact", id: "IIC", label: "IIC", modes: ["floor"] },
  { group: "Impact", id: "AIIC", label: "AIIC", modes: ["floor"] }
];

export const WORKBENCH_V2_USER_OUTPUT_IDS = WORKBENCH_V2_OUTPUT_OPTIONS.map((option) => option.id);
export const WORKBENCH_V2_USER_OUTPUT_ID_SET = new Set<RequestedOutputId>(WORKBENCH_V2_USER_OUTPUT_IDS);

export function getWorkbenchV2OutputOption(outputId: RequestedOutputId): WorkbenchV2OutputOption | undefined {
  return WORKBENCH_V2_OUTPUT_OPTIONS.find((option) => option.id === outputId);
}

export function workbenchV2OutputAllowedInMode(outputId: RequestedOutputId, mode: WorkbenchV2StudyMode): boolean {
  return getWorkbenchV2OutputOption(outputId)?.modes.includes(mode) ?? false;
}

export function filterWorkbenchV2OutputsForMode(
  outputIds: readonly RequestedOutputId[],
  mode: WorkbenchV2StudyMode
): RequestedOutputId[] {
  return outputIds.filter((outputId) => workbenchV2OutputAllowedInMode(outputId, mode));
}

export function getDefaultWorkbenchV2SelectedOutputs(mode: WorkbenchV2StudyMode): RequestedOutputId[] {
  return mode === "floor" ? ["Ln,w"] : ["Rw"];
}

export function normalizeWorkbenchV2SelectedOutputs(
  outputIds: readonly RequestedOutputId[],
  mode: WorkbenchV2StudyMode
): RequestedOutputId[] {
  const filtered = filterWorkbenchV2OutputsForMode([...new Set(outputIds)], mode);
  return filtered.length ? filtered : getDefaultWorkbenchV2SelectedOutputs(mode);
}
