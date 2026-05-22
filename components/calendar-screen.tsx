import { FloatingActionButton } from "@/components/ui/floating-action-button";
import UpcomingCard from "@/components/upcoming-card";
import { color } from "@/constants/colors";
import {
  calendarLocale,
  createCalendarArrowRenderer,
  formatCalendarDateLabel,
  getTodayDateString,
} from "@/lib/calendar";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LocaleConfig } from "react-native-calendars/src";
import Calendar from "react-native-calendars/src/calendar";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";

LocaleConfig.locales.agendify = calendarLocale;
LocaleConfig.defaultLocale = "agendify";

const calendarTheme = {
  arrowColor: color.calendarArrow,
  backgroundColor: color.calendarBackground,
  calendarBackground: color.calendarBackground,
  dayTextColor: color.textColor,
  monthTextColor: color.calendarHeaderText,
  textDayFontFamily: "Inter_500Medium",
  textDayFontSize: 12,
  textDayHeaderFontFamily: "Inter_400Regular",
  textDayHeaderFontSize: 10,
  textMonthFontFamily: "DMSans_700Bold",
  textMonthFontSize: 14,
  textMonthFontWeight: "700",
  textDisabledColor: color.calendarDisabledText,
  todayTextColor: color.rateBorderColor,
  selectedDayBackgroundColor: color.rateBorderColor,
  selectedDayTextColor: color.textColor,
  stylesheet: {
    calendar: {
      header: {
        monthText: {
          color: color.calendarHeaderText,
          fontFamily: "DMSans_700Bold",
          fontSize: 14,
          fontWeight: "700",
          lineHeight: 20,
        },
        dayHeader: {
          color: color.calendarWeekdayText,
          fontFamily: "Inter_400Regular",
          fontSize: 10,
          fontWeight: "400",
          letterSpacing: 0.5,
          textAlign: "center",
          textTransform: "uppercase",
        },
      },
    },
  },
} as const;

export function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const selectedDay: MarkedDates = {
    [selectedDate]: {
      selected: true,
      customStyles: {
        container: styles.selectedDayContainer,
        text: styles.selectedDayText,
      },
    },
  };
  const renderCalendarArrow = createCalendarArrowRenderer(color.calendarArrow);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Calendar</Text>
        </View>

        <Calendar
          style={styles.calendar}
          current={selectedDate}
          markedDates={selectedDay}
          markingType="custom"
          onDayPress={({ dateString }: DateData) => setSelectedDate(dateString)}
          renderArrow={renderCalendarArrow}
          theme={calendarTheme}
        />

        <Text style={styles.date}>{formatCalendarDateLabel(selectedDate)}</Text>
        <UpcomingCard selectedDate={selectedDate} />
      </ScrollView>

      <View style={styles.fabWrap}>
        <FloatingActionButton
          accessibilityLabel="Add session"
          onPress={() =>
            router.push({
              pathname: "/modal/[entity]",
              params: { entity: "session" },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
    position: "relative",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    paddingTop: 49,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 17,
    marginTop: 48,
    gap: 15.6,
  },
  weekButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  weekButtonActive: {
    backgroundColor: color.calendarMonthButtonBackground,
  },
  monthButton: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  monthButtonActive: {
    backgroundColor: color.calendarMonthButtonBackground,
  },
  weekButtonText: {
    color: color.ratingText,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  weekButtonTextActive: {
    color: color.rateBorderColor,
  },
  monthButtonText: {
    color: color.ratingText,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  monthButtonTextActive: {
    color: color.rateBorderColor,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  calendar: {
    backgroundColor: color.ratingBgColor,
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 20,
    width: 350,
    overflow: "hidden",
  },
  selectedDayContainer: {
    alignItems: "center",
    backgroundColor: color.calendarSelectedBackground,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: color.calendarSelectedShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: 41.72,
    elevation: 8,
  },
  selectedDayText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
  },
  date: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 24,
    paddingBottom: 12,
  },
  fabWrap: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
});
