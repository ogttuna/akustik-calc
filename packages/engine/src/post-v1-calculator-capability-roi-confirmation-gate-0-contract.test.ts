import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const GATE_0_ACTION = "post_v1_calculator_capability_roi_confirmation_gate_0_plan";
const GATE_0_FILE =
  "packages/engine/src/post-v1-calculator-capability-roi-confirmation-gate-0-contract.test.ts";
const GATE_0_SELECTION_STATUS =
  "post_v1_calculator_capability_roi_confirmation_gate_0_landed_selected_wall_multileaf_gate_a";
const SELECTED_GATE_A_ACTION =
  "post_v1_wall_multileaf_generalized_formula_gate_a_input_owner_and_gap_matrix_plan";
const SELECTED_GATE_A_FILE =
  "packages/engine/src/post-v1-wall-multileaf-generalized-formula-gate-a-contract.test.ts";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md"
] as const;

type CapabilityCandidateId =
  | "astm_iic_aiic_rating_owner"
  | "compatible_anchor_delta"
  | "docs_or_confidence_wording"
  | "floor_formula_expansion"
  | "floor_iso12354_field_building_expansion"
  | "guided_required_input_ux"
  | "source_volume_crawl"
  | "wall_iso12354_building_prediction"
  | "wall_multileaf_generalized_formula";

type CapabilityCandidate = {
  readonly blockedDeliverableOnly: boolean;
  readonly candidateId: CapabilityCandidateId;
  readonly expectedRuntimeDelta: readonly string[];
  readonly firstRuntimeGate: "Gate B" | "none";
  readonly implementationRisk: 1 | 2 | 3 | 4 | 5;
  readonly label: string;
  readonly metricBasisSafety: 1 | 2 | 3 | 4 | 5;
  readonly newlyCalculableOutputs: readonly string[];
  readonly rationale: readonly string[];
  readonly selectedGateAAction?: typeof SELECTED_GATE_A_ACTION;
  readonly standardsFormulaReadiness: 1 | 2 | 3 | 4 | 5;
  readonly stoppedStatesUnlocked: readonly string[];
  readonly uiBurden: 1 | 2 | 3 | 4 | 5;
  readonly userValue: 1 | 2 | 3 | 4 | 5;
};

type ScoredCapabilityCandidate = CapabilityCandidate & {
  readonly score: number;
};

