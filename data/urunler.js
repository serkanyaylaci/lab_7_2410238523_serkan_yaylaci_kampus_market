/**
 * Kampüs Market - Yerel Ürün Veri Kaynağı
 * Mobil Programlama Laboratuvarı
 * Öğrenci: Serkan Yaylacı (2410238523)
 */

export const urunler = [
  {
    id: 'P101',
    ad: 'Kablosuz Kulaklık',
    fiyat: 1200,
    stok: 10,
    kategori: 'Elektronik',
    aciklama: 'Aktif gürültü engelleme (ANC), 30 saat kesintisiz çalma süresi ve Bluetooth 5.3 bağlantı özellikli yüksek performanslı kulaklık.',
    gorsel: require('../assets/kulaklik.png'),
    emoji: '🎧',
  },
  {
    id: 'P102',
    ad: 'Günlük Sırt Çantası',
    fiyat: 800,
    stok: 6,
    kategori: 'Aksesuar',
    aciklama: 'Su geçirmez dayanıklı kumaş, 15.6 inç korumalı laptop bölmesi, USB şarj çıkışı ve ergonomik sırt destekli kampüs sırt çantası.',
    gorsel: require('../assets/canta.png'),
    emoji: '🎒',
  },
  {
    id: 'P103',
    ad: 'Masa Lambası',
    fiyat: 600,
    stok: 0, // Laboratuvar test senaryosu için stoksuz ürün
    kategori: 'Ev & Yaşam',
    aciklama: '3 farklı ışık modu (sıcak, doğal, beyaz), dokunmatik parlaklık kademesi ve göz yormayan LED aydınlatmalı çalışma lambası.',
    gorsel: require('../assets/lamba.png'),
    emoji: '💡',
  },
  {
    id: 'P104',
    ad: 'Paslanmaz Çelik Termos',
    fiyat: 450,
    stok: 15,
    kategori: 'Kampüs Yaşamı',
    aciklama: '500 ml hacimli çift katmanlı vakum yalıtımlı paslanmaz çelik termos. İçecekleri 12 saat sıcak, 24 saat soğuk tutar.',
    gorsel: require('../assets/termos.png'),
    emoji: '☕',
  },
  {
    id: 'P105',
    ad: 'RGB Mekanik Klavye',
    fiyat: 1500,
    stok: 4,
    kategori: 'Elektronik',
    aciklama: 'Özelleştirilebilir RGB arka aydınlatmalı, ergonomik bilek destekli, Türkçe Q dizilimli Blue Switch mekanik klavye.',
    gorsel: require('../assets/klavye.png'),
    emoji: '⌨️',
  },
];

export default urunler;
