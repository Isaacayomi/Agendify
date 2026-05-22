import { color } from "@/constants/colors";
import { Pressable, StyleSheet, Text } from "react-native";

interface ModalSubmitButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ModalSubmitButton({
  label,
  onPress,
  disabled = false,
}: ModalSubmitButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: color.rateBorderColor,
    paddingVertical: 14,
    marginTop: 14,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  text: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
});
