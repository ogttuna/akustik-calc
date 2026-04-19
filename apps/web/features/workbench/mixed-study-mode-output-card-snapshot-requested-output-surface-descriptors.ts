import type { RequestedOutputSurfaceDescriptor } from "./mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop";
import {
  BROAD_EDIT_HISTORY_BRANCH,
  COMPACT_REPLAY_BRANCH,
  PARTIAL_RESTORE_BRANCH,
  SELECTED_EDIT_HISTORY_BRANCH,
  type BroadEditHistoryVariant,
  type DuplicateSwapHistoryVariant,
  type HistoryVariant,
  type SelectedEditHistoryVariant,
  createBroadRequestedOutputSurfaceDescriptor,
  createRepresentativeRequestedOutputSurfaceDescriptor,
  createSelectedRequestedOutputSurfaceDescriptor,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders";
import {
  createBroadRequestedOutputCompactReplayMessages,
  createBroadRequestedOutputEditHistoryRestoreMessages,
  createBroadRequestedOutputPartialRestoreMessages,
  createBroadRequestedOutputRestoreAfterCompactReplayMessages,
  createRepresentativeRequestedOutputEditHistoryRestoreMessages,
  createRepresentativeRequestedOutputPartialRestoreMessages,
  createRepresentativeRequestedOutputRestoreMessages,
  createSelectedRequestedOutputEditHistoryRestoreMessages,
  createSelectedRequestedOutputGeneratedHistoryRestoreMessages,
  createSelectedRequestedOutputPartialRestoreMessages,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles";

export function createBroadRequestedOutputCompactReplayDescriptor(): RequestedOutputSurfaceDescriptor<HistoryVariant> {
  return createBroadRequestedOutputSurfaceDescriptor(
    COMPACT_REPLAY_BRANCH,
    createBroadRequestedOutputCompactReplayMessages(),
  );
}

export function createBroadRequestedOutputRestoreAfterCompactReplayDescriptor(): RequestedOutputSurfaceDescriptor<HistoryVariant> {
  return createBroadRequestedOutputSurfaceDescriptor(
    COMPACT_REPLAY_BRANCH,
    createBroadRequestedOutputRestoreAfterCompactReplayMessages(),
  );
}

export function createBroadRequestedOutputEditHistoryRestoreDescriptor(): RequestedOutputSurfaceDescriptor<BroadEditHistoryVariant> {
  return createBroadRequestedOutputSurfaceDescriptor(
    BROAD_EDIT_HISTORY_BRANCH,
    createBroadRequestedOutputEditHistoryRestoreMessages(),
  );
}

export function createBroadRequestedOutputPartialRestoreDescriptor(): RequestedOutputSurfaceDescriptor<DuplicateSwapHistoryVariant> {
  return createBroadRequestedOutputSurfaceDescriptor(
    PARTIAL_RESTORE_BRANCH,
    createBroadRequestedOutputPartialRestoreMessages(),
  );
}

export function createSelectedRequestedOutputPartialRestoreDescriptor(): RequestedOutputSurfaceDescriptor<DuplicateSwapHistoryVariant> {
  return createSelectedRequestedOutputSurfaceDescriptor(
    PARTIAL_RESTORE_BRANCH,
    createSelectedRequestedOutputPartialRestoreMessages(),
  );
}

export function createSelectedRequestedOutputGeneratedHistoryRestoreDescriptor(): RequestedOutputSurfaceDescriptor<DuplicateSwapHistoryVariant> {
  return createSelectedRequestedOutputSurfaceDescriptor(
    PARTIAL_RESTORE_BRANCH,
    createSelectedRequestedOutputGeneratedHistoryRestoreMessages(),
  );
}

export function createSelectedRequestedOutputEditHistoryRestoreDescriptor(): RequestedOutputSurfaceDescriptor<SelectedEditHistoryVariant> {
  return createSelectedRequestedOutputSurfaceDescriptor(
    SELECTED_EDIT_HISTORY_BRANCH,
    createSelectedRequestedOutputEditHistoryRestoreMessages(),
  );
}

export function createRepresentativeRequestedOutputRestoreDescriptor(): RequestedOutputSurfaceDescriptor<HistoryVariant> {
  return createRepresentativeRequestedOutputSurfaceDescriptor(
    COMPACT_REPLAY_BRANCH,
    createRepresentativeRequestedOutputRestoreMessages(),
  );
}

export function createRepresentativeRequestedOutputEditHistoryRestoreDescriptor(): RequestedOutputSurfaceDescriptor<BroadEditHistoryVariant> {
  return createRepresentativeRequestedOutputSurfaceDescriptor(
    BROAD_EDIT_HISTORY_BRANCH,
    createRepresentativeRequestedOutputEditHistoryRestoreMessages(),
  );
}

export function createRepresentativeRequestedOutputPartialRestoreDescriptor(): RequestedOutputSurfaceDescriptor<DuplicateSwapHistoryVariant> {
  return createRepresentativeRequestedOutputSurfaceDescriptor(
    PARTIAL_RESTORE_BRANCH,
    createRepresentativeRequestedOutputPartialRestoreMessages(),
  );
}
