import type {
  AirborneContext,
  AssemblyRatings,
  FieldAirborneRating,
  LayerInput,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import { clamp, round1 } from "./math";
import { resolveMaterial } from "./material-catalog";

type VerifiedAirborneCatalogMode = "field" | "lab";

type VerifiedAirborneMetricLabel = "DnT,A,k" | "Rw";

type VerifiedAirborneCatalogEntry = {
  id: string;
  label: string;
  layers: LayerInput[];
  matchContext: Partial<AirborneContext>;
  metricLabel: VerifiedAirborneMetricLabel;
  metricValue: number;
  source: string;
  sourceMode: VerifiedAirborneCatalogMode;
};

type ResolvedVerifiedAirborneCatalogEntry = VerifiedAirborneCatalogEntry & {
  resolvedLayers: ResolvedLayer[];
};

type ApproximateAirborneFieldCompanionEntry = {
  id: string;
  label: string;
  layers: LayerInput[];
  matchContext: Partial<AirborneContext>;
  metricLabel: "DnT,A,k";
  metricValue: number;
  source: string;
};

type ResolvedApproximateAirborneFieldCompanionEntry = ApproximateAirborneFieldCompanionEntry & {
  resolvedLayers: ResolvedLayer[];
};

type CanonicalMatchLayer = {
  materialId: string;
  role: "gap" | "porous" | "solid";
  thicknessMm: number;
};

export type VerifiedAirborneAnchorResult = {
  applied: boolean;
  curve: TransmissionLossCurve;
  match: VerifiedAirborneCatalogEntry | null;
  ratings: AssemblyRatings;
  warnings: string[];
};

export type ApproximateAirborneFieldCompanionResult = {
  applied: boolean;
  match: ApproximateAirborneFieldCompanionEntry | null;
  ratings: AssemblyRatings;
  warnings: string[];
};

const KNAUF_QUIETSTUD_URL =
  "https://knauf.com/api/download-center/v1/assets/844d89d6-948a-408d-9da3-f6f1a238cf45?download=true";
const KNAUF_LAB_416702_URL =
  "https://knauf.com/api/download-center/v1/assets/8a433020-0f2e-45f0-a84c-3f5f315ea0ff?download=true";
const KNAUF_LAB_416889_URL =
  "https://knauf.com/api/download-center/v1/assets/cfb8a2df-f402-4ef8-baef-acdecc69f641?download=true";
const KNAUF_SYSTEM_TABLES_URL =
  "https://knauf.com/api/download-center/v1/assets/8b5d23c5-a182-4ac8-81f7-2a6d7c289d12?country=nl&download=true";
const XELLA_MODULAR_BUILDING_SYSTEM_URL =
  "https://storefrontapi.commerce.xella.com/occ/v2/uk/catalogs/ukContentCatalog/versions/Online/xellamedia/Xella-Modular-building-system.pdf";
const XELLA_NL_YTONG_MASSIEFBLOKKEN_URL =
  "https://storefrontapi.commerce.xella.com/occ/v2/nl/catalogs/nlContentCatalog/versions/Online/xellamedia/TD_Ytong_Massiefblokken.pdf";
const XELLA_NL_YTONG_SEPARATIEPANELEN_URL =
  "https://storefrontapi.commerce.xella.com/medias/TD-Ytong-Separatiepanelen.pdf?context=bWFzdGVyfHJvb3R8MzA0NzU3fGFwcGxpY2F0aW9uL3BkZnxhR1k1TDJnMFpTODVNVGsxTURjM05UWTJORGswTDFSRVgxbDBiMjVuWDFObGNHRnlZWFJwWlhCaGJtVnNaVzR1Y0dSbXw0ZDFjMDMxMDZhZTYxM2IzZDFiNDYwY2U3YjIyMmZlODk4OWQzZWFhMGQ4M2IwNWY5MDQxMTdkM2Y1ODFjYjAx";
const XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL =
  "https://storefrontapi.commerce.xella.com/medias/sys_master/root/h95/h69/9155108896798/TD_Ytong_Cellenbetonblokken1022/TD-Ytong-Cellenbetonblokken1022.pdf";
const XELLA_SILKA_CS_BLOCKS_URL =
  "https://storefrontapi.commerce.xella.com/medias/sys_master/root/ha1/h68/9149259120670/Silka_CSBlocks/Silka-CSBlocks.pdf";
const WIENERBERGER_POROTHERM_GUIDE_URL =
  "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/documents-magazines/technical/UK_MKT_DOC_TEC_WAL_POR_WB_BPG_Lucideon_Report_001.pdf";
const HELUZ_14_BROUSENA_URL = "https://www.heluz.cz/files/22145_10-Technicky-list-CZ.pdf";
const HELUZ_AKU_115_URL = "https://www.heluz.cz/files/21113_00-Technicky-list-CZ.pdf";
const HELUZ_AKU_20_P15_URL = "https://www.heluz.cz/files/21203_00-Technicky-list-CZ.pdf";
const HELUZ_AKU_30_333_P20_URL = "https://www.heluz.cz/files/21304_00-Technicky-list-CZ.pdf";

const LAB_STEEL_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} satisfies Partial<AirborneContext>;

