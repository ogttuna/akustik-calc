import { readFileSync } from "node:fs";

const NEXT_PLUGIN_WARNING_PATTERNS = [
  /Your tsconfig\.json extends another configuration/,
  /we cannot add the Next\.js TypeScript plugin automatically/i,
  /we recommend adding the Next\.js plugin .* manually to your TypeScript configuration/i,
  /nextjs\.org\/docs\/app\/api-reference\/config\/typescript#the-typescript-plugin/
];

type ChildProcessWithPipes = {
  stderr?: NodeJS.ReadableStream | null;
  stdout?: NodeJS.ReadableStream | null;
};

export function hasExplicitNextPlugin(tsconfigPath: string): boolean {
  try {
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as {
      compilerOptions?: {
        plugins?: Array<{ name?: string }>;
      };
    };

    return tsconfig.compilerOptions?.plugins?.some((plugin) => plugin?.name === "next") ?? false;
  } catch {
    return false;
  }
}

export function wireNextPluginWarningFilter(
  child: ChildProcessWithPipes,
  suppressNextPluginWarning: boolean
): void {
  if (!suppressNextPluginWarning) {
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    return;
  }

  const forward = (stream: NodeJS.ReadableStream | null | undefined, writer: NodeJS.WriteStream) => {
    if (!stream) {
      return;
    }

    let buffer = "";

    stream.on("data", (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (NEXT_PLUGIN_WARNING_PATTERNS.some((pattern) => pattern.test(line))) {
          continue;
        }

        writer.write(`${line}\n`);
      }
    });

    stream.on("end", () => {
      if (buffer.length === 0) {
        return;
      }

      if (NEXT_PLUGIN_WARNING_PATTERNS.some((pattern) => pattern.test(buffer))) {
        return;
      }

      writer.write(buffer);
    });
  };

  forward(child.stdout, process.stdout);
  forward(child.stderr, process.stderr);
}
