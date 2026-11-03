import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { estilos } from "../../components/ui";
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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={sessoes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma sessão disponível no momento.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.cartao}
            onPress={() => navigation.navigate("MapaAssentos", { sessao: item })}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>{item.evento.titulo}</Text>
            <Text style={{ color: "#555", marginTop: 4 }}>{item.sala.nome}</Text>
            <Text style={{ color: "#555" }}>{formatarData(item.dataHora)}</Text>
            <Text style={{ marginTop: 4, fontWeight: "600" }}>
              R$ {Number(item.preco).toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
