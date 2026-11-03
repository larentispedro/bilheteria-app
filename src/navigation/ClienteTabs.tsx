import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { VendaStack } from "./VendaStack";
import { MeusIngressosScreen } from "../screens/cliente/MeusIngressosScreen";
import { SairBotao } from "./SairBotao";

const Tab = createBottomTabNavigator();

export function ClienteTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerRight: () => <SairBotao /> }}>
      <Tab.Screen
        name="Sessoes"
        component={VendaStack}
        options={{ title: "Sessões", headerShown: false, tabBarLabel: "Sessões" }}
      />
      <Tab.Screen
        name="MeusIngressos"
        component={MeusIngressosScreen}
        options={{ title: "Meus Ingressos", tabBarLabel: "Ingressos" }}
      />
    </Tab.Navigator>
  );
}
