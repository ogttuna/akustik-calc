# Dynamic Calculator Current State

Document role:

- primary short snapshot for the current dynamic calculator and workbench posture
- read this before historical analysis or older checkpoint notes
- for the current checkpoint, also read:
  - [CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md)
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

Last full engine revalidation: `2026-04-21`

Last full web revalidation: `2026-04-20`

Last cross-package build revalidation: `2026-04-20`

Last focused gate revalidation: `2026-04-20`

Planning / implementation update: `2026-04-21`

## For The Next Agent — Resume Here

1. This file: the current snapshot (what just closed, what is selected,
   what is frozen). Read top-to-bottom.
2. [MASTER_PLAN.md](./MASTER_PLAN.md) — why the current slice is the
   current slice and the next ten strategic moves.
3. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) §Now
   and §Selected Next Slice — the tactical detail for the active slice.
4. Run `pnpm calculator:gate:current` to confirm green baseline.
5. Start the active slice.

If the three docs disagree, stop and fix the drift before starting work.
That is how the 2026-04-20 doc-drift problem (captured in
[SYSTEM_AUDIT_2026-04-20.md](./SYSTEM_AUDIT_2026-04-20.md)) stays fixed.

## Operator Snapshot

- active slice:
  `dynamic_airborne_split_refactor_v1` (in progress; **10 incremental
  commits have landed**; main `dynamic-airborne.ts` has shed 2071
  lines — from 6630 → 4559 — into six bounded modules: helpers,
  family-detection, davy-masonry, mixed-plain-templates,
  cavity-topology, and the masonry-calibration lane covering all 9
  estimators; remaining work is framed-wall calibration + reinforcement
  helpers + floor/cap guards; full progress table pinned in
  `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`)
- latest closed implementation slice:
  `wall_hostile_input_matrix_with_airborne_cartography_v1` (closed
  `2026-04-21` on
  `packages/engine/src/post-wall-hostile-input-matrix-with-airborne-cartography-v1-next-slice-selection-contract.test.ts`)
- prior closed implementation slice:
  `wall_lsf_timber_preset_pack_with_invariants_v1` (closed
  `2026-04-21` on
  `packages/engine/src/post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts`)
- earlier closed implementation slice:
  `masonry_flanking_inversion_fix_v1` (closed `2026-04-21` on
  `packages/engine/src/post-masonry-flanking-inversion-fix-next-slice-selection-contract.test.ts`)
- earliest recent closed implementation slice:
  `wall_reorder_output_set_consistency_v1` (closed `2026-04-21` on
  `packages/engine/src/post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts`)
- historical recent closed implementation slice:
  `wall_preset_expansion_v1` (closed `2026-04-20` on
  `packages/engine/src/post-wall-preset-expansion-v1-next-slice-selection-contract.test.ts`)
- earlier closed implementation slice:
  `dataholz_clt_calibration_tightening` (second pass, closed `2026-04-20` on
  `packages/engine/src/post-dataholz-clt-calibration-tightening-second-pass-next-slice-selection-contract.test.ts`)
- closeout cut landed in wall_preset_expansion_v1:
  three new wall presets landed on the workbench with benchmark-backed
  material stacks and pinned canonical Rw values under lab/field/building
  contexts
  - `aac_single_leaf_wall` (Ytong D700 150 mm + 10 mm cement plaster both sides, Rw=45)
  - `masonry_brick_wall` (Wienerberger Porotherm 100 mm + 13 mm dense plaster both sides, Rw=47)
  - `clt_wall` (140 mm CLT + 12.5 mm gypsum board both sides, Rw=40)
  - evidence files:
    - `apps/web/features/workbench/preset-definitions.ts`
    - `apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts`
    - `apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`
- closeout cut landed in CLT second pass:
  workbench consultant-trail and diagnostics-dossier matrices for the CLT
  visible estimate route, mirroring the reinforced-concrete low-confidence
  discipline on the estimate-side mass-timber corridor
  - `apps/web/features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts`
  - `apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts`
