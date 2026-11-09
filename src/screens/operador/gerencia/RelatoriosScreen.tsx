import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../api/client";
import { exportarPdf } from "../../../exportarPdf";
import { dataHoraCurta, real } from "../../../format";
import { Badge, Botao, Carregando, Cartao, Subtitulo, TelaRolavel, Titulo, Vazio } from "../../../components/ui";
import { cores, espaco, larguras, raio } from "../../../theme";
import type { RelatorioOcupacao, RelatorioVendaDetalhada, RelatorioVendas } from "../../../types/api";


export function RelatoriosScreen() {
  const [vendas, setVendas] = useState<RelatorioVendas | null>(null);
  const [ocupacao, setOcupacao] = useState<RelatorioOcupacao[]>([]);
  const [vendasDetalhadas, setVendasDetalhadas] = useState<RelatorioVendaDetalhada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [exportando, setExportando] = useState<"vendas" | "ocupacao" | null>(null);

  async function exportar(tipo: "vendas" | "ocupacao") {
    setExportando(tipo);
    try {
      await exportarPdf(`/relatorios/${tipo}/pdf`, `relatorio-${tipo}.pdf`);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    } finally {
      setExportando(null);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([
        api.get<RelatorioVendas>("/relatorios/vendas"),
        api.get<RelatorioOcupacao[]>("/relatorios/ocupacao"),
        api.get<RelatorioVendaDetalhada[]>("/relatorios/vendas-detalhadas"),
      ])
        .then(([v, o, vd]) => {
          if (!ativo) return;
          setVendas(v);
          setOcupacao(o);
          setVendasDetalhadas(vd);
        })
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando || !vendas) return <Carregando />;

  return (
    <TelaRolavel largura={larguras.largo}>
      <Titulo texto="Relatórios" apoio="Vendas e ocupação das sessões." />

      <View style={{ flexDirection: "row", gap: espaco.sm, flexWrap: "wrap" }}>
        <Indicador icone="receipt-outline" rotulo="Vendas" valor={String(vendas.totalVendas)} />
        <Indicador icone="ticket-outline" rotulo="Ingressos" valor={String(vendas.totalIngressos)} />
        <Indicador
          icone="cash-outline"
          rotulo="Arrecadado"
          valor={real(vendas.valorTotalArrecadado)}
          destaque
        />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: espaco.md }}>
        <Subtitulo texto="Vendas por sessão" />
        <Botao
          titulo="Exportar PDF"
          variante="fantasma"
          compacto
          icone="download-outline"
          carregando={exportando === "vendas"}
          onPress={() => exportar("vendas")}
        />
      </View>
      {vendas.porSessao.length === 0 ? (
        <Vazio icone="receipt-outline" texto="Nenhuma venda registrada ainda." />
      ) : (
        vendas.porSessao.map((s) => (
          <Cartao key={s.sessaoId} style={{ paddingVertical: espaco.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: espaco.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>{s.evento}</Text>
                <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 2 }}>
                  {dataHoraCurta(s.dataHora)}
                  {" · "}
                  {s.ingressosVendidos} {s.ingressosVendidos === 1 ? "ingresso" : "ingressos"}
                </Text>
              </View>
              <Text style={{ fontWeight: "800", color: cores.texto, fontSize: 15 }}>
                {real(s.valorArrecadado)}
              </Text>
            </View>
          </Cartao>
        ))
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: espaco.md }}>
        <Subtitulo texto="Taxa de ocupação" />
        <Botao
          titulo="Exportar PDF"
          variante="fantasma"
          compacto
          icone="download-outline"
          carregando={exportando === "ocupacao"}
          onPress={() => exportar("ocupacao")}
        />
      </View>
      {ocupacao.length === 0 ? (
        <Vazio icone="bar-chart-outline" texto="Nenhuma sessão cadastrada." />
      ) : (
        ocupacao.map((o) => (
          <Cartao key={o.sessaoId}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>{o.evento}</Text>
                <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 2 }}>
                  {o.sala} ·{" "}
                  {dataHoraCurta(o.dataHora)}
                </Text>
              </View>
              <Text style={{ fontWeight: "800", color: cores.texto, fontSize: 20 }}>
                {(o.taxaOcupacao * 100).toFixed(0)}%
              </Text>
            </View>

            {/* Barra: vendidos | reservados | livres */}
            <View style={{ flexDirection: "row", height: 10, borderRadius: raio.pill, overflow: "hidden", marginTop: espaco.md, backgroundColor: cores.neutroFundo }}>
              {o.vendidos > 0 && <View style={{ flex: o.vendidos, backgroundColor: cores.primaria }} />}
              {o.reservados > 0 && (
                <View style={{ flex: o.reservados, backgroundColor: cores.assentoReservado }} />
              )}
              {o.livres > 0 && <View style={{ flex: o.livres, backgroundColor: cores.neutroFundo }} />}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: espaco.lg, marginTop: espaco.md }}>
              <Parcela cor={cores.primaria} rotulo="Vendidos" valor={o.vendidos} />
              <Parcela cor={cores.assentoReservado} rotulo="Reservados" valor={o.reservados} />
              <Parcela cor={cores.bordaForte} rotulo="Livres" valor={o.livres} />
              <Parcela rotulo="Total de lugares" valor={o.totalAssentos} />
            </View>
          </Cartao>
        ))
      )}

      <Subtitulo texto="Vendas detalhadas" />
      {vendasDetalhadas.length === 0 ? (
        <Vazio icone="list-outline" texto="Nenhum ingresso vendido ainda." />
      ) : (
        vendasDetalhadas.map((v) => (
          <Cartao key={v.codigoIngresso} style={{ paddingVertical: espaco.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: espaco.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>{v.filme}</Text>
                <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 2 }}>
                  {v.comprador} · assento {v.assento} · {v.sala}
                </Text>
                <Text style={{ color: cores.textoTerciario, fontSize: 12, marginTop: 2 }}>
                  Sessão em {dataHoraCurta(v.dataHoraSessao)} · vendido em {dataHoraCurta(v.dataVenda)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={{ fontWeight: "800", color: cores.texto, fontSize: 15 }}>{real(v.preco)}</Text>
                <Badge
                  texto={v.statusIngresso === "UTILIZADO" ? "Utilizado" : "Válido"}
                  tom={v.statusIngresso === "UTILIZADO" ? "utilizado" : "valido"}
                />
              </View>
            </View>
          </Cartao>
        ))
      )}
    </TelaRolavel>
  );
}

function Indicador({
  icone,
  rotulo,
  valor,
  destaque = false,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 110,
        backgroundColor: destaque ? cores.tinta : cores.superficie,
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: destaque ? cores.tinta : cores.borda,
        padding: espaco.lg,
      }}
    >
      <Ionicons name={icone} size={18} color={destaque ? "rgba(255,255,255,0.7)" : cores.textoSecundario} />
      <Text
        style={{
          fontWeight: "800",
          fontSize: 20,
          color: destaque ? "#fff" : cores.texto,
          marginTop: espaco.sm,
        }}
      >
        {valor}
      </Text>
      <Text style={{ fontSize: 12, color: destaque ? "rgba(255,255,255,0.65)" : cores.textoSecundario }}>
        {rotulo}
      </Text>
    </View>
  );
}

function Parcela({ cor, rotulo, valor }: { cor?: string; rotulo: string; valor: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {cor ? <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: cor }} /> : null}
      <Text style={{ fontSize: 13, color: cores.textoSecundario }}>
        {rotulo}: <Text style={{ fontWeight: "700", color: cores.texto }}>{valor}</Text>
      </Text>
    </View>
  );
}
