import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { DUAS } from '../data/duas';
import { COLORS } from '../utils/theme';

export default function DuaScreen({ navigation }) {
    const { theme, isDark } = useTheme();
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleShare = async (dua) => {
        try {
            await Share.share({
                message: `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}\n\nReference: ${dua.reference}\n\nShared from GreenDeen app`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => toggleExpand(item.id)}
                className={`mb-4 rounded-xl p-4 shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}
            >
                <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center flex-1 pr-2">
                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
                            <Ionicons name="heart" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {item.title}
                            </Text>
                            <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {item.category}
                            </Text>
                        </View>
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={isDark ? COLORS.gray : COLORS.gray}
                    />
                </View>

                {isExpanded && (
                    <View className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <Text className={`text-right text-2xl font-serif mb-3 leading-10 ${isDark ? 'text-emerald-100' : 'text-emerald-900'}`}>
                            {item.arabic}
                        </Text>

                        <Text className={`text-sm italic mb-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {item.transliteration}
                        </Text>

                        <Text className={`text-base mb-4 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {item.translation}
                        </Text>

                        <View className="flex-row justify-between items-center mt-2">
                            <Text className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Ref: {item.reference}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleShare(item)}
                                className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"
                            >
                                <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
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
                    Daily Duas
                </Text>
            </View>

            {/* List */}
            <FlatList
                data={DUAS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
