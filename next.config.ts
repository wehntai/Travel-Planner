import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Required even on Vercel: without it, Turbopack's production build
  // bundles our custom-output Prisma client with a broken "../../ROOT/..."
  // placeholder in place of the query-engine binary's real path (a bundler
  // limitation, not a Vercel-specific one). Standalone mode triggers
  // Next's file-tracing/copy step, which resolves it to a real relative
  // path instead. Verified locally by relocating .next/standalone to an
  // unrelated directory and confirming the app boots without this error.
  output: "standalone",
};

export default nextConfig;
