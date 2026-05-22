import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface FloatingActionButtonProps {
  accessibilityLabel: string;
  onPress: () => void;
}

export function FloatingActionButton({
  accessibilityLabel,
  onPress,
}: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Feather name="plus" size={20} color={color.textColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.rateBorderColor,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: color.rateBorderColor,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
