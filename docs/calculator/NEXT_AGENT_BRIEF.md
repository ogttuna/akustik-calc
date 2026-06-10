# Next Agent Brief

Last reviewed: 2026-06-10

Document role: fastest safe handoff for a new calculator agent. Read this
first to understand the mission, current checkpoint, selected next action,
and non-negotiable boundaries. Then use
`CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`, and
`NEXT_IMPLEMENTATION_PLAN.md` for the full detail.

## Mission

DynEcho must become an industry-grade acoustic calculator, not a catalog
of finite assemblies and not a documentation/process project. Users enter
wall, floor, or ceiling layer combinations and route-required physical
inputs; the engine should return defensible acoustic outputs such as `Rw`,
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `Ln,w`, `L'n,w`, `L'nT,w`,
`DeltaLw`, `IIC`, and `AIIC`.

Use this answer order:

1. exact owned measured/source row when available;
2. owned anchor, similarity, or same-basis measured path when the metric
   basis and construction boundary are proven;
3. dynamic formula route using the layer stack and required physical inputs;
4. precise `needs_input` or `unsupported` when ownership, metric basis, or
   physical input is missing.

A missing measured row is normal. It is not a reason to stop calculator
work or build a source-row library. Source research is useful only when it
feeds a bounded formula, measured-anchor delta, calibration/holdout, or
accuracy retune.

## Current Checkpoint

Latest commit at this handoff:
`5d2891d Land compatible anchor-delta building DnA checkpoint`.

Latest checkpoint:
`docs/calculator/CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md`.

Previous numeric gap action:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`.

Previous numeric gap file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`.

Previous numeric gap status:
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.

Latest value-moving runtime owner:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`.

Owner contract:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`.

Owner status:
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.

What now calculates:

- Knauf `416889` compatible anchor-delta paired exterior-board building
  request: building `Dn,A 49.5`;
- Knauf `416889` compatible anchor-delta one-side exterior-board building
  request: building `Dn,A 48`;
- paired building `DnT,A 51.9` and one-side building `DnT,A 50.4` remain
  live on the same Gate AR route;
- field `Dn,A 49.5 / DnT,A 51.9` and one-side field
  `Dn,A 48 / DnT,A 50.4` remain live on the Gate I route.

What must stay pinned:

- lab aliases do not become field/building `Dn,A` or `DnT,A`;
- missing `buildingPredictionOutputBasis` remains `needs_input`;
- non-selected anchors remain outside this owner;
- ASTM/IIC/AIIC remain unsupported for this wall airborne route;
- no source rows were imported;
- no direct curve, Gate I, Gate AR, or ISO 717 adapter formula was retuned.

Counters for the landed owner: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

## Selected Next Action

Current selected next action:
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`.

Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.

Selected next label:
`post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.

This is a no-runtime closeout. It should not move more values. Its job is
to freeze the landed building `Dn,A` owner through current-gate coverage,
resolver registry/runtime candidate surfaces, coverage matrix, and
company-internal V0 expectations. After that, select a short numeric
coverage/accuracy rerank that subtracts all closed compatible anchor-delta
lanes and chooses the next bounded calculator improvement.

Do not skip directly to broad source crawling, report polish, auth/storage,
or UI polish. Those are outside the selected calculator slice unless they
directly unblock a named formula/input/anchor/calibration route.

## How To Proceed

1. Read this file, then `CALCULATOR_SOURCE_OF_TRUTH.md`, `CURRENT_STATE.md`,
   and the top/current section of `NEXT_IMPLEMENTATION_PLAN.md`.
2. Implement the selected coverage refresh contract first:
   `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`.
3. Re-probe the already-live paired and one-side building `Dn,A` values,
   paired/one-side `DnT,A`, field A-weighted values, and the boundary rows.
4. Register the new refresh in `tools/dev/run-calculator-current-gate.ts`.
5. Update the living docs with the landed refresh and the newly selected
   follow-up rerank.
6. Run focused tests first, then `pnpm calculator:gate:current` before a
   checkpoint commit.

Expected focused tests after the next slice should include:

- `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`;
- the new
  `packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`;
- related compatible anchor-delta A-weighted and surface parity contracts.

Latest full validation at this handoff:

- `pnpm calculator:gate:current`;
- engine: 688 test files, 3810 tests passed;
- web: 119 test files, 464 tests passed and 18 skipped;
- repo build: 5 packages successful;
- whitespace guard passed.

Known non-fatal warnings: test-environment Zustand persist storage warning
and optional `sharp/@img` build warnings.
