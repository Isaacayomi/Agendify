import { AuthButton } from "@/components/ui/auth-button";
import { color } from "@/constants/colors";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export function RootIndex() {
  return (
    <View style={styles.container}>
      <BlurView
        intensity={40}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.hero}>
        <Image
          style={styles.image}
          source={require("../assets/images/icon.png")}
        />
        <Text style={styles.text}>Agendify</Text>
      </View>

      <View style={styles.footer}>
        <AuthButton
          label="Get Started ->"
          size="large"
          onPress={() => router.replace("/onboarding")}
        />
      </View>
    </View>
  );
}

export default RootIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: color.bgColor,
    gap: 32,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  image: {
    height: 220,
    width: 220,
  },
  text: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
    textAlign: "center",
  },
  footer: {
    width: "100%",
  },
});
