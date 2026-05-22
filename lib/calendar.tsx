import { format, parseISO } from "date-fns";
import { StyleSheet, Text } from "react-native";
import type { Direction } from "react-native-calendars/src/types";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  arrow: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 18,
  },
});

export const calendarLocale = {
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  today: "Today",
};

export function getTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getTodayHeaderLabel(): string {
  return format(new Date(), "EEEE, MMMM d").toUpperCase();
}

export function formatCalendarDateLabel(dateString: string): string {
  return format(parseISO(dateString), "EEEE, d");
}

export function createCalendarArrowRenderer(color: string) {
  const arrowLabels: Record<Direction, string> = {
    left: "<",
    right: ">",
  };

  function CalendarArrow(direction: Direction): ReactNode {
    return (
      <Text style={[styles.arrow, { color }]}>
        {arrowLabels[direction]}
      </Text>
    );
  }

  return CalendarArrow;
}
