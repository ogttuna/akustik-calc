import type { RestoreMessagesConfig } from "./mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders";

export type DirectMessageBundleArgs = {
  acceptSelectedText: string;
  defaultOpenText: string;
  snapshotLabelSuffix: string;
};

export type ReplayMessageBundleArgs = {
  defaultOpenText: string;
  keepSelectedText: string;
  labelSuffix: string;
};

export type RestoreMessageBundleArgs = {
  detourStrategy: RestoreMessagesConfig["detourStrategy"];
  labelSuffix: string;
  oppositeDefaultText: string;
  rerunVariantBeforeRestore?: boolean;
  restoreSelectedText: string;
  saveFailureText: string;
};

export type ReplayBundleArgs = {
  direct: DirectMessageBundleArgs;
  replay: ReplayMessageBundleArgs;
};

export type ReplayRestoreBundleArgs = ReplayBundleArgs & {
  restore: RestoreMessageBundleArgs;
};

const TERMS = {
  defaultRequestedOutputs: "default requested outputs",
  oppositeDefaultRequestedOutputs: "the opposite default requested outputs",
  oppositeDefaults: "the opposite defaults",
  selectedBundle: "the selected bundle",
  selectedRequestedOutputBundle: "the selected requested-output bundle",
  selectedRequestedOutputBundleAfterLongReplay:
    "the selected requested-output bundle after long replay",
  studyModeDefault: "the study-mode default",
  studyModeDefaultRequestedOutputs: "the study-mode default requested outputs",
} as const;

const broad = (subject: string) => `broad ${subject}`;
const representative = (subject: string) => `representative ${subject}`;

const shouldAccept = (subject: string, target: string) => `${subject} should accept ${target}`;
const shouldBeAcceptedBefore = (subject: string, beforeTarget: string) =>
  `${subject} should be accepted before ${beforeTarget}`;
const shouldCreateScenario = (subject: string) => `${subject} should create a scenario`;
const shouldKeep = (subject: string, target: string) => `${subject} should keep ${target}`;
const shouldMatch = (subject: string, target: string) => `${subject} should match ${target}`;
const shouldOpenWith = (subject: string, target: string) => `${subject} should open with ${target}`;
const shouldResetTo = (subject: string, target: string) => `${subject} should reset to ${target}`;
const shouldRestore = (subject: string, target: string) => `${subject} should restore ${target}`;

export function createBroadRequestedOutputCompactReplayBundleArgs(): ReplayBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(broad("requested-output replay"), TERMS.selectedBundle),
      defaultOpenText: shouldOpenWith(
        broad("requested-output replay"),
        TERMS.studyModeDefaultRequestedOutputs,
      ),
      snapshotLabelSuffix: "replay-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(
        broad("requested-output replay branch"),
        TERMS.defaultRequestedOutputs,
      ),
      keepSelectedText: shouldAccept(broad("requested-output replay"), TERMS.selectedBundle),
      labelSuffix: "replay",
    },
  };
}

export function createBroadRequestedOutputRestoreAfterCompactReplayBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(broad("requested-output restore"), TERMS.selectedBundle),
      defaultOpenText: shouldOpenWith(
        broad("requested-output restore"),
        TERMS.studyModeDefaultRequestedOutputs,
      ),
      snapshotLabelSuffix: "restore-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(
        broad("requested-output restore branch"),
        TERMS.defaultRequestedOutputs,
      ),
      keepSelectedText: shouldAccept(broad("requested-output restore replay"), TERMS.selectedBundle),
      labelSuffix: "restore-replay",
    },
    restore: {
      detourStrategy: "noise_chain",
      labelSuffix: "restore-save-load",
      oppositeDefaultText: shouldResetTo(
        broad("requested-output restore opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore(broad("requested-output restore save-load"), TERMS.selectedBundle),
      saveFailureText: shouldCreateScenario(broad("requested-output restore save")),
    },
  };
}

export function createBroadRequestedOutputEditHistoryRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(
        broad("edit-history restore"),
        TERMS.selectedRequestedOutputBundle,
      ),
      defaultOpenText: shouldOpenWith(broad("edit-history restore"), TERMS.defaultRequestedOutputs),
      snapshotLabelSuffix: "edit-history-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(broad("edit-history replay"), TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldKeep(broad("edit-history replay"), TERMS.selectedRequestedOutputBundle),
      labelSuffix: "edit-history",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "edit-history-save-load",
      oppositeDefaultText: shouldResetTo(
        broad("edit-history opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore(
        broad("edit-history save-load"),
        TERMS.selectedRequestedOutputBundle,
      ),
      saveFailureText: shouldCreateScenario(broad("edit-history restore save")),
    },
  };
}

export function createBroadRequestedOutputPartialRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(broad("partial-restore"), TERMS.selectedRequestedOutputBundle),
      defaultOpenText: shouldOpenWith(broad("partial-restore branch"), TERMS.defaultRequestedOutputs),
      snapshotLabelSuffix: "partial-restore-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(broad("partial-restore replay"), TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldKeep(broad("partial-restore replay"), TERMS.selectedRequestedOutputBundle),
      labelSuffix: "partial-restore",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "partial-restore-save-load",
      oppositeDefaultText: shouldResetTo(
        broad("partial-restore opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      rerunVariantBeforeRestore: true,
      restoreSelectedText: shouldRestore(
        broad("partial-restore save-load"),
        TERMS.selectedRequestedOutputBundle,
      ),
      saveFailureText: shouldCreateScenario(broad("partial-restore save")),
    },
  };
}

export function createSelectedRequestedOutputPartialRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept("partial-restore", TERMS.selectedRequestedOutputBundle),
      defaultOpenText: shouldOpenWith("partial-restore", TERMS.studyModeDefaultRequestedOutputs),
      snapshotLabelSuffix: "partial-restore-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith("partial-restore branch", TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldKeep("partial-restore replay", TERMS.selectedRequestedOutputBundle),
      labelSuffix: "partial-restore",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "partial-restore-save-load",
      oppositeDefaultText: shouldResetTo(
        "requested-output partial-restore opposite-mode detour",
        TERMS.oppositeDefaults,
      ),
      rerunVariantBeforeRestore: true,
      restoreSelectedText: shouldRestore("requested-output partial-restore save-load", TERMS.selectedBundle),
      saveFailureText: shouldCreateScenario("requested-output partial-restore save"),
    },
  };
}

export function createSelectedRequestedOutputGeneratedHistoryRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldBeAcceptedBefore("selected requested-output bundle", "replay"),
      defaultOpenText: shouldMatch("default requested-output bundle", TERMS.studyModeDefault),
      snapshotLabelSuffix: "direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith("generated-history replay", TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldKeep("long replay chain", TERMS.selectedRequestedOutputBundle),
      labelSuffix: "generated-history",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "generated-history-save-load",
      oppositeDefaultText: shouldOpenWith(
        "opposite-mode reset",
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore("save-load", TERMS.selectedRequestedOutputBundleAfterLongReplay),
      saveFailureText: shouldCreateScenario("requested-output generated-history save"),
    },
  };
}

export function createSelectedRequestedOutputEditHistoryRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldBeAcceptedBefore("selected requested-output bundle", "edit-history replay"),
      defaultOpenText: shouldOpenWith("edit-history replay", TERMS.defaultRequestedOutputs),
      snapshotLabelSuffix: "edit-history-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith("edit-history branch", TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldKeep("edit-history replay", TERMS.selectedRequestedOutputBundle),
      labelSuffix: "edit-history",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "edit-history-save-load",
      oppositeDefaultText: shouldResetTo(
        "opposite-mode detour",
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore("edit-history save-load", TERMS.selectedRequestedOutputBundle),
      saveFailureText: shouldCreateScenario("requested-output edit-history save"),
    },
  };
}

export function createRepresentativeRequestedOutputRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldBeAcceptedBefore(
        "representative requested-output bundle",
        "replay restore",
      ),
      defaultOpenText: shouldOpenWith(
        representative("requested-output replay"),
        TERMS.defaultRequestedOutputs,
      ),
      snapshotLabelSuffix: "direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(representative("replay branch"), TERMS.defaultRequestedOutputs),
      keepSelectedText: shouldAccept(
        representative("replay"),
        TERMS.selectedRequestedOutputBundle,
      ),
      labelSuffix: "replay",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "save-load",
      oppositeDefaultText: shouldResetTo(
        representative("opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore(representative("save-load"), TERMS.selectedRequestedOutputBundle),
      saveFailureText: shouldCreateScenario(representative("requested-output restore save")),
    },
  };
}

export function createRepresentativeRequestedOutputEditHistoryRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(
        representative("edit-history"),
        TERMS.selectedRequestedOutputBundle,
      ),
      defaultOpenText: shouldOpenWith(
        representative("edit-history branch"),
        TERMS.defaultRequestedOutputs,
      ),
      snapshotLabelSuffix: "edit-history-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(
        representative("edit-history replay"),
        TERMS.defaultRequestedOutputs,
      ),
      keepSelectedText: shouldKeep(
        representative("edit-history replay"),
        TERMS.selectedRequestedOutputBundle,
      ),
      labelSuffix: "edit-history",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "edit-history-save-load",
      oppositeDefaultText: shouldResetTo(
        representative("edit-history opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      restoreSelectedText: shouldRestore(
        representative("edit-history save-load"),
        TERMS.selectedRequestedOutputBundle,
      ),
      saveFailureText: shouldCreateScenario(representative("requested-output edit-history save")),
    },
  };
}

export function createRepresentativeRequestedOutputPartialRestoreBundleArgs(): ReplayRestoreBundleArgs {
  return {
    direct: {
      acceptSelectedText: shouldAccept(
        representative("partial-restore"),
        TERMS.selectedRequestedOutputBundle,
      ),
      defaultOpenText: shouldOpenWith(
        representative("partial-restore branch"),
        TERMS.defaultRequestedOutputs,
      ),
      snapshotLabelSuffix: "partial-restore-direct",
    },
    replay: {
      defaultOpenText: shouldOpenWith(
        representative("partial-restore replay"),
        TERMS.defaultRequestedOutputs,
      ),
      keepSelectedText: shouldKeep(
        representative("partial-restore replay"),
        TERMS.selectedRequestedOutputBundle,
      ),
      labelSuffix: "partial-restore",
    },
    restore: {
      detourStrategy: "opposite_mode_rows",
      labelSuffix: "partial-restore-save-load",
      oppositeDefaultText: shouldResetTo(
        representative("partial-restore opposite-mode detour"),
        TERMS.oppositeDefaultRequestedOutputs,
      ),
      rerunVariantBeforeRestore: true,
      restoreSelectedText: shouldRestore(
        representative("partial-restore save-load"),
        TERMS.selectedRequestedOutputBundle,
      ),
      saveFailureText: shouldCreateScenario(representative("partial-restore save")),
    },
  };
}
