# Source-Ready Intake Backlog

Status: Gate A artifact for `calculator_source_intake_backlog_cleanup_v1`.

Last reviewed: 2026-04-29.

This document is the single current backlog for source-ready calculator
accuracy work. It does not approve runtime imports, support promotion,
confidence promotion, evidence-tier promotion, route-card movement,
output-card movement, proposal/report copy changes, or workbench input
changes.

Runtime and visible behavior stay frozen until a future slice names:

- exact topology;
- metric owner and lab/field context;
- tolerance owner;
- material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine and web visible tests.

## Gate A Decision

`calculator_source_intake_backlog_cleanup_v1` Gate A lands as:

`gate_a_source_ready_intake_backlog_matrix_no_runtime`

Selected next file:

`packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`

Reason: every current source family is still blocked from runtime import.
The next bounded action is Gate C closeout / next-slice selection unless
a newly discovered source-ready pack satisfies all import prerequisites.

## Source Verification Notes

The following public source surfaces were checked during this planning
pass. They remain context only:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
- Knauf Australia Systems+ Design Guide:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
- WoodWorks Acoustically Tested Mass Timber Assemblies:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
- WoodWorks Mass Timber Fire and Acoustic Database:
  `https://www.woodworks.org/resources/mass-timber-fire-and-acoustic-design/`
- NRC Canada mass timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
- NRC Canada NLT addendum archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=9e3b39be-e0ed-415b-9649-3e7ec228f52c`
- UBIQ INEX FLOOR fire/acoustic tables:
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`
- Pliteq acoustic test data portal:
  `https://pliteqindustrial.com/acoustic-test-data/`
- Dataholz component catalogue:
  `https://www.dataholz.eu/en/`

These are valid intake locators, not source-ready runtime packs. A future
runtime slice must still extract rows, map metrics, define tolerance, and
write positive and negative tests.

## source_ready_intake_backlog_matrix

| Family | Current runtime posture | User-visible risk | Context source pointers | First missing requirement | Runtime import ready now |
|---|---|---|---|---|---|
| `clt_mass_timber_wall` | formula-owned, medium-confidence, source-gated | mass-timber wall result can look more source-backed than it is | WoodWorks tables/database, NRC mass-timber report and NLT addendum, Dataholz CLT floor rows as floor-only rejection context | exact wall table/report row plus STC/FSTC/ASTC/IIC to ISO `Rw` policy or explicit rejection | false |
| `timber_double_board_stud_wall` | formula-owned, low-confidence, source-gated | direct double-board timber stack can look over-precise | Knauf UK/AU timber and lining contexts, adjacent single-board and resilient-bar exact rows | direct live double-board timber row or bounded formula tolerance owner | false |
| `no_stud_double_leaf_wall` | formula-owned, source-blocked | no-stud/no-rail double-leaf formulas can be retuned without local tolerance | Davy/Sharp formula context, NRC context only | no-stud/no-rail direct row mapping or local Davy/Sharp single-number tolerance owner | false |
| `generated_floor_fallback` | low-confidence screening | generated steel/open-web fallback can overstate accuracy when deck/ceiling/support topology is missing | UBIQ INEX, Pliteq exact/bound rows, existing floor fallback contracts | exact Pliteq/UBIQ topology match or bounded steel/open-web family rule | false |
| `lined_massive_heavy_core_wall` | screening, no wall source or bounded lining rule | lined concrete/heavy-core wall values can be mistaken for source-backed wall truth | Knauf lining context and floor/ceiling adjacent rows | wall-specific lined concrete/heavy masonry row or bounded lining rule | false |
| `historical_blocked_families` | fail-closed | old exact imports can reopen from nearby green tests | `GDMTXA04A`, `C11c`, raw open-box/open-web, wall-selector historical contracts | new source evidence satisfying the original closed blocker | false |

## per_family_runtime_import_prerequisites

### `clt_mass_timber_wall`

Required before runtime import:

- exact CLT, NLT, DLT, or double-CLT wall row locator;
- source metric owner for STC/FSTC/ASTC/IIC versus ISO `Rw`, `R'w`,
  and `DnT,w`;
- row-level topology mapping for leaf thickness, board layers, cavity,
  resilient elements, insulation, and exposed/encapsulated surfaces;
- tolerance owner if a formula path is proposed;
- engine tests for positive row mapping and floor-only rejection;
- web route-card/report tests if value, support, confidence, or evidence
  wording changes.

Protected near misses:

- Dataholz CLT floor rows remain floor-only source truth.
- WoodWorks and NRC STC/ASTC contexts do not become ISO `Rw` truth by
  proximity.
- IIC remains impact context and does not support wall airborne outputs.

### `timber_double_board_stud_wall`

Required before runtime import:

- direct double-board timber stud row matching the live stack, or a
  bounded formula owner for the same stack class;
- explicit side count, board count, board material, cavity fill, stud
  coupling, and lining metadata;
- tolerance for lab and field/building outputs;
- engine tests for direct positive match and adjacent single-board /
  resilient-bar rejections;
- web visible tests for route-card confidence/evidence wording if the
  user-facing posture moves.

Protected near misses:

- single-board rows do not promote double-board routes;
- resilient-bar rows do not promote direct-connected timber routes;
- steel/LSF holdout rows do not become timber-stud truth.

