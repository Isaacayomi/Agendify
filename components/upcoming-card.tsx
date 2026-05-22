import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  UpcomingCardData,
  UpcomingCardItem,
} from "@/components/upcoming-card-item";
import { getUpcomingCards } from "@/src/lib/home";
import { useSessionStore } from "@/src/store/useSessionStore";
import { router } from "expo-router";

export interface UpcomingCardProps {
  selectedDate?: string;
}

export default function UpcomingCard({ selectedDate }: UpcomingCardProps) {
  const sessions = useSessionStore((state) => state.sessions);
  const upcomingCards = useMemo(
    () => getUpcomingCards(sessions, selectedDate),
    [sessions, selectedDate],
  );

  const renderItem: ListRenderItem<UpcomingCardData> = ({ item }) => (
    <UpcomingCardItem item={item} />
  );

  return (
    <FlatList
      data={upcomingCards}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Feather name="calendar" size={18} color={color.seeAll} />
          </View>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              router.push({
                pathname: "/modal/[entity]",
                params: { entity: "session" },
              });
            }}
            style={styles.emptyAction}
          >
            <Text style={styles.emptyActionText}>Add a session</Text>
          </Pressable>
        </View>
      }
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 6,
  },
  emptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.calendarBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: color.borderColor,
  },
  emptyTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyAction: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyActionText: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});
