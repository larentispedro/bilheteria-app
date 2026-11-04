import { DefaultTheme, NavigationContainer, type Theme } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { ClienteTabs } from "./ClienteTabs";
import { OperadorTabs } from "./OperadorTabs";
import { cores } from "../theme";

const tema: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: cores.fundo, primary: cores.primaria },
};

export function RootNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={tema}>
      {!usuario ? <AuthStack /> : usuario.papel === "OPERADOR" ? <OperadorTabs /> : <ClienteTabs />}
    </NavigationContainer>
  );
}
