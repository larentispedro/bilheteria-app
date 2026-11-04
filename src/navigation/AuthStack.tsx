import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegistroScreen } from "../screens/auth/RegistroScreen";
import { opcoesNavegacao } from "../theme";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={opcoesNavegacao}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: "Cadastro" }} />
    </Stack.Navigator>
  );
}
