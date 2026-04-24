# Dynamic Airborne Cartography

Last reviewed: 2026-04-24
Status: split v1 landed 15 atomic commits that moved the first bounded
modules out of the original 6630-line monolith. The selected v2 slice
is continuing that work with composer injection and correction-guard
carves. `dynamic-airborne.ts` now has 2538 lines after the seventh Gate B
carve. The remaining body still includes floor / cap guards and the
composition wrapper `calculateDynamicAirborneResult`; some guards
**recursively call the composer itself** (guards re-invoke the composer
on variant layer stacks to probe the monotonic floor). Extracting those
recursive guards still requires behaviour-preserving composer injection
or another explicit split design. The remaining file sat at 3152 lines
before v2 Gate B and then sat at 3046 lines after the first
composer-injection carve. After `all_caller_invalid_thickness_guard_v1`
closed on 2026-04-24, `dynamic_airborne_split_refactor_v2` became the
selected next calculator architecture slice. Gate A of that slice
landed no-runtime: 14 remaining `apply*` guards were inventoried, six
direct recursive composer callers were named, and
`applyMicroGapFillEquivalenceGuard` was selected as the first Gate B
composer-injection carve. Gate B first carve landed on 2026-04-24:
`applyMicroGapFillEquivalenceGuard` now lives in
`dynamic-airborne-correction-guards.ts`, recursive probing is injected
through `DynamicAirborneComposer`, and `dynamic-airborne.ts` is down to
3046 lines. Gate B second carve landed on 2026-04-24: it moved
`applyHeavyUnframedCavityScreeningCap` into the same module. Gate B
third carve landed on 2026-04-24: it moved
`applyMixedSecurityBoardDoubleStudFieldTrim` into the correction-guards
module. Gate B fourth carve landed on 2026-04-24: it moved
`applyHighFillSingleBoardStudFieldLift` into the correction-guards
module. Gate B fifth carve landed on 2026-04-24: it moved
`applyMixedBoardEmptyCavityFieldMidbandLift` into the correction-guards
module, leaving `dynamic-airborne.ts` at 2722 lines and 9 in-file
guards. Gate B sixth carve landed on 2026-04-24: it moved
`applyMixedPremiumSplitFieldLift` into the correction-guards module,
leaving `dynamic-airborne.ts` at 2625 lines and 8 in-file guards. Gate
B seventh carve landed on 2026-04-24: it moved
`applyDiamondHybridResilientFieldMidbandTrim` into the correction-guards
module, leaving `dynamic-airborne.ts` at 2538 lines and 7 in-file
guards.

## Why Split

- Single file: 6630 lines, ~112 top-level `function|const|type`
  declarations, spanning family detection, predictor scoring,
  curve transforms, and family-specific calibration tables.
- Maintenance cost: every wall coverage or accuracy slice touches
  this file; diffs mix orthogonal concerns and agent context fills
  with irrelevant neighbours.
- Hygiene debt: MASTER_PLAN §3 grid row
  `dynamic-airborne.ts size` flagged 🟢 `hygiene debt` since
  2026-04-20 and remains the last un-addressed completion-signal
  C6 blocker.

## Target Structure (Three Files)

```
packages/engine/src/
  dynamic-airborne-family-detection.ts
  dynamic-airborne-predictor-scoring.ts
  dynamic-airborne-helpers.ts
  dynamic-airborne.ts            ← thin composition wrapper
```

`dynamic-airborne.ts` after the split keeps **only**:

- `export function calculateDynamicAirborneResult(...)` — the
  composition entry point.
- Re-exports of the public surface from the three target files so
  existing callers compile unchanged.

## Section Map (Current Line Numbers → Target File)

