export interface AdminNavItem {
  label: string;
  route: string;
  icon: string;
  mobileShortLabel?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Genel',
    items: [{ label: 'Panel', route: '/admin/dashboard', icon: 'dashboard', mobileShortLabel: 'Panel' }],
  },
  {
    label: 'Randevular',
    items: [
      { label: 'Randevular', route: '/admin/randevular', icon: 'event', mobileShortLabel: 'Randevu' },
    ],
  },
  {
    label: 'İletişim',
    items: [{ label: 'SMS', route: '/admin/sms', icon: 'sms', mobileShortLabel: 'SMS' }],
  },
  {
    label: 'İçerik',
    items: [
      { label: 'Galeri', route: '/admin/galeri', icon: 'photo_library', mobileShortLabel: 'Galeri' },
    ],
  },
  {
    label: 'Raporlar',
    items: [
      { label: 'Analitik', route: '/admin/analitik', icon: 'monitoring', mobileShortLabel: 'Analitik' },
    ],
  },
  {
    label: 'Ayarlar',
    items: [
      { label: 'Ayarlar', route: '/admin/ayarlar', icon: 'settings', mobileShortLabel: 'Ayar' },
    ],
  },
];

/** Most-used routes for the compact mobile bottom bar. */
export const ADMIN_MOBILE_PRIMARY_ROUTES = [
  '/admin/dashboard',
  '/admin/randevular',
  '/admin/galeri',
] as const;
