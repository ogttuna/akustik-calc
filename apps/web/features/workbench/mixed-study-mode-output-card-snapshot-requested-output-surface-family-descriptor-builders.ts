import {
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS,
  SELECTED_EDIT_HISTORY_VARIANTS,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
} from "./mixed-study-mode-generated-test-helpers";
import {
  runCompactReplayVariantBranch,
  runEditHistoryVariantBranch,
  runPartialRestoreVariantBranch,
} from "./mixed-study-mode-output-card-snapshot-requested-output-variant-drivers";
import {
  representativeRequestedOutputCases,
  type RequestedOutputSurfaceDescriptor,
} from "./mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop";
import {
  CARD_HISTORY_VARIANTS,
  expectRequiredCasesCovered,
  expectSelectedCardGridCasesCovered,
} from "./mixed-study-mode-output-card-snapshot-test-helpers";

export type HistoryVariant = (typeof CARD_HISTORY_VARIANTS)[number];
export type DuplicateSwapHistoryVariant =
  (typeof SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS)[number];
export type EditHistoryVariant = (typeof SELECTED_EDIT_HISTORY_VARIANTS)[number];

type VariantWithId = { id: string };
type RequestedOutputSurfaceScope = Pick<
  RequestedOutputSurfaceDescriptor<VariantWithId>,
  "beforeLoop" | "cases"
>;
type RequestedOutputSurfaceFamily = "broad" | "selected" | "representative";

export type DirectMessagesConfig = {
  acceptSelectedText: string;
  labelSuffix: string;
  openDefaultText: string;
};

export type ReplayMessagesConfig = {
  keepSelectedText: string;
  labelSuffix: string;
  openDefaultText: string;
};

export type RestoreMessagesConfig = {
  detourStrategy: "noise_chain" | "opposite_mode_rows";
  labelSuffix: string;
  oppositeDefaultText: string;
  rerunVariantBeforeRestore?: boolean;
  restoreSelectedText: string;
  saveFailureText: string;
};

export type RequestedOutputSurfaceMessages = {
  direct: DirectMessagesConfig;
  replay: ReplayMessagesConfig;
  restore?: RestoreMessagesConfig;
};

type VariantBranchBinding<TVariant extends VariantWithId> = {
  runVariantBranch: RequestedOutputSurfaceDescriptor<TVariant>["runVariantBranch"];
  variants: readonly TVariant[];
};

const runBroadCoverageGuards = () => {
  expectRequiredCasesCovered();
};

const runSelectedCoverageGuards = () => {
  expectRequiredCasesCovered();
  expectSelectedCardGridCasesCovered();
};

const FAMILY_SCOPES: Record<
  RequestedOutputSurfaceFamily,
  RequestedOutputSurfaceScope & { labelBase: string }
> = {
  broad: {
    beforeLoop: runBroadCoverageGuards,
    cases: () => ROUTE_MIXED_GENERATED_CASES,
    labelBase: "broad-requested-output",
  },
  representative: {
    beforeLoop: runBroadCoverageGuards,
    cases: representativeRequestedOutputCases,
    labelBase: "representative-requested-output",
  },
  selected: {
    beforeLoop: runSelectedCoverageGuards,
    cases: () => SELECTED_ROUTE_MIXED_GENERATED_CASES,
    labelBase: "requested-output",
  },
};

export const COMPACT_REPLAY_BRANCH: VariantBranchBinding<HistoryVariant> = {
  runVariantBranch: runCompactReplayVariantBranch,
  variants: CARD_HISTORY_VARIANTS,
};

export const EDIT_HISTORY_BRANCH: VariantBranchBinding<EditHistoryVariant> = {
  runVariantBranch: runEditHistoryVariantBranch,
  variants: SELECTED_EDIT_HISTORY_VARIANTS,
};

export const PARTIAL_RESTORE_BRANCH: VariantBranchBinding<DuplicateSwapHistoryVariant> = {
  runVariantBranch: runPartialRestoreVariantBranch,
  variants: SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS,
};

