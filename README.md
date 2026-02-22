# Dinamik-QR-Kod-retici
Dynamic QR Generator Pro (Dinamik QR Pro)

<a href="https://ibb.co/sdkQ6ptQ"><img src="https://i.ibb.co/ycG5YmV5/Ekran-g-r-nt-s-2026-02-22-061844.png" alt="Ekran-g-r-nt-s-2026-02-22-061844" border="0"></a>
<a href="https://ibb.co/k21vD855"><img src="https://i.ibb.co/KxwSsqbb/Ekran-g-r-nt-s-2026-02-22-061901.png" alt="Ekran-g-r-nt-s-2026-02-22-061901" border="0"></a>
<a href="https://ibb.co/HLyM79N8"><img src="https://i.ibb.co/dsv3BHbY/Ekran-g-r-nt-s-2026-02-22-061916.png" alt="Ekran-g-r-nt-s-2026-02-22-061916" border="0"></a>

Bu proje, işletmeler için modern, dinamik ve tam kapsamlı bir QR kod yönetim sistemidir. Kullanıcıların dinamik fiyatlandırma, kampanya yönetimi ve detaylı analitik takibi yapabilmelerine olanak sağlar.

## 🚀 Temel Özellikler

- **Dinamik Fiyatlandırma:** Belirli saat aralıklarında otomatik fiyat değişimi (indirim veya artış) tanımlayabilme.
- **Kampanya Yönetimi:** Her QR kod için özel isim, açıklama, ürün görseli ve marka logosu atayabilme.
- **Yönlendirme Seçenekleri:** Doğrudan dış siteye yönlendirme veya uygulama içi şık bir kampanya sayfası gösterme.
- **Kapsamlı Panel:** Tüm QR kodları tek bir yerden yönetme, düzenleme ve silme.
- **Tarama İstatistikleri:** Her bir QR kodun kaç kez okutulduğunu anlık olarak takip etme.
- **Marka Özelleştirme:** İşletme logosu, ismi ve web sitesi ile tamamen kişiselleştirilmiş kampanya sayfaları.
- **Güvenli Giriş:** Kullanıcı kayıt ve giriş sistemi (Auth).
- **Yasal Uyumluluk:** Entegre Gizlilik Politikası, Çerez Politikası ve Kullanım Şartları modülleri.

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **React 18**: modern bileşen yapısı.
- **Vite**: Hızlı geliştirme ve build süreci.
- **Tailwind CSS**: Modern ve şık arayüz tasarımı.
- **Lucide React**: Modern ikon kütüphanesi.
- **html-to-image & jspdf**: QR kod ve içerikleri görsel veya PDF olarak dışa aktarma.
- **qrcode.react**: Yüksek kaliteli QR kod üretimi.

### Backend
- **Node.js & Express**: Hızlı ve hafif API sunucusu.
- **LowDB**: JSON tabanlı, hızlı ve güvenilir veri saklama.
- **CORS & Body-Parser**: Güvenli veri iletişimi.

## 📁 Proje Yapısı

```text
/
├── App.tsx             # Ana uygulama bileşeni ve routing mantığı
├── components/         # Ortak UI bileşenleri (Layout, Modal, QRPreview vb.)
├── services/           # API bağlantı servisleri
├── types.ts            # TypeScript interface ve tip tanımlamaları
├── utils.ts            # Yardımcı fonksiyonlar (Fiyat hesaplama vb.)
├── server/             # Express.js backend dosyaları
│   ├── index.js        # API sunucusu ana dosyası
│   └── db.json         # JSON tabanlı veritabanı
└── public/             # Statik varlıklar
```

## ⚙️ Kurulum ve Çalıştırma

### Yerel Geliştirme Ortamı

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

3.  **Backend Sunucusunu Başlatın:**
    ```bash
    cd server
    npm install
    node index.js
    ```
    *(Not: Frontend ve Backend varsayılan olarak farklı portlarda çalışacaktır, ancak `server/index.js` üzerinden frontend'i serve edecek şekilde konfigüre edilmiştir.)*

### Hızlı Başlatma (Windows)
Proje kök dizinindeki `baslat.bat` dosyasını çalıştırarak otomatik kurulum ve başlatma işlemini gerçekleştirebilirsiniz.

## 📈 Kullanım Senaryosu
1.  Sisteme kayıt olun ve giriş yapın.
2.  "YENİ OLUŞTUR" butonuna tıklayarak bir kampanya oluşturun.
3.  Ürün fiyatını ve indirim saatlerini (Dinamik Fiyatlandırma) girin.
4.  Oluşturulan QR kodu indirin ve müşterilerinize sunun.
5.  Müşterileriniz QR kodu okuttuğunda o andaki aktif fiyatı ve kampanya detaylarını şık bir arayüzle görecektir.

---
*Bu proje modern web standartlarına uygun olarak, kullanıcı deneyimi ön planda tutularak geliştirilmiştir.*


