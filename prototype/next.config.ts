import path from 'node:path';
import type { NextConfig } from 'next';

// The marketing site at the repository root has its own lockfile. Pin this app's root so
// Turbopack and file tracing never resolve React or HeroUI from the parent project.
const root = path.resolve(__dirname);

const nextConfig: NextConfig = {
  devIndicators: false,
  // Checks and screenshots load the dev server as 127.0.0.1; let its hot reload connect.
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: { root },
  outputFileTracingRoot: root,
};

export default nextConfig;
