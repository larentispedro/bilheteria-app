import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export function SairBotao() {
  const { sair } = useAuth();
  return (
    <TouchableOpacity onPress={() => sair()} style={{ marginRight: 12 }}>
      <Text style={{ color: "#2f5bea", fontWeight: "600" }}>Sair</Text>
    </TouchableOpacity>
  );
}
