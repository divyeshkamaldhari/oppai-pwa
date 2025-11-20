import react from "@vitejs/plugin-react-swc";
// import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            // VitePWA({
            //     registerType: "prompt",
            //     includeAssets: ["vite.svg"],
            //     manifest: {
            //         name: "Oppai Pwa",
            //         short_name: "OppaiPwa",
            //         start_url: "/",
            //         scope: "/",
            //         display: "standalone",
            //         background_color: "#ffffff",
            //         theme_color: "#42b883",
            //         icons: [
            //             {
            //                 src: "/vite.svg",
            //                 sizes: "192x192",
            //                 type: "image/svg",
            //             },
            //             {
            //                 src: "/vite.svg",
            //                 sizes: "512x512",
            //                 type: "image/svg",
            //             },
            //         ],
            //     },
            //     workbox: {
            //         globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
            //         maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
            //     },
            // }),
            react(),
        ],
        build: {
            assetsDir: "",

            rollupOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        const ext = assetInfo.name?.split(".").pop();

                        if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico", "ttf", "woff", "woff2", "eot"].includes(ext ?? "")) {
                            return "wp-content/themes/brook-child/dist/assets/[name].[ext]";
                        }

                        return "assets/[name].[ext]";
                    },
                    entryFileNames: "assets/[name].js",
                    chunkFileNames: "assets/[name].js",
                },
            },

            sourcemap: true,
        },
        server: {
            allowedHosts: [".trycloudflare.com"],
            proxy: {
                "/wp-json": {
                    target: env.VITE_BACK_END_URL,
                    changeOrigin: true,
                    secure: true,
                },
                "/wpf": {
                    target: env.VITE_NODE_ENVIRONMENT === "prod" ? "https://wpf.emerchantpay.net" : "https://staging.wpf.emerchantpay.net",
                    changeOrigin: true,
                    secure: true,
                },
                "/wp-content": {
                    target: env.VITE_BACK_END_URL,
                    changeOrigin: true,
                    secure: true,
                },
            },
        },
    };
});
