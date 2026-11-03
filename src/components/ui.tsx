import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
}: {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "perigo";
  carregando?: boolean;
  desabilitado?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[estilos.botao, estilos[`botao_${variante}`], desabilitado && estilos.botaoDesabilitado]}
      onPress={onPress}
      disabled={desabilitado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={estilos.botaoTexto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

export function Campo({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View style={estilos.campoContainer}>
      <Text style={estilos.campoLabel}>{label}</Text>
      <TextInput style={estilos.campoInput} placeholderTextColor="#999" {...props} />
    </View>
  );
}

export function Erro({ mensagem }: { mensagem?: string | null }) {
  if (!mensagem) return null;
  return <Text style={estilos.erro}>{mensagem}</Text>;
}

export function Titulo({ texto }: { texto: string }) {
  return <Text style={estilos.titulo}>{texto}</Text>;
}

export const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#f5f5f7", padding: 16 },
  titulo: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#1a1a1a" },
  campoContainer: { marginBottom: 12 },
  campoLabel: { fontSize: 13, color: "#444", marginBottom: 4 },
  campoInput: {
    borderWidth: 1,
    borderColor: "#d0d0d6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  botao: { borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  botao_primario: { backgroundColor: "#2f5bea" },
  botao_secundario: { backgroundColor: "#6b7280" },
  botao_perigo: { backgroundColor: "#dc2626" },
  botaoDesabilitado: { opacity: 0.5 },
  botaoTexto: { color: "#fff", fontWeight: "600", fontSize: 15 },
  erro: { color: "#dc2626", marginBottom: 8 },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
});
