import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getData, WORSHIP_HISTORY_KEY } from '../utils/storage';
import { COLORS } from '../utils/theme';

export default function RamadhanGoalGraph() {
    const [history, setHistory] = useState({});

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await getData(WORSHIP_HISTORY_KEY);
        if (data) {
            setHistory(data);
        }
    };

    // Generate last 28 days for a 4-week grid visualization
    const days = [];
    for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toDateString());
    }

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm mt-4">
            <Text className="text-primary font-bold text-xl mb-3">Ramadhan Goals</Text>
            <View className="flex-row flex-wrap justify-between gap-1">
                {days.map((dateStr, index) => {
                    const percentage = history[dateStr] || 0;
                    // Opacity logic: 0% -> 0.1 (so it's visible as empty), 100% -> 1.0
                    // If percentage is 0, we still want a placeholder box.
                    const opacity = Math.max(0.1, percentage);
                    const isToday = dateStr === new Date().toDateString();

                    return (
                        <View
                            key={index}
                            className={`w-4 h-4 rounded-sm ${isToday ? 'border border-primary' : ''}`}
                            style={{
                                backgroundColor: COLORS.primary,
                                opacity: percentage > 0 ? opacity : 0.1
                            }}
                        />
                    );
                })}
            </View>
            <View className="flex-row justify-end items-center mt-2">
                <Text className="text-[10px] text-textSecondary mr-1">Less</Text>
                <View className="w-2 h-2 bg-primary opacity-10 rounded-sm mr-1" />
                <View className="w-2 h-2 bg-primary opacity-50 rounded-sm mr-1" />
                <View className="w-2 h-2 bg-primary rounded-sm mr-1" />
                <Text className="text-[10px] text-textSecondary">More</Text>
            </View>
        </View>
    );
}
