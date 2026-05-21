import { color } from "@/constants/colors";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import SessionContainer from "./session-container";

export default function Sessions() {
  return (
    <View>
      <View style={styles.headingContainer}>
        <Text style={styles.title}>Today&apos;s Sessions</Text>
        <Link style={styles.seeAll} href="/calendar">
          See all
        </Link>
      </View>

      <SessionContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingTop: 28,
    paddingBottom: 12,
  },

  title: {
    color: "white",
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },

  seeAll: {
    color: color.seeAll,
  },
});
