# Slice Plan - Good Calculator Final Audit

Slice id: `good_calculator_final_audit_v1`
Status: CLOSED (authored and closed 2026-04-23)
Master-plan step: 8
Selected by:
`post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`
on 2026-04-22.

## Why This Slice Exists

The prior active slice plans have been implemented and archived.
During this recon the two newest archived plans still had stale
`Status: OPEN` headers, but implementation evidence shows they are
closed:

- `SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`
  is implemented. Evidence: four new wall cases exist in
  `ENGINE_MIXED_GENERATED_CASES`, the cross-mode torture matrix
  exists, F1/F2 regression guards exist, and the post-contract
  selects this final audit slice.
- `SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md`
  is implemented. Evidence: `dynamic-airborne-wall-selector-value-pins.test.ts`
  exists, the 7b post-contract closes C2/C3 corridor-surface
  VALUE pinning, and the focused gate includes those tests.

The active living triangle now says the next required artifact is
this plan plus the final executable audit. This slice exists to turn
the current "looks done" state into an executable, reproducible
closeout:

- the implementation grid in `MASTER_PLAN.md` must match test-backed
  engine/workbench reality,
- completion signals C1-C6 must be verified or explicitly
  documented-deferred with a reason,
- stale active-slice references must be removed from the living docs,
- the post-calculator productization roadmap must open only after the
  calculator audit is honest.

## Pre-Slice Baseline

Baseline command:

```bash
pnpm calculator:gate:current
```

Result on 2026-04-23 before authoring this plan:

- engine focused pack: 65 files, 306 tests passed
- web focused pack: 29 files, 132 tests passed, 18 skipped
- repo build: 5 turbo tasks successful
- whitespace guard: `git diff --check` clean

Known build warnings: the Next build still reports optional
`sharp/@img` package resolution warnings through the DOCX export
dependency chain. This is already documented in the prior checkpoint
as non-failing build noise.

## Implementation Recon

### R1 - Active Plan Gap

No `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` exists before this
slice. `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` both
say the plan doc is not authored yet. That is the first gap this
file closes.

### R2 - Missing Final-Audit Artifacts

These final-audit artifacts are not implemented yet:

- `packages/engine/src/coverage-grid-consistency.test.ts`
- final-audit completion-signal checklist test or equivalent
  assertions
- post-final-audit contract selecting the next productization slice
- post-calculator roadmap doc
- final session-close checkpoint for the calculator-complete state
- focused gate entries for the new final-audit tests

### R3 - Completed Prior Slices

Step 7 is implemented:

- four wall cases landed:
  `wall-masonry-brick`, `wall-clt-local`, `wall-lsf-knauf`,
  `wall-timber-stud`
