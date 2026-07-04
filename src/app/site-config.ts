// ============================================================
//  SITE KONFİGÜRASYON DOSYASI
//  İşletme bilgileri burada tek merkezden yönetilir.
//  NOT: index.html içindeki meta etiketleri ve JSON-LD şemaları
//  statiktir; buradaki bir bilgiyi değiştirirseniz index.html'i
//  de güncelleyin (telefon, adres, SSS metinleri).
// ============================================================

export const SITE_CONFIG = {
  // ─── İşletme Bilgileri ───────────────────────────────────
  BUSINESS_NAME: 'Yunus Auto Garage',
  PHONE_DIGITS: '5362392968', // Başında 0 veya +90 olmadan
  PHONE_DISPLAY: '0536 239 29 68',
  WHATSAPP_DIGITS: '5362392968', // Başında 0 veya +90 olmadan

  // ─── Adres ───────────────────────────────────────────────
  STREET_ADDRESS: 'Bahçesaray Mah., 8630. Sk. (Sanayi K13), Merkez',
  POSTAL_CODE: '68100',
  CITY: 'Aksaray',
  REGION: 'Aksaray',
  COUNTRY_CODE: 'TR',

  // ─── Harita sorgusu (embed ve yol tarifi bu adresle açılır) ─
  // Hassas koordinat yerine adres sorgusu kullanılıyor; Google
  // Business Profile açıldıktan sonra istenirse işletme adıyla
  // güncellenebilir.
  MAPS_QUERY: 'Bahçesaray, 8630. Sk., 68100 Aksaray Merkez/Aksaray',

  // ─── Koordinatlar (yaklaşık — Google Maps'ten hassasını girin) ─
  LAT: '38.3713',
  LNG: '34.0212',

  // ─── Site URL (yayınlanacak domain) ──────────────────────
  SITE_URL: 'https://yunusautogarage.com',

  // ─── Çalışma Saatleri ────────────────────────────────────
  OPENING_HOURS_DISPLAY: 'Pzt–Cmt: 08:30–19:00',
  OPENING_HOURS_SUNDAY: 'Pazar: Kapalı',
  SCHEMA_OPENS: '08:30',
  SCHEMA_CLOSES: '19:00',

  // ─── Sosyal Medya & Profil (hazır olunca doldurun) ────────
  // Örn: 'https://g.page/r/XXXX', 'https://instagram.com/hesap'
  GOOGLE_BUSINESS_PROFILE_URL: '',
  INSTAGRAM_URL: '',
  FACEBOOK_URL: '',

  // ─── Görseller ───────────────────────────────────────────
  LOGO_OR_PHOTO_URL: 'https://yunusautogarage.com/assets/logo.png',

  // ─── Hizmetler ───────────────────────────────────────────
  SERVICES: [
    {
      icon: '🔋',
      title: 'Akü Değişimi ve Şarj',
      description:
        'Her marka araç için akü testi, akü değişimi, şarj ve yerinde akü takviyesi hizmeti.',
    },
    {
      icon: '⚙️',
      title: 'Marş & Alternatör Tamiri',
      description:
        'Marş motoru ve alternatör (dinamo/şarj dinamosu) arıza tespiti, onarım ve değişimi.',
    },
    {
      icon: '🔍',
      title: 'Arıza Tespiti / OBD Diagnostik',
      description:
        'Bilgisayarlı arıza okuma; motor, ABS, airbag ve elektronik sistem sorunlarının tespiti.',
    },
    {
      icon: '💡',
      title: 'Aydınlatma Sistemleri',
      description: 'Far, sinyal, stop lambası ve iç aydınlatma arızalarının onarımı, far ayarı.',
    },
    {
      icon: '🔑',
      title: 'Immobilizer & Anahtar/Yazılım',
      description: 'Araç güvenlik sistemi, immobilizer ve anahtar yazılım hizmetleri.',
    },
    {
      icon: '🔌',
      title: 'Araç Kablo Tesisatı',
      description: 'Elektrik tesisatı arızaları, kısa devre tespiti, kablo yenileme ve onarımı.',
    },
    {
      icon: '❄️',
      title: 'Klima Elektroniği',
      description: 'Araç kliması elektronik arıza tespiti ve klima kontrol ünitesi onarımı.',
    },
    {
      icon: '🛠️',
      title: 'Diğer Elektronik Aksam',
      description: 'Sensör, beyin (ECU), cam otomatiği ve diğer elektronik birimlerin tamiri.',
    },
  ],

  // ─── Sık Sorulan Sorular ─────────────────────────────────
  // NOT: index.html içindeki FAQPage JSON-LD şeması bu listeyle
  // birebir aynı olmalıdır (Google zengin sonuç şartı).
  FAQ: [
    {
      question: "Aksaray'da oto elektrikçi arıyorum, dükkanınız nerede?",
      answer:
        "Dükkanımız Aksaray oto sanayide, Bahçesaray Mahallesi 8630. Sokak'tadır — sanayide K13 olarak bilinir. Sayfadaki 'Yol Tarifi Al' butonuyla Google Maps üzerinden doğrudan yol tarifi alabilirsiniz.",
    },
    {
      question: 'Aracım yolda kaldı, yerinde müdahale yapıyor musunuz?',
      answer:
        'Evet. Aksaray merkez ve çevresinde yolda kalan araçlara yerinde müdahale ediyoruz. Akü takviyesi, marş ve elektrik arızaları için hemen arayın: 0536 239 29 68.',
    },
    {
      question: 'Hangi marka araçlara bakıyorsunuz?',
      answer:
        'Yerli ve yabancı tüm marka ve model araçlara oto elektrik hizmeti veriyoruz — binek, ticari ve hafif ticari araçlar dahil.',
    },
    {
      question: 'Akü değişimi ne kadar sürer?',
      answer:
        'Akü testi ve değişimi çoğu araçta 15–30 dakika içinde tamamlanır. Aracınıza uygun aküyü aynı gün temin edip takıyoruz.',
    },
    {
      question: 'Bilgisayarlı arıza tespiti (OBD diagnostik) yapıyor musunuz?',
      answer:
        'Evet. Bilgisayarlı OBD diagnostik cihazlarımızla motor, ABS, airbag ve elektronik sistem arızalarını doğru şekilde tespit ediyoruz; gereksiz parça masrafını önlüyoruz.',
    },
    {
      question: 'Çalışma saatleriniz nedir?',
      answer:
        'Pazartesi–Cumartesi 08:30–19:00 arası açığız, Pazar günleri kapalıyız. Acil yol yardım için telefonla her zaman ulaşabilirsiniz.',
    },
  ],

  // ─── SEO Metinleri ───────────────────────────────────────
  META_TITLE: 'Yunus Auto Garage — Aksaray Oto Elektrikçi | 68 Sanayi Oto Elektrik',
  META_DESCRIPTION:
    'Aksaray oto sanayide oto elektrikçi (Sanayi K13). Akü, marş, alternatör, bilgisayarlı arıza tespiti. Yolda kaldınız mı? Hemen arayın: 0536 239 29 68.',
} as const;
