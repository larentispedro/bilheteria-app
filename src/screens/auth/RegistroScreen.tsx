import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Botao, Campo, Erro, Titulo, estilos } from "../../components/ui";
import { cores } from "../../theme";

export function RegistroScreen() {
  const { registrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoRegistrar() {
    setErro(null);
    setCarregando(true);
    try {
      await registrar(nome.trim(), email.trim(), senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[estilos.tela, { backgroundColor: cores.fundo }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
        <Titulo texto="Criar conta de cliente" />
        <Erro mensagem={erro} />
        <Campo label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
        <Campo
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="voce@exemplo.com"
        />
        <Campo
          label="Senha (mín. 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••"
        />
        <Botao titulo="Cadastrar" onPress={aoRegistrar} carregando={carregando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
