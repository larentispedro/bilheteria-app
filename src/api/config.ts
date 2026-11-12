import { Platform } from "react-native";

// Em produção, define EXPO_PUBLIC_API_URL (ex.: https://bilheteria-api.onrender.com)
// no .env do frontend. Sem essa variável, cai no backend local:
// no modo web, localhost funciona direto; no emulador Android, é 10.0.2.2.
const URL_LOCAL = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

// || (não ??): se a variável existir mas vier vazia, cai no valor local em
// vez de virar API_URL = "" e quebrar todas as chamadas com caminho relativo.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || URL_LOCAL;
