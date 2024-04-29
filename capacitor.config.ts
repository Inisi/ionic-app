import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "CANTINA",
  webDir: "dist",
  bundledWebRuntime: false,
  android: {
    path: "C:\\path\\to\\android\\sdk",
  },
  ios: {
    path: "ios",
  },
};

export default config;
