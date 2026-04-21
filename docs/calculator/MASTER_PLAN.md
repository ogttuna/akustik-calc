# Calculator Master Plan

Last reviewed: 2026-04-21
Iteration: 1 (initial draft — refine in session retrospectives)

This is the top-level roadmap for the DynEcho acoustic calculator. It
answers four questions for every agent opening the project cold:

1. What does "a good calculator" mean here, and what is the finish line?
2. Which axis (wall vs floor) deserves the next unit of work, and why?
3. What are the next ten strategic moves, in order?
4. How should tests, docs, and completion signals be wired so a new agent
   can pick up where the last one stopped without re-reading the whole
   history?

Read this before reading any slice plan. Slice plans say *what to do
next*; this plan says *why the next slice is the next slice*.

---

## 1. Definition Of Done

A good calculator is one that satisfies every item below. "Done" does not
mean productized (no billing, auth, multi-user, desktop app); it means
the acoustic calculation engine plus the workbench is a tool an acoustic
engineer can trust for realistic projects.

- **Coverage**: any realistic wall or floor layer combination (using the
  materials in the catalog) produces either a defended number or an
  honest fail-closed answer with a specific reason. No silent garbage.
- **Accuracy**: every defended number is tied to a source — exact
  catalog row, official floor-system row, benchmark-backed family
  formula, or predictor-backed family estimate. The output-origin trail
  shows the path.
- **Corner-case resilience**: stacks with 50+ layers, reordered layers,
  partial hostile input, missing context — none can make the engine
  crash, emit `NaN`, or produce a number without the matching
  provenance.
- **Deterministic surfaces**: the same physical stack produces the same
  output set regardless of layer order (for physically order-insensitive
  topologies) or produces a clear, labeled order-sensitive answer (for
  topologies where orientation is physically meaningful).
- **Test discipline**: every defended corridor is pinned in executable
  tests. Tests prove calculation correctness, not just "does the code
  run". Edge cases are covered by explicit matrices.
- **Doc/code sync**: every closed slice has a post-contract test. Living
  docs (CURRENT_STATE, NEXT_IMPLEMENTATION_PLAN, SOURCE_GAP_LEDGER) are
  authoritative for "where are we"; archived docs never override them.
- **Documentation readable by a new agent**: ~15 minutes of reading the
  living docs is enough to start executing the next slice.

The calculator is done when an acoustic engineer can load the workbench,
build any realistic wall or floor system, and see either the correct
numbers with source evidence or a specific reason why the stack is
outside current coverage.

---

## 2. Current State Snapshot (2026-04-21)

Broad validation green at the start of this plan:

- engine: `184/184` test files, `1021/1021` tests
- web: `132/132` test files, `715/715` tests
- lint, typecheck, build, whitespace: green

### Floor — deep coverage

Floor has multi-family coverage with source-backed pinning:

- UBIQ open-web (weak-band, supported-band, carpet bound, packaged
  finish families)
- Knauf timber (direct mount, acoustic mount, bare timber)
- Heavy concrete (Annex C family)
- Reinforced concrete (low-confidence corridor frozen as closeout
  evidence)
- Dataholz CLT (source-truth audit, calibration tightening pinned on
  GDMTXA04A visible estimate cap, consultant-trail + diagnostics-
  dossier surfaces now live)
- Raw terminal-concrete helper lane (widening, split-topology, partial-
  order matrices)
- TUAS / Pliteq / Regupol / Getzner spot coverage

Floor tightening has diminishing returns — most slack has been pinned.

### Wall — breadth expanding, depth still shallow

Wall now has:

- 4 presets (concrete_wall, aac_single_leaf_wall, masonry_brick_wall,
  clt_wall), three of them benchmark-backed and non-screening
- 6 defended engine corridors (clear double-leaf, AAC boundary, clear
  lined-massive, G5 sibling, heavy-core trim, lab double-stud)
