import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Lockfiles exist in this folder and the parent repo; without this, Turbopack
// picks the wrong root and CSS edits in `app/globals.css` can look "stuck".
const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
};

export default nextConfig;
