import type { LayerInput } from "@dynecho/shared";

export function parseLayerSpec(spec: string): LayerInput[] {
  const raw = spec.trim();
  if (!raw) return [];

  return raw
    .split(/[\n,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const match = token.match(/^([^:@]+)\s*[:@]\s*([0-9]+(?:\.[0-9]+)?)$/);
      if (!match) {
        throw new Error(`Invalid layer token: ${token}`);
      }

      return {
        materialId: match[1].trim(),
        thicknessMm: Number(match[2])
      };
    });
}

