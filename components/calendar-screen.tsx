import UpcomingCard from "@/components/upcoming-card";
import { color } from "@/constants/colors";
import {
  calendarLocale,
  createCalendarArrowRenderer,
  getTodayDateString,
} from "@/lib/calendar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContent}>
        <Text style={styles.title}>Calendar</Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.weekButton}>
            <Text style={styles.weekButtonText}>Week</Text>
          </Pressable>
          <Pressable style={styles.monthButton}>
            <Text style={styles.monthButtonText}>Month</Text>
          </Pressable>
        </View>
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

      <Text style={styles.date}>Friday, 15</Text>
      <UpcomingCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  monthButton: {
    backgroundColor: color.calendarMonthButtonBackground,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  weekButtonText: {
    color: color.ratingText,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  monthButtonText: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  calendar: {
    backgroundColor: color.ratingBgColor,
    marginHorizontal: "auto",
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 20,
    width: 350,
    // marginHorizontal: -4,
    overflow: "hidden",
  },
  selectedDayContainer: {
    alignItems: "center",
    backgroundColor: color.calendarSelectedBackground,
    borderRadius: 12,
    // height: 41.72,
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
});
