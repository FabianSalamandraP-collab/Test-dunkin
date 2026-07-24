import type { NextConfig } from "next";
import path from "node:path";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Keep dev and production build artifacts isolated so local validation
  // does not corrupt the running dev server cache.
  distDir: isDevelopment ? ".next-dev" : ".next",
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