const LAB_RESILIENT_CONTEXT = {
  airtightness: "good",
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "resilient_stud"
} satisfies Partial<AirborneContext>;

const FIELD_STEEL_CONTEXT = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} satisfies Partial<AirborneContext>;

const LAB_MASONRY_CONTEXT = {
  airtightness: "good",
  contextMode: "element_lab"
} satisfies Partial<AirborneContext>;

function verifiedEntry(
  id: string,
  label: string,
  source: string,
  sourceMode: VerifiedAirborneCatalogMode,
  metricLabel: VerifiedAirborneMetricLabel,
  metricValue: number,
  matchContext: Partial<AirborneContext>,
  layers: readonly (readonly [string, number])[]
): VerifiedAirborneCatalogEntry {
  return {
    id,
    label,
    layers: layers.map(([materialId, thicknessMm]) => ({ materialId, thicknessMm })),
    matchContext,
    metricLabel,
    metricValue,
    source,
    sourceMode
  };
}

function approximateFieldCompanionEntry(
  id: string,
  label: string,
  source: string,
  metricValue: number,
  matchContext: Partial<AirborneContext>,
  layers: readonly (readonly [string, number])[]
): ApproximateAirborneFieldCompanionEntry {
  return {
    id,
    label,
    layers: layers.map(([materialId, thicknessMm]) => ({ materialId, thicknessMm })),
    matchContext,
    metricLabel: "DnT,A,k",
    metricValue,
    source
  };
}

