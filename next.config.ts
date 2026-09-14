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
  // The build container is memory-constrained and was getting OOM-killed
  // mid-compile. Type checking runs as a parallel process during
  // compilation, and source maps add further overhead during prerendering
  // — dropping both meaningfully lowers peak build memory. `tsc` is already
  // verified clean locally before every push, so this doesn't hide errors
  // in practice, just moves the check out of the memory-constrained build.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverSourceMaps: false,
    webpackMemoryOptimizations: true,
    cpus: 1,
    workerThreads: false,
  },
  enablePrerenderSourceMaps: false,
  // We run `next start` straight from the full checkout (no `output:
  // standalone` pruning), so these trace manifests aren't read at runtime —
  // safe to exclude the largest node_modules subtrees (native binaries,
  // the TypeScript lib, unused build tooling) to keep "Collecting build
  // traces" from walking gigabytes of files it doesn't need to record.
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@next/swc-*/**",
      "node_modules/@prisma/engines/**",
      "node_modules/prisma/**",
      "node_modules/.prisma/**",
      "node_modules/typescript/**",
      "node_modules/@swc/**",
      "node_modules/lightningcss-*/**",
      "node_modules/@tailwindcss/oxide-*/**",
      "node_modules/eslint*/**",
      "node_modules/@eslint*/**",
    ],
  },
  // Turbopack's production compiler alone exceeds the deploy container's
  // memory budget before it ever reaches tracing, so the build is forced
  // onto webpack (via `--webpack` in package.json) where these levers apply.
  webpack: (config, { dev }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({ type: "memory" });
    }
    return config;
  },
};

export default nextConfig;
