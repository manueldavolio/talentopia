import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "development") {
  void setupDevPlatform();
}

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const storeFsStubPath = path.join(projectRoot, "src/lib/questions/store.fs.stub.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
    resolveAlias: {
      "./store.fs": "./store.fs.stub",
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["./store.fs"] = storeFsStubPath;
    return config;
  },
};

export default nextConfig;
