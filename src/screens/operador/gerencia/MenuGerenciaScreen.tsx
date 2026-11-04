import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TelaRolavel, Titulo } from "../../../components/ui";
import { cores, espaco, raio, sombra } from "../../../theme";

const ITENS = [
  {
    rota: "Filmes",
    titulo: "Filmes e eventos",
    descricao: "Título, descrição e duração",
    icone: "film-outline" as const,
  },
  {
    rota: "Salas",
    titulo: "Salas e assentos",
    descricao: "Fileiras e numeração de cada sala",
    icone: "grid-outline" as const,
  },
  {
    rota: "Sessoes",
    titulo: "Sessões",
    descricao: "Filme, sala, data/hora e preço",
    icone: "calendar-outline" as const,
  },
  {
    rota: "Relatorios",
    titulo: "Relatórios",
    descricao: "Vendas e taxa de ocupação",
    icone: "bar-chart-outline" as const,
  },
];

export function MenuGerenciaScreen({ navigation }: { navigation: any }) {
  return (
    <TelaRolavel>
      <Titulo texto="Gerência" apoio="Cadastros e acompanhamento do cinema." />
      {ITENS.map((item) => (
        <TouchableOpacity
          key={item.rota}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(item.rota)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: espaco.md,
            backgroundColor: cores.superficie,
            borderRadius: raio.lg,
            borderWidth: 1,
            borderColor: cores.borda,
            padding: espaco.lg,
            marginBottom: espaco.md,
            ...sombra,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: raio.md,
              backgroundColor: cores.primariaClara,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={item.icone} size={21} color={cores.primaria} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: cores.texto }}>{item.titulo}</Text>
            <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 1 }}>
              {item.descricao}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={cores.textoTerciario} />
        </TouchableOpacity>
      ))}
    </TelaRolavel>
  );
}
