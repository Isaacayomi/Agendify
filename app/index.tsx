import { color } from "@/constants/colors";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, Text, View } from "react-native";

export function RootIndex() {
  return (
    <View style={styles.container}>
      <BlurView
        intensity={40}
        tint="dark"
        style={{ ...StyleSheet.absoluteFillObject }}
      />

      <Image
        style={styles.image}
        source={require("../assets/images/icon.png")}
      />

      <Text style={styles.text}>Agendify</Text>
    </View>
  );
}

export default RootIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.bgColor,
  },

  image: {
    height: 240,
    width: 240,
  },

  text: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
    textAlign: "center",
  },
});
