import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { api, ApiError } from "../../api/client";
import { Botao, Erro, Titulo, estilos } from "../../components/ui";
import type { Ingresso, Sessao } from "../../types/api";

export function CheckoutScreen({ route, navigation }: { route: any; navigation: any }) {
  const { sessao, reservaIds, expiraEm, quantidade } = route.params as {
    sessao: Sessao;
    reservaIds: number[];
    expiraEm: string;
    quantidade: number;
  };

  const [segundosRestantes, setSegundosRestantes] = useState(
    Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000)),
  );
  const [pagando, setPagando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ingressosEmitidos, setIngressosEmitidos] = useState<Ingresso[] | null>(null);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundosRestantes(Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [expiraEm]);

  const total = Number(sessao.preco) * quantidade;
  const expirado = segundosRestantes <= 0 && !ingressosEmitidos;

  async function confirmarPagamento() {
    setErro(null);
    setPagando(true);
    try {
      const resultado = await api.post<{ ingressos: Ingresso[] }>("/pagamentos", { reservaIds });
      setIngressosEmitidos(resultado.ingressos);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível confirmar o pagamento");
    } finally {
      setPagando(false);
    }
  }

  if (ingressosEmitidos) {
    return (
      <ScrollView style={estilos.tela}>
        <Titulo texto="Pagamento confirmado!" />
        {ingressosEmitidos.map((ingresso) => (
          <View key={ingresso.id} style={estilos.cartao}>
            <Text style={{ fontWeight: "700" }}>
              Assento {ingresso.reserva.assento.fila}
              {ingresso.reserva.assento.numero}
            </Text>
            <Text style={{ marginTop: 4 }}>Código do ingresso:</Text>
            <Text style={{ fontFamily: "monospace", fontWeight: "700" }}>{ingresso.codigoUnico}</Text>
          </View>
        ))}
        <Botao titulo="Concluir" onPress={() => navigation.popToTop()} />
      </ScrollView>
    );
  }

  return (
    <View style={estilos.tela}>
      <Titulo texto="Confirmar compra" />
      <Erro mensagem={erro} />
      <View style={estilos.cartao}>
        <Text style={{ fontWeight: "700" }}>{sessao.evento.titulo}</Text>
        <Text>{sessao.sala.nome}</Text>
        <Text>{quantidade} assento(s)</Text>
        <Text style={{ marginTop: 6, fontWeight: "700" }}>Total: R$ {total.toFixed(2)}</Text>
      </View>

      {expirado ? (
        <Text style={{ color: "#dc2626", marginBottom: 12 }}>
          Sua reserva expirou. Volte e selecione os assentos novamente.
        </Text>
      ) : (
        <Text style={{ marginBottom: 12 }}>
          Reserva expira em: {Math.floor(segundosRestantes / 60)}:
          {String(segundosRestantes % 60).padStart(2, "0")}
        </Text>
      )}

      <Botao
        titulo="Pagar (simulado)"
        onPress={confirmarPagamento}
        carregando={pagando}
        desabilitado={expirado}
      />
    </View>
  );
}
