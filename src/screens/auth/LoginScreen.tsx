import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Botao, Campo, Erro, Titulo, estilos } from "../../components/ui";

export function LoginScreen({ navigation }: { navigation: any }) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    setErro(null);
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
        <Titulo texto="Entrar" />
        <Erro mensagem={erro} />
        <Campo
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Campo label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />
        <TouchableOpacity onPress={() => navigation.navigate("Registro")} style={{ marginTop: 16 }}>
          <Text style={{ textAlign: "center", color: "#2f5bea" }}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
