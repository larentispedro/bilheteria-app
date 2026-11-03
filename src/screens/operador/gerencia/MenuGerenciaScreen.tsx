import { View } from "react-native";
import { Botao, Titulo, estilos } from "../../../components/ui";

export function MenuGerenciaScreen({ navigation }: { navigation: any }) {
  return (
    <View style={estilos.tela}>
      <Titulo texto="Gerência" />
      <Botao titulo="Filmes / Eventos" onPress={() => navigation.navigate("Filmes")} />
      <Botao titulo="Salas e assentos" onPress={() => navigation.navigate("Salas")} />
      <Botao titulo="Sessões" onPress={() => navigation.navigate("Sessoes")} />
      <Botao titulo="Relatórios" onPress={() => navigation.navigate("Relatorios")} />
    </View>
  );
}