### `no_stud_double_leaf_wall`

Required before runtime import:

- direct no-stud/no-rail row mapping, or a local Davy/Sharp tolerance
  owner tied to the engine input set;
- explicit cavity, porous fill, leaf mass, separation, coupling, and
  frequency-band assumptions;
- single-number `Rw`/field translation policy;
- negative tests for framed, railed, gypsum-block, and mass-timber
  adjacent cases;
- web visible tests if any route-card or report posture moves.

Protected near misses:

- framed double-leaf rows do not promote no-stud/no-rail rows;
- formula context does not justify value movement without local inputs
  and tolerance;
- NRC mass-timber context does not supply no-stud wall truth.

### `generated_floor_fallback`

Required before runtime import:

- exact source topology for deck, board, topping, resilient layer,
  ceiling, support, cavity, and lining, or a bounded family rule;
- metric owner for `Rw`, `R'w`, `DnT,w`, `Ln,w`, and `L'n,w` where
  applicable;
- precedence rules against existing exact and bound floor rows;
- unsupported-output policy for low-frequency impact outputs;
- engine and web tests for exact path, bound path, fallback path,
  many-layer, and reorder behavior.

Protected near misses:

- UBIQ/Pliteq rows do not apply unless the live stack topology matches.
- raw open-web and open-box impact stay fail-closed without true bare
  carrier data.
- `L'nT,50` remains unsupported unless source evidence names it.

### `lined_massive_heavy_core_wall`

Required before runtime import:

- wall-specific lined concrete or heavy-masonry source row, or a bounded
  wall lining rule;
- side-order and mounting metadata;
- lab/field/building metric owner;
- tolerance owner for screening to formula/source movement;
- engine and web tests for floor-only rejection and wall-specific
  positive cases.

Protected near misses:

- floor-only CC60 or ceiling rows do not become wall truth;
- presets do not promote source truth;
- old heavy-concrete parity checks do not reopen the route by
  themselves.

### `historical_blocked_families`

Required before runtime import:

- `GDMTXA04A`: composite dry-screed surface model with source-equivalent
  topology;
- `C11c`: raw one-third-octave impact spectrum or source correction /
  lab note explaining the anomalous combined wet tuple;
- raw open-box/open-web: true bare carrier impact evidence, not packaged
  systems;
- wall-selector: fresh classified wall defect or source truth, not a
  nearby green test.

Protected near misses:

- source schedules alone do not override closed blockers;
- adjacent package rows do not become bare carrier rows;
- historical fail-closed families stay closed until the original blocker
  is directly satisfied.

## stale_or_duplicate_source_doc_cleanup_notes

- `NEXT_IMPLEMENTATION_PLAN.md` remains the tactical authority.
- `CURRENT_STATE.md` remains the short state snapshot.
- `CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md` remains long-horizon
  strategy, not implementation permission.
- `SOURCE_GAP_LEDGER.md` remains historical and floor-dominant; this
  backlog is the current cross-family source-intake surface.
- Prior family plans and checkpoints remain useful evidence owners. Do
  not delete them unless a future cleanup proves a document is both
  misleading and superseded without unique evidence.
- New source candidates should be added here first, then linked from the
  roadmap or ledger only if they change the ranked next action.

No stale document currently needs deletion. The cleanup needed at Gate A
is consolidation and explicit cross-linking, not removal.

## negative_boundary_and_near_miss_register

- `GDMTXA04A`, `C11c`, raw open-box/open-web, heavy-concrete parity,
  reinforced-concrete reopen, wall selector behavior, timber-stud
  widening, and wall exact-row follow-ups must not reopen from nearby
  green tests.
- No candidate can move `runtimeImportReadyNow` to `true` inside Gate A.
- Context sources cannot promote support, confidence, evidence tier,
  API shape, route-card values, output-card statuses, proposal/report
  surfaces, or workbench inputs.
- Floor-only rows do not become wall rows.
- STC/FSTC/ASTC/IIC contexts do not become ISO `Rw`, `R'w`, or `DnT,w`
  outputs without explicit metric policy.
- Formula-owned or screening lanes do not become high confidence for
  pilot convenience.
- Exact/bound source rows keep precedence over generated fallback logic.

## next_candidate_selection_rules

1. Select a runtime accuracy slice only when exact topology, metric
   owner, tolerance owner, protected negative boundaries, and paired
   engine/web visible tests can be named before implementation starts.
2. Select a no-runtime extraction slice when a source locator is concrete
   enough to extract rows or metric policy but still lacks runtime
   prerequisites.
3. Select cleanup only when planning surfaces disagree or hide the first
   missing requirement.
4. Never select a low-confidence, screening, formula-owned, or
   source-gated lane for confidence/support promotion because it helps
   the internal pilot.

## Immediate Next Steps

1. Close `calculator_source_intake_backlog_cleanup_v1` at Gate C with
   no runtime movement unless a source-ready pack appears before the
   closeout.
2. In Gate C, choose the next slice from this backlog. The default
   honest follow-up is another no-runtime extraction/cleanup step, not
   a runtime import.
3. Keep all validation gates green:
   `pnpm calculator:gate:current`, targeted Gate A/Gate C contracts,
   `git diff --check`, and `pnpm check` when the release gate is needed.
