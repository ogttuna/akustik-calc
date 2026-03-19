export type AirborneValidationMetricId = "Rw" | "R'w" | "DnT,w" | "DnT,A" | "DnT,A,k" | "Dn,w" | "Dn,A";

export type AirborneValidationDatasetId =
  | "screening_acceptance"
  | "framed_official_primary"
  | "framed_official_field"
  | "framed_rw_holdout"
  | "framed_field_holdout"
  | "framed_exact_field_proxy_anchor"
  | "masonry_exact_anchor"
  | "masonry_raw_dynamic"
  | "aircrete_unfinished_raw_dynamic"
  | "celcon_finished_raw_dynamic"
  | "celcon_finished_final"
  | "ytong_massief_raw_dynamic"
  | "ytong_massief_final"
  | "ytong_massief_approx_field_companion"
  | "ytong_cellenbeton_raw_dynamic"
  | "ytong_cellenbeton_approx_field_companion"
  | "ytong_separatie_raw_dynamic"
  | "ytong_separatie_approx_field_companion";

export type AirborneValidationDatasetPosture =
  | "screening"
  | "exact"
  | "estimate"
  | "field_live"
  | "field_proxy"
  | "field_companion";

export type AirborneValidationDatasetRegime = {
  caseCount: number;
  id: AirborneValidationDatasetId;
  label: string;
  metrics: readonly AirborneValidationMetricId[];
  note: string;
  posture: AirborneValidationDatasetPosture;
  thresholdMaeDb?: number;
  thresholdMaxDb?: number;
  thresholdThicknessMm?: number;
  thresholdSurfaceMassKgM2?: number;
};

export type AirborneValidationMetricRegime = {
  datasetIds: readonly AirborneValidationDatasetId[];
  id: AirborneValidationMetricId;
  label: string;
  note: string;
};

