# Calculator Comprehensive Accuracy Roadmap

Status: ROADMAP, not an active implementation slice.

Current handoff note 2026-04-29:
`internal_use_operating_envelope_v1` closed no-runtime at Gate C and
selected `calculator_source_pack_readiness_triage_v1`; source-pack
readiness then selected CLT / mass-timber extraction for no-runtime row
and metric inspection; CLT / mass-timber Gate C closed no-runtime
because no metric-mapping or formula-tolerance path was ready. Internal
acceptance rehearsal and pilot handoff then closed no-runtime.
`calculator_source_intake_backlog_cleanup_v1` Gate A landed that clean
prerequisite map in
[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md).
Gate C then closed the cleanup slice no-runtime and selected
`generated_floor_fallback_topology_delta_v1` because every source
family remains `runtimeImportReadyNow: false`, while Pliteq exact and
UBIQ INEX / FL-32 bound floor topologies can be delta-mapped without
runtime movement. That generated-floor Gate A has now landed
no-runtime: the live fallback is still low-confidence/screening, exact
Pliteq and UBIQ FL-32 bound precedence still require source topology,
and Gate C closeout is next because no source-ready runtime candidate
was found. Gate C then closed the topology-delta slice no-runtime and
selected `calculator_source_gap_revalidation_v4` to re-rank current
source/accuracy candidates before more runtime or productization work.
v4 Gate A then selected
`knauf_wall_systems_source_pack_extraction_v1` no-runtime because
Knauf UK/AU wall-system source locators are concrete enough for table
locator extraction, while still not import-ready. Knauf Gate A then
extracted locator rows no-runtime and selected Gate B
mapping/tolerance decision. Knauf Gate B then landed no-runtime and
blocked every extracted row from runtime import or visible promotion
because topology / material mapping / metric policy / tolerance /
visible-test ownership is still incomplete; Gate C closeout is next.
This roadmap remains the long-horizon source-gated accuracy context; it
is not a runtime import approval.

## Purpose

This document tracks the longer program required before DynEcho can be
described as very comprehensive and correct across essentially every
reasonable floor/wall calculation.

The current calculator is much closer to internal pilot use than to this
bar. The gap is mostly source-gated, not ordinary implementation churn:
several common families already produce honest low-confidence,
screening, formula, or fail-closed answers, but they cannot become
defended high-confidence lanes without direct source rows or bounded
formula/tolerance owners.

## Completion Bar

The comprehensive accuracy bar is met only when every common realistic
family does one of the following:

- lands on an exact/source row;
- lands on a benchmark-backed formula with corridor-specific tolerance;
- lands on a formula/family estimate with explicit evidence owner and
  bounded tolerance;
- fails closed with a specific reason.

No defended output may rely on a nearby green test, adjacent material
row, floor-only wall proxy, product-delta row, or undocumented generic
blend.

## Source-Gated Families

| Family | Current posture | Unlock needed |
|---|---|---|
| timber double-board stud wall | formula-owned, low-confidence | direct double-board timber topology row or bounded formula/tolerance owner |
| CLT / mass-timber wall | formula-owned, medium-confidence | wall-specific CLT/NLT/DLT row pack or laminated-leaf tolerance owner |
| lined-massive / heavy-core wall | screening | wall-specific lined concrete/heavy masonry row or bounded lining rule |
| no-stud double-leaf wall | formula-owned/source-blocked | no-stud/no-rail direct row mapping or Davy/Sharp tolerance owner that matches local inputs |
| generated floor fallback | low-confidence/screening | exact Pliteq/UBIQ topology match or bounded steel/open-web family rule |
| `GDMTXA04A` visible exact reopen | fail-closed | composite dry-screed surface model with source-equivalent topology |
| `C11c` exact import | fail-closed | correction evidence for the anomalous combined wet tuple |
| raw bare open-box/open-web impact | fail-closed | bare carrier impact data, not packaged-system rows |

Current cross-family prerequisite map:
[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md).
Use it before opening any source-gated runtime slice.

## Candidate Source Intake

Candidate sources found during the 2026-04-28 planning pass:

- Knauf UK Drywall Systems Performance Guide, April 2026:
  `https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB`
- Knauf AU Systems+ Design Guide:
  `https://knauf.com/en-AU/knauf-gypsum/services/training/systems-plus`
- NRC Canada mass-timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
- WoodWorks acoustically tested mass-timber assemblies inventory:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
- UBIQ INEX FLOOR fire/acoustic tables:
  `https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf`

These sources are not import approvals. Each future source slice must
extract:

