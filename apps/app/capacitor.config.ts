import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.iglesiasbc.app',
    appName: 'IglesiasBC',
    webDir: 'dist',
    server: {
        hostname: '0.0.0.0',
    },
};

export default config;