const VERIFIED_AIRBORNE_CATALOG: ResolvedVerifiedAirborneCatalogEntry[] = [
  verifiedEntry(
    "knauf_sqp2a_nil_92_primary_2026",
    "Knauf SQP.2A Quietstud 92 Nil",
    KNAUF_QUIETSTUD_URL,
    "lab",
    "Rw",
    49,
    LAB_RESILIENT_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 92], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_sqp2a_ki50_92_primary_2026",
    "Knauf SQP.2A Quietstud 92 KI50",
    KNAUF_QUIETSTUD_URL,
    "lab",
    "Rw",
    55,
    LAB_RESILIENT_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 42], ["glasswool", 50], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_sqp2a_ki75_92_primary_2026",
    "Knauf SQP.2A Quietstud 92 KI75",
    KNAUF_QUIETSTUD_URL,
    "lab",
    "Rw",
    56,
    LAB_RESILIENT_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 17], ["glasswool", 75], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_sqp2a_ki90_92_primary_2026",
    "Knauf SQP.2A Quietstud 92 KI90",
    KNAUF_QUIETSTUD_URL,
    "lab",
    "Rw",
    57,
    LAB_RESILIENT_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 2], ["glasswool", 90], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_lab_416702_primary_2026",
    "Knauf accredited lab report 416702",
    KNAUF_LAB_416702_URL,
    "lab",
    "Rw",
    50,
    LAB_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 5], ["glasswool", 70], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_lab_416889_primary_2026",
    "Knauf accredited lab report 416889",
    KNAUF_LAB_416889_URL,
    "lab",
    "Rw",
    55,
    LAB_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 5],
      ["glasswool", 70],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "xella_silka_cs_100_official_2026",
    "Xella Silka CS block 100 mm",
    XELLA_SILKA_CS_BLOCKS_URL,
    "lab",
    "Rw",
    43,
    LAB_MASONRY_CONTEXT,
    [["silka_cs_block", 100]]
  ),
  verifiedEntry(
    "xella_silka_cs_150_official_2026",
    "Xella Silka CS block 150 mm",
    XELLA_SILKA_CS_BLOCKS_URL,
    "lab",
    "Rw",
    50,
    LAB_MASONRY_CONTEXT,
    [["silka_cs_block", 150]]
  ),
  verifiedEntry(
    "xella_silka_cs_175_official_2026",
    "Xella Silka CS block 175 mm",
    XELLA_SILKA_CS_BLOCKS_URL,
    "lab",
    "Rw",
    52,
    LAB_MASONRY_CONTEXT,
    [["silka_cs_block", 175]]
  ),
  verifiedEntry(
    "xella_silka_cs_214_official_2026",
    "Xella Silka CS block 214 mm",
    XELLA_SILKA_CS_BLOCKS_URL,
    "lab",
    "Rw",
    55,
    LAB_MASONRY_CONTEXT,
    [["silka_cs_block", 214]]
  ),
  verifiedEntry(
    "xella_ytong_g5_800_100_skim4_primary_2026",
    "Xella Ytong G5/800 100 mm panel + 4 mm skim plaster both sides",
    XELLA_MODULAR_BUILDING_SYSTEM_URL,
    "lab",
    "Rw",
    40,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 4], ["ytong_g5_800", 100], ["skim_plaster", 4]]
  ),
  verifiedEntry(
    "xella_nl_ytong_massief_g2_300_240_skim3_lab_2026",
    "Xella NL Ytong Massief G2/300 240 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    "lab",
    "Rw",
    46,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 240], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_massief_g2_300_300_skim3_lab_2026",
    "Xella NL Ytong Massief G2/300 300 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    "lab",
    "Rw",
    49,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 300], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_massief_g2_300_365_skim3_lab_2026",
    "Xella NL Ytong Massief G2/300 365 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    "lab",
    "Rw",
    51,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 365], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_sep_aac_4_600_70_skim3_lab_2026",
    "Xella NL Ytong separatiepaneel AAC 4/600 70 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    "lab",
    "Rw",
    34,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 70], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_sep_aac_4_600_100_skim3_lab_2026",
    "Xella NL Ytong separatiepaneel AAC 4/600 100 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    "lab",
    "Rw",
    34,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 100], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_sep_aac_5_750_100_skim3_lab_2026",
    "Xella NL Ytong separatiepaneel AAC 5/750 100 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    "lab",
    "Rw",
    37,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_5_750", 100], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_70_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 70 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    33,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 70], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_100_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 100 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    37,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 100], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_150_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 150 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    43,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 150], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_200_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 200 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    44,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 200], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_240_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 240 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    48,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 240], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_300_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G4/600 300 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    49,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 300], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_nl_ytong_cellenbetonblok_g5_800_100_skim3_lab_2026",
    "Xella NL Ytong cellenbetonblok G5/800 100 mm + thin skim plaster both sides (3 mm local surrogate)",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    "lab",
    "Rw",
    39,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g5_800", 100], ["skim_plaster", 3]]
  ),
  verifiedEntry(
    "xella_ytong_d700_125_plaster10_official_2026",
    "Ytong D700 125 mm + 10 mm plaster both sides",
    "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-125-10-rw-44-db",
    "lab",
    "Rw",
    44,
    LAB_MASONRY_CONTEXT,
    [["cement_plaster", 10], ["ytong_aac_d700", 125], ["cement_plaster", 10]]
  ),
  verifiedEntry(
    "xella_ytong_d700_150_plaster10_official_2026",
    "Ytong D700 150 mm + 10 mm plaster both sides",
    "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-150-10-rw-47-db",
    "lab",
    "Rw",
    47,
    LAB_MASONRY_CONTEXT,
    [["cement_plaster", 10], ["ytong_aac_d700", 150], ["cement_plaster", 10]]
  ),
  verifiedEntry(
    "xella_ytong_d700_200_plaster10_official_2026",
    "Ytong D700 200 mm + 10 mm plaster both sides",
    "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-200-10-rw-50-db",
    "lab",
    "Rw",
    50,
    LAB_MASONRY_CONTEXT,
    [["cement_plaster", 10], ["ytong_aac_d700", 200], ["cement_plaster", 10]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_100_dense_plaster_primary_2026",
    "Wienerberger Porotherm 100 + 13 mm dense plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    43,
    LAB_MASONRY_CONTEXT,
    [["dense_plaster", 13], ["porotherm_pls_100", 100], ["dense_plaster", 13]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_140_dense_plaster_primary_2026",
    "Wienerberger Porotherm 140 + 13 mm dense plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    44,
    LAB_MASONRY_CONTEXT,
    [["dense_plaster", 13], ["porotherm_pls_140", 140], ["dense_plaster", 13]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_190_dense_plaster_primary_2026",
    "Wienerberger Porotherm 190 + 13 mm dense plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    48,
    LAB_MASONRY_CONTEXT,
    [["dense_plaster", 13], ["porotherm_pls_190", 190], ["dense_plaster", 13]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_100_light_plaster_primary_2026",
    "Wienerberger Porotherm 100 + 13 mm lightweight plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    40,
    LAB_MASONRY_CONTEXT,
    [["lightweight_plaster", 13], ["porotherm_pls_100", 100], ["lightweight_plaster", 13]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_140_light_plaster_primary_2026",
    "Wienerberger Porotherm 140 + 13 mm lightweight plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    41,
    LAB_MASONRY_CONTEXT,
    [["lightweight_plaster", 13], ["porotherm_pls_140", 140], ["lightweight_plaster", 13]]
  ),
  verifiedEntry(
    "wienerberger_porotherm_190_light_plaster_primary_2026",
    "Wienerberger Porotherm 190 + 13 mm lightweight plaster both sides",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    "lab",
    "Rw",
    46,
    LAB_MASONRY_CONTEXT,
    [["lightweight_plaster", 13], ["porotherm_pls_190", 190], ["lightweight_plaster", 13]]
  ),
  verifiedEntry(
    "heluz_14_brousena_lab_2026",
    "HELUZ 14 brousená + 15 mm lime-cement plaster both sides",
    HELUZ_14_BROUSENA_URL,
    "lab",
    "Rw",
    41,
    LAB_MASONRY_CONTEXT,
    [["lime_cement_plaster_1300", 15], ["heluz_14_brushed", 140], ["lime_cement_plaster_1300", 15]]
  ),
  verifiedEntry(
    "heluz_aku_115_lab_2026",
    "HELUZ AKU 11.5 + 15 mm lime-cement plaster both sides",
    HELUZ_AKU_115_URL,
    "lab",
    "Rw",
    47,
    LAB_MASONRY_CONTEXT,
    [["lime_cement_plaster_1700", 15], ["heluz_aku_115", 115], ["lime_cement_plaster_1700", 15]]
  ),
  verifiedEntry(
    "heluz_aku_200_p15_lab_2026",
    "HELUZ AKU 20 P15 + 17 mm lime-cement plaster both sides",
    HELUZ_AKU_20_P15_URL,
    "lab",
    "Rw",
    53,
    LAB_MASONRY_CONTEXT,
    [["lime_cement_plaster_1780", 17], ["heluz_aku_200_p15", 200], ["lime_cement_plaster_1780", 17]]
  ),
  verifiedEntry(
    "heluz_aku_300_333_p20_lab_2026",
    "HELUZ AKU 30/33.3 P20 + 15 mm lime-cement plaster both sides",
    HELUZ_AKU_30_333_P20_URL,
    "lab",
    "Rw",
    56,
    LAB_MASONRY_CONTEXT,
    [["lime_cement_plaster_1700", 15], ["heluz_aku_300_333_p20", 300], ["lime_cement_plaster_1700", 15]]
  ),
  verifiedEntry(
    "knauf_w111_50_75_a_field_2026",
    "Knauf W111 50/75 field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    27,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["air_gap", 75], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w111_50_75_40mw_a_field_2026",
    "Knauf W111 50/75 40 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    34,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["air_gap", 35], ["glasswool", 40], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w112_50_100_a_field_2026",
    "Knauf W112 50/100 field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    35,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 100], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w112_50_100_40mw_a_field_2026",
    "Knauf W112 50/100 40 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    43,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 60], ["glasswool", 40], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w112_75_125_60mw_a_field_2026",
    "Knauf W112 75/125 60 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    44,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 65], ["glasswool", 60], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w112_100_150_80mw_a_field_2026",
    "Knauf W112 100/150 80 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    44,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 70], ["glasswool", 80], ["gypsum", 12.5], ["gypsum", 12.5]]
  ),
  verifiedEntry(
    "knauf_w112_50_100_db_field_2026",
    "Knauf W112 50/100 DB field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    35,
    FIELD_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 100],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w112_50_100_40mw_db_field_2026",
    "Knauf W112 50/100 DB 40 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    50,
    FIELD_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 60],
      ["glasswool", 40],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w112_75_125_60mw_db_field_2026",
    "Knauf W112 75/125 DB 60 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    52,
    FIELD_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 65],
      ["glasswool", 60],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w112_100_150_80mw_db_field_2026",
    "Knauf W112 100/150 DB 80 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    53,
    FIELD_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 70],
      ["glasswool", 80],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w113_50_125_40mw_a_field_2026",
    "Knauf W113 50/125 40 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    49,
    FIELD_STEEL_CONTEXT,
    [
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["air_gap", 85],
      ["glasswool", 40],
      ["gypsum", 12.5],
      ["gypsum", 12.5],
      ["gypsum", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w113_75_150_60mw_db_field_2026",
    "Knauf W113 75/150 DB 60 MW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    57,
    FIELD_STEEL_CONTEXT,
    [
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["air_gap", 90],
      ["glasswool", 60],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5],
      ["acoustic_gypsum_board", 12.5]
    ]
  ),
  verifiedEntry(
    "knauf_w118_wk2_1_0_50_101_40gw_a_field_2026",
    "Knauf W118 WK2 1.0 50/101 40 GW field table",
    KNAUF_SYSTEM_TABLES_URL,
    "field",
    "DnT,A,k",
    43,
    FIELD_STEEL_CONTEXT,
    [["gypsum", 12.5], ["gypsum", 12.5], ["air_gap", 61], ["glasswool", 40], ["gypsum", 12.5], ["gypsum", 12.5]]
  )
].map((entry) => ({
  ...entry,
  resolvedLayers: entry.layers.map((layer) => {
    const material = resolveMaterial(layer.materialId);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  })
}));

const APPROXIMATE_AIRBORNE_FIELD_COMPANION_CATALOG: ResolvedApproximateAirborneFieldCompanionEntry[] = [
  approximateFieldCompanionEntry(
    "xella_nl_ytong_massief_g2_300_240_field_companion_2026",
    "Xella NL Ytong Massief G2/300 240 mm approximate field companion",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    33,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 240], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_massief_g2_300_300_field_companion_2026",
    "Xella NL Ytong Massief G2/300 300 mm approximate field companion",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    35,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 300], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_massief_g2_300_365_field_companion_2026",
    "Xella NL Ytong Massief G2/300 365 mm approximate field companion",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    37,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 365], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_sep_aac_4_600_70_field_companion_2026",
    "Xella NL Ytong separatiepaneel AAC 4/600 70 mm approximate field companion",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    28,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 70], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_sep_aac_4_600_100_field_companion_2026",
    "Xella NL Ytong separatiepaneel AAC 4/600 100 mm approximate field companion",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    28,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 100], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_sep_aac_5_750_100_field_companion_2026",
    "Xella NL Ytong separatiepaneel AAC 5/750 100 mm approximate field companion",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    33,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_5_750", 100], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_70_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 70 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    28,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 70], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_100_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 100 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    31,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 100], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_150_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 150 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    34,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 150], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_200_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 200 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    37,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 200], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_240_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 240 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    39,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 240], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g4_600_300_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G4/600 300 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    41,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 300], ["skim_plaster", 3]]
  ),
  approximateFieldCompanionEntry(
    "xella_nl_ytong_cellenbetonblok_g5_800_100_field_companion_2026",
    "Xella NL Ytong cellenbetonblok G5/800 100 mm approximate field companion",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    33,
    LAB_MASONRY_CONTEXT,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g5_800", 100], ["skim_plaster", 3]]
  )
].map((entry) => ({
  ...entry,
  resolvedLayers: entry.layers.map((layer) => {
    const material = resolveMaterial(layer.materialId);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  })
}));

