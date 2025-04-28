import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Easing, Platform, UIManager, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { addSearch, clearSearches } from '@/store/pastSearchesSlice';
import { SearchResult } from '@/store/pastSearchesSlice';
import { useTheme } from '@/theme/ThemeContext';
import { createClient } from '@supabase/supabase-js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PastSearchesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const searches = useAppSelector((state) => state.pastSearches.searches);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentHeights, setContentHeights] = useState<{ [id: string]: number }>({});
  const animatedControllers = useRef<{ [id: string]: Animated.Value }>({}).current;

  useEffect(() => {
    // Fetch from Supabase on mount
    const fetchPastSearches = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('past_searches').select('*').order('timestamp', { ascending: false });
      console.log('Supabase fetch:', { data, error });
      dispatch(clearSearches());
      if (!error && data) {
        data.forEach((item: SearchResult) => {
          dispatch(addSearch(item));
        });
      }
      setLoading(false);
    };
    fetchPastSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize animated values for all items
  useEffect(() => {
    searches.forEach((item) => {
      if (!animatedControllers[item.id]) {
        animatedControllers[item.id] = new Animated.Value(0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searches]);

  const handlePress = (id: string) => {
    setExpandedId((prev) => {
      // Animate all cards: expand the one pressed, collapse others
      searches.forEach((item) => {
        Animated.timing(animatedControllers[item.id], {
          toValue: item.id === id && prev !== id ? 1 : 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
      return prev === id ? null : id;
    });
  };

  const renderItem = ({ item }: { item: SearchResult }) => {
    const result = JSON.parse(item.result) as {
      authenticityScore: number;
      reasons: string[];
      suggestedRetailPrice: number;
    };
    const animatedHeight = animatedControllers[item.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [0, contentHeights[item.id] || 0],
    }) || 0;
    const animatedOpacity = animatedControllers[item.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }) || 0;
    const isMeasured = !!contentHeights[item.id];
    const isExpanded = expandedId === item.id && isMeasured;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => isMeasured && handlePress(item.id)}
        style={[
          styles.searchItem,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, borderWidth: isExpanded ? 1 : 0 }
        ]}
      >
        <Text style={[styles.queryText, { color: theme.colors.textPrimary }]}>
          {item.query}
        </Text>
        <Text style={[styles.priceText, { color: theme.colors.primary }]}>
          Suggested Price: ${result.suggestedRetailPrice.toLocaleString()}
        </Text>
        {/* Always render the hidden measuring view */}
        <View
          style={{ position: 'absolute', opacity: 0, zIndex: -1, left: 0, right: 0 }}
          pointerEvents="none"
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && contentHeights[item.id] !== h) {
              setContentHeights(heights => ({ ...heights, [item.id]: h }));
            }
          }}
        >
          <Text style={[styles.scoreText, { color: theme.colors.primary }]}>Score: {result.authenticityScore}%</Text>
          <Text style={[styles.resultText, { color: theme.colors.textSecondary }]}>{result.reasons.join('\n')}</Text>
          <Text style={[styles.timestampText, { color: theme.colors.textSecondary }]}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        {/* Only render the animated view if measured */}
        {isExpanded && (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.scoreText, { color: theme.colors.primary }]}>Score: {result.authenticityScore}%</Text>
            <Text style={[styles.resultText, { color: theme.colors.textSecondary }]}>{result.reasons.join('\n')}</Text>
            <Text style={[styles.timestampText, { color: theme.colors.textSecondary }]}>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      <FlatList
        data={searches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No past searches found</Text>
        }
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  searchItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  queryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
}); 