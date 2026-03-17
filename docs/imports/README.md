# Import Notes

This folder stores import notes for upstream adoption work.

Rules:

- Upstream source remains `/home/ogttuna/Dev/Machinity/Acoustic2`
- That repo is read-only from the perspective of this project
- Every import note should reference an exact upstream commit SHA
- Any intentional divergence must be described in the note

Generate a new note template with:

- `pnpm upstream:note`

Generate an inventory snapshot with:

- `pnpm upstream:inventory`
- `pnpm upstream:refresh-workbench`

Run read-only estimate comparison tooling with:

- `pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100"`
- `pnpm upstream:compare`
