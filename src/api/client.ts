import { API_URL } from "./config";
import { storage } from "./storage";

export class ApiError extends Error {}

async function request<T>(
  caminho: string,
  opcoes: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await storage.obterToken();

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: opcoes.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
  });

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : undefined;

  if (!resposta.ok) {
    throw new ApiError(dados?.erro ?? "Erro ao comunicar com o servidor");
  }

  return dados as T;
}

export const api = {
  get: <T>(caminho: string) => request<T>(caminho),
  post: <T>(caminho: string, body?: unknown) => request<T>(caminho, { method: "POST", body }),
  put: <T>(caminho: string, body?: unknown) => request<T>(caminho, { method: "PUT", body }),
  delete: <T>(caminho: string) => request<T>(caminho, { method: "DELETE" }),
};