| Current (dynamic-airborne.ts) | Role | Target file |
|---|---|---|
| 58-98 (DynamicAirborneResult, Options, Delegate, FAMILY_LABELS) | public types + labels | family-detection (types) + helpers (labels) |
| 99-190 (template constants MIXED_PLAIN_*_LAB_TARGET_RW, *_FREQUENCIES_HZ) | calibration tables | helpers |
| 191-243 (getDelegateLabel, buildScreeningDelegate, blendDelegateCurves) | delegate composition | helpers |
| 244-408 (mixed_plain template resolvers, profile/fill helpers) | family-specific heuristics | family-detection |
| 408-520 (DynamicFramingHint + normalizeFramingHint + explicit hint predicates) | context normalization | family-detection |
| 513-886 (isBoardLikeLayer, isEnhancedBoardLayer, summarizeFramedBoardSystem, summarizeFramingEvidence, summarizePremiumSingleBoardFramedCandidate) | framed-wall heuristics | family-detection |
| 880-1156 (isPlainGypsumFilledSingleBoardCandidate, summarizeDoubleStudSignature, summarizeHeavyUnframedCavityRisk, summarizeMultileafOrderSensitivity, summarizeFamilyDecisionBoundary) | family boundary heuristics | family-detection |
| 1158-1371 (summarizePrimaryCavitySegments, reinforcement candidate helpers, micro-gap equivalent builders) | cavity / reinforcement helpers | family-detection |
| 1371-1424 (shiftCurve, interpolateLinear, interpolateRwSeries) | pure math | helpers |
| 1425-1701 (is*MasonryLayer, is*AacLayer, is*CltLayer, single-leaf masonry profile, trimOuterCompliantLayers) | material-family predicates | family-detection |
| 1702-1774 (computeContextMetric, anchorCurveToMetric, anchorCurveToComputedMetric, computeMicroGapEquivalenceMetric) | curve anchoring utilities | helpers |
| 1775-1799 (DYNAMIC_SOUND_SPEED, DYNAMIC_AIR_DENSITY, smoothstep01) | physical constants + math | helpers |
| 1800-2500 (Davy mass-law profile builders, octave gaussian dips) | single-leaf masonry Davy lane | predictor-scoring |
| 2500-5847 (every other build/score/blend function, template interpolation, multi-family predictor fusion) | predictor-driven curve composition | predictor-scoring |
| 5848-end (`calculateDynamicAirborneResult`) | composition entry point | stays in dynamic-airborne.ts |

Line numbers are approximate — the split slice re-snapshots them
immediately before moving code.

## Target-File Purposes

### `dynamic-airborne-family-detection.ts`

Owns everything that **classifies an assembly into a family** and
normalizes its context:

- `DynamicAirborneFamily` type + `FAMILY_LABELS` re-export
- Material-family predicates: `isMasonryLikeLayer`,
  `isAacLikeLayer`, `isPorothermClayLayer`, `isCeltLikeLayer`,
  etc.
- `DynamicFramingHint` + `normalizeFramingHint`
- `summarizeFramedBoardSystem`, `summarizeFramingEvidence`
- `summarizeDoubleStudSignature`, `summarizeHeavyUnframedCavityRisk`,
  `summarizeMultileafOrderSensitivity`,
  `summarizeFamilyDecisionBoundary`, `summarizePrimaryCavitySegments`
- `summarizeSingleLeafMasonryProfile`, `trimOuterCompliantLayers`

### `dynamic-airborne-predictor-scoring.ts`

Owns the **curve math** that turns a detected family into a
calibrated transmission-loss curve:

- Davy mass-law profile builder + octave gaussian dip utilities
- Premium single-board framed candidate interpolation + mixed
  plain / fire / firestop / silent / diamond template blenders
- Predictor-backed family estimate fusion (where the
  `predictor-*-family-estimate.ts` files are consumed)
- Delegate blending (dynamic + screening fallback)
- Calibration tables keyed by family + context

### `dynamic-airborne-helpers.ts`

Owns **reusable pure utilities** with no family-specific
knowledge:

- Curve math: `shiftCurve`, `interpolateLinear`,
  `interpolateRwSeries`, `computeContextMetric`,
  `anchorCurveToMetric`, `anchorCurveToComputedMetric`,
  `computeMicroGapEquivalenceMetric`
- Physical constants: `DYNAMIC_SOUND_SPEED`, `DYNAMIC_AIR_DENSITY`
- Octave-band weight helpers: `smoothstep01`,
  `octaveBandWindowWeight`, `octaveGaussianDip`
