import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { COLORS } from '../utils/theme';

export default function AboutScreen({ navigation }) {
    const { isDark } = useTheme();

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

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
                    About App
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4">

                {/* App Logo & Version */}
                <View className="items-center mb-8">
                    <View className={`w-24 h-24 rounded-3xl items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                        <Ionicons name="moon" size={50} color={COLORS.primary} />
                    </View>
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        GreenDeen
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        Version 1.0.0
                    </Text>
                </View>

                {/* Description */}
                <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <Text className={`leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        GreenDeen is a modern Islamic companion app designed to help you stay connected with your faith through daily prayers, Quran reading, and spiritual tracking.
                    </Text>
                </View>

                {/* Developer Info */}
                <Text className={`text-sm font-bold uppercase mb-2 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Developer
                </Text>
                <TouchableOpacity onPress={() => openLink("https://github.com/AhmadKamaludin24")}>
                    <View className={`p-4 rounded-xl mb-6 flex-row items-center ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <Image
                            source={require('../assets/developer.png')}
                            className="w-12 h-12 rounded-full mr-4"
                            style={{ borderWidth: 1, borderColor: COLORS.primary }}
                        />
                        <View>
                            <Text className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Ahmad Kamaludin
                            </Text>
                            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Full Stack Developer
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Credits / Data Sources */}
                <Text className={`text-sm font-bold uppercase mb-2 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Credits & Data Sources
                </Text>
                <View className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <SettingsItem
                        icon="book-outline"
                        label="Quran Data"
                        subLabel="Open Source Quran Data (GitHub)"
                        isDark={isDark}
                    />
                    <SettingsItem
                        icon="time-outline"
                        label="Prayer Times"
                        subLabel="Adhan.js Library"
                        isDark={isDark}
                    />
                    <SettingsItem
                        icon="images-outline"
                        label="Icons"
                        subLabel="Ionicons by Expo"
                        isDark={isDark}
                    />
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}

const SettingsItem = ({ icon, label, subLabel, isDark }) => (
    <View className={`flex-row items-center p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <Ionicons name={icon} size={18} color={COLORS.primary} />
        </View>
        <View className="flex-1">
            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {label}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {subLabel}
            </Text>
        </View>
    </View>
);
