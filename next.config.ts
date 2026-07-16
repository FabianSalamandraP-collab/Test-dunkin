import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Keep dev and production build artifacts isolated so local validation
  // does not corrupt the running dev server cache.
  distDir: isDevelopment ? ".next-dev" : ".next",
};

export default nextConfig;
