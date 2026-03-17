import { z } from "zod";

export const ImpactFlankingPathTypeSchema = z.enum([
  "wall",
  "ceiling",
  "edge",
  "perimeter",
  "service",
  "structure"
]);

export const ImpactFlankingJunctionClassSchema = z.enum([
  "rigid",
  "continuous",
  "resilient",
  "isolated",
  "flexible"
]);

export const ImpactFlankingIsolationClassSchema = z.enum([
  "rigid",
  "partial",
  "isolated",
  "short_circuit"
]);

export const ImpactFlankingShortCircuitRiskSchema = z.enum([
  "low",
  "medium",
  "high",
  "severe"
]);

export const ImpactSupportingElementFamilySchema = z.enum([
  "reinforced_concrete",
  "hollow_core",
  "timber_joists",
  "open_box_timber",
  "mass_timber_clt",
  "steel_joists",
  "composite_panel"
]);

export const ImpactFlankingPathSchema = z.object({
  edgeIsolationClass: ImpactFlankingIsolationClassSchema.optional(),
  id: z.string().min(1),
  junctionClass: ImpactFlankingJunctionClassSchema.optional(),
  junctionLengthM: z.number().positive().optional(),
  kijDb: z.number().optional(),
  label: z.string().min(1).optional(),
  levelOffsetDb: z.number(),
  pathCount: z.number().int().positive().default(1),
  pathPenaltyDb: z.number().optional(),
  pathType: ImpactFlankingPathTypeSchema.optional(),
  shortCircuitRisk: ImpactFlankingShortCircuitRiskSchema.optional(),
  supportingElementFamily: ImpactSupportingElementFamilySchema.optional()
});

const IMPACT_SUPPORTING_ELEMENT_FAMILY_LABELS: Record<
  z.infer<typeof ImpactSupportingElementFamilySchema>,
  string
> = {
  composite_panel: "composite panel",
  hollow_core: "hollow core",
  mass_timber_clt: "mass timber CLT",
  open_box_timber: "open box timber",
  reinforced_concrete: "reinforced concrete",
  steel_joists: "steel joists",
  timber_joists: "timber joists"
};

export function formatImpactSupportingElementFamily(
  family: z.infer<typeof ImpactSupportingElementFamilySchema> | string
): string {
  return IMPACT_SUPPORTING_ELEMENT_FAMILY_LABELS[family as z.infer<typeof ImpactSupportingElementFamilySchema>] ?? family.replaceAll("_", " ");
}

export type ImpactFlankingIsolationClass = z.infer<typeof ImpactFlankingIsolationClassSchema>;
export type ImpactFlankingJunctionClass = z.infer<typeof ImpactFlankingJunctionClassSchema>;
export type ImpactFlankingPath = z.infer<typeof ImpactFlankingPathSchema>;
export type ImpactFlankingPathType = z.infer<typeof ImpactFlankingPathTypeSchema>;
export type ImpactFlankingShortCircuitRisk = z.infer<typeof ImpactFlankingShortCircuitRiskSchema>;
export type ImpactSupportingElementFamily = z.infer<typeof ImpactSupportingElementFamilySchema>;
