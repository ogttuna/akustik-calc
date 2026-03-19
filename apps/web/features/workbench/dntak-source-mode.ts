import type { AssemblyCalculation } from "@dynecho/shared";

export type DnTAkSourceMode = "approximate_companion" | "exact_field_proxy_anchor" | "unspecified";

export function getDnTAkSourceMode(result: AssemblyCalculation | null): DnTAkSourceMode | null {
  if (typeof result?.ratings?.field?.DnTAk !== "number") {
    return null;
  }

  const basis = result.ratings?.field?.basis ?? "";

  if (basis.includes("exact_verified_field_proxy_anchor")) {
    return "exact_field_proxy_anchor";
  }

  if (basis.includes("official_approximate_field_companion")) {
    return "approximate_companion";
  }

  return "unspecified";
}

export function getDnTAkLiveLabel(result: AssemblyCalculation | null): string {
  const mode = getDnTAkSourceMode(result);

  if (mode === "exact_field_proxy_anchor") {
    return "Exact source";
  }

  if (mode === "approximate_companion") {
    return "Source companion";
  }

  return "Live";
}

export function getDnTAkDetail(result: AssemblyCalculation | null): string {
  const mode = getDnTAkSourceMode(result);

  if (mode === "exact_field_proxy_anchor") {
    return "Official field-side single number anchored through the local DnT,A proxy lane";
  }

  if (mode === "approximate_companion") {
    return "Official approximate field companion carried separately from the live local DnT,A proxy";
  }

  return "Published field-side airborne single-number value carried by the current source-backed lane";
}

export function getDnTAkReportLine(result: AssemblyCalculation | null): string | null {
  if (typeof result?.ratings?.field?.DnTAk !== "number") {
    return null;
  }

  const value = result.ratings?.field?.DnTAk;
  const mode = getDnTAkSourceMode(result);

  if (typeof value !== "number") {
    return null;
  }

  if (mode === "exact_field_proxy_anchor") {
    return `- DnT,A,k source anchor: ${value.toFixed(1)} dB (official field-side single number anchored through the local DnT,A proxy lane)`;
  }

  if (mode === "approximate_companion") {
    return `- DnT,A,k companion: ${value.toFixed(1)} dB (official approximate project-dependent companion)`;
  }

  return `- DnT,A,k: ${value.toFixed(1)} dB`;
}
