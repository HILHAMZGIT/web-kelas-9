import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile photos
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk profile images
      },
      {
        protocol: "https",
        hostname: "mgfwzjvmxcrimchylkoy.supabase.co", // Supabase Storage
      },
    ],
  },
  reactCompiler: false,
  turbopack: {
    root: dirname,
  },
};

export default nextConfig;