- current broad-pass conclusion:
  every upstream closeout remains frozen (reinforced-concrete follow-up,
  raw terminal-concrete helper, CLT-local combined evidence, broad audit,
  blocked-source refresh); the CLT second-pass closeout landed the visible
  estimate consultant-trail and diagnostics-dossier surfaces; the wall
  preset expansion slice then landed three benchmark-backed wall presets
  (AAC single-leaf, masonry brick, CLT wall) with canonical Rw values
  pinned; the probe that preceded the preset slice surfaced a
  reorder/C-availability inconsistency on asymmetric light-heavy stacks,
  which is now the selected next active runtime tightening slice
- immediate next decision:
  start `dynamic_airborne_split_refactor_v1`. Mechanical move of
  `packages/engine/src/dynamic-airborne.ts` (6630 lines) into
  `dynamic-airborne-family-detection.ts` +
  `dynamic-airborne-predictor-scoring.ts` +
  `dynamic-airborne-helpers.ts`; `calculateDynamicAirborneResult`
  stays in the original file as a composition wrapper with
  re-exports. Zero-behaviour-change contract — cartography
  blueprint in `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`,
  guarded by the hostile-input + invariants + benchmark suites
  landed in slices 1b / 2 / 3.
- wall hostile-input matrix + cartography closeout summary (2026-04-21):
  - `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
    pins 13 hostile cases on the engine surface (50-layer heavy +
    mixed, reorder invariance, empty rows, unknown material,
    zero / NaN / Infinity / negative / extreme thickness)
  - `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`
    pins 6 cases on the workbench card surface (status + warning
    merged across `normalize-rows` + engine layers)
  - `packages/engine/src/assembly-input-guardrail.ts` converts
    hostile inputs into a deterministic fail-closed
    `AssemblyCalculation` with a specific warning (no throw)
  - `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md` maps the
    6630-line monolith onto three target files for the next slice
- first implementation question now for the active split slice:
  does `calculateDynamicAirborneResult`'s transitive call graph fit
  cleanly into the three target files per the cartography doc, or
  do one or more helpers belong on the boundary? Map the graph
  before moving code; when in doubt, place the helper in the file
  with the fewer incoming edges.
- LSF + timber stud preset pack closeout summary (2026-04-21):
  - `light_steel_stud_wall` + `timber_stud_wall` presets landed with
    `airborneDefaults` so their framed-wall family context flows
    through `loadPreset` into the workbench store
  - `wall-physical-invariants-matrix.test.ts` locks I1 (R'w ≤ Rw),
    I2 (Dn,A ≈ Dn,w + C), I3 (DnT,w − Dn,w ∈ [2,10] dB) across 6
    wall presets × 3 context modes (24 cells)
  - `wall-lsf-timber-stud-preset-benchmarks.test.ts` pins LSF lab
    Rw=55 (Knauf exact catalog row), field R'w=48, building R'w=48,
    building DnT,w=49; pins timber stud lab Rw=31, field R'w=24,
    building R'w=24, building DnT,w=25 as drift guards
  - `wall-preset-expansion-benchmarks.test.ts` extended with field
    VALUE pins for AAC (45/45/46), masonry (41/41/43), CLT (38/38/39)
  - timber stud engine output (31 dB under the composed lab context)
    flagged as a real accuracy finding — manufacturer field data for
    similar stacks is typically 45–50 dB; parked for
    `wall_formula_family_widening_v1` (master-plan step 6, conditional)
  - MASTER_PLAN §8 C1 advanced to 6/6 archetypes ✓
- masonry flanking inversion fix landed `2026-04-21`:
  - `findVerifiedAirborneAssemblyMatchWithLabFallback` in
    `packages/engine/src/airborne-verified-catalog.ts` lets the field
    anchor pipeline use lab-mode catalog entries as an apparent
    ceiling when no dedicated field entry exists for the layer stack
  - `applyVerifiedAirborneCatalogAnchor` gained a lab-fallback branch
    that anchors the apparent curve to `lab_benchmark -
    flanking_penalty_db`, restoring the ISO 140-4 R'w ≤ Rw invariant
    for clay hollow brick (Wienerberger Porotherm) and any future
    mass-law-overestimating material with only a lab-mode benchmark
  - `calculate-assembly.ts` now forwards the overlay's
    `fieldFlankingPenaltyDb` into the anchor so the fallback target
    is computed consistently with the upstream overlay penalty
  - audit pair:
    `packages/engine/src/airborne-verified-catalog-lab-fallback.test.ts`
    (unit: lookup shape across lab/field/building + no-match + null
    context) and
    `packages/engine/src/airborne-catalog-field-anchor-lab-fallback.test.ts`
    (integration: Porotherm 100/140/190 lab/field/building + lab
    lane unchanged + Ytong unchanged + non-matching layers skip
    fallback)
  - acceptance: `apps/web/features/workbench/wall-physical-invariants-matrix.test.ts`
    passes 24 tests (6 presets × I1/I2/I3) including Porotherm masonry
  - probe retired: `apps/web/features/workbench/masonry-flanking-bug-probe.test.ts`
    removed; the invariants matrix is the durable guard
  - upstream closeouts untouched: lab-mode anchor behaviour preserved,
    approximate airborne field companion lookup untouched, screening
    carrier fallthrough untouched, every frozen blocked-source family
    kept fail-closed, every benchmark fit audit (masonry, aircrete,
    framed-wall) reruns green
- selected route family:
  `mass_timber_clt_floor_lane`
- selected output surface:
  `dataholz_clt_calibration_tightening_matrix`
- current remaining blocked candidate order:
  - none inside the current blocked-source queue
  - `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector stay
    closed fail-closed until new evidence appears
