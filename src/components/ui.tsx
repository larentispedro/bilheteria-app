import type { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";
import { cores, espaco, raio, sombra } from "../theme";

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
}: {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "perigo" | "fantasma";
  carregando?: boolean;
  desabilitado?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        estilos.botao,
        estilos[`botao_${variante}`],
        (desabilitado || carregando) && estilos.botaoDesabilitado,
      ]}
      onPress={onPress}
      disabled={desabilitado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color={variante === "fantasma" ? cores.primaria : "#fff"} />
      ) : (
        <Text style={[estilos.botaoTexto, variante === "fantasma" && estilos.botaoTextoFantasma]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function Campo({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View style={estilos.campoContainer}>
      <Text style={estilos.campoLabel}>{label}</Text>
      <TextInput
        style={estilos.campoInput}
        placeholderTextColor={cores.textoSecundario}
        {...props}
      />
    </View>
  );
}

export function Erro({ mensagem }: { mensagem?: string | null }) {
  if (!mensagem) return null;
  return (
    <View style={estilos.erroCaixa}>
      <Text style={estilos.erroTexto}>{mensagem}</Text>
    </View>
  );
}

export function Titulo({ texto }: { texto: string }) {
  return <Text style={estilos.titulo}>{texto}</Text>;
}

export function Subtitulo({ texto }: { texto: string }) {
  return <Text style={estilos.subtitulo}>{texto}</Text>;
}

const CORES_BADGE: Record<string, { fundo: string; texto: string }> = {
  livre: { fundo: cores.neutroFundo, texto: cores.textoSecundario },
  reservado: { fundo: cores.avisoFundo, texto: cores.aviso },
  vendido: { fundo: cores.perigoFundo, texto: cores.perigo },
  valido: { fundo: cores.sucessoFundo, texto: cores.sucesso },
  utilizado: { fundo: cores.neutroFundo, texto: cores.textoSecundario },
};

export function Badge({ texto, tom = "livre" }: { texto: string; tom?: keyof typeof CORES_BADGE }) {
  const paleta = CORES_BADGE[tom] ?? CORES_BADGE.livre;
  return (
    <View style={[estilos.badge, { backgroundColor: paleta.fundo }]}>
      <Text style={[estilos.badgeTexto, { color: paleta.texto }]}>{texto}</Text>
    </View>
  );
}

export function Cartao({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[estilos.cartao, style]}>{children}</View>;
}

export const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: espaco.lg },
  titulo: { fontSize: 22, fontWeight: "800", marginBottom: espaco.md, color: cores.texto },
  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: cores.texto,
    marginTop: espaco.sm,
    marginBottom: espaco.sm,
  },
  campoContainer: { marginBottom: espaco.md },
  campoLabel: { fontSize: 13, color: cores.textoSecundario, marginBottom: espaco.xs, fontWeight: "600" },
  campoInput: {
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    paddingVertical: 12,
    backgroundColor: cores.superficie,
    fontSize: 15,
    color: cores.texto,
  },
  botao: {
    borderRadius: raio.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: espaco.xs,
    ...sombra,
  },
  botao_primario: { backgroundColor: cores.primaria },
  botao_secundario: { backgroundColor: cores.textoSecundario },
  botao_perigo: { backgroundColor: cores.perigo },
  botao_fantasma: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: cores.primaria,
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoDesabilitado: { opacity: 0.45 },
  botaoTexto: { color: "#fff", fontWeight: "700", fontSize: 15 },
  botaoTextoFantasma: { color: cores.primaria },
  erroCaixa: {
    backgroundColor: cores.perigoFundo,
    borderRadius: raio.md,
    padding: espaco.md,
    marginBottom: espaco.md,
  },
  erroTexto: { color: cores.perigo, fontWeight: "600" },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    padding: espaco.lg,
    marginBottom: espaco.md,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: raio.pill,
    paddingHorizontal: espaco.md,
    paddingVertical: 4,
  },
  badgeTexto: { fontSize: 12, fontWeight: "700" },
});
