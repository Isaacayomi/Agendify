import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "Agendify",
  slug: config.slug ?? "agendify",
  extra: {
    ...(config.extra ?? {}),
    groqApiKey: process.env.GROQ_API_KEY,
  },
});
