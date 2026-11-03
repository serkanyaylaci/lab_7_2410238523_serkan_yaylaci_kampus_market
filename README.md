# Kampüs Market Uygulaması - Laboratuvar Raporu ve Dokümantasyonu

**Ders:** Mobil Programlama  
**Öğrenci Adı Soyadı:** Serkan Yaylacı  
**Öğrenci No:** 2410238523  
**Tarih:** 3 Kasım 2026  
**Çalışma Ortamı:** Node.js v22, React Native 0.86, Expo Router v4 (SDK 57), Safe Area Context  

---

## 🎯 1. Görevin Amacı ve Kapsamı
Bu laboratuvar çalışmasında; boş bir Expo projesinden başlanarak dosya tabanlı gezinme (Expo Router v4), dinamik rotalar (`urun/[id]`), React Context API ile merkezi durum yönetimi (`SepetContext`) ve cihaz çentik/güvenli alan sınırlarını koruyan (`SafeAreaView`) çok ekranlı bir **Kampüs Market** mobil alışveriş uygulaması geliştirilmiştir.

---

## 🏗️ 2. Dosya Yapısı ve Görevleri

| Dosya Yolu | Görevi ve Sorumluluğu |
| :--- | :--- |
| **`app/_layout.jsx`** | Uygulamanın kök Stack navigasyon yapısını kurar. Tüm ekranları `SepetProvider` ile sarmalayarak sepet verisinin tüm sayfalarda ortak olmasını sağlar. Header'da canlı sepet rozetini sunar. |
| **`app/index.jsx`** | Ürünlerin listelendiği ana ekrandır. Ada göre anlık arama (Türkçe harf uyumlu filtreleme), `FlatList` ile listeleme ve sepete gitme butonlarını içerir. |
| **`app/urun/[id].jsx`** | Seçilen ürünün kimliğine (`id`) göre detaylarını gösteren dinamik ekrandır. Stok durumunu kontrol eder, `AdetSecici` ile adet belirleme ve sepete ekleme imkanı sunar. |
| **`app/sepet.jsx`** | Sepetteki ürünlerin listelendiği, adet artırma/azaltma, ürün kaldırma, sepeti boşaltma ve sipariş tamamlama işlemlerinin yapıldığı ekrandır. |
| **`components/UrunKarti.jsx`** | Ana sayfada her bir ürün için tekrar kullanılabilir kart bileşenidir. İnceleme ve sepete ekleme dokunma alanlarını birbirinden ayırır. Stok 0 ise ekleme butonunu pasif yapar. |
| **`components/AdetSecici.jsx`** | Artı (+) ve Eksi (−) butonları içeren, erişilebilirlik etiketlerine sahip miktar belirleme bileşenidir. Minimum 1 ve maksimum stok kontrollerini içerir. |
| **`components/SepetOzeti.jsx`** | Sepetteki toplam adet (`toplamAdet`) ve toplam tutar (`toplamTutar`) bilgilerini hesaplayıp gösteren alt özet bileşenidir. |
| **`context/SepetContext.jsx`** | Sepetin merkezi state havuzudur (`sepet`). `sepeteEkle`, `adetArtir`, `adetAzalt`, `urunKaldir`, `sepetiBosalt` fonksiyonlarını ve `useSepet` özel kancasını sunar. |
| **`data/urunler.js`** | Uygulamanın yerel veri tabanıdır. Föyde belirtilen P101, P102, P103 (stoksuz test ürünü) ve ek kampüs ürünlerini barındırır. |
| **`assets/`** | Ürün fotoğrafları ve uygulama ikonları yerel dosya olarak burada tutulur. |

---

## 💡 3. Sepetin Ortak Provider İçinde Tutulma Nedeni

