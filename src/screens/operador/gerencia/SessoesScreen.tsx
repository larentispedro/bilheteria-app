import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api, ApiError } from "../../../api/client";
import { Botao, Campo, Erro, Titulo, estilos } from "../../../components/ui";
import type { Evento, Sala, Sessao } from "../../../types/api";

function Seletor<T extends { id: number }>({
  itens,
  rotulo,
  selecionadoId,
  aoSelecionar,
}: {
  itens: T[];
  rotulo: (item: T) => string;
  selecionadoId: number | null;
  aoSelecionar: (id: number) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
      {itens.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => aoSelecionar(item.id)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            backgroundColor: selecionadoId === item.id ? "#2f5bea" : "#e5e5ea",
            marginRight: 8,
          }}
        >
          <Text style={{ color: selecionadoId === item.id ? "#fff" : "#333" }}>{rotulo(item)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export function SessoesScreen() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const [eventoId, setEventoId] = useState<number | null>(null);
  const [salaId, setSalaId] = useState<number | null>(null);
  const [dataHora, setDataHora] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    api.get<Sessao[]>("/sessoes").then(setSessoes);
    api.get<Evento[]>("/eventos").then(setEventos);
    api.get<Sala[]>("/salas").then((dados) => setSalas(dados.filter((s) => s.assentos.length > 0)));
  }, []);

  useFocusEffect(carregar);

  async function criar() {
    setErro(null);
    setSalvando(true);
    try {
      await api.post("/sessoes", {
        eventoId,
        salaId,
        dataHora: new Date(dataHora).toISOString(),
        preco: Number(preco),
      });
      setEventoId(null);
      setSalaId(null);
      setDataHora("");
      setPreco("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível criar a sessão");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <Titulo texto="Sessões" />
      <Erro mensagem={erro} />

      <Text style={{ marginBottom: 6, fontSize: 13, color: "#444" }}>Filme/Evento</Text>
      <Seletor itens={eventos} rotulo={(e) => e.titulo} selecionadoId={eventoId} aoSelecionar={setEventoId} />

      <Text style={{ marginBottom: 6, fontSize: 13, color: "#444" }}>Sala</Text>
      <Seletor itens={salas} rotulo={(s) => s.nome} selecionadoId={salaId} aoSelecionar={setSalaId} />

      <Campo
        label="Data/hora (ex.: 2026-12-01 20:00)"
        value={dataHora}
        onChangeText={setDataHora}
      />
      <Campo label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="numeric" />

      <Botao
        titulo="Criar sessão"
        onPress={criar}
        carregando={salvando}
        desabilitado={!eventoId || !salaId || !dataHora || !preco}
      />

      <FlatList
        style={{ marginTop: 16 }}
        data={sessoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={{ fontWeight: "700" }}>{item.evento.titulo}</Text>
            <Text style={{ color: "#555" }}>
              {item.sala.nome} - {new Date(item.dataHora).toLocaleString("pt-BR")}
            </Text>
            <Text>R$ {Number(item.preco).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
