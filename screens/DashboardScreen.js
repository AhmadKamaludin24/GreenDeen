import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Switch, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrayerCard from '../components/PrayerCard';
import WorshipTracker from '../components/WorshipTracker';
import RamadhanGoalGraph from '../components/RamadhanGoalGraph';
import { COLORS } from '../utils/theme'; // Fallback / Static colors
import { useTheme } from '../utils/ThemeContext'; // Dynamic theme
import { getData, storeData, LAST_READ_KEY } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

const LOCATION_CACHE_KEY = 'user_location_cache';

import ComingSoonModal from '../components/ComingSoonModal';

export default function DashboardScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState("");

    // Theme Hook
    const { isDark, toggleTheme, theme } = useTheme();

    const [lastRead, setLastRead] = useState(null);

    // Load Last Read when screen focuses
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadLastRead();
        });
        return unsubscribe;
    }, [navigation]);

    const loadLastRead = async () => {
        const data = await getData(LAST_READ_KEY);
        if (data) {
            setLastRead(data);
        }
    };

    useEffect(() => {
        loadLocation();
    }, []);

    const loadLocation = async () => {
        // 1. Try to load from cache first for instant UI
        const cachedLocation = await getData(LOCATION_CACHE_KEY);
        if (cachedLocation) {
            console.log("Using cached location");
            setLocation(cachedLocation);
        }

        // 2. Fetch fresh location in background
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // check if lastKnownPosition is faster
            let lastKnown = await Location.getLastKnownPositionAsync({});
            if (lastKnown && !cachedLocation) {
                setLocation(lastKnown);
            }

            // Get fresh
            let freshLocation = await Location.getCurrentPositionAsync({});
            setLocation(freshLocation);
            storeData(LOCATION_CACHE_KEY, freshLocation);
            console.log("Updated fresh location");

        } catch (error) {
            console.log("Error fetching location", error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleComingSoon = (feature) => {
        setComingSoonFeature(feature);
        setModalVisible(true);
    };

    // Construct dynamic styles or use inline logic
    const dynamicContainerStyle = {
        backgroundColor: theme.colors.background
    };
    const dynamicTextStyle = {
        color: theme.colors.text
    };

    // NativeWind allows usage of className

    // Quick time for header
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <View className="flex-1 bg-offWhite">
            <ComingSoonModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                featureName={comingSoonFeature}
            />

            {/* Header Section */}
            <View className="bg-headerBackground rounded-b-3xl pb-6 pt-12 px-6 shadow-lg">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        {/* <Text className="text-white text-sm opacity-80">Assalamualaikum</Text> */}
                        {/* <Text className="text-white text-xl font-bold">Akhi/Ukhti</Text> */}
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                </View>

                {/* Big Clock */}
                <View className="items-center mb-8">
                    <Text className="text-white text-6xl font-bold tracking-widest">{formattedTime}</Text>
                    {/* Hijri Date placeholder */}
                    <Text className="text-white opacity-70 text-sm mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>

                {/* Prayer Times Row (replacing PrayerCard for now with integrated logic or component) */}
                {/* We pass location to PrayerCard but maybe we should render it here for the specific UI */}
                <PrayerCard location={location} compact={true} />
            </View>

            <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
                {/* Features Grid */}
                <View className="flex-row flex-wrap justify-between">
                    <FeatureItem icon="book" label="Quran" onPress={() => navigation.navigate('Quran')} />
                    <FeatureItem icon="compass" label="Qibla" onPress={() => navigation.navigate('Qibla')} />
                    <FeatureItem icon="ellipse" label="Tasbih" onPress={() => navigation.navigate('Tasbih')} />
                    <FeatureItem icon="calendar" label="Hijri" onPress={() => navigation.navigate('Hijri')} />
                    <FeatureItem icon="heart" label="Dua" onPress={() => navigation.navigate('Dua')} />
                    <FeatureItem icon="book" label="Hadith" onPress={() => handleComingSoon("Hadith Collection")} />
                </View>

                {/* Last Read Card */}                <TouchableOpacity
                    className="bg-primary rounded-2xl p-4 mt-6 flex-row justify-between items-center shadow-md active:opacity-90"
                    onPress={() => {
                        if (lastRead) {
                            navigation.navigate('SurahDetail', { surahNumber: lastRead.surahNumber });
                        } else {
                            navigation.navigate('Quran');
                        }
                    }}
                >
                    <View>
                        <Text className="text-white text-sm mb-1">Last Read</Text>
                        <Text className="text-white text-2xl font-bold">{lastRead ? lastRead.surahName : 'Start Reading'}</Text>
                        <Text className="text-white text-sm opacity-80">{lastRead ? `Ayah no. ${lastRead.ayahNumber}` : 'Tap to open Quran'}</Text>
                        <View className="bg-white rounded-full px-4 py-1 mt-3 self-start">
                            <Text className="text-primary font-bold text-xs">Continue</Text>
                        </View>
                    </View>
                    {/* Placeholder for Quran Image */}
                    <Ionicons name="book-outline" size={60} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>

                <View className="mt-6 mb-10">
                    <RamadhanGoalGraph />
                    <Text className="text-lg font-bold text-text mb-4 mt-6">Prayer Tracker</Text>
                    <WorshipTracker />
                </View>
            </ScrollView>
        </View>
    );
}

const FeatureItem = ({ icon, label, onPress }) => (
    <TouchableOpacity onPress={onPress} className="w-[30%] items-center mb-6">
        <View className="w-14 h-14 bg-white rounded-2xl justify-center items-center shadow-sm mb-2">
            <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <Text className="text-textSecondary text-xs font-medium">{label}</Text>
    </TouchableOpacity>
);
