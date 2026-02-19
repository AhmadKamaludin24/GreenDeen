import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import * as Location from 'expo-location';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PrayerCard({ location }) {
    const [prayers, setPrayers] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (location) {
            calculatePrayers();
        }
    }, [location]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (prayers) {
                updateCountdown();
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [prayers]);

    const calculatePrayers = () => {
        const coordinates = new Coordinates(location.coords.latitude, location.coords.longitude);
        const params = CalculationMethod.MuslimWorldLeague();
        const date = new Date();
        const prayerTimes = new PrayerTimes(coordinates, date, params);

        setPrayers(prayerTimes);
        determineNextPrayer(prayerTimes);
    };

    const determineNextPrayer = (prayerTimes) => {
        const now = new Date();
        const time = prayerTimes.nextPrayer();
        if (time === 'none') {
            // All prayers passed, next is Fajr tomorrow
            setNextPrayer({ name: 'Fajr', time: prayerTimes.fajr }); // Simplified, should add day
        } else {
            // adhan returns 'fajr', 'dhuhr' etc.
            const nextTime = prayerTimes[time];
            setNextPrayer({ name: time.charAt(0).toUpperCase() + time.slice(1), time: nextTime });
        }
    };

    const updateCountdown = () => {
        if (!nextPrayer) return;
        const now = new Date();
        const diff = nextPrayer.time - now;

        if (diff < 0) {
            // Recalculate if time passed
            if (location) calculatePrayers();
            return;
        }

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const formatTime = (date) => {
        return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    };

    if (!prayers) return <Text className="text-white text-center opacity-70">Loading Prayers...</Text>;

    const prayerList = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    // Map prayer names to icons (simple logic)
    const getIcon = (name) => {
        switch (name) {
            case 'fajr': return 'partly-sunny';
            case 'dhuhr': return 'sunny';
            case 'asr': return 'partly-sunny';
            case 'maghrib': return 'cloudy-night';
            case 'isha': return 'moon';
            default: return 'time';
        }
    };

    return (
        <View className="flex-row justify-between w-full mt-4">
            {prayerList.map((p) => {
                const isNext = nextPrayer?.name.toLowerCase() === p;
                return (
                    <View key={p} className={`items-center ${isNext ? 'bg-white/20 rounded-xl p-2 -my-2' : ''}`}>
                        {/* Icon Container */}
                        <View className="mb-1">
                            {/* Use custom icons or Ionicons */}
                            <Ionicons
                                name={getIcon(p)}
                                size={20}
                                color={isNext ? COLORS.accentGlow : 'rgba(255,255,255,0.7)'}
                            />
                        </View>
                        <Text className={`text-xs font-bold mb-1 ${isNext ? 'text-white' : 'text-white opacity-90'}`}>
                            {formatTime(prayers[p])}
                        </Text>
                        <Text className={`text-[10px] uppercase tracking-wide ${isNext ? 'text-accentGlow font-bold' : 'text-white opacity-60'}`}>
                            {p}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

// Styles removed as we use Tailwind
const styles = StyleSheet.create({});
