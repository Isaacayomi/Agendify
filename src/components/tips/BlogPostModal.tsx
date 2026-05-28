import { color } from "@/constants/colors";
import { formatBlogPublishedDate } from "@/src/lib/date";
import { generateStudyTakeaway } from "@/src/lib/groq-study-takeaway";
import type { BlogPost } from "@/src/types/blog";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface BlogPostModalProps {
  post: BlogPost | null;
  visible: boolean;
  onClose: () => void;
}

export function BlogPostModal({ post, visible, onClose }: BlogPostModalProps) {
  const [takeaway, setTakeaway] = useState<string | null>(null);
  const [loadingTakeaway, setLoadingTakeaway] = useState(false);
  const [takeawayError, setTakeawayError] = useState<string | null>(null);

  useEffect(() => {
    setTakeaway(null);
    setTakeawayError(null);
    setLoadingTakeaway(false);
  }, [post]);

  const handleGenerateTakeaway = async () => {
    if (!post || loadingTakeaway) {
      return;
    }

    try {
      setLoadingTakeaway(true);
      setTakeawayError(null);

      const generatedTakeaway = await generateStudyTakeaway(post);
      setTakeaway(generatedTakeaway);
    } catch (unknownError: unknown) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : "We couldn't generate a takeaway right now.";

      setTakeawayError(message);
    } finally {
      setLoadingTakeaway(false);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.headerTextBlock}>
                <Text style={styles.source}>{post.source}</Text>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.meta}>
                  {formatBlogPublishedDate(post.publishedAt)}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color={color.textColor} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.excerpt}>{post.excerpt}</Text>
              <Text style={styles.body}>{post.content}</Text>

              <View style={styles.takeawaySection}>
                <View style={styles.takeawayHeaderRow}>
                  <Text style={styles.takeawayTitle}>Study takeaway</Text>
                  <Pressable
                    accessibilityRole="button"
                    disabled={loadingTakeaway}
                    onPress={() => void handleGenerateTakeaway()}
                    style={styles.takeawayButton}
                  >
                    {loadingTakeaway ? (
                      <ActivityIndicator size="small" color={color.textColor} />
                    ) : (
                      <Text style={styles.takeawayButtonText}>
                        {takeaway ? "Regenerate" : "Generate"}
                      </Text>
                    )}
                  </Pressable>
                </View>

                {takeaway ? <Text style={styles.takeaway}>{takeaway}</Text> : null}
                {takeawayError ? (
                  <Text style={styles.takeawayError}>{takeawayError}</Text>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(12, 13, 18, 0.92)",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    width: "100%",
    maxHeight: "88%",
  },
  card: {
    width: "100%",
    maxHeight: "100%",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.bgColor,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  headerTextBlock: {
    flex: 1,
    gap: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: color.ratingBgColor,
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
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  meta: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 20,
  },
  excerpt: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  body: {
    color: color.textColor,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
  },
  takeawaySection: {
    borderTopWidth: 1,
    borderTopColor: color.borderColor,
    paddingTop: 20,
    gap: 12,
  },
  takeawayHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  takeawayTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
  takeawayButton: {
    borderRadius: 999,
    backgroundColor: color.rateBorderColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  takeawayButtonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  takeaway: {
    color: color.textColor,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  takeawayError: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
});
