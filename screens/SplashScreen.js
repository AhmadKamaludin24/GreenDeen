import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure expo-linear-gradient is installed
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import surahList from '../data/quran/surahList.json';
import * as Animatable from 'react-native-animatable'; // Useful for animations, need to install or use Animated

// We need to dynamic require the surah file. 
// React Native's packager needs static paths usually.
// A workaround for "Randomly load surah number" with `require` is tricky in RN without pre-importing everything.
// However, we can use a dynamic import workaround or just import a subset. 
// Given the constraint "Offline JSON per Surah", and standard RN limitations:
// We might need to use `readAsStringAsync` from `expo-file-system` if the assets are bundled, 
// OR just `require` a map of all json files if possible (heavy), 
// OR simpler: since we have files in specific path, we can try dynamic requires if metro allows it (often warns).
// SAFEST APPROACH: Use `expo-asset` and `expo-file-system` to read from bundled assets, OR 
// since we are in dev/expo go, we can try `require` with a template string if we know the IDs.
// BUT Metro bundle requires static analysis.
// Let's create a utility `utils/quranLoader.js` that maps IDs to requires.

import { Ionicons } from '@expo/vector-icons';

// Simple direct require for now, or fetch if placed in assets.
// Since they are in `data/`, they are part of the bundle.
// Best approach for 114 files:
// Create an index file that exports them, or lazy load.
// For Splash, we only need ONE.
// We will try lazy requiring.

export default function SplashScreen({ onFinish }) {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRandomVerse();
    }, []);

    const loadRandomVerse = async () => {
        try {
            // Pick a random surah (1-114)
            // For safety in demo, let's pick from a smaller known range or just try random
            const randomSurahNum = Math.floor(Math.random() * 114) + 1;

            // Dynamic require might fail in strict mode, but let's try.
            // If this fails, we need a map. 
            // A map of 114 requires is not that bad.
            // Let's assume we use a map if this fails, but for now let's try to just load '1' (Fatihah) or similar 
            // for the first MVP step to be safe, then improve.
            // Actually, we can just use `require('../data/quran/surah/' + randomSurahNum + '.json')` 
            // but Metro DOES NOT support dynamic variables in require usually.

            // So, for this step, I will implement a loader that pre-requires a few popular ones, 
            // or I will generate an index file.
            // Let's generate an index file for safer importing? 
            // Or just hardcode a few "popular" surahs for splash.
            // Let's go with hardcoded map for now for a few surahs to ensure stability.

            const availableSurahs = [1, 2, 36, 67, 112, 113, 114, 18, 55, 93, 94];
            const index = Math.floor(Math.random() * availableSurahs.length);
            const selectedNum = availableSurahs[index];

            // We need a way to get the file content.
            // In a real app we'd likely move these to `assets` and use `FileSystem`.
            // For now, let's just switch-case strictly.
            let surahData;
            switch (selectedNum) {
                case 1: surahData = require('../data/quran/surah/1.json'); break;
                case 2: surahData = require('../data/quran/surah/2.json'); break;
                case 36: surahData = require('../data/quran/surah/36.json'); break;
                case 67: surahData = require('../data/quran/surah/67.json'); break;
                case 112: surahData = require('../data/quran/surah/112.json'); break;
                case 113: surahData = require('../data/quran/surah/113.json'); break;
                case 114: surahData = require('../data/quran/surah/114.json'); break;
                case 18: surahData = require('../data/quran/surah/18.json'); break;
                case 55: surahData = require('../data/quran/surah/55.json'); break;
                case 93: surahData = require('../data/quran/surah/93.json'); break;
                case 94: surahData = require('../data/quran/surah/94.json'); break;
                default: surahData = require('../data/quran/surah/1.json');
            }

            const surahContent = surahData[selectedNum.toString()];
            const totalAyahs = surahContent.number_of_ayah;
            const randomAyahKey = Math.floor(Math.random() * totalAyahs) + 1;

            const arabicText = surahContent.text[randomAyahKey.toString()];
            const translationText = surahContent.translations.id.text[randomAyahKey.toString()];

            setQuote({
                surahName: surahContent.name_latin,
                ayahNum: randomAyahKey,
                arabic: arabicText,
                translation: translationText
            });
            setLoading(false);

        } catch (e) {
            console.error("Error loading quote", e);
            // Fallback
            setQuote({
                surahName: "Al-Fatihah",
                ayahNum: 1,
                arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                translation: "Dengan nama Allah Yang Maha Pengasih dari Maha Penyayang."
            });
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#0F172A', '#0F172A']} // Hardcoded to prevent import race condition/crash
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Ionicons name="moon" size={80} color={COLORS.accentGlow} />
                    <Text style={styles.title}>Green Deen</Text>
                    <Text style={styles.subtitle}>Your Digital Ramadhan Companion</Text>

                </View>

                <View style={styles.quoteCard}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <>
                            <Text style={styles.quoteArabic}>{quote.arabic}</Text>
                            <Text style={styles.quoteTranslation}>"{quote.translation}"</Text>
                            <Text style={styles.quoteSource}>{quote.surahName} • Ayah {quote.ayahNum}</Text>
                        </>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        console.log('Start Journey pressed');
                        onFinish();
                    }}
                >
                    <Text style={styles.buttonText}>Start Journey</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.subtitle2}>Developed by Ahmad Kamaludin</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 40,
        paddingTop: 80,
        paddingBottom: 90,
        gap: 20
    },
    footer: {
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        opacity: 0.8,
    },
    subtitle2: {
        fontSize: 12,
        color: COLORS.textLight,
        opacity: 0.8,
    },
    version: {
        fontSize: 12,
        color: COLORS.textLight,
        opacity: 0.8,
    },
    quoteCard: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        ...THEME_SHADOWS.medium,
        minHeight: 200,
        justifyContent: 'center',
    },
    quoteArabic: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.darkGradientEnd,
        textAlign: 'center',
        marginBottom: 10,
    },
    quoteTranslation: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    quoteSource: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: COLORS.accentGlow,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        ...THEME_SHADOWS.small,
        zIndex: 10,
        cursor: 'pointer', // For web
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
