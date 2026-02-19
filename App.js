import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from './utils/theme';
import { ThemeProvider } from './utils/ThemeContext';

import SplashScreen from './screens/SplashScreen';
import DashboardScreen from './screens/DashboardScreen';
import QuranListScreen from './screens/QuranListScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import TasbihScreen from './screens/TasbihScreen';
import QiblaScreen from './screens/QiblaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quran') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Tasbih') {
            iconName = focused ? 'ellipse' : 'ellipse-outline';
          } else if (route.name === 'Qibla') {
            iconName = focused ? 'compass' : 'compass-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: 10,
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Quran" component={QuranListScreen} />
      <Tab.Screen name="Tasbih" component={TasbihScreen} />
      <Tab.Screen name="Qibla" component={QiblaScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    // Load fonts here if needed
  });

  const [isLoading, setIsLoading] = useState(true);

  /* 
  useEffect(() => {
    // Simulate splash delay or data loading
    // setTimeout(() => setIsLoading(false), 2000);
  }, []);
  */

  if (!fontsLoaded && !isLoading) {
    return null;
  }

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
