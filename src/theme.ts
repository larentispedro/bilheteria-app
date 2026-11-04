// Tokens visuais do app. Qualquer cor, espaçamento ou raio usado nas telas
// deve sair daqui — nada de valores soltos no meio dos componentes.

export const cores = {
  // Superfícies
  fundo: "#f4f5f7",
  superficie: "#ffffff",
  superficieSutil: "#fafafb",
  borda: "#e6e8ec",
  bordaForte: "#d3d7de",

  // Marca
  tinta: "#17182b", // cabeçalhos e áreas escuras
  tintaSuave: "#272944",
  primaria: "#4f46e5",
  primariaEscura: "#4338ca",
  primariaClara: "#eef2ff",

  // Texto
  texto: "#17182b",
  textoSecundario: "#6b7280",
  textoTerciario: "#9ca3af",
  textoClaro: "#ffffff",

  // Status
  sucesso: "#15803d",
  sucessoFundo: "#dcfce7",
  aviso: "#b45309",
  avisoFundo: "#fef3c7",
  perigo: "#b91c1c",
  perigoFundo: "#fee2e2",
  neutro: "#6b7280",
  neutroFundo: "#f1f2f4",

  // Mapa de assentos
  assentoLivreFundo: "#ffffff",
  assentoLivreBorda: "#cbd0d8",
  assentoReservado: "#f59e0b",
  assentoVendido: "#9aa1ad",
  assentoSelecionado: "#4f46e5",
};

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const raio = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

/**
 * O app roda em celular e no navegador. Sem um limite de largura, as telas
 * esticam pela janela inteira e os cartões ficam com um metro de largura.
 */
export const larguras = {
  conteudo: 560, // formulários, listas, fluxo de compra
  largo: 900, // relatórios e tabelas
};

export const sombra = {
  shadowColor: "#0b0b14",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

export const sombraMedia = {
  shadowColor: "#0b0b14",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 4,
};

export const opcoesNavegacao = {
  headerStyle: { backgroundColor: cores.tinta },
  headerTintColor: cores.textoClaro,
  headerTitleStyle: { fontWeight: "700" as const, fontSize: 17 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: cores.fundo },
};

export const opcoesTabs = {
  tabBarActiveTintColor: cores.primaria,
  tabBarInactiveTintColor: cores.textoSecundario,
  // Altura explícita: o padrão da web (49px) não acomoda ícone + rótulo e
  // corta o texto das abas.
  tabBarStyle: {
    backgroundColor: cores.superficie,
    borderTopColor: cores.borda,
    borderTopWidth: 1,
    height: 66,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabBarLabelStyle: { fontSize: 11, fontWeight: "600" as const, marginTop: 2 },
};
