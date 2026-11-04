import { Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "./ui";
import { dataHoraCurta } from "../format";
import { cores, espaco, raio, sombra } from "../theme";
import type { Ingresso } from "../types/api";

const FONTE_MONO = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });

/** Cartão em formato de ingresso, com canhoto destacável e código único. */
export function TicketIngresso({ ingresso }: { ingresso: Ingresso }) {
  const { assento, sessao } = ingresso.reserva;
  const utilizado = ingresso.status === "UTILIZADO";

  return (
    <View style={{ borderRadius: raio.lg, overflow: "hidden", marginBottom: espaco.md, ...sombra }}>
      {/* Parte superior */}
      <View
        style={{
          backgroundColor: utilizado ? cores.tintaSuave : cores.tinta,
          padding: espaco.lg,
          opacity: utilizado ? 0.75 : 1,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: espaco.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }} numberOfLines={2}>
              {sessao.evento.titulo}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
              <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.65)" />
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                {dataHoraCurta(sessao.dataHora)}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 1 }}>ASSENTO</Text>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 24, lineHeight: 28 }}>
              {assento.fila}
              {assento.numero}
            </Text>
          </View>
        </View>
      </View>

      {/* Picote */}
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: cores.superficie }}>
        <View style={recorte("esquerda")} />
        <View style={{ flex: 1, height: 1, borderBottomWidth: 1, borderStyle: "dashed", borderColor: cores.bordaForte }} />
        <View style={recorte("direita")} />
      </View>

      {/* Canhoto */}
      <View style={{ backgroundColor: cores.superficie, padding: espaco.lg }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, color: cores.textoTerciario, letterSpacing: 1, fontWeight: "700" }}>
              CÓDIGO DO INGRESSO
            </Text>
            <Text
              style={{ fontFamily: FONTE_MONO, fontWeight: "700", color: cores.texto, marginTop: 3, fontSize: 12 }}
              selectable
            >
              {ingresso.codigoUnico}
            </Text>
          </View>
          <Badge texto={utilizado ? "Utilizado" : "Válido"} tom={utilizado ? "utilizado" : "valido"} />
        </View>
      </View>
    </View>
  );
}

const recorte = (lado: "esquerda" | "direita") => ({
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: cores.fundo,
  marginLeft: lado === "esquerda" ? -8 : 0,
  marginRight: lado === "direita" ? -8 : 0,
});
