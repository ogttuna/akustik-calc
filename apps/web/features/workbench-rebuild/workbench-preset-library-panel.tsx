"use client";

import { Check, Copy, Pencil, Save, Trash2 } from "lucide-react";

import {
  formatWorkbenchV2CommonPresetSourceSummary,
  type WorkbenchV2CommonPreset
} from "./workbench-v2-common-presets";
import {
  WORKBENCH_V2_PRESET_DESCRIPTION_MAX_LENGTH,
  WORKBENCH_V2_PRESET_NAME_MAX_LENGTH,
  formatWorkbenchV2PresetKindLabel,
  formatWorkbenchV2PresetLayerCount,
  formatWorkbenchV2PresetUpdatedDateLabel,
  type WorkbenchV2PresetStatus,
  type WorkbenchV2PresetSummary
} from "./workbench-v2-presets";

export type WorkbenchPresetLibraryPanelProps = {
  busy: boolean;
  canRenamePreset: boolean;
  commonPresets: readonly WorkbenchV2CommonPreset[];
  id?: string;
  message: string;
  onCommonPresetSelect: (presetId: string) => void;
  onCommonPresetUse: () => Promise<void> | void;
  onClose?: () => void;
  onDeletePreset: () => Promise<void> | void;
  onDuplicatePreset: () => Promise<void> | void;
  onPresetDescriptionDraftChange: (value: string) => void;
  onPresetNameDraftChange: (value: string) => void;
  onPresetRenameDescriptionDraftChange: (value: string) => void;
  onPresetRenameDraftChange: (value: string) => void;
  onRenamePreset: () => Promise<void> | void;
  onSavePreset: () => Promise<void> | void;
  onSelectPreset: (presetId: string) => void;
  onUsePreset: () => Promise<void> | void;
  presetDescriptionDraft: string;
  presetNameDraft: string;
  presetRenameDescriptionDraft: string;
  presetRenameDraft: string;
  presets: readonly WorkbenchV2PresetSummary[];
  selectedCommonPreset: WorkbenchV2CommonPreset | null;
  selectedCommonPresetId: string;
  selectedPreset: WorkbenchV2PresetSummary | null;
  selectedPresetId: string;
  status: WorkbenchV2PresetStatus;
};