- `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
  pins the 8-overlay torture surface
- `dynamic-airborne-masonry-same-material-split-invariance.test.ts`
  guards F1
- `airborne-verified-catalog-same-material-split-invariance.test.ts`
  guards F2
- `post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts`
  closes the slice

Step 7b is implemented:

- `dynamic-airborne-wall-selector-value-pins.test.ts`
  pins 6 wall selector corridor labels across lab, field, and
  building contexts
- 5 cross-cell physical invariants are asserted across the corridor
  matrix
- `post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`
  selects `good_calculator_final_audit_v1`

### R4 - Known Documentation Drift

At the start of this slice, the implementation was ahead of a few
docs:

- `AGENTS.md` named `dataholz_clt_calibration_tightening`
  as the active slice.
- `README.md`, `docs/calculator/README.md`, and `SYSTEM_MAP.md`
  pointed at older or archived checkpoint paths in some places.
- `SOURCE_GAP_LEDGER.md` still carries older floor-dominant
  "current active slice" wording and needs an explicit freshness
  note so it is read as source-gap history, not active workflow.
- `MASTER_PLAN.md` says C3 is measured by wall field continuation
  plus a floor equivalent, while the latest 2026-04-22 checkpoint
  explicitly defers a full floor field-continuation audit as a
  low-medium priority parallel track.

This slice must not paper over that drift. The final audit either
updates the completion-signal definition with an explicit deferral
record, or lands the missing floor-field audit before declaring the
calculator done.

### R5 - Second-Pass Implementation Comparison

Reviewed again on 2026-04-23 after a clean
`pnpm calculator:gate:current` baseline. The codebase evidence agrees
that the current runtime work is not another widening slice. The active
work is a final audit, and the audit must reconcile these exact drifts:

| Area | Current implementation evidence | Plan consequence |
|---|---|---|
| Master grid date | `MASTER_PLAN.md` section 3 still says `2026-04-21`, but includes 2026-04-22 step 7 and 7b evidence. | Update the grid date during this slice, or make the date explicitly "last reconciled 2026-04-23". |
| Wall hostile-input row | The wall section still has a stale `Not yet covered` row, while the cross-cutting section correctly names `raw-wall-hostile-input-answer-matrix.test.ts` and the step-7 O1 overlay. | `coverage-grid-consistency.test.ts` must fail if the same concern has contradictory statuses in one grid. |
| Wall field-continuation row | The wall section still says corridor completeness has not been audited, but step 5 and 7b evidence now cover preset + selector corridor surfaces. | Replace the stale row wording with the landed evidence or mark only any remaining non-blocking surface explicitly deferred. |
| Wall assessment prose | The assessment still says LSF/timber presets, hostile-input matrix, and wall field-continuation audit are missing. | Update or delete this stale prose as part of the final-audit doc sync. |
| C3 floor equivalent | `CURRENT_STATE.md` says the wall C3 surface is green; `MASTER_PLAN.md` says wall plus floor equivalent. The 2026-04-22 checkpoint carries full floor field-continuation audit as a low-medium deferred track. | The final audit must either add/name a real floor-equivalent test or rewrite C3 so the floor track is an explicit non-blocking deferral. |
| C5 floor equivalent | Wall reorder and step-7 O2 coverage are green; the master signal still asks for a floor equivalent. Existing floor split/parity tests may or may not be enough. | The final audit must name the existing floor evidence if it satisfies C5, otherwise keep C5 wall-scoped and document the floor expansion as deferred. |
| C6 file-size hygiene | `dynamic-airborne.ts` is still above 2000 lines, with split v2 deliberately deferred. | C6 cannot become fully green unless split v2 lands. In this slice it should close as an explicit documented deferral, not as silent success. |
| Focused gate labels | `tools/dev/run-calculator-current-gate.ts` includes the latest tests, but its labels still describe an older reinforced/Dataholz gate. | Rename labels and add final-audit tests so the gate describes the active slice accurately. |

### R6 - External Research Decision

No internet/source research is required for this final-audit slice.
The open questions are internal consistency questions: which tests
exist, which grid rows they defend, and whether the living docs agree.

Do not use this slice to reopen source-backed acoustic research for
`GDMTXA04A`, `C11c`, raw bare open-box/open-web, timber stud formula
widening, or reinforced-concrete accuracy. External research becomes
relevant only when a later selected slice explicitly chooses one of
those source-gated tracks.

## Scope

### Dimension A - Plan And Doc Sync

Create this plan and update the living references so the next agent
has one clear active slice. This includes:

- `NEXT_IMPLEMENTATION_PLAN.md`
- `CURRENT_STATE.md`
- `AGENTS.md`
- docs entry points that still identify old checkpoints as current

Historical archived docs may keep narrative history, but their stale
`Status: OPEN` headers should not trick future searches into treating
closed plans as active.

### Dimension B - Coverage Grid Consistency

Author `packages/engine/src/coverage-grid-consistency.test.ts`.

Preferred pattern: a hardcoded snapshot, not broad reflection. The
test should make every grid row in `MASTER_PLAN.md` accountable to an
executable evidence artifact. The snapshot should include:

- floor family rows from `MASTER_PLAN.md` section 3
- wall family rows from `MASTER_PLAN.md` section 3
- current status code
- primary evidence test file(s)
- whether the row is exact, benchmark, formula, family, screening, or
  fail-closed

The test should assert:

- every grid row has at least one evidence artifact that exists,
- every evidence artifact named by the grid is not an archived-only
  plan file,
- no concern appears twice in the same grid with conflicting statuses,
- closed wall rows map to current tests added in steps 1-7b,
- blocked rows remain fail-closed and do not appear as selected
  active widening work,
- deferred rows are named in the final audit deferral ledger.

This intentionally makes future grid edits noisy. If a future slice
adds, deletes, or changes a defended corridor, it must update the
grid snapshot and the plan docs together.

### Dimension C - Completion Signal Audit

Add executable assertions for C1-C6. This can be one test file or a
section in `coverage-grid-consistency.test.ts`, but each signal must
have an assertion with a concrete anchor.

Required assertions:

- **C1 wall preset coverage**: six wall preset archetypes are present
  and their benchmark/pin tests are named.
- **C2 wall corridor audit**: preset and selector corridor VALUE pins
  exist, and the 7b post-contract records the close.
- **C3 field continuation completeness**: wall preset and wall
  selector corridor field continuation pins exist. The floor-equivalent
  wording in `MASTER_PLAN.md` must be reconciled before close:
  either land the floor field-continuation audit, or update the
  completion signal to keep that track explicitly deferred and
  non-blocking.
- **C4 hostile input discipline**: floor + wall hostile-input tests
  and the step-7 O1 torture overlay are present.
- **C5 reorder invariance**: wall reorder matrix and step-7 O2
  asymmetric/symmetric overlay are present. If a floor reorder
  equivalent is required by the final wording, it must be named or
  implemented before close.
- **C6 architecture hygiene**: `dynamic-airborne.ts` remains above
  2000 lines, but the split-v2 deferral is explicit and documented in
  `DYNAMIC_AIRBORNE_CARTOGRAPHY.md`. The final audit must assert that
  this is a documented deferral, not a silent pass.

### Dimension D - Final Closeout Contract

Author a post-slice contract:

`packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts`

It should pin:

- `closedSliceId: "good_calculator_final_audit_v1"`
- the evidence ledger for the grid test and completion-signal audit
- all explicit deferrals carried forward
- the selected next slice for productization roadmap work
- the blocked-source posture remains unchanged

The selected next slice should not be a runtime/source widening by
inertia. Use a productization slice id such as:

`post_calculator_productization_roadmap_v1`

### Dimension E - Post-Calculator Roadmap

Create a short roadmap doc after the executable audit is green:

`docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`

It should separate:

- auth and multi-user project storage
- billing
- persistent server-backed projects
- proposal/report polish
- desktop-app optionality
- monitoring/deployment hardening

Keep the current persistence statement honest: saved scenarios are
browser-local today, not server-backed project records.

## Detailed Execution Matrix

This is the exact order to use when implementing the final audit.

| Phase | Edit surface | Required result | Verification |
|---|---|---|---|
| 0. Baseline | no edits | `pnpm calculator:gate:current` passes before runtime/doc changes. | Record engine/web/build/whitespace result in closeout notes. |
| 1. Master grid reconciliation | `MASTER_PLAN.md` section 3 and section 8 | Remove stale wall rows/prose, update grid date, and make C3/C5 wording agree with the deferred floor-audit ledger. | The new grid-consistency test has no contradictory row statuses. |
| 2. Grid snapshot test | `packages/engine/src/coverage-grid-consistency.test.ts` | Hardcoded row ledger covers every floor, wall, and cross-cutting row in `MASTER_PLAN.md` section 3. | Artifact-existence assertions pass; blocked rows remain fail-closed; deferred rows are named. |
| 3. Completion signal test | same test or a sibling final-audit test | C1-C6 each have one executable assertion and named evidence. | C3/C5 assertions match the final wording; C6 asserts the split-v2 deferral honestly. |
| 4. Gate update | `tools/dev/run-calculator-current-gate.ts` | Add final-audit test files and rename stale gate labels to the active calculator final-audit gate. | `pnpm calculator:gate:current` runs the new tests. |
| 5. Closeout contract | `packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts` | Contract closes this slice, carries explicit deferrals, and selects productization planning. | Contract is included in the focused gate. |
| 6. Productization roadmap | `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md` | Roadmap separates auth, billing, server-backed storage, proposal polish, desktop optionality, monitoring, and deployment. | It states saved scenarios are browser-local today. |
| 7. Resume triangle | `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, `MASTER_PLAN.md`, checkpoint/handoff note | Calculator runtime audit state and next productization slice are consistent everywhere. | `rg` for stale active-slice ids only finds archived history. |
| 8. Final validation | no edits after this except validation notes | Focused gate, broad `pnpm check`, and whitespace guard are green. | No failing tests; known optional `sharp/@img` warnings stay non-fatal. |

