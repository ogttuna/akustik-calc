# Dynamic Wall Stability Remediation

Document role:

- living wall-side hardening design for the `dynamic` calculator
- use this before changing wall-family selection, topology parsing, or wall-side calibration rules
- keep this document updated as implementation findings land

## 1. Problem Definition

The wall-side dynamic calculator should let an operator compose realistic or semi-realistic layer stacks and get:

- defended values when the system genuinely understands the topology
- conservative values when the topology is ambiguous
- explicit warnings or lower confidence when the route is leaving a source-backed corridor

The current residual bug class is:

- small visible edits can trigger large `Rw`, `R'w`, and `DnT,w` jumps
- the jump is often much larger than the user would expect from the visible change
- the jump is driven by topology and family handoff, not by one broken logarithm formula

The reproduced examples are tracked in:

- [../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md](../archive/analysis/DYNAMIC_ROUTE_STABILITY_ANALYSIS_2026-04-07.md)

## 2. Current Failure Modes

### 2.1 Workbench duplicate and reorder instability

Reproduced today:

- duplicate a 5-layer wall-like package and the result can jump by about `+20 dB`
- move one row upward and the result can drop by about `-14 dB`

The current direct repro pack lives in:

- [../../apps/web/features/workbench/dynamic-route-instability.test.ts](../../apps/web/features/workbench/dynamic-route-instability.test.ts)
- [../../packages/engine/src/dynamic-airborne-instability-repro.test.ts](../../packages/engine/src/dynamic-airborne-instability-repro.test.ts)

### 2.2 Explicit framing metadata overreach

Reproduced today:

- heavy mineral or composite stacks can be pushed onto the `stud_wall_system` lane because `connectionType`, `studType`, or `studSpacingMm` is present
- once that happens, framed-wall calibration can drag the result into the wrong corridor

### 2.3 Over-aggressive heavy double-leaf behavior

Observed in the current implementation:

- once a heavy mineral or composite stack is interpreted as `double_leaf`, the current delegate path can be too optimistic because it leans heavily on the cavity-aware mass-law surrogate
- the existing narrow-gap guard only covers one narrow sub-class
- heavy two-leaf stacks with no real framed support evidence still have room to over-score

## 3. Root Cause In Code

The instability is produced by a decision chain, not one isolated formula.

Primary wall-side path:

1. `calculateAssembly(...)` only enters the wall-side dynamic branch when `options.calculator === "dynamic"`:
   - `packages/engine/src/calculate-assembly.ts`
2. outer compliant layers are trimmed:
   - `packages/engine/src/dynamic-airborne.ts`
3. contiguous solid layers are collapsed into visible leaves:
   - `packages/engine/src/airborne-topology.ts`
4. cavities are counted between those collapsed visible leaves:
   - `packages/engine/src/airborne-topology.ts`
5. `detectDynamicFamily(...)` makes a hard family selection:
   - `packages/engine/src/dynamic-airborne.ts`
6. the chosen family drives a family-specific delegate blend and a family-specific calibration corridor:
   - `packages/engine/src/dynamic-airborne.ts`

Current architectural problem:

- `trim -> collapse -> hard family handoff -> hard calibration handoff`

That is why a small visible edit can move the result much more than the user expects.

## 4. Why Simple Fixes Are Not Safe

These options should not be used as the main fix:

- globally sorting or canonicalizing wall layers
- UI-only hysteresis against the previous result
- output delta clamping with no physical interpretation
- treating every duplicate or reorder as equivalent

Reason:

- some wall assemblies are genuinely order-sensitive
- some internal cavities are physically meaningful
- hiding the jump without fixing the route interpretation makes the system less honest

## 5. External Constraints From Source Material

The fix strategy should stay aligned with published modelling limits and measured behavior.

Useful external anchors:

- ISO 12354-1 official standard page:
  - `https://www.iso.org/cms/render/live/en/sites/isoorg/contents/data/standard/07/02/70242.html`
- double-leaf partition modelling literature showing that cavity and stud coupling must be represented physically rather than guessed from weak metadata:
  - `https://www.sciencedirect.com/science/article/pii/S0022460X04008429`