export function WorkbenchPresetLibraryPanel(props: WorkbenchPresetLibraryPanelProps) {
  return (
    <section className="calc-section calc-project-snapshot-section" id={props.id} aria-label="Layer templates">
      <div className="calc-section-head">
        <div>
          <h2>Layer templates</h2>
        </div>
        <div className="calc-project-panel-actions">
          <span className={props.status === "error" ? "ui-badge ui-badge-warning" : "ui-badge"}>{props.message}</span>
          {props.onClose ? (
            <button className="focus-ring ui-button ui-button-ghost" onClick={props.onClose} type="button">
              Close
            </button>
          ) : null}
        </div>
      </div>
      <div className="calc-project-snapshot-controls">
        <input
          aria-label="Template name"
          className="focus-ring ui-field calc-project-snapshot-select"
          disabled={props.busy}
          maxLength={WORKBENCH_V2_PRESET_NAME_MAX_LENGTH}
          onChange={(event) => props.onPresetNameDraftChange(event.target.value)}
          placeholder="Template name"
          value={props.presetNameDraft}
        />
        <input
          aria-label="Template description"
          className="focus-ring ui-field calc-project-snapshot-select"
          disabled={props.busy}
          maxLength={WORKBENCH_V2_PRESET_DESCRIPTION_MAX_LENGTH}
          onChange={(event) => props.onPresetDescriptionDraftChange(event.target.value)}
          placeholder="Optional template description"
          value={props.presetDescriptionDraft}
        />
        <button
          className="focus-ring ui-button ui-button-primary"
          disabled={props.busy || props.status === "syncing" || props.status === "restoring"}
          onClick={() => void props.onSavePreset()}
          type="button"
        >
          <Save className="h-4 w-4" />
          Save template
        </button>
      </div>
      <div className="calc-project-list" aria-label="Saved templates">
        <div className="calc-project-list-heading">My templates</div>
        {props.presets.length ? (
          props.presets.map((preset) => {
            const selected = preset.id === props.selectedPresetId;

            return (
              <div className="calc-project-row" data-preset-id={preset.id} data-selected={selected ? "true" : "false"} key={preset.id}>
                <button
                  aria-pressed={selected}
                  className="focus-ring calc-project-row-main"
                  disabled={props.status === "loading"}
                  onClick={() => props.onSelectPreset(preset.id)}
                  type="button"
                >
                  <span className="calc-project-row-code">{formatWorkbenchV2PresetKindLabel(preset.kind)}</span>
                  <span className="calc-project-row-copy">
                    <strong>{preset.name}</strong>
                    <span>{formatWorkbenchV2PresetUpdatedDateLabel(preset.updatedAtIso)}</span>
                    {preset.description ? <small>{preset.description}</small> : null}
                  </span>
                  <span className="calc-project-row-result">{formatWorkbenchV2PresetLayerCount(preset.layerCount)}</span>
                </button>
                {selected ? (
                  <div className="calc-project-row-edit">
                    <input
                      aria-label="Selected template name"
                      className="focus-ring ui-field calc-project-snapshot-select"
                      disabled={props.busy}
                      maxLength={WORKBENCH_V2_PRESET_NAME_MAX_LENGTH}
                      onChange={(event) => props.onPresetRenameDraftChange(event.target.value)}
                      placeholder="Selected template name"
                      value={props.presetRenameDraft}
                    />
                    <input
                      aria-label="Selected template description"
                      className="focus-ring ui-field calc-project-snapshot-select"
                      disabled={props.busy}
                      maxLength={WORKBENCH_V2_PRESET_DESCRIPTION_MAX_LENGTH}
                      onChange={(event) => props.onPresetRenameDescriptionDraftChange(event.target.value)}
                      placeholder="Selected template description"
                      value={props.presetRenameDescriptionDraft}
                    />
                    <div className="calc-project-row-actions">
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.selectedPreset || props.busy}
                        onClick={() => void props.onUsePreset()}
                        type="button"
                      >
                        <Check className="h-4 w-4" />
                        Use template
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={!props.canRenamePreset}
                        onClick={() => void props.onRenamePreset()}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                        Rename template
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={props.busy}
                        onClick={() => void props.onDuplicatePreset()}
                        type="button"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate template
                      </button>
                      <button
                        className="focus-ring ui-button ui-button-danger"
                        disabled={props.busy}
                        onClick={() => void props.onDeletePreset()}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete template
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="calc-project-list-empty">No saved templates</div>
        )}
      </div>
      <div className="calc-project-list" aria-label="Common templates">
        <div className="calc-project-list-heading">Common templates</div>
        {props.commonPresets.map((preset) => {
          const selected = preset.id === props.selectedCommonPresetId;

          return (
            <div className="calc-project-row" data-common-preset-id={preset.id} data-selected={selected ? "true" : "false"} key={preset.id}>
              <button
                aria-pressed={selected}
                className="focus-ring calc-project-row-main"
                disabled={props.status === "loading"}
                onClick={() => props.onCommonPresetSelect(preset.id)}
                type="button"
              >
                <span className="calc-project-row-code">Wall</span>
                <span className="calc-project-row-copy">
                  <strong>{preset.label}</strong>
                  <span>{formatWorkbenchV2CommonPresetSourceSummary(preset)}</span>
                  <small>{preset.description}</small>
                </span>
                <span className="calc-project-row-result">{formatWorkbenchV2PresetLayerCount(preset.snapshot.layers.length)}</span>
              </button>
              {selected ? (
                <div className="calc-project-row-edit">
                  <div className="calc-project-row-actions">
                    <button
                      className="focus-ring ui-button ui-button-ghost"
                      disabled={!props.selectedCommonPreset || props.busy}
                      onClick={() => void props.onCommonPresetUse()}
                      type="button"
                    >
                      <Check className="h-4 w-4" />
                      Use common template
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
