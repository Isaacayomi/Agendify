import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "Agendify",
  slug: config.slug ?? "agendify",
  extra: {
    ...(config.extra ?? {}),
    groqApiKey: process.env.GROQ_API_KEY,
  },
  android: {
    ...(config.android ?? {}),
    package: "com.devprime.agendify",
    googleServicesFile: "./google-services.json",
  },
  plugins: [
    ...(config.plugins ?? []),
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
  ],
});
