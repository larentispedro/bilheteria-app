import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { api, ApiError } from "../../../api/client";
import { Botao, Campo, Erro, Titulo, estilos } from "../../../components/ui";
import type { Evento } from "../../../types/api";

export function FilmesScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    api.get<Evento[]>("/eventos").then(setEventos);
  }, []);

  useFocusEffect(carregar);

  async function criar() {
    setErro(null);
    setSalvando(true);
    try {
      await api.post("/eventos", {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        duracaoMinutos: Number(duracao),
      });
      setTitulo("");
      setDescricao("");
      setDuracao("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível criar o filme/evento");
    } finally {
      setSalvando(false);
    }
  }

  function remover(id: number) {
    Alert.alert("Remover", "Deseja remover este filme/evento?", [
      { text: "Cancelar" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/eventos/${id}`);
            carregar();
          } catch (e) {
            setErro(e instanceof ApiError ? e.message : "Não foi possível remover");
          }
        },
      },
    ]);
  }

  return (
    <View style={estilos.tela}>
      <Titulo texto="Filmes / Eventos" />
      <Erro mensagem={erro} />
      <Campo label="Título" value={titulo} onChangeText={setTitulo} />
      <Campo label="Descrição (opcional)" value={descricao} onChangeText={setDescricao} />
      <Campo
        label="Duração (minutos)"
        value={duracao}
        onChangeText={setDuracao}
        keyboardType="numeric"
      />
      <Botao
        titulo="Adicionar"
        onPress={criar}
        carregando={salvando}
        desabilitado={!titulo || !duracao}
      />

      <FlatList
        style={{ marginTop: 16 }}
        data={eventos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={[estilos.cartao, { flexDirection: "row", justifyContent: "space-between" }]}>
            <View>
              <Text style={{ fontWeight: "700" }}>{item.titulo}</Text>
              <Text style={{ color: "#555" }}>{item.duracaoMinutos} min</Text>
            </View>
            <TouchableOpacity onPress={() => remover(item.id)}>
              <Text style={{ color: "#dc2626" }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
