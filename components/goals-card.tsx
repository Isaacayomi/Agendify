import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

type GoalCardTone = "primary" | "risk" | "success";

interface GoalsCardProps {
  completed: boolean;
  label: string;
  value: string;
  status: string;
  progress: number;
  tone: GoalCardTone;
  onPress?: () => void;
  onMarkComplete?: () => void;
}

const DAILY_STUDY_SVG = `
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 5.25V15.75" stroke="${color.goalCardPrimaryText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 13.5C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V3C1.5 2.80109 1.57902 2.61032 1.71967 2.46967C1.86032 2.32902 2.05109 2.25 2.25 2.25H6C6.79565 2.25 7.55871 2.56607 8.12132 3.12868C8.68393 3.69129 9 4.45435 9 5.25C9 4.45435 9.31607 3.69129 9.87868 3.12868C10.4413 2.56607 11.2044 2.25 12 2.25H15.75C15.9489 2.25 16.1397 2.32902 16.2803 2.46967C16.421 2.61032 16.5 2.80109 16.5 3V12.75C16.5 12.9489 16.421 13.1397 16.2803 13.2803C16.1397 13.421 15.9489 13.5 15.75 13.5H11.25C10.6533 13.5 10.081 13.7371 9.65901 14.159C9.23705 14.581 9 15.1533 9 15.75C9 15.1533 8.76295 14.581 8.34099 14.159C7.91903 13.7371 7.34674 13.5 6.75 13.5H2.25Z" stroke="${color.goalCardPrimaryText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const RISK_SVG = `
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 5.25V15.75" stroke="${color.goalCardRiskText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 13.5C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V3C1.5 2.80109 1.57902 2.61032 1.71967 2.46967C1.86032 2.32902 2.05109 2.25 2.25 2.25H6C6.79565 2.25 7.55871 2.56607 8.12132 3.12868C8.68393 3.69129 9 4.45435 9 5.25C9 4.45435 9.31607 3.69129 9.87868 3.12868C10.4413 2.56607 11.2044 2.25 12 2.25H15.75C15.9489 2.25 16.1397 2.32902 16.2803 2.46967C16.421 2.61032 16.5 2.80109 16.5 3V12.75C16.5 12.9489 16.421 13.1397 16.2803 13.2803C16.1397 13.421 15.9489 13.5 15.75 13.5H11.25C10.6533 13.5 10.081 13.7371 9.65901 14.159C9.23705 14.581 9 15.1533 9 15.75C9 15.1533 8.76295 14.581 8.34099 14.159C7.91903 13.7371 7.34674 13.5 6.75 13.5H2.25Z" stroke="${color.goalCardRiskText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const COMPLETED_SVG = `
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 5.25V15.75" stroke="${color.goalCardSuccessText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 13.5C2.05109 13.5 1.86032 13.421 1.71967 13.2803C1.57902 13.1397 1.5 12.9489 1.5 12.75V3C1.5 2.80109 1.57902 2.61032 1.71967 2.46967C1.86032 2.32902 2.05109 2.25 2.25 2.25H6C6.79565 2.25 7.55871 2.56607 8.12132 3.12868C8.68393 3.69129 9 4.45435 9 5.25C9 4.45435 9.31607 3.69129 9.87868 3.12868C10.4413 2.56607 11.2044 2.25 12 2.25H15.75C15.9489 2.25 16.1397 2.32902 16.2803 2.46967C16.421 2.61032 16.5 2.80109 16.5 3V12.75C16.5 12.9489 16.421 13.1397 16.2803 13.2803C16.1397 13.421 15.9489 13.5 15.75 13.5H11.25C10.6533 13.5 10.081 13.7371 9.65901 14.159C9.23705 14.581 9 15.1533 9 15.75C9 15.1533 8.76295 14.581 8.34099 14.159C7.91903 13.7371 7.34674 13.5 6.75 13.5H2.25Z" stroke="${color.goalCardSuccessText}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const goalToneStyles = {
  primary: {
    iconBg: color.goalCardPrimaryIconBg,
    textColor: color.goalCardPrimaryText,
    borderColor: color.goalCardPrimaryBorder,
    backgroundColor: color.goalCardPrimaryBackground,
    iconSvg: DAILY_STUDY_SVG,
  },
  risk: {
    iconBg: color.goalCardRiskIconBg,
    textColor: color.goalCardRiskText,
    borderColor: color.goalCardRiskBorder,
    backgroundColor: color.goalCardRiskBackground,
    iconSvg: RISK_SVG,
  },
  success: {
    iconBg: color.goalCardSuccessIconBg,
    textColor: color.goalCardSuccessText,
    borderColor: color.goalCardSuccessBorder,
    backgroundColor: color.goalCardSuccessBackground,
    iconSvg: COMPLETED_SVG,
  },
} satisfies Record<
  GoalCardTone,
  {
    iconBg: string;
    textColor: string;
    borderColor: string;
    backgroundColor: string;
    iconSvg: string;
  }
>;

export function GoalsCard({
  completed,
  label,
  value,
  status,
  progress,
  tone,
  onPress,
  onMarkComplete,
}: GoalsCardProps) {
  const toneStyles = goalToneStyles[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens goal details"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        completed && styles.completedCard,
        pressed && styles.pressedCard,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: toneStyles.iconBg }]}>
          <SvgXml xml={toneStyles.iconSvg} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: toneStyles.backgroundColor,
              borderColor: toneStyles.borderColor,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: toneStyles.textColor }]}>
            {status}
          </Text>
        </View>

        <View
          style={[
            styles.chevronWrap,
            { borderColor: toneStyles.borderColor, backgroundColor: toneStyles.backgroundColor },
          ]}
        >
          <Feather name="chevron-right" size={16} color={toneStyles.textColor} />
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(8, Math.min(progress, 100))}%`,
              backgroundColor: toneStyles.textColor,
            },
          ]}
        />
      </View>

      {onMarkComplete && !completed ? (
        <Pressable
          accessibilityRole="button"
          onPress={onMarkComplete}
          style={styles.action}
        >
          <Text style={styles.actionText}>Mark complete</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  pressedCard: {
    opacity: 0.88,
  },
  completedCard: {
    borderColor: color.goalCardSuccessBorder,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  value: {
    color: color.date,
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 33554400,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  chevronWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  progressTrack: {
    marginTop: 12,

    height: 12,
    borderRadius: 33554400,
    backgroundColor: color.goalCardTrackBackground,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 33554400,
  },
  action: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: color.goalCardPrimaryIconBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    color: color.goalCardPrimaryText,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
});
