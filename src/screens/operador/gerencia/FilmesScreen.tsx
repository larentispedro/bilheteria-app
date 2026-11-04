import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../../api/client";
import { Botao, Campo, Cartao, Erro, Subtitulo, Titulo, estilos } from "../../../components/ui";
import { cores, espaco } from "../../../theme";
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
      <Cartao>
        <Campo label="Título" value={titulo} onChangeText={setTitulo} placeholder="Nome do filme/evento" />
        <Campo
          label="Descrição (opcional)"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Sinopse ou observações"
        />
        <Campo
          label="Duração (minutos)"
          value={duracao}
          onChangeText={setDuracao}
          keyboardType="numeric"
          placeholder="120"
        />
        <Botao
          titulo="Adicionar"
          onPress={criar}
          carregando={salvando}
          desabilitado={!titulo || !duracao}
        />
      </Cartao>

      <Subtitulo texto={`Cadastrados (${eventos.length})`} />
      <FlatList
        data={eventos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Cartao style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontWeight: "700", color: cores.texto }}>{item.titulo}</Text>
              <Text style={{ color: cores.textoSecundario }}>{item.duracaoMinutos} min</Text>
            </View>
            <TouchableOpacity onPress={() => remover(item.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={20} color={cores.perigo} />
            </TouchableOpacity>
          </Cartao>
        )}
      />
    </View>
  );
}
