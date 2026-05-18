// Load .env for local development and expose selected vars to Expo via `extra`.
// This lets the JS runtime read them through `Constants.expoConfig.extra`.
require("dotenv").config({ path: process.env.ENVFILE || ".env" });

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      EXPO_PUBLIC_SPOTIFY_CLIENT_ID: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET:
        process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET,
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      EXPO_PUBLIC_R2_PUBLIC_BASE_URL:
        process.env.EXPO_PUBLIC_R2_PUBLIC_BASE_URL,
      EXPO_PUBLIC_R2_MANIFEST_PATH: process.env.EXPO_PUBLIC_R2_MANIFEST_PATH,
      EXPO_PUBLIC_R2_MANIFEST_URL: process.env.EXPO_PUBLIC_R2_MANIFEST_URL,
      EXPO_PUBLIC_R2_SIGNER_URL: process.env.EXPO_PUBLIC_R2_SIGNER_URL,
    },
  };
};
