import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Botao, Campo, Erro } from "../../components/ui";
import { cores, espaco, raio, sombraMedia } from "../../theme";

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
      style={{ flex: 1, backgroundColor: cores.tinta }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: espaco.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 400 }}>
          <View style={{ alignItems: "center", marginBottom: espaco.xl }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: raio.lg,
                backgroundColor: cores.primaria,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: espaco.md,
              }}
            >
              <Ionicons name="film" size={30} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5 }}>
              Bilheteria
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 4, fontSize: 14 }}>
              Ingressos com assento marcado
            </Text>
          </View>

          <View
            style={{
              backgroundColor: cores.superficie,
              borderRadius: raio.xl,
              padding: espaco.xl,
              ...sombraMedia,
            }}
          >
            <Erro mensagem={erro} />
            <Campo
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="voce@exemplo.com"
            />
            <Campo
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="••••••"
              onSubmitEditing={aoEntrar}
              returnKeyType="go"
            />
            <View style={{ marginTop: espaco.sm }}>
              <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Registro")}
            style={{ marginTop: espaco.xl, alignSelf: "center" }}
            hitSlop={10}
          >
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
              Não tem conta? <Text style={{ color: "#fff", fontWeight: "700" }}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
