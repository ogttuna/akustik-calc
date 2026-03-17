import type { RequestedOutputId } from "@dynecho/shared";

type CriteriaPackDefinition = {
  audience: string;
  description: string;
  emphasis: readonly string[];
  id: string;
  label: string;
  note: string;
  requestedOutputs: readonly RequestedOutputId[];
  targetLnwDb: string;
  targetRwDb: string;
};

export const CRITERIA_PACKS = [
  {
    audience: "Multi-unit housing",
    description: "Balanced apartment-separation starting point for early coordination and value engineering.",
    emphasis: ["Airborne separation", "Floor impact check", "Guide-side reporting"],
    id: "apartment_core",
    label: "Apartment Core",
    note: "Useful when the brief still needs options, but the client expects both wall and floor accountability.",
    requestedOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "L'n,w", "CI", "Ln,w+CI"],
    targetLnwDb: "53",
    targetRwDb: "52"
  },
  {
    audience: "Hospitality",
    description: "Quieter guest-room posture with tighter airborne and impact expectations plus field-facing guide companions.",
    emphasis: ["Guest comfort", "Night-time sensitivity", "Field-side supplements"],
    id: "hotel_quiet",
    label: "Hotel Quiet",
    note: "A stronger brief template for rooms where impact spill and late-night traffic noise both matter.",
    requestedOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "L'n,w", "CI", "CI,50-2500", "Ln,w+CI", "L'nT,w", "L'nT,50"],
    targetLnwDb: "50",
    targetRwDb: "56"
  },
  {
    audience: "Premium residential",
    description: "High-expectation residential brief that favors comfort margin over minimal compliance posture.",
    emphasis: ["Upscale comfort", "Low footfall audibility", "Report-ready narrative"],
    id: "premium_condo",
    label: "Premium Condo",
    note: "Best for premium units or client teams that want a deliberate comfort buffer above a baseline brief.",
    requestedOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "L'n,w", "CI", "CI,50-2500", "Ln,w+CI", "L'nT,w", "L'nT,50"],
    targetLnwDb: "48",
    targetRwDb: "58"
  },
  {
    audience: "Workplace",
    description: "Focuses on speech privacy and wall performance without pretending impact is always a core driver.",
    emphasis: ["Meeting-room privacy", "Speech control", "Lean output set"],
    id: "office_privacy",
    label: "Office Privacy",
    note: "Useful for partitions, meeting rooms, and quiet-focus areas where airborne control dominates the brief.",
    requestedOutputs: ["Rw", "STC", "C", "Ctr"],
    targetLnwDb: "",
    targetRwDb: "50"
  },
  {
    audience: "Education",
    description: "Keeps teaching spaces disciplined on both separation and impact without going fully lab-oriented.",
    emphasis: ["Learning clarity", "Circulation spill control", "Simple consultant issue"],
    id: "learning_space",
    label: "Learning Space",
    note: "A good starting pack for classroom adjacency, corridor spill, and mixed wall-floor coordination.",
    requestedOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "L'n,w", "CI", "L'nT,w"],
    targetLnwDb: "53",
    targetRwDb: "55"
  }
] as const satisfies readonly CriteriaPackDefinition[];

export type CriteriaPack = (typeof CRITERIA_PACKS)[number];
export type CriteriaPackId = CriteriaPack["id"];

export const DEFAULT_CRITERIA_PACK_ID: CriteriaPackId = "apartment_core";

const criteriaPackById = Object.fromEntries(
  CRITERIA_PACKS.map((pack) => [pack.id, pack])
) as Record<CriteriaPackId, CriteriaPack>;

export function getCriteriaPackById(id: CriteriaPackId): CriteriaPack {
  return criteriaPackById[id];
}
