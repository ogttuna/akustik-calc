import type { ImpactCalculation } from "@dynecho/shared";

export type ImpactMetricChartStageKind = "field" | "lab" | "reference" | "standardized";

export type ImpactMetricChartPoint = {
  detail: string;
  id: string;
  kind: ImpactMetricChartStageKind;
  label: string;
  shortLabel: string;
  value: number;
};

type ImpactMetricStageDefinition = {
  detail: string;
  id: string;
  kind: ImpactMetricChartStageKind;
  label: string;
  shortLabel: string;
  value: (impact: ImpactCalculation) => number | undefined;
};

const IMPACT_STAGE_DEFINITIONS: readonly ImpactMetricStageDefinition[] = [
  {
    detail: "Untreated heavy reference floor before any improvement term is applied.",
    id: "bare_reference_lnw",
    kind: "reference",
    label: "Bare reference Ln,w",
    shortLabel: "Bare ref",
    value: (impact) => impact.bareReferenceLnW
  },
  {
    detail: "Heavy reference floor after the active DeltaLw treatment has been applied.",
    id: "treated_reference_lnw",
    kind: "reference",
    label: "Treated reference Ln,w",
    shortLabel: "Treated ref",
    value: (impact) => impact.treatedReferenceLnW
  },
  {
    detail: "Active lab-side weighted impact value on the current lane.",
    id: "lnw",
    kind: "lab",
    label: "Ln,w",
    shortLabel: "Ln,w",
    value: (impact) => impact.LnW
  },
  {
    detail: "Lab-side weighted value after the low-frequency companion term is carried into the headline read.",
    id: "lnw_plus_ci",
    kind: "lab",
    label: "Ln,w+CI",
    shortLabel: "Ln,w+CI",
    value: (impact) => impact.LnWPlusCI
  },
  {
    detail: "Direct field carry-over before room-volume standardization.",
    id: "lprimenw",
    kind: "field",
    label: "L'n,w",
    shortLabel: "L'n,w",
    value: (impact) => impact.LPrimeNW
  },
  {
    detail: "Standardized field value after room-volume normalization.",
    id: "lprimentw",
    kind: "standardized",
    label: "L'nT,w",
    shortLabel: "L'nT,w",
    value: (impact) => impact.LPrimeNTw
  },
  {
    detail: "Standardized field value with the extended 50..2500 Hz low-frequency companion.",
    id: "lpriment50",
    kind: "standardized",
    label: "L'nT,50",
    shortLabel: "L'nT,50",
    value: (impact) => impact.LPrimeNT50
  }
] as const;

export function buildImpactMetricChartPoints(impact: ImpactCalculation | null | undefined): ImpactMetricChartPoint[] {
  if (!impact) {
    return [];
  }

  return IMPACT_STAGE_DEFINITIONS.flatMap((stage) => {
    const value = stage.value(impact);

    return typeof value === "number" && Number.isFinite(value)
      ? [
          {
            detail: stage.detail,
            id: stage.id,
            kind: stage.kind,
            label: stage.label,
            shortLabel: stage.shortLabel,
            value
          }
        ]
      : [];
  });
}
