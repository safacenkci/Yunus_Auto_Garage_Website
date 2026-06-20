// ============================================================
//  SITE KONFİGÜRASYON DOSYASI
//  Gerçek verileri aşağıdaki alanlara girin.
//  Tüm {{PLACEHOLDER}} ifadeleri index.html içinde de mevcuttur.
// ============================================================

export const SITE_CONFIG = {
  // ─── İşletme Bilgileri ───────────────────────────────────
  BUSINESS_NAME: 'Yunus Auto Garage',
  PHONE_DIGITS: '5XXXXXXXXX',        // Başında 0 veya +90 olmadan
  WHATSAPP_DIGITS: '5XXXXXXXXX',     // Başında 0 veya +90 olmadan

  // ─── Adres ───────────────────────────────────────────────
  STREET_ADDRESS: 'Aksaray Sanayi Sitesi, X. Blok No: Y',
  POSTAL_CODE: '68100',
  CITY: 'Aksaray',
  REGION: 'Aksaray',
  COUNTRY_CODE: 'TR',

  // ─── Koordinatlar (Google Maps'ten kopyala) ──────────────
  LAT: '38.3713',
  LNG: '34.0212',

  // ─── Harita Embed URL (Google Maps > Paylaş > Yerleştir) ─
  GOOGLE_MAPS_EMBED_URL:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...BURAYA_GERCEK_EMBED_URL_GIRIN',

  // ─── Site URL (yayınlanacak domain) ──────────────────────
  SITE_URL: 'https://aksarayotoelektrik.com',

  // ─── Çalışma Saatleri ────────────────────────────────────
  OPENING_HOURS_DISPLAY: 'Pzt–Cmt: 08:30–19:00',
  OPENING_HOURS_SUNDAY: 'Pazar: Kapalı',
  SCHEMA_OPENS: '08:30',
  SCHEMA_CLOSES: '19:00',

  // ─── Sosyal Medya & Profil ────────────────────────────────
  GOOGLE_BUSINESS_PROFILE_URL: 'https://g.page/BURAYA_GBP_LINKI',
  INSTAGRAM_URL: 'https://instagram.com/BURAYA_INSTAGRAM',
  FACEBOOK_URL: 'https://facebook.com/BURAYA_FACEBOOK',

  // ─── Görseller ───────────────────────────────────────────
  LOGO_OR_PHOTO_URL: 'https://aksarayotoelektrik.com/assets/logo.webp',

  // ─── Hizmetler ───────────────────────────────────────────
  SERVICES: [
    {
      icon: '🔋',
      title: 'Akü Değişimi ve Şarj',
      description: 'Her marka araç akü testi, değişimi ve şarj hizmeti.',
    },
    {
      icon: '⚙️',
      title: 'Marş & Alternatör Tamiri',
      description: 'Marş motoru ve dinamo arıza tespiti, onarım ve değişimi.',
    },
    {
      icon: '🔍',
      title: 'Arıza Tespiti / OBD Diagnostik',
      description: 'Bilgisayarlı arıza okuma, motor ve elektronik sorun tespiti.',
    },
    {
      icon: '💡',
      title: 'Aydınlatma Sistemleri',
      description: 'Far, sinyal, stop lambası ve iç aydınlatma onarımı.',
    },
    {
      icon: '🔑',
      title: 'Immobilizer & Anahtar/Yazılım',
      description: 'Araç güvenlik sistemi, immobilizer ve anahtar yazılım hizmetleri.',
    },
    {
      icon: '🔌',
      title: 'Araç Kablo Tesisatı',
      description: 'Elektrik tesisatı arızaları, kısa devre tespiti ve onarımı.',
    },
    {
      icon: '❄️',
      title: 'Klima Elektroniği',
      description: 'Klima elektronik arıza tespiti ve kontrol ünitesi onarımı.',
    },
    {
      icon: '🛠️',
      title: 'Diğer Elektronik Aksam',
      description: 'Sensör, ECU ve diğer elektronik birim tamir ve değişimi.',
    },
  ],

  // ─── SEO Metinleri ───────────────────────────────────────
  META_TITLE: 'Yunus Auto Garage — Aksaray Oto Elektrikçi | 68 Sanayi Oto Elektrik',
  META_DESCRIPTION:
    'Aksaray sanayi sitesinde oto elektrikçi. Akü, marş, alternatör, arıza tespiti. Yolda kaldınız mı? Hemen arayın: 05XX XXX XX XX.',
} as const;
