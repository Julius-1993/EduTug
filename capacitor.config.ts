import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.edtek.edutugofwar',
  appName: 'Edu Tug of War',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0c1a13',
      showSpinner: false,
    },
  },
}

export default config