- do not do first:
  - direct blocked-family reopening
  - concrete or CLT runtime reopening by inertia
  - another broad generated family grid without a fresh ROI decision

- latest slice closeout selection on `2026-04-19`:
  - landed
    `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - closed `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - selected `blocked_source_backed_widening_rerank_refresh_v2` as the next
    honest no-runtime slice because the mixed seeded closeout produced no
    fresh classified runtime red
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `31/31` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest broad validation pass on `2026-04-20`:
  - reran `pnpm check` during the broad audit/replanning closeout
  - full engine suite: `182/182` test files passed, `1015/1015` tests passed
  - full web suite: `129/129` test files passed, `699/699` tests passed
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings
  - the full green pass confirmed the broad audit could select a defended live
    corridor without reopening any blocked runtime candidate by inertia

- CLT second-pass closeout + timeout defense on `2026-04-20`:
  - landed
    `apps/web/features/workbench/clt-visible-estimate-consultant-trail-matrix.test.ts`
  - landed
    `apps/web/features/workbench/clt-visible-estimate-diagnostics-dossier-matrix.test.ts`
  - landed
    `packages/engine/src/post-dataholz-clt-calibration-tightening-second-pass-next-slice-selection-contract.test.ts`
  - added both new web files and the new engine closeout contract to the
    focused current gate
  - raised `ROUTE_DEEP_HYBRID_TIMEOUT_MS` from `40_000` to `150_000` in
    `apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts`
    after the 04-20 broad check caught the CPU-heavy scan test clocking
    ~40.04s under `pnpm check` parallel load with zero headroom against
    the prior 40s ceiling; new ceiling matches the existing swap cohort
    ceiling and keeps both deep-hybrid cohorts at the same generous limit
  - `pnpm calculator:gate:current`: green with the CLT second-pass cut
    plus the raised timeout
  - the second-pass cut pulled the CLT visible estimate route onto the
    same scoped-estimate posture discipline that reinforced-concrete
    low-confidence already enjoys, without any engine runtime change

- latest checkpoint review on `2026-04-20`:
  - reread `NEXT_IMPLEMENTATION_PLAN.md`,
    `CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md`,
    `CURRENT_STATE.md`, repo `AGENTS.md`, the focused gate, and the active
    Dataholz CLT audit/route tests against the current implementation
  - reran `pnpm calculator:gate:current`: green with focused engine `47/47`
    files and `179/179` tests plus focused web `20/20` files and `38/38`
    tests
  - confirmed the active slice stays `dataholz_clt_calibration_tightening`
    with no new justification to reopen any closed blocked-source family or to
    drift back into reinforced-concrete follow-up work

- latest broad audit and replanning closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - closed `broad_audit_and_replanning_pass_v2`
  - selected `raw_terminal_concrete_helper_family_widening_v1` as the next
    honest active slice because the terminal-concrete helper lane is already
    live, formula-owned, and better guarded than the held CLT-local evidence
    work or any closed blocked-source family
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the audit closeout

