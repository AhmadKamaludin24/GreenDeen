import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { COLORS, THEME_SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QiblaScreen() {
    const [subscription, setSubscription] = useState(null);
    const [magnetometer, setMagnetometer] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    const KAABA_COORDS = { latitude: 21.422487, longitude: 39.826206 };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const _subscribe = async () => {
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            calculateQibla(location.coords.latitude, location.coords.longitude);

            // 2. Subscribe to Magnetometer
            Magnetometer.setUpdateInterval(100);
            setSubscription(
                Magnetometer.addListener(data => {
                    setMagnetometer(_angle(data));
                })
            );
        } catch (error) {
            console.error("Qibla Error:", error);
            setErrorMsg('Could not fetch location or sensors.');
        } finally {
            setLoading(false);
        }
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const _angle = (magnetometer) => {
        let angle = 0;
        if (magnetometer) {
            let { x, y } = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }
        return Math.round(angle);
    };

    const calculateQibla = (lat, lon) => {
        const PI = Math.PI;
        const latk = KAABA_COORDS.latitude * PI / 180.0;
        const longk = KAABA_COORDS.longitude * PI / 180.0;
        const phi = lat * PI / 180.0;
        const lambda = lon * PI / 180.0;
        const q = Math.atan2(Math.sin(longk - lambda), Math.cos(phi) * Math.tan(latk) - Math.sin(phi) * Math.cos(longk - lambda));
        const qibla = q * 180.0 / PI;
        setQiblaDirection(qibla);
    };

    // Compass rotation:
    // Magnetometer gives angle from North (0-360) where 0 is North.
    // We want the compass to point North, so we rotate it by -magnetometer.
    // We want the Qibla arrow to point to Qibla relative to North.
    // So the arrow rotation should be: (Qibla Angle - Magnetometer Angle)

    // Actually, simpler:
    // Rotate the whole dial so North points to Real North (-magnetometer)
    // Then place the Qibla marker at `qiblaDirection` degrees on the dial.

    // Compass Image rotation: -magnetometer
    // Qibla Pointer rotation: qiblaDirection (if it's a separate layer on top of the generic dial? No)

    // Standard visualization:
    // A Compass rose that rotates to match North.
    // An arrow that points to Qibla relative to the Compass rose.
    // Arrow relative to screen top = qiblaDirection - magnetometer.

    const compassRotation = 360 - magnetometer; // Rotate image to match North
    const arrowRotation = qiblaDirection; // relative to the compass image which is now "True North" aligned? 

    // Wait.
    // If phone points North (mag=0), Image is 0. Qibla (say 90 East) should point Right.
    // If phone points East (mag=90), Image is -90 (North is to the Left). Qibla (90) should be at Top.
    // qiblaDirection - magnetometer = 90 - 90 = 0. Yes.

    const visualDirection = qiblaDirection - magnetometer;

    if (loading) {
        return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Qibla Compass</Text>

            <View style={styles.center}>
                <Text style={styles.helpText}>Sorry, This feature is cunreently on Developing Proggress</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: "170px"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 20,
    },
    error: {
        color: 'red',
        marginTop: 20,
    },
    compassContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionText: {
        fontSize: 18,
        color: COLORS.text,
        marginBottom: 10,
    },
    qiblaText: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 40,
    },
    compassCircle: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        borderWidth: 5,
        borderColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        ...THEME_SHADOWS.medium,
    },
    compassCard: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    northMarker: {
        position: 'absolute',
        top: 10,
    },
    qiblaMarkerContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start', // Top
        alignItems: 'center',
        // We handle rotation in style
    },
    instructions: {
        padding: 20,
        marginBottom: 20,
    },
    helpText: {
        textAlign: 'center',
        color: COLORS.gray,
    },
});
