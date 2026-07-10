// ============================================================
//  SITE KONFİGÜRASYON DOSYASI
//  Gerçek verileri aşağıdaki alanlara girin.
// ============================================================

export const SITE_CONFIG = {
  // ─── İşletme Bilgileri ───────────────────────────────────
  BUSINESS_NAME: 'Yunus Auto Garage',
  PHONE_DIGITS: '5320000000',
  PHONE_DISPLAY: '0532 000 00 00',
  PHONE_LANDLINE: '0382 000 00 00',
  WHATSAPP_DIGITS: '5320000000',

  // ─── Adres ───────────────────────────────────────────────
  STREET_ADDRESS: 'Yeni Sanayi Sitesi, 1. Blok No:42',
  POSTAL_CODE: '68100',
  CITY: 'Merkez',
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
  OPENING_HOURS_DISPLAY: 'Pzt - Cmt: 08:30 - 18:30',
  OPENING_HOURS_SUNDAY: 'Pazar: Kapalı',
  SCHEMA_OPENS: '08:30',
  SCHEMA_CLOSES: '18:30',

  // ─── Sosyal Medya & Profil ────────────────────────────────
  GOOGLE_BUSINESS_PROFILE_URL: 'https://g.page/BURAYA_GBP_LINKI',
  INSTAGRAM_URL: 'https://instagram.com/BURAYA_INSTAGRAM',
  FACEBOOK_URL: 'https://facebook.com/BURAYA_FACEBOOK',

  // ─── Görseller ───────────────────────────────────────────
  LOGO_OR_PHOTO_URL: 'https://aksarayotoelektrik.com/assets/logo.webp',
  HERO_IMAGE_URL:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuChWO-48-RaW8Z0jJlf_ZEq4Ww5JPvPtUCYxBHjQwdvqUQr38gZLkhJUvrJa-8a72sPVw_thQK3K54rebPjEBUwpdY-8rGqTV0sGM__YCvbnDer7ItgsiRm6GPsEGgoCe3qMe7EVaZqXw6GMDWZBcEtTAjNuSZm-8gkxwdYxJm3anEQqZhUzZCcUrRz0CZROawYWqXao2QWvkxbj9dU6bS3vVV8MhLEdz18HGGNvBEE9hhMZUZD-RQ8-TQuYKzAzpPKTHNvLS96WJA',
  ABOUT_IMAGE_URL:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1g4-xMa5gEXQw-ypO8yRVyFZAMN34E40QmNp-Kx0e7NzLJHH1YQv2JVVECj7fbfckgMae0r45OzeA602iz3mcsGb6ZskSY_n1RpQReMMZCZiCkpspP3uJN2kW0hms1zGHVHUzMxlsb_yLmln9ybNqO_5T9z9zEJBOExBzXKCd78jh5brV9V_DYKaUnILwWNJvDshxOViDHGXu42tLUdzOeBbf6oStSEFELYBHNA1swXN-84OZ-cH9vIvH1mXBbBNOvJGhfAlM8fg',

  // ─── Hizmetler ───────────────────────────────────────────
  SERVICES: [
    {
      icon: 'build',
      title: 'Motor Revizyonu',
      description:
        'Performans kaybı yaşayan motorlarınızı fabrika ayarlarına döndürüyoruz. Tam kapsamlı analiz ve onarım.',
    },
    {
      icon: 'electric_car',
      title: 'Elektronik Arıza',
      description:
        'Modern araçların karmaşık elektronik sistemlerini bilgisayarlı diagnostik cihazlarla noktasal tespit edip çözüyoruz.',
    },
    {
      icon: 'oil_barrel',
      title: 'Periyodik Bakım',
      description:
        'Yağ değişimi, filtre kontrolü ve genel check-up ile aracınızın ömrünü uzatıyor, güvenliğinizi sağlıyoruz.',
    },
    {
      icon: 'tire_repair',
      title: 'Alt Takım & Fren',
      description:
        'Sürüş güvenliğiniz için kritik olan fren sistemleri ve yürüyen aksam kontrollerini titizlikle gerçekleştiriyoruz.',
    },
  ],

  // ─── Hakkımızda ──────────────────────────────────────────
  ABOUT_HIGHLIGHTS: ['20 Yıllık Tecrübe', 'Garantili İşçilik', 'Şeffaf Fiyatlandırma'],

  // ─── SEO Metinleri ───────────────────────────────────────
  META_TITLE: 'Yunus Auto Garage | Modern Automotive Service',
  META_DESCRIPTION:
    'Aksaray sanayi sitesinde oto elektrikçi. Akü, marş, alternatör, arıza tespiti. Yolda kaldınız mı? Hemen arayın: 05XX XXX XX XX.',
  FOOTER_TAGLINE: 'Modern Mühendislik, Profesyonel Hizmet.',
} as const;