- `getDelegateLabel`, `buildScreeningDelegate`,
  `blendDelegateCurves`
- Template constants (MIXED_PLAIN_MODERATE_LAB_TARGET_RW,
  MIXED_PLAIN_PREMIUM_LAB_TARGET_RW, template frequencies)

### `dynamic-airborne.ts` (after split)

- `calculateDynamicAirborneResult` — the single exported entry
  point consumed by `calculate-assembly.ts`
- Internal helpers specific to the composition flow (if any)
- Re-exports of the public surface from the three target files

## Guard Rails For The Split Slice

The split lands as a **mechanical code move with zero behaviour
change**. The guarding tests are:

- `wall-physical-invariants-matrix.test.ts` (I1/I2/I3 × 6
  presets × 3 contexts)
- `raw-wall-hostile-input-answer-matrix.test.ts` +
  workbench-side route-card matrix
- `wall-lsf-timber-stud-preset-benchmarks.test.ts`
- `wall-preset-expansion-benchmarks.test.ts`
- `wall-full-preset-contract-matrix.test.ts`
- `wall-reorder-invariance-matrix.test.ts`
- `airborne-verified-catalog.test.ts`
- `airborne-masonry-benchmark.test.ts`
- `airborne-aircrete-benchmark.test.ts`
- `airborne-framed-wall-benchmark.test.ts`
- `dynamic-airborne-deep-hybrid-swap-*.test.ts` cohort (four
  files)
- `dynamic-airborne-instability-repro.test.ts`
- `dynamic-airborne-wall-selector-trace-matrix.test.ts`

If any of the above goes red after the move, a code move
corrupted behaviour — investigate before commit. If they all stay
green, the split is safe by construction.

## Non-Obvious Notes

1. **`calculateDynamicAirborneResult` imports** are the shape
   constraint. Every internal helper it touches must be exported
   from one of the three files after the split. Before moving
   code, list its transitive call graph and pick the destination
   that minimises cross-file imports.
2. **Circular import risk**: family-detection cannot import
   predictor-scoring (predictor scoring uses family classification
   output). Helpers must not import either of the other two.
   Enforce with `eslint-plugin-import` boundaries config or a
   manual review pass.
3. **Calibration tables** are large — keep them grouped near the
   code that uses them to avoid unnecessary import graph fan-out.
4. **Line-number-based mapping is a snapshot**. The split slice
   re-runs the same grep at commit time, maps to fresh line
   numbers, and does the move in one atomic commit.
5. **No type name changes**. The exported types keep their current
   names; a rename is a separate hygiene slice if needed.

## Execution Progress (2026-04-21)

The split slice is well underway — **ten commits** have landed:

| Commit | Scope | Main-file delta |
|---|---|---|
| `c0a5068` | Carve `dynamic-airborne-helpers.ts` (pure math, spectrum weights, physical constants, delegate blending, curve anchoring) | 6630 → 6420 |
| `361d97d` | Carve material-family predicates into `dynamic-airborne-family-detection.ts` (15 `is*Layer` / `is*BuildUp` predicates) | 6420 → 6263 |
| `b4d32a9` | Add framing hint helpers to `dynamic-airborne-family-detection.ts` | 6263 → 6234 |
| `a398ec9` | Move shared types `DynamicAirborneOptions` + `DynamicAirborneResult` into helpers.ts; carve Davy/Cremer masonry cap into `dynamic-airborne-davy-masonry.ts` | 6234 → 5977 |
| `c74e915` | Carve mixed-plain template resolvers + lab-target Rw tables into `dynamic-airborne-mixed-plain-templates.ts` | 5977 → 5787 |
| `6a15f5b` | Carve cavity topology + layer-variant builders into `dynamic-airborne-cavity-topology.ts` | 5787 → 5544 |
| `75359a7` | Open `dynamic-airborne-masonry-calibration.ts` with AAC + silicate estimators | 5565 → 5385 |
| `40591cb` | Extend masonry-calibration with unfinished aircrete + Celcon finished aircrete estimators | 5385 → 5142 |
| `b59ab19` | Extend masonry-calibration with Porotherm + HELUZ clay brick estimators | 5142 → 4886 |
| `1379eff` | Close masonry-calibration with Ytong Massief / Separatiepaneel / Cellenbetonblok trio | 4888 → 4559 |

