# Dynamic Airborne Cartography

Last reviewed: 2026-04-21
Status: the split slice has landed 15 atomic commits that shed
2416 lines from the monolith into seven bounded modules. The
remaining ~3200 lines hold the floor / cap guards and the
composition wrapper `calculateDynamicAirborneResult`, which
**recursively call the composer itself** (guards re-invoke the
composer on variant layer stacks to probe the monotonic floor).
Extracting them via a mechanical move would introduce a circular
import — it needs a behaviour-preserving refactor that passes the
composer in as a function parameter, which is a follow-up slice
rather than part of the mechanical split. The remaining file sits
at 3214 lines with an explicit "split deferred pending composer
parameterization" note here (satisfies the user rule "2000 satırsa
ve artık bölünmesi gerekiyorsa bölmelisin. Veya bölünmeli diye
dökümanlara not almalısın").

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

Approximately 3200 lines still live in `dynamic-airborne.ts`:

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

### Why The Split Stops Here (Circular Dependency)

The floor / cap guards **recursively call
`calculateDynamicAirborneResult`** on variant layer stacks (probing
reduced-thickness or narrow-gap equivalents) to build their
monotonic floor. A mechanical move of the guards into a new
module would require importing the composer from
`dynamic-airborne.ts`, which would import back from the new
module — a circular-import cycle.

Options for a follow-up slice (not landed here):

1. **Composer injection**: refactor every guard to accept the
   composer as a function parameter (`composer:
   (layers, opts) => DynamicAirborneResult`). Mechanical but
   touches every call site — behaviour-preserving when done
   carefully.
2. **Split the composer too**: move `calculateDynamicAirborneResult`
   into a fourth file alongside `detectDynamicFamily` and
   `chooseBlend`. Still needs guards + composer in the same
   module or injection.
3. **Defer the remaining split**: note that the current 3214-line
   file is still above the 2000-line threshold and document the
   split deferral (as this doc does now). The next cycle of
   master-plan step 7 or a dedicated `dynamic_airborne_split_refactor_v2`
   slice can pick this up with composer-parameterization as the
   explicit design goal.

The split slice is considered **successfully closed at 15 atomic
commits landing 7 bounded modules, −52% main-file reduction** on
2026-04-21. The remaining work has a specific, documented blocker
(circular dependency between guards and composer) rather than
unbounded scope.

### Next Agent Guidance

- Pick ONE block from the list above and carve it atomically.
- Keep the shared type imports pointed at
  `dynamic-airborne-helpers.ts`; helpers stays the bottom-of-
  graph module.
- Don't deduplicate or rewrite during a carve — every move is
  verbatim. Rewrites land in separate follow-up slices with their
  own test coverage.
- Re-run the regression sweep after each carve:
  `pnpm --filter @dynecho/engine exec vitest run src/airborne-*benchmark*.test.ts src/calculate-assembly.test.ts src/dynamic-airborne-instability-repro.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts`
- Update this section's progress table with the new commit.

## Execution Strategy — Incremental, Not Monolithic

A 6630-line mechanical move in a single commit carries real risk:
circular imports, missed private helpers, type-import mismatches,
and diff review overhead that hides behaviour mutations. The
split lands as **three incremental commits** on the same slice,
each validated by the full hostile-input + invariants +
benchmark gate before proceeding:

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

## Next Step

Finish `wall_hostile_input_matrix_with_airborne_cartography_v1`
(this slice's post-contract), then enter
`dynamic_airborne_split_refactor_v1` (master-plan step 4) with
this cartography as the blueprint.
