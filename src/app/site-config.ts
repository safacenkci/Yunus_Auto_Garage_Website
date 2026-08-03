// ============================================================
//  SITE KONFİGÜRASYON DOSYASI
//  Gerçek verileri aşağıdaki alanlara girin.
// ============================================================

export const SITE_CONFIG = {
  // ─── İşletme Bilgileri ───────────────────────────────────
  BUSINESS_NAME: 'Yunus Auto Garage',
  PHONE_DIGITS: '5362392968',
  PHONE_DISPLAY: '0536 239 29 68',
  WHATSAPP_DIGITS: '5362392968',

  // ─── Adres ───────────────────────────────────────────────
  STREET_ADDRESS: '8630. Sk., Bahçesaray',
  POSTAL_CODE: '68100',
  CITY: 'Aksaray Merkez',
  REGION: 'Aksaray',
  COUNTRY_CODE: 'TR',

  // ─── Koordinatlar (Google Maps'ten kopyala) ──────────────
  LAT: '38.310633',
  LNG: '33.995505',

  // ─── Harita Embed URL (Google Maps > Paylaş > Yerleştir) ─
  GOOGLE_MAPS_EMBED_URL:
    'https://www.google.com/maps?q=38.310633,33.995505&hl=tr&z=17&output=embed',
  GOOGLE_MAPS_DIRECTIONS_URL:
    'https://www.google.com/maps/dir/?api=1&destination=38.310633,33.995505',

  // ─── Site URL (yayınlanacak domain) ──────────────────────
  SITE_URL: 'https://aksarayotoelektrik.com',

  // ─── Çalışma Saatleri ────────────────────────────────────
  OPENING_HOURS_DISPLAY: '7 gün 24 saat',
  SCHEMA_OPENS: '10:00',
  SCHEMA_CLOSES: '19:00',

  // ─── Sosyal Medya & Profil ────────────────────────────────
  GOOGLE_BUSINESS_PROFILE_URL: 'https://g.page/BURAYA_GBP_LINKI',
  INSTAGRAM_URL: 'https://instagram.com/BURAYA_INSTAGRAM',
  FACEBOOK_URL: 'https://facebook.com/BURAYA_FACEBOOK',

  // ─── Görseller ───────────────────────────────────────────
  LOGO_OR_PHOTO_URL: 'https://aksarayotoelektrik.com/assets/logo.webp',
  HERO_IMAGE_URL: '/assets/header-foto.png',
  HERO_SERVICE_TAGS: ['Özel Servis', 'Oto Elektrik', 'Oto Aksesuar'],
  HERO_LOCATION_HIGHLIGHTS: [
    { icon: 'home_pin', label: 'Yerinde Hizmet', emphasized: true },
    { icon: 'location_on', label: 'Konumunuzda hizmet veriyoruz', emphasized: false },
    { icon: 'handyman', label: 'Self hizmet mevcut', emphasized: false },
    { icon: 'directions_car', label: 'Yerinize geliyoruz', emphasized: false },
  ],
  ABOUT_IMAGE_URL: '/assets/hakkimizda.png',

  // ─── Promosyon ───────────────────────────────────────────
  PROMO_DISCOUNT_PERCENT: 20,

  // ─── Hizmetler ───────────────────────────────────────────
  SERVICES: [
    {
      icon: 'electric_car',
      title: 'Elektronik Arıza',
      description:
        'Bilgisayarlı arıza tespiti, ECU, sensör ve elektrik sistemlerinde uzman çözüm. Modern diagnostik cihazlarla hızlı teşhis.',
    },
    {
      icon: 'ac_unit',
      title: 'Klima Dolumu',
      description:
        'Klima gazı dolumu, kaçak kontrolü ve soğutma performansı optimizasyonu. Yaz-kış konforunuz bizim işimiz.',
    },
    {
      icon: 'format_paint',
      title: 'Oto Tuning',
      description:
        'Kaporta, boya, far parlatma, pasta cila ve oto aksesuar işlemleri. Aracınıza estetik ve performans kazandırıyoruz.',
      tags: ['Oto Kaporta', 'Far Parlatma', 'Boya', 'Pasta Cila', 'Oto Aksesuar'],
    },
  ],

  // Randevu sayfasında gösterilecek hizmetler (ana sayfa + Diğer)
  BOOKING_SERVICES: [
    {
      icon: 'electric_car',
      title: 'Elektronik Arıza',
      description:
        'Bilgisayarlı arıza tespiti, ECU, sensör ve elektrik sistemlerinde uzman çözüm. Modern diagnostik cihazlarla hızlı teşhis.',
    },
    {
      icon: 'ac_unit',
      title: 'Klima Dolumu',
      description:
        'Klima gazı dolumu, kaçak kontrolü ve soğutma performansı optimizasyonu. Yaz-kış konforunuz bizim işimiz.',
    },
    {
      icon: 'format_paint',
      title: 'Oto Tuning',
      description:
        'Kaporta, boya, far parlatma, pasta cila ve oto aksesuar işlemleri. Aracınıza estetik ve performans kazandırıyoruz.',
    },
    {
      icon: 'more_horiz',
      title: 'Diğer',
      description:
        'Listede olmayan bir işlem için talebinizi yazın. Ekibimiz ihtiyacınıza göre size dönüş yapacaktır.',
    },
  ],

  // Randevu 3. adımında hizmet türüne göre checkbox seçenekleri
  BOOKING_SERVICE_OPTIONS: {
    'Elektronik Arıza': [
      'Bilgisayarlı arıza tespiti',
      'ECU / Beyin',
      'Sensör arızası',
      'Marş / Şarj sistemi',
      'Far / Aydınlatma',
      'Diğer elektrik arızası',
    ],
    'Klima Dolumu': [
      'Klima gazı dolumu',
      'Kaçak kontrolü',
      'Klima bakım / temizlik',
      'Polen filtresi',
      'Soğutma performans kontrolü',
    ],
    'Oto Tuning': ['Oto Kaporta', 'Far Parlatma', 'Boya', 'Pasta Cila', 'Oto Aksesuar'],
  } as Record<string, readonly string[]>,

  RETIRED_SERVICE_NAMES: ['Motor Revizyonu', 'Periyodik Bakım', 'Alt Takım & Fren', 'Oto Boya'],

  // ─── Hakkımızda ──────────────────────────────────────────
  ABOUT_HIGHLIGHTS: [
    '20 Yıllık Tecrübe',
    'Garantili İşçilik',
    '%20 İndirim Kampanyası',
  ],

  // ─── SEO Metinleri ───────────────────────────────────────
  META_TITLE: 'Yunus Auto Garage | Aksaray Oto Servis',
  META_DESCRIPTION:
    'Aksaray sanayi sitesinde elektronik arıza, klima dolumu ve oto tuning. İlk randevunuzda %20 indirim. Hemen arayın: 0536 239 29 68.',
} as const;

/** Ana sayfa navbar / footer bölüm linkleri (fragment id = label eşleşmesi). */
export const SITE_NAV_SECTIONS = [
  { id: 'hizmetler', label: 'Hizmetler' },
  { id: 'hakkimizda', label: 'Hakkımızda' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'iletisim', label: 'İletişim' },
] as const;

export const HOME_SECTION_IDS: readonly string[] = SITE_NAV_SECTIONS.map((section) => section.id);
