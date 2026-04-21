# Calculator Master Plan

Last reviewed: 2026-04-21
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

## 3. Implementation State Grid (2026-04-21)

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

Engine benchmark tests and workbench preset tests sometimes produce
different `Rw` for the same physical stack because presets run without
an injected `airborneContext` while benchmarks use an explicit
`LAB_MASONRY_CONTEXT` (or similar). This context gap is a real
accuracy issue surfaced by the 2026-04-21 plan review — see the
"⚠️ Wall preset context gap" row in the cross-cutting table below.

| Family | Status | Evidence |
|---|---|---|
| Concrete double-leaf (`concrete_wall` preset) | 🟠 Screening | 4-layer migration-safe composition in `preset-definitions.ts`; `wall-full-preset-contract-matrix` proves screening-only posture (no `C` in lab mode) |
| AAC single-leaf (`aac_single_leaf_wall` preset) | 🟡 Formula | `wall-preset-expansion-benchmarks` pins Rw=45 under workbench default context; the engine benchmark `airborne-verified-catalog.ts` → `xella_ytong_d700_150_plaster10_official_2026` pins Rw=47 under `LAB_MASONRY_CONTEXT`. 2 dB context gap within benchmark tolerance (±2.5 dB) but not benchmark-matching |
| Masonry brick (`masonry_brick_wall` preset) | 🟡 Formula | `wall-preset-expansion-benchmarks` pins Rw=47 under workbench default context; the engine benchmark `airborne-masonry-benchmark` → `wienerberger_porotherm_100_dense_plaster_primary_2026` expects Rw=43 with ±1 dB. **4 dB over-statement** — the preset path is not benchmark-backed under its current context |
| CLT wall (`clt_wall` preset) | 🟡 Formula | `wall-preset-expansion-benchmarks` pins Rw=40 under workbench default context; no exact CLT wall catalog row exists today |
| Light-steel stud (LSF) | ⚪ Not yet covered | `airborne-framed-wall-benchmark.test.ts` benchmarks the engine path; preset surface is blocked by the `airborneContext.studType` injection gap |
| Timber stud | ⚪ Not yet covered | Same blocker as LSF |
| Wall selector families (double-leaf, lined-massive, AAC boundary, G5 sibling, heavy-core trim, lab double-stud) | 🟡 Family | Pinned as narrative labels in `dynamic-airborne-wall-selector-trace-matrix.test.ts` and `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`; engine family IDs are `double_leaf`, `lined_massive_wall`, etc. |
| Deep-hybrid swap corridors (`heavy_core`, `aac_d700_100`, `aac_d700_120`, `aac_g5`) | 🟡 Family | Each pinned in its own `dynamic-route-deep-hybrid-swap-*.test.ts` file |
| Wall hostile-input matrix | ⚪ Not yet covered | Floor analog `raw-floor-hostile-input-*-matrix.test.ts` exists; wall does not |
| Wall reorder invariance | ⚠️ Known bug | Asymmetric stacks show C-availability flip on reversal; 2026-04-20 probe evidence in `SYSTEM_AUDIT_2026-04-20.md` finding 9 |
| Wall field continuation per corridor | 🟡 Family (partial) | `wall-full-preset-contract-matrix.test.ts` covers every wall preset under lab / apparent-field / building contexts; completeness across every defended corridor × every field output has not been audited |

**Wall assessment:** breadth improved (4 presets), but depth gaps and
accuracy concerns remain. The preset context gap (AAC 2 dB, masonry
4 dB) means the newly-landed presets are not yet benchmark-backed at
the preset surface. Gaps are runnable: no source-blocking, mostly
engine/workbench work.

### Cross-cutting

