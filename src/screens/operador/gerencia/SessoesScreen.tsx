import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../../api/client";
import { dataHoraCurta, real } from "../../../format";
import {
  Botao,
  Campo,
  Cartao,
  Erro,
  Subtitulo,
  TelaRolavel,
  Titulo,
  Vazio,
} from "../../../components/ui";
import { cores, espaco, raio } from "../../../theme";
import type { Evento, Sala, Sessao } from "../../../types/api";

/** Converte "01/12/2026" + "20:00" em Date no fuso local. Devolve null se inválido. */
function montarDataHora(data: string, hora: string): Date | null {
  const d = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.trim());
  const h = /^(\d{1,2}):(\d{2})$/.exec(hora.trim());
  if (!d || !h) return null;
  const [, dia, mes, ano] = d;
  const [, hh, mm] = h;
  const resultado = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hh), Number(mm));
  const coerente =
    resultado.getDate() === Number(dia) &&
    resultado.getMonth() === Number(mes) - 1 &&
    Number(hh) < 24 &&
    Number(mm) < 60;
  return coerente ? resultado : null;
}

function Opcoes<T extends { id: number }>({
  itens,
  rotulo,
  selecionadoId,
  aoSelecionar,
  vazio,
}: {
  itens: T[];
  rotulo: (item: T) => string;
  selecionadoId: number | null;
  aoSelecionar: (id: number) => void;
  vazio: string;
}) {
  if (itens.length === 0) {
    return <Text style={{ color: cores.textoTerciario, fontSize: 13, marginBottom: espaco.md }}>{vazio}</Text>;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: espaco.sm, paddingBottom: 2 }}
      style={{ marginBottom: espaco.md }}
    >
      {itens.map((item) => {
        const ativo = selecionadoId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => aoSelecionar(item.id)}
            style={{
              paddingHorizontal: espaco.md,
              paddingVertical: 9,
              borderRadius: raio.pill,
              backgroundColor: ativo ? cores.primaria : cores.superficie,
              borderWidth: 1,
              borderColor: ativo ? cores.primaria : cores.bordaForte,
            }}
          >
            <Text style={{ color: ativo ? "#fff" : cores.texto, fontWeight: "600", fontSize: 13 }}>
              {rotulo(item)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function SessoesScreen() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const [eventoId, setEventoId] = useState<number | null>(null);
  const [salaId, setSalaId] = useState<number | null>(null);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    api.get<Sessao[]>("/sessoes").then(setSessoes);
    api.get<Evento[]>("/eventos").then(setEventos);
    api.get<Sala[]>("/salas").then((d) => setSalas(d.filter((s) => s.assentos.length > 0)));
  }, []);

  useFocusEffect(carregar);

  const quando = montarDataHora(data, hora);
  const precoValido = Number(preco.replace(",", ".")) > 0;
  const podeCriar = !!eventoId && !!salaId && !!quando && precoValido;

  async function criar() {
    setErro(null);
    if (!quando) return setErro("Data ou hora inválida. Use DD/MM/AAAA e HH:MM.");
    if (quando.getTime() <= Date.now()) return setErro("A sessão precisa ser em uma data futura.");

    setSalvando(true);
    try {
      await api.post("/sessoes", {
        eventoId,
        salaId,
        dataHora: quando.toISOString(),
        preco: Number(preco.replace(",", ".")),
      });
      setEventoId(null);
      setSalaId(null);
      setData("");
      setHora("");
      setPreco("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível criar a sessão");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TelaRolavel>
      <Titulo texto="Sessões" apoio="Um filme, uma sala, uma data e um preço." />
      <Erro mensagem={erro} />

      <Cartao>
        <Text style={rotuloCampo}>Filme / evento</Text>
        <Opcoes
          itens={eventos}
          rotulo={(e) => e.titulo}
          selecionadoId={eventoId}
          aoSelecionar={setEventoId}
          vazio="Cadastre um filme ou evento primeiro."
        />

        <Text style={rotuloCampo}>Sala</Text>
        <Opcoes
          itens={salas}
          rotulo={(s) => `${s.nome} · ${s.assentos.length} lugares`}
          selecionadoId={salaId}
          aoSelecionar={setSalaId}
          vazio="Nenhuma sala com assentos cadastrados."
        />

        <View style={{ flexDirection: "row", gap: espaco.md }}>
          <View style={{ flex: 3 }}>
            <Campo
              label="Data"
              value={data}
              onChangeText={setData}
              placeholder="DD/MM/AAAA"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View style={{ flex: 2 }}>
            <Campo
              label="Hora"
              value={hora}
              onChangeText={setHora}
              placeholder="20:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <Campo
          label="Preço do ingresso"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
          placeholder="25,00"
          dica="Em reais."
        />

        {quando && (
          <Text style={{ color: cores.textoSecundario, fontSize: 13, marginBottom: espaco.md }}>
            Sessão em{" "}
            <Text style={{ fontWeight: "700", color: cores.texto }}>
              {quando.toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}
            </Text>
          </Text>
        )}

        <Botao
          titulo="Criar sessão"
          icone="add"
          onPress={criar}
          carregando={salvando}
          desabilitado={!podeCriar}
        />
      </Cartao>

      <Subtitulo texto={`Cadastradas (${sessoes.length})`} />

      {sessoes.length === 0 ? (
        <Vazio icone="calendar-outline" texto="Nenhuma sessão cadastrada ainda." />
      ) : (
        sessoes.map((item) => (
          <Cartao key={item.id} style={{ paddingVertical: espaco.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: espaco.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>
                  {item.evento.titulo}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <Ionicons name="calendar-outline" size={13} color={cores.textoSecundario} />
                  <Text style={{ color: cores.textoSecundario, fontSize: 13 }}>
                    {dataHoraCurta(item.dataHora)}
                  </Text>
                  <Text style={{ color: cores.bordaForte }}>|</Text>
                  <Text style={{ color: cores.textoSecundario, fontSize: 13 }}>{item.sala.nome}</Text>
                </View>
              </View>
              <Text style={{ fontWeight: "800", color: cores.texto, fontSize: 15 }}>
                {real(item.preco)}
              </Text>
            </View>
          </Cartao>
        ))
      )}
    </TelaRolavel>
  );
}

const rotuloCampo = {
  fontSize: 13,
  color: cores.texto,
  marginBottom: 6,
  fontWeight: "600" as const,
};
