import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export type UpcomingCardBorderColor =
  | typeof color.upcomingCardBorderPrimary
  | typeof color.upcomingCardBorderSecondary
  | typeof color.upcomingCardBorderSuccess
  | typeof color.upcomingCardBorderInfo;

export interface UpcomingCardData {
  id: string;
  title: string;
  time: string;
  borderColor: UpcomingCardBorderColor;
}

export interface UpcomingCardItemProps {
  item: UpcomingCardData;
}

export function UpcomingCardItem({ item }: UpcomingCardItemProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardTextContainer}>
        <View style={[styles.border, { borderLeftColor: item.borderColor }]}>
          <View style={styles.textBlock}>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={color.textColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 77,
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.upcomingCardBg,
    paddingVertical: 18,
    paddingHorizontal: 17,
    backgroundColor: color.ratingBgColor,
  },

  border: {
    borderLeftWidth: 4,
    borderRadius: 4,
    paddingLeft: 12,
  },

  textBlock: {
    flex: 1,
    paddingRight: 16,
  },

  heading: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_500Medium",
    color: color.textColor,
    paddingBottom: 2,
  },

  time: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
    fontSize: 12,
  },
});
