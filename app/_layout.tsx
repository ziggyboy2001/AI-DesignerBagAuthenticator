import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { ReduxProvider } from '@/components/ReduxProvider';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const isFrameworkReady = useFrameworkReady();

  useEffect(() => {
    if (fontsLoaded && isFrameworkReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isFrameworkReady]);

  if (!fontsLoaded || !isFrameworkReady) {
    return null;
  }

  return (
    <ReduxProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </ReduxProvider>
  );
}