| Concern | Status | Evidence |
|---|---|---|
| Floor hostile-input matrix | 🟢 Exact | `raw-floor-hostile-input-answer-matrix.test.ts` + `raw-floor-hostile-input-route-card-matrix.test.ts` |
| Wall hostile-input matrix | ⚪ Not yet covered | To land in master-plan step 4 |
| Engine thickness validity | 🟡 Partial | Workbench `normalize-rows` emits warnings on invalid thickness; engine-level direct guard (for API/CLI callers that bypass normalization) absent |
| Many-layer (50+) stability | ⚪ Informal only | 2026-04-20 probe verified 50 identical / 50 mixed wall stacks complete without crash; probe file deleted; no pinned regression guard exists |
| Reorder output-set invariance | ⚠️ Known bug | Asymmetric wall stack finding 9 in `SYSTEM_AUDIT_2026-04-20.md`; no reorder invariance matrix exists yet |
| Wall preset context gap | ⚠️ Known bug | Presets do not inject `airborneContext` on load; masonry preset is 4 dB over benchmark and AAC preset 2 dB under benchmark due to this gap. Closure: master-plan step 2 |
| `dynamic-airborne.ts` size | ⚪ Hygiene debt | 6630 lines; split deferred to master-plan step 7 unless step 1 forces it earlier |

### How to keep this grid honest

Every closeout slice must either add a row, flip a row's status, or
confirm no grid row changes. The grid becomes stale if a slice lands
without updating it. Drift prevention: §9 cross-reference rule plus a
planned executable test in master-plan step 10 that asserts the grid
rows match engine reality.

---

## 4. Next Moves (ROI-Ranked)

Five candidate directions were weighed on 2026-04-21. Ranking by
mission fit (coverage + accuracy, no accuracy compromise), scope,
user-visible impact, and risk:

| # | Candidate | Coverage | Accuracy | Scope | Risk | Selected |
|---|---|---|---|---|---|---|
| A | Reorder output-set consistency (audit finding 9) | neutral | + | 1-2 d | low | ★ active next |
| B | Preset airborneContext injection — also closes the 2-4 dB benchmark gap (§3 grid ⚠️) + unblocks LSF / timber stud presets | ++ | ++ | 1-2 d | medium | step 2 |
| C | Wall formula family widening (mass-law / Sharp / Davy) | ++ | + | 2-3 d | medium | conditional step 8 |
| D | `dynamic-airborne.ts` split | neutral | neutral (enabler) | 2-3 d | high | conditional step 7 |
| E | Engine-level hostile thickness guardrail | neutral | + | 0.5 d | very low | step 5 |

**Why A is selected as step 1, not B or C:**

1. A has a concrete observed bug; B and C start from speculation.
2. A reveals engine internals (`RwC` derivation) before we build more on
   them. B and C may turn out to be unnecessary once A's probe
   deepening is done.
3. A protects user trust: "dragging a layer changes which outputs I can
   compute" is exactly the kind of non-determinism that erodes
   confidence in acoustic software.
4. A's test infrastructure (reorder invariance matrix) stays useful as
   a guardrail for every later wall and floor slice.

**Why not reorder C for accuracy?** Because A's scope is bounded and B
unlocks coverage without engine changes once A lands; doing A first
lets B's airborneContext work build on a deterministic foundation.

### The Master Sequence (ten moves)

Each move is a slice or tight slice group. Each has an explicit closure
signal — the test that must be green to call it done.

