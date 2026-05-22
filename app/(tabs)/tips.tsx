import { RecommendedReadCard } from "@/components/recommended-read-card";
import { TipsCard } from "@/components/tips-card";
import { color } from "@/constants/colors";
import { fetchStudentProductivityTips, type GroqTip } from "@/lib/groq";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TIP_CARD_WIDTH = 300;
const TIP_CARD_SPACING = 16;
const TIP_CARD_STEP = TIP_CARD_WIDTH + TIP_CARD_SPACING;

export function TipsScreen() {
  const [tips, setTips] = useState<GroqTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const tipsScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTips = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedTips = await fetchStudentProductivityTips();

        if (!isMounted) {
          return;
        }

        setTips(fetchedTips);
        setActiveTipIndex(0);
        tipsScrollViewRef.current?.scrollTo({ x: 0, animated: false });
      } catch (unknownError: unknown) {
        if (!isMounted) {
          return;
        }

        const message =
          unknownError instanceof Error
            ? unknownError.message
            : "Something went wrong while loading tips.";

        setError(message);
        setTips([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadTips();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshTips = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedTips = await fetchStudentProductivityTips();
      setTips(fetchedTips);
      setActiveTipIndex(0);
      tipsScrollViewRef.current?.scrollTo({ x: 0, animated: false });
    } catch (unknownError: unknown) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : "Something went wrong while loading tips.";

      setError(message);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  const showErrorState = error !== null;
  const refreshLabel = showErrorState ? "Retry Tips" : "Refresh Tips";

  const handleTipPress = (index: number) => {
    if (loading || showErrorState) {
      return;
    }

    setActiveTipIndex(index);
    tipsScrollViewRef.current?.scrollTo({
      x: TIP_CARD_STEP * index,
      animated: true,
    });
  };

  const handleTipMomentumEnd = (offsetX: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(tips.length - 1, Math.round(offsetX / TIP_CARD_STEP)),
    );

    setActiveTipIndex(nextIndex);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.heading}>Study tips</Text>
        <Text style={styles.subheading}>One useful idea for today.</Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={color.rateBorderColor} />
          <Text style={styles.loadingText}>Loading fresh tips...</Text>
        </View>
      ) : showErrorState ? (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>
            We couldn&apos;t load fresh tips right now.
          </Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          ref={tipsScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={TIP_CARD_STEP}
          snapToAlignment="start"
          onMomentumScrollEnd={({ nativeEvent }) =>
            handleTipMomentumEnd(nativeEvent.contentOffset.x)
          }
        >
          {tips.map((tip) => (
            <TipsCard
              key={`${tip.topic}-${tip.tip}`}
              topic={tip.topic}
              tip={tip.tip}
            />
          ))}
        </ScrollView>
      )}

      {!loading && !showErrorState ? (
        <View style={styles.paginationWrap}>
          {tips.map((_, index) => (
            <Pressable
              key={`tip-dot-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`Go to tip ${index + 1}`}
              onPress={() => handleTipPress(index)}
              style={[
                styles.paginationDot,
                index === activeTipIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.actionWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={refreshLabel}
          onPress={() => void handleRefreshTips()}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshButtonText}>{refreshLabel}</Text>
        </Pressable>
      </View>

      <View style={styles.recommendedSection}>
        <Text style={styles.recommendedTitle}>Read next</Text>
        <RecommendedReadCard
          category="Focus"
          title="How to stay sharp during long study sessions"
          summary="A short guide to building better focus blocks, avoiding fatigue, and making breaks work for you."
          readTime="4 min read"
        />
      </View>
    </ScrollView>
  );
}

export default TipsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    marginTop: 48,
  },
  heading: {
    color: color.textColor,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  subheading: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: color.date,
    marginBottom: 20,
  },
  loadingState: {
    minHeight: 196,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.tipCardBorder,
    backgroundColor: color.tipCardBackground,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  errorState: {
    minHeight: 196,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.tipCardBorder,
    backgroundColor: color.tipCardBackground,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 6,
  },
  errorText: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  errorSubtext: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  paginationWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: color.calendarWeekdayText,
    opacity: 0.45,
  },
  paginationDotActive: {
    width: 28,
    backgroundColor: color.rateBorderColor,
    opacity: 1,
  },
  actionWrap: {
    alignItems: "center",
    marginTop: 16,
  },
  refreshButton: {
    borderRadius: 999,
    backgroundColor: color.rateBorderColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: color.rateBorderColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  refreshButtonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  recommendedSection: {
    marginTop: 28,
  },
  recommendedTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
});
