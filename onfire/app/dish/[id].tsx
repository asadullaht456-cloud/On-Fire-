import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useMenuStore } from '../../store/menuStore';
import { formatRs } from '../../utils/price';

export default function DishDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const getDishById = useMenuStore(state => state.getDishById);
  
  const dish = getDishById(id as string);

  if (!dish) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.textPrimary, fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 }}>Dish not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: theme.primary, fontFamily: 'SpaceGrotesk-SemiBold' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    imageContainer: { width: '100%', height: 350, backgroundColor: theme.surfaceAlt, position: 'relative' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(11,11,11,0.6)',
      top: '50%',
    },
    backBtn: {
      position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 16,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center', justifyContent: 'center', zIndex: 10,
    },
    tagsTopLeft: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', gap: 8 },
    badge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    badgeText: { color: '#FFF', fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12 },
    content: { padding: 24, flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: theme.textPrimary, flex: 1 },
    price: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.accent, marginLeft: 16 },
    desc: { fontFamily: 'Inter-Regular', fontSize: 16, color: theme.textMuted, lineHeight: 24, marginBottom: 24 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    dietTag: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: theme.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: theme.border,
    },
    dietTagText: { color: theme.textMuted, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, textTransform: 'uppercase' },
    bottomBar: {
      padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16,
      backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
    },
    customizeBtn: {
      backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
      shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
    },
    customizeBtnText: { color: '#FFF', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, marginLeft: 8 },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image }} style={styles.image} />
          <View style={styles.gradient} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.tagsTopLeft}>
            <View style={styles.badge}>
              <MaterialIcons name="timer" size={14} color={theme.tertiary} />
              <Text style={styles.badgeText}>{dish.prepTimeMin}m</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="star" size={14} color={theme.tertiary} />
              <Text style={[styles.badgeText, { color: theme.tertiary }]}>4.8</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{dish.name}</Text>
            <Text style={styles.price}>{formatRs(dish.price)}</Text>
          </View>
          
          <Text style={styles.desc}>{dish.description}</Text>
          
          <View style={styles.tagsRow}>
            {dish.tags.map(tag => (
              <View key={tag} style={styles.dietTag}>
                <Text style={styles.dietTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.customizeBtn}
          onPress={() => router.push(`/customize/${dish.id}`)}
        >
          <MaterialIcons name="tune" size={20} color="#FFF" />
          <Text style={styles.customizeBtnText}>Customize & Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
