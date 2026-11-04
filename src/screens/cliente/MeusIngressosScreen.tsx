import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../api/client";
import { Badge, estilos } from "../../components/ui";
import { cores, espaco, raio, sombra } from "../../theme";
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
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={ingressos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: espaco.xxl }}>
            <Ionicons name="ticket-outline" size={40} color={cores.textoSecundario} />
            <Text style={{ color: cores.textoSecundario, marginTop: espaco.sm }}>
              Você ainda não tem ingressos.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ borderRadius: raio.lg, overflow: "hidden", marginBottom: espaco.md, ...sombra }}>
            <View style={{ backgroundColor: cores.primaria, padding: espaco.lg }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                {item.reserva.sessao.evento.titulo}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                {formatarData(item.reserva.sessao.dataHora)}
              </Text>
            </View>
            <View style={{ backgroundColor: cores.superficie, padding: espaco.lg }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ color: cores.textoSecundario, fontSize: 12 }}>ASSENTO</Text>
                  <Text style={{ fontWeight: "700", fontSize: 18, color: cores.texto }}>
                    {item.reserva.assento.fila}
                    {item.reserva.assento.numero}
                  </Text>
                </View>
                <Badge
                  texto={item.status === "UTILIZADO" ? "Utilizado" : "Válido"}
                  tom={item.status === "UTILIZADO" ? "utilizado" : "valido"}
                />
              </View>
              <View style={{ height: 1, backgroundColor: cores.borda, marginVertical: espaco.md }} />
              <Text style={{ fontSize: 11, color: cores.textoSecundario }}>CÓDIGO</Text>
              <Text style={{ fontFamily: "monospace", fontWeight: "700", color: cores.texto }}>
                {item.codigoUnico}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
