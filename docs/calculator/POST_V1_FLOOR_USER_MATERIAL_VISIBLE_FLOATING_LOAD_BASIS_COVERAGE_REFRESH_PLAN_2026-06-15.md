# Post-V1 Floor User-Material Visible Floating Load-Basis Coverage Refresh Plan - 2026-06-15

## Purpose

Re-probe the newly landed runtime owner:
`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`.

This is a narrow coverage refresh for the visible floating-floor load
basis derivation. It is not a broad source crawl, formula retune, UI
pass, or generic cleanup task.

## Required Checks

- Low-density visible floating floor without manual `loadBasisKgM2`
  still calculates `Ln,w 64.3`, `DeltaLw 24.4`, `L'n,w 66.3`,
  `L'nT,w 63.9`, and `L'nT,50 66.9`.
- Heavy visible floating floor without manual `loadBasisKgM2` still
  calculates `Ln,w 50.1`, `DeltaLw 24.4`, `L'n,w 52.1`, `L'nT,w 49.7`,
  and `L'nT,50 52.7`.
- Explicit `loadBasisKgM2` still overrides the derived `77.6 kg/m2`
  value.
- Missing dynamic stiffness and non-derivable load basis stay
  `needs_input`.
- ASTM `IIC` / `AIIC` remains unsupported unless exact ASTM band owner
  inputs are supplied through the separate route.

## Selected Next After Refresh

After this refresh lands, run a new ROI selection only if no runtime
owner is already physically ready. The selection must prioritize
calculator scope and accuracy over another no-runtime bookkeeping loop.

