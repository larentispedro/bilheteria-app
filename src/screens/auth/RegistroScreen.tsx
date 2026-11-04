import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Botao, Campo, Cartao, Erro, TelaRolavel, Titulo } from "../../components/ui";
import { espaco } from "../../theme";

export function RegistroScreen() {
  const { registrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const podeEnviar = nome.trim().length >= 2 && email.includes("@") && senha.length >= 6;

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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TelaRolavel largura={420}>
        <Titulo texto="Criar conta" apoio="Você poderá comprar ingressos e escolher seus assentos." />
        <Cartao>
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
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="••••••"
            dica="Mínimo de 6 caracteres."
          />
          <Botao
            titulo="Criar conta"
            onPress={aoRegistrar}
            carregando={carregando}
            desabilitado={!podeEnviar}
          />
        </Cartao>
      </TelaRolavel>
    </KeyboardAvoidingView>
  );
}
