import React from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { SepetProvider, useSepet } from '../context/SepetContext';

function HeaderSepetButonu() {
  const { toplamAdet } = useSepet();

  return (
    <Pressable
      onPress={() => router.push('/sepet')}
      style={({ pressed }) => [
        styles.headerCartBtn,
        pressed && styles.headerCartBtnPressed,
      ]}
      accessibilityLabel="Sepete git"
      accessibilityRole="button"
    >
      <Text style={styles.headerCartIcon}>🛒</Text>
      {toplamAdet > 0 && (
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{toplamAdet}</Text>
        </View>
      )}
    </Pressable>
  );
}

function StackNavigation() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#0F172A',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerShadowVisible: true,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Ürünler',
            headerRight: () => <HeaderSepetButonu />,
          }}
        />
        <Stack.Screen
          name="urun/[id]"
          options={{
            title: 'Ürün detayı',
            headerRight: () => <HeaderSepetButonu />,
            headerBackTitle: 'Geri',
          }}
        />
        <Stack.Screen
          name="sepet"
          options={{
            title: 'Sepetim',
            headerBackTitle: 'Ürünler',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SepetProvider>
      <StackNavigation />
    </SepetProvider>
  );
}

const styles = StyleSheet.create({
  headerCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    position: 'relative',
    marginRight: 4,
  },
  headerCartBtnPressed: {
    opacity: 0.7,
  },
  headerCartIcon: {
    fontSize: 22,
  },
  headerBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