- latest raw terminal-concrete helper widening matrix landing on `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts`
  - pinned the first defended widening cut across furring, resilient stud,
    rigid hanger, resilient-channel, and clip-plus-board cavity helper
    variants on terminal concrete carriers
  - kept board-only and helper-without-board concrete lower-treatment inputs
    explicit fail-closed for field-side `Rw`
  - updated the focused current gate with the new raw helper matrix pair

- latest raw terminal-concrete helper provenance/origin guard landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - pinned the same helper-family widening cut to a single defended
    provenance surface across engine and workbench:
    screening-owned floor ratings, mixed predicted-plus-estimated field impact,
    no estimate family reopening, and no lower-bound fallback
  - kept board-only and helper-without-board concrete negatives on the same
    provenance surface while field-side `Rw` stays fail-closed
  - updated the focused current gate with the new raw helper provenance pair

- latest raw terminal-concrete helper split-topology widening landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - pinned one more defended widening cut on the same formula-owned concrete
    lane across split full-helper, split board-fill, and split board-cavity
    topologies
  - kept top-finish and wall-like negatives on the same provenance surface and
    kept the weaker steel-joist raw carrier outside the concrete impact lane
  - updated the focused current gate with the new split-topology pair

- latest raw terminal-concrete helper partial-order widening landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts`
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts`
  - pinned the remaining defended helper shapes from the raw screening support
    baseline on the same formula-owned concrete lane:
    board-and-cavity, board-and-fill, mixed-order, and disjoint
    board-fill-board
  - kept the same screening-owned rating provenance and mixed
    predicted-plus-estimated impact continuation across engine and workbench
  - updated the focused current gate with the new partial-order pair
  - `pnpm calculator:gate:current`: green with focused engine `30/30` files
    and `70/70` tests plus focused web `11/11` files and `12/12` tests

- latest raw terminal-concrete helper closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts`
  - closed `raw_terminal_concrete_helper_family_widening_v1`
  - selected `clt_local_combined_interaction_evidence_v1` as the next honest
    no-runtime slice because the raw helper support-baseline shapes are now
    explicitly pinned and another raw-helper cut would be sprawl instead of a
    clean ROI move
  - kept reinforced-concrete reopening plus every closed blocked-source family
    fail-closed after the closeout
  - updated the focused current gate with the new raw-helper closeout
    selection contract
  - `pnpm calculator:gate:current`: green with focused engine `31/31` files
    and `73/73` tests plus focused web `11/11` files and `12/12` tests

- latest CLT-local combined evidence triad landing on `2026-04-20`:
  - landed
    `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - pinned the first explicit no-runtime local CLT combined evidence triad on
    the engine surface:
    exact `C4c`, predictor-backed visible `C5c`, and one under-described
    fail-closed local combined boundary
  - kept exact provenance, predictor provenance, and screening-only
    fail-closed posture explicit instead of reopening local combined runtime
    widening by inertia
  - updated the focused current gate to carry the new engine matrix and the
    existing workbench CLT history replay guard
  - `pnpm calculator:gate:current`: green with focused engine `35/35` files
    and `134/134` tests plus focused web `13/13` files and `14/14` tests

