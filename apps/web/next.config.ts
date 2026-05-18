import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@property-underwriter/financial-engine",
    "@property-underwriter/scoring-engine",
    "@property-underwriter/negotiation-engine",
  ],
  turbopack: {
    root: path.join(process.cwd(), "../.."),
  },
};

export default nextConfig;
