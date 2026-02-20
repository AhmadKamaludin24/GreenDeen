import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { COLORS } from '../utils/theme';

export default function SettingsScreen({ navigation }) {
    const { isDark } = useTheme();

    const handleReportBug = async () => {
        const email = 'ahmadkamaludin2428@gmail.com';
        const subject = 'Bug Report: GreenDeen App';
        const body = 'Please describe the bug you encountered here...';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Email App not found", "Could not open email client.");
            }
        } catch (error) {
            console.error("An error occurred", error);
            Alert.alert("Error", "Could not open Email.");
        }
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
                    Settings
                </Text>
            </View>

            <ScrollView className="flex-1 px-4">
                <Text className={`text-sm font-bold uppercase mb-2 mt-4 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Support
                </Text>

                <View className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <TouchableOpacity
                        onPress={handleReportBug}
                        className={`flex-row items-center p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                    >
                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <Ionicons name="bug-outline" size={18} color={COLORS.primary} />
                        </View>
                        <Text className={`flex-1 text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Report a Bug
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? COLORS.gray : COLORS.gray} />
                    </TouchableOpacity>

                    {/* Placeholder for other settings */}
                    <TouchableOpacity
                        className="flex-row items-center p-4"
                        onPress={() => navigation.navigate('About')}
                    >
                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
                        </View>
                        <Text className={`flex-1 text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            About App
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? COLORS.gray : COLORS.gray} />
                    </TouchableOpacity>
                </View>

                <View className="items-center mt-10">
                    <Text className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        GreenDeen v1.0.0
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