const CAPABILITY_CANDIDATES = [
  {
    blockedDeliverableOnly: false,
    candidateId: "wall_multileaf_generalized_formula",
    expectedRuntimeDelta: [
      "complete grouped triple-leaf/two-cavity wall requests publish owned element-lab Rw/STC/C/Ctr instead of staying partial/local-only",
      "flat or grouping-ambiguous multileaf wall requests remain needs_input with exact topology fields",
      "quad/three-cavity wall requests are explicitly extension hooks, not fake runtime support"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 3,
    label: "generalized wall multileaf formula",
    metricBasisSafety: 5,
    newlyCalculableOutputs: ["Rw", "STC", "C", "Ctr"],
    rationale: [
      "largest current wall formula-family gap after V1",
      "builds on existing topology inputs, local-substitution paths, guarded flat-list boundaries, and old research solver terms",
      "matches INSUL-style model-family coverage without copying proprietary formulas or source rows"
    ],
    selectedGateAAction: SELECTED_GATE_A_ACTION,
    standardsFormulaReadiness: 4,
    stoppedStatesUnlocked: [
      "complete grouped triple-leaf wall element-lab answer beyond the current local-substitution corridor",
      "complete grouped multileaf wall STC/C/Ctr ownership beyond Rw-only partial paths",
      "many-layer hostile grouped topology that is currently guarded from flat-list promotion",
      "future quad/three-cavity wall topology classified as explicit needs_input/unsupported instead of screening"
    ],
    uiBurden: 3,
    userValue: 5
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "compatible_anchor_delta",
    expectedRuntimeDelta: [
      "known measured wall stack plus one owned extra layer can publish formula-calculated delta metrics",
      "unowned companion metrics remain unsupported"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 3,
    label: "compatible measured anchor delta",
    metricBasisSafety: 4,
    newlyCalculableOutputs: ["Rw", "STC", "C", "Ctr"],
    rationale: [
      "directly supports the user story where a known measured combination receives an extra layer",
      "requires the same formula-family owner and metric-scope guard that wall multileaf Gate A will define"
    ],
    standardsFormulaReadiness: 3,
    stoppedStatesUnlocked: [
      "near-exact wall stack variant with owned added-board delta",
      "near-exact wall stack variant with owned limp-mass delta",
      "near-exact wall stack variant with owned lining delta"
    ],
    uiBurden: 2,
    userValue: 5
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "guided_required_input_ux",
    expectedRuntimeDelta: [
      "users can complete already-owned formula inputs faster, but engine-owned metric coverage does not expand by itself"
    ],
    firstRuntimeGate: "none",
    implementationRisk: 2,
    label: "guided required-input UX",
    metricBasisSafety: 5,
    newlyCalculableOutputs: [],
    rationale: [
      "important product work after a formula owner exists",
      "does not by itself create a new solver or metric owner"
    ],
    standardsFormulaReadiness: 3,
    stoppedStatesUnlocked: [
      "operator-caused missing-input stops in already-owned wall/floor formula lanes"
    ],
    uiBurden: 5,
    userValue: 4
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "astm_iic_aiic_rating_owner",
    expectedRuntimeDelta: [
      "pure IIC/AIIC requests can become owned only after ASTM E989-compatible rating inputs and reference contour ownership exist"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 3,
    label: "ASTM IIC / AIIC rating owner",
    metricBasisSafety: 5,
    newlyCalculableOutputs: ["IIC", "AIIC"],
    rationale: [
      "commercially useful rating language",
      "narrower immediate coverage than wall multileaf formula and depends on owned ASTM rating inputs"
    ],
    standardsFormulaReadiness: 3,
    stoppedStatesUnlocked: ["pure floor ASTM IIC/AIIC unsupported boundary", "mixed impact-band ASTM alias blocker"],
    uiBurden: 2,
    userValue: 4
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "wall_iso12354_building_prediction",
    expectedRuntimeDelta: [
      "wall building-prediction requests can publish owned apparent/standardized values after direct, flanking, junction, and room owners exist"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 5,
    label: "ISO 12354-1 wall building prediction",
    metricBasisSafety: 4,
    newlyCalculableOutputs: ["R'w", "DnT,w", "DnT,A", "Dn,A"],
    rationale: [
      "high product value but high risk because flanking, junction, room normalization, and direct-path owners must land together",
      "should follow stronger element-lab wall formula ownership"
    ],
    standardsFormulaReadiness: 2,
    stoppedStatesUnlocked: [
      "wall building-prediction basis boundary",
      "opening/leak building unsupported owner",
      "partial building context needs_input"
    ],
    uiBurden: 5,
    userValue: 4
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "floor_iso12354_field_building_expansion",
    expectedRuntimeDelta: [
      "floor field/building impact requests can publish owned L'n,w/L'nT,w/L'nT,50 after field context and lab anchor owners exist"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 4,
    label: "ISO 12354-2 floor field/building impact expansion",
    metricBasisSafety: 4,
    newlyCalculableOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
    rationale: [
      "valuable after current floor lab-impact and open-web field adapter lanes",
      "narrower than the wall multileaf gap because several floor lanes already publish owned source-absent values"
    ],
    standardsFormulaReadiness: 3,
    stoppedStatesUnlocked: [
      "floor field-impact missing context boundary",
      "impact-only field continuation boundary",
      "mixed lab-plus-field floor continuation stop"
    ],
    uiBurden: 4,
    userValue: 4
  },
  {
    blockedDeliverableOnly: false,
    candidateId: "floor_formula_expansion",
    expectedRuntimeDelta: [
      "unsupported common floor systems can gain owned Rw/Ln,w/CI values after one named family is selected"
    ],
    firstRuntimeGate: "Gate B",
    implementationRisk: 3,
    label: "floor formula expansion",
    metricBasisSafety: 4,
    newlyCalculableOutputs: ["Rw", "Ln,w", "CI"],
    rationale: [
      "valuable, but current floor coverage is already broader than current generalized wall multileaf coverage",
      "should be selected after the wall gap or a concrete failed-user case outranks it"
    ],
    standardsFormulaReadiness: 3,
    stoppedStatesUnlocked: [
      "unsupported common floor family",
      "floor helper/package variant outside current family corridor",
      "floor material substitution currently parked behind formula-family gap"
    ],
    uiBurden: 3,
    userValue: 4
  },
  {
    blockedDeliverableOnly: true,
    candidateId: "docs_or_confidence_wording",
    expectedRuntimeDelta: [],
    firstRuntimeGate: "none",
    implementationRisk: 1,
    label: "docs or low-confidence wording",
    metricBasisSafety: 1,
    newlyCalculableOutputs: [],
    rationale: ["does not calculate more acoustic outputs and cannot be the next implementation"],
    standardsFormulaReadiness: 1,
    stoppedStatesUnlocked: [],
    uiBurden: 1,
    userValue: 1
  },
  {
    blockedDeliverableOnly: true,
    candidateId: "source_volume_crawl",
    expectedRuntimeDelta: [],
    firstRuntimeGate: "none",
    implementationRisk: 2,
    label: "broad source-row volume crawl",
    metricBasisSafety: 1,
    newlyCalculableOutputs: [],
    rationale: [
      "source rows are useful only as exact overrides, anchors, calibration evidence, holdouts, or bounds for one named formula family"
    ],
    standardsFormulaReadiness: 1,
    stoppedStatesUnlocked: [],
    uiBurden: 1,
    userValue: 1
  }
] as const satisfies readonly CapabilityCandidate[];

function scoreCandidate(candidate: CapabilityCandidate): ScoredCapabilityCandidate {
  if (candidate.blockedDeliverableOnly) {
    return { ...candidate, score: -100 };
  }

  const score =
    candidate.newlyCalculableOutputs.length * 6 +
    candidate.stoppedStatesUnlocked.length * 5 +
    candidate.standardsFormulaReadiness * 4 +
    candidate.metricBasisSafety * 4 +
    candidate.userValue * 4 -
    candidate.implementationRisk * 3 -
    candidate.uiBurden * 2;

  return { ...candidate, score };
}

function rankedCapabilities(): readonly ScoredCapabilityCandidate[] {
  return [...CAPABILITY_CANDIDATES]
    .map(scoreCandidate)
    .sort((left, right) => right.score - left.score || left.candidateId.localeCompare(right.candidateId));
}

describe("post-V1 calculator capability ROI confirmation Gate 0", () => {
  it("lands Gate 0 by selecting the highest measurable calculator-capacity slice", () => {
    const ranked = rankedCapabilities();
    const selected = ranked[0];

    expect(selected).toMatchObject({
      candidateId: "wall_multileaf_generalized_formula",
      firstRuntimeGate: "Gate B",
      selectedGateAAction: SELECTED_GATE_A_ACTION
    });
    expect(selected?.score).toBeGreaterThan(ranked[1]?.score ?? 0);
    expect(selected?.newlyCalculableOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(selected?.stoppedStatesUnlocked.length).toBeGreaterThanOrEqual(4);
    expect(selected?.expectedRuntimeDelta).toEqual(
      expect.arrayContaining([
        expect.stringContaining("publish owned element-lab Rw/STC/C/Ctr"),
        expect.stringContaining("remain needs_input")
      ])
    );
  });

  it("blocks work that cannot promise a concrete before/after calculation delta", () => {
    const blockedCandidates = CAPABILITY_CANDIDATES.filter((candidate) => candidate.blockedDeliverableOnly);

    expect(blockedCandidates.map((candidate) => candidate.candidateId)).toEqual([
      "docs_or_confidence_wording",
      "source_volume_crawl"
    ]);
    for (const candidate of blockedCandidates) {
      expect(candidate.newlyCalculableOutputs).toEqual([]);
      expect(candidate.expectedRuntimeDelta).toEqual([]);
      expect(scoreCandidate(candidate).score).toBeLessThan(0);
    }

    const selectableCandidates = rankedCapabilities().filter((candidate) => !candidate.blockedDeliverableOnly);
    expect(selectableCandidates.every((candidate) => candidate.expectedRuntimeDelta.length > 0)).toBe(true);
    expect(selectableCandidates.every((candidate) => candidate.candidateId !== "docs_or_confidence_wording")).toBe(true);
    expect(selectableCandidates.every((candidate) => candidate.candidateId !== "source_volume_crawl")).toBe(true);
  });

  it("keeps the selected slice grounded in current resolver coverage, not a new catalog lane", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const wallRuntimeCandidates = registry.candidateDeclarations.filter(
      (candidate) => candidate.route === "wall" && candidate.runtimeSelectionState === "active_runtime_existing"
    );
    const wallSourceAbsentCandidates = wallRuntimeCandidates.filter(
      (candidate) => candidate.kind === "source_absent_family_solver"
    );
    const wallMultileafCandidates = wallRuntimeCandidates.filter((candidate) =>
      /triple|multileaf|flat_list/i.test(candidate.id)
    );

    expect(registry.summary).toMatchObject({
      activeRuntimeCandidateCount: 32,
      candidateCount: 35
    });
    expect(wallSourceAbsentCandidates.length).toBeGreaterThanOrEqual(6);
    expect(wallMultileafCandidates.map((candidate) => candidate.id)).toEqual(
      expect.arrayContaining([
        "candidate_broad_accuracy_wall_triple_leaf_local_substitution_rw_family_physics_prediction",
        "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
        "wall.flat_list_adjacent_swap.double_leaf_numeric_guard"
      ])
    );
  });

  it("aligns source-of-truth docs on Gate 0 closeout and selected Gate A", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents, `${relativePath} records Gate 0`).toContain(GATE_0_ACTION);
      expect(contents, `${relativePath} records Gate 0 file`).toContain(GATE_0_FILE);
      expect(contents, `${relativePath} records selected Gate A`).toContain(SELECTED_GATE_A_ACTION);
      expect(contents, `${relativePath} records selected Gate A file`).toContain(SELECTED_GATE_A_FILE);
    }

    const plan = readFileSync(
      join(REPO_ROOT, "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md"),
      "utf8"
    );
    expect(plan).toContain(GATE_0_SELECTION_STATUS);
    expect(plan).toContain("newly calculable outputs");
    expect(plan).toContain("concrete before/after capability delta");
    expect(plan).toContain("low-confidence wording");
    expect(plan).toContain("broad source crawl");
  });
});
