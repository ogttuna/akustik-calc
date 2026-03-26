import {
  SIMPLE_WORKBENCH_REPORT_MARK,
  SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME
} from "./simple-workbench-proposal-reporting";

type SimpleWorkbenchReportMarkOptions = {
  accent: string;
  accentStrong: string;
  ink?: string;
  panel?: string;
  title?: string;
  variant?: "cover" | "symbol";
};

function escapeMarkup(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function alphaHex(opacity: number) {
  const normalized = Math.max(0, Math.min(1, opacity));
  return Math.round(normalized * 255)
    .toString(16)
    .padStart(2, "0");
}

function buildCoverLockupSvgMarkup(options: Required<Pick<SimpleWorkbenchReportMarkOptions, "accent" | "accentStrong">> & {
  ink: string;
  panel: string;
  title: string;
}) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 142" role="img" aria-label="${escapeMarkup(options.title)}" style="display:block;width:100%;height:100%;">
      <defs>
        <linearGradient id="dac-wash" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${options.panel}" />
          <stop offset="100%" stop-color="${options.accent}${alphaHex(0.07)}" />
        </linearGradient>
      </defs>

      <g transform="translate(4 4)">
        <rect x="0" y="8" width="92" height="126" rx="28" fill="url(#dac-wash)" stroke="${options.accentStrong}${alphaHex(0.34)}" stroke-width="2.1"></rect>
        <path d="M20 28 H70" fill="none" stroke="${options.accentStrong}${alphaHex(0.22)}" stroke-linecap="round" stroke-width="1.2"></path>
        <path d="M20 114 H70" fill="none" stroke="${options.accentStrong}${alphaHex(0.22)}" stroke-linecap="round" stroke-width="1.2"></path>

        <rect x="18" y="34" width="56" height="16" rx="8" fill="${options.accent}${alphaHex(0.12)}" stroke="${options.accentStrong}${alphaHex(0.22)}"></rect>
        <rect x="18" y="58" width="56" height="22" rx="11" fill="${options.accent}${alphaHex(0.18)}" stroke="${options.accentStrong}${alphaHex(0.24)}"></rect>
        <path d="M24 69 C31 58, 40 58, 47 69 S63 80, 70 69" fill="none" stroke="${options.accentStrong}" stroke-linecap="round" stroke-width="2.1"></path>
        <path d="M24 76 C31 65, 40 65, 47 76 S63 87, 70 76" fill="none" stroke="${options.accentStrong}${alphaHex(0.28)}" stroke-linecap="round" stroke-width="1.25"></path>
        <rect x="18" y="90" width="56" height="16" rx="8" fill="${options.accent}${alphaHex(0.22)}" stroke="${options.accentStrong}${alphaHex(0.24)}"></rect>

        <path d="M112 30 H380" fill="none" stroke="${options.accentStrong}${alphaHex(0.18)}" stroke-width="1.1"></path>
        <path d="M112 112 H380" fill="none" stroke="${options.accentStrong}${alphaHex(0.18)}" stroke-width="1.1"></path>
        <path d="M112 128 H380" fill="none" stroke="${options.accentStrong}${alphaHex(0.1)}" stroke-width="1"></path>
        <path d="M112 40 H146" fill="none" stroke="${options.accentStrong}" stroke-linecap="round" stroke-width="2.2"></path>

        <text x="154" y="43" fill="${options.accentStrong}" font-family="Arial, Helvetica Neue, sans-serif" font-size="11" font-weight="700" letter-spacing="4.4">DYNECHO</text>
        <text x="110" y="88" fill="${options.ink}" font-family="Georgia, 'Times New Roman', serif" font-size="62" font-weight="700" letter-spacing="7.6">DAC</text>
        <path d="M116 98 C145 83, 177 82, 207 94 S269 109, 302 95 S347 82, 378 92" fill="none" stroke="${options.accentStrong}" stroke-linecap="round" stroke-width="2.8"></path>
        <text x="154" y="122" fill="${options.ink}" font-family="Arial, Helvetica Neue, sans-serif" font-size="12" font-weight="700" letter-spacing="3.1">ACOUSTIC CALCULATOR</text>
        <text x="154" y="137" fill="${options.accentStrong}" font-family="Arial, Helvetica Neue, sans-serif" font-size="8.5" letter-spacing="0.7">ISO-aligned acoustic report</text>
      </g>
    </svg>
  `.trim();
}

function buildSymbolSvgMarkup(options: Required<Pick<SimpleWorkbenchReportMarkOptions, "accent" | "accentStrong">> & {
  ink: string;
  panel: string;
  title: string;
}) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116 116" role="img" aria-label="${escapeMarkup(options.title)}" style="display:block;width:100%;height:100%;">
      <rect x="4" y="4" width="108" height="108" rx="30" fill="${options.panel}" stroke="${options.accentStrong}${alphaHex(0.34)}" stroke-width="2"></rect>
      <path d="M22 24 H94" fill="none" stroke="${options.accentStrong}${alphaHex(0.16)}" stroke-linecap="round" stroke-width="1.2"></path>
      <path d="M22 92 H94" fill="none" stroke="${options.accentStrong}${alphaHex(0.16)}" stroke-linecap="round" stroke-width="1.2"></path>
      <rect x="24" y="32" width="68" height="14" rx="7" fill="${options.accent}${alphaHex(0.12)}" stroke="${options.accentStrong}${alphaHex(0.18)}"></rect>
      <rect x="24" y="52" width="68" height="20" rx="10" fill="${options.accent}${alphaHex(0.18)}" stroke="${options.accentStrong}${alphaHex(0.24)}"></rect>
      <path d="M28 62 C36 51, 46 51, 54 62 S72 73, 80 62" fill="none" stroke="${options.accentStrong}" stroke-linecap="round" stroke-width="2.3"></path>
      <path d="M28 68 C36 57, 46 57, 54 68 S72 79, 80 68" fill="none" stroke="${options.accentStrong}${alphaHex(0.26)}" stroke-linecap="round" stroke-width="1.3"></path>
      <rect x="24" y="78" width="68" height="12" rx="6" fill="${options.accent}${alphaHex(0.22)}" stroke="${options.accentStrong}${alphaHex(0.22)}"></rect>
      <path d="M94 34 V82" fill="none" stroke="${options.accentStrong}${alphaHex(0.18)}" stroke-dasharray="2 5" stroke-linecap="round" stroke-width="1.4"></path>
    </svg>
  `.trim();
}

export function buildSimpleWorkbenchReportMarkSvgMarkup(options: SimpleWorkbenchReportMarkOptions): string {
  const title = options.title ?? `${SIMPLE_WORKBENCH_REPORT_MARK} | ${SIMPLE_WORKBENCH_REPORT_PRODUCT_NAME}`;
  const ink = options.ink ?? "#1b2f3f";
  const panel = options.panel ?? "#fffdf8";
  const variant = options.variant ?? "cover";

  if (variant === "symbol") {
    return buildSymbolSvgMarkup({
      accent: options.accent,
      accentStrong: options.accentStrong,
      ink,
      panel,
      title
    });
  }

  return buildCoverLockupSvgMarkup({
    accent: options.accent,
    accentStrong: options.accentStrong,
    ink,
    panel,
    title
  });
}
