import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { COLORS } from '../utils/theme';
import { getHijriMonthGrid, getUpcomingEvents, getHijriDate } from '../utils/hijriUtils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HijriScreen({ navigation }) {
    const { theme, isDark } = useTheme();
    const [baseDate, setBaseDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);

    useEffect(() => {
        const data = getHijriMonthGrid(baseDate);
        setCalendarData(data);
    }, [baseDate]);

    const handlePrevMonth = () => {
        if (!calendarData) return;
        const prevMonthDate = new Date(calendarData.startDate);
        prevMonthDate.setDate(prevMonthDate.getDate() - 1);
        setBaseDate(prevMonthDate);
    };

    const handleNextMonth = () => {
        if (!calendarData) return;
        const nextMonthDate = new Date(calendarData.endDate);
        nextMonthDate.setDate(nextMonthDate.getDate() + 1);
        setBaseDate(nextMonthDate);
    };

    const events = getUpcomingEvents();

    if (!calendarData) return null;

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 mb-2">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className={`p-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                >
                    <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Hijri Calendar
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Calendar Card */}
                <View className={`rounded-3xl p-4 mb-6 shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

                    {/* Month Navigation */}
                    <View className="flex-row justify-between items-center mb-6 px-2">
                        <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {calendarData.monthName} {calendarData.year}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleNextMonth} className="p-2">
                            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Weekdays Header */}
                    <View className="flex-row justify-between mb-2 border-b pb-2 border-slate-100 dark:border-slate-700">
                        {WEEKDAYS.map((day, index) => (
                            <Text key={index} className={`w-[13%] text-center text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View className="flex-row flex-wrap justify-between">
                        {calendarData.days.map((day, index) => {
                            if (!day) return <View key={index} className="w-[13%] aspect-square mb-2" />;

                            const isToday = day.isToday;

                            return (
                                <View key={index} className="w-[13%] aspect-square mb-2 items-center justify-center">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isToday ? (isDark ? 'bg-emerald-600' : 'bg-primary') : ''}`}>
                                        <Text className={`font-bold text-base ${isToday ? 'text-white' : (isDark ? 'text-slate-200' : 'text-slate-800')}`}>
                                            {day.hijriDay}
                                        </Text>
                                    </View>
                                    {/* Optional Gregorian Day Small */}
                                    {/* <Text className="text-[8px] text-gray-400">{day.gregorianDate.getDate()}</Text> */}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Events Section */}
                <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Important Islamic Dates
                </Text>

                <View className={`rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm mb-10`}>
                    {events.map((event, index) => (
                        <View
                            key={index}
                            className={`flex-row p-4 items-center border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} ${index === events.length - 1 ? 'border-b-0' : ''}`}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                <Text className={`font-bold ${isDark ? 'text-emerald-400' : 'text-primary'}`}>{index + 1}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {event.name}
                                </Text>
                                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {event.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
