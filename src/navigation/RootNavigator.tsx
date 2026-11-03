import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthStack } from "./AuthStack";
import { ClienteTabs } from "./ClienteTabs";
import { OperadorTabs } from "./OperadorTabs";

export function RootNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!usuario ? <AuthStack /> : usuario.papel === "OPERADOR" ? <OperadorTabs /> : <ClienteTabs />}
    </NavigationContainer>
  );
}