- measured plasterboard double-leaf behavior showing real sensitivity to cavity, fill, and construction details, which supports conservative handling for ambiguous stacks:
  - `https://www.researchgate.net/profile/Steffi-Reinhold/publication/323837696_Measured_sound_insulation_of_double_leaf_plasterboard_walls_Part_1_Measurements_concerning_the_basic_acoustical_behaviour/links/5aae9cb9458515ecebe96e5e/Measured-sound-insulation-of-double-leaf-plasterboard-walls-Part-1-Measurements-concerning-the-basic-acoustical-behaviour.pdf`

Implication for DynEcho:

- ambiguous stacks should not be promoted onto high-confidence premium corridors
- framing metadata alone should not override actual morphology
- family changes should not create `15-30 dB` lane jumps unless the morphology change is truly major

## 6. Protected Corridors

The phrase `benchmark corridor freeze` means:

- declare certain already-defended behaviors to be contracts
- do not let the wall-stability fix break them
- reject a fix if it improves the bug cases but degrades these protected corridors

Protected corridors for this work:

- framed benchmark corpus:
  - [../../packages/engine/src/airborne-framed-wall-benchmark.test.ts](../../packages/engine/src/airborne-framed-wall-benchmark.test.ts)
- masonry benchmark corpus:
  - [../../packages/engine/src/airborne-masonry-benchmark.test.ts](../../packages/engine/src/airborne-masonry-benchmark.test.ts)
- broad wall/floor output sanity:
  - [../../packages/engine/src/output-combination-sweep.test.ts](../../packages/engine/src/output-combination-sweep.test.ts)
- guided dynamic sanity:
  - [../../packages/engine/src/dynamic-guided-combination-sweep.test.ts](../../packages/engine/src/dynamic-guided-combination-sweep.test.ts)
- reproduced instability matrix:
  - [../../apps/web/features/workbench/dynamic-route-instability.test.ts](../../apps/web/features/workbench/dynamic-route-instability.test.ts)
  - [../../packages/engine/src/dynamic-airborne-instability-repro.test.ts](../../packages/engine/src/dynamic-airborne-instability-repro.test.ts)

Protected-corridor rule:

- wall-side fixes may improve benchmark accuracy
- wall-side fixes may lower confidence for ambiguous stacks
- wall-side fixes must not silently widen away from existing benchmarked framed and masonry rows

## 7. Implementation Goal

The target is not “make every reorder invariant”.

The real target is:

- keep source-backed framed and masonry corridors stable
- stop weak metadata from forcing the wrong family
- stop heavy ambiguous cavity stacks from over-scoring
- make ambiguous cases conservative and explicit rather than brittle and overconfident

## 8. Recommended Architecture

### 8.1 Near-term safe architecture

The first implementation pass should do three things:

1. gate the `stud_wall_system` lane behind stronger framed evidence
2. add a conservative heavy-composite cavity guard for `double_leaf` and `multileaf_multicavity`
3. lower confidence and strengthen warnings when the family is only weakly supported

This is the highest-value change that can land without rewriting the whole selector.

### 8.2 Longer-term target architecture

The durable end state is:

1. `MorphologyV2`
   - represent `lining`, `massive core`, `board leaf`, `porous fill`, `cavity`, `outer compliant finish`, and `support evidence` separately
2. score-based family selection
   - no more single hard `if/return` handoff without a runner-up or margin
3. bounded family calibration
   - family-specific corridors become residual corrections, not total lane replacement
4. explicit ambiguity posture
   - low-margin cases become conservative with stronger warnings

## 9. Phase Plan

### Phase A: non-regressive hardening

This is the first implementation phase and should land first.

Work items:

- replace the current “explicit framing hint means stud lane is allowed” rule with a stronger framed-evidence gate
- require either:
  - real support layers, or
  - board-dominant framed morphology with lightweight leaves and clear cavity framing characteristics
- keep heavy mineral/composite assemblies off the stud lane when metadata is the only evidence
- add a conservative heavy-cavity lane or guard for heavy `double_leaf` and heavy `multileaf_multicavity` topologies without support evidence
- reduce confidence for:
  - hint-only stud selection
  - heavy multileaf surrogates
  - trimmed-edge topology flips

Expected gain:

- closes the strongest false framed-wall handoff
- reduces the biggest jumps in the current wall bug set
- preserves existing framed/masonry benchmark corridors

