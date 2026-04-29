# Calculator Comprehensive Accuracy Roadmap

Status: ROADMAP, not an active implementation slice.

Current handoff note 2026-04-29:
`internal_use_operating_envelope_v1` closed no-runtime at Gate C and
selected `calculator_source_pack_readiness_triage_v1`. This roadmap
remains the long-horizon source-gated accuracy context; it is not a
runtime import approval.

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

### 1. Source-Pack Readiness Triage First

`internal_use_operating_envelope_v1` has closed. Before new source
import work, run `calculator_source_pack_readiness_triage_v1` Gate A to
rank which source pack, if any, is ready for a bounded source-research
slice.

Reason: the company can now use the explicit operating envelope, but
accuracy work still needs source-pack proof. No candidate should move
runtime, support, confidence, or evidence posture until it names exact
topology, metric owner, tolerance owner, protected negative boundaries,
and paired engine/web tests.

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
