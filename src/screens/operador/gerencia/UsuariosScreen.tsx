import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "../../../api/client";
import {
  Badge,
  Botao,
  Campo,
  Cartao,
  Erro,
  Subtitulo,
  TelaRolavel,
  Titulo,
  Vazio,
} from "../../../components/ui";
import { cores, espaco, raio } from "../../../theme";
import type { Papel, Usuario } from "../../../types/api";

function SeletorPapel({ valor, aoMudar }: { valor: Papel; aoMudar: (papel: Papel) => void }) {
  const opcoes: Array<{ papel: Papel; rotulo: string }> = [
    { papel: "CLIENTE", rotulo: "Cliente" },
    { papel: "OPERADOR", rotulo: "Operador" },
  ];
  return (
    <View style={{ flexDirection: "row", gap: espaco.sm, marginBottom: espaco.md }}>
      {opcoes.map((opcao) => {
        const ativo = valor === opcao.papel;
        return (
          <TouchableOpacity
            key={opcao.papel}
            activeOpacity={0.7}
            onPress={() => aoMudar(opcao.papel)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              borderRadius: raio.md,
              backgroundColor: ativo ? cores.primaria : cores.superficie,
              borderWidth: 1,
              borderColor: ativo ? cores.primaria : cores.bordaForte,
            }}
          >
            <Text style={{ color: ativo ? "#fff" : cores.texto, fontWeight: "700", fontSize: 13 }}>
              {opcao.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<Papel>("OPERADOR");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    api.get<Usuario[]>("/usuarios").then(setUsuarios);
  }, []);

  useFocusEffect(carregar);

  const podeCriar = nome.trim().length >= 2 && email.includes("@") && senha.length >= 6;

  async function criar() {
    setErro(null);
    setSalvando(true);
    try {
      await api.post("/usuarios", { nome: nome.trim(), email: email.trim(), senha, papel });
      setNome("");
      setEmail("");
      setSenha("");
      setPapel("OPERADOR");
      carregar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível cadastrar o usuário");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <TelaRolavel>
      <Titulo texto="Usuários" apoio="Cadastre operadores que vão acessar a gerência e a bilheteria." />
      <Erro mensagem={erro} />

      <Cartao>
        <Campo label="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" />
        <Campo
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="pessoa@exemplo.com"
        />
        <Campo
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••"
          dica="Mínimo de 6 caracteres."
        />
        <SeletorPapel valor={papel} aoMudar={setPapel} />
        <Botao
          titulo="Cadastrar usuário"
          icone="person-add"
          onPress={criar}
          carregando={salvando}
          desabilitado={!podeCriar}
        />
      </Cartao>

      <Subtitulo texto={`Cadastrados (${usuarios.length})`} />

      {usuarios.length === 0 ? (
        <Vazio icone="people-outline" texto="Nenhum usuário cadastrado ainda." />
      ) : (
        usuarios.map((usuario) => (
          <Cartao key={usuario.id} style={{ paddingVertical: espaco.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: espaco.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: cores.texto, fontSize: 15 }}>
                  {usuario.nome}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <Ionicons name="mail-outline" size={13} color={cores.textoSecundario} />
                  <Text style={{ color: cores.textoSecundario, fontSize: 13 }}>{usuario.email}</Text>
                </View>
              </View>
              <Badge
                texto={usuario.papel === "OPERADOR" ? "Operador" : "Cliente"}
                tom={usuario.papel === "OPERADOR" ? "info" : "neutro"}
              />
            </View>
          </Cartao>
        ))
      )}
    </TelaRolavel>
  );
}
