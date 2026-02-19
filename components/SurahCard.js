import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SurahCard({ surah, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.numberContainer}>
                <View style={styles.diamond} />
                <Text style={styles.number}>{surah.number}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.nameLatin}>{surah.name_latin}</Text>
                <Text style={styles.details}>{surah.number_of_ayah} Ayahs</Text>
            </View>

            <Text style={styles.nameArabic}>{surah.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        ...THEME_SHADOWS.small,
    },
    numberContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    diamond: {
        position: 'absolute',
        width: 30,
        height: 30,
        backgroundColor: COLORS.backgroundLight,
        transform: [{ rotate: '45deg' }],
        borderRadius: 5,
    },
    number: {
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 14,
    },
    infoContainer: {
        flex: 1,
    },
    nameLatin: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    details: {
        fontSize: 12,
        color: COLORS.gray,
    },
    nameArabic: {
        fontSize: 20,
        color: COLORS.primary,
        fontWeight: 'bold',
    }
});
