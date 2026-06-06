import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const isCloudBuild =
  process.env.CF_PAGES === "1" ||
  process.env.CLOUDFLARE_PAGES === "1" ||
  process.env.CLOUD_BUILD === "1";

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
    ...(isCloudBuild
      ? {
          resolveAlias: {
            "./store.fs": "./store.fs.stub",
          },
        }
      : {}),
  },
  webpack: (config) => {
    if (isCloudBuild) {
      config.resolve ??= {};
      config.resolve.alias ??= {};
      const stubPath = path.join(projectRoot, "src/lib/questions/store.fs.stub.ts");
      config.resolve.alias["./store.fs"] = stubPath;
    }
    return config;
  },
};

export default nextConfig;

import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

void setupDevPlatform();
