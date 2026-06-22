import { colors } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * Tab navigator for the authenticated area. Expo Router file-based routes -
 * each tab is a file, typed and deep-linkable for free. The bar is the light,
 * rounded "glass" shell from the Lumina Flow design.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderTopColor: 'rgba(194,198,214,0.3)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 88,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="assignment"
              size={26}
              color={color}
              style={focused ? { transform: [{ scale: 1.1 }] } : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="account-circle"
              size={26}
              color={color}
              style={focused ? { transform: [{ scale: 1.1 }] } : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
}