Subsequent commits:

| Commit | Scope | Main-file delta |
|---|---|---|
| `bdd1b9f` | Move `isBoardLikeLayer` + `isEnhancedBoardLayer` into family-detection | 4559 → 4549 |
| `280942a` | Move `normalizeBoundarySignal` into helpers.ts | 4549 → 4542 |
| `025b2a7` | Extend cavity-topology with reinforcement + single-leaf masonry profile + trim helpers | 4542 → 4379 |
| `9a5ab34` | Carve framed wall summary types + summarizers (summarizeFramedBoardSystem, summarizeFramingEvidence, summarizePremiumSingleBoardFramedCandidate, isPlainGypsumFilledSingleBoardCandidate, summarizeDoubleStudSignature, summarizeHeavyUnframedCavityRisk, summarizeMultileafOrderSensitivity, summarizeFamilyDecisionBoundary) into `dynamic-airborne-framed-wall.ts` | 4379 → 3710 |
| `c15defa` | Extend framed-wall module with `estimateStudWallTargetRw` estimator + 5 upstream corridor detector imports | 3710 → 3214 |

Final state (2026-04-21): `dynamic-airborne.ts` has shed **3416
lines** (−52%) into **seven bounded modules**:

| Carved module | Lines | Purpose |
|---|---|---|
| `dynamic-airborne-helpers.ts` | 272 | Pure math, spectrum weights, physical constants, delegate blending, curve anchoring, **shared types** (`DynamicAirborneOptions`, `DynamicAirborneResult`, `DelegateCurve`, `DelegateBlend`) |
| `dynamic-airborne-family-detection.ts` | 236 | Material predicates (`is*Layer`, `is*BuildUp`) + framing hint helpers |
| `dynamic-airborne-davy-masonry.ts` | 270 | Davy/Cremer single-leaf masonry coincidence cap |
| `dynamic-airborne-mixed-plain-templates.ts` | 237 | Mixed-plain premium/moderate lab-target Rw tables + template id resolvers |
| `dynamic-airborne-cavity-topology.ts` | 285 | `describePrimaryCavity`, `summarizePrimaryCavitySegments`, micro-gap + narrow-gap + reduced-thickness variant builders |
| `dynamic-airborne-masonry-calibration.ts` | 1057 | All 9 masonry estimators (AAC + silicate + unfinished aircrete + Celcon finished + Porotherm + HELUZ + Ytong Massief + Ytong Separatiepaneel + Ytong Cellenbetonblok) |
| `dynamic-airborne-framed-wall.ts` | 1251 | Framed wall summary types + 8 summarizers + `estimateStudWallTargetRw` estimator consuming fire-rated / security / symmetric-enhanced / mixed-enhanced / mixed-plain corridor tables |

### Remaining Work Deferred

Before Gate B, approximately 3152 lines still lived in
`dynamic-airborne.ts`:

1. **Floor / cap guards** (~14 `apply*` functions, ~1900 lines):
   `applySingleLeafMasonryMonotonicFloor`,
   `applyNarrowHeavyDoubleLeafGapCap`,
   `applyHeavyUnframedCavityScreeningCap`,
   `applyLinedMassiveMasonryMonotonicFloor`,
   `applyMixedSecurityBoardDoubleStudFieldTrim`,
   `applyFramedReinforcementMonotonicFloor`,
   `applyHighFillSingleBoardStudFieldLift`,
   `applyMixedBoardEmptyCavityFieldMidbandLift`,
   `applyMixedPremiumSplitFieldLift`,
   `applyDiamondHybridResilientFieldMidbandTrim`,
   `applyMixedPlainModerateSingleBoardLabTemplate`,
   `applyPremiumSingleBoardFieldCorrection`,
   `applyMicroGapFillEquivalenceGuard`,
   `applyAmbiguousFamilyBoundaryHold`.
