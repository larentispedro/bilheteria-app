import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../api/client";
import { Botao, Cartao, Erro, Titulo, estilos } from "../../components/ui";
import { cores, espaco, raio, sombra } from "../../theme";
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
        <View style={{ alignItems: "center", marginBottom: espaco.lg }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: cores.sucessoFundo,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: espaco.sm,
            }}
          >
            <Ionicons name="checkmark" size={32} color={cores.sucesso} />
          </View>
          <Titulo texto="Pagamento confirmado!" />
        </View>

        {ingressosEmitidos.map((ingresso) => (
          <View key={ingresso.id} style={estilosTicket.ticket}>
            <View style={estilosTicket.corpo}>
              <Text style={{ color: cores.textoClaro, opacity: 0.8, fontSize: 12 }}>ASSENTO</Text>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 22 }}>
                {ingresso.reserva.assento.fila}
                {ingresso.reserva.assento.numero}
              </Text>
            </View>
            <View style={estilosTicket.canhoto}>
              <Text style={{ fontSize: 11, color: cores.textoSecundario }}>CÓDIGO DO INGRESSO</Text>
              <Text style={{ fontFamily: "monospace", fontWeight: "700", color: cores.texto, marginTop: 2 }}>
                {ingresso.codigoUnico}
              </Text>
            </View>
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
      <Cartao>
        <Text style={{ fontWeight: "700", fontSize: 16, color: cores.texto }}>{sessao.evento.titulo}</Text>
        <Text style={{ color: cores.textoSecundario, marginTop: 2 }}>{sessao.sala.nome}</Text>
        <View style={{ height: 1, backgroundColor: cores.borda, marginVertical: espaco.md }} />
        <Linha rotulo="Assentos" valor={`${quantidade}`} />
        <Linha rotulo="Preço unitário" valor={`R$ ${Number(sessao.preco).toFixed(2)}`} />
        <View style={{ height: 1, backgroundColor: cores.borda, marginVertical: espaco.sm }} />
        <Linha rotulo="Total" valor={`R$ ${total.toFixed(2)}`} destaque />
      </Cartao>

      {expirado ? (
        <View style={estilos.erroCaixa}>
          <Text style={{ color: cores.perigo, fontWeight: "600" }}>
            Sua reserva expirou. Volte e selecione os assentos novamente.
          </Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: espaco.lg,
            backgroundColor: cores.avisoFundo,
            padding: espaco.md,
            borderRadius: raio.md,
          }}
        >
          <Ionicons name="time-outline" size={18} color={cores.aviso} />
          <Text style={{ color: cores.aviso, fontWeight: "600" }}>
            Reserva expira em {Math.floor(segundosRestantes / 60)}:
            {String(segundosRestantes % 60).padStart(2, "0")}
          </Text>
        </View>
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

function Linha({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
      <Text style={{ color: cores.textoSecundario }}>{rotulo}</Text>
      <Text style={{ fontWeight: destaque ? "800" : "600", color: destaque ? cores.primaria : cores.texto }}>
        {valor}
      </Text>
    </View>
  );
}

const estilosTicket = {
  ticket: {
    borderRadius: raio.lg,
    overflow: "hidden" as const,
    marginBottom: espaco.md,
    ...sombra,
  },
  corpo: { backgroundColor: cores.primaria, padding: espaco.lg },
  canhoto: { backgroundColor: cores.superficie, padding: espaco.lg },
};
