export type CliArgs = Record<string, string | boolean>;

export function parseCliArgs(argv: readonly string[]): CliArgs {
  const args: CliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

export function getStringArg(args: CliArgs, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" ? value : undefined;
}

export function hasFlag(args: CliArgs, key: string): boolean {
  return args[key] === true;
}

export function requireStringArg(args: CliArgs, key: string, usage: string): string {
  const value = getStringArg(args, key);

  if (!value) {
    throw new Error(usage);
  }

  return value;
}
