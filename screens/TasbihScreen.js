import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { storeData, getData, TASBIH_count_KEY } from '../utils/storage';

export default function TasbihScreen() {
    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(33);
    const [round, setRound] = useState(0);

    useEffect(() => {
        loadCount();
    }, []);

    const loadCount = async () => {
        const data = await getData(TASBIH_count_KEY);
        if (data) {
            setCount(data.count || 0);
            setRound(data.round || 0);
            setLimit(data.limit || 33);
        }
    };

    const saveCount = async (newCount, newRound, newLimit) => {
        await storeData(TASBIH_count_KEY, { count: newCount, round: newRound, limit: newLimit });
    };

    const handleCount = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let newCount = count + 1;
        let newRound = round;

        if (newCount > limit) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Vibration.vibrate(500); // Longer vibration for completion
            newCount = 1; // Loop back to 1 or 0? Usually 1 if we just finished 33
            newRound += 1;
        }

        setCount(newCount);
        setRound(newRound);
        saveCount(newCount, newRound, limit);
    };

    const reset = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCount(0);
        setRound(0);
        saveCount(0, 0, limit);
    };

    const toggleLimit = () => {
        const newLimit = limit === 33 ? 99 : 33;
        setLimit(newLimit);
        // Reset or convert? Reset is cleaner to avoid confusion
        setCount(0);
        setRound(0);
        saveCount(0, 0, newLimit);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Digital Tasbih</Text>
                <TouchableOpacity onPress={toggleLimit} style={styles.limitButton}>
                    <Text style={styles.limitText}>Target: {limit}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>{count}</Text>
                    <Text style={styles.roundText}>Round: {round}</Text>
                </View>

                <TouchableOpacity
                    style={styles.beadButton}
                    onPress={handleCount}
                    activeOpacity={0.7}
                >
                    <View style={styles.beadInner} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={reset}>
                <Ionicons name="refresh" size={24} color={COLORS.gray} />
                <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    limitButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    limitText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    counterText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    roundText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 10,
    },
    beadButton: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME_SHADOWS.medium,
        borderWidth: 5,
        borderColor: COLORS.white,
    },
    beadInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: COLORS.primary, // Or slightly simpler gradient
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    resetButton: {
        marginBottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
    },
    resetText: {
        color: COLORS.gray,
        fontSize: 16,
    }
});
