import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor config — wraps the Vite-built `dist/` into native iOS + Android shells.
 * Build pipeline:
 *   npm run build && npx cap sync
 *   npx cap open ios     # Xcode for App Store
 *   npx cap open android # Android Studio for Play Store
 */
const config: CapacitorConfig = {
  appId: 'co.ke.nexora.ai',
  appName: 'NEXORA AI',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // In production builds, serve from packaged dist/. For live-reload dev:
    //   url: 'http://10.0.2.2:5173',
    //   cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    scheme: 'NEXORA',
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#5470f1',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: { style: 'DEFAULT', backgroundColor: '#ffffff' },
    Keyboard: { resize: 'native' },
    BarcodeScanner: {/* using @capacitor-mlkit/barcode-scanning */},
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
    LocalNotifications: { smallIcon: 'ic_stat_icon_config_sample', iconColor: '#5470f1' },
    App: { launchUrl: 'co.ke.nexora.ai://' },
  },
};

export default config;
