import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { VendaStack } from "./VendaStack";
import { MeusIngressosScreen } from "../screens/cliente/MeusIngressosScreen";
import { SairBotao } from "./SairBotao";
import { opcoesNavegacao, opcoesTabs } from "../theme";

const Tab = createBottomTabNavigator();

export function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerRight: () => <SairBotao />, ...opcoesNavegacao, ...opcoesTabs }}
    >
      <Tab.Screen
        name="Sessoes"
        component={VendaStack}
        options={{
          title: "Sessões",
          headerShown: false,
          tabBarLabel: "Sessões",
          tabBarIcon: ({ color, size }) => <Ionicons name="film-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MeusIngressos"
        component={MeusIngressosScreen}
        options={{
          title: "Meus Ingressos",
          tabBarLabel: "Ingressos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
