import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { resolve } from "path";

export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                flight: resolve(__dirname, "flight.html"),
                admin_login: resolve(__dirname, "admin_login.html"),
                admin_dashboard: resolve(__dirname, "admin_dashboard.html"),
                admin_flight: resolve(__dirname, "admin_flight.html"),
            },
        },
    },
});
