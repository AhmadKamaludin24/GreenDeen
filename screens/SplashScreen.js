import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen({ onFinish }) {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRandomVerse();
    }, []);

    const loadRandomVerse = async () => {
        try {
            const availableSurahs = [1, 2, 36, 67, 112, 113, 114, 18, 55, 93, 94];
            const index = Math.floor(Math.random() * availableSurahs.length);
            const selectedNum = availableSurahs[index];

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
            colors={['#0F172A', '#0F172A']}
            className="flex-1"
        >
            <View className="flex-1 justify-between items-center p-10 pt-20 pb-24 gap-5">
                <View className="items-center">
                    <Ionicons name="moon" size={80} color={COLORS.accentGlow} />
                    <Text className="text-3xl font-bold text-white mt-2.5">Green Deen</Text>
                    <Text className="text-base text-slate-400 opacity-90">Your Digital Ramadhan Companion</Text>
                </View>

                <View className="bg-white/10 rounded-3xl p-5 w-full items-center justify-center min-h-[200px] shadow-sm border border-white/5">
                    {loading ? (
                        <ActivityIndicator color={COLORS.primary} />
                    ) : (
                        <>
                            <Text className="text-2xl font-bold text-white text-center mb-2.5">{quote.arabic}</Text>
                            <Text className="text-sm text-slate-300 italic text-center mb-2.5">"{quote.translation}"</Text>
                            <Text className="text-xs text-accentGlow font-bold">{quote.surahName} • Ayah {quote.ayahNum}</Text>
                        </>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-accentGlow py-4 px-8 rounded-full flex-row items-center gap-2.5 shadow-sm z-10"
                    onPress={() => {
                        console.log('Start Journey pressed');
                        onFinish();
                    }}
                >
                    <Text className="text-white text-base font-bold">Start Journey</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-xs text-slate-500">Developed by Ahmad Kamaludin</Text>
                    <Text className="text-xs text-slate-600">Version 1.0.0</Text>
                </View>
            </View>
        </LinearGradient>
    );
}
