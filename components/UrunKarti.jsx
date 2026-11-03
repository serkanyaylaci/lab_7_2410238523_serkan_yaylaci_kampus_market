import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';

export default function UrunKarti({ urun, onDetay, onSepeteEkle }) {
  const stoktaYok = urun.stok <= 0;

  const formatPara = (tutar) => {
    return Number(tutar || 0).toLocaleString('tr-TR') + ' TL';
  };

  return (
    <View style={styles.card}>
      {/* Ürün Detayına Giden Alan */}
      <Pressable
        onPress={onDetay}
        style={({ pressed }) => [
          styles.detailArea,
          pressed && styles.pressedCard,
        ]}
        accessibilityLabel={`${urun.ad} detayına git`}
        accessibilityRole="button"
      >
        <View style={styles.imageWrapper}>
          {urun.gorsel ? (
            <Image
              source={urun.gorsel}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.placeholderEmoji}>{urun.emoji || '📦'}</Text>
          )}

          {stoktaYok && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Tükendi</Text>
            </View>
          )}
        </View>

        <View style={styles.infoArea}>
          <Text style={styles.kategoriText}>{urun.kategori || 'Kampüs Ürünü'}</Text>
          <Text style={styles.baslik} numberOfLines={2}>
            {urun.ad}
          </Text>

          <Text style={styles.fiyat}>{formatPara(urun.fiyat)}</Text>

          <View style={styles.stokRow}>
            <View
              style={[
                styles.stokNokta,
                { backgroundColor: stoktaYok ? '#EF4444' : '#10B981' },
              ]}
            />
            <Text
              style={[
                styles.stokText,
                { color: stoktaYok ? '#EF4444' : '#059669' },
              ]}
            >
              {stoktaYok ? 'Stokta kalmadı' : `Stok: ${urun.stok} adet`}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Sepete Ekle Butonu - Ayrı Dokunma Alanı */}
      <View style={styles.actionContainer}>
        <Pressable
          onPress={onDetay}
          style={({ pressed }) => [
            styles.detailButton,
            pressed && styles.detailButtonPressed,
          ]}
          accessibilityLabel={`${urun.ad} detayını incele`}
          accessibilityRole="button"
        >
          <Text style={styles.detailButtonText}>İncele</Text>
        </Pressable>

        <Pressable
          onPress={onSepeteEkle}
          disabled={stoktaYok}
          accessibilityLabel={`${urun.ad} ürününü sepete ekle`}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.addButton,
            stoktaYok && styles.addButtonDisabled,
            pressed && !stoktaYok && styles.addButtonPressed,
          ]}
        >
          <Text style={[styles.addButtonText, stoktaYok && styles.addButtonTextDisabled]}>
            {stoktaYok ? 'Tükendi' : '+ Sepete Ekle'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      },
    }),
  },
  detailArea: {
    flexDirection: 'row',
    padding: 14,
  },
  pressedCard: {
    backgroundColor: '#F8FAFC',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoArea: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  kategoriText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  fiyat: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 6,
  },
  stokRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stokNokta: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stokText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  detailButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  detailButtonPressed: {
    backgroundColor: '#F1F5F9',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  addButton: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  addButtonPressed: {
    backgroundColor: '#1D4ED8',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButtonTextDisabled: {
    color: '#64748B',
  },
});
