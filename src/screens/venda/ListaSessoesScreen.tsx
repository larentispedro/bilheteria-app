import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../api/client";
import { Cartao, estilos } from "../../components/ui";
import { cores, espaco } from "../../theme";
import type { Sessao } from "../../types/api";

function formatarData(iso: string) {
  const data = new Date(iso);
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function ListaSessoesScreen({ navigation }: { navigation: any }) {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      api
        .get<Sessao[]>("/sessoes")
        .then((dados) => ativo && setSessoes(dados))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando) {
    return (
      <View style={[estilos.tela, { justifyContent: "center" }]}>
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={sessoes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: espaco.xxl }}>
            <Ionicons name="film-outline" size={40} color={cores.textoSecundario} />
            <Text style={{ color: cores.textoSecundario, marginTop: espaco.sm }}>
              Nenhuma sessão disponível no momento.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("MapaAssentos", { sessao: item })}>
            <Cartao style={{ flexDirection: "row", alignItems: "center", gap: espaco.md }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: cores.primariaClara,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="film" size={24} color={cores.primaria} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 16, color: cores.texto }}>
                  {item.evento.titulo}
                </Text>
                <Text style={{ color: cores.textoSecundario, marginTop: 2 }}>
                  {item.sala.nome} · {formatarData(item.dataHora)}
                </Text>
                <Text style={{ marginTop: 4, fontWeight: "700", color: cores.primaria }}>
                  R$ {Number(item.preco).toFixed(2)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={cores.textoSecundario} />
            </Cartao>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
