import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readUpstreamSnapshot } from "./acoustic2";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function main() {
  const snapshot = readUpstreamSnapshot(process.argv[2]);
  const now = new Date();
  const dateLabel = formatDate(now);
  const targetDir = path.resolve(process.cwd(), "docs/imports");
  const filePath = path.join(targetDir, `${dateLabel}-acoustic2-import-note.md`);

  mkdirSync(targetDir, { recursive: true });

  const body = `# Acoustic2 Import Note\n\n` +
    `- Date: ${dateLabel}\n` +
    `- Upstream path: \`${snapshot.path}\`\n` +
    `- Upstream branch: \`${snapshot.branch}\`\n` +
    `- Upstream commit: \`${snapshot.head}\`\n` +
    `- Upstream working tree dirty: ${snapshot.statusLines.length > 0 ? "yes" : "no"}\n\n` +
    `## Scope\n\n` +
    `Describe the exact behavior intended for import here.\n\n` +
    `## Files Reviewed\n\n` +
    `- \n\n` +
    `## Behavior Added Or Changed\n\n` +
    `- \n\n` +
    `## Known Deviations From Upstream\n\n` +
    `- \n`;

  writeFileSync(filePath, body, "utf8");
  console.log(filePath);
}

main();

