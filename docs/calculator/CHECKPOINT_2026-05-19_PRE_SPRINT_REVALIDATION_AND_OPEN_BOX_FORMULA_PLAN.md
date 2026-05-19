# Checkpoint 2026-05-19 - Pre-Sprint Revalidation and Open-Box Formula Plan

Status: sprint-entry checkpoint after a fresh full current-gate run on
2026-05-19.

## Purpose

This checkpoint is the broad look before the next implementation sprint.
It confirms that the repo is green, maps the current implementation back
to the active docs, and states the next work in the order it should be
done. It does not promote new runtime values.

The next sprint should increase company-internal coverage and accuracy by
continuing the active broad-accuracy path, not by starting a broad source
crawl or reopening blocked aliases.

## Validation Result

Command:

`pnpm calculator:gate:current`

Result:

- engine focused gate: 459 files passed, 2635 tests passed;
- web focused gate: 87 files passed, 363 tests passed, 18 skipped;
- repo build: 5 / 5 packages successful;
- whitespace guard: passed;
- known non-fatal warnings: optional `sharp/@img` warnings from
  `@turbodocx/html-to-docx`, plus Zustand storage warnings in test
  runtime.

No implementation fix was required after this run.

## Current Implementation / Docs Alignment

The active implementation and docs agree:

- The controlled company-internal envelope is green and can support
  bounded pilot use, but it is not broad daily-use readiness for every
  realistic layer combination.
- The broad-accuracy plan remains the right path for expanding actual
  calculator coverage and reducing weak-lane debt.
- The latest landed broad-accuracy floor target is the open-box timber
  transfer-owner gate:
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`.
- The next selected action remains:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
- The next selected file remains:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.

The active owner implementation is
`packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`.
It classifies 15 TUAS open-box timber exact rows on the 370 mm
`open_box_timber_slab` carrier, separates 10 predictor-owned rows from 5
exact-only hybrid / fragmented rows, and keeps exact source precedence,
raw bare open-box guards, field/building boundaries, and ASTM/IIC
boundaries intact.

## Analysis Decision

The right first sprint task is the open-box timber formula corridor.

Reasoning:

- Tests show no broad infrastructure failure; this is coverage/accuracy
  work, not stabilization work.
- The owner gate already names the physical terms needed for formula
  promotion.
- Open-box timber is the selected bottleneck in the active broad-accuracy
  plan after direct-fixed open-web and wall triple-leaf work.
- Starting with runtime first would be too risky because the formula
  terms, budgets, exact-only hybrid handling, and negative boundaries
  must be executable before values move.

## Second Planning Iteration - 2026-05-19

This follow-up pass re-read the active implementation, compared it to
the current plan, and checked external references before implementation.
The result does not change the selected sprint lane. It makes the first
implementation step narrower and more testable.

Implementation findings:

- The active owner module is
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner.ts`.
  It exposes a no-runtime contract only; there is no open-box timber
  formula-corridor module yet.
- The owner contract classifies 15 TUAS open-box timber exact rows, all
  on a 370 mm `open_box_timber_slab` carrier.
- Those rows contain 10 predictor-owned rows and 5 exact-only hybrid /
  fragmented rows:
  `tuas_r7b_open_box_timber_measured_2026`,
  `tuas_r8b_open_box_timber_measured_2026`,
  `tuas_r9b_open_box_timber_measured_2026`,
  `tuas_r2c_open_box_timber_measured_2026`, and
  `tuas_r10a_open_box_timber_measured_2026`.
- Current measured ranges inside the local TUAS inventory are
  `Ln,w 39..70`, `CI -1..2`, `CI,50-2500 0..5`,
  `Ln,w+CI 41..70`, `Rw 49..75`, and `Rw+C 44.5..71.9`.
- Package packets are already separated into
  `thin_laminate_eps_no_upper`, `dry_gypsum_fiber_upper`,
  `reinforced_ceiling_laminate`, `eps_screed_or_hybrid_upper`, and
  `mixed_staged_upper`.
- `dry_gypsum_fiber_upper` has the cleanest predictor-owned packet
  density. `eps_screed_or_hybrid_upper` contains useful rows, but most
  hybrid rows are exact-only and must not seed source-absent transfer
  until fragmented-equivalence ownership is explicit. `mixed_staged_upper`
  has no predictor-owned rows and must remain exact-only / blocked in the
  first formula gate.
