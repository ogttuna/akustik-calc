import { readUpstreamSnapshot } from "./acoustic2";

function main() {
  const snapshot = readUpstreamSnapshot(process.argv[2]);

  console.log(`Upstream path: ${snapshot.path}`);
  console.log(`Branch: ${snapshot.branch}`);
  console.log(`HEAD: ${snapshot.head}`);
  console.log("Working tree:");

  if (snapshot.statusLines.length === 0) {
    console.log("  clean");
    return;
  }

  snapshot.statusLines.forEach((line) => {
    console.log(`  ${line}`);
  });
}

main();

