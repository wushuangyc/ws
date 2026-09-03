import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "172.30.0.2",
    "*.cursor.com",
    "*.cursor.sh",
    "*.oncursor.com",
    "*.static-cursor.com",
  ],
  agentRules: false,
};

export default nextConfig;
