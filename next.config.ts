import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const storeFsStubPath = path.join(projectRoot, "src/lib/questions/store.fs.stub.ts");
const storeFsPath = path.join(projectRoot, "src/lib/questions/store.fs.ts");

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true,
  },
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
