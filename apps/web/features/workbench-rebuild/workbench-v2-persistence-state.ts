import { workbenchV2SnapshotsRepresentSameDraft } from "./workbench-v2-presets";
import type { WorkbenchV2ProjectSnapshot } from "./workbench-v2-project-snapshot";

export type WorkbenchV2PersistenceProject = {
  id: string;
  name: string;
};

export type WorkbenchV2PersistenceAssembly = {
  id: string;
  name: string;
  version: number;
};

export type WorkbenchV2PersistenceState =
  | {
      kind: "localDraft";
      primaryActionLabel: "Choose project";
      statusLabel: "Local draft";
      title: "Local draft";
    }
  | {
      kind: "projectDraft";
      primaryActionLabel: "Save as new combination";
      projectName: string;
      statusLabel: "Unsaved stack";
      title: string;
    }
  | {
      assemblyName: string;
      assemblyVersion: number;
      kind: "combinationClean";
      primaryActionLabel: "Saved";
      projectName: string;
      statusLabel: string;
      title: string;
    }
  | {
      assemblyName: string;
      assemblyVersion: number;
      kind: "combinationDirty";
      primaryActionLabel: "Update combination";
      projectName: string;
      statusLabel: string;
      title: string;
    }
  | {
      kind: "templateDraft";
      primaryActionLabel: "Save as new combination" | "Choose project";
      projectName?: string;
      statusLabel: "Template loaded";
      templateName: string;
      title: string;
    };

export function getWorkbenchV2DraftDirtyState(
  currentSnapshot: WorkbenchV2ProjectSnapshot,
  baselineSnapshot: WorkbenchV2ProjectSnapshot | null
): boolean {
  return baselineSnapshot ? !workbenchV2SnapshotsRepresentSameDraft(currentSnapshot, baselineSnapshot) : false;
}

export function deriveWorkbenchV2PersistenceState(input: {
  activeAssembly: WorkbenchV2PersistenceAssembly | null;
  activeAssemblyDirty: boolean;
  activeAssemblyHasBaseline: boolean;
  project: WorkbenchV2PersistenceProject | null;
  templateName?: string | null;
}): WorkbenchV2PersistenceState {
  const templateName = input.templateName?.trim() || null;

  if (!input.project) {
    if (templateName) {
      return {
        kind: "templateDraft",
        primaryActionLabel: "Choose project",
        statusLabel: "Template loaded",
        templateName,
        title: `${templateName} / Unsaved stack`
      };
    }

    return {
      kind: "localDraft",
      primaryActionLabel: "Choose project",
      statusLabel: "Local draft",
      title: "Local draft"
    };
  }

  if (!input.activeAssembly || !input.activeAssemblyHasBaseline) {
    if (templateName) {
      return {
        kind: "templateDraft",
        primaryActionLabel: "Save as new combination",
        projectName: input.project.name,
        statusLabel: "Template loaded",
        templateName,
        title: `${input.project.name} / ${templateName} / Unsaved stack`
      };
    }

    return {
      kind: "projectDraft",
      primaryActionLabel: "Save as new combination",
      projectName: input.project.name,
      statusLabel: "Unsaved stack",
      title: `${input.project.name} / Unsaved stack`
    };
  }

  if (input.activeAssemblyDirty) {
    return {
      assemblyName: input.activeAssembly.name,
      assemblyVersion: input.activeAssembly.version,
      kind: "combinationDirty",
      primaryActionLabel: "Update combination",
      projectName: input.project.name,
      statusLabel: `Modified / v${input.activeAssembly.version}`,
      title: `${input.project.name} / ${input.activeAssembly.name} / Modified / v${input.activeAssembly.version}`
    };
  }

  return {
    assemblyName: input.activeAssembly.name,
    assemblyVersion: input.activeAssembly.version,
    kind: "combinationClean",
    primaryActionLabel: "Saved",
    projectName: input.project.name,
    statusLabel: `Saved / v${input.activeAssembly.version}`,
    title: `${input.project.name} / ${input.activeAssembly.name} / Saved / v${input.activeAssembly.version}`
  };
}
