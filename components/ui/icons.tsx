import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const ACTIVE_ICON_COLOR = "#877AF7";
const INACTIVE_ICON_COLOR = "#8C8E9F";
const ACTIVE_BACKGROUND_COLOR = "rgba(135, 122, 247, 0.15)";

interface TabIconShellProps {
  focused: boolean;
  children: ReactNode;
}

function TabIconShell({ focused, children }: TabIconShellProps) {
  if (focused) {
    return <View style={styles.activeContainer}>{children}</View>;
  }

  return <>{children}</>;
}

interface IconBaseProps {
  color: string;
  size?: number;
}

function HomeGlyph({ color, size = 20 }: IconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 8.33333C2.49994 8.09088 2.55278 7.85135 2.65482 7.63142C2.75687 7.4115 2.90566 7.21649 3.09083 7.05999L8.92417 2.05999C9.22499 1.80575 9.60613 1.66626 10 1.66626C10.3939 1.66626 10.775 1.80575 11.0758 2.05999L16.9092 7.05999C17.0943 7.21649 17.2431 7.4115 17.3452 7.63142C17.4472 7.85135 17.5001 8.09088 17.5 8.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V8.33333Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarGlyph({ color, size = 20 }: IconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6.66699 1.66663V4.99996"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.333 1.66663V4.99996"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.8333 3.33337H4.16667C3.24619 3.33337 2.5 4.07957 2.5 5.00004V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V5.00004C17.5 4.07957 16.7538 3.33337 15.8333 3.33337Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 8.33337H17.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TaskGlyph({ color, size = 20 }: IconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect
        x="2.5"
        y="2.5"
        width="15"
        height="15"
        rx="4"
        stroke={color}
        strokeWidth="1.66667"
      />
      <Path
        d="M6.25 7H13.75"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
      <Path
        d="M6.25 10H13.75"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
      <Path
        d="M6.25 13H11"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
      <Path
        d="M5.5 7.1L6.35 7.95L7.85 6.45"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GoalGlyph({ color, size = 20 }: IconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle
        cx="10"
        cy="10"
        r="8.33333"
        stroke={color}
        strokeWidth="1.66667"
      />
      <Circle cx="10" cy="10" r="5" stroke={color} strokeWidth="1.66667" />
      <Circle cx="10" cy="10" r="1.66667" fill={color} />
    </Svg>
  );
}

function TipsGlyph({ color, size = 20 }: IconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M7.08333 14.1667H12.9167"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
      <Path
        d="M7.5 16.6667C7.5 15.8333 7.5 15 8.33333 14.1667H11.6667C12.5 15 12.5 15.8333 12.5 16.6667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 9.04167 5.73833 10.35 6.66667 11.25C7.29167 11.875 7.91667 12.7083 8.125 13.3333H11.875C12.0833 12.7083 12.7083 11.875 13.3333 11.25C14.2617 10.35 15 9.04167 15 7.5C15 4.73858 12.7614 2.5 10 2.5Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export interface HomeIconProps {
  focused: boolean;
}

export function HomeIcon({ focused }: HomeIconProps) {
  return (
    <TabIconShell focused={focused}>
      <HomeGlyph color={focused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR} />
    </TabIconShell>
  );
}

export interface CalendarIconProps {
  focused: boolean;
}

export function CalendarIcon({ focused }: CalendarIconProps) {
  return (
    <TabIconShell focused={focused}>
      <CalendarGlyph
        color={focused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
      />
    </TabIconShell>
  );
}

export interface TaskIconProps {
  focused: boolean;
}

export function TaskIcon({ focused }: TaskIconProps) {
  return (
    <TabIconShell focused={focused}>
      <TaskGlyph color={focused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR} />
    </TabIconShell>
  );
}

export interface GoalIconProps {
  focused: boolean;
}

export function GoalIcon({ focused }: GoalIconProps) {
  return (
    <TabIconShell focused={focused}>
      <GoalGlyph color={focused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR} />
    </TabIconShell>
  );
}

export interface TipsIconProps {
  focused: boolean;
}

export function TipsIcon({ focused }: TipsIconProps) {
  return (
    <TabIconShell focused={focused}>
      <TipsGlyph color={focused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR} />
    </TabIconShell>
  );
}

const styles = StyleSheet.create({
  activeContainer: {
    alignItems: "center",
    backgroundColor: ACTIVE_BACKGROUND_COLOR,
    borderRadius: 33554400,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
});
