import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const DYNAMIC_AIRBORNE_PATH = "packages/engine/src/dynamic-airborne.ts";
const GUARD_MODULE_PATH = "packages/engine/src/dynamic-airborne-correction-guards.ts";
const HELPERS_PATH = "packages/engine/src/dynamic-airborne-helpers.ts";
const CARTOGRAPHY_PATH = "docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md";
const SLICE_PLAN_PATH = "docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md";

const CARVED_GUARDS = [
  "applyDiamondHybridResilientFieldMidbandTrim",
  "applyHeavyUnframedCavityScreeningCap",
  "applyHighFillSingleBoardStudFieldLift",
  "applyMixedBoardEmptyCavityFieldMidbandLift",
  "applyMixedPlainModerateSingleBoardLabTemplate",
  "applyMixedPremiumSplitFieldLift",
  "applyMixedSecurityBoardDoubleStudFieldTrim",
  "applyMicroGapFillEquivalenceGuard",
  "applyNarrowHeavyDoubleLeafGapCap",
  "applyPremiumSingleBoardFieldCorrection",
  "applySingleLeafMasonryMonotonicFloor"
] as const;

const REMAINING_GUARD_ORDER = [
  "applyLinedMassiveMasonryMonotonicFloor",
  "applyFramedReinforcementMonotonicFloor",
  "applyAmbiguousFamilyBoundaryHold"
] as const;

const REMAINING_RECURSIVE_COMPOSER_GUARDS = [
  "applyLinedMassiveMasonryMonotonicFloor",
  "applyFramedReinforcementMonotonicFloor",
  "applyAmbiguousFamilyBoundaryHold"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function countPhysicalLines(source: string): number {
  return source.match(/\n/g)?.length ?? 0;
}

function extractFunctionSections(source: string): Map<string, string> {
  const lines = source.split(/\r?\n/);
  const starts = lines
    .map((line, index) => {
      const match = line.match(/^function (apply[A-Za-z0-9_]+)\(/);
      return match ? { name: match[1], start: index } : null;
    })
    .filter((entry): entry is { name: string; start: number } => entry !== null);

  return new Map(
    starts.map((entry, index) => {
      const nextStart = starts[index + 1]?.start ?? lines.findIndex((line, lineIndex) =>
        lineIndex > entry.start && /^function detectDynamicFamily\(/.test(line)
      );
      const end = nextStart >= 0 ? nextStart : lines.length;
      return [entry.name, lines.slice(entry.start, end).join("\n")];
    })
  );
}

describe("dynamic-airborne split v2 Gate B eleventh carve contract", () => {
  const source = readRepoFile(DYNAMIC_AIRBORNE_PATH);
  const guardModule = readRepoFile(GUARD_MODULE_PATH);
  const helpers = readRepoFile(HELPERS_PATH);
  const cartography = readRepoFile(CARTOGRAPHY_PATH);
  const slicePlan = readRepoFile(SLICE_PLAN_PATH);
  const sections = extractFunctionSections(source);

  it("pins the eleventh correction-guard carve and reduced composer file size", () => {
    expect(countPhysicalLines(source)).toBe(1824);
    expect(countPhysicalLines(guardModule)).toBe(1422);
    expect([...sections.keys()]).toEqual(REMAINING_GUARD_ORDER);
  });

  it("keeps all carved guards outside the composer file", () => {
    for (const guardName of CARVED_GUARDS) {
      expect(source).toContain(guardName);
      expect(source).not.toContain(`function ${guardName}`);
      expect(guardModule).toContain(`export function ${guardName}`);
    }
  });

  it("keeps recursive probing injected only through carved guard composer parameters", () => {
    expect(guardModule).toContain("composer: DynamicAirborneComposer");
    expect(guardModule).toContain("const equivalentResult = composer(equivalentLayers, {");
    expect(guardModule).toContain("const variantResult = composer(variantLayers, {");
    expect(guardModule).not.toContain("calculateDynamicAirborneResult(");
    expect(guardModule).toContain("buildNarrowGapContactEquivalentLayers");
    expect(guardModule).toContain("isAacLikeLayer");
    expect(guardModule).toContain("isMasonryLikeLayer");
    expect(guardModule).toContain("buildReducedThicknessVariant");
    expect(guardModule).toContain("isHeluzClayLayer");
    expect(guardModule).toContain("isCelconFinishedAircreteBuildUp");
    expect(guardModule).toContain("isYtongSeparatiePaneelBuildUp");
    expect(guardModule).toContain("isYtongCellenbetonblokBuildUp");
    expect(guardModule).toContain("isMasonryCoreLayer");
    expect(guardModule).toContain("summarizeHeavyUnframedCavityRisk");
    expect(guardModule).toContain("buildCalibratedMassLawCurve");
    expect(guardModule).toContain("shiftCurve(curve, -trimDb)");
    expect(guardModule).toContain("shiftCurve(curve, liftDb)");
    expect(guardModule).toContain("detectMixedEnhancedFilledSingleBoardFamily");
    expect(guardModule).toContain("detectSecurityFilledSingleBoardFamily");
    expect(guardModule).toContain("getMixedPlainModerateFamilyAndTemplateId");
    expect(guardModule).toContain("MIXED_PLAIN_MODERATE_FIELD_TEMPLATES");
    expect(guardModule).toContain("buildInterpolatedTemplateCurve");
    expect(guardModule).toContain("getMixedPlainPremiumFamilyAndTemplateId");
    expect(guardModule).toContain("MIXED_PLAIN_PREMIUM_FIELD_TEMPLATES");
    expect(guardModule).toContain("isPlainGypsumFilledSingleBoardCandidate");
    expect(guardModule).toContain("detectFireRatedFilledSingleBoardFamily");
    expect(guardModule).toContain("detectSymmetricEnhancedFilledSingleBoardFamily");
    expect(guardModule).toContain("octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 100, 1600, 0.45)");
    expect(guardModule).toContain("octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 100, 2000, 0.55)");
    expect(guardModule).toContain("octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 500, 3150, 0.4)");
  });

  it("leaves only the remaining recursive guards directly calling the composer", () => {
    const recursiveGuards = REMAINING_GUARD_ORDER.filter((name) =>
      sections.get(name)?.includes("calculateDynamicAirborneResult(")
    );

    expect(recursiveGuards).toEqual(REMAINING_RECURSIVE_COMPOSER_GUARDS);
  });

  it("records the landed eleventh carve and next carve target in docs", () => {
    for (const doc of [cartography, slicePlan]) {
      expect(doc).toContain("Gate B eleventh carve landed");
      expect(doc).toContain("applyNarrowHeavyDoubleLeafGapCap");
      expect(doc).toContain("dynamic-airborne-correction-guards.ts");
      expect(doc).toContain("applyLinedMassiveMasonryMonotonicFloor");
    }
    expect(helpers).toContain("export type DynamicAirborneComposer");
  });
});