- Framed wall benchmark coverage (Knauf LSF, double-stud)
- Masonry / aircrete / composite airborne benchmark suites
- Wall selector trace/card matrices

Wall depth gaps:

- Preset surface cannot inject `airborneContext.studType` — LSF and
  timber stud presets are blocked until the preset-to-context wiring
  lands
- Asymmetric light-heavy stacks have a reorder C-availability
  inconsistency (same Rw, different supported output set)
- Wall hostile-input matrix exists only informally (probe-verified but
  not pinned as a regression guard)
- Wall field continuation (DnT,w, R'w, DnT,A) coverage is uneven across
  corridors

### Fail-closed candidates (deliberately blocked)

These stay blocked until new source evidence appears:

- `dataholz_gdmtxa04a_visible_exact_reopen` — composite dry-screed
  surface modeling
- `tuas_c11c_exact_import` — combined wet tuple anomaly
- `raw_bare_open_box_open_web_impact_widening` — packaged-only source
  evidence
- `wall_selector_behavior_widening` — no fresh classified red

---

## 3. Next Axis: Wall

**Wall first, not floor.** Reasons, weighted by mission fit:

1. Floor depth is high; marginal floor tightening gains diminishing
   returns. Most remaining floor slices are source-blocked (waiting on
   new lab data, not engine work).
2. Wall breadth is now adequate (4 presets) but wall depth is not. A
   user building a realistic wall can hit gaps that do not occur on
   floor: reorder inconsistency, missing LSF context, uneven field
   continuations.
3. Wall expansion is runnable today with existing engine benchmarks
   (Knauf LSF, Xella AAC, Wienerberger masonry, Celcon aircrete). No
   external research dependency blocks the next three wall slices.
4. The stated product mission weighs coverage and accuracy equally —
   wall depth work advances both axes simultaneously, while floor
   tightening advances only accuracy.

Floor work re-enters the priority queue when one of:
- a new source-backed floor family lands externally (new lab dataset),
- a floor regression appears (any defended corridor goes red), or
- wall coverage reaches parity with floor and there is no higher-ROI
  wall slice available.

---

## 4. The Next Ten Strategic Moves

Each step is a logical slice or slice group. Details live in each
slice's own plan document when the slice becomes active.

1. **Reorder output-set consistency** — fix the C-availability flip on
   asymmetric light-heavy stacks so layer order never changes which
   outputs are available. (active, selected)
2. **Preset airborneContext injection** — open the preset surface to
   `airborneContext.studType`. Unblocks LSF and timber stud presets.
3. **Wall preset pack 2** — add `light_steel_stud_wall`, `timber_stud_wall`,
   and a second masonry archetype (HELUZ / Silka CS) with benchmark-
   pinned Rw per context.
4. **Wall hostile-input matrix** — formally pin the hostile-input
   behavior probed informally on 2026-04-20. Floor has this; wall
   should match.
5. **Engine-level thickness / layer-count guardrail** — cross-cutting
   tests for `thicknessMm: 0 | -N | NaN | Infinity | non-numeric` and
   50+ layer stacks. Defends both floor and wall.
6. **Wall field continuation completeness audit** — for every defended
   wall corridor, verify `R'w`, `DnT,w`, `DnT,A` resolve predictably
   under field and building contexts. Close any gap with a pinned
   corridor test.
7. **`dynamic-airborne.ts` architectural split** — 6630-line file broken
   into family-detection, predictor-scoring, helpers. Landed as a
   dedicated no-runtime refactor once the wall work above makes the
   internal seams obvious.
8. **Wall formula family widening — conditional** — if the audit in
   step 6 shows gaps the generic airborne calculator does not cover,
   add explicit mass-law / Sharp / Davy lanes. If the generic lane
   already covers realistic cases, skip this step and document why.
9. **Mixed floor/wall edge-case hardening** — shared boundary
   conditions: horizontal partitions, vertical-to-horizontal
   transitions, cross-mode workbench detours. Probably one slice, not
   many.
10. **Final "good calculator" audit and sign-off** — comprehensive
    regression matrix, accuracy benchmark sweep against all landed
    catalog entries, explicit coverage ledger listing every supported
    topology and every fail-closed candidate with reason. If this
    audit produces zero new critical findings, the calculator is done.

Steps 1-3 are high confidence. Steps 4-6 depend on what step 1 reveals.
Step 7 is scheduled but its exact shape depends on steps 1 and 6.
Step 8 may be skipped entirely. Steps 9-10 are endgame.

---

## 5. Test Strategy

Tests are the primary correctness artifact. Adding a slice without a
test that would fail without that slice does not count as progress.

### Test tiers currently in use

- **Source-truth audits** — pin exact catalog values (Rw, Ln,w,
  RwCtr, CI, CI50-2500, Ln,w+CI). Example:
  `dataholz-clt-source-truth-audit.test.ts`.
- **Benchmark fit audits** — pin expected values per a known dataset
  with explicit tolerance. Examples:
  `airborne-framed-wall-benchmark.test.ts`,
  `airborne-aircrete-benchmark.test.ts`.
- **Corridor guard matrices** — pin positive topology matches and
  explicit fail-closed negatives. Example:
  `raw-terminal-concrete-helper-widening-matrix.test.ts`.
- **Route/card matrices** — pin workbench-side output card status,
  tone, provenance wording. Example:
  `dataholz-clt-source-truth-route.test.ts`.
- **Post-slice contracts** — pin "what closed, what got selected next"
  so the chain is readable. Pattern: `post-*-next-slice-selection-contract.test.ts`.
- **Hostile-input matrices** — floor has them; wall will match in
  step 4.

### Test additions this master plan requires

- **Reorder invariance matrix** (step 1) — same materials in every
  legal order produce the same supportedOutputs for topologically
  order-insensitive stacks; explicit order-sensitive stacks produce a
  labeled order-dependent answer.
- **Preset context matrix** (step 2) — preset + injected
  airborneContext produces the expected Rw within a stated tolerance
  against the benchmark dataset.
- **Wall preset benchmark fit tests** (step 3) — each new preset pinned
  against its benchmark source row.
- **Wall hostile-input matrix** (step 4) — mirrors
  `raw-floor-hostile-input-answer-matrix.test.ts` for walls.
- **Engine hostile-thickness test** (step 5) — cross-cutting guard.
- **Wall field continuation completeness matrix** (step 6) — every
  corridor × every field output × every context produces a pinned
  status (live / unsupported / needs_input).
- **Coverage ledger test** (step 10) — an executable test asserting
  the coverage ledger list matches the list of defended corridors, so
  the ledger cannot silently drift from the engine.

### Tests we do not add (explicit non-goals)

- Tests that only measure "does the code run" without measuring
  correctness. Every test must have an explicit assertion on a value
  or a state.
- Tests that duplicate an existing benchmark. If a value is already
  pinned in `airborne-aircrete-benchmark`, do not pin it again in
  `aac_preset_benchmark` — the second test just has to confirm the
  preset routes through the already-pinned benchmark path.

---

## 6. Documentation Organization

For a new agent, "where am I" should resolve from three docs:

- `docs/calculator/CURRENT_STATE.md` — the current snapshot (what
  closed, what is selected, what is frozen, latest validation status).
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` — the current slice
  detail (how to execute what CURRENT_STATE points at).
- `docs/calculator/MASTER_PLAN.md` (this file) — why the current slice
  is the current slice, and what comes after.

Supporting documents:

- `docs/calculator/SYSTEM_AUDIT_2026-04-20.md` — findings that feed
  the master plan.
- `docs/calculator/WALL_COVERAGE_EXPANSION_PLAN.md` — the wall program
  tracked across multiple slices (steps 2-6 of the master plan).
- `docs/calculator/SOURCE_GAP_LEDGER.md` — source-backed and deferred
  families ledger.
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md` — answer-
  origin meaning and how evidence tiers compose.
- `docs/calculator/SYSTEM_MAP.md` — end-to-end runtime boundaries.

Historical checkpoint handoffs stay under `docs/calculator/CHECKPOINT_*`
and `docs/archive/`. They inform history but never override the living
docs above.

### Cross-reference rule

Any doc that implies "we are working on X" must link to CURRENT_STATE.md
and MASTER_PLAN.md. Any doc that lists slices must link to its slice
plan or say "see slice's own plan when it becomes active". This rule is
how the next agent finds the root of the current work without searching.

### Doc freshness rule

Every slice closeout must update:
1. `CURRENT_STATE.md` (active slice moved, validation recorded)
2. `NEXT_IMPLEMENTATION_PLAN.md` (Now + Current Position + Selected
   Next Slice sections)
3. The corresponding post-contract test (executable closure record)
4. The relevant program plan doc (this one, WALL_COVERAGE_EXPANSION_PLAN,
   or SOURCE_GAP_LEDGER) depending on what the slice touched

Skipping any of the four is how drift restarts.

---

## 7. Signals That Say "We Are Approaching Done"

These are objective signals, not vibes. If all six hold, the calculator
is done.

1. **Wall preset coverage**: at least 6 presets across distinct family
   archetypes (single-leaf masonry, single-leaf AAC, mass-timber CLT,
   light-steel stud, timber stud, heavy concrete lined-massive).
2. **Wall corridor coverage**: every defended corridor has a
   source-truth audit or a benchmark fit audit. No corridor lives
   purely on a route/card matrix without underlying benchmark
   evidence.
3. **Field continuation coverage**: every wall and every floor corridor
   has a defended `R'w`, `DnT,w`, and `DnT,A` path (or an explicit
   fail-closed reason) under both `field_between_rooms` and
   `building_prediction` contexts.
4. **Hostile-input discipline**: both floor and wall have dedicated
   hostile-input matrices, and the cross-cutting engine thickness
   guardrail is landed.
5. **Reorder discipline**: reorder invariance matrix proves
   symmetric stacks produce identical output sets across every legal
   permutation, and order-sensitive stacks produce labeled answers.
6. **Architectural hygiene**: no engine file exceeds 2000 lines
   without an explicit split-deferred note in docs, and every non-
   obvious decision (priority ordering, cap values, tolerance bands)
   has an inline comment explaining *why*.

The final "good calculator" audit in step 10 verifies these six
signals explicitly.

---

## 8. Open Questions This Plan Defers

- Which wall formula families are genuinely missing vs. already covered
  by the generic airborne calculator? Resolved in step 6 audit.
- Does `dynamic-airborne.ts` split happen before or after the wall
  formula widening? Resolved after step 1 reveals how derivation is
  structured.
- Are masonry and composite-panel archetypes extensible with the
  existing catalog, or do they need a `wall-systems/` catalog folder?
  Resolved in step 3 when the second masonry preset lands.
- When does desktop-app / SaaS productization enter the roadmap? Out
  of scope for this plan — this plan only defines a good calculator,
  not a product.

---

## 9. How To Resume From This Plan

New agent opens the project:

1. Read `docs/calculator/CURRENT_STATE.md` (≤5 min). Learn what just
   closed and what is selected.
2. Read `docs/calculator/MASTER_PLAN.md` (this file, ≤5 min). Learn
   why that selection is right.
3. Read `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` §Now and
   §Selected Next Slice (≤5 min). Get the tactical detail.
4. Run `pnpm calculator:gate:current`. Confirm green baseline.
5. Start the active slice.

If any of those four docs says something different, the agent stops
and flags the drift. That is how we avoid restarting the doc-drift
problem documented in this session's audit.
