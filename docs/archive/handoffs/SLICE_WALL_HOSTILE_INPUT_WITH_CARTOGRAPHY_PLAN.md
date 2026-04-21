# Slice Plan — Wall Hostile Input Matrix With Airborne Cartography

Slice id: `wall_hostile_input_matrix_with_airborne_cartography_v1`
Status: CLOSED 2026-04-21 (closeout contract
`packages/engine/src/post-wall-hostile-input-matrix-with-airborne-cartography-v1-next-slice-selection-contract.test.ts`)
Authored: 2026-04-21
Updated: 2026-04-21 (closed)
Owner: historical — next agent works from
`DYNAMIC_AIRBORNE_CARTOGRAPHY.md`

## Why This Slice Exists

Three axes in one slice (per MASTER_PLAN §2 P1 coverage + accuracy
+ architecture):

- **Coverage (C4)** — floor-side hostile-input discipline exists
  (`raw-floor-hostile-input-answer-matrix.test.ts` + workbench
  route-card matrix). Wall mode has no equivalent. Master-plan §8
  completion signal C4 stays at half-green until wall hostile input
  lands.
- **Accuracy (P3 tests measure correctness)** — current wall engine
  behaviour on 50+ layer stacks, unknown `materialId`, invalid
  thickness, and mixed hostile inputs is only informally probed.
  Capturing the deterministic output on these shapes means future
  engine changes cannot silently shift user-visible output surfaces
  for the edge cases.
- **Architecture (step 4 prep)** — `dynamic-airborne.ts` is 6630
  lines; splitting it safely (step 4) needs a dense test surface
  that exercises the family-detection entry point, predictor
  scoring, and heuristic branches across both happy and hostile
  inputs. This slice lands the cartography + hostile tests that
  guard the split.

## Pre-Slice Analysis (verified 2026-04-21)

- Floor hostile analog: 2 files, together cover ~10 classes of
  hostile input, pinning the exact `supported` / `unsupported`
  output set, the answer basis, and workbench route-card content
  per case.
- Wall engine path: `calculate-assembly.ts` → airborne overlay →
  verified catalog anchor → dynamic airborne family detection in
  `packages/engine/src/dynamic-airborne.ts` line 1..6630. Entry
  point for family detection: `detectAirborneFamily` in
  `apply-airborne-context.ts`. Surface exposed: `ratings` +
  `curve` + `warnings` + `dynamicAirborneTrace`.
- Workbench hostile-input normalization: `normalize-rows.ts`
  handles empty `materialId`, invalid thickness, NaN/Infinity, but
  an engine-level guard is missing — direct API / CLI / test
  callers can hit the raw engine path without normalization.
- Engine thickness guard: currently no single entry point. Each
  resolver branch conditionally handles bad thickness. Unification
  lives alongside the wall hostile slice because both need the
  same invariant surface.
- `dynamic-airborne.ts` cartography not yet documented. The split
  slice (step 4) will need a facts document pinning which exports
  belong to which eventual file.

## Deliverables

1. **`raw-wall-hostile-input-answer-matrix.test.ts`** (engine):
   mirror of the floor matrix, adapted to wall routes. Classes of
   input to cover:
   - 50 identical layers (symmetric heavy stack)
   - 50 mixed layers (varied materials, varied thickness)
   - unknown `materialId` (single + mixed with valid)
   - invalid thickness: `0`, negative, `NaN`, `Infinity`,
     non-numeric, very large
   - empty `layers` array
   - single-layer stacks (trivial case)
   - reorder of a pathological stack
2. **`raw-wall-hostile-input-route-card-matrix.test.ts`** (web):
   matching workbench route-card assertions — card status,
   provenance wording, warning surface, tone.
3. **Engine thickness guardrail**: single-entry validation function
   in the engine calculate pipeline that produces a deterministic
   fail-closed output on invalid thickness. No workbench
   normalization bypass risk. Existing workbench normalizer already
   catches common cases; the engine guard is the last line of
   defense for API / CLI callers.
4. **`hostile-thickness-input.test.ts`** (engine): cross-cutting
   matrix proving the guardrail on floor + wall invocations.
5. **Airborne cartography doc**:
   `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`. Maps each
   export in `dynamic-airborne.ts` to one of three target
   destinations for step 4 (family-detection, predictor-scoring,
   helpers). No code move yet — this is the documentation pass that
   makes the step 4 refactor reviewable.
6. **Post-contract**: selects step 4
   (`dynamic_airborne_split_refactor_v1`) as the next slice.
7. **Focused gate update** + triangle docs update + single atomic
   commit.

