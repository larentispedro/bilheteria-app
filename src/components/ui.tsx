import type { ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type FlatListProps,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores, espaco, larguras, raio, sombra, sombraMedia } from "../theme";

/* ------------------------------------------------------------------ */
/* Containers de tela                                                  */
/* ------------------------------------------------------------------ */

/**
 * Container padrão: fundo da aplicação + coluna central com largura máxima.
 * No celular ocupa a tela toda; no navegador o conteúdo fica centralizado
 * em vez de esticar de ponta a ponta.
 */
export function Tela({
  children,
  largura = larguras.conteudo,
  semPadding = false,
}: {
  children: ReactNode;
  largura?: number;
  semPadding?: boolean;
}) {
  return (
    <View style={estilos.telaExterna}>
      <View
        style={[
          estilos.colunaCentral,
          { maxWidth: largura },
          !semPadding && { padding: espaco.lg },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

/** Igual à `Tela`, mas com rolagem. */
export function TelaRolavel({
  children,
  largura = larguras.conteudo,
}: {
  children: ReactNode;
  largura?: number;
}) {
  return (
    <ScrollView
      style={estilos.telaExterna}
      contentContainerStyle={[estilos.conteudoRolavel, { maxWidth: largura }]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

/** FlatList já centralizada e com a largura limitada. */
export function Lista<T>({ largura = larguras.conteudo, ...props }: FlatListProps<T> & { largura?: number }) {
  return (
    <FlatList
      {...props}
      style={[{ flex: 1 }, props.style]}
      contentContainerStyle={[
        { maxWidth: largura, width: "100%", alignSelf: "center", paddingBottom: espaco.xl },
        props.contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

export function Carregando() {
  return (
    <View style={[estilos.telaExterna, { alignItems: "center", justifyContent: "center" }]}>
      <ActivityIndicator size="large" color={cores.primaria} />
    </View>
  );
}

export function Vazio({ icone, texto }: { icone: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={estilos.vazio}>
      <View style={estilos.vazioCirculo}>
        <Ionicons name={icone} size={26} color={cores.textoTerciario} />
      </View>
      <Text style={estilos.vazioTexto}>{texto}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Tipografia                                                          */
/* ------------------------------------------------------------------ */

export function Titulo({ texto, apoio }: { texto: string; apoio?: string }) {
  return (
    <View style={{ marginBottom: espaco.lg }}>
      <Text style={estilos.titulo}>{texto}</Text>
      {apoio ? <Text style={estilos.tituloApoio}>{apoio}</Text> : null}
    </View>
  );
}

export function Subtitulo({ texto }: { texto: string }) {
  return <Text style={estilos.subtitulo}>{texto}</Text>;
}

/* ------------------------------------------------------------------ */
/* Formulário                                                          */
/* ------------------------------------------------------------------ */

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
  icone,
  compacto = false,
}: {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "perigo" | "fantasma";
  carregando?: boolean;
  desabilitado?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
  compacto?: boolean;
}) {
  const inativo = desabilitado || carregando;
  const corDoTexto =
    variante === "fantasma" || variante === "secundario" ? cores.primaria : cores.textoClaro;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        estilos.botao,
        compacto && estilos.botaoCompacto,
        estilos[`botao_${variante}`],
        inativo && estilos.botaoInativo,
      ]}
      onPress={onPress}
      disabled={inativo}
    >
      {carregando ? (
        <ActivityIndicator color={corDoTexto} size="small" />
      ) : (
        <View style={estilos.botaoConteudo}>
          {icone ? <Ionicons name={icone} size={17} color={corDoTexto} /> : null}
          <Text style={[estilos.botaoTexto, { color: corDoTexto }]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function Campo({
  label,
  dica,
  ...props
}: { label: string; dica?: string } & TextInputProps) {
  return (
    <View style={estilos.campoContainer}>
      <Text style={estilos.campoLabel}>{label}</Text>
      <TextInput
        style={estilos.campoInput}
        placeholderTextColor={cores.textoTerciario}
        {...props}
      />
      {dica ? <Text style={estilos.campoDica}>{dica}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Avisos                                                              */
/* ------------------------------------------------------------------ */

function Aviso({
  mensagem,
  tom,
  icone,
}: {
  mensagem?: string | null;
  tom: "perigo" | "sucesso" | "aviso";
  icone: keyof typeof Ionicons.glyphMap;
}) {
  if (!mensagem) return null;
  const paleta = {
    perigo: { fundo: cores.perigoFundo, cor: cores.perigo },
    sucesso: { fundo: cores.sucessoFundo, cor: cores.sucesso },
    aviso: { fundo: cores.avisoFundo, cor: cores.aviso },
  }[tom];

  return (
    <View style={[estilos.aviso, { backgroundColor: paleta.fundo }]}>
      <Ionicons name={icone} size={18} color={paleta.cor} />
      <Text style={[estilos.avisoTexto, { color: paleta.cor }]}>{mensagem}</Text>
    </View>
  );
}

export function Erro({ mensagem }: { mensagem?: string | null }) {
  return <Aviso mensagem={mensagem} tom="perigo" icone="alert-circle" />;
}

export function Sucesso({ mensagem }: { mensagem?: string | null }) {
  return <Aviso mensagem={mensagem} tom="sucesso" icone="checkmark-circle" />;
}

export function Atencao({ mensagem }: { mensagem?: string | null }) {
  return <Aviso mensagem={mensagem} tom="aviso" icone="time" />;
}

/* ------------------------------------------------------------------ */
/* Blocos                                                              */
/* ------------------------------------------------------------------ */

export function Cartao({
  children,
  style,
  destaque = false,
}: {
  children: ReactNode;
  style?: object;
  destaque?: boolean;
}) {
  return <View style={[estilos.cartao, destaque && estilos.cartaoDestaque, style]}>{children}</View>;
}

const CORES_BADGE: Record<string, { fundo: string; texto: string }> = {
  neutro: { fundo: cores.neutroFundo, texto: cores.textoSecundario },
  livre: { fundo: cores.neutroFundo, texto: cores.textoSecundario },
  reservado: { fundo: cores.avisoFundo, texto: cores.aviso },
  vendido: { fundo: cores.perigoFundo, texto: cores.perigo },
  valido: { fundo: cores.sucessoFundo, texto: cores.sucesso },
  utilizado: { fundo: cores.neutroFundo, texto: cores.textoSecundario },
  info: { fundo: cores.primariaClara, texto: cores.primaria },
};

export function Badge({ texto, tom = "neutro" }: { texto: string; tom?: keyof typeof CORES_BADGE }) {
  const paleta = CORES_BADGE[tom] ?? CORES_BADGE.neutro;
  return (
    <View style={[estilos.badge, { backgroundColor: paleta.fundo }]}>
      <Text style={[estilos.badgeTexto, { color: paleta.texto }]}>{texto}</Text>
    </View>
  );
}

/** Linha "rótulo .......... valor", usada em resumos de compra. */
export function LinhaInfo({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <View style={estilos.linhaInfo}>
      <Text style={[estilos.linhaInfoRotulo, destaque && { color: cores.texto, fontWeight: "700" }]}>
        {rotulo}
      </Text>
      <Text style={[estilos.linhaInfoValor, destaque && estilos.linhaInfoValorDestaque]}>{valor}</Text>
    </View>
  );
}

export function Separador() {
  return <View style={estilos.separador} />;
}

/** Barra fixa no rodapé da tela, para a ação principal do fluxo. */
export function BarraAcao({ children }: { children: ReactNode }) {
  return (
    <View style={estilos.barraAcaoExterna}>
      <View style={[estilos.colunaCentral, estilos.barraAcaoInterna]}>{children}</View>
    </View>
  );
}

export const estilos = StyleSheet.create({
  telaExterna: { flex: 1, backgroundColor: cores.fundo },
  colunaCentral: { flex: 1, width: "100%", alignSelf: "center" },
  conteudoRolavel: {
    width: "100%",
    alignSelf: "center",
    padding: espaco.lg,
    paddingBottom: espaco.xxl,
  },

  titulo: { fontSize: 22, fontWeight: "800", color: cores.texto, letterSpacing: -0.3 },
  tituloApoio: { fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
  subtitulo: {
    fontSize: 12,
    fontWeight: "700",
    color: cores.textoTerciario,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: espaco.lg,
    marginBottom: espaco.sm,
  },

  campoContainer: { marginBottom: espaco.md },
  campoLabel: {
    fontSize: 13,
    color: cores.texto,
    marginBottom: 6,
    fontWeight: "600",
  },
  campoInput: {
    borderWidth: 1,
    borderColor: cores.bordaForte,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    paddingVertical: 12,
    backgroundColor: cores.superficie,
    fontSize: 15,
    color: cores.texto,
  },
  campoDica: { fontSize: 12, color: cores.textoTerciario, marginTop: 4 },

  botao: {
    borderRadius: raio.md,
    paddingVertical: 14,
    paddingHorizontal: espaco.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: espaco.xs,
  },
  botaoCompacto: { paddingVertical: 10 },
  botaoConteudo: { flexDirection: "row", alignItems: "center", gap: 8 },
  botao_primario: { backgroundColor: cores.primaria },
  botao_secundario: { backgroundColor: cores.primariaClara },
  botao_perigo: { backgroundColor: cores.perigo },
  botao_fantasma: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: cores.bordaForte,
  },
  botaoInativo: { opacity: 0.4 },
  botaoTexto: { fontWeight: "700", fontSize: 15 },

  aviso: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.md,
    marginBottom: espaco.md,
  },
  avisoTexto: { fontWeight: "600", flex: 1, fontSize: 14 },

  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    padding: espaco.lg,
    marginBottom: espaco.md,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  cartaoDestaque: { borderColor: cores.primaria, borderWidth: 1.5 },

  badge: {
    alignSelf: "flex-start",
    borderRadius: raio.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeTexto: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },

  linhaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  linhaInfoRotulo: { color: cores.textoSecundario, fontSize: 14 },
  linhaInfoValor: { color: cores.texto, fontWeight: "600", fontSize: 14 },
  linhaInfoValorDestaque: { color: cores.primaria, fontWeight: "800", fontSize: 19 },

  separador: { height: 1, backgroundColor: cores.borda, marginVertical: espaco.md },

  vazio: { alignItems: "center", paddingVertical: espaco.xxl * 1.5, gap: espaco.md },
  vazioCirculo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cores.neutroFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTexto: { color: cores.textoSecundario, fontSize: 14, textAlign: "center" },

  barraAcaoExterna: {
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    ...sombraMedia,
  },
  barraAcaoInterna: { flex: 0, maxWidth: larguras.conteudo, padding: espaco.lg },
});
