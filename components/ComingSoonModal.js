import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../utils/ThemeContext';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function ComingSoonModal({ visible, onClose, featureName = "This Feature" }) {
    const { isDark, theme } = useTheme();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {/* Backdrop with Blur or dimming */}
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={[styles.backdropLayer, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} />
                </TouchableOpacity>

                {/* Modal Content */}
                <View style={[
                    styles.modalView,
                    {
                        backgroundColor: theme.colors.cardBg,
                        shadowColor: theme.colors.shadow,
                    }
                ]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
                        <Ionicons name="rocket" size={40} color={COLORS.primary} />
                    </View>

                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Coming Soon!</Text>

                    <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
                        We are working hard to bring you <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{featureName}</Text>.
                        {"\n"}Stay tuned for updates!
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: COLORS.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Got it</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdropLayer: {
        flex: 1,
    },
    modalView: {
        width: width * 0.85,
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
    },
    button: {
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 40,
        elevation: 2,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    }
});
