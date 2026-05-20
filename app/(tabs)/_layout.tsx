import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import {
  CalendarIcon,
  GoalIcon,
  HomeIcon,
  TaskIcon,
  TipsIcon,
} from "@/components/ui/icons";

const TAB_ACTIVE_COLOR = "#877AF7";
const TAB_INACTIVE_COLOR = "#8C8E9F";
const TAB_BAR_BACKGROUND = "rgba(23, 24, 31, 0.95)";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND,
          borderTopWidth: 0,
          height: 65,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          fontStyle: "normal",
          fontWeight: "500",
          letterSpacing: 0.25,
          lineHeight: 15,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => <CalendarIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goal"
        options={{
          title: "Goals",
          tabBarIcon: ({ focused }) => <GoalIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Tasks",
          tabBarIcon: ({ focused }) => <TaskIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tips",
          tabBarIcon: ({ focused }) => <TipsIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