## Required Grid Rows For The Snapshot

The grid test should start from this minimum row set. It may include
more rows if `MASTER_PLAN.md` grows, but it must not include fewer.

Floor rows:

- UBIQ open-web steel weak-band
- UBIQ open-web steel supported-band
- UBIQ carpet bound
- Knauf timber direct mount
- Knauf acoustic mount timber
- Heavy concrete Annex C family
- Reinforced concrete vinyl plus elastic
- Reinforced concrete formula boundaries
- Dataholz CLT dry
- Dataholz CLT wet plus suspended
- Dataholz GDMTXA04A direct exact fail-closed
- Dataholz GDMTXA04A visible estimate
- CLT local combined C2c/C3c/C4c/C7c
- CLT local combined C5c
- Raw terminal-concrete helper
- TUAS C11c exact import fail-closed
- Raw bare open-box/open-web impact fail-closed
- Pliteq / Regupol / Getzner spot coverage

Wall rows:

- Concrete double-leaf preset
- AAC single-leaf preset
- Masonry brick preset
- CLT wall preset
- Light-steel stud preset
- Timber stud preset
- Wall selector families
- Deep-hybrid swap corridors
- Wall hostile-input matrix
- Wall reorder invariance
- Wall field continuation per defended corridor

Cross-cutting rows:

- Floor hostile-input matrix
- Wall hostile-input matrix
- Engine mixed-mode cross-mode torture
- Engine torture matrix wall coverage
- Adjacent same-material split invariance
- Engine thickness validity
- Many-layer 50-plus stability
- Reorder output-set invariance
- `dynamic-airborne.ts` size and split-v2 deferral

