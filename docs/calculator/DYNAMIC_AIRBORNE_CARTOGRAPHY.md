# Dynamic Airborne Cartography

Last reviewed: 2026-04-21
Purpose: read-only audit artifact that maps the 6630-line monolith
`packages/engine/src/dynamic-airborne.ts` onto the three target
files its future split slice
(`dynamic_airborne_split_refactor_v1`, master-plan step 4) will
produce. No code moves here — this is the blueprint the split
will follow, guarded by the wall hostile-input + physical
invariants matrices that already pin end-to-end engine behaviour.

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

The split slice is well underway — five commits have landed:

| Commit | Scope | File delta |
|---|---|---|
| `c0a5068` | Carve `dynamic-airborne-helpers.ts` (pure math, spectrum weights, physical constants, delegate blending, curve anchoring) | 283-line new file, main 6630 → 6420 |
| `361d97d` | Carve material-family predicates into `dynamic-airborne-family-detection.ts` (15 `is*Layer` / `is*BuildUp` predicates) | main 6420 → 6263 |
| `b4d32a9` | Add framing hint helpers to `dynamic-airborne-family-detection.ts` (`DynamicFramingHint`, `normalizeFramingHint`, `hasExplicitFramingHint`, `isResilientFramingHint`) | main 6263 → 6234 |
| `a398ec9` | Move shared types `DynamicAirborneOptions` + `DynamicAirborneResult` into helpers.ts; carve Davy/Cremer masonry cap (`buildMasonryDavyProfile`, `buildMasonryDavyCremerCurve`, `applyMasonryDavyConservativeCap`) into `dynamic-airborne-davy-masonry.ts` | main 6234 → 5977 |
| `c74e915` | Carve mixed-plain template resolvers + lab-target Rw tables into `dynamic-airborne-mixed-plain-templates.ts` | main 5977 → 5787 |

Net so far: `dynamic-airborne.ts` has shed 843 lines into four
bounded modules (1015 carved-out lines total — the delta is
bigger than the main-file savings because carves include local
imports + re-export headers):

| Carved module | Lines | Purpose |
|---|---|---|
| `dynamic-airborne-helpers.ts` | 272 | Pure math, spectrum weights, physical constants, delegate blending, curve anchoring, **shared types** (`DynamicAirborneOptions`, `DynamicAirborneResult`, `DelegateCurve`, `DelegateBlend`) |
| `dynamic-airborne-family-detection.ts` | 236 | Material predicates (`is*Layer`, `is*BuildUp`) + framing hint helpers (`DynamicFramingHint`, `normalizeFramingHint`, etc.) |
| `dynamic-airborne-davy-masonry.ts` | 270 | Davy/Cremer single-leaf masonry coincidence cap (profile + Cremer curve + conservative cap) |
| `dynamic-airborne-mixed-plain-templates.ts` | 237 | Mixed-plain premium/moderate lab-target Rw tables + template id resolvers + fill interpolation |

### Remaining Work Inside The Slice

Roughly 3787 lines still live in `dynamic-airborne.ts` after
the easy carves. The remaining bulk is:

1. **Masonry calibration lane** (`estimateAacMassiveTargetRw`,
   `estimateSilicateMasonryTargetRw`,
   `estimateUnfinishedAircreteTargetRw`,
   `estimatePorothermPlasteredTargetRw`,
   `estimateHeluzPlasteredClayTargetRw`,
   `estimateYtongMassiefG2300TargetRw`,
   `estimateYtongSeparatiePaneelTargetRw`,
   `estimateYtongCellenbetonblokTargetRw`,
   `estimateCelconFinishedAircreteTargetRw`) — ~1020 lines total,
   similar shape (`(layers, topology, currentRw, family) →
   { notes, shiftDb, strategySuffix, targetRw }`). Carve into
   `dynamic-airborne-masonry-calibration.ts` as one atomic move —
   all functions share the same predicate + helper imports that
   are already in other modules.
2. **Framed wall calibration** (`estimateStudWallTargetRw`,
   `summarizeFramedBoardSystem`, `summarizeFramingEvidence`,
   `summarizePremiumSingleBoardFramedCandidate`,
   `summarizeDoubleStudSignature`, etc.) — ~900 lines. Carve
   into `dynamic-airborne-framed-wall-calibration.ts`. Moderate
   risk; shares `describePrimaryCavity` with the masonry side.
3. **Topology summaries + cavity helpers**
   (`describePrimaryCavity`, `summarizePrimaryCavitySegments`,
   `summarizeSingleLeafMasonryProfile`, `trimOuterCompliantLayers`,
   `findOuterLeafReinforcementCandidateIndex`,
   micro-gap equivalent builders) — ~700 lines. Carve into
   `dynamic-airborne-cavity-topology.ts` so framed-wall and
   masonry lanes share.
4. **Floor / cap guards** (`apply*MonotonicFloor`,
   `apply*Cap`, `apply*Trim`) — ~800 lines. Could split into
   `dynamic-airborne-floor-guards.ts` or keep in main composition
   if tightly coupled.
5. **`calculateDynamicAirborneResult`** + remaining scaffolding —
   stays in `dynamic-airborne.ts` as the composition wrapper.

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
