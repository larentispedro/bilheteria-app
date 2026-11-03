import { Platform } from "react-native";

// Ajuste para o endereço do backend. No modo web, localhost funciona direto.
// Em emulador Android, localhost do computador é 10.0.2.2.
export const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
