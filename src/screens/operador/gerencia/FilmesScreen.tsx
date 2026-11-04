import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../../api/client";
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
import { cores, espaco } from "../../../theme";
import type { Evento } from "../../../types/api";

/** Alert.alert não existe na web; cai para window.confirm. */
function confirmar(titulo: string, mensagem: string, aoConfirmar: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: "Cancelar", style: "cancel" },
    { text: "Remover", style: "destructive", onPress: aoConfirmar },
  ]);
}

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

  const duracaoValida = Number(duracao) > 0;

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

  function remover(evento: Evento) {
    confirmar("Remover filme/evento", `Deseja remover "${evento.titulo}"?`, async () => {
      setErro(null);
      try {
        await api.delete(`/eventos/${evento.id}`);
        carregar();
      } catch (e) {
        setErro(e instanceof ApiError ? e.message : "Não foi possível remover");
      }
    });
  }

  return (
    <TelaRolavel>
      <Titulo texto="Filmes e eventos" apoio="O que entra em cartaz nas sessões." />
      <Erro mensagem={erro} />

      <Cartao>
        <Campo
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Nome do filme ou evento"
        />
        <Campo
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Sinopse ou observações"
          dica="Opcional."
          multiline
        />
        <Campo
          label="Duração"
          value={duracao}
          onChangeText={setDuracao}
          keyboardType="numeric"
          placeholder="120"
          dica="Em minutos."
        />
        <Botao
          titulo="Adicionar"
          icone="add"
          onPress={criar}
          carregando={salvando}
          desabilitado={!titulo.trim() || !duracaoValida}
        />
      </Cartao>

      <Subtitulo texto={`Cadastrados (${eventos.length})`} />

      {eventos.length === 0 ? (
        <Vazio icone="film-outline" texto="Nenhum filme ou evento cadastrado ainda." />
      ) : (
        eventos.map((item) => (
          <Cartao
            key={item.id}
            style={{ flexDirection: "row", alignItems: "center", gap: espaco.md, paddingVertical: espaco.md }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>{item.titulo}</Text>
              <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 1 }}>
                {item.duracaoMinutos} min
                {item.descricao ? ` · ${item.descricao}` : ""}
              </Text>
            </View>
            <TouchableOpacity onPress={() => remover(item)} hitSlop={10} accessibilityLabel="Remover">
              <Ionicons name="trash-outline" size={19} color={cores.perigo} />
            </TouchableOpacity>
          </Cartao>
        ))
      )}
    </TelaRolavel>
  );
}
