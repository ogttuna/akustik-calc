import type { RequestedOutputSurfaceMessages } from "./mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders";
import {
  type ReplayBundleArgs,
  type ReplayRestoreBundleArgs,
  createBroadRequestedOutputCompactReplayBundleArgs,
  createBroadRequestedOutputEditHistoryRestoreBundleArgs,
  createBroadRequestedOutputPartialRestoreBundleArgs,
  createBroadRequestedOutputRestoreAfterCompactReplayBundleArgs,
  createRepresentativeRequestedOutputEditHistoryRestoreBundleArgs,
  createRepresentativeRequestedOutputPartialRestoreBundleArgs,
  createRepresentativeRequestedOutputRestoreBundleArgs,
  createSelectedRequestedOutputEditHistoryRestoreBundleArgs,
  createSelectedRequestedOutputGeneratedHistoryRestoreBundleArgs,
  createSelectedRequestedOutputPartialRestoreBundleArgs,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates";

function createRequestedOutputSurfaceReplayBundle({
  direct,
  replay,
}: ReplayBundleArgs): RequestedOutputSurfaceMessages {
  return {
    direct: {
      acceptSelectedText: direct.acceptSelectedText,
      labelSuffix: direct.snapshotLabelSuffix,
      openDefaultText: direct.defaultOpenText,
    },
    replay: {
      keepSelectedText: replay.keepSelectedText,
      labelSuffix: replay.labelSuffix,
      openDefaultText: replay.defaultOpenText,
    },
  };
}

function createRequestedOutputSurfaceReplayRestoreBundle({
  direct,
  replay,
  restore,
}: ReplayRestoreBundleArgs): RequestedOutputSurfaceMessages {
  return {
    ...createRequestedOutputSurfaceReplayBundle({ direct, replay }),
    restore: {
      detourStrategy: restore.detourStrategy,
      labelSuffix: restore.labelSuffix,
      oppositeDefaultText: restore.oppositeDefaultText,
      rerunVariantBeforeRestore: restore.rerunVariantBeforeRestore,
      restoreSelectedText: restore.restoreSelectedText,
      saveFailureText: restore.saveFailureText,
    },
  };
}

export const createBroadRequestedOutputCompactReplayMessages = () =>
  createRequestedOutputSurfaceReplayBundle(createBroadRequestedOutputCompactReplayBundleArgs());

export const createBroadRequestedOutputRestoreAfterCompactReplayMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createBroadRequestedOutputRestoreAfterCompactReplayBundleArgs(),
  );

export const createBroadRequestedOutputEditHistoryRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createBroadRequestedOutputEditHistoryRestoreBundleArgs(),
  );

export const createBroadRequestedOutputPartialRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(createBroadRequestedOutputPartialRestoreBundleArgs());

export const createSelectedRequestedOutputPartialRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createSelectedRequestedOutputPartialRestoreBundleArgs(),
  );

export const createSelectedRequestedOutputGeneratedHistoryRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createSelectedRequestedOutputGeneratedHistoryRestoreBundleArgs(),
  );

export const createSelectedRequestedOutputEditHistoryRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createSelectedRequestedOutputEditHistoryRestoreBundleArgs(),
  );

export const createRepresentativeRequestedOutputRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(createRepresentativeRequestedOutputRestoreBundleArgs());

export const createRepresentativeRequestedOutputEditHistoryRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createRepresentativeRequestedOutputEditHistoryRestoreBundleArgs(),
  );

export const createRepresentativeRequestedOutputPartialRestoreMessages = () =>
  createRequestedOutputSurfaceReplayRestoreBundle(
    createRepresentativeRequestedOutputPartialRestoreBundleArgs(),
  );
