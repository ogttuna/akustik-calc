"use client";

export type WorkbenchFieldStatusKind = "active" | "conditional" | "anchored" | "ignored";

export type WorkbenchFieldStatus = {
  currentUse: string;
  kind: WorkbenchFieldStatusKind;
  meaning: string;
};

export function formatWorkbenchFieldStatusLabel(kind: WorkbenchFieldStatusKind): string {
  switch (kind) {
    case "active":
      return "Active now";
    case "conditional":
      return "Conditional";
    case "anchored":
      return "Anchored";
    case "ignored":
      return "Ignored";
  }
}

export function isWorkbenchFieldStatusUsed(kind: WorkbenchFieldStatusKind): boolean {
  return kind === "active" || kind === "anchored";
}
