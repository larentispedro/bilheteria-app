import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import { api, ApiError } from "../../../api/client";
import { Botao, Campo, Erro, Titulo, estilos } from "../../../components/ui";
import type { Sala } from "../../../types/api";

export function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [filas, setFilas] = useState("");
  const [assentosPorFila, setAssentosPorFila] = useState("");

  const carregar = useCallback(() => {
    api.get<Sala[]>("/salas").then(setSalas);
  }, []);

  useFocusEffect(carregar);

  async function criarSala() {
    setErro(null);
    setSalvando(true);
    try {
      await api.post("/salas", { nome: nome.trim() });
      setNome("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível criar a sala");
    } finally {
      setSalvando(false);
    }
  }

  async function gerarAssentos(salaId: number) {
    setErro(null);
    setSalvando(true);
    try {
      await api.post(`/salas/${salaId}/assentos`, {
        filas: filas.split(",").map((f) => f.trim()).filter(Boolean),
        assentosPorFila: Number(assentosPorFila),
      });
      setSalaSelecionada(null);
      setFilas("");
      setAssentosPorFila("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível gerar os assentos");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <Titulo texto="Salas" />
      <Erro mensagem={erro} />
      <Campo label="Nome da sala" value={nome} onChangeText={setNome} />
      <Botao titulo="Criar sala" onPress={criarSala} carregando={salvando} desabilitado={!nome} />

      <FlatList
        style={{ marginTop: 16 }}
        data={salas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={{ fontWeight: "700" }}>{item.nome}</Text>
            <Text style={{ color: "#555" }}>{item.assentos.length} assento(s) cadastrado(s)</Text>

            {item.assentos.length === 0 &&
              (salaSelecionada === item.id ? (
                <View style={{ marginTop: 8 }}>
                  <Campo
                    label="Fileiras (ex.: A,B,C)"
                    value={filas}
                    onChangeText={setFilas}
                    autoCapitalize="characters"
                  />
                  <Campo
                    label="Assentos por fileira"
                    value={assentosPorFila}
                    onChangeText={setAssentosPorFila}
                    keyboardType="numeric"
                  />
                  <Botao
                    titulo="Gerar assentos"
                    onPress={() => gerarAssentos(item.id)}
                    carregando={salvando}
                    desabilitado={!filas || !assentosPorFila}
                  />
                </View>
              ) : (
                <Botao
                  titulo="Cadastrar assentos"
                  variante="secundario"
                  onPress={() => setSalaSelecionada(item.id)}
                />
              ))}
          </View>
        )}
      />
    </View>
  );
}