2. **`calculateDynamicAirborneResult`** + `detectDynamicFamily` +
   `chooseBlend` (~1300 lines of composition scaffolding).

### Gate A Inventory - 2026-04-24

Focused baseline before touching the active slice:
`pnpm calculator:gate:current` green (engine 85 files / 391 tests,
web 36 files / 170 passed + 18 skipped, build 5/5, whitespace guard
clean; known non-fatal `sharp/@img` warnings only).

Fresh source snapshot:

- `packages/engine/src/dynamic-airborne.ts`: 3152 physical lines.
- Remaining top-level `apply*` guard count: 14.
- Direct internal recursive composer calls from guards:
  6 `calculateDynamicAirborneResult(...)` calls.
- External production callers of the composer remain
  `calculate-assembly.ts` equivalent-dynamic and main airborne paths;
  benchmark/regression tests also call it directly.

Guard call graph:

| Guard | Lines | Composer calls | Classification | Gate B implication |
|---|---:|---:|---|---|
| `applySingleLeafMasonryMonotonicFloor` | 109-264 | 1 | recursive monotonic floor | needs injected `DynamicAirborneComposer`; carries `disableSingleLeafMasonryFloor` + depth guard |
| `applyNarrowHeavyDoubleLeafGapCap` | 265-426 | 1 | recursive cap | needs injected composer; carries `disableNarrowHeavyDoubleLeafGapGuard` + depth guard |
| `applyHeavyUnframedCavityScreeningCap` | 427-522 | 0 | non-recursive cap | can move without composer, but does not prove the composer-injection design |
| `applyLinedMassiveMasonryMonotonicFloor` | 523-670 | 1 | recursive monotonic floor | needs injected composer; carries `disableLinedMassiveMasonryFloor` + depth guard |
| `applyMixedSecurityBoardDoubleStudFieldTrim` | 671-741 | 0 | non-recursive field trim | can move after first recursive carve machinery exists |
| `applyFramedReinforcementMonotonicFloor` | 742-915 | 1 | recursive monotonic floor | needs injected composer; carries `framedReinforcementMonotonicGuardDepth` |
| `applyHighFillSingleBoardStudFieldLift` | 916-988 | 0 | non-recursive field lift | can move after correction-guard module exists |
| `applyMixedBoardEmptyCavityFieldMidbandLift` | 989-1075 | 0 | non-recursive field lift | can move after correction-guard module exists |
| `applyMixedPremiumSplitFieldLift` | 1076-1173 | 0 | non-recursive field lift | can move after correction-guard module exists |
| `applyDiamondHybridResilientFieldMidbandTrim` | 1174-1259 | 0 | non-recursive field trim | can move after correction-guard module exists |
| `applyMixedPlainModerateSingleBoardLabTemplate` | 1260-1406 | 0 | non-recursive template correction | can move after correction-guard module exists |
| `applyPremiumSingleBoardFieldCorrection` | 1407-1678 | 0 | non-recursive field correction | large block; move only after the smaller guard carve is green |
| `applyMicroGapFillEquivalenceGuard` | 1679-1787 | 1 | recursive equivalence guard | **first Gate B carve target** because it is the smallest recursive guard and exercises composer injection |
| `applyAmbiguousFamilyBoundaryHold` | 1788-1970 | 1 | recursive family-boundary hold | needs injected composer plus `FAMILY_LABELS`; leave for a later carve |

Injected composer type to introduce in `dynamic-airborne-helpers.ts`
before the first recursive carve:

```ts
export type DynamicAirborneComposer = (
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
) => DynamicAirborneResult;
```

Selected first carve:

