# Slice Plan - Calculator Source Intake Backlog Cleanup v1

Slice id: `calculator_source_intake_backlog_cleanup_v1`

Status: CLOSED AT GATE C / NO RUNTIME MOVEMENT (selected 2026-04-29 by
`post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`;
Gate A landed 2026-04-29 by
`calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`;
Gate C closed 2026-04-29 by
`post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`).

Selected next implementation file:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Selected next planning surface:

[SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md](./SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md)

Selection reason: `internal_use_pilot_handoff_v1` closed no-runtime.
The calculator is usable for controlled company-internal estimates
inside the documented envelope, but no concrete pilot defect and no
source-ready accuracy pack exists. The next highest-value action is a
no-runtime cleanup of the source-ready intake backlog so the next
accuracy slice is selected from explicit prerequisites instead of
nearby green tests or convenience.

No runtime import, confidence promotion, support promotion, or visible
card movement is allowed in this slice. Keep
`runtime/support/confidence/evidence/API/route-card/output-card` and
`proposal/report/workbench-input` frozen.

Current source-ready backlog artifact:

[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md)

## Objective

Build one agent-readable source-ready intake backlog for the families
that still block broader and more accurate calculator coverage:

- timber double-board stud wall;
- CLT / mass-timber wall;
- lined-massive / heavy-core wall;
- no-stud double-leaf wall;
- generated floor fallback;
- historical blocked families: `GDMTXA04A`, `C11c`, raw open-box /
  open-web, and related fail-closed lanes.

The backlog must state, per family:

- current runtime posture and user-visible risk;
- source pointers or formula owners that are allowed only as context;
- exact runtime-import prerequisites;
- negative boundaries and near misses that must stay protected;
- expected engine and web visible test shapes before any future import;
- the first missing requirement that prevents runtime movement now.

## Gate A - Build Source Intake Backlog Cleanup Matrix - Landed

Gate A added:

`packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`

Dedicated backlog artifact:

`docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md`

Checkpoint:

`docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_A_HANDOFF.md`

Required Gate A artifacts:

- `source_ready_intake_backlog_matrix`;
- `stale_or_duplicate_source_doc_cleanup_notes`;
- `per_family_runtime_import_prerequisites`;
- `negative_boundary_and_near_miss_register`;
- `next_candidate_selection_rules`.

Gate A result:

- every blocked family appears exactly once in the backlog;
- every family remains `runtimeImportReadyNow: false`;
- public source locators are context only;
- no stale or duplicate source doc required deletion;
- Gate C closeout / next-slice selection is the next bounded action.

Implementation read map before coding:

- [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md)
  for the controlled company-use envelope and known gaps.
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  for the long-horizon accuracy program.
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
  for historical fail-closed families and floor-dominant source gaps.
- [SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md](./SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md)
  and `calculator-source-pack-readiness-triage-gate-a-contract.test.ts`
  for the current candidate ranking.
- Prior family contracts named in those docs for exact blockers.

Minimum assertions:

- every blocked family above appears exactly once;
- every family has `runtimeImportReadyNow: false`;
- every family names at least one first missing requirement;
- every family names protected negative boundaries;
- candidate source pointers are context only unless exact topology,
  metric owner, tolerance owner, and paired visible tests are named;
- the selected follow-up is either a concrete source-ready Gate A with
  all prerequisites or another no-runtime extraction/cleanup step.

Failure response:

- If the docs disagree on a family posture, fix the docs and contract
  without changing runtime behavior.
- If a source pointer looks promising but lacks exact row locators,
  keep it as source-intake context.
- If a true source-ready pack is found, do not import it in Gate A;
  select a bounded runtime slice with explicit positive and negative
  tests.

## Gate B - Cleanup Fix Only If Needed

Gate B is selected only if Gate A finds stale, duplicate, or misleading
docs that cannot be safely corrected inside Gate A.

Possible Gate B scope:

- merge or retire obsolete source-intake notes when they contradict the
  current source-ready prerequisites;
- update `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md` and
  `SOURCE_GAP_LEDGER.md` so a future agent can find the real next
  source task quickly;
- keep all runtime and visible calculator behavior frozen.

## Gate C - Closeout And Next Slice Selection

Next file:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

Gate C should select the next slice only from:

- a source-ready accuracy pack with exact topology, metric owner,
  tolerance owner, negative boundaries, and paired visible tests;
- a no-runtime extraction slice that can make a blocked family closer
  to that bar;
- a docs/source-backlog cleanup if the planning surfaces are still
  misleading.

Do not promote low-confidence, screening, formula-owned, or
source-gated lanes for pilot convenience.

Gate C result:

- closed `calculator_source_intake_backlog_cleanup_v1` no-runtime;
- kept every backlog family `runtimeImportReadyNow: false`;
- selected `generated_floor_fallback_topology_delta_v1`;
- selected
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  as the next first-gate file;
- did not move runtime/support/confidence/evidence/API/route-card/
  output-card/proposal/report/workbench-input behavior.

## Validation

- Latest Gate C validation is green on 2026-04-29:
  - targeted Gate C: 1 engine file / 6 tests;
  - focused current gate: engine 142 files / 685 tests, web 45 files /
    216 passed + 18 skipped, build 5/5 with the known non-fatal
    `sharp/@img` warnings, whitespace guard clean.
- Latest broad `pnpm check` is green after Gate C:
  - lint/typecheck green;
  - engine 275 files / 1505 tests;
  - web 157 files / 890 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img` warnings.
- Run `pnpm calculator:gate:current` before and after touching the
  selected slice.
- Use the Gate C engine contract while iterating.
- The Gate A and Gate C contracts are now included in
  `tools/dev/run-calculator-current-gate.ts`.
- Run `git diff --check`.
- Run `pnpm check` only if Gate A changes broad repo contracts,
  user-visible behavior, or enough docs/tests that a full release gate
  is warranted.
