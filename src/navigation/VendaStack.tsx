import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ListaSessoesScreen } from "../screens/venda/ListaSessoesScreen";
import { MapaAssentosScreen } from "../screens/venda/MapaAssentosScreen";
import { CheckoutScreen } from "../screens/venda/CheckoutScreen";
import { SairBotao } from "./SairBotao";
import { opcoesNavegacao } from "../theme";

const Stack = createNativeStackNavigator();

export function VendaStack() {
  return (
    <Stack.Navigator screenOptions={opcoesNavegacao}>
      <Stack.Screen
        name="ListaSessoes"
        component={ListaSessoesScreen}
        options={{ title: "Sessões", headerRight: () => <SairBotao /> }}
      />
      <Stack.Screen
        name="MapaAssentos"
        component={MapaAssentosScreen}
        options={{ title: "Mapa de assentos" }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Pagamento" }} />
    </Stack.Navigator>
  );
}
