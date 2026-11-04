export const cores = {
  primaria: "#4338ca",
  primariaEscura: "#3730a3",
  primariaClara: "#eef2ff",
  fundo: "#f4f5f9",
  superficie: "#ffffff",
  borda: "#e4e4ec",
  texto: "#1e1e2b",
  textoSecundario: "#6b6b7c",
  textoClaro: "#ffffff",
  sucesso: "#16a34a",
  sucessoFundo: "#dcfce7",
  aviso: "#d97706",
  avisoFundo: "#fef3c7",
  perigo: "#dc2626",
  perigoFundo: "#fee2e2",
  neutro: "#9ca3af",
  neutroFundo: "#f1f1f5",
};

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const raio = { sm: 8, md: 12, lg: 16, pill: 999 };

export const sombra = {
  shadowColor: "#1e1e2b",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 2,
};

export const opcoesNavegacao = {
  headerStyle: { backgroundColor: cores.primaria },
  headerTintColor: cores.textoClaro,
  headerTitleStyle: { fontWeight: "700" as const },
  headerShadowVisible: false,
};

export const opcoesTabs = {
  tabBarActiveTintColor: cores.primaria,
  tabBarInactiveTintColor: cores.textoSecundario,
  tabBarStyle: { borderTopColor: cores.borda },
};
