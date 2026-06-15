import { spawn, type ChildProcess, type SpawnOptions } from "node:child_process";

const POSIX_TERMINATION_GRACE_MS = 1_500;
const PARENT_WATCH_INTERVAL_MS = 1_000;

const SIGNAL_EXIT_CODES: Partial<Record<NodeJS.Signals, number>> = {
  SIGHUP: 129,
  SIGINT: 130,
  SIGTERM: 143
};

type ManagedChildProcess = {
  child: ChildProcess;
  dispose: () => void;
  terminate: (signal?: NodeJS.Signals) => void;
};

type ManagedChildProcessOptions = SpawnOptions & {
  detachedProcessGroup?: boolean;
  label: string;
};

function isMissingProcessError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && (error as { code?: unknown }).code === "ESRCH");
}

function killProcessTree(input: {
  child: ChildProcess;
  detachedProcessGroup: boolean;
  label: string;
  signal: NodeJS.Signals | "SIGKILL";
}): void {
  const { child, detachedProcessGroup, label, signal } = input;

  if (!child.pid) {
    return;
  }

  try {
    if (process.platform === "win32" || !detachedProcessGroup) {
      child.kill(signal);
      return;
    }

    process.kill(-child.pid, signal);
  } catch (error) {
    if (!isMissingProcessError(error)) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[${label}] Failed to send ${signal} to child process tree: ${message}`);
    }
  }
}

export function getExitCodeForChildExit(code: number | null, signal: NodeJS.Signals | null): number {
  if (typeof code === "number") {
    return code;
  }

  if (signal && SIGNAL_EXIT_CODES[signal]) {
    return SIGNAL_EXIT_CODES[signal] ?? 1;
  }

  return 1;
}

export function spawnManagedChildProcess(
  command: string,
  args: readonly string[],
  options: ManagedChildProcessOptions
): ManagedChildProcess {
  const { detachedProcessGroup = process.platform !== "win32", label, ...spawnOptions } = options;
  const child = spawn(command, [...args], {
    ...spawnOptions,
    detached: detachedProcessGroup && process.platform !== "win32",
    stdio: spawnOptions.stdio ?? "inherit"
  });
  let cleanupStarted = false;
  let forceKillTimer: NodeJS.Timeout | null = null;
  const initialParentPid = process.ppid;
  const keepAliveTimer = setInterval(() => undefined, PARENT_WATCH_INTERVAL_MS);
  const parentWatchTimer = setInterval(() => {
    if (process.ppid === initialParentPid) {
      return;
    }

    console.warn(`[${label}] Parent process changed from ${initialParentPid} to ${process.ppid}; stopping child process tree.`);
    process.exitCode = 1;
    terminate("SIGTERM");
    setTimeout(() => process.exit(1), POSIX_TERMINATION_GRACE_MS).unref();
  }, PARENT_WATCH_INTERVAL_MS);

  parentWatchTimer.unref();

  const terminate = (signal: NodeJS.Signals = "SIGTERM") => {
    if (cleanupStarted) {
      return;
    }

    cleanupStarted = true;
    killProcessTree({ child, detachedProcessGroup, label, signal });

    forceKillTimer = setTimeout(() => {
      killProcessTree({ child, detachedProcessGroup, label, signal: "SIGKILL" });
    }, POSIX_TERMINATION_GRACE_MS);
    forceKillTimer.unref();
  };

  const cleanupSignals: NodeJS.Signals[] = ["SIGHUP", "SIGINT", "SIGTERM"];
  const signalHandlers: Array<[NodeJS.Signals, () => void]> = cleanupSignals.map((signal) => [
    signal,
    () => {
      process.exitCode = SIGNAL_EXIT_CODES[signal] ?? 1;
      terminate(signal);
      setTimeout(() => {
        process.exit(SIGNAL_EXIT_CODES[signal] ?? 1);
      }, POSIX_TERMINATION_GRACE_MS).unref();
    }
  ]);

  const uncaughtExceptionHandler = (error: Error) => {
    console.error(`[${label}] Uncaught exception:`, error);
    process.exitCode = 1;
    terminate("SIGTERM");
    setTimeout(() => process.exit(1), POSIX_TERMINATION_GRACE_MS).unref();
  };

  const unhandledRejectionHandler = (reason: unknown) => {
    console.error(`[${label}] Unhandled rejection:`, reason);
    process.exitCode = 1;
    terminate("SIGTERM");
    setTimeout(() => process.exit(1), POSIX_TERMINATION_GRACE_MS).unref();
  };

  const beforeExitHandler = () => {
    terminate("SIGTERM");
  };

  const exitHandler = () => {
    killProcessTree({ child, detachedProcessGroup, label, signal: "SIGTERM" });
  };

  for (const [signal, handler] of signalHandlers) {
    process.once(signal, handler);
  }

  process.once("uncaughtException", uncaughtExceptionHandler);
  process.once("unhandledRejection", unhandledRejectionHandler);
  process.once("beforeExit", beforeExitHandler);
  process.once("exit", exitHandler);

  const dispose = () => {
    for (const [signal, handler] of signalHandlers) {
      process.off(signal, handler);
    }

    process.off("uncaughtException", uncaughtExceptionHandler);
    process.off("unhandledRejection", unhandledRejectionHandler);
    process.off("beforeExit", beforeExitHandler);
    process.off("exit", exitHandler);

    if (forceKillTimer) {
      clearTimeout(forceKillTimer);
      forceKillTimer = null;
    }

    clearInterval(keepAliveTimer);
    clearInterval(parentWatchTimer);
  };

  child.once("exit", () => {
    if (forceKillTimer) {
      clearTimeout(forceKillTimer);
      forceKillTimer = null;
    }

    clearInterval(keepAliveTimer);
    clearInterval(parentWatchTimer);
  });

  return {
    child,
    dispose,
    terminate
  };
}
