import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, interpolate } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';
import { useMenuStore } from '../../store/menuStore';
import { useAuthStore } from '../../store/authStore';
import { formatRs } from '../../utils/price';
import { Category, DietTag } from '../../types';

export default function MenuScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const { user, logout } = useAuthStore();
  const { 
    categories, selectedCategory, setCategory, 
    searchQuery, setSearch, 
    selectedTags, toggleTag, 
    showAvailableOnly, setShowAvailableOnly,
    sortBy, setSortBy,
    priceRange, setPriceRange,
    clearFilters,
    getFilteredDishes 
  } = useMenuStore();

  const filteredDishes = getFilteredDishes();
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filterHeight = useSharedValue(0);

  const toggleFilters = () => {
    const nextState = !isFiltersOpen;
    setIsFiltersOpen(nextState);
    filterHeight.value = withTiming(nextState ? 1 : 0, { duration: 300 });
  };

  const animatedFilterStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(filterHeight.value, [0, 1], [0, 450]),
      opacity: filterHeight.value,
      overflow: 'hidden'
    };
  });

  // Calculate active filter count
  let activeFilters = selectedTags.length;
  if (showAvailableOnly) activeFilters += 1;
  if (sortBy !== 'none') activeFilters += 1;
  if (priceRange.min > 0 || priceRange.max < 5000) activeFilters += 1;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: theme.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brandTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.secondary, textTransform: 'uppercase' },
    tagline: { fontFamily: 'Caveat-SemiBold', fontSize: 20, color: theme.accent, marginTop: -4 },
    searchContainer: { marginHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
    searchInputWrapper: { flex: 1, position: 'relative' },
    searchInput: {
      backgroundColor: theme.surfaceAlt, color: theme.textPrimary,
      fontFamily: 'Inter-Regular', fontSize: 16, padding: 14, paddingLeft: 44,
      borderRadius: 12, borderWidth: 1, borderColor: theme.border,
    },
    searchIcon: { position: 'absolute', left: 14, top: 14, zIndex: 1 },
    filterBtn: {
      backgroundColor: theme.surfaceAlt, width: 48, height: 48, borderRadius: 12,
      borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center',
      position: 'relative'
    },
    filterBadge: {
      position: 'absolute', top: -6, right: -6, backgroundColor: theme.primary,
      width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
    },
    filterBadgeText: { color: '#FFF', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' },
    
    // Panel Styles
    filterPanel: { backgroundColor: theme.surfaceAlt, marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: theme.border, marginBottom: 16 },
    filterContent: { padding: 16 },
    filterSection: { marginBottom: 16 },
    filterSectionTitle: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: theme.textPrimary, marginBottom: 8 },
    
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tagChip: {
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
      backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
    },
    tagChipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    tagText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, color: theme.textMuted, textTransform: 'uppercase' },
    tagTextActive: { color: '#FFF' },
    
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    filterRowText: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textPrimary },
    
    sortOptions: { flexDirection: 'row', gap: 8 },
    sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
    sortBtnActive: { borderColor: theme.accent, backgroundColor: 'rgba(247, 201, 72, 0.1)' },
    sortBtnText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12, color: theme.textMuted },
    sortBtnTextActive: { color: theme.accent },
    
    filterActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border },
    clearBtn: { padding: 12, flex: 1, alignItems: 'center' },
    clearBtnText: { color: theme.textMuted, fontFamily: 'SpaceGrotesk-SemiBold' },
    applyBtn: { padding: 12, flex: 1, alignItems: 'center', backgroundColor: theme.primary, borderRadius: 8 },
    applyBtnText: { color: '#FFF', fontFamily: 'SpaceGrotesk-SemiBold' },

    categories: { paddingHorizontal: 16, paddingBottom: 12 },
    catPill: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99,
      backgroundColor: theme.surfaceAlt, marginRight: 8,
    },
    catPillActive: {
      backgroundColor: theme.primary,
      shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
    },
    catText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: theme.textMuted },
    catTextActive: { color: '#FFF' },
    
    dishCard: {
      backgroundColor: theme.surface, borderRadius: 16, marginBottom: 24, marginHorizontal: 16,
      borderWidth: 1, borderColor: theme.border, overflow: 'hidden',
    },
    dishImage: { width: '100%', height: 200, backgroundColor: theme.surfaceAlt },
    unavailableOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center', alignItems: 'center', zIndex: 10,
    },
    dishInfo: { padding: 16 },
    dishHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    dishTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.textPrimary, flex: 1 },
    dishPrice: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.accent, marginLeft: 8 },
    dishDesc: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.textMuted, marginTop: 4, marginBottom: 12 },
    addButton: {
      backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
      flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end',
    },
    addButtonText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, color: '#FFF', marginLeft: 4 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>On Fire</Text>
          <Text style={styles.tagline}>Taste the heat</Text>
        </View>
        <TouchableOpacity onPress={logout} style={{ padding: 8, backgroundColor: theme.surfaceAlt, borderRadius: 20 }}>
          <MaterialIcons name="logout" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <MaterialIcons name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search smoky grills, burgers..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearch}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={toggleFilters}>
              <MaterialIcons name="tune" size={20} color={theme.textPrimary} />
              {activeFilters > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilters}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <Animated.View style={[styles.filterPanel, animatedFilterStyle]}>
            <View style={styles.filterContent}>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Dietary Preferences</Text>
                <View style={styles.tagsContainer}>
                  {(['Spicy', 'Veg', 'Nut-Free', 'Gluten-Free', 'Dairy-Free'] as DietTag[]).map(tag => {
                    const isActive = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.tagChip, isActive && styles.tagChipActive]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{tag}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.filterSection}>
                <View style={styles.filterRow}>
                  <Text style={styles.filterRowText}>Show Available Only</Text>
                  <Switch 
                    value={showAvailableOnly} 
                    onValueChange={setShowAvailableOnly}
                    trackColor={{ false: theme.border, true: theme.primary }}
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
                  <TouchableOpacity style={[styles.sortBtn, sortBy === 'none' && styles.sortBtnActive]} onPress={() => setSortBy('none')}>
                    <Text style={[styles.sortBtnText, sortBy === 'none' && styles.sortBtnTextActive]}>Recommended</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sortBtn, sortBy === 'price_asc' && styles.sortBtnActive]} onPress={() => setSortBy('price_asc')}>
                    <Text style={[styles.sortBtnText, sortBy === 'price_asc' && styles.sortBtnTextActive]}>Price: Low to High</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sortBtn, sortBy === 'price_desc' && styles.sortBtnActive]} onPress={() => setSortBy('price_desc')}>
                    <Text style={[styles.sortBtnText, sortBy === 'price_desc' && styles.sortBtnTextActive]}>Price: High to Low</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sortBtn, sortBy === 'prep_time' && styles.sortBtnActive]} onPress={() => setSortBy('prep_time')}>
                    <Text style={[styles.sortBtnText, sortBy === 'prep_time' && styles.sortBtnTextActive]}>Prep Time</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={toggleFilters}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Animated.View>
        </View>

        <View style={{ backgroundColor: theme.background, zIndex: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
            <TouchableOpacity
              style={[styles.catPill, selectedCategory === 'All' && styles.catPillActive]}
              onPress={() => setCategory('All')}
            >
              <Text style={[styles.catText, selectedCategory === 'All' && styles.catTextActive]}>All Menu</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingBottom: 100 }}>
          {filteredDishes.map(dish => (
            <TouchableOpacity 
              key={dish.id} 
              style={styles.dishCard} 
              activeOpacity={0.8}
              onPress={() => dish.available ? router.push(`/dish/${dish.id}`) : null}
            >
              <View>
                <Image source={{ uri: dish.image }} style={[styles.dishImage, !dish.available && { opacity: 0.5 }]} />
                {!dish.available && (
                  <View style={styles.unavailableOverlay}>
                    <View style={{ backgroundColor: theme.danger, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                      <Text style={{ color: '#FFF', fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 14, textTransform: 'uppercase' }}>Unavailable</Text>
                    </View>
                  </View>
                )}
                {dish.available && dish.stock !== undefined && (
                  <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: theme.accent }}>
                    <Text style={{ color: theme.accent, fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 12 }}>Only {dish.stock} left</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.dishInfo}>
                <View style={styles.dishHeader}>
                  <Text style={styles.dishTitle}>{dish.name}</Text>
                  <Text style={styles.dishPrice}>{formatRs(dish.price)}</Text>
                </View>
                <Text style={styles.dishDesc} numberOfLines={2}>{dish.description}</Text>
                
                {dish.available && (
                  <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/dish/${dish.id}`)}>
                    <MaterialIcons name="add" size={18} color="#FFF" />
                    <Text style={styles.addButtonText}>Customize & Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {filteredDishes.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialIcons name="search-off" size={64} color={theme.surfaceAlt} />
              <Text style={{ color: theme.textMuted, fontFamily: 'Inter-Regular', marginTop: 16 }}>No dishes found matching your filters.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