### Phase B: ambiguity-aware selection

Work items:

- add family candidate scoring
- keep winner and runner-up
- if the margin is small, hold the result inside a conservative corridor instead of fully switching lanes

Status:

- Phase B.1 is now shipped:
  - two-leaf single-cavity boundary cases can emit runner-up-aware ambiguity diagnostics
  - trace now carries the current boundary posture when the family read is narrow or ambiguous
  - confidence can step down on those narrow boundary cases without moving the numeric lane itself yet
- Phase B.2 is still open:
  - conservative corridor holding is not shipped yet
  - family selection still ends in a hard branch even when the trace is calling out a narrow winner

Expected gain:

- reorder and duplicate edits become less brittle
- confidence aligns better with actual selector evidence

### Phase C: MorphologyV2

Work items:

- stop treating every contiguous solid group as one blind composite leaf
- preserve meaningful distinctions between:
  - board linings
  - massive cores
  - bonded finish layers
  - framed support evidence

Expected gain:

- better explainability
- less need for one-off guards
- safer future family import work

## 10. Code Areas That Matter

Primary implementation files:

- [../../packages/engine/src/dynamic-airborne.ts](../../packages/engine/src/dynamic-airborne.ts)
- [../../packages/engine/src/airborne-topology.ts](../../packages/engine/src/airborne-topology.ts)
- [../../packages/engine/src/calculate-assembly.ts](../../packages/engine/src/calculate-assembly.ts)

Primary workbench contract files:

- [../../apps/web/features/workbench/scenario-analysis.ts](../../apps/web/features/workbench/scenario-analysis.ts)
- [../../apps/web/features/workbench/dynamic-calc-branch.ts](../../apps/web/features/workbench/dynamic-calc-branch.ts)
- [../../apps/web/features/workbench/target-output-status.ts](../../apps/web/features/workbench/target-output-status.ts)

Primary test files that must be kept green:

- [../../packages/engine/src/airborne-framed-wall-benchmark.test.ts](../../packages/engine/src/airborne-framed-wall-benchmark.test.ts)
- [../../packages/engine/src/airborne-masonry-benchmark.test.ts](../../packages/engine/src/airborne-masonry-benchmark.test.ts)
- [../../packages/engine/src/output-combination-sweep.test.ts](../../packages/engine/src/output-combination-sweep.test.ts)
- [../../packages/engine/src/dynamic-guided-combination-sweep.test.ts](../../packages/engine/src/dynamic-guided-combination-sweep.test.ts)
- [../../packages/engine/src/dynamic-airborne-family-boundary.test.ts](../../packages/engine/src/dynamic-airborne-family-boundary.test.ts)
- [../../apps/web/features/workbench/dynamic-route-instability.test.ts](../../apps/web/features/workbench/dynamic-route-instability.test.ts)
- [../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts](../../apps/web/features/workbench/dynamic-route-family-boundary.test.ts)
- [../../packages/engine/src/dynamic-airborne-instability-repro.test.ts](../../packages/engine/src/dynamic-airborne-instability-repro.test.ts)

## 11. Required Test Strategy

The wall-stability fix needs more than one happy-path regression test.

### 11.1 Protected-corridor tests

Purpose:

- prove that framed and masonry source-backed corridors still hold

Required suites:

- framed benchmark corpus
- masonry benchmark corpus
- broad output sweep
- guided dynamic sweep

### 11.2 Direct repro tests

Purpose:

- prove that the known duplicate and reorder bug cases are no longer producing the old jump pattern

Required cases:

- workbench duplicate case
- workbench reorder case
- explicit metadata duplicate case
- explicit metadata reorder case

### 11.3 Morphology stress matrix

Purpose:

- make it hard for the same architectural bug to come back under a slightly different stack

Required case classes:

- heavy mineral leaf plus board lining plus cavity
- repeated package duplication
- adjacent swaps across all boundaries in 6-12 layer stacks
- deep stacks with multiple porous segments
- deep stacks with mixed heavy and light leaves
- stacks where outer compliant rows are present only on one side
- stacks where support metadata is present but support layers are absent
- stacks where support layers are present but metadata is `auto`

### 11.4 Negative safety tests

Purpose:

