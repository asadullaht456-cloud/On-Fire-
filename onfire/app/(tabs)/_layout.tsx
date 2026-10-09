import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { useCartStore } from '../../store/cartStore';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const cartItemCount = useCartStore(state => state.getItemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'SpaceGrotesk-SemiBold',
          fontSize: 11,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <MaterialIcons name="restaurant-menu" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialIcons name="local-mall" size={24} color={color} />
              {cartItemCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -8, 
                  backgroundColor: theme.primary, borderRadius: 8,
                  paddingHorizontal: 4, minWidth: 16, height: 16,
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kitchen"
        options={{
          title: 'Kitchen',
          tabBarIcon: ({ color }) => <MaterialIcons name="local-fire-department" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
