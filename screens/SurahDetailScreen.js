import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';
import VerseCard from '../components/VerseCard';
import { Ionicons } from '@expo/vector-icons';
import quranData from '../data/quran/index'; // The generated index
import { storeData, LAST_READ_KEY } from '../utils/storage';
import { StatusBar } from 'expo-status-bar';

export default function SurahDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { surahNumber } = route.params;
    const [surah, setSurah] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSurah();
    }, [surahNumber]);

    const loadSurah = async () => {
        try {
            const rawData = quranData[surahNumber.toString()];
            if (rawData) {
                const surahContent = rawData[surahNumber.toString()];
                setSurah(surahContent);

                storeData(LAST_READ_KEY, {
                    surahNumber,
                    surahName: surahContent.name_latin,
                    ayahNumber: 1,
                    timestamp: new Date().toISOString()
                });
            } else {
                console.error("Surah not found");
            }
        } catch (e) {
            console.error("Error loading surah", e);
        } finally {
            setLoading(false);
        }
    };

    const handleBookmark = async (ayahNumber) => {
        alert(`Bookmarked Ayah ${ayahNumber}`);
    };

    if (loading) {
        return <View className="flex-1 justify-center items-center"><ActivityIndicator color={COLORS.primary} /></View>;
    }

    if (!surah) {
        return <View className="flex-1 justify-center items-center"><Text>Error loading Surah</Text></View>;
    }

    const verses = [];
    const totalAyahs = surah.number_of_ayah;
    const arabicText = surah.text;
    const translationText = surah.translations.id.text;

    for (let i = 1; i <= totalAyahs; i++) {
        verses.push({
            number: i,
            text: arabicText[i.toString()],
            translation: translationText[i.toString()]
        });
    }

    return (
        <View className="flex-1 bg-backgroundLight" style={{ paddingTop: insets.top }}>

            <View className="flex-row justify-between items-center p-5 bg-white border-b border-lightGray">
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={COLORS.primary}
                    onPress={() => navigation.goBack()}
                />
                <Text className="text-lg font-bold text-primary">{surah.name_latin}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={verses}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item }) => (
                    <VerseCard
                        item={item}
                        onBookmark={() => handleBookmark(item.number)}
                    />
                )}
                contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20, flexGrow: 1 }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
}
