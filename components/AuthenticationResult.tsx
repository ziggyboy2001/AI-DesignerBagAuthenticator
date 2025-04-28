import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';

interface AuthenticationResultProps {
  result: {
    authenticityScore: number;
    reasons: string[];
    suggestedRetailPrice: number;
  };
}

export default function AuthenticationResult({ result }: AuthenticationResultProps) {
  const { theme } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={[styles.container, {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.gray[100],
      borderRadius: theme.borderRadius.lg,
    }]}>
      <View style={[styles.scoreContainer, { marginBottom: theme.spacing.lg }]}>
        <Text style={[styles.scoreLabel, {
          fontSize: theme.typography.h3.fontSize,
          fontFamily: theme.typography.h3.fontWeight,
          marginBottom: theme.spacing.sm,
          color: theme.colors.textPrimary,
        }]}>Authenticity Score</Text>
        <View style={[styles.scoreCircle, { 
          borderColor: getScoreColor(result.authenticityScore),
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 4,
        }]}>
          <Text style={[styles.score, { 
            color: getScoreColor(result.authenticityScore),
            fontSize: theme.typography.h2.fontSize,
            fontFamily: theme.typography.h2.fontWeight,
          }]}>
            {result.authenticityScore}%
          </Text>
        </View>
      </View>

      <View style={[styles.reasonsContainer, { marginBottom: theme.spacing.lg }]}>
        <Text style={[styles.reasonsTitle, {
          fontSize: theme.typography.h3.fontSize,
          fontFamily: theme.typography.h3.fontWeight,
          marginBottom: theme.spacing.sm,
          color: theme.colors.textPrimary,
        }]}>Analysis Details</Text>
        {result.reasons.map((reason, index) => (
          <View key={index} style={[styles.reasonItem, { marginBottom: theme.spacing.xs }]}>
            <MaterialIcons 
              name="check-circle" 
              size={20} 
              color={getScoreColor(result.authenticityScore)} 
            />
            <Text style={[styles.reasonText, {
              marginLeft: theme.spacing.xs,
              fontSize: theme.typography.body.fontSize,
              fontFamily: theme.typography.body.fontFamily,
              color: theme.colors.gray[700],
              flex: 1,
            }]}>{reason}</Text>
          </View>
        ))}
      </View>

      {result.suggestedRetailPrice > 0 && (
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, {
            fontSize: theme.typography.h3.fontSize,
            fontFamily: theme.typography.h3.fontWeight,
            marginBottom: theme.spacing.sm,
            color: theme.colors.textPrimary,
          }]}>Suggested Retail Price</Text>
          <Text style={[styles.price, {
            fontSize: theme.typography.h2.fontSize,
            fontFamily: theme.typography.h2.fontWeight,
            color: theme.colors.primary,
          }]}>
            ${result.suggestedRetailPrice.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
  },
  scoreCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
  },
  reasonsContainer: {
  },
  reasonsTitle: {
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonText: {
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceLabel: {
  },
  price: {
  },
}); 