- latest CLT-local combined exact-anchor pack landing on `2026-04-20`:
  - landed
    `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
  - landed
    `apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts`
  - pinned the remaining exact local CLT combined anchors on the explicit
    engine/workbench evidence surface:
    `C2c`, `C3c`, and `C7c`
  - kept those three anchors exact and kept the family split honest:
    `C5c` stays predictor-backed and under-described direct-fixed local shapes
    still stay fail-closed
  - updated the focused current gate to carry the new engine/web exact-anchor
    pair
  - `pnpm calculator:gate:current`: green with focused engine `35/35` files
    and `134/134` tests plus focused web `13/13` files and `14/14` tests

- latest CLT-local combined closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts`
  - closed `clt_local_combined_interaction_evidence_v1`
  - selected `reinforced_concrete_accuracy_reopen` as the next honest active
    follow-up because the local CLT surface is now explicit and the only
    remaining live non-blocked corridor is the bounded reinforced-concrete
    conditional lane
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the closeout and kept raw helper closed as solved
    evidence
  - updated the focused current gate with the new CLT closeout selection
    contract plus the reinforced-concrete guard pack
  - `pnpm calculator:gate:current`: green with focused engine `42/42` files
    and `159/159` tests plus focused web `15/15` files and `20/20` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete low-confidence follow-up matrix landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts`
  - pinned one explicit reinforced-concrete follow-up surface across engine
    and workbench:
    explicit predictor-input low-confidence baseline, visible-derived
    low-confidence route, expanded-board heavy bare-floor boundary, and
    upper-only heavy-floating formula boundary
  - kept the guarded low-confidence lane explicit:
    nearby-row candidate ids, proxy-airborne posture, and unsupported
    `DeltaLw` stay on the follow-up surface while the adjacent heavy bare and
    heavy floating formula lanes stay outside it
  - updated the focused current gate with the new reinforced engine/web matrix
    pair
  - `pnpm calculator:gate:current`: green with focused engine `43/43` files
    and `164/164` tests plus focused web `16/16` files and `24/24` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete low-confidence provenance/origin landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts`
  - pinned the same reinforced follow-up corridor to one explicit provenance
    split:
    the low-confidence visible route keeps the nearby-row fallback packet,
    while the expanded-board and upper-only boundaries stay on the heavy bare
    / heavy floating formula evidence surfaces
  - confirmed the workbench evidence packet is honest:
    the visible low-confidence route now snapshots the real five-citation
    nearby-row packet instead of a stale extra-summary citation
  - updated the focused current gate with the new reinforced engine/web
    provenance pair
  - `pnpm calculator:gate:current`: green with focused engine `44/44` files
    and `169/169` tests plus focused web `17/17` files and `28/28` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete diagnostics/trail surface landing on
  `2026-04-20`:
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts`
  - pinned the same reinforced follow-up corridor on user-facing audit
    surfaces:
    the visible low-confidence route stays screening-only in the diagnostics
    dossier and consultant decision trail, while expanded-board and upper-only
    boundaries stay on scoped-formula wording
  - confirmed the reporting split stays honest:
    the low-confidence route carries the five-citation screening package and
    warning-heavy delivery posture, while the adjacent formula lanes keep the
    one-citation scoped package and distinct output-coverage tones
  - updated the focused current gate with the new reinforced dossier/trail
    pair
  - `pnpm calculator:gate:current`: green with focused engine `44/44` files
    and `169/169` tests plus focused web `19/19` files and `36/36` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
  - closed `reinforced_concrete_accuracy_reopen`
  - selected `dataholz_clt_calibration_tightening` as the next honest active
    slice because the bounded reinforced low-confidence corridor is now
    explicit and no fourth defended boundary remained inside it
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the closeout and kept raw helper plus CLT-local
    evidence closed as solved program input
  - updated the focused current gate with the new reinforced closeout
    selection contract plus the Dataholz CLT source-truth/calibration pack
  - `pnpm calculator:gate:current`: green with focused engine `47/47` files
    and `179/179` tests plus focused web `20/20` files and `38/38` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest blocked-source refresh landing on `2026-04-19`:
  - landed
    `packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts`
  - kept the explicit blocked candidate order unchanged after the mixed
    seeded closeout:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - confirmed the mixed seeded closeout contributed no fresh classified
    runtime red, no direct source import, and no wall trace red that would
    honestly reopen any blocked runtime candidate
  - added the refresh contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `34/34` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest blocked-source refresh closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts`
  - closed `blocked_source_backed_widening_rerank_refresh_v2`
  - selected `dataholz_gdmtxa04a_composite_surface_model_design_v1` as the
    next honest no-runtime slice because `GDMTXA04A` stayed rank 1 after the
    refresh and its remaining blocker is still local composite-surface design
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `13/13` files
    and `37/37` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest C11c readiness design closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts`
  - closed `tuas_c11c_exact_import_readiness_design_v1`
  - selected `raw_bare_open_box_open_web_impact_widening` as the next honest
    no-runtime slice because the landed readiness design did not yield a
    defended exact-import candidate for the weak weighted tuple
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `18/18` files
    and `52/52` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw bare family closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`
  - closed `raw_bare_open_box_open_web_impact_widening`
  - selected `wall_selector_behavior_widening` as the next honest no-runtime
    slice because the landed raw blocker pack still did not yield true
    bare-carrier impact evidence
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `19/19` files
    and `55/55` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest wall-selector closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
  - closed `wall_selector_behavior_widening`
  - selected `broad_audit_and_replanning_pass_v2` as the next honest no-runtime
    slice because the last remaining blocked family also did not yield a fresh
    classified wall red
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening closed fail-closed after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `20/20` files
    and `58/58` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest Dataholz composite-surface design landing on `2026-04-20`:
  - landed
    `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
  - landed
    `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - extracted the shared `GDMTXA04A` visible proxy boundary and impact cap out
    of `packages/engine/src/floor-system-estimate.ts`
  - kept visible `GDMTXA04A` rows estimate-only and kept exact visible reopen
    blocked because the design still does not yield an honest composite
    surface equivalence
  - added the new design contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `14/14` files
    and `40/40` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest C11c exact-import readiness design landing on `2026-04-20`:
  - landed
    `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - landed
    `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - centralized the visible `C11c` schedule, weak weighted tuple, nearby exact
    anchors, and exact-import prerequisites into one shared fact surface
  - rewired the active `C11c` blocker evidence tests onto the shared fact
    surface
  - kept visible `C11c` rows screening-only with `Rw` support only and left
    exact import blocked because the design still does not produce an honest
    source-backed import rule
  - added the new design contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `17/17` files
    and `49/49` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest focused gate revalidation on `2026-04-20`:
  - reran `pnpm calculator:gate:current` after landing the first raw helper
    widening matrix
  - focused engine gate stayed green at `25/25` files and `65/65` tests
  - focused web gate stayed green at `6/6` files and `7/7` tests
  - focused repo build stayed green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
  - revalidation confirmed the active open work is now raw helper widening,
    not another blocked-source closeout or a forced reopen
    widening

