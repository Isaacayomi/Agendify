import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import {
  UpcomingCardData,
  UpcomingCardItem,
} from "@/components/upcoming-card-item";
import { color } from "@/constants/colors";

const UPCOMING_CARDS: UpcomingCardData[] = [
  {
    id: "card-1",
    title: "Review cardiology notes",
    time: "Today . 16:00",
    borderColor: color.upcomingCardBorderPrimary,
  },
  {
    id: "card-2",
    title: "Biochem revision",
    time: "Today . 18:00",
    borderColor: color.upcomingCardBorderSecondary,
  },
  {
    id: "card-3",
    title: "Attend biology class",
    time: "Tomorrow . 09:00",
    borderColor: color.upcomingCardBorderSuccess,
  },
  {
    id: "card-4",
    title: "Mock quiz practice",
    time: "Tomorrow . 14:30",
    borderColor: color.upcomingCardBorderInfo,
  },
];

export default function UpcomingCard() {
  const renderItem: ListRenderItem<UpcomingCardData> = ({ item }) => (
    <UpcomingCardItem item={item} />
  );

  return (
    <FlatList
      data={UPCOMING_CARDS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 4,
  },

  separator: {
    height: 12,
  },
});
