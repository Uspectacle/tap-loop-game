import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingRoot: __dirname,
  output: "export",
  basePath: isProd ? "/tap-loop-game" : "",
  assetPrefix: isProd ? "/tap-loop-game/" : "",
};

export default nextConfig;
