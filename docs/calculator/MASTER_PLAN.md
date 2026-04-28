# Calculator Master Plan

Last reviewed: 2026-04-28
(`wall_coverage_expansion_planning_v2` Gate A closed no-runtime;
`wall_single_leaf_mass_law_calibration_v1` Gate C closed no-runtime;
`wall_double_leaf_sharp_davy_scoping_v1` Gate C closed no-runtime;
`wall_double_leaf_source_evidence_acquisition_v1` Gate A landed
no-runtime)
Iteration: 2 (rewritten with implementation state grid, accuracy
preservation contract, ROI table, quantitative completion targets)

This is the top-level roadmap for the DynEcho acoustic calculator. It is
the second doc a fresh agent reads after `CURRENT_STATE.md`. It answers:

- What does "a good calculator" actually mean, measured in concrete
  targets (not vibes)?
- Where is the implementation today, corridor by corridor?
- Which path maximizes coverage AND accuracy without compromising
  either?
- What is the explicit contract that every slice obeys so accuracy is
  never sacrificed for coverage?
- What are the next ten strategic moves, in order, with their explicit
  closure signals?
- What tests does each move require?
- When can we declare the calculator done?

Private-use calculator readiness is tracked separately in
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
That chain is closed for the current private/internal-use bar. The next
selected calculator work is
`wall_double_leaf_source_evidence_acquisition_v1` Gate B. Gate A
classified Knauf W111/W115 framed-wall rows as bounded reconciliation
evidence, rejected generic empty/no-stud double-leaf runtime movement,
and kept Davy / stud-type literature as corridor context. Runtime/source
posture remains frozen until Gate B names a source row, metric owner,
tolerance, and paired route-card tests, or closes no-runtime.

---

## 0. How To Read This Doc

The doc is structured so a fresh agent can skim the first three sections
(~5 minutes) and know where we are, where we are going, and why.

- §1 — concrete definition of "done"
- §2 — core principles (non-negotiable)
- §3 — current implementation state grid (the single source of truth for
  what the calculator does today)
- §4 — ROI-ranked next moves and the master sequence
- §5 — wall vs floor decision with the honest floor assessment
- §6 — accuracy preservation contract (how coverage grows without
  accuracy loss)
- §7 — test strategy
- §8 — completion signals (6 measurable criteria)
- §9 — doc organization and cross-referencing rules
- §10 — how to resume from this plan

---

## 1. Definition Of "Good Calculator" (Quantitative)

A good calculator is a tool an acoustic engineer can trust for realistic
projects. Product layers (billing, auth, multi-user, desktop app) are
**explicit non-goals** for this plan — they re-enter the roadmap only
after the calculator itself is done.

Done means **all six criteria below hold simultaneously**:

**D1. Coverage**
- ≥6 wall presets across distinct family archetypes:
  single-leaf masonry, single-leaf AAC, mass-timber CLT, light-steel
  stud (LSF), timber stud, heavy lined-massive. Each preset must hit
  its corresponding benchmark `Rw` within the benchmark's own
  tolerance under an explicit `airborneContext`, or be downgraded
  from benchmark-backed to formula-owned with an explicit honesty note.
- ≥8 defended floor corridors across distinct families (UBIQ open-web
  steel, Knauf timber, heavy concrete, reinforced concrete, Dataholz
  CLT, CLT local combined, raw terminal-concrete helper, Pliteq /
  Regupol / Getzner spot coverage). Already achieved — see §3 grid.
- Any user-built realistic stack (single-leaf, double-leaf decoupled,
  mass timber, lined masonry) produces either a defended number or an
  explicit fail-closed answer with a specific reason.

**D2. Accuracy**
- Every defended `Rw`, `R'w`, `Ln,w`, `DnT,w`, `DnT,A` value on every
  defended corridor is tied to a named source (exact catalog row,
  official floor-system row, benchmark-backed family formula, or
  predictor-backed family estimate).
- Benchmark fit tolerance is per-corridor and matches the thresholds
  that already exist in each benchmark test file. Examples currently
  in the repo:
  - framed LSF benchmark (`airborne-framed-wall-benchmark.test.ts`):
    MAE ≤1.5 dB, max ≤4 dB on the official primary dataset (tighter on
    holdout datasets).
  - masonry benchmark (`airborne-masonry-benchmark.test.ts`):
    ±1 dB per case on Porotherm, Silka, HELUZ references.
  - aircrete benchmark (`airborne-aircrete-benchmark.test.ts`): ±1 dB
    per case on Celcon / Ytong references.
- Each defended corridor adopts the bar of its matching benchmark
  class. A preset that cannot hold the benchmark tolerance must either
  tighten through the airborne-context / preset-context route, or be
  downgraded from benchmark-backed to formula-owned with an explicit
  honesty note.
- No defended output depends on layer order for physically
  order-insensitive topologies.

**D3. Corner-case resilience**
- Stacks of 50+ layers produce either a defended answer or a
  specifically-labeled fail-closed output. Never `NaN`, never `undefined`,
  never a crash.
- Invalid thickness (`0`, negative, non-numeric, `NaN`, `Infinity`)
  triggers a specific warning and a defended fail-closed output.
- Unknown `materialId` triggers a specific warning and fail-closed.
- Layer reordering of physically equivalent stacks produces identical
  output sets.

**D4. Test discipline**
- Every defended corridor is pinned in executable tests.
- Every closed slice has a post-slice contract test naming what closed
  and what was selected next.
- Hostile-input matrices exist for both floor and wall.
- Reorder invariance matrix covers both symmetric and asymmetric
  topologies.

