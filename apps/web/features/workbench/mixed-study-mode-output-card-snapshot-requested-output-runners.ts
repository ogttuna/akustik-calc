import {
  createBroadRequestedOutputCompactReplayDescriptor,
  createBroadRequestedOutputEditHistoryRestoreDescriptor,
  createBroadRequestedOutputPartialRestoreDescriptor,
  createBroadRequestedOutputRestoreAfterCompactReplayDescriptor,
  createRepresentativeRequestedOutputEditHistoryRestoreDescriptor,
  createRepresentativeRequestedOutputPartialRestoreDescriptor,
  createRepresentativeRequestedOutputRestoreDescriptor,
  createSelectedRequestedOutputEditHistoryRestoreDescriptor,
  createSelectedRequestedOutputGeneratedHistoryRestoreDescriptor,
  createSelectedRequestedOutputPartialRestoreDescriptor,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors";
import { runRequestedOutputSurfaceGrid } from "./mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop";

export async function runBroadRequestedOutputCompactReplayGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createBroadRequestedOutputCompactReplayDescriptor());
}

export async function runBroadRequestedOutputRestoreAfterCompactReplayGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createBroadRequestedOutputRestoreAfterCompactReplayDescriptor());
}

export async function runBroadRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createBroadRequestedOutputEditHistoryRestoreDescriptor());
}

export async function runBroadRequestedOutputPartialRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createBroadRequestedOutputPartialRestoreDescriptor());
}

export async function runSelectedRequestedOutputPartialRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createSelectedRequestedOutputPartialRestoreDescriptor());
}

export async function runSelectedRequestedOutputGeneratedHistoryRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createSelectedRequestedOutputGeneratedHistoryRestoreDescriptor());
}

export async function runSelectedRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createSelectedRequestedOutputEditHistoryRestoreDescriptor());
}

export async function runRepresentativeRequestedOutputRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createRepresentativeRequestedOutputRestoreDescriptor());
}

export async function runRepresentativeRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createRepresentativeRequestedOutputEditHistoryRestoreDescriptor());
}

export async function runRepresentativeRequestedOutputPartialRestoreGrid(): Promise<void> {
  return runRequestedOutputSurfaceGrid(createRepresentativeRequestedOutputPartialRestoreDescriptor());
}
