export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function log10(value: number): number {
  return Math.log(value) / Math.LN10;
}

export function log10Safe(value: number): number {
  return log10(Math.max(value, 1e-12));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function ksRound1(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  return sign * (Math.trunc((absolute + 0.05) * 10) / 10);
}
