import { execInUpstreamRepo } from "./acoustic2";

export function runUpstreamJson<T>(script: string, explicitPath?: string): T {
  const output = execInUpstreamRepo(process.execPath, ["-e", script], explicitPath);

  if (!output) {
    throw new Error("Upstream command returned no output.");
  }

  try {
    return JSON.parse(output) as T;
  } catch {
    throw new Error(`Upstream command did not return valid JSON.\n\n${output}`);
  }
}
