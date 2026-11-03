import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';

export default function SepetOzeti({ toplamAdet, toplamTutar, onSiparisVer }) {
  const formatPara = (tutar) => {
    return Number(tutar || 0).toLocaleString('tr-TR') + ' TL';
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Toplam Ürün Adedi:</Text>
        <Text style={styles.badge}>{toplamAdet} adet</Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Genel Toplam:</Text>
        <Text style={styles.totalValue}>{formatPara(toplamTutar)}</Text>
      </View>

      {onSiparisVer && (
        <Pressable
          onPress={onSiparisVer}
          disabled={toplamAdet === 0}
          accessibilityLabel="Siparişi tamamla"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.checkoutButton,
            toplamAdet === 0 && styles.checkoutButtonDisabled,
            pressed && styles.checkoutButtonPressed,
          ]}
        >
          <Text style={styles.checkoutButtonText}>
            Siparişi Tamamla ({formatPara(toplamTutar)})
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  badge: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
  },
  checkoutButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  checkoutButtonPressed: {
    backgroundColor: '#1D4ED8',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
