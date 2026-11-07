import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../api/client";
import { BarraAcao, Botao, Carregando, Cartao, Erro } from "../../components/ui";
import { dataHoraCurta, real } from "../../format";
import { cores, espaco, larguras, raio } from "../../theme";
import type { AssentoMapa, Sessao } from "../../types/api";

type Estado = "livre" | "reservado" | "vendido" | "selecionado";

const PALETA: Record<Estado, { fundo: string; borda: string; texto: string }> = {
  livre: { fundo: cores.assentoLivreFundo, borda: cores.assentoLivreBorda, texto: cores.textoSecundario },
  selecionado: { fundo: cores.assentoSelecionado, borda: cores.assentoSelecionado, texto: "#fff" },
  reservado: { fundo: cores.assentoReservado, borda: cores.assentoReservado, texto: "#fff" },
  vendido: { fundo: cores.assentoVendido, borda: cores.assentoVendido, texto: "#fff" },
};

const GAP = 6;
const CORREDOR = 18;
const LARGURA_FILA = 22;

export function MapaAssentosScreen({ route, navigation }: { route: any; navigation: any }) {
  const sessao: Sessao = route.params.sessao;
  const [assentos, setAssentos] = useState<AssentoMapa[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [larguraMapa, setLarguraMapa] = useState(0);

  const carregar = useCallback(() => {
    setCarregando(true);
    setSelecionados([]);
    api
      .get<AssentoMapa[]>(`/sessoes/${sessao.id}/mapa-assentos`)
      .then(setAssentos)
      .finally(() => setCarregando(false));
  }, [sessao.id]);

  useFocusEffect(carregar);

  const filas = useMemo(() => {
    const agrupado = new Map<string, AssentoMapa[]>();
    for (const a of assentos) {
      const lista = agrupado.get(a.fila) ?? [];
      lista.push(a);
      agrupado.set(a.fila, lista);
    }
    return [...agrupado.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fila, lista]) => [fila, lista.sort((x, y) => x.numero - y.numero)] as const);
  }, [assentos]);

  const porFila = Math.max(1, ...filas.map(([, lista]) => lista.length));

  // Os assentos encolhem para caber na largura disponível, sem rolagem horizontal.
  const tamanho = useMemo(() => {
    if (!larguraMapa) return 34;
    const util = larguraMapa - LARGURA_FILA * 2 - CORREDOR - (porFila - 1) * GAP;
    return Math.max(22, Math.min(40, Math.floor(util / porFila)));
  }, [larguraMapa, porFila]);

  function alternar(assento: AssentoMapa) {
    if (assento.status !== "livre") return;
    setErro(null);
    setSelecionados((atual) =>
      atual.includes(assento.id) ? atual.filter((id) => id !== assento.id) : [...atual, assento.id],
    );
  }

  async function reservar() {
    setErro(null);
    setReservando(true);
    try {
      const resultado = await api.post<{
        reservas: Array<{ id: number }>;
        expiraEm: string;
        valorTotal: number;
      }>(`/sessoes/${sessao.id}/reservas`, { assentoIds: selecionados });
      navigation.navigate("Checkout", {
        sessao,
        reservaIds: resultado.reservas.map((r) => r.id),
        expiraEm: resultado.expiraEm,
        valorTotal: resultado.valorTotal,
        assentos: rotulosSelecionados,
      });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível reservar os assentos");
      carregar();
    } finally {
      setReservando(false);
    }
  }

  const rotulosSelecionados = assentos
    .filter((a) => selecionados.includes(a.id))
    .map((a) => `${a.fila}${a.numero}`);

  if (carregando) return <Carregando />;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          maxWidth: larguras.conteudo,
          alignSelf: "center",
          padding: espaco.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 19, fontWeight: "800", color: cores.texto }}>
          {sessao.evento.titulo}
        </Text>
        <Text style={{ color: cores.textoSecundario, marginTop: 2, marginBottom: espaco.lg, fontSize: 14 }}>
          {sessao.sala.nome} · {dataHoraCurta(sessao.dataHora)} · {real(sessao.preco)} por assento
        </Text>

        <Erro mensagem={erro} />

        <Cartao style={{ paddingHorizontal: espaco.md }}>
        {/* Tela do cinema */}
        <View style={{ alignItems: "center", marginBottom: espaco.xl }}>
          <View
            style={{
              height: 6,
              width: "72%",
              backgroundColor: cores.bordaForte,
              borderTopLeftRadius: raio.pill,
              borderTopRightRadius: raio.pill,
            }}
          />
          <Text
            style={{
              color: cores.textoTerciario,
              fontSize: 10,
              letterSpacing: 3,
              marginTop: 6,
              fontWeight: "700",
            }}
          >
            TELA
          </Text>
        </View>

        {/* Grade de assentos */}
        <View onLayout={(e) => setLarguraMapa(e.nativeEvent.layout.width)}>
          {filas.map(([fila, lista]) => {
            const meio = Math.ceil(lista.length / 2);
            return (
              <View
                key={fila}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: GAP, justifyContent: "center" }}
              >
                <Text style={{ width: LARGURA_FILA, fontWeight: "700", color: cores.textoTerciario, fontSize: 12 }}>
                  {fila}
                </Text>

                {lista.map((assento, indice) => {
                  const estado: Estado = selecionados.includes(assento.id)
                    ? "selecionado"
                    : (assento.status as Estado);
                  const paleta = PALETA[estado];
                  const ocupado = assento.status !== "livre";
                  return (
                    <View
                      key={assento.id}
                      style={{ marginLeft: indice === 0 ? 0 : indice === meio ? CORREDOR : GAP }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => alternar(assento)}
                        disabled={ocupado}
                        accessibilityLabel={`Assento ${fila}${assento.numero}, ${estado}`}
                        style={{
                          width: tamanho,
                          height: tamanho,
                          borderTopLeftRadius: 7,
                          borderTopRightRadius: 7,
                          borderBottomLeftRadius: 3,
                          borderBottomRightRadius: 3,
                          backgroundColor: paleta.fundo,
                          borderWidth: 1.5,
                          borderColor: paleta.borda,
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: ocupado ? 0.75 : 1,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: "700", color: paleta.texto }}>
                          {assento.numero}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}

                <View style={{ width: LARGURA_FILA }} />
              </View>
            );
          })}
        </View>

        {/* Legenda */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: espaco.lg,
            marginTop: espaco.xl,
            paddingTop: espaco.lg,
            borderTopWidth: 1,
            borderTopColor: cores.borda,
          }}
        >
          <Legenda estado="livre" texto="Livre" />
          <Legenda estado="selecionado" texto="Selecionado" />
          <Legenda estado="reservado" texto="Reservado" />
          <Legenda estado="vendido" texto="Vendido" />
        </View>
        </Cartao>
      </ScrollView>

      <BarraAcao>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: espaco.md,
            gap: espaco.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: cores.textoSecundario }}>
              {selecionados.length === 0
                ? "Nenhum assento selecionado"
                : `${selecionados.length} ${selecionados.length === 1 ? "assento" : "assentos"}`}
            </Text>
            <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 14 }} numberOfLines={1}>
              {rotulosSelecionados.join(", ") || "Toque nos assentos livres"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 12, color: cores.textoSecundario }}>Preço por assento</Text>
            <Text style={{ fontWeight: "800", color: cores.primaria, fontSize: 19 }}>
              {real(sessao.preco)}
            </Text>
          </View>
        </View>
        <Botao
          titulo="Reservar e ir para o pagamento"
          icone="arrow-forward"
          onPress={reservar}
          carregando={reservando}
          desabilitado={selecionados.length === 0}
        />
      </BarraAcao>
    </View>
  );
}

function Legenda({ estado, texto }: { estado: Estado; texto: string }) {
  const paleta = PALETA[estado];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View
        style={{
          width: 14,
          height: 14,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          backgroundColor: paleta.fundo,
          borderWidth: 1.5,
          borderColor: paleta.borda,
        }}
      />
      <Text style={{ fontSize: 12, color: cores.textoSecundario }}>{texto}</Text>
    </View>
  );
}
