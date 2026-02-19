import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VerseCard({ item, onBookmark }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.numberBadge}>
                    <Text style={styles.number}>{item.number}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onBookmark}>
                        <Ionicons name="bookmark-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.arabic}>{item.text}</Text>
            <Text style={styles.translation}>{item.translation}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
        ...THEME_SHADOWS.small,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center',
    },
    numberBadge: {
        backgroundColor: COLORS.backgroundLight,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    arabic: {
        fontSize: 24,
        color: COLORS.text,
        textAlign: 'right',
        lineHeight: 40,
        marginBottom: 15,
        fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif', // Better Arabic support
    },
    translation: {
        fontSize: 14,
        color: COLORS.gray,
        lineHeight: 22,
    }
});