function canonicalMatchLayer(layer: ResolvedLayer): CanonicalMatchLayer {
  return {
    materialId: layer.material.id,
    role:
      layer.material.category === "gap"
        ? "gap"
        : layer.material.category === "insulation"
          ? "porous"
          : "solid",
    thicknessMm: round1(layer.thicknessMm)
  };
}

function numericNear(left: number | null | undefined, right: number | null | undefined, absTol: number): boolean {
  return typeof left === "number" && Number.isFinite(left) && typeof right === "number" && Number.isFinite(right)
    ? Math.abs(left - right) <= absTol
    : false;
}

function layersApproximatelyMatch(inputLayers: readonly ResolvedLayer[], referenceLayers: readonly ResolvedLayer[]): boolean {
  if (inputLayers.length !== referenceLayers.length || inputLayers.length === 0) {
    return false;
  }

  const left = inputLayers.map(canonicalMatchLayer);
  const right = referenceLayers.map(canonicalMatchLayer);

  return left.every((layer, index) => {
    const reference = right[index];

    return (
      Boolean(reference) &&
      layer.role === reference.role &&
      numericNear(layer.thicknessMm, reference.thicknessMm, 0.6) &&
      layer.materialId === reference.materialId
    );
  });
}

function preferredCatalogMode(context?: AirborneContext | null): VerifiedAirborneCatalogMode {
  return context?.contextMode && context.contextMode !== "element_lab" ? "field" : "lab";
}

