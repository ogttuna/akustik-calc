import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap after user-material route input";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md";

const FIELD_ADAPTER_SELECTED_CANDIDATE_ID = "wall.airborne_field_context.field_apparent_adapter";
const BUILDING_ADAPTER_SELECTED_CANDIDATE_ID = GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID;

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
const FIELD_DECLARED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const BUILDING_DECLARED_OUTPUTS = FIELD_BUILDING_OUTPUTS;
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_MATERIAL_CATALOG: readonly MaterialDefinition[] = [
  ...getDefaultMaterialCatalog(),
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: CUSTOM_PANEL_ID,
    name: "Custom Panel Leaf",
    tags: ["gypsum", "board", "custom"]
  },
  {
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "insulation",
    densityKgM3: 45,
    id: CUSTOM_ABSORBER_ID,
    name: "Custom Porous Absorber",
    tags: ["porous", "rockwool", "mineral_wool", "custom"]
  }
] as const;

const EXPLICIT_DOUBLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const FIELD_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const BUILDING_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
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

const MISSING_TOPOLOGY_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_ROUTE_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function getById<Row extends { readonly id: string }>(rows: readonly Row[], id: string, label: string): Row {
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error(`Missing ${label} row ${id}.`);
  }
  return row;
}

function getByCandidateId<Row extends { readonly candidateId: string }>(
  rows: readonly Row[],
  candidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.candidateId === candidateId);
  if (!row) {
    throw new Error(`Missing ${label} candidate row ${candidateId}.`);
  }
  return row;
}

function getBySelectedCandidateId<Row extends { readonly selectedCandidateId: string }>(
  rows: readonly Row[],
  selectedCandidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.selectedCandidateId === selectedCandidateId);
  if (!row) {
    throw new Error(`Missing ${label} selected-candidate row ${selectedCandidateId}.`);
  }
  return row;
}

function calculateCustomWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[],
  catalog?: readonly MaterialDefinition[]
) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog,
    targetOutputs
  });
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousOwner: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

function expectSupportedMetrics(row: unknown, metrics: readonly RequestedOutputId[]) {
  const candidateRow = row as {
    readonly selectedCandidate?: { readonly supportedMetrics?: readonly RequestedOutputId[] };
    readonly supportedMetrics?: readonly RequestedOutputId[];
  };
  const supportedMetrics = candidateRow.supportedMetrics ?? candidateRow.selectedCandidate?.supportedMetrics;
  expect(supportedMetrics).toEqual(expect.arrayContaining([...metrics]));
}

