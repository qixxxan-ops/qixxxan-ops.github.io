import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        experimental: { webpackBuildWorker: false },
        typescript: { tsconfigPath: "tsconfig.site.json" },
      }
    : {}),
};

export default nextConfig;
