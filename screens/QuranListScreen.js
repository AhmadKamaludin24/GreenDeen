import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.gray} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search Surah..."
                        style={styles.input}
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
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.backgroundLight,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
        borderColor: COLORS.lightGray,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});
