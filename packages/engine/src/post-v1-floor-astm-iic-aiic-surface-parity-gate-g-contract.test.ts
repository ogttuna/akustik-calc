import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExactImpactSource, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_F_ACTION = "post_v1_floor_astm_iic_aiic_contour_rating_gate_f_plan";
const GATE_G_ACTION = "post_v1_floor_astm_iic_aiic_surface_parity_gate_g_plan";
const GATE_G_SELECTION_STATUS =
  "post_v1_floor_astm_iic_aiic_surface_parity_gate_g_landed_selected_gate_h_floor_formula_expansion";
const GATE_H_ACTION = "post_v1_floor_formula_expansion_gate_h_plan";
const GATE_H_FILE = "packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts";
const GATE_H_LABEL = "post-V1 floor formula expansion Gate H";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

const FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];

function astmContourLevels(baseContourPlusDeficiencyDb: number): number[] {
  return IMPACT_RATING_OFFSETS_THIRD.map((offset) => baseContourPlusDeficiencyDb + offset);
}

const ASTM_LAB_IIC_SOURCE = {
  frequenciesHz: [...IMPACT_RATING_FREQS_THIRD],
  labOrField: "lab",
  label: "Gate G ASTM E492 lab source with complete one-third-octave bands",
  levelsDb: astmContourLevels(62),
  standardMethod: "ASTM E492 / ASTM E989"
} as const satisfies ExactImpactSource;

const ASTM_FIELD_AIIC_SOURCE = {
  ...ASTM_LAB_IIC_SOURCE,
  labOrField: "field",
  label: "Gate G ASTM E1007 field source with complete one-third-octave bands",
  standardMethod: "ASTM E1007 / ASTM E989"
} as const satisfies ExactImpactSource;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor ASTM IIC/AIIC surface parity Gate G", () => {
  it("declares the ASTM rating candidate for visible calculator surfaces without changing the rating runtime", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const candidate = registry.candidateDeclarations.find(
      (entry) => entry.id === ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
    );
    const surfaceRowsById = new Map(
      buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract().surfaceRows.map((row) => [
        row.selectedCandidateId,
        row
      ])
    );

    expect(candidate).toMatchObject({
      basis: "astm_rating_boundary",
      kind: "exact_measured_override",
      ownedRuntimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      route: "floor",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["IIC", "AIIC"],
      surfaceRequirements: [
        "route_card",
        "output_cards",
        "dynamic_trace",
        "confidence_provenance",
        "metric_basis_rows",
        "calculator_api",
        "impact_only_api",
        "markdown_report"
      ]
    });
    expect(surfaceRowsById.get(ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID)).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "astm_rating_boundary",
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      supportBucket: "exact",
      supportedMetrics: ["IIC", "AIIC"]
    });
  });

  it("keeps live IIC and AIIC on the ASTM candidate trace with metric-scoped value pins", () => {
    const iic = calculateImpactOnly(FLOOR_STACK, {
      exactImpactSource: ASTM_LAB_IIC_SOURCE,
      targetOutputs: IIC_OUTPUTS
    });
    const aiic = calculateAssembly(FLOOR_STACK, {
      calculator: "dynamic",
      exactImpactSource: ASTM_FIELD_AIIC_SOURCE,
      targetOutputs: AIIC_OUTPUTS
    });

    expect(iic.impact).toMatchObject({
      IIC: 50,
      availableOutputs: ["IIC"],
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "lab",
      metricBasis: { IIC: ASTM_E989_IIC_METRIC_BASIS }
    });
    expect(iic.supportedTargetOutputs).toEqual(["IIC"]);
    expect(iic.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "astm_rating_boundary",
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["IIC"],
      valuePins: [{ metric: "IIC", value: 50 }]
    });
    expect(iic.layerCombinationResolverTrace?.surfaceDetail).toContain("exact ASTM impact-band contour rating");

    expect(aiic.impact).toMatchObject({
      AIIC: 50,
      availableOutputs: ["AIIC"],
      basis: ASTM_E989_IMPACT_RATING_BASIS,
      labOrField: "field",
      metricBasis: { AIIC: ASTM_E989_AIIC_METRIC_BASIS }
    });
    expect(aiic.supportedTargetOutputs).toEqual(["AIIC"]);
    expect(aiic.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requestedBasis: "astm_rating_boundary",
      runtimeBasisId: ASTM_E989_IMPACT_RATING_BASIS,
      selectedCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["AIIC"],
      valuePins: [{ metric: "AIIC", value: 50 }]
    });
    expect(aiic.impact?.IIC).toBeUndefined();

    const unsupported = calculateImpactOnly(FLOOR_STACK, {
      targetOutputs: IIC_OUTPUTS
    });
    expect(unsupported.supportedTargetOutputs).toEqual([]);
    expect(unsupported.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(unsupported.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
      supportBucket: "unsupported",
      valuePins: []
    });
  });

  it("keeps docs and the current gate runner aligned on Gate G closeout and Gate H selection", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readRepoFile(relativePath);

      expect(contents, `${relativePath} records Gate F`).toContain(GATE_F_ACTION);
      expect(contents, `${relativePath} records landed Gate G`).toContain(GATE_G_ACTION);
      expect(contents, `${relativePath} records Gate G status`).toContain(GATE_G_SELECTION_STATUS);
      expect(contents, `${relativePath} records selected Gate H`).toContain(GATE_H_ACTION);
      expect(contents, `${relativePath} records selected Gate H file`).toContain(GATE_H_FILE);
      expect(contents, `${relativePath} records selected Gate H label`).toContain(GATE_H_LABEL);
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts");
    expect(currentGateRunner).toContain("features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts");
  });
});