- Add `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Move `applyMicroGapFillEquivalenceGuard` first, passing
  `calculateDynamicAirborneResult` as a `DynamicAirborneComposer`.
- Keep the body verbatim except replacing the direct recursive
  `calculateDynamicAirborneResult(...)` call with `composer(...)`.
- Export only the moved guard and the composer type needed by the
  guard module. Do not move `applyAmbiguousFamilyBoundaryHold` in the
  first carve because it also needs `FAMILY_LABELS` and has family
  boundary reporting surface area.
- After this smallest recursive carve is green, move the non-recursive
  correction guards in bounded blocks, then the remaining recursive
  monotonic floors/caps.

### Gate B First Carve - 2026-04-24

Status: Gate B first carve landed, behavior-preserving.

- Added `DynamicAirborneComposer` to
  `packages/engine/src/dynamic-airborne-helpers.ts`.
- Added `packages/engine/src/dynamic-airborne-correction-guards.ts`.
- Moved `applyMicroGapFillEquivalenceGuard` out of
  `dynamic-airborne.ts`.
- Replaced only the moved guard's direct
  `calculateDynamicAirborneResult(...)` call with `composer(...)`.
- Imported the moved guard into `dynamic-airborne.ts` and passed
  `calculateDynamicAirborneResult` from the existing call site.

Fresh source snapshot after the first carve:

- `packages/engine/src/dynamic-airborne.ts`: 3046 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 131
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 13.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.

### Gate B Second Carve - 2026-04-24

Status: landed, behavior-preserving.

- Moved `applyHeavyUnframedCavityScreeningCap` into
  `dynamic-airborne-correction-guards.ts`.
- The cap guard stayed non-recursive; no composer parameter was added.
- `dynamic-airborne.ts` now imports both carved correction guards from
  `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the second carve:

- `packages/engine/src/dynamic-airborne.ts`: 2950 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 237
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 12.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the second carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green. The only build warnings were the known non-fatal
  `sharp/@img` optional-package warnings.

Next carve target: `applyMixedSecurityBoardDoubleStudFieldTrim`. It is
the smallest remaining non-recursive field trim and can move into
`dynamic-airborne-correction-guards.ts` without another composer path.
Keep this move isolated before touching the larger field correction,
template, or monotonic floor blocks.

### Gate B Third Carve - 2026-04-24

Status: Gate B third carve landed, behavior-preserving.

- Moved `applyMixedSecurityBoardDoubleStudFieldTrim` into
  `dynamic-airborne-correction-guards.ts`.
- The field trim stayed non-recursive; no composer parameter was added.
- `dynamic-airborne.ts` now imports all three carved correction guards
  from `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the third carve:

- `packages/engine/src/dynamic-airborne.ts`: 2880 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 310
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 11.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the third carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green. The only build warnings were the known non-fatal
  `sharp/@img` optional-package warnings.

Next carve target: `applyHighFillSingleBoardStudFieldLift`. It is the
next smallest remaining non-recursive correction guard and can move into
`dynamic-airborne-correction-guards.ts` without another composer path.
Keep this move isolated before touching the larger field correction,
template, or monotonic floor blocks.

### Gate B Fourth Carve - 2026-04-24

Status: Gate B fourth carve landed, behavior-preserving.

- Moved `applyHighFillSingleBoardStudFieldLift` into
  `dynamic-airborne-correction-guards.ts`.
- The field lift stayed non-recursive; no composer parameter was added.
- `dynamic-airborne.ts` now imports all four carved correction guards
  from `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the fourth carve:

- `packages/engine/src/dynamic-airborne.ts`: 2808 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 383
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 10.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the fourth carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green. The only build warnings were the known non-fatal
  `sharp/@img` optional-package warnings.

Next carve target: `applyMixedBoardEmptyCavityFieldMidbandLift`. It is
the next small non-recursive field-lift correction and can move into
`dynamic-airborne-correction-guards.ts` without another composer path.
Keep this move isolated before touching the larger field correction,
template, or monotonic floor blocks.

### Gate B Fifth Carve - 2026-04-24

Status: Gate B fifth carve landed, behavior-preserving.

- Moved `applyMixedBoardEmptyCavityFieldMidbandLift` into
  `dynamic-airborne-correction-guards.ts`.
- The midband lift stayed non-recursive; no composer parameter was
  added.
