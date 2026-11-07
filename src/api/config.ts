import { Platform } from "react-native";

// Em produção, define EXPO_PUBLIC_API_URL (ex.: https://bilheteria-api.onrender.com)
// no .env do frontend. Sem essa variável, cai no backend local:
// no modo web, localhost funciona direto; no emulador Android, é 10.0.2.2.
const URL_LOCAL = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? URL_LOCAL;
