import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV === "development") {
  void setupDevPlatform();
}

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const storeFsStubPath = path.join(projectRoot, "src/lib/questions/store.fs.stub.ts");
const storeFsPath = path.join(projectRoot, "src/lib/questions/store.fs.ts");

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["./store.fs"] = storeFsStubPath;
    config.resolve.alias["@/lib/questions/store.fs"] = storeFsStubPath;
    config.resolve.alias[storeFsPath] = storeFsStubPath;
    return config;
  },
};

export default nextConfig;
