import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthenticationResult } from '@/services/authenticationService';
import { formatCurrency } from '@/utils/formatters';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';

const { height } = Dimensions.get('window');

interface AuthenticationPanelProps {
  result: AuthenticationResult | null;
  isLoading: boolean;
  imageUri: string | null;
}

export default function AuthenticationPanel({
  result,
  isLoading,
  imageUri,
}: AuthenticationPanelProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (imageUri) {
      Animated.spring(translateY, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(300);
    }
  }, [imageUri, translateY]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ShieldCheck size={32} color={theme.colors.success} />;
    if (score >= 60) return <Shield size={32} color={theme.colors.warning} />;
    return <ShieldX size={32} color={theme.colors.error} />;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          transform: [{ translateY }],
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: theme.borderRadius.xl,
          borderTopRightRadius: theme.borderRadius.xl,
          ...theme.shadows.lg,
        },
      ]}
    >
      <View style={[styles.handle, { backgroundColor: theme.colors.gray[300] }]} />

      {!imageUri ? (
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderTitle, {
            fontFamily: theme.typography.h2.fontWeight,
            fontSize: theme.typography.h2.fontSize,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }]}>Designer Bag Authentication</Text>
          <Text style={[styles.placeholderText, {
            fontFamily: theme.typography.body.fontFamily,
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }]}>
            Take a photo of your designer bag to verify its authenticity
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {
            marginTop: theme.spacing.lg,
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.textSecondary,
          }]}>Analyzing your bag...</Text>
        </View>
      ) : result ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.scoreContainer, { marginBottom: theme.spacing.xl }]}>
            {getScoreIcon(result.authenticityScore)}
            <Text style={[styles.scoreText, { 
              color: getScoreColor(result.authenticityScore),
              fontFamily: theme.typography.h1.fontWeight,
              fontSize: theme.typography.h1.fontSize,
              marginTop: theme.spacing.xs,
            }]}>
              {result.authenticityScore}% Authentic
            </Text>
          </View>

          <View style={[styles.priceContainer, {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }]}>
            <Text style={[styles.priceLabel, {
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xs,
            }]}>Estimated Retail Price</Text>
            <Text style={[styles.priceValue, {
              fontFamily: theme.typography.h2.fontWeight,
              fontSize: theme.typography.h2.fontSize,
              color: theme.colors.primary,
            }]}>
              {formatCurrency(result.suggestedRetailPrice)}
            </Text>
          </View>

          <View style={styles.reasonsContainer}>
            <Text style={[styles.reasonsTitle, {
              fontFamily: theme.typography.h3.fontWeight,
              fontSize: theme.typography.h3.fontSize,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }]}>Authentication Details</Text>
            {result.reasons.map((reason, index) => (
              <View key={index} style={[styles.reasonItem, {
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.sm,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.xs,
              }]}>
                <Text style={[styles.reasonText, {
                  fontFamily: theme.typography.body.fontFamily,
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.textSecondary,
                  lineHeight: theme.typography.body.lineHeight,
                }]}>{reason}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: theme.spacing.lg }} />
        </ScrollView>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderTitle: {
  },
  placeholderText: {
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
  },
  scrollView: {
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
  },
  priceContainer: {
  },
  priceLabel: {
  },
  priceValue: {
  },
  reasonsContainer: {
    backgroundColor: 'transparent',
  },
  reasonsTitle: {
  },
  reasonItem: {
  },
  reasonText: {
  },
});