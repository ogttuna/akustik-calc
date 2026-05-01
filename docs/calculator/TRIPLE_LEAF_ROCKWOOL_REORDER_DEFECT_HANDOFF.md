# Triple-Leaf Rockwool Reorder Defect Handoff

Document role: focused handoff for the user-reported rockwool placement
defect. Read this before continuing `wall_triple_leaf_accuracy_recovery_v1`
Gate G4 or any runtime movement for triple-leaf walls.

Current slice:

`wall_triple_leaf_accuracy_recovery_v1`

Current next file:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

Latest checkpoint:

[CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md](./CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md)

## User-Visible Symptom

The user supplied two generated PDFs for the same practical wall family:

- one stack had two `50 mm` rockwool layers adjacent;
- the other stack placed a `12.5 mm` gypsum board between the two
  rockwool layers.

Live engine behavior at the start of this slice:

- adjacent rockwool stack: `Rw 51`, family `double_leaf`, strategy
  `double_leaf_porous_fill_delegate`, medium confidence;
- split rockwool stack: `Rw 41`, family `multileaf_multicavity`,
  strategy `multileaf_screening_blend`, low confidence;
- field/building repro with line connection, light steel stud,
  `600 mm` spacing, `3.6 m x 2.8 m`, `45 m3`, `RT60 0.6 s`:
  `R'w 34`, `DnT,w 36`, still `multileaf_screening_blend`, low
  confidence.

The visible problem is the user's question: moving rockwool around in a
flat layer list caused an approximately `10 dB` change. That is too large
to present as an ordinary precise calculator answer without proving the
physical topology and source-owned model.

## Is This User Error?

No. Do not frame this as simple user error.

The user exposed a real model/input defect:

- if the two lists describe the same physical construction and only the
  flat order changed, the answer should be stable or the engine should
  identify the ambiguity;
- if the inserted gypsum board is really an internal leaf between two
  cavities, the construction is physically different and may suffer a
  large low-frequency loss, but the calculator must model it as
  triple-leaf / two-cavity physics, not as a hidden flat-list penalty;
- if the necessary topology is unknown, the calculator must ask for the
  missing topology or keep the result clearly blocked / low-confidence.

The current `multileaf_screening_blend` value is not a validated
triple-leaf calculation. It is allowed as a fail-closed screening
posture only; it must not be promoted into internal-use accuracy.

## Why It Must Be Fixed

The product goal is a high-accuracy acoustic calculator for company
internal use. A precise-looking unsupported value is dangerous here:

- `10 dB` is a major acoustic difference, not harmless UI noise;
- a consultant may treat the displayed `Rw`, `R'w`, or `DnT,w` as a
  design decision;
- triple-leaf systems can genuinely perform worse than double-leaf
  systems, especially around low-frequency mass-air-mass resonances;
- flat layer order does not contain enough information to know whether
  an internal board is independent, attached, bridged, or part of a
  different leaf.

Therefore the calculator must either calculate this family from owned
topology + source-calibrated physics, or fail closed with explicit
diagnostics.

## Correct Solution Shape

The fix is not a hard-coded `+10 dB` correction and not a broad retune of
`multileaf_screening_blend`.

The correct path is:

1. Classify whether the wall is double-leaf, triple-leaf / two-cavity,
   or unknown.
2. Require grouped topology for triple-leaf walls:
   `sideALeaf`, `cavity1`, `internalLeaf`, `cavity2`, `sideBLeaf`,
   `internalLeafCoupling`, and `supportTopology`.
3. Use source-owned one-third-octave TL curves, not direct `Rw` guessing.
4. Fit/calibrate only a bounded source family with holdout rows and
   negative boundaries.
5. Separately decide whether local materials map into that source
   family.
6. Integrate runtime only when engine tests and web-visible tests prove
   the behavior.
7. If any part is missing, keep `multileaf_screening_blend`
   low-confidence and show what is missing.

## What Has Already Landed

Gate A:

- reproduced the adjacent vs split rockwool behavior;
- confirmed existing advanced fields are not enough topology;
- kept runtime frozen.

Gate B:

- defined grouped triple-leaf topology input requirements;
- established missing-field / fail-closed policy;
- kept runtime frozen.

Gate C:

- researched triple-leaf physics and standards;
- identified NRC 2024 as the primary internal-board double-stud source;
- kept runtime frozen.

Gate D / E:

- extracted/classified source-pack candidates;
- protected negative boundaries;
- kept runtime frozen.

Gate F:

- added a research-only three-leaf / two-cavity frequency-band solver
  skeleton;
- kept runtime frozen.

Gate G:

- defined tolerance: at least two calibration rows, at least one holdout
  row, MAE `<= 2 dB`, max error `<= 4 dB`, dip band within one adjacent
  one-third-octave band;
- kept runtime frozen.

Gate G2 / G2B:

- digitized NRC 2024 Figure 4 / Figure 5 into QC-passed
  one-third-octave TL curves;
- derived local STC/Rw for Type C and assemblies A-D as `64/63`,
  `64/58`, `60/49`, `57/51`, and `65/55`;
- assigned A/B as calibration, D as holdout, C as separate fill-regime
  context;
- kept runtime frozen.

Gate G3:

- fit an NRC-like source-family model and passed calibration/holdout;
- protected ordinary double-leaf, simple-stud, lined-masonry /
  one-side-lining, missing-curve/topology, floor/impact, and field-only
  negatives;
- kept runtime frozen because local material mapping is not owned.

## Current Blocker

The user stack contains local materials not automatically covered by
the NRC 2024 source family:

- local `rockwool` versus NRC glass-fiber batt;
- local `gypsum_board` versus NRC 12.7 mm Type C gypsum board;
- local `mlv`, absent from the NRC family;
- local `gypsum_plaster`, absent from the NRC family.

Gate G3 proves only the NRC-like source family. It does not prove the
user's exact stack. The live user split-rockwool repro still correctly
stays on low-confidence `multileaf_screening_blend` `Rw 41`.

## Next Agent Instructions

Continue with Gate G4:

`packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`

Gate G4 must decide, with executable tests:

- whether local `rockwool` can map to NRC glass-fiber batt for this
  bounded family;
- whether local `gypsum_board` can map to NRC Type C gypsum board or
  needs a distinct material;
- whether `mlv` and `gypsum_plaster` force the user stack to remain
  outside exact NRC-like runtime;
- whether grouped topology matches source-family assumptions closely
  enough for a bounded runtime candidate;
- whether the runtime path can select Gate H, or must remain blocked
  with missing-source / missing-material diagnostics.

Do not:

- retune `multileaf_screening_blend` to make the example look right;
- hard-code the user PDF combination;
- claim the `Rw 41` result is correct;
- claim the defect is fixed before local mapping and runtime integration
  land;
- promote field `R'w` / `DnT,w` before lab element curve ownership and a
  later field/ISO 12354 overlay policy exist.

## Acceptance Target

The final fix for this defect should make these cases explicit:

- same physical grouped topology with harmless flat-order edits must not
  jump by `10 dB`;
- genuine internal-leaf / two-cavity topology must calculate through a
  source-calibrated triple-leaf lane or remain blocked;
- missing coupling, cavity, support, or material mapping must produce a
  concrete diagnostic;
- adjacent double-leaf rows must stay in their existing double-leaf lane;
- hostile many-layer / reorder inputs must stay stable and fail closed
  instead of silently returning precise unsupported values.
