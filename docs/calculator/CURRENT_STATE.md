# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before historical analysis or older checkpoint notes
- for the current checkpoint, also read:
  - [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md)
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
  - kept the concrete vinyl + elastic-ceiling branch on the low-confidence
    posture
- latest focused active-slice revalidation on `2026-04-17`:
  - targeted heavy-concrete engine pack: `4/4` test files passed,
    `312/312` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest parity-audit conclusion on `2026-04-17`:
  - no seventh defended parity-widening step is proven yet
  - already-landed gypsum, `fire_board`, and split timber-underlay parity
    fixes remain the full defended set
  - split carpet/soft-cover plus generic-underlay concrete inputs were
    explicitly rechecked and remain unproven because current runtime
    canonicalization does not show that they are the same physical system as
    the bounded carpet archetype lane
  - unless a new already-proven equivalent representation is found, the next
    active planning move is the residual formula-vs-family closeout audit
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

## Current Answer In One Screen

- latest closed implementation slice:
  `mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1`
- latest closed planning action:
  `post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1`
- current active next slice:
  `heavy_concrete_formula_family_widening_v1`
- current rule:
  the requested-output harness chain stays frozen; the next move is a real
  heavy-concrete runtime widening, not another harness micro-slice
- current explicit not-done item:
  the heavy-concrete widening is still open; only the first six defended
  predictor-side substeps have landed, and the remaining bounded
  reinforced-concrete predictor cases still need to be classified one by one
  before the slice can either land another bounded parity fix or transition to
  residual closeout audit

## Current Hotspot Map

- selected runtime formula widening anchors:
  - `packages/engine/src/impact-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/dynamic-impact.ts`
  - `packages/engine/src/impact-support.ts`
- selected heavy-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- selected heavy-concrete workbench evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
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
- only reopen that harness if the selected heavy-concrete widening exposes a new
  concrete red that cannot be localized otherwise

## Immediate Candidate Posture

Selected now:

- `heavy_concrete_formula_family_widening`

Held but not selected:

- `dataholz_clt_calibration_tightening`

Still blocked:

- raw bare open-box/open-web impact widening
- Dataholz `GDMTXA04A` visible exact reopen
- TUAS `C11c` exact import
- wall-selector behavior widening without a fresh classified red

## Current Next Steps

1. Keep the requested-output harness frozen at the current green baseline.
2. Continue `heavy_concrete_formula_family_widening_v1` through the current
   parity-audit loop.
   Audit only the remaining defended reinforced-concrete upper/combined
   representations that still have a stronger exact/family lane inside the
   current corridor.
   Current status: no additional implementation-qualified parity candidate is
   proven yet, so this step should now behave as a proof search, not as an
   assumption that another widening must exist.
3. Treat the current blocked boundaries as hard stops, not “later in the same
   pass” items.
   Do not widen firestop rigid concrete ceilings, no-fill/tile-only/lower-only
   gypsum concrete variants, or the concrete `vinyl + elastic ceiling`
   low-confidence branch without new evidence.
4. If no further defended parity gap survives that audit, do a residual
   formula-vs-family closeout pass before declaring the heavy-concrete slice
   done.
   This is now the default next move unless a new equivalence-proof-backed
   mismatch is found.
   First concrete decision from here:
   run one last explicit defended-equivalence probe inside the current
   reinforced-concrete corridor; if it does not produce an implementation-
   qualified candidate, move directly to slice closeout preparation instead of
   opening broader speculative widening.
5. Keep Dataholz CLT on the held second-candidate posture until a real runtime
   red or stronger family-tightening signal appears.
6. Do not blur blocked source-anomaly candidates into the heavy-concrete pass.
