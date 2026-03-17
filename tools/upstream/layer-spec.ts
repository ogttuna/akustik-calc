import { parseLayerSpec } from "@dynecho/engine";
import type { LayerInput } from "@dynecho/shared";

const DYNECHO_TO_UPSTREAM_ALIASES: Record<string, string> = {
  gypsum_board: "gypsum",
  resilient_support: "resilient_channel",
  screed: "generic_screed"
};

export type AppliedAlias = {
  from: string;
  to: string;
};

export function parseDynechoLayerSpec(spec: string): LayerInput[] {
  return parseLayerSpec(spec);
}

export function serializeLayerSpec(layers: readonly LayerInput[]): string {
  return layers.map((layer) => `${layer.materialId}:${layer.thicknessMm}`).join(",");
}

export function translateLayersForUpstream(layers: readonly LayerInput[]): {
  aliases: AppliedAlias[];
  layers: LayerInput[];
} {
  const aliases: AppliedAlias[] = [];

  const translated = layers.map((layer) => {
    const translatedMaterialId = DYNECHO_TO_UPSTREAM_ALIASES[layer.materialId] ?? layer.materialId;

    if (translatedMaterialId !== layer.materialId) {
      aliases.push({
        from: layer.materialId,
        to: translatedMaterialId
      });
    }

    return {
      ...layer,
      materialId: translatedMaterialId
    };
  });

  return {
    aliases,
    layers: translated
  };
}
