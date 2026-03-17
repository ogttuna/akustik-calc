export type FieldRiskId =
  | "junction_detail_unresolved"
  | "service_penetrations_open"
  | "perimeter_bridge_risk"
  | "ceiling_dependence"
  | "resilient_installation_sensitive"
  | "product_swap_risk";

export type FieldRiskDefinition = {
  action: string;
  body: string;
  category: "coordination" | "field" | "flanking" | "procurement";
  id: FieldRiskId;
  label: string;
  weight: number;
};

export type FieldRiskSummary = {
  actions: string[];
  activeDefinitions: FieldRiskDefinition[];
  level: "clear" | "watch" | "elevated" | "high";
  score: number;
  summary: string;
  tone: "accent" | "neutral" | "success" | "warning";
};

export const FIELD_RISK_LIBRARY: readonly FieldRiskDefinition[] = [
  {
    action: "Freeze junction details before issuing a spec-facing recommendation.",
    body: "Head, base, and perimeter junctions are not locked yet, so field-side values may drift from the desk study.",
    category: "coordination",
    id: "junction_detail_unresolved",
    label: "Junction details unresolved",
    weight: 2
  },
  {
    action: "Add services and penetrations to the brief, not only to drawing markup.",
    body: "Sleeves, socket boxes, and service runs are still open and may undermine both airborne and impact performance.",
    category: "field",
    id: "service_penetrations_open",
    label: "Service penetrations open",
    weight: 2
  },
  {
    action: "Lock edge strips, separation breaks, and perimeter continuity in procurement notes.",
    body: "The package looks sensitive to hard perimeter bridges or incomplete isolation around the floating layer.",
    category: "flanking",
    id: "perimeter_bridge_risk",
    label: "Perimeter bridge risk",
    weight: 3
  },
  {
    action: "Treat ceiling-side assumptions as provisional until hanger, cavity, and services are fixed.",
    body: "Part of the expected result depends on suspended-ceiling or cavity behavior that is still design-stage only.",
    category: "coordination",
    id: "ceiling_dependence",
    label: "Ceiling dependence",
    weight: 2
  },
  {
    action: "Carry QA hold points for resilient installation and site inspection photos.",
    body: "The selected stack depends heavily on resilient layer workmanship, compression control, and clean installation.",
    category: "field",
    id: "resilient_installation_sensitive",
    label: "Installation-sensitive resilient layer",
    weight: 2
  },
  {
    action: "Freeze dynamic stiffness and density assumptions before product substitution is allowed.",
    body: "Commercial pressure to swap the resilient product or finish build-up is still likely.",
    category: "procurement",
    id: "product_swap_risk",
    label: "Product swap risk",
    weight: 1
  }
] as const;

export const FIELD_RISK_BY_ID: Record<FieldRiskId, FieldRiskDefinition> = Object.fromEntries(
  FIELD_RISK_LIBRARY.map((risk) => [risk.id, risk])
) as Record<FieldRiskId, FieldRiskDefinition>;

export function summarizeFieldRisk(fieldRiskIds: readonly FieldRiskId[]): FieldRiskSummary {
  const activeDefinitions = fieldRiskIds
    .map((fieldRiskId) => FIELD_RISK_BY_ID[fieldRiskId])
    .filter((risk): risk is FieldRiskDefinition => Boolean(risk));
  const score = activeDefinitions.reduce((total, risk) => total + risk.weight, 0);

  if (score === 0) {
    return {
      actions: ["No explicit field-risk flags are active. Keep using the assumption log for project-specific caveats."],
      activeDefinitions,
      level: "clear",
      score,
      summary: "No explicit field-risk flags are active in the current workspace.",
      tone: "success"
    };
  }

  const categories = new Set(activeDefinitions.map((risk) => risk.category));
  const level = score >= 7 ? "high" : score >= 4 ? "elevated" : "watch";

  return {
    actions: activeDefinitions.slice(0, 3).map((risk) => risk.action),
    activeDefinitions,
    level,
    score,
    summary: `${activeDefinitions.length} field risk flag${activeDefinitions.length === 1 ? "" : "s"} across ${categories.size} coordination lane${categories.size === 1 ? "" : "s"} are active.`,
    tone: level === "high" ? "warning" : level === "elevated" ? "accent" : "neutral"
  };
}
