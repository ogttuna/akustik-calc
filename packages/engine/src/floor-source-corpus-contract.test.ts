import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const TUAS_OPEN_BOX_IDS = [
  "tuas_r2a_open_box_timber_measured_2026",
  "tuas_r2b_open_box_timber_measured_2026",
  "tuas_r3a_open_box_timber_measured_2026",
  "tuas_r3b_open_box_timber_measured_2026",
  "tuas_r5a_open_box_timber_measured_2026",
  "tuas_r5b_open_box_timber_measured_2026",
  "tuas_r6a_open_box_timber_measured_2026",
  "tuas_r6b_open_box_timber_measured_2026",
  "tuas_r7a_open_box_timber_measured_2026",
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r9b_open_box_timber_measured_2026",
  "tuas_r2c_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026",
  "tuas_r11b_open_box_timber_measured_2026"
] as const;

const TUAS_CLT_IDS = [
  "tuas_x2_clt140_measured_2026",
  "tuas_x3_clt140_measured_2026",
  "tuas_x4_clt140_measured_2026",
  "tuas_x5_clt140_measured_2026",
  "tuas_c2_clt260_measured_2026",
  "tuas_c3_clt260_measured_2026",
  "tuas_c4_clt260_measured_2026",
  "tuas_c5_clt260_measured_2026",
  "tuas_c7_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026",
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
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
  "dataholz_gdmnxn02_wet_clt_lab_2026",
  "dataholz_gdmnxn02_05_wet_clt_lab_2026",
  "dataholz_gdmtxn01_dry_clt_lab_2026",
  "dataholz_gdmtxa01a_clt_lab_2026",
  "dataholz_gdmnxn06_fill_clt_lab_2026",
  "dataholz_gdmnxn05_wet_clt_lab_2026",
  "dataholz_gdmnxa02a_00_clt_lab_2026",
  "dataholz_gdmnxa02a_02_clt_lab_2026"
] as const;

const REMAINING_DATAHOLZ_CLT_EXACT_ONLY_IDS = [
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

const UBIQ_STEEL_BOUND_IDS = [
  "ubiq_fl32_steel_200_lab_2026",
  "ubiq_fl32_steel_300_lab_2026"
] as const;

const UBIQ_OFFICIAL_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

function sortedIds<T extends string | number>(input: readonly T[]) {
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
    const ubiqSteelBoundIds = boundIds.filter((id) => id.startsWith("ubiq_fl32_steel_"));
    const ubiqOpenWebBoundIds = boundIds.filter((id) => id.startsWith("ubiq_fl33_open_web_steel_"));

    expect(sortedIds(tuasOpenBoxIds)).toEqual(sortedIds(TUAS_OPEN_BOX_IDS));
    expect(sortedIds(tuasCltIds)).toEqual(sortedIds(TUAS_CLT_IDS));
    expect(sortedIds(dataholzCltIds)).toEqual(sortedIds(DATAHOLZ_CLT_IDS));
    expect(sortedIds(dataholzTimberFrameIds)).toEqual(sortedIds(DATAHOLZ_TIMBER_FRAME_IDS));
    expect(sortedIds(ubiqOpenWebExactIds)).toEqual(sortedIds(UBIQ_OPEN_WEB_EXACT_IDS));
    expect(sortedIds(ubiqSteelBoundIds)).toEqual(sortedIds(UBIQ_STEEL_BOUND_IDS));
    expect(sortedIds(ubiqOpenWebBoundIds)).toEqual(sortedIds(UBIQ_OPEN_WEB_BOUND_IDS));
  });

  it("keeps the current UBIQ bound source cluster frozen around the shared official brochure URL", () => {
    const ubiqBoundRows = BOUND_FLOOR_SYSTEMS.filter(
      (system) => system.id.startsWith("ubiq_fl32_steel_") || system.id.startsWith("ubiq_fl33_open_web_steel_")
    );
    const steelJoistRows = ubiqBoundRows.filter((system) => system.id.startsWith("ubiq_fl32_steel_"));
    const openWebRows = ubiqBoundRows.filter((system) => system.id.startsWith("ubiq_fl33_open_web_steel_"));

    expect(new Set(ubiqBoundRows.map((system) => system.sourceLabel))).toEqual(new Set(["UBIQ official system table PDF"]));
    expect(new Set(ubiqBoundRows.map((system) => system.sourceUrl ?? ""))).toEqual(new Set([UBIQ_OFFICIAL_SYSTEM_TABLE_URL]));
    expect(sortedIds(steelJoistRows.map((system) => system.match.baseStructure?.thicknessMm ?? 0))).toEqual([200, 300]);
    expect(sortedIds(openWebRows.map((system) => system.match.baseStructure?.thicknessMm ?? 0))).toEqual([200, 300, 400]);
    expect(steelJoistRows.every((system) => system.match.baseStructure?.materialIds.includes("steel_joist_floor"))).toBe(true);
    expect(openWebRows.every((system) => system.match.baseStructure?.materialIds.includes("open_web_steel_floor"))).toBe(true);
  });

  it("keeps the current Dataholz CLT remaining exact-only slack explicit", () => {
    const exactIds = EXACT_FLOOR_SYSTEMS
      .map((system) => system.id)
      .filter((id) => id.startsWith("dataholz_") && id.includes("_clt_"));

    const dormantIds = exactIds.filter(
      (id) => !ACTIVE_DATAHOLZ_CLT_PREDICTOR_IDS.includes(id as (typeof ACTIVE_DATAHOLZ_CLT_PREDICTOR_IDS)[number])
    );

    expect(sortedIds(dormantIds)).toEqual(sortedIds(REMAINING_DATAHOLZ_CLT_EXACT_ONLY_IDS));
  });

  it("keeps the remaining Dataholz CLT exact-only slack on manual-match-disabled rows", () => {
    const remainingRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      REMAINING_DATAHOLZ_CLT_EXACT_ONLY_IDS.includes(system.id as (typeof REMAINING_DATAHOLZ_CLT_EXACT_ONLY_IDS)[number])
    );

    expect(sortedIds(remainingRows.map((system) => system.id))).toEqual(sortedIds(REMAINING_DATAHOLZ_CLT_EXACT_ONLY_IDS));
    expect(remainingRows.every((system) => system.manualMatch === false && !system.estimateMatch)).toBe(true);
  });
});