- earlier active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - split the requested-output partial-restore descriptor branch so broad and
    representative requested-output surfaces keep the compact replay variants
    while the selected seeded requested-output surfaces carry the explicit
    reverse-mask variants
  - landed
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts`
    and added it to the focused current gate so the branch split stays pinned
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
  - next narrow task inside the slice was closeout selection, not more replay
    widening

- earlier active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - widened the selected web duplicate/swap replay family from a single
    global reverse toggle to explicit per-plan reverse-mask variants on the
    defended seeded boundary routes
  - aligned the selected generated-history grid and selected output-card
    partial-restore helper so save-load replay can reverse individual split
    plans while broad and representative requested-output grids stay on their
    compact contract
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
  - next narrow task inside the slice is the remaining selected
    requested-output replay runner loop, not a blocked runtime candidate

- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - widened the selected seeded edit-history replay set from the prior
    direct-only quartet to an eight-variant selected-only family that now
    includes reversed split-order chains
  - kept broad and representative requested-output edit-history surfaces on
    their previous direct-only contract so the active slice stays selected-
    route scoped
  - aligned the selected generated edit-history helper and the selected
    requested-output output-card helper so reversed hostile replay collapses
    back onto the canonical direct-final row order before scenario and
    save-load assertions
  - widened selected engine duplicate/swap pressure from complementary
    direct-plus-single/all reversal coverage to exhaustive reverse-mask
    combinations on the defended seeded boundary routes
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest active-slice CLT calibration closeout on `2026-04-17`:
  - landed `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - kept the visible `GDMTXA04A`-like composite dry-screed boundary on the
    defended estimate route with candidate `dataholz_gdmtxa01a_clt_lab_2026`
  - capped lab-side `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI` against the
    direct official exact row so the route no longer drifts optimistically on
    those outputs
  - moved the visible field-side `L'nT,50` path onto the standardized
    `CI,50-2500` companion instead of the weaker local-guide fallback
  - kept direct `GDMTXA04A` exact reopen blocked