- prove that real framed-wall corridors and real single-leaf masonry corridors still route correctly

Required case classes:

- benchmark-derived framed walls with real board-dominant cavities
- benchmark-derived masonry/AAC walls with plaster or mortar skins
- true double-stud patterns
- lined massive wall patterns

### 11.5 Trace-level assertions

Do not only assert final `Rw`.

Also assert:

- detected family
- strategy
- confidence class
- warning presence when ambiguity is expected
- cavity count where the topology is central to the bug

## 12. Concrete Test Placement

Keep the test hierarchy clear.

Engine-level selector and solver guards:

- `packages/engine/src/dynamic-airborne-instability-repro.test.ts`
- add a new selector-focused contract file if the helper surface grows

Engine-level benchmark protection:

- `packages/engine/src/airborne-framed-wall-benchmark.test.ts`
- `packages/engine/src/airborne-masonry-benchmark.test.ts`
- `packages/engine/src/output-combination-sweep.test.ts`
- `packages/engine/src/dynamic-guided-combination-sweep.test.ts`

Workbench edit-path protection:

- `apps/web/features/workbench/dynamic-route-instability.test.ts`
- `apps/web/features/workbench/dynamic-route-order-sensitivity.test.ts`

If a new helper is added to `airborne-topology.ts`, add topology-only tests close to the helper instead of burying everything inside end-to-end assertions.

## 13. Acceptance Criteria For Phase A

Phase A is acceptable only if all of these are true:

- the known duplicate and reorder repro cases no longer show the previous large false jumps
- explicit hint-only stud promotion is no longer available to heavy mineral/composite stacks
- framed benchmark corpus still passes
- masonry benchmark corpus still passes
- no broad output-support regressions are introduced
- confidence and warnings become more honest on ambiguous cases

## 14. Rollout Rules

When changing wall-side dynamic routing:

1. update this document first or together with the code if the diagnosis changes
2. add or adjust repro tests before relaxing or rewriting any old assertion
3. keep benchmark corridors green before widening anything else
4. if a change improves one instability case by moving a source-backed benchmark out of corridor, reject that change

## 15. Current Implementation Notes

As of `2026-04-07`:

- the main confirmed architectural weaknesses are:
  - hint-only stud promotion
  - heavy cavity over-credit on non-framed composite double-leaf stacks
  - hard family handoff without ambiguity posture
- the first implementation target should be Phase A, not a whole-system rewrite

Update this section as code lands:

- note which exact guards shipped
- note which repro cases are fully closed
- note which residual risks remain

### 15.1 Phase A shipped on 2026-04-07

The first Phase A implementation pass is now in the repo.

Shipped guards:

- explicit framing metadata is no longer enough by itself to unlock the `stud_wall_system` lane
- the stud lane now requires either:
  - actual support evidence, or
  - a board-dominant explicit framed morphology
- heavy unframed cavity walls can now be capped against a conservative screening corridor when the family lane is materially outrunning that baseline
- strongly asymmetrical heavy-plus-light cavity walls can now fall onto `lined_massive_wall` earlier instead of staying on the old optimistic `double_leaf` lane
- confidence and warnings now become more explicit when:
  - explicit framing metadata was suppressed
  - a heavy unframed cavity cap was applied
  - outer compliant trimming makes the route more brittle

### 15.2 Secondary fix discovered during validation

While validating Phase A, a broad output-support regression surfaced in:

- `packages/engine/src/output-combination-sweep.test.ts`

The issue was not the wall solver itself.

The problem was:

- `calculateAssembly(...)` still treated generic impact presence as enough to expose a floor-carrier support signal
- hybrid wall-like stacks could therefore surface `Rw` on assembly field bundles even when no defended floor carrier was actually present

That support-carrier signal is now narrowed so it only opens when a real floor carrier route exists:

- exact or bound floor-system match
- floor-system estimate
- catalog-backed impact lane
- explicit delta-backed carrier

### 15.3 Current closure status

Closed by the current Phase A pass:

- the explicit-metadata heavy-stack false `stud_wall_system` handoff reproduced in the original analysis note
- the old workbench duplicate jump is materially reduced and now held inside a conservative capped lane
- the light-lining reorder case now routes through `lined_massive_wall` instead of the previous optimistic double-leaf lane
- the broad output-support sweep no longer regresses on the hybrid wall case that surfaced during validation

