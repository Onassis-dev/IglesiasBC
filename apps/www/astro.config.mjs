import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
    }),
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        ,
        react(),
    ],
    output: "hybrid",
    server: {
        host: "0.0.0.0",
    },
});
