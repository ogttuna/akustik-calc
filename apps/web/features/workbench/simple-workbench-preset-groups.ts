import type { PresetDefinition } from "./preset-definitions";

export type SimpleWorkbenchPresetGroup = {
  description: string;
  id: "bound" | "exact" | "fallback" | "product" | "starter";
  label: string;
  options: readonly PresetDefinition[];
};

function getSimpleWorkbenchPresetGroupId(preset: PresetDefinition): SimpleWorkbenchPresetGroup["id"] {
  if (preset.id === "concrete_wall" || preset.id === "clt_floor" || preset.id === "heavy_concrete_impact_floor") {
    return "starter";
  }

  if (preset.id === "getzner_afm_33_delta") {
    return "product";
  }

  if (preset.id.includes("fallback")) {
    return "fallback";
  }

  if (preset.id.includes("_bound")) {
    return "bound";
  }

  if (preset.id.includes("_exact")) {
    return "exact";
  }

  return "starter";
}

function getSimpleWorkbenchPresetGroupLabel(groupId: SimpleWorkbenchPresetGroup["id"]): string {
  switch (groupId) {
    case "exact":
      return "Measured examples";
    case "bound":
      return "Conservative examples";
    case "product":
      return "Product examples";
    case "fallback":
      return "Diagnostics";
    case "starter":
    default:
      return "Quick starts";
  }
}

function getSimpleWorkbenchPresetGroupDescription(groupId: SimpleWorkbenchPresetGroup["id"]): string {
  switch (groupId) {
    case "exact":
      return "Published or measured assemblies with a known exact match.";
    case "bound":
      return "Safe family references that intentionally stay conservative.";
    case "product":
      return "Manufacturer or DeltaLw-led examples.";
    case "fallback":
      return "Low-confidence checks for debugging unusual route behavior.";
    case "starter":
    default:
      return "Simple starter stacks for editing and comparison.";
  }
}

const SIMPLE_WORKBENCH_PRESET_GROUP_ORDER: readonly SimpleWorkbenchPresetGroup["id"][] = [
  "starter",
  "exact",
  "bound",
  "product",
  "fallback"
];

export function buildSimpleWorkbenchPresetGroups(presets: readonly PresetDefinition[]): SimpleWorkbenchPresetGroup[] {
  const groupedPresets = new Map<SimpleWorkbenchPresetGroup["id"], PresetDefinition[]>();

  for (const preset of presets) {
    const groupId = getSimpleWorkbenchPresetGroupId(preset);
    const currentGroup = groupedPresets.get(groupId);

    if (currentGroup) {
      currentGroup.push(preset);
    } else {
      groupedPresets.set(groupId, [preset]);
    }
  }

  return SIMPLE_WORKBENCH_PRESET_GROUP_ORDER.flatMap((groupId) => {
    const options = groupedPresets.get(groupId);

    if (!options?.length) {
      return [];
    }

    return [
      {
        description: getSimpleWorkbenchPresetGroupDescription(groupId),
        id: groupId,
        label: getSimpleWorkbenchPresetGroupLabel(groupId),
        options
      }
    ];
  });
}

export function getSimpleWorkbenchPresetContextLabel(preset: PresetDefinition): string {
  return getSimpleWorkbenchPresetGroupLabel(getSimpleWorkbenchPresetGroupId(preset));
}
