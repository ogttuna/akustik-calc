# Controlled Company-Internal Ready Envelope

Date: 2026-05-15

File: `COMPANY_INTERNAL_OPERATING_ENVELOPE.md`

This document is the operating envelope for the current controlled
company-internal calculator state. It is tied to:

`company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan`

and the final rehearsal test:

`packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`

It describes what the calculator may be used for internally after the
final rehearsal is green. It is not a claim that every possible acoustic
assembly is solved or that formula budgets are fully calibrated by a
large source-owned holdout set.

For the broader company-internal accuracy path, use
[BROAD_ACCURACY_CALCULATOR_PLAN.md](./BROAD_ACCURACY_CALCULATOR_PLAN.md).
That plan owns the exact-source, nearby-source similarity, family-solver,
and residual-benchmark work needed before the calculator can be called
broadly ready.

## Ready Scope

The current Matrix V6 operating set has 71 rows:

- 47 rows with supported values;
- 17 `needs_input` rows;
- 8 unsupported rows;
- 5 exact/source-precedence rows;
- 4 hostile-refusal rows.

Supported internal-use routes include:

- wall element-lab `Rw`, `STC`, `C`, and `Ctr` for single heavy
  concrete/masonry, AAC/non-homogeneous masonry, laminated board,
  double/framed, resilient bar, grouped multi-cavity/triple-leaf, lined
  massive/masonry, CLT/mass-timber, opening/leak composite, and heavy
  composite families;
- wall field/apparent `R'w`, `Dn,w`, `DnT,w`, `Dn,A`, and `DnT,A` only
  where the field context, opening/leak package, or A-weighted frequency
  band owner is explicit;
- wall building-prediction `R'w`, `DnT,w`, and owned opening/leak
  `DnT,A` where the building/flanking/context owners are complete;
- floor element-lab `Ln,w` and `DeltaLw` for heavy floating concrete,
  explicit lightweight steel, timber/CLT impact, steel suspended ceiling,
  and reinforced-concrete combined or existing heavy-floor corridors;
- floor field/apparent `L'n,w`, `L'nT,w`, and selected `L'nT,50` routes
  where the field context or low-frequency owner is explicit;
- exact/source rows where they truly match the same family, topology,
  metric, and basis.

Post-Matrix V6 broad-accuracy addendum:

- `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
  has landed with selection status
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy`.
  This no-runtime coverage refresh adds the open-box timber
  package-transfer lane to the broad operating notes while preserving
  exact source precedence and without changing the controlled Matrix V6
  row count above.
- Complete source-absent open-box timber package-transfer cases remain
  internally usable only for element-lab package-transfer outputs with
  visible budgets. Representative dry gypsum-fiber values stay
  `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66`.
- Raw bare, exact-only hybrid, mixed staged, field/building, and ASTM/IIC
  cases remain outside this supported package-transfer envelope. The
  selected next action is the exact-only hybrid fragmentation policy,
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`,
  in
  `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.

## Input-Prompt Scope

The calculator must ask for more information instead of guessing when a
required physical owner is absent. Current `needs_input` rows cover:

- grouped multi-cavity wall topology: leaf groups, cavity depths,
  internal leaf coupling, and support topology;
- airborne field context: partition area, receiving-room volume, and
  receiving-room RT60;
- building prediction: source-room volume, flanking/junction class,
  conservative flanking assumption, coupling length, and output basis;
- opening/leak packages: opening rating, rating basis, seal/leakage
  class, source-room volume, and A-weighted frequency band set;
- impact floors: load basis, dynamic stiffness, field context, steel
  carrier spacing, lower ceiling support, and combined heavy-concrete
  lower-assembly owners.

Some partial rows can still show supported metrics while asking for
missing owners for other requested metrics. That is acceptable only when
the supported and blocked outputs are explicit and no unsupported metric
receives a fake value.

## Unsupported Scope

Unsupported rows are intentional boundaries, not calculator crashes:

- No ASTM `IIC` / `AIIC` runtime adapter in this envelope.
- No broad source crawl is required for this envelope.
- No lab-to-field, field-to-building, building `DnT,A` to `Dn,A`, or
  ISO impact-to-ASTM aliasing.
- Opening/leak A-weighted airborne routes do not calculate impact ASTM
  metrics.
- Wrong-family steel formula inputs and unsupported ASTM requests stay
  blocked until a later selected lane owns them.

## Accuracy Posture

Exact/source rows win when they truly match the same assembly, topology,
metric, and basis. Source-absent formula or family-physics rows are
usable internally with their visible error budgets, but those budgets
are not measured evidence. Current representative budgets include:

- wall lab family solvers: typically `+/-4 dB` to `+/-8 dB`;
- wall field/building adapters: typically `+/-7 dB` to `+/-11 dB`;
- opening/leak lab `Rw 38.2`: `+/-6 dB`;
- opening/leak A-weighted field/building: `+/-9 dB` / `+/-11 dB`;
- lightweight steel floor formula: `+/-4.5 dB` for `Ln,w` and
  `+/-2 dB` for `DeltaLw`;
- timber/CLT `DeltaLw`: `+/-7.5 dB`;
- heavy concrete floating and combined corridors: current route-specific
  formula budgets.

These budgets can tighten only after later source-owned holdout evidence
supports that change.

## Hostile Input Behavior

The calculator must fail closed or stay stable for rough internal use:

- duplicate steel carriers and duplicate opening identifiers are refused;
- invalid layer thickness is refused before any acoustic result;
- many-layer stress rows stay finite and do not produce silent jumps;
- safe reorders keep stable values where the family route owns reorder
  invariance;
- ambiguous topology asks for explicit grouping instead of guessing.

## Not Ready Claims

This envelope does not claim:

- industry-wide best-in-class calibration;
- complete ASTM `IIC` / `AIIC` support;
- complete support for every possible wall/floor layer combination;
- source-owned holdout coverage for every formula budget;
- automatic promotion of nearby source rows without same-family and
  same-basis ownership.

Those remain post-envelope improvement lanes.

## Final Readiness Check

Controlled company-internal readiness requires:

1. `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`
   passing.
2. The final rehearsal test included in `pnpm calculator:gate:current`.
3. Matrix V6 and building/ASTM boundary tests still passing.
4. Workbench/API/report/card proof-owner tests present in the current
   gate for supported runtime families.
5. `git diff --check` clean.