- latest active-slice CLT calibration validation on `2026-04-17`:
  - targeted CLT engine pack: `5/5` test files passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank order update on `2026-04-17`:
  - refreshed the explicit blocked order to:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - kept `blocked_source_backed_widening_rerank_v1` selected without opening a
    runtime candidate yet
  - kept all four candidates fail-closed while landing the order in the
    executable rerank contract
  - targeted rerank engine pack: `6/6` test files passed, `23/23` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `8/8` files and
    `29/29` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - kept rank-1 `GDMTXA04A` blocked after an explicit feasibility audit
    because visible exact reopening still requires honest composite dry-screed
    surface modeling
  - advanced the active rerank comparison target to `tuas_c11c_exact_import`
    without changing runtime behavior or the blocked candidate order
  - targeted rerank engine pack: `4/4` test files passed, `10/10` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `9/9` files and
    `31/31` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `156/156` files and `951/951` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rank-2 progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - kept rank-2 `C11c` blocked after an explicit feasibility audit because the
    combined wet tuple remains anomalous and the visible route still stays
    impact-fail-closed
  - advanced the active rerank comparison target to raw bare
    open-box/open-web without changing runtime behavior or the blocked
    candidate order
  - targeted rerank engine pack: `5/5` test files passed, `15/15` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `33/33` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `157/157` files and `953/953` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad audit and replanning pass on `2026-04-17`:
  - reran the focused gate, full repo gate, and build after the rank-2
    `C11c` feasibility hold landed
  - found no new runtime mismatch between implementation and the living rerank
    docs
  - confirmed that the active next move is the rank-3 raw bare
    open-box/open-web feasibility audit, not a direct widening pass
  - full engine suite: `157/157` test files passed, `953/953` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `git diff --check`: green
- latest blocked-source rank-3 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - kept rank-3 raw bare open-box/open-web blocked after an explicit
    feasibility audit because current TUAS and UBIQ rows still prove packaged
    systems rather than true bare-carrier impact behavior
  - advanced the active rerank comparison target to
    `wall_selector_behavior_widening` without changing runtime behavior or the
    blocked candidate order
  - targeted rerank engine pack: `6/6` test files passed, `18/18` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `35/35` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rank-4 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - kept rank-4 `wall_selector_behavior_widening` blocked after an explicit
    feasibility audit because the current wall trace/card guard is already
    closed and no fresh classified wall red exists
  - exhausted the comparison queue inside
    `blocked_source_backed_widening_rerank_v1` without changing runtime
    behavior, so the next honest move is rerank closeout selection instead of
    another feasibility pass
  - targeted rerank engine pack: `7/7` test files passed, `20/20` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `37/37` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rerank closeout selection on `2026-04-18`:
  - closed `blocked_source_backed_widening_rerank_v1`
  - selected `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` as the
    next honest no-runtime slice
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening blocked after their explicit feasibility audits
  - reused the defended seeded mixed floor/wall boundary-route family instead
    of inventing a new runtime urgency after the rerank exhausted its
    candidate queue
  - targeted closeout engine pack: `10/10` test files passed, `28/28` tests
    passed
  - targeted closeout web pack: `4/4` test files passed, `23/23` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad validation stability pass on `2026-04-18`:
  - narrowed the only broad-gate failure to two throughput-only web
    deep-hybrid swap timeouts
  - widened
    `apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts`
    swap timeout headroom from `90_000` to `150_000`
  - kept calculator/runtime behavior unchanged
  - full engine suite: `160/160` test files passed, `960/960` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

- latest live verification after the runtime candidate rerank closeout:
  - full engine suite: `160/160` test files passed, `960/960` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `28/28` tests passed
  - focused web gate: `4/4` test files passed, `23/23` tests passed
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
- latest reinforced-concrete closeout selection on `2026-04-17`:
  - closed `reinforced_concrete_accuracy_tightening_follow_up_v1`
  - selected `dataholz_clt_calibration_tightening` as the next honest move
  - kept `GDMTXA04A`, raw bare open-box/open-web, `C11c`, and wall-selector
    widening blocked
  - kept reinforced-concrete reopening conditional on fresh proof instead of
    letting the low-confidence corridor drift back into the active queue
- latest reinforced-concrete closeout validation on `2026-04-17`:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `153/153` files and `945/945` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest Dataholz CLT closeout selection on `2026-04-17`:
  - closed `dataholz_clt_calibration_tightening`
  - selected `blocked_source_backed_widening_rerank_v1` as the next honest
    move
  - kept direct `GDMTXA04A`, raw bare open-box/open-web, `C11c`, and
    wall-selector widening blocked during the selection step
  - kept reinforced-concrete reopening conditional on fresh proof
