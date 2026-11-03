import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_TOKEN = "@bilheteria/token";

export const storage = {
  salvarToken(token: string) {
    return AsyncStorage.setItem(CHAVE_TOKEN, token);
  },
  obterToken() {
    return AsyncStorage.getItem(CHAVE_TOKEN);
  },
  removerToken() {
    return AsyncStorage.removeItem(CHAVE_TOKEN);
  },
};
