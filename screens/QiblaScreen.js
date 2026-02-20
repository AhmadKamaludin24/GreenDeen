import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { COLORS } from '../utils/theme';

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

    if (loading) {
        return <View className="flex-1 justify-center items-center"><ActivityIndicator color={COLORS.primary} /></View>;
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-backgroundLight">
            <Text className="text-2xl font-bold text-primary mt-5">Qibla Compass</Text>

            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 text-center max-w-[200px]">Sorry, This feature is currently on Developing Progress</Text>
            </View>
        </SafeAreaView>
    );
}