function createLabel(labelBase: string, labelSuffix: string): string {
  return labelSuffix ? `${labelBase}-${labelSuffix}` : labelBase;
}

function createRequestedOutputSurfaceDescriptor<TVariant extends VariantWithId>({
  branch,
  family,
  messages,
}: {
  branch: VariantBranchBinding<TVariant>;
  family: RequestedOutputSurfaceFamily;
  messages: RequestedOutputSurfaceMessages;
}): RequestedOutputSurfaceDescriptor<TVariant> {
  const scope = FAMILY_SCOPES[family];

  return {
    beforeLoop: scope.beforeLoop,
    cases: scope.cases,
    direct: {
      acceptSelectedMessage: (testCase) => `${testCase.id}: ${messages.direct.acceptSelectedText}`,
      openDefaultMessage: (testCase) => `${testCase.id}: ${messages.direct.openDefaultText}`,
      snapshotLabel: (testCase) => `${testCase.id}:${createLabel(scope.labelBase, messages.direct.labelSuffix)}`,
    },
    replay: {
      cardsLabel: (testCase, variant) =>
        `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.replay.labelSuffix)}:cards`,
      keepSelectedMessage: (testCase, variant) => `${testCase.id}:${variant.id}: ${messages.replay.keepSelectedText}`,
      openDefaultMessage: (testCase, variant) => `${testCase.id}:${variant.id}: ${messages.replay.openDefaultText}`,
      rowsLabel: (testCase, variant) =>
        `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.replay.labelSuffix)}:rows`,
      snapshotLabel: (testCase, variant) =>
        `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.replay.labelSuffix)}`,
    },
    restore: messages.restore
      ? {
          detourStrategy: messages.restore.detourStrategy,
          oppositeDefaultMessage: (testCase, variant) =>
            `${testCase.id}:${variant.id}: ${messages.restore!.oppositeDefaultText}`,
          rerunVariantBeforeRestore: messages.restore.rerunVariantBeforeRestore,
          restoreSelectedMessage: (testCase, variant) =>
            `${testCase.id}:${variant.id}: ${messages.restore!.restoreSelectedText}`,
          saveFailureMessage: (testCase, variant) =>
            `${testCase.id}:${variant.id}: ${messages.restore!.saveFailureText}`,
          saveLoadCardsLabel: (testCase, variant) =>
            `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.restore!.labelSuffix)}:cards`,
          saveLoadRowsLabel: (testCase, variant) =>
            `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.restore!.labelSuffix)}:rows`,
          saveLoadSnapshotLabel: (testCase, variant) =>
            `${testCase.id}:${variant.id}:${createLabel(scope.labelBase, messages.restore!.labelSuffix)}`,
        }
      : undefined,
    runVariantBranch: branch.runVariantBranch,
    variants: branch.variants,
  };
}

export function createBroadRequestedOutputSurfaceDescriptor<TVariant extends VariantWithId>(
  branch: VariantBranchBinding<TVariant>,
  messages: RequestedOutputSurfaceMessages,
): RequestedOutputSurfaceDescriptor<TVariant> {
  return createRequestedOutputSurfaceDescriptor({ branch, family: "broad", messages });
}

export function createSelectedRequestedOutputSurfaceDescriptor<TVariant extends VariantWithId>(
  branch: VariantBranchBinding<TVariant>,
  messages: RequestedOutputSurfaceMessages,
): RequestedOutputSurfaceDescriptor<TVariant> {
  return createRequestedOutputSurfaceDescriptor({ branch, family: "selected", messages });
}

export function createRepresentativeRequestedOutputSurfaceDescriptor<
  TVariant extends VariantWithId,
>(
  branch: VariantBranchBinding<TVariant>,
  messages: RequestedOutputSurfaceMessages,
): RequestedOutputSurfaceDescriptor<TVariant> {
  return createRequestedOutputSurfaceDescriptor({
    branch,
    family: "representative",
    messages,
  });
}
