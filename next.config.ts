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
  // We build in CI and ship the compiled output to a container that never
  // runs `next build` itself (see .github/workflows/deploy.yml). Standalone
  // output is what makes that portable: Next's file tracing only copies
  // native assets like Prisma's query-engine binary next to the bundled
  // chunk that needs it -- and traces at all -- under this mode. Without
  // it, a custom Prisma client output gets bundled with __dirname frozen
  // to wherever *this* build happened to run, which breaks the moment the
  // build is deployed anywhere else.
  output: "standalone",
};

export default nextConfig;
