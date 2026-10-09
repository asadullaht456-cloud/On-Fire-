import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

export function Header({ title }: { title?: string }) {
  const theme = useTheme();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme: appTheme, toggleTheme } = useSettingsStore();
  const isDarkMode = appTheme === 'dark';
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  const navigateTo = (path: any) => {
    setMenuVisible(false);
    router.push(path);
  };

  const styles = StyleSheet.create({
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: theme.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: title ? 1 : 0,
      borderBottomColor: theme.border,
    },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoImg: { width: 40, height: 40, resizeMode: 'contain' },
    brandTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.secondary, textTransform: 'uppercase' },
    pageTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.textPrimary },
    hamburgerBtn: { padding: 8, backgroundColor: theme.surfaceAlt, borderRadius: 20 },
    
    // Drawer styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', alignItems: 'flex-end' },
    drawer: {
      width: '75%', height: '100%', backgroundColor: theme.surface,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 24,
      shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
    },
    drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    drawerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: theme.secondary },
    closeBtn: { padding: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.border },
    menuItemText: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 18, color: theme.textPrimary, flex: 1 },
    logoutBtn: { marginTop: 40, backgroundColor: 'rgba(225, 15, 15, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: theme.danger, borderStyle: 'solid' },
    logoutText: { color: theme.danger },
  });

  return (
    <>
      <View style={styles.headerContainer}>
        {title ? (
          <Text style={styles.pageTitle}>{title}</Text>
        ) : (
          <View style={styles.logoRow}>
            <Image source={require('../assets/images/onfire_logo.png')} style={styles.logoImg} />
            <Text style={styles.brandTitle}>On Fire</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setMenuVisible(true)}>
          <MaterialIcons name="menu" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuVisible(false)} />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setMenuVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/orders')}>
              <MaterialIcons name="receipt-long" size={24} color={theme.textPrimary} />
              <Text style={styles.menuItemText}>My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/reviews')}>
              <MaterialIcons name="star" size={24} color={theme.textPrimary} />
              <Text style={styles.menuItemText}>Reviews</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/help')}>
              <MaterialIcons name="help-outline" size={24} color={theme.textPrimary} />
              <Text style={styles.menuItemText}>Help</Text>
            </TouchableOpacity>

            <View style={styles.menuItem}>
              <MaterialIcons name="dark-mode" size={24} color={theme.textPrimary} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
              <TouchableOpacity 
                onPress={toggleTheme}
                style={{
                  width: 50, height: 28, borderRadius: 14,
                  backgroundColor: isDarkMode ? theme.primary : theme.border,
                  justifyContent: 'center', padding: 2
                }}
              >
                <View style={{
                  width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF',
                  transform: [{ translateX: isDarkMode ? 22 : 0 }]
                }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/about')}>
              <MaterialIcons name="info-outline" size={24} color={theme.textPrimary} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color={theme.danger} />
              <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
