import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const IMPORTED_UBIQ_SUPPORTED_FAMILIES = ["fl24", "fl26", "fl28"] as const;
const IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS = [200, 300, 400] as const;
const IMPORTED_UBIQ_SUPPORTED_DECKS = [16, 19] as const;

function importedSupportedTimberId(
  family: (typeof IMPORTED_UBIQ_SUPPORTED_FAMILIES)[number],
  joistMm: (typeof IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS)[number],
  inexFloorMm: (typeof IMPORTED_UBIQ_SUPPORTED_DECKS)[number]
): string {
  const deckSuffix = inexFloorMm === 16 ? "_16mm" : "";

  return `ubiq_${family}_open_web_steel_${joistMm}${deckSuffix}_exact_lab_2026`;
}

function importedSupportedBareId(
  family: (typeof IMPORTED_UBIQ_SUPPORTED_FAMILIES)[number],
  joistMm: (typeof IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS)[number],
  inexFloorMm: (typeof IMPORTED_UBIQ_SUPPORTED_DECKS)[number]
): string {
  return `ubiq_${family}_open_web_steel_${joistMm}_${inexFloorMm}mm_bare_exact_lab_2026`;
}

function importedSupportedCarpetBoundId(
  family: (typeof IMPORTED_UBIQ_SUPPORTED_FAMILIES)[number],
  joistMm: (typeof IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS)[number],
  inexFloorMm: (typeof IMPORTED_UBIQ_SUPPORTED_DECKS)[number]
): string {
  return `ubiq_${family}_open_web_steel_${joistMm}_${inexFloorMm}mm_carpet_lnw_plus_ci_bound_lab_2026`;
}

const IMPORTED_UBIQ_OPEN_WEB_EXACT_IDS = IMPORTED_UBIQ_SUPPORTED_FAMILIES.flatMap((family) =>
  IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS.flatMap((joistMm) =>
    IMPORTED_UBIQ_SUPPORTED_DECKS.flatMap((inexFloorMm) => [
      importedSupportedBareId(family, joistMm, inexFloorMm),
      importedSupportedTimberId(family, joistMm, inexFloorMm)
    ])
  )
);

const IMPORTED_UBIQ_SUPPORTED_CARPET_BOUND_IDS = IMPORTED_UBIQ_SUPPORTED_FAMILIES.flatMap((family) =>
  IMPORTED_UBIQ_SUPPORTED_JOIST_DEPTHS.flatMap((joistMm) =>
    IMPORTED_UBIQ_SUPPORTED_DECKS.map((inexFloorMm) => importedSupportedCarpetBoundId(family, joistMm, inexFloorMm))
  )
);

const IMPORTED_UBIQ_OPEN_WEB_BOUND_IDS = [
  "ubiq_fl33_open_web_steel_200_lab_2026",
  "ubiq_fl33_open_web_steel_300_lab_2026",
  "ubiq_fl33_open_web_steel_400_lab_2026"
] as const;

const IMPORTED_UBIQ_STEEL_BOUND_IDS = [
  "ubiq_fl32_steel_200_lab_2026",
  "ubiq_fl32_steel_300_lab_2026"
] as const;

const IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER = [
  { joistMm: 200, inexFloorMm: 16, lnW: 52, lnWPlusCi: 51, rw: 62, rwCtr: 55 },
  { joistMm: 300, inexFloorMm: 16, lnW: 51, lnWPlusCi: 49, rw: 63, rwCtr: 57 },
  { joistMm: 400, inexFloorMm: 16, lnW: 50, lnWPlusCi: 48, rw: 63, rwCtr: 57 }
] as const;

const IMPORTED_VISIBLE_FL28_FRLD_BOUND_400 = {
  carpetLnWPlusCiUpperBound: 45,
  currentVisibleSourceFamily: "FL-28 (FRL/D)",
  inexFloorMm: 19,
  joistMm: 400,
  lnWUpperBound: 51,
  rw: 63,
  rwCtr: 58
} as const;

const UBIQ_VISIBLE_FRLD_FAMILY_MAPPING = {
  openWeb: "FL-28 (FRL/D)",
  steelJoist: "FL-17 (FRL/D)"
} as const;

const UBIQ_OFFICIAL_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";
const UBIQ_OFFICIAL_FLOOR_SOLUTIONS_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-SOLUTIONS-16PP-2023-1.pdf";

const UBIQ_SECONDARY_VISIBLE_FRLD_FAMILY_MAPPING = {
  openWeb: "FL-26 (FRL/D)",
  steelJoist: "FL-17 (FRL/D)"
} as const;

const IMPORTED_VISIBLE_FL24_EXACT_TIER = [
  {
    carpetLnWPlusCiUpperBound: 45,
    family: "FL-24",
    timberLnW16Mm: [55, 54, 53],
    timberLnW19Mm: [55, 54, 53]
  }
] as const;

