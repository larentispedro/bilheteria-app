import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../api/client";
import { Badge, Carregando, Subtitulo, Vazio, estilos as estilosTela } from "../../components/ui";
import { hora as formatarHora, real } from "../../format";
import { cores, espaco, larguras, raio, sombra } from "../../theme";
import type { Sessao } from "../../types/api";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

function partesDaData(iso: string) {
  const d = new Date(iso);
  return {
    dia: String(d.getDate()).padStart(2, "0"),
    mes: MESES[d.getMonth()],
    hora: formatarHora(d),
  };
}

export function ListaSessoesScreen({ navigation }: { navigation: any }) {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [anterioresAbertas, setAnterioresAbertas] = useState(false);

  const buscar = useCallback(() => api.get<Sessao[]>("/sessoes").then(setSessoes), []);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      api
        .get<Sessao[]>("/sessoes")
        .then((dados) => ativo && setSessoes(dados))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function atualizar() {
    setAtualizando(true);
    await buscar().finally(() => setAtualizando(false));
  }

  if (carregando) return <Carregando />;

  // Quem decide se a sessão ainda pode ser vendida é o backend (campo `encerrada`);
  // aqui só separamos visualmente o que já veio marcado.
  const emCartaz = sessoes.filter((s) => !s.encerrada);
  const anteriores = sessoes.filter((s) => s.encerrada);

  return (
    <ScrollView
      style={estilosTela.telaExterna}
      contentContainerStyle={[estilosTela.conteudoRolavel, { maxWidth: larguras.conteudo }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.primaria} />}
    >
      {emCartaz.length === 0 && anteriores.length === 0 ? (
        <Vazio icone="film-outline" texto="Nenhuma sessão disponível no momento." />
      ) : (
        <>
          {emCartaz.length > 0 ? (
            <Text style={{ color: cores.textoSecundario, fontSize: 14, marginBottom: espaco.md }}>
              {emCartaz.length} {emCartaz.length === 1 ? "sessão disponível" : "sessões disponíveis"}
            </Text>
          ) : (
            <Vazio icone="film-outline" texto="Nenhuma sessão em cartaz no momento." />
          )}

          {emCartaz.map((item) => (
            <CartaoSessao
              key={item.id}
              item={item}
              onPress={() => navigation.navigate("MapaAssentos", { sessao: item })}
            />
          ))}
        </>
      )}

      {anteriores.length > 0 && (
        <View style={{ marginTop: espaco.lg }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAnterioresAbertas((aberta) => !aberta)}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <Subtitulo texto={`Sessões anteriores (${anteriores.length})`} />
            <Ionicons
              name={anterioresAbertas ? "chevron-up" : "chevron-down"}
              size={18}
              color={cores.textoTerciario}
            />
          </TouchableOpacity>

          {anterioresAbertas &&
            anteriores.map((item) => <CartaoSessao key={item.id} item={item} encerrada />)}
        </View>
      )}
    </ScrollView>
  );
}

function CartaoSessao({
  item,
  onPress,
  encerrada = false,
}: {
  item: Sessao;
  onPress?: () => void;
  encerrada?: boolean;
}) {
  const { dia, mes, hora } = partesDaData(item.dataHora);
  return (
    <TouchableOpacity
      activeOpacity={encerrada ? 1 : 0.7}
      disabled={encerrada}
      onPress={onPress}
      style={[estiloCartao, encerrada && estiloCartaoEncerrado]}
    >
      {/* bloco de data */}
      <View
        style={{
          width: 54,
          borderRadius: raio.md,
          backgroundColor: cores.primariaClara,
          paddingVertical: espaco.sm,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 19, fontWeight: "800", color: cores.primaria, lineHeight: 22 }}>
          {dia}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: "700", color: cores.primaria, letterSpacing: 0.5 }}>
          {mes}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", fontSize: 16, color: cores.texto }} numberOfLines={1}>
          {item.evento.titulo}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 }}>
          <Ionicons name="time-outline" size={14} color={cores.textoSecundario} />
          <Text style={{ color: cores.textoSecundario, fontSize: 13 }}>{hora}</Text>
          <Text style={{ color: cores.bordaForte }}>|</Text>
          <Ionicons name="location-outline" size={14} color={cores.textoSecundario} />
          <Text style={{ color: cores.textoSecundario, fontSize: 13 }} numberOfLines={1}>
            {item.sala.nome}
          </Text>
        </View>
        <Text style={{ marginTop: 8, fontWeight: "800", color: cores.texto, fontSize: 15 }}>
          {real(item.preco)}
        </Text>
      </View>

      {encerrada ? (
        <Badge texto="Encerrada" tom="utilizado" />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={cores.textoTerciario} />
      )}
    </TouchableOpacity>
  );
}

const estiloCartao = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: espaco.md,
  backgroundColor: cores.superficie,
  borderRadius: raio.lg,
  borderWidth: 1,
  borderColor: cores.borda,
  padding: espaco.md,
  marginBottom: espaco.md,
  ...sombra,
};

const estiloCartaoEncerrado = { opacity: 0.6 };