describe("post-V1 wall double-leaf/framed user-material route-input coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next numeric coverage gap", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      previousOwner: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_OWNER_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      COVERAGE_REFRESH_FILE,
      SELECTED_NEXT_PLAN_DOC,
      "packages/engine/src/layer-combination-resolver-registry.ts",
      "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
      "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps lab formula and field/building adapter owners visible in registry, adapter, surface, matrix, and V0", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const labDeclaration = getById(
      registry.candidateDeclarations,
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const fieldDeclaration = getById(registry.candidateDeclarations, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "registry");
    const buildingDeclaration = getById(
      registry.candidateDeclarations,
      BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const labRows = [
      getBySelectedCandidateId(
        adapter.adapterRows,
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        "adapter"
      ),
      getBySelectedCandidateId(
        surfaceParity.surfaceRows,
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        "surface parity"
      ),
      getByCandidateId(
        coverageMatrix.coverageMatrixRows,
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        "coverage matrix"
      ),
      getByCandidateId(
        companyV0.operatingEnvelopeRows,
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        "V0"
      )
    ];
    const fieldRows = [
      getBySelectedCandidateId(adapter.adapterRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "adapter"),
      getBySelectedCandidateId(surfaceParity.surfaceRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "surface parity"),
      getByCandidateId(coverageMatrix.coverageMatrixRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "coverage matrix"),
      getByCandidateId(companyV0.operatingEnvelopeRows, FIELD_ADAPTER_SELECTED_CANDIDATE_ID, "V0")
    ];
    const buildingRows = [
      getBySelectedCandidateId(adapter.adapterRows, BUILDING_ADAPTER_SELECTED_CANDIDATE_ID, "adapter"),
      getBySelectedCandidateId(surfaceParity.surfaceRows, BUILDING_ADAPTER_SELECTED_CANDIDATE_ID, "surface parity"),
      getByCandidateId(coverageMatrix.coverageMatrixRows, BUILDING_ADAPTER_SELECTED_CANDIDATE_ID, "coverage matrix"),
      getByCandidateId(companyV0.operatingEnvelopeRows, BUILDING_ADAPTER_SELECTED_CANDIDATE_ID, "V0")
    ];

    expect(labDeclaration).toMatchObject({
      basis: "element_lab",
      id: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: expect.arrayContaining([...LAB_OUTPUTS])
    });
    expect(labDeclaration.requiredInputs).toEqual(
      expect.arrayContaining([
        "topologyMode=double_leaf_framed",
        "sideALeafMassKgM2",
        "sideBLeafMassKgM2",
        "cavity1DepthMm",
        "bridgeClass",
        "supportSpacingMm",
        "absorberFlowResistivityOrDefault"
      ])
    );
    expect(fieldDeclaration).toMatchObject({
      basis: "field_apparent",
      id: FIELD_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      route: "wall",
      supportedMetrics: FIELD_DECLARED_OUTPUTS
    });
    expect(buildingDeclaration).toMatchObject({
      basis: "building_prediction",
      id: BUILDING_ADAPTER_SELECTED_CANDIDATE_ID,
      kind: "field_building_adapter",
      ownedRuntimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      route: "wall",
      supportedMetrics: BUILDING_DECLARED_OUTPUTS
    });

    for (const row of labRows) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
      });
      expectSupportedMetrics(row, LAB_OUTPUTS);
    }
    for (const row of fieldRows) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      });
      expectSupportedMetrics(row, FIELD_BUILDING_OUTPUTS);
    }
    for (const row of buildingRows) {
      expect(row).toMatchObject({
        noRuntimeValueMovement: true,
        runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      });
      expectSupportedMetrics(row, BUILDING_DECLARED_OUTPUTS);
    }
  });

  it("re-probes custom user-material lab, field, and building values on the owned route", () => {
    const lab = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS, CUSTOM_MATERIAL_CATALOG);
    const field = calculateCustomWall(FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS, CUSTOM_MATERIAL_CATALOG);
    const building = calculateCustomWall(BUILDING_CONTEXT, FIELD_BUILDING_OUTPUTS, CUSTOM_MATERIAL_CATALOG);

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(lab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(lab.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: [
        { metric: "Rw", value: 46 },
        { metric: "STC", value: 46 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ]
    });

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
      expect(result.airborneBasis?.assumptions.join("\n")).toContain(
        LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
      );
    }
    expect(field.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: FIELD_ADAPTER_SELECTED_CANDIDATE_ID
    });
    expect(building.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: BUILDING_ADAPTER_SELECTED_CANDIDATE_ID
    });
  });

  it("keeps unknown-material, missing-topology, ASTM/IIC/AIIC, and impact boundaries pinned", () => {
    const unknown = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const missingTopology = calculateCustomWall(MISSING_TOPOLOGY_CONTEXT, LAB_OUTPUTS, CUSTOM_MATERIAL_CATALOG);
    const astm = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, ASTM_OUTPUTS, CUSTOM_MATERIAL_CATALOG);
    const impact = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, IMPACT_OUTPUTS, CUSTOM_MATERIAL_CATALOG);

    expect(unknown.supportedTargetOutputs).toEqual([]);
    expect(unknown.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(unknown.warnings.join("\n")).toContain("unknown material");

    expect(missingTopology.supportedTargetOutputs).toEqual([]);
    expect(missingTopology.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingTopology.airborneBasis).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology",
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      origin: "needs_input"
    });
    expect(missingTopology.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
    expect(astm.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.impact).toBeNull();
  });

  it("keeps docs and current-gate runner aligned with closeout and the selected rerank", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("STC 46");
      expect(content, path).toContain("C -1");
      expect(content, path).toContain("Ctr -6.1");
      expect(content, path).toContain("R'w 40");
      expect(content, path).toContain("Dn,A 39.5");
      expect(content, path).toContain("DnT,A 41.9");
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(normalized.toLowerCase(), path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