export const AIRBORNE_VALIDATION_DATASET_MATRIX: readonly AirborneValidationDatasetRegime[] = [
  {
    caseCount: 63,
    id: "screening_acceptance",
    label: "Upstream screening acceptance",
    metrics: ["Rw"],
    note: "Accepted upstream Acoustic2 screening fixtures stay inside the fixed Rw, surface-mass, and thickness corridor.",
    posture: "screening",
    thresholdMaxDb: 1,
    thresholdSurfaceMassKgM2: 0.5,
    thresholdThicknessMm: 0.1
  },
  {
    caseCount: 6,
    id: "framed_official_primary",
    label: "Framed official lab primary",
    metrics: ["Rw"],
    note: "Published Knauf lab rows for calibrated framed walls.",
    posture: "exact",
    thresholdMaeDb: 1.5,
    thresholdMaxDb: 4
  },
  {
    caseCount: 13,
    id: "framed_official_field",
    label: "Framed official field live",
    metrics: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
    note: "Published Knauf field rows keep the live apparent-field lane calibrated.",
    posture: "field_live",
    thresholdMaeDb: 1,
    thresholdMaxDb: 2.5
  },
  {
    caseCount: 12,
    id: "framed_rw_holdout",
    label: "Framed lab holdout",
    metrics: ["Rw"],
    note: "Held-out framed lab rows keep the dynamic corridor honest after the primary set.",
    posture: "exact",
    thresholdMaeDb: 0.6,
    thresholdMaxDb: 2.1
  },
  {
    caseCount: 4,
    id: "framed_field_holdout",
    label: "Framed field holdout",
    metrics: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
    note: "Held-out framed field rows keep the DnT,A continuation from drifting.",
    posture: "field_live",
    thresholdMaeDb: 0.3,
    thresholdMaxDb: 0.7
  },
  {
    caseCount: 13,
    id: "framed_exact_field_proxy_anchor",
    label: "Framed exact DnT,A,k proxy anchors",
    metrics: ["DnT,A,k"],
    note: "Official Knauf field rows expose exact DnT,A,k proxy anchors without downgrading them to approximate companions.",
    posture: "field_proxy"
  },
  {
    caseCount: 31,
    id: "masonry_exact_anchor",
    label: "Masonry exact anchor corpus",
    metrics: ["Rw"],
    note: "Curated Xella, Silka, Porotherm, and HELUZ rows lock published masonry Rw points exactly.",
    posture: "exact",
    thresholdMaeDb: 0,
    thresholdMaxDb: 0
  },
  {
    caseCount: 31,
    id: "masonry_raw_dynamic",
    label: "Masonry raw dynamic corridor",
    metrics: ["Rw"],
    note: "The pre-anchor masonry dynamic lane stays inside a bounded raw corridor before exact overlay.",
    posture: "estimate",
    thresholdMaeDb: 1.5,
    thresholdMaxDb: 2.5
  },
  {
    caseCount: 12,
    id: "aircrete_unfinished_raw_dynamic",
    label: "Aircrete unfinished raw dynamic",
    metrics: ["Rw"],
    note: "H+H Celcon unfinished-aircrete rows keep the raw aircrete lane inside a 1 dB corridor.",
    posture: "estimate",
    thresholdMaeDb: 0.5,
    thresholdMaxDb: 1
  },
  {
    caseCount: 48,
    id: "celcon_finished_raw_dynamic",
    label: "Celcon finished raw dynamic",
    metrics: ["Rw"],
    note: "Finished Celcon rows keep the source-specific raw dynamic lane tight before final anchoring.",
    posture: "estimate",
    thresholdMaeDb: 0.35,
    thresholdMaxDb: 1
  },
  {
    caseCount: 48,
    id: "celcon_finished_final",
    label: "Celcon finished final corridor",
    metrics: ["Rw"],
    note: "The final calculator result stays on the same finished Celcon corridor as the raw dynamic lane.",
    posture: "exact",
    thresholdMaeDb: 0.35,
    thresholdMaxDb: 1
  },
  {
    caseCount: 3,
    id: "ytong_massief_raw_dynamic",
    label: "Ytong Massief raw dynamic",
    metrics: ["Rw"],
    note: "Low-density Ytong Massief G2/300 stays inside the official raw corridor.",
    posture: "estimate",
    thresholdMaeDb: 0.5,
    thresholdMaxDb: 1
  },
  {
    caseCount: 3,
    id: "ytong_massief_final",
    label: "Ytong Massief final corridor",
    metrics: ["Rw"],
    note: "The final calculator result stays aligned with the Massief raw dynamic corridor.",
    posture: "exact",
    thresholdMaeDb: 0.5,
    thresholdMaxDb: 1
  },
  {
    caseCount: 3,
    id: "ytong_massief_approx_field_companion",
    label: "Ytong Massief approximate companions",
    metrics: ["DnT,A,k"],
    note: "Published Ytong Massief DnT,A,k values are carried as explicit approximate companions, not as fake live field numbers.",
    posture: "field_companion"
  },
  {
    caseCount: 7,
    id: "ytong_cellenbeton_raw_dynamic",
    label: "Ytong cellenbeton raw dynamic",
    metrics: ["Rw"],
    note: "Dutch Ytong cellenbeton block rows keep the raw dynamic AAC lane inside a 1 dB corridor.",
    posture: "estimate",
    thresholdMaeDb: 0.5,
    thresholdMaxDb: 1
  },
  {
    caseCount: 7,
    id: "ytong_cellenbeton_approx_field_companion",
    label: "Ytong cellenbeton approximate companions",
    metrics: ["DnT,A,k"],
    note: "Published Ytong cellenbeton DnT,A,k values are surfaced separately from the live local DnT,A proxy.",
    posture: "field_companion"
  },
  {
    caseCount: 3,
    id: "ytong_separatie_raw_dynamic",
    label: "Ytong separatiepanelen raw dynamic",
    metrics: ["Rw"],
    note: "Prefab AAC separation panels keep the raw dynamic lane on the published lab corridor.",
    posture: "estimate",
    thresholdMaeDb: 0.5,
    thresholdMaxDb: 1
  },
  {
    caseCount: 3,
    id: "ytong_separatie_approx_field_companion",
    label: "Ytong separatiepanelen approximate companions",
    metrics: ["DnT,A,k"],
    note: "Published prefab AAC DnT,A companions remain visible without pretending they are exact live field outputs.",
    posture: "field_companion"
  }
] as const;

