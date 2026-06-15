import type { NextConfig } from "next";

const distDir = process.env.NEXT_DIST_DIR?.trim();
const isPlaywrightDist = Boolean(distDir?.startsWith(".next-playwright-"));
const playwrightTsconfigPath = process.env.NEXT_PLAYWRIGHT_TSCONFIG_PATH?.trim() || "./tsconfig.playwright.json";

const nextConfig: NextConfig = {
  distDir: distDir && distDir.length > 0 ? distDir : ".next",
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    tsconfigPath: isPlaywrightDist ? playwrightTsconfigPath : "./tsconfig.next.json"
  },
  output: "standalone",
  transpilePackages: ["@dynecho/catalogs", "@dynecho/engine", "@dynecho/shared", "@dynecho/ui"]
};

export default nextConfig;
