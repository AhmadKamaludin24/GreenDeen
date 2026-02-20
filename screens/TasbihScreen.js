import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
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
            Vibration.vibrate(500);
            newCount = 1;
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
        setCount(0);
        setRound(0);
        saveCount(0, 0, newLimit);
    };

    return (
        <SafeAreaView className="flex-1 bg-backgroundLight items-center">
            <View className="w-full flex-row justify-between items-center p-5">
                <Text className="text-2xl font-bold text-primary">Digital Tasbih</Text>
                <TouchableOpacity onPress={toggleLimit} className="px-4 py-2 bg-white rounded-3xl border border-primary">
                    <Text className="text-primary font-semibold">Target: {limit}</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-center items-center">
                <View className="items-center mb-12">
                    <Text className="text-[80px] font-bold text-primary">{count}</Text>
                    <Text className="text-base text-gray mt-2.5">Round: {round}</Text>
                </View>

                <TouchableOpacity
                    className="w-[250px] h-[250px] rounded-full bg-primary justify-center items-center shadow-md border-[5px] border-white"
                    onPress={handleCount}
                    activeOpacity={0.7}
                >
                    <View className="w-[220px] h-[220px] rounded-full bg-primary border-2 border-white/20" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="mb-12 flex-row items-center gap-2 p-2.5" onPress={reset}>
                <Ionicons name="refresh" size={24} color={COLORS.gray} />
                <Text className="text-gray text-base">Reset</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