- exact assembly topology;
- metric definitions (`Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, STC/IIC
  if conversion is proposed);
- lab vs field context;
- tolerance owner;
- material and thickness mapping to engine inputs;
- negative boundaries and near misses;
- expected engine and web test coverage.

## Recommended Program Sequence

### 1. Source-Pack Readiness Triage First - Closed No-Runtime

`internal_use_operating_envelope_v1` has closed.
`calculator_source_pack_readiness_triage_v1` Gate A then ranked source
packs and selected CLT / mass-timber for no-runtime extraction only.
CLT / mass-timber Gate A/B/C closed without runtime import: WoodWorks,
NRC, and Dataholz context stayed roadmap-only because exact row locators,
metric policy, tolerance ownership, and paired visible tests are not
ready.

Reason: the company can now use the explicit operating envelope, but
accuracy work still needs source-pack proof. No candidate should move
runtime, support, confidence, or evidence posture until it names exact
topology, metric owner, tolerance owner, protected negative boundaries,
and paired engine/web tests.

### 1b. Internal-Use Acceptance Rehearsal Before More Runtime Work

The active no-runtime slice is `internal_use_acceptance_rehearsal_v1`.
It should build a 10-20 scenario acceptance matrix over the current
operating envelope before another source-gated runtime attempt. This is
not a substitute for source evidence; it is a company-use readiness
check that keeps caveated, low-confidence, screening, unsupported, and
fail-closed behavior executable.

### 1c. Source-Ready Intake Backlog Cleanup - Closed No-Runtime

`calculator_source_intake_backlog_cleanup_v1` Gate A landed no-runtime.
It consolidates the timber double-board, CLT / mass-timber, no-stud
double-leaf, generated floor fallback, lined-massive / heavy-core, and
historical blocked-family prerequisites into
[SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md).
Gate C closed no-runtime because no source-ready pack with exact
topology, metric owner, tolerance owner, protected negative boundaries,
and paired visible tests is already available. It selected
`generated_floor_fallback_topology_delta_v1`.

### 1d. Generated Floor Fallback Topology Delta - Closed No-Runtime

`generated_floor_fallback_topology_delta_v1` Gate A mapped the live
generated floor fallback against Pliteq exact and UBIQ INEX / FL-32
bound floor topologies. It found only topology near misses: the live
fallback lacks the exact INEX/GenieMat/Pliteq ceiling and finish
topology, and it also lacks the UBIQ engineered-timber / no-fill bound
topology. Current fallback values, support, confidence, evidence,
route-card, output-card, proposal/report, and workbench-input behavior
therefore stayed frozen. Gate C closed this slice no-runtime and
selected `calculator_source_gap_revalidation_v4`.

### 1e. Calculator Source Gap Revalidation v4 - Closed No-Runtime

`calculator_source_gap_revalidation_v4` should re-rank the source-ready
backlog after the generated floor topology-delta closeout. It is not a
runtime import slice. It may select a runtime accuracy slice only if it
names exact topology, metric owner, tolerance owner, negative
boundaries, and paired engine/web visible tests before implementation
starts. Otherwise it should select a no-runtime source acquisition,
extraction, planning, or test-coverage slice that directly advances the
comprehensive accuracy bar.

Gate A has landed no-runtime and selected
`knauf_wall_systems_source_pack_extraction_v1`.

### 1f. Knauf Wall Systems Source Pack Extraction - Active No-Runtime

`knauf_wall_systems_source_pack_extraction_v1` has extracted Knauf UK
and Knauf AU wall-system table locators no-runtime. Gate B then
compared the extracted rows against the live implementation and found
no runtime-ready row. `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`,
`TTF30.2A`, and `MWI.2A` remain research tracks; `TO120.1A` remains a
negative boundary; `TSF120.1A` and `AAC.1A` remain adjacent context.
Gate C closeout is next. The slice must not import rows or promote
support, confidence, evidence, route-card, output-card, proposal/report,
or workbench input behavior unless a later contract names exact
topology, metric ownership, tolerance ownership, material mapping,
protected negative boundaries, and paired tests.

First implementation file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`

Latest implementation file:

`packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`

Next implementation file:

`packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

This slice is valuable because it can directly clarify timber
double-board stud walls, masonry-upgrade / lined-heavy adjacent
evidence, and steel-vs-timber negative boundaries without guessing from
nearby green tests.

### 2. Timber Double-Board Source Intake

Reopen timber double-board only when a live-stack-compatible row or
formula owner is available.

Minimum tests:

- current formula value pins stay stable until import;
- direct source row positive match;
- adjacent single-board/resilient rows stay adjacent;
- paired workbench card/report confidence label.

### 3. CLT / Mass-Timber Wall Source Intake

Reopen CLT wall only with wall-specific source data or a documented
laminated-leaf model.

Minimum tests:

- floor-only CLT rows remain negative boundaries;
- wall CLT row positive match;
- metric conversion is explicit if a source gives STC/IIC instead of
  ISO single numbers;
- report and route-card caveats remain visible.

### 4. Lined-Massive / Heavy-Core Wall Rule

Reopen the screening concrete/heavy-core lane only with wall-specific
lining data or a bounded lining rule.

Minimum tests:

- current screening route remains visible until promotion;
- wall-specific positive source/topology cases;
- floor-only CC60 or ceiling rows stay rejected as wall truth;
- field/building outputs preserve physical ordering and warnings.

### 5. Floor Fallback Family Rule

Reopen floor fallback only if a generated fallback stack can be mapped
to exact source topology or a bounded steel/open-web family rule.
The active generated-floor topology-delta slice is the prerequisite
mapping pass; it is not a promotion.

Minimum tests:

- current generated fallback stays low-confidence unless matched;
- exact Pliteq and UBIQ paths keep precedence;
- unsupported impact/low-frequency outputs stay unsupported;
- many-layer and layer-order behavior remains finite and explicit.

### 6. Historical Blocked Families

Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or
wall-selector behavior unless a future slice names new source evidence
that directly satisfies the closed blocker.

## Per-Slice Acceptance Template

Every comprehensive-accuracy slice must include:

- positive source/formula cases;
- negative adjacent cases;
- precedence checks against exact/bound rows;
- target output support and unsupported-output checks;
- confidence/evidence label checks;
- workbench route-card or report checks when user-visible behavior
  changes;
- doc updates to `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, and
  the relevant checkpoint.

## Non-Goals

This roadmap does not include billing, deployment, collaboration,
authorization, or proposal polish. Those belong to productization and
must not outrank calculator accuracy unless the user explicitly changes
priority.
