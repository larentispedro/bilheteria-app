import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { api, ApiError } from "../../api/client";
import { Botao, Campo, Erro, Titulo, estilos } from "../../components/ui";
import type { Ingresso } from "../../types/api";

export function ValidarIngressoScreen() {
  const [codigo, setCodigo] = useState("");
  const [ingresso, setIngresso] = useState<Ingresso | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function buscar() {
    setErro(null);
    setMensagem(null);
    setIngresso(null);
    setCarregando(true);
    try {
      const resultado = await api.get<Ingresso>(`/ingressos/${codigo.trim()}`);
      setIngresso(resultado);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao buscar ingresso");
    } finally {
      setCarregando(false);
    }
  }

  async function validar() {
    setErro(null);
    setCarregando(true);
    try {
      await api.post(`/ingressos/${codigo.trim()}/validar`);
      setMensagem("Ingresso validado com sucesso! Entrada liberada.");
      setIngresso(null);
      setCodigo("");
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao validar ingresso");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={estilos.tela}>
      <Titulo texto="Validar ingresso na entrada" />
      <Erro mensagem={erro} />
      {mensagem && <Text style={{ color: "#16a34a", marginBottom: 12 }}>{mensagem}</Text>}

      <Campo
        label="Código do ingresso"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="none"
      />
      <Botao titulo="Buscar" onPress={buscar} carregando={carregando} desabilitado={!codigo} />

      {ingresso && (
        <View style={[estilos.cartao, { marginTop: 16 }]}>
          <Text style={{ fontWeight: "700" }}>{ingresso.reserva.sessao.evento.titulo}</Text>
          <Text>
            Assento {ingresso.reserva.assento.fila}
            {ingresso.reserva.assento.numero}
          </Text>
          <Text style={{ marginTop: 4, fontWeight: "600" }}>
            Status: {ingresso.status === "UTILIZADO" ? "Já utilizado" : "Válido"}
          </Text>
          {ingresso.status !== "UTILIZADO" && (
            <Botao titulo="Confirmar entrada" onPress={validar} carregando={carregando} />
          )}
        </View>
      )}
    </ScrollView>
  );
}