- `dynamic-airborne.ts` now imports all five carved correction guards
  from `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the fifth carve:

- `packages/engine/src/dynamic-airborne.ts`: 2722 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 471
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 9.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the fifth carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green; `git diff --check` clean. The only build warnings
  were the known non-fatal `sharp/@img` optional-package warnings.

Next carve target: `applyMixedPremiumSplitFieldLift`. It is the next
remaining non-recursive field-lift correction and can move into
`dynamic-airborne-correction-guards.ts` without another composer path.
Keep this move isolated before touching the larger field correction,
template, or monotonic floor blocks.

### Gate B Sixth Carve - 2026-04-24

Status: Gate B sixth carve landed, behavior-preserving.

- Moved `applyMixedPremiumSplitFieldLift` into
  `dynamic-airborne-correction-guards.ts`.
- The split-cavity field lift stayed non-recursive; no composer
  parameter was added.
- `dynamic-airborne.ts` now imports all six carved correction guards
  from `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the sixth carve:

- `packages/engine/src/dynamic-airborne.ts`: 2625 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 569
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 8.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the sixth carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green; `git diff --check` clean. The only build warnings
  were the known non-fatal `sharp/@img` optional-package warnings.

Next carve target: `applyDiamondHybridResilientFieldMidbandTrim`. It is
the next remaining non-recursive field-trim correction and can move into
`dynamic-airborne-correction-guards.ts` without another composer path.
Keep this move isolated before touching the larger field correction,
template, or monotonic floor blocks.

### Gate B Seventh Carve - 2026-04-24

Status: Gate B seventh carve landed, behavior-preserving.

- Moved `applyDiamondHybridResilientFieldMidbandTrim` into
  `dynamic-airborne-correction-guards.ts`.
- The diamond-hybrid field trim stayed non-recursive; no composer
  parameter was added.
- `dynamic-airborne.ts` now imports all seven carved correction guards
  from `dynamic-airborne-correction-guards.ts`.

Fresh source snapshot after the seventh carve:

- `packages/engine/src/dynamic-airborne.ts`: 2538 physical lines.
- `packages/engine/src/dynamic-airborne-correction-guards.ts`: 657
  physical lines.
- Remaining top-level `apply*` guards still inside
  `dynamic-airborne.ts`: 7.
- Remaining direct recursive composer callers still inside
  `dynamic-airborne.ts`: 5
  (`applySingleLeafMasonryMonotonicFloor`,
  `applyNarrowHeavyDoubleLeafGapCap`,
  `applyLinedMassiveMasonryMonotonicFloor`,
  `applyFramedReinforcementMonotonicFloor`,
  `applyAmbiguousFamilyBoundaryHold`).
- Total guard inventory remains 14 across the composer file plus
  `dynamic-airborne-correction-guards.ts`.
- Validation after the seventh carve:
  targeted contract + coverage-grid 2 files / 10 tests green; focused
  dynamic airborne / hostile-input sweep 7 files / 248 tests green;
  engine lint/typecheck green; `pnpm calculator:gate:current` green
  with 86 engine files / 396 tests, 36 web files / 170 passed +
  18 skipped, build 5/5, and whitespace guard clean; post-build web
  typecheck green; `git diff --check` clean. The only build warnings
  were the known non-fatal `sharp/@img` optional-package warnings.
- Follow-up broad audit after the seventh carve:
  `pnpm check` green with engine 219 files / 1216 tests, web 150 files /
  864 passed + 18 skipped, build 5/5, and the same known non-fatal
  `sharp/@img` optional-package warnings. No behavior or plan drift was
  found; the next move remains the eighth bounded carve.

Next carve target: `applyMixedPlainModerateSingleBoardLabTemplate`. It
is the next remaining non-recursive template correction and can move
into `dynamic-airborne-correction-guards.ts` without another composer
path. Keep this move isolated before touching the premium
field-correction or monotonic floor blocks.

### Why Split v1 Stopped At Recursive Guards

The floor / cap guards **recursively call
`calculateDynamicAirborneResult`** on variant layer stacks (probing
reduced-thickness or narrow-gap equivalents) to build their
monotonic floor. A mechanical move of the guards into a new
module would require importing the composer from
`dynamic-airborne.ts`, which would import back from the new
module — a circular-import cycle.

