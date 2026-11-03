import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "../api/client";
import { storage } from "../api/storage";
import type { Usuario } from "../types/api";

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  entrar(email: string, senha: string): Promise<void>;
  registrar(nome: string, email: string, senha: string): Promise<void>;
  sair(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface RespostaAuth {
  usuario: Usuario;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      const token = await storage.obterToken();
      if (!token) return;
      try {
        const perfil = await api.get<Usuario>("/auth/me");
        setUsuario(perfil);
      } catch {
        await storage.removerToken();
      }
    }
    restaurarSessao().finally(() => setCarregando(false));
  }, []);

  async function entrar(email: string, senha: string) {
    const resposta = await api.post<RespostaAuth>("/auth/login", { email, senha });
    await storage.salvarToken(resposta.token);
    setUsuario(resposta.usuario);
  }

  async function registrar(nome: string, email: string, senha: string) {
    const resposta = await api.post<RespostaAuth>("/auth/registrar", { nome, email, senha });
    await storage.salvarToken(resposta.token);
    setUsuario(resposta.usuario);
  }

  async function sair() {
    await storage.removerToken();
    setUsuario(null);
  }

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, registrar, sair }),
    [usuario, carregando],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return contexto;
}

export { ApiError };
