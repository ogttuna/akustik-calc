# Checkpoint - 2026-05-05 - Company Internal Controlled Use Handoff Gate A

Slice id:

`company_internal_controlled_use_handoff_v1`

Landed Gate A file:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime`

Gate A status:

`gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout`

Selected next file:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection`

## What Changed

Gate A prepared the current controlled-use handoff pack. Runtime values,
support, confidence, evidence, API shape, route-card values,
output-card status, proposal/report values, and workbench-input behavior
stayed frozen.

Gate A created:

`docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`

The handoff supersedes the old pilot values for the current slice and
keeps the high-accuracy label forbidden. Controlled use is allowed only
inside the documented ready/caveated/blocked/hostile envelope and is not
regulatory certification or external/client certification.

## Landed Artifacts

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

## Current Ready Values

- `wall_lsf_exact_preset`: `Rw=55`, `R'w=48`, building `DnT,w=50`
- `wall_aac_single_leaf_benchmark`: `Rw=47`, `R'w=45`, building
  `DnT,w=47`
- `wall_masonry_single_leaf_benchmark`: `Rw=43`, `R'w=41`, building
  `DnT,w=43`
- `floor_pliteq_exact_source_corridor`: `Rw=60`, `Ln,w=58`,
  `L'n,w=61`, `L'nT,w=58.2`
- `floor_ubiq_bound_source_corridor`: `Rw=62`, `Ln,w=52`,
  `L'n,w=55`, `L'nT,w=52.2`

## Carry-Forward

Rockwool remains explicit screening-only, not exact/source-validated:
grouped `Rw 41`, flat-list `Rw 42`, field `R'w 34`, `DnT,w 36`, and
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Field outputs remain continuation outputs from active lab/screening/
apparent/bound basis, not independent design-grade field measurements.
Source promotion still requires source provenance, topology owner,
material mapping owner, metric context owner, tolerance owner, negative
boundaries, paired engine tests, and paired visible tests.

## Validation

Validation completed on 2026-05-05:

- focused Gate A passed 1 file / 6 tests
- continuity passed 6 files / 33 tests
- `pnpm calculator:gate:current` passed with engine 255 files / 1476
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green
- final `git diff --check` passed after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`

Broad `pnpm check` is reserved for Gate C closeout or a later runtime/
user-visible movement. Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` remain unchanged.