export const AIRBORNE_VALIDATION_METRIC_MATRIX: readonly AirborneValidationMetricRegime[] = [
  {
    datasetIds: [
      "screening_acceptance",
      "framed_official_primary",
      "framed_rw_holdout",
      "masonry_exact_anchor",
      "masonry_raw_dynamic",
      "aircrete_unfinished_raw_dynamic",
      "celcon_finished_raw_dynamic",
      "celcon_finished_final",
      "ytong_massief_raw_dynamic",
      "ytong_massief_final",
      "ytong_cellenbeton_raw_dynamic",
      "ytong_separatie_raw_dynamic"
    ],
    id: "Rw",
    label: "Lab airborne Rw",
    note: "Rw is guarded by upstream screening acceptance plus framed, masonry, AAC, and curated product-source corridors."
  },
  {
    datasetIds: ["framed_official_field", "framed_field_holdout"],
    id: "R'w",
    label: "Field apparent R'w",
    note: "R'w stays under explicit framed field benchmarks and holdouts."
  },
  {
    datasetIds: ["framed_official_field", "framed_field_holdout"],
    id: "DnT,w",
    label: "Field DnT,w",
    note: "DnT,w shares the same live framed field corpora as R'w."
  },
  {
    datasetIds: ["framed_official_field", "framed_field_holdout"],
    id: "DnT,A",
    label: "Field DnT,A",
    note: "DnT,A is benchmarked on official and held-out framed field corpora."
  },
  {
    datasetIds: [
      "framed_exact_field_proxy_anchor",
      "ytong_massief_approx_field_companion",
      "ytong_cellenbeton_approx_field_companion",
      "ytong_separatie_approx_field_companion"
    ],
    id: "DnT,A,k",
    label: "Field DnT,A,k",
    note: "DnT,A,k is guarded through both exact field proxy anchors and explicitly-marked approximate companions."
  },
  {
    datasetIds: ["framed_official_field", "framed_field_holdout"],
    id: "Dn,w",
    label: "Field Dn,w",
    note: "Dn,w is covered on the same live framed field route as the primary apparent metrics."
  },
  {
    datasetIds: ["framed_official_field", "framed_field_holdout"],
    id: "Dn,A",
    label: "Field Dn,A",
    note: "Dn,A is covered on the same live framed field route as the primary apparent metrics."
  }
] as const;

export const AIRBORNE_VALIDATION_CORPUS_SUMMARY = {
  datasetsTracked: AIRBORNE_VALIDATION_DATASET_MATRIX.length,
  fieldApproximateCompanionCases: 13,
  fieldLiveBenchmarkCases: 17,
  fieldProxyAnchorCases: 13,
  labBenchmarkCases: 122,
  metricsTracked: AIRBORNE_VALIDATION_METRIC_MATRIX.length,
  screeningAcceptanceCases: 63
} as const;

export function getAirborneValidationDatasetRegimeById(
  id: AirborneValidationDatasetId | null | undefined
): AirborneValidationDatasetRegime | null {
  if (!id) {
    return null;
  }

  return AIRBORNE_VALIDATION_DATASET_MATRIX.find((entry) => entry.id === id) ?? null;
}

export function getAirborneValidationMetricRegimeById(
  id: AirborneValidationMetricId | null | undefined
): AirborneValidationMetricRegime | null {
  if (!id) {
    return null;
  }

  return AIRBORNE_VALIDATION_METRIC_MATRIX.find((entry) => entry.id === id) ?? null;
}
