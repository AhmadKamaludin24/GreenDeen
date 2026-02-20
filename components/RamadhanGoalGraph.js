import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getData, WORSHIP_HISTORY_KEY } from '../utils/storage';
import { COLORS } from '../utils/theme';

export default function RamadhanGoalGraph() {
    const [history, setHistory] = useState({});

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const data = await getData(WORSHIP_HISTORY_KEY);
        if (data) {
            setHistory(data);
        }
    };

    // 1. Tentukan tanggal hari pertama Ramadhan (Tahun, Bulan, Tanggal)
    // Ingat: Di JavaScript, indeks bulan dimulai dari 0. Jadi Februari = 1.
    const START_DATE = new Date(2026, 1, 19);
    const TOTAL_DAYS = 30; // Asumsi Ramadhan 30 hari

    // 2. Buat array yang isinya 30 hari pas, dihitung maju dari START_DATE
    const days = [];
    for (let i = 0; i < TOTAL_DAYS; i++) {
        const d = new Date(START_DATE);
        d.setDate(START_DATE.getDate() + i);
        days.push(d.toDateString());
    }

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm mt-4">
            <Text className="text-primary font-bold text-xl mb-3">Ramadhan Goals</Text>
            <View className="flex-row flex-wrap gap-1">
                {days.map((dateStr, index) => {
                    const percentage = history[dateStr] || 0;

                    // Cek apakah kotak ini adalah hari ini
                    const isToday = dateStr === new Date().toDateString();

                    // Cek apakah tanggal kotak ini ada di masa depan (belum dilewati)
                    const isFuture = new Date(dateStr) > new Date();

                    // Logika Opacity:
                    // - Jika masa depan: sangat transparan (0.05) atau warna abu-abu
                    // - Jika hari ini/masa lalu tapi kosong: 0.1
                    // - Jika ada isinya: sesuaikan dengan persentase
                    let opacity = Math.max(0.1, percentage);
                    if (isFuture) opacity = 0.05;

                    return (
                        <View
                            key={index}
                            className={`w-4 h-4 rounded-sm ${isToday ? 'border-2 border-[#1E293B]' : ''}`}
                            style={{
                                backgroundColor: isFuture ? '#E2E8F0' : COLORS.primary, // Abu-abu kalau belum waktunya
                                opacity: percentage > 0 ? opacity : (isFuture ? 1 : 0.1)
                            }}
                        />
                    );
                })}
            </View>
            <View className="flex-row justify-end items-center mt-2">
                <Text className="text-[10px] text-textSecondary mr-1">Less</Text>
                <View className="w-2 h-2 bg-primary opacity-10 rounded-sm mr-1" />
                <View className="w-2 h-2 bg-primary opacity-50 rounded-sm mr-1" />
                <View className="w-2 h-2 bg-primary rounded-sm mr-1" />
                <Text className="text-[10px] text-textSecondary">More</Text>
            </View>
        </View>
    );
}