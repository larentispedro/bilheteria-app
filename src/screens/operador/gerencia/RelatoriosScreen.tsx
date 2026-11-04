import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../api/client";
import { Cartao, Subtitulo, Titulo, estilos } from "../../../components/ui";
import { cores, espaco, raio } from "../../../theme";
import type { RelatorioOcupacao, RelatorioVendas } from "../../../types/api";

export function RelatoriosScreen() {
  const [vendas, setVendas] = useState<RelatorioVendas | null>(null);
  const [ocupacao, setOcupacao] = useState<RelatorioOcupacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([
        api.get<RelatorioVendas>("/relatorios/vendas"),
        api.get<RelatorioOcupacao[]>("/relatorios/ocupacao"),
      ])
        .then(([v, o]) => {
          if (!ativo) return;
          setVendas(v);
          setOcupacao(o);
        })
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando || !vendas) {
    return (
      <View style={[estilos.tela, { justifyContent: "center" }]}>
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  return (
    <ScrollView style={estilos.tela}>
      <Titulo texto="Relatório de vendas" />
      <View style={{ flexDirection: "row", gap: espaco.sm, marginBottom: espaco.md }}>
        <Indicador icone="pricetags-outline" rotulo="Vendas" valor={String(vendas.totalVendas)} />
        <Indicador icone="ticket-outline" rotulo="Ingressos" valor={String(vendas.totalIngressos)} />
        <Indicador
          icone="cash-outline"
          rotulo="Arrecadado"
          valor={`R$ ${vendas.valorTotalArrecadado.toFixed(2)}`}
        />
      </View>

      <Subtitulo texto="Por sessão" />
      {vendas.porSessao.map((s) => (
        <Cartao key={s.sessaoId}>
          <Text style={{ fontWeight: "700", color: cores.texto }}>{s.evento}</Text>
          <Text style={{ color: cores.textoSecundario, marginTop: 2 }}>
            {new Date(s.dataHora).toLocaleString("pt-BR")}
          </Text>
          <Text style={{ marginTop: 4, color: cores.texto }}>
            {s.ingressosVendidos} ingresso(s) · R$ {s.valorArrecadado.toFixed(2)}
          </Text>
        </Cartao>
      ))}

      <Titulo texto="Taxa de ocupação por sessão" />
      {ocupacao.map((o) => (
        <Cartao key={o.sessaoId}>
          <Text style={{ fontWeight: "700", color: cores.texto }}>
            {o.evento} · {o.sala}
          </Text>
          <Text style={{ color: cores.textoSecundario, marginTop: 2 }}>
            {new Date(o.dataHora).toLocaleString("pt-BR")}
          </Text>

          <View
            style={{
              height: 10,
              borderRadius: raio.pill,
              backgroundColor: cores.neutroFundo,
              marginTop: espaco.md,
              overflow: "hidden",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: o.vendidos, backgroundColor: cores.perigo }} />
            <View style={{ flex: o.reservados, backgroundColor: cores.aviso }} />
            <View style={{ flex: o.livres || 0.0001, backgroundColor: cores.neutroFundo }} />
          </View>

          <Text style={{ marginTop: espaco.sm, color: cores.textoSecundario }}>
            Vendidos: {o.vendidos} · Reservados: {o.reservados} · Livres: {o.livres} / {o.totalAssentos}
          </Text>
          <Text style={{ fontWeight: "800", color: cores.primaria, marginTop: 2, fontSize: 16 }}>
            {(o.taxaOcupacao * 100).toFixed(0)}% ocupado
          </Text>
        </Cartao>
      ))}
    </ScrollView>
  );
}

function Indicador({ icone, rotulo, valor }: { icone: any; rotulo: string; valor: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: cores.superficie,
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
        padding: espaco.md,
        alignItems: "center",
      }}
    >
      <Ionicons name={icone} size={18} color={cores.primaria} />
      <Text style={{ fontWeight: "800", fontSize: 15, color: cores.texto, marginTop: 4 }}>{valor}</Text>
      <Text style={{ fontSize: 11, color: cores.textoSecundario }}>{rotulo}</Text>
    </View>
  );
}