function metaFieldMatches(
  inputContext: AirborneContext | null | undefined,
  referenceContext: Partial<AirborneContext>,
  field: keyof AirborneContext,
  ignoreValues: readonly string[] = [],
  absTol = 0
): boolean {
  const referenceValue = referenceContext[field];

  if (referenceValue == null) {
    return true;
  }

  if (typeof referenceValue === "string") {
    return ignoreValues.includes(referenceValue) || String(inputContext?.[field] ?? "") === referenceValue;
  }

  const inputValue = inputContext?.[field];

  return numericNear(
    typeof inputValue === "number" ? inputValue : null,
    typeof referenceValue === "number" ? referenceValue : null,
    absTol
  );
}

function essentialMetaMatches(
  inputContext: AirborneContext | null | undefined,
  referenceContext: Partial<AirborneContext>
): boolean {
  return (
    metaFieldMatches(inputContext, referenceContext, "connectionType", ["auto"]) &&
    metaFieldMatches(inputContext, referenceContext, "studType", ["auto"]) &&
    metaFieldMatches(inputContext, referenceContext, "airtightness", ["unknown"]) &&
    metaFieldMatches(inputContext, referenceContext, "studSpacingMm", [], 30)
  );
}

export function findVerifiedAirborneAssemblyMatch(
  inputLayers: readonly ResolvedLayer[],
  context?: AirborneContext | null
): VerifiedAirborneCatalogEntry | null {
  const desiredMode = preferredCatalogMode(context);
  let best: (ResolvedVerifiedAirborneCatalogEntry & { score: number }) | null = null;

  for (const entry of VERIFIED_AIRBORNE_CATALOG) {
    if (entry.sourceMode !== desiredMode) {
      continue;
    }

    if (!layersApproximatelyMatch(inputLayers, entry.resolvedLayers)) {
      continue;
    }

    if (!essentialMetaMatches(context, entry.matchContext)) {
      continue;
    }

    const score =
      (entry.matchContext.connectionType && entry.matchContext.connectionType !== "auto" ? 10 : 0) +
      (entry.matchContext.studType && entry.matchContext.studType !== "auto" ? 6 : 0) +
      (typeof entry.matchContext.studSpacingMm === "number" ? 3 : 0) +
      (entry.matchContext.airtightness && entry.matchContext.airtightness !== "unknown" ? 2 : 0);

    if (!best || score > best.score) {
      best = {
        ...entry,
        score
      };
    }
  }

  return best
    ? {
        id: best.id,
        label: best.label,
        layers: best.layers,
        matchContext: best.matchContext,
        metricLabel: best.metricLabel,
        metricValue: best.metricValue,
        source: best.source,
        sourceMode: best.sourceMode
      }
    : null;
}

