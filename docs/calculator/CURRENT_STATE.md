# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before the execution plan or any archived analysis note

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under edit/reorder/localized numeric input

## Current Stable Gains

- localized numeric input is normalized consistently across thickness, density, and dynamic stiffness parsing
- reset behavior no longer silently jumps between floor and wall presets
- the simple heavy-floor lane now has deterministic solver ordering for the narrow top-side package that was producing edit-path drift
- section preview and technical layer schedule now follow solver layers instead of raw visible row order
- the first deterministic complex-stack audit pack is now in place for:
  - wall mineral-wool contiguous splits
  - UBIQ open-web steel ceiling-fill contiguous splits on the field route
- the first direct dynamic duplicate / reorder reproduction matrix is now in place for the current wall-side instability cases documented under:
  - [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md)
- the living wall-side remediation note is now the canonical design for fixing those instability cases without breaking framed and masonry benchmark corridors:
  - [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- Phase A of that wall-side remediation note is now shipped:
  - hint-only framed metadata no longer forces heavy mineral/composite stacks onto the stud-wall lane
  - heavy unframed cavity walls can now be capped against a conservative screening corridor instead of over-scoring
  - asymmetrical heavy-plus-light cavity walls can now fall onto `lined_massive_wall` earlier instead of staying on the old optimistic double-leaf route
  - the first deep hybrid duplicate / adjacent-swap stress matrix now defends both engine and workbench routes
- residual post-Phase-A stress work now distinguishes true order-sensitive multi-leaf cases from false family-promotion bugs:
  - lightweight triple-leaf stacks now emit an explicit warning instead of being silently treated like stable two-leaf walls
  - broader multi-leaf cavity stacks now also emit an explicit order-sensitive warning and carry lower confidence
- Phase B.1 boundary diagnostics are now also shipped on the wall side:
  - narrow two-leaf family boundaries can now surface runner-up-aware warnings and notes
  - those boundary cases can step down in confidence without changing the numeric lane yet
- Phase B.2 partial wall-side corridor holding is now also shipped:
  - the `double_leaf <-> lined_massive_wall` boundary can now apply a bounded conservative hold after the family pick
  - this currently stays deliberately narrow: only `2 visible leaves / 1 cavity` topology on that defended pairing
  - deeper 5-layer hybrids that trim back to that morphology are now covered by direct engine and workbench matrix tests
  - exact boundary, trimmed-prefix, instability, and order-sensitivity contracts now exist on both engine and workbench routes for that corridor
- field-side support posture was tightened during validation:
  - hybrid wall-like stacks no longer surface `Rw` on assembly field bundles just because a generic impact signal existed downstream
- the living source-gap ledger now records which floor families are source-backed enough to tighten and which must stay fail-closed
- the living source-gap ledger now also names the current implementation-backed widening-first and tightening-first family branches
- the living source-gap ledger now includes a local source-corpus snapshot:
  - TUAS open-box exact rows: `7`
  - TUAS CLT exact rows: `4`
  - Dataholz CLT exact rows: `9`, with `3` currently still exact-only tightening slack
  - UBIQ open-web rows: `18` exact plus `3` bound
- the living source-gap ledger now includes a TUAS candidate-import backlog:
  - safe `b`-family widening is imported: `R2b`, `R3b`, `R11b`
  - explicit `a`-family open-box widening is now also imported: `R3a`, `R5a`
  - deferred TUAS CLT import remains behind Dataholz CLT tightening
- predictor-side and visible-layer TUAS ceiling-family groundwork is now in place:
  - explicit predictor input distinguishes `tuas_open_box_family_a` vs `tuas_open_box_family_b`
  - visible-layer/workbench stacks can now surface `family_a` honestly through `tuas_open_box_ceiling_family_a`
  - the generic `resilient_stud_ceiling` material remains the shorthand for the current imported `b` corridor
  - `TUAS2023FloorDetails.pdf` confirms the physical split behind that surface:
    - `R2a-R10a` uses `25 mm` wooden laths
    - `R2b-R11b` uses `25 mm` resilient steel studs
- TUAS post-corridor numeric screening is now explicit:
  - `R2b` is now drawing-cleared and imported as the basic `b`-family anchor
  - remaining open-box shortlist for geometry audit: `R7a`, `R6b`
  - lower-priority numeric outliers stay deferred until drawings justify them: `R6a`, `R10a`, `R7b`, `R8b`, `R9b`, `R2c`
- the first UBIQ same-family sibling import pass is now complete:
  - exact coverage now includes visible `FL-28` open-web `16 mm INEX>FLOOR` siblings at `200`, `300`, `400`
  - bound coverage now includes the visible `FL-28 (FRL/D)` open-web `400` row
  - the adjacent-family widening passes are now complete for `FL-24` and `FL-26`
  - the generic lightweight-steel `lower_only` fallback now lands on the nearer `FL-26` `2 x 16 mm` corridor when the visible ceiling package matches that profile
  - `FL-23`, `FL-25`, and `FL-27` are explicitly deferred because their timber and carpet lanes sit materially below the current supported corridor
  - the remaining later clean-up is the source-trace drift around the `ubiq_fl32_*` and `ubiq_fl33_*` internal ids

## Implemented Output Posture

The current output surface in code is broader than the older status snapshots suggest.

Implemented output families today:

- live airborne outputs: `Rw`, `R'w`, `STC`, `C`, `Ctr`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `DnT,A,k`
- scoped impact outputs: `Ln,w`, `DeltaLw`, `LnT,A`
- guide, field-continuation, or conditional companions: `CI`, `CI,50-2500`, `Ln,w+CI`, `L'n,w`, `L'nT,w`, `L'nT,50`

Tracked but intentionally unsupported today:

- `IIC`, `AIIC`, `NISR`, `ISR`, `LIIC`, `LIR`, `HIIC`

Important nuance:

- not every requested output is available on every lane
- support still depends on topology, source class, and the active route
- the workbench keeps unsupported outputs explicit instead of fabricating them

## What Is Intentionally Narrow

- reorder canonicalization is currently limited to the simple top-side heavy-floor package
- it was not widened blindly to every floor or wall combination
- true order-sensitive assemblies should remain order-sensitive until explicitly audited

## Current Open Risk

- complex mixed floor and wall stacks still need a wider manual and automated torture pass
- the next hardening step should decide which combinations are genuinely path-invariant and which must stay physically order-sensitive
- reproduced dynamic-route duplicate and reorder instability cases are documented separately under:
  - [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md)
- the intended fix order and protected-corridor rules for that wall-side work now live under:
  - [DYNAMIC_WALL_STABILITY_REMEDIATION.md](./DYNAMIC_WALL_STABILITY_REMEDIATION.md)
- wall-side Phase A reduced the currently reproduced jump class materially, and Phase B.1 plus the first shipped Phase B.2 hold now cover the defended `double_leaf <-> lined_massive_wall` boundary, but family selection still ends in a hard branch outside that narrow held corridor
- the largest remaining reorder deltas now cluster mainly around true multi-leaf / triple-leaf topologies, which should stay order-sensitive rather than being flattened blindly
- `multileaf_multicavity` remains a conservative surrogate rather than a dedicated multi-cavity solver
- deeper heavy hybrids with alternative cores still need broader generated scans before the current held-corridor posture can be widened
- the remaining TUAS shortlist is no longer a pure import question:
  - `R7a` likely wants a separate heavy/wet `a` branch
  - `R6b` likely wants a separate reinforced lower-treatment `b` branch

## Immediate Next Tasks

Work in this order:

1. Run a broader complex-stack torture pass before widening normalization rules any further.
2. Widen the new wall-side Phase B.2 evidence base before extending the hold beyond the current defended corridor:
   - keep the current runner-up-aware hold limited to `double_leaf <-> lined_massive_wall`
   - scan more heavy-core families and dual-trim hybrids before adding any new held pair
3. Do a mini branch-design audit for `R7a` and `R6b` before importing either row.
4. Only after that decide whether the next widening move is TUAS branch extension, UBIQ source-trace cleanup, or the next wall-side held family pairing.

Use the source gap ledger to decide which families should be researched or widened first instead of opening new lanes ad hoc:

- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

The torture pass should include:

- deep multi-layer floor assemblies
- deep multi-layer wall assemblies
- reorder, duplicate, split, partial-edit, and reset cycles
- browser-driven manual checks on the built app in addition to regression tests

The TUAS branch-design audit should answer:

- does `R7a` fit the existing `family_a` visible-layer surface or require a dedicated heavy/wet `a` branch?
- does `R6b` fit the existing `b` ceiling shorthand or require an explicit four-board lower-treatment branch?
- if either answer is “new branch”, what is the smallest honest surface that avoids aliasing?

## Canonical Documents

- [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
- [../foundation/PROJECT_PLAN.md](../foundation/PROJECT_PLAN.md)
- [../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md](../archive/analysis/NUMERICAL_SYSTEM_ANALYSIS_2026-03-31.md)