Still open after Phase A:

- family selection is still hard-branch based rather than scored
- `multileaf_multicavity` is still a conservative surrogate, not a premium multi-cavity solver
- topology parsing still collapses contiguous solids too aggressively for a true long-term MorphologyV2 design

### 15.4 Residual scan after Phase A

A residual stress scan was run after Phase A across generated 5-layer archetypes and deeper hand-built hybrid stacks.

Main finding:

- the largest remaining reorder deltas are no longer clustering around the old hint-only stud promotion bug
- they now cluster mainly around true multi-leaf / triple-leaf patterns such as:
  - `board | porous fill | board | air gap | board`
  - `board | porous fill | heavy core | air gap | board`

Why that matters:

- these patterns are not good candidates for blind smoothing
- they are physically different from a two-leaf cavity wall
- a reorder that collapses an inner leaf can legitimately move the result a lot

That residual class is now handled explicitly:

- dynamic warnings now call out lightweight triple-leaf partitions directly
- broader multi-leaf partitions now get an explicit order-sensitive warning
- confidence is pushed down further on those topologies

This means the system is now separating two classes clearly:

- false optimistic family promotion that should be fixed
- genuinely order-sensitive multi-leaf behavior that should stay explicit

External support for this distinction:

- the cited partition paper on internal gypsum board layers in double-frame walls reports the classic triple-leaf penalty rather than a harmless reorder artifact:
  - `https://www.sciencedirect.com/science/article/abs/pii/S0003682X05001799`
  - inference from the abstract and current implementation: once an internal leaf creates a triple-leaf construction, the result should stay order-sensitive instead of being flattened into a stable two-leaf surrogate

### 15.5 Residual false-handoff scan after Phase B.1 boundary diagnostics

A broader generated swap scan was run after the new two-leaf family-boundary diagnostic landed.

Local scan shape:

- 6 solid materials on the left leaf
- 4 compliant middle options
- 6 solid materials in the inner solid slot
- 4 compliant middle options
- 6 solid materials on the right leaf
- adjacent swaps on positions `2<->3` and `3<->4`

Filter:

- keep only cases with at least one `Rw` / `R'w` / `DnT,w` delta of `8 dB` or more
- then drop any case that already carries an explicit order-sensitive or triple-leaf warning

Observed result on that scan:

- `0` remaining cases

Meaning:

- within this generated palette, the old large false-handoff class is no longer showing up silently
- the remaining big deltas are either:
  - already inside the explicit multi-leaf / triple-leaf order-sensitive posture, or
  - below the current `8 dB` alert threshold

Important limit:

- this is evidence of materially improved posture, not proof that every possible wall stack is solved
- the scan only covers the chosen local material palette and adjacent swaps, not arbitrary user imports or every deep manual hybrid
- because of that, Phase B.2 is still needed before the selector can be called fully ambiguity-aware in the numeric lane itself

## 16. Validation Record

Validation run after the shipped Phase A work, the multileaf order-sensitive follow-up, and the shipped Phase B.1 boundary diagnostics:

- `pnpm -C apps/web exec vitest run --config vitest.config.ts features/workbench/dynamic-route-family-boundary.test.ts features/workbench/dynamic-route-order-sensitivity.test.ts features/workbench/dynamic-route-instability.test.ts`
- `pnpm exec vitest run packages/engine/src/dynamic-airborne-family-boundary.test.ts packages/engine/src/dynamic-airborne-instability-repro.test.ts packages/engine/src/dynamic-airborne-order-sensitivity.test.ts packages/engine/src/airborne-framed-wall-benchmark.test.ts packages/engine/src/airborne-masonry-benchmark.test.ts`
- `pnpm exec vitest run packages/engine/src/output-combination-sweep.test.ts packages/engine/src/dynamic-guided-combination-sweep.test.ts`
- `pnpm -C apps/web exec vitest run --config vitest.config.ts features/workbench/complex-stack-audit.test.ts features/workbench/wall-seeded-edit-stability.test.ts`

Result:

- all suites above passed after the shipped Phase A, the multileaf order-sensitive follow-up, the support-carrier narrowing, and the new family-boundary diagnostics
