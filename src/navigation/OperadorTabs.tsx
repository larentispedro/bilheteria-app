import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { VendaStack } from "./VendaStack";
import { ValidarIngressoScreen } from "../screens/operador/ValidarIngressoScreen";
import { GerenciaStack } from "./GerenciaStack";
import { SairBotao } from "./SairBotao";

const Tab = createBottomTabNavigator();

export function OperadorTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerRight: () => <SairBotao /> }}>
      <Tab.Screen
        name="Balcao"
        component={VendaStack}
        options={{ title: "Balcão", headerShown: false, tabBarLabel: "Balcão" }}
      />
      <Tab.Screen
        name="ValidarIngresso"
        component={ValidarIngressoScreen}
        options={{ title: "Validar entrada", tabBarLabel: "Validar" }}
      />
      <Tab.Screen
        name="Gerencia"
        component={GerenciaStack}
        options={{ headerShown: false, tabBarLabel: "Gerência" }}
      />
    </Tab.Navigator>
  );
}
