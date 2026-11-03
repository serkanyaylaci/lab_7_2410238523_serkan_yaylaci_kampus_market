import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const SepetContext = createContext(null);

export function SepetProvider({ children }) {
  const [sepet, setSepet] = useState([]);

  /**
   * Sepete ürün ekler.
   * Ürün zaten sepette varsa adedini artırır (stok sınırını aşamaz).
   */
  const sepeteEkle = (urun, eklenecekAdet = 1) => {
    if (!urun || urun.stok <= 0) {
      Alert.alert('Stokta Yok', 'Bu ürün şu anda stoklarımızda tükenmiştir.');
      return false;
    }

    const adetSayi = Math.max(1, parseInt(eklenecekAdet, 10) || 1);

    let eklendiMi = true;

    setSepet((oncekiSepet) => {
      const mevcutUrun = oncekiSepet.find((item) => item.id === urun.id);

      if (mevcutUrun) {
        const yeniAdet = mevcutUrun.adet + adetSayi;
        if (yeniAdet > urun.stok) {
          Alert.alert(
            'Stok Sınırı Aşıldı',
            `Bu üründen sepete en fazla ${urun.stok} adet ekleyebilirsiniz. Sepetinizde zaten ${mevcutUrun.adet} adet bulunuyor.`
          );
          eklendiMi = false;
          return oncekiSepet;
        }

        return oncekiSepet.map((item) =>
          item.id === urun.id ? { ...item, adet: yeniAdet } : item
        );
      } else {
        if (adetSayi > urun.stok) {
          Alert.alert(
            'Stok Sınırı Aşıldı',
            `Bu ürünün mevcut stoğu: ${urun.stok} adet.`
          );
          eklendiMi = false;
          return oncekiSepet;
        }

        const yeniSatir = {
          id: urun.id,
          ad: urun.ad,
          fiyat: urun.fiyat,
          adet: adetSayi,
          stok: urun.stok,
          gorsel: urun.gorsel,
          emoji: urun.emoji,
          kategori: urun.kategori,
        };

        return [...oncekiSepet, yeniSatir];
      }
    });

    return eklendiMi;
  };

  /**
   * Seçilen ürünün adedini 1 artırır (stok sınırını aşmaz).
   */
  const adetArtir = (id) => {
    setSepet((oncekiSepet) =>
      oncekiSepet.map((item) => {
        if (item.id === id) {
          if (item.adet >= item.stok) {
            Alert.alert(
              'Maksimum Stok',
              `Bu üründen en fazla ${item.stok} adet ekleyebilirsiniz.`
            );
            return item;
          }
          return { ...item, adet: item.adet + 1 };
        }
        return item;
      })
    );
  };

  /**
   * Seçilen ürünün adedini 1 azaltır.
   * Adet 1 ise değiştirmez; silmek için urunKaldir kullanılır.
   */
  const adetAzalt = (id) => {
    setSepet((oncekiSepet) =>
      oncekiSepet.map((item) => {
        if (item.id === id) {
          if (item.adet > 1) {
            return { ...item, adet: item.adet - 1 };
          }
          return item; // 1'in altına düşmez
        }
        return item;
      })
    );
  };

  /**
   * Seçilen ürünü sepetten tamamen çıkarır.
   */
  const urunKaldir = (id) => {
    setSepet((oncekiSepet) => oncekiSepet.filter((item) => item.id !== id));
  };

  /**
   * Sepetteki tüm ürünleri temizler.
   */
  const sepetiBosalt = () => {
    setSepet([]);
  };

  // Türetilmiş toplam değerler (reduce ile dinamik hesaplama)
  const toplamAdet = sepet.reduce((toplam, item) => toplam + item.adet, 0);
  const toplamTutar = sepet.reduce(
    (toplam, item) => toplam + item.fiyat * item.adet,
    0
  );

  const value = {
    sepet,
    sepeteEkle,
    adetArtir,
    adetAzalt,
    urunKaldir,
    sepetiBosalt,
    toplamAdet,
    toplamTutar,
  };

  return (
    <SepetContext.Provider value={value}>
      {children}
    </SepetContext.Provider>
  );
}

/**
 * useSepet özel kancası (Custom Hook)
 */
export function useSepet() {
  const context = useContext(SepetContext);
  if (!context) {
    throw new Error('useSepet, SepetProvider içinde kullanılmalıdır!');
  }
  return context;
}

export default SepetContext;
