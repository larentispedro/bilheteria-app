import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuGerenciaScreen } from "../screens/operador/gerencia/MenuGerenciaScreen";
import { FilmesScreen } from "../screens/operador/gerencia/FilmesScreen";
import { SalasScreen } from "../screens/operador/gerencia/SalasScreen";
import { SessoesScreen } from "../screens/operador/gerencia/SessoesScreen";
import { RelatoriosScreen } from "../screens/operador/gerencia/RelatoriosScreen";
import { UsuariosScreen } from "../screens/operador/gerencia/UsuariosScreen";
import { SairBotao } from "./SairBotao";
import { opcoesNavegacao } from "../theme";

const Stack = createNativeStackNavigator();

export function GerenciaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <SairBotao />, ...opcoesNavegacao }}>
      <Stack.Screen name="MenuGerencia" component={MenuGerenciaScreen} options={{ title: "Gerência" }} />
      <Stack.Screen name="Filmes" component={FilmesScreen} options={{ title: "Filmes / Eventos" }} />
      <Stack.Screen name="Salas" component={SalasScreen} options={{ title: "Salas" }} />
      <Stack.Screen name="Sessoes" component={SessoesScreen} options={{ title: "Sessões" }} />
      <Stack.Screen name="Relatorios" component={RelatoriosScreen} options={{ title: "Relatórios" }} />
      <Stack.Screen name="Usuarios" component={UsuariosScreen} options={{ title: "Usuários" }} />
    </Stack.Navigator>
  );
}
