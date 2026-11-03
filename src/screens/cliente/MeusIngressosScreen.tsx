import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { api } from "../../api/client";
import { estilos } from "../../components/ui";
import type { Ingresso } from "../../types/api";

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function MeusIngressosScreen() {
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      api
        .get<Ingresso[]>("/ingressos/meus")
        .then((dados) => ativo && setIngressos(dados))
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
        data={ingressos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Você ainda não tem ingressos.</Text>}
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={{ fontWeight: "700" }}>{item.reserva.sessao.evento.titulo}</Text>
            <Text style={{ color: "#555" }}>{formatarData(item.reserva.sessao.dataHora)}</Text>
            <Text style={{ color: "#555" }}>
              Assento {item.reserva.assento.fila}
              {item.reserva.assento.numero}
            </Text>
            <Text style={{ fontFamily: "monospace", marginTop: 6 }}>{item.codigoUnico}</Text>
            <Text
              style={{
                marginTop: 4,
                fontWeight: "600",
                color: item.status === "UTILIZADO" ? "#999" : "#16a34a",
              }}
            >
              {item.status === "UTILIZADO" ? "Utilizado" : "Válido"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
