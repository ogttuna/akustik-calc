# Slice Plan - Floor Field Continuation Expansion v1

Status: CLOSED (2026-04-24, no-runtime audit; next slice selected:
`floor_many_layer_stress_regression_v1`)

## Objective

Increase floor-calculator accuracy coverage by systematically auditing
and pinning field/building continuations for defended floor corridors:
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` where those outputs are
physically supported.

This slice is not a source-family reopen. It exists because floor
coverage is already broad, but the live plan still names full floor
field-continuation expansion as an explicit deferred accuracy audit.

## Non-Goals

- Do not reopen `GDMTXA04A` direct exact without a modeled composite
  dry-screed source surface.
- Do not reopen `C11c` exact import while the combined wet tuple remains
  anomalous.
- Do not infer bare open-box/open-web impact behavior from packaged
  system rows.
- Do not change wall timber/resilient formulas from the newly landed
  wall exact rows.
- Do not resume `project_access_policy_route_integration_v1` until this
  selected calculator slice closes or priority explicitly changes.

## Why This Slice Is High ROI

The wall side-count slice just converted the current source-backed wall
gap into exact anchors. The next best calculator move is a bounded floor
audit that improves confidence in user-visible field/building answers
without needing fresh source evidence.

The risk surface is practical:

- users can request floor results outside lab-only mode,
- field/building cards must not silently fabricate unsupported values,
- supported floor continuations should satisfy origin/support/status
  contracts across exact, benchmark, formula, and fail-closed lanes,
- missing inputs should be reported as missing inputs, not drift into
  arbitrary estimates.

## Current Baseline

- Floor exact/source coverage is deep across UBIQ, Knauf timber,
  Dataholz CLT, Pliteq, Regupol, Getzner, and related exact rows.
- Known blocked source families remain fail-closed:
  `GDMTXA04A`, `C11c`, and raw bare open-box/open-web.
- Floor hostile-input and safe-bare split parity tests exist.
- Wall field continuation is already value-pinned; the floor equivalent
  remains an explicit follow-up track.

## Gate Plan

### Gate A - inventory current floor continuation surfaces

Status: LANDED (2026-04-24, no runtime change).

No runtime change. Build an executable inventory of representative floor
families across:

- lab context,
- field-between-rooms context,
- building-prediction context,
- supported outputs,
- card status,
- output origin/support notes,
- missing-input behavior.

Candidate rows should include at least:

- one UBIQ exact supported-band row,
- one Knauf timber exact row,
- one Dataholz CLT exact row,
- one reinforced-concrete low-confidence/formula row,
- one raw-terminal concrete helper row,
- one fail-closed blocked-source representative.

Gate A stops when the current values and unsupported/missing-input
states are pinned without changing runtime behavior.

Gate A landed with:

- `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
  pinning origin, support partitions, and numeric values for lab,
  field-between-rooms, and building-prediction contexts.
- `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`
  pinning the matching workbench card statuses/values.

Representative families now covered:

- UBIQ exact supported-band open-web row
  (`ubiq_fl28_open_web_steel_200_exact_lab_2026`),
- Knauf acoustic timber exact row
  (`knauf_ct120_1c_timber_lab_2026`),
- Dataholz CLT dry exact row
  (`dataholz_gdmtxn01_dry_clt_lab_2026`),
- reinforced-concrete low-confidence/formula row,
- raw terminal concrete helper row,
- raw bare open-web impact-blocked representative.

Findings:

- lab context parks `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`
  as missing field/building input on the web card surface;
- field-between-rooms with partition geometry unlocks `R'w`, `Dn,w`,
  and `Dn,A`, while `DnT,w`/`DnT,A` remain volume-gated;
- building-prediction with receiving-room volume unlocks `DnT,w` and
  `DnT,A`;
- building impact continuations unlock `L'n,w` and `L'nT,w` only when
  the active impact lane exists; blocked bare open-web impact stays
  fail-closed even though airborne field companions remain live;
- no source-blocked family was reopened and no runtime value changed.

### Gate B - tighten contracts where the inventory finds drift

Status: NOT REQUIRED BY GATE A FINDINGS.

Gate A did not surface a runtime/card drift that needs an immediate
fix. Keep this gate as a contingency only if the closeout run or a
future targeted review finds a real mismatch.

Only fix real defects found by Gate A. Valid fixes include:

- field/building continuation support mismatches,
- output-origin/card status mismatch,
- missing-input messaging drift,
- physical invariant violations such as apparent field values exceeding
  lab anchors without a defended reason.

Invalid fixes:

- source-family reopening,
- broad formula retunes from nearby green tests,
- exact import without row-level source evidence.

### Gate C - closeout and next-slice selection

Status: LANDED (2026-04-24, no runtime change).

Gate C closed this slice after the focused current gate stayed green and
Gate A found no required Gate B fix. The closeout contract is
`packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`.

The selected next slice is
`floor_many_layer_stress_regression_v1`, documented in
`docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`.
That slice was selected because the master plan already requires 50+
layer stacks to return defended answers or fail closed, wall many-layer
behavior is pinned, and floor 50+ behavior remained a documented
hardening gap.

## Immediate Next Steps

1. Continue `floor_many_layer_stress_regression_v1` from Gate A.
2. Reopen this slice's Gate B only if a later review finds concrete drift that the
   Gate A matrix missed.
3. Keep `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, this closed plan,
   the current checkpoint, and the planning-contract test synchronized.

## Validation

Minimum:

- `pnpm calculator:gate:current` before and after the slice,
- targeted engine/web floor continuation matrices while iterating,
- `git diff --check`.

Use broad `pnpm check` if Gate B changes shared contracts,
user-visible route/card behavior, or calculator values.

## Completion Criteria

- floor field/building continuation behavior is executable and
  representative across defended families,
- unsupported outputs stay fail-closed with honest card/status behavior,
- missing-field paths are pinned,
- blocked-source families remain blocked,
- any real accuracy fix is value-pinned in engine and web surfaces.
