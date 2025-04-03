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
                short_name: 'IglesiasBC',
                start_url: '/',
                display: 'standalone',
                background_color: '#f6f6f6',
                theme_color: '#000000',
                icons: [
                    { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: '/icon-256x256.png', sizes: '256x256', type: 'image/png' },
                    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
                ],
                screenshots: [
                    {
                        src: '/screenshots/phone.png',
                        sizes: '406x885',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                    {
                        src: '/screenshots/desktop.png',
                        sizes: '1863x1026',
                        type: 'image/png',
                        form_factor: 'wide',
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
