import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const TUAS_OPEN_BOX_IDS = [
  "tuas_r2a_open_box_timber_measured_2026",
  "tuas_r2b_open_box_timber_measured_2026",
  "tuas_r3a_open_box_timber_measured_2026",
  "tuas_r3b_open_box_timber_measured_2026",
  "tuas_r5a_open_box_timber_measured_2026",
  "tuas_r5b_open_box_timber_measured_2026",
  "tuas_r11b_open_box_timber_measured_2026"
] as const;

const TUAS_CLT_IDS = [
  "tuas_x2_clt140_measured_2026",
  "tuas_x5_clt140_measured_2026",
  "tuas_c2_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026"
] as const;

const DATAHOLZ_CLT_IDS = [
  "dataholz_gdmnxn02_wet_clt_lab_2026",
  "dataholz_gdmnxn02_05_wet_clt_lab_2026",
  "dataholz_gdmnxn05_wet_clt_lab_2026",
  "dataholz_gdmtxn01_dry_clt_lab_2026",
  "dataholz_gdmnxn06_fill_clt_lab_2026",
  "dataholz_gdmnxa02a_00_clt_lab_2026",
  "dataholz_gdmnxa02a_02_clt_lab_2026",
  "dataholz_gdmtxa01a_clt_lab_2026",
  "dataholz_gdmtxa04a_clt_lab_2026"
] as const;

const ACTIVE_DATAHOLZ_CLT_PREDICTOR_IDS = [
  "dataholz_gdmtxn01_dry_clt_lab_2026",
  "dataholz_gdmtxa01a_clt_lab_2026",
  "dataholz_gdmnxn06_fill_clt_lab_2026",
  "dataholz_gdmnxn05_wet_clt_lab_2026",
  "dataholz_gdmnxa02a_00_clt_lab_2026",
  "dataholz_gdmnxa02a_02_clt_lab_2026"
] as const;

const DORMANT_DATAHOLZ_CLT_IDS = [
  "dataholz_gdmnxn02_wet_clt_lab_2026",
  "dataholz_gdmnxn02_05_wet_clt_lab_2026",
  "dataholz_gdmtxa04a_clt_lab_2026"
] as const;

const DATAHOLZ_TIMBER_FRAME_IDS = [
  "dataholz_gdsnxn01a_timber_frame_lab_2026",
  "dataholz_gdrnxa01a_timber_frame_lab_2026",
  "dataholz_gdrnxa05b_timber_frame_lab_2026",
  "dataholz_gdrnxa07a_timber_frame_lab_2026",
  "dataholz_gdrnxa11a_timber_frame_lab_2026",
  "dataholz_gdrnxa03b_timber_frame_lab_2026",
  "dataholz_gdrtxn01a_timber_frame_dry_lab_2026",
  "dataholz_gdrtxn02b_timber_frame_dry_lab_2026",
  "dataholz_gdrtxa03b_timber_frame_dry_lab_2026",
  "dataholz_gdrtxa06a_timber_frame_dry_lab_2026"
] as const;

const UBIQ_OPEN_WEB_EXACT_IDS = [
  "ubiq_fl24_open_web_steel_200_16mm_exact_lab_2026",
  "ubiq_fl24_open_web_steel_200_exact_lab_2026",
  "ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026",
  "ubiq_fl24_open_web_steel_300_exact_lab_2026",
  "ubiq_fl24_open_web_steel_400_16mm_exact_lab_2026",
  "ubiq_fl24_open_web_steel_400_exact_lab_2026",
  "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
  "ubiq_fl26_open_web_steel_200_exact_lab_2026",
  "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
  "ubiq_fl26_open_web_steel_300_exact_lab_2026",
  "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026",
  "ubiq_fl26_open_web_steel_400_exact_lab_2026",
  "ubiq_fl28_open_web_steel_200_16mm_exact_lab_2026",
  "ubiq_fl28_open_web_steel_200_exact_lab_2026",
  "ubiq_fl28_open_web_steel_300_16mm_exact_lab_2026",
  "ubiq_fl28_open_web_steel_300_exact_lab_2026",
  "ubiq_fl28_open_web_steel_400_16mm_exact_lab_2026",
  "ubiq_fl28_open_web_steel_400_exact_lab_2026"
] as const;

const UBIQ_OPEN_WEB_BOUND_IDS = [
  "ubiq_fl33_open_web_steel_200_lab_2026",
  "ubiq_fl33_open_web_steel_300_lab_2026",
  "ubiq_fl33_open_web_steel_400_lab_2026"
] as const;

function sortedIds(input: readonly string[]) {
  return [...input].sort();
}

describe("floor source corpus contract", () => {
  it("keeps the current TUAS, Dataholz, and UBIQ floor-family source clusters stable", () => {
    const exactIds = EXACT_FLOOR_SYSTEMS.map((system) => system.id);
    const boundIds = BOUND_FLOOR_SYSTEMS.map((system) => system.id);

    const tuasOpenBoxIds = exactIds.filter((id) => id.startsWith("tuas_") && id.includes("open_box"));
    const tuasCltIds = exactIds.filter((id) => id.startsWith("tuas_") && id.includes("clt"));
    const dataholzCltIds = exactIds.filter((id) => id.startsWith("dataholz_") && id.includes("_clt_"));
    const dataholzTimberFrameIds = exactIds.filter((id) => id.startsWith("dataholz_") && id.includes("timber_frame"));
    const ubiqOpenWebExactIds = exactIds.filter(
      id =>
        id.startsWith("ubiq_fl24_open_web_steel_") ||
        id.startsWith("ubiq_fl26_open_web_steel_") ||
        id.startsWith("ubiq_fl28_open_web_steel_")
    );
    const ubiqOpenWebBoundIds = boundIds.filter((id) => id.startsWith("ubiq_fl33_open_web_steel_"));

    expect(sortedIds(tuasOpenBoxIds)).toEqual(sortedIds(TUAS_OPEN_BOX_IDS));
    expect(sortedIds(tuasCltIds)).toEqual(sortedIds(TUAS_CLT_IDS));
    expect(sortedIds(dataholzCltIds)).toEqual(sortedIds(DATAHOLZ_CLT_IDS));
    expect(sortedIds(dataholzTimberFrameIds)).toEqual(sortedIds(DATAHOLZ_TIMBER_FRAME_IDS));
    expect(sortedIds(ubiqOpenWebExactIds)).toEqual(sortedIds(UBIQ_OPEN_WEB_EXACT_IDS));
    expect(sortedIds(ubiqOpenWebBoundIds)).toEqual(sortedIds(UBIQ_OPEN_WEB_BOUND_IDS));
  });

  it("keeps the current Dataholz CLT dormant exact-only slack explicit", () => {
    const exactIds = EXACT_FLOOR_SYSTEMS
      .map((system) => system.id)
      .filter((id) => id.startsWith("dataholz_") && id.includes("_clt_"));

    const dormantIds = exactIds.filter(
      (id) => !ACTIVE_DATAHOLZ_CLT_PREDICTOR_IDS.includes(id as (typeof ACTIVE_DATAHOLZ_CLT_PREDICTOR_IDS)[number])
    );

    expect(sortedIds(dormantIds)).toEqual(sortedIds(DORMANT_DATAHOLZ_CLT_IDS));
  });
});
