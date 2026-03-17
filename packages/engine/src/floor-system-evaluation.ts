import type {
  BoundFloorSystem,
  ExactFloorSystem,
  FloorRole,
  FloorSystemMatchCriteria,
  FloorSystemRoleCriteria,
  ResolvedLayer
} from "@dynecho/shared";

export const THICKNESS_TOLERANCE_MM = 2;

export const ROLE_LABELS: Record<FloorRole, string> = {
  base_structure: "base structure",
  ceiling_board: "ceiling board",
  ceiling_cavity: "ceiling cavity",
  ceiling_fill: "ceiling fill",
  floating_screed: "floating screed",
  floor_covering: "floor covering",
  resilient_layer: "resilient layer",
  upper_fill: "upper fill"
};

export type EvaluatedMatchedFloorSystem<TSystem extends ExactFloorSystem | BoundFloorSystem> = {
  exact: boolean;
  missingSignals: string[];
  score: number;
  system: TSystem;
  totalSignalCount: number;
};

function layersForRole(layers: readonly ResolvedLayer[], role: FloorRole): ResolvedLayer[] {
  return layers.filter((layer) => layer.floorRole === role);
}

function thicknessMatches(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= THICKNESS_TOLERANCE_MM;
}

function scoreRoleCriteria(criteria: FloorSystemRoleCriteria): number {
  return (criteria.layerCount ? 1 : 0) + (criteria.materialIds ? 1 : 0) + (typeof criteria.thicknessMm === "number" ? 1 : 0);
}

function describeMaterialSet(criteria: FloorSystemRoleCriteria): string {
  return criteria.materialIds?.join(" / ") ?? "curated material";
}

function evaluateRoleCriteria(
  layers: readonly ResolvedLayer[],
  role: FloorRole,
  criteria: FloorSystemRoleCriteria
): { exact: boolean; matchedSignals: number; missingSignals: string[]; totalSignals: number } {
  const roleLabel = ROLE_LABELS[role];
  const totalSignals = scoreRoleCriteria(criteria);
  const missingSignals: string[] = [];
  let matchedSignals = 0;

  if (criteria.layerCount) {
    if (layers.length === criteria.layerCount) {
      matchedSignals += 1;
    } else {
      missingSignals.push(`Set ${roleLabel} layers to ${criteria.layerCount}.`);
    }
  }

  if (criteria.materialIds) {
    if (layers.length === 0) {
      missingSignals.push(`Add ${roleLabel} using ${describeMaterialSet(criteria)}.`);
    } else if (layers.every((layer) => criteria.materialIds?.includes(layer.material.id))) {
      matchedSignals += 1;
    } else {
      missingSignals.push(`Use ${roleLabel} material ${describeMaterialSet(criteria)}.`);
    }
  } else if (layers.length === 0) {
    missingSignals.push(`Add ${roleLabel}.`);
  }

  if (typeof criteria.thicknessMm === "number") {
    if (layers.length === 0) {
      missingSignals.push(`Add ${roleLabel} around ${criteria.thicknessMm} mm.`);
    } else if (layers.every((layer) => thicknessMatches(layer.thicknessMm, criteria.thicknessMm as number))) {
      matchedSignals += 1;
    } else {
      missingSignals.push(`Tune ${roleLabel} to about ${criteria.thicknessMm} mm.`);
    }
  }

  return {
    exact: missingSignals.length === 0,
    matchedSignals,
    missingSignals,
    totalSignals
  };
}

export function evaluateMatchedFloorSystem<TSystem extends ExactFloorSystem | BoundFloorSystem>(
  layers: readonly ResolvedLayer[],
  system: TSystem & { match: FloorSystemMatchCriteria }
): EvaluatedMatchedFloorSystem<TSystem> {
  const roleChecks: Array<[FloorRole, FloorSystemRoleCriteria | undefined]> = [
    ["base_structure", system.match.baseStructure],
    ["resilient_layer", system.match.resilientLayer],
    ["floating_screed", system.match.floatingScreed],
    ["upper_fill", system.match.upperFill],
    ["floor_covering", system.match.floorCovering],
    ["ceiling_cavity", system.match.ceilingCavity],
    ["ceiling_fill", system.match.ceilingFill],
    ["ceiling_board", system.match.ceilingBoard]
  ];

  const missingSignals: string[] = [];
  let score = 0;
  let totalSignalCount = system.match.absentRoles.length;
  let exact = true;

  for (const role of system.match.absentRoles) {
    if (layersForRole(layers, role).length === 0) {
      score += 1;
    } else {
      exact = false;
      missingSignals.push(`Remove ${ROLE_LABELS[role]} layers for ${system.label}.`);
    }
  }

  for (const [role, criteria] of roleChecks) {
    if (!criteria) {
      continue;
    }

    const evaluation = evaluateRoleCriteria(layersForRole(layers, role), role, criteria);
    score += evaluation.matchedSignals;
    totalSignalCount += evaluation.totalSignals;

    if (!evaluation.exact) {
      exact = false;
      missingSignals.push(...evaluation.missingSignals);
    }
  }

  return {
    exact,
    missingSignals,
    score,
    system,
    totalSignalCount
  };
}

export function fitPercentFromEvaluation(
  evaluation: Pick<EvaluatedMatchedFloorSystem<ExactFloorSystem | BoundFloorSystem>, "score" | "totalSignalCount">
): number {
  return Math.max(0, Math.min(100, Math.round((evaluation.score / evaluation.totalSignalCount) * 100)));
}
