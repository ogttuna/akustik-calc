import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildRatingsFromCurve } from "./curve-rating";
import { IMPACT_RATING_FREQS_THIRD } from "./impact-iso717";
import {
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_CANDIDATE_ID,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_ACTION,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_FILE,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_LABEL,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_PLAN_DOC,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_STATUS,
  ratingsFromOwnedCurve
} from "./spectral-rating";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1";

const BACKBONE_FILE = "packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts";
const BACKBONE_PLAN_DOC = "docs/calculator/POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN_2026-06-29.md";

const BACKBONE_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 0,
  reusableRatingProceduresMoved: 3,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 6
} as const;

const AIRBORNE_FREQUENCIES_HZ = [
  80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
  2000, 2500, 3150, 4000
] as const;
const AIRBORNE_TRANSMISSION_LOSS_DB = [
  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48
] as const;
const OITC_TRANSMISSION_LOSS_DB = [
  20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 43, 44, 45, 46, 47, 48
] as const;
const IMPACT_LEVELS_DB = IMPACT_RATING_FREQS_THIRD.map((frequency, index) => 58 + (index % 4) + (frequency > 1000 ? 2 : 0));

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  BACKBONE_PLAN_DOC,
  POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 spectral rating backbone V1", () => {
  it("lands the support slice without runtime value movement and selects the route/input family surface", () => {
    for (const path of [
      PREVIOUS_RERANK_FILE,
      BACKBONE_FILE,
      BACKBONE_PLAN_DOC,
      POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    expect(POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN).toBe("post_v1_spectral_rating_backbone_v1_plan");
    expect(POST_V1_SPECTRAL_RATING_BACKBONE_V1_STATUS).toBe(
      "post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1"
    );
    expect(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_CANDIDATE_ID).toBe("post_v1_spectral_rating_backbone_v1");
    expect(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_ACTION).toBe(
      "post_v1_route_input_family_first_class_surface_v1_plan"
    );
    expect(BACKBONE_COUNTERS).toMatchObject({
      newCalculableRequestShapes: 0,
      newCalculableTargetOutputs: 0,
      requiredPhysicalInputsCaptured: 0,
      reusableRatingProceduresMoved: 3,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("derives only basis-valid airborne ISO/STC companions from an owned transmission-loss curve", () => {
    const expected = buildRatingsFromCurve(AIRBORNE_FREQUENCIES_HZ, AIRBORNE_TRANSMISSION_LOSS_DB);
    const result = ratingsFromOwnedCurve({
      curve: {
        frequenciesHz: [...AIRBORNE_FREQUENCIES_HZ],
        transmissionLossDb: [...AIRBORNE_TRANSMISSION_LOSS_DB]
      },
      procedure: "airborne_iso7171_astm_e413_from_transmission_loss_curve",
      requestedOutputs: ["Rw", "STC", "C", "Ctr", "OITC", "IIC"]
    });

    expect(result.status).toBe("rated");
    expect(result.supportedOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.blockedOutputs).toEqual([
      expect.objectContaining({ output: "OITC" }),
      expect.objectContaining({ output: "IIC" })
    ]);
    expect(result.ratings?.iso717).toMatchObject({
      C: expected.iso717.C,
      Ctr: expected.iso717.Ctr,
      Rw: expected.iso717.Rw
    });
    expect(result.ratings?.astmE413.STC).toBe(expected.astmE413.STC);
    expect(result.astmE1332).toBeUndefined();
    expect(result.astmE989).toBeUndefined();
  });

  it("rates OITC through ASTM E1332 and blocks ISO, indoor, and impact companions", () => {
    const result = ratingsFromOwnedCurve({
      curve: {
        frequenciesHz: [...AIRBORNE_FREQUENCIES_HZ],
        transmissionLossDb: [...OITC_TRANSMISSION_LOSS_DB]
      },
      procedure: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
      requestedOutputs: ["OITC", "Rw", "STC", "NISR", "DnT,w", "IIC"],
      requiredContextInputs: ["facadeOutdoorContext=outdoor_indoor_facade"]
    });
    const legacyIsoOnly = ratingsFromOwnedCurve({
      curve: {
        frequenciesHz: AIRBORNE_FREQUENCIES_HZ.slice(1, -1),
        transmissionLossDb: OITC_TRANSMISSION_LOSS_DB.slice(1, -1)
      },
      procedure: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
      requestedOutputs: ["OITC"]
    });

    expect(result.status).toBe("rated");
    expect(result.supportedOutputs).toEqual(["OITC"]);
    expect(result.astmE1332).toMatchObject({
      OITC: 32,
      bandSet: "one_third_octave_80_4000",
      estimated: true
    });
    expect(result.ratingAdapterBasisSet).toEqual([
      expect.objectContaining({
        adapterId: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
        metricId: "OITC",
        ratingStandard: "ASTM E1332"
      })
    ]);
    expect(result.blockedOutputs.map((blocked) => blocked.output)).toEqual([
      "Rw",
      "STC",
      "NISR",
      "DnT,w",
      "IIC"
    ]);
    expect(legacyIsoOnly).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining([
        "frequencyBandSet=one_third_octave_80_4000",
        "frequencyHz=80",
        "frequencyHz=4000"
      ]),
      status: "needs_input",
      supportedOutputs: []
    });
  });

  it("routes ASTM E989 impact curves through the same coverage primitive without aliasing ISO impact metrics", () => {
    const lab = ratingsFromOwnedCurve({
      frequenciesHz: IMPACT_RATING_FREQS_THIRD,
      levelsDb: IMPACT_LEVELS_DB,
      procedure: "astm_e989_iic_aiic_from_impact_level_curve",
      requestedOutputs: ["IIC", "AIIC", "Ln,w", "DeltaLw"],
      sourceContext: "lab"
    });
    const missing = ratingsFromOwnedCurve({
      frequenciesHz: IMPACT_RATING_FREQS_THIRD.slice(0, -1),
      levelsDb: IMPACT_LEVELS_DB.slice(0, -1),
      procedure: "astm_e989_iic_aiic_from_impact_level_curve",
      requestedOutputs: ["IIC"],
      sourceContext: "lab"
    });

    expect(lab.status).toBe("rated");
    expect(lab.supportedOutputs).toEqual(["IIC"]);
    expect(lab.blockedOutputs.map((blocked) => blocked.output)).toEqual(["AIIC", "Ln,w", "DeltaLw"]);
    expect(lab.astmE989).toMatchObject({
      bandSet: "one_third_octave_100_3150",
      rating: expect.any(Number)
    });
    expect(missing).toMatchObject({
      missingPhysicalInputs: expect.arrayContaining(["frequencyBandSet=one_third_octave_100_3150"]),
      status: "needs_input",
      supportedOutputs: []
    });
  });

  it("keeps the OITC owner on the backbone and synchronizes docs and the current gate", () => {
    const ownerSource = readRepoFile("packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner.ts");
    expect(ownerSource).toContain("ratingsFromOwnedCurve");
    expect(ownerSource).not.toContain("computeAstmE1332OitcFromCurve");

    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_STATUS);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_FILE);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("reusableRatingProceduresMoved: 3");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(BACKBONE_FILE.replace("packages/engine/", ""));
  });
});