The v2 slice is now executing the composer-injection option
incrementally. Non-recursive corrections can still move as plain
mechanical carves; recursive guards must either accept a
`DynamicAirborneComposer` parameter or wait for another explicit split
design.

Options that were considered before v2:

1. **Composer injection**: refactor every guard to accept the
   composer as a function parameter (`composer:
   (layers, opts) => DynamicAirborneResult`). Mechanical but
   touches every call site — behaviour-preserving when done
   carefully.
2. **Split the composer too**: move `calculateDynamicAirborneResult`
   into a fourth file alongside `detectDynamicFamily` and
   `chooseBlend`. Still needs guards + composer in the same
   module or injection.
3. **Defer the remaining split**: note that the current 2538-line
   file is still above the 2000-line threshold and document the
   split deferral (as this doc does now).

The v1 split slice is considered **successfully closed at 15 atomic
commits landing 7 bounded modules, −52% main-file reduction** on
2026-04-21. The remaining v2 work is bounded by the same import-graph
rule rather than unbounded scope.

### Next Agent Guidance - Gate B Seventh Carve Landed 2026-04-24

- Start with Gate B from
  `docs/calculator/SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md`:
  move `applyMixedPlainModerateSingleBoardLabTemplate` next, as a
  separate non-recursive template carve into
  `dynamic-airborne-correction-guards.ts`.
- Keep the next carve atomic. Do not mix it with the larger monotonic
  floors, `applyAmbiguousFamilyBoundaryHold`, or field correction
  blocks.
- Keep the shared type imports pointed at
  `dynamic-airborne-helpers.ts`; helpers stays the bottom-of-
  graph module.
- Don't deduplicate or rewrite during a carve — every move is
  verbatim. Rewrites land in separate follow-up slices with their
  own test coverage.
- Re-run the regression sweep after each carve:
  `pnpm --filter @dynecho/engine exec vitest run src/airborne-*benchmark*.test.ts src/calculate-assembly.test.ts src/dynamic-airborne-instability-repro.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts`
- Update this section's progress table with the new commit.

## Historical v1 Execution Strategy

This section records the already-landed v1 strategy. A 6630-line
mechanical move in a single commit carried real risk:
circular imports, missed private helpers, type-import mismatches,
and diff review overhead that could hide behaviour mutations. The
split landed as incremental commits on the same slice, each validated by
the hostile-input + invariants + benchmark gate before proceeding:

1. **Commit 1 — pure helpers**: carve out
   `dynamic-airborne-helpers.ts`: math, constants, delegate
   blending, curve anchoring utilities. Zero family-specific
   knowledge, minimal import graph touch. Easy to validate.
2. **Commit 2 — family detection**: carve out
   `dynamic-airborne-family-detection.ts`: material predicates,
   framing hint normalization, summarize-* helpers, family
   boundary logic. Moderate risk, guarded by the hostile-input
   matrix.
3. **Commit 3 — predictor scoring**: carve out
   `dynamic-airborne-predictor-scoring.ts`: Davy profile
   builders, template interpolation, predictor-driven curve
   composition. `calculateDynamicAirborneResult` becomes the thin
   composition wrapper in the original file.

If commit 2 or 3 reveals an unexpected coupling, revert that
commit (not the prior one) and re-plan the subset. Commit 1 alone
still reduces file size and delivers incremental value.

## Out Of Scope For The Split Slice

- Renaming exports, function signatures, or parameter names.
- Inlining or extracting any logic that was not already in a
  function.
- Changing the public surface consumed by `calculate-assembly.ts`
  beyond re-exports.
- Adding new behaviour, families, or predictors.

## Current Next Step

Continue `dynamic_airborne_split_refactor_v2` Gate B with the eighth
bounded carve: move `applyMixedPlainModerateSingleBoardLabTemplate` into
`dynamic-airborne-correction-guards.ts`, update the static contract and
line-count map, then re-run the focused dynamic-airborne sweep,
`pnpm calculator:gate:current`, post-build web typecheck, and
`git diff --check`.