> **Neden `SepetProvider` Kullanıldı?**  
> React Native ve Expo Router mimarisinde ekranlar (`index.jsx`, `urun/[id].jsx`, `sepet.jsx`) yığın (Stack) üzerinde çalışan bağımsız rota bileşenleridir.  
> Eğer sepet durumu yerel bir `useState` ile sadece sepet ekranında tutulsaydı:
> 1. Kullanıcı ürün listesinden veya ürün detay sayfasından sepete ürün ekleyemezdi.
> 2. Ekranlar arası geçiş yapıldığında veya sayfa kapandığında veriler kaybolurdu.
> 3. Üst başlıktaki (header) sepet sayacı ile liste ekranındaki toplam adet birbirinden habersiz kalırdı.
>
> Sepet durumu `_layout.jsx` seviyesinde bir **`SepetProvider`** ile en tepeye yerleştirildiğinde; uygulama genelinde **"Single Source of Truth" (Tek Doğruluk Kaynağı)** ilkesi sağlanmış olur. Bu sayede hem `index.jsx` hem de `urun/[id].jsx` doğrudan aynı hafıza alanına yazar, `sepet.jsx` ve header rozeti ise bu veriyi anlık olarak senkronize biçimde görüntüler. Gereksiz prop aktarımı (prop drilling) önlenmiş ve modüler bir mimari kurulmuş olur.

---

## 🧪 4. Laboratuvar Föyü Doğrulama ve Test Tablosu

Föyün 11. bölümündeki (Adım 27) tüm test adımları başarıyla yürütülmüş ve doğrulanmıştır:

| Test No | Deneme | Beklenen Sonuç | Gerçekleşen Sonuç | Durum |
| :---: | :--- | :--- | :--- | :---: |
| **T1** | P101 kulaklığı 2 kez ekleyin. | Tek satır, adet: 2, toplam: 2.400 TL | Tek satırda adet 2 oldu, toplam 2.400 TL hesaplandı. | **GEÇTİ** |
| **T2** | P102 çantayı 1 kez ekleyin. | İki satır, toplam adet: 3, toplam tutar: 3.200 TL | Çanta 2. satır olarak eklendi, toplam adet 3, tutar 3.200 TL oldu. | **GEÇTİ** |
| **T3** | Kulaklığı bir azaltın. | Kulaklık: 1, toplam adet: 2, tutar: 2.000 TL | Kulaklık adedi 1'e düştü, sepet 2.000 TL olarak güncellendi. | **GEÇTİ** |
| **T4** | Çantayı sepetten kaldırın. | Yalnız 1 kulaklık, toplam: 1.200 TL | Çanta satırı silindi, sepette sadece kulaklık kaldı (1.200 TL). | **GEÇTİ** |
| **T5** | Kulaklık adedi 1 iken eksiye basın. | Adet 1 kalır, negatif değer oluşmaz. | Eksi butonu pasifleşti; adet 1'in altına düşmedi. | **GEÇTİ** |
| **T6** | Stoksuz lambayı (P103) eklemeyi deneyin. | Ekleme engellenir, açıklayıcı durum görünür. | Buton "Tükendi" olarak kilitlendi, ekleme engellendi. | **GEÇTİ** |
| **T7** | Stok sınırını aşmayı deneyin. | Ekleme veya artırma engellenir. | Stok adedine (10) ulaşıldığında uyarı verildi, aşım engellendi. | **GEÇTİ** |
| **T8** | Liste ile sepet arasında geçiş yapın. | Sepet güncel kalır, iki ekran aynı veriyi görür. | Navigasyon geçişlerinde tüm adet ve tutarlar korundu. | **GEÇTİ** |
| **T9** | Sepeti boşaltın. | Boş sepet mesajı ve ürünlere dönüş görünür. | Sepet sıfırlandı, "Sepetiniz Boş" ekranı belirdi. | **GEÇTİ** |
| **T10** | Uygulamayı tamamen kapatıp açın. | Sepet boş başlar (kalıcı depolama yok). | Uygulama ilk durumundaki boş sepetle açıldı. | **GEÇTİ** |

---

## 🚀 5. Projeyi Çalıştırma

Terminal üzerinden aşağıdaki komutlarla projeyi başlatabilirsiniz:

```bash
cd "C:\Mobil Programlama\kampus-market"
npx expo start --clear
```

- **Tarayıcıda Çalıştırma:** Terminal açıkken klavyeden **`w`** tuşuna basınız.
- **Telefonda Çalıştırma:** Expo Go uygulamasını açıp terminaldeki QR kodu taratınız.