// Wrap `findVerifiedAirborneAssemblyMatch` with a lab-mode fallback
// for field/building contexts. This is the single seam enabling the
// "lab Rw ceiling on apparent R'w" invariant for the common case
// where catalog coverage only has a lab-mode entry (e.g. Wienerberger
// Porotherm clay hollow brick, HELUZ, most published masonry test
// reports). Without the fallback, mass-law-overestimating materials
// yield field R'w > lab Rw which violates ISO 140-4.
export type VerifiedAirborneAssemblyMatchLookupResult = {
  match: VerifiedAirborneCatalogEntry;
  usedLabFallback: boolean;
};

export function findVerifiedAirborneAssemblyMatchWithLabFallback(
  inputLayers: readonly ResolvedLayer[],
  context?: AirborneContext | null
): VerifiedAirborneAssemblyMatchLookupResult | null {
  const direct = findVerifiedAirborneAssemblyMatch(inputLayers, context);
  if (direct) {
    return { match: direct, usedLabFallback: false };
  }

  const desiredMode = preferredCatalogMode(context);
  if (desiredMode === "lab") {
    return null;
  }

  const labMatch = findVerifiedAirborneAssemblyMatch(inputLayers, {
    ...(context ?? {}),
    contextMode: "element_lab"
  });

  if (!labMatch || labMatch.sourceMode !== "lab") {
    return null;
  }

  return { match: labMatch, usedLabFallback: true };
}