Each row needs:

- `id`
- `section` (`floor`, `wall`, or `cross-cutting`)
- current status label
- evidence tier (`exact`, `benchmark`, `formula`, `family`,
  `screening`, `fail-closed`, `partial`, or `informal`)
- primary evidence file paths
- explicit `deferredReason` only when the row is not fully closed

## Atomic Implementation Order

1. **Author this plan doc.**
   Confirm that the previously open-looking archived plan docs are
   implemented and no active implementation plan remains unstarted.
2. **Doc-sync pass.**
   Update the living docs that still say the final-audit plan is not
   authored or point to stale checkpoints as current.
3. **Reconcile `MASTER_PLAN.md` section 3 and section 8.**
   Update the grid date, remove or correct stale wall hostile/field
   rows and prose, and make C3/C5 wording agree with the deferred
   floor-audit ledger before the grid snapshot locks the wording.
4. **Write `coverage-grid-consistency.test.ts` skeleton.**
   Start with the required grid rows above, then add
   artifact-existence assertions and duplicate-concern conflict
   detection. Keep it red if any grid row has no accountable evidence
   or if wall rows still contradict the cross-cutting section.
5. **Resolve any remaining C3/C5 scope drift.**
   Decide by executable evidence, not prose. If the final wording keeps
   "floor equivalent", add or identify the floor tests. If it stays
   deferred, update `MASTER_PLAN.md` and the final post-contract to say
   so explicitly.
6. **Add completion-signal assertions.**
   C1-C6 must each have a concrete assertion and named evidence file.
7. **Update `tools/dev/run-calculator-current-gate.ts`.**
   Add the final-audit test(s) and post-contract to the focused gate.
8. **Author the post-final-audit contract.**
   Select `post_calculator_productization_roadmap_v1` or a similarly
   explicit productization planning slice.
9. **Create the productization roadmap doc.**
   Keep it product-focused and outside calculator runtime widening.
10. **Update the resume triangle.**
   `CURRENT_STATE.md`, `MASTER_PLAN.md`, and
   `NEXT_IMPLEMENTATION_PLAN.md` must agree on whether the calculator is
   done, what remains deferred, and what slice is next.
11. **Write the final calculator checkpoint/handoff note.**
    Capture the final-audit evidence, explicit deferrals, validation
    results, and productization next slice in one closeout note.
12. **Archive this plan on close.**
    Move this file to `docs/archive/handoffs/` only after the final
    audit closes.
13. **Final validation.**
    Run `pnpm calculator:gate:current`, `pnpm check`, and
    `git diff --check`.

## Stop Conditions

Do not close this slice if any of these are true:

- `coverage-grid-consistency.test.ts` is missing or only checks that
  files exist without mapping grid rows to evidence.
- `MASTER_PLAN.md` still contains contradictory statuses for the same
  concern, especially wall hostile input or wall field continuation.
- C3 still disagrees between `MASTER_PLAN.md`, `CURRENT_STATE.md`,
  and the checkpoint ledger.
- C5 still requires a floor equivalent without naming the evidence or
  documenting that track as non-blocking.
- C6 is marked green without either finishing split v2 or preserving
  the documented split-v2 deferral.
- Any blocked-source family is reopened without new source evidence.
- The focused gate does not include the new final-audit test files.
- Productization work starts before the final-audit post-contract is
  green.

## Out Of Scope

- `dynamic_airborne_split_refactor_v2`; document it, do not perform it
  inside this final-audit slice unless it becomes necessary to make C6
  honest.
- `wall_formula_family_widening_v1`; still source-blocked pending
  external wood-stud coupling evidence.
- `GDMTXA04A` direct exact import, `C11c` exact import, raw bare
  open-box/open-web impact, or wall-selector behavior widening.
- Workbench card-level wall selector VALUE pins, unless the final audit
  finds a user-visible card divergence.
- Full floor field-continuation expansion, unless the C3 reconciliation
  decision keeps it as a blocking completion signal.

## Expected Closeout State

When this slice closes:

- every grid row in `MASTER_PLAN.md` section 3 has an executable
  evidence mapping,
- C1-C6 are either green or explicitly documented-deferred where the
  master plan allows a non-blocking deferral,
- the final-audit post-contract is in the focused gate,
- the resume triangle no longer points at calculator runtime work,
- the next active slice is productization planning, not more hidden
  calculator widening.

## Resume Checklist

1. Read this file.
2. Run `pnpm calculator:gate:current`.
3. Start at the Detailed Execution Matrix phase 1 if this planning
   pass has landed.
4. Keep C3, C5, and C6 honest; those are the places where "done" can
   still drift into optimism.
5. Close only with the focused gate, broad `pnpm check`, and
   `git diff --check` green.
