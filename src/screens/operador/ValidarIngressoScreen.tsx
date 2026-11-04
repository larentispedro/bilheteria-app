import { useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../api/client";
import {
  Botao,
  Campo,
  Cartao,
  Erro,
  LinhaInfo,
  Separador,
  Sucesso,
  TelaRolavel,
  Titulo,
} from "../../components/ui";
import { cores, espaco, raio } from "../../theme";
import { dataHoraCurta } from "../../format";
import type { Ingresso } from "../../types/api";

export function ValidarIngressoScreen() {
  const [codigo, setCodigo] = useState("");
  const [ingresso, setIngresso] = useState<Ingresso | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [validando, setValidando] = useState(false);

  function limpar() {
    setErro(null);
    setMensagem(null);
    setIngresso(null);
  }

  async function buscar() {
    limpar();
    setBuscando(true);
    try {
      setIngresso(await api.get<Ingresso>(`/ingressos/${codigo.trim()}`));
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao buscar ingresso");
    } finally {
      setBuscando(false);
    }
  }

  async function validar() {
    setErro(null);
    setValidando(true);
    try {
      await api.post(`/ingressos/${codigo.trim()}/validar`);
      const assento = ingresso ? `${ingresso.reserva.assento.fila}${ingresso.reserva.assento.numero}` : "";
      setMensagem(`Entrada liberada — assento ${assento}.`);
      setIngresso(null);
      setCodigo("");
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao validar ingresso");
    } finally {
      setValidando(false);
    }
  }

  const jaUtilizado = ingresso?.status === "UTILIZADO";

  return (
    <TelaRolavel largura={480}>
      <Titulo texto="Validar entrada" apoio="Informe o código impresso no ingresso do cliente." />

      <Sucesso mensagem={mensagem} />
      <Erro mensagem={erro} />

      <Cartao>
        <Campo
          label="Código do ingresso"
          value={codigo}
          onChangeText={(t) => {
            setCodigo(t);
            if (ingresso || mensagem) limpar();
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="cole ou digite o código"
          onSubmitEditing={buscar}
          returnKeyType="search"
        />
        <Botao
          titulo="Buscar ingresso"
          icone="search"
          onPress={buscar}
          carregando={buscando}
          desabilitado={!codigo.trim()}
        />
      </Cartao>

      {ingresso && (
        <View
          style={{
            borderRadius: raio.lg,
            overflow: "hidden",
            borderWidth: 1.5,
            borderColor: jaUtilizado ? cores.perigo : cores.sucesso,
          }}
        >
          <View
            style={{
              backgroundColor: jaUtilizado ? cores.perigoFundo : cores.sucessoFundo,
              padding: espaco.lg,
              flexDirection: "row",
              alignItems: "center",
              gap: espaco.md,
            }}
          >
            <Ionicons
              name={jaUtilizado ? "close-circle" : "checkmark-circle"}
              size={32}
              color={jaUtilizado ? cores.perigo : cores.sucesso}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "800",
                  fontSize: 17,
                  color: jaUtilizado ? cores.perigo : cores.sucesso,
                }}
              >
                {jaUtilizado ? "Ingresso já utilizado" : "Ingresso válido"}
              </Text>
              <Text style={{ fontSize: 13, color: jaUtilizado ? cores.perigo : cores.sucesso, marginTop: 2 }}>
                {jaUtilizado ? "Não libere a entrada." : "Confira os dados e libere a entrada."}
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: cores.superficie, padding: espaco.lg }}>
            <Text style={{ fontWeight: "700", fontSize: 16, color: cores.texto }}>
              {ingresso.reserva.sessao.evento.titulo}
            </Text>
            <Separador />
            <LinhaInfo
              rotulo="Assento"
              valor={`${ingresso.reserva.assento.fila}${ingresso.reserva.assento.numero}`}
            />
            <LinhaInfo
              rotulo="Sessão"
              valor={dataHoraCurta(ingresso.reserva.sessao.dataHora)}
            />
            {!jaUtilizado && (
              <View style={{ marginTop: espaco.md }}>
                <Botao
                  titulo="Confirmar entrada"
                  icone="enter-outline"
                  onPress={validar}
                  carregando={validando}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </TelaRolavel>
  );
}
