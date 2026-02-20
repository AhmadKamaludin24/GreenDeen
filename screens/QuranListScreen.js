import React, { useState } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/theme';
import SurahCard from '../components/SurahCard';
import surahList from '../data/quran/surahList.json';
import { Ionicons } from '@expo/vector-icons';

export default function QuranListScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(surahList);

    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const newData = surahList.filter(item => {
                const itemData = item.name_latin ? item.name_latin.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
        } else {
            setFilteredData(surahList);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-backgroundLight">
            <View className="p-5 bg-backgroundLight">
                <View className="flex-row items-center bg-white px-4 py-2.5 rounded-3xl border border-lightGray">
                    <Ionicons name="search" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search Surah..."
                        className="flex-1 text-base"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item }) => (
                    <SurahCard
                        surah={item}
                        onPress={() => navigation.navigate('SurahDetail', { surahNumber: item.number })}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}
