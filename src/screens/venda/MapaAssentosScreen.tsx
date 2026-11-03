import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api, ApiError } from "../../api/client";
import { Botao, Erro, Titulo, estilos } from "../../components/ui";
import type { AssentoMapa, Sessao } from "../../types/api";

const CORES: Record<string, string> = {
  livre: "#ffffff",
  reservado: "#fbbf24",
  vendido: "#dc2626",
  selecionado: "#2f5bea",
};

export function MapaAssentosScreen({ route, navigation }: { route: any; navigation: any }) {
  const sessao: Sessao = route.params.sessao;
  const [assentos, setAssentos] = useState<AssentoMapa[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    setSelecionados([]);
    api
      .get<AssentoMapa[]>(`/sessoes/${sessao.id}/mapa-assentos`)
      .then(setAssentos)
      .finally(() => setCarregando(false));
  }, [sessao.id]);

  useFocusEffect(carregar);

  function alternarAssento(assento: AssentoMapa) {
    if (assento.status !== "livre") return;
    setSelecionados((atual) =>
      atual.includes(assento.id) ? atual.filter((id) => id !== assento.id) : [...atual, assento.id],
    );
  }

  async function confirmarReserva() {
    setErro(null);
    setReservando(true);
    try {
      const resultado = await api.post<{ reservas: Array<{ id: number }>; expiraEm: string }>(
        `/sessoes/${sessao.id}/reservas`,
        { assentoIds: selecionados },
      );
      navigation.navigate("Checkout", {
        sessao,
        reservaIds: resultado.reservas.map((r) => r.id),
        expiraEm: resultado.expiraEm,
        quantidade: selecionados.length,
      });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível reservar os assentos");
      carregar();
    } finally {
      setReservando(false);
    }
  }

  if (carregando) {
    return (
      <View style={[estilos.tela, { justifyContent: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const filas = [...new Set(assentos.map((a) => a.fila))].sort();

  return (
    <View style={estilos.tela}>
      <Titulo texto={`${sessao.evento.titulo} - ${sessao.sala.nome}`} />
      <Erro mensagem={erro} />
      <ScrollView>
        {filas.map((fila) => (
          <View key={fila} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ width: 24, fontWeight: "700" }}>{fila}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
              {assentos
                .filter((a) => a.fila === fila)
                .map((assento) => {
                  const cor = selecionados.includes(assento.id)
                    ? CORES.selecionado
                    : CORES[assento.status];
                  return (
                    <TouchableOpacity
                      key={assento.id}
                      onPress={() => alternarAssento(assento)}
                      disabled={assento.status !== "livre"}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 6,
                        backgroundColor: cor,
                        borderWidth: 1,
                        borderColor: "#999",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: selecionados.includes(assento.id) || assento.status === "vendido"
                            ? "#fff"
                            : "#333",
                        }}
                      >
                        {assento.numero}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
        <LegendaCor cor={CORES.livre} texto="Livre" />
        <LegendaCor cor={CORES.reservado} texto="Reservado" />
        <LegendaCor cor={CORES.vendido} texto="Vendido" />
        <LegendaCor cor={CORES.selecionado} texto="Selecionado" />
      </View>

      <Text style={{ marginBottom: 8 }}>{selecionados.length} assento(s) selecionado(s)</Text>
      <Botao
        titulo="Reservar assentos selecionados"
        onPress={confirmarReserva}
        carregando={reservando}
        desabilitado={selecionados.length === 0}
      />
    </View>
  );
}

function LegendaCor({ cor, texto }: { cor: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <View style={{ width: 12, height: 12, backgroundColor: cor, borderWidth: 1, borderColor: "#999" }} />
      <Text style={{ fontSize: 11 }}>{texto}</Text>
    </View>
  );
}
