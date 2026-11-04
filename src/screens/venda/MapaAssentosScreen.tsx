import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api, ApiError } from "../../api/client";
import { Botao, Erro, Titulo, estilos } from "../../components/ui";
import { cores, espaco, raio } from "../../theme";
import type { AssentoMapa, Sessao } from "../../types/api";

const CORES_ASSENTO: Record<string, { fundo: string; borda: string; texto: string }> = {
  livre: { fundo: "#ffffff", borda: cores.borda, texto: cores.texto },
  reservado: { fundo: cores.aviso, borda: cores.aviso, texto: "#fff" },
  vendido: { fundo: cores.perigo, borda: cores.perigo, texto: "#fff" },
  selecionado: { fundo: cores.primaria, borda: cores.primaria, texto: "#fff" },
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
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  const filas = [...new Set(assentos.map((a) => a.fila))].sort();

  return (
    <View style={estilos.tela}>
      <Titulo texto={sessao.evento.titulo} />
      <Text style={{ color: cores.textoSecundario, marginTop: -8, marginBottom: espaco.md }}>
        {sessao.sala.nome}
      </Text>
      <Erro mensagem={erro} />

      <View
        style={{
          height: 8,
          borderRadius: raio.pill,
          backgroundColor: cores.borda,
          marginHorizontal: 30,
          marginBottom: 6,
        }}
      />
      <Text
        style={{
          textAlign: "center",
          color: cores.textoSecundario,
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: espaco.lg,
        }}
      >
        TELA
      </Text>

      <ScrollView>
        {filas.map((fila) => (
          <View key={fila} style={{ flexDirection: "row", alignItems: "center", marginBottom: espaco.sm }}>
            <Text style={{ width: 20, fontWeight: "700", color: cores.textoSecundario }}>{fila}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
              {assentos
                .filter((a) => a.fila === fila)
                .map((assento) => {
                  const paleta = selecionados.includes(assento.id)
                    ? CORES_ASSENTO.selecionado
                    : CORES_ASSENTO[assento.status];
                  return (
                    <TouchableOpacity
                      key={assento.id}
                      activeOpacity={0.7}
                      onPress={() => alternarAssento(assento)}
                      disabled={assento.status !== "livre"}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: paleta.fundo,
                        borderWidth: 1.5,
                        borderColor: paleta.borda,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "600", color: paleta.texto }}>
                        {assento.numero}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: espaco.md, marginVertical: espaco.md }}>
        <LegendaCor cor={CORES_ASSENTO.livre.fundo} borda={CORES_ASSENTO.livre.borda} texto="Livre" />
        <LegendaCor cor={CORES_ASSENTO.reservado.fundo} texto="Reservado" />
        <LegendaCor cor={CORES_ASSENTO.vendido.fundo} texto="Vendido" />
        <LegendaCor cor={CORES_ASSENTO.selecionado.fundo} texto="Selecionado" />
      </View>

      <Text style={{ marginBottom: espaco.sm, color: cores.textoSecundario, fontWeight: "600" }}>
        {selecionados.length} assento(s) selecionado(s)
      </Text>
      <Botao
        titulo="Reservar assentos selecionados"
        onPress={confirmarReserva}
        carregando={reservando}
        desabilitado={selecionados.length === 0}
      />
    </View>
  );
}

function LegendaCor({ cor, borda, texto }: { cor: string; borda?: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: cor,
          borderWidth: 1.5,
          borderColor: borda ?? cor,
        }}
      />
      <Text style={{ fontSize: 12, color: cores.textoSecundario }}>{texto}</Text>
    </View>
  );
}
