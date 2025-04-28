import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSupabase } from '@/hooks/useSupabase';
import { STRIPE_PRODUCTS } from '@/config/stripe';
import { useTheme } from '@/theme/ThemeContext';

interface SubscriptionPaywallProps {
  remainingRequests: number;
  onSubscribe: () => void;
}

export default function SubscriptionPaywall({ remainingRequests, onSubscribe }: SubscriptionPaywallProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.black + '80' }]}>
      <View style={[styles.content, { 
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
      }]}>
        <Text style={[styles.title, { 
          fontSize: theme.typography.h2.fontSize,
          fontFamily: theme.typography.h2.fontWeight,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing.sm,
        }]}>Limited Requests Remaining</Text>
        <Text style={[styles.description, {
          fontSize: theme.typography.body.fontSize,
          fontFamily: theme.typography.body.fontFamily,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xl,
          lineHeight: theme.typography.body.lineHeight,
        }]}>
          You have {remainingRequests} free car valuation{remainingRequests !== 1 ? 's' : ''} remaining.
          Subscribe to get unlimited valuations!
        </Text>
        
        <View style={[styles.features, {
          backgroundColor: theme.colors.gray[100],
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.xl,
        }]}>
          <Text style={[styles.featuresTitle, {
            fontSize: theme.typography.h3.fontSize,
            fontFamily: theme.typography.h3.fontWeight,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }]}>Subscription Benefits:</Text>
          <Text style={[styles.feature, {
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.gray[700],
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.body.lineHeight,
          }]}>• Unlimited car valuations</Text>
          <Text style={[styles.feature, {
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.gray[700],
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.body.lineHeight,
          }]}>• Detailed market analysis</Text>
          <Text style={[styles.feature, {
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.gray[700],
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.body.lineHeight,
          }]}>• Price history tracking</Text>
          <Text style={[styles.feature, {
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.body.fontFamily,
            color: theme.colors.gray[700],
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.body.lineHeight,
          }]}>• Export reports</Text>
        </View>

        <TouchableOpacity 
          style={[styles.subscribeButton, {
            backgroundColor: theme.colors.primary,
            paddingVertical: theme.spacing.lg,
            paddingHorizontal: theme.spacing.xl,
            borderRadius: theme.borderRadius.md,
          }]} 
          onPress={onSubscribe}
        >
          <Text style={[styles.subscribeButtonText, {
            color: theme.colors.white,
            fontSize: theme.typography.body.fontSize,
            fontFamily: theme.typography.h3.fontWeight,
          }]}>
            Subscribe - {STRIPE_PRODUCTS.UNLIMITED_SUBSCRIPTION.name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  features: {
  },
  featuresTitle: {
  },
  feature: {
  },
  subscribeButton: {
    alignItems: 'center',
  },
  subscribeButtonText: {
  },
});