import { defineConfig } from "vite";

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    test: {
        globals: true,
        environment: "jsdom"
    },
});