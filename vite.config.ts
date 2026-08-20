// SCNA uses the Node server Nitro target because MongoDB's Node driver is server-side.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: { preset: "node-server" },
});
