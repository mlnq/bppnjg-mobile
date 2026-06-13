const appJson = require('./app.json');

const VARIANT_CONFIG = {
  development: {
    appId: 'pl.bppnjg.app.dev',
    displayName: 'bppnjg_dev',
    enableFirebase: false,
  },
  preview: {
    appId: 'pl.bppnjg.app',
    displayName: 'bppnjg-mobile Preview',
    enableFirebase: false,
  },
  production: {
    appId: 'pl.bppnjg.app',
    displayName: 'bppnjg-mobile',
    enableFirebase: true,
  },
};

function getApiBaseUrlForVariant(variant) {
  const variantKey = `EXPO_PUBLIC_API_BASE_URL_${variant.toUpperCase()}`;
  const variantValue = process.env[variantKey];

  if (variantValue) {
    return variantValue;
  }

  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  if (variant === 'development') {
    return 'http://localhost:3001';
  }

  return 'https://pilgrimage-admin.bppnjg.workers.dev';
}

module.exports = () => {
  const variant = process.env.APP_VARIANT || 'production';
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.production;
  const enableFirebase = process.env.APP_ENABLE_FIREBASE === 'true' || variantConfig.enableFirebase;
  const apiBaseUrl = getApiBaseUrlForVariant(variant);

  return {
    ...appJson.expo,
    name: variantConfig.displayName,
    scheme: variantConfig.appId,
    ios: {
      ...appJson.expo.ios,
      bundleIdentifier: variantConfig.appId,
      googleServicesFile: enableFirebase ? './config/GoogleService-Info.plist' : undefined,
    },
    android: {
      ...appJson.expo.android,
      package: variantConfig.appId,
      googleServicesFile: enableFirebase ? './config/google-services.json' : undefined,
    },
    extra: {
      ...appJson.expo.extra,
      appVariant: variant,
      appId: variantConfig.appId,
      apiBaseUrl,
    },
  };
};
