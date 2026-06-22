import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_SCOPE_OPENER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall single-leaf explicit surface-mass unknown-material scope opener";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const MIXED_IMPACT_OR_ALIAS_OUTPUTS = [
  "Ln,w",
  "L'n,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "L'nT,w",
  "L'nT,50",
  "LnT,A",
  "IIC",
  "AIIC",
  "NISR",
  "ISR",
  "LIIC",
  "LIR",
  "HIIC"
] as const satisfies readonly RequestedOutputId[];

const EXPLICIT_SURFACE_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const MISSING_SURFACE_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const ZERO_EXPLICIT_SURFACE_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 0,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const KNOWN_POSITIVE_EXPLICIT_SURFACE_MASS_STACK = [
  {
    materialId: "gypsum_board",
    surfaceMassKgM2: 15,
    thicknessMm: 12.5
  },
  {
    materialId: "gypsum_board",
    surfaceMassKgM2: 15,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const KNOWN_ZERO_SURFACE_MASS_STACK = [
  {
    materialId: "gypsum_board",
    surfaceMassKgM2: 0,
    thicknessMm: 12.5
  },
  {
    materialId: "gypsum_board",
    surfaceMassKgM2: 0,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const UNKNOWN_CAVITY_MATERIAL_WITHOUT_MASS_STACK = [
  {
    materialId: "project_side_a_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  },
  {
    materialId: "project_cavity_unknown_without_mass",
    thicknessMm: 90
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const INSULATION_AS_LEAF_STACK = [
  {
    materialId: "rockwool",
    surfaceMassKgM2: 10.6,
    thicknessMm: 90
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const GAP_AS_LEAF_STACK = [
  {
    materialId: "air_gap",
    surfaceMassKgM2: 10.6,
    thicknessMm: 90
  },
  {
    materialId: "project_side_b_panel_without_catalog_row",
    surfaceMassKgM2: 10.6,
    thicknessMm: 12.5
  }
] as const satisfies readonly LayerInput[];

const LAB_CONTEXT: AirborneContext = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 90,
        depthMm: 90,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const UNKNOWN_CAVITY_MATERIAL_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
  wallTopology: {
    ...LAB_CONTEXT.wallTopology,
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2]
  }
};

const FIELD_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 42
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  PREVIOUS_OWNER_PLAN_DOC,
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateExplicitSurfaceMassWall(
  layers: readonly LayerInput[],
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall double-leaf/framed explicit surface-mass leaf coverage refresh", () => {
  it("lands the no-runtime refresh and selects the single-leaf explicit mass opener next", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: PREVIOUS_OWNER_ACTION,
      previousOwnerFile: PREVIOUS_OWNER_FILE,
      previousOwnerStatus: PREVIOUS_OWNER_STATUS,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes lab outputs for explicit surface-mass leaves without catalog density rows", () => {
    const result = calculateExplicitSurfaceMassWall(EXPLICIT_SURFACE_MASS_STACK, LAB_CONTEXT, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46,
      surfaceMassKgM2: 21.2
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["sideALeafMassKgM2", "sideBLeafMassKgM2", "surfaceMassKgM2"])
    );
  });

  it("re-probes field and building outputs from the same explicit surface-mass base route", () => {
    const field = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      FIELD_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );
    const building = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      BUILDING_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );

    for (const result of [field, building]) {
      expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject({
        estimatedDnADb: 39.5,
        estimatedDnTADb: 41.9,
        estimatedDnTwDb: 43,
        estimatedDnWDb: 41,
        estimatedRwPrimeDb: 40
      });
      expect(result.airborneBasis).toMatchObject({
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
    }

    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("uses positive explicit mass on known catalog leaf materials instead of recomputing density mass", () => {
    const result = calculateExplicitSurfaceMassWall(
      KNOWN_POSITIVE_EXPLICIT_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layers.map((layer) => layer.surfaceMassKgM2)).toEqual([15, 15]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.8,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 49,
      estimatedStc: 50,
      surfaceMassKgM2: 30
    });
    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("keeps missing, zero, insulation, and gap side-leaf mass outside the opened route", () => {
    const missingSurfaceMass = calculateExplicitSurfaceMassWall(
      MISSING_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );
    const zeroSurfaceMass = calculateExplicitSurfaceMassWall(
      ZERO_EXPLICIT_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );
    const insulationAsLeaf = calculateExplicitSurfaceMassWall(
      INSULATION_AS_LEAF_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );
    const gapAsLeaf = calculateExplicitSurfaceMassWall(
      GAP_AS_LEAF_STACK,
      LAB_CONTEXT,
      LAB_OUTPUTS
    );

    for (const result of [missingSurfaceMass, zeroSurfaceMass, insulationAsLeaf, gapAsLeaf]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
      expect(result.airborneBasis).toMatchObject({
        origin: "needs_input"
      });
      expect(result.airborneBasis?.missingPhysicalInputs).toEqual(
        expect.arrayContaining(["surfaceMassKgM2"])
      );
    }
  });

  it("keeps field and building companions parked when an explicit side leaf lacks surface mass", () => {
    const field = calculateExplicitSurfaceMassWall(
      MISSING_SURFACE_MASS_STACK,
      FIELD_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );
    const building = calculateExplicitSurfaceMassWall(
      MISSING_SURFACE_MASS_STACK,
      BUILDING_CONTEXT,
      FIELD_BUILDING_OUTPUTS
    );

    for (const result of [field, building]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
      expect(result.airborneBasis).toMatchObject({
        method: "gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input",
        missingPhysicalInputs: ["surfaceMassKgM2"],
        origin: "needs_input"
      });
      expect(result.warnings).toContain(
        `Gate S double-leaf/framed route selected needs_input for ${FIELD_BUILDING_OUTPUTS.join(", ")}; provide surfaceMassKgM2 for each side leaf before DynEcho publishes this wall answer.`
      );
    }
  });

  it("keeps mixed airborne plus impact requests split between surface-mass needs_input and impact unsupported", () => {
    const probes = [
      { context: LAB_CONTEXT, needsInputOutput: "Rw" },
      { context: FIELD_CONTEXT, needsInputOutput: "R'w" },
      { context: BUILDING_CONTEXT, needsInputOutput: "DnT,w" }
    ] as const satisfies readonly {
      context: AirborneContext;
      needsInputOutput: RequestedOutputId;
    }[];

    for (const probe of probes) {
      for (const aliasOutput of MIXED_IMPACT_OR_ALIAS_OUTPUTS) {
        const outputs = [probe.needsInputOutput, aliasOutput] as const satisfies readonly RequestedOutputId[];
        const result = calculateExplicitSurfaceMassWall(
          MISSING_SURFACE_MASS_STACK,
          probe.context,
          outputs
        );

        expect(result.supportedTargetOutputs, outputs.join(" + ")).toEqual([]);
        expect(result.supportedImpactOutputs, outputs.join(" + ")).toEqual([]);
        expect(result.unsupportedTargetOutputs, outputs.join(" + ")).toEqual([...outputs]);
        expect(result.unsupportedImpactOutputs, outputs.join(" + ")).toContain(aliasOutput);
        expect(result.airborneBasis, outputs.join(" + ")).toMatchObject({
          method: "gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input",
          missingPhysicalInputs: ["surfaceMassKgM2"],
          origin: "needs_input"
        });
        expect(result.acousticAnswerBoundary, outputs.join(" + ")).toMatchObject({
          method: "gate_s_double_leaf_framed_explicit_surface_mass_leaf_needs_input",
          missingPhysicalInputs: ["surfaceMassKgM2"],
          origin: "needs_input",
          route: "wall",
          unsupportedOutputs: [probe.needsInputOutput]
        });
        expect(result.warnings, outputs.join(" + ")).toContain(
          `Gate S double-leaf/framed route selected needs_input for ${probe.needsInputOutput}; provide surfaceMassKgM2 for each side leaf before DynEcho publishes this wall answer.`
        );
        expect(result.warnings.join("\n"), outputs.join(" + ")).not.toContain(
          `needs_input for ${probe.needsInputOutput}, ${aliasOutput}`
        );
      }
    }
  });

  it("treats non-positive and non-finite explicit leaf mass as missing in the solver contract", () => {
    const cases = [
      { label: "omitted" },
      { label: "zero", surfaceMassKgM2: 0 },
      { label: "negative", surfaceMassKgM2: -1 },
      { label: "nan", surfaceMassKgM2: Number.NaN }
    ] as const;

    for (const testCase of cases) {
      const sideBLeaf = {
        materialId: `project_side_b_${testCase.label}`,
        thicknessMm: 12.5,
        ...("surfaceMassKgM2" in testCase ? { surfaceMassKgM2: testCase.surfaceMassKgM2 } : {})
      };
      const contract = buildGateRDoubleLeafFramedBridgeSolverContract({
        airborneContext: LAB_CONTEXT,
        layers: [
          {
            materialId: "project_side_a_panel_without_catalog_row",
            surfaceMassKgM2: 10.6,
            thicknessMm: 12.5
          },
          sideBLeaf
        ],
        targetOutputs: LAB_OUTPUTS
      });

      expect(contract.readinessStatus, testCase.label).toBe("needs_input");
      expect(contract.missingPhysicalInputs, testCase.label).toEqual(["surfaceMassKgM2"]);
      expect(contract.candidateBasis, testCase.label).toBeNull();
      expect(contract.benchmarkRange, testCase.label).toBeNull();
      expect(contract.physicalInputs, testCase.label).toMatchObject({
        leafMassRatio: null,
        sideALeafMassKgM2: 10.6,
        sideBLeafMassKgM2: null
      });
    }
  });

  it("does not let side-leaf unknown-material allowance hide an unknown cavity material without mass", () => {
    const result = calculateExplicitSurfaceMassWall(
      UNKNOWN_CAVITY_MATERIAL_WITHOUT_MASS_STACK,
      UNKNOWN_CAVITY_MATERIAL_CONTEXT,
      LAB_OUTPUTS
    );

    expect(result.layers).toEqual([]);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(result.metrics).toMatchObject({
      estimatedRwDb: 0,
      estimatedStc: 0,
      surfaceMassKgM2: 0,
      totalThicknessMm: 0
    });
    expect(result.warnings).toEqual([
      "Layer 2 references an unknown material: `project_cavity_unknown_without_mass`. Add the material to the catalog or fix the layer before recalculating."
    ]);
  });

  it("keeps zero explicit surface mass from overriding known catalog density and keeps impact aliases unsupported", () => {
    const knownZeroMass = calculateExplicitSurfaceMassWall(KNOWN_ZERO_SURFACE_MASS_STACK, LAB_CONTEXT, LAB_OUTPUTS);
    const impact = calculateExplicitSurfaceMassWall(
      EXPLICIT_SURFACE_MASS_STACK,
      LAB_CONTEXT,
      IMPACT_OUTPUTS
    );

    expect(knownZeroMass.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(knownZeroMass.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46,
      surfaceMassKgM2: 21.3
    });
    expect(knownZeroMass.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the coverage refresh and next runtime opener", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("newCalculableRequestShapes: 0");
      expect(content, path).toContain("newCalculableTargetOutputs: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts"
    );
  });
});
