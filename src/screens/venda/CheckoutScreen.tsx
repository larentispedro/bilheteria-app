import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../api/client";
import {
  Atencao,
  BarraAcao,
  Botao,
  Cartao,
  Erro,
  LinhaInfo,
  Separador,
  TelaRolavel,
  Titulo,
} from "../../components/ui";
import { TicketIngresso } from "../../components/TicketIngresso";
import { dataHoraCurta, real } from "../../format";
import { cores, espaco } from "../../theme";
import type { Ingresso, Sessao } from "../../types/api";

export function CheckoutScreen({ route, navigation }: { route: any; navigation: any }) {
  const { sessao, reservaIds, expiraEm, valorTotal, assentos } = route.params as {
    sessao: Sessao;
    reservaIds: number[];
    expiraEm: string;
    valorTotal: number;
    assentos: string[];
  };

  const [segundos, setSegundos] = useState(() =>
    Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000)),
  );
  const [pagando, setPagando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [emitidos, setEmitidos] = useState<Ingresso[] | null>(null);

  useEffect(() => {
    if (emitidos) return;
    const intervalo = setInterval(() => {
      setSegundos(Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [expiraEm, emitidos]);

  const expirou = segundos <= 0 && !emitidos;
  const relogio = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`;

  async function pagar() {
    setErro(null);
    setPagando(true);
    try {
      const resultado = await api.post<{ ingressos: Ingresso[]; valorTotal: number }>(
        "/pagamentos",
        { reservaIds },
      );
      setEmitidos(resultado.ingressos);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível confirmar o pagamento");
    } finally {
      setPagando(false);
    }
  }

  /* ---------------- Comprovante ---------------- */
  if (emitidos) {
    return (
      <TelaRolavel>
        <View style={{ alignItems: "center", marginBottom: espaco.xl }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: cores.sucessoFundo,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: espaco.md,
            }}
          >
            <Ionicons name="checkmark" size={32} color={cores.sucesso} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "800", color: cores.texto }}>
            Pagamento confirmado
          </Text>
          <Text style={{ color: cores.textoSecundario, marginTop: 4, textAlign: "center" }}>
            {emitidos.length === 1
              ? "Seu ingresso foi emitido."
              : `${emitidos.length} ingressos foram emitidos.`}{" "}
            Apresente o código na entrada.
          </Text>
        </View>

        {emitidos.map((ingresso) => (
          <TicketIngresso key={ingresso.id} ingresso={ingresso} />
        ))}

        <View style={{ marginTop: espaco.sm }}>
          <Botao titulo="Concluir" variante="fantasma" onPress={() => navigation.popToTop()} />
        </View>
      </TelaRolavel>
    );
  }

  /* ---------------- Confirmação ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <TelaRolavel>
        <Titulo texto="Confirmar compra" />
        <Erro mensagem={erro} />

        {expirou ? (
          <Erro mensagem="Sua reserva expirou e os assentos voltaram a ficar livres. Volte e escolha novamente." />
        ) : (
          <Atencao mensagem={`Tempo para concluir o pagamento: ${relogio}`} />
        )}

        <Cartao>
          <Text style={{ fontWeight: "700", fontSize: 16, color: cores.texto }}>
            {sessao.evento.titulo}
          </Text>
          <Text style={{ color: cores.textoSecundario, marginTop: 2, fontSize: 13 }}>
            {sessao.sala.nome} ·{" "}
            {dataHoraCurta(sessao.dataHora)}
          </Text>

          <Separador />

          <LinhaInfo rotulo="Assentos" valor={assentos.join(", ")} />
          <LinhaInfo rotulo="Quantidade" valor={String(reservaIds.length)} />
          <LinhaInfo rotulo="Preço unitário" valor={real(sessao.preco)} />

          <Separador />

          <LinhaInfo rotulo="Total" valor={real(valorTotal)} destaque />
        </Cartao>

        <Text style={{ color: cores.textoTerciario, fontSize: 12, textAlign: "center" }}>
          Pagamento simulado — nenhum dado de cartão é solicitado ou armazenado.
        </Text>
      </TelaRolavel>

      <BarraAcao>
        {expirou ? (
          <Botao titulo="Escolher assentos novamente" onPress={() => navigation.goBack()} />
        ) : (
          <Botao
            titulo={`Pagar ${real(valorTotal)}`}
            icone="lock-closed"
            onPress={pagar}
            carregando={pagando}
          />
        )}
      </BarraAcao>
    </View>
  );
}
