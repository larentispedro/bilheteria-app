import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { api } from "./api/client";

function blobParaBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve((leitor.result as string).split(",")[1] ?? "");
    leitor.onerror = reject;
    leitor.readAsDataURL(blob);
  });
}

/** Baixa um PDF do backend e abre pra salvar/compartilhar (web baixa direto; celular abre o menu de compartilhar). */
export async function exportarPdf(caminho: string, nomeArquivo: string) {
  const blob = await api.baixarBlob(caminho);

  if (Platform.OS === "web") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const base64 = await blobParaBase64(blob);
  const arquivo = new File(Paths.cache, nomeArquivo);
  arquivo.create({ overwrite: true });
  await arquivo.write(base64, { encoding: "base64" });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri, { mimeType: "application/pdf", UTI: ".pdf" });
  }
}
