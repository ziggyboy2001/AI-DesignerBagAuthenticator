import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ImageUpload from '@/components/ImageUpload';
import { authenticateBag } from '@/services/authenticationService';
import AuthenticationResult from '../components/AuthenticationResult';
import { useTheme } from '@/theme/ThemeContext';

export default function AuthenticateScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { theme } = useTheme();

  const handleImageSelected = async (imageUri: string) => {
    try {
      setIsLoading(true);
      const authenticationResult = await authenticateBag(imageUri);
      setResult(authenticationResult);
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.content, { padding: theme.spacing.lg }]}>
        <ImageUpload onImageSelected={handleImageSelected} />
        
        {isLoading ? (
          <View style={[styles.loadingContainer, { padding: theme.spacing.lg }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : result ? (
          <AuthenticationResult result={result} />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 