export function findApproximateAirborneFieldCompanionMatch(
  inputLayers: readonly ResolvedLayer[],
  context?: AirborneContext | null
): ApproximateAirborneFieldCompanionEntry | null {
  if (!context?.contextMode || context.contextMode === "element_lab") {
    return null;
  }

  let best: (ResolvedApproximateAirborneFieldCompanionEntry & { score: number }) | null = null;

  for (const entry of APPROXIMATE_AIRBORNE_FIELD_COMPANION_CATALOG) {
    if (!layersApproximatelyMatch(inputLayers, entry.resolvedLayers)) {
      continue;
    }

    if (!essentialMetaMatches(context, entry.matchContext)) {
      continue;
    }

    const score =
      (entry.matchContext.connectionType && entry.matchContext.connectionType !== "auto" ? 10 : 0) +
      (entry.matchContext.studType && entry.matchContext.studType !== "auto" ? 6 : 0) +
      (typeof entry.matchContext.studSpacingMm === "number" ? 3 : 0) +
      (entry.matchContext.airtightness && entry.matchContext.airtightness !== "unknown" ? 2 : 0);

    if (!best || score > best.score) {
      best = {
        ...entry,
        score
      };
    }
  }

  return best
    ? {
        id: best.id,
        label: best.label,
        layers: best.layers,
        matchContext: best.matchContext,
        metricLabel: best.metricLabel,
        metricValue: best.metricValue,
        source: best.source
      }
    : null;
}

function anchorCurveToMetric(
  curve: TransmissionLossCurve,
  computeMetric: (ratings: AssemblyRatings) => number | null,
  targetValue: number,
  context?: AirborneContext | null
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let currentCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  let currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  const sourceValues = [...currentCurve.transmissionLossDb];

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const currentMetric = computeMetric(currentRatings);

    if (currentMetric === null) {
      return {
        applied: false,
        curve: {
          frequenciesHz: [...curve.frequenciesHz],
          transmissionLossDb: [...curve.transmissionLossDb]
        },
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context)
      };
    }

    const delta = targetValue - currentMetric;

    if (Math.abs(delta) < 0.05) {
      break;
    }

    currentCurve = {
      frequenciesHz: [...currentCurve.frequenciesHz],
      transmissionLossDb: currentCurve.transmissionLossDb.map((value) => clamp(value + delta, 0, 95))
    };
    currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  }

  return {
    applied: currentCurve.transmissionLossDb.some((value, index) => Math.abs(value - sourceValues[index]) > 1e-6),
    curve: currentCurve,
    ratings: currentRatings
  };
}

function appendFieldBasis(field: FieldAirborneRating | undefined, suffix: string): string | undefined {
  if (!field?.basis) {
    return suffix;
  }

  return field.basis.includes(suffix) ? field.basis : `${field.basis} + ${suffix}`;
}

