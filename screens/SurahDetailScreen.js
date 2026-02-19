import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';
import VerseCard from '../components/VerseCard';
import { Ionicons } from '@expo/vector-icons';
import quranData from '../data/quran/index'; // The generated index
import { storeData, getData, BOOKMARKS_KEY, LAST_READ_KEY } from '../utils/storage';

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
            // Using the map we generated
            const rawData = quranData[surahNumber.toString()];
            if (rawData) {
                // The JSON structure is nested: { "1": { ... } }
                const surahContent = rawData[surahNumber.toString()];
                setSurah(surahContent);

                // Save as Last Read
                storeData(LAST_READ_KEY, {
                    surahNumber,
                    surahName: surahContent.name_latin,
                    ayahNumber: 1, // Default to 1 for now, or track scroll later
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
        // Implement booking logic
        alert(`Bookmarked Ayah ${ayahNumber}`);
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
    }

    if (!surah) {
        return <View style={styles.center}><Text>Error loading Surah</Text></View>;
    }

    // Transform data for FlatList
    // Structure: { text: { "1": "..." }, translations: { id: { text: { "1": "..." } } } }
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={COLORS.primary}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle}>{surah.name_latin}</Text>
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
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                style={styles.list}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    listContent: {
        padding: 20,
        flexGrow: 1,
    },
    list: {
        flex: 1,
    }
});