| # | Slice | What closes it |
|---|---|---|
| 1 | `wall_reorder_output_set_consistency_v1` | `wall-reorder-invariance-matrix.test.ts` green across symmetric + asymmetric topologies |
| 2 | `preset_airborne_context_injection_v1` | Presets carry an optional `airborneContext` that the workbench injects on load; `preset-context-injection-matrix.test.ts` proves (a) injected `studType` reaches the engine and produces LSF-tuned `Rw`, (b) the AAC and masonry presets run under `LAB_MASONRY_CONTEXT` equivalent and hit benchmark Rw within the ±1 dB masonry tolerance |
| 3 | `wall_preset_pack_2_v1` | LSF + timber stud + second-masonry presets pinned in `wall-preset-pack-2-benchmarks.test.ts` against named source rows |
| 4 | `wall_hostile_input_matrix_v1` | `raw-wall-hostile-input-answer-matrix.test.ts` + workbench route/card matrix mirror the floor discipline |
| 5 | `engine_thickness_guardrail_v1` | `hostile-thickness-input.test.ts` covers floor + wall × five invalid-thickness classes with defended fail-closed |
| 6 | `wall_field_continuation_completeness_v1` | Executable matrix across every defended wall corridor × field/building contexts × R'w / DnT,w / DnT,A with pinned status |
| 7 | `dynamic_airborne_split_refactor_v1` (conditional) | Post-refactor regression: zero test changes, zero `Rw` changes, file sizes ≤2000 lines |
| 8 | `wall_formula_family_widening_v1` (conditional) | Only if step 6 audit reveals a defendable gap; closes on positive/negative/precedence matrix per added lane |
| 9 | `mixed_floor_wall_edge_case_hardening_v1` | Cross-mode torture matrix extended with new wall corridors; existing mixed-mode tests stay green |
| 10 | `good_calculator_final_audit_v1` | All six completion signals in §8 hold; executable grid-consistency test passes |

Steps 7 and 8 are explicitly conditional — they land only if earlier
steps reveal they are needed.

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
- **Hostile-input matrices** — floor has them; wall lands in step 4.

### Test additions the master plan requires

| Test | Master-Plan Step | Rationale |
|---|---|---|
| `wall-reorder-invariance-matrix.test.ts` | 1 | Prove asymmetric stacks have identical output sets across order reversal |
| `preset-context-injection-matrix.test.ts` | 2 | Prove injected `airborneContext.studType` flows preset → engine and changes Rw as expected |
| `wall-preset-pack-2-benchmarks.test.ts` | 3 | Pin canonical Rw per new preset against named source row |
| `raw-wall-hostile-input-answer-matrix.test.ts` + workbench counterpart | 4 | Mirror the floor hostile-input discipline on walls |
| `hostile-thickness-input.test.ts` | 5 | Cross-cutting engine guardrail for invalid thickness classes |
| `wall-field-continuation-completeness-matrix.test.ts` | 6 | Every defended wall corridor × every field/building context × every field output pinned |
| `airborne-dynamic-split-regression.test.ts` | 7 (conditional) | Post-refactor: zero behavior change |
| `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` | 9 | Cross-mode torture extended to new wall corridors |
| `coverage-grid-consistency.test.ts` | 10 | Assert §3 grid rows match the engine's defended corridor list |

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
| C1 | Wall preset coverage ≥ 6 distinct archetypes, each benchmark-matching | `preset-definitions.ts` has ≥6 wall presets, and every preset that maps to an existing benchmark (`airborne-masonry-benchmark`, `airborne-aircrete-benchmark`, `airborne-verified-catalog`, `airborne-framed-wall-benchmark`) produces an `Rw` within that benchmark's tolerance under the preset's injected `airborneContext` |
| C2 | Every defended wall corridor has source-truth or benchmark fit audit | §3 grid wall section — no 🟡 Formula row without an engine benchmark link or explicit honesty note; no ⚠️ Known bug rows remain |
| C3 | Field continuation coverage complete | `wall-field-continuation-completeness-matrix.test.ts` + floor equivalent both green; every defended corridor × every field/building context × every field output has a pinned status |
| C4 | Hostile-input discipline | Floor + wall hostile-input matrices green; `hostile-thickness-input.test.ts` green |
| C5 | Reorder invariance | `wall-reorder-invariance-matrix.test.ts` + floor equivalent green across symmetric AND asymmetric topologies |
| C6 | Architectural hygiene | No engine file > 2000 lines without a split-deferred comment; inline comments on every non-obvious decision |

The `good_calculator_final_audit_v1` slice (step 10) exists to verify
all six signals explicitly with an executable checklist test.

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
- **Iteration 1 (2026-04-21)**: initial draft with 10 strategic moves
  and completion signals.
