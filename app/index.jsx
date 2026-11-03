import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { urunler } from '../data/urunler';
import UrunKarti from '../components/UrunKarti';
import { useSepet } from '../context/SepetContext';

export default function UrunlerEkrani() {
  const [aramaMetni, setAramaMetni] = useState('');
  const { sepeteEkle, toplamAdet, toplamTutar } = useSepet();

  // Ada göre filtreleme (Büyük/küçük harf duyarsız Türkçe arama)
  const filtrelenmisUrunler = urunler.filter((urun) =>
    urun.ad.toLocaleLowerCase('tr').includes(aramaMetni.trim().toLocaleLowerCase('tr'))
  );

  const formatPara = (tutar) => {
    return Number(tutar || 0).toLocaleString('tr-TR') + ' TL';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* ARAMA VE BİLGİLENDİRME ÇUBUĞU */}
        <View style={styles.headerArea}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Ürün adına göre ara... (ör: kulaklık)"
              placeholderTextColor="#94A3B8"
              value={aramaMetni}
              onChangeText={setAramaMetni}
              clearButtonMode="while-editing"
            />
            {aramaMetni.length > 0 && (
              <Pressable
                onPress={() => setAramaMetni('')}
                style={styles.clearSearchBtn}
                accessibilityLabel="Aramayı temizle"
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ÜRÜN LİSTESİ */}
        <FlatList
          data={filtrelenmisUrunler}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UrunKarti
              urun={item}
              onDetay={() =>
                router.push({
                  pathname: '/urun/[id]',
                  params: { id: item.id },
                })
              }
              onSepeteEkle={() => sepeteEkle(item, 1)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTitle}>Ürün Bulunamadı</Text>
              <Text style={styles.emptyDesc}>
                "{aramaMetni}" aramasına uygun ürün bulunamadı.
              </Text>
              <Pressable
                onPress={() => setAramaMetni('')}
                style={styles.resetSearchBtn}
              >
                <Text style={styles.resetSearchBtnText}>Aramayı Temizle</Text>
              </Pressable>
            </View>
          }
        />

        {/* ALT SEPETE GİT ÇUBUĞU (Adım 14 & 26 gereksinimi) */}
        {toplamAdet > 0 && (
          <View style={styles.bottomBarWrapper}>
            <Pressable
              onPress={() => router.push('/sepet')}
              style={({ pressed }) => [
                styles.floatingCartBar,
                pressed && styles.floatingCartBarPressed,
              ]}
              accessibilityLabel="Sepete git"
              accessibilityRole="button"
            >
              <View style={styles.floatingCartLeft}>
                <View style={styles.floatingBadge}>
                  <Text style={styles.floatingBadgeText}>{toplamAdet}</Text>
                </View>
                <Text style={styles.floatingCartText}>Sepeti Görüntüle</Text>
              </View>

              <Text style={styles.floatingCartPrice}>
                {formatPara(toplamTutar)} →
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetSearchBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetSearchBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  floatingCartBar: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  floatingCartBarPressed: {
    backgroundColor: '#1D4ED8',
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingBadge: {
    backgroundColor: '#FFFFFF',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBadgeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
  floatingCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  floatingCartPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