**D5. Doc/implementation sync**
- The agent resume triangle (CURRENT_STATE + MASTER_PLAN +
  NEXT_IMPLEMENTATION_PLAN) is internally consistent.
- §3 implementation grid matches the engine state (an executable test
  asserts the grid matches the engine's defended corridor list).
- No doc in `docs/calculator/` disagrees with the current state; when
  a doc goes stale it is either deleted, archived, or updated to match.

**D6. Architectural hygiene**
- No engine file exceeds 2000 lines without a split-deferred note
  explaining why.
- Every non-obvious decision (priority ordering, cap values, tolerance
  bands) has an inline comment explaining *why that specific value or
  ordering*.

When D1–D6 hold, the calculator is done. The ten strategic moves in §4
advance us to that state.

---

## 2. Core Principles

Non-negotiable. Every slice must satisfy all four.

**P1. Coverage + accuracy advance together, or neither advances.**
Any slice that grows coverage must either (a) leave every existing
defended corridor's numerical output unchanged, or (b) improve the
accuracy of what changes with an explicit tolerance proof. Coverage
gained at the cost of accuracy is a regression.

**P2. Every defended output traces to a named source.**
No defended number exists without a named evidence tier: exact catalog
row, official floor-system row, benchmark-backed family formula,
predictor-backed family estimate, or formula-owned lane with an
inline citation. The absence of a source tier means the output is
fail-closed.

**P3. Tests measure correctness, not execution.**
Every test has an explicit assertion on a value, state, or behavior.
Tests that only confirm "the code ran" are not tests. Every corridor
widening lands with positive matches, negative fail-closeds, and
precedence tests simultaneously.

**P4. Docs reflect implementation state, not intentions.**
The implementation state grid (§3) matches the engine's actual
corridor list. When they drift, the drift is the highest-priority fix.
Plans describe the future; state describes the present; they never
trade places.

---

## 3. Implementation State Grid (last reconciled 2026-04-24)

Live snapshot of what the calculator actually handles today. Status
codes:

- 🟢 **Exact** — source-backed catalog row or official floor-system row
- 🟢 **Benchmark** — benchmark fit audit enforced with defended tolerance
  in a test file
- 🟡 **Formula** — formula-owned lane with defended citation; output
  does not match a published benchmark under the route's default context
- 🟡 **Family** — predictor-backed family estimate
- 🟠 **Screening** — low-confidence lane explicit as screening-only
- 🔴 **Fail-closed** — intentionally blocked, waiting for evidence
- ⚠️ **Known bug** — behavior captured as broken, awaiting fix slice
- ⚪ **Not yet covered** — no defended lane today

### Floor

| Family | Status | Evidence |
|---|---|---|
| UBIQ open-web steel (weak-band) | 🟢 Exact | `ubiq-open-web-weak-band-rows.ts` + source-truth audits |
| UBIQ open-web steel (supported-band) | 🟢 Exact | 90 exact rows pinned |
| UBIQ carpet bound (Ln,w+CI ≤45) | 🟢 Exact | 18 bound rows pinned |
| Knauf timber direct mount | 🟢 Exact | `knauf-direct-timber-exact` preset + benchmark |
| Knauf acoustic mount timber | 🟢 Exact | `knauf-acoustic-mount-exact` preset + benchmark |
| Heavy concrete Annex C family | 🟢 Benchmark | `impact-heavy-floor-planned-scope-benchmark` |
| Reinforced concrete (vinyl + elastic) | 🟠 Screening | Bounded low-confidence corridor frozen |
| Reinforced concrete (formula boundaries) | 🟡 Formula | Heavy bare / heavy floating formula lanes |
| Dataholz CLT dry | 🟢 Exact | `dataholz_gdmtxn01_dry_clt` + source-truth audit |
| Dataholz CLT wet + suspended | 🟢 Exact | GDMNXA02A family exact rows |
| Dataholz GDMTXA04A (direct exact) | 🔴 Fail-closed | Composite dry-screed surface unmodeled |
| Dataholz GDMTXA04A (visible estimate) | 🟡 Formula | Capped visible estimate boundary + consultant-trail + dossier |
| CLT local combined (C2c/C3c/C4c/C7c) | 🟢 Exact | Local combined exact anchor pack |
| CLT local combined (C5c) | 🟡 Family | Predictor-backed proxy |
| Raw terminal-concrete helper | 🟡 Formula | Widening + split-topology + partial-order matrices |
| TUAS C11c exact import | 🔴 Fail-closed | Combined wet tuple anomaly |
| Raw bare open-box/open-web impact | 🔴 Fail-closed | No bare-carrier source evidence |
| Pliteq / Regupol / Getzner | 🟢 Exact | Spot coverage on specific preset IDs |

**Floor assessment:** coverage is deep across all major building
families. Remaining work is largely source-blocked (waiting on new lab
data for GDMTXA04A composite, C11c anomaly, bare carrier evidence). Most
runtime floor slices have diminishing returns.

### Wall

Each preset ships with the `rows` only; the workbench shell
(`apps/web/features/workbench/workbench-shell.tsx` `liveAirborneContext`)
already composes the `airborneContext` from the workbench store defaults
(airtightness=good, contextMode=element_lab) plus anything the user has
changed in the airborne-context panel. Under that real user-facing
context the preset outputs match the corresponding engine benchmarks.

| Family | Status | Evidence |
|---|---|---|
| Concrete double-leaf (`concrete_wall` preset) | 🟠 Screening | 4-layer migration-safe composition in `preset-definitions.ts`; `wall-full-preset-contract-matrix` proves screening posture with Rw live in lab/field/building via the screening mass-law seed carrier |
| AAC single-leaf (`aac_single_leaf_wall` preset) | 🟢 Benchmark | `wall-preset-expansion-benchmarks.test.ts` pins Rw=47 under the workbench default lab context, matching `xella_ytong_d700_150_plaster10_official_2026` (Xella reference Rw=47, ±2.5 dB) |
| Masonry brick (`masonry_brick_wall` preset) | 🟢 Benchmark | `wall-preset-expansion-benchmarks.test.ts` pins Rw=43 under the workbench default lab context, matching `wienerberger_porotherm_100_dense_plaster_primary_2026` (Wienerberger/Lucideon Rw=43, ±1 dB); `wall-physical-invariants-matrix.test.ts` pins R'w ≤ Rw under field + building contexts after the 2026-04-21 lab-fallback anchor landed |
| CLT wall (`clt_wall` preset) | 🟡 Formula | `wall-preset-expansion-benchmarks.test.ts` pins Rw=40 under the workbench default lab context; no exact CLT wall catalog row exists today |
| Light-steel stud (LSF) (`light_steel_stud_wall` preset) | 🟢 Exact | `wall-lsf-timber-stud-preset-benchmarks.test.ts` pins Rw=55 under the preset's composed lab context, anchoring to `knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026` (Knauf exact catalog row); field R'w=48 and building R'w=48 pinned as drift guards; preset's `airborneDefaults.studType=light_steel_stud` forwards through `loadPreset` into the workbench store |
| Timber stud (`timber_stud_wall` preset) | 🟡 Formula | 2026-04-23 Gate A audit split the known gap into screening vs dynamic surfaces; Gate B proved the live workbench route already uses the dynamic surface; Gate C then closed honestly no-runtime. The live route stays at lab Rw=50, field R'w=42, building DnT,w=43 with low-confidence `stud_surrogate_blend+framed_wall_calibration`, while the old screening matrices remain non-user-visible drift guards. The source-corpus follow-up landed two direct timber exact imports for narrower single-board rows and the resilient side-count slice later landed four explicit RB1/RB2 exact imports for `one_side`/`both_sides`; the live direct double-board timber preset remains formula because it still does not exact-match those rows. |
| Wall selector families (double-leaf, lined-massive, AAC boundary, G5 sibling, heavy-core trim, lab double-stud) | 🟢 Benchmark | VALUE-pinned across 3 contexts × 9 outputs in `dynamic-airborne-wall-selector-value-pins.test.ts` (2026-04-22 step 7b) + narrative pins retained in `dynamic-airborne-wall-selector-trace-matrix.test.ts`. 5 cross-cell physical invariants (I1/I2/I3 + Ctr≤C + STC≈Rw) green on every cell. |
| Deep-hybrid swap corridors (`heavy_core`, `aac_d700_100`, `aac_d700_120`, `aac_g5`) | 🟡 Family | Each pinned in its own `dynamic-route-deep-hybrid-swap-*.test.ts` file |
| Wall hostile-input matrix | 🟢 Benchmark | Engine `raw-wall-hostile-input-answer-matrix.test.ts` and workbench `raw-wall-hostile-input-route-card-matrix.test.ts` cover 50-layer stacks, unknown materials, invalid thickness, empty rows, and route-card posture; step-7 torture matrix O1 adds per-case hostile-input overlays |
| Wall reorder invariance | 🟢 Benchmark | `apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts` pins Rw / C / Ctr / supportedOutputs invariance across asymmetric light-heavy reversals and symmetric topologies; fix landed 2026-04-21 |
| Wall field continuation per corridor | 🟢 Benchmark | Preset surface is VALUE-pinned in `wall-field-continuation-completeness-matrix.test.ts`; selector corridor surface is VALUE-pinned across lab / field / building contexts in `dynamic-airborne-wall-selector-value-pins.test.ts` (2026-04-22 step 7b) |

**Wall assessment:** breadth is now at 6/6 wall preset archetypes, plus
the selector-corridor surface is VALUE-pinned across lab, field, and
building contexts. The hostile-input and field-continuation gaps are
closed. Remaining wall follow-ups are explicit deferrals, not hidden
completion blockers: timber-stud runtime tightening is parked behind
closed source-corpus and resilient side-count evidence packs unless a true
direct double-board exact topology row is sourced; deep-hybrid swap VALUE
pins are low-ROI, and workbench card-level selector VALUE pins remain
optional unless the final audit finds a user-visible card drift.

### Cross-cutting

| Concern | Status | Evidence |
|---|---|---|
| Floor hostile-input matrix | 🟢 Exact | `raw-floor-hostile-input-answer-matrix.test.ts` + `raw-floor-hostile-input-route-card-matrix.test.ts` |
| Wall hostile-input matrix | 🟢 Benchmark | Landed 2026-04-21 as `raw-wall-hostile-input-answer-matrix.test.ts`; step-7 torture matrix O1 overlay adds per-case hostile-input exercises (5 thickness classes + 3 stack-level classes) |
| Engine mixed-mode cross-mode torture | 🟢 Benchmark | Landed 2026-04-22 as `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` — 8 overlays × 4 new wall cases = 32 assertions |
| Engine torture matrix wall coverage | 🟢 6/6 | `ENGINE_MIXED_GENERATED_CASES` expanded from 3 → 7 wall cases (masonry, CLT, LSF, timber-stud added) in step 7 |
| Adjacent same-material split invariance | 🟢 Benchmark | Two regression guards landed 2026-04-22 — masonry calibrator + verified catalog matcher both use `coalesceSameMaterialSolidLeaves` / `coalesceAdjacentSameMaterialLayers` helpers to keep split variants on-lane |
| Engine thickness validity | 🟢 Benchmark | Workbench `normalize-rows` emits warnings on invalid thickness; floor and wall hostile-input matrices stay green; `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts` directly pins wall lab, wall field, explicit-role floor field, and raw floor pre-inference callers across `0`, negative, `NaN`, `Infinity`, and non-numeric runtime thickness values |
| Many-layer (50+) stability | 🟢 Benchmark | Wall 50-layer identical/mixed stacks are pinned in `raw-wall-hostile-input-answer-matrix.test.ts`, step-7 O8 covers many-layer finite/monotone behavior for the new wall torture cases, and `floor_many_layer_stress_regression_v1` closed after pinning representative floor 50+ engine/web surfaces |
| Reorder output-set invariance | 🟢 Benchmark | Fixed 2026-04-21 via ctr_term-guarded fallthrough in `packages/engine/src/target-output-support.ts` `getCarrierC`; pinned in `wall-reorder-invariance-matrix.test.ts` |
| `dynamic-airborne.ts` size | 🟢 Split v2 Gate C closed | 1793 lines (from 6630) after split refactor v1 plus eleven v2 carves; `dynamic_airborne_split_refactor_v2` Gate C closed after broad validation, and remaining 3 recursive composer guards are optional architecture backlog, not a C6 blocker |

### How to keep this grid honest

Every closeout slice must either add a row, flip a row's status, or
confirm no grid row changes. The grid becomes stale if a slice lands
without updating it. Drift prevention: §9 cross-reference rule plus the
planned executable test in master-plan step 8 that asserts the grid rows
match engine reality.

---

## 4. Next Moves (ROI-Ranked)

Five candidate directions were weighed on 2026-04-21. Ranking by
mission fit (coverage + accuracy, no accuracy compromise), scope,
user-visible impact, and risk:

| # | Candidate | Coverage | Accuracy | Scope | Risk | Selected |
|---|---|---|---|---|---|---|
| A | Reorder output-set consistency (audit finding 9) | neutral | + | 1-2 d | low | ★ done (landed 2026-04-21) |
| B | LSF + timber stud preset landing (preset-to-workbench-state defaults for `studType`, `studSpacingMm`) | ++ | neutral | 1-2 d | medium | candidate |
| C | Wall hostile-input matrix (floor analog for walls) | neutral | + (robustness) | 1 d | low | candidate |
| D | Wall field-continuation completeness audit (every defended corridor × lab/field/building × every output pinned) | + | ++ (real audit) | 1-2 d | low | candidate |
| E | Engine-level hostile thickness guardrail (cross-cutting) | neutral | + | 0.5 d | very low | candidate |
| F | `dynamic-airborne.ts` split | neutral | neutral (enabler) | 2-3 d | high | conditional step 7 |
| G | Wall formula family widening (mass-law / Sharp / Davy) | ++ | + | 2-3 d | medium | conditional step 8 |

**A landed (2026-04-21).** The reorder fix closed a concrete observed
bug with a surgical screening-carrier fallthrough in
`target-output-support.ts`. No numerical outputs changed; the
`wall-reorder-invariance-matrix.test.ts` guard stays green.

**What comes next — honest reassessment after the retraction.**

The original "preset airborne context injection" slice was
predicated on a false accuracy gap (see
`SYSTEM_AUDIT_2026-04-20.md` finding 10 retraction). Presets already
match their benchmark Rw under the workbench default lab context.

The real remaining wall work splits into four independent candidates
(B, C, D, E above). ROI ranking for the NEXT slice after A landed:

- **D — Wall field-continuation completeness audit** ⭐ recommended.
  Real audit work, might surface genuine accuracy gaps across
  field/building contexts that we cannot see without it. Small scope
  (1-2 d), no source-blocking, directly advances accuracy per P1.
- **C — Wall hostile-input matrix**. Parallel to the floor hostile-
  input matrix. Robustness contribution. Short (1 d).
- **B — LSF + timber stud preset landing**. Coverage, but LSF engine
  accuracy already proven in `airborne-framed-wall-benchmark`; this
  slice mainly wires preset-to-`studType` defaults. Lower priority
  until the auditing work (D) is done.
- **E — Engine thickness guardrail**. Opportunistic half-day slice,
  can land alongside any of the above.

Recommended order: **D → C → B**, with E folded into whichever slice
touches engine validation helpers first.

### The Master Sequence (ten moves)

Each move is a slice or tight slice group. Each has an explicit closure
signal — the test that must be green to call it done.

| # | Slice | What closes it |
|---|---|---|
| 1 | `wall_reorder_output_set_consistency_v1` ✅ landed 2026-04-21 | `wall-reorder-invariance-matrix.test.ts` green across symmetric + asymmetric topologies |
| 1b | `masonry_flanking_inversion_fix_v1` ✅ landed 2026-04-21 | Engine accuracy blocker surfaced by the invariants matrix; lab-fallback anchor lane pins R'w ≤ Rw for any layer stack with a lab-mode benchmark — `wall-physical-invariants-matrix.test.ts`, `airborne-verified-catalog-lab-fallback.test.ts`, `airborne-catalog-field-anchor-lab-fallback.test.ts` all green |
| 2 | `wall_lsf_timber_preset_pack_with_invariants_v1` ✅ landed 2026-04-21 | 6 wall presets × 3 contexts × I1/I2/I3 green; LSF locks Knauf exact row (Rw=55); timber stud drift-guard pinned; AAC/masonry/CLT field+building VALUE pins landed; C1 ✓ |
| 3 | `wall_hostile_input_matrix_with_airborne_cartography_v1` ✅ landed 2026-04-21 | Wall hostile-input matrix (engine + workbench) green, engine `assembly-input-guardrail.ts` converts hostile input (unknown material / invalid thickness) into deterministic fail-closed output with specific warnings, `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` blueprints the next split slice; C4 ✓ |
| 4 | `dynamic_airborne_split_refactor_v1` ✅ landed 2026-04-21 | 15 atomic commits, main `dynamic-airborne.ts` shed 6630 → 3214 lines (−52%) into seven bounded modules (helpers, family-detection, davy-masonry, mixed-plain-templates, cavity-topology, masonry-calibration, framed-wall). Remaining 3200 lines hold floor/cap guards + composer — deferred to `dynamic_airborne_split_refactor_v2` because guards recursively call the composer (circular-import blocker needs composer injection). C6 partial ✓ with split-deferred note. |
| 4b | `dynamic_airborne_split_refactor_v2` ✅ Gate C closed 2026-04-26 | Behavior-preserving architecture slice. Gate A inventoried 14 guards; Gate B carved eleven guards into `dynamic-airborne-correction-guards.ts`, including composer injection for `applyMicroGapFillEquivalenceGuard`, `applySingleLeafMasonryMonotonicFloor`, and `applyNarrowHeavyDoubleLeafGapCap`; broad `pnpm check` stayed green; `dynamic-airborne.ts` is now 1793 lines and C6 is closed. The remaining 3 recursive composer guards are optional architecture backlog. Follow-up `realistic_layer_combination_coverage_cartography_v1` Gate A has now landed no-runtime. |
| 5 | `wall_field_continuation_value_pinning_v1` ✅ landed 2026-04-21 | 18 preset × context cells × 10 outputs pinned to exact VALUEs in `wall-field-continuation-completeness-matrix.test.ts`. I1/I2/I3 invariants green on every cell. No new accuracy findings — step 6 stays conditional; timber stud gap is the only known lane parked for it. Dimension B (corridor selector VALUE pins) deferred as a follow-up track. |
| 6 | `wall_formula_family_widening_v1` ✅ honest closeout 2026-04-23 | Gate A named screening vs dynamic timber surfaces, Gate B proved the live route already uses the dynamic lane, and Gate C closed no-runtime because current official timber rows are broad corridor evidence, not a precise trim target. Follow-up selected: `wall_timber_lightweight_source_corpus_v1`. |
| 7 | `mixed_floor_wall_edge_case_hardening_v1` ✅ landed 2026-04-22 | Engine wall surface consolidated from 3 → 7 cases (6/6 preset parity); 8-overlay cross-mode torture matrix green (32 assertions on the new cases); two real engine bugs caught + fixed (F1 masonry calibrator coalesce, F2 catalog-match coalesce); F3 deferred + F4 test-refined; post-contract pins closure |
| 7b | `wall_corridor_surface_value_pinning_v1` ✅ landed 2026-04-22 | 6 wall selector corridor labels × 3 contexts × 9 outputs VALUE-pinned (`dynamic-airborne-wall-selector-value-pins.test.ts` — 198 drift guards + 5 cross-cell invariant tests). Stud-context plumbing hardened (`lab_double_stud` stays `double_stud_system` across lab/field/building via stud-aware FIELD + BUILDING variants). No engine changes required — every cell landed inside ISO 717-1 plausibility window. C2 + C3 corridor surface flips 🟡 → ✅. |
| 8 | `good_calculator_final_audit_v1` ✅ landed 2026-04-23 | `coverage-grid-consistency.test.ts` maps §3 rows to executable evidence, verifies C1-C6 with explicit C3/C5/C6 honesty, removes stale wall hostile/field drift, updates the focused gate, and opens `POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`. Productization has since closed `server_backed_project_storage_v1`, `project_access_authorization_v1`, `auth_session_hardening_v1`, `team_access_model_v1`, `project_access_policy_route_integration_v1`, and `proposal_report_polish_v1`; after broad green revalidation the calculator re-entry slices through `all_caller_invalid_thickness_guard_v1` closed no-runtime, then `dynamic_airborne_split_refactor_v2` closed Gate C and moved C6 out of partial. The private/internal-use calculator chain in `PERSONAL_USE_READINESS_ROADMAP.md` then closed through realistic combination cartography, heavy-core/concrete, timber stud + CLT, floor fallback, and UI/input/output honesty Gate C. `calculator_source_gap_revalidation_v1` Gate A and `wall_coverage_expansion_planning_v2` Gate A closed no-runtime and selected `wall_single_leaf_mass_law_calibration_v1`, which later closed no-runtime at Gate C; `wall_double_leaf_sharp_davy_scoping_v1` Gate C has now closed no-runtime and selected source-evidence acquisition. |

Slice 6 is explicitly conditional — lands only if slice 5 reveals a
defendable gap. Each slice advances all three priority axes
(coverage, accuracy, architecture readiness) simultaneously; no
single-axis slices remain in the plan.

---

## 5. Wall Vs Floor Decision (Honest Both-Sides)

### Floor assessment

- Floor coverage depth is high: seven source-backed families, multiple
  benchmark fit audits, extensive corridor guards (§3).
- Remaining floor gaps are source-blocked: GDMTXA04A composite surface,
  C11c frequency anomaly, bare carrier impact evidence. None of these
  unblocks by engine work alone.
- Floor accuracy gaps that *could* be engine-addressable:
  - Field continuation parity across all floor corridors — not fully
    audited systematically
  - Floor reorder invariance — same open question as wall
  - Hostile-input matrix already exists; thickness guardrail deferred
- If we chose floor first, the work would be: audit field continuation
  completeness, add reorder invariance. Both small and valuable but
  **not visibly coverage-expanding** to the user.

### Wall assessment

- Wall coverage depth is shallow despite recent preset expansion
- Multiple runnable gaps: reorder bug, preset context injection,
  hostile-input matrix, field continuation audit
- Every wall gap moves the user-visible capability forward because wall
  is currently the weaker half

### Decision

**Wall.** Reasons, ranked:

1. Equal weighting of coverage and accuracy (P1) means the axis that
   is behind on *both* dimensions gets priority.
2. Wall has runnable work that grows coverage (steps 2, 3, 8) and
   tightens accuracy (steps 1, 4, 6) simultaneously. Floor can only
   tighten.
3. The cross-cutting step 5 (thickness guardrail) advances floor
   accuracy opportunistically while wall work continues.
4. Step 6 (field continuation audit) covers floor corridors too — when
   we do it for wall, we can do it for floor in the same slice.

**Floor re-enters priority** when:

- A new source-backed floor family lands externally (new dataset, new
  lab report),
- A floor regression appears (any defended corridor goes red), or
- Wall coverage reaches parity with floor (§3 grid wall section has
  no more 🔴 or ⚪ rows).

---

## 6. Accuracy Preservation Contract

P1 says coverage and accuracy advance together. This section is the
explicit contract every slice obeys to make that true.

**AP1. Pre-slice snapshot.**
Before a slice starts, run `pnpm calculator:gate:current` and
`pnpm check`. Record the green baseline: exact test file and test
counts. This is the rollback target.

**AP2. Tests lead implementation.**
For every new defended output the slice adds, a test asserting the
exact value on the canonical input lands before the engine change.
Widening slices land positive + negative + precedence tests
simultaneously. Tightening slices land the invariance test before the
fix so the bug is test-captured.

**AP3. No defended value changes silently.**
If any existing `Rw`, `Ln,w`, `DnT,w`, etc. value changes during the
slice, the change must be explicit: the change is documented in the
slice's post-contract, justified with source evidence, and approved
by explicit test updates (not silent snapshot drift).

**AP4. Blocked-source posture is never loosened.**
The four blocked candidates (GDMTXA04A direct exact, C11c exact
import, raw bare impact, wall-selector widening) stay blocked unless
the slice imports new source evidence that explicitly justifies the
reopen. "The nearby test turned green" is not justification.

**AP5. Precedence stays stable.**
Exact > catalog > bound > family > formula > low-confidence >
unsupported. A new formula-owned lane cannot shadow an existing
exact or family lane for the same physical topology. Tests prove
precedence for every new lane.

**AP6. Reorder invariance is non-negotiable once step 1 lands.**
After `wall_reorder_output_set_consistency_v1` closes, every new
slice must keep the reorder invariance matrix green. Any new slice
that would break it stops and rethinks.

**AP7. Broad validation caps every slice.**
Every slice closes on `pnpm check` green, not just
`pnpm calculator:gate:current`. The focused gate catches the slice's
targeted surfaces; the broad check catches everything else.

These seven rules are how "kapsam artarken doğruluktan asla fire veremeyiz"
operationalizes. Without them, coverage growth is hope.

---

## 7. Test Strategy

Tests are the calculator's primary correctness artifact. Every slice
adds tests; slices that do not add tests are not slices.

### Existing test tiers

- **Source-truth audits** — pin exact catalog values. One per
  source-backed family.
- **Benchmark fit audits** — pin expected values per a named dataset
  with tolerance. One per benchmarked corridor.
- **Corridor guard matrices** — pin positive matches + explicit
  fail-closed negatives + precedence. One per defended corridor.
- **Route/card matrices** — pin workbench-side output card status,
  tone, provenance wording.
- **Post-slice contracts** — pin "what closed, what got selected
  next" so the chain is readable.
- **Hostile-input matrices** — floor and wall both have engine +
  workbench matrices; wall invalid-thickness and 50-layer classes are
  pinned in `raw-wall-hostile-input-answer-matrix.test.ts`, and the
  all-caller direct floor/wall thickness boundary is pinned in
  `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`.

### Test additions the master plan requires

| Test | Master-Plan Step | Rationale |
|---|---|---|
| `wall-reorder-invariance-matrix.test.ts` | 1 | Prove asymmetric stacks have identical output sets across order reversal |
| `preset-context-injection-matrix.test.ts` | 2 | Prove injected `airborneContext.studType` flows preset → engine and changes Rw as expected |
| `wall-preset-pack-2-benchmarks.test.ts` | 3 | Pin canonical Rw per new preset against named source row |
| `raw-wall-hostile-input-answer-matrix.test.ts` + workbench counterpart | 4 | Mirror the floor hostile-input discipline on walls |
| `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts` | 5 | Direct floor/wall engine guardrail for invalid thickness classes across wall lab, wall field, explicit-role floor field, and raw floor pre-inference callers |
| `wall-field-continuation-completeness-matrix.test.ts` + `dynamic-airborne-wall-selector-value-pins.test.ts` | 6 + 7b | Every defended wall preset and selector corridor surface × lab/field/building context × field output pinned |
| `airborne-dynamic-split-regression.test.ts` | 7 (conditional) | Post-refactor: zero behavior change |
| `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` | 9 | Cross-mode torture extended to new wall corridors |
| `coverage-grid-consistency.test.ts` | 8 | Assert §3 grid rows match executable evidence and do not carry contradictory statuses |

### Tests the master plan does NOT add

- Duplicate benchmark tests (a preset test that re-pins a value already
  pinned by the benchmark audit).
- "Does it run" tests without value assertions.
- Tests that require airborneContext but hide that dependency; every
  test must declare its context explicitly.

### Testing cadence

Inside a slice, the loop is: write test red → engine fix → test green →
adjacent tests green → broad check green → post-contract → update §3
grid → slice closed.

---

## 8. Completion Signals (Measurable)

When all six hold, the calculator is done. Each maps to a specific
artifact that can be checked.

| # | Signal | How To Measure |
|---|---|---|
| C1 | Wall preset coverage ≥ 6 distinct archetypes with honest evidence tiering | `preset-definitions.ts` has ≥6 wall presets, benchmark/exact presets map to their benchmark tolerances, and formula-owned presets (currently CLT wall and timber stud) carry explicit VALUE pins and honesty notes instead of pretending to be exact |
| C2 | Every defended wall corridor has source-truth or benchmark fit audit | §3 grid wall section — no 🟡 Formula row without an engine benchmark link or explicit honesty note; no ⚠️ Known bug rows remain |
| C3 | Wall field-continuation coverage complete | `wall-field-continuation-completeness-matrix.test.ts` + `dynamic-airborne-wall-selector-value-pins.test.ts`; every defended wall preset/selector corridor × lab/field/building context × field output has a pinned status. Full floor field-continuation expansion is an explicit non-blocking follow-up from the 2026-04-22 deferral ledger. |
| C4 | Hostile-input discipline | Floor + wall hostile-input matrices green; wall invalid-thickness and 50-layer classes are pinned in `raw-wall-hostile-input-answer-matrix.test.ts`; the all-caller direct thickness guard pins floor/wall invalid thickness before workbench normalization; step-7 torture O1 covers every new wall case |
| C5 | Reorder and split invariance on defended surfaces | `wall-reorder-invariance-matrix.test.ts` + step-7 O2 cover wall symmetric/asymmetric reorder behavior; floor split/parity stability is pinned in `floor-split-layer-parity.test.ts`, `raw-floor-inferred-split-parity.test.ts`, and `floor-topology-sanity-sweep.test.ts`. Full arbitrary floor reorder expansion is not claimed by this final wall audit. |
| C6 | Architectural hygiene | No engine source file >2000 lines without a split-deferred note; `dynamic-airborne.ts` is now 1793 lines and `dynamic_airborne_split_refactor_v2` Gate C closed after broad validation; `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` records the remaining guard map, and the remaining 3 recursive composer guards are optional architecture backlog |

The `good_calculator_final_audit_v1` slice (step 8) verified all six
signals explicitly with `coverage-grid-consistency.test.ts`.

---

## 9. Documentation Organization

### The Agent Resume Triangle

Three docs are authoritative for "where are we and what next":

1. `docs/calculator/CURRENT_STATE.md` — snapshot.
2. `docs/calculator/MASTER_PLAN.md` (this file) — strategic roadmap +
   implementation state grid.
3. `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` — tactical slice detail.

Drift between the three is the first thing to fix before any other
work.

### Cross-reference rule

Any doc that implies "we are working on X" must link to the resume
triangle. Any doc that lists slices must link to its slice plan or
say "see slice's own plan when it becomes active". This is how the
next agent finds the root of the current work without searching.

### Doc freshness rule (four-point closeout)

Every closed slice updates:

1. `CURRENT_STATE.md` — active slice moved, validation recorded
2. `NEXT_IMPLEMENTATION_PLAN.md` — Now, Current Position, Selected Next
   Slice sections
3. The slice's post-contract test — executable closure record
4. The corresponding program plan doc and §3 grid of this file

Skipping any of the four is how drift restarts.

### Docs that support the triangle

- `SYSTEM_AUDIT_2026-04-20.md` — audit findings + post-session priority
  analysis that feed this master plan
- `WALL_COVERAGE_EXPANSION_PLAN.md` — wall program tracked across
  master-plan steps 2, 3, 4, 6
- `SOURCE_GAP_LEDGER.md` — source-backed and deferred-family ledger
- `CALCULATION_MODEL_AND_VALIDATION.md` — answer-origin meaning and
  evidence-tier composition
- `SYSTEM_MAP.md` — end-to-end runtime boundaries

### Historical context

Checkpoint handoffs and archived status live in `docs/calculator/CHECKPOINT_*`
and `docs/archive/`. They inform history but never override the living
triangle.

### What to delete, archive, or keep

- **Keep** — anything in the resume triangle or directly referenced
  from it
- **Archive** — checkpoint handoffs older than the current state but
  still useful as context
- **Delete** — only docs that are provably wrong AND cannot be
  rescued by an update. If in doubt, archive instead (per working
  discipline: no deletion that risks information loss)

---

## 10. How To Resume From This Plan

A fresh agent opens the project:

1. Read `docs/calculator/CURRENT_STATE.md` (≤5 min). Learn what just
   closed and what is selected.
2. Read this file §3 (implementation state grid) + §4 (next moves)
   (≤5 min). Learn why that selection is right.
3. Read `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` §Now and
   §Selected Next Slice (≤5 min). Get the tactical detail.
4. Run `pnpm calculator:gate:current`. Confirm green baseline.
5. Start the active slice.

If any of those three docs says something different from the others,
the agent stops and flags the drift. That is how we avoid restarting
the doc-drift problem documented in `SYSTEM_AUDIT_2026-04-20.md`.

---

## 11. Open Questions This Plan Defers

- Does the generic airborne calculator already handle realistic
  single-leaf and double-leaf walls accurately enough that explicit
  mass-law/Sharp/Davy lanes are unnecessary? Resolved by step 6
  audit.
- Does `dynamic-airborne.ts` need to split before step 8 widening, or
  can the widening land inside the existing file? Resolved after step
  1 reveals how derivation is structured.
- When does desktop-app / SaaS productization enter the roadmap? Out
  of scope for this plan — the calculator is productless until it is
  proven good.
- Are exact wall rows from Dataholz / Knauf / Rockwool worth importing
  now, or only once the formula-owned lanes are stable? Re-evaluated
  after step 3 closes.

---

## Changelog

- **Iteration 2 (2026-04-21)**: rewritten with §3 implementation state
  grid, §6 accuracy preservation contract, §4 ROI table, §1
  quantitative completion targets, §8 measurable completion signals,
  honest floor assessment in §5, explicit step closure signals.
- **2026-04-26 update**: `dynamic_airborne_split_refactor_v2` Gate C
  closed after eleven behavior-preserving correction-guard carves and
  broad `pnpm check`; C6 moved out of partial; active slice is now
  `realistic_layer_combination_coverage_cartography_v1`.
- **2026-04-27 update**: the private/internal-use readiness chain closed
  through realistic combination cartography, heavy-core/concrete,
  timber stud + CLT, floor fallback, and UI/input/output honesty Gate C.
- **2026-04-27 update**: `project_access_policy_route_integration_v1`
  closed owner-only route-policy integration. Project/proposal route
  decisions now flow through the pure access policy without enabling
  team route access.
- **2026-04-27 update**: `proposal_report_polish_v1` closed
  no-runtime report honesty. It added simple export output coverage,
  generated-document floor/wall honesty coverage, and many-layer /
  long-label report regression coverage.
- **2026-04-27 update**: `calculator_source_gap_revalidation_v1` Gate A
  closed no-runtime. It kept the blocked-source queue fail-closed and
  selected `wall_coverage_expansion_planning_v2`.
- **2026-04-27 update**: `wall_coverage_expansion_planning_v2` Gate A
  closed no-runtime. It inventoried wall coverage and selected
  `wall_single_leaf_mass_law_calibration_v1`; Gate A of that slice must
  prove source/formula basis before changing calculator formulas,
  source posture, output support, confidence, or acoustic values.
- **2026-04-27 update**: `wall_single_leaf_mass_law_calibration_v1`
  closed no-runtime at Gate C. Its Gate B pinned current unmatched
  150 mm concrete, solid-brick, and generic-AAC values as defensible
  formula-owned estimates but blocked runtime movement without a
  stack-specific source row or bounded tolerance pack. The next selected
  calculator slice is `wall_double_leaf_sharp_davy_scoping_v1`, starting
  with no-runtime Sharp/Davy/double-leaf/stud-cavity applicability
  scoping.
- **2026-04-27 update**: `wall_double_leaf_sharp_davy_scoping_v1`
  Gate A landed no-runtime. It pins current representative double-leaf,
  single-stud, and double-stud wall values and trace ownership, keeps
  lined-massive and triple-leaf boundaries outside the target, and
  selects Gate B bounded matrix or no-runtime closeout. No acoustic
  runtime values, formulas, output support, confidence, or evidence
  tiers changed.
- **2026-04-28 update**: `wall_double_leaf_sharp_davy_scoping_v1`
  Gate B landed no-runtime. It pins the bounded current-value/source-
  tolerance matrix for empty double-leaf, porous double-leaf, explicit
  single-stud, and explicit double-stud routes, blocks value movement
  because no source/tolerance evidence exists, and selects Gate C
  closeout / next-slice selection.
- **2026-04-28 update**: `wall_double_leaf_sharp_davy_scoping_v1`
  Gate C closed no-runtime and selected
  `wall_double_leaf_source_evidence_acquisition_v1`. The next step is a
  source/tolerance inventory for common double-leaf, single-stud, and
  double-stud wall assemblies before any runtime value movement.
- **2026-04-28 update**: `wall_double_leaf_source_evidence_acquisition_v1`
  Gate A landed no-runtime. It rejects generic empty/no-stud double-leaf
  movement, classifies Knauf W111 single-stud and W115 double-stud rows
  as bounded framed-wall reconciliation evidence, and keeps Quietstud,
  Davy, stud-type, exact/catalog, timber, single-leaf, CLT, and
  triple-leaf contexts out of immediate runtime import. Gate B must
  reconcile those bounded rows or close no-runtime.
- **2026-04-24 update**: floor continuation, floor many-layer, floor
  layer-order, and all-caller invalid-thickness audits closed
  no-runtime; engine thickness validity moved out of partial, and
  `dynamic_airborne_split_refactor_v2` was selected for the remaining
  C6 architecture hygiene debt. Gate A landed no-runtime; Gate B first
  carve moved the micro-gap equivalence guard with composer injection;
  Gate B second carve moved the heavy unframed cavity cap; Gate B third
  carve moved the mixed security-board double-stud field trim; Gate B
  fourth carve moved the high-fill single-board stud field lift; Gate B
  fifth carve moved the mixed-board empty-cavity field lift; Gate B sixth
  carve moved the mixed premium split field lift; Gate B seventh carve
  moved the diamond-hybrid resilient field trim; Gate B eighth carve
  moved the mixed-plain moderate template guard; Gate B ninth carve
  moved the premium single-board field correction; Gate B tenth carve
  moved the single-leaf masonry monotonic floor guard; Gate B eleventh
  carve moved the narrow heavy double-leaf gap cap.
- **Iteration 1 (2026-04-21)**: initial draft with 10 strategic moves
  and completion signals.