- latest Dataholz CLT closeout validation on `2026-04-17`:
  - focused engine gate: `8/8` test files passed, `50/50` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
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
  - full engine suite: `154/154` test files passed, `946/946` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm calculator:gate:current`: green with `6/6` engine files and
    `24/24` engine tests plus `4/4` web files and `12/12` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
  - repo-wide validation surfaced one stale CLT workbench posture contract; it
    was aligned to the new visible-boundary calibration values without changing
    the intended CLT ownership posture

## Current Answer In One Screen

- latest closed implementation slice:
  `broad_audit_and_replanning_pass_v2`
- latest closed planning action:
  `post_broad_audit_and_replanning_pass_v2_next_slice_selection_v1`
- current active next slice:
  `raw_terminal_concrete_helper_family_widening_v1`
- current rule:
  the requested-output harness chain and the full blocked-source family queue
  stay frozen fail-closed; the first post-audit widening move is the guarded
  raw terminal-concrete helper lane, not any blocked-family reopen
- current explicit not-done item:
  the selected raw helper widening slice is only partially widened so far;
  `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector remain
  closed fail-closed until later evidence reopens them honestly

## Current Hotspot Map

- selected raw helper widening anchors:
  - `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - `packages/engine/src/raw-floor-safe-bare-split-parity.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts`
- closed CLT-local evidence:
  - `packages/engine/src/impact-predictor-input.test.ts`
  - `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
  - `apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts`
- fail-closed blocked-source evidence:
  - `packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
- focused checkpoint gate:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed rerank ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

## Harness Hard Stop

The requested-output output-card harness refactor chain is now complete enough.

Rule from this point:

- do not create another requested-output harness-only micro-slice
- only reopen that harness if the active Dataholz design or a later
  blocked-source selection exposes a new mixed-route red that cannot be
  localized otherwise

## Immediate Candidate Posture

- `dataholz_clt_calibration_tightening`
  - selected now as the defended runtime tightening slice on the mass-timber
    CLT floor lane

- `reinforced_concrete_accuracy_reopen`
  - closed as the latest explicit closeout input, not selected

- `clt_local_combined_interaction_evidence_v1`
  - closed as the latest explicit closeout input, not selected

- `raw_terminal_concrete_helper_family_widening_v1`
  - closed as solved program evidence, not selected

Still blocked:

- rank 1:
  Dataholz `GDMTXA04A` visible exact reopen
- rank 2:
  TUAS `C11c` exact import
- rank 3:
  raw bare open-box/open-web impact widening
- rank 4:
  wall-selector behavior widening without a fresh classified red

## Current Next Steps

1. Keep the broad validation baseline green while the Dataholz CLT tightening
   slice is active.
2. Start `dataholz_clt_calibration_tightening` from the defended source-truth
   and calibration audits, not from a direct `GDMTXA04A` exact reopen claim.
3. Keep `reinforced_concrete_accuracy_reopen`,
   `clt_local_combined_interaction_evidence_v1`, and
   `raw_terminal_concrete_helper_family_widening_v1` frozen as closed
   evidence inputs unless a future trace exposes genuinely new defended proof.
4. Keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
   explicitly fail-closed under the new active slice.
5. Add or update CLT audit, provenance, and route-card guards before any
   tightened Dataholz corridor is treated as broader or more exact.

## Priority Order From Here

This is the ROI-ranked order, not just the chronological queue.

1. `dataholz_clt_calibration_tightening`.
   selected now: it is the current defended runtime tightening corridor, and
   the next honest move is to reduce remaining exact-vs-estimate slack inside
   the already-pinned Dataholz CLT source-truth family.
2. `reinforced_concrete_accuracy_reopen`.
   now closed as explicit low-confidence closeout evidence: the corridor no
   longer has a defended fourth boundary cut, so it should not be reopened by
   inertia.
3. `clt_local_combined_interaction_evidence_v1`.
   now closed as explicit evidence: the exact anchors, predictor-backed proxy,
   and under-described fail-closed boundary are all pinned on one shared local
   surface.
4. `raw_terminal_concrete_helper_family_widening_v1`.
   now closed as program evidence: the terminal-concrete helper lane is
   already live, formula-owned, and fully pinned across answer/support/
   provenance/route-card surfaces for the current support baseline.
5. blocked-source reopen candidates.
   `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector stay
   fail-closed until new evidence appears rather than because they were
   forgotten.