- The closest local implementation pattern is
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor.ts`.
  The open-box formula gate should copy the shape, not the physics:
  landed gate constants, a no-runtime contract, formula terms, candidate
  design rows, exact-source blockers, metric budgets, alias blockers,
  selected runtime-corridor handoff, docs alignment checks, export checks,
  and current-gate runner inclusion.

External reference check:

- The local source URL maps the TUAS open measured dataset to
  `https://data.mendeley.com/datasets/y83p8mpryd/2`.
  That dataset is published as "TUAS 2023 Floor Sound Insulation Rev1",
  DOI `10.17632/y83p8mpryd.2`, and describes laboratory impact and
  airborne measurements for wooden and concrete floors, including a
  370 mm open-box timber slab. The dataset description says the rows were
  built and measured in the same laboratory, include floor coverings /
  floating floors / suspended ceilings, and report ISO lab `Ln,w` and
  `Rw`-family values. This supports using TUAS rows as same-family anchors
  and holdouts, not as a broad catalog substitute.
- ISO 12354-2:2017 remains the official impact building-prediction
  reference. Its abstract frames impact prediction around measured data
  for direct or indirect flanking transmission plus structural sound
  propagation models. That confirms the current boundary: an element-lab
  open-box formula corridor cannot be relabelled as field or building
  impact without separate owners.
- Adjacent open-access CLT/floating-floor research from Journal of
  Building Engineering, 2024, reports that timber/CLT floating-floor
  reduction needed family-specific modelling because heavyweight-floor
  literature and standard assumptions did not transfer cleanly. This is
  not direct calibration evidence for TUAS open-box rows, but it supports
  the plan's conservative stance: package-family and support-family terms
  must be explicit before runtime values move.

Implementation correction from this pass:

- The plan should not say the next task is the transfer-owner gate; that
  gate is already landed. The next task is the no-runtime formula-corridor
  gate:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
- The formula gate should not ingest new source text or measured metric
  values from the web. It should use the already-local TUAS exact rows,
  cite the dataset only as source provenance, and keep rights-sensitive
  source expansion out of this sprint.
- The formula gate may define proposed design budgets, but runtime must
  remain blocked until a later runtime corridor owns surface parity and
  fail-closed behavior. A practical starting budget target to test is
  `+/-7 dB` for `Ln,w`, `+/-2 dB` for `CI`, `+/-7.5 dB` for
  `Ln,w+CI`, `+/-6 dB` for `Rw`, and `+/-6.5 dB` for `Rw+C`. If packet
  spread or leave-one-packet residual checks cannot justify these, the
  contract should widen them or keep the relevant package out of runtime.

## Formula Corridor Acceptance Checklist

The next implementation is complete only when all of these are true:

- Add
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts`.
- Add
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
- Export the module from `packages/engine/src/index.ts`.
- Add the contract test to `tools/dev/run-calculator-current-gate.ts`.
- Define constants for the landed gate, selection status, selected next
  runtime action, selected next file, selected next label, and formula
  basis.
- Link back to
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`
  and assert that the previous owner's selected next file is this formula
  contract.
- Define formula terms for:
  `same_family_tuas_open_box_anchor_selection`,
  `open_box_370mm_support_family_constraint`,
  `upper_package_family_delta`,
  `lower_ceiling_family_delta`,
  `laminate_eps_finish_pair_delta`,
  `fragmented_exact_equivalent_package_guard`,
  `impact_lnw_ci_lnw_plus_ci_semantics`,
  `airborne_rw_plus_c_semantics`, and
  `source_absent_residual_budget_decomposition`.
- Candidate rows should include clean predictor-owned package probes from
  `dry_gypsum_fiber_upper`, `thin_laminate_eps_no_upper`, and
  `reinforced_ceiling_laminate`; treat `eps_screed_or_hybrid_upper` as a
  split packet with exact-only transfer blockers; keep
  `mixed_staged_upper` exact-only / blocked until more ownership exists.
- Exact TUAS rows must remain exact matches via `calculateAssembly`.
- Formula-evaluation runtime values must be `null` in this gate; design
  metrics and budgets may be returned only as formula-corridor planning
  payloads.
- Negative cases must prove: open-web steel cannot borrow open-box
  timber; raw bare open-box cannot reopen impact support; partial
  laminate/EPS finish stays blocked; disjoint duplicate role sets stay
  blocked; exact-only hybrid rows do not seed transfer; `L'n,w`, `IIC`,
  `AIIC`, `R'w`, `DnT,w`, and building prediction stay blocked.
- Docs, `AGENTS.md`, and the current-gate runner must contain the new
  landed gate, selected next action, selected next file, basis, budgets,
  and boundary language.

## Sprint Order

1. Land the no-runtime open-box timber formula-corridor contract.
   - Add
     `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
   - Add the matching formula-corridor module.
   - Define the formula terms, package probes, metric-specific
     source-absent budgets, and residual-policy blockers listed in the
     acceptance checklist above.
   - Keep runtime values null in this gate.
2. Promote a narrow runtime corridor only after the formula gate is
   executable.
   - Exact source rows must remain first.
   - Runtime should be limited to complete same-family open-box timber
     packages with explicit 370 mm support, finish pair, upper package,
     lower ceiling family, and requested lab metrics.
3. Add surface parity after runtime.
   - Workbench cards, route posture, support notes, method/corridor
     dossiers, saved replay, server snapshot replay, calculator API,
     impact-only API, Markdown/PDF/DOCX report payloads must share the
     same value, basis, origin, and budget.
4. Refresh the coverage matrix and operating-envelope notes.
   - The matrix should distinguish supported formula rows,
     exact-source rows, `needs_input` rows, hostile refusals, and
     unsupported aliases.

## Do Not Do In This Sprint

- Do not borrow open-web steel terms for open-box timber.
- Do not reopen raw bare open-box impact support from nearby TUAS rows.
- Do not promote exact-only hybrid rows until the formula gate owns
  fragmented package equivalence.
- Do not alias lab `Ln,w` / `Rw` to `L'n,w`, `R'w`, `DnT,w`, building
  prediction, ASTM `IIC`, or `AIIC`.
- Do not ingest rights-sensitive measured values or start a broad source
  crawl.
- Do not treat a green exact-row match as source-absent formula
  validation.

## Commit / Worktree Notes

The source tree is otherwise clean except generated/local artifacts:

- `.playwright-cli/`
- root PDF files
- `apps/web/output/`
- `output/`
- `tmp/`
- `apps/web/tsconfig.tsbuildinfo`

These remain outside calculator source-of-truth.

## Implementation Closeout - Formula Corridor Landed

The first sprint step has now landed:

- landed gate:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
- selection status:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`
- landed implementation:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`
- selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`

This is no-runtime calculator infrastructure. It defines executable TUAS
same-family open-box timber package-transfer payloads and budgets, but
does not promote public runtime formula values. The clean design probes
are now explicit: dry gypsum-fiber is `Ln,w 50.8` / `Rw 66`, thin
laminate/EPS is `Ln,w 53.5` / `Rw 55.5`, and reinforced ceiling
laminate is `Ln,w 53.5` / `Rw 63.5`. The source-absent design budgets
are `+/-7 dB` for `Ln,w`, `+/-2 dB` for `CI`, `+/-7.5 dB` for
`Ln,w+CI`, `+/-6 dB` for `Rw`, and `+/-6.5 dB` for `Rw+C`.

Exact TUAS rows still win through `calculateAssembly`. Raw bare
open-box, open-web steel borrowing, partial laminate/EPS finish,
disjoint duplicate roles, exact-only hybrid transfer, mixed staged
packets, field/building outputs, and ASTM/IIC/AIIC aliases remain
blocked until later owners land.

Validation after implementation:

- targeted contract:
  `pnpm --filter @dynecho/engine exec vitest run src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`
  passed 1 file / 6 tests.
- full current gate:
  `pnpm calculator:gate:current` passed with engine 460 files / 2641
  tests, web 87 files / 363 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean. Known non-fatal warnings remain the optional
  `sharp/@img` warnings from `@turbodocx/html-to-docx` plus Zustand
  test-storage warnings.