## Test Classes (Detail)

### 50+ layer stacks

- **Symmetric heavy (50 concrete)**: expect deterministic Rw,
  STC, C, Ctr. No crash, no timeout. Output shape: live in lab,
  unsupported `Rw` + live `R'w` in field.
- **50 mixed (alternating gypsum + rockwool + air)**: same
  assertions; the goal is pure engine robustness.
- **50 pathological (every tenth layer is 0-thickness)**: thickness
  guard triggers; output is fail-closed with a specific warning.

### Unknown material

- `materialId: "unobtainium"` (single layer): fail-closed with a
  specific "unknown material" warning.
- Mixed with valid: engine processes valid layers, fails closed on
  the unknown, produces a combined warning.

### Invalid thickness

- `thicknessMm: 0`: fail-closed; warning surface lists thickness
  class.
- `thicknessMm: -5`: same.
- `thicknessMm: NaN`: same.
- `thicknessMm: Infinity`: same.
- `thicknessMm: "not-a-number"` when coming through a raw call:
  same.
- `thicknessMm: 1e9`: same (sanity upper bound).

### Empty and trivial

- `layers: []`: deterministic empty output, no crash.
- single-layer concrete 100mm: live Rw, no field, invariants hold.

### Reorder under hostile

- take a 50-layer mixed stack, reverse it: output set identical
  (reorder invariance from step 1 extends to hostile sizes).

## Cartography Doc Structure

`DYNAMIC_AIRBORNE_CARTOGRAPHY.md` maps exports to targets:

```text
dynamic-airborne.ts (current, 6630 lines)
├── family detection        → dynamic-airborne-family-detection.ts
│   ├── detectAirborneFamily
│   ├── AirborneDetectedFamily type
│   └── family heuristics (mass-law, cavity, double-leaf, CLT, …)
├── predictor scoring       → dynamic-airborne-predictor-scoring.ts
│   ├── calculateDynamicAirborneResult
│   ├── predictor-published-family-estimate hooks
│   └── score-weighted curve composition
└── helpers                 → dynamic-airborne-helpers.ts
    ├── curve builders
    ├── spectrum utilities
    └── context normalization helpers
```

Each mapping line references the current line numbers in the
combined file so the step 4 refactor diff is easy to audit.

## Stop Conditions (Do NOT Ship If)

- Any new hostile-input case crashes the engine: real bug — fix
  engine before closing slice.
- Wall reorder invariance breaks under a 50-layer reversal: step 1
  regression — investigate.
- Thickness guardrail lets through a value that the existing
  workbench normalizer would reject: defect in the guard scope.
- Any existing test regresses: investigate root cause before
  closing.

## Risk & Rollback

- **Risk**: hostile-input matrix reveals another engine accuracy
  bug (analogous to the masonry flanking inversion). Mitigation:
  treat as real finding, open remediation sub-slice.
- **Rollback**: atomic commit — `git revert` if a downstream slice
  reveals an issue.

## Non-Obvious Notes For The Next Agent

1. Engine thickness guard should emit warnings the **same shape**
   as the existing `normalize-rows` warnings, so workbench surfaces
   keep a consistent user-facing wording.
2. Cartography doc is a **read-only audit artifact** — no code move
   in this slice. The split itself is step 4.
3. Floor matrices use `AirborneContext` + `impactFieldContext` pair;
   wall matrices can use only `AirborneContext`. Test fixtures
   should reflect that — don't copy-paste impact-specific fields.
4. Reorder-invariance-matrix already exists; extend its coverage
   implicitly by running hostile reorder inside the new matrix.
5. 50-layer test cases should fit under existing vitest per-test
   timeouts; if any case exceeds 5s, mark it `slow` and investigate
   why rather than raising the timeout.

## Out Of Scope For This Slice

- Fixing the timber stud accuracy gap (step 6 conditional).
- Actually splitting `dynamic-airborne.ts` (step 4).
- UI hostile-input improvements (user sees normalized output; the
  engine hardening is invisible to the happy path).
- Floor hostile-input extension (already green; any float is a
  separate small slice).

## Next Slice (After This Closes)

`dynamic_airborne_split_refactor_v1` — the 6630-line split, guarded
by this slice's hostile-input matrix + step 1 invariants + step 2
preset invariants matrix.

## Resume Checklist For The Next Agent

1. Read this file top-to-bottom.
2. Check `git log --oneline main..HEAD` — which deliverables have
   landed?
3. Run `pnpm calculator:gate:current` — see which tests are green /
   red / missing.
4. Continue from the first un-landed deliverable.
5. When all deliverables green, write the post-contract + commit.
