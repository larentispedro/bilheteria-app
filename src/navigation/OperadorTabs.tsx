import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { VendaStack } from "./VendaStack";
import { ValidarIngressoScreen } from "../screens/operador/ValidarIngressoScreen";
import { GerenciaStack } from "./GerenciaStack";
import { SairBotao } from "./SairBotao";
import { opcoesNavegacao, opcoesTabs } from "../theme";

const Tab = createBottomTabNavigator();

export function OperadorTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerRight: () => <SairBotao />, ...opcoesNavegacao, ...opcoesTabs }}
    >
      <Tab.Screen
        name="Balcao"
        component={VendaStack}
        options={{
          title: "Balcão",
          headerShown: false,
          tabBarLabel: "Balcão",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ValidarIngresso"
        component={ValidarIngressoScreen}
        options={{
          title: "Validar entrada",
          tabBarLabel: "Validar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Gerencia"
        component={GerenciaStack}
        options={{
          headerShown: false,
          tabBarLabel: "Gerência",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
