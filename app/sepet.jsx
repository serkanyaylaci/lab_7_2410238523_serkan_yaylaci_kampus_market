import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSepet } from '../context/SepetContext';
import AdetSecici from '../components/AdetSecici';
import SepetOzeti from '../components/SepetOzeti';

export default function SepetEkrani() {
  const {
    sepet,
    adetArtir,
    adetAzalt,
    urunKaldir,
    sepetiBosalt,
    toplamAdet,
    toplamTutar,
  } = useSepet();

  const formatPara = (tutar) => {
    return Number(tutar || 0).toLocaleString('tr-TR') + ' TL';
  };

  const handleSepetiBosalt = () => {
    Alert.alert(
      'Sepeti Boşalt',
      'Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Boşalt',
          style: 'destructive',
          onPress: () => sepetiBosalt(),
        },
      ]
    );
  };

  const handleUrunSil = (item) => {
    Alert.alert(
      'Ürünü Kaldır',
      `"${item.ad}" sepetinizden kaldırılsın mı?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: () => urunKaldir(item.id),
        },
      ]
    );
  };

  const handleSiparisVer = () => {
    Alert.alert(
      'Siparişiniz Alındı! 🎉',
      `Toplam ${toplamAdet} adet ürün için ${formatPara(toplamTutar)} tutarındaki siparişiniz başarıyla oluşturuldu.\n\n(Laboratuvar demo siparişi tamamlandı.)`,
      [
        {
          text: 'Tamam',
          onPress: () => {
            sepetiBosalt();
            router.replace('/');
          },
        },
      ]
    );
  };

  // Sepet Boş Görünümü
  if (sepet.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Sepetiniz Boş</Text>
          <Text style={styles.emptyDesc}>
            Sepetinizde henüz ürün bulunmuyor. Kampüs mağazamızdaki ürünleri keşfedip hemen ekleyebilirsiniz!
          </Text>
          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => [
              styles.goShoppingBtn,
              pressed && styles.goShoppingBtnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.goShoppingBtnText}>🛍️ Alışverişe Başla</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* ÜST BİLGİ VE SEPETİ BOŞALT BUTONU */}
        <View style={styles.topBar}>
          <Text style={styles.itemCountText}>
            Sepetinizde <Text style={styles.boldText}>{toplamAdet} adet</Text> ürün var
          </Text>

          <Pressable
            onPress={handleSepetiBosalt}
            style={({ pressed }) => [
              styles.clearBtn,
              pressed && styles.clearBtnPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.clearBtnText}>Sepeti Boşalt</Text>
          </Pressable>
        </View>

        {/* SEPET ÜRÜN LİSTESİ */}
        <FlatList
          data={sepet}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cartCard}>
              <View style={styles.cardHeader}>
                {/* Ürün Görseli */}
                <View style={styles.itemImageWrapper}>
                  {item.gorsel ? (
                    <Image
                      source={item.gorsel}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.itemEmoji}>{item.emoji || '📦'}</Text>
                  )}
                </View>

                {/* Ürün Detayları */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.ad}
                  </Text>
                  <Text style={styles.itemUnitPrice}>
                    Birim Fiyat: {formatPara(item.fiyat)}
                  </Text>
                  <Text style={styles.itemStockInfo}>
                    Stok Durumu: {item.stok} adet
                  </Text>
                </View>

                {/* Kaldır Butonu */}
                <Pressable
                  onPress={() => handleUrunSil(item)}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.removeButtonPressed,
                  ]}
                  accessibilityLabel={`${item.ad} ürününü sepetten kaldır`}
                  accessibilityRole="button"
                >
                  <Text style={styles.removeButtonText}>✕ Kaldır</Text>
                </Pressable>
              </View>

              {/* Alt Satır: Adet Seçici ve Satır Toplamı */}
              <View style={styles.cardFooter}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Adet:</Text>
                  <AdetSecici
                    adet={item.adet}
                    onArtir={() => adetArtir(item.id)}
                    onAzalt={() => adetAzalt(item.id)}
                    max={item.stok}
                  />
                </View>

                <View style={styles.rowTotalContainer}>
                  <Text style={styles.rowTotalLabel}>Satır Toplamı:</Text>
                  <Text style={styles.rowTotalValue}>
                    {formatPara(item.fiyat * item.adet)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />

        {/* ALT ÖZET BİLEŞENİ */}
        <View style={styles.summaryWrapper}>
          <SepetOzeti
            toplamAdet={toplamAdet}
            toplamTutar={toplamTutar}
            onSiparisVer={handleSiparisVer}
          />
        </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemCountText: {
    fontSize: 14,
    color: '#64748B',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  clearBtnPressed: {
    backgroundColor: '#FECACA',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: 52,
    height: 52,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  itemUnitPrice: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  itemStockInfo: {
    fontSize: 11,
    color: '#94A3B8',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  removeButtonPressed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  removeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  rowTotalContainer: {
    alignItems: 'flex-end',
  },
  rowTotalLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  rowTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  summaryWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  goShoppingBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  goShoppingBtnPressed: {
    backgroundColor: '#1D4ED8',
  },
  goShoppingBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
