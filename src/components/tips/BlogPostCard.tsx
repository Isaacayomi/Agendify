import { color } from "@/constants/colors";
import { formatBlogPublishedDate } from "@/src/lib/date";
import type { BlogPost } from "@/src/types/blog";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface BlogPostCardProps {
  post: BlogPost;
  onPress: () => void;
}

export function BlogPostCard({ post, onPress }: BlogPostCardProps) {
  const publishedLabel = formatBlogPublishedDate(post.publishedAt);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.source}>{post.topic}</Text>
        <Text style={styles.readTime}>{post.readTime}</Text>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.excerpt} numberOfLines={3}>
        {post.excerpt}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.published}>{publishedLabel}</Text>
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>Read now</Text>
          <Feather name="arrow-up-right" size={16} color={color.rateBorderColor} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  source: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
    backgroundColor: color.tipCardPillBackground,
    borderColor: color.tipCardPillBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  readTime: {
    color: color.date,
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 11,
    lineHeight: 16,
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  excerpt: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  published: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cta: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
});
