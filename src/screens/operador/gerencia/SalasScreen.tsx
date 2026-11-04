import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../../api/client";
import {
  Badge,
  Botao,
  Campo,
  Cartao,
  Erro,
  Separador,
  Subtitulo,
  TelaRolavel,
  Titulo,
  Vazio,
} from "../../../components/ui";
import { cores, espaco } from "../../../theme";
import type { Sala } from "../../../types/api";

export function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [salaAberta, setSalaAberta] = useState<number | null>(null);
  const [filas, setFilas] = useState("");
  const [porFila, setPorFila] = useState("");

  const carregar = useCallback(() => {
    api.get<Sala[]>("/salas").then(setSalas);
  }, []);

  useFocusEffect(carregar);

  const listaFilas = filas
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const totalPrevisto = listaFilas.length * (Number(porFila) || 0);

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
        filas: listaFilas,
        assentosPorFila: Number(porFila),
      });
      setSalaAberta(null);
      setFilas("");
      setPorFila("");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível gerar os assentos");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TelaRolavel>
      <Titulo texto="Salas e assentos" apoio="Cada sala tem um conjunto fixo de assentos." />
      <Erro mensagem={erro} />

      <Cartao>
        <Campo label="Nome da sala" value={nome} onChangeText={setNome} placeholder="Ex.: Sala 1" />
        <Botao
          titulo="Criar sala"
          icone="add"
          onPress={criarSala}
          carregando={salvando}
          desabilitado={!nome.trim()}
        />
      </Cartao>

      <Subtitulo texto={`Cadastradas (${salas.length})`} />

      {salas.length === 0 ? (
        <Vazio icone="grid-outline" texto="Nenhuma sala cadastrada ainda." />
      ) : (
        salas.map((sala) => {
          const semAssentos = sala.assentos.length === 0;
          return (
            <Cartao key={sala.id}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: espaco.sm, flex: 1 }}>
                  <Ionicons name="grid-outline" size={18} color={cores.textoSecundario} />
                  <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>{sala.nome}</Text>
                </View>
                <Badge
                  texto={semAssentos ? "sem assentos" : `${sala.assentos.length} assentos`}
                  tom={semAssentos ? "reservado" : "valido"}
                />
              </View>

              {semAssentos && (
                <>
                  <Separador />
                  {salaAberta === sala.id ? (
                    <View>
                      <Campo
                        label="Fileiras"
                        value={filas}
                        onChangeText={setFilas}
                        autoCapitalize="characters"
                        placeholder="A,B,C"
                        dica="Letras separadas por vírgula."
                      />
                      <Campo
                        label="Assentos por fileira"
                        value={porFila}
                        onChangeText={setPorFila}
                        keyboardType="numeric"
                        placeholder="8"
                        dica={
                          totalPrevisto > 0
                            ? `Serão criados ${totalPrevisto} assentos. Isso não pode ser desfeito.`
                            : undefined
                        }
                      />
                      <View style={{ flexDirection: "row", gap: espaco.sm }}>
                        <View style={{ flex: 1 }}>
                          <Botao
                            titulo="Cancelar"
                            variante="fantasma"
                            onPress={() => setSalaAberta(null)}
                          />
                        </View>
                        <View style={{ flex: 2 }}>
                          <Botao
                            titulo="Gerar assentos"
                            onPress={() => gerarAssentos(sala.id)}
                            carregando={salvando}
                            desabilitado={listaFilas.length === 0 || totalPrevisto <= 0}
                          />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Botao
                      titulo="Cadastrar assentos"
                      variante="secundario"
                      icone="add"
                      onPress={() => {
                        setSalaAberta(sala.id);
                        setFilas("");
                        setPorFila("");
                      }}
                    />
                  )}
                </>
              )}
            </Cartao>
          );
        })
      )}
    </TelaRolavel>
  );
}