const IMPORTED_VISIBLE_FL26_EXACT_TIER = [
  {
    carpetLnWPlusCiUpperBound: 45,
    family: "FL-26",
    timberLnW16Mm: [54, 53, 53],
    timberLnW19Mm: [54, 53, 53]
  }
] as const;

const UBIQ_OPEN_WEB_WEAK_BAND_SOURCE_VALUES = [
  {
    carpetLnWPlusCi: [64, 64, 63],
    family: "FL-23",
    timberLnW: [71, 70, 70]
  },
  {
    carpetLnWPlusCi: [64, 63, 63],
    family: "FL-25",
    timberLnW: [71, 70, 70]
  },
  {
    carpetLnWPlusCi: [63, 62, 62],
    family: "FL-27",
    timberLnW: [70, 69, 69]
  }
] as const;

function sortedValues<T extends string | number>(input: readonly T[]) {
  return [...input].sort();
}

function requireNumericValues(input: readonly (number | null | undefined)[], label: string) {
  const missingIndex = input.findIndex((value) => typeof value !== "number");

  if (missingIndex !== -1) {
    throw new Error(`${label} is missing a numeric fixture value at index ${missingIndex}`);
  }

  return input as readonly number[];
}

describe("UBIQ candidate backlog contract", () => {
  it("keeps the current imported UBIQ open-web exact and bound subsets explicit", () => {
    const importedExactRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) =>
        system.id.startsWith("ubiq_fl24_open_web_steel_") ||
        system.id.startsWith("ubiq_fl26_open_web_steel_") ||
        system.id.startsWith("ubiq_fl28_open_web_steel_")
    );
    const importedBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl33_open_web_steel_"));
    const importedSupportedBoundRows = BOUND_FLOOR_SYSTEMS.filter(
      (system) =>
        system.id.startsWith("ubiq_fl24_open_web_steel_") ||
        system.id.startsWith("ubiq_fl26_open_web_steel_") ||
        system.id.startsWith("ubiq_fl28_open_web_steel_")
    );

    expect(sortedValues(importedExactRows.map((system) => system.id))).toEqual(sortedValues(IMPORTED_UBIQ_OPEN_WEB_EXACT_IDS));
    expect(sortedValues(importedBoundRows.map((system) => system.id))).toEqual(sortedValues(IMPORTED_UBIQ_OPEN_WEB_BOUND_IDS));
    expect(sortedValues(importedSupportedBoundRows.map((system) => system.id))).toEqual(
      sortedValues(IMPORTED_UBIQ_SUPPORTED_CARPET_BOUND_IDS)
    );
    expect(importedExactRows).toHaveLength(36);
    expect(importedExactRows.filter((system) => system.id.includes("_bare_"))).toHaveLength(18);
    expect(importedExactRows.filter((system) => system.id.includes("carpet"))).toHaveLength(0);
    expect(importedSupportedBoundRows).toHaveLength(18);
    expect(new Set(importedSupportedBoundRows.map((system) => system.impactBounds.LnWPlusCIUpperBound))).toEqual(new Set([45]));
    expect(new Set(importedSupportedBoundRows.map((system) => system.impactBounds.LnWUpperBound))).toEqual(new Set([undefined]));
    expect(new Set(importedExactRows.map((system) => system.airborneRatings.RwCtrSemantic))).toEqual(new Set(["rw_plus_ctr"]));

    const importedExactDecks = requireNumericValues(
      importedExactRows.map((system) => system.match.floatingScreed?.thicknessMm),
      "UBIQ exact deck thicknesses"
    );
    const importedExactDepths = requireNumericValues(
      importedExactRows.map((system) => system.match.baseStructure?.thicknessMm),
      "UBIQ exact joist depths"
    );
    const importedBoundDepths = requireNumericValues(
      importedBoundRows.map((system) => system.match.baseStructure?.thicknessMm),
      "UBIQ bound joist depths"
    );

    expect(sortedValues(importedExactDecks)).toEqual([...Array(18).fill(16), ...Array(18).fill(19)]);
    expect(sortedValues(importedExactDepths)).toEqual([...Array(12).fill(200), ...Array(12).fill(300), ...Array(12).fill(400)]);
    expect(sortedValues(importedBoundDepths)).toEqual([200, 300, 400]);
  });

  it("keeps the current UBIQ FRL/D bound ids frozen as internal ids while provenance stays on the shared official brochure", () => {
    const importedSteelBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl32_steel_"));
    const importedOpenWebBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl33_open_web_steel_"));

    expect(sortedValues(importedSteelBoundRows.map((system) => system.id))).toEqual(sortedValues(IMPORTED_UBIQ_STEEL_BOUND_IDS));
    expect(sortedValues(importedOpenWebBoundRows.map((system) => system.id))).toEqual(sortedValues(IMPORTED_UBIQ_OPEN_WEB_BOUND_IDS));
    expect(sortedValues(importedSteelBoundRows.map((system) => system.label))).toEqual([
      "UBIQ FL-32 | 200 mm steel joist / purlin | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
      "UBIQ FL-32 | 300 mm steel joist / purlin | INEX FLOOR 19 | 2 x 16 mm resilient ceiling"
    ]);
    expect(sortedValues(importedOpenWebBoundRows.map((system) => system.label))).toEqual([
      "UBIQ FL-33 | 200 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
      "UBIQ FL-33 | 300 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling",
      "UBIQ FL-33 | 400 mm open-web / rolled steel | INEX FLOOR 19 | 2 x 16 mm resilient ceiling"
    ]);
    expect(new Set(importedSteelBoundRows.map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_OFFICIAL_SYSTEM_TABLE_URL])
    );
    expect(new Set(importedOpenWebBoundRows.map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_OFFICIAL_SYSTEM_TABLE_URL])
    );
    expect(UBIQ_VISIBLE_FRLD_FAMILY_MAPPING.steelJoist).toBe("FL-17 (FRL/D)");
    expect(UBIQ_VISIBLE_FRLD_FAMILY_MAPPING.openWeb).toBe("FL-28 (FRL/D)");
  });

  it("keeps the secondary official floor-solutions FRL/D drift explicit without turning it into a new bound import or runtime rename", () => {
    const importedOpenWebBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl33_open_web_steel_"));

    expect(sortedValues(importedOpenWebBoundRows.map((system) => system.id))).toEqual(sortedValues(IMPORTED_UBIQ_OPEN_WEB_BOUND_IDS));
    expect(
      sortedValues(
        requireNumericValues(
          importedOpenWebBoundRows.map((system) => system.match.baseStructure?.thicknessMm),
          "UBIQ open-web bound depths"
        )
      )
    ).toEqual([200, 300, 400]);
    expect(UBIQ_OFFICIAL_FLOOR_SOLUTIONS_URL).toBe(
      "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-SOLUTIONS-16PP-2023-1.pdf"
    );
    expect(UBIQ_VISIBLE_FRLD_FAMILY_MAPPING.openWeb).toBe("FL-28 (FRL/D)");
    expect(UBIQ_SECONDARY_VISIBLE_FRLD_FAMILY_MAPPING.openWeb).toBe("FL-26 (FRL/D)");
    expect(UBIQ_VISIBLE_FRLD_FAMILY_MAPPING.steelJoist).toBe("FL-17 (FRL/D)");
    expect(UBIQ_SECONDARY_VISIBLE_FRLD_FAMILY_MAPPING.steelJoist).toBe("FL-17 (FRL/D)");
  });

  it("keeps the visible FL-24 2 x 13 mm resilient corridor explicitly imported as exact-only source rows", () => {
    const importedExactPairs = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl24_open_web_steel_")).map((system) => {
        const joistMm = system.match.baseStructure?.thicknessMm ?? 0;
        const inexFloorMm = system.match.floatingScreed?.thicknessMm ?? 0;

        return `${joistMm}-${inexFloorMm}`;
      })
    );

    expect(IMPORTED_VISIBLE_FL24_EXACT_TIER.map((candidate) => candidate.family)).toEqual(["FL-24"]);

    for (const candidate of IMPORTED_VISIBLE_FL24_EXACT_TIER) {
      expect(candidate.carpetLnWPlusCiUpperBound).toBe(45);
      expect(candidate.timberLnW16Mm).toEqual([55, 54, 53]);
      expect(candidate.timberLnW19Mm).toEqual([55, 54, 53]);
    }

    expect(
      new Set(
        EXACT_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl24_open_web_steel_")).map(
          (system) => system.familyEstimateEligible
        )
      )
    ).toEqual(new Set([false]));

    expect(importedExactPairs).toEqual(
      new Set(["200-16", "200-19", "300-16", "300-19", "400-16", "400-19"])
    );
  });

  it("keeps the visible FL-28 16 mm exact siblings explicitly imported beside the older 19 mm corridor", () => {
    const importedExactPairs = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl28_open_web_steel_")).map((system) => {
        const joistMm = system.match.baseStructure?.thicknessMm ?? 0;
        const inexFloorMm = system.match.floatingScreed?.thicknessMm ?? 0;

        return `${joistMm}-${inexFloorMm}`;
      })
    );

    for (const candidate of IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER) {
      expect(importedExactPairs.has(`${candidate.joistMm}-${candidate.inexFloorMm}`)).toBe(true);
    }

    expect(IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER.map((candidate) => `${candidate.joistMm}-${candidate.inexFloorMm}`)).toEqual(
      ["200-16", "300-16", "400-16"]
    );
    expect(IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER.map((candidate) => candidate.lnW)).toEqual([52, 51, 50]);
    expect(IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER.map((candidate) => candidate.lnWPlusCi)).toEqual([51, 49, 48]);
    expect(IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER.map((candidate) => candidate.rw)).toEqual([62, 63, 63]);
    expect(IMPORTED_VISIBLE_FL28_EXACT_16MM_TIER.map((candidate) => candidate.rwCtr)).toEqual([55, 57, 57]);
  });

  it("keeps the visible FL-28 FRL/D 400 mm bound sibling explicitly imported beside the existing 200 and 300 rows", () => {
    const importedBoundDepths = requireNumericValues(
      BOUND_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl33_open_web_steel_")).map(
        (system) => system.match.baseStructure?.thicknessMm
      ),
      "UBIQ FL-28 FRL/D bound depths"
    );

    expect(sortedValues(importedBoundDepths)).toEqual([200, 300, 400]);
    expect(importedBoundDepths).toContain(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.joistMm);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.currentVisibleSourceFamily).toBe("FL-28 (FRL/D)");
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.inexFloorMm).toBe(19);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.lnWUpperBound).toBe(51);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.carpetLnWPlusCiUpperBound).toBe(45);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.rw).toBe(63);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.rwCtr).toBe(58);
  });

  it("keeps the visible FL-26 2 x 16 mm exact corridor explicitly imported as the second adjacent-family widening pass", () => {
    const importedExactPairs = new Set(
      EXACT_FLOOR_SYSTEMS.filter((system) => system.id.startsWith("ubiq_fl26_open_web_steel_")).map((system) => {
        const joistMm = system.match.baseStructure?.thicknessMm ?? 0;
        const inexFloorMm = system.match.floatingScreed?.thicknessMm ?? 0;

        return `${joistMm}-${inexFloorMm}`;
      })
    );

    expect(IMPORTED_VISIBLE_FL26_EXACT_TIER.map((candidate) => candidate.family)).toEqual(["FL-26"]);

    for (const candidate of IMPORTED_VISIBLE_FL26_EXACT_TIER) {
      expect(candidate.carpetLnWPlusCiUpperBound).toBe(45);
      expect(candidate.timberLnW16Mm.every((value) => value <= 55)).toBe(true);
      expect(candidate.timberLnW19Mm.every((value) => value <= 55)).toBe(true);
    }

    expect(importedExactPairs).toEqual(
      new Set(["200-16", "200-19", "300-16", "300-19", "400-16", "400-19"])
    );
  });

  it("keeps the supported resilient carpet lane modeled only as explicit Ln,w+CI bound support", () => {
    const supportedExactRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      /^ubiq_fl(?:24|26|28)_open_web_steel_/u.test(system.id)
    );
    const supportedBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) =>
      /^ubiq_fl(?:24|26|28)_open_web_steel_/u.test(system.id)
    );

    expect(IMPORTED_VISIBLE_FL24_EXACT_TIER[0]?.carpetLnWPlusCiUpperBound).toBe(45);
    expect(IMPORTED_VISIBLE_FL26_EXACT_TIER[0]?.carpetLnWPlusCiUpperBound).toBe(45);
    expect(IMPORTED_VISIBLE_FL28_FRLD_BOUND_400.carpetLnWPlusCiUpperBound).toBe(45);
    expect(supportedExactRows.some((system) => system.id.includes("carpet"))).toBe(false);
    expect(sortedValues(supportedBoundRows.map((system) => system.id))).toEqual(
      sortedValues(IMPORTED_UBIQ_SUPPORTED_CARPET_BOUND_IDS)
    );
    expect(new Set(supportedBoundRows.map((system) => system.impactBounds.LnWPlusCIUpperBound))).toEqual(new Set([45]));
    expect(new Set(supportedBoundRows.map((system) => system.impactBounds.LnWUpperBound))).toEqual(new Set([undefined]));
  });

  it("keeps FL-23, FL-25, and FL-27 exact-only while they remain materially weaker than the FL-24/26/28 corridor", () => {
    const importedWeakBandRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id)
    );

    expect(UBIQ_OPEN_WEB_WEAK_BAND_SOURCE_VALUES.map((candidate) => candidate.family)).toEqual(["FL-23", "FL-25", "FL-27"]);
    expect(importedWeakBandRows).toHaveLength(54);
    expect(new Set(importedWeakBandRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));

    for (const candidate of UBIQ_OPEN_WEB_WEAK_BAND_SOURCE_VALUES) {
      expect(candidate.timberLnW.every((value) => value >= 69)).toBe(true);
      expect(candidate.carpetLnWPlusCi.every((value) => value >= 62)).toBe(true);
    }
  });
});
