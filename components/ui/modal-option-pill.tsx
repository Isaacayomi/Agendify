import { color } from "@/constants/colors";
import { Pressable, StyleSheet, Text } from "react-native";

interface ModalOptionPillProps<T extends string> {
  value: T;
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function ModalOptionPill<T extends string>({
  value,
  selectedValue,
  onSelect,
}: ModalOptionPillProps<T>) {
  const isSelected = value === selectedValue;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onSelect(value)}
      style={[styles.pill, isSelected && styles.pillActive]}
    >
      <Text style={[styles.text, isSelected && styles.textActive]}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.borderColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: color.calendarBackground,
  },
  pillActive: {
    backgroundColor: color.rateBorderColor,
    borderColor: color.rateBorderColor,
  },
  text: {
    color: color.date,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    textTransform: "capitalize",
  },
  textActive: {
    color: color.textColor,
  },
});
