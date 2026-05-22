import { color } from "@/constants/colors";
import { Svg, Circle } from "react-native-svg";

export interface HomeGoalRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  trackColor?: string;
}

export function HomeGoalRing({
  percentage,
  size = 160,
  strokeWidth = 12,
  strokeColor = color.rateBorderColor,
  trackColor = color.goalCardTrackBackground,
}: HomeGoalRingProps) {
  const clampedPercentage = Math.max(0, Math.min(percentage, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clampedPercentage / 100);

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute" }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}