export function applyVerifiedAirborneCatalogAnchor(
  curve: TransmissionLossCurve,
  ratings: AssemblyRatings,
  inputLayers: readonly ResolvedLayer[],
  context?: AirborneContext | null,
  // Flanking penalty (dB) already folded into `curve`/`ratings` by
  // the overlay. Needed to compute the lab-fallback apparent target
  // `lab_benchmark - flankingPenaltyDb`; defaults to 0 for callers
  // that skip the airborne overlay entirely.
  flankingPenaltyDb?: number
): VerifiedAirborneAnchorResult {
  const lookup = findVerifiedAirborneAssemblyMatchWithLabFallback(inputLayers, context);

  if (!lookup) {
    return {
      applied: false,
      curve,
      match: null,
      ratings,
      warnings: []
    };
  }

  const { match, usedLabFallback } = lookup;

  if (!usedLabFallback && match.sourceMode === "lab") {
    const anchored = anchorCurveToMetric(curve, (nextRatings) => nextRatings.iso717.Rw, match.metricValue, context);

    return {
      applied: anchored.applied,
      curve: anchored.curve,
      match,
      ratings: anchored.ratings,
      warnings: anchored.applied
        ? [
            `Curated exact airborne lab match active: ${match.label}. DynEcho anchored the dynamic curve to official ${match.metricLabel} ${match.metricValue.toFixed(1)} dB.`
          ]
        : []
    };
  }

  if (usedLabFallback) {
    // Field/building context with only a lab-mode benchmark present.
    // Anchor the already-flanking-penalised curve so its Rw equals
    // `lab_benchmark - flanking_penalty_db`. That keeps ratings
    // consistent with physics: apparent R'w is the lab Rw ceiling
    // reduced by the overlay's attributed flanking magnitude, never
    // above it.
    const residualFlankingDb = Math.max(0, Number.isFinite(flankingPenaltyDb) ? (flankingPenaltyDb as number) : 0);
    const target = Math.max(0, match.metricValue - residualFlankingDb);
    const anchored = anchorCurveToMetric(
      curve,
      (nextRatings) => nextRatings.iso717.Rw,
      target,
      context
    );
    const field = anchored.ratings.field
      ? {
          ...anchored.ratings.field,
          basis: appendFieldBasis(anchored.ratings.field, "lab_fallback_apparent_ceiling")
        }
      : anchored.ratings.field;

    return {
      applied: anchored.applied,
      curve: anchored.curve,
      match,
      ratings: {
        ...anchored.ratings,
        ...(field ? { field } : {})
      },
      warnings: [
        anchored.applied
          ? `Curated airborne lab fallback active in field context: ${match.label}. DynEcho capped the apparent curve at lab ${match.metricLabel} ${match.metricValue.toFixed(1)} dB and subtracted the overlay's ${residualFlankingDb.toFixed(1)} dB flanking penalty.`
          : `Curated airborne lab fallback confirmed in field context: ${match.label}. The apparent curve already honours the lab ${match.metricLabel} ${match.metricValue.toFixed(1)} dB ceiling minus the overlay's ${residualFlankingDb.toFixed(1)} dB flanking penalty.`
      ]
    };
  }

  if (!(typeof ratings.field?.DnTA === "number")) {
    return {
      applied: false,
      curve,
      match,
      ratings,
      warnings: [
        `Curated exact airborne field match found: ${match.label}. The final apparent curve was not anchored because DnT-side geometry is still incomplete.`
      ]
    };
  }

  const anchored = anchorCurveToMetric(curve, (nextRatings) => nextRatings.field?.DnTA ?? null, match.metricValue, context);
  const field = anchored.ratings.field
    ? {
        ...anchored.ratings.field,
        DnTAk: match.metricLabel === "DnT,A,k" ? match.metricValue : anchored.ratings.field.DnTAk,
        basis: appendFieldBasis(anchored.ratings.field, "exact_verified_field_proxy_anchor")
      }
    : anchored.ratings.field;

  return {
    applied: anchored.applied,
    curve: anchored.curve,
    match,
    ratings: {
      ...anchored.ratings,
      ...(field ? { field } : {})
    },
    warnings: [
      anchored.applied
        ? `Curated exact airborne field match active: ${match.label}. DynEcho anchored the final apparent curve to official ${match.metricLabel} ${match.metricValue.toFixed(1)} dB through the local DnT,A proxy lane.`
        : `Curated exact airborne field match active: ${match.label}. DynEcho confirmed the final apparent curve already lands on official ${match.metricLabel} ${match.metricValue.toFixed(1)} dB through the local DnT,A proxy lane.`
    ]
  };
}

export function applyApproximateAirborneFieldCompanion(
  ratings: AssemblyRatings,
  inputLayers: readonly ResolvedLayer[],
  context?: AirborneContext | null
): ApproximateAirborneFieldCompanionResult {
  if (!context?.contextMode || context.contextMode === "element_lab") {
    return {
      applied: false,
      match: null,
      ratings,
      warnings: []
    };
  }

  if (typeof ratings.field?.DnTAk === "number") {
    return {
      applied: false,
      match: null,
      ratings,
      warnings: []
    };
  }

  const match = findApproximateAirborneFieldCompanionMatch(inputLayers, context);

  if (!match) {
    return {
      applied: false,
      match: null,
      ratings,
      warnings: []
    };
  }

  const field: FieldAirborneRating = {
    ...(ratings.field ?? {}),
    DnTAk: match.metricValue,
    basis: appendFieldBasis(ratings.field, "official_approximate_field_companion")
  };

  return {
    applied: true,
    match,
    ratings: {
      ...ratings,
      field
    },
    warnings: [
      `Official approximate airborne field companion available: ${match.label}. DynEcho carried published ${match.metricLabel} ${match.metricValue.toFixed(1)} dB separately from the live local DnT,A proxy because the source marks this value as project-dependent.`
    ]
  };
}
