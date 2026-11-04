import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Cartao, Titulo, estilos } from "../../../components/ui";
import { cores, espaco } from "../../../theme";

const ITENS = [
  { rota: "Filmes", titulo: "Filmes / Eventos", icone: "film-outline" as const },
  { rota: "Salas", titulo: "Salas e assentos", icone: "grid-outline" as const },
  { rota: "Sessoes", titulo: "Sessões", icone: "calendar-outline" as const },
  { rota: "Relatorios", titulo: "Relatórios", icone: "bar-chart-outline" as const },
];

export function MenuGerenciaScreen({ navigation }: { navigation: any }) {
  return (
    <View style={estilos.tela}>
      <Titulo texto="Gerência" />
      {ITENS.map((item) => (
        <TouchableOpacity key={item.rota} activeOpacity={0.7} onPress={() => navigation.navigate(item.rota)}>
          <Cartao style={{ flexDirection: "row", alignItems: "center", gap: espaco.md }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: cores.primariaClara,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={item.icone} size={22} color={cores.primaria} />
            </View>
            <Text style={{ flex: 1, fontWeight: "700", fontSize: 16, color: cores.texto }}>
              {item.titulo}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={cores.textoSecundario} />
          </Cartao>
        </TouchableOpacity>
      ))}
    </View>
  );
}
