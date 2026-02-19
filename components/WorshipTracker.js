import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { getData, storeData, WORSHIP_TRACKER_KEY, WORSHIP_HISTORY_KEY } from '../utils/storage';

const TASKS = [
    { id: 'fasting', label: 'Fasting (Sawm)', icon: 'restaurant-outline' }, // Should use a better icon like 'moon' or 'water' but reusing generic
    { id: 'fajr', label: 'Fajr Prayer', icon: 'sunny-outline' },
    { id: 'dhuhr', label: 'Dhuhr Prayer', icon: 'sunny' },
    { id: 'asr', label: 'Asr Prayer', icon: 'partly-sunny-outline' },
    { id: 'maghrib', label: 'Maghrib Prayer', icon: 'moon-outline' },
    { id: 'isha', label: 'Isha Prayer', icon: 'moon' },
    { id: 'quran', label: 'Read Quran', icon: 'book-outline' },
    { id: 'charity', label: 'Daily Sadaqah', icon: 'heart-outline' },
];

export default function WorshipTracker() {
    const [completed, setCompleted] = useState({});
    const [today, setToday] = useState(new Date().toDateString());

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const data = await getData(WORSHIP_TRACKER_KEY);
        if (data && data.date === today) {
            setCompleted(data.completed || {});
        } else {
            // New day, reset or keep minimal?
            // For now, reset.
            setCompleted({});
        }
    };

    const toggleTask = async (id) => {
        const newCompleted = { ...completed, [id]: !completed[id] };
        setCompleted(newCompleted);
        await storeData(WORSHIP_TRACKER_KEY, { date: today, completed: newCompleted });

        // Calculate and Save History
        const completedCount = Object.values(newCompleted).filter(Boolean).length;
        const percentage = completedCount / TASKS.length;

        const history = await getData(WORSHIP_HISTORY_KEY) || {};
        history[today] = percentage;
        await storeData(WORSHIP_HISTORY_KEY, history);
    };

    const progress = (Object.values(completed).filter(Boolean).length / TASKS.length) * 100;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Worship</Text>

            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% Completed</Text>

            <View style={styles.grid}>
                {TASKS.map((task) => (
                    <TouchableOpacity
                        key={task.id}
                        style={[
                            styles.taskCard,
                            completed[task.id] && styles.taskCardCompleted
                        ]}
                        onPress={() => toggleTask(task.id)}
                    >
                        <Ionicons
                            name={completed[task.id] ? 'checkmark-circle' : task.icon}
                            size={24}
                            color={completed[task.id] ? COLORS.white : COLORS.primary}
                        />
                        <Text style={[
                            styles.taskLabel,
                            completed[task.id] && styles.taskLabelCompleted
                        ]}>
                            {task.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        ...THEME_SHADOWS.small,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: COLORS.lightGray,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 5,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.accentGlow,
    },
    progressText: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 15,
        textAlign: 'right',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'space-between',
    },
    taskCard: {
        width: '48%',
        backgroundColor: COLORS.backgroundLight,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    taskCardCompleted: {
        backgroundColor: COLORS.primary,
    },
    taskLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    taskLabelCompleted: {
        color: COLORS.white,
    }
});
