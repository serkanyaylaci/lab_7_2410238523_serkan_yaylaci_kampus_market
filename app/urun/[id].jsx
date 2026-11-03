import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { urunler } from '../../data/urunler';
import AdetSecici from '../../components/AdetSecici';
import { useSepet } from '../../context/SepetContext';

export default function UrunDetayEkrani() {
  const { id } = useLocalSearchParams();
  const { sepeteEkle, sepet } = useSepet();

  // URL parametresindeki kimlikle eşleşen ürünü bul
  const urun = urunler.find((u) => u.id === id);

  // Seçilen adet için yerel state (varsayılan: 1)
  const [secilenAdet, setSecilenAdet] = useState(1);

  const formatPara = (tutar) => {
    return Number(tutar || 0).toLocaleString('tr-TR') + ' TL';
  };

  // Ürün bulunamadı durumu (404 kontrolü)
  if (!urun) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>⚠️</Text>
          <Text style={styles.notFoundTitle}>Ürün Bulunamadı</Text>
          <Text style={styles.notFoundDesc}>
            "{id}" kimlik numarasına ait ürün kaydı sistemde mevcut değil.
          </Text>
          <Pressable
            onPress={() => router.replace('/')}
            style={styles.backButton}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Ürün Listesine Dön</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const stoktaYok = urun.stok <= 0;
  const sepettekiUrun = sepet.find((item) => item.id === urun.id);
  const sepettekiAdet = sepettekiUrun ? sepettekiUrun.adet : 0;
  const kalanEklenebilirStok = Math.max(0, urun.stok - sepettekiAdet);

  const handleArtir = () => {
    if (secilenAdet < urun.stok) {
      setSecilenAdet((prev) => prev + 1);
    } else {
      Alert.alert('Maksimum Stok', `Bu ürünün toplam stoğu ${urun.stok} adettir.`);
    }
  };

  const handleAzalt = () => {
    if (secilenAdet > 1) {
      setSecilenAdet((prev) => prev - 1);
    }
  };

  const handleSepeteEkle = () => {
    const basarili = sepeteEkle(urun, secilenAdet);
    if (basarili) {
      Alert.alert(
        'Sepete Eklendi',
        `${secilenAdet} adet ${urun.ad} sepetinize eklendi.`,
        [
          { text: 'Alışverişe Devam Et', style: 'cancel' },
          { text: 'Sepete Git', onPress: () => router.push('/sepet') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ÜRÜN GÖRSEL ALANI */}
        <View style={styles.imageCard}>
          {urun.gorsel ? (
            <Image
              source={urun.gorsel}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.imageEmoji}>{urun.emoji || '📦'}</Text>
          )}

          {stoktaYok && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>STOKTA YOK</Text>
            </View>
          )}
        </View>

        {/* BİLGİ ALANI */}
        <View style={styles.detailsContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.kategoriBadge}>{urun.kategori}</Text>
            <Text style={styles.idBadge}>Ürün Kodu: {urun.id}</Text>
          </View>

          <Text style={styles.title}>{urun.ad}</Text>
          <Text style={styles.price}>{formatPara(urun.fiyat)}</Text>

          {/* STOK BİLGİLENDİRMESİ */}
          <View
            style={[
              styles.stockBox,
              { backgroundColor: stoktaYok ? '#FEF2F2' : '#F0FDF4' },
            ]}
          >
            <Text
              style={[
                styles.stockText,
                { color: stoktaYok ? '#B91C1C' : '#15803D' },
              ]}
            >
              {stoktaYok
                ? '⚠️ Ürün stoklarımızda tükenmiştir. Şu anda sipariş verilemez.'
                : `✅ Stok Durumu: ${urun.stok} adet mevcut` +
                  (sepettekiAdet > 0 ? ` (${sepettekiAdet} adedi sepetinizde)` : '')}
            </Text>
          </View>

          {/* AÇIKLAMA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.descText}>{urun.aciklama}</Text>
          </View>

          {/* ADET SEÇİMİ VE SEPETE EKLEME */}
          {!stoktaYok && (
            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Adet Seçimi</Text>
              <View style={styles.quantityRow}>
                <AdetSecici
                  adet={secilenAdet}
                  onArtir={handleArtir}
                  onAzalt={handleAzalt}
                  max={urun.stok}
                />
                <Text style={styles.subtotalText}>
                  Ara Toplam: {formatPara(urun.fiyat * secilenAdet)}
                </Text>
              </View>
            </View>
          )}

          {/* BUTONLAR */}
          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleSepeteEkle}
              disabled={stoktaYok}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.addCartBtn,
                stoktaYok && styles.addCartBtnDisabled,
                pressed && !stoktaYok && styles.addCartBtnPressed,
              ]}
            >
              <Text
                style={[
                  styles.addCartBtnText,
                  stoktaYok && styles.addCartBtnTextDisabled,
                ]}
              >
                {stoktaYok ? 'Tükendi' : `Sepete Ekle (${formatPara(urun.fiyat * secilenAdet)})`}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/sepet')}
              style={({ pressed }) => [
                styles.goToCartBtn,
                pressed && styles.goToCartBtnPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.goToCartBtnText}>Sepeti Görüntüle 🛒</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    marginBottom: 16,
  },
  productImage: {
    width: 200,
    height: 200,
  },
  imageEmoji: {
    fontSize: 90,
  },
  soldOutBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  soldOutText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kategoriBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  idBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 14,
  },
  stockBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  orderSection: {
    marginBottom: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionButtons: {
    gap: 10,
  },
  addCartBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  addCartBtnPressed: {
    backgroundColor: '#1D4ED8',
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  addCartBtnTextDisabled: {
    color: '#64748B',
  },
  goToCartBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  goToCartBtnPressed: {
    backgroundColor: '#E2E8F0',
  },
  goToCartBtnText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  notFoundEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  notFoundDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
