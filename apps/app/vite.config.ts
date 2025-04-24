import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'IglesiasBC',
                short_name: 'La app todo en uno para tu iglesia.',
                start_url: '/',
                display: 'standalone',
                background_color: '#FFFFFF',
                theme_color: '#000000',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
                screenshots: [
                    {
                        src: '/screenshots/1.jpg',
                        sizes: '1080x1920',
                        type: 'image/jpg',
                        form_factor: 'narrow',
                    },
                    {
                        src: '/screenshots/2.jpg',
                        sizes: '1080x1920',
                        type: 'image/jpg',
                        form_factor: 'narrow',
                    },
                    {
                        src: '/screenshots/3.jpg',
                        sizes: '1080x1920',
                        type: 'image/jpg',
                        form_factor: 'narrow',
                    },
                ],
                lang: 'es',
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
});
