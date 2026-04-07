# Import Notes

Use this folder for upstream adoption notes and import inventory artifacts.

## Rules

- Upstream source is `/home/ogttuna/Dev/Machinity/Acoustic2`
- That repo is read-only from the perspective of this project
- Every import note must reference an exact upstream commit SHA
- Any intentional divergence must be written down in the note

## Common Commands

- Create a new import note template: `pnpm upstream:note`
- Generate an inventory snapshot: `pnpm upstream:inventory`
- Refresh the workbench-facing inventory: `pnpm upstream:refresh-workbench`
- Run a read-only estimate check: `pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100"`
- Run the broader read-only comparison pass: `pnpm upstream:compare`
