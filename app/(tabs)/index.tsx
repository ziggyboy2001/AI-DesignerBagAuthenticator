import { View, StyleSheet, SafeAreaView, Text, Platform, TouchableOpacity } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Camera from '@/components/Camera';
import AuthenticationPanel from '@/components/AuthenticationPanel';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { StatusBar } from 'expo-status-bar';
import { authenticateBag, AuthenticationResult } from '@/services/authenticationService';
import { useSupabase } from '@/hooks/useSupabase';
import { STRIPE_PRODUCTS } from '../../src/config/stripe';
import { useTheme } from '@/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const FREE_REQUEST_LIMIT = 5;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const supabase = useSupabase();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const colorScheme = useColorScheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [remainingRequests, setRemainingRequests] = useState<number>(FREE_REQUEST_LIMIT);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
    loadRemainingRequests();
  }, []);

  const checkSubscriptionStatus = async () => {
    const { data: subscription } = await supabase
      .from('stripe_user_subscriptions')
      .select('subscription_status')
      .single();

    setIsSubscribed(subscription?.subscription_status === 'active');
  };

  const loadRemainingRequests = async () => {
    const { data: requests } = await supabase
      .from('user_requests')
      .select('count')
      .single();

    if (requests) {
      setRemainingRequests(Math.max(0, FREE_REQUEST_LIMIT - requests.count));
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: STRIPE_PRODUCTS.UNLIMITED_SUBSCRIPTION.priceId,
          success_url: window.location.origin,
          cancel_url: window.location.origin,
          mode: STRIPE_PRODUCTS.UNLIMITED_SUBSCRIPTION.mode,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handlePhotoTaken = useCallback(async (uri: string) => {
    setImageUri(uri);
    
    if (!isSubscribed && remainingRequests <= 0) {
      setShowPaywall(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Update request count if not subscribed
      if (!isSubscribed) {
        const { error } = await supabase
          .from('user_requests')
          .upsert({ count: FREE_REQUEST_LIMIT - remainingRequests + 1 }, { onConflict: 'user_id' });

        if (!error) {
          setRemainingRequests(prev => Math.max(0, prev - 1));
        }
      }
      
      // Authenticate the bag
      const result = await authenticateBag(uri);
      setAuthResult(result);
    } catch (error) {
      console.error('Error authenticating bag:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSubscribed, remainingRequests]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Camera onPhotoTaken={handlePhotoTaken} imageUri={imageUri} />
      
      <AuthenticationPanel 
        result={authResult}
        isLoading={isLoading}
        imageUri={imageUri}
      />

      {showPaywall && (
        <SubscriptionPaywall
          remainingRequests={remainingRequests}
          onSubscribe={handleSubscribe}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

