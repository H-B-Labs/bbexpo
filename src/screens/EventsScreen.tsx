import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEvents, Event as EventType } from '../hooks/useEvents';
import { useTheme } from '../theme/theme';
import { format } from 'date-fns';
import { RootStackParamList } from '../navigation/types';

type EventsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EventDisplayProps {
  event: EventType;
  onPress: (eventId: string) => void;
}

export const EventsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const { events, loading, error, refetch } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'weekend'>('all');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    filterContainer: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    selectedFilter: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    selectedFilterText: {
      color: theme.colors.white,
      fontWeight: theme.typography.weights.semibold,
    },
    listContent: {
      padding: theme.spacing.md,
    },
    eventCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    eventImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    eventContent: {
      padding: theme.spacing.md,
    },
    eventTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    barName: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    eventDate: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    eventDescription: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    coverCharge: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    tag: {
      backgroundColor: theme.colors.primaryLight,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    tagText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.semibold,
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filterEvents = (events: EventType[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekend = isWeekend(now);

    switch (selectedFilter) {
      case 'today':
        return events.filter((event) => event.date === today);
      case 'week':
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return events.filter(
          (event) => new Date(event.date) <= nextWeek && new Date(event.date) >= now
        );
      case 'weekend':
        return events.filter((event) => {
          const eventDate = new Date(event.date);
          return isWeekend(eventDate);
        });
      default:
        return events;
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday or Saturday
  };

  const renderEvent = ({ item }: { item: EventType }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('BarDetails', { barId: item.bar_id })}
      activeOpacity={0.7}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.name || 'Untitled Event'}</Text>
        <Text style={styles.barName}>{item.bar?.name || 'Unknown Venue'}</Text>
        <Text style={styles.eventDate}>
          {format(new Date(item.date), 'EEE, MMM d')} •{' '}
          {item.startTime || 'TBA'} - {item.endTime || 'TBA'}
        </Text>
        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.coverCharge !== null && item.coverCharge !== undefined && (
          <Text style={styles.coverCharge}>
            Cover: ${Number(item.coverCharge).toFixed(2)}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {(['all', 'today', 'week', 'weekend'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filterEvents(events)}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
