# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before historical analysis or older checkpoint notes
- for the current checkpoint, also read:
  - [CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md)
- for the authoritative next step, read:
  - [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- for end-to-end product flow and file boundaries, read:
  - [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- for answer-origin / source-vs-formula questions, read:
  - [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- for source-backed widening posture, read:
  - [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Scope

- floor and wall dynamic-calculator behavior
- workbench-side layer normalization and operator flow
- result stability under duplicate/split/reorder/save-load/history misuse
- executable evidence for source/formula/support/origin honesty

## Revalidated Snapshot

Last full engine revalidation: `2026-04-17`

Last full web revalidation: `2026-04-17`

Last cross-package build revalidation: `2026-04-17`

Planning / implementation update: `2026-04-17`

## Operator Snapshot

- active slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- current broad-pass conclusion:
  repo-wide validation is green, and the reinforced-concrete low-confidence
  honesty/ranking chain is no longer the primary open risk
- immediate next decision:
  finish slice closeout after the reinforced-concrete `vinyl + elastic ceiling`
  branch was explicitly frozen as `low_confidence` at the solver/helper level
- do not do first:
  - parity reopening
  - CLT tightening
  - blocked source-family widening
  - wording-only micro-passes that do not change solver-side certainty

- latest live verification after the runtime candidate rerank closeout:
  - full engine suite: `147/147` test files passed, `923/923` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - focused engine gate: `4/4` test files passed, `14/14` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest no-runtime closeout on `2026-04-16`:
  - closed `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
  - selected `heavy_concrete_formula_family_widening_v1` as the next honest
    widening direction
  - kept `dataholz_clt_calibration_tightening` as the held second candidate
  - kept raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
    widening blocked
  - no runtime or numeric calculator behavior changed
- latest active-slice progress on `2026-04-16`:
  - kept the selected slice on `heavy_concrete_formula_family_widening_v1`
  - landed the explicit predictor-input separator-retention fix for reinforced
    concrete combined wet packages
  - widened the defended reinforced-concrete wet ceramic-tile + elastic-ceiling
    predictor corridor onto the published heavy-concrete upper-treatment lane
  - widened the defended reinforced-concrete wet ceramic-tile + rigid gypsum
    ceiling predictor corridor onto the published heavy-concrete
    upper-treatment lane without widening into firestop-board variants
  - restored visible-stack parity for the same gypsum-board wet concrete
    ceiling corridors by accepting the derived `generic_gypsum_board` token on
    the same defended heavy-concrete lane while keeping DeltaLw on the
    visible-stack formula companion
  - restored explicit predictor parity for reinforced-concrete firestop-board
    archetype inputs by treating the `fire_board` alias as the same bounded
    corridor token instead of letting those cases fall back to the bare-slab
    formula route
  - restored split-cover parity for reinforced-concrete timber-underlay
    archetype inputs by keeping `engineered_timber_flooring` plus a generic
    resilient underlay on the same bounded Knauf timber-underlay corridor
    instead of letting those cases collapse to the bare-slab formula lane
  - completed the final explicit carpet-plus-generic-underlay probe and pinned
    it as a negative guard:
    canonical carpet still stays on the bounded Knauf carpet archetype lane,
    while carpet plus an extra generic underlay remains formula-owned on the
    impact side and keeps only the heavy-concrete airborne companion estimate
  - kept the concrete vinyl + elastic-ceiling branch on the low-confidence
    posture
- latest focused active-slice revalidation on `2026-04-17`:
  - targeted heavy-concrete engine pack: `4/4` test files passed,
    `312/312` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest final-probe guard validation on `2026-04-17`:
  - targeted concrete closeout/benchmark/regression pack: `3/3` test files
    passed, `114/114` tests passed
  - `pnpm calculator:gate:current`: green with `4/4` test files passed and
    `15/15` tests passed in the focused engine/web gate
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest parity-audit conclusion on `2026-04-17`:
  - no seventh defended parity-widening step is currently proven
  - already-landed gypsum, `fire_board`, and split timber-underlay parity
    fixes remain the full defended set
  - split carpet/soft-cover plus generic-underlay concrete inputs were
    explicitly rechecked and remain unproven because current runtime
    canonicalization does not show that they are the same physical system as
    the bounded carpet archetype lane
  - final explicit carpet-plus-generic-underlay probe now confirms the same
    boundary in executable tests:
    canonical carpet stays on the bounded Knauf carpet archetype lane, while
    carpet plus extra generic underlay falls back to bare-floor impact formula
    ownership and only keeps the heavy-concrete airborne companion estimate
  - unless a new already-proven equivalent representation appears, the
    heavy-concrete parity queue stays closed
- latest closeout-audit progress on `2026-04-17`:
  - landed `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - the active concrete corridor now has a central executable ownership matrix
    for:
    - bare formula-only reinforced concrete
    - floating-floor formula-only reinforced concrete
    - published heavy-concrete family-general lanes with Annex C DeltaLw
      companions
    - family-archetype lanes that intentionally keep `DeltaLw` unsupported
    - the reinforced-concrete `vinyl + elastic ceiling` low-confidence branch
- latest slice closeout selection on `2026-04-17`:
  - closed `heavy_concrete_formula_family_widening_v1`
  - selected `reinforced_concrete_accuracy_tightening_follow_up_v1` as the next
    honest move
  - kept `dataholz_clt_calibration_tightening` as the held second candidate
  - kept the heavy-concrete parity queue closed unless a new proof-backed
    equivalence appears
  - kept raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector
    widening blocked
  - no runtime or numeric calculator behavior changed in the selection closeout
- latest slice closeout selection validation on `2026-04-17`:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `148/148` test files passed, `930/930` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest visible-stack continuity guard validation on `2026-04-17`:
  - targeted reinforced-concrete visible continuity pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `3/3` web files and `7/7` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest high-visibility low-confidence lane-label validation on `2026-04-17`:
  - targeted reinforced-concrete low-confidence panel pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `6/6` web files and `13/13` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal/diagnostics honesty validation on `2026-04-17`:
  - targeted reinforced-concrete proposal honesty pack: `1/1` test file
    passed, `2/2` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `15/15` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest source-lineage honesty validation on `2026-04-17`:
  - targeted reinforced-concrete lineage/provenance pack: `3/3` test files
    passed, `8/8` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete nearby-row honesty pack: `3/3` test files
    passed, `10/10` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row ranking-label validation on `2026-04-17`:
  - targeted reinforced-concrete nearby-row ranking pack: `2/2` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest same-ceiling candidate-order validation on `2026-04-17`:
  - targeted reinforced-concrete order-regression pack: `8/8` test files
    passed, `20/20` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest same-ceiling score-rationale validation on `2026-04-17`:
  - targeted reinforced-concrete ranking-helper pack: `1/1` test file
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest solver-side overlap-removal progress on `2026-04-17`:
  - removed the dormant direct published-family helper overlap for the
    reinforced-concrete combined `vinyl + elastic ceiling` corridor
  - active solver routing and direct family-helper behavior now agree that the
    corridor remains intentionally `low_confidence`
  - targeted engine overlap pack: `4/4` test files passed, `35/35` tests
    passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `34/34` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm check`: green with full engine `152/152` files and `942/942` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest nearby-row ranking-rationale surface validation on `2026-04-17`:
  - targeted reinforced-concrete rationale pack: `3/3` test files
    passed, `9/9` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest solver-side low-confidence note-honesty validation on `2026-04-17`:
  - targeted reinforced-concrete note-honesty pack: `3/3` test files
    passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest support-note rationale carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete support-note pack: `5/5` test files
    passed, `314/314` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest evidence-ranked-row carry-through validation on `2026-04-17`:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest evidence-citation-prioritization validation on `2026-04-17`:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest screening-package wording validation on `2026-04-17`:
  - targeted reinforced-concrete proposal/dossier pack: `2/2` test files
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest consultant-trail screening validation on `2026-04-17`:
  - targeted reinforced-concrete consultant/proposal trail pack: `2/2` test
    files passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal-recommendation screening validation on `2026-04-17`:
  - targeted reinforced-concrete proposal brief pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest consultant-emphasis screening validation on `2026-04-17`:
  - targeted reinforced-concrete consultant/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest proposal-summary screening validation on `2026-04-17`:
  - targeted reinforced-concrete proposal summary pack: `3/3` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest diagnostics-screening posture validation on `2026-04-17`:
  - targeted reinforced-concrete diagnostics/proposal pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad repo revalidation on `2026-04-17`:
  - `pnpm check`: green
  - full engine suite: `152/152` test files passed, `941/941` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
  - repo-wide validation surfaced one stale lint leak, one stale typecheck
    leak, and three stale engine expectation/parity contracts; all five drifts
    were aligned without changing the intended reinforced-concrete corridor
    posture

## Current Answer In One Screen

- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- latest closed planning action:
  `post_heavy_concrete_formula_family_widening_next_slice_selection_v1`
- current active next slice:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- current rule:
  the requested-output harness chain stays frozen; the heavy-concrete widening
  is closed, and the next move is reinforced-concrete accuracy tightening, not
  renewed parity hunting
- current explicit not-done item:
  the reinforced-concrete tightening pass is open; low-confidence
  `vinyl + elastic ceiling` remains live after the landed honesty substeps,
  and residual family-vs-formula fit plus edge-continuity tightening are
  still open after the predictor-only 29% fit-cap alignment and trace/report
  posture wording alignment plus validation-posture wording alignment; bounded
  numeric continuity is now landed, so Ln,w and Rw move inside the current
  low-confidence envelope instead of staying frozen at the baseline tuple; the
  same branch now also reads as a low-confidence fallback on the high-
  visibility impact summary/result/delivery panels instead of inheriting a
  generic published-family badge, and the same scenario is now pinned on
  diagnostics/proposal evidence surfaces so screening-only low-confidence
  wording does not drift back to generic published-family language; the same
  branch now also emits `Low-confidence fallback` directly from the dynamic
  impact trace label and first note instead of a generic published-family note,
  and its trace/report source-lineage surfaces now read as nearby published
  rows rather than a narrow family match across the trace panel, curated
  floor-estimate card, and generated report export; the same nearby-row wording
  now also carries through the main impact result panel and the hidden-row
  evidence detail instead of reverting to generic `Candidate lineage` /
  `estimate anchor` copy, and the raw candidate-id surfaces now read as ranked
  nearby published row ids rather than a privileged narrow-match candidate
  list; the same low-confidence candidate list now also starts from the
  elastic-ceiling nearby row instead of front-loading the timber-underlay
  archetype row, and the nearby-row score penalties are now defined in one
  helper with a geometry-sensitive third-row penalty so same-ceiling ordering
  and the family-vs-low-confidence gap cannot silently drift apart; the same
  ranking rationale is now also visible on trace/evidence/report surfaces
  instead of staying hidden behind raw nearby-row ids and score lists, and the
  solver-side predictor notes for this branch now also emit nearby published
  rows / low-confidence fallback lineage instead of leaking generic
  published-family wording into raw engine notes; `impactSupport.notes` now
  also carries the same mixed-row / elastic-first ranking rationale so report
  and support-basis surfaces do not collapse back to a vague low-confidence
  label, and the same evidence packet now also carries ranked nearby-row
  anchor labels into proposal and diagnostics surfaces instead of falling back
  to generic `Nearby published row N` numbering; the same evidence packet now
  also puts the dynamic impact anchor plus fallback rationale ahead of raw row
  anchors so proposal/diagnostics surfaces do not lead with what feels like a
  narrow best-match citation, and proposal brief plus dossier wording now also
  keep this branch explicitly in screening territory by saying `screening
  output` and `screening package` instead of generic `ready output` / `issue
  package` language; the consultant decision trail now also treats the same
  branch as a screening posture with an explicit delivery-posture warning
  instead of leaving the floor-side trail in generic posture/delivery-neutral
  wording, and the low-confidence proposal brief now also keeps both
  warning-present and no-warning paths in screening territory by replacing
  optimistic `freeze the current stack` / `attach the citation appendix` copy
  with screening-snapshot and nearby-row appendix language when this branch is
  active; the consultant decision trail `Output coverage` item now also stays
  warning-toned on this branch instead of leaking a green/success signal
  simply because several outputs are populated inside the screening fallback,
  and the same low-confidence proposal brief executive summary plus proposal
  dossier headline now also read as a screening route with nearby-row
  citations attached instead of repeating a generic low-confidence posture in
  more delivery-neutral language; the low-confidence diagnostics dossier now
  also keeps trace coverage, evidence-courier, and no-warning warning-board
  surfaces in explicit screening posture instead of leaking green/clear
  readiness cues; broad repo-wide revalidation then found and fixed one stale
  lint leak, one stale typecheck leak, and three stale engine
  expectation/parity contracts, so the current honesty/ranking chain is no
  longer the primary risk surface

## Current Hotspot Map

- selected runtime accuracy anchors:
  - `packages/engine/src/heavy-concrete-published-upper-treatment-estimate.ts`
  - `packages/engine/src/predictor-published-family-estimate.ts`
  - `packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-airborne.ts`
  - `packages/engine/src/impact-support.ts`
  - `packages/engine/src/impact-predictor-status.ts`
- selected reinforced-concrete engine evidence:
  - `packages/engine/src/post-heavy-concrete-formula-family-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- selected reinforced-concrete workbench evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
  - `apps/web/features/workbench/simple-workbench-evidence.test.ts`
  - `apps/web/features/workbench/simple-workbench-output-model.test.ts`
  - `apps/web/features/workbench/target-output-status.test.ts`
  - `apps/web/features/workbench/dynamic-calc-branch.test.ts`
  - `apps/web/features/workbench/guided-validation-summary.test.ts`
  - `apps/web/features/workbench/workbench-warning-notes.test.ts`
- held Dataholz CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- focused checkpoint gate:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed rerank ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

## Harness Hard Stop

The requested-output output-card harness refactor chain is now complete enough.

Rule from this point:

- do not create another requested-output harness-only micro-slice
- only reopen that harness if the selected reinforced-concrete tightening
  exposes a new concrete red that cannot be localized otherwise

## Immediate Candidate Posture

Selected now:

- `reinforced_concrete_accuracy_tightening_follow_up_v1`

Held but not selected:

- `dataholz_clt_calibration_tightening`

Still blocked:

- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening without a fresh classified red

## Current Next Steps

1. Keep the requested-output harness frozen at the current green baseline.
2. Keep the heavy-concrete widening closed.
   The final carpet-plus-generic-underlay probe is now a negative guard, and
   the parity queue should stay shut unless a new proof-backed equivalence
   appears later.
3. Continue `reinforced_concrete_accuracy_tightening_follow_up_v1`.
   Landed honesty substeps:
   reinforced-concrete low-confidence proxy-airborne honesty is explicit on
   warnings plus predictor/support notes, and the same branch now stays
   explicit on workbench warning notes, output-card detail, target-status
   detail, branch summary, guided validation summary, trace panel, report
   citations, and validation posture detail. The same branch also no longer
   mixes carpet and bare-slab rows into its nearby-row candidate pool, and
   predictor-only fit now shares the same displayed 29% ceiling as the
   derived low-confidence tier. A residual family-vs-formula fit audit now
   also pins that branch to the bounded combined-geometry slope while keeping
   a visible numeric gap from the formula-owned heavy-floating corridor. A
   predictor-side edge-continuity audit now also keeps small near-threshold
   slab/ceiling changes and neutral board-class presence on the same
   low-confidence lane without abrupt numeric jumps. A visible-stack
   continuity audit now also keeps neutral reorder, board-alias, and safe
  same-material split variants on that same lane while pinning the expanded
  four-board ceiling schedule as an intentional formula-owned boundary. The
  same branch now also reads as a low-confidence fallback on the high-
  visibility impact lane, result summary, delivery-assist, and curated
  floor-estimate panels instead of inheriting a generic published-family
  badge, the main confidence/provenance detail now reads as low-confidence
  fallback provenance instead of generic published-family provenance, and the
  runtime diagnostics/proposal evidence chain is now pinned on the same
  screening-only low-confidence wording.
   Remaining tightening targets are the low-confidence `vinyl + elastic
   ceiling` evidence posture, the solver-side residual family-vs-formula fit
   decision on that branch, and any further edge-continuity red beyond the
   now-pinned visible expanded-board boundary. Broad repo-wide revalidation
   means the next honest move is solver-side tightening, not another
   wording-only micro-pass.
4. Treat the current blocked boundaries as hard stops, not “later in the same
   pass” items.
   Do not reopen firestop rigid concrete ceilings, no-fill/tile-only/lower-only
   gypsum concrete variants, CLT, raw open-box/open-web, `GDMTXA04A`, `C11c`,
   or wall-selector work without new evidence.
5. Keep Dataholz CLT on the held second-candidate posture until reinforced-
   concrete tightening stabilizes or a real CLT runtime red appears.
6. Do not blur blocked source-anomaly candidates into the reinforced-concrete
   tightening pass.

## Priority Order From Here

This is the ROI-ranked order, not just the chronological queue.

1. `reinforced_concrete_accuracy_tightening_follow_up_v1`.
   Widening is honestly exhausted; the best next return is to tighten the
   corridor the calculator already owns most clearly.
2. `dataholz_clt_calibration_tightening`.
   Keep this as the next major tightening candidate after reinforced-concrete,
   not as a substitute for unresolved concrete closeout work.
3. Re-rank blocked source-backed widening families only after the concrete and
   CLT tightening phases stabilize.
4. Reopen reinforced-concrete parity widening only if a new proof-backed
   equivalence appears.
