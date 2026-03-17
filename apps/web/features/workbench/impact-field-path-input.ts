"use client";

import { ImpactFlankingPathSchema, type ImpactFlankingPath } from "@dynecho/shared";

const ImpactFlankingPathArraySchema = ImpactFlankingPathSchema.array().min(1);

export type ParsedImpactFieldPathInput = {
  paths: ImpactFlankingPath[];
  summary: string;
};

export function parseImpactFieldPathInput(
  input: string
): { error: string | null; parsed: ParsedImpactFieldPathInput | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: null, parsed: null };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch {
    return {
      error: "Flanking Paths JSON must be valid JSON and resolve to an array of path objects.",
      parsed: null
    };
  }

  const result = ImpactFlankingPathArraySchema.safeParse(parsedJson);
  if (!result.success) {
    return {
      error: "Each flanking path needs at least an id and levelOffsetDb. Optional expert fields are pathType, pathCount, supportingElementFamily, junctionLengthM, kijDb, pathPenaltyDb, edgeIsolationClass, and shortCircuitRisk.",
      parsed: null
    };
  }

  const familyAwareCount = result.data.filter((path: ImpactFlankingPath) => typeof path.supportingElementFamily === "string").length;
  const expertCount = result.data.filter(
    (path: ImpactFlankingPath) =>
      typeof path.kijDb === "number" ||
      typeof path.pathPenaltyDb === "number" ||
      typeof path.junctionLengthM === "number" ||
      typeof path.shortCircuitRisk === "string" ||
      typeof path.edgeIsolationClass === "string"
  ).length;

  return {
    error: null,
    parsed: {
      paths: result.data,
      summary: `${result.data.length} flanking path${result.data.length === 1 ? "" : "s"} ready${familyAwareCount > 0 ? ` · ${familyAwareCount} family-aware` : ""}${expertCount > 0 ? ` · ${expertCount} expert-modified` : ""}`
    }
  };
}
