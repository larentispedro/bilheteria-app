import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { api } from "../../../api/client";
import { Titulo, estilos } from "../../../components/ui";
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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={estilos.tela}>
      <Titulo texto="Relatório de vendas" />
      <View style={estilos.cartao}>
        <Text>Total de vendas: {vendas.totalVendas}</Text>
        <Text>Total de ingressos: {vendas.totalIngressos}</Text>
        <Text style={{ fontWeight: "700" }}>
          Valor arrecadado: R$ {vendas.valorTotalArrecadado.toFixed(2)}
        </Text>
      </View>

      <Text style={{ fontWeight: "700", marginTop: 8, marginBottom: 8 }}>Por sessão</Text>
      {vendas.porSessao.map((s) => (
        <View key={s.sessaoId} style={estilos.cartao}>
          <Text style={{ fontWeight: "700" }}>{s.evento}</Text>
          <Text>{new Date(s.dataHora).toLocaleString("pt-BR")}</Text>
          <Text>
            {s.ingressosVendidos} ingresso(s) - R$ {s.valorArrecadado.toFixed(2)}
          </Text>
        </View>
      ))}

      <Titulo texto="Taxa de ocupação por sessão" />
      {ocupacao.map((o) => (
        <View key={o.sessaoId} style={estilos.cartao}>
          <Text style={{ fontWeight: "700" }}>
            {o.evento} - {o.sala}
          </Text>
          <Text>{new Date(o.dataHora).toLocaleString("pt-BR")}</Text>
          <Text>
            Vendidos: {o.vendidos} · Reservados: {o.reservados} · Livres: {o.livres} / {o.totalAssentos}
          </Text>
          <Text style={{ fontWeight: "700" }}>Ocupação: {(o.taxaOcupacao * 100).toFixed(0)}%</Text>
        </View>
      ))}
    </ScrollView>
  );
}
