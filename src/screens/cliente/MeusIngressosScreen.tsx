import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl, Text } from "react-native";
import { api } from "../../api/client";
import { Carregando, Lista, Vazio } from "../../components/ui";
import { TicketIngresso } from "../../components/TicketIngresso";
import { cores, espaco } from "../../theme";
import type { Ingresso } from "../../types/api";

export function MeusIngressosScreen() {
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

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

  async function atualizar() {
    setAtualizando(true);
    await api.get<Ingresso[]>("/ingressos/meus").then(setIngressos).finally(() => setAtualizando(false));
  }

  if (carregando) return <Carregando />;

  return (
    <Lista
      data={ingressos}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: espaco.lg }}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.primaria} />
      }
      ListHeaderComponent={
        ingressos.length > 0 ? (
          <Text style={{ color: cores.textoSecundario, fontSize: 14, marginBottom: espaco.md }}>
            Apresente o código na entrada da sessão.
          </Text>
        ) : undefined
      }
      ListEmptyComponent={
        <Vazio
          icone="ticket-outline"
          texto={"Você ainda não tem ingressos.\nEscolha uma sessão para comprar."}
        />
      }
      renderItem={({ item }) => <TicketIngresso ingresso={item} />}
    />
  );
}
