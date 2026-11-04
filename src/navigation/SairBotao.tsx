import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { cores } from "../theme";

export function SairBotao() {
  const { sair } = useAuth();
  return (
    <TouchableOpacity onPress={() => sair()} style={{ marginRight: 16 }} hitSlop={10}>
      <Ionicons name="log-out-outline" size={22} color={cores.textoClaro} />
    </TouchableOpacity>
  );
}
