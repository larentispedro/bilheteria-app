import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Botao, Campo, Erro } from "../../components/ui";
import { cores, espaco, raio } from "../../theme";

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
      style={{ flex: 1, backgroundColor: cores.primaria }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: espaco.xl }}>
        <View style={{ alignItems: "center", marginBottom: espaco.xxl }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: raio.lg,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: espaco.md,
            }}
          >
            <Ionicons name="film" size={36} color="#fff" />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff" }}>Bilheteria</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
            Ingressos com assento marcado
          </Text>
        </View>

        <View
          style={{
            backgroundColor: cores.superficie,
            borderRadius: raio.lg,
            padding: espaco.lg,
          }}
        >
          <Erro mensagem={erro} />
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
          />
          <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />
          <TouchableOpacity onPress={() => navigation.navigate("Registro")} style={{ marginTop: espaco.lg }}>
            <Text style={{ textAlign: "center", color: cores.primaria, fontWeight: "600" }}>
              Não tem conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
