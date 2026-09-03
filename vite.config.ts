import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    // port: 4173,
    // port: 5173,
    port: 3000
  },

  // server:{
  //   proxy:{
  //     "/api":{
  //       target:"http://192.168.0.10:3168",
  //       changeOrigin:true,
  //       secure:false
  //     }
  //   }
  // }